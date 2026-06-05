'use strict';

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// ─── Datos de proyectos ───────────────────────────────────────────────────────

const PROYECTOS = {
  la_florida: {
    nombre: 'La Florida',
    emoji: '🏢',
    descripcion: `*🏢 PROYECTO LA FLORIDA*
📍 La Florida, Santiago

✅ Departamentos de 1 a 3 dormitorios
✅ Superficies desde 38 a 78 m²
✅ Estacionamiento y bodega incluidos
✅ Piscina, gimnasio y salón de eventos
💰 Precios *desde 2.500 UF*

🔑 *Entrega inmediata* disponible
🏗️ También con *entrega futura* (menores precios)
📍 Excelente conectividad – Metro La Florida`,

    entrega: 'Inmediata y Futura',
    precio: 'Desde 2.500 UF',
  },
  santiago_centro: {
    nombre: 'Santiago Centro',
    emoji: '🏙️',
    descripcion: `*🏙️ PROYECTO SANTIAGO CENTRO*
📍 Santiago Centro

✅ Estudios y departamentos de 1 a 2 dormitorios
✅ Superficies desde 28 a 55 m²
✅ Rooftop, gimnasio y cowork
💰 Precios *desde 2.000 UF*

🔑 *Entrega inmediata* – Listo para vivir o arrendar
📍 A pasos del Metro – Centro neurálgico de Santiago`,

    entrega: 'Inmediata',
    precio: 'Desde 2.000 UF',
  },
  macul: {
    nombre: 'Macul',
    emoji: '🌿',
    descripcion: `*🌿 PROYECTO MACUL*
📍 Macul, Santiago

✅ Departamentos de 1 a 2 dormitorios
✅ Superficies desde 35 a 60 m²
✅ Jardín privado, gimnasio y estacionamiento
💰 Precios *desde 2.200 UF*

🏗️ *Entrega futura* – En construcción, excelente precio de entrada
📍 Zona residencial tranquila – Metro Macul`,

    entrega: 'Futura',
    precio: 'Desde 2.200 UF',
  },
};

// ─── Mensajes del bot ─────────────────────────────────────────────────────────

const MSG = {
  bienvenida: `¡Hola! 👋 Bienvenido/a a *Avance Inmobiliario* 🏠

Somos tu partner inmobiliario de confianza. Te acompañamos en *cada paso*: desde encontrar la propiedad ideal hasta que tengas las llaves en mano y el *arriendo asegurado*. 🔑

¿En qué podemos ayudarte hoy?

*1.* 🏘️ Ver nuestros proyectos
*2.* 💳 Asesoría de crédito hipotecario
*3.* 📞 Hablar con un asesor

_Responde con el número de tu opción._`,

  menuPrincipal: `¿Qué deseas hacer?

*1.* 🏘️ Ver nuestros proyectos
*2.* 💳 Asesoría de crédito hipotecario
*3.* 📞 Hablar con un asesor`,

  menuProyectos: `Contamos con *3 proyectos* en excelentes ubicaciones de Santiago:

*1.* 🏢 La Florida
*2.* 🏙️ Santiago Centro
*3.* 🌿 Macul
*4.* 📋 Ver todos los proyectos
*0.* ↩️ Volver al menú principal

¿Cuál te interesa?`,

  infoCredito: `💳 *Asesoría de Crédito Hipotecario*

En Avance Inmobiliario te ayudamos *del principio al final*, sin costo adicional:

✅ Evaluamos tu capacidad de crédito
✅ Te guiamos con los mejores bancos
✅ Gestionamos todos los trámites contigo
✅ Hasta que tengas todo listo y el arriendo asegurado

*¿Te gustaría que un asesor te contacte?*

*1.* ✅ Sí, quiero asesoría de crédito
*0.* ↩️ Volver al menú principal`,

  interesPorProyecto: (nombre) => `¡Excelente elección! 🎉 *Proyecto ${nombre}* es una gran oportunidad.

Para conectarte con el asesor ideal, te haremos unas preguntas rápidas.

*1.* ✅ Continuar con la encuesta
*0.* ↩️ Ver otros proyectos`,

  todosLosProyectos: () => {
    const bloques = Object.values(PROYECTOS).map((p) => p.descripcion).join('\n\n─────────────────\n\n');
    return `🏘️ *TODOS NUESTROS PROYECTOS*\n\n${bloques}\n\n¿Cuál te interesa?\n\n*1.* La Florida\n*2.* Santiago Centro\n*3.* Macul\n*0.* ↩️ Volver al menú`;
  },

  encuesta: {
    p1: `*Pregunta 1 de 4* 📋

¿Para qué uso es la propiedad?

*1.* 🏠 Vivienda propia (para vivir)
*2.* 💰 Inversión (para arrendar)`,

    p2: `*Pregunta 2 de 4* 📋

¿Qué tipo de entrega prefieres?

*1.* 🔑 Entrega inmediata (lista para vivir/arrendar ya)
*2.* 🏗️ Entrega futura (en construcción, menor precio)
*3.* 🤔 Me interesan ambas opciones`,

    p3: `*Pregunta 3 de 4* 📋

¿Cuál es tu presupuesto aproximado?

*1.* Hasta 2.000 UF
*2.* Entre 2.000 y 3.000 UF
*3.* Entre 3.000 y 4.000 UF
*4.* Más de 4.000 UF`,

    p4: `*Pregunta 4 de 4* 📋

¿Necesitas asesoría para el crédito hipotecario?

*1.* ✅ Sí, necesito ayuda con el crédito
*2.* ❌ No, ya tengo financiamiento`,

    pedirNombre: `¡Casi listo! 🎉

¿Cuál es tu *nombre completo*?`,

    pedirTelefono: (nombre) => `Gracias, *${nombre}*! 😊

¿Cuál es tu *número de teléfono* de contacto?
_(Ej: +56 9 1234 5678)_`,
  },

  leadGuardado: (nombre, proyecto) => `✅ *¡Listo, ${nombre}!*

Hemos registrado tu consulta. Un asesor de *Avance Inmobiliario* te contactará a la brevedad${proyecto ? ` para mostrarte los detalles del *Proyecto ${proyecto}*` : ''}.

📍 *Oficinas:* Apoquindo 5950, Las Condes, Santiago
🕘 *Atención:* Lun–Vie 9:00–19:00 | Sáb 10:00–14:00

¡Gracias por confiar en *Avance Inmobiliario*! 🏠✨
_Tu hogar soñado, más cerca de lo que crees._`,

  opcionInvalida: `No entendí esa opción 😅

Por favor, responde con el *número* de la opción que prefieres.
Escribe *menu* para ver las opciones disponibles.`,
};

// ─── Gestión de sesiones ──────────────────────────────────────────────────────

const sesiones = {};

function obtenerSesion(userId) {
  if (!sesiones[userId]) {
    sesiones[userId] = { estado: 'INICIO', datos: {} };
  }
  return sesiones[userId];
}

function reiniciarSesion(userId) {
  sesiones[userId] = { estado: 'INICIO', datos: {} };
  return sesiones[userId];
}

// ─── Guardar lead en archivo JSON ─────────────────────────────────────────────

function guardarLead(userId, datos) {
  const lead = { timestamp: new Date().toISOString(), whatsapp: userId, ...datos };
  const archivo = 'leads.json';
  let leads = [];
  if (fs.existsSync(archivo)) {
    try {
      leads = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    } catch {
      leads = [];
    }
  }
  leads.push(lead);
  fs.writeFileSync(archivo, JSON.stringify(leads, null, 2));
  console.log('📥 Nuevo lead guardado:', lead);
}

// ─── Lógica principal de mensajes ────────────────────────────────────────────

async function manejarMensaje(message) {
  const userId = message.from;
  const texto = message.body.trim();
  const textoNorm = texto.toLowerCase();
  const sesion = obtenerSesion(userId);

  // Comandos globales
  if (['menu', 'menú', 'inicio', 'hola', 'hi', 'buenas'].includes(textoNorm)) {
    const s = reiniciarSesion(userId);
    await message.reply(MSG.bienvenida);
    s.estado = 'MENU_PRINCIPAL';
    return;
  }

  switch (sesion.estado) {
    // ── Inicio: primer contacto ──────────────────────────────────────────────
    case 'INICIO': {
      await message.reply(MSG.bienvenida);
      sesion.estado = 'MENU_PRINCIPAL';
      break;
    }

    // ── Menú principal ───────────────────────────────────────────────────────
    case 'MENU_PRINCIPAL': {
      if (textoNorm === '1') {
        await message.reply(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else if (textoNorm === '2') {
        await message.reply(MSG.infoCredito);
        sesion.estado = 'INFO_CREDITO';
      } else if (textoNorm === '3') {
        await message.reply(MSG.encuesta.pedirNombre);
        sesion.datos.interesEn = 'asesor_directo';
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        await message.reply(MSG.bienvenida);
      }
      break;
    }

    // ── Menú proyectos ───────────────────────────────────────────────────────
    case 'MENU_PROYECTOS': {
      const mapaProyecto = { '1': 'la_florida', '2': 'santiago_centro', '3': 'macul' };
      if (mapaProyecto[textoNorm]) {
        const clave = mapaProyecto[textoNorm];
        sesion.datos.proyecto = clave;
        await message.reply(PROYECTOS[clave].descripcion);
        await message.reply(MSG.interesPorProyecto(PROYECTOS[clave].nombre));
        sesion.estado = 'INTERES_PROYECTO';
      } else if (textoNorm === '4') {
        await message.reply(MSG.todosLosProyectos());
        sesion.estado = 'MENU_PROYECTOS';
      } else if (textoNorm === '0') {
        await message.reply(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Interés en proyecto ──────────────────────────────────────────────────
    case 'INTERES_PROYECTO': {
      if (textoNorm === '1') {
        await message.reply(MSG.encuesta.p1);
        sesion.estado = 'ENCUESTA_P1';
      } else if (textoNorm === '0') {
        await message.reply(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Info crédito ─────────────────────────────────────────────────────────
    case 'INFO_CREDITO': {
      if (textoNorm === '1') {
        sesion.datos.necesitaCredito = true;
        await message.reply(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else if (textoNorm === '0') {
        await message.reply(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Encuesta: uso ────────────────────────────────────────────────────────
    case 'ENCUESTA_P1': {
      if (textoNorm === '1' || textoNorm === '2') {
        sesion.datos.uso = textoNorm === '1' ? 'vivienda_propia' : 'inversion';
        await message.reply(MSG.encuesta.p2);
        sesion.estado = 'ENCUESTA_P2';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Encuesta: entrega ────────────────────────────────────────────────────
    case 'ENCUESTA_P2': {
      const mapaEntrega = { '1': 'inmediata', '2': 'futura', '3': 'ambas' };
      if (mapaEntrega[textoNorm]) {
        sesion.datos.entrega = mapaEntrega[textoNorm];
        await message.reply(MSG.encuesta.p3);
        sesion.estado = 'ENCUESTA_P3';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Encuesta: presupuesto ────────────────────────────────────────────────
    case 'ENCUESTA_P3': {
      const mapaPresupuesto = {
        '1': 'Hasta 2.000 UF',
        '2': 'Entre 2.000 y 3.000 UF',
        '3': 'Entre 3.000 y 4.000 UF',
        '4': 'Más de 4.000 UF',
      };
      if (mapaPresupuesto[textoNorm]) {
        sesion.datos.presupuesto = mapaPresupuesto[textoNorm];
        await message.reply(MSG.encuesta.p4);
        sesion.estado = 'ENCUESTA_P4';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Encuesta: crédito ────────────────────────────────────────────────────
    case 'ENCUESTA_P4': {
      if (textoNorm === '1' || textoNorm === '2') {
        sesion.datos.necesitaCredito = textoNorm === '1';
        await message.reply(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        await message.reply(MSG.opcionInvalida);
      }
      break;
    }

    // ── Encuesta: nombre ─────────────────────────────────────────────────────
    case 'ENCUESTA_NOMBRE': {
      if (texto.length < 2) {
        await message.reply('Por favor ingresa tu nombre completo 😊');
      } else {
        sesion.datos.nombre = texto;
        await message.reply(MSG.encuesta.pedirTelefono(texto));
        sesion.estado = 'ENCUESTA_TELEFONO';
      }
      break;
    }

    // ── Encuesta: teléfono ───────────────────────────────────────────────────
    case 'ENCUESTA_TELEFONO': {
      if (texto.replace(/\D/g, '').length < 7) {
        await message.reply('Por favor ingresa un número de teléfono válido 📱\n_(Ej: +56 9 1234 5678)_');
      } else {
        sesion.datos.telefono = texto;
        guardarLead(userId, sesion.datos);
        const nombreProyecto = sesion.datos.proyecto ? PROYECTOS[sesion.datos.proyecto]?.nombre : null;
        await message.reply(MSG.leadGuardado(sesion.datos.nombre, nombreProyecto));
        sesion.estado = 'COMPLETADO';
      }
      break;
    }

    // ── Conversación terminada ───────────────────────────────────────────────
    case 'COMPLETADO': {
      const nombre = sesion.datos.nombre || '';
      await message.reply(
        `¿Hay algo más en lo que podamos ayudarte${nombre ? `, ${nombre}` : ''}? 😊\n\nEscribe *menu* para volver al inicio. 🏠`
      );
      break;
    }

    default: {
      reiniciarSesion(userId);
      await message.reply(MSG.bienvenida);
      sesiones[userId].estado = 'MENU_PRINCIPAL';
    }
  }
}

// ─── Inicialización del cliente WhatsApp ──────────────────────────────────────

const cliente = new Client({
  authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

cliente.on('qr', (qr) => {
  console.log('\n📱 Escanea este código QR con tu WhatsApp Business:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n⏳ Esperando escaneo...\n');
});

cliente.on('authenticated', () => {
  console.log('🔐 Sesión autenticada correctamente');
});

cliente.on('ready', () => {
  console.log('─────────────────────────────────────────');
  console.log('✅  Bot de Avance Inmobiliario ACTIVO');
  console.log('🏠  Proyectos: La Florida | Santiago Centro | Macul');
  console.log('📍  Apoquindo 5950, Las Condes, Santiago');
  console.log('─────────────────────────────────────────');
});

cliente.on('auth_failure', (msg) => {
  console.error('❌ Error de autenticación:', msg);
  process.exit(1);
});

cliente.on('disconnected', (reason) => {
  console.warn('⚠️  Bot desconectado:', reason);
});

cliente.on('message', async (message) => {
  if (message.fromMe) return;
  if (message.type !== 'chat') return;

  try {
    await manejarMensaje(message);
  } catch (err) {
    console.error('❌ Error al procesar mensaje de', message.from, ':', err.message);
  }
});

cliente.initialize();
