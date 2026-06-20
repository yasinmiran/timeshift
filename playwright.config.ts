import { defineConfig } from '@playwright/test'

// Smoke test runs against a production preview of the built site.
// Build first (`npm run build`), then `npm run test:e2e`.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:4399' },
  webServer: {
    command: 'npm run preview -- --port 4399',
    url: 'http://localhost:4399',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
