const { chromium } = require('playwright');

async function finalTest() {
    const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    const page = await browser.newPage();
    
    try {
        console.log('🚀 FINAL GRID4 PORTAL TEST...');
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { waitUntil: 'networkidle' });
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { waitUntil: 'networkidle' });
        await page.waitForTimeout(10000);
        
        await page.screenshot({ path: './test-results/final-grid4-complete.png', fullPage: true });
        console.log('✅ Grid4 Portal Complete - Screenshot saved!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    await browser.close();
}

finalTest();
