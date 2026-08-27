# Asesoría Inmobiliaria · Alison Schuchhardt

Landing page de una sola página (`index.html`) para vender y agendar la
**Asesoría Inmobiliaria Personalizada de 60 minutos · $40.000 CLP**.

No requiere servidor, framework ni base de datos: es un archivo HTML autocontenido.
Se puede publicar en GitHub Pages, Netlify, Vercel, Hostinger o cualquier hosting.

---

## 1. Qué está configurado

Todo lo editable está en el bloque `const CONFIG = { ... }` al final de `index.html`.

| Parámetro | Estado | Para qué sirve |
|---|---|---|
| `paymentLink` | ✅ `https://mpago.la/2NDqwit` | Link de pago de Mercado Pago |
| `notificaciones.whatsappAlison` | ✅ `56959178358` | Número que recibe el aviso de cada reserva |
| `notificaciones.webhookURL` | ⬜ vacío | Opcional: Zapier / Make / n8n para automatizar |
| `fotoAlison` | ⬜ vacío | Tu foto profesional en el hero |
| `fotoSeccion` | ⬜ vacío | Imagen de la sección "Experiencia" |
| `modularesLink` | ⬜ vacío | Enlace del botón de soluciones modulares |
| `contacto` | ⬜ vacío | Instagram, LinkedIn, WhatsApp y correo del footer |
| `agenda` | ✅ Lun-Vie · 10:00, 11:30, 15:00, 16:30, 18:00 | Disponibilidad |

Mientras un dato esté vacío, la página no inventa nada: muestra la ilustración
por defecto o deja el espacio reservado.

---

## 2. Cómo agregar tu foto

1. Guarda la imagen en la carpeta del proyecto, por ejemplo `img/alison.jpg`.
2. En `index.html` cambia:

```js
fotoAlison: "img/alison.jpg",
```

Recomendación: foto vertical (proporción 4:5), mínimo 1000 × 1250 px, buena luz,
fondo limpio. Si además quieres una imagen en la sección "Experiencia", usa
`fotoSeccion` con una foto horizontal o vertical de trabajo/reunión.

---

## 3. Cómo funciona el flujo

```
Elige día y hora  →  Completa sus datos  →  Pago en Mercado Pago  →  Confirmación
                            │                                            │
                            └── WhatsApp a Alison ────────────────────────┘
```

1. **Paso 1** — Calendario con días y horarios disponibles (respeta 24 h de anticipación).
2. **Paso 2** — Nombre y apellido, teléfono/WhatsApp, correo (obligatorios) y un
   mensaje opcional. Todo se valida antes de continuar.
3. **Al enviar el formulario** se habilita el botón *Enviar mis datos por WhatsApp*,
   que abre tu WhatsApp con el mensaje ya escrito (nombre, fecha, hora, correo,
   teléfono y qué quiere revisar). Tú después chequeas el pago en Mercado Pago.
4. **Paso 3** — Resumen de la reserva y botón **Pagar $40.000**, que abre Mercado
   Pago en una pestaña nueva. La página queda esperando con el botón
   *"Ya realicé el pago"*.
5. **Confirmación** — Muestra nombre, fecha, hora, duración y correo, permite
   descargar la invitación de calendario (.ics) y enviarte el aviso por WhatsApp.

**Importante:** el horario no queda reservado en firme hasta que confirmas el
pago en Mercado Pago. La página lo advierte explícitamente al cliente.

### Retorno automático desde Mercado Pago (opcional)

Si en Mercado Pago configuras la URL de retorno como
`https://TU-DOMINIO.cl/?pago=exito`, al volver el cliente ve la pantalla de
confirmación automáticamente, sin apretar "Ya realicé el pago".

---

## 4. Aviso automático por WhatsApp (sin depender del cliente)

Hoy el aviso por WhatsApp lo envía el cliente con un toque (mensaje ya redactado).
Para que te llegue **solo, siempre**, conecta un webhook:

1. Crea un Zap en [Zapier](https://zapier.com) o un escenario en [Make](https://make.com)
   con el disparador **Webhooks → Catch Hook**.
2. Copia la URL que te entregan y pégala en:

```js
notificaciones: { webhookURL: "https://hooks.zapier.com/hooks/catch/XXXX/YYYY" }
```

3. Encadena las acciones que quieras:
   - **WhatsApp** (Twilio, 360dialog, CallMeBot) → mensaje a +56 9 5917 8358
   - **Gmail** → correo de confirmación al cliente
   - **Google Calendar** → crea el evento e invita al cliente
   - **Google Sheets** → guarda cada reserva para gestión posterior

La página envía un JSON con: `evento`, `nombre`, `fono`, `email`, `msg`,
`fechaISO`, `fechaTexto`, `hora`, `duracion`, `precio`, `pagado`, `creado`.

Los eventos que envía son:

| `evento` | Cuándo |
|---|---|
| `formulario_completado` | Al completar los datos, antes de pagar |
| `reserva_iniciada` | Al apretar "Pagar" |
| `pago_confirmado` | Al confirmar el pago |

---

## 5. Cómo cambiar tu disponibilidad

```js
agenda: {
  diasHabiles: [1,2,3,4,5],                          // 1 = lunes … 7 = domingo
  horarios: ["10:00","11:30","15:00","16:30","18:00"],
  diasVista: 60,                                     // cuánto se puede agendar hacia adelante
  anticipacionHoras: 24,                             // mínimo de anticipación
  fechasBloqueadas: ["2026-09-18","2026-09-19"],     // feriados o días fuera
  horasOcupadas: { "2026-09-02": ["10:00","15:00"] } // horas ya tomadas
}
```

Si más adelante quieres que el calendario se sincronice solo con tu Google
Calendar, la alternativa es reemplazar el paso 1 por un embed de
[Cal.com](https://cal.com) o Calendly con pago integrado.

---

## 6. Publicar

**GitHub Pages:** Settings → Pages → Branch `main` → carpeta `/root`.

**Netlify / Vercel:** arrastra la carpeta o conecta el repositorio; no hay build.

Después de publicar, recuerda actualizar en `index.html` la etiqueta
`<link rel="canonical">` y las `og:url` con tu dominio real.

---

## 7. SEO incluido

- Meta title, description y keywords orientados a asesoría inmobiliaria,
  financiamiento, crédito hipotecario, subsidios e inversión en Chile.
- Open Graph y Twitter Card para que el link se vea bien al compartirlo.
- Datos estructurados `ProfessionalService` + `Offer` ($40.000 CLP) y `FAQPage`
  para que las preguntas frecuentes puedan aparecer en Google.
- HTML semántico, `lang="es-CL"`, contraste accesible y diseño mobile-first.
