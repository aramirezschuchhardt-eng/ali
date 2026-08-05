# Propuesta — Colegio San Guillermo (proceso de matrículas)

Propuesta comercial para el Colegio San Guillermo (RBD 12076-6, Puente Alto),
enfocada exclusivamente en la optimización del proceso de matrículas mediante
automatización con IA sobre la plataforma CORE AI.

## Archivos

- `Propuesta_Matriculas_Colegio_San_Guillermo.docx` — documento final.
- `generar-propuesta.js` — script que genera el `.docx`.

## Regenerar el documento

```bash
npm install docx
node generar-propuesta.js            # escribe el docx en el directorio actual
SALIDA=/ruta/propuesta.docx node generar-propuesta.js
```

## Logos

El script busca automáticamente dos imágenes (`.png`, `.jpg`, `.gif`, `.bmp`):

- **Colegio San Guillermo** — nombre con `colegio`, `guillermo`, `escudo`,
  `isotipo` o simplemente `logo.png`. Va arriba en la portada, a 250 × 71 px
  (proporción 3,53:1, la del logotipo horizontal del colegio).
- **CORE AI** — nombre con `core` (por ejemplo `logo-core.png`). Va al pie de la
  portada, como emisor, a 215 × 101 px (proporción 2,13:1).

Si los archivos que entregues tienen otra proporción, ajusta los valores en las
llamadas a `logoOMarco(...)` dentro del script para que no se deformen. Cuando
el logo de CORE AI está presente, el nombre y el lema en texto se omiten
automáticamente, porque ya vienen dentro de la imagen.

Directorios donde busca, en orden:

- `/mnt/user-data/uploads`
- `propuestas/san-guillermo/assets/`
- `assets/` y la raíz del repositorio
- el directorio de trabajo actual

El logo que no encuentre queda como un marco punteado con la palabra `LOGO`,
para reemplazar manualmente en Word.

## Contenido

1. Resumen ejecutivo
2. Diagnóstico del proceso de matrículas actual
3. Solución propuesta (asistente WhatsApp, seguimiento pre y post matrícula, CRM CORE AI)
4. Plataformas y tecnologías que se utilizarán
5. Flujo del proceso de matrícula (diagrama)
6. Cronograma de implementación (6 semanas)
7. Inversión (3 paquetes: implementación + mantención mensual)
8. Próximos pasos
