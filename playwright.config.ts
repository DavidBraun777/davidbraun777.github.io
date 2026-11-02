import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://localhost:3000',
    // Trust only the ephemeral self-signed certificate used by the local tests.
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CI ? { channel: 'chrome' as const } : {}),
      },
    },
    {
      name: 'webkit-mobile',
      grep: /@cross-browser/,
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'node e2e/https-server.mjs',
    url: 'https://localhost:3000',
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    env: { NODE_ENV: 'production' },
  },
})
