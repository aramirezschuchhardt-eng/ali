import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPayment, principalPaid, simulate, validate, type SimulationInput } from '../src/lib/finance.ts';

const base: SimulationInput = {
  priceUf: 3000,
  financingPct: 80,
  annualRatePct: 4.8,
  termYears: 25,
  ufValue: 40000,
  monthlyRentClp: 450000,
  monthlyOpexClp: 30000,
  monthlyInsuranceClp: 15000,
  vacancyPct: 5,
  adminPct: 8,
  otherInitialCostsClp: 2000000,
  acquisitionCostsClp: 1500000,
};

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('cuota francesa coincide con la fórmula de referencia', () => {
  // 2400 UF, 0,4% mensual, 300 cuotas → 13,7518... UF (cálculo de referencia)
  const pmt = monthlyPayment(2400, 0.004, 300);
  close(pmt, (2400 * 0.004) / (1 - Math.pow(1.004, -300)));
  assert.ok(pmt > 13.7 && pmt < 13.8);
});

test('tasa cero reparte el capital en partes iguales', () => {
  close(monthlyPayment(1200, 0, 120), 10);
  close(principalPaid(1200, 0, 120, 12), 120);
});

test('capital amortizado al final del plazo es el total del crédito', () => {
  close(principalPaid(2400, 0.004, 300, 300), 2400, 1e-6);
});

test('simulación base', () => {
  const r = simulate(base);
  close(r.downPaymentUf, 600);
  close(r.loanUf, 2400);
  close(r.effectiveRentClp, 427500);
  close(r.adminClp, 34200);
  close(r.monthlyExpensesClp, 30000 + 34200 + 15000);
  assert.ok(r.monthlyPaymentClp !== null);
  close(r.monthlyCashFlowClp!, 427500 - 79200 - r.monthlyPaymentClp!);
  close(r.initialCapitalClp!, 600 * 40000 + 3500000);
  close(r.grossYieldPct!, ((450000 * 12) / (3000 * 40000)) * 100);
  close(r.netYieldPct!, (((427500 - 30000 - 34200) * 12) / (3000 * 40000 + 3500000)) * 100);
  close(r.cashOnCashPct!, ((r.monthlyCashFlowClp! * 12) / r.initialCapitalClp!) * 100);
  close(r.totalInterestUf, r.totalPaidUf - 2400);
});

test('sin valor UF no se mezclan UF y pesos', () => {
  const r = simulate({ ...base, ufValue: null });
  assert.equal(r.monthlyPaymentClp, null);
  assert.equal(r.monthlyCashFlowClp, null);
  assert.equal(r.grossYieldPct, null);
  assert.equal(r.cashOnCashPct, null);
});

test('compra al contado: sin crédito ni dividendo', () => {
  const r = simulate({ ...base, financingPct: 0, termYears: 0 });
  close(r.loanUf, 0);
  close(r.monthlyPaymentUf, 0);
  close(r.downPaymentUf, 3000);
  assert.deepEqual(validate({ ...base, financingPct: 0, termYears: 0 }), []);
});

test('sin arriendo no se informan rentabilidades', () => {
  const r = simulate({ ...base, monthlyRentClp: 0 });
  assert.equal(r.netYieldPct, null);
  assert.equal(r.cashOnCashPct, null);
  close(r.grossYieldPct!, 0);
});

test('validación de datos inválidos', () => {
  assert.ok(validate({ ...base, annualRatePct: -1 }).some((i) => i.field === 'annualRatePct'));
  assert.ok(validate({ ...base, annualRatePct: Number.NaN }).some((i) => i.field === 'annualRatePct'));
  assert.ok(validate({ ...base, priceUf: 0 }).some((i) => i.field === 'priceUf'));
  assert.ok(validate({ ...base, financingPct: 120 }).some((i) => i.field === 'financingPct'));
  assert.ok(validate({ ...base, termYears: 0 }).some((i) => i.field === 'termYears'));
  assert.ok(validate({ ...base, vacancyPct: 101 }).some((i) => i.field === 'vacancyPct'));
  assert.ok(validate({ ...base, ufValue: 0 }).some((i) => i.field === 'ufValue'));
  assert.deepEqual(validate(base), []);
});
