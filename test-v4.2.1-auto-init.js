const { chromium } = require('playwright');

(async () => {
  // Launch with fresh profile to test auto-initialization
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-cache', '--disable-application-cache']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🚀 TESTING GRID4 v4.2.1 AUTO-INITIALIZATION');
  console.log('=============================================');
  
  // Monitor console messages for initialization
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('4.2') || msg.text().includes('init') || msg.text().includes('logo')) {
      console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  // Monitor errors
  page.on('pageerror', error => {
    if (!error.message.includes('moment.tz')) {
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
  
  // Wait longer for auto-initialization to kick in
  console.log('\n⏳ Waiting for auto-initialization (10 seconds)...');
  await page.waitForTimeout(10000);
  
  console.log('\n🔍 Step 3: Checking auto-initialization results...');
  
  const autoInitResults = await page.evaluate(() => {
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
        g4Initialized: window.G4 ? window.G4.config.initialized : false,
        g4Debug: window.G4 ? window.G4.config.debug : false
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
        accent: getComputedStyle(document.documentElement).getPropertyValue('--grid4-accent-blue').trim()
      },
      
      // Check body classes
      bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
      
      // Check for errors
      errors: window.Grid4Errors || []
    };
  });
  
  console.log('\n📊 AUTO-INITIALIZATION TEST RESULTS:');
  console.log('=====================================');
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(autoInitResults.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📋 Version Info:');
  console.log(`  G4 Version: ${autoInitResults.versionInfo.g4Version}`);
  console.log(`  G4 Initialized: ${autoInitResults.versionInfo.g4Initialized ? '✅' : '❌'}`);
  console.log(`  G4 Debug: ${autoInitResults.versionInfo.g4Debug ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Logo Status:');
  console.log(`  Header Logo Exists: ${autoInitResults.logoStatus.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Header Logo Visible: ${autoInitResults.logoStatus.headerLogo.visible ? '✅' : '❌'}`);
  console.log(`  Navigation Has Fallback Class: ${autoInitResults.logoStatus.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log(`  CSS Fallback Applied: ${autoInitResults.logoStatus.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${autoInitResults.logoStatus.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🍔 Hamburger Button:');
  console.log(`  Exists: ${autoInitResults.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${autoInitResults.hamburgerButton.visible ? '✅' : '❌'}`);
  
  console.log('\n🎨 CSS Variables:');
  Object.entries(autoInitResults.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value || 'NOT SET'}`);
  });
  
  console.log('\n📝 Body Classes:', autoInitResults.bodyClasses.join(' ') || 'None');
  
  if (autoInitResults.errors.length > 0) {
    console.log('\n❌ Grid4 Errors:', autoInitResults.errors);
  }
  
  // Test functionality if initialized
  if (autoInitResults.versionInfo.g4Initialized) {
    console.log('\n🎉 AUTO-INITIALIZATION SUCCESSFUL!');
    
    // Test hamburger functionality
    if (autoInitResults.hamburgerButton.exists) {
      console.log('\n🧪 Testing hamburger button functionality...');
      
      await page.click('#grid4-sidebar-toggle');
      await page.waitForTimeout(1000);
      
      const afterToggle = await page.evaluate(() => {
        return {
          sidebarCollapsed: document.body.classList.contains('grid4-sidebar-collapsed'),
          mobileMenuOpen: document.body.classList.contains('grid4-mobile-menu-open')
        };
      });
      
      console.log('After hamburger toggle:', afterToggle);
      
      // Toggle back
      await page.click('#grid4-sidebar-toggle');
      await page.waitForTimeout(1000);
    }
    
    // Test debug functions
    console.log('\n🔧 Testing debug functions...');
    
    const debugTest = await page.evaluate(() => {
      try {
        const debugInfo = window.grid4DebugInfo();
        const systemStatus = window.grid4SystemStatus();
        return {
          debugInfoAvailable: !!debugInfo,
          systemStatusAvailable: !!systemStatus,
          debugInfoVersion: debugInfo ? debugInfo.version : 'N/A',
          systemStatusVersion: systemStatus ? systemStatus.core.version : 'N/A'
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Debug Functions Test:', debugTest);
    
  } else {
    console.log('\n❌ AUTO-INITIALIZATION FAILED - Manual initialization may be needed');
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/grid4-v4.2.1-auto-init-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/grid4-v4.2.1-auto-init-test.png');
  
  // Final summary
  console.log('\n📋 FINAL SUMMARY:');
  console.log('==================');
  console.log(`✅ Grid4 v4.2.1 Auto-Initialization: ${autoInitResults.versionInfo.g4Initialized ? 'SUCCESS' : 'FAILED'}`);
  console.log(`✅ Logo Fallback Strategy: ${autoInitResults.logoStatus.cssLogoFallback.applied ? 'APPLIED' : 'NOT APPLIED'}`);
  console.log(`✅ Hamburger Button: ${autoInitResults.hamburgerButton.exists ? 'CREATED' : 'NOT CREATED'}`);
  console.log(`✅ CSS Variables: ${autoInitResults.cssVariables.primary ? 'LOADED' : 'NOT LOADED'}`);
  
  await browser.close();
})();
