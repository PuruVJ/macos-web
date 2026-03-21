import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 60_000,
  use: {
    trace: 'retain-on-failure',
  },
});
