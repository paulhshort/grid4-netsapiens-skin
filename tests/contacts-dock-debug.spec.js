const { test, expect } = require('@playwright/test');

test.describe('Contacts Dock Debug', () => {
  test('Login and check contacts dock styling', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://portal.grid4voice.ucaas.tech');
    
    // Login
    await page.fill('input[name="username"]', '1002@grid4voice');
    await page.fill('input[name="password"]', 'hQAFMdWXKNj4wAg');
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('**/portal/**', { timeout: 30000 });
    
    // Navigate to the specific domain
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_Monday_test2/Migration+domain+for+Grid4+Communications');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of current state
    await page.screenshot({ path: 'test-results/contacts-dock-initial.png', fullPage: true });
    
    // Check if contacts dock exists
    const dockPopup = await page.locator('.dock-popup, #dock-popup').first();
    if (await dockPopup.count() > 0) {
      console.log('Contacts dock found');
      
      // Get computed styles
      const styles = await dockPopup.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          position: computed.position,
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          width: computed.width,
          height: computed.height,
          top: computed.top,
          right: computed.right,
          bottom: computed.bottom,
          left: computed.left,
          zIndex: computed.zIndex
        };
      });
      
      console.log('Contacts dock styles:', styles);
      
      // Take screenshot of dock specifically
      await dockPopup.screenshot({ path: 'test-results/contacts-dock-element.png' });
    }
    
    // Check console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any late errors
    await page.waitForTimeout(3000);
    
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
    
    // Check for FOUC by navigating to another page
    console.log('Testing FOUC on navigation...');
    await page.click('a[href*="users"]');
    
    // Try to capture the transition
    const screenshots = [];
    for (let i = 0; i < 5; i++) {
      screenshots.push(page.screenshot({ path: `test-results/fouc-test-${i}.png` }));
      await page.waitForTimeout(100);
    }
    await Promise.all(screenshots);
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
  });
});