const { chromium } = require('playwright');

async function quickLoaderTest() {
    console.log('🔬 Quick Smart Loader Test');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Enable console monitoring
    page.on('console', msg => {
        if (msg.text().includes('Grid4')) {
            console.log(`📋 CONSOLE: ${msg.text()}`);
        }
    });
    
    // Test different URL variations
    const testUrls = [
        'https://portal.grid4voice.ucaas.tech/portal/?grid4_version=v1-stable',
        'https://portal.grid4voice.ucaas.tech/portal/?grid4_version=v1',
        'https://portal.grid4voice.ucaas.tech/portal/?grid4_version=stable',
        'https://portal.grid4voice.ucaas.tech/portal/?grid4_version=1.0.5'
    ];
    
    for (const url of testUrls) {
        console.log(`\n🧪 Testing: ${url}`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
            
            // Wait for smart loader to process
            await page.waitForTimeout(3000);
            
            const results = await page.evaluate(() => {
                return {
                    smartLoaderExists: typeof window.Grid4SmartLoader !== 'undefined',
                    currentVersion: window.Grid4SmartLoader ? window.Grid4SmartLoader.currentVersion() : null,
                    bodyClasses: document.body.className,
                    grid4CSSExists: document.querySelector('#grid4-css-v1-stable') !== null,
                    versionIndicator: document.querySelector('#grid4-version-indicator') !== null
                };
            });
            
            console.log(`✅ Smart Loader: ${results.smartLoaderExists}`);
            console.log(`🏷️ Version: ${results.currentVersion}`);
            console.log(`🎨 CSS Loaded: ${results.grid4CSSExists}`);
            console.log(`📦 Indicator: ${results.versionIndicator}`);
            console.log(`🏷️ Body Classes: ${results.bodyClasses}`);
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }
    
    await browser.close();
    console.log('\n✅ Quick test complete');
}

quickLoaderTest();