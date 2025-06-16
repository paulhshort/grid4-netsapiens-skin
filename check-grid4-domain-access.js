const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Testing Grid4 Domain Access...');
  
  // Navigate to portal home first
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/home');
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Now try to access grid4lab domain directly
  console.log('\n🎯 Attempting to access grid4lab domain...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab');
  await page.waitForLoadState('networkidle');
  
  console.log('After grid4lab attempt - URL:', page.url());
  
  // Check if we're in the domain context
  const domainCheck = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      
      // Check for Grid4 customizations
      grid4Objects: {
        G4: typeof window.G4,
        grid4DebugInfo: typeof window.grid4DebugInfo,
        grid4FixLogo: typeof window.grid4FixLogo
      },
      
      // Check for Grid4 CSS/JS files
      grid4Files: {
        css: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .filter(link => link.href.includes('grid4'))
          .map(link => link.href),
        js: Array.from(document.querySelectorAll('script[src]'))
          .filter(script => script.src.includes('grid4'))
          .map(script => script.src)
      },
      
      // Check for logo elements
      logoElements: {
        headerLogo: !!document.getElementById('header-logo'),
        navigation: !!document.getElementById('navigation'),
        logoFallback: !!document.querySelector('.grid4-logo-fallback')
      },
      
      // Check page content for domain indicators
      pageContent: {
        hasGrid4Text: document.body.textContent.includes('Grid4'),
        hasDomainText: document.body.textContent.includes('domain'),
        breadcrumbs: Array.from(document.querySelectorAll('.breadcrumb, .breadcrumbs, nav'))
          .map(el => el.textContent.trim()).filter(text => text.length > 0)
      }
    };
  });
  
  console.log('\n📊 Domain Check Results:');
  console.log('========================');
  console.log('Final URL:', domainCheck.url);
  console.log('Page Title:', domainCheck.title);
  
  console.log('\n🔧 Grid4 Objects:');
  Object.entries(domainCheck.grid4Objects).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\n📁 Grid4 Files:');
  console.log('  CSS Files:', domainCheck.grid4Files.css.length > 0 ? domainCheck.grid4Files.css : 'None');
  console.log('  JS Files:', domainCheck.grid4Files.js.length > 0 ? domainCheck.grid4Files.js : 'None');
  
  console.log('\n🎨 Logo Elements:');
  Object.entries(domainCheck.logoElements).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? '✅' : '❌'}`);
  });
  
  console.log('\n📄 Page Content:');
  console.log('  Has Grid4 text:', domainCheck.pageContent.hasGrid4Text ? '✅' : '❌');
  console.log('  Has domain text:', domainCheck.pageContent.hasDomainText ? '✅' : '❌');
  console.log('  Breadcrumbs:', domainCheck.pageContent.breadcrumbs);
  
  // Try the Grid4_sunday_Test domain
  console.log('\n🎯 Attempting to access Grid4_sunday_Test domain...');
  await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications');
  await page.waitForLoadState('networkidle');
  
  const sundayTestCheck = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      hasGrid4CSS: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => link.href.includes('grid4')),
      hasGrid4JS: Array.from(document.querySelectorAll('script[src]'))
        .some(script => script.src.includes('grid4'))
    };
  });
  
  console.log('\n📊 Grid4_sunday_Test Results:');
  console.log('==============================');
  console.log('URL:', sundayTestCheck.url);
  console.log('Title:', sundayTestCheck.title);
  console.log('Has Grid4 CSS:', sundayTestCheck.hasGrid4CSS ? '✅' : '❌');
  console.log('Has Grid4 JS:', sundayTestCheck.hasGrid4JS ? '✅' : '❌');
  
  // Take screenshots
  await page.screenshot({ path: './testing/domain-access-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: ./testing/domain-access-test.png');
  
  await browser.close();
})();
