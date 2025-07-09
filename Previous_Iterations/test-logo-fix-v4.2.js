const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔧 TESTING GRID4 v4.2.0 LOGO FIX');
  console.log('=================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('Logo')) {
      console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  // Monitor errors
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
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
  await page.waitForTimeout(3000);
  
  console.log('\n🔍 Step 3: Checking v4.2.0 improvements...');
  
  const testResults = await page.evaluate(() => {
    return {
      // Check if Grid4 objects are now available
      grid4Objects: {
        G4: typeof window.G4,
        Grid4Portal: typeof window.Grid4Portal,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4FixLogo: typeof window.grid4FixLogo,
        grid4InitializePortal: typeof window.grid4InitializePortal
      },
      
      // Check Grid4 initialization status
      initStatus: {
        initialized: window.G4 ? window.G4.config.initialized : false,
        version: window.G4 ? window.G4.config.version : 'N/A',
        debug: window.G4 ? window.G4.config.debug : false
      },
      
      // Check logo elements and fallback strategy
      logoStatus: {
        headerLogo: {
          exists: !!document.getElementById('header-logo'),
          visible: document.getElementById('header-logo')?.offsetParent !== null,
          src: document.getElementById('header-logo')?.src || 'N/A'
        },
        headerLogoClone: {
          exists: !!document.getElementById('header-logo-clone'),
          visible: document.getElementById('header-logo-clone')?.offsetParent !== null
        },
        navigation: {
          exists: !!document.getElementById('navigation'),
          hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
          classes: document.getElementById('navigation')?.className || 'N/A'
        },
        cssLogoFallback: {
          applied: !!document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
          pseudoElementVisible: window.getComputedStyle(document.getElementById('navigation'), '::before').content !== 'none'
        }
      },
      
      // Check hamburger button
      hamburgerButton: {
        exists: !!document.getElementById('grid4-sidebar-toggle'),
        visible: document.getElementById('grid4-sidebar-toggle')?.offsetParent !== null,
        clickable: !!document.getElementById('grid4-sidebar-toggle')
      },
      
      // Check CSS variables
      cssVariables: {
        primary: getComputedStyle(document.documentElement).getPropertyValue('--grid4-primary-dark').trim(),
        accent: getComputedStyle(document.documentElement).getPropertyValue('--grid4-accent-blue').trim(),
        sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--grid4-sidebar-width').trim()
      },
      
      // Check body classes
      bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
      
      // Check for any Grid4 errors
      errors: window.Grid4Errors || []
    };
  });
  
  console.log('\n📊 GRID4 v4.2.0 TEST RESULTS:');
  console.log('==============================');
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(testResults.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n⚙️ Initialization Status:');
  console.log(`  Initialized: ${testResults.initStatus.initialized ? '✅' : '❌'}`);
  console.log(`  Version: ${testResults.initStatus.version}`);
  console.log(`  Debug: ${testResults.initStatus.debug ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Logo Status:');
  console.log(`  Header Logo Exists: ${testResults.logoStatus.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Header Logo Visible: ${testResults.logoStatus.headerLogo.visible ? '✅' : '❌'}`);
  console.log(`  Header Logo Clone Exists: ${testResults.logoStatus.headerLogoClone.exists ? '✅' : '❌'}`);
  console.log(`  Navigation Has Fallback Class: ${testResults.logoStatus.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log(`  CSS Fallback Applied: ${testResults.logoStatus.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${testResults.logoStatus.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🍔 Hamburger Button:');
  console.log(`  Exists: ${testResults.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${testResults.hamburgerButton.visible ? '✅' : '❌'}`);
  console.log(`  Clickable: ${testResults.hamburgerButton.clickable ? '✅' : '❌'}`);
  
  console.log('\n🎨 CSS Variables:');
  Object.entries(testResults.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value || 'NOT SET'}`);
  });
  
  console.log('\n📝 Body Classes:', testResults.bodyClasses.join(' ') || 'None');
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Grid4 Errors:', testResults.errors);
  }
  
  // Test hamburger button functionality if it exists
  if (testResults.hamburgerButton.exists) {
    console.log('\n🧪 Testing hamburger button functionality...');
    
    await page.click('#grid4-sidebar-toggle');
    await page.waitForTimeout(1000);
    
    const afterToggle = await page.evaluate(() => {
      return {
        sidebarCollapsed: document.body.classList.contains('grid4-sidebar-collapsed'),
        mobileMenuOpen: document.body.classList.contains('grid4-mobile-menu-open')
      };
    });
    
    console.log('After toggle:', afterToggle);
  }
  
  // Run Grid4 debug info if available
  if (testResults.grid4Objects.grid4DebugInfo === 'function') {
    console.log('\n🔧 Running Grid4 debug info...');
    
    const debugInfo = await page.evaluate(() => {
      try {
        return window.grid4DebugInfo();
      } catch (e) {
        return { error: e.message };
      }
    });
    
    console.log('Debug Info Summary:');
    console.log(`  Version: ${debugInfo.version || 'N/A'}`);
    console.log(`  Initialized: ${debugInfo.initialized || false}`);
    console.log(`  Logo Status: ${JSON.stringify(debugInfo.logo || 'N/A')}`);
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/grid4-v4.2.0-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/grid4-v4.2.0-test.png');
  
  await browser.close();
})();
