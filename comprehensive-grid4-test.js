const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔐 COMPREHENSIVE GRID4 TEST');
  console.log('============================');
  
  // Set up request/response monitoring
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    if (request.url().includes('grid4') || request.url().includes('cdn.statically.io')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`📤 REQUEST: ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('grid4') || response.url().includes('cdn.statically.io')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString()
      });
      console.log(`📥 RESPONSE: ${response.status()} - ${response.url()}`);
    }
  });
  
  // Monitor console messages
  page.on('console', msg => {
    if (msg.text().includes('Grid4') || msg.text().includes('G4') || msg.text().includes('logo')) {
      console.log(`🗣️ CONSOLE: ${msg.text()}`);
    }
  });
  
  console.log('\n🔐 Step 1: Logging in...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/login');
  await page.waitForLoadState('networkidle');
  
  // Fill login form
  await page.fill('#LoginUsername', '1002@grid4voice');
  await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
  await page.click('input[type="submit"]');
  
  console.log('⏳ Waiting for login...');
  await page.waitForLoadState('networkidle');
  
  const currentUrl = page.url();
  console.log('Current URL after login:', currentUrl);
  
  if (currentUrl.includes('/home')) {
    console.log('✅ Login successful');
    
    // Immediately check for Grid4 customizations on home page
    console.log('\n🔍 Checking home page for Grid4 customizations...');
    
    const homePageCheck = await page.evaluate(() => {
      return {
        url: window.location.href,
        
        // Check for Grid4 objects
        grid4Objects: {
          G4: typeof window.G4,
          grid4DebugInfo: typeof window.grid4DebugInfo,
          grid4FixLogo: typeof window.grid4FixLogo,
          grid4SystemStatus: typeof window.grid4SystemStatus
        },
        
        // Check all CSS files
        allCSSFiles: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .map(link => ({ href: link.href, loaded: !!link.sheet })),
        
        // Check all JS files
        allJSFiles: Array.from(document.querySelectorAll('script[src]'))
          .map(script => ({ src: script.src })),
        
        // Check for specific Grid4 elements
        elements: {
          headerLogo: !!document.getElementById('header-logo'),
          navigation: !!document.getElementById('navigation'),
          wrapper: !!document.querySelector('.wrapper'),
          grid4LogoFallback: !!document.querySelector('.grid4-logo-fallback'),
          hamburgerButton: !!document.querySelector('.hamburger-toggle, .menu-toggle, [data-toggle="navigation"]')
        },
        
        // Check body classes
        bodyClasses: document.body.className.split(' '),
        
        // Check for any Grid4-related CSS variables
        cssVariables: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--g4-primary').trim(),
          accent: getComputedStyle(document.documentElement).getPropertyValue('--g4-accent').trim(),
          sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--g4-sidebar-width').trim()
        }
      };
    });
    
    console.log('\n📊 HOME PAGE ANALYSIS:');
    console.log('=======================');
    console.log('URL:', homePageCheck.url);
    
    console.log('\n🔧 Grid4 Objects:');
    Object.entries(homePageCheck.grid4Objects).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('\n📁 CSS Files:');
    const grid4CSS = homePageCheck.allCSSFiles.filter(file => file.href.includes('grid4'));
    if (grid4CSS.length > 0) {
      grid4CSS.forEach(file => console.log(`  ✅ ${file.href} (loaded: ${file.loaded})`));
    } else {
      console.log('  ❌ No Grid4 CSS files found');
      console.log('  📋 All CSS files:');
      homePageCheck.allCSSFiles.forEach(file => console.log(`    ${file.href}`));
    }
    
    console.log('\n📄 JS Files:');
    const grid4JS = homePageCheck.allJSFiles.filter(file => file.src.includes('grid4'));
    if (grid4JS.length > 0) {
      grid4JS.forEach(file => console.log(`  ✅ ${file.src}`));
    } else {
      console.log('  ❌ No Grid4 JS files found');
      console.log('  📋 All JS files:');
      homePageCheck.allJSFiles.forEach(file => console.log(`    ${file.src}`));
    }
    
    console.log('\n🎨 Elements:');
    Object.entries(homePageCheck.elements).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
    
    console.log('\n🎨 CSS Variables:');
    Object.entries(homePageCheck.cssVariables).forEach(([key, value]) => {
      console.log(`  ${key}: ${value || 'NOT SET'}`);
    });
    
    console.log('\n📝 Body Classes:', homePageCheck.bodyClasses.join(' '));
    
    // Now try to access the Grid4 test domain quickly
    console.log('\n🎯 Attempting to access Grid4_sunday_Test domain...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications');
    await page.waitForLoadState('networkidle');
    
    const domainPageCheck = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        
        // Check for Grid4 objects
        grid4Objects: {
          G4: typeof window.G4,
          grid4DebugInfo: typeof window.grid4DebugInfo
        },
        
        // Check for Grid4 files
        grid4Files: {
          css: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .filter(link => link.href.includes('grid4'))
            .map(link => ({ href: link.href, loaded: !!link.sheet })),
          js: Array.from(document.querySelectorAll('script[src]'))
            .filter(script => script.src.includes('grid4'))
            .map(script => ({ src: script.src }))
        },
        
        // Check for logo elements
        logoElements: {
          headerLogo: !!document.getElementById('header-logo'),
          navigation: !!document.getElementById('navigation'),
          logoFallback: !!document.querySelector('.grid4-logo-fallback')
        }
      };
    });
    
    console.log('\n📊 DOMAIN PAGE ANALYSIS:');
    console.log('=========================');
    console.log('URL:', domainPageCheck.url);
    console.log('Title:', domainPageCheck.title);
    
    if (domainPageCheck.url.includes('Grid4_sunday_Test')) {
      console.log('✅ Successfully accessed Grid4_sunday_Test domain');
      
      console.log('\n🔧 Grid4 Objects:');
      Object.entries(domainPageCheck.grid4Objects).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      
      console.log('\n📁 Grid4 Files:');
      if (domainPageCheck.grid4Files.css.length > 0) {
        console.log('  CSS Files:');
        domainPageCheck.grid4Files.css.forEach(file => 
          console.log(`    ✅ ${file.href} (loaded: ${file.loaded})`)
        );
      } else {
        console.log('  ❌ No Grid4 CSS files');
      }
      
      if (domainPageCheck.grid4Files.js.length > 0) {
        console.log('  JS Files:');
        domainPageCheck.grid4Files.js.forEach(file => 
          console.log(`    ✅ ${file.src}`)
        );
      } else {
        console.log('  ❌ No Grid4 JS files');
      }
      
      console.log('\n🎨 Logo Elements:');
      Object.entries(domainPageCheck.logoElements).forEach(([key, value]) => {
        console.log(`  ${key}: ${value ? '✅' : '❌'}`);
      });
      
      // If Grid4 is loaded, try to run debug functions
      if (domainPageCheck.grid4Objects.grid4DebugInfo === 'function') {
        console.log('\n🔧 Running Grid4 debug functions...');
        
        const debugInfo = await page.evaluate(() => {
          try {
            return window.grid4DebugInfo();
          } catch (e) {
            return { error: e.message };
          }
        });
        
        console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
      }
      
    } else {
      console.log('❌ Failed to access Grid4_sunday_Test domain');
      console.log('Redirected to:', domainPageCheck.url);
    }
    
  } else {
    console.log('❌ Login failed - redirected to:', currentUrl);
  }
  
  // Take final screenshot
  await page.screenshot({ path: './testing/comprehensive-grid4-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/comprehensive-grid4-test.png');
  
  console.log('\n📊 NETWORK SUMMARY:');
  console.log('====================');
  console.log('Grid4 Requests:', requests.length);
  console.log('Grid4 Responses:', responses.length);
  
  if (requests.length > 0) {
    console.log('\nRequests:');
    requests.forEach(req => console.log(`  ${req.method} ${req.url}`));
  }
  
  if (responses.length > 0) {
    console.log('\nResponses:');
    responses.forEach(res => console.log(`  ${res.status} ${res.url}`));
  }
  
  await browser.close();
})();
