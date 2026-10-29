/**
 * Capa mínima de analítica y atribución.
 *
 * - `track` envía eventos a `window.dataLayer` (Google Tag Manager) si existe.
 *   No se carga ninguna herramienta de terceros por defecto: se configura en GTM
 *   respetando el consentimiento del usuario.
 * - `initAttribution` guarda en sessionStorage los parámetros UTM y la página de
 *   entrada para adjuntarlos al lead (fuente y campaña).
 */

declare global {
  interface Window { dataLayer?: Record<string, unknown>[]; }
}

const KEY = 'ai_attribution';
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;

export type Attribution = Partial<Record<(typeof UTM)[number] | 'landing_page' | 'referrer', string>>;

export function track(event: string, data: Record<string, unknown> = {}): void {
  window.dataLayer?.push({ event, ...data });
}

export function initAttribution(): void {
  try {
    const params = new URLSearchParams(location.search);
    const stored: Attribution = JSON.parse(sessionStorage.getItem(KEY) ?? '{}');
    const fresh: Attribution = {};
    UTM.forEach((k) => { const v = params.get(k); if (v) fresh[k] = v.slice(0, 200); });
    if (!stored.landing_page) {
      fresh.landing_page = location.pathname;
      if (document.referrer && !document.referrer.startsWith(location.origin)) fresh.referrer = document.referrer.slice(0, 300);
    }
    if (Object.keys(fresh).length) sessionStorage.setItem(KEY, JSON.stringify({ ...stored, ...fresh }));
  } catch {
    /* almacenamiento no disponible: se omite la atribución */
  }
}

export function getAttribution(): Attribution {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
}
