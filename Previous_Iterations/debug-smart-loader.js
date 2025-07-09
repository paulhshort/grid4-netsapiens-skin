const { chromium } = require('playwright');

async function debugSmartLoader() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        // Login and navigate
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(3000);
        
        // Check for Smart Loader and CSS/JS loading
        const loadingStatus = await page.evaluate(() => {
            const results = {
                smartLoader: {
                    scriptExists: !!document.querySelector('script[src*="grid4-smart-loader"]'),
                    configExists: typeof window.Grid4SmartLoader !== 'undefined',
                    loaderActive: typeof window.Grid4SmartLoader?.isActive === 'function' ? window.Grid4SmartLoader.isActive() : 'unknown'
                },
                cssLoading: {
                    linkExists: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                    stylesheetCount: document.styleSheets.length,
                    grid4Styles: Array.from(document.styleSheets).filter(sheet => 
                        sheet.href && sheet.href.includes('grid4')).length
                },
                jsLoading: {
                    scriptExists: !!document.querySelector('script[src*="grid4-emergency-hotfix"]'),
                    grid4Global: typeof window.Grid4 !== 'undefined',
                    functions: {
                        fixTableOverflow: typeof window.fixTableOverflow !== 'undefined'
                    }
                },
                bodyClasses: document.body.className,
                currentURL: window.location.href
            };
            
            // Look for any Grid4-related console messages
            console.log('🔍 Checking for Grid4 activity...');
            
            return results;
        });
        
        console.log('📊 SMART LOADER DEBUG ANALYSIS:');
        console.log(JSON.stringify(loadingStatus, null, 2));
        
        // Try to manually load the smart loader if it's missing
        if (!loadingStatus.smartLoader.scriptExists) {
            console.log('\n⚠️ Smart Loader missing - attempting manual injection...');
            
            await page.evaluate(() => {
                const script = document.createElement('script');
                script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader.js';
                script.onload = () => console.log('✅ Smart Loader manually injected');
                script.onerror = () => console.log('❌ Smart Loader manual injection failed');
                document.head.appendChild(script);
            });
            
            await page.waitForTimeout(5000);
            
            const afterInjection = await page.evaluate(() => {
                return {
                    smartLoaderExists: typeof window.Grid4SmartLoader !== 'undefined',
                    bodyClasses: document.body.className,
                    cssExists: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                    jsExists: !!document.querySelector('script[src*="grid4-emergency-hotfix"]')
                };
            });
            
            console.log('\n📊 AFTER MANUAL INJECTION:');
            console.log(JSON.stringify(afterInjection, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugSmartLoader();