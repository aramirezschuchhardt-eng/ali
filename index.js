'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'avance2025';
const LEADS_FILE = path.join(__dirname, 'leads.json');

// ─── Datos de proyectos ───────────────────────────────────────────────────────

const PROYECTOS = {
  la_florida: {
    nombre: 'La Florida',
    descripcion:
      '🏢 *PROYECTO LA FLORIDA*\n' +
      '📍 La Florida, Santiago\n\n' +
      '✅ Departamentos de 1 a 3 dormitorios\n' +
      '✅ Superficies desde 38 a 78 m²\n' +
      '✅ Estacionamiento y bodega incluidos\n' +
      '✅ Piscina, gimnasio y salón de eventos\n' +
      '💰 Precios *desde 2.500 UF*\n\n' +
      '🔑 Entrega inmediata disponible\n' +
      '🏗️ También con entrega futura (menores precios)\n' +
      '📍 Excelente conectividad – Metro La Florida',
  },
  santiago_centro: {
    nombre: 'Santiago Centro',
    descripcion:
      '🏙️ *PROYECTO SANTIAGO CENTRO*\n' +
      '📍 Santiago Centro\n\n' +
      '✅ Estudios y departamentos de 1 a 2 dormitorios\n' +
      '✅ Superficies desde 28 a 55 m²\n' +
      '✅ Rooftop, gimnasio y cowork\n' +
      '💰 Precios *desde 2.000 UF*\n\n' +
      '🔑 Entrega inmediata – Listo para vivir o arrendar\n' +
      '📍 A pasos del Metro – Centro neurálgico de Santiago',
  },
  macul: {
    nombre: 'Macul',
    descripcion:
      '🌿 *PROYECTO MACUL*\n' +
      '📍 Macul, Santiago\n\n' +
      '✅ Departamentos de 1 a 2 dormitorios\n' +
      '✅ Superficies desde 35 a 60 m²\n' +
      '✅ Jardín privado, gimnasio y estacionamiento\n' +
      '💰 Precios *desde 2.200 UF*\n\n' +
      '🏗️ Entrega futura – En construcción, excelente precio de entrada\n' +
      '📍 Zona residencial tranquila – Metro Macul',
  },
};

// ─── Mensajes ─────────────────────────────────────────────────────────────────

const MSG = {
  bienvenida:
    '¡Hola! 👋 Bienvenido/a a *Avance Inmobiliario* 🏠\n\n' +
    'Somos tu partner inmobiliario de confianza. Te acompañamos en *cada paso*: desde encontrar la propiedad ideal hasta que tengas las llaves en mano y el *arriendo asegurado*. 🔑\n\n' +
    '¿En qué podemos ayudarte hoy?\n\n' +
    '*1.* 🏘️ Ver nuestros proyectos\n' +
    '*2.* 💳 Asesoría de crédito hipotecario\n' +
    '*3.* 📞 Hablar con un asesor\n\n' +
    '_Responde con el número de tu opción._',

  menuPrincipal:
    '¿Qué deseas hacer?\n\n' +
    '*1.* 🏘️ Ver nuestros proyectos\n' +
    '*2.* 💳 Asesoría de crédito hipotecario\n' +
    '*3.* 📞 Hablar con un asesor',

  menuProyectos:
    'Contamos con *3 proyectos* en excelentes ubicaciones de Santiago:\n\n' +
    '*1.* 🏢 La Florida\n' +
    '*2.* 🏙️ Santiago Centro\n' +
    '*3.* 🌿 Macul\n' +
    '*4.* 📋 Ver todos los proyectos\n' +
    '*0.* ↩️ Volver al menú principal\n\n' +
    '¿Cuál te interesa?',

  infoCredito:
    '💳 *Asesoría de Crédito Hipotecario*\n\n' +
    'En Avance Inmobiliario te ayudamos *del principio al final*, sin costo adicional:\n\n' +
    '✅ Evaluamos tu capacidad de crédito\n' +
    '✅ Te guiamos con los mejores bancos\n' +
    '✅ Gestionamos todos los trámites contigo\n' +
    '✅ Hasta que tengas todo listo y el arriendo asegurado\n\n' +
    '*¿Te gustaría que un asesor te contacte?*\n\n' +
    '*1.* ✅ Sí, quiero asesoría de crédito\n' +
    '*0.* ↩️ Volver al menú principal',

  interesPorProyecto: (nombre) =>
    `¡Excelente elección! 🎉 *Proyecto ${nombre}* es una gran oportunidad.\n\nPara conectarte con el asesor ideal, te haremos unas preguntas rápidas.\n\n*1.* ✅ Continuar con la encuesta\n*0.* ↩️ Ver otros proyectos`,

  todosLosProyectos() {
    const bloques = Object.values(PROYECTOS).map((p) => p.descripcion).join('\n\n─────────────────\n\n');
    return `🏘️ *TODOS NUESTROS PROYECTOS*\n\n${bloques}\n\n¿Cuál te interesa?\n\n*1.* La Florida\n*2.* Santiago Centro\n*3.* Macul\n*0.* ↩️ Volver al menú`;
  },

  encuesta: {
    p1:
      '*Pregunta 1 de 4* 📋\n\n' +
      '¿Para qué uso es la propiedad?\n\n' +
      '*1.* 🏠 Vivienda propia (para vivir)\n' +
      '*2.* 💰 Inversión (para arrendar)',

    p2:
      '*Pregunta 2 de 4* 📋\n\n' +
      '¿Qué tipo de entrega prefieres?\n\n' +
      '*1.* 🔑 Entrega inmediata (lista para vivir/arrendar ya)\n' +
      '*2.* 🏗️ Entrega futura (en construcción, menor precio)\n' +
      '*3.* 🤔 Me interesan ambas opciones',

    p3:
      '*Pregunta 3 de 4* 📋\n\n' +
      '¿Cuál es tu presupuesto aproximado?\n\n' +
      '*1.* Hasta 2.000 UF\n' +
      '*2.* Entre 2.000 y 3.000 UF\n' +
      '*3.* Entre 3.000 y 4.000 UF\n' +
      '*4.* Más de 4.000 UF',

    p4:
      '*Pregunta 4 de 4* 📋\n\n' +
      '¿Necesitas asesoría para el crédito hipotecario?\n\n' +
      '*1.* ✅ Sí, necesito ayuda con el crédito\n' +
      '*2.* ❌ No, ya tengo financiamiento',

    pedirNombre: '¡Casi listo! 🎉\n\n¿Cuál es tu *nombre completo*?',

    pedirTelefono: (nombre) =>
      `Gracias, *${nombre}*! 😊\n\n¿Cuál es tu *número de teléfono* de contacto?\n_(Ej: +56 9 1234 5678)_`,
  },

  leadGuardado: (nombre, proyecto) =>
    `✅ *¡Listo, ${nombre}!*\n\n` +
    `Hemos registrado tu consulta. Un asesor de *Avance Inmobiliario* te contactará a la brevedad` +
    `${proyecto ? ` para mostrarte los detalles del *Proyecto ${proyecto}*` : ''}.\n\n` +
    '📍 *Oficinas:* Apoquindo 5950, Las Condes, Santiago\n' +
    '🕘 *Atención:* Lun–Vie 9:00–19:00 | Sáb 10:00–14:00\n\n' +
    '¡Gracias por confiar en *Avance Inmobiliario*! 🏠✨\n' +
    '_Tu hogar soñado, más cerca de lo que crees._',

  opcionInvalida:
    'No entendí esa opción 😅\n\nPor favor, responde con el *número* de la opción que prefieres.\nEscribe *menu* para ver las opciones disponibles.',
};

// ─── Sesiones en memoria ──────────────────────────────────────────────────────

const sesiones = {};

function obtenerSesion(userId) {
  if (!sesiones[userId]) sesiones[userId] = { estado: 'INICIO', datos: {} };
  return sesiones[userId];
}

function reiniciarSesion(userId) {
  sesiones[userId] = { estado: 'INICIO', datos: {} };
  return sesiones[userId];
}

// ─── Guardar lead ─────────────────────────────────────────────────────────────

function guardarLead(userId, datos) {
  const lead = { id: Date.now(), timestamp: new Date().toISOString(), whatsapp: userId, ...datos };
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }
  leads.push(lead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  console.log('📥 Nuevo lead:', lead);
  return lead;
}

// ─── Lógica del chatbot ───────────────────────────────────────────────────────

function procesarMensaje(userId, textoOriginal) {
  const texto = textoOriginal.trim();
  const norm = texto.toLowerCase();
  const sesion = obtenerSesion(userId);
  const respuestas = [];

  const responder = (msg) => respuestas.push(msg);

  if (['menu', 'menú', 'inicio', 'hola', 'hi', 'buenas'].includes(norm)) {
    reiniciarSesion(userId);
    responder(MSG.bienvenida);
    sesiones[userId].estado = 'MENU_PRINCIPAL';
    return respuestas;
  }

  switch (sesion.estado) {
    case 'INICIO':
      responder(MSG.bienvenida);
      sesion.estado = 'MENU_PRINCIPAL';
      break;

    case 'MENU_PRINCIPAL':
      if (norm === '1') {
        responder(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else if (norm === '2') {
        responder(MSG.infoCredito);
        sesion.estado = 'INFO_CREDITO';
      } else if (norm === '3') {
        sesion.datos.interesEn = 'asesor_directo';
        responder(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        responder(MSG.bienvenida);
      }
      break;

    case 'MENU_PROYECTOS': {
      const mapa = { '1': 'la_florida', '2': 'santiago_centro', '3': 'macul' };
      if (mapa[norm]) {
        const clave = mapa[norm];
        sesion.datos.proyecto = clave;
        responder(PROYECTOS[clave].descripcion);
        responder(MSG.interesPorProyecto(PROYECTOS[clave].nombre));
        sesion.estado = 'INTERES_PROYECTO';
      } else if (norm === '4') {
        responder(MSG.todosLosProyectos());
      } else if (norm === '0') {
        responder(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;
    }

    case 'INTERES_PROYECTO':
      if (norm === '1') {
        responder(MSG.encuesta.p1);
        sesion.estado = 'ENCUESTA_P1';
      } else if (norm === '0') {
        responder(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;

    case 'INFO_CREDITO':
      if (norm === '1') {
        sesion.datos.necesitaCredito = true;
        responder(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else if (norm === '0') {
        responder(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;

    case 'ENCUESTA_P1':
      if (norm === '1' || norm === '2') {
        sesion.datos.uso = norm === '1' ? 'vivienda_propia' : 'inversion';
        responder(MSG.encuesta.p2);
        sesion.estado = 'ENCUESTA_P2';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;

    case 'ENCUESTA_P2': {
      const mapaEntrega = { '1': 'inmediata', '2': 'futura', '3': 'ambas' };
      if (mapaEntrega[norm]) {
        sesion.datos.entrega = mapaEntrega[norm];
        responder(MSG.encuesta.p3);
        sesion.estado = 'ENCUESTA_P3';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;
    }

    case 'ENCUESTA_P3': {
      const mapaPresupuesto = {
        '1': 'Hasta 2.000 UF',
        '2': 'Entre 2.000 y 3.000 UF',
        '3': 'Entre 3.000 y 4.000 UF',
        '4': 'Más de 4.000 UF',
      };
      if (mapaPresupuesto[norm]) {
        sesion.datos.presupuesto = mapaPresupuesto[norm];
        responder(MSG.encuesta.p4);
        sesion.estado = 'ENCUESTA_P4';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;
    }

    case 'ENCUESTA_P4':
      if (norm === '1' || norm === '2') {
        sesion.datos.necesitaCredito = norm === '1';
        responder(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        responder(MSG.opcionInvalida);
      }
      break;

    case 'ENCUESTA_NOMBRE':
      if (texto.length < 2) {
        responder('Por favor ingresa tu nombre completo 😊');
      } else {
        sesion.datos.nombre = texto;
        responder(MSG.encuesta.pedirTelefono(texto));
        sesion.estado = 'ENCUESTA_TELEFONO';
      }
      break;

    case 'ENCUESTA_TELEFONO':
      if (texto.replace(/\D/g, '').length < 7) {
        responder('Por favor ingresa un número de teléfono válido 📱\n_(Ej: +56 9 1234 5678)_');
      } else {
        sesion.datos.telefono = texto;
        guardarLead(userId, sesion.datos);
        const nombreProyecto = sesion.datos.proyecto ? PROYECTOS[sesion.datos.proyecto]?.nombre : null;
        responder(MSG.leadGuardado(sesion.datos.nombre, nombreProyecto));
        sesion.estado = 'COMPLETADO';
      }
      break;

    case 'COMPLETADO':
      responder(
        `¿Hay algo más en lo que podamos ayudarte, ${sesion.datos.nombre || ''}? 😊\n\nEscribe *menu* para volver al inicio. 🏠`
      );
      break;

    default:
      reiniciarSesion(userId);
      responder(MSG.bienvenida);
      sesiones[userId].estado = 'MENU_PRINCIPAL';
  }

  return respuestas;
}

// ─── Webhook de Twilio ────────────────────────────────────────────────────────

app.post('/webhook', (req, res) => {
  const from = req.body.From || '';   // ej: "whatsapp:+56912345678"
  const body = req.body.Body || '';

  console.log(`📩 [${from}] "${body}"`);

  const mensajes = procesarMensaje(from, body);
  const twiml = new twilio.twiml.MessagingResponse();
  mensajes.forEach((m) => twiml.message(m));

  res.type('text/xml').send(twiml.toString());
});

// ─── Panel de leads (privado) ─────────────────────────────────────────────────

function verificarPassword(req, res, next) {
  const pwd = req.query.key || req.headers['x-admin-key'];
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(401).send('No autorizado. Agrega ?key=TU_PASSWORD a la URL.');
  }
  next();
}

app.get('/admin/leads', verificarPassword, (req, res) => {
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }

  const etiquetas = { vivienda_propia: 'Vivienda propia', inversion: 'Inversión' };
  const mapaProyecto = { la_florida: 'La Florida', santiago_centro: 'Santiago Centro', macul: 'Macul' };

  const filas = leads.slice().reverse().map((l) => `
    <tr>
      <td>${new Date(l.timestamp).toLocaleString('es-CL')}</td>
      <td>${l.nombre || '—'}</td>
      <td>${l.telefono || '—'}</td>
      <td>${l.whatsapp?.replace('whatsapp:', '') || '—'}</td>
      <td>${mapaProyecto[l.proyecto] || '—'}</td>
      <td>${etiquetas[l.uso] || '—'}</td>
      <td>${l.entrega || '—'}</td>
      <td>${l.presupuesto || '—'}</td>
      <td>${l.necesitaCredito ? '✅ Sí' : '❌ No'}</td>
    </tr>`).join('');

  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leads – Avance Inmobiliario</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; color: #1a1a2e; }
    header { background: #1a3c5e; color: #fff; padding: 20px 30px; display: flex; align-items: center; gap: 14px; }
    header h1 { font-size: 1.3rem; font-weight: 600; }
    header span { font-size: 0.85rem; opacity: .7; }
    .container { padding: 24px 30px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: #fff; border-radius: 10px; padding: 16px 22px; flex: 1; min-width: 140px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .stat .val { font-size: 2rem; font-weight: 700; color: #1a3c5e; }
    .stat .lbl { font-size: 0.78rem; color: #666; margin-top: 2px; }
    .card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.08); overflow: hidden; }
    .card-header { padding: 14px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .card-header h2 { font-size: 0.95rem; font-weight: 600; }
    a.export { background: #1a3c5e; color: #fff; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.82rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
    th { background: #f7f8fa; padding: 10px 12px; text-align: left; font-weight: 600; color: #444; border-bottom: 2px solid #eee; white-space: nowrap; }
    td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    tr:hover td { background: #f9fbff; }
    .empty { text-align: center; padding: 40px; color: #999; }
    @media (max-width: 700px) { .container { padding: 16px; } table { font-size: 0.75rem; } th, td { padding: 8px 6px; } }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>🏠 Avance Inmobiliario — Panel de Leads</h1>
      <span>Consultas recibidas vía WhatsApp</span>
    </div>
  </header>
  <div class="container">
    <div class="stats">
      <div class="stat"><div class="val">${leads.length}</div><div class="lbl">Total leads</div></div>
      <div class="stat"><div class="val">${leads.filter(l => l.proyecto === 'la_florida').length}</div><div class="lbl">La Florida</div></div>
      <div class="stat"><div class="val">${leads.filter(l => l.proyecto === 'santiago_centro').length}</div><div class="lbl">Santiago Centro</div></div>
      <div class="stat"><div class="val">${leads.filter(l => l.proyecto === 'macul').length}</div><div class="lbl">Macul</div></div>
      <div class="stat"><div class="val">${leads.filter(l => l.necesitaCredito).length}</div><div class="lbl">Necesitan crédito</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>Leads (más recientes primero)</h2>
        <a class="export" href="?key=${ADMIN_PASSWORD}&format=csv">Exportar CSV</a>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead>
            <tr>
              <th>Fecha</th><th>Nombre</th><th>Teléfono</th><th>WhatsApp</th>
              <th>Proyecto</th><th>Uso</th><th>Entrega</th><th>Presupuesto</th><th>Crédito</th>
            </tr>
          </thead>
          <tbody>${filas || '<tr><td colspan="9" class="empty">Aún no hay leads registrados.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`);
});

// ─── Exportar CSV ─────────────────────────────────────────────────────────────

app.get('/admin/leads', verificarPassword, (req, res, next) => {
  if (req.query.format !== 'csv') return next();
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }
  const encabezado = 'Fecha,Nombre,Telefono,WhatsApp,Proyecto,Uso,Entrega,Presupuesto,NecesitaCredito';
  const filas = leads.map((l) => [
    l.timestamp, l.nombre || '', l.telefono || '',
    (l.whatsapp || '').replace('whatsapp:', ''),
    l.proyecto || '', l.uso || '', l.entrega || '', l.presupuesto || '',
    l.necesitaCredito ? 'Si' : 'No',
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-avance.csv"');
  res.send('﻿' + [encabezado, ...filas].join('\n'));
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────────────────────');
  console.log('✅  Avance Inmobiliario WhatsApp Bot – ACTIVO');
  console.log(`🌐  Servidor: http://localhost:${PORT}`);
  console.log(`🔗  Webhook Twilio: POST http://TU_DOMINIO:${PORT}/webhook`);
  console.log(`🔒  Panel de leads: http://localhost:${PORT}/admin/leads?key=${ADMIN_PASSWORD}`);
  console.log('─────────────────────────────────────────────────────────');
});
