// Login Page Object for NetSapiens Portal
const config = require('../config');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.login;
  }

  async navigateToLogin() {
    console.log('🌐 Navigating to NetSapiens portal...');
    await this.page.goto(config.portal.loginUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: config.timeouts.navigation
    });
    
    // Wait for page to stabilize
    await this.page.waitForTimeout(2000);
    
    console.log('✅ Portal loaded successfully');
    return this;
  }

  async findLoginForm() {
    console.log('🔍 Detecting login form elements...');
    
    // Try to find username field
    const usernameField = await this.findBestSelector([
      'input[name="username"]',
      'input[type="email"]', 
      'input[name="email"]',
      '#username',
      '#email',
      'input[placeholder*="username" i]',
      'input[placeholder*="email" i]'
    ]);
    
    if (!usernameField) {
      throw new Error('Could not find username/email field');
    }
    
    // Try to find password field
    const passwordField = await this.findBestSelector([
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      'input[placeholder*="password" i]'
    ]);
    
    if (!passwordField) {
      throw new Error('Could not find password field');
    }
    
    // Try to find login button
    const loginButton = await this.findBestSelector([
      'input[type="submit"]',
      'button[type="submit"]',
      'button[name="login"]',
      '.btn-login',
      '#login-btn',
      'button:contains("Login")',
      'button:contains("Sign In")',
      'input[value*="Login" i]',
      'input[value*="Sign" i]'
    ]);
    
    console.log('✅ Login form elements found');
    
    return {
      usernameField,
      passwordField, 
      loginButton
    };
  }

  async findBestSelector(selectors) {
    for (const selector of selectors) {
      try {
        const element = await this.page.$(selector);
        if (element) {
          console.log(`  ✓ Found element with selector: ${selector}`);
          return selector;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    return null;
  }

  async login(username = config.portal.credentials.username, password = config.portal.credentials.password) {
    console.log('🔐 Attempting to login...');
    
    try {
      const form = await this.findLoginForm();
      
      // Clear and fill username
      await this.page.click(form.usernameField);
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyA');
      await this.page.keyboard.up('Control');
      await this.page.type(form.usernameField, username);
      console.log(`  ✓ Username entered: ${username}`);
      
      // Clear and fill password
      await this.page.click(form.passwordField);
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyA');
      await this.page.keyboard.up('Control');
      await this.page.type(form.passwordField, password);
      console.log('  ✓ Password entered');
      
      // Submit form
      if (form.loginButton) {
        await this.page.click(form.loginButton);
        console.log('  ✓ Login button clicked');
      } else {
        // Fallback: submit the form by pressing Enter
        await this.page.keyboard.press('Enter');
        console.log('  ✓ Form submitted via Enter key');
      }
      
      // Wait for navigation or dashboard to load
      try {
        await this.page.waitForNavigation({ 
          waitUntil: 'domcontentloaded',
          timeout: config.timeouts.navigation
        });
        console.log('✅ Login successful - navigation detected');
      } catch (e) {
        // Check if we're already on the dashboard
        const isDashboard = await this.isLoggedIn();
        if (isDashboard) {
          console.log('✅ Login successful - already on dashboard');
        } else {
          throw new Error('Login failed - no navigation detected');
        }
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  }

  async isLoggedIn() {
    // Check for common post-login indicators
    const indicators = [
      '#navigation',
      '.navigation', 
      '#header-logo',
      '.dashboard',
      '.main-content',
      'a[href*="logout"]',
      '.user-menu'
    ];
    
    for (const indicator of indicators) {
      const element = await this.page.$(indicator);
      if (element) {
        console.log(`  ✓ Login indicator found: ${indicator}`);
        return true;
      }
    }
    
    return false;
  }

  async takeScreenshot(filename = 'login-page') {
    const screenshotPath = `${config.screenshots.outputDir}/${config.screenshots.prefix}-${filename}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📷 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }
}

module.exports = LoginPage;