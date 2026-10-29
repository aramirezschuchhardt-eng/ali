/**
 * Equipo asesor. Solo integrantes reales, con la información que cada persona
 * autoriza publicar. Los campos opcionales se muestran solo si existen.
 */
export interface TeamMember {
  name: string;
  role: string;
  photo?: { src: string; alt: string };
  specialty?: string;
  experience?: string[];
  approach?: string;
}

/** Vacío: la sección de equipo se oculta en el sitio hasta agregar integrantes. */
export const team: TeamMember[] = [];
