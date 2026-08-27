/**
 * Agenda de la Asesoría Inmobiliaria — Alison Ramírez Schuchhardt
 * ---------------------------------------------------------------
 * Conecta la landing con tu Google Calendar:
 *
 *   • Entrega a la página tus horas realmente libres (lee tu calendario).
 *   • Al completar el formulario deja la hora en espera ("POR PAGAR").
 *   • Al confirmar el pago crea el evento definitivo e invita al cliente.
 *   • Si nadie paga, la hora en espera se libera sola.
 *   • Guarda cada reserva en una planilla (opcional).
 *
 * Instalación paso a paso en README.md, sección 6.
 */

/* ============================ CONFIGURACIÓN ============================ */

const CALENDARIO_ID   = "primary";                        // "primary" = tu calendario principal
const EMAIL_ALISON    = "alison@avanceinmobiliario.cl";
const HOJA_ID         = "";                               // opcional: ID de una planilla de Google

const HORARIOS        = ["10:00", "11:30", "15:00", "16:30", "18:00"];  // igual que en index.html
const DIAS_HABILES    = [1, 2, 3, 4, 5];                  // 1 = lunes … 7 = domingo
const DURACION_MIN    = 60;
const DIAS_VISTA      = 60;                               // cuánto se puede agendar hacia adelante
const ANTICIPACION_H  = 24;                               // mínimo de anticipación
const MINUTOS_ESPERA  = 120;                              // cuánto dura la hora en espera sin pago

const PREFIJO_ESPERA  = "⏳ POR PAGAR · ";
const PREFIJO_OK      = "Asesoría Inmobiliaria · ";
const VALOR           = "$39.990 CLP";

/* ============================== ENTRADAS ============================== */

function doGet(e) {
  const accion = (e && e.parameter && e.parameter.accion) || "disponibilidad";
  if (accion === "disponibilidad") return json(disponibilidad());
  return json({ error: "Acción desconocida: " + accion });
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);

    if (b.evento === "formulario_completado") {
      dejarEnEspera(b);
      avisarAlison(b, false);
      return json({ ok: true, estado: "en_espera" });
    }

    if (b.evento === "pago_confirmado") {
      const ev = confirmarReserva(b);
      avisarAlison(b, true);
      avisarCliente(b);
      guardarEnPlanilla(b);
      return json({ ok: true, estado: "confirmada", evento: ev });
    }

    return json({ ok: true, estado: "ignorado" });   // reserva_iniciada
  } catch (err) {
    return json({ error: String(err) });
  }
}

/* ============================ DISPONIBILIDAD ========================== */

function disponibilidad() {
  const cal    = calendario();
  const ahora  = new Date();
  const desde  = new Date(ahora.getTime() + ANTICIPACION_H * 3600 * 1000);
  const hasta  = new Date(ahora.getTime() + DIAS_VISTA * 24 * 3600 * 1000);

  // Todo lo que ya tienes en el calendario cuenta como ocupado
  const ocupados = cal.getEvents(ahora, hasta)
    .filter(function (ev) { return !ev.isAllDayEvent(); })
    .map(function (ev) { return [ev.getStartTime().getTime(), ev.getEndTime().getTime()]; });

  const salida = {};
  const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  while (d <= hasta) {
    const dow = d.getDay() === 0 ? 7 : d.getDay();
    if (DIAS_HABILES.indexOf(dow) !== -1) {
      const libres = [];
      HORARIOS.forEach(function (h) {
        const ini = enFecha(d, h);
        const fin = new Date(ini.getTime() + DURACION_MIN * 60000);
        if (ini < desde) return;
        const choca = ocupados.some(function (o) {
          return ini.getTime() < o[1] && fin.getTime() > o[0];
        });
        if (!choca) libres.push(h);
      });
      if (libres.length) salida[iso(d)] = libres;
    }
    d.setDate(d.getDate() + 1);
  }
  return salida;
}

/* ============================== RESERVAS ============================== */

function dejarEnEspera(b) {
  const cal = calendario();
  const ini = desdeReserva(b);
  const fin = new Date(ini.getTime() + DURACION_MIN * 60000);

  if (hayChoque(cal, ini, fin)) return null;   // alguien tomó la hora antes

  const ev = cal.createEvent(PREFIJO_ESPERA + b.nombre, ini, fin, {
    description: detalle(b, "Pago pendiente de confirmación.")
  });
  ev.setTag("estado", "espera");
  ev.setTag("email", b.email || "");
  ev.setTag("creado", String(Date.now()));
  return ev.getId();
}

function confirmarReserva(b) {
  const cal = calendario();
  const ini = desdeReserva(b);
  const fin = new Date(ini.getTime() + DURACION_MIN * 60000);

  // ¿Existe ya la hora en espera de este cliente? La convertimos en definitiva.
  const previo = cal.getEvents(ini, fin).filter(function (ev) {
    return ev.getTag("estado") === "espera" && ev.getTag("email") === (b.email || "");
  })[0];

  const ev = previo || cal.createEvent(PREFIJO_OK + b.nombre, ini, fin);
  ev.setTitle(PREFIJO_OK + b.nombre);
  ev.setDescription(detalle(b, "Pago declarado por el cliente. Verificar en Mercado Pago."));
  ev.setTag("estado", "confirmada");
  ev.setTag("email", b.email || "");

  if (b.email) {
    try { ev.addGuest(b.email); } catch (err) {}
  }
  return ev.getId();
}

/**
 * Libera las horas que quedaron en espera y nunca se pagaron.
 * Se ejecuta sola cada hora (ver instalarDisparadores).
 */
function limpiarReservasVencidas() {
  const cal   = calendario();
  const ahora = Date.now();
  const desde = new Date(ahora - 24 * 3600 * 1000);
  const hasta = new Date(ahora + DIAS_VISTA * 24 * 3600 * 1000);

  cal.getEvents(desde, hasta).forEach(function (ev) {
    if (ev.getTag("estado") !== "espera") return;
    const creado = Number(ev.getTag("creado") || 0);
    if (creado && ahora - creado > MINUTOS_ESPERA * 60000) ev.deleteEvent();
  });
}

/* =============================== AVISOS =============================== */

function avisarAlison(b, pagado) {
  const asunto = (pagado ? "✅ Pago confirmado · " : "🗓️ Nueva reserva · ")
    + b.nombre + " · " + b.fechaTexto + " " + b.hora + " hrs";

  MailApp.sendEmail({
    to: EMAIL_ALISON,
    subject: asunto,
    htmlBody:
      "<h2>" + (pagado ? "Pago confirmado" : "Formulario completado") + "</h2>" +
      "<p><b>" + b.nombre + "</b><br>" +
      "📅 " + b.fechaTexto + " · " + b.hora + " hrs (" + DURACION_MIN + " min)<br>" +
      "📧 " + b.email + "<br>" +
      "📱 " + b.fono + "</p>" +
      "<p><b>Quiere revisar:</b><br>" + (b.msg || "—") + "</p>" +
      "<p>" + (pagado
        ? "La hora quedó agendada en tu calendario. Verifica el pago en Mercado Pago."
        : "La hora quedó en espera por " + MINUTOS_ESPERA + " minutos. Si no paga, se libera sola.") +
      "</p>"
  });
}

function avisarCliente(b) {
  if (!b.email) return;
  MailApp.sendEmail({
    to: b.email,
    subject: "Tu asesoría inmobiliaria está agendada · " + b.fechaTexto,
    htmlBody:
      "<h2>¡Tu asesoría está agendada!</h2>" +
      "<p>Hola " + (b.nombre || "").split(" ")[0] + ", gracias por reservar tu asesoría inmobiliaria.</p>" +
      "<p><b>Fecha:</b> " + b.fechaTexto + "<br>" +
      "<b>Hora:</b> " + b.hora + " hrs<br>" +
      "<b>Duración:</b> " + DURACION_MIN + " minutos<br>" +
      "<b>Valor:</b> " + VALOR + "</p>" +
      "<p>Recibirás la invitación con el enlace de la reunión en este mismo correo.</p>" +
      "<p>Nos vemos pronto,<br>Alison Ramírez Schuchhardt<br>Asesoría Inmobiliaria</p>"
  });
}

function guardarEnPlanilla(b) {
  if (!HOJA_ID) return;
  try {
    const hoja = SpreadsheetApp.openById(HOJA_ID).getSheets()[0];
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(["Registrado", "Nombre", "Teléfono", "Correo", "Fecha", "Hora", "Quiere revisar", "Valor"]);
    }
    hoja.appendRow([new Date(), b.nombre, b.fono, b.email, b.fechaTexto, b.hora, b.msg || "", VALOR]);
  } catch (err) {}
}

/* ============================== AUXILIARES ============================ */

function calendario() {
  return CALENDARIO_ID === "primary"
    ? CalendarApp.getDefaultCalendar()
    : CalendarApp.getCalendarById(CALENDARIO_ID);
}

function enFecha(d, hhmm) {
  const p = hhmm.split(":");
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), Number(p[0]), Number(p[1]), 0, 0);
}

function desdeReserva(b) {
  const f = String(b.fechaISO).split("-");
  const h = String(b.hora).split(":");
  return new Date(Number(f[0]), Number(f[1]) - 1, Number(f[2]), Number(h[0]), Number(h[1]), 0, 0);
}

function hayChoque(cal, ini, fin) {
  return cal.getEvents(ini, fin).some(function (ev) { return !ev.isAllDayEvent(); });
}

function detalle(b, nota) {
  return "Asesoría Inmobiliaria Personalizada (" + DURACION_MIN + " min)\n\n"
    + "Cliente: " + b.nombre + "\n"
    + "Teléfono: " + b.fono + "\n"
    + "Correo: " + b.email + "\n"
    + "Valor: " + VALOR + "\n\n"
    + "Quiere revisar:\n" + (b.msg || "—") + "\n\n"
    + nota;
}

function iso(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================== INSTALACIÓN ============================== */

/** Ejecuta esta función UNA VEZ para que las horas sin pagar se liberen solas. */
function instalarDisparadores() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "limpiarReservasVencidas") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("limpiarReservasVencidas").timeBased().everyHours(1).create();
}

/** Ejecuta esta función para comprobar que el calendario responde bien. */
function probar() {
  const d = disponibilidad();
  Logger.log("Días con horas libres: " + Object.keys(d).length);
  Logger.log(JSON.stringify(d).slice(0, 500));
}
