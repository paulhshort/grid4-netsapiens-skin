const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🖼️ TESTING GRID4 REAL LOGO v4.2.3 - FINAL TEST');
  console.log('===============================================');
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('Logo') || msg.text().includes('4.2.3')) {
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
  
  console.log('\n🔄 Step 2: Force load Grid4 v4.2.3 with logo fixes...');
  
  // Inject the latest version with strong cache buster
  await page.evaluate(() => {
    // Remove any existing Grid4 scripts
    document.querySelectorAll('script[src*="grid4"]').forEach(script => script.remove());
    document.querySelectorAll('link[href*="grid4"]').forEach(link => link.remove());
    
    // Load fresh CSS with cache buster
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css?v=4.2.3&cb=' + Date.now() + '&r=' + Math.random();
    document.head.appendChild(cssLink);
    
    // Load fresh JS with cache buster
    const script = document.createElement('script');
    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.js?v=4.2.3&cb=' + Date.now() + '&r=' + Math.random();
    script.onload = function() {
      console.log('🔄 Fresh Grid4 v4.2.3 loaded with logo fixes');
    };
    document.head.appendChild(script);
  });
  
  // Wait for script to load and execute
  await page.waitForTimeout(8000);
  
  console.log('\n🔍 Step 3: Testing v4.2.3 real logo integration...');
  
  const finalTestResults = await page.evaluate(() => {
    return {
      // Version check
      version: {
        g4Version: window.G4 ? window.G4.config.version : 'N/A',
        g4Initialized: window.G4 ? window.G4.config.initialized : false
      },
      
      // Original header logo element
      originalHeaderLogo: {
        exists: !!document.getElementById('header-logo'),
        visible: document.getElementById('header-logo')?.offsetParent !== null,
        display: document.getElementById('header-logo')?.style.display || 'default',
        relocated: document.getElementById('header-logo')?.hasAttribute('data-grid4-relocated'),
        hidden: document.getElementById('header-logo')?.hasAttribute('data-grid4-hidden'),
        parentElement: document.getElementById('header-logo')?.parentElement?.id || 'N/A'
      },
      
      // Cloned logo element
      clonedLogo: {
        exists: !!document.getElementById('header-logo-clone'),
        visible: document.getElementById('header-logo-clone')?.offsetParent !== null,
        parentElement: document.getElementById('header-logo-clone')?.parentElement?.id || 'N/A',
        styles: document.getElementById('header-logo-clone')?.style.cssText || 'N/A'
      },
      
      // Logo images
      logoImages: {
        originalImage: {
          exists: !!document.querySelector('#header-logo img'),
          src: document.querySelector('#header-logo img')?.src || 'N/A',
          visible: document.querySelector('#header-logo img')?.offsetParent !== null
        },
        clonedImage: {
          exists: !!document.querySelector('#header-logo-clone img'),
          src: document.querySelector('#header-logo-clone img')?.src || 'N/A',
          visible: document.querySelector('#header-logo-clone img')?.offsetParent !== null,
          styles: document.querySelector('#header-logo-clone img')?.style.cssText || 'N/A'
        }
      },
      
      // Navigation and fallback
      navigation: {
        exists: !!document.getElementById('navigation'),
        hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        children: Array.from(document.getElementById('navigation')?.children || []).map(child => ({
          id: child.id,
          tagName: child.tagName,
          classes: child.className
        }))
      },
      
      // CSS fallback pseudo-element
      cssLogoFallback: {
        applied: !!document.getElementById('navigation')?.classList.contains('grid4-logo-fallback'),
        pseudoElementVisible: !!document.getElementById('navigation') && 
          window.getComputedStyle(document.getElementById('navigation'), '::before').content !== 'none'
      },
      
      // Logo strategy status
      logoStrategy: {
        strategyUsed: window.G4 && window.G4.logo ? window.G4.logo.state.strategyUsed : 'N/A',
        logoRelocated: window.G4 && window.G4.logo ? window.G4.logo.state.logoRelocated : false,
        logoFound: window.G4 && window.G4.logo ? window.G4.logo.state.logoFound : false
      }
    };
  });
  
  console.log('\n📊 GRID4 v4.2.3 FINAL TEST RESULTS:');
  console.log('====================================');
  
  console.log('\n📋 Version:');
  console.log(`  G4 Version: ${finalTestResults.version.g4Version}`);
  console.log(`  G4 Initialized: ${finalTestResults.version.g4Initialized ? '✅' : '❌'}`);
  
  console.log('\n🖼️ Original Header Logo (#header-logo):');
  console.log(`  Exists: ${finalTestResults.originalHeaderLogo.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${finalTestResults.originalHeaderLogo.visible ? '✅' : '❌'}`);
  console.log(`  Display: ${finalTestResults.originalHeaderLogo.display}`);
  console.log(`  Relocated: ${finalTestResults.originalHeaderLogo.relocated ? '✅' : '❌'}`);
  console.log(`  Hidden: ${finalTestResults.originalHeaderLogo.hidden ? '✅' : '❌'}`);
  console.log(`  Parent: ${finalTestResults.originalHeaderLogo.parentElement}`);
  
  console.log('\n🖼️ Cloned Logo (#header-logo-clone):');
  console.log(`  Exists: ${finalTestResults.clonedLogo.exists ? '✅' : '❌'}`);
  console.log(`  Visible: ${finalTestResults.clonedLogo.visible ? '✅' : '❌'}`);
  console.log(`  Parent: ${finalTestResults.clonedLogo.parentElement}`);
  console.log(`  Styles: ${finalTestResults.clonedLogo.styles}`);
  
  console.log('\n🖼️ Logo Images:');
  console.log('  Original Image:');
  console.log(`    Exists: ${finalTestResults.logoImages.originalImage.exists ? '✅' : '❌'}`);
  console.log(`    Visible: ${finalTestResults.logoImages.originalImage.visible ? '✅' : '❌'}`);
  console.log(`    Source: ${finalTestResults.logoImages.originalImage.src}`);
  console.log('  Cloned Image:');
  console.log(`    Exists: ${finalTestResults.logoImages.clonedImage.exists ? '✅' : '❌'}`);
  console.log(`    Visible: ${finalTestResults.logoImages.clonedImage.visible ? '✅' : '❌'}`);
  console.log(`    Source: ${finalTestResults.logoImages.clonedImage.src}`);
  console.log(`    Styles: ${finalTestResults.logoImages.clonedImage.styles}`);
  
  console.log('\n🧭 Navigation:');
  console.log(`  Exists: ${finalTestResults.navigation.exists ? '✅' : '❌'}`);
  console.log(`  Has Logo Fallback Class: ${finalTestResults.navigation.hasLogoFallback ? '✅' : '❌'}`);
  console.log('  Children:');
  finalTestResults.navigation.children.forEach(child => {
    console.log(`    ${child.tagName}${child.id ? '#' + child.id : ''} (${child.classes})`);
  });
  
  console.log('\n🎨 CSS Logo Fallback:');
  console.log(`  Applied: ${finalTestResults.cssLogoFallback.applied ? '✅' : '❌'}`);
  console.log(`  Pseudo-element Visible: ${finalTestResults.cssLogoFallback.pseudoElementVisible ? '✅' : '❌'}`);
  
  console.log('\n🔧 Logo Strategy:');
  console.log(`  Strategy Used: ${finalTestResults.logoStrategy.strategyUsed}`);
  console.log(`  Logo Relocated: ${finalTestResults.logoStrategy.logoRelocated ? '✅' : '❌'}`);
  console.log(`  Logo Found: ${finalTestResults.logoStrategy.logoFound ? '✅' : '❌'}`);
  
  // Manual initialization if needed
  if (!finalTestResults.version.g4Initialized) {
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
          clonedLogoVisible: document.getElementById('header-logo-clone')?.offsetParent !== null,
          originalLogoHidden: document.getElementById('header-logo')?.style.display === 'none',
          strategyUsed: window.G4 && window.G4.logo ? window.G4.logo.state.strategyUsed : 'N/A'
        };
      });
      
      console.log('\n🔄 After Manual Init:');
      console.log(`  G4 Initialized: ${afterInit.g4Initialized ? '✅' : '❌'}`);
      console.log(`  Cloned Logo Visible: ${afterInit.clonedLogoVisible ? '✅' : '❌'}`);
      console.log(`  Original Logo Hidden: ${afterInit.originalLogoHidden ? '✅' : '❌'}`);
      console.log(`  Strategy Used: ${afterInit.strategyUsed}`);
    }
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/grid4-logo-v4.2.3-final-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/grid4-logo-v4.2.3-final-test.png');
  
  // Final assessment
  const realLogoWorking = (finalTestResults.clonedLogo.exists && finalTestResults.clonedLogo.visible) || 
                         (finalTestResults.originalHeaderLogo.relocated && finalTestResults.originalHeaderLogo.visible);
  const fallbackWorking = finalTestResults.cssLogoFallback.applied && finalTestResults.cssLogoFallback.pseudoElementVisible;
  const correctLogoImage = finalTestResults.logoImages.clonedImage.src.includes('portal_main_top_left.png') ||
                          finalTestResults.logoImages.originalImage.src.includes('portal_main_top_left.png');
  
  console.log('\n🎯 FINAL LOGO ASSESSMENT:');
  console.log('=========================');
  console.log(`✅ Real Grid4 Logo Working: ${realLogoWorking ? 'YES' : 'NO'}`);
  console.log(`✅ Correct Logo Image: ${correctLogoImage ? 'YES' : 'NO'}`);
  console.log(`✅ CSS Fallback Working: ${fallbackWorking ? 'YES' : 'NO'}`);
  console.log(`✅ Logo Display Status: ${realLogoWorking ? 'REAL LOGO' : (fallbackWorking ? 'FALLBACK LOGO' : 'NO LOGO')}`);
  console.log(`✅ Overall Status: ${realLogoWorking || fallbackWorking ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
  
  if (realLogoWorking && correctLogoImage) {
    console.log('\n🎉 SUCCESS! Real Grid4 logo is now properly integrated!');
  } else if (fallbackWorking) {
    console.log('\n⚠️  Using fallback logo - real logo integration needs attention');
  } else {
    console.log('\n❌ Logo integration failed - needs debugging');
  }
  
  await browser.close();
})();
