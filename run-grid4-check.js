const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Navigating to Grid4 portal...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/');
  await page.waitForLoadState('networkidle');
  
  console.log('📊 Checking Grid4 status...');
  
  const result = await page.evaluate(() => {
    const status = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      
      // Check Grid4 objects
      grid4Objects: {
        G4: typeof window.G4,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4FixLogo: typeof window.grid4FixLogo,
        grid4SystemStatus: typeof window.grid4SystemStatus
      },
      
      // Check CSS files
      cssFiles: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .filter(link => link.href.includes('grid4'))
        .map(link => ({ 
          href: link.href, 
          loaded: !!link.sheet,
          disabled: link.disabled 
        })),
      
      // Check JS files
      jsFiles: Array.from(document.querySelectorAll('script[src]'))
        .filter(script => script.src.includes('grid4'))
        .map(script => ({ src: script.src })),
      
      // Check logo elements
      logoElements: {
        headerLogo: {
          exists: !!document.getElementById('header-logo'),
          src: document.getElementById('header-logo')?.src || null,
          innerHTML: document.getElementById('header-logo')?.innerHTML || null,
          style: document.getElementById('header-logo')?.style.cssText || null,
          rect: document.getElementById('header-logo')?.getBoundingClientRect() || null,
          visible: document.getElementById('header-logo')?.offsetParent !== null
        },
        headerLogoClone: {
          exists: !!document.getElementById('header-logo-clone'),
          src: document.getElementById('header-logo-clone')?.src || null,
          visible: document.getElementById('header-logo-clone')?.offsetParent !== null
        },
        navigation: {
          exists: !!document.getElementById('navigation'),
          classes: document.getElementById('navigation')?.className || null,
          hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback') || false
        }
      },
      
      // Check body classes
      bodyClasses: document.body.className.split(' '),
      
      // Check for any error messages
      errors: window.Grid4Errors || []
    };
    
    // If Grid4 debug function is available, call it
    if (typeof window.grid4DebugInfo === 'function') {
      try {
        status.grid4DebugInfo = window.grid4DebugInfo();
      } catch (e) {
        status.grid4DebugError = e.message;
      }
    }
    
    return status;
  });
  
  console.log('📋 Grid4 Status Report:');
  console.log(JSON.stringify(result, null, 2));
  
  // Try to fix logo if Grid4 is loaded
  if (result.grid4Objects.grid4FixLogo === 'function') {
    console.log('🔧 Attempting logo fix...');
    
    await page.evaluate(() => {
      if (typeof window.grid4FixLogo === 'function') {
        return window.grid4FixLogo();
      }
    });
    
    // Wait and check again
    await page.waitForTimeout(2000);
    
    const afterFix = await page.evaluate(() => {
      return {
        headerLogo: !!document.getElementById('header-logo'),
        headerLogoClone: !!document.getElementById('header-logo-clone'),
        navigationHasFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback') || false,
        logoVisible: document.getElementById('header-logo')?.offsetParent !== null ||
                    document.getElementById('header-logo-clone')?.offsetParent !== null
      };
    });
    
    console.log('🔄 Status after logo fix:', afterFix);
  }
  
  // Take screenshots
  await page.screenshot({ path: 'grid4-status-check.png', fullPage: true });
  console.log('📸 Screenshot saved as grid4-status-check.png');
  
  await browser.close();
})();
