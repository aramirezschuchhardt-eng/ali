/**
 * Imágenes referenciales del sitio.
 *
 * Cada espacio busca un archivo en /public/images/<nombre>.(jpg|webp|png).
 * Si el archivo no existe, se muestra la ilustración arquitectónica de respaldo.
 * Usar solo fotografías propias o con licencia que permita uso comercial.
 */
export interface ImageSlot {
  alt: string;
  /** Crédito o licencia, si corresponde. */
  credit?: string;
}

export const imageSlots = {
  hero: { alt: 'Edificio residencial contemporáneo en Santiago' },
  estrategia: { alt: 'Asesoría de inversión: revisión de números y planificación' },
  credito: { alt: 'Firma de documentos de un crédito hipotecario' },
  nosotros: { alt: 'Reunión de asesoría inmobiliaria' },
  'blog-primeros-pasos': { alt: 'Departamento luminoso y amoblado' },
  'blog-financiamiento': { alt: 'Cálculos financieros sobre un escritorio' },
  'blog-rentabilidad': { alt: 'Vista de edificios residenciales desde la calle' },
  'blog-riesgos': { alt: 'Edificio en construcción' },
  'blog-estrategia': { alt: 'Vista panorámica de la ciudad' },
} satisfies Record<string, ImageSlot>;

export type ImageSlotName = keyof typeof imageSlots;

export const blogSlot = (category: string): ImageSlotName =>
  (`blog-${category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}` as ImageSlotName);
