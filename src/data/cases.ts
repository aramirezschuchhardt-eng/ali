/**
 * Casos de estudio. Vacío hasta contar con casos reales y autorizados por los clientes.
 * No incluir resultados financieros sin documentación y período de referencia.
 */
export interface CaseStudy {
  slug: string;
  title: string;
  profile: string;
  initialSituation: string;
  objective: string;
  variables: string[];
  alternatives: string[];
  decision: string;
  /** Solo resultados documentados, con período. */
  results?: { text: string; period: string; source: string };
  authorizedByClient: boolean;
}

export const cases: CaseStudy[] = [];
