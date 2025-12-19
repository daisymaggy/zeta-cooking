// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
   server: {
     allowedHosts: ['zeta.cours.quimerch.com'],
   },
   preview: {
    allowedHosts: ['zeta.cours.quimerch.com'],
   },
  },

  adapter: node({
    mode: 'standalone',
  }),
});