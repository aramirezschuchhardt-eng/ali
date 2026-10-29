import { simulate, validate, withScenario, type SimulationInput, type SimulationResult } from '@/lib/finance';
import { formatClp, formatPct, formatUf } from '@/lib/format';
import { track } from './analytics';

/** Fuente pública del valor diario de la UF (publica los datos del Banco Central de Chile). */
const UF_API = 'https://mindicador.cl/api/uf';

type ScenarioName = 'conservador' | 'optimista';
const SCEN_KEYS = ['monthlyRentClp', 'vacancyPct', 'annualRatePct'] as const;
type ScenKey = (typeof SCEN_KEYS)[number];

const defaultScenario = (base: SimulationInput, name: ScenarioName): Record<ScenKey, number> =>
  name === 'conservador'
    ? {
        monthlyRentClp: Math.round((base.monthlyRentClp * 0.9) / 1000) * 1000,
        vacancyPct: Math.min(100, base.vacancyPct * 2),
        annualRatePct: Math.min(30, +(base.annualRatePct + 1).toFixed(2)),
      }
    : {
        monthlyRentClp: Math.round((base.monthlyRentClp * 1.05) / 1000) * 1000,
        vacancyPct: +(base.vacancyPct / 2).toFixed(2),
        annualRatePct: Math.max(0, +(base.annualRatePct - 0.5).toFixed(2)),
      };

export function initSimulator(root: HTMLElement, scenTable: HTMLTableElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-sim-form]')!;
  const errorsBox = root.querySelector<HTMLElement>('[data-sim-errors]')!;
  const ufStatus = root.querySelector<HTMLElement>('[data-uf-status]')!;
  const el = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  const out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;

  // Prellenado desde una ficha de proyecto: /simulador?precio=2900&arriendo=410000
  const qs = new URLSearchParams(location.search);
  const qPrice = Number(qs.get('precio'));
  const qRent = Number(qs.get('arriendo'));
  if (qPrice > 0) el('priceUf').value = String(qPrice);
  if (qRent > 0) el('monthlyRentClp').value = String(qRent);

  // Escenarios editados por el usuario (si no, se derivan del base)
  const touched = new Set<string>();

  const num = (name: string, optional = false): number => {
    const raw = el(name).value.trim();
    if (raw === '') return optional ? 0 : Number.NaN;
    return Number(raw);
  };

  const readInput = (): SimulationInput => {
    const ufRaw = el('ufValue').value.trim();
    return {
      priceUf: num('priceUf'),
      financingPct: num('financingPct'),
      annualRatePct: num('annualRatePct'),
      termYears: num('termYears', num('financingPct') === 0),
      ufValue: ufRaw === '' ? null : Number(ufRaw),
      monthlyRentClp: num('monthlyRentClp', true),
      monthlyOpexClp: num('monthlyOpexClp', true),
      monthlyInsuranceClp: num('monthlyInsuranceClp', true),
      vacancyPct: num('vacancyPct', true),
      adminPct: num('adminPct', true),
      otherInitialCostsClp: num('otherInitialCostsClp', true),
      acquisitionCostsClp: num('acquisitionCostsClp', true),
    };
  };

  const fmtClpOrDash = (v: number | null) => (v === null ? '—' : formatClp(v));
  const fmtPctOrDash = (v: number | null) => (v === null ? 'Faltan datos' : formatPct(v));

  const renderMain = (input: SimulationInput, r: SimulationResult) => {
    const uf = input.ufValue;
    const withClp = (ufAmount: number) => (uf ? `${formatUf(ufAmount)} · ${formatClp(ufAmount * uf)}` : formatUf(ufAmount));
    out('downPayment').textContent = withClp(r.downPaymentUf);
    out('loan').textContent = withClp(r.loanUf);
    out('monthlyPayment').textContent = r.monthlyPaymentClp === null ? formatUf(r.monthlyPaymentUf, 2) : formatClp(r.monthlyPaymentClp);
    out('monthlyPaymentUf').textContent = r.loanUf > 0 ? `${formatUf(r.monthlyPaymentUf, 2)} al mes, sin seguros` : 'Sin crédito';
    out('effectiveRentClp').textContent = formatClp(r.effectiveRentClp);
    out('monthlyExpensesClp').textContent = formatClp(r.monthlyExpensesClp);
    out('initialCapitalClp').textContent = r.initialCapitalClp === null ? `${formatUf(r.downPaymentUf)} + costos` : formatClp(r.initialCapitalClp);
    out('grossYieldPct').textContent = fmtPctOrDash(r.grossYieldPct);
    out('netYieldPct').textContent = fmtPctOrDash(r.netYieldPct);
    out('cashOnCashPct').textContent = fmtPctOrDash(r.cashOnCashPct);
    out('firstYearPrincipal').textContent = r.loanUf > 0 ? withClp(r.firstYearPrincipalUf) : '—';
    out('totalInterest').textContent = r.loanUf > 0 ? formatUf(r.totalInterestUf) : '—';

    const cf = out('monthlyCashFlowClp');
    cf.textContent = fmtClpOrDash(r.monthlyCashFlowClp);
    cf.classList.toggle('neg', (r.monthlyCashFlowClp ?? 0) < 0);
    cf.classList.toggle('pos', (r.monthlyCashFlowClp ?? 0) > 0);
    out('cashFlowNote').textContent =
      r.monthlyCashFlowClp === null
        ? 'Ingresa el valor de la UF para calcularlo.'
        : r.monthlyCashFlowClp < 0
          ? 'Aporte mensual que tendrías que cubrir.'
          : 'Excedente mensual estimado.';

    const missing: string[] = [];
    if (!input.ufValue) missing.push('el valor de la UF');
    if (!input.monthlyRentClp) missing.push('el arriendo');
    if (!input.acquisitionCostsClp) missing.push('los gastos de adquisición');
    const note = out('netNote');
    note.hidden = missing.length === 0;
    note.textContent = missing.length ? `Para una estimación más completa, agrega ${missing.join(', ')}.` : '';
  };

  const renderScenarios = (base: SimulationInput) => {
    // Base: valores de solo lectura
    SCEN_KEYS.forEach((k) => {
      const cell = scenTable.querySelector<HTMLElement>(`[data-base="${k}"]`)!;
      cell.textContent = k === 'monthlyRentClp' ? formatClp(base[k]) : formatPct(base[k], 2);
    });
    const results: Record<string, SimulationResult | null> = { base: simulate(base) };
    (['conservador', 'optimista'] as ScenarioName[]).forEach((name) => {
      const defaults = defaultScenario(base, name);
      const adj = {} as Record<ScenKey, number>;
      SCEN_KEYS.forEach((k) => {
        const input = scenTable.querySelector<HTMLInputElement>(`[data-scen="${name}"][data-key="${k}"]`)!;
        if (!touched.has(`${name}:${k}`)) input.value = String(defaults[k]);
        const v = input.value.trim() === '' ? Number.NaN : Number(input.value);
        adj[k] = v;
      });
      const s = withScenario(base, adj);
      results[name] = validate(s).length ? null : simulate(s);
    });
    scenTable.querySelectorAll<HTMLElement>('[data-sout]').forEach((cell) => {
      const [name, key] = cell.dataset.sout!.split(':');
      const r = results[name];
      if (!r) { cell.textContent = 'Revisa los datos'; return; }
      const v = r[key as keyof SimulationResult] as number | null;
      cell.textContent = key.endsWith('Pct') ? fmtPctOrDash(v) : fmtClpOrDash(v);
      cell.style.color = key === 'monthlyCashFlowClp' && v !== null ? (v < 0 ? 'var(--error)' : 'var(--success)') : '';
    });
  };

  const showErrors = (issues: { field: string; message: string }[]) => {
    form.querySelectorAll<HTMLElement>('[data-error]').forEach((e) => (e.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
    issues.forEach((i) => {
      const id = i.field === 'financingPct' ? 'financingPct' : i.field;
      const errEl = form.querySelector<HTMLElement>(`[data-error="${id}"]`);
      if (errEl) errEl.textContent = i.message;
      el(id)?.setAttribute('aria-invalid', 'true');
    });
    errorsBox.hidden = issues.length === 0;
    errorsBox.textContent = issues.length ? 'Hay datos por corregir. Los resultados se actualizarán al corregirlos.' : '';
  };

  let tracked = false;
  const recalc = () => {
    const input = readInput();
    const issues = validate(input);
    showErrors(issues);
    root.querySelector('.results')?.classList.toggle('stale', issues.length > 0);
    if (issues.length) return;
    const r = simulate(input);
    renderMain(input, r);
    renderScenarios(input);
  };

  // Pie y financiamiento se mantienen sincronizados (suman 100%).
  const down = el('downPct');
  const fin = el('financingPct');
  down.addEventListener('input', () => { const v = Number(down.value); if (down.value !== '' && v >= 0 && v <= 100) fin.value = String(+(100 - v).toFixed(2)); });
  fin.addEventListener('input', () => { const v = Number(fin.value); if (fin.value !== '' && v >= 0 && v <= 100) down.value = String(+(100 - v).toFixed(2)); });

  form.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).id === 'ufValue') ufStatus.textContent = 'Valor ingresado manualmente.';
    recalc();
  });
  form.addEventListener('change', () => { if (!tracked) { tracked = true; track('simulator_use'); } });
  form.addEventListener('reset', () => { touched.clear(); setTimeout(() => { if (ufOfficial) el('ufValue').value = String(ufOfficial); recalc(); }); });
  scenTable.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.scen) touched.add(`${t.dataset.scen}:${t.dataset.key}`);
    recalc();
  });

  let ufOfficial: number | null = null;
  recalc();
  fetch(UF_API, { signal: AbortSignal.timeout(6000) })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data: { serie?: { fecha: string; valor: number }[] }) => {
      const last = data.serie?.[0];
      if (!last || !(last.valor > 0)) throw new Error('sin datos');
      ufOfficial = last.valor;
      if (el('ufValue').value === '') el('ufValue').value = String(last.valor);
      const date = new Date(last.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Santiago' });
      ufStatus.innerHTML = `Valor UF del ${date}. Fuente: <a href="https://mindicador.cl" target="_blank" rel="noopener">mindicador.cl</a> (datos del Banco Central de Chile). Puedes editarlo.`;
      recalc();
    })
    .catch(() => {
      ufStatus.innerHTML = 'No pudimos obtener el valor del día. Ingrésalo manualmente según el <a href="https://si3.bcentral.cl/indicadoressiete/secure/indicadoresdiarios.aspx" target="_blank" rel="noopener">Banco Central de Chile</a> o el <a href="https://www.sii.cl/valores_y_fechas/uf/uf2026.htm" target="_blank" rel="noopener">SII</a>.';
    });
}
