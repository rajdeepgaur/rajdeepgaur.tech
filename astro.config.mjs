// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rajdeepgaur.tech',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
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
