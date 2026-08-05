const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, VerticalAlign,
  PageBreak, Footer, Header, PageNumber, LevelFormat, ImageRun,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ---- Logos: se incrustan automáticamente si los archivos están disponibles ----
// Nombres esperados:  logo-colegio.png  (Colegio San Guillermo)
//                     logo-core.png     (CORE AI)
const DIRS_LOGO = ['/mnt/user-data/uploads', '/home/user/ali/propuestas/san-guillermo/assets',
                   '/home/user/ali/assets', '/home/user/ali', process.cwd()];
const EXT_LOGO = { '.png': 'png', '.jpg': 'jpg', '.jpeg': 'jpg', '.gif': 'gif', '.bmp': 'bmp' };

function buscarLogo(patron, excluir) {
  for (const d of DIRS_LOGO) {
    let files = [];
    try { files = fs.readdirSync(d).sort(); } catch (e) { continue; }
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (!EXT_LOGO[ext]) continue;
      if (excluir && excluir.test(f)) continue;
      if (!patron.test(f)) continue;
      return { file: path.join(d, f), type: EXT_LOGO[ext] };
    }
  }
  return null;
}

const LOGO_CORE = buscarLogo(/core/i);
// "logo.png" a secas se interpreta como el logo del colegio
const LOGO_COLEGIO = buscarLogo(/colegio|guillermo|escudo|isotipo|csg|^logo\./i, /core/i);

const NAVY = '1F3864';
const BLUE = '2E75B6';
const LIGHT = 'EAF0F8';
const GRAY = 'F2F2F2';
const TEXT = '333333';
const GREEN = '2E7D46';

const CONTENT_W = 9360; // 6.5" en DXA

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

const thinBorders = (color = 'BFBFBF') => ({
  top: { style: BorderStyle.SINGLE, size: 4, color },
  bottom: { style: BorderStyle.SINGLE, size: 4, color },
  left: { style: BorderStyle.SINGLE, size: 4, color },
  right: { style: BorderStyle.SINGLE, size: 4, color },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color },
});

// ---------- helpers ----------
const P = (text, opts = {}) => new Paragraph({
  alignment: opts.align,
  spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: opts.line ?? 276 },
  indent: opts.indent,
  border: opts.border,
  shading: opts.shading,
  children: [new TextRun({
    text,
    size: opts.size ?? 21,
    bold: opts.bold,
    italics: opts.italics,
    color: opts.color ?? TEXT,
    font: 'Calibri',
  })],
});

const RichP = (runs, opts = {}) => new Paragraph({
  alignment: opts.align,
  spacing: { before: opts.before ?? 0, after: opts.after ?? 120, line: opts.line ?? 276 },
  indent: opts.indent,
  shading: opts.shading,
  border: opts.border,
  children: runs.map(r => new TextRun({
    text: r.t, bold: r.b, italics: r.i, size: r.size ?? 21,
    color: r.c ?? TEXT, font: 'Calibri',
  })),
});

const H1 = (num, text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 360, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 6 } },
  children: [
    new TextRun({ text: `${num}. `, bold: true, size: 30, color: BLUE, font: 'Calibri' }),
    new TextRun({ text, bold: true, size: 30, color: NAVY, font: 'Calibri' }),
  ],
});

const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 280, after: 140 },
  children: [new TextRun({ text, bold: true, size: 24, color: NAVY, font: 'Calibri' })],
});

const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text, bold: true, size: 21, color: BLUE, font: 'Calibri' })],
});

const Bullet = (text, opts = {}) => new Paragraph({
  numbering: { reference: 'vinetas', level: opts.level ?? 0 },
  spacing: { after: 80, line: 276 },
  children: [new TextRun({ text, size: 21, color: TEXT, font: 'Calibri' })],
});

const BulletRich = (runs, opts = {}) => new Paragraph({
  numbering: { reference: 'vinetas', level: opts.level ?? 0 },
  spacing: { after: 80, line: 276 },
  children: runs.map(r => new TextRun({
    t: undefined, text: r.t, bold: r.b, italics: r.i, size: 21, color: r.c ?? TEXT, font: 'Calibri',
  })),
});

const cell = (children, opts = {}) => new TableCell({
  width: { size: opts.w, type: WidthType.DXA },
  columnSpan: opts.span,
  shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 100, bottom: 100, left: 120, right: 120 },
  children,
});

const tcell = (text, opts = {}) => cell([
  new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { after: 0, line: 260 },
    children: [new TextRun({
      text, bold: opts.bold, size: opts.size ?? 20,
      color: opts.color ?? TEXT, font: 'Calibri',
    })],
  }),
], opts);

// caja de etapa del embudo (número arriba, nombre abajo)
const etapaCell = (num, nombre, fill, color) => cell([
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 20 },
    children: [new TextRun({ text: num, bold: true, size: 24, color, font: 'Calibri' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 0 },
    children: [new TextRun({ text: nombre, bold: true, size: 19, color, font: 'Calibri' })],
  }),
], { w: 1872, fill });

const spacer = (h = 200) => new Paragraph({ spacing: { after: h }, children: [new TextRun({ text: '', size: 2 })] });

// ================= PORTADA =================
// Devuelve el logo real si el archivo existe, o un marco punteado reservado
const logoOMarco = (logo, etiqueta, px, before) => logo
  ? [new Paragraph({
      spacing: { before, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({
        data: fs.readFileSync(logo.file),
        type: logo.type,
        transformation: { width: px, height: px },
      })],
    })]
  : [
      new Paragraph({
        spacing: { before, after: 0 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '', size: 2 })],
      }),
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: px * 15, type: WidthType.DXA },
        columnWidths: [px * 15],
        borders: {
          top: { style: BorderStyle.DASHED, size: 6, color: 'BFBFBF' },
          bottom: { style: BorderStyle.DASHED, size: 6, color: 'BFBFBF' },
          left: { style: BorderStyle.DASHED, size: 6, color: 'BFBFBF' },
          right: { style: BorderStyle.DASHED, size: 6, color: 'BFBFBF' },
        },
        rows: [new TableRow({
          height: { value: px * 14, rule: 'atLeast' },
          children: [new TableCell({
            width: { size: px * 15, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { after: 40 },
                children: [new TextRun({ text: 'LOGO', bold: true, size: 18, color: 'BFBFBF', font: 'Calibri', characterSpacing: 60 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER, spacing: { after: 0 },
                children: [new TextRun({ text: etiqueta, size: 14, italics: true, color: 'BFBFBF', font: 'Calibri' })],
              }),
            ],
          })],
        })],
      }),
    ];

const portada = [
  // Espacio reservado para membrete institucional
  new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '', size: 2 })] }),
  new Paragraph({
    spacing: { before: 400, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: '[ Espacio reservado para membrete institucional ]',
      size: 16, color: 'BFBFBF', italics: true, font: 'Calibri',
    })],
  }),
  ...logoOMarco(LOGO_COLEGIO, 'Colegio San Guillermo', 130, 500),
  new Paragraph({
    spacing: { before: 500, after: 0 },
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: BLUE, space: 10 } },
    children: [new TextRun({
      text: 'PROPUESTA COMERCIAL', bold: true, size: 26, color: BLUE,
      font: 'Calibri', characterSpacing: 60,
    })],
  }),
  new Paragraph({
    spacing: { before: 300, after: 80 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Optimización del Proceso de Matrículas',
      bold: true, size: 48, color: NAVY, font: 'Calibri',
    })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'mediante automatización con Inteligencia Artificial',
      size: 26, color: BLUE, font: 'Calibri',
    })],
  }),
  new Paragraph({
    spacing: { before: 340, after: 60 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Preparada para', size: 19, color: '808080', font: 'Calibri' })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Colegio San Guillermo', bold: true, size: 30, color: NAVY, font: 'Calibri' })],
  }),
  new Paragraph({
    spacing: { after: 20 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'RBD 12076-6', size: 20, color: TEXT, font: 'Calibri' })],
  }),
  new Paragraph({
    spacing: { after: 360 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'El Silo 3014, Bajos de Mena, Puente Alto', size: 20, color: TEXT, font: 'Calibri' })],
  }),
];

// Bloque emisor: CORE AI presenta la propuesta
const bloqueEmisor = [
  ...logoOMarco(LOGO_CORE, 'CORE AI', 80, 420),
  new Paragraph({
    spacing: { before: 160, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Propuesta elaborada y presentada por', size: 17, color: '808080', font: 'Calibri' })],
  }),
  new Paragraph({
    spacing: { before: 40, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'CORE AI', bold: true, size: 26, color: NAVY, font: 'Calibri', characterSpacing: 40,
    })],
  }),
  new Paragraph({
    spacing: { before: 40, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Automatización de procesos con inteligencia artificial',
      size: 17, italics: true, color: '808080', font: 'Calibri',
    })],
  }),
];

const portadaTabla = new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [2900, 6460],
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
  },
  rows: [
    new TableRow({ children: [
      tcell('Preparada por', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
      tcell('CORE AI — Automatización de procesos con inteligencia artificial', { w: 6460 }),
    ]}),
    new TableRow({ children: [
      tcell('Dirigida a', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
      tcell('Sr. Enzo Ramírez Schuchhardt — Sostenedor', { w: 6460 }),
    ]}),
    new TableRow({ children: [
      tcell('', { w: 2900, fill: LIGHT }),
      tcell('Sr. Andrés Reyes — Director', { w: 6460 }),
    ]}),
    new TableRow({ children: [
      tcell('Alcance', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
      tcell('Exclusivamente el proceso de matrículas: captación, información, agendamiento, documentación y confirmación', { w: 6460 }),
    ]}),
    new TableRow({ children: [
      tcell('Fecha', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
      tcell('Agosto de 2026', { w: 6460 }),
    ]}),
    new TableRow({ children: [
      tcell('Validez de la oferta', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
      tcell('30 días corridos desde la fecha de emisión', { w: 6460 }),
    ]}),
  ],
});

// ================= 1. RESUMEN + 2. DIAGNÓSTICO =================
const resumen = [
  H1(1, 'Resumen ejecutivo'),
  P('El presente documento propone al Colegio San Guillermo un sistema de automatización con inteligencia artificial orientado a un único objetivo: que ningún apoderado interesado en matricular a su hijo o hija se pierda por falta de respuesta oportuna o de seguimiento.'),
  P('La propuesta no interviene procesos académicos ni la administración general del establecimiento. Se concentra íntegramente en el recorrido que hace un apoderado desde su primer contacto con el colegio hasta que la matrícula queda cerrada y confirmada.'),
  spacer(80),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    borders: noBorders,
    rows: [new TableRow({ children: [
      cell([
        P('Atención inmediata', { bold: true, color: NAVY, size: 22, align: AlignmentType.CENTER, after: 60 }),
        P('Respuesta por WhatsApp las 24 horas, todos los días, durante el período de matrículas.', { size: 19, align: AlignmentType.CENTER, after: 0 }),
      ], { w: 3120, fill: LIGHT }),
      cell([
        P('Seguimiento automático', { bold: true, color: NAVY, size: 22, align: AlignmentType.CENTER, after: 60 }),
        P('Recordatorios y llamadas con IA para recuperar a quienes dejan el proceso a medias.', { size: 19, align: AlignmentType.CENTER, after: 0 }),
      ], { w: 3120, fill: GRAY }),
      cell([
        P('Visibilidad total', { bold: true, color: NAVY, size: 22, align: AlignmentType.CENTER, after: 60 }),
        P('Un tablero donde el sostenedor ve, en tiempo real, en qué etapa está cada postulante.', { size: 19, align: AlignmentType.CENTER, after: 0 }),
      ], { w: 3120, fill: LIGHT }),
    ]})],
  }),
  spacer(160),
  P('La inversión se estructura en dos componentes claramente separados: una implementación por única vez y una mantención mensual, con tres alternativas de paquete para que el colegio elija según su realidad presupuestaria.'),
];

const diagnostico = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(2, 'Diagnóstico del proceso de matrículas actual'),
  P('A partir de la información entregada por la dirección del establecimiento, el proceso de matrículas presenta hoy las siguientes características:'),

  H2('2.1  Un proceso enteramente manual'),
  P('El apoderado que se interesa por el colegio debe llamar por teléfono o acercarse presencialmente a las dependencias. Toda la carga de informar —requisitos, documentos, fechas, aranceles, vacantes disponibles— recae en el personal administrativo, que atiende estas consultas junto a sus demás funciones.'),
  P('Esto genera tres efectos concretos:'),
  Bullet('El apoderado que llama fuera del horario de atención, en fin de semana o durante el recreo, simplemente no recibe respuesta.'),
  Bullet('Las mismas preguntas se responden decenas de veces, consumiendo horas de personal en información repetitiva.'),
  Bullet('La calidad de la respuesta depende de quién conteste el teléfono ese día.'),

  H2('2.2  Demoras en responder consultas'),
  P('Cuando la consulta no puede resolverse en el momento, queda pendiente. En un contexto donde el apoderado está evaluando dos o tres colegios en paralelo, la demora en responder equivale con frecuencia a perder la matrícula: el establecimiento que responde primero suele ser el que matricula.'),

  H2('2.3  Ausencia de seguimiento — el problema central'),
  P('Este es, a nuestro juicio, el punto más crítico y el de mayor impacto económico para el establecimiento.'),
  P('Hoy no existe un registro estructurado de los apoderados que se contactaron con el colegio. Cuando un apoderado consulta y no vuelve, esa consulta simplemente desaparece: nadie lo llama, nadie le escribe, nadie sabe por qué no continuó.'),
  P('El seguimiento está ausente en los dos momentos donde más se necesita:'),
  spacer(60),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    borders: thinBorders('D0D7E5'),
    rows: [
      new TableRow({ children: [
        tcell('ANTES de la matrícula', { w: 4680, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER, size: 21 }),
        tcell('DESPUÉS de la matrícula', { w: 4680, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER, size: 21 }),
      ]}),
      new TableRow({ children: [
        cell([
          P('El apoderado pidió información y no volvió a comunicarse.', { size: 20, after: 60 }),
          P('Agendó una hora y no se presentó.', { size: 20, after: 60 }),
          P('Comenzó a reunir los documentos y quedó a medio camino.', { size: 20, after: 0 }),
        ], { w: 4680 }),
        cell([
          P('No se confirma formalmente que la matrícula quedó cerrada.', { size: 20, after: 60 }),
          P('No se recuerdan los trámites finales pendientes (documentos, uniforme, fecha de inicio).', { size: 20, after: 60 }),
          P('No se mide la experiencia del apoderado en el proceso.', { size: 20, after: 0 }),
        ], { w: 4680 }),
      ]}),
    ],
  }),
  spacer(160),
  P('En términos simples: el colegio hace el esfuerzo de captar el interés del apoderado, pero no cuenta con un mecanismo que lo acompañe hasta el final. Cada apoderado que se cae a mitad de camino representa una matrícula perdida y, con ella, la subvención anual asociada a ese estudiante.'),

  H2('2.4  Falta de información para la toma de decisiones'),
  P('Al no existir registro, tampoco existen indicadores. La dirección y el sostenedor no disponen hoy de respuestas a preguntas básicas de gestión:'),
  Bullet('¿Cuántos apoderados se contactaron este mes con el colegio?'),
  Bullet('¿En qué etapa del proceso se pierden con mayor frecuencia?'),
  Bullet('¿Qué porcentaje de los interesados termina efectivamente matriculado?'),
  Bullet('¿Cuántos cupos quedan disponibles por curso y a cuántos días del inicio del año escolar?'),
  spacer(60),
  RichP([
    { t: 'En síntesis: ', b: true, c: NAVY },
    { t: 'el proceso de matrículas del Colegio San Guillermo depende hoy de la disponibilidad de personas, no de un sistema. La propuesta que sigue busca invertir esa relación, liberando al equipo administrativo de la tarea repetitiva y asegurando que cada apoderado interesado reciba seguimiento hasta el cierre de su matrícula.' },
  ], { shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' } }),
];

// ================= 3. SOLUCIÓN =================
const solucion = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(3, 'Solución propuesta'),
  P('Proponemos implementar un sistema de gestión y automatización de matrículas construido sobre nuestra plataforma CORE AI, que integra la gestión de contactos, las automatizaciones y la inteligencia artificial conversacional y de voz en un solo lugar. Todo el sistema opera exclusivamente dentro del proceso de matrícula.'),
  P('La solución se compone de cuatro piezas que funcionan de manera integrada:'),

  H2('3.1  Asistente virtual de matrículas en WhatsApp'),
  P('Un asistente conversacional con inteligencia artificial atiende, desde el número de WhatsApp del colegio, a todo apoderado que consulte por matrícula. Responde en lenguaje natural, en cualquier horario, y es capaz de sostener una conversación completa sin intervención humana.'),
  H3('Responde consultas frecuentes del proceso'),
  Bullet('Requisitos de postulación y matrícula por nivel.'),
  Bullet('Documentación exigida (certificado de nacimiento, informe de notas, certificado de personalidad, entre otros).'),
  Bullet('Aranceles, gratuidad y condiciones de financiamiento del establecimiento.'),
  Bullet('Fechas y plazos del período de matrículas.'),
  Bullet('Vacantes disponibles por curso, actualizadas según el registro del colegio.'),
  Bullet('Ubicación, horarios de atención y datos de contacto.'),
  H3('Califica al apoderado'),
  P('Durante la misma conversación, el asistente recoge de manera natural la información que el colegio necesita para gestionar la postulación:'),
  Bullet('Curso o nivel al que postula y nombre del estudiante.'),
  Bullet('Comuna de residencia.'),
  Bullet('Si proviene de otro establecimiento y cuál.'),
  Bullet('Datos de contacto del apoderado (nombre, teléfono, correo).'),
  H3('Agenda la hora de matrícula o entrevista'),
  P('El asistente ofrece los horarios efectivamente disponibles del calendario del colegio, agenda directamente en él y envía la confirmación al apoderado, además de recordatorios previos a la cita. El equipo administrativo ve la hora agendada en su calendario sin tener que registrarla manualmente.'),
  RichP([
    { t: 'Traspaso a una persona: ', b: true, c: NAVY },
    { t: 'cuando la consulta excede lo que el asistente puede resolver, o cuando el apoderado pide hablar con alguien del colegio, la conversación se deriva automáticamente al personal designado, con todo el historial disponible.' },
  ], { shading: { type: ShadingType.CLEAR, fill: GRAY, color: 'auto' } }),

  H2('3.2  Seguimiento PRE-matrícula'),
  P('Este componente aborda directamente el problema central detectado en el diagnóstico: el apoderado que inicia el proceso y no lo termina.'),
  H3('Secuencias automáticas de recuperación'),
  P('El sistema detecta el punto exacto en que el apoderado se detuvo y activa la secuencia correspondiente:'),
  spacer(60),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3400, 5960],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Situación detectada', { w: 3400, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Acción automática del sistema', { w: 5960, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      new TableRow({ children: [
        tcell('Pidió información y no agendó hora', { w: 3400, fill: GRAY }),
        tcell('Mensaje de WhatsApp a las 24 horas ofreciendo agendar; segundo mensaje a las 72 horas; tercer contacto al quinto día.', { w: 5960 }),
      ]}),
      new TableRow({ children: [
        tcell('Agendó hora y no se presentó', { w: 3400, fill: GRAY }),
        tcell('Mensaje el mismo día ofreciendo reagendar, con horarios alternativos disponibles; recordatorio a las 48 horas.', { w: 5960 }),
      ]}),
      new TableRow({ children: [
        tcell('Tiene documentos pendientes', { w: 3400, fill: GRAY }),
        tcell('Recordatorios escalonados indicando exactamente qué documento falta, a los 2, 5 y 8 días.', { w: 5960 }),
      ]}),
      new TableRow({ children: [
        tcell('No responde WhatsApp', { w: 3400, fill: GRAY }),
        tcell('Llamada telefónica con voz de inteligencia artificial para retomar el contacto.', { w: 5960 }),
      ]}),
      new TableRow({ children: [
        tcell('Se acerca el cierre del período', { w: 3400, fill: GRAY }),
        tcell('Aviso a todos los interesados no matriculados sobre los últimos cupos y la fecha límite.', { w: 5960 }),
      ]}),
    ],
  }),
  spacer(160),
  H3('Llamadas con inteligencia artificial (voz)'),
  P('Para los apoderados que no responden mensajes de texto —una proporción relevante en cualquier proceso de matrícula— el sistema realiza una llamada telefónica con una voz de inteligencia artificial. La llamada:'),
  Bullet('Se presenta claramente como asistente del Colegio San Guillermo.'),
  Bullet('Consulta si el apoderado sigue interesado en la matrícula.'),
  Bullet('Resuelve dudas básicas y ofrece agendar la hora en el momento.'),
  Bullet('Registra el resultado de la llamada en la ficha del apoderado.'),
  Bullet('Deriva a una persona del colegio si el apoderado lo solicita.'),
  P('Estas llamadas se ejecutan en horarios definidos por el colegio y con un tope de intentos, para cuidar la imagen institucional y no incomodar a las familias.', { italics: true, size: 20 }),

  H2('3.3  Seguimiento POST-matrícula'),
  P('Una vez que el apoderado firma la matrícula, el sistema acompaña únicamente el cierre administrativo del proceso. No interviene en la vida escolar posterior del estudiante.'),
  Bullet('Confirmación automática de matrícula exitosa, con el detalle de lo matriculado (estudiante, curso, año).'),
  Bullet('Recordatorio de documentos que quedaron pendientes de entregar, con plazo indicado.'),
  Bullet('Información sobre uniforme y útiles escolares, con los plazos correspondientes.'),
  Bullet('Recordatorio de la fecha de inicio de clases y de la reunión de apoderados inicial, si corresponde.'),
  Bullet('Encuesta breve de satisfacción (3 a 4 preguntas) sobre la experiencia del proceso de matrícula.'),
  P('La encuesta entrega al sostenedor información directa sobre cómo perciben las familias el proceso de ingreso al colegio, y permite corregir puntos de fricción de un período al siguiente.'),

  H2('3.4  CRM de matrículas en CORE AI'),
  P('Todo lo anterior se apoya en un sistema centralizado donde queda registrado cada apoderado que se contacta con el colegio, en qué etapa está y qué se ha hecho con él.'),
  H3('Embudo visual de matrículas'),
  P('Un tablero muestra a cada apoderado como una tarjeta que avanza por las etapas del proceso:'),
  spacer(80),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1872, 1872, 1872, 1872, 1872],
    borders: noBorders,
    rows: [new TableRow({ children: [
      etapaCell('1', 'Contacto', 'D6E3F3', NAVY),
      etapaCell('2', 'Interesado', 'C2D6EE', NAVY),
      etapaCell('3', 'Agendado', 'AECAE9', NAVY),
      etapaCell('4', 'Documentos', '9ABDE4', NAVY),
      etapaCell('5', 'Matriculado', GREEN, 'FFFFFF'),
    ]})],
  }),
  spacer(160),
  H3('Automatizaciones por etapa'),
  P('Cada etapa tiene asociadas sus propias comunicaciones automáticas por WhatsApp y correo electrónico, de modo que el apoderado siempre sabe qué falta y el colegio no tiene que recordar a quién le corresponde escribir.'),
  H3('Reportería para el sostenedor'),
  P('Un informe periódico, disponible en cualquier momento y enviado automáticamente cada semana, responde las preguntas de gestión que hoy no tienen respuesta:'),
  Bullet('Cantidad de apoderados contactados en el período.'),
  Bullet('Tasa de conversión por etapa: dónde exactamente se caen los apoderados.'),
  Bullet('Tiempo promedio entre el primer contacto y la matrícula cerrada.'),
  Bullet('Cupos ocupados frente a cupos disponibles, curso por curso.'),
  Bullet('Origen de los apoderados (comuna, colegio de procedencia, canal de contacto).'),
  Bullet('Resultado de la encuesta de satisfacción del proceso.'),
];

// ================= 4. PLATAFORMAS =================
const arrowRow = (label) => new TableRow({ children: [
  cell([
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: '▼', size: 20, color: BLUE, font: 'Calibri' })],
    }),
    ...(label ? [new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: label, size: 16, italics: true, color: '808080', font: 'Calibri' })],
    })] : []),
  ], { w: CONTENT_W, span: 1 }),
]});

const platRow = (nombre, funcion, alt) => new TableRow({ children: [
  cell([P(nombre, { bold: true, size: 19, color: NAVY, after: 0 })], { w: 3100, fill: alt ? GRAY : undefined }),
  cell([P(funcion, { size: 19, after: 0 })], { w: 6260, fill: alt ? GRAY : undefined }),
]});

const plataformas = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(4, 'Plataformas y tecnologías que se utilizarán'),
  P('A continuación se detallan todas las plataformas involucradas en la solución y la función específica que cumple cada una dentro del proceso de matrículas. Todas ellas son administradas y configuradas por nosotros: el colegio no debe contratar ni gestionar servicios por separado.'),

  H2('4.1  Plataforma central'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3100, 6260],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Plataforma', { w: 3100, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Función en el proceso de matrículas', { w: 6260, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      platRow('CORE AI', 'Corazón del sistema. Contiene el CRM de matrículas, el embudo visual por etapas, la ficha de cada apoderado, las automatizaciones de WhatsApp y correo, el calendario de agendamiento, los formularios de postulación y los informes para el sostenedor.'),
    ],
  }),

  H2('4.2  Canales de comunicación con el apoderado'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3100, 6260],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Plataforma', { w: 3100, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Función en el proceso de matrículas', { w: 6260, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      platRow('WhatsApp Business API (Meta)', 'Canal oficial y verificado por el cual el asistente conversa con los apoderados. Permite el uso del número institucional del colegio con respaldo de Meta, sin depender de un teléfono encendido.'),
      platRow('Twilio', 'Proveedor de telefonía. Entrega el número saliente para las llamadas con inteligencia artificial y el envío de mensajes de texto (SMS) cuando el apoderado no tiene WhatsApp.', true),
      platRow('Correo electrónico transaccional (Mailgun o el correo institucional del colegio)', 'Envío de confirmaciones de matrícula, listados de documentos requeridos y recordatorios formales que quedan como respaldo escrito.'),
      platRow('Formularios y páginas de captación CORE AI', 'Formulario de pre-inscripción y página de información de matrículas, enlazables desde el sitio web y las redes sociales del colegio.', true),
    ],
  }),

  H2('4.3  Inteligencia artificial'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3100, 6260],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Plataforma', { w: 3100, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Función en el proceso de matrículas', { w: 6260, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      platRow('Modelo de lenguaje (Claude de Anthropic u OpenAI)', 'Motor que comprende lo que escribe el apoderado y redacta la respuesta en lenguaje natural, dentro de los límites de información definidos por el colegio.'),
      platRow('Vapi o Retell AI', 'Motor de las llamadas telefónicas: sostiene la conversación de voz en tiempo real, entiende las respuestas del apoderado y registra el resultado de la llamada.', true),
      platRow('ElevenLabs', 'Voz sintética en español chileno, natural y cordial, utilizada en las llamadas de recuperación de apoderados.'),
      platRow('Base de conocimiento del colegio', 'Repositorio con requisitos, aranceles, documentos, fechas y vacantes. Es la única fuente que el asistente puede usar para responder, lo que evita respuestas inventadas o desactualizadas.', true),
    ],
  }),

  H2('4.4  Integraciones y reportería'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3100, 6260],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Plataforma', { w: 3100, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Función en el proceso de matrículas', { w: 6260, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      platRow('Google Calendar', 'Sincronización de las horas de matrícula y entrevista con el calendario real del equipo administrativo, evitando dobles agendamientos.'),
      platRow('Google Sheets', 'Planilla viva de postulantes y de cupos por curso, para quienes en el colegio prefieran trabajar sobre una planilla conocida.', true),
      platRow('n8n', 'Motor de integraciones a medida. Conecta el sistema de matrículas con planillas, sistemas internos del colegio o el SIGE cuando se requiera un traspaso de datos específico.'),
      platRow('Looker Studio', 'Panel de indicadores del sostenedor: conversión por etapa, tiempo promedio de matrícula y ocupación de cupos por curso, actualizado automáticamente.', true),
      platRow('Aplicación móvil CORE AI', 'Permite al sostenedor y al director revisar el estado de las matrículas y responder conversaciones desde el teléfono, en cualquier momento.'),
    ],
  }),
  spacer(160),
  RichP([
    { t: 'Sobre las licencias: ', b: true, c: NAVY },
    { t: 'todas las plataformas señaladas se contratan y administran bajo nuestra cuenta, y su costo está considerado dentro de la mantención mensual. El colegio solo asume el consumo variable de mensajes de WhatsApp y minutos de llamada, detallado en el punto 7.3.' },
  ], { shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' } }),
  spacer(120),
  H2('4.5  Cómo se conectan entre sí'),
  P('El esquema siguiente muestra el recorrido de la información: los canales por donde llega el apoderado, la plataforma que centraliza todo y el equipo del colegio que recibe el resultado ya ordenado.'),
  spacer(80),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: noBorders,
    rows: [
      new TableRow({ children: [cell([
        P('EL APODERADO LLEGA POR', { bold: true, size: 18, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 }),
      ], { w: CONTENT_W, fill: NAVY })]}),
      new TableRow({ children: [cell([
        P('WhatsApp   ·   Llamada telefónica   ·   Formulario web   ·   Presencial', { size: 19, align: AlignmentType.CENTER, after: 0, color: NAVY }),
      ], { w: CONTENT_W, fill: 'EAF0F8' })]}),
      arrowRow(),
      new TableRow({ children: [cell([
        P('CORE AI  ·  PLATAFORMA + INTELIGENCIA ARTIFICIAL', { bold: true, size: 20, color: 'FFFFFF', align: AlignmentType.CENTER, after: 40 }),
        P('Responde · Califica · Agenda · Registra en el CRM · Envía seguimientos · Llama', { size: 18, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 }),
      ], { w: CONTENT_W, fill: BLUE })]}),
      arrowRow(),
      new TableRow({ children: [cell([
        P('EL EQUIPO DEL COLEGIO RECIBE', { bold: true, size: 18, color: 'FFFFFF', align: AlignmentType.CENTER, after: 0 }),
      ], { w: CONTENT_W, fill: GREEN })]}),
      new TableRow({ children: [cell([
        P('Horas agendadas en el calendario   ·   Fichas completas de apoderados   ·   Informe de cupos y conversión', { size: 19, align: AlignmentType.CENTER, after: 0, color: '1E5631' }),
      ], { w: CONTENT_W, fill: 'E3F1E7' })]}),
    ],
  }),
];

// ================= 5. FLUJO =================
const stepRow = (num, title, detail, fill, textColor) => new TableRow({ children: [
  cell([
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 30 },
      children: [new TextRun({ text: `${num}.  ${title}`, bold: true, size: 21, color: textColor ?? NAVY, font: 'Calibri' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 0 },
      children: [new TextRun({ text: detail, size: 18, color: textColor ?? TEXT, font: 'Calibri' })],
    }),
  ], { w: CONTENT_W, fill }),
]});

const bandRow = (text, fill) => new TableRow({ children: [
  cell([new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 0 },
    children: [new TextRun({ text, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri', characterSpacing: 40 })],
  })], { w: CONTENT_W, fill }),
]});

const diagrama = new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [CONTENT_W],
  borders: noBorders,
  rows: [
    bandRow('ETAPA PREVIA  ·  DEL PRIMER CONTACTO A LA MATRÍCULA', NAVY),
    arrowRow(),
    stepRow(1, 'Primer contacto del apoderado', 'Escribe al WhatsApp del colegio, llama o llega presencialmente. Queda registrado automáticamente.', 'EAF0F8'),
    arrowRow('el asistente responde en segundos'),
    stepRow(2, 'Información y calificación', 'El asistente resuelve sus dudas y registra curso al que postula, comuna y colegio de procedencia.', 'E1EAF6'),
    arrowRow('si no avanza → recordatorio automático a las 24 h'),
    stepRow(3, 'Agendamiento de hora', 'Se agenda entrevista o matrícula presencial en el calendario del colegio, con confirmación y recordatorios.', 'D8E4F4'),
    arrowRow('si no asiste → mensaje de reagendamiento el mismo día'),
    stepRow(4, 'Entrevista / atención presencial', 'El equipo del colegio recibe al apoderado con toda su información ya registrada en la ficha.', 'CFDEF1'),
    arrowRow('si no responde → llamada con IA a las 72 h'),
    stepRow(5, 'Reunión y revisión de documentos', 'El sistema avisa qué documentos faltan y envía recordatorios escalonados hasta completarlos.', 'C6D8EF'),
    arrowRow(),
    stepRow(6, 'MATRÍCULA CERRADA', 'El estudiante queda matriculado y el cupo del curso se descuenta automáticamente.', GREEN, 'FFFFFF'),
    arrowRow(),
    bandRow('ETAPA POSTERIOR  ·  DEL CIERRE A LA CONFIRMACIÓN FINAL', GREEN),
    arrowRow(),
    stepRow(7, 'Confirmación de matrícula', 'Mensaje automático de bienvenida con el detalle de la matrícula registrada.', 'E3F1E7'),
    arrowRow(),
    stepRow(8, 'Trámites finales', 'Recordatorios de documentos pendientes, uniforme, útiles y fecha de inicio de clases.', 'D9EBDF'),
    arrowRow(),
    stepRow(9, 'Encuesta de satisfacción', 'Tres o cuatro preguntas sobre la experiencia del proceso de matrícula. El resultado llega al sostenedor.', 'CFE5D7'),
  ],
});

const flujo = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(5, 'Flujo del proceso de matrícula'),
  P('El siguiente esquema muestra el recorrido completo del apoderado, desde que toma contacto por primera vez con el colegio hasta que su matrícula queda confirmada y cerrada. En gris se indica la acción automática del sistema cuando el apoderado se detiene.'),
  spacer(120),
  diagrama,
  new Paragraph({ children: [new PageBreak()] }),
  H2('5.1  Qué cambia respecto de la situación actual'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2600, 3380, 3380],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Momento del proceso', { w: 2600, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Hoy', { w: 3380, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Con el sistema propuesto', { w: 3380, bold: true, fill: NAVY, color: 'FFFFFF' }),
      ]}),
      new TableRow({ children: [
        tcell('Primer contacto', { w: 2600, bold: true, fill: GRAY }),
        tcell('Depende del horario y de que alguien conteste.', { w: 3380 }),
        tcell('Respuesta inmediata, 24/7, con información completa y uniforme.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Registro del interesado', { w: 2600, bold: true, fill: GRAY }),
        tcell('No queda registro estructurado.', { w: 3380 }),
        tcell('Ficha automática con curso, comuna, procedencia y fecha de contacto.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Agendamiento', { w: 2600, bold: true, fill: GRAY }),
        tcell('Manual, sujeto a coordinación telefónica.', { w: 3380 }),
        tcell('El propio apoderado agenda en el calendario del colegio.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Apoderado que se detiene', { w: 2600, bold: true, fill: GRAY }),
        tcell('Se pierde, sin que nadie lo advierta.', { w: 3380 }),
        tcell('Secuencia automática de recuperación por WhatsApp y llamada con IA.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Documentos pendientes', { w: 2600, bold: true, fill: GRAY }),
        tcell('Se recuerdan cuando alguien se acuerda.', { w: 3380 }),
        tcell('Recordatorios escalonados automáticos hasta completar la carpeta.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Cierre de matrícula', { w: 2600, bold: true, fill: GRAY }),
        tcell('Sin confirmación formal al apoderado.', { w: 3380 }),
        tcell('Confirmación automática, trámites finales y encuesta de satisfacción.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
      new TableRow({ children: [
        tcell('Control de gestión', { w: 2600, bold: true, fill: GRAY }),
        tcell('Sin indicadores disponibles.', { w: 3380 }),
        tcell('Informe semanal de conversión y ocupación de cupos por curso.', { w: 3380, fill: 'F0F7F2' }),
      ]}),
    ],
  }),
];

// ================= 5. CRONOGRAMA =================
const cronoRow = (sem, titulo, detalle, resp, fill) => new TableRow({ children: [
  tcell(sem, { w: 1400, bold: true, fill: fill ?? LIGHT, align: AlignmentType.CENTER, color: NAVY }),
  cell([
    P(titulo, { bold: true, size: 20, after: 40, color: NAVY }),
    P(detalle, { size: 19, after: 0 }),
  ], { w: 5760 }),
  tcell(resp, { w: 2200, size: 18, align: AlignmentType.CENTER }),
]});

const cronograma = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(6, 'Cronograma de implementación'),
  P('La puesta en marcha completa toma seis semanas desde la firma. El asistente de WhatsApp queda operativo y atendiendo apoderados a partir de la tercera semana; las semanas siguientes se destinan a los seguimientos automáticos, las llamadas con IA y la reportería.'),
  spacer(80),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1400, 5760, 2200],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('Semana', { w: 1400, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER }),
        tcell('Actividad', { w: 5760, bold: true, fill: NAVY, color: 'FFFFFF' }),
        tcell('Participación del colegio', { w: 2200, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER }),
      ]}),
      cronoRow('1', 'Levantamiento y definiciones',
        'Reunión inicial con el sostenedor y la dirección. Se recopilan requisitos de matrícula, documentación exigida, aranceles, calendario del período, vacantes por curso y preguntas frecuentes reales.',
        'Una reunión de 90 minutos y entrega de información'),
      cronoRow('2', 'Configuración de la plataforma',
        'Creación del CRM de matrículas, embudo de etapas, fichas de apoderado, campos personalizados y conexión del número de WhatsApp del colegio.',
        'Autorización del número de WhatsApp', GRAY),
      cronoRow('3', 'Asistente de WhatsApp en marcha',
        'Carga de las respuestas del proceso de matrícula, entrenamiento del asistente, integración con el calendario de agendamiento y pruebas internas. Salida a producción.',
        'Validación de respuestas y pruebas'),
      cronoRow('4', 'Seguimientos automáticos',
        'Construcción de las secuencias pre-matrícula: recuperación de apoderados detenidos, recordatorios de documentos y avisos de cierre de período.',
        'Aprobación de los textos', GRAY),
      cronoRow('5', 'Llamadas con IA y post-matrícula',
        'Configuración de la voz de inteligencia artificial, guion de llamada y horarios permitidos. Secuencias de confirmación, trámites finales y encuesta de satisfacción.',
        'Aprobación del guion de llamada'),
      cronoRow('6', 'Reportería, capacitación y entrega',
        'Panel de indicadores para el sostenedor, informe semanal automático, capacitación al equipo administrativo y entrega de manual de uso.',
        'Capacitación de 2 horas al equipo', GRAY),
    ],
  }),
  spacer(160),
  RichP([
    { t: 'Acompañamiento posterior: ', b: true, c: NAVY },
    { t: 'durante los primeros 30 días posteriores a la entrega se realizan ajustes sin costo adicional, sobre la base del comportamiento real de los apoderados. Es habitual afinar respuestas y tiempos de recordatorio en esas primeras semanas.' },
  ], { shading: { type: ShadingType.CLEAR, fill: GRAY, color: 'auto' } }),
];

// ================= 6. INVERSIÓN =================
const chk = '✔';
const dash = '—';

const featRow = (feature, a, b, c, alt) => new TableRow({ children: [
  tcell(feature, { w: 4560, size: 19, fill: alt ? GRAY : undefined }),
  tcell(a, { w: 1600, align: AlignmentType.CENTER, size: 19, fill: alt ? GRAY : undefined, color: a === dash ? 'A6A6A6' : GREEN, bold: a === chk }),
  tcell(b, { w: 1600, align: AlignmentType.CENTER, size: 19, fill: alt ? GRAY : undefined, color: b === dash ? 'A6A6A6' : GREEN, bold: b === chk }),
  tcell(c, { w: 1600, align: AlignmentType.CENTER, size: 19, fill: alt ? GRAY : undefined, color: c === dash ? 'A6A6A6' : GREEN, bold: c === chk }),
]});

const inversion = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(7, 'Inversión'),
  P('La inversión se estructura en dos componentes independientes:'),
  Bullet('Implementación: pago por única vez, correspondiente al diseño, construcción, puesta en marcha y capacitación.'),
  Bullet('Mantención mensual: soporte, ajustes, monitoreo del sistema y licencia de la plataforma.'),
  spacer(80),
  P('Se presentan tres alternativas para que el establecimiento elija según su realidad presupuestaria y el alcance que desee dar al proceso.'),

  H2('7.1  Alternativas de paquete'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [4560, 1600, 1600, 1600],
    borders: thinBorders(),
    rows: [
      new TableRow({ children: [
        tcell('', { w: 4560, fill: NAVY }),
        tcell('BÁSICO', { w: 1600, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER }),
        tcell('INTERMEDIO', { w: 1600, bold: true, fill: BLUE, color: 'FFFFFF', align: AlignmentType.CENTER }),
        tcell('COMPLETO', { w: 1600, bold: true, fill: NAVY, color: 'FFFFFF', align: AlignmentType.CENTER }),
      ]}),
      new TableRow({ children: [
        tcell('Asistente de WhatsApp para consultas de matrícula', { w: 4560, size: 19 }),
        tcell(chk, { w: 1600, align: AlignmentType.CENTER, color: GREEN, bold: true }),
        tcell(chk, { w: 1600, align: AlignmentType.CENTER, color: GREEN, bold: true }),
        tcell(chk, { w: 1600, align: AlignmentType.CENTER, color: GREEN, bold: true }),
      ]}),
      featRow('Calificación automática del apoderado', chk, chk, chk, true),
      featRow('Agendamiento integrado al calendario del colegio', chk, chk, chk),
      featRow('CRM con embudo visual de matrículas', chk, chk, chk, true),
      featRow('Seguimiento pre-matrícula por WhatsApp', dash, chk, chk),
      featRow('Recordatorios escalonados de documentos', dash, chk, chk, true),
      featRow('Seguimiento post-matrícula y trámites finales', dash, chk, chk),
      featRow('Encuesta de satisfacción del proceso', dash, chk, chk, true),
      featRow('Llamadas con inteligencia artificial (voz)', dash, dash, chk),
      featRow('Reportería semanal automática al sostenedor', dash, dash, chk, true),
      featRow('Panel de cupos ocupados y disponibles por curso', dash, dash, chk),
      featRow('Campañas de reactivación de listas de años anteriores', dash, dash, chk, true),
      featRow('Sesión mensual de revisión con la dirección', dash, dash, chk),
      new TableRow({ children: [
        tcell('IMPLEMENTACIÓN  (pago único)', { w: 4560, bold: true, fill: LIGHT, color: NAVY }),
        tcell('$690.000', { w: 1600, bold: true, fill: LIGHT, align: AlignmentType.CENTER, color: NAVY, size: 21 }),
        tcell('$1.150.000', { w: 1600, bold: true, fill: 'D6E3F3', align: AlignmentType.CENTER, color: NAVY, size: 21 }),
        tcell('$1.690.000', { w: 1600, bold: true, fill: LIGHT, align: AlignmentType.CENTER, color: NAVY, size: 21 }),
      ]}),
      new TableRow({ children: [
        tcell('MANTENCIÓN  (mensual)', { w: 4560, bold: true, fill: LIGHT, color: NAVY }),
        tcell('$95.000', { w: 1600, bold: true, fill: LIGHT, align: AlignmentType.CENTER, color: NAVY, size: 21 }),
        tcell('$180.000', { w: 1600, bold: true, fill: 'D6E3F3', align: AlignmentType.CENTER, color: NAVY, size: 21 }),
        tcell('$290.000', { w: 1600, bold: true, fill: LIGHT, align: AlignmentType.CENTER, color: NAVY, size: 21 }),
      ]}),
    ],
  }),
  P('Valores expresados en pesos chilenos, no incluyen IVA. La mantención se factura mensualmente y considera un compromiso mínimo de seis meses.', { size: 18, italics: true, before: 100 }),
  spacer(60),
  RichP([
    { t: 'Recomendación: ', b: true, c: NAVY },
    { t: 'para el Colegio San Guillermo sugerimos el paquete INTERMEDIO como punto de partida. Incorpora el seguimiento pre y post matrícula, que es donde se concentra la pérdida de apoderados detectada en el diagnóstico, con una inversión acotada. Las llamadas con inteligencia artificial pueden incorporarse más adelante, una vez medido el comportamiento real del primer período.' },
  ], { shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' } }),

  H2('7.2  Qué incluye la mantención mensual'),
  Bullet('Licencia y operación de la plataforma CORE AI.'),
  Bullet('Soporte por WhatsApp y correo en horario hábil, con respuesta dentro del día hábil siguiente.'),
  Bullet('Ajustes de contenido del asistente cuando cambien requisitos, fechas, aranceles o vacantes.'),
  Bullet('Monitoreo del funcionamiento del sistema y corrección de fallas.'),
  Bullet('Actualización de los modelos de inteligencia artificial utilizados.'),
  Bullet('Respaldo de la base de datos de apoderados.'),

  H2('7.3  Condiciones comerciales'),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2900, 6460],
    borders: thinBorders('D0D7E5'),
    rows: [
      new TableRow({ children: [
        tcell('Forma de pago', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('Implementación: 50% a la firma y 50% contra entrega. Mantención: mensual, a partir del mes siguiente a la puesta en marcha.', { w: 6460 }),
      ]}),
      new TableRow({ children: [
        tcell('Plazo de entrega', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('Seis semanas desde la firma y la entrega de la información inicial por parte del colegio.', { w: 6460 }),
      ]}),
      new TableRow({ children: [
        tcell('Garantía', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('30 días de ajustes sin costo posteriores a la entrega.', { w: 6460 }),
      ]}),
      new TableRow({ children: [
        tcell('Propiedad de los datos', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('La base de datos de apoderados y estudiantes es propiedad exclusiva del Colegio San Guillermo y puede exportarse en cualquier momento.', { w: 6460 }),
      ]}),
      new TableRow({ children: [
        tcell('Costos de terceros', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('El envío de mensajes por WhatsApp Business y los minutos de llamada con IA se facturan al costo del proveedor. Para un período de matrículas habitual en un establecimiento de esta matrícula, se estiman entre $15.000 y $40.000 mensuales.', { w: 6460 }),
      ]}),
      new TableRow({ children: [
        tcell('Confidencialidad', { w: 2900, bold: true, fill: LIGHT, color: NAVY }),
        tcell('Toda la información de apoderados y estudiantes se trata conforme a la Ley N° 19.628 sobre protección de la vida privada.', { w: 6460 }),
      ]}),
    ],
  }),
];

// ================= 7. PRÓXIMOS PASOS =================
const pasoRow = (n, titulo, detalle) => new TableRow({ children: [
  cell([new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 0 },
    children: [new TextRun({ text: String(n), bold: true, size: 32, color: 'FFFFFF', font: 'Calibri' })],
  })], { w: 900, fill: BLUE }),
  cell([
    P(titulo, { bold: true, size: 22, color: NAVY, after: 40 }),
    P(detalle, { size: 20, after: 0 }),
  ], { w: 8460 }),
]});

const cierre = [
  new Paragraph({ children: [new PageBreak()] }),
  H1(8, 'Próximos pasos'),
  P('Para avanzar, proponemos el siguiente camino:'),
  spacer(100),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [900, 8460],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'D0D7E5' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      pasoRow(1, 'Reunión de revisión de la propuesta', 'Una sesión de 45 minutos con el sostenedor y el director para resolver dudas y ajustar el alcance si fuese necesario.'),
      pasoRow(2, 'Elección del paquete', 'Definición de la alternativa que mejor se ajusta al presupuesto y a los objetivos de matrícula del establecimiento.'),
      pasoRow(3, 'Firma y entrega de información', 'Suscripción del acuerdo y entrega de los antecedentes del proceso de matrícula (requisitos, documentos, aranceles, vacantes por curso).'),
      pasoRow(4, 'Inicio de la implementación', 'Comienza el cronograma de seis semanas descrito en el punto 6.'),
    ],
  }),
  spacer(240),
  RichP([
    { t: 'Una consideración final. ', b: true, c: NAVY, size: 22 },
    { t: 'Cada apoderado que consulta por el Colegio San Guillermo y no recibe seguimiento es una matrícula que probablemente se concreta en otro establecimiento. Recuperar incluso una parte de esos apoderados justifica con holgura la inversión que aquí se propone, y deja al colegio con un proceso de matrícula ordenado, medible y capaz de responder a cualquier hora.', size: 22 },
  ], { shading: { type: ShadingType.CLEAR, fill: LIGHT, color: 'auto' }, align: AlignmentType.JUSTIFIED }),
  spacer(300),
  P('Quedamos atentos a sus comentarios y a la posibilidad de trabajar junto al Colegio San Guillermo.', { align: AlignmentType.CENTER, size: 21, italics: true, color: NAVY }),
  spacer(500),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    borders: noBorders,
    rows: [new TableRow({ children: [
      cell([
        new Paragraph({
          spacing: { after: 60 },
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: '808080', space: 4 } },
          children: [new TextRun({ text: '', size: 2 })],
        }),
        P('Colegio San Guillermo', { align: AlignmentType.CENTER, size: 19, after: 20, bold: true, color: NAVY }),
        P('Enzo Ramírez Schuchhardt — Sostenedor', { align: AlignmentType.CENTER, size: 18, after: 0 }),
      ], { w: 4680 }),
      cell([
        new Paragraph({
          spacing: { after: 60 },
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: '808080', space: 4 } },
          children: [new TextRun({ text: '', size: 2 })],
        }),
        P('Por CORE AI', { align: AlignmentType.CENTER, size: 19, after: 20, bold: true, color: NAVY }),
        P('Nombre y firma', { align: AlignmentType.CENTER, size: 18, after: 0 }),
      ], { w: 4680 }),
    ]})],
  }),
];

// ================= DOCUMENTO =================
const doc = new Document({
  creator: 'Propuesta comercial',
  title: 'Propuesta de optimización del proceso de matrículas — Colegio San Guillermo',
  description: 'Automatización del proceso de matrículas con IA',
  numbering: {
    config: [{
      reference: 'vinetas',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 240 } },
                   run: { color: BLUE, size: 21 } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 240 } },
                   run: { color: BLUE, size: 21 } } },
      ],
    }],
  },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 21, color: TEXT } },
    },
  },
  sections: [
    // --- Portada, sin encabezado ni numeración ---
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 },
        },
      },
      children: [...portada, portadaTabla, ...bloqueEmisor],
    },
    // --- Cuerpo ---
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1260, left: 1440, right: 1440, header: 680, footer: 620 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            spacing: { after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF', space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
            children: [
              new TextRun({ text: 'Colegio San Guillermo  ·  RBD 12076-6', size: 16, color: '808080', font: 'Calibri' }),
              new TextRun({ text: '\tOptimización del proceso de matrículas', size: 16, color: '808080', font: 'Calibri' }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0 },
            children: [
              new TextRun({ text: 'CORE AI  ·  Propuesta comercial  ·  Página ', size: 16, color: '808080', font: 'Calibri' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '808080', font: 'Calibri' }),
              new TextRun({ text: ' de ', size: 16, color: '808080', font: 'Calibri' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '808080', font: 'Calibri' }),
            ],
          })],
        }),
      },
      children: [
        ...resumen, ...diagnostico, ...solucion, ...plataformas, ...flujo, ...cronograma, ...inversion, ...cierre,
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(process.env.SALIDA || 'Propuesta_Matriculas_Colegio_San_Guillermo.docx', buf);
  console.log('OK', buf.length);
});
