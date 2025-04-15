import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour le projet mistral
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Durée maximale d'exécution pour chaque test */
  timeout: 30 * 1000,
  /* Nombre de tentatives avant d'échouer */
  retries: process.env.CI ? 2 : 0,
  /* Nombre de travailleurs parallèles */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter à utiliser */
  reporter: [
    ['html'],
    ['list']
  ],
  /* Configurations partagées pour tous les projets */
  use: {
    /* URL de base pour la navigation */
    baseURL: 'http://localhost:4200',
    /* Capture des traces pour le débogage */
    trace: 'on-first-retry',
    /* Capture des screenshots en cas d'échec */
    screenshot: 'only-on-failure',
    /* Enregistrement vidéo en cas d'échec */
    video: 'on-first-retry',
  },
  /* Configuration des projets de test */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'accessibility',
      testMatch: /.*\.accessibility\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance',
      testMatch: /.*\.performance\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Options de serveur web */
  webServer: {
    command: 'cd ../mistral/client && npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
