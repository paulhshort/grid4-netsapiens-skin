const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🖼️ TESTING REAL GRID4 LOGO INTEGRATION v4.2.2');
  console.log('===============================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('Logo') || msg.text().includes('4.2.2')) {
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
  
  console.log('\n🔄 Step 2: Force load Grid4 v4.2.2 with real logo fixes...');
  
  // Inject the latest version with strong cache buster
  await page.evaluate(() => {
    // Remove any existing Grid4 scripts
    document.querySelectorAll('script[src*="grid4"]').forEach(script => script.remove());
    
    // Load fresh CSS with cache buster
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css?v=4.2.2&cb=' + Date.now() + '&r=' + Math.random();
    document.head.appendChild(cssLink);
    
    // Load fresh JS with cache buster
    const script = document.createElement('script');
    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js?v=4.2.2&cb=' + Date.now() + '&r=' + Math.random();
    script.onload = function() {
      console.log('🔄 Fresh Grid4 v4.2.2 loaded with real logo fixes');
    };
    document.head.appendChild(script);
  });
  
  // Wait for script to load and execute
  await page.waitForTimeout(8000);
  
  console.log('\n🔍 Step 3: Testing real Grid4 logo integration...');
  
  const logoTestResults = await page.evaluate(() => {
    return {
      // Version check
      version: {
        g4Version: window.G4 ? window.G4.config.version : 'N/A',
        g4Initialized: window.G4 ? window.G4.config.initialized : false
      },
      
      // Header logo element (the real one we should be using)
      headerLogo: {
        exists: !!document.getElementById('header-logo'),
        element: document.getElementById('header-logo'),
        innerHTML: document.getElementById('header-logo')?.innerHTML || 'N/A',
        relocated: document.getElementById('header-logo')?.hasAttribute('data-grid4-relocated'),
        relocationMethod: document.getElementById('header-logo')?.getAttribute('data-grid4-relocated') || 'none',
        parentElement: document.getElementById('header-logo')?.parentElement?.id || 'N/A',
        styles: document.getElementById('header-logo')?.style.cssText || 'N/A'
      },
      
      // Logo image inside header-logo
      logoImage: {
        exists: !!document.querySelector('#header-logo img'),
        element: document.querySelector('#header-logo img'),
        src: document.querySelector('#header-logo img')?.src || 'N/A',
        visible: document.querySelector('#header-logo img')?.offsetParent !== null,
        styles: document.querySelector('#header-logo img')?.style.cssText || 'N/A'
      },
      
      // Navigation and fallback status
      navigation: {
        exists: !!document.getElementById('navigation'),
        hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        classes: document.getElementById('navigation')?.className || 'N/A'
      },
      
      // CSS fallback pseudo-element
      cssLogoFallback: {
        applied: !!document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        pseudoElementVisible: !!document.getElementById('navigation') && 
          window.getComputedStyle(document.getElementById('navigation'), '::before').content !== 'none'
      },
      
      // Logo strategy used
      logoStrategy: {
        strategyUsed: window.G4 && window.G4.logo ? window.G4.logo.state.strategyUsed : 'N/A',
        logoRelocated: window.G4 && window.G4.logo ? window.G4.logo.state.logoRelocated : false,
        logoFound: window.G4 && window.G4.logo ? window.G4.logo.state.logoFound : false
      }
    };
  });
  
  console.log('\n📊 REAL GRID4 LOGO TEST RESULTS:');
  console.log('=================================');
  
  console.log('\n📋 Version:');
  console.log(`  G4 Version: ${logoTestResults.version.g4Version}`);
  console.log(`  G4 Initialized: ${logoTestResults.version.g4Initialized ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Header Logo Element (#header-logo):');
  console.log(`  Exists: ${logoTestResults.headerLogo.exists ? '✅' : '❌'}`);
  console.log(`  Relocated: ${logoTestResults.headerLogo.relocated ? '✅' : '❌'}`);
  console.log(`  Relocation Method: ${logoTestResults.headerLogo.relocationMethod}`);
  console.log(`  Parent Element: ${logoTestResults.headerLogo.parentElement}`);
  console.log(`  Styles: ${logoTestResults.headerLogo.styles}`);
  
  console.log('\n🖼️ Logo Image (inside #header-logo):');
  console.log(`  Exists: ${logoTestResults.logoImage.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${logoTestResults.logoImage.visible ? '✅' : '❌'}`);
  console.log(`  Source: ${logoTestResults.logoImage.src}`);
  console.log(`  Styles: ${logoTestResults.logoImage.styles}`);
  
  console.log('\n🧭 Navigation:');
  console.log(`  Exists: ${logoTestResults.navigation.exists ? '✅' : '❌'}`);
  console.log(`  Has Logo Fallback Class: ${logoTestResults.navigation.hasLogoFallback ? '✅' : '❌'}`);
  
  console.log('\n🎨 CSS Logo Fallback:');
  console.log(`  Applied: ${logoTestResults.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${logoTestResults.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🔧 Logo Strategy:');
  console.log(`  Strategy Used: ${logoTestResults.logoStrategy.strategyUsed}`);
  console.log(`  Logo Relocated: ${logoTestResults.logoStrategy.logoRelocated ? '✅' : '❌'}`);
  console.log(`  Logo Found: ${logoTestResults.logoStrategy.logoFound ? '✅' : '❌'}`);
  
  // Manual initialization if needed
  if (!logoTestResults.version.g4Initialized) {
    console.log('\n🔧 Attempting manual initialization...');
    
    const manualInit = await page.evaluate(() => {
      try {
        if (window.G4 && typeof window.G4.init === 'function') {
          window.G4.init();
          return { success: true, method: 'G4.init' };
        } else if (window.Grid4Portal && typeof window.Grid4Portal.init === 'function') {
          window.Grid4Portal.init();
          if (!window.G4) {
            window.G4 = window.Grid4Portal;
          }
          return { success: true, method: 'Grid4Portal.init' };
        }
        return { success: false, reason: 'No init method found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('Manual Init Result:', manualInit);
    
    if (manualInit.success) {
      // Wait and check logo status again
      await page.waitForTimeout(3000);
      
      const afterInit = await page.evaluate(() => {
        return {
          g4Initialized: window.G4 ? window.G4.config.initialized : false,
          headerLogoRelocated: document.getElementById('header-logo')?.hasAttribute('data-grid4-relocated'),
          headerLogoParent: document.getElementById('header-logo')?.parentElement?.id || 'N/A',
          logoImageVisible: document.querySelector('#header-logo img')?.offsetParent !== null,
          strategyUsed: window.G4 && window.G4.logo ? window.G4.logo.state.strategyUsed : 'N/A'
        };
      });
      
      console.log('\n🔄 After Manual Init:');
      console.log(`  G4 Initialized: ${afterInit.g4Initialized ? '✅' : '❌'}`);
      console.log(`  Header Logo Relocated: ${afterInit.headerLogoRelocated ? '✅' : '❌'}`);
      console.log(`  Header Logo Parent: ${afterInit.headerLogoParent}`);
      console.log(`  Logo Image Visible: ${afterInit.logoImageVisible ? '✅' : '❌'}`);
      console.log(`  Strategy Used: ${afterInit.strategyUsed}`);
    }
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/real-grid4-logo-v4.2.2-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/real-grid4-logo-v4.2.2-test.png');
  
  // Final assessment
  const realLogoWorking = logoTestResults.headerLogo.relocated && logoTestResults.logoImage.visible;
  const fallbackWorking = logoTestResults.cssLogoFallback.applied && logoTestResults.cssLogoFallback.pseudoElementVisible;
  
  console.log('\n🎯 FINAL LOGO ASSESSMENT:');
  console.log('=========================');
  console.log(`✅ Real Grid4 Logo Working: ${realLogoWorking ? 'YES' : 'NO'}`);
  console.log(`✅ CSS Fallback Working: ${fallbackWorking ? 'YES' : 'NO'}`);
  console.log(`✅ Logo Display Status: ${realLogoWorking ? 'REAL LOGO' : (fallbackWorking ? 'FALLBACK LOGO' : 'NO LOGO')}`);
  console.log(`✅ Overall Status: ${realLogoWorking || fallbackWorking ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
  
  await browser.close();
})();
