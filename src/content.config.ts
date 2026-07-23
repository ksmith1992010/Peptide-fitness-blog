import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['safety', 'comparison', 'protocol', 'planner', 'basics', 'quality']),
    evidence: z.enum(['fda-approved', 'human', 'mixed', 'animal', 'anecdotal', 'literacy']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const glossary = defineCollection({
  loader: glob({ base: './src/content/glossary', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    term: z.string(),
    short: z.string(),
  }),
});

export const collections = { guides, glossary };
