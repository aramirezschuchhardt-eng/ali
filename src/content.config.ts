import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Centro de contenidos. Cada artículo es un archivo Markdown en src/content/blog.
 * Para conectar un CMS headless (Sanity, Contentful, Decap, Strapi...) basta con
 * reemplazar el loader manteniendo el mismo esquema.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    category: z.enum(['Primeros pasos', 'Financiamiento', 'Rentabilidad', 'Riesgos', 'Estrategia']),
    readingMinutes: z.number().int().positive(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Equipo Avance Inmobiliario'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
