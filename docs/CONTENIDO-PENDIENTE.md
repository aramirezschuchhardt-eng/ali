# Contenido pendiente antes de publicar

El sitio no inventa datos. Todo lo siguiente está preparado en el código pero requiere información real de Avance Inmobiliario. Mientras `showPendingNotes` sea `true` (en `src/config/site.ts`), los vacíos se muestran en pantalla como avisos punteados.

## Marca
- [x] **Logo oficial** incorporado en `public/brand/logo-avance.png` (recortado del archivo entregado, fondo blanco convertido en transparencia, sin redibujar). Si existe un SVG o una versión para fondos oscuros en el manual, reemplazarlo.
- [ ] **HEX oficial del naranja.** Se usó `#F16528`, muestreado del logo entregado. Confirmar con el manual y ajustar en `src/styles/tokens.css`. Luego `brand.paletteIsOfficial = true`.
- [ ] **Tipografías corporativas**, si existen. Hoy: Oswald + Jost (Google Fonts) por similitud con el logo.
- [ ] **Fotografía arquitectónica** propia o licenciada (hero, blog, proyectos). Hoy se usa una ilustración SVG abstracta (`ArchVisual`).
- [ ] Favicon con el isotipo oficial.

## Datos de contacto y legales (`src/config/site.ts`)
- [ ] `contact.email`, `contact.phone`, `contact.whatsapp` (número oficial), `contact.address`.
- [ ] `social`: redes oficiales.
- [ ] `bookingUrl`: herramienta de agenda real (Calendly, Google Calendar, HubSpot Meetings…).
- [ ] `legal.razonSocial`, `legal.rut`, `legal.domicilio`. En un contrato interno figura el RUT 77.048.442-1 asociado a "Avance inmobiliario": confirmar que corresponde a la razón social que se publicará.
- [ ] `commercial.firstMeetingTerms`: si la primera reunión tiene costo o es gratuita.
- [ ] `commercial.feeModel`: cómo se remunera la asesoría.
- [ ] Revisión legal de `/privacidad` y `/terminos` (plazo de conservación, encargados del tratamiento).

## Equipo (`src/data/team.ts`)
- [ ] Por decisión de la empresa no se muestra equipo. La sección reaparece sola al agregar integrantes en `src/data/team.ts`.

## Oportunidades (`src/data/projects.ts`)
- [ ] Reemplazar los 6 proyectos **de demostración** por proyectos reales, con imagen autorizada y cada dato marcado como `confirmed` / `estimate` / `assumption`, con fuente y fecha. Las páginas de demostración están en `noindex`.

## Casos (`src/data/cases.ts`)
- [ ] Solo casos reales autorizados (`authorizedByClient: true`) y resultados documentados con período.

## Integraciones (variables de entorno, ver `.env.example`)
- [ ] `LEAD_WEBHOOK_URL` (+ `LEAD_WEBHOOK_TOKEN`) hacia el CRM. Sin esto el formulario informa que no está conectado y **no** simula un envío.
- [ ] Google Tag Manager / analítica con gestión de consentimiento. Los eventos ya se envían a `window.dataLayer`: `cta_click`, `lead_form_start`, `generate_lead`, `simulator_use`, `filter_projects`, `compare_projects`.
- [ ] `PUBLIC_SITE_URL` con el dominio definitivo.

## Al publicar
- [ ] `showPendingNotes = false`.
