import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest configuration for accessibility tests
 * Uses jsdom environment for DOM-based axe-core testing
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/a11y/**/*.test.ts'],
    reporters: ['default'],
    setupFiles: ['./tests/vitest-setup.ts'],
    env: {
      CHALLENGE_SECRET: 'test-secret-for-vitest-only',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
