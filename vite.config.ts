import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { prefetch } from './prefetch-plugin';

export default defineConfig({
  plugins: [svelte(), prefetch()],
  resolve: {
    alias: {
      __: new URL('./src/', import.meta.url).pathname,
    },
  },
});
