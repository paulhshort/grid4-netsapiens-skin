const { chromium } = require('playwright');

async function debugPortalJSLoading() {
    console.log('🔍 DEBUGGING PORTAL JS LOADING');
    console.log('==============================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Listen to all network requests
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('smart-loader')) {
            console.log(`📤 REQUEST: ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('smart-loader')) {
            console.log(`📥 RESPONSE: ${response.url()} - Status: ${response.status()}`);
        }
    });
    
    // Listen to console messages
    page.on('console', msg => {
        if (msg.text().includes('Grid4') || msg.text().includes('grid4')) {
            console.log(`🗣️ CONSOLE: ${msg.text()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('📍 Navigating to portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    // Wait and watch
    console.log('⏳ Waiting and watching for 15 seconds...');
    await page.waitForTimeout(15000);
    
    // Check what scripts are actually loaded
    const scriptInfo = await page.evaluate(() => {
        const scripts = Array.from(document.scripts);
        const grid4Scripts = scripts.filter(script => 
            script.src && (script.src.includes('grid4') || script.src.includes('smart-loader'))
        );
        
        return {
            totalScripts: scripts.length,
            grid4Scripts: grid4Scripts.map(script => ({
                src: script.src,
                loaded: script.readyState || 'unknown'
            })),
            hasWindow: typeof window !== 'undefined',
            hasJQuery: typeof window.$ !== 'undefined',
            jQueryVersion: window.$ ? window.$.fn.jquery : 'not loaded'
        };
    });
    
    console.log('📊 Script Analysis:');
    console.log(`   Total scripts loaded: ${scriptInfo.totalScripts}`);
    console.log(`   Grid4 scripts found: ${scriptInfo.grid4Scripts.length}`);
    scriptInfo.grid4Scripts.forEach((script, index) => {
        console.log(`   ${index + 1}. ${script.src} (${script.loaded})`);
    });
    console.log(`   jQuery version: ${scriptInfo.jQueryVersion}`);
    
    // Check current portal configuration - try to access the UI config page
    console.log('\n🔧 Checking Portal Configuration...');
    
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/uiconfigs/index', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        // Look for PORTAL_EXTRA_JS setting
        const configInfo = await page.evaluate(() => {
            const pageText = document.body.textContent || '';
            const hasExtraJS = pageText.includes('PORTAL_EXTRA_JS');
            const hasSmartLoader = pageText.includes('smart-loader');
            
            // Try to find any table rows with configuration
            const rows = document.querySelectorAll('tr');
            const relevantRows = [];
            rows.forEach(row => {
                const text = row.textContent || '';
                if (text.includes('PORTAL_EXTRA_JS') || text.includes('smart-loader') || text.includes('grid4')) {
                    relevantRows.push(text.trim());
                }
            });
            
            return {
                hasExtraJS,
                hasSmartLoader,
                relevantConfigs: relevantRows,
                pageTitle: document.title,
                pageUrl: window.location.href
            };
        });
        
        console.log(`   Page Title: ${configInfo.pageTitle}`);
        console.log(`   Current URL: ${configInfo.pageUrl}`);
        console.log(`   Found PORTAL_EXTRA_JS: ${configInfo.hasExtraJS ? '✅ YES' : '❌ NO'}`);
        console.log(`   Found smart-loader: ${configInfo.hasSmartLoader ? '✅ YES' : '❌ NO'}`);
        
        if (configInfo.relevantConfigs.length > 0) {
            console.log('   📋 Relevant configurations:');
            configInfo.relevantConfigs.forEach((config, index) => {
                console.log(`      ${index + 1}. ${config}`);
            });
        }
        
        // Take screenshot of config page
        const configScreenshot = `./testing/portal-config-debug-${Date.now()}.png`;
        await page.screenshot({ 
            path: configScreenshot, 
            fullPage: true 
        });
        console.log(`   📸 Config screenshot: ${configScreenshot}`);
        
    } catch (error) {
        console.log(`   ❌ Could not access config page: ${error.message}`);
    }
    
    await browser.close();
    console.log('✅ Debug session complete');
}

debugPortalJSLoading().catch(console.error);