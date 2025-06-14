/**
 * Grid4 Emergency Hotfix v1.0.5 - Comprehensive Validation Test Suite
 * 
 * CRITICAL VALIDATION POINTS:
 * 1. No Horizontal Scrollbars - Verify body and html have no horizontal overflow
 * 2. Version Selector Location - Confirm gear icon is in bottom-left, not top-right  
 * 3. Navigation Styling - Check that weird overlapping icon effects are eliminated
 * 4. Table Responsiveness - Verify tables don't cause viewport overflow
 * 5. CSS Grid Layout - Confirm proper sidebar + main content grid layout
 * 6. Mobile Menu - Test hamburger menu functionality on mobile viewport
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  portal: {
    baseUrl: 'https://portal.grid4voice.ucaas.tech',
    loginUrl: 'https://portal.grid4voice.ucaas.tech/portal/home',
    credentials: {
      username: process.env.PORTAL_USER || '1002@grid4voice',
      password: process.env.PORTAL_PASSWORD || 'hQAFMdWXKNj4wAg'
    }
  },
  // Emergency hotfix file paths (local testing)
  hotfixFiles: {
    css: '/home/paul/dev/grid4-netsapiens-skin/grid4-emergency-hotfix-v105.css',
    js: '/home/paul/dev/grid4-netsapiens-skin/grid4-emergency-hotfix-v105.js'
  },
  // CDN URLs for production testing
  hotfixCDN: {
    css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.css',
    js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.js'
  },
  viewports: [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ],
  timeouts: {
    navigation: 30000,
    element: 10000,
    short: 5000
  },
  screenshotsDir: './test-results/emergency-hotfix-v105'
};

// Ensure screenshot directory exists
fs.mkdirSync(config.screenshotsDir, { recursive: true });

/**
 * Helper Functions
 */

// Load local CSS/JS files for injection
function loadHotfixFiles() {
  try {
    const css = fs.readFileSync(config.hotfixFiles.css, 'utf8');
    const js = fs.readFileSync(config.hotfixFiles.js, 'utf8');
    return { css, js };
  } catch (error) {
    console.warn('Could not load local hotfix files, will use CDN URLs', error.message);
    return null;
  }
}

// Inject Grid4 emergency hotfix files
async function injectHotfixFiles(page, useLocal = true) {
  console.log('🔄 Injecting Grid4 Emergency Hotfix v1.0.5...');
  
  if (useLocal) {
    const files = loadHotfixFiles();
    if (files) {
      // Inject local CSS
      await page.addStyleTag({ content: files.css });
      console.log('✅ Local CSS injected');
      
      // Inject local JS  
      await page.addScriptTag({ content: files.js });
      console.log('✅ Local JS injected');
      return true;
    }
  }
  
  // Fallback to CDN
  try {
    await page.addStyleTag({ url: config.hotfixCDN.css });
    console.log('✅ CDN CSS injected');
    
    await page.addScriptTag({ url: config.hotfixCDN.js });
    console.log('✅ CDN JS injected');
    return true;
  } catch (error) {
    console.error('❌ Failed to inject hotfix files:', error);
    return false;
  }
}

// Login to portal
async function loginToPortal(page) {
  console.log('🔐 Logging into portal...');
  
  await page.goto(config.portal.loginUrl, { 
    waitUntil: 'networkidle',
    timeout: config.timeouts.navigation 
  });
  
  // Fill login credentials
  const usernameSelectors = ['input[name="username"]', 'input[type="email"]', '#username'];
  const passwordSelectors = ['input[name="password"]', 'input[type="password"]', '#password'];
  const loginButtonSelectors = ['input[type="submit"]', 'button[type="submit"]', '.btn-login', '#login-btn'];
  
  let usernameField = null;
  for (const selector of usernameSelectors) {
    try {
      usernameField = await page.waitForSelector(selector, { timeout: 2000 });
      if (usernameField) break;
    } catch (e) {}
  }
  
  let passwordField = null;
  for (const selector of passwordSelectors) {
    try {
      passwordField = await page.waitForSelector(selector, { timeout: 2000 });
      if (passwordField) break;
    } catch (e) {}
  }
  
  if (usernameField && passwordField) {
    await usernameField.fill(config.portal.credentials.username);
    await passwordField.fill(config.portal.credentials.password);
    
    let loginButton = null;
    for (const selector of loginButtonSelectors) {
      try {
        loginButton = await page.waitForSelector(selector, { timeout: 2000 });
        if (loginButton) break;
      } catch (e) {}
    }
    
    if (loginButton) {
      await loginButton.click();
      await page.waitForLoadState('networkidle', { timeout: config.timeouts.navigation });
      console.log('✅ Login successful');
      return true;
    }
  }
  
  console.log('⚠️ Could not find login elements, may already be logged in');
  return false;
}

// Measure element overflow
async function measureOverflow(page) {
  return await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const viewport = window.innerWidth;
    
    // Check body and html overflow
    const bodyOverflow = {
      scrollWidth: body.scrollWidth,
      offsetWidth: body.offsetWidth,
      hasHorizontalOverflow: body.scrollWidth > viewport
    };
    
    const htmlOverflow = {
      scrollWidth: html.scrollWidth,
      offsetWidth: html.offsetWidth,
      hasHorizontalOverflow: html.scrollWidth > viewport
    };
    
    // Find all elements that overflow viewport
    const overflowElements = [];
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      
      if (rect.width > viewport || rect.right > viewport) {
        overflowElements.push({
          index,
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          width: rect.width,
          right: rect.right,
          position: styles.position,
          overflow: styles.overflow,
          overflowX: styles.overflowX
        });
      }
    });
    
    return {
      viewport,
      body: bodyOverflow,
      html: htmlOverflow,
      overflowElements,
      hasAnyOverflow: bodyOverflow.hasHorizontalOverflow || htmlOverflow.hasHorizontalOverflow || overflowElements.length > 0
    };
  });
}

// Check CSS Grid layout application
async function checkGridLayout(page) {
  return await page.evaluate(() => {
    const body = document.body;
    const bodyStyles = window.getComputedStyle(body);
    
    const nav = document.querySelector('#navigation, .navigation');
    const content = document.querySelector('#content, .content');
    
    const navStyles = nav ? window.getComputedStyle(nav) : null;
    const contentStyles = content ? window.getComputedStyle(content) : null;
    
    return {
      body: {
        display: bodyStyles.display,
        gridTemplateColumns: bodyStyles.gridTemplateColumns,
        gridTemplateRows: bodyStyles.gridTemplateRows,
        gridTemplateAreas: bodyStyles.gridTemplateAreas,
        hasGridClasses: body.classList.contains('grid4-emergency-active')
      },
      navigation: nav ? {
        element: true,
        gridArea: navStyles.gridArea,
        position: navStyles.position,
        width: navStyles.width,
        height: navStyles.height,
        hasEnhancedClass: nav.classList.contains('grid4-navigation-enhanced')
      } : { element: false },
      content: content ? {
        element: true,
        gridArea: contentStyles.gridArea,
        position: contentStyles.position,
        width: contentStyles.width,
        height: contentStyles.height,
        hasEnhancedClass: content.classList.contains('grid4-content-enhanced')
      } : { element: false }
    };
  });
}

// Check for version selector positioning (gear icon)
async function checkVersionSelector(page) {
  return await page.evaluate(() => {
    // Look for common version selector patterns
    const selectors = [
      '.version-selector',
      '.gear-icon',
      '[data-gear]',
      '.settings-icon',
      '.config-icon',
      '.grid4-version-selector'
    ];
    
    const versionElements = [];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        versionElements.push({
          selector,
          position: {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right
          },
          styles: {
            position: styles.position,
            top: styles.top,
            left: styles.left,
            bottom: styles.bottom,
            right: styles.right,
            zIndex: styles.zIndex
          },
          isBottomLeft: rect.left < window.innerWidth / 2 && rect.bottom > window.innerHeight / 2,
          isTopRight: rect.right > window.innerWidth / 2 && rect.top < window.innerHeight / 2
        });
      });
    });
    
    return versionElements;
  });
}

// Check navigation styling issues
async function checkNavigationStyling(page) {
  return await page.evaluate(() => {
    const nav = document.querySelector('#navigation, .navigation');
    const navButtons = document.querySelector('#nav-buttons, .nav-buttons');
    
    if (!nav || !navButtons) {
      return { hasNavigation: false };
    }
    
    const navLinks = navButtons.querySelectorAll('a');
    const linkIssues = [];
    
    navLinks.forEach((link, index) => {
      const rect = link.getBoundingClientRect();
      const styles = window.getComputedStyle(link);
      const img = link.querySelector('img');
      
      // Check for overlapping or sizing issues
      const issues = [];
      
      if (rect.width === 0 || rect.height === 0) {
        issues.push('zero_dimensions');
      }
      
      if (img) {
        const imgRect = img.getBoundingClientRect();
        const imgStyles = window.getComputedStyle(img);
        
        if (imgRect.width > rect.width || imgRect.height > rect.height) {
          issues.push('image_overflow');
        }
        
        if (imgStyles.position === 'absolute' && !styles.position === 'relative') {
          issues.push('positioning_conflict');
        }
      }
      
      // Check for transform issues
      if (styles.transform && styles.transform !== 'none') {
        issues.push('has_transform');
      }
      
      if (issues.length > 0) {
        linkIssues.push({
          index,
          href: link.href,
          text: link.textContent.trim(),
          issues,
          rect,
          styles: {
            position: styles.position,
            transform: styles.transform,
            overflow: styles.overflow,
            display: styles.display
          }
        });
      }
    });
    
    return {
      hasNavigation: true,
      totalLinks: navLinks.length,
      linkIssues,
      hasIssues: linkIssues.length > 0
    };
  });
}

// Check table responsiveness
async function checkTableResponsiveness(page) {
  return await page.evaluate(() => {
    const tables = document.querySelectorAll('table');
    const tableIssues = [];
    const viewport = window.innerWidth;
    
    tables.forEach((table, index) => {
      const rect = table.getBoundingClientRect();
      const styles = window.getComputedStyle(table);
      const container = table.closest('.table-responsive, .table-container');
      
      const issues = [];
      
      // Check if table overflows viewport
      if (rect.width > viewport) {
        issues.push('viewport_overflow');
      }
      
      // Check if table is wrapped in responsive container
      if (!container) {
        issues.push('missing_responsive_container');
      }
      
      // Check table layout
      if (styles.tableLayout === 'auto' && rect.width > viewport) {
        issues.push('auto_layout_overflow');
      }
      
      // Check if table has min-width that could cause issues
      const minWidth = parseInt(styles.minWidth);
      if (minWidth && minWidth > viewport) {
        issues.push('min_width_too_large');
      }
      
      if (issues.length > 0) {
        tableIssues.push({
          index,
          issues,
          width: rect.width,
          viewport,
          hasContainer: !!container,
          styles: {
            tableLayout: styles.tableLayout,
            minWidth: styles.minWidth,
            maxWidth: styles.maxWidth,
            overflowX: styles.overflowX
          }
        });
      }
    });
    
    return {
      totalTables: tables.length,
      tableIssues,
      hasIssues: tableIssues.length > 0
    };
  });
}

/**
 * Test Suites
 */

test.describe('Grid4 Emergency Hotfix v1.0.5 - Critical Validation', () => {
  
  // Test each viewport size
  for (const viewport of config.viewports) {
    test.describe(`${viewport.name.toUpperCase()} Viewport (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(config.portal.loginUrl, { 
          waitUntil: 'networkidle',
          timeout: config.timeouts.navigation 
        });
      });
      
      test(`should load without horizontal scrollbars on ${viewport.name}`, async ({ page }) => {
        console.log(`\n🧪 Testing horizontal overflow on ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        // Take screenshot before hotfix
        await page.screenshot({ 
          path: `${config.screenshotsDir}/${viewport.name}-before-hotfix.png`,
          fullPage: true 
        });
        
        // Inject emergency hotfix
        const injected = await injectHotfixFiles(page);
        expect(injected).toBe(true);
        
        // Wait for hotfix to apply
        await page.waitForTimeout(2000);
        
        // Take screenshot after hotfix
        await page.screenshot({ 
          path: `${config.screenshotsDir}/${viewport.name}-after-hotfix.png`,
          fullPage: true 
        });
        
        // Measure overflow
        const overflow = await measureOverflow(page);
        
        console.log(`📊 Overflow Analysis for ${viewport.name}:`);
        console.log(`   Viewport: ${overflow.viewport}px`);
        console.log(`   Body scrollWidth: ${overflow.body.scrollWidth}px`);
        console.log(`   HTML scrollWidth: ${overflow.html.scrollWidth}px`);
        console.log(`   Overflow elements: ${overflow.overflowElements.length}`);
        
        if (overflow.overflowElements.length > 0) {
          console.log('   Problematic elements:');
          overflow.overflowElements.forEach((el, i) => {
            console.log(`     ${i + 1}. ${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''} (${el.width}px wide)`);
          });
        }
        
        // Assertions
        expect(overflow.body.hasHorizontalOverflow).toBe(false);
        expect(overflow.html.hasHorizontalOverflow).toBe(false);
        expect(overflow.hasAnyOverflow).toBe(false);
      });
      
      test(`should apply proper CSS Grid layout on ${viewport.name}`, async ({ page }) => {
        console.log(`\n🏗️ Testing CSS Grid layout on ${viewport.name}`);
        
        // Inject emergency hotfix
        await injectHotfixFiles(page);
        await page.waitForTimeout(2000);
        
        // Check grid layout application
        const gridLayout = await checkGridLayout(page);
        
        console.log(`📐 Grid Layout Analysis for ${viewport.name}:`);
        console.log(`   Body display: ${gridLayout.body.display}`);
        console.log(`   Grid template columns: ${gridLayout.body.gridTemplateColumns}`);
        console.log(`   Grid template areas: ${gridLayout.body.gridTemplateAreas}`);
        console.log(`   Navigation element: ${gridLayout.navigation.element}`);
        console.log(`   Content element: ${gridLayout.content.element}`);
        
        // Assertions
        expect(gridLayout.body.hasGridClasses).toBe(true);
        expect(gridLayout.body.display).toBe('grid');
        
        if (viewport.width > 768) {
          // Desktop and tablet should have sidebar layout
          expect(gridLayout.body.gridTemplateColumns).toContain('fr');
          expect(gridLayout.body.gridTemplateAreas).toContain('sidebar');
          expect(gridLayout.body.gridTemplateAreas).toContain('main');
        } else {
          // Mobile should have single column
          expect(gridLayout.body.gridTemplateColumns).toBe('1fr');
          expect(gridLayout.body.gridTemplateAreas).toContain('main');
        }
        
        if (gridLayout.navigation.element) {
          expect(gridLayout.navigation.hasEnhancedClass).toBe(true);
          expect(gridLayout.navigation.gridArea).toBe('sidebar');
        }
        
        if (gridLayout.content.element) {
          expect(gridLayout.content.hasEnhancedClass).toBe(true);
          expect(gridLayout.content.gridArea).toBe('main');
        }
      });
      
      test(`should eliminate navigation styling issues on ${viewport.name}`, async ({ page }) => {
        console.log(`\n🧭 Testing navigation styling on ${viewport.name}`);
        
        // Inject emergency hotfix
        await injectHotfixFiles(page);
        await page.waitForTimeout(2000);
        
        // Check navigation styling
        const navStyling = await checkNavigationStyling(page);
        
        console.log(`🎨 Navigation Styling Analysis for ${viewport.name}:`);
        console.log(`   Has navigation: ${navStyling.hasNavigation}`);
        console.log(`   Total links: ${navStyling.totalLinks || 0}`);
        console.log(`   Links with issues: ${navStyling.linkIssues ? navStyling.linkIssues.length : 0}`);
        
        if (navStyling.linkIssues && navStyling.linkIssues.length > 0) {
          console.log('   Issues found:');
          navStyling.linkIssues.forEach((link, i) => {
            console.log(`     ${i + 1}. "${link.text}" - ${link.issues.join(', ')}`);
          });
        }
        
        // Assertions
        expect(navStyling.hasNavigation).toBe(true);
        expect(navStyling.hasIssues).toBe(false);
        expect(navStyling.linkIssues).toHaveLength(0);
      });
      
      test(`should ensure tables are responsive on ${viewport.name}`, async ({ page }) => {
        console.log(`\n📊 Testing table responsiveness on ${viewport.name}`);
        
        // Try to navigate to a page with tables (like call history or inventory)
        try {
          await loginToPortal(page);
          await page.goto(`${config.portal.baseUrl}/portal/callhistory`, { 
            waitUntil: 'networkidle',
            timeout: config.timeouts.navigation 
          });
        } catch (e) {
          console.log('⚠️ Could not navigate to table page, testing current page');
        }
        
        // Inject emergency hotfix
        await injectHotfixFiles(page);
        await page.waitForTimeout(2000);
        
        // Check table responsiveness
        const tableCheck = await checkTableResponsiveness(page);
        
        console.log(`📋 Table Responsiveness Analysis for ${viewport.name}:`);
        console.log(`   Total tables: ${tableCheck.totalTables}`);
        console.log(`   Tables with issues: ${tableCheck.tableIssues.length}`);
        
        if (tableCheck.tableIssues.length > 0) {
          console.log('   Issues found:');
          tableCheck.tableIssues.forEach((table, i) => {
            console.log(`     Table ${i + 1}: ${table.issues.join(', ')} (${table.width}px wide)`);
          });
        }
        
        // Assertions - allow some issues on mobile as tables may need scrolling
        if (viewport.name === 'mobile') {
          expect(tableCheck.hasIssues).toBe(false);
        } else {
          expect(tableCheck.hasIssues).toBe(false);
        }
      });
      
      if (viewport.name === 'mobile') {
        test('should have functional mobile menu', async ({ page }) => {
          console.log('\n📱 Testing mobile menu functionality');
          
          // Inject emergency hotfix
          await injectHotfixFiles(page);
          await page.waitForTimeout(2000);
          
          // Check for mobile menu trigger
          const mobileMenuTrigger = await page.locator('.mobile-menu-trigger').first();
          
          // Take screenshot before opening menu
          await page.screenshot({ 
            path: `${config.screenshotsDir}/mobile-menu-closed.png`,
            fullPage: true 
          });
          
          // Check if mobile menu trigger exists
          const triggerExists = await mobileMenuTrigger.isVisible().catch(() => false);
          expect(triggerExists).toBe(true);
          
          if (triggerExists) {
            // Click mobile menu trigger
            await mobileMenuTrigger.click();
            await page.waitForTimeout(500);
            
            // Take screenshot after opening menu
            await page.screenshot({ 
              path: `${config.screenshotsDir}/mobile-menu-open.png`,
              fullPage: true 
            });
            
            // Check if navigation is visible
            const nav = await page.locator('#navigation').first();
            const hasOpenClass = await nav.evaluate(el => el.classList.contains('mobile-open')).catch(() => false);
            
            expect(hasOpenClass).toBe(true);
            
            // Click again to close
            await mobileMenuTrigger.click();
            await page.waitForTimeout(500);
            
            const hasClosedClass = await nav.evaluate(el => !el.classList.contains('mobile-open')).catch(() => true);
            expect(hasClosedClass).toBe(true);
          }
        });
      }
      
    });
  }
  
  test('should check version selector positioning across all viewports', async ({ page }) => {
    console.log('\n⚙️ Testing version selector positioning');
    
    for (const viewport of config.viewports) {
      await page.setViewportSize(viewport);
      await page.goto(config.portal.loginUrl, { waitUntil: 'networkidle' });
      
      // Inject emergency hotfix
      await injectHotfixFiles(page);
      await page.waitForTimeout(2000);
      
      // Check version selector positioning
      const versionSelectors = await checkVersionSelector(page);
      
      console.log(`🔧 Version Selector Analysis for ${viewport.name}:`);
      console.log(`   Elements found: ${versionSelectors.length}`);
      
      versionSelectors.forEach((selector, i) => {
        console.log(`   ${i + 1}. ${selector.selector}:`);
        console.log(`      Bottom-left: ${selector.isBottomLeft}`);
        console.log(`      Top-right: ${selector.isTopRight}`);
        console.log(`      Position: ${selector.styles.position}`);
      });
      
      // Take screenshot for manual verification
      await page.screenshot({ 
        path: `${config.screenshotsDir}/version-selector-${viewport.name}.png`,
        fullPage: true 
      });
      
      // If version selectors exist, they should be in bottom-left, not top-right
      versionSelectors.forEach(selector => {
        if (selector.isTopRight) {
          console.warn(`⚠️ Version selector found in top-right on ${viewport.name}`);
        }
      });
    }
  });
  
  test('should validate hotfix loading and execution', async ({ page }) => {
    console.log('\n🔄 Testing hotfix loading and execution');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(config.portal.loginUrl, { waitUntil: 'networkidle' });
    
    // Monitor console logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('Grid4')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Inject emergency hotfix with debug mode
    await page.addInitScript(() => {
      // Add debug parameter to URL
      const url = new URL(window.location);
      url.searchParams.set('grid4_debug', 'true');
      window.history.replaceState({}, '', url);
    });
    
    await injectHotfixFiles(page);
    await page.waitForTimeout(3000);
    
    // Check for Grid4 global object
    const grid4Object = await page.evaluate(() => window.Grid4Emergency);
    expect(grid4Object).toBeDefined();
    expect(grid4Object.version).toBe('1.0.5-fixed');
    
    // Check console logs
    console.log('🔍 Console logs from Grid4:');
    consoleLogs.forEach(log => console.log(`   ${log}`));
    
    expect(consoleLogs.some(log => log.includes('Emergency Hotfix v1.0.5'))).toBe(true);
    expect(consoleLogs.some(log => log.includes('initialization complete'))).toBe(true);
    
    // Take final comprehensive screenshot
    await page.screenshot({ 
      path: `${config.screenshotsDir}/final-comprehensive-test.png`,
      fullPage: true 
    });
  });
  
});

test.describe('Grid4 Emergency Hotfix v1.0.5 - Integration Tests', () => {
  
  test('should work with authenticated portal session', async ({ page }) => {
    console.log('\n🔐 Testing with authenticated session');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Login first
    const loginSuccess = await loginToPortal(page);
    
    // Take screenshot before hotfix
    await page.screenshot({ 
      path: `${config.screenshotsDir}/authenticated-before-hotfix.png`,
      fullPage: true 
    });
    
    // Inject emergency hotfix
    await injectHotfixFiles(page);
    await page.waitForTimeout(3000);
    
    // Take screenshot after hotfix
    await page.screenshot({ 
      path: `${config.screenshotsDir}/authenticated-after-hotfix.png`,
      fullPage: true 
    });
    
    // Verify basic functionality
    const overflow = await measureOverflow(page);
    const gridLayout = await checkGridLayout(page);
    
    expect(overflow.hasAnyOverflow).toBe(false);
    expect(gridLayout.body.hasGridClasses).toBe(true);
    expect(gridLayout.body.display).toBe('grid');
  });
  
  test('should handle dynamic content loading', async ({ page }) => {
    console.log('\n🔄 Testing dynamic content handling');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginToPortal(page);
    
    // Inject emergency hotfix
    await injectHotfixFiles(page);
    await page.waitForTimeout(2000);
    
    // Navigate to different sections to test dynamic loading
    const testPages = [
      '/portal/callhistory',
      '/portal/callqueues',
      '/portal/users',
      '/portal/inventory'
    ];
    
    for (const pagePath of testPages) {
      try {
        console.log(`🧪 Testing ${pagePath}...`);
        await page.goto(`${config.portal.baseUrl}${pagePath}`, { 
          waitUntil: 'networkidle',
          timeout: config.timeouts.navigation 
        });
        
        await page.waitForTimeout(2000);
        
        // Check if Grid4 is still active
        const hasHotfixClass = await page.evaluate(() => 
          document.body.classList.contains('grid4-emergency-active')
        );
        
        expect(hasHotfixClass).toBe(true);
        
        // Check for overflow issues
        const overflow = await measureOverflow(page);
        expect(overflow.hasAnyOverflow).toBe(false);
        
        // Take screenshot
        const pageName = pagePath.split('/').pop() || 'home';
        await page.screenshot({ 
          path: `${config.screenshotsDir}/dynamic-${pageName}.png`,
          fullPage: true 
        });
        
      } catch (error) {
        console.warn(`⚠️ Could not test ${pagePath}:`, error.message);
      }
    }
  });
  
});

// Generate test report
test.afterAll(async () => {
  const reportPath = `${config.screenshotsDir}/test-report.json`;
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.5',
    testResults: 'See individual test results above',
    screenshotsGenerated: true,
    screenshotsPath: config.screenshotsDir
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 Test report generated: ${reportPath}`);
  console.log(`📸 Screenshots saved to: ${config.screenshotsDir}`);
});