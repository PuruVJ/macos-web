import path from 'node:path';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      'react-native': 'react-native-web',
    },
  },
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, 'tests/smoke/**'],
    setupFiles: ['./tests/setup/vitest.setup.ts'],
  },
});
