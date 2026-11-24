// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://rajdeepgaur.tech',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap(), mdx()],
  // Keep quotes exactly as written (§4.3): no curly-quote conversion in Markdown/MDX.
  markdown: { smartypants: false },
  image: {
    // Decided 22 Nov: project screenshots ship as full-size lossless WebP (see ProjectImage.astro).
    // `exact` keeps the colour of fully transparent pixels, so the output is pixel-identical to the PNG.
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        webp: { lossless: true, exact: true, effort: 6 },
      },
    },
  },
});
