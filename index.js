'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'avance2025';
const LEADS_FILE = path.join(__dirname, 'leads.json');

// ─── Proyectos ────────────────────────────────────────────────────────────────

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
      '📈 Rentabilidad bruta estimada: *5–6% anual*\n' +
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
      '📈 Rentabilidad bruta estimada: *5.5–7% anual*\n' +
      '📍 A pasos del Metro – Alta demanda de arriendo',
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
      '🏗️ Entrega futura – Precio de pre-venta con plusvalía asegurada\n' +
      '📈 Rentabilidad bruta estimada: *5–6% anual*\n' +
      '📍 Zona residencial consolidada – Metro Macul',
  },
};

// ─── Mensajes ─────────────────────────────────────────────────────────────────

const MSG = {
  bienvenida:
    '¡Hola! 👋 Bienvenido/a a *Avance Inmobiliario* 🏠\n\n' +
    'Somos tu partner inmobiliario de confianza en Santiago. Te acompañamos en *cada paso*:\n' +
    '🔍 Encontrar la propiedad ideal\n' +
    '🏦 Gestionar tu crédito hipotecario\n' +
    '📋 Todos los trámites hasta el final\n' +
    '🔑 Hasta que tengas tu arriendo asegurado\n\n' +
    '¿En qué podemos ayudarte hoy?\n\n' +
    '*1.* 🏘️ Conocer nuestros proyectos\n' +
    '*2.* 💳 Asesoría de crédito hipotecario\n' +
    '*3.* 📞 Hablar directamente con un asesor\n\n' +
    '_Responde con el número de tu opción._',

  menuPrincipal:
    '¿Qué deseas hacer?\n\n' +
    '*1.* 🏘️ Conocer nuestros proyectos\n' +
    '*2.* 💳 Asesoría de crédito hipotecario\n' +
    '*3.* 📞 Hablar con un asesor',

  menuProyectos:
    '🏘️ *Nuestros proyectos en Santiago:*\n\n' +
    '*1.* 🏢 La Florida – Desde 2.500 UF\n' +
    '*2.* 🏙️ Santiago Centro – Desde 2.000 UF\n' +
    '*3.* 🌿 Macul – Desde 2.200 UF\n' +
    '*4.* 📋 Ver los 3 proyectos\n' +
    '*0.* ↩️ Volver al menú principal\n\n' +
    '¿Cuál te interesa?',

  infoCredito:
    '💳 *Asesoría de Crédito Hipotecario*\n\n' +
    'En Avance Inmobiliario te guiamos *sin costo adicional*:\n\n' +
    '✅ Evaluación de tu capacidad crediticia\n' +
    '✅ Comparación entre bancos e instituciones\n' +
    '✅ Simulación de dividendo mensual\n' +
    '✅ Gestión completa de trámites\n' +
    '✅ Apoyo hasta que el arriendo esté asegurado\n\n' +
    '*¿Te gustaría que un asesor te contacte?*\n\n' +
    '*1.* ✅ Sí, quiero asesoría de crédito\n' +
    '*0.* ↩️ Volver al menú principal',

  interesPorProyecto: (nombre) =>
    `¡Excelente elección! 🎉 *Proyecto ${nombre}* es una gran oportunidad.\n\n` +
    'Para conectarte con el asesor perfecto, te haremos algunas preguntas. ¿Comenzamos?\n\n' +
    '*1.* ✅ Sí, continuar\n' +
    '*0.* ↩️ Ver otros proyectos',

  todosLosProyectos() {
    const bloques = Object.values(PROYECTOS).map((p) => p.descripcion).join('\n\n─────────────────\n\n');
    return (
      '🏘️ *TODOS NUESTROS PROYECTOS*\n\n' +
      bloques +
      '\n\n¿Cuál te interesa?\n\n*1.* La Florida\n*2.* Santiago Centro\n*3.* Macul\n*0.* ↩️ Volver al menú'
    );
  },

  // ── Encuesta ────────────────────────────────────────────────────────────────

  encuesta: {
    p1:
      '📋 *Pregunta 1 de 8*\n\n' +
      '¿Cuál es el propósito de tu compra?\n\n' +
      '*1.* 🏠 Vivienda propia (para vivir con mi familia)\n' +
      '*2.* 💰 Inversión pura (comprar para arrendar y generar renta)\n' +
      '*3.* 🔄 Primero vivir, luego arrendar',

    p2_inversion:
      '📋 *Pregunta 2 de 8*\n\n' +
      '¿Qué renta mensual esperas obtener con el arriendo?\n\n' +
      '*1.* Hasta $300.000/mes\n' +
      '*2.* Entre $300.000 y $500.000/mes\n' +
      '*3.* Entre $500.000 y $700.000/mes\n' +
      '*4.* Más de $700.000/mes\n' +
      '*5.* No lo sé, necesito orientación',

    p2_vivienda:
      '📋 *Pregunta 2 de 8*\n\n' +
      '¿Cuántas personas vivirán en la propiedad?\n\n' +
      '*1.* Solo yo\n' +
      '*2.* En pareja (2 personas)\n' +
      '*3.* Familia con hijos (3 a 4 personas)\n' +
      '*4.* Familia grande (5 o más personas)',

    p3:
      '📋 *Pregunta 3 de 8*\n\n' +
      '¿Cuántos dormitorios necesitas?\n\n' +
      '*1.* Estudio (sin dormitorio separado)\n' +
      '*2.* 1 dormitorio\n' +
      '*3.* 2 dormitorios\n' +
      '*4.* 3 dormitorios o más',

    p4:
      '📋 *Pregunta 4 de 8*\n\n' +
      '¿Qué tipo de entrega prefieres?\n\n' +
      '*1.* 🔑 Entrega inmediata (lista para vivir o arrendar ahora)\n' +
      '*2.* 🏗️ Entrega futura (en construcción, precio de preventa)\n' +
      '*3.* 🤔 Me interesan ambas opciones',

    p5:
      '📋 *Pregunta 5 de 8*\n\n' +
      '¿Cuál es tu presupuesto de compra?\n\n' +
      '*1.* Hasta 2.000 UF (aprox. $70 millones)\n' +
      '*2.* Entre 2.000 y 3.000 UF (aprox. $70M – $105M)\n' +
      '*3.* Entre 3.000 y 4.000 UF (aprox. $105M – $140M)\n' +
      '*4.* Más de 4.000 UF (más de $140M)',

    p6:
      '📋 *Pregunta 6 de 8*\n\n' +
      '¿Cómo planeas financiar la compra?\n\n' +
      '*1.* 🏦 Crédito hipotecario (dividendo mensual)\n' +
      '*2.* 💵 Al contado\n' +
      '*3.* 🏛️ Subsidio habitacional + crédito\n' +
      '*4.* ❓ Aún no lo sé, necesito orientación',

    p7_renta:
      '📋 *Pregunta 7 de 8*\n\n' +
      '¿Cuál es tu renta mensual líquida aproximada?\n' +
      '_(Esto nos ayuda a simular tu dividendo)_\n\n' +
      '*1.* Menos de $800.000\n' +
      '*2.* Entre $800.000 y $1.500.000\n' +
      '*3.* Entre $1.500.000 y $2.500.000\n' +
      '*4.* Más de $2.500.000',

    p7_contado:
      '📋 *Pregunta 7 de 8*\n\n' +
      '¿Tienes otras propiedades actualmente?\n\n' +
      '*1.* No, esta sería mi primera propiedad\n' +
      '*2.* Sí, tengo 1 propiedad\n' +
      '*3.* Sí, tengo 2 o más (soy inversionista)',

    p8_pie:
      '📋 *Pregunta 8 de 8*\n\n' +
      '¿Tienes el pie disponible? _(generalmente 20% del valor)_\n\n' +
      '*1.* ✅ Sí, tengo el pie listo\n' +
      '*2.* 🔄 Tengo parte del pie\n' +
      '*3.* ❌ No, necesito ayuda para conseguir el pie',

    p8_propiedades:
      '📋 *Pregunta 8 de 8*\n\n' +
      '¿Tienes otras propiedades actualmente?\n\n' +
      '*1.* No, esta sería mi primera propiedad\n' +
      '*2.* Sí, tengo 1 propiedad\n' +
      '*3.* Sí, tengo 2 o más (soy inversionista)',

    pedirNombre: '¡Casi listo! 🎉 Solo unos datos de contacto.\n\n¿Cuál es tu *nombre completo*?',

    pedirEmail: (nombre) =>
      `Perfecto, ${nombre}! 📧\n\n¿Cuál es tu *correo electrónico*?\n_(Escribe "saltar" si prefieres no ingresarlo)_`,

    pedirTelefono: () => '📱 ¿Cuál es tu *número de teléfono* de contacto?\n_(Ej: +56 9 1234 5678)_',
  },

  leadGuardado: (nombre, proyecto) =>
    `✅ *¡Todo listo, ${nombre}!*\n\n` +
    `Hemos registrado tu consulta. Un asesor de *Avance Inmobiliario* te contactará a la brevedad` +
    `${proyecto ? ` con información detallada del *Proyecto ${proyecto}*` : ''}.\n\n` +
    '🏠 *Lo que haremos por ti:*\n' +
    '• Presentarte las unidades que se ajustan a tu perfil\n' +
    '• Simular tu dividendo mensual (si aplica)\n' +
    '• Orientarte para asegurar tu crédito\n' +
    '• Acompañarte hasta el arriendo asegurado\n\n' +
    '📍 *Oficinas:* Apoquindo 5950, Las Condes, Santiago\n' +
    '🕘 *Atención:* Lun–Vie 9:00–19:00 | Sáb 10:00–14:00\n\n' +
    '¡Gracias por confiar en *Avance Inmobiliario*! 🏠✨\n' +
    '_Tu hogar o inversión soñada, más cerca de lo que crees._',

  opcionInvalida:
    'No entendí esa opción 😅\n\nPor favor, responde con el *número* de la opción que prefieres.\nEscribe *menu* para ver las opciones disponibles.',
};

// ─── Sesiones ─────────────────────────────────────────────────────────────────

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
  const lead = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    whatsapp: userId,
    ...datos,
  };
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }
  leads.push(lead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  console.log('📥 Nuevo lead:', JSON.stringify(lead));
  return lead;
}

// ─── Procesamiento de mensajes ────────────────────────────────────────────────

function procesarMensaje(userId, textoOriginal) {
  const texto = textoOriginal.trim();
  const norm = texto.toLowerCase();
  const sesion = obtenerSesion(userId);
  const respuestas = [];
  const r = (msg) => respuestas.push(msg);

  // Comandos globales
  if (['menu', 'menú', 'inicio', 'hola', 'hi', 'buenas', 'buenos días', 'buenas tardes'].includes(norm)) {
    reiniciarSesion(userId);
    r(MSG.bienvenida);
    sesiones[userId].estado = 'MENU_PRINCIPAL';
    return respuestas;
  }

  switch (sesion.estado) {

    // ── Primer contacto ──────────────────────────────────────────────────────
    case 'INICIO':
      r(MSG.bienvenida);
      sesion.estado = 'MENU_PRINCIPAL';
      break;

    // ── Menú principal ───────────────────────────────────────────────────────
    case 'MENU_PRINCIPAL':
      if (norm === '1') {
        r(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else if (norm === '2') {
        r(MSG.infoCredito);
        sesion.estado = 'INFO_CREDITO';
      } else if (norm === '3') {
        sesion.datos.interesEn = 'asesor_directo';
        r(MSG.encuesta.p1);
        sesion.estado = 'ENCUESTA_P1';
      } else {
        r(MSG.bienvenida);
      }
      break;

    // ── Menú proyectos ───────────────────────────────────────────────────────
    case 'MENU_PROYECTOS': {
      const mapa = { '1': 'la_florida', '2': 'santiago_centro', '3': 'macul' };
      if (mapa[norm]) {
        const clave = mapa[norm];
        sesion.datos.proyecto = clave;
        r(PROYECTOS[clave].descripcion);
        r(MSG.interesPorProyecto(PROYECTOS[clave].nombre));
        sesion.estado = 'INTERES_PROYECTO';
      } else if (norm === '4') {
        r(MSG.todosLosProyectos());
      } else if (norm === '0') {
        r(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── Interés en proyecto ──────────────────────────────────────────────────
    case 'INTERES_PROYECTO':
      if (norm === '1') {
        r(MSG.encuesta.p1);
        sesion.estado = 'ENCUESTA_P1';
      } else if (norm === '0') {
        r(MSG.menuProyectos);
        sesion.estado = 'MENU_PROYECTOS';
      } else {
        r(MSG.opcionInvalida);
      }
      break;

    // ── Info crédito ─────────────────────────────────────────────────────────
    case 'INFO_CREDITO':
      if (norm === '1') {
        sesion.datos.canalEntrada = 'credito';
        r(MSG.encuesta.p1);
        sesion.estado = 'ENCUESTA_P1';
      } else if (norm === '0') {
        r(MSG.menuPrincipal);
        sesion.estado = 'MENU_PRINCIPAL';
      } else {
        r(MSG.opcionInvalida);
      }
      break;

    // ── P1: Propósito ────────────────────────────────────────────────────────
    case 'ENCUESTA_P1': {
      const mapaUso = { '1': 'vivienda_propia', '2': 'inversion', '3': 'vivienda_luego_arriendo' };
      if (mapaUso[norm]) {
        sesion.datos.proposito = mapaUso[norm];
        if (norm === '2') {
          r(MSG.encuesta.p2_inversion);
          sesion.estado = 'ENCUESTA_P2_INVERSION';
        } else {
          r(MSG.encuesta.p2_vivienda);
          sesion.estado = 'ENCUESTA_P2_VIVIENDA';
        }
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P2A: Renta esperada (inversión) ──────────────────────────────────────
    case 'ENCUESTA_P2_INVERSION': {
      const mapaRenta = {
        '1': 'Hasta $300.000/mes',
        '2': '$300.000 – $500.000/mes',
        '3': '$500.000 – $700.000/mes',
        '4': 'Más de $700.000/mes',
        '5': 'No lo sé aún',
      };
      if (mapaRenta[norm]) {
        sesion.datos.rentaEsperada = mapaRenta[norm];
        r(MSG.encuesta.p3);
        sesion.estado = 'ENCUESTA_P3';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P2B: Personas en el hogar (vivienda) ─────────────────────────────────
    case 'ENCUESTA_P2_VIVIENDA': {
      const mapaPersonas = {
        '1': 'Solo (1 persona)',
        '2': 'En pareja (2 personas)',
        '3': 'Familia con hijos (3–4 personas)',
        '4': 'Familia grande (5+ personas)',
      };
      if (mapaPersonas[norm]) {
        sesion.datos.grupoFamiliar = mapaPersonas[norm];
        r(MSG.encuesta.p3);
        sesion.estado = 'ENCUESTA_P3';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P3: Dormitorios ──────────────────────────────────────────────────────
    case 'ENCUESTA_P3': {
      const mapaDorm = {
        '1': 'Estudio',
        '2': '1 dormitorio',
        '3': '2 dormitorios',
        '4': '3 dormitorios o más',
      };
      if (mapaDorm[norm]) {
        sesion.datos.dormitorios = mapaDorm[norm];
        r(MSG.encuesta.p4);
        sesion.estado = 'ENCUESTA_P4';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P4: Entrega ──────────────────────────────────────────────────────────
    case 'ENCUESTA_P4': {
      const mapaEntrega = { '1': 'inmediata', '2': 'futura', '3': 'ambas' };
      if (mapaEntrega[norm]) {
        sesion.datos.entrega = mapaEntrega[norm];
        r(MSG.encuesta.p5);
        sesion.estado = 'ENCUESTA_P5';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P5: Presupuesto ──────────────────────────────────────────────────────
    case 'ENCUESTA_P5': {
      const mapaPresup = {
        '1': 'Hasta 2.000 UF',
        '2': '2.000 – 3.000 UF',
        '3': '3.000 – 4.000 UF',
        '4': 'Más de 4.000 UF',
      };
      if (mapaPresup[norm]) {
        sesion.datos.presupuesto = mapaPresup[norm];
        r(MSG.encuesta.p6);
        sesion.estado = 'ENCUESTA_P6';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P6: Financiamiento ───────────────────────────────────────────────────
    case 'ENCUESTA_P6': {
      const mapaFin = {
        '1': 'credito_hipotecario',
        '2': 'contado',
        '3': 'subsidio_credito',
        '4': 'no_sabe',
      };
      if (mapaFin[norm]) {
        sesion.datos.financiamiento = mapaFin[norm];
        if (norm === '1' || norm === '3') {
          r(MSG.encuesta.p7_renta);
          sesion.estado = 'ENCUESTA_P7_RENTA';
        } else {
          r(MSG.encuesta.p7_contado);
          sesion.estado = 'ENCUESTA_P7_PROPIEDADES';
        }
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P7A: Renta mensual (si crédito) ──────────────────────────────────────
    case 'ENCUESTA_P7_RENTA': {
      const mapaIngreso = {
        '1': 'Menos de $800.000',
        '2': '$800.000 – $1.500.000',
        '3': '$1.500.000 – $2.500.000',
        '4': 'Más de $2.500.000',
      };
      if (mapaIngreso[norm]) {
        sesion.datos.ingresoMensual = mapaIngreso[norm];
        r(MSG.encuesta.p8_pie);
        sesion.estado = 'ENCUESTA_P8_PIE';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P7B: Propiedades actuales (si contado o no sabe) ─────────────────────
    case 'ENCUESTA_P7_PROPIEDADES': {
      const mapaProp = {
        '1': 'Primera propiedad',
        '2': 'Tiene 1 propiedad',
        '3': 'Tiene 2 o más (inversionista)',
      };
      if (mapaProp[norm]) {
        sesion.datos.propiedadesActuales = mapaProp[norm];
        r(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── P8: Pie disponible (si crédito) ──────────────────────────────────────
    case 'ENCUESTA_P8_PIE': {
      const mapaPie = {
        '1': 'Sí, tiene el pie',
        '2': 'Tiene parte del pie',
        '3': 'No tiene pie, necesita ayuda',
      };
      if (mapaPie[norm]) {
        sesion.datos.pie = mapaPie[norm];
        r(MSG.encuesta.pedirNombre);
        sesion.estado = 'ENCUESTA_NOMBRE';
      } else {
        r(MSG.opcionInvalida);
      }
      break;
    }

    // ── Nombre ───────────────────────────────────────────────────────────────
    case 'ENCUESTA_NOMBRE':
      if (texto.length < 2) {
        r('Por favor ingresa tu nombre completo 😊');
      } else {
        sesion.datos.nombre = texto;
        r(MSG.encuesta.pedirEmail(texto));
        sesion.estado = 'ENCUESTA_EMAIL';
      }
      break;

    // ── Email ────────────────────────────────────────────────────────────────
    case 'ENCUESTA_EMAIL':
      if (norm === 'saltar' || norm === 'no' || norm === 'skip') {
        sesion.datos.email = null;
      } else if (!texto.includes('@') || texto.length < 5) {
        r('Por favor ingresa un correo válido o escribe *saltar* para omitirlo 📧');
        break;
      } else {
        sesion.datos.email = texto.toLowerCase();
      }
      r(MSG.encuesta.pedirTelefono());
      sesion.estado = 'ENCUESTA_TELEFONO';
      break;

    // ── Teléfono ─────────────────────────────────────────────────────────────
    case 'ENCUESTA_TELEFONO':
      if (texto.replace(/\D/g, '').length < 7) {
        r('Por favor ingresa un número de teléfono válido 📱\n_(Ej: +56 9 1234 5678)_');
      } else {
        sesion.datos.telefono = texto;
        guardarLead(userId, sesion.datos);
        const nombreProyecto = sesion.datos.proyecto ? PROYECTOS[sesion.datos.proyecto]?.nombre : null;
        r(MSG.leadGuardado(sesion.datos.nombre, nombreProyecto));
        sesion.estado = 'COMPLETADO';
      }
      break;

    // ── Completado ───────────────────────────────────────────────────────────
    case 'COMPLETADO':
      r(
        `¿Hay algo más en lo que podamos ayudarte, ${sesion.datos.nombre || ''}? 😊\n\nEscribe *menu* para volver al inicio. 🏠`
      );
      break;

    default:
      reiniciarSesion(userId);
      r(MSG.bienvenida);
      sesiones[userId].estado = 'MENU_PRINCIPAL';
  }

  return respuestas;
}

// ─── Webhook Twilio ───────────────────────────────────────────────────────────

app.post('/webhook', (req, res) => {
  const from = req.body.From || '';
  const body = req.body.Body || '';
  console.log(`📩 [${from}] "${body}"`);

  const mensajes = procesarMensaje(from, body);
  const twiml = new twilio.twiml.MessagingResponse();
  mensajes.forEach((m) => twiml.message(m));

  res.type('text/xml').send(twiml.toString());
});

// ─── Panel de leads ───────────────────────────────────────────────────────────

function verificarPassword(req, res, next) {
  const pwd = req.query.key || req.headers['x-admin-key'];
  if (pwd !== ADMIN_PASSWORD) return res.status(401).send('No autorizado. Agrega ?key=TU_PASSWORD a la URL.');
  next();
}

app.get('/admin/leads', verificarPassword, (req, res, next) => {
  if (req.query.format === 'csv') return next();

  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }

  const mapaProposito = {
    vivienda_propia: '🏠 Vivienda propia',
    inversion: '💰 Inversión',
    vivienda_luego_arriendo: '🔄 Vivienda → Arriendo',
  };
  const mapaProyecto = { la_florida: 'La Florida', santiago_centro: 'Santiago Centro', macul: 'Macul' };
  const mapaFin = {
    credito_hipotecario: 'Crédito hipotecario',
    contado: 'Contado',
    subsidio_credito: 'Subsidio + crédito',
    no_sabe: 'Por definir',
  };

  const filas = leads.slice().reverse().map((l) => `
    <tr>
      <td>${new Date(l.timestamp).toLocaleString('es-CL')}</td>
      <td><strong>${l.nombre || '—'}</strong></td>
      <td>${l.telefono || '—'}</td>
      <td>${l.email || '—'}</td>
      <td>${(l.whatsapp || '').replace('whatsapp:', '')}</td>
      <td>${mapaProyecto[l.proyecto] || '—'}</td>
      <td>${mapaProposito[l.proposito] || '—'}</td>
      <td>${l.rentaEsperada || l.grupoFamiliar || '—'}</td>
      <td>${l.dormitorios || '—'}</td>
      <td>${l.entrega || '—'}</td>
      <td>${l.presupuesto || '—'}</td>
      <td>${mapaFin[l.financiamiento] || '—'}</td>
      <td>${l.ingresoMensual || '—'}</td>
      <td>${l.pie || '—'}</td>
      <td>${l.propiedadesActuales || '—'}</td>
    </tr>`).join('');

  const total = leads.length;
  const inversion = leads.filter((l) => l.proposito === 'inversion').length;
  const vivienda = leads.filter((l) => l.proposito === 'vivienda_propia').length;
  const credito = leads.filter((l) => l.financiamiento === 'credito_hipotecario').length;
  const laFlorida = leads.filter((l) => l.proyecto === 'la_florida').length;
  const stgo = leads.filter((l) => l.proyecto === 'santiago_centro').length;
  const macul = leads.filter((l) => l.proyecto === 'macul').length;

  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leads – Avance Inmobiliario</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f2f5;color:#1a1a2e}
    header{background:linear-gradient(135deg,#1a3c5e,#2e6da4);color:#fff;padding:20px 30px}
    header h1{font-size:1.3rem;font-weight:700}
    header p{font-size:.82rem;opacity:.75;margin-top:4px}
    .container{padding:24px 30px}
    .stats{display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap}
    .stat{background:#fff;border-radius:10px;padding:16px 20px;flex:1;min-width:120px;box-shadow:0 1px 4px rgba(0,0,0,.08);border-top:3px solid #2e6da4}
    .stat .val{font-size:2rem;font-weight:700;color:#1a3c5e}
    .stat .lbl{font-size:.75rem;color:#666;margin-top:3px}
    .card{background:#fff;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden}
    .card-header{padding:14px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
    .card-header h2{font-size:.95rem;font-weight:600}
    a.btn{background:#1a3c5e;color:#fff;text-decoration:none;padding:7px 14px;border-radius:6px;font-size:.82rem}
    table{width:100%;border-collapse:collapse;font-size:.78rem}
    th{background:#f7f8fa;padding:9px 10px;text-align:left;font-weight:600;color:#444;border-bottom:2px solid #eee;white-space:nowrap}
    td{padding:9px 10px;border-bottom:1px solid #f0f0f0;vertical-align:top}
    tr:hover td{background:#f0f7ff}
    .empty{text-align:center;padding:40px;color:#999}
    @media(max-width:700px){.container{padding:16px}table{font-size:.7rem}th,td{padding:7px 5px}}
  </style>
</head>
<body>
  <header>
    <h1>🏠 Avance Inmobiliario — Panel de Leads</h1>
    <p>Consultas recibidas vía WhatsApp · Actualizado automáticamente</p>
  </header>
  <div class="container">
    <div class="stats">
      <div class="stat"><div class="val">${total}</div><div class="lbl">Total leads</div></div>
      <div class="stat"><div class="val">${inversion}</div><div class="lbl">Inversión</div></div>
      <div class="stat"><div class="val">${vivienda}</div><div class="lbl">Vivienda propia</div></div>
      <div class="stat"><div class="val">${credito}</div><div class="lbl">Necesitan crédito</div></div>
      <div class="stat"><div class="val">${laFlorida}</div><div class="lbl">La Florida</div></div>
      <div class="stat"><div class="val">${stgo}</div><div class="lbl">Santiago Centro</div></div>
      <div class="stat"><div class="val">${macul}</div><div class="lbl">Macul</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>Leads (más recientes primero)</h2>
        <a class="btn" href="?key=${ADMIN_PASSWORD}&format=csv">⬇️ Exportar CSV</a>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr>
            <th>Fecha</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>WhatsApp</th>
            <th>Proyecto</th><th>Propósito</th><th>Renta/Grupo</th><th>Dorm.</th>
            <th>Entrega</th><th>Presupuesto</th><th>Financiamiento</th>
            <th>Ingreso mensual</th><th>Pie</th><th>Propiedades</th>
          </tr></thead>
          <tbody>${filas || '<tr><td colspan="15" class="empty">Aún no hay leads registrados.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`);
});

// Exportar CSV
app.get('/admin/leads', verificarPassword, (req, res) => {
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')); } catch { leads = []; }
  }
  const header = 'Fecha,Nombre,Telefono,Email,WhatsApp,Proyecto,Proposito,RentaEsperada,GrupoFamiliar,Dormitorios,Entrega,Presupuesto,Financiamiento,IngresoMensual,Pie,PropiedadesActuales';
  const rows = leads.map((l) => [
    l.timestamp, l.nombre || '', l.telefono || '', l.email || '',
    (l.whatsapp || '').replace('whatsapp:', ''),
    l.proyecto || '', l.proposito || '', l.rentaEsperada || '', l.grupoFamiliar || '',
    l.dormitorios || '', l.entrega || '', l.presupuesto || '',
    l.financiamiento || '', l.ingresoMensual || '', l.pie || '', l.propiedadesActuales || '',
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-avance.csv"');
  res.send('﻿' + [header, ...rows].join('\n'));
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────────────────');
  console.log('✅  Avance Inmobiliario WhatsApp Bot – ACTIVO');
  console.log(`🌐  Servidor: http://localhost:${PORT}`);
  console.log(`🔗  Webhook: POST http://TU_DOMINIO:${PORT}/webhook`);
  console.log(`🔒  Leads: http://localhost:${PORT}/admin/leads?key=${ADMIN_PASSWORD}`);
  console.log('─────────────────────────────────────────────────────');
});
