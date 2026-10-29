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

export const team: TeamMember[] = [
  {
    name: 'Alison Ramírez Schuchhardt',
    role: 'Fundadora',
  },
];
