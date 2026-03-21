import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'electron/main.ts'),
      fileName: () => 'main.js',
      formats: ['cjs'],
    },
    minify: false,
    outDir: '.vite/build',
    rollupOptions: {
      external: ['electron', 'electron/common', 'electron/main', 'node:path', 'node:url'],
    },
    sourcemap: true,
    target: 'node22',
  },
});
