# Asesoría Inmobiliaria · Alison Ramírez Schuchhardt

Landing page de una sola página (`index.html`) para vender y agendar la
**Asesoría Inmobiliaria Personalizada de 60 minutos · $39.990 CLP**.

La sección de soluciones modulares muestra además el valor de referencia
**desde $10.000.000**.

No requiere servidor, framework ni base de datos: es un archivo HTML autocontenido.
Se puede publicar en GitHub Pages, Netlify, Vercel, Hostinger o cualquier hosting.

---

## 1. Qué está configurado

Todo lo editable está en el bloque `const CONFIG = { ... }` al final de `index.html`.

| Parámetro | Estado | Para qué sirve |
|---|---|---|
| `paymentLink` | ✅ `https://mpago.la/2NDqwit` | Link de pago de Mercado Pago |
| `notificaciones.whatsappAlison` | ✅ `56959178358` | Número que recibe el aviso de cada reserva |
| `notificaciones.emailAlison` | ✅ `alison@avanceinmobiliario.cl` | Correo que recibe el aviso automático (requiere activar una vez) |
| `notificaciones.webhookURL` | ⬜ vacío | Opcional: Zapier / Make / n8n para automatizar |
| `fotoAlison` | 🔸 `img/alison.jpg` | Tu foto en el hero — falta subir el archivo |
| `fotoSeccion` | ⬜ vacío | Imagen de la sección "Experiencia" |
| `modularesLink` | ⬜ vacío | Enlace del botón de soluciones modulares |
| `contacto.instagram` | ✅ `ali.ramirez.sch` | Instagram del footer |
| `contacto.email` | ✅ `alison@avanceinmobiliario.cl` | Correo del footer |
| `contacto.linkedin` / `contacto.whatsapp` | ⬜ vacío | Espacio reservado en el footer |
| `agenda` | ✅ Lun-Vie · 10:00, 11:30, 15:00, 16:30, 18:00 | Disponibilidad |

Mientras un dato esté vacío, la página no inventa nada: muestra la ilustración
por defecto o deja el espacio reservado.

---

## 2. Cómo agregar tu foto

Ya está todo configurado. **Solo falta subir el archivo** con este nombre exacto:

```
img/alison.jpg
```

En GitHub: entra a la carpeta `img`, botón *Add file → Upload files*, arrastra tu
foto renombrada como `alison.jpg` y confirma. Aparece sola en el hero.

Mientras el archivo no exista, la página muestra la ilustración editorial por
defecto — nunca se ve una imagen rota ni un hueco.

Recomendación: foto vertical (proporción 4:5 o 2:3), mínimo 1000 × 1250 px. El
encuadre muestra desde la cabeza hacia abajo, así que una foto de cuerpo entero
también funciona. Si además quieres una imagen en la sección "Experiencia",
súbela como `img/alison-experiencia.jpg` y ponla en `fotoSeccion`.

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
4. **Paso 3** — Resumen de la reserva y botón **Pagar $39.990**, que abre Mercado
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

## 4. Aviso por correo — activación obligatoria (una sola vez)

Cada vez que alguien complete el formulario llega un correo a
**alison@avanceinmobiliario.cl** con nombre, teléfono, correo, fecha, hora y qué
quiere revisar. Llega un segundo correo cuando confirma el pago.

El envío usa [FormSubmit](https://formsubmit.co), que **exige una activación
inicial**:

1. Publica la página y haz tú misma una reserva de prueba hasta el paso 3.
2. Te llegará un correo de FormSubmit con un botón de activación. Haz clic.
3. Desde ese momento todos los avisos llegan solos.

**Sin ese clic no llega ningún correo.** Es el único paso manual.

> Opcional, contra el spam: después de activar, FormSubmit te entrega un endpoint
> con un token aleatorio. Si lo pegas en `notificaciones.emailEndpoint`, tu correo
> deja de aparecer escrito en el código de la página.

---

## 5. Aviso automático por WhatsApp (sin depender del cliente)

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
| `formulario_completado` | Al completar los datos, antes de pagar (también dispara el correo) |
| `reserva_iniciada` | Al apretar "Pagar" |
| `pago_confirmado` | Al confirmar el pago |

---

## 6. Cómo cambiar tu disponibilidad

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

## 7. Publicar

**GitHub Pages:** Settings → Pages → Branch `main` → carpeta `/root`.

**Netlify / Vercel:** arrastra la carpeta o conecta el repositorio; no hay build.

Después de publicar, recuerda actualizar en `index.html` la etiqueta
`<link rel="canonical">` y las `og:url` con tu dominio real.

---

## 8. SEO incluido

- Meta title, description y keywords orientados a asesoría inmobiliaria,
  financiamiento, crédito hipotecario, subsidios e inversión en Chile.
- Open Graph y Twitter Card para que el link se vea bien al compartirlo.
- Datos estructurados `ProfessionalService` + `Offer` ($39.990 CLP) y `FAQPage`
  para que las preguntas frecuentes puedan aparecer en Google.
- HTML semántico, `lang="es-CL"`, contraste accesible y diseño mobile-first.
