// @ts-check
const { test, expect } = require('@playwright/test');

const PORTAL_URL = 'https://portal.grid4voice.net/portal/home';
const USERNAME = '321@grid4.com';
const PASSWORD = '2107Cr00ks!';

test.describe('Modal Theme Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to portal
    await page.goto(PORTAL_URL);
    
    // Login if needed
    const loginField = await page.locator('input[name="data[User][login]"]').first();
    if (await loginField.isVisible()) {
      await loginField.fill(USERNAME);
      await page.locator('input[name="data[User][password]"]').fill(PASSWORD);
      await page.locator('input[type="submit"][value="Login"]').click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Modal theming in dark mode', async ({ page }) => {
    // Ensure dark theme
    const shell = await page.locator('#grid4-app-shell');
    const isDark = await shell.evaluate(el => el.classList.contains('theme-dark'));
    
    if (!isDark) {
      await page.click('#grid4-theme-toggle');
      // Handle refresh dialog
      page.once('dialog', dialog => dialog.accept());
      await page.waitForLoadState('networkidle');
    }
    
    // Open Add User modal
    await page.click('text=Users');
    await page.waitForTimeout(500);
    await page.click('a:has-text("Add")');
    await page.waitForSelector('.modal.in', { timeout: 10000 });
    
    // Check modal background color
    const modalContent = await page.locator('.modal-content').first();
    const bgColor = await modalContent.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    console.log('Dark theme modal background:', bgColor);
    
    // Check form label backgrounds
    const label = await page.locator('.modal label').first();
    const labelBg = await label.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    console.log('Label background:', labelBg);
    
    // Take screenshot
    await page.screenshot({ path: 'dark-modal-test.png', fullPage: true });
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('Modal theming in light mode', async ({ page }) => {
    // Ensure light theme
    const shell = await page.locator('#grid4-app-shell');
    const isDark = await shell.evaluate(el => el.classList.contains('theme-dark'));
    
    if (isDark) {
      await page.click('#grid4-theme-toggle');
      // Handle refresh dialog
      page.once('dialog', dialog => dialog.accept());
      await page.waitForLoadState('networkidle');
    }
    
    // Open Add User modal
    await page.click('text=Users');
    await page.waitForTimeout(500);
    await page.click('a:has-text("Add")');
    await page.waitForSelector('.modal.in', { timeout: 10000 });
    
    // Check modal background color
    const modalContent = await page.locator('.modal-content').first();
    const bgColor = await modalContent.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    console.log('Light theme modal background:', bgColor);
    
    // Take screenshot
    await page.screenshot({ path: 'light-modal-test.png', fullPage: true });
    
    // Close modal
    await page.keyboard.press('Escape');
  });
});