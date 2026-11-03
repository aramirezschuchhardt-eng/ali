# Avance Inmobiliario – Sitio web

Plataforma web de **Avance Inmobiliario**: estrategias de inversión, financiamiento y oportunidades inmobiliarias.

> Transformamos oportunidades inmobiliarias en estrategias de inversión.
> Conseguimos la mejor tasa para ti. Nos encargamos de todo.

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build): carga rápida, buen SEO y se publica en cualquier hosting (Netlify, Vercel, GitHub Pages, cPanel, etc.).

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Sitio público: portada, beneficios, estrategia y perfiles, catálogo con filtros, simulador, proceso, formulario, FAQ |
| `admin.html` | Panel del equipo: proyectos, precios, promociones, beneficios, perfiles, leads |
| `assets/js/config.js` | **WhatsApp, CRM, agenda**, datos de contacto, valor UF, clave del panel |
| `assets/js/data.js` | Contenido administrable (proyectos, beneficios, perfiles). Lo genera el panel |
| `assets/css/styles.css` | Diseño. Colores corporativos en `:root` (`--navy`, `--gold`) |
| `assets/img/logo.svg` | **Logo provisorio** – reemplazar por el oficial |
| `robots.txt`, `sitemap.xml` | SEO (ajustar dominio) |

## Antes de publicar (pendientes)

1. **Logo oficial**: reemplazar `assets/img/logo.svg` (y `favicon.svg`) por el logo de Avance Inmobiliario. Se usa sobre fondo azul oscuro: idealmente versión en negativo/blanco.
2. **Colores exactos**: en `assets/css/styles.css`, cambiar `--navy`, `--navy-2`, `--navy-3`, `--gold`, `--gold-2` por los códigos HEX del manual de marca.
3. **Proyectos reales**: los 8 proyectos incluidos son **ejemplos referenciales** (nombres, precios y arriendos ficticios). Reemplazarlos desde el panel.
4. **Fotos**: las imágenes son de Unsplash (uso libre). Para proyectos reales, subir las fotos a `assets/img/` y usar la ruta en el panel.
5. **Configuración** en `assets/js/config.js`: número de WhatsApp, webhook del CRM, link de agenda, correo, redes, valor UF y clave del panel.
6. **Dominio**: reemplazar `www.avanceinmobiliario.cl` en `index.html`, `robots.txt` y `sitemap.xml` si corresponde.
7. **Legal**: revisar los textos de descargo y la política de datos personales con su asesor legal.

## Integraciones

- **WhatsApp**: botón flotante, botones de contacto y de cada proyecto, con mensaje prellenado.
- **CRM**: el formulario envía un JSON (nombre, teléfono, correo, renta, pie, objetivo, proyecto, comentario, UTM y la última simulación) al `crmWebhook`. Funciona directo con *Zapier Webhooks*, *Make*, *n8n* o *Pipedream*, desde donde se crea el contacto/negocio en HubSpot, Pipedrive, Salesforce, Google Sheets, etc. Si no hay webhook configurado (o falla), se abre WhatsApp con los datos del cliente para no perder el lead.
- **Agenda comercial**: botón "Agendar reunión" hacia Calendly / HubSpot Meetings / Google Calendar (`agendaUrl`).
- **Analítica**: el envío del formulario dispara `dataLayer.push({event: "generate_lead"})` para Google Tag Manager / GA4 / Meta Pixel.

## Panel de administración (`/admin.html`)

1. Ingresar con la clave definida en `config.js`.
2. Editar proyectos (crear, editar, duplicar, ordenar, ocultar), beneficios vigentes con sus requisitos, y perfiles.
3. **Publicar → Ver vista previa** para revisar (sólo en su navegador).
4. **Publicar → Descargar data.js** y reemplazar `assets/js/data.js` en el hosting (o subirlo a GitHub si el hosting publica desde el repositorio).

**Seguridad**: la clave del panel es sólo una barrera básica (es visible en el código). El panel no modifica el sitio público por sí mismo: nadie puede alterar la web sin subir el archivo al hosting. Para mayor protección, proteger `/admin.html` con contraseña del hosting (Netlify/Vercel password protection, `.htaccess`). Si más adelante se requiere edición multiusuario en línea, el mismo `data.js` puede migrarse a un CMS headless (Decap CMS, Sanity, Strapi) sin cambiar el diseño.

## Simulador

Sistema francés (cuota fija): `dividendo = C · r / (1 − (1 + r)^−n)`, con `r = tasa anual / 12` y `C = precio × (1 − % pie)`. El bono pie se descuenta del pie que paga el cliente; el resto se divide en las cuotas indicadas. Flujo = arriendo − dividendo − gastos. Rentabilidad bruta = arriendo × 12 / precio. Todos los resultados son referenciales (no incluye seguros de desgravamen/incendio del crédito, gastos operacionales ni CAE).

## Cumplimiento

El sitio **no garantiza** tasas, subsidios, FOGAES, devoluciones de IVA, arriendos ni rentabilidades. Cada beneficio muestra sus requisitos y condiciones, y hay descargos en catálogo, simulador, FAQ y pie de página.

## Probar localmente

Abrir `index.html` en el navegador, o:

```bash
python3 -m http.server 8080
```
