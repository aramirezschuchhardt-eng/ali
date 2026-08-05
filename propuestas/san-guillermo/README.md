# Propuesta — Colegio San Guillermo (proceso de matrículas)

Propuesta comercial para el Colegio San Guillermo (RBD 12076-6, Puente Alto),
enfocada exclusivamente en la optimización del proceso de matrículas mediante
automatización con IA sobre GoHighLevel.

## Archivos

- `Propuesta_Matriculas_Colegio_San_Guillermo.docx` — documento final.
- `generar-propuesta.js` — script que genera el `.docx`.

## Regenerar el documento

```bash
npm install docx
node generar-propuesta.js            # escribe el docx en el directorio actual
SALIDA=/ruta/propuesta.docx node generar-propuesta.js
```

## Logo del colegio

El script busca automáticamente un archivo de imagen (`.png`, `.jpg`, `.gif`,
`.bmp`) cuyo nombre contenga `logo`, `guillermo`, `isotipo` o `escudo` en:

- `/mnt/user-data/uploads`
- `/mnt/user-data/outputs`
- el directorio del repositorio y `assets/`
- el directorio de trabajo actual

Si lo encuentra, lo incrusta en la portada (150 × 150 px). Si no, deja un marco
punteado con la palabra `LOGO` para reemplazar manualmente en Word.

## Contenido

1. Resumen ejecutivo
2. Diagnóstico del proceso de matrículas actual
3. Solución propuesta (asistente WhatsApp, seguimiento pre y post matrícula, CRM)
4. Plataformas y tecnologías que se utilizarán
5. Flujo del proceso de matrícula (diagrama)
6. Cronograma de implementación (6 semanas)
7. Inversión (3 paquetes: implementación + mantención mensual)
8. Próximos pasos
