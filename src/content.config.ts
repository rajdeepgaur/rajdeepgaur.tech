import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    order: z.number().int(),                 // card order: 1 Alpha, 2 Block Rewind, 3 Chart Lookalikes, 4 1% Better
    title: z.string(),
    caseLabel: z.string(),                   // 'CASE 01 · AGENTIC APP'
    status: z.string(),                      // 'LIVE' | 'LIVE ON WP.ORG'
    problem: z.string(),
    built: z.string(),
    tags: z.array(z.string()).min(1),
    image: z.object({
      src: image(),                          // path relative to the file
      alt: z.string().min(20),
      bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      fit: z.enum(['contain', 'cover']).default('contain'),
      fitMobile: z.enum(['contain', 'cover']).optional(), // below 640px; unset = same as fit (1% Better: 'cover')
      position: z.string().optional(),       // CSS object-position, e.g. 'top' (Alpha, Block Rewind); unset = centre
      positionMobile: z.string().optional(), // below 640px; unset = same as position (Block Rewind: 'right top')
    }),
    links: z.array(z.object({
      label: z.string(),                     // 'Live site', 'GitHub repo', 'Private repo'
      href: z.string().url().optional(),     // no href → rendered as plain text
    })).min(1),
    // phase 2 (project pages, §4.2):
    page: z.boolean().default(false),        // true once the write-up and page copy are approved
    statusDetail: z.string().optional(),     // Case file STATUS line, e.g. 'Live on WordPress.org · passed plugin review'
    caseStudyTitle: z.string().optional(),   // the write-up's title, shown as the h2
    description: z.string().max(160).optional(), // meta description for the project page
  }).refine(
    (p) => !p.page || (p.statusDetail && p.caseStudyTitle && p.description),
    { message: 'page: true needs statusDetail, caseStudyTitle and description' },
  ),
});

export const collections = { projects };
