import { validateLead, type Lead } from '@/lib/lead';
import { getAttribution, track } from './analytics';

export function initLeadForm(form: HTMLFormElement): void {
  const wrap = form.closest('.lead-form-wrap')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const label = submit.querySelector<HTMLElement>('[data-label]')!;
  const success = wrap.querySelector<HTMLElement>('[data-success]')!;
  const defaultLabel = label.textContent ?? '';

  // Preselección del objetivo desde la URL (?objetivo=renta)
  const pre = new URLSearchParams(location.search).get('objetivo');
  const objSel = form.elements.namedItem('objective');
  if (pre && objSel instanceof HTMLSelectElement && [...objSel.options].some((o) => o.value === pre)) objSel.value = pre;

  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('lead_form_start'); } });

  const showErrors = (errors: Partial<Record<string, string>>) => {
    form.querySelectorAll<HTMLElement>('[data-error]').forEach((el) => {
      const key = el.dataset.error!;
      el.textContent = errors[key] ?? '';
      const input = form.elements.namedItem(key);
      if (input instanceof HTMLElement) input.setAttribute('aria-invalid', String(!!errors[key]));
    });
  };

  const setStatus = (kind: 'error' | 'info' | null, html = '') => {
    status.hidden = !kind;
    status.className = `form-status notice ${kind ? `notice-${kind}` : ''}`;
    status.innerHTML = html;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get('company_website')) return; // campo trampa para bots
    const lead: Partial<Lead> = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      objective: String(fd.get('objective') ?? '') || undefined,
      hasProperties: String(fd.get('hasProperties') ?? '') || undefined,
      capitalRange: String(fd.get('capitalRange') ?? '') || undefined,
      horizon: String(fd.get('horizon') ?? '') || undefined,
      contactPreference: String(fd.get('contactPreference') ?? '') || undefined,
      message: String(fd.get('message') ?? '').trim() || undefined,
      consent: fd.get('consent') === 'on',
      marketingConsent: fd.get('marketingConsent') === 'on',
      source: getAttribution() as Record<string, string>,
      page: location.pathname,
    };
    const errors = validateLead(lead);
    showErrors(errors);
    if (Object.keys(errors).length) {
      setStatus('error', 'Revisa los campos marcados.');
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    label.textContent = 'Enviando…';
    setStatus(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        track('generate_lead', { objective: lead.objective, source: lead.source?.utm_source });
        form.hidden = true;
        success.querySelector('[data-success-name]')!.textContent = lead.name!.split(' ')[0];
        success.hidden = false;
        success.focus();
        return;
      }
      if (data.errors) showErrors(data.errors);
      setStatus(
        'error',
        data.code === 'not_configured'
          ? 'El formulario todavía no está conectado al sistema de contacto de la empresa (configuración pendiente). Tus datos <strong>no</strong> fueron enviados.'
          : 'No pudimos enviar tu solicitud. Inténtalo nuevamente en unos minutos.',
      );
    } catch {
      setStatus('error', 'No hay conexión. Revisa tu internet e inténtalo nuevamente.');
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      label.textContent = defaultLabel;
    }
  });
}
