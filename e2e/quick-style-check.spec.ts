import { test, expect } from '@playwright/test';

test('Quick style verification', async ({ page }) => {
  console.log('Starting quick style check...');
  
  // Go directly to the login page
  await page.goto('https://portal.grid4voice.ucaas.tech');
  
  // Take a screenshot of the login page
  await page.screenshot({ path: 'test-results/login-page.png' });
  
  console.log('Ready for manual login - please login when the browser opens');
  
  // Wait for manual intervention
  await page.waitForTimeout(60000); // 60 seconds to manually login and navigate
});