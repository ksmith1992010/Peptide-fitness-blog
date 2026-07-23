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
    /** Matches authors.ts id — defaults to editorial on the page */
    authorId: z.string().default('editorial'),
    /**
     * Clinical / medical review disclosure for YMYL-adjacent pieces.
     * `editorial-only` = no clinician review seated for this piece.
     * `pending` = queued for external review.
     * `reviewed` = requires reviewedById of a seated clinician author.
     */
    reviewStatus: z.enum(['editorial-only', 'pending', 'reviewed']).default('editorial-only'),
    reviewedById: z.string().optional(),
    reviewedAt: z.coerce.date().optional(),
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),
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
