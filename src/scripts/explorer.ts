/** Filtros y selección para comparar oportunidades (máximo 3). */
import { track } from './analytics';

export const COMPARE_KEY = 'ai_compare';
export const COMPARE_MAX = 3;

export function readCompare(): string[] {
  try { return JSON.parse(sessionStorage.getItem(COMPARE_KEY) ?? '[]'); } catch { return []; }
}
function writeCompare(list: string[]) {
  try { sessionStorage.setItem(COMPARE_KEY, JSON.stringify(list)); } catch { /* sin almacenamiento */ }
}

export function initExplorer(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-filters]');
  const cards = [...root.querySelectorAll<HTMLElement>('[data-project]')];
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');

  const apply = () => {
    if (!form) return;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    let visible = 0;
    for (const c of cards) {
      const d = c.dataset;
      const price = Number(d.price);
      const ok =
        (!f.comuna || d.comuna === f.comuna) &&
        (!f.price || (d.price !== '' && price <= Number(f.price))) &&
        (!f.typology || (d.typologies ?? '').split('|').includes(f.typology)) &&
        (!f.stage || d.stage === f.stage) &&
        (!f.year || d.year === f.year) &&
        (!f.goal || (d.goals ?? '').split('|').includes(f.goal));
      c.hidden = !ok;
      if (ok) visible++;
    }
    if (count) count.textContent = `${visible} ${visible === 1 ? 'oportunidad' : 'oportunidades'}`;
    if (empty) empty.hidden = visible > 0;
  };
  form?.addEventListener('change', () => { apply(); track('filter_projects'); });
  form?.addEventListener('reset', () => setTimeout(apply));
  // Permite llegar con filtros desde enlaces: /oportunidades?goal=renta
  if (form) {
    const params = new URLSearchParams(location.search);
    params.forEach((v, k) => { const el = form.elements.namedItem(k); if (el instanceof HTMLSelectElement) el.value = v; });
    apply();
  }

  // --- Comparador ---
  const tray = root.querySelector<HTMLElement>('[data-tray]');
  const trayCount = root.querySelector<HTMLElement>('[data-tray-count]');
  const trayMsg = root.querySelector<HTMLElement>('[data-tray-msg]');
  const go = root.querySelector<HTMLAnchorElement>('[data-tray-go]');
  const boxes = [...root.querySelectorAll<HTMLInputElement>('[data-compare]')];
  let selected = readCompare().filter((s) => boxes.some((b) => b.value === s));

  const render = () => {
    boxes.forEach((b) => { b.checked = selected.includes(b.value); });
    if (tray) tray.hidden = selected.length === 0;
    if (trayCount) trayCount.textContent = String(selected.length);
    if (go) {
      const ready = selected.length >= 2;
      go.setAttribute('aria-disabled', String(!ready));
      go.href = `/oportunidades/comparar?p=${selected.join(',')}`;
    }
    if (trayMsg) trayMsg.textContent = selected.length < 2 ? '· elige al menos 2' : '';
    writeCompare(selected);
  };
  boxes.forEach((b) =>
    b.addEventListener('change', () => {
      if (b.checked) {
        if (selected.length >= COMPARE_MAX) {
          b.checked = false;
          if (trayMsg) trayMsg.textContent = '· máximo 3 proyectos';
          return;
        }
        selected.push(b.value);
      } else selected = selected.filter((s) => s !== b.value);
      render();
    }),
  );
  go?.addEventListener('click', (e) => { if (selected.length < 2) e.preventDefault(); else track('compare_projects', { projects: selected }); });
  root.querySelector('[data-tray-clear]')?.addEventListener('click', () => { selected = []; render(); });
  render();
}
