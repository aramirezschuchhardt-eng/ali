/**
 * Motor de cálculo del simulador de inversión.
 *
 * Convenciones (documentadas también en la página /simulador):
 * - Valores de la propiedad, pie y crédito en UF. Flujos mensuales en CLP.
 * - Tasa mensual = tasa anual / 12 (convención habitual en créditos hipotecarios
 *   en Chile para expresar la tasa del dividendo). Cuota francesa (constante en UF).
 * - El dividendo NO incluye seguros (desgravamen, incendio y sismo): se ingresan aparte.
 * - Vacancia: porcentaje del año en que la propiedad no está arrendada.
 * - Administración: porcentaje sobre el arriendo efectivamente cobrado.
 * - No se proyecta plusvalía: no es un resultado asegurado.
 *
 * Este archivo no tiene dependencias para poder probarse con `node --test`.
 */

export interface SimulationInput {
  /** Precio de la propiedad en UF. */
  priceUf: number;
  /** Porcentaje financiado con crédito hipotecario (0–100). El pie es el resto. */
  financingPct: number;
  /** Tasa de interés anual del crédito, en % (p. ej. 4.5). */
  annualRatePct: number;
  /** Plazo del crédito en años. */
  termYears: number;
  /** Valor de la UF en CLP. Necesario para combinar UF y pesos. */
  ufValue: number | null;
  /** Arriendo mensual estimado en CLP. */
  monthlyRentClp: number;
  /** Gastos operacionales mensuales del propietario en CLP (gastos comunes no cubiertos, mantención, contribuciones prorrateadas...). */
  monthlyOpexClp: number;
  /** Seguros asociados al crédito, mensuales en CLP. */
  monthlyInsuranceClp: number;
  /** Vacancia estimada, % del año (0–100). */
  vacancyPct: number;
  /** Administración, % del arriendo cobrado (0–100). */
  adminPct: number;
  /** Otros costos iniciales en CLP (amoblado, habilitación, corretaje...). */
  otherInitialCostsClp: number;
  /** Gastos de adquisición en CLP (notaría, CBR, tasación, estudio de títulos, borradores). */
  acquisitionCostsClp: number;
}

export interface SimulationResult {
  downPaymentUf: number;
  loanUf: number;
  monthlyPaymentUf: number;
  monthlyPaymentClp: number | null;
  effectiveRentClp: number;
  adminClp: number;
  monthlyExpensesClp: number;
  monthlyCashFlowClp: number | null;
  initialCapitalClp: number | null;
  /** Arriendo anual sin descuentos / precio. % anual. */
  grossYieldPct: number | null;
  /** (Arriendo efectivo − gastos operacionales − administración) anual / (precio + gastos de adquisición + otros costos iniciales). Sin financiamiento. */
  netYieldPct: number | null;
  /** Flujo de caja anual / capital inicial aportado. Incluye el efecto del crédito. */
  cashOnCashPct: number | null;
  /** Capital del crédito amortizado durante el primer año, en UF. */
  firstYearPrincipalUf: number;
  /** Total pagado en dividendos durante todo el plazo, en UF. */
  totalPaidUf: number;
  totalInterestUf: number;
}

export interface ValidationIssue {
  field: keyof SimulationInput;
  message: string;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function validate(input: SimulationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const req = (field: keyof SimulationInput, label: string) => {
    if (!isNum(input[field])) issues.push({ field, message: `Ingresa ${label}.` });
  };
  req('priceUf', 'el precio en UF');
  req('financingPct', 'el porcentaje de financiamiento');
  req('annualRatePct', 'la tasa de interés anual');
  req('termYears', 'el plazo del crédito');
  if (issues.length) return issues;

  if (input.priceUf <= 0) issues.push({ field: 'priceUf', message: 'El precio debe ser mayor que cero.' });
  if (input.financingPct < 0 || input.financingPct > 100)
    issues.push({ field: 'financingPct', message: 'El financiamiento debe estar entre 0% y 100%.' });
  if (input.annualRatePct < 0 || input.annualRatePct > 30)
    issues.push({ field: 'annualRatePct', message: 'La tasa debe estar entre 0% y 30% anual.' });
  if (input.financingPct > 0 && (input.termYears < 1 || input.termYears > 40 || !Number.isInteger(input.termYears)))
    issues.push({ field: 'termYears', message: 'El plazo debe ser un número entero entre 1 y 40 años.' });
  if (input.ufValue !== null && (!isNum(input.ufValue) || input.ufValue <= 0))
    issues.push({ field: 'ufValue', message: 'El valor de la UF debe ser mayor que cero.' });
  for (const [field, label] of [
    ['vacancyPct', 'La vacancia'],
    ['adminPct', 'La administración'],
  ] as const) {
    const v = input[field];
    if (v < 0 || v > 100) issues.push({ field, message: `${label} debe estar entre 0% y 100%.` });
  }
  for (const field of [
    'monthlyRentClp',
    'monthlyOpexClp',
    'monthlyInsuranceClp',
    'otherInitialCostsClp',
    'acquisitionCostsClp',
  ] as const) {
    if (input[field] < 0) issues.push({ field, message: 'El valor no puede ser negativo.' });
  }
  return issues;
}

/** Cuota constante de un crédito (sistema francés). Maneja tasa cero. */
export function monthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

/** Capital amortizado en las primeras `k` cuotas. */
export function principalPaid(principal: number, monthlyRate: number, months: number, k: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const n = Math.min(k, months);
  if (monthlyRate === 0) return (principal / months) * n;
  const pmt = monthlyPayment(principal, monthlyRate, months);
  // Saldo tras n cuotas: P(1+r)^n − PMT·((1+r)^n − 1)/r
  const g = Math.pow(1 + monthlyRate, n);
  const balance = principal * g - (pmt * (g - 1)) / monthlyRate;
  return principal - balance;
}

const safeDiv = (a: number, b: number): number | null => (b > 0 && Number.isFinite(a) ? a / b : null);

/** Calcula los resultados. Supone que `validate(input)` no devolvió errores. */
export function simulate(input: SimulationInput): SimulationResult {
  const financing = input.financingPct / 100;
  const loanUf = input.priceUf * financing;
  const downPaymentUf = input.priceUf - loanUf;
  const r = input.annualRatePct / 100 / 12;
  const months = loanUf > 0 ? Math.round(input.termYears * 12) : 0;
  const monthlyPaymentUf = monthlyPayment(loanUf, r, months);
  const uf = input.ufValue;

  const effectiveRentClp = input.monthlyRentClp * (1 - input.vacancyPct / 100);
  const adminClp = effectiveRentClp * (input.adminPct / 100);
  const monthlyExpensesClp = input.monthlyOpexClp + adminClp + input.monthlyInsuranceClp;

  const monthlyPaymentClp = uf ? monthlyPaymentUf * uf : loanUf === 0 ? 0 : null;
  const monthlyCashFlowClp =
    monthlyPaymentClp === null ? null : effectiveRentClp - monthlyExpensesClp - monthlyPaymentClp;

  const priceClp = uf ? input.priceUf * uf : null;
  const initialCapitalClp = uf
    ? downPaymentUf * uf + input.otherInitialCostsClp + input.acquisitionCostsClp
    : null;

  const grossYield = priceClp ? safeDiv(input.monthlyRentClp * 12, priceClp) : null;
  const netOperatingAnnual = (effectiveRentClp - input.monthlyOpexClp - adminClp) * 12;
  const netYield =
    priceClp && input.monthlyRentClp > 0
      ? safeDiv(netOperatingAnnual, priceClp + input.acquisitionCostsClp + input.otherInitialCostsClp)
      : null;
  const cashOnCash =
    monthlyCashFlowClp !== null && initialCapitalClp !== null && input.monthlyRentClp > 0
      ? safeDiv(monthlyCashFlowClp * 12, initialCapitalClp)
      : null;

  const totalPaidUf = monthlyPaymentUf * months;

  return {
    downPaymentUf,
    loanUf,
    monthlyPaymentUf,
    monthlyPaymentClp,
    effectiveRentClp,
    adminClp,
    monthlyExpensesClp,
    monthlyCashFlowClp,
    initialCapitalClp,
    grossYieldPct: grossYield === null ? null : grossYield * 100,
    netYieldPct: netYield === null ? null : netYield * 100,
    cashOnCashPct: cashOnCash === null ? null : cashOnCash * 100,
    firstYearPrincipalUf: principalPaid(loanUf, r, months, 12),
    totalPaidUf,
    totalInterestUf: totalPaidUf - loanUf,
  };
}

export interface ScenarioAdjustments {
  monthlyRentClp: number;
  vacancyPct: number;
  annualRatePct: number;
}

/** Aplica los supuestos editables de un escenario sobre la simulación base. */
export function withScenario(base: SimulationInput, s: ScenarioAdjustments): SimulationInput {
  return { ...base, ...s };
}
