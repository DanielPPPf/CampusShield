import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**']
  },
  coverage: {
    reporter: ['text', 'html'],
    exclude: [
      'e2e/**',
      'node_modules/**',
      'scripts/**',
      'src/app.js'
    ]
  }
});
