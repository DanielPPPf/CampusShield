import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**']
  },
  coverage: {
    reporter: ['text', 'html'],
    provider: 'c8',
    include: ['src/**'],
    exclude: [
      'e2e/**',
      'node_modules/**',
      'scripts/**',
      'src/app.js'
    ]
  }
});
