import { defineConfig } from '@playwright/test';

const WEB_PORT = 4173;
const baseURL = `http://127.0.0.1:${WEB_PORT}`;
const previewCommand = `npm run preview -- --host 127.0.0.1 --port ${WEB_PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: process.env.CI ? previewCommand : `npm run build && ${previewCommand}`,
    reuseExistingServer: !process.env.CI,
    url: baseURL,
  },
});
