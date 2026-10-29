/**
 * Configuración central del sitio.
 *
 * REGLA: todo dato comercial, de contacto o legal que no esté confirmado por
 * Avance Inmobiliario se deja en `null`. Los componentes ocultan el elemento o
 * muestran un aviso de "contenido pendiente" en lugar de inventarlo.
 * Ver docs/CONTENIDO-PENDIENTE.md.
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  locale: string;
  brand: {
    /**
     * Ruta (dentro de /public) al logo oficial para fondos claros. Si el archivo no
     * existe al compilar, se muestra el nombre en texto como marcador.
     */
    logo: string | null;
    /** Versión oficial para fondos oscuros, si existe. */
    logoOnDark: string | null;
    /** false si el archivo tiene fondo blanco: en fondos oscuros se presenta sobre una placa clara. */
    logoTransparent: boolean;
    /** Proporción del archivo (ancho / alto) para reservar espacio y evitar saltos. */
    logoWidth: number;
    logoHeight: number;
    /** true cuando colores y tipografías de tokens.css estén confirmados con el manual de marca. */
    paletteIsOfficial: boolean;
  };
  contact: {
    email: string | null;
    phone: string | null;
    /** Número oficial en formato internacional sin "+" ni espacios, p. ej. "56912345678". */
    whatsapp: string | null;
    whatsappMessage: string;
    address: string | null;
  };
  /** URL de la herramienta de agenda real (Calendly, Google Calendar Appointment, HubSpot Meetings...). */
  bookingUrl: string | null;
  social: { label: string; url: string }[];
  legal: {
    razonSocial: string | null;
    rut: string | null;
    domicilio: string | null;
    /** Fecha de última actualización de la política de privacidad (ISO). */
    privacyUpdated: string;
  };
  commercial: {
    /** Texto confirmado sobre el costo de la primera reunión. null = no se informa. */
    firstMeetingTerms: string | null;
    /** Texto confirmado sobre la forma de remuneración de la asesoría. */
    feeModel: string | null;
  };
  /** Muestra en pantalla los avisos de contenido pendiente. Desactivar antes de publicar. */
  showPendingNotes: boolean;
}

export const site: SiteConfig = {
  name: 'Avance Inmobiliario',
  tagline: 'No se trata solo de comprar una propiedad, sino de invertir con estrategia.',
  description:
    'Asesoría de inversión inmobiliaria en Chile: diagnóstico, estrategia, análisis de oportunidades y acompañamiento para construir patrimonio con criterio.',
  locale: 'es-CL',
  brand: {
    logo: '/brand/logo-avance.png',
    logoOnDark: null,
    logoTransparent: false,
    logoWidth: 845,
    logoHeight: 355,
    paletteIsOfficial: false,
  },
  contact: {
    email: null,
    phone: null,
    whatsapp: null,
    whatsappMessage: 'Hola, me gustaría recibir asesoría de inversión inmobiliaria.',
    address: null,
  },
  bookingUrl: null,
  social: [],
  legal: {
    razonSocial: null,
    rut: null,
    domicilio: null,
    privacyUpdated: '2026-10-29',
  },
  commercial: {
    firstMeetingTerms: null,
    feeModel: null,
  },
  showPendingNotes: true,
};

export function whatsappHref(message = site.contact.whatsappMessage): string | null {
  if (!site.contact.whatsapp) return null;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'Asesoría', href: '/asesoria' },
  { label: 'Método', href: '/metodo' },
  { label: 'Oportunidades', href: '/oportunidades' },
  { label: 'Simulador', href: '/simulador' },
  { label: 'Aprende', href: '/blog' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Asesoría',
    items: [
      { label: 'Nuestra asesoría', href: '/asesoria' },
      { label: 'Método de inversión', href: '/metodo' },
      { label: 'Simulador de inversión', href: '/simulador' },
      { label: 'Casos y experiencias', href: '/casos' },
    ],
  },
  {
    title: 'Explora',
    items: [
      { label: 'Oportunidades', href: '/oportunidades' },
      { label: 'Centro de contenidos', href: '/blog' },
      { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
      { label: 'Nosotros y equipo', href: '/nosotros' },
    ],
  },
  {
    title: 'Contacto',
    items: [
      { label: 'Agenda una asesoría', href: '/contacto' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Términos y condiciones', href: '/terminos' },
    ],
  },
];
