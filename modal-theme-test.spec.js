const { test, expect } = require('@playwright/test');

const PORTAL_URL = 'https://portal.grid4voice.net/portal/home';
const USERNAME = '321@grid4.com';
const PASSWORD = '2107Cr00ks!';

test.describe('Modal Theme Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to portal
    await page.goto(PORTAL_URL);
    await page.waitForLoadState('networkidle');
    
    // Check if login is needed
    const needsLogin = await page.locator('input[name="data[User][login]"]').isVisible().catch(() => false);
    
    if (needsLogin) {
      console.log('Logging in...');
      await page.fill('input[name="data[User][login]"]', USERNAME);
      await page.fill('input[name="data[User][password]"]', PASSWORD);
      await page.click('input[type="submit"][value="Login"]');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
  });

  test('Dark mode modal backgrounds', async ({ page }) => {
    // Ensure we're in dark mode
    const shellElement = page.locator('#grid4-app-shell');
    await shellElement.waitFor({ state: 'visible', timeout: 10000 });
    
    const isDark = await shellElement.evaluate(el => el.classList.contains('theme-dark'));
    console.log('Initial theme is dark:', isDark);
    
    if (!isDark) {
      console.log('Switching to dark theme...');
      await page.click('#grid4-theme-toggle');
      
      // Handle refresh dialog
      page.once('dialog', async dialog => {
        console.log('Accepting theme refresh dialog');
        await dialog.accept();
      });
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    
    // Test Add User modal
    console.log('Opening Users menu...');
    await page.click('li:has-text("Users")');
    await page.waitForTimeout(1000);
    
    console.log('Clicking Add button...');
    await page.click('a:has-text("Add")');
    
    // Wait for modal to appear
    await page.waitForSelector('.modal.in', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Check modal background color
    const modalContent = page.locator('.modal-content').first();
    const modalStyles = await modalContent.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor
      };
    });
    
    console.log('Modal styles:', modalStyles);
    
    // Take screenshot
    await page.screenshot({ path: 'test-dark-modal.png', fullPage: true });
    
    // Verify dark background
    expect(modalStyles.backgroundColor).toContain('36, 43, 58'); // #242b3a in RGB
    
    // Check a label background
    const label = page.locator('.modal label').first();
    const labelBg = await label.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('Label background:', labelBg);
    
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('Light mode modal backgrounds', async ({ page }) => {
    // Ensure we're in light mode
    const shellElement = page.locator('#grid4-app-shell');
    await shellElement.waitFor({ state: 'visible', timeout: 10000 });
    
    const isDark = await shellElement.evaluate(el => el.classList.contains('theme-dark'));
    
    if (isDark) {
      console.log('Switching to light theme...');
      await page.click('#grid4-theme-toggle');
      
      // Handle refresh dialog
      page.once('dialog', async dialog => {
        await dialog.accept();
      });
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    
    // Test Add User modal
    await page.click('li:has-text("Users")');
    await page.waitForTimeout(1000);
    await page.click('a:has-text("Add")');
    
    // Wait for modal
    await page.waitForSelector('.modal.in', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Check modal background
    const modalContent = page.locator('.modal-content').first();
    const modalStyles = await modalContent.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Light mode modal styles:', modalStyles);
    
    // Take screenshot
    await page.screenshot({ path: 'test-light-modal.png', fullPage: true });
    
    // Verify white background
    expect(modalStyles.backgroundColor).toContain('255, 255, 255'); // #ffffff in RGB
    
    // Close modal
    await page.keyboard.press('Escape');
  });
});