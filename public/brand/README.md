# Archivos oficiales de marca

Coloca aquí los archivos originales del logo de Avance Inmobiliario (no redibujar ni recolorear):

| Archivo | Uso |
|---|---|
| `logo-avance.png` (o `.svg`) | Logo para fondos claros. **Recortado al contenido** (sin el margen blanco del archivo original), idealmente con fondo transparente. |
| `logo-avance-negativo.png` (opcional) | Versión para fondos oscuros, si existe en el manual. |

Luego ajusta en `src/config/site.ts`:

- `brand.logo` / `brand.logoOnDark`: rutas de los archivos.
- `brand.logoWidth` / `brand.logoHeight`: dimensiones en píxeles del archivo (para la proporción).
- `brand.logoTransparent`: `true` si el PNG/SVG tiene fondo transparente. Con `false`, en fondos oscuros el logo se muestra sobre una placa blanca para respetar su área de protección.

Mientras el archivo no exista, el sitio muestra el nombre "Avance Inmobiliario" en texto.
El favicon (`/public/favicon.svg`) es provisional: reemplazar por el isotipo oficial si existe.
