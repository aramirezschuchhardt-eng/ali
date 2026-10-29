const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const num = (d = 0) => new Intl.NumberFormat('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });

export const formatClp = (v: number): string => {
  const r = Math.round(v);
  return r < 0 ? `−${clp.format(-r)}` : clp.format(r);
};
export const formatUf = (v: number, decimals = 0): string => `UF ${num(decimals).format(v)}`;
export const formatPct = (v: number, decimals = 1): string => `${num(decimals).format(v)}%`;
export const formatNumber = (v: number, decimals = 0): string => num(decimals).format(v);
