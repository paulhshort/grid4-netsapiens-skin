const { chromium } = require('playwright');

(async () => {
  // Launch with fresh profile and disabled cache
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
      '--media-cache-size=0'
    ]
  });
  
  const context = await browser.newContext({
    // Clear all cache and storage
    storageState: undefined
  });
  
  const page = await context.newPage();
  
  // Clear all cache
  await context.clearCookies();
  
  console.log('🔧 TESTING GRID4 v4.2.0 WITH FRESH BROWSER SESSION');
  console.log('===================================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('4.2') || msg.text().includes('logo') || msg.text().includes('Logo')) {
      console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  // Monitor errors (filter out expected ones)
  page.on('pageerror', error => {
    if (!error.message.includes('moment.tz')) {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    }
  });
  
  console.log('\n🔐 Step 1: Logging in with fresh session...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('#LoginUsername', '1002@grid4voice');
  await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
  await page.click('input[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  console.log('\n🎯 Step 2: Triggering Grid4 customizations...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications');
  await page.waitForLoadState('networkidle');
  
  // Wait for JavaScript to execute
  await page.waitForTimeout(5000);
  
  console.log('\n🔍 Step 3: Checking fresh session results...');
  
  const freshResults = await page.evaluate(() => {
    return {
      // Check Grid4 objects
      grid4Objects: {
        G4: typeof window.G4,
        Grid4Portal: typeof window.Grid4Portal,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4InitializePortal: typeof window.grid4InitializePortal
      },
      
      // Check version and initialization
      versionInfo: {
        g4Version: window.G4 ? window.G4.config.version : 'N/A',
        grid4PortalVersion: window.Grid4Portal ? window.Grid4Portal.config.version : 'N/A',
        g4Initialized: window.G4 ? window.G4.config.initialized : false,
        grid4PortalInitialized: window.Grid4Portal ? window.Grid4Portal.config.initialized : false,
        debug: window.G4 ? window.G4.config.debug : (window.Grid4Portal ? window.Grid4Portal.config.debug : false)
      },
      
      // Check logo status
      logoStatus: {
        headerLogo: {
          exists: !!document.getElementById('header-logo'),
          visible: document.getElementById('header-logo')?.offsetParent !== null,
          src: document.getElementById('header-logo')?.src || 'N/A'
        },
        navigation: {
          exists: !!document.getElementById('navigation'),
          hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
          classes: document.getElementById('navigation')?.className || 'N/A'
        },
        cssLogoFallback: {
          applied: !!document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
          pseudoElementVisible: !!document.getElementById('navigation') && 
            window.getComputedStyle(document.getElementById('navigation'), '::before').content !== 'none'
        }
      },
      
      // Check hamburger button
      hamburgerButton: {
        exists: !!document.getElementById('grid4-sidebar-toggle'),
        visible: document.getElementById('grid4-sidebar-toggle')?.offsetParent !== null
      },
      
      // Check CSS variables
      cssVariables: {
        primary: getComputedStyle(document.documentElement).getPropertyValue('--grid4-primary-dark').trim(),
        accent: getComputedStyle(document.documentElement).getPropertyValue('--grid4-accent-blue').trim(),
        sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--grid4-sidebar-width').trim()
      },
      
      // Check body classes
      bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
      
      // Check loaded scripts
      loadedScripts: Array.from(document.querySelectorAll('script[src*="grid4"]'))
        .map(script => ({ src: script.src })),
        
      // Check for errors
      errors: window.Grid4Errors || []
    };
  });
  
  console.log('\n📊 FRESH SESSION TEST RESULTS:');
  console.log('===============================');
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(freshResults.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📋 Version Info:');
  console.log(`  G4 Version: ${freshResults.versionInfo.g4Version}`);
  console.log(`  Grid4Portal Version: ${freshResults.versionInfo.grid4PortalVersion}`);
  console.log(`  G4 Initialized: ${freshResults.versionInfo.g4Initialized ? '✅' : '❌'}`);
  console.log(`  Grid4Portal Initialized: ${freshResults.versionInfo.grid4PortalInitialized ? '✅' : '❌'}`);
  console.log(`  Debug: ${freshResults.versionInfo.debug ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Logo Status:');
  console.log(`  Header Logo Exists: ${freshResults.logoStatus.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Header Logo Visible: ${freshResults.logoStatus.headerLogo.visible ? '✅' : '❌'}`);
  console.log(`  Navigation Has Fallback Class: ${freshResults.logoStatus.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log(`  CSS Fallback Applied: ${freshResults.logoStatus.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${freshResults.logoStatus.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🍔 Hamburger Button:');
  console.log(`  Exists: ${freshResults.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${freshResults.hamburgerButton.visible ? '✅' : '❌'}`);
  
  console.log('\n🎨 CSS Variables:');
  Object.entries(freshResults.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value || 'NOT SET'}`);
  });
  
  console.log('\n📄 Loaded Scripts:');
  freshResults.loadedScripts.forEach(script => console.log(`  ${script.src}`));
  
  console.log('\n📝 Body Classes:', freshResults.bodyClasses.join(' ') || 'None');
  
  if (freshResults.errors.length > 0) {
    console.log('\n❌ Grid4 Errors:', freshResults.errors);
  }
  
  // If not initialized, try manual initialization
  if (!freshResults.versionInfo.g4Initialized && !freshResults.versionInfo.grid4PortalInitialized) {
    console.log('\n🔧 Attempting manual initialization...');
    
    const manualInit = await page.evaluate(() => {
      try {
        if (window.G4 && typeof window.G4.init === 'function') {
          window.G4.init();
          return { success: true, method: 'G4.init' };
        } else if (window.Grid4Portal && typeof window.Grid4Portal.init === 'function') {
          window.Grid4Portal.init();
          return { success: true, method: 'Grid4Portal.init' };
        }
        return { success: false, reason: 'No init method found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('Manual Init Result:', manualInit);
    
    // Wait and check again
    await page.waitForTimeout(3000);
    
    const afterInit = await page.evaluate(() => {
      return {
        g4Initialized: window.G4 ? window.G4.config.initialized : false,
        grid4PortalInitialized: window.Grid4Portal ? window.Grid4Portal.config.initialized : false,
        logoFallbackApplied: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        hamburgerExists: !!document.getElementById('grid4-sidebar-toggle')
      };
    });
    
    console.log('\n🔄 After Manual Init:');
    console.log(`  G4 Initialized: ${afterInit.g4Initialized ? '✅' : '❌'}`);
    console.log(`  Grid4Portal Initialized: ${afterInit.grid4PortalInitialized ? '✅' : '❌'}`);
    console.log(`  Logo Fallback Applied: ${afterInit.logoFallbackApplied ? '✅' : '❌'}`);
    console.log(`  Hamburger Exists: ${afterInit.hamburgerExists ? '✅' : '❌'}`);
  }
  
  // Test hamburger functionality if it exists
  if (freshResults.hamburgerButton.exists) {
    console.log('\n🧪 Testing hamburger button...');
    
    await page.click('#grid4-sidebar-toggle');
    await page.waitForTimeout(1000);
    
    const afterToggle = await page.evaluate(() => {
      return {
        sidebarCollapsed: document.body.classList.contains('grid4-sidebar-collapsed'),
        mobileMenuOpen: document.body.classList.contains('grid4-mobile-menu-open')
      };
    });
    
    console.log('After hamburger toggle:', afterToggle);
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/grid4-fresh-session-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/grid4-fresh-session-test.png');
  
  await browser.close();
})();
