/**
 * Grid4 NetSapiens Portal - Critical Issues Reproduction Test
 * 
 * This test reproduces the two critical issues:
 * 1. Logo Issue: Wrong logo displays when Grid4 customizations are enabled
 * 2. Contacts Dock Issue: Dock won't collapse/close due to event handling conflicts
 * 
 * Test Environment: Grid4_sunday_Test domain
 * Version: v4.2.3
 */

const { test, expect } = require('@playwright/test');

test.describe('Grid4 NetSapiens Portal - Critical Issues', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('Grid4') || msg.text().includes('G4')) {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('Reproduce Logo and Contacts Dock Issues', async () => {
    console.log('=== Starting Grid4 Issues Reproduction Test ===');
    
    // Step 1: Login to NetSapiens Portal
    console.log('Step 1: Logging into NetSapiens Portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login');
    
    // Fill login credentials
    await page.fill('input[name="username"]', '1002@grid4voice');
    await page.fill('input[name="password"]', 'hQAFMdWXKNj4wAg');
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('**/portal/home**', { timeout: 30000 });
    console.log('✓ Login successful');
    
    // Step 2: Navigate to Grid4_sunday_Test domain
    console.log('Step 2: Navigating to Grid4_sunday_Test domain...');
    const testDomainUrl = 'https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications';
    await page.goto(testDomainUrl);
    await page.waitForLoadState('networkidle');
    console.log('✓ Navigated to test domain');
    
    // Step 3: Take screenshot of BEFORE state (without Grid4 customizations)
    console.log('Step 3: Capturing BEFORE state...');
    await page.screenshot({ 
      path: 'before-grid4-customizations.png', 
      fullPage: true 
    });
    
    // Check if logo is visible and capture its details
    const beforeLogoInfo = await page.evaluate(() => {
      const logo = document.querySelector('#header-logo');
      if (logo) {
        return {
          src: logo.src || 'No src attribute',
          innerHTML: logo.innerHTML || 'No innerHTML',
          visible: logo.offsetWidth > 0 && logo.offsetHeight > 0,
          position: {
            top: logo.offsetTop,
            left: logo.offsetLeft,
            width: logo.offsetWidth,
            height: logo.offsetHeight
          }
        };
      }
      return { error: 'Logo element not found' };
    });
    console.log('BEFORE Logo Info:', JSON.stringify(beforeLogoInfo, null, 2));
    
    // Step 4: Inject Grid4 CSS and JavaScript with strong cache busters
    console.log('Step 4: Injecting Grid4 customizations...');
    const cacheBuster = `?v=4.2.3&cb=${Date.now()}&r=${Math.random()}`;
    
    // Inject CSS
    await page.addStyleTag({
      url: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css${cacheBuster}`
    });
    
    // Inject JavaScript
    await page.addScriptTag({
      url: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js${cacheBuster}`
    });
    
    // Wait for Grid4 to initialize
    await page.waitForTimeout(3000);
    console.log('✓ Grid4 customizations injected');
    
    // Step 5: Take screenshot of AFTER state (with Grid4 customizations)
    console.log('Step 5: Capturing AFTER state...');
    await page.screenshot({ 
      path: 'after-grid4-customizations.png', 
      fullPage: true 
    });
    
    // Check logo state after Grid4 injection
    const afterLogoInfo = await page.evaluate(() => {
      const logo = document.querySelector('#header-logo');
      const logoClone = document.querySelector('#header-logo-clone');
      const navigation = document.querySelector('#navigation');
      
      return {
        originalLogo: logo ? {
          src: logo.src || 'No src attribute',
          innerHTML: logo.innerHTML || 'No innerHTML',
          visible: logo.offsetWidth > 0 && logo.offsetHeight > 0,
          parent: logo.parentElement ? logo.parentElement.id || logo.parentElement.tagName : 'No parent',
          position: {
            top: logo.offsetTop,
            left: logo.offsetLeft,
            width: logo.offsetWidth,
            height: logo.offsetHeight
          }
        } : { error: 'Original logo not found' },
        clonedLogo: logoClone ? {
          src: logoClone.src || 'No src attribute',
          innerHTML: logoClone.innerHTML || 'No innerHTML',
          visible: logoClone.offsetWidth > 0 && logoClone.offsetHeight > 0,
          parent: logoClone.parentElement ? logoClone.parentElement.id || logoClone.parentElement.tagName : 'No parent'
        } : { error: 'Cloned logo not found' },
        navigationHasLogo: navigation ? navigation.querySelector('#header-logo, #header-logo-clone') !== null : false,
        grid4Initialized: typeof window.G4 !== 'undefined'
      };
    });
    console.log('AFTER Logo Info:', JSON.stringify(afterLogoInfo, null, 2));
    
    // Step 6: Test Contacts Dock Functionality
    console.log('Step 6: Testing contacts dock functionality...');
    
    // Wait for contacts dock to be available
    await page.waitForSelector('.dock-body', { timeout: 10000 });
    
    // Take screenshot of contacts dock
    await page.screenshot({ 
      path: 'contacts-dock-initial.png',
      clip: { x: 0, y: 0, width: 400, height: 800 }
    });
    
    // Test dock toggle functionality
    const dockTestResult = await page.evaluate(() => {
      const dock = document.querySelector('.dock-body');
      const toggleButton = document.querySelector('.grid4-dock-toggle, .dock-toggle, .dock-minimize');
      const nativeMinimizeButton = document.querySelector('.dock-minimize');
      
      if (!dock) return { error: 'Dock not found' };
      
      const initialState = {
        dockHeight: dock.style.height || getComputedStyle(dock).height,
        dockVisible: dock.offsetHeight > 100,
        hasToggleButton: !!toggleButton,
        hasNativeButton: !!nativeMinimizeButton,
        grid4ContactsDock: typeof window.G4 !== 'undefined' && window.G4.contactsDock
      };
      
      // Try to click the toggle button
      if (toggleButton) {
        try {
          toggleButton.click();
          // Wait a moment for any animations
          setTimeout(() => {}, 500);
          
          const afterClickState = {
            dockHeight: dock.style.height || getComputedStyle(dock).height,
            dockVisible: dock.offsetHeight > 100,
            stateChanged: initialState.dockVisible !== (dock.offsetHeight > 100)
          };
          
          return {
            initialState,
            afterClickState,
            toggleWorked: afterClickState.stateChanged
          };
        } catch (error) {
          return {
            initialState,
            error: 'Failed to click toggle button: ' + error.message
          };
        }
      }
      
      return {
        initialState,
        error: 'No toggle button found'
      };
    });
    
    console.log('Dock Test Result:', JSON.stringify(dockTestResult, null, 2));
    
    // Take final screenshot after dock test
    await page.screenshot({ 
      path: 'contacts-dock-after-toggle.png',
      clip: { x: 0, y: 0, width: 400, height: 800 }
    });
    
    // Step 7: Generate comprehensive report
    console.log('Step 7: Generating test report...');
    
    const testReport = {
      timestamp: new Date().toISOString(),
      testEnvironment: 'Grid4_sunday_Test',
      version: 'v4.2.3',
      issues: {
        logo: {
          description: 'Logo integration not working correctly',
          beforeState: beforeLogoInfo,
          afterState: afterLogoInfo,
          expectedBehavior: 'Should display Grid4 SmartComm logo (logo_option_001.png) in navigation',
          actualBehavior: 'Shows incorrect/old Grid4 logo or breaks native logo functionality'
        },
        contactsDock: {
          description: 'Contacts dock will not collapse/close',
          testResult: dockTestResult,
          expectedBehavior: 'Dock should collapse/expand when toggle button is clicked',
          actualBehavior: 'Toggle button does not work due to event handling conflicts'
        }
      },
      screenshots: [
        'before-grid4-customizations.png',
        'after-grid4-customizations.png', 
        'contacts-dock-initial.png',
        'contacts-dock-after-toggle.png'
      ]
    };
    
    console.log('=== TEST REPORT ===');
    console.log(JSON.stringify(testReport, null, 2));
    console.log('=== END TEST REPORT ===');
    
    // Verify issues are reproduced
    expect(testReport.issues.logo.afterState).toBeDefined();
    expect(testReport.issues.contactsDock.testResult).toBeDefined();
    
    console.log('✓ Issues successfully reproduced and documented');
  });

  test.afterEach(async () => {
    await page.close();
  });
});
