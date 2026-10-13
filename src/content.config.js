import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { videoEmbedUrl } from './lib/video.js';

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.md',
    // about/index.md becomes /about/; about/bio.md becomes /about/bio/.
    generateId: ({ entry }) => entry.replace(/(?:\/index)?\.md$/, ''),
  }),
  schema: z.object({
    title: z.string().min(1),
    kind: z.enum(['section', 'article']).default('article'),
    intro: z.string().default(''),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    date: z.preprocess((value) => value || undefined, z.coerce.date().optional()),
    showReadingTime: z.boolean().default(false),
    showToc: z.boolean().default(false),
    nextPage: z.string().default(''),
    gallery: z.array(z.object({
      image: z.string(),
      alt: z.string().default(''),
      caption: z.string().default(''),
    })).default([]),
    video: z.string().default(''),
    embed: z.string().default('').refine((value) => !value || videoEmbedUrl(value), 'Use an HTTPS YouTube or Rutube video link.'),
    code: z.string().default(''),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
  }),
});

export const collections = { pages };
