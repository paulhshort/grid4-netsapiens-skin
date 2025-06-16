const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🧪 FINAL COMPREHENSIVE GRID4 PORTAL TEST');
  console.log('=========================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('init')) {
      console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
    }
  });
  
  // Monitor errors
  page.on('pageerror', error => {
    if (!error.message.includes('moment.tz')) {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    }
  });
  
  console.log('\n🔐 Step 1: Login and navigate to Grid4 domain...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('#LoginUsername', '1002@grid4voice');
  await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
  await page.click('input[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications');
  await page.waitForLoadState('networkidle');
  
  console.log('\n🔄 Step 2: Force load latest Grid4 v4.2.1 with strong cache buster...');
  
  // Inject the latest version directly with strong cache buster
  await page.evaluate(() => {
    // Remove any existing Grid4 scripts
    document.querySelectorAll('script[src*="grid4"]').forEach(script => script.remove());
    
    // Load fresh CSS with cache buster
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css?v=4.2.1&cb=' + Date.now() + '&r=' + Math.random();
    document.head.appendChild(cssLink);
    
    // Load fresh JS with cache buster
    const script = document.createElement('script');
    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js?v=4.2.1&cb=' + Date.now() + '&r=' + Math.random();
    script.onload = function() {
      console.log('🔄 Fresh Grid4 v4.2.1 loaded with strong cache buster');
    };
    document.head.appendChild(script);
  });
  
  // Wait for script to load and execute
  await page.waitForTimeout(8000);
  
  console.log('\n🔍 Step 3: Comprehensive functionality test...');
  
  const testResults = await page.evaluate(() => {
    return {
      // Version and initialization
      version: {
        g4Version: window.G4 ? window.G4.config.version : 'N/A',
        grid4PortalVersion: window.Grid4Portal ? window.Grid4Portal.config.version : 'N/A',
        g4Initialized: window.G4 ? window.G4.config.initialized : false,
        grid4PortalInitialized: window.Grid4Portal ? window.Grid4Portal.config.initialized : false
      },
      
      // Grid4 objects availability
      objects: {
        G4: typeof window.G4,
        Grid4Portal: typeof window.Grid4Portal,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4SystemStatus: typeof window.grid4SystemStatus,
        grid4FixLogo: typeof window.grid4FixLogo,
        grid4InitializePortal: typeof window.grid4InitializePortal
      },
      
      // Logo functionality
      logo: {
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
      
      // UI elements
      ui: {
        hamburgerButton: {
          exists: !!document.getElementById('grid4-sidebar-toggle'),
          visible: document.getElementById('grid4-sidebar-toggle')?.offsetParent !== null
        },
        refreshButton: {
          exists: !!document.getElementById('pageRefresh'),
          visible: document.getElementById('pageRefresh')?.offsetParent !== null
        },
        navigation: {
          exists: !!document.getElementById('navigation'),
          navButtons: !!document.getElementById('nav-buttons')
        }
      },
      
      // CSS and styling
      styling: {
        cssVariables: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--grid4-primary-dark').trim(),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--grid4-accent-blue').trim(),
          sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--grid4-sidebar-width').trim()
        },
        bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
        portalActive: document.body.classList.contains('grid4-portal-active')
      },
      
      // Performance and errors
      performance: {
        errors: window.Grid4Errors || [],
        loadedScripts: Array.from(document.querySelectorAll('script[src*="grid4"]'))
          .map(script => ({ src: script.src })),
        loadedCSS: Array.from(document.querySelectorAll('link[href*="grid4"]'))
          .map(link => ({ href: link.href, loaded: !!link.sheet }))
      }
    };
  });
  
  console.log('\n📊 COMPREHENSIVE TEST RESULTS:');
  console.log('===============================');
  
  console.log('\n📋 Version & Initialization:');
  console.log(`  G4 Version: ${testResults.version.g4Version}`);
  console.log(`  Grid4Portal Version: ${testResults.version.grid4PortalVersion}`);
  console.log(`  G4 Initialized: ${testResults.version.g4Initialized ? '✅' : '❌'}`);
  console.log(`  Grid4Portal Initialized: ${testResults.version.grid4PortalInitialized ? '✅' : '❌'}`);
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(testResults.objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n🖼️ Logo Functionality:');
  console.log(`  Header Logo Exists: ${testResults.logo.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Header Logo Visible: ${testResults.logo.headerLogo.visible ? '✅' : '❌'}`);
  console.log(`  Navigation Has Fallback Class: ${testResults.logo.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log(`  CSS Fallback Applied: ${testResults.logo.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${testResults.logo.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🎛️ UI Elements:');
  console.log(`  Hamburger Button: ${testResults.ui.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Refresh Button: ${testResults.ui.refreshButton.exists ? '✅' : '❌'}`);
  console.log(`  Navigation: ${testResults.ui.navigation.exists ? '✅' : '❌'}`);
  console.log(`  Nav Buttons: ${testResults.ui.navigation.navButtons ? '✅' : '❌'}`);
  
  console.log('\n🎨 Styling:');
  console.log(`  Primary Color: ${testResults.styling.cssVariables.primary || 'NOT SET'}`);
  console.log(`  Accent Color: ${testResults.styling.cssVariables.accent || 'NOT SET'}`);
  console.log(`  Portal Active Class: ${testResults.styling.portalActive ? '✅' : '❌'}`);
  
  console.log('\n📄 Performance:');
  console.log(`  Loaded Scripts: ${testResults.performance.loadedScripts.length}`);
  console.log(`  Loaded CSS: ${testResults.performance.loadedCSS.length}`);
  console.log(`  Errors: ${testResults.performance.errors.length}`);
  
  // Manual initialization if needed
  if (!testResults.version.g4Initialized && !testResults.version.grid4PortalInitialized) {
    console.log('\n🔧 Attempting manual initialization...');
    
    const manualInit = await page.evaluate(() => {
      try {
        if (window.G4 && typeof window.G4.init === 'function') {
          window.G4.init();
          return { success: true, method: 'G4.init', version: window.G4.config.version };
        } else if (window.Grid4Portal && typeof window.Grid4Portal.init === 'function') {
          window.Grid4Portal.init();
          // Create G4 global reference if it doesn't exist
          if (!window.G4) {
            window.G4 = window.Grid4Portal;
          }
          return { success: true, method: 'Grid4Portal.init', version: window.Grid4Portal.config.version };
        }
        return { success: false, reason: 'No init method found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('Manual Init Result:', manualInit);
    
    if (manualInit.success) {
      // Wait and test functionality
      await page.waitForTimeout(3000);
      
      const afterInit = await page.evaluate(() => {
        return {
          g4Initialized: window.G4 ? window.G4.config.initialized : false,
          logoFallbackApplied: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
          hamburgerExists: !!document.getElementById('grid4-sidebar-toggle'),
          version: window.G4 ? window.G4.config.version : 'N/A'
        };
      });
      
      console.log('\n🔄 After Manual Init:');
      console.log(`  Version: ${afterInit.version}`);
      console.log(`  G4 Initialized: ${afterInit.g4Initialized ? '✅' : '❌'}`);
      console.log(`  Logo Fallback Applied: ${afterInit.logoFallbackApplied ? '✅' : '❌'}`);
      console.log(`  Hamburger Exists: ${afterInit.hamburgerExists ? '✅' : '❌'}`);
      
      // Test hamburger functionality
      if (afterInit.hamburgerExists) {
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
      if (afterInit.g4Initialized) {
        console.log('\n🔧 Testing debug functions...');
        
        const debugTest = await page.evaluate(() => {
          try {
            const debugInfo = window.grid4DebugInfo ? window.grid4DebugInfo() : null;
            const systemStatus = window.grid4SystemStatus ? window.grid4SystemStatus() : null;
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
      }
    }
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/final-comprehensive-grid4-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/final-comprehensive-grid4-test.png');
  
  // Final summary
  const isWorking = testResults.version.g4Initialized || testResults.version.grid4PortalInitialized;
  const hasLogo = testResults.logo.cssLogoFallback.applied;
  const hasHamburger = testResults.ui.hamburgerButton.exists;
  const hasCSS = testResults.styling.cssVariables.primary !== '';
  
  console.log('\n🎯 FINAL ASSESSMENT:');
  console.log('====================');
  console.log(`✅ Grid4 Portal Working: ${isWorking ? 'YES' : 'NO'}`);
  console.log(`✅ Logo Fallback: ${hasLogo ? 'YES' : 'NO'}`);
  console.log(`✅ Hamburger Menu: ${hasHamburger ? 'YES' : 'NO'}`);
  console.log(`✅ CSS Styling: ${hasCSS ? 'YES' : 'NO'}`);
  console.log(`✅ Overall Status: ${isWorking && hasCSS ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
  
  await browser.close();
})();
