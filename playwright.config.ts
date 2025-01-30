import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,  
    viewport: { width: 1280, height: 720 },
    screenshot: 'on', 
    video: 'retain-on-failure', 
    baseURL: 'https://www.saucedemo.com/',
  },
  reporter: [
    ['html', { outputFolder: 'test-results', open: 'never' }], 
  ],
});