/**
 * Playwright Configuration for Grid4 Emergency Hotfix v1.0.5 Testing
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './',
  
  // Test files pattern
  testMatch: ['**/grid4-emergency-hotfix-validation.spec.js', '**/test-grid4-issues.js', '**/test-critical-fixes.js'],
  
  // Global test timeout
  timeout: 60000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10000
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Run tests in parallel
  workers: process.env.CI ? 1 : 2,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: './test-results/html-report' }],
    ['json', { outputFile: './test-results/test-results.json' }],
    ['line']
  ],
  
  // Global setup and teardown
  use: {
    // Base URL for tests
    baseURL: 'https://portal.grid4voice.ucaas.tech',
    
    // Browser context options
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Navigation timeout
    navigationTimeout: 30000,
    
    // Action timeout  
    actionTimeout: 10000,
    
    // Ignore HTTPS errors (for self-signed certificates)
    ignoreHTTPSErrors: true,
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },
  
  // Test output directory
  outputDir: './test-results/artifacts',
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional Chromium-specific options
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific options
        launchOptions: {
          firefoxUserPrefs: {
            'security.tls.insecure_fallback_hosts': 'portal.grid4voice.ucaas.tech',
            'security.mixed_content.block_active_content': false
          }
        }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari']
      },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5']
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12']
      },
    },
    
    // Tablet testing
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro']
      },
    }
  ],
  
  // Web server configuration (if needed for local files)
  webServer: process.env.SERVE_LOCAL_FILES ? {
    command: 'python3 -m http.server 8000',
    port: 8000,
    cwd: '.',
    reuseExistingServer: !process.env.CI,
  } : undefined,
});