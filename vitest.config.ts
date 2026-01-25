import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    reporters: ['default'],
    env: {
      CHALLENGE_SECRET: 'test-secret-for-vitest-only',
    },
  },
});
