const { chromium } = require('playwright');

async function quickVisualTest() {
    console.log('👁️ QUICK VISUAL TEST - Production Final');
    console.log('=====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Track all requests
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('jsdelivr')) {
            console.log(`📤 ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('jsdelivr')) {
            console.log(`📥 ${response.url()} - ${response.status()}`);
        }
    });
    
    page.on('console', msg => {
        if (msg.text().includes('Grid4')) {
            console.log(`🗣️ ${msg.text()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔗 Loading portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('⏳ Waiting 10 seconds to observe...');
    await page.waitForTimeout(10000);
    
    // Take screenshot of current state
    const screenshot = `./testing/quick-visual-${Date.now()}.png`;
    await page.screenshot({ 
        path: screenshot, 
        fullPage: true 
    });
    console.log(`📸 Screenshot: ${screenshot}`);
    
    // Check network tab equivalent
    const resourceStatus = await page.evaluate(() => {
        const performance = window.performance;
        const entries = performance.getEntriesByType('resource');
        
        const grid4Resources = entries.filter(entry => 
            entry.name.includes('grid4') || 
            entry.name.includes('jsdelivr') ||
            entry.name.includes('statically')
        );
        
        return grid4Resources.map(entry => ({
            name: entry.name,
            transferSize: entry.transferSize,
            duration: Math.round(entry.duration)
        }));
    });
    
    console.log('📊 Grid4 Resource Status:');
    if (resourceStatus.length === 0) {
        console.log('   ❌ No Grid4 resources found in performance timeline');
    } else {
        resourceStatus.forEach((resource, index) => {
            console.log(`   ${index + 1}. ${resource.name}`);
            console.log(`      Size: ${resource.transferSize} bytes, Duration: ${resource.duration}ms`);
        });
    }
    
    console.log('\n💡 Note: If you can see the login page, the issue is that');
    console.log('    the PORTAL_EXTRA_JS setting is only active for authenticated users.');
    console.log('    The Grid4 loader will work once logged in.\n');
    
    await browser.close();
    console.log('✅ Quick visual test complete');
}

quickVisualTest().catch(console.error);