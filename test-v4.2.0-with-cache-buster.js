const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔧 TESTING GRID4 v4.2.0 WITH CACHE BUSTER');
  console.log('==========================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('Logo') || msg.text().includes('4.2')) {
      console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  // Monitor errors
  page.on('pageerror', error => {
    if (!error.message.includes('moment.tz')) { // Filter out expected moment.tz errors
      console.log(`❌ PAGE ERROR: ${error.message}`);
    }
  });
  
  console.log('\n🔐 Step 1: Logging in...');
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
  
  console.log('\n🔍 Step 3: Checking v4.2.0 with cache buster...');
  
  // Inject a stronger cache buster by manually loading the latest version
  await page.evaluate(() => {
    // Remove existing Grid4 script
    const existingScript = document.querySelector('script[src*="grid4-portal-skin-v4.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Load fresh version with strong cache buster
    const script = document.createElement('script');
    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js?v=4.2.0&cb=' + Date.now() + '&bust=' + Math.random();
    script.onload = function() {
      console.log('🔄 Fresh Grid4 v4.2.0 script loaded with cache buster');
    };
    document.head.appendChild(script);
  });
  
  // Wait for the new script to load and execute
  await page.waitForTimeout(5000);
  
  const testResults = await page.evaluate(() => {
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
        version: window.G4 ? window.G4.config.version : (window.Grid4Portal ? window.Grid4Portal.config.version : 'N/A'),
        initialized: window.G4 ? window.G4.config.initialized : (window.Grid4Portal ? window.Grid4Portal.config.initialized : false),
        debug: window.G4 ? window.G4.config.debug : (window.Grid4Portal ? window.Grid4Portal.config.debug : false)
      },
      
      // Check logo status
      logoStatus: {
        headerLogo: {
          exists: !!document.getElementById('header-logo'),
          visible: document.getElementById('header-logo')?.offsetParent !== null
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
      
      // Check body classes
      bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
      
      // Check loaded scripts
      loadedScripts: Array.from(document.querySelectorAll('script[src*="grid4"]'))
        .map(script => ({ src: script.src }))
    };
  });
  
  console.log('\n📊 CACHE BUSTER TEST RESULTS:');
  console.log('==============================');
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(testResults.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📋 Version Info:');
  console.log(`  Version: ${testResults.versionInfo.version}`);
  console.log(`  Initialized: ${testResults.versionInfo.initialized ? '✅' : '❌'}`);
  console.log(`  Debug: ${testResults.versionInfo.debug ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Logo Status:');
  console.log(`  Header Logo Exists: ${testResults.logoStatus.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Header Logo Visible: ${testResults.logoStatus.headerLogo.visible ? '✅' : '❌'}`);
  console.log(`  Navigation Has Fallback Class: ${testResults.logoStatus.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log(`  CSS Fallback Applied: ${testResults.logoStatus.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${testResults.logoStatus.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🍔 Hamburger Button:');
  console.log(`  Exists: ${testResults.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${testResults.hamburgerButton.visible ? '✅' : '❌'}`);
  
  console.log('\n📄 Loaded Scripts:');
  testResults.loadedScripts.forEach(script => console.log(`  ${script.src}`));
  
  console.log('\n📝 Body Classes:', testResults.bodyClasses.join(' ') || 'None');
  
  // Try manual initialization if needed
  if (!testResults.versionInfo.initialized) {
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
        initialized: window.G4 ? window.G4.config.initialized : (window.Grid4Portal ? window.Grid4Portal.config.initialized : false),
        logoFallbackApplied: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        hamburgerExists: !!document.getElementById('grid4-sidebar-toggle')
      };
    });
    
    console.log('\n🔄 After Manual Init:');
    console.log(`  Initialized: ${afterInit.initialized ? '✅' : '❌'}`);
    console.log(`  Logo Fallback Applied: ${afterInit.logoFallbackApplied ? '✅' : '❌'}`);
    console.log(`  Hamburger Exists: ${afterInit.hamburgerExists ? '✅' : '❌'}`);
  }
  
  // Test hamburger functionality if it exists
  if (testResults.hamburgerButton.exists) {
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
  await page.screenshot({ path: './testing/grid4-v4.2.0-cache-buster-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/grid4-v4.2.0-cache-buster-test.png');
  
  await browser.close();
})();
