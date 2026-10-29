import { site } from '@/config/site';

export interface FaqItem { q: string; a: string; }

/**
 * Respuestas de carácter general. No constituyen recomendación financiera
 * personalizada. Las preguntas sobre condiciones comerciales de Avance
 * Inmobiliario se responden con los datos de src/config/site.ts.
 */
export const faq: FaqItem[] = [
  {
    q: '¿Cuánto dinero necesito para comenzar a invertir?',
    a: 'Depende del precio de la propiedad, del porcentaje que financie el banco y de los gastos de compra. En términos generales necesitas el pie (la parte que no cubre el crédito), los gastos operacionales de la compra y un margen de reserva para meses sin arriendo o imprevistos. En algunos proyectos en blanco o en verde el pie puede pagarse en cuotas durante la construcción. En el diagnóstico revisamos tu caso con números concretos.',
  },
  {
    q: '¿Cómo sé si tengo capacidad para un crédito hipotecario?',
    a: 'Los bancos evalúan principalmente tus ingresos demostrables, tu estabilidad laboral, tu comportamiento de pago y la relación entre tus deudas y tus ingresos. Cada entidad aplica sus propias políticas. Podemos ayudarte a ordenar tu información y estimar un rango razonable, pero la aprobación y sus condiciones las define siempre la institución financiera.',
  },
  {
    q: '¿Es posible comprar una segunda propiedad?',
    a: 'Sí, siempre que tu capacidad de pago y de endeudamiento lo permitan. Al evaluar una segunda propiedad se considera el dividendo de la primera, su flujo de caja real y cómo cambia tu exposición total a deuda. Es una decisión que conviene planificar: el orden y el momento de cada compra importan.',
  },
  {
    q: '¿Cómo se calcula la rentabilidad de un departamento?',
    a: 'La rentabilidad bruta divide el arriendo anual por el precio de la propiedad. La neta descuenta vacancia, gastos y administración, y suma al denominador los costos de compra. Ninguna de las dos incluye el efecto del crédito: para eso se usa el flujo de caja y el retorno sobre el capital que efectivamente aportaste. En nuestro simulador puedes ver las tres métricas por separado.',
  },
  {
    q: '¿Qué riesgos tiene una inversión inmobiliaria?',
    a: 'Entre otros: vacancia mayor a la esperada, arrendatarios que no pagan, mantenciones no previstas, cambios en la tasa de interés antes de escriturar, atrasos en la entrega de proyectos en construcción, menor liquidez al momento de vender y cambios en las condiciones del mercado o de la normativa. La plusvalía no está asegurada. Un buen análisis no elimina los riesgos, pero ayuda a conocerlos y dimensionarlos.',
  },
  {
    q: '¿Qué costos debo considerar además del pie?',
    a: 'Gastos operacionales de la compra (notaría, Conservador de Bienes Raíces, tasación, estudio de títulos y borradores), seguros asociados al crédito, gastos comunes y contribuciones cuando corresponda, mantención, administración si la delegas, y eventualmente amoblado o habilitación. También conviene tener un fondo para meses de vacancia.',
  },
  {
    q: '¿Qué diferencia existe entre comprar para vivir y comprar para arrendar?',
    a: 'Cuando compras para vivir priorizas tus preferencias y tu calidad de vida. Cuando compras para arrendar, la decisión depende de lo que valora un arrendatario, del arriendo que realmente se puede cobrar, de la vacancia y de los costos. Las condiciones de financiamiento también pueden diferir según el uso y el número de propiedades que tengas.',
  },
  {
    q: '¿Cómo funciona la asesoría de Avance Inmobiliario?',
    a: 'Comenzamos con un diagnóstico para entender tus objetivos y tu situación financiera. Luego definimos criterios de inversión, analizamos alternativas, estructuramos escenarios de financiamiento y te acompañamos en las etapas acordadas, desde la selección hasta la compra y, cuando corresponda, la puesta en arriendo. Puedes ver el detalle en la página de nuestro método.',
  },
  {
    q: '¿Cuáles son los costos y la forma de remuneración de la asesoría?',
    a:
      site.commercial.feeModel ??
      'Te lo explicamos con claridad antes de comenzar cualquier trabajo, incluyendo quién nos remunera y en qué casos. Si tienes dudas sobre este punto, pregúntalo directamente en la primera conversación.',
  },
  {
    q: '¿Puedo recibir asesoría si todavía no sé qué propiedad quiero comprar?',
    a: 'Sí, y es el mejor momento para hacerlo. Nuestro método comienza por entender tus objetivos y tu capacidad financiera; las propiedades se evalúan después, a la luz de esa estrategia.',
  },
];
