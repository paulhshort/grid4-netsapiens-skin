const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Checking current domain context and Grid4 status...');
  
  // Navigate to current page
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/home');
  await page.waitForLoadState('networkidle');
  
  const domainInfo = await page.evaluate(() => {
    return {
      url: window.location.href,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      search: window.location.search,
      
      // Check for Grid4 objects
      grid4Objects: {
        G4: typeof window.G4,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4FixLogo: typeof window.grid4FixLogo,
        grid4SystemStatus: typeof window.grid4SystemStatus
      },
      
      // Check for CSS files
      cssFiles: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map(link => ({ href: link.href, loaded: !!link.sheet })),
      
      // Check for JS files
      jsFiles: Array.from(document.querySelectorAll('script[src]'))
        .map(script => ({ src: script.src })),
      
      // Check for Grid4-specific elements
      grid4Elements: {
        headerLogo: !!document.getElementById('header-logo'),
        navigation: !!document.getElementById('navigation'),
        wrapper: !!document.querySelector('.wrapper'),
        grid4Classes: Array.from(document.body.classList).filter(cls => cls.includes('grid4'))
      },
      
      // Check page title and content
      pageTitle: document.title,
      bodyClasses: document.body.className,
      
      // Check for any domain-related info in the page
      domainInfo: {
        footerText: document.querySelector('footer')?.textContent || 'No footer',
        companyName: Array.from(document.querySelectorAll('*')).find(el => 
          el.textContent && el.textContent.includes('Grid4'))?.textContent || 'Not found'
      }
    };
  });
  
  console.log('📊 Domain Context Analysis:');
  console.log('==========================');
  console.log('Current URL:', domainInfo.url);
  console.log('Hostname:', domainInfo.hostname);
  console.log('Path:', domainInfo.pathname);
  console.log('Search:', domainInfo.search);
  console.log('Page Title:', domainInfo.pageTitle);
  console.log('Body Classes:', domainInfo.bodyClasses);
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(domainInfo.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📁 CSS Files:');
  const grid4CSS = domainInfo.cssFiles.filter(file => file.href.includes('grid4'));
  if (grid4CSS.length > 0) {
    grid4CSS.forEach(file => console.log(`  ✅ ${file.href} (loaded: ${file.loaded})`));
  } else {
    console.log('  ❌ No Grid4 CSS files found');
  }
  
  console.log('\n📄 JS Files:');
  const grid4JS = domainInfo.jsFiles.filter(file => file.src.includes('grid4'));
  if (grid4JS.length > 0) {
    grid4JS.forEach(file => console.log(`  ✅ ${file.src}`));
  } else {
    console.log('  ❌ No Grid4 JS files found');
  }
  
  console.log('\n🎨 Grid4 Elements:');
  Object.entries(domainInfo.grid4Elements).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  console.log('\n🏢 Domain Info:');
  console.log('  Footer:', domainInfo.domainInfo.footerText);
  console.log('  Company Name:', domainInfo.domainInfo.companyName);
  
  // Try to find domain switching options
  const domainSwitcher = await page.evaluate(() => {
    // Look for domain-related links or selectors
    const domainLinks = Array.from(document.querySelectorAll('a'))
      .filter(link => link.href.includes('domain') || link.textContent.includes('domain'))
      .map(link => ({ href: link.href, text: link.textContent.trim() }));
    
    const selectElements = Array.from(document.querySelectorAll('select'))
      .map(select => ({ 
        id: select.id, 
        name: select.name, 
        options: Array.from(select.options).map(opt => opt.text) 
      }));
    
    return { domainLinks, selectElements };
  });
  
  console.log('\n🔄 Domain Switching Options:');
  if (domainSwitcher.domainLinks.length > 0) {
    console.log('  Domain Links:');
    domainSwitcher.domainLinks.forEach(link => 
      console.log(`    ${link.text} -> ${link.href}`)
    );
  } else {
    console.log('  ❌ No domain links found');
  }
  
  if (domainSwitcher.selectElements.length > 0) {
    console.log('  Select Elements:');
    domainSwitcher.selectElements.forEach(select => 
      console.log(`    ${select.id || select.name}: ${select.options.join(', ')}`)
    );
  } else {
    console.log('  ❌ No select elements found');
  }
  
  // Check if we can access the test domains directly
  console.log('\n🧪 Testing Direct Domain Access:');
  
  const testDomains = [
    'https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test2/',
    'https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab',
    'https://portal.grid4voice.ucaas.tech/portal/domains'
  ];
  
  for (const testUrl of testDomains) {
    try {
      console.log(`  Testing: ${testUrl}`);
      await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 10000 });
      const finalUrl = page.url();
      const title = await page.title();
      
      if (finalUrl === testUrl) {
        console.log(`    ✅ Success - ${title}`);
      } else {
        console.log(`    ❌ Redirected to: ${finalUrl}`);
      }
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  
  await browser.close();
})();
