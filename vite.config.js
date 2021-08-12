import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

console.log(new URL('./src/', import.meta.url));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      __: new URL('./src/', import.meta.url).pathname,
    },
  },
});
