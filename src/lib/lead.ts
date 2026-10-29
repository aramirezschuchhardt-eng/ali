/** Esquema y validación del lead, compartidos entre el formulario y el endpoint. */

export const objectiveOptions = [
  { value: 'primera-inversion', label: 'Hacer mi primera inversión' },
  { value: 'patrimonio', label: 'Construir patrimonio en el tiempo' },
  { value: 'renta', label: 'Generar ingresos por arriendo' },
  { value: 'optimizacion', label: 'Revisar u optimizar mis propiedades' },
  { value: 'no-se', label: 'Aún no lo tengo claro' },
] as const;

export const propertiesOptions = [
  { value: 'no', label: 'No, sería mi primera' },
  { value: '1', label: 'Sí, una' },
  { value: '2+', label: 'Sí, dos o más' },
] as const;

export const capitalOptions = [
  { value: 'menos-10m', label: 'Menos de $10 millones' },
  { value: '10-20m', label: 'Entre $10 y $20 millones' },
  { value: '20-40m', label: 'Entre $20 y $40 millones' },
  { value: 'mas-40m', label: 'Más de $40 millones' },
  { value: 'no-se', label: 'Prefiero revisarlo en la reunión' },
] as const;

export const horizonOptions = [
  { value: '0-3m', label: 'En los próximos 3 meses' },
  { value: '3-6m', label: 'Entre 3 y 6 meses' },
  { value: '6-12m', label: 'Entre 6 y 12 meses' },
  { value: '12m+', label: 'Más adelante / explorando' },
] as const;

export const contactOptions = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'llamada', label: 'Llamada telefónica' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'videollamada', label: 'Videollamada' },
] as const;

export interface Lead {
  name: string;
  email: string;
  phone: string;
  objective?: string;
  hasProperties?: string;
  capitalRange?: string;
  horizon?: string;
  contactPreference?: string;
  message?: string;
  consent: boolean;
  marketingConsent: boolean;
  source?: Record<string, string>;
  page?: string;
}

const values = (opts: readonly { value: string }[]) => opts.map((o) => o.value);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, '');
}

export type LeadErrors = Partial<Record<keyof Lead, string>>;

export function validateLead(input: Partial<Lead>): LeadErrors {
  const e: LeadErrors = {};
  const name = (input.name ?? '').trim();
  if (name.length < 2 || name.length > 120) e.name = 'Ingresa tu nombre.';
  if (!EMAIL.test((input.email ?? '').trim()) || (input.email ?? '').length > 200) e.email = 'Ingresa un correo válido.';
  const phone = normalizePhone(input.phone ?? '');
  if (phone.replace('+', '').length < 8 || phone.length > 16) e.phone = 'Ingresa un teléfono válido, por ejemplo +56 9 1234 5678.';
  const check = (k: keyof Lead, opts: readonly { value: string }[]) => {
    const v = input[k];
    if (v && !values(opts).includes(String(v))) e[k] = 'Opción no válida.';
  };
  check('objective', objectiveOptions);
  check('hasProperties', propertiesOptions);
  check('capitalRange', capitalOptions);
  check('horizon', horizonOptions);
  check('contactPreference', contactOptions);
  if ((input.message ?? '').length > 1500) e.message = 'El mensaje es demasiado largo.';
  if (!input.consent) e.consent = 'Necesitamos tu autorización para contactarte.';
  return e;
}
