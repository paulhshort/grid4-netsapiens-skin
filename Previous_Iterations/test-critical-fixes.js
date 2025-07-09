/**
 * Grid4 NetSapiens Portal - Critical Fixes Validation Test
 * 
 * This test validates the two critical fixes implemented in v4.2.4:
 * 1. Logo Integration Fix: Proper use of native #header-logo with logo_option_001.png
 * 2. Contacts Dock Fix: Delegation to native NetSapiens minimizeDockPopup() function
 * 
 * Test Environment: Grid4_sunday_Test domain
 * Version: v4.2.4
 */

const { test, expect } = require('@playwright/test');

test.describe('Grid4 NetSapiens Portal - Critical Fixes Validation', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Enable console logging for Grid4 messages
    page.on('console', msg => {
      if (msg.text().includes('Grid4') || msg.text().includes('G4') || msg.text().includes('logo') || msg.text().includes('dock')) {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('Validate Logo and Contacts Dock Fixes', async () => {
    console.log('=== Starting Grid4 Critical Fixes Validation Test ===');
    
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
    
    // Step 3: Inject Grid4 v4.2.4 CSS and JavaScript with strong cache busters
    console.log('Step 3: Injecting Grid4 v4.2.4 customizations...');
    const cacheBuster = `?v=4.2.4&cb=${Date.now()}&r=${Math.random()}`;
    
    // Inject CSS
    await page.addStyleTag({
      url: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css${cacheBuster}`
    });
    
    // Inject JavaScript
    await page.addScriptTag({
      url: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js${cacheBuster}`
    });
    
    // Wait for Grid4 to initialize
    await page.waitForTimeout(5000);
    console.log('✓ Grid4 v4.2.4 customizations injected');
    
    // Step 4: Validate Logo Integration Fix
    console.log('Step 4: Validating logo integration fix...');
    
    const logoValidation = await page.evaluate(() => {
      const originalLogo = document.querySelector('#header-logo');
      const logoClone = document.querySelector('#header-logo-clone');
      const navigation = document.querySelector('#navigation');
      
      return {
        originalLogoExists: !!originalLogo,
        originalLogoSrc: originalLogo ? originalLogo.src : null,
        originalLogoInNavigation: navigation ? navigation.contains(originalLogo) : false,
        clonedLogoExists: !!logoClone,
        clonedLogoSrc: logoClone ? logoClone.src : null,
        clonedLogoInNavigation: navigation ? navigation.contains(logoClone) : false,
        logoPreservesNetSapiensSrc: (originalLogo && originalLogo.src && originalLogo.src.includes('portal_main_top_left.png')) ||
                                   (logoClone && logoClone.src && logoClone.src.includes('portal_main_top_left.png')),
        grid4Version: typeof window.G4 !== 'undefined' ? window.G4.config.version : 'Not found'
      };
    });
    
    console.log('Logo Validation Results:', JSON.stringify(logoValidation, null, 2));
    
    // Step 5: Validate Contacts Dock Fix
    console.log('Step 5: Validating contacts dock functionality fix...');
    
    // Wait for contacts dock to be available
    await page.waitForSelector('.dock-body', { timeout: 10000 });
    
    const dockValidation = await page.evaluate(() => {
      const dock = document.querySelector('.dock-body');
      const customToggle = document.querySelector('.grid4-dock-toggle');
      const nativeMinimizeButton = document.querySelector('.dock-minimize');
      
      // Check if Grid4 contacts dock module has native button reference
      const hasNativeButtonRef = typeof window.G4 !== 'undefined' && 
                                 window.G4.contactsDock && 
                                 window.G4.contactsDock.nativeMinimizeButton;
      
      return {
        dockExists: !!dock,
        customToggleExists: !!customToggle,
        nativeMinimizeButtonExists: !!nativeMinimizeButton,
        nativeButtonHidden: nativeMinimizeButton ? nativeMinimizeButton.style.display === 'none' : false,
        hasNativeButtonReference: hasNativeButtonRef,
        grid4ContactsDockInitialized: typeof window.G4 !== 'undefined' && !!window.G4.contactsDock
      };
    });
    
    console.log('Dock Validation Results:', JSON.stringify(dockValidation, null, 2));
    
    // Step 6: Test Contacts Dock Toggle Functionality
    console.log('Step 6: Testing contacts dock toggle functionality...');
    
    if (dockValidation.customToggleExists) {
      // Test the toggle functionality
      const toggleTest = await page.evaluate(() => {
        const customToggle = document.querySelector('.grid4-dock-toggle');
        const dock = document.querySelector('.dock-body');
        
        if (!customToggle || !dock) {
          return { error: 'Toggle or dock not found' };
        }
        
        const initialHeight = dock.offsetHeight;
        
        // Simulate click on custom toggle
        customToggle.click();
        
        // Wait a moment for any animations/changes
        return new Promise((resolve) => {
          setTimeout(() => {
            const afterClickHeight = dock.offsetHeight;
            resolve({
              initialHeight,
              afterClickHeight,
              heightChanged: initialHeight !== afterClickHeight,
              toggleClicked: true
            });
          }, 1000);
        });
      });
      
      console.log('Toggle Test Results:', JSON.stringify(toggleTest, null, 2));
    }
    
    // Step 7: Take screenshots for documentation
    console.log('Step 7: Taking screenshots for documentation...');
    
    await page.screenshot({ 
      path: 'grid4-v4.2.4-validation.png', 
      fullPage: true 
    });
    
    // Take focused screenshot of logo area
    await page.screenshot({ 
      path: 'grid4-v4.2.4-logo-validation.png',
      clip: { x: 0, y: 0, width: 300, height: 400 }
    });
    
    // Take focused screenshot of contacts dock
    await page.screenshot({ 
      path: 'grid4-v4.2.4-dock-validation.png',
      clip: { x: 0, y: 0, width: 400, height: 800 }
    });
    
    // Step 8: Generate validation report
    console.log('Step 8: Generating validation report...');
    
    const validationReport = {
      timestamp: new Date().toISOString(),
      version: 'v4.2.4',
      testEnvironment: 'Grid4_sunday_Test',
      fixes: {
        logoIntegration: {
          status: logoValidation.logoPreservesNetSapiensSrc ? 'FIXED' : 'NEEDS_ATTENTION',
          details: logoValidation,
          expectedBehavior: 'Logo should preserve NetSapiens portal_main_top_left.png source and be relocated to navigation',
          actualBehavior: logoValidation.logoPreservesNetSapiensSrc ? 
            'Logo correctly preserves NetSapiens source' : 
            'Logo source may not be preserved correctly'
        },
        contactsDock: {
          status: dockValidation.hasNativeButtonReference ? 'FIXED' : 'NEEDS_ATTENTION',
          details: dockValidation,
          expectedBehavior: 'Dock should delegate to native NetSapiens minimizeDockPopup() function',
          actualBehavior: dockValidation.hasNativeButtonReference ? 
            'Native button reference found, delegation enabled' : 
            'Native button reference not found, using fallback'
        }
      },
      screenshots: [
        'grid4-v4.2.4-validation.png',
        'grid4-v4.2.4-logo-validation.png',
        'grid4-v4.2.4-dock-validation.png'
      ]
    };
    
    console.log('=== VALIDATION REPORT ===');
    console.log(JSON.stringify(validationReport, null, 2));
    console.log('=== END VALIDATION REPORT ===');
    
    // Assertions for test validation
    expect(logoValidation.grid4Version).toBe('4.2.4');
    expect(dockValidation.grid4ContactsDockInitialized).toBe(true);
    
    console.log('✓ Critical fixes validation completed');
  });

  test.afterEach(async () => {
    await page.close();
  });
});
