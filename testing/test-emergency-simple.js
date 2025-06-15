const { chromium } = require('playwright');
const fs = require('fs');

async function testEmergencyFix() {
    console.log('🚨 EMERGENCY FIX - DIRECT CSS TEST');
    console.log('===================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Loading portal login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('📸 Taking BEFORE screenshot...');
    const beforeScreenshot = `./testing/before-emergency-${Date.now()}.png`;
    await page.screenshot({ 
        path: beforeScreenshot, 
        fullPage: true 
    });
    console.log(`   BEFORE: ${beforeScreenshot}`);
    
    console.log('🚨 Injecting emergency CSS directly...');
    
    // Read the emergency CSS file and inject it directly
    const emergencyCSS = fs.readFileSync('./grid4-emergency-fix.css', 'utf8');
    
    await page.addStyleTag({
        content: emergencyCSS
    });
    
    console.log('✅ Emergency CSS injected');
    
    console.log('⏳ Waiting for styles to apply...');
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking AFTER screenshot...');
    const afterScreenshot = `./testing/after-emergency-${Date.now()}.png`;
    await page.screenshot({ 
        path: afterScreenshot, 
        fullPage: true 
    });
    console.log(`   AFTER: ${afterScreenshot}`);
    
    const validation = await page.evaluate(() => {
        const navigation = document.querySelector('#navigation, #nav-buttons');
        const wrapper = document.querySelector('.wrapper');
        
        return {
            navigationExists: !!navigation,
            navigationPosition: navigation ? getComputedStyle(navigation).position : 'none',
            navigationWidth: navigation ? getComputedStyle(navigation).width : 'none',
            wrapperExists: !!wrapper,
            wrapperMarginLeft: wrapper ? getComputedStyle(wrapper).marginLeft : 'none',
            bodyOverflowX: getComputedStyle(document.body).overflowX
        };
    });
    
    console.log('\\n📊 VALIDATION RESULTS:');
    console.log('   Navigation exists:', validation.navigationExists ? '✅' : '❌');
    console.log('   Navigation position:', validation.navigationPosition);
    console.log('   Navigation width:', validation.navigationWidth);
    console.log('   Wrapper exists:', validation.wrapperExists ? '✅' : '❌');
    console.log('   Wrapper margin-left:', validation.wrapperMarginLeft);
    console.log('   Body overflow-x:', validation.bodyOverflowX);
    
    await browser.close();
    
    console.log('\\n🎯 EMERGENCY TEST COMPLETE');
    console.log(`   BEFORE: ${beforeScreenshot}`);
    console.log(`   AFTER: ${afterScreenshot}`);
    
    return validation;
}

testEmergencyFix().catch(console.error);