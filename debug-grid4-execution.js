const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔧 DEBUGGING GRID4 JAVASCRIPT EXECUTION');
  console.log('========================================');
  
  // Monitor console messages
  page.on('console', msg => {
    console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
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
  
  // Wait a bit more for JS to execute
  await page.waitForTimeout(5000);
  
  console.log('\n🔍 Step 3: Checking JavaScript execution...');
  
  const jsStatus = await page.evaluate(() => {
    return {
      // Check if Grid4 files are loaded
      grid4CSSLoaded: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => link.href.includes('grid4-portal-skin-v4.css')),
      
      grid4JSLoaded: Array.from(document.querySelectorAll('script[src]'))
        .some(script => script.src.includes('grid4-portal-skin-v4.js')),
      
      // Check for Grid4 objects
      grid4Objects: {
        G4: typeof window.G4,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4FixLogo: typeof window.grid4FixLogo,
        grid4SystemStatus: typeof window.grid4SystemStatus,
        grid4InitializePortal: typeof window.grid4InitializePortal
      },
      
      // Check DOM elements
      domElements: {
        headerLogo: {
          exists: !!document.getElementById('header-logo'),
          element: document.getElementById('header-logo'),
          src: document.getElementById('header-logo')?.src,
          style: document.getElementById('header-logo')?.style.cssText,
          computed: document.getElementById('header-logo') ? 
            getComputedStyle(document.getElementById('header-logo')).display : 'N/A'
        },
        navigation: {
          exists: !!document.getElementById('navigation'),
          element: document.getElementById('navigation'),
          classes: document.getElementById('navigation')?.className,
          hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback')
        },
        hamburgerButton: {
          exists: !!document.querySelector('.hamburger-toggle'),
          element: document.querySelector('.hamburger-toggle'),
          visible: document.querySelector('.hamburger-toggle')?.offsetParent !== null
        }
      },
      
      // Check CSS variables
      cssVariables: {
        primary: getComputedStyle(document.documentElement).getPropertyValue('--g4-primary').trim(),
        accent: getComputedStyle(document.documentElement).getPropertyValue('--g4-accent').trim(),
        sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--g4-sidebar-width').trim()
      },
      
      // Check body classes
      bodyClasses: document.body.className.split(' ').filter(cls => cls.length > 0),
      
      // Check for any Grid4-related errors
      errors: window.Grid4Errors || []
    };
  });
  
  console.log('\n📊 JAVASCRIPT STATUS:');
  console.log('======================');
  console.log('Grid4 CSS Loaded:', jsStatus.grid4CSSLoaded ? '✅' : '❌');
  console.log('Grid4 JS Loaded:', jsStatus.grid4JSLoaded ? '✅' : '❌');
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(jsStatus.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n🎨 DOM Elements:');
  console.log('Header Logo:');
  console.log(`  Exists: ${jsStatus.domElements.headerLogo.exists ? '✅' : '❌'}`);
  if (jsStatus.domElements.headerLogo.exists) {
    console.log(`  Src: ${jsStatus.domElements.headerLogo.src || 'N/A'}`);
    console.log(`  Style: ${jsStatus.domElements.headerLogo.style || 'N/A'}`);
    console.log(`  Display: ${jsStatus.domElements.headerLogo.computed}`);
  }
  
  console.log('Navigation:');
  console.log(`  Exists: ${jsStatus.domElements.navigation.exists ? '✅' : '❌'}`);
  if (jsStatus.domElements.navigation.exists) {
    console.log(`  Classes: ${jsStatus.domElements.navigation.classes || 'N/A'}`);
    console.log(`  Has Logo Fallback: ${jsStatus.domElements.navigation.hasLogoFallback ? '✅' : '❌'}`);
  }
  
  console.log('Hamburger Button:');
  console.log(`  Exists: ${jsStatus.domElements.hamburgerButton.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${jsStatus.domElements.hamburgerButton.visible ? '✅' : '❌'}`);
  
  console.log('\n🎨 CSS Variables:');
  Object.entries(jsStatus.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value || 'NOT SET'}`);
  });
  
  console.log('\n📝 Body Classes:', jsStatus.bodyClasses.join(' ') || 'None');
  
  if (jsStatus.errors.length > 0) {
    console.log('\n❌ Grid4 Errors:', jsStatus.errors);
  }
  
  // If Grid4 objects don't exist, try to manually execute the script
  if (jsStatus.grid4Objects.G4 === 'undefined') {
    console.log('\n🔧 Grid4 objects not found - checking script execution...');
    
    // Check if the script content is available
    const scriptContent = await page.evaluate(() => {
      const grid4Script = Array.from(document.querySelectorAll('script[src]'))
        .find(script => script.src.includes('grid4-portal-skin-v4.js'));
      
      return {
        scriptFound: !!grid4Script,
        scriptSrc: grid4Script?.src,
        scriptLoaded: grid4Script?.readyState || 'unknown'
      };
    });
    
    console.log('Script Status:', scriptContent);
    
    // Try to manually trigger initialization
    console.log('\n🔧 Attempting manual initialization...');
    
    const manualInit = await page.evaluate(() => {
      // Try to manually create G4 object if it doesn't exist
      if (typeof window.G4 === 'undefined') {
        console.log('Creating G4 object manually...');
        window.G4 = {
          version: '4.1.1',
          initialized: false,
          debug: true
        };
      }
      
      // Try to manually add logo fallback class
      const navigation = document.getElementById('navigation');
      if (navigation && !navigation.classList.contains('grid4-logo-fallback')) {
        navigation.classList.add('grid4-logo-fallback');
        console.log('Added grid4-logo-fallback class manually');
        return { logoFallbackAdded: true };
      }
      
      return { logoFallbackAdded: false };
    });
    
    console.log('Manual Init Result:', manualInit);
    
    // Wait and check again
    await page.waitForTimeout(2000);
    
    const afterManualInit = await page.evaluate(() => {
      return {
        G4Exists: typeof window.G4 !== 'undefined',
        navigationHasFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        logoVisible: document.getElementById('header-logo')?.offsetParent !== null
      };
    });
    
    console.log('After Manual Init:', afterManualInit);
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/debug-grid4-execution.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/debug-grid4-execution.png');
  
  await browser.close();
})();
