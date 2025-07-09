/**
 * Grid4 Portal Skin v3.0.0 - Comprehensive Test Suite
 * Tests the fresh implementation for compliance and functionality
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const TEST_CONFIG = {
  portalUrl: 'https://portal.grid4voice.ucaas.tech/portal/',
  cssUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v3.css',
  jsUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v3.js',
  credentials: {
    username: process.env.PORTAL_USERNAME || 'test-user',
    password: process.env.PORTAL_PASSWORD || 'test-password'
  }
};

// Helper function to inject Grid4 v3 files
async function injectGrid4V3(page) {
  // Inject CSS
  await page.addStyleTag({
    url: TEST_CONFIG.cssUrl
  });
  
  // Inject JavaScript
  await page.addScriptTag({
    url: TEST_CONFIG.jsUrl
  });
  
  // Wait for Grid4Portal to initialize
  await page.waitForFunction(() => {
    return window.Grid4Portal && window.Grid4Portal.config.initialized;
  }, { timeout: 10000 });
}

// Helper function to login
async function loginToPortal(page) {
  await page.goto(TEST_CONFIG.portalUrl);
  await page.waitForSelector('#username', { timeout: 10000 });
  await page.fill('#username', TEST_CONFIG.credentials.username);
  await page.fill('#password', TEST_CONFIG.credentials.password);
  await page.click('input[type="submit"]');
  await page.waitForSelector('#content', { timeout: 15000 });
}

test.describe('Grid4 Portal Skin v3.0.0 - Implementation Tests', () => {
  
  test('CSS Variables and Design System', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test CSS custom properties are applied
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      
      return {
        primaryDark: computedStyle.getPropertyValue('--grid4-primary-dark'),
        surfaceDark: computedStyle.getPropertyValue('--grid4-surface-dark'),
        accentBlue: computedStyle.getPropertyValue('--grid4-accent-blue'),
        sidebarWidth: computedStyle.getPropertyValue('--grid4-sidebar-width'),
        headerHeight: computedStyle.getPropertyValue('--grid4-header-height')
      };
    });
    
    expect(cssVariables.primaryDark).toBe('#1a2332');
    expect(cssVariables.surfaceDark).toBe('#1e2736');
    expect(cssVariables.accentBlue).toBe('#00d4ff');
    expect(cssVariables.sidebarWidth).toBe('240px');
    expect(cssVariables.headerHeight).toBe('60px');
    
    console.log('✅ CSS Variables validated:', cssVariables);
  });
  
  test('JavaScript Initialization and Namespace', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test Grid4Portal namespace and initialization
    const initStatus = await page.evaluate(() => {
      return {
        namespaceExists: typeof window.Grid4Portal !== 'undefined',
        initialized: window.Grid4Portal && window.Grid4Portal.config.initialized,
        version: window.Grid4Portal && window.Grid4Portal.config.version,
        modules: window.Grid4Portal ? Object.keys(window.Grid4Portal) : [],
        portalDetected: window.Grid4Portal && window.Grid4Portal.portalDetection.isNetSapiens
      };
    });
    
    expect(initStatus.namespaceExists).toBe(true);
    expect(initStatus.initialized).toBe(true);
    expect(initStatus.version).toBe('3.0.0');
    expect(initStatus.portalDetected).toBe(true);
    expect(initStatus.modules).toContain('portalDetection');
    expect(initStatus.modules).toContain('sidebar');
    expect(initStatus.modules).toContain('navigation');
    
    console.log('✅ JavaScript initialization validated:', initStatus);
  });
  
  test('Header Layout and Styling', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test header styling
    const headerStyles = await page.evaluate(() => {
      const header = document.querySelector('#header');
      if (!header) return null;
      
      const computedStyle = window.getComputedStyle(header);
      return {
        position: computedStyle.position,
        top: computedStyle.top,
        height: computedStyle.height,
        backgroundColor: computedStyle.backgroundColor,
        zIndex: computedStyle.zIndex,
        display: computedStyle.display
      };
    });
    
    expect(headerStyles).not.toBeNull();
    expect(headerStyles.position).toBe('fixed');
    expect(headerStyles.top).toBe('0px');
    expect(headerStyles.height).toBe('60px');
    expect(headerStyles.zIndex).toBe('1000');
    expect(headerStyles.display).toBe('flex');
    
    console.log('✅ Header layout validated:', headerStyles);
  });
  
  test('Sidebar Navigation Structure', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test sidebar structure and styling
    const sidebarInfo = await page.evaluate(() => {
      const navigation = document.querySelector('#navigation');
      const navButtons = document.querySelector('#nav-buttons');
      
      if (!navigation || !navButtons) return null;
      
      const navStyle = window.getComputedStyle(navigation);
      const navLinks = Array.from(navButtons.querySelectorAll('li a.nav-link'));
      
      return {
        navigationExists: !!navigation,
        navButtonsExists: !!navButtons,
        position: navStyle.position,
        width: navStyle.width,
        top: navStyle.top,
        linkCount: navLinks.length,
        hasNavText: navLinks.some(link => link.querySelector('.nav-text')),
        hasIcons: navLinks.some(link => {
          const beforeContent = window.getComputedStyle(link, '::before').content;
          return beforeContent && beforeContent !== 'none' && beforeContent !== '""';
        })
      };
    });
    
    expect(sidebarInfo).not.toBeNull();
    expect(sidebarInfo.navigationExists).toBe(true);
    expect(sidebarInfo.navButtonsExists).toBe(true);
    expect(sidebarInfo.position).toBe('fixed');
    expect(sidebarInfo.width).toBe('240px');
    expect(sidebarInfo.top).toBe('60px');
    expect(sidebarInfo.linkCount).toBeGreaterThan(0);
    expect(sidebarInfo.hasNavText).toBe(true);
    expect(sidebarInfo.hasIcons).toBe(true);
    
    console.log('✅ Sidebar navigation validated:', sidebarInfo);
  });
  
  test('Sidebar Toggle Functionality', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test sidebar toggle button creation and functionality
    const toggleButton = await page.locator('#grid4-sidebar-toggle');
    await expect(toggleButton).toBeVisible();
    
    // Test toggle functionality
    const initialState = await page.evaluate(() => {
      return document.body.classList.contains('grid4-sidebar-collapsed');
    });
    
    await toggleButton.click();
    await page.waitForTimeout(300); // Wait for transition
    
    const afterToggleState = await page.evaluate(() => {
      return document.body.classList.contains('grid4-sidebar-collapsed');
    });
    
    expect(afterToggleState).toBe(!initialState);
    
    // Test toggle again
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const finalState = await page.evaluate(() => {
      return document.body.classList.contains('grid4-sidebar-collapsed');
    });
    
    expect(finalState).toBe(initialState);
    
    console.log('✅ Sidebar toggle functionality validated');
  });
  
  test('Content Area Layout', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test content area styling
    const contentStyles = await page.evaluate(() => {
      const content = document.querySelector('#content');
      if (!content) return null;
      
      const computedStyle = window.getComputedStyle(content);
      return {
        marginLeft: computedStyle.marginLeft,
        marginTop: computedStyle.marginTop,
        backgroundColor: computedStyle.backgroundColor,
        padding: computedStyle.padding,
        minHeight: computedStyle.minHeight
      };
    });
    
    expect(contentStyles).not.toBeNull();
    expect(contentStyles.marginLeft).toBe('240px');
    expect(contentStyles.marginTop).toBe('60px');
    expect(contentStyles.padding).toBe('24px');
    
    console.log('✅ Content area layout validated:', contentStyles);
  });
  
  test('Panel Components Styling', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test panel styling
    const panelStyles = await page.evaluate(() => {
      const panels = document.querySelectorAll('.panel');
      if (panels.length === 0) return null;
      
      const firstPanel = panels[0];
      const computedStyle = window.getComputedStyle(firstPanel);
      
      return {
        panelCount: panels.length,
        backgroundColor: computedStyle.backgroundColor,
        borderRadius: computedStyle.borderRadius,
        border: computedStyle.border,
        marginBottom: computedStyle.marginBottom
      };
    });
    
    if (panelStyles) {
      expect(panelStyles.panelCount).toBeGreaterThan(0);
      expect(panelStyles.borderRadius).toBe('8px');
      expect(panelStyles.marginBottom).toBe('20px');
      
      console.log('✅ Panel components validated:', panelStyles);
    } else {
      console.log('ℹ️ No panels found on current page');
    }
  });
  
  test('Mobile Responsive Behavior', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test desktop view first
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const desktopState = await page.evaluate(() => {
      const navigation = document.querySelector('#navigation');
      const navStyle = window.getComputedStyle(navigation);
      
      return {
        width: navStyle.width,
        transform: navStyle.transform,
        isMobileMenuOpen: document.body.classList.contains('grid4-mobile-menu-open')
      };
    });
    
    expect(desktopState.width).toBe('240px');
    expect(desktopState.isMobileMenuOpen).toBe(false);
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileState = await page.evaluate(() => {
      const navigation = document.querySelector('#navigation');
      const navStyle = window.getComputedStyle(navigation);
      
      return {
        width: navStyle.width,
        transform: navStyle.transform,
        isMobileMenuOpen: document.body.classList.contains('grid4-mobile-menu-open')
      };
    });
    
    expect(mobileState.width).toBe('240px');
    expect(mobileState.transform).toContain('translateX(-100%)');
    
    // Test mobile menu toggle
    const toggleButton = await page.locator('#grid4-sidebar-toggle');
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const mobileMenuOpenState = await page.evaluate(() => {
      return document.body.classList.contains('grid4-mobile-menu-open');
    });
    
    expect(mobileMenuOpenState).toBe(true);
    
    console.log('✅ Mobile responsive behavior validated');
  });
  
  test('Performance and Error Handling', async ({ page }) => {
    await loginToPortal(page);
    
    // Monitor console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await injectGrid4V3(page);
    
    // Test performance metrics
    const performanceMetrics = await page.evaluate(() => {
      if (window.Grid4Portal && window.Grid4Portal.performance) {
        return window.Grid4Portal.performance.getMetrics();
      }
      return null;
    });
    
    // Check for errors
    expect(consoleErrors.filter(error => error.includes('Grid4')).length).toBeLessThan(3);
    
    if (performanceMetrics) {
      expect(performanceMetrics.init_complete).toBeLessThan(5000); // Should initialize within 5 seconds
      console.log('✅ Performance metrics:', performanceMetrics);
    }
    
    console.log('✅ Error handling validated - Console errors:', consoleErrors.length);
  });
  
  test('FontAwesome Icon Integration', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test FontAwesome icons are applied
    const iconInfo = await page.evaluate(() => {
      const navLinks = document.querySelectorAll('#nav-buttons li a.nav-link');
      const iconData = [];
      
      navLinks.forEach((link, index) => {
        const beforeStyle = window.getComputedStyle(link, '::before');
        const content = beforeStyle.content;
        const fontFamily = beforeStyle.fontFamily;
        
        iconData.push({
          index: index,
          hasIcon: content && content !== 'none' && content !== '""',
          content: content,
          fontFamily: fontFamily,
          linkId: link.closest('li').id || 'unknown'
        });
      });
      
      return iconData;
    });
    
    expect(iconInfo.length).toBeGreaterThan(0);
    
    const iconsWithContent = iconInfo.filter(icon => icon.hasIcon);
    expect(iconsWithContent.length).toBeGreaterThan(0);
    
    // Check that FontAwesome is being used
    const hasFontAwesome = iconInfo.some(icon => 
      icon.fontFamily && icon.fontFamily.toLowerCase().includes('fontawesome')
    );
    
    expect(hasFontAwesome).toBe(true);
    
    console.log('✅ FontAwesome icons validated:', {
      totalLinks: iconInfo.length,
      iconsWithContent: iconsWithContent.length,
      hasFontAwesome: hasFontAwesome
    });
  });
  
  test('Local Storage and State Persistence', async ({ page }) => {
    await loginToPortal(page);
    await injectGrid4V3(page);
    
    // Test storage functionality
    const storageTest = await page.evaluate(() => {
      if (!window.Grid4Portal || !window.Grid4Portal.utils.storage) return null;
      
      const storage = window.Grid4Portal.utils.storage;
      
      // Test set and get
      const testKey = 'test_key';
      const testValue = { test: 'value', number: 123 };
      
      const setResult = storage.set(testKey, testValue);
      const getValue = storage.get(testKey);
      
      return {
        setResult: setResult,
        getValue: getValue,
        valuesMatch: JSON.stringify(testValue) === JSON.stringify(getValue)
      };
    });
    
    expect(storageTest).not.toBeNull();
    expect(storageTest.setResult).toBe(true);
    expect(storageTest.valuesMatch).toBe(true);
    
    console.log('✅ Local storage functionality validated');
  });
});

// Export test configuration for external use
module.exports = { TEST_CONFIG };
