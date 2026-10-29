# Avance Inmobiliario — sitio web

Sitio de asesoría de inversión inmobiliaria. Lo construí con [Astro](https://astro.build) 5 y TypeScript. Las páginas se generan como HTML estático. Un pequeño servidor Node atiende `/api/lead` para que las credenciales del CRM nunca lleguen al navegador.

> **Antes de publicar** revisa [`docs/CONTENIDO-PENDIENTE.md`](docs/CONTENIDO-PENDIENTE.md). Ahí está lo que falta aportar: logo en archivo, datos de contacto y legales, proyectos reales, equipo y casos.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:4321
npm test           # pruebas del motor financiero del simulador
npm run check      # verificación de tipos
npm run build      # genera dist/ (cliente estático + servidor)
node dist/server/entry.mjs   # sirve el sitio compilado (PORT, HOST)
```

Para probar el formulario sin CRM: `LEAD_DEV_LOG=1 npm run dev`. Los leads se imprimen en la consola del servidor.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Inicio (hero, problema, método, objetivos, oportunidades, pilares, casos, equipo, blog, FAQ, CTA) |
| `/asesoria` | Asesoría estratégica: qué incluye y qué no, primera reunión |
| `/metodo` | Método en 5 etapas |
| `/oportunidades` | Catálogo con filtros y selección para comparar |
| `/oportunidades/[slug]` | Ficha de proyecto (datos confirmados / estimados / supuestos) |
| `/oportunidades/comparar` | Comparador de hasta 3 proyectos |
| `/simulador` | Simulador de inversión con escenarios |
| `/nosotros`, `/casos`, `/blog`, `/blog/[slug]` | Equipo, casos, centro de contenidos |
| `/contacto` | Formulario de diagnóstico y canales |
| `/preguntas-frecuentes`, `/privacidad`, `/terminos` | FAQ (con FAQPage schema) y legales |

## Estructura

```
src/
  config/site.ts        Marca, contacto, agenda, datos legales y comerciales (null = pendiente)
  styles/tokens.css     Sistema de diseño: colores, tipografía, espaciado
  data/                 Proyectos, equipo, casos, FAQ y contenidos de marca
  content/blog/         Artículos en Markdown (colección de contenidos; reemplazable por un CMS)
  lib/finance.ts        Motor de cálculo del simulador (probado en tests/)
  lib/lead.ts           Esquema y validación del lead (compartido cliente/servidor)
  pages/api/lead.ts     Endpoint de leads → LEAD_WEBHOOK_URL
  scripts/              Simulador, filtros/comparador, formulario, analítica
```

## Identidad visual

- El color principal es el naranja del logo oficial entregado (`#F26B2C`, muestreado del archivo; falta confirmar el HEX con el manual).
- El naranja con texto blanco no cumple contraste AA. Por eso los botones llevan texto oscuro sobre el naranja, y los textos naranjas usan una variante más profunda (`#B84A16`).
- Los neutros (tinta `#1F1B18`, piedra) son colores de apoyo, no colores corporativos.
- El logo se carga desde `public/brand/` sin modificarlo. Si falta el archivo, se muestra el nombre en texto.

## Simulador: supuestos

Están documentados en `src/lib/finance.ts` y en la propia página:

- Cuota francesa con tasa mensual = tasa anual / 12. El dividendo se muestra sin seguros.
- La propiedad, el pie y el crédito van en UF. Los flujos van en CLP.
- El valor de la UF del día se obtiene de mindicador.cl, que publica datos del Banco Central. Se indica la fecha y el usuario puede editarlo.
- La rentabilidad bruta y la neta miden el activo como si se comprara al contado. El retorno sobre capital aportado sí incluye el crédito.
- No se proyecta plusvalía.
