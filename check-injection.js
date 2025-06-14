const { chromium } = require('playwright');

async function checkInjection() {
    console.log('🔍 Checking NetSapiens Script Injection');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Monitor all script requests
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('statically') || 
            request.url().includes('github') || request.url().includes('smart-loader')) {
            console.log(`🔗 GRID4 REQUEST: ${request.method()} ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('statically') || 
            response.url().includes('github') || response.url().includes('smart-loader')) {
            console.log(`✅ GRID4 RESPONSE: ${response.status()} ${response.url()}`);
        }
    });
    
    console.log('\n📋 Testing script injection...');
    
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        // Check all script tags
        const scripts = await page.evaluate(() => {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            return scriptTags.map(script => ({
                src: script.src || 'inline',
                content: script.src ? null : script.textContent.substring(0, 100)
            })).filter(script => 
                script.src.includes('grid4') || 
                script.src.includes('statically') ||
                script.src.includes('github') ||
                (script.content && script.content.includes('Grid4'))
            );
        });
        
        console.log('\n📜 Grid4-related scripts found:');
        scripts.forEach((script, index) => {
            console.log(`${index + 1}. ${script.src}`);
            if (script.content) {
                console.log(`   Content: ${script.content}...`);
            }
        });
        
        if (scripts.length === 0) {
            console.log('❌ No Grid4 scripts found - PORTAL_EXTRA_JS not configured!');
            
            // Check if there are any references to Grid4 in the page source
            const pageContent = await page.content();
            const hasGrid4Mention = pageContent.toLowerCase().includes('grid4');
            console.log(`🔍 Page mentions Grid4: ${hasGrid4Mention}`);
            
            // Check for PORTAL_EXTRA_JS injection point
            const hasExtraJS = pageContent.includes('PORTAL_EXTRA_JS') || 
                             pageContent.includes('extra_js') ||
                             pageContent.includes('custom_js');
            console.log(`🔍 Has extra JS injection: ${hasExtraJS}`);
        } else {
            console.log('✅ Grid4 scripts found in page!');
        }
        
        // Test manual injection
        console.log('\n🧪 Testing manual smart loader injection...');
        await page.addScriptTag({
            url: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader.js'
        });
        
        await page.waitForTimeout(3000);
        
        const manualResults = await page.evaluate(() => {
            return {
                smartLoaderExists: typeof window.Grid4SmartLoader !== 'undefined',
                currentVersion: window.Grid4SmartLoader ? window.Grid4SmartLoader.currentVersion() : null,
                bodyClasses: document.body.className,
                consoleMessages: window.Grid4SmartLoader ? 'Smart loader active' : 'No smart loader'
            };
        });
        
        console.log(`✅ Manual Smart Loader: ${manualResults.smartLoaderExists}`);
        console.log(`🏷️ Manual Version: ${manualResults.currentVersion}`);
        console.log(`📋 Status: ${manualResults.consoleMessages}`);
        
        if (manualResults.smartLoaderExists) {
            console.log('\n✅ DIAGNOSIS: Smart loader works when manually injected');
            console.log('💡 SOLUTION: Configure PORTAL_EXTRA_JS in NetSapiens admin with:');
            console.log('   https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    await browser.close();
}

checkInjection();