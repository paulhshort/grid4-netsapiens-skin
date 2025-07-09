const { chromium } = require('playwright');

async function testWithLogin() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔐 Logging into portal...');
        
        // Go to login page
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        
        // Fill login form with correct field names
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        
        // Click login button and wait for navigation
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        console.log('✅ Logged in successfully');
        console.log('🔗 Current URL:', page.url());
        
        // Navigate to inventory page (like your screenshot)
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        // Wait for page to fully load
        await page.waitForTimeout(5000);
        
        // Take screenshot
        await page.screenshot({ 
            path: './test-results/authenticated-test.png',
            fullPage: true 
        });
        
        console.log('📸 Screenshot saved to ./test-results/authenticated-test.png');
        
        // Check Grid4 status
        const status = await page.evaluate(() => {
            return {
                bodyClasses: document.body.className,
                bodyDisplay: getComputedStyle(document.body).display,
                navigationExists: !!document.querySelector('#navigation'),
                contentExists: !!document.querySelector('#content'),
                grid4Logo: !!document.querySelector('.grid4-logo-replaced'),
                fixedContainer: document.querySelector('.fixed-container') ? {
                    width: document.querySelector('.fixed-container').offsetWidth,
                    computedWidth: getComputedStyle(document.querySelector('.fixed-container')).width
                } : null,
                bodyScrollWidth: document.body.scrollWidth,
                viewportWidth: window.innerWidth,
                hasOverflow: document.body.scrollWidth > window.innerWidth
            };
        });
        
        console.log('🎯 Grid4 Status:', JSON.stringify(status, null, 2));
        
        // Wait a bit to see the result
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: './test-results/error-authenticated.png' });
    }
    
    await browser.close();
}

testWithLogin();