/**
 * Equipo asesor.
 *
 * Solo integrantes reales con información entregada por la empresa.
 * `verified: false` indica que el texto proviene de documentos internos y debe
 * ser validado por la persona antes de publicar. Sin fotografía profesional
 * autorizada se muestra un marcador con iniciales.
 */
export interface TeamMember {
  name: string;
  role: string;
  photo?: { src: string; alt: string };
  specialty: string;
  experience: string[];
  approach: string;
  verified: boolean;
  source: string;
}

export const team: TeamMember[] = [
  {
    name: 'Alison Ramírez Schuchhardt',
    role: 'Fundadora',
    specialty: 'Inversión inmobiliaria y estructuración de negocios',
    experience: [
      'Ingeniera comercial.',
      'MBA, Universidad Europea de Madrid.',
      'Diplomada en Marketing Estratégico, Pontificia Universidad Católica de Chile.',
      'Estudios de Real Estate en Estados Unidos.',
      'Más de 8 años liderando equipos comerciales, estructurando negocios y desarrollando proyectos inmobiliarios.',
    ],
    approach:
      'Conectar inversión, educación y propósito: demostrar que invertir sí es posible cuando se hace con información y estrategia.',
    verified: false,
    source: 'Biografía entregada por la empresa (documento interno). Validar redacción y credenciales antes de publicar.',
  },
];
