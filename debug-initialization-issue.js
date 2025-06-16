const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔧 DEBUGGING GRID4 INITIALIZATION ISSUE');
  console.log('========================================');
  
  // Monitor all console messages
  page.on('console', msg => {
    console.log(`🗣️ CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  // Monitor all errors
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
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
  
  console.log('\n🔍 Step 3: Detailed initialization debugging...');
  
  const debugResults = await page.evaluate(() => {
    return {
      // Check jQuery availability
      jquery: {
        available: typeof $ !== 'undefined',
        version: typeof $ !== 'undefined' ? $.fn.jquery : 'N/A'
      },
      
      // Check Grid4Portal namespace
      grid4Portal: {
        exists: typeof window.Grid4Portal !== 'undefined',
        properties: window.Grid4Portal ? Object.keys(window.Grid4Portal) : [],
        config: window.Grid4Portal ? window.Grid4Portal.config : null
      },
      
      // Check G4 global
      g4Global: {
        exists: typeof window.G4 !== 'undefined',
        properties: window.G4 ? Object.keys(window.G4) : []
      },
      
      // Check document ready state
      documentState: {
        readyState: document.readyState,
        domContentLoaded: true // We're already past this point
      },
      
      // Check for JavaScript errors
      errors: window.Grid4Errors || [],
      
      // Check if Grid4 files are loaded
      filesLoaded: {
        css: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .filter(link => link.href.includes('grid4'))
          .map(link => ({ href: link.href, loaded: !!link.sheet })),
        js: Array.from(document.querySelectorAll('script[src]'))
          .filter(script => script.src.includes('grid4'))
          .map(script => ({ src: script.src }))
      },
      
      // Check moment.js
      moment: {
        available: typeof moment !== 'undefined',
        version: typeof moment !== 'undefined' ? moment.version : 'N/A',
        hasTz: typeof moment !== 'undefined' ? typeof moment.tz !== 'undefined' : false
      },
      
      // Check NetSapiens elements
      netSapiensElements: {
        navigation: !!document.getElementById('navigation'),
        header: !!document.getElementById('header'),
        navButtons: !!document.getElementById('nav-buttons'),
        wrapper: !!document.querySelector('.wrapper')
      }
    };
  });
  
  console.log('\n📊 INITIALIZATION DEBUG RESULTS:');
  console.log('==================================');
  
  console.log('\n📚 jQuery:');
  console.log(`  Available: ${debugResults.jquery.available ? '✅' : '❌'}`);
  console.log(`  Version: ${debugResults.jquery.version}`);
  
  console.log('\n🏗️ Grid4Portal Namespace:');
  console.log(`  Exists: ${debugResults.grid4Portal.exists ? '✅' : '❌'}`);
  console.log(`  Properties: ${debugResults.grid4Portal.properties.join(', ')}`);
  if (debugResults.grid4Portal.config) {
    console.log(`  Config Version: ${debugResults.grid4Portal.config.version}`);
    console.log(`  Config Initialized: ${debugResults.grid4Portal.config.initialized}`);
  }
  
  console.log('\n🌐 G4 Global:');
  console.log(`  Exists: ${debugResults.g4Global.exists ? '✅' : '❌'}`);
  console.log(`  Properties: ${debugResults.g4Global.properties.join(', ')}`);
  
  console.log('\n📄 Document State:');
  console.log(`  Ready State: ${debugResults.documentState.readyState}`);
  
  console.log('\n📁 Files Loaded:');
  console.log('  CSS Files:');
  debugResults.filesLoaded.css.forEach(file => 
    console.log(`    ${file.loaded ? '✅' : '❌'} ${file.href}`)
  );
  console.log('  JS Files:');
  debugResults.filesLoaded.js.forEach(file => 
    console.log(`    ✅ ${file.src}`)
  );
  
  console.log('\n⏰ Moment.js:');
  console.log(`  Available: ${debugResults.moment.available ? '✅' : '❌'}`);
  console.log(`  Version: ${debugResults.moment.version}`);
  console.log(`  Has TZ: ${debugResults.moment.hasTz ? '✅' : '❌'}`);
  
  console.log('\n🏢 NetSapiens Elements:');
  Object.entries(debugResults.netSapiensElements).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  if (debugResults.errors.length > 0) {
    console.log('\n❌ Grid4 Errors:');
    debugResults.errors.forEach(error => console.log(`  ${error.message}`));
  }
  
  // Try to manually initialize Grid4
  console.log('\n🔧 Attempting manual initialization...');
  
  const manualInit = await page.evaluate(() => {
    try {
      // Check if Grid4Portal.init exists
      if (window.Grid4Portal && typeof window.Grid4Portal.init === 'function') {
        console.log('Found Grid4Portal.init, calling it...');
        window.Grid4Portal.init();
        return { success: true, method: 'Grid4Portal.init' };
      }
      
      // Check if grid4InitializePortal exists
      if (typeof window.grid4InitializePortal === 'function') {
        console.log('Found grid4InitializePortal, calling it...');
        window.grid4InitializePortal();
        return { success: true, method: 'grid4InitializePortal' };
      }
      
      // Try to manually create G4 reference
      if (window.Grid4Portal && !window.G4) {
        console.log('Creating G4 global reference...');
        window.G4 = window.Grid4Portal;
        return { success: true, method: 'manual G4 assignment' };
      }
      
      return { success: false, reason: 'No initialization method found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  console.log('Manual Init Result:', manualInit);
  
  // Wait and check again
  await page.waitForTimeout(3000);
  
  const afterManualInit = await page.evaluate(() => {
    return {
      G4Exists: typeof window.G4 !== 'undefined',
      G4Initialized: window.G4 ? window.G4.config.initialized : false,
      logoFallbackApplied: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback')
    };
  });
  
  console.log('\n🔄 After Manual Init:');
  console.log(`  G4 Exists: ${afterManualInit.G4Exists ? '✅' : '❌'}`);
  console.log(`  G4 Initialized: ${afterManualInit.G4Initialized ? '✅' : '❌'}`);
  console.log(`  Logo Fallback Applied: ${afterManualInit.logoFallbackApplied ? '✅' : '❌'}`);
  
  await browser.close();
})();
