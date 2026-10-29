/** Contenidos de marca reutilizados en varias páginas. */

export const methodStages = [
  {
    n: '01',
    title: 'Diagnóstico',
    text: 'Conocer al cliente, sus objetivos, su situación financiera y su capacidad de inversión.',
    detail: ['Objetivos y horizonte', 'Ingresos, ahorro y compromisos financieros', 'Propiedades y deudas actuales', 'Tolerancia al riesgo'],
    output: 'Un punto de partida claro y compartido.',
  },
  {
    n: '02',
    title: 'Estrategia',
    text: 'Definir prioridades, horizonte de inversión y criterios de evaluación.',
    detail: ['Qué rol cumplirá la propiedad en tu patrimonio', 'Rango de inversión razonable', 'Criterios de ubicación, tipología y etapa'],
    output: 'Criterios explícitos para decir sí o no a una oportunidad.',
  },
  {
    n: '03',
    title: 'Análisis',
    text: 'Evaluar proyectos, ubicación, precio, arriendo potencial, gastos, financiamiento y riesgos.',
    detail: ['Comparación de alternativas', 'Arriendo potencial con fuentes', 'Costos de compra y de tenencia', 'Riesgos de cada etapa'],
    output: 'Comparación de alternativas con datos y supuestos identificados.',
  },
  {
    n: '04',
    title: 'Estructuración',
    text: 'Analizar alternativas de financiamiento, pie, dividendos estimados y escenarios financieros, y gestionar tu crédito hipotecario buscando la mejor opción.',
    detail: ['Porcentaje de financiamiento y plazo', 'Comparación de ofertas: tasa, CAE, seguros y beneficios', 'Revisión de FOGAES y tasa subsidiada, si cumples los requisitos', 'Escenarios conservador, base y optimista'],
    output: 'El financiamiento más conveniente que podamos conseguir para tu perfil.',
  },
  {
    n: '05',
    title: 'Acompañamiento',
    text: 'Orientar al cliente durante las etapas contratadas, desde la selección hasta la compra y, cuando corresponda, la puesta en arriendo.',
    detail: ['Reserva y promesa', 'Gestión del crédito hipotecario hasta su aprobación', 'Escritura y entrega', 'Puesta en arriendo, si se acuerda'],
    output: 'Orientación en las etapas acordadas, sin perder de vista la estrategia.',
  },
];

export const objectives = [
  {
    slug: 'primera-inversion',
    title: 'Primera inversión',
    text: 'Para quienes quieren comenzar a invertir con información y acompañamiento.',
    points: ['Entender cuánto necesitas realmente', 'Conocer tu capacidad de crédito', 'Evitar decisiones apresuradas'],
  },
  {
    slug: 'patrimonio',
    title: 'Construcción de patrimonio',
    text: 'Para quienes desean desarrollar una cartera inmobiliaria progresivamente.',
    points: ['Secuencia de compras en el tiempo', 'Capacidad de endeudamiento futura', 'Exposición patrimonial'],
  },
  {
    slug: 'renta',
    title: 'Ingresos por arriendo',
    text: 'Para quienes quieren evaluar propiedades considerando ingresos potenciales, gastos y flujo de caja.',
    points: ['Arriendo realista, no optimista', 'Vacancia, gastos y administración', 'Flujo de caja mensual'],
  },
  {
    slug: 'optimizacion',
    title: 'Optimización de cartera',
    text: 'Para quienes ya tienen propiedades y quieren analizar nuevas oportunidades o revisar su estrategia.',
    points: ['Diagnóstico de lo que ya tienes', 'Diversificación', 'Nuevas compras con criterio'],
  },
];

export const pillars = [
  { title: 'Criterio antes que venta', text: 'Evaluamos cada oportunidad según tu objetivo. Si una propiedad no encaja con tu estrategia, te lo decimos.' },
  { title: 'Visión integral', text: 'Consideramos precio, financiamiento, flujo de caja, costos y riesgos, no solo el valor de lista.' },
  { title: 'Acompañamiento personalizado', text: 'Adaptamos el proceso a tus necesidades, tus tiempos y tu nivel de experiencia.' },
  { title: 'Transparencia', text: 'Explicamos los supuestos, las condiciones y las limitaciones de cada análisis.' },
];

export const brandPillars = [
  { title: 'Estrategia', text: 'Cada recomendación tiene un propósito.' },
  { title: 'Análisis', text: 'Variables financieras, comerciales y operacionales.' },
  { title: 'Personalización', text: 'Tus necesidades y capacidades, no un perfil promedio.' },
  { title: 'Transparencia', text: 'Costos, supuestos, riesgos y limitaciones a la vista.' },
  { title: 'Acompañamiento', text: 'Orientación en las etapas acordadas.' },
];

/** Preguntas que ordena la estrategia (sección "Tu estrategia" del inicio). */
export const strategyQuestions = [
  { q: '¿Qué quieres lograr con tu inversión?', a: 'Ingresos mensuales, patrimonio a largo plazo, jubilación o diversificación. El objetivo define todos los criterios que vienen después.' },
  { q: '¿Cuánto puedes invertir sin comprometer tu estabilidad?', a: 'Revisamos ahorro, ingresos y compromisos para definir un pie y un dividendo que puedas sostener, con una reserva para imprevistos.' },
  { q: '¿Cuál es tu horizonte de tiempo?', a: 'No es lo mismo invertir a 5 años que a 20. El horizonte cambia el tipo de propiedad, la etapa del proyecto y la estructura del crédito.' },
  { q: '¿Cuánto riesgo estás dispuesto a asumir?', a: 'Vacancia, tasas, plazos de entrega, liquidez. Los identificamos y dimensionamos para que decidas sabiendo qué aceptas.' },
  { q: '¿Cómo conviene financiarla?', a: 'Porcentaje de financiamiento, plazo y efecto del crédito en tu flujo mensual, en escenarios conservador, base y optimista.' },
  { q: '¿Cuál es el siguiente paso, y el que viene después?', a: 'Una hoja de ruta: cuándo comprar, en qué orden y cómo preparar la siguiente inversión sin perder capacidad de crédito.' },
];

/** Gestión del crédito hipotecario (inicio y asesoría). */
export const creditService = {
  title: 'Gestionamos tu crédito hipotecario.',
  lead: 'Buscamos la mejor opción de financiamiento para ti: comparamos alternativas entre entidades financieras para conseguir la mejor tasa y las mejores condiciones, y te acompañamos hasta la firma.',
  points: [
    { title: 'La mejor tasa', text: 'Cotizamos y comparamos ofertas de distintas entidades para buscar la tasa más conveniente para tu perfil.' },
    { title: 'Mejores beneficios', text: 'Comparamos más que la tasa: CAE, seguros, plazo, porcentaje de financiamiento y condiciones de cada oferta.' },
    { title: 'FOGAES y tasa subsidiada', text: 'Revisamos si puedes acceder a beneficios estatales vigentes, como la garantía FOGAES o la tasa subsidiada para vivienda nueva, y gestionamos su aplicación cuando cumples los requisitos.' },
    { title: 'Acompañamiento en el trámite', text: 'Te orientamos con los antecedentes, la evaluación, la tasación y los pasos hasta la escritura.' },
  ],
  note: 'La aprobación del crédito, la tasa final y el acceso a beneficios estatales dependen de cada entidad financiera, de tu evaluación y de los requisitos vigentes de cada programa.',
};
