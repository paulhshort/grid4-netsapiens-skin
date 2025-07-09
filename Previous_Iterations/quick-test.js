const { chromium } = require('playwright');

async function testPortal() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing Grid4 Emergency Hotfix...');
        
        // Go to portal URL
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Wait a moment for any dynamic loading
        await page.waitForTimeout(3000);
        
        // Take screenshot of current state
        await page.screenshot({ 
            path: './test-results/current-state.png',
            fullPage: true 
        });
        
        console.log('✅ Screenshot saved to ./test-results/current-state.png');
        
        // Check what we can see
        const pageTitle = await page.title();
        const url = page.url();
        
        console.log(`📄 Page title: ${pageTitle}`);
        console.log(`🔗 Current URL: ${url}`);
        
        // Check if our CSS/JS loaded
        const grid4Classes = await page.evaluate(() => {
            return {
                bodyHasGrid4: document.body.classList.contains('grid4-emergency-active'),
                grid4Logo: document.querySelector('.grid4-logo-replaced') ? true : false,
                navigationClass: document.querySelector('#navigation') ? 
                    document.querySelector('#navigation').className : 'not found'
            };
        });
        
        console.log('🎯 Grid4 Status:', grid4Classes);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: './test-results/error-state.png' });
    }
    
    await browser.close();
}

testPortal();