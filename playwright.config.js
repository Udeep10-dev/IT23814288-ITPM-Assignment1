// @ts-check
const { defineConfig, devices } = require('@playwright/test');


module.exports = defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 60000, // 60 seconds
  
  // Run tests in parallel
  fullyParallel: false, // Set to false to run tests one by one
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Number of parallel workers
  workers: 1, // Run one test at a time
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for the application
    baseURL: 'https://www.swifttranslator.com/',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Browser will be visible (set to true to hide browser)
    headless: false,
    

  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
