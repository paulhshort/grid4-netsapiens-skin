const { chromium } = require('playwright');

async function testGrid4Layout() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing Grid4 Layout Fix...');
    
    // Navigate to Grid4Lab domain
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Check if we need to authenticate
    const isLoginPage = await page.locator('#LoginUsername').isVisible().catch(() => false);
    
    if (isLoginPage) {
      console.log('🔐 Authenticating...');
      await page.fill('#LoginUsername', '1002@grid4voice');
      await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
      await page.click('input[type="submit"]');
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to Grid4Lab domain
    try {
      await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    } catch (e) {
      console.log('⚠️ Direct domain navigation failed, checking current page...');
    }
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check layout measurements
    const measurements = await page.evaluate(() => {
      const navigation = document.querySelector('#navigation');
      const content = document.querySelector('#content');
      const header = document.querySelector('#header');
      
      return {
        navigation: navigation ? {
          width: navigation.offsetWidth,
          left: navigation.offsetLeft,
          position: getComputedStyle(navigation).position
        } : null,
        content: content ? {
          marginLeft: getComputedStyle(content).marginLeft,
          marginTop: getComputedStyle(content).marginTop,
          left: content.offsetLeft,
          position: getComputedStyle(content).position
        } : null,
        header: header ? {
          height: header.offsetHeight,
          position: getComputedStyle(header).position
        } : null,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('📊 Layout Measurements:');
    console.log(JSON.stringify(measurements, null, 2));
    
    // Check if Grid4 CSS/JS is loaded
    const grid4Status = await page.evaluate(() => {
      const cssLoaded = Array.from(document.styleSheets).some(sheet => 
        sheet.href && sheet.href.includes('grid4')
      );
      
      const jsLoaded = !!window.Grid4Skin || !!window.Grid4Portal;
      
      const hasGrid4Classes = document.body.classList.contains('portal-skin-active') ||
                            document.body.classList.contains('grid4-portal-active');
      
      return {
        cssLoaded,
        jsLoaded,
        hasGrid4Classes,
        bodyClasses: Array.from(document.body.classList)
      };
    });
    
    console.log('🎨 Grid4 Status:');
    console.log(JSON.stringify(grid4Status, null, 2));
    
    // Take screenshot
    await page.screenshot({ 
      path: `/home/paul/dev/grid4-netsapiens-skin/testing/layout-test-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Test layout fix effectiveness
    const layoutIssues = [];
    
    if (measurements.content && measurements.navigation) {
      const expectedOffset = measurements.navigation.width;
      const actualOffset = parseInt(measurements.content.marginLeft);
      
      if (Math.abs(actualOffset - expectedOffset) > 10) {
        layoutIssues.push(`Content margin-left (${actualOffset}px) doesn't match sidebar width (${expectedOffset}px)`);
      }
    }
    
    if (measurements.content && measurements.content.left < 200) {
      layoutIssues.push(`Content starting position (${measurements.content.left}px) is too close to left edge`);
    }
    
    if (layoutIssues.length > 0) {
      console.log('❌ Layout Issues Found:');
      layoutIssues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('✅ Layout appears correct!');
    }
    
    console.log('🧪 Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testGrid4Layout().catch(console.error);