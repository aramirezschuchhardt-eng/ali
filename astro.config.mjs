// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { site as siteConfig } from './src/config/site.ts';

const showProjects = siteConfig.features.projects;

// URL pública del sitio. Definir PUBLIC_SITE_URL en el entorno de producción
// (p. ej. https://www.dominio-oficial.cl). Se usa en canonical, Open Graph y sitemap.
const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  // El adaptador Node solo se usa para los endpoints del servidor (/api/*),
  // que mantienen las credenciales de CRM fuera del navegador.
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap({ filter: (page) => !page.includes('/api/') && (showProjects || !page.includes('/oportunidades')) })],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
