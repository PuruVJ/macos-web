import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'electron/preload.ts'),
      fileName: () => 'preload.js',
      formats: ['cjs'],
    },
    minify: false,
    outDir: '.vite/build',
    rollupOptions: {
      external: ['electron', 'node:path'],
    },
    sourcemap: true,
    target: 'node22',
  },
});
