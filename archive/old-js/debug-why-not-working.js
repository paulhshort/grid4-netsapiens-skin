const { chromium } = require('playwright');

async function debugWhyNotWorking() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging why Grid4 changes are not taking effect...');
        
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
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(5000);
        
        // Debug loading status
        const debugInfo = await page.evaluate(() => {
            // Check what CSS and JS files are actually loaded
            const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => ({
                href: link.href,
                loaded: link.sheet !== null,
                rules: link.sheet ? link.sheet.cssRules.length : 0
            }));
            
            const jsFiles = Array.from(document.querySelectorAll('script[src]')).map(script => ({
                src: script.src,
                loaded: script.readyState || 'unknown'
            }));
            
            // Check Grid4 specific elements
            const grid4Elements = {
                smartLoaderScript: !!document.querySelector('script[src*="grid4-smart-loader"]'),
                emergencyCSS: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                emergencyJS: !!document.querySelector('script[src*="grid4-emergency-hotfix"]'),
                versionIndicator: !!document.querySelector('#grid4-version-indicator'),
                bodyClasses: document.body.className
            };
            
            // Check actual CSS values
            const computedStyles = {
                body: {
                    background: getComputedStyle(document.body).backgroundColor,
                    color: getComputedStyle(document.body).color
                },
                wrapper: document.querySelector('.wrapper') ? {
                    background: getComputedStyle(document.querySelector('.wrapper')).backgroundColor,
                    backgroundImage: getComputedStyle(document.querySelector('.wrapper')).backgroundImage
                } : null
            };
            
            // Check if our CSS variables are defined
            const cssVariables = {
                g4BgPrimary: getComputedStyle(document.documentElement).getPropertyValue('--g4-bg-primary'),
                g4BgSecondary: getComputedStyle(document.documentElement).getPropertyValue('--g4-bg-secondary'),
                g4Accent: getComputedStyle(document.documentElement).getPropertyValue('--g4-accent')
            };
            
            return {
                cssFiles: cssFiles.filter(f => f.href.includes('grid4')),
                jsFiles: jsFiles.filter(f => f.src.includes('grid4')),
                grid4Elements,
                computedStyles,
                cssVariables,
                windowGrid4: typeof window.Grid4SmartLoader,
                url: window.location.href
            };
        });
        
        console.log('\n🔍 DEBUG ANALYSIS:');
        console.log('==================');
        
        console.log('\n📁 Grid4 Files Loaded:');
        debugInfo.cssFiles.forEach(file => {
            console.log(`   CSS: ${file.href.split('/').pop()} - Loaded: ${file.loaded} (${file.rules} rules)`);
        });
        debugInfo.jsFiles.forEach(file => {
            console.log(`   JS: ${file.src.split('/').pop()} - Status: ${file.loaded}`);
        });
        
        console.log('\n🎯 Grid4 Elements:');
        console.log(`   Smart Loader: ${debugInfo.grid4Elements.smartLoaderScript ? '✅' : '❌'}`);
        console.log(`   Emergency CSS: ${debugInfo.grid4Elements.emergencyCSS ? '✅' : '❌'}`);
        console.log(`   Emergency JS: ${debugInfo.grid4Elements.emergencyJS ? '✅' : '❌'}`);
        console.log(`   Version Indicator: ${debugInfo.grid4Elements.versionIndicator ? '❌ PRESENT' : '✅ ABSENT'}`);
        console.log(`   Body Classes: ${debugInfo.grid4Elements.bodyClasses}`);
        
        console.log('\n🎨 Computed Styles:');
        console.log(`   Body Background: ${debugInfo.computedStyles.body.background}`);
        console.log(`   Body Color: ${debugInfo.computedStyles.body.color}`);
        if (debugInfo.computedStyles.wrapper) {
            console.log(`   Wrapper Background: ${debugInfo.computedStyles.wrapper.background}`);
            console.log(`   Wrapper BG Image: ${debugInfo.computedStyles.wrapper.backgroundImage}`);
        }
        
        console.log('\n🔧 CSS Variables:');
        console.log(`   --g4-bg-primary: ${debugInfo.cssVariables.g4BgPrimary}`);
        console.log(`   --g4-bg-secondary: ${debugInfo.cssVariables.g4BgSecondary}`);
        console.log(`   --g4-accent: ${debugInfo.cssVariables.g4Accent}`);
        
        console.log(`\n🌐 Window.Grid4SmartLoader: ${debugInfo.windowGrid4}`);
        
        // Force cache bust and reload to test
        console.log('\n🔄 Testing cache busting...');
        await page.evaluate(() => {
            // Force reload Grid4 CSS with timestamp
            const existingCSS = document.querySelector('link[href*="grid4-emergency-hotfix"]');
            if (existingCSS) {
                existingCSS.remove();
            }
            
            const newCSS = document.createElement('link');
            newCSS.rel = 'stylesheet';
            newCSS.href = `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.css?v=${Date.now()}`;
            document.head.appendChild(newCSS);
            
            console.log('🔄 Grid4: Forced CSS reload with cache bust');
        });
        
        await page.waitForTimeout(3000);
        
        // Check again after cache bust
        const afterCacheBust = await page.evaluate(() => {
            return {
                bodyBg: getComputedStyle(document.body).backgroundColor,
                wrapperBg: document.querySelector('.wrapper') ? 
                    getComputedStyle(document.querySelector('.wrapper')).backgroundColor : 'N/A',
                bodyClasses: document.body.className,
                versionIndicator: !!document.querySelector('#grid4-version-indicator')
            };
        });
        
        console.log('\n📊 AFTER CACHE BUST:');
        console.log(`   Body Background: ${afterCacheBust.bodyBg}`);
        console.log(`   Wrapper Background: ${afterCacheBust.wrapperBg}`);
        console.log(`   Body Classes: ${afterCacheBust.bodyClasses}`);
        console.log(`   Version Indicator: ${afterCacheBust.versionIndicator ? '❌ STILL PRESENT' : '✅ REMOVED'}`);
        
        await page.screenshot({ path: './test-results/debug-after-cache-bust.png' });
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugWhyNotWorking();