import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      __: resolve(__dirname, './src'),
    },
  },
  build: {
    brotliSize: false,
  },
});
