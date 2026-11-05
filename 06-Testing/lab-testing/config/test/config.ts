import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    environment: 'jsdom',
    setupFiles: ['./config/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/catalog/**/*.{ts,tsx}'],
      exclude: ['src/catalog/**/*.spec.{ts,tsx}', 'src/catalog/test-data.ts'],
    },
  },
});
