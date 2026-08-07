# Bot de admisión — Colegio San Guillermo

Archivos fuente del bot que atiende consultas de apoderados.

| Archivo | Qué contiene | Para qué sirve |
| --- | --- | --- |
| `base-conocimiento.md` | Toda la información del colegio (horarios, talleres, dirección, admisión) | Se carga como contexto del modelo. Es la única fuente de verdad. |
| `base-conocimiento.json` | Los mismos datos en formato estructurado | Para usarlos desde código: validaciones, respuestas fijas, sincronizar con un CRM o sitio web. |
| `system-prompt.md` | Identidad (Andrea), reglas, tono y ejemplos | Se usa como *system prompt* del modelo. |
| `guion-mensajes.md` | Los mensajes concretos: bienvenida, cada opción del menú, derivaciones y cierres | Referencia de voz. Se carga junto al prompt o se usa como guía para el equipo. |
| `flujo.html` → `flujo-bot-admision.pdf` | El flujo conversacional en diagrama | Para revisar y compartir con el colegio. |
| `guion.html` → `guion-mensajes.pdf` | El guion en formato imprimible | Para revisar y compartir con el colegio. |

## Cómo se arma el prompt

```
system  = system-prompt.md + "\n\n" + base-conocimiento.md + "\n\n" + guion-mensajes.md
user    = mensaje del apoderado
```

Los tres archivos van juntos: `system-prompt.md` define **cómo** responder,
`base-conocimiento.md` define **qué** puede responder y `guion-mensajes.md` es la
referencia de **con qué palabras** lo dice.

## Regenerar los PDF

```
chrome --headless --no-pdf-header-footer \
  --print-to-pdf=bot/flujo-bot-admision.pdf file://$PWD/bot/flujo.html
chrome --headless --no-pdf-header-footer \
  --print-to-pdf=bot/guion-mensajes.pdf    file://$PWD/bot/guion.html
```

## Antes de producción

- [ ] Reemplazar `[LINK DE AGENDAMIENTO]` por la URL real. Aparece en los tres
      archivos (`base-conocimiento.md`, `base-conocimiento.json` y los ejemplos
      de `system-prompt.md`).

## Cómo actualizar la información

1. Edita `base-conocimiento.md` **y** `base-conocimiento.json` (deben quedar
   iguales; el `.md` es lo que lee el modelo, el `.json` es para integraciones).
2. Si el dato nuevo cubre algo que hoy está en la lista **"Fuera de alcance"**,
   sácalo de esa lista para que el bot deje de derivarlo.
3. `system-prompt.md` solo se toca si cambian el tono, las reglas o quieres
   sumar variaciones de saludo, agradecimiento o despedida.
