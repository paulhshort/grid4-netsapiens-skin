const { chromium } = require('playwright');

async function testProductionLoader() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 Testing NEW production loader (bypasses CDN cache)...');
        
        // Capture all console messages
        page.on('console', msg => {
            if (msg.text().includes('Grid4')) {
                console.log('🖥️ CONSOLE:', msg.text());
            }
        });
        
        // Login
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        // Inject the NEW production loader manually to test
        await page.evaluate(() => {
            // Remove old Grid4 scripts
            const oldScripts = document.querySelectorAll('script[src*="grid4-smart-loader"]');
            oldScripts.forEach(script => script.remove());
            
            // Load new production loader
            const script = document.createElement('script');
            script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader-production.js?v=' + Date.now();
            script.onload = () => console.log('✅ NEW production loader injected');
            document.head.appendChild(script);
        });
        
        await page.waitForTimeout(8000); // Allow loading
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(5000);
        
        // Check results
        const results = await page.evaluate(() => {
            return {
                versionSelector: !!document.querySelector('#grid4-version-indicator'),
                bodyClasses: document.body.className,
                bodyBg: getComputedStyle(document.body).backgroundColor,
                wrapperBg: document.querySelector('.wrapper') ? 
                    getComputedStyle(document.querySelector('.wrapper')).backgroundColor : 'N/A',
                logo: !!document.querySelector('.grid4-logo-replaced, .grid4-sidebar-logo'),
                overflow: document.body.scrollWidth > window.innerWidth,
                overflowAmount: document.body.scrollWidth - window.innerWidth
            };
        });
        
        console.log('\n🎯 PRODUCTION LOADER TEST RESULTS:');
        console.log('====================================');
        console.log(`Version Selector: ${results.versionSelector ? '❌ STILL PRESENT' : '✅ ELIMINATED'}`);
        console.log(`Body Classes: ${results.bodyClasses.includes('grid4-emergency-active') ? '✅ APPLIED' : '❌ MISSING'}`);
        console.log(`Body Background: ${results.bodyBg}`);
        console.log(`Wrapper Background: ${results.wrapperBg}`);
        console.log(`Logo Present: ${results.logo ? '✅ YES' : '❌ NO'}`);
        console.log(`Horizontal Overflow: ${results.overflow ? '❌ ' + results.overflowAmount + 'px' : '✅ NONE'}`);
        
        await page.screenshot({ 
            path: './test-results/production-loader-test.png',
            fullPage: true 
        });
        
        console.log('\n📸 Screenshot: test-results/production-loader-test.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testProductionLoader();