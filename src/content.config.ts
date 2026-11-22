import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    order: z.number().int(),                 // card order: 1 Alpha, 2 Block Rewind, 3 Chart Lookalikes, 4 1% Better
    title: z.string(),
    caseLabel: z.string(),                   // 'CASE 01 · AGENTIC APP'
    status: z.string(),                      // 'LIVE' | 'LIVE ON WP.ORG'
    problem: z.string(),
    built: z.string(),
    tags: z.array(z.string()).min(1),
    image: z.object({
      src: image(),                          // path relative to the .md file
      alt: z.string().min(20),
      bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      fit: z.enum(['contain', 'cover']).default('contain'),
    }),
    links: z.array(z.object({
      label: z.string(),                     // 'Live site', 'GitHub repo', 'Private repo'
      href: z.string().url().optional(),     // no href → rendered as plain text
    })).min(1),
    page: z.boolean().default(false),        // phase 2: true once the write-up is approved
    description: z.string().max(160).optional(), // phase 2: meta description for the project page
  }),
});

export const collections = { projects };
