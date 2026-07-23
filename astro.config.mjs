// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://aminobrief.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/desk') && !page.includes('/outreach'),
    }),
  ],
});
