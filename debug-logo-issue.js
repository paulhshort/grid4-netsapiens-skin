// Grid4 Logo Debug Script
// This script will help diagnose why the logo isn't displaying

const { test, expect } = require('@playwright/test');

test('Debug Grid4 Logo Issue', async ({ page }) => {
  console.log('🔍 Starting Grid4 Logo Debug Session...');
  
  // Navigate to portal
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if Grid4 customizations are loaded
  const grid4Loaded = await page.evaluate(() => {
    return {
      G4Object: typeof window.G4 !== 'undefined',
      grid4DebugInfo: typeof window.grid4DebugInfo === 'function',
      grid4FixLogo: typeof window.grid4FixLogo === 'function',
      grid4SystemStatus: typeof window.grid4SystemStatus === 'function'
    };
  });
  
  console.log('📊 Grid4 Object Status:', grid4Loaded);
  
  // Check for CSS and JS files
  const resourcesLoaded = await page.evaluate(() => {
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => ({ href: link.href, loaded: link.sheet !== null }))
      .filter(link => link.href.includes('grid4'));
      
    const jsScripts = Array.from(document.querySelectorAll('script[src]'))
      .map(script => ({ src: script.src }))
      .filter(script => script.src.includes('grid4'));
      
    return { cssLinks, jsScripts };
  });
  
  console.log('📁 Grid4 Resources:', resourcesLoaded);
  
  // Check for logo elements
  const logoElements = await page.evaluate(() => {
    return {
      headerLogo: {
        exists: !!document.getElementById('header-logo'),
        src: document.getElementById('header-logo')?.src || 'N/A',
        innerHTML: document.getElementById('header-logo')?.innerHTML || 'N/A',
        style: document.getElementById('header-logo')?.style.cssText || 'N/A',
        rect: document.getElementById('header-logo')?.getBoundingClientRect() || 'N/A'
      },
      headerLogoClone: {
        exists: !!document.getElementById('header-logo-clone'),
        src: document.getElementById('header-logo-clone')?.src || 'N/A'
      },
      navigation: {
        exists: !!document.getElementById('navigation'),
        classes: document.getElementById('navigation')?.className || 'N/A',
        hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback') || false
      }
    };
  });
  
  console.log('🖼️ Logo Elements Status:', logoElements);
  
  // Check console messages
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('logo') || msg.text().includes('Logo')) {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    }
  });
  
  // If Grid4 is loaded, run debug functions
  if (grid4Loaded.grid4DebugInfo) {
    console.log('🔧 Running Grid4 Debug Functions...');
    
    const debugInfo = await page.evaluate(() => {
      if (typeof window.grid4DebugInfo === 'function') {
        return window.grid4DebugInfo();
      }
      return null;
    });
    
    console.log('📋 Grid4 Debug Info:', debugInfo);
    
    // Try to fix logo
    await page.evaluate(() => {
      if (typeof window.grid4FixLogo === 'function') {
        console.log('🔧 Attempting logo fix...');
        return window.grid4FixLogo();
      }
    });
    
    // Wait a moment and check again
    await page.waitForTimeout(2000);
    
    const logoStatusAfterFix = await page.evaluate(() => {
      return {
        headerLogo: !!document.getElementById('header-logo'),
        headerLogoClone: !!document.getElementById('header-logo-clone'),
        navigationHasFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback') || false
      };
    });
    
    console.log('🔄 Logo Status After Fix:', logoStatusAfterFix);
  }
  
  // Check network requests for Grid4 files
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('grid4') || request.url().includes('statically.io')) {
      networkRequests.push({
        url: request.url(),
        method: request.method()
      });
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('grid4') || response.url().includes('statically.io')) {
      console.log(`📡 Network Response: ${response.status()} - ${response.url()}`);
    }
  });
  
  // Refresh page to see network requests
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  console.log('🌐 Grid4 Network Requests:', networkRequests);
  console.log('💬 Console Messages:', consoleMessages);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-logo-current-state.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-logo-current-state.png');
  
  // Final check - try to manually inject logo
  console.log('🔧 Attempting manual logo injection...');
  
  await page.evaluate(() => {
    const navigation = document.getElementById('navigation');
    if (navigation && !navigation.classList.contains('grid4-logo-fallback')) {
      navigation.classList.add('grid4-logo-fallback');
      console.log('✅ Added grid4-logo-fallback class to navigation');
    }
  });
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'debug-logo-after-manual-fix.png', fullPage: true });
  console.log('📸 After manual fix screenshot saved');
});
