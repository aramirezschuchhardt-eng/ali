/**
 * Endpoint de captación de leads (se ejecuta en el servidor).
 *
 * Reenvía el lead validado a LEAD_WEBHOOK_URL (CRM, Zapier, Make, n8n...).
 * Las credenciales viven solo en variables de entorno del servidor.
 * Si no hay integración configurada responde 503 y el formulario lo informa
 * honestamente: nunca se simula un envío exitoso.
 */
import type { APIRoute } from 'astro';
import { normalizePhone, validateLead, type Lead } from '@/lib/lead';

export const prerender = false;

const MAX_BODY = 10_000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress ?? 'unknown')) return json(429, { ok: false, code: 'rate_limited' });
  const text = await request.text();
  if (text.length > MAX_BODY) return json(413, { ok: false, code: 'too_large' });

  let input: Partial<Lead>;
  try { input = JSON.parse(text); } catch { return json(400, { ok: false, code: 'bad_json' }); }

  const errors = validateLead(input);
  if (Object.keys(errors).length) return json(422, { ok: false, code: 'invalid', errors });

  const source = Object.fromEntries(
    Object.entries(input.source ?? {}).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 300)]),
  );
  const lead = {
    name: input.name!.trim(),
    email: input.email!.trim().toLowerCase(),
    phone: normalizePhone(input.phone!),
    objective: input.objective ?? null,
    hasProperties: input.hasProperties ?? null,
    capitalRange: input.capitalRange ?? null,
    horizon: input.horizon ?? null,
    contactPreference: input.contactPreference ?? null,
    message: input.message?.slice(0, 1500) ?? null,
    consent: { dataProcessing: true, marketing: !!input.marketingConsent, at: new Date().toISOString(), policyVersion: '2026-10-29' },
    source: { ...source, page: String(input.page ?? '').slice(0, 200) },
    createdAt: new Date().toISOString(),
  };

  const webhook = import.meta.env.LEAD_WEBHOOK_URL ?? process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    if ((import.meta.env.LEAD_DEV_LOG ?? process.env.LEAD_DEV_LOG) === '1') {
      console.info('[lead:dev]', JSON.stringify(lead));
      return json(200, { ok: true, delivered: 'dev-log' });
    }
    return json(503, { ok: false, code: 'not_configured' });
  }

  const token = import.meta.env.LEAD_WEBHOOK_TOKEN ?? process.env.LEAD_WEBHOOK_TOKEN;
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return json(200, { ok: true });
  } catch (err) {
    console.error('[lead] error al reenviar', err);
    return json(502, { ok: false, code: 'delivery_failed' });
  }
};

export const ALL: APIRoute = () => json(405, { ok: false, code: 'method_not_allowed' });
