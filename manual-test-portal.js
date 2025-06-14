const { chromium } = require('playwright');

async function manualPortalTest() {
    console.log('🚀 Manual Portal Test - Smart Loader Verification');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for manual interaction
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    // Enable request/response logging
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('statically')) {
            console.log(`🔗 REQUEST: ${request.method()} ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('statically')) {
            console.log(`✅ RESPONSE: ${response.status()} ${response.url()}`);
        }
    });
    
    try {
        // Test 1: Default portal (should not load Grid4)
        console.log('\n📋 TEST 1: Default Portal (No Grid4)');
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/', {
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        const hasSmartLoader = await page.evaluate(() => {
            return typeof window.Grid4SmartLoader !== 'undefined';
        });
        console.log(`🎯 Smart Loader Present: ${hasSmartLoader}`);
        
        const bodyClass = await page.evaluate(() => document.body.className);
        console.log(`🏷️ Body Classes: ${bodyClass}`);
        
        // Take screenshot
        await page.screenshot({ 
            path: './test-screenshots/manual-test-default.png',
            fullPage: true 
        });
        
        // Test 2: With v1 parameter (should load Grid4 v1.0.5)
        console.log('\n📋 TEST 2: Portal with ?grid4_version=v1-stable');
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/?grid4_version=v1-stable', {
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(3000);
        
        const hasSmartLoaderV1 = await page.evaluate(() => {
            return typeof window.Grid4SmartLoader !== 'undefined';
        });
        console.log(`🎯 Smart Loader Present: ${hasSmartLoaderV1}`);
        
        const currentVersion = await page.evaluate(() => {
            return window.Grid4SmartLoader ? window.Grid4SmartLoader.currentVersion : 'Not detected';
        });
        console.log(`🏷️ Current Version: ${currentVersion}`);
        
        const bodyClassV1 = await page.evaluate(() => document.body.className);
        console.log(`🏷️ Body Classes: ${bodyClassV1}`);
        
        // Check if CSS is loaded
        const cssLoaded = await page.evaluate(() => {
            return document.querySelectorAll('link[href*="grid4"]').length > 0 ||
                   document.querySelectorAll('style[data-grid4]').length > 0;
        });
        console.log(`🎨 Grid4 CSS Loaded: ${cssLoaded}`);
        
        // Take screenshot
        await page.screenshot({ 
            path: './test-screenshots/manual-test-v1-stable.png',
            fullPage: true 
        });
        
        // Test 3: Try to login manually and test inside portal
        console.log('\n📋 TEST 3: Manual Login Instructions');
        console.log('🔐 CREDENTIALS: 1002@grid4voice / hQAFMdWXKNj4wAg');
        console.log('⏰ Waiting 30 seconds for manual login...');
        console.log('📝 Please login manually and navigate around the portal');
        console.log('🎯 Look for Grid4 styling, sidebar transformation, dark theme');
        
        // Wait for manual login
        await page.waitForTimeout(30000);
        
        // Check if we're logged in
        const isLoggedIn = await page.evaluate(() => {
            return document.querySelector('#navigation') !== null ||
                   document.querySelector('.nav-buttons') !== null ||
                   window.location.href.includes('/portal/home') ||
                   window.location.href.includes('/portal/users');
        });
        
        if (isLoggedIn) {
            console.log('✅ Login detected! Taking post-login screenshots...');
            
            const postLoginBodyClass = await page.evaluate(() => document.body.className);
            console.log(`🏷️ Post-Login Body Classes: ${postLoginBodyClass}`);
            
            const navigationExists = await page.evaluate(() => {
                return document.querySelector('#navigation') !== null;
            });
            console.log(`🧭 Navigation Found: ${navigationExists}`);
            
            const grid4Active = await page.evaluate(() => {
                return document.body.classList.contains('grid4-emergency-active');
            });
            console.log(`🎨 Grid4 Theme Active: ${grid4Active}`);
            
            // Take final screenshot
            await page.screenshot({ 
                path: './test-screenshots/manual-test-logged-in.png',
                fullPage: true 
            });
            
            console.log('📸 Screenshots saved to ./test-screenshots/');
        } else {
            console.log('⚠️ No login detected, test continuing anyway...');
        }
        
        console.log('\n🔍 MANUAL TESTING NOTES:');
        console.log('• Check if sidebar is vertical and dark themed');
        console.log('• Look for white content panels that should be dark');
        console.log('• Verify navigation buttons have modern rounded corners');
        console.log('• Test hover effects on navigation items');
        console.log('• Check form elements are dark themed');
        console.log('• Verify tables have dark styling with hover effects');
        
        // Keep browser open for manual inspection
        console.log('\n⏳ Keeping browser open for manual inspection...');
        console.log('🔍 Inspect the portal manually, then close browser to continue');
        
        // Wait for user to close browser
        await page.waitForTimeout(120000); // 2 minutes
        
    } catch (error) {
        console.error('❌ Manual test error:', error.message);
    } finally {
        await browser.close();
    }
}

// Run the test
manualPortalTest();