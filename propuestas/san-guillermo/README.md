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
  `isotipo` o simplemente `logo.png`. Se incrusta arriba en la portada (130 px).
- **CORE AI** — nombre con `core` (por ejemplo `logo-core.png`). Se incrusta al
  pie de la portada, como emisor de la propuesta (80 px).

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
