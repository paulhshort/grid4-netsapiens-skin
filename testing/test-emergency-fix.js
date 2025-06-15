const { chromium } = require('playwright');

async function testEmergencyFix() {
    console.log('🚨 TESTING EMERGENCY CSS FIX');
    console.log('===============================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Step 1: Loading portal login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('📸 Taking BEFORE screenshot (with production-final.css)...');
    const beforeScreenshot = `./testing/before-emergency-${Date.now()}.png`;
    await page.screenshot({ 
        path: beforeScreenshot, 
        fullPage: true 
    });
    console.log(`   BEFORE: ${beforeScreenshot}`);
    
    console.log('🚨 Step 2: Injecting EMERGENCY CSS FIX...');
    
    // Inject the emergency fix directly
    await page.addStyleTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-emergency-fix.css'
    });
    
    console.log('✅ Emergency CSS injected');
    
    console.log('⏳ Step 3: Waiting for styles to apply...');
    await page.waitForTimeout(3000);
    
    console.log('📸 Taking AFTER screenshot (with emergency fix)...');
    const afterScreenshot = `./testing/after-emergency-${Date.now()}.png`;
    await page.screenshot({ 
        path: afterScreenshot, 
        fullPage: true 
    });
    console.log(`   AFTER: ${afterScreenshot}`);
    
    console.log('🔍 Step 4: Validating emergency fix...');
    
    const validation = await page.evaluate(() => {
        const navigation = document.querySelector('#navigation, #nav-buttons');
        const wrapper = document.querySelector('.wrapper');
        
        return {
            navigationExists: !!navigation,
            navigationPosition: navigation ? getComputedStyle(navigation).position : 'none',
            navigationWidth: navigation ? getComputedStyle(navigation).width : 'none',
            navigationLeft: navigation ? navigation.getBoundingClientRect().left : 'none',
            wrapperExists: !!wrapper,
            wrapperMarginLeft: wrapper ? getComputedStyle(wrapper).marginLeft : 'none',
            wrapperLeft: wrapper ? wrapper.getBoundingClientRect().left : 'none',
            bodyOverflowX: getComputedStyle(document.body).overflowX,
            htmlOverflowX: getComputedStyle(document.documentElement).overflowX
        };
    });
    
    console.log('   Navigation exists:', validation.navigationExists ? '✅' : '❌');
    console.log('   Navigation position:', validation.navigationPosition);
    console.log('   Navigation width:', validation.navigationWidth);
    console.log('   Navigation left:', validation.navigationLeft + 'px');
    console.log('   Wrapper exists:', validation.wrapperExists ? '✅' : '❌');
    console.log('   Wrapper margin-left:', validation.wrapperMarginLeft);
    console.log('   Wrapper left position:', validation.wrapperLeft + 'px');
    console.log('   Body overflow-x:', validation.bodyOverflowX);
    console.log('   HTML overflow-x:', validation.htmlOverflowX);
    
    await browser.close();
    
    console.log('\\n🎯 EMERGENCY TEST COMPLETE');
    console.log('Screenshots taken:');
    console.log(`   BEFORE: ${beforeScreenshot}`);
    console.log(`   AFTER: ${afterScreenshot}`);
    
    const isWorking = validation.navigationExists && 
                     validation.navigationPosition === 'fixed' &&
                     validation.wrapperExists &&
                     validation.bodyOverflowX !== 'hidden';
    
    if (isWorking) {
        console.log('\\n✅ EMERGENCY FIX APPEARS TO WORK');
        console.log('   Ready to replace production-final.css');
    } else {
        console.log('\\n❌ EMERGENCY FIX NEEDS ADJUSTMENT');
    }
    
    return isWorking;
}

testEmergencyFix().catch(console.error);