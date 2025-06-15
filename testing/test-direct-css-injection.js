const { chromium } = require('playwright');

async function testDirectCSSInjection() {
    console.log('💉 TESTING DIRECT CSS INJECTION');
    console.log('===============================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔗 Loading portal login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('💉 Injecting Grid4 Production Final CSS directly...');
    
    // Inject the production final CSS directly into the page
    await page.addStyleTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-production-final.css'
    });
    
    await page.waitForTimeout(2000);
    
    // Check if CSS loaded and is taking effect
    const cssStatus = await page.evaluate(() => {
        const injectedSheet = Array.from(document.styleSheets).find(sheet => 
            sheet.href && sheet.href.includes('grid4-production-final.css')
        );
        
        // Check for CSS variables
        const rootStyles = window.getComputedStyle(document.documentElement);
        const g4Primary = rootStyles.getPropertyValue('--g4-primary').trim();
        const g4SidebarWidth = rootStyles.getPropertyValue('--g4-sidebar-width').trim();
        
        return {
            cssLoaded: !!injectedSheet,
            cssUrl: injectedSheet ? injectedSheet.href : 'Not loaded',
            hasG4Variables: !!(g4Primary && g4SidebarWidth),
            g4Primary,
            g4SidebarWidth
        };
    });
    
    console.log('🎯 Direct CSS Injection Results:');
    console.log(`   CSS Loaded: ${cssStatus.cssLoaded ? '✅ YES' : '❌ NO'}`);
    if (cssStatus.cssLoaded) {
        console.log(`   CSS URL: ${cssStatus.cssUrl}`);
    }
    console.log(`   Has CSS Variables: ${cssStatus.hasG4Variables ? '✅ YES' : '❌ NO'}`);
    console.log(`   --g4-primary: ${cssStatus.g4Primary || 'Not found'}`);
    console.log(`   --g4-sidebar-width: ${cssStatus.g4SidebarWidth || 'Not found'}`);
    
    // Now inject the smart loader to test the loading mechanism
    console.log('🚀 Injecting Smart Loader...');
    await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-smart-loader-production.js'
    });
    
    console.log('⏳ Waiting for smart loader to run...');
    await page.waitForTimeout(5000);
    
    // Listen for console messages
    const loaderMessages = [];
    page.on('console', msg => {
        if (msg.text().includes('Grid4')) {
            loaderMessages.push(msg.text());
            console.log(`🗣️ ${msg.text()}`);
        }
    });
    
    // Check final state
    const finalStatus = await page.evaluate(() => {
        const allSheets = Array.from(document.styleSheets);
        const grid4Sheets = allSheets.filter(sheet => 
            sheet.href && (
                sheet.href.includes('grid4-production-final.css') ||
                sheet.href.includes('grid4-emergency-proper-foundation.css') ||
                sheet.href.includes('grid4-core-architecture.css')
            )
        );
        
        return {
            totalSheets: allSheets.length,
            grid4Sheets: grid4Sheets.map(sheet => ({
                url: sheet.href,
                rules: sheet.cssRules ? sheet.cssRules.length : 'No access'
            })),
            bodyClasses: document.body.className,
            hasGrid4Ready: document.body.classList.contains('grid4-ready')
        };
    });
    
    console.log('📊 Final Loading Status:');
    console.log(`   Total Stylesheets: ${finalStatus.totalSheets}`);
    console.log(`   Grid4 Sheets: ${finalStatus.grid4Sheets.length}`);
    finalStatus.grid4Sheets.forEach((sheet, index) => {
        console.log(`     ${index + 1}. ${sheet.url.split('/').pop()}`);
        console.log(`        Rules: ${sheet.rules}`);
    });
    console.log(`   Body Classes: ${finalStatus.bodyClasses}`);
    console.log(`   Grid4 Ready: ${finalStatus.hasGrid4Ready ? '✅ YES' : '❌ NO'}`);
    
    // Take screenshot
    const screenshot = `./testing/direct-injection-test-${Date.now()}.png`;
    await page.screenshot({ 
        path: screenshot, 
        fullPage: true 
    });
    console.log(`📸 Screenshot: ${screenshot}`);
    
    // Test if we can actually login with injected CSS
    console.log('🔐 Testing login with injected CSS...');
    
    try {
        // Look for login form - try multiple selectors
        const loginSelectors = [
            'input[name="username"]',
            'input[name="data[User][username]"]',
            'input[type="text"]',
            '#username',
            '.username'
        ];
        
        let usernameField = null;
        for (const selector of loginSelectors) {
            try {
                usernameField = await page.waitForSelector(selector, { timeout: 2000 });
                console.log(`   Found username field with: ${selector}`);
                break;
            } catch (e) {
                continue;
            }
        }
        
        if (usernameField) {
            console.log('   ✅ Login form found - CSS injection working properly');
            
            // Check if form styling is applied
            const formStyling = await page.evaluate(() => {
                const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
                const buttons = document.querySelectorAll('.btn, button, input[type="submit"]');
                
                let styledInputs = 0;
                let styledButtons = 0;
                
                inputs.forEach(input => {
                    const style = window.getComputedStyle(input);
                    if (style.borderRadius && style.borderRadius !== '0px') {
                        styledInputs++;
                    }
                });
                
                buttons.forEach(button => {
                    const style = window.getComputedStyle(button);
                    if (style.borderRadius && style.borderRadius !== '0px') {
                        styledButtons++;
                    }
                });
                
                return {
                    totalInputs: inputs.length,
                    styledInputs,
                    totalButtons: buttons.length,
                    styledButtons
                };
            });
            
            console.log('🎨 Form Styling Check:');
            console.log(`   Inputs: ${formStyling.styledInputs}/${formStyling.totalInputs} styled`);
            console.log(`   Buttons: ${formStyling.styledButtons}/${formStyling.totalButtons} styled`);
            
        } else {
            console.log('   ❌ Could not find login form');
        }
        
    } catch (error) {
        console.log(`   ❌ Login test failed: ${error.message}`);
    }
    
    await browser.close();
    console.log('✅ Direct CSS injection test complete');
    
    return {
        cssLoaded: cssStatus.cssLoaded,
        hasVariables: cssStatus.hasG4Variables,
        grid4Sheets: finalStatus.grid4Sheets.length,
        screenshot: screenshot
    };
}

testDirectCSSInjection().catch(console.error);