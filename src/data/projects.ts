/**
 * Catálogo de oportunidades.
 *
 * ⚠ TODOS LOS PROYECTOS DE ESTE ARCHIVO SON DE DEMOSTRACIÓN (`demo: true`).
 * Nombres, cifras e imágenes son ficticios y existen solo para probar filtros,
 * comparador y fichas. No representan proyectos, precios ni disponibilidad reales.
 *
 * Para publicar proyectos reales: reemplazar este arreglo (o conectarlo a un CMS)
 * respetando la interfaz `Project`. Cada dato económico lleva su `status`:
 *   - 'confirmed'  → verificado con la inmobiliaria (indicar fuente y fecha)
 *   - 'estimate'   → estimación con fuente identificable
 *   - 'assumption' → supuesto de trabajo para el análisis
 */

export type DataStatus = 'confirmed' | 'estimate' | 'assumption';

export interface DataPoint<T> {
  value: T;
  status: DataStatus;
  source?: string;
  /** Fecha de verificación (ISO). */
  asOf?: string;
}

export type ProjectStage = 'en-blanco' | 'en-verde' | 'entrega-inmediata';
export type InvestmentGoal = 'primera-inversion' | 'patrimonio' | 'renta' | 'diversificacion';

export interface Unit {
  typology: string; // p. ej. "1D1B"
  bedrooms: number;
  bathrooms: number;
  areaM2?: number;
  priceFromUf?: DataPoint<number>;
}

export interface Project {
  slug: string;
  demo: boolean;
  name: string;
  developer?: string;
  comuna: string;
  region: string;
  address?: string;
  stage: ProjectStage;
  /** Fecha estimada de entrega, formato "AAAA-MM". */
  deliveryEstimate?: DataPoint<string>;
  units: Unit[];
  goals: InvestmentGoal[];
  highlights: string[];
  summary: string;
  connectivity: string[];
  commercialConditions?: DataPoint<string>[];
  financing?: string;
  rentEstimateClp?: DataPoint<{ min: number; max: number }>;
  costs: { label: string; detail: string }[];
  variables: string[];
  investorProfile: string;
  risks: string[];
  /** Imagen autorizada por la inmobiliaria. Sin imagen se muestra un marcador. */
  image?: { src: string; alt: string; credit?: string };
}

export const stageLabels: Record<ProjectStage, string> = {
  'en-blanco': 'En blanco',
  'en-verde': 'En verde',
  'entrega-inmediata': 'Entrega inmediata',
};

export const goalLabels: Record<InvestmentGoal, string> = {
  'primera-inversion': 'Primera inversión',
  patrimonio: 'Construcción de patrimonio',
  renta: 'Ingresos por arriendo',
  diversificacion: 'Diversificación',
};

export const statusLabels: Record<DataStatus, string> = {
  confirmed: 'Dato confirmado',
  estimate: 'Estimación',
  assumption: 'Supuesto',
};

const demoNote = 'Dato de demostración — no corresponde a un proyecto real';

const commonCosts = [
  { label: 'Gastos operacionales de compra', detail: 'Notaría, Conservador de Bienes Raíces, tasación, estudio de títulos y borradores de escritura. Se cotizan en cada caso.' },
  { label: 'Gastos comunes y contribuciones', detail: 'Durante la vacancia los paga el propietario. Las contribuciones dependen del avalúo fiscal y de beneficios aplicables.' },
  { label: 'Seguros del crédito', detail: 'Desgravamen e incendio/sismo son obligatorios en créditos hipotecarios y se suman al dividendo.' },
];

export const projects: Project[] = [
  {
    slug: 'demo-proyecto-alameda',
    demo: true,
    name: 'Proyecto Demo Alameda',
    comuna: 'Santiago',
    region: 'Región Metropolitana',
    stage: 'en-verde',
    deliveryEstimate: { value: '2027-09', status: 'assumption', source: demoNote },
    units: [
      { typology: 'Studio', bedrooms: 0, bathrooms: 1, areaM2: 26, priceFromUf: { value: 2350, status: 'assumption', source: demoNote } },
      { typology: '1D1B', bedrooms: 1, bathrooms: 1, areaM2: 34, priceFromUf: { value: 2890, status: 'assumption', source: demoNote } },
    ],
    goals: ['primera-inversion', 'renta'],
    highlights: ['Cercanía a metro (ejemplo)', 'Unidades compactas', 'Alta demanda de arriendo en la zona (a verificar)'],
    summary: 'Ficha de ejemplo para mostrar cómo se presenta una oportunidad orientada a primera inversión y renta en una comuna céntrica.',
    connectivity: ['Ejemplo: a pocas cuadras de una estación de metro', 'Ejemplo: acceso a servicios, universidades y comercio'],
    commercialConditions: [{ value: 'Condiciones comerciales: por confirmar con la inmobiliaria', status: 'assumption', source: demoNote }],
    financing: 'Se evalúa según la capacidad de crédito de cada cliente. Las condiciones dependen de la entidad financiera.',
    rentEstimateClp: { value: { min: 380000, max: 440000 }, status: 'assumption', source: demoNote },
    costs: commonCosts,
    variables: ['Oferta de unidades similares en arriendo en el sector', 'Plazo real de entrega', 'Evolución de la tasa hipotecaria hasta la escritura', 'Gastos comunes del edificio'],
    investorProfile: 'Personas que buscan una primera unidad de inversión con ticket acotado y foco en arriendo.',
    risks: ['Atrasos en la entrega', 'Competencia de muchas unidades similares en arriendo', 'Cambio en la tasa entre la promesa y la escritura', 'Vacancia mayor a la estimada'],
  },
  {
    slug: 'demo-proyecto-nunoa',
    demo: true,
    name: 'Proyecto Demo Ñuñoa',
    comuna: 'Ñuñoa',
    region: 'Región Metropolitana',
    stage: 'en-blanco',
    deliveryEstimate: { value: '2028-06', status: 'assumption', source: demoNote },
    units: [
      { typology: '1D1B', bedrooms: 1, bathrooms: 1, areaM2: 38, priceFromUf: { value: 3650, status: 'assumption', source: demoNote } },
      { typology: '2D2B', bedrooms: 2, bathrooms: 2, areaM2: 58, priceFromUf: { value: 5200, status: 'assumption', source: demoNote } },
    ],
    goals: ['patrimonio', 'primera-inversion'],
    highlights: ['Comuna residencial consolidada (ejemplo)', 'Mayor plazo para completar el pie', 'Mix de tipologías'],
    summary: 'Ficha de ejemplo para un proyecto en blanco, donde el plazo de construcción permite planificar el pie pero agrega incertidumbre de entrega.',
    connectivity: ['Ejemplo: cercanía a ejes de transporte', 'Ejemplo: parques y servicios en el entorno'],
    commercialConditions: [{ value: 'Forma de pago del pie: por confirmar con la inmobiliaria', status: 'assumption', source: demoNote }],
    financing: 'El crédito hipotecario se tramita cerca de la entrega; la tasa de ese momento puede diferir de la actual.',
    rentEstimateClp: { value: { min: 480000, max: 650000 }, status: 'assumption', source: demoNote },
    costs: commonCosts,
    variables: ['Plazo de construcción', 'Tasa hipotecaria al momento de escriturar', 'Capacidad de pagar el pie en cuotas'],
    investorProfile: 'Personas con horizonte de mediano plazo que prefieren distribuir el pie en el tiempo.',
    risks: ['Riesgo de construcción y entrega', 'Cambio de condiciones de financiamiento', 'Capital inmovilizado sin ingresos durante la obra'],
  },
  {
    slug: 'demo-proyecto-la-florida',
    demo: true,
    name: 'Proyecto Demo La Florida',
    comuna: 'La Florida',
    region: 'Región Metropolitana',
    stage: 'entrega-inmediata',
    deliveryEstimate: { value: '2026-10', status: 'assumption', source: demoNote },
    units: [
      { typology: '2D1B', bedrooms: 2, bathrooms: 1, areaM2: 48, priceFromUf: { value: 3100, status: 'assumption', source: demoNote } },
      { typology: '2D2B', bedrooms: 2, bathrooms: 2, areaM2: 55, priceFromUf: { value: 3480, status: 'assumption', source: demoNote } },
    ],
    goals: ['renta', 'patrimonio'],
    highlights: ['Entrega inmediata: arriendo desde el inicio (ejemplo)', 'Tipologías familiares', 'Sin riesgo de construcción'],
    summary: 'Ficha de ejemplo para una unidad con entrega inmediata, donde el flujo de arriendo puede comenzar antes pero el pie se paga de una vez.',
    connectivity: ['Ejemplo: cercanía a metro y centros comerciales'],
    commercialConditions: [{ value: 'Disponibilidad de unidades: por confirmar', status: 'assumption', source: demoNote }],
    financing: 'Requiere tener el pie disponible y el crédito aprobado en el corto plazo.',
    rentEstimateClp: { value: { min: 450000, max: 520000 }, status: 'assumption', source: demoNote },
    costs: commonCosts,
    variables: ['Disponibilidad efectiva del pie', 'Tiempo para encontrar arrendatario', 'Estado de terminaciones'],
    investorProfile: 'Personas orientadas a ingresos que priorizan comenzar a arrendar pronto.',
    risks: ['Pago del pie completo al inicio', 'Vacancia inicial', 'Mantenciones no previstas'],
  },
  {
    slug: 'demo-proyecto-concepcion',
    demo: true,
    name: 'Proyecto Demo Concepción',
    comuna: 'Concepción',
    region: 'Región del Biobío',
    stage: 'en-verde',
    deliveryEstimate: { value: '2027-03', status: 'assumption', source: demoNote },
    units: [
      { typology: '1D1B', bedrooms: 1, bathrooms: 1, areaM2: 36, priceFromUf: { value: 2600, status: 'assumption', source: demoNote } },
      { typology: '2D2B', bedrooms: 2, bathrooms: 2, areaM2: 54, priceFromUf: { value: 3900, status: 'assumption', source: demoNote } },
    ],
    goals: ['diversificacion', 'renta'],
    highlights: ['Diversificación geográfica fuera de Santiago (ejemplo)', 'Demanda universitaria (a verificar)'],
    summary: 'Ficha de ejemplo para evaluar diversificación regional: otro mercado de arriendo, otra dinámica de oferta y otra gestión a distancia.',
    connectivity: ['Ejemplo: cercanía a universidades y centro urbano'],
    commercialConditions: [{ value: 'Condiciones comerciales: por confirmar', status: 'assumption', source: demoNote }],
    financing: 'Se analiza junto con las demás propiedades del cliente y su exposición total a deuda.',
    rentEstimateClp: { value: { min: 330000, max: 480000 }, status: 'assumption', source: demoNote },
    costs: [...commonCosts, { label: 'Administración a distancia', detail: 'Si el propietario vive en otra ciudad, conviene considerar el costo de una administración profesional.' }],
    variables: ['Profundidad del mercado de arriendo local', 'Estacionalidad de la demanda', 'Costo de administración remota'],
    investorProfile: 'Personas con una o más propiedades que buscan diversificar mercados.',
    risks: ['Menor liquidez al vender', 'Estacionalidad del arriendo', 'Gestión a distancia'],
  },
  {
    slug: 'demo-proyecto-vina',
    demo: true,
    name: 'Proyecto Demo Viña del Mar',
    comuna: 'Viña del Mar',
    region: 'Región de Valparaíso',
    stage: 'en-blanco',
    deliveryEstimate: { value: '2028-12', status: 'assumption', source: demoNote },
    units: [
      { typology: '2D2B', bedrooms: 2, bathrooms: 2, areaM2: 62, priceFromUf: { value: 5600, status: 'assumption', source: demoNote } },
      { typology: '3D2B', bedrooms: 3, bathrooms: 2, areaM2: 80, priceFromUf: { value: 7200, status: 'assumption', source: demoNote } },
    ],
    goals: ['patrimonio', 'diversificacion'],
    highlights: ['Ticket mayor, horizonte largo (ejemplo)', 'Tipologías amplias'],
    summary: 'Ficha de ejemplo para un perfil patrimonial: mayor ticket, horizonte largo y foco en la calidad del activo por sobre el flujo inmediato.',
    connectivity: ['Ejemplo: cercanía a servicios y borde costero'],
    commercialConditions: [{ value: 'Condiciones comerciales: por confirmar', status: 'assumption', source: demoNote }],
    financing: 'Se estructura considerando el patrimonio total y la capacidad de endeudamiento del cliente.',
    rentEstimateClp: { value: { min: 650000, max: 900000 }, status: 'assumption', source: demoNote },
    costs: commonCosts,
    variables: ['Plazo de construcción largo', 'Arriendo de temporada vs. arriendo tradicional', 'Gastos comunes de edificios con más servicios'],
    investorProfile: 'Inversionistas patrimoniales con mayor capacidad de inversión y horizonte de largo plazo.',
    risks: ['Flujo de caja más ajustado por ticket alto', 'Riesgo de entrega', 'Dependencia de la demanda estacional'],
  },
  {
    slug: 'demo-proyecto-san-miguel',
    demo: true,
    name: 'Proyecto Demo San Miguel',
    comuna: 'San Miguel',
    region: 'Región Metropolitana',
    stage: 'entrega-inmediata',
    deliveryEstimate: { value: '2026-08', status: 'assumption', source: demoNote },
    units: [
      { typology: 'Studio', bedrooms: 0, bathrooms: 1, areaM2: 28, priceFromUf: { value: 2450, status: 'assumption', source: demoNote } },
      { typology: '1D1B', bedrooms: 1, bathrooms: 1, areaM2: 35, priceFromUf: { value: 2980, status: 'assumption', source: demoNote } },
      { typology: '2D2B', bedrooms: 2, bathrooms: 2, areaM2: 52, priceFromUf: { value: 4100, status: 'assumption', source: demoNote } },
    ],
    goals: ['primera-inversion', 'renta', 'patrimonio'],
    highlights: ['Variedad de tipologías (ejemplo)', 'Conectividad con metro (ejemplo)'],
    summary: 'Ficha de ejemplo con varias tipologías para comparar cómo cambia el flujo de caja según el tamaño de la unidad.',
    connectivity: ['Ejemplo: cercanía a línea de metro y autopista'],
    commercialConditions: [{ value: 'Stock disponible: por confirmar', status: 'assumption', source: demoNote }],
    financing: 'Se compara el efecto de distintos porcentajes de financiamiento en el flujo mensual.',
    rentEstimateClp: { value: { min: 370000, max: 560000 }, status: 'assumption', source: demoNote },
    costs: commonCosts,
    variables: ['Tipología elegida', 'Competencia de arriendo en el mismo edificio'],
    investorProfile: 'Personas que quieren comparar tipologías dentro de un mismo proyecto.',
    risks: ['Concentración de unidades en arriendo en el mismo edificio', 'Vacancia', 'Gastos comunes'],
  },
];

export function minPriceUf(p: Project): number | null {
  const prices = p.units.map((u) => u.priceFromUf?.value).filter((v): v is number => typeof v === 'number');
  return prices.length ? Math.min(...prices) : null;
}

export function formatDelivery(v?: string): string {
  if (!v) return 'Por confirmar';
  const [y, m] = v.split('-').map(Number);
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return m ? `${months[m - 1]} ${y}` : String(y);
}
