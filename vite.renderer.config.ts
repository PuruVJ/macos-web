import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { uniwind } from 'uniwind/vite';
import { defineConfig } from 'vite';
import { rnw } from 'vite-plugin-rnw';

export default defineConfig({
  build: {
    cssMinify: 'esbuild',
  },
  css: {
    transformer: 'postcss',
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/renderer/routeTree.gen.ts',
      routesDirectory: './src/renderer/routes',
    }),
    rnw(),
    tailwindcss(),
    uniwind({
      cssEntryFile: './src/renderer/styles/global.css',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
});
