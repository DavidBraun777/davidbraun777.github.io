import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/data/education.ts',
        'src/data/experience.ts',
        'src/data/profile.ts',
        'src/data/skills.ts',
        'src/data/social-links.ts',
        'src/app/opengraph-image.tsx',
        'src/app/twitter-image.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
