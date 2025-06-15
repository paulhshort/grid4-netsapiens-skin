const { chromium } = require('playwright');

async function testNuclearSolution() {
    console.log('💥 TESTING NUCLEAR SOLUTION');
    console.log('===========================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Track Grid4 activity
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('nuclear')) {
            console.log(`📤 ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('nuclear')) {
            console.log(`📥 ${response.url()} - ${response.status()}`);
        }
    });
    
    page.on('console', msg => {
        if (msg.text().includes('Grid4') || msg.text().includes('NUCLEAR')) {
            console.log(`🗣️ ${msg.text()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔗 Loading portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('💉 Injecting Nuclear Loader directly...');
    await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-nuclear-loader.js'
    });
    
    console.log('⏳ Waiting for nuclear injection...');
    await page.waitForTimeout(3000);
    
    // Check if nuclear CSS was injected
    const nuclearStatus = await page.evaluate(() => {
        const nuclearStyle = document.getElementById('grid4-nuclear-css');
        const nuclearAPI = window.Grid4Nuclear;
        
        // Check CSS variables
        const rootStyles = window.getComputedStyle(document.documentElement);
        const g4Primary = rootStyles.getPropertyValue('--g4-primary').trim();
        const g4SidebarWidth = rootStyles.getPropertyValue('--g4-sidebar-width').trim();
        
        return {
            nuclearStyleExists: !!nuclearStyle,
            nuclearStyleLength: nuclearStyle ? nuclearStyle.textContent.length : 0,
            nuclearAPIExists: !!nuclearAPI,
            nuclearAPIVersion: nuclearAPI ? nuclearAPI.version : 'Not found',
            hasG4Variables: !!(g4Primary && g4SidebarWidth),
            g4Primary,
            g4SidebarWidth
        };
    });
    
    console.log('💥 Nuclear Status:');
    console.log(`   Nuclear Style Injected: ${nuclearStatus.nuclearStyleExists ? '✅ YES' : '❌ NO'}`);
    console.log(`   Nuclear Style Size: ${nuclearStatus.nuclearStyleLength} characters`);
    console.log(`   Nuclear API Available: ${nuclearStatus.nuclearAPIExists ? '✅ YES' : '❌ NO'}`);
    console.log(`   Nuclear API Version: ${nuclearStatus.nuclearAPIVersion}`);
    console.log(`   CSS Variables Working: ${nuclearStatus.hasG4Variables ? '✅ YES' : '❌ NO'}`);
    console.log(`   --g4-primary: ${nuclearStatus.g4Primary}`);
    console.log(`   --g4-sidebar-width: ${nuclearStatus.g4SidebarWidth}`);
    
    // Check if forms are styled
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
            styledButtons,
            bodyClasses: document.body.className
        };
    });
    
    console.log('🎨 Form Styling Check:');
    console.log(`   Inputs: ${formStyling.styledInputs}/${formStyling.totalInputs} styled`);
    console.log(`   Buttons: ${formStyling.styledButtons}/${formStyling.totalButtons} styled`);
    console.log(`   Body Classes: ${formStyling.bodyClasses}`);
    
    // Test nuclear re-injection
    console.log('🔄 Testing nuclear re-injection...');
    const reinjectResult = await page.evaluate(() => {
        if (window.Grid4Nuclear && window.Grid4Nuclear.reinject) {
            window.Grid4Nuclear.reinject();
            return true;
        }
        return false;
    });
    
    console.log(`   Re-injection: ${reinjectResult ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    // Take screenshot
    const screenshot = `./testing/nuclear-test-${Date.now()}.png`;
    await page.screenshot({ 
        path: screenshot, 
        fullPage: true 
    });
    console.log(`📸 Screenshot: ${screenshot}`);
    
    // Test smart loader compatibility
    console.log('🚀 Testing Smart Loader with Nuclear Mode...');
    await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-smart-loader-production.js'
    });
    
    await page.waitForTimeout(3000);
    
    // Check final state
    const finalState = await page.evaluate(() => {
        const allStyles = document.querySelectorAll('style[id*="grid4"], link[href*="grid4"]');
        const scripts = document.querySelectorAll('script[src*="grid4"]');
        
        return {
            totalGrid4Styles: allStyles.length,
            totalGrid4Scripts: scripts.length,
            nuclearStillActive: !!window.Grid4Nuclear,
            bodyHasGrid4: document.body.className.includes('grid4')
        };
    });
    
    console.log('📊 Final State:');
    console.log(`   Total Grid4 Styles: ${finalState.totalGrid4Styles}`);
    console.log(`   Total Grid4 Scripts: ${finalState.totalGrid4Scripts}`);
    console.log(`   Nuclear Still Active: ${finalState.nuclearStillActive ? '✅ YES' : '❌ NO'}`);
    console.log(`   Body Has Grid4 Classes: ${finalState.bodyHasGrid4 ? '✅ YES' : '❌ NO'}`);
    
    await browser.close();
    console.log('✅ Nuclear solution test complete');
    
    return {
        nuclear: nuclearStatus.nuclearStyleExists,
        variables: nuclearStatus.hasG4Variables,
        styling: formStyling.styledInputs > 0 || formStyling.styledButtons > 0,
        screenshot: screenshot
    };
}

testNuclearSolution().catch(console.error);