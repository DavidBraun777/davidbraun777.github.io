import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { coverageFiles } from './scripts/coverage-scope.mjs'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: 'coverage',
      include: coverageFiles().map(file => file.replaceAll('[', String.raw`\[`).replaceAll(']', String.raw`\]`)),
      thresholds: { perFile: true, lines: 100, branches: 100, functions: 100, statements: 100 },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
