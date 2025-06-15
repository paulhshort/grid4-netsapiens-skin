const { chromium } = require('playwright');

async function testStableV2Comprehensive() {
    console.log('🧪 COMPREHENSIVE GRID4 STABLE V2 TESTING');
    console.log('=======================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Performance tracking
    const performanceMetrics = {
        injectionCount: 0,
        consoleErrors: [],
        networkErrors: [],
        injectionTimes: [],
        pageLoadTime: 0
    };
    
    // Track Grid4 activity
    page.on('request', request => {
        if (request.url().includes('grid4')) {
            console.log(`📤 ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4')) {
            console.log(`📥 ${response.url()} - ${response.status()}`);
            if (response.status() >= 400) {
                performanceMetrics.networkErrors.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        }
    });
    
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Grid4')) {
            console.log(`🗣️ ${text}`);
            
            // Track injection count
            if (text.includes('Starting injection #')) {
                performanceMetrics.injectionCount++;
            }
            
            // Track injection times
            const timeMatch = text.match(/(\d+)ms\)/);
            if (timeMatch) {
                performanceMetrics.injectionTimes.push(parseInt(timeMatch[1]));
            }
        }
        
        // Track console errors
        if (msg.type() === 'error') {
            performanceMetrics.consoleErrors.push(text);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔗 Loading portal with Stable V2...');
    const startTime = Date.now();
    
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('💉 Injecting Grid4 Stable V2...');
    await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-stable-v2.js'
    });
    
    console.log('⏳ Waiting for stable injection...');
    await page.waitForTimeout(3000);
    
    performanceMetrics.pageLoadTime = Date.now() - startTime;
    
    // Test 1: Basic Injection Validation
    console.log('\n🧪 TEST 1: BASIC INJECTION VALIDATION');
    const basicValidation = await page.evaluate(() => {
        if (!window.Grid4StableV2) {
            return { error: 'Grid4StableV2 API not found' };
        }
        
        const validation = window.Grid4StableV2.validate();
        const state = window.Grid4StableV2.getState();
        
        return {
            apiExists: !!window.Grid4StableV2,
            version: window.Grid4StableV2.version,
            validation,
            state: {
                injected: state.injected,
                injectionCount: state.injectionCount,
                maxInjections: state.maxInjections,
                errors: state.errors
            }
        };
    });
    
    console.log('   API Available:', basicValidation.apiExists ? '✅' : '❌');
    console.log('   Version:', basicValidation.version);
    console.log('   Injection Valid:', basicValidation.validation?.valid ? '✅' : '❌');
    console.log('   Injection Count:', basicValidation.state?.injectionCount || 0);
    console.log('   Errors:', basicValidation.state?.errors?.length || 0);
    
    // Test 2: Content Area Visibility
    console.log('\n🧪 TEST 2: CONTENT AREA VISIBILITY');
    const contentTest = await page.evaluate(() => {
        const wrapper = document.querySelector('.wrapper');
        const content = document.querySelector('#content');
        const navigation = document.querySelector('#navigation, #nav-buttons');
        
        return {
            wrapperExists: !!wrapper,
            wrapperVisible: wrapper ? wrapper.offsetHeight > 0 : false,
            wrapperStyle: wrapper ? {
                marginLeft: getComputedStyle(wrapper).marginLeft,
                display: getComputedStyle(wrapper).display,
                visibility: getComputedStyle(wrapper).visibility,
                height: wrapper.offsetHeight
            } : null,
            contentExists: !!content,
            contentVisible: content ? content.offsetHeight > 0 : false,
            navigationExists: !!navigation,
            navigationPositioned: navigation ? getComputedStyle(navigation).position === 'fixed' : false,
            bodyHasGrid4Class: document.body.classList.contains('grid4-active')
        };
    });
    
    console.log('   Wrapper Exists:', contentTest.wrapperExists ? '✅' : '❌');
    console.log('   Wrapper Visible:', contentTest.wrapperVisible ? '✅' : '❌');
    console.log('   Wrapper Height:', contentTest.wrapperStyle?.height || 'N/A');
    console.log('   Wrapper Margin:', contentTest.wrapperStyle?.marginLeft || 'N/A');
    console.log('   Navigation Fixed:', contentTest.navigationPositioned ? '✅' : '❌');
    console.log('   Body Class Active:', contentTest.bodyHasGrid4Class ? '✅' : '❌');
    
    // Test 3: Performance Monitoring
    console.log('\\n🧪 TEST 3: PERFORMANCE MONITORING');
    
    // Wait and monitor for infinite loops
    console.log('   Monitoring for infinite loops (10 seconds)...');
    const initialInjectionCount = performanceMetrics.injectionCount;
    await page.waitForTimeout(10000);
    const finalInjectionCount = performanceMetrics.injectionCount;
    
    const injectionDelta = finalInjectionCount - initialInjectionCount;
    
    console.log('   Initial Injections:', initialInjectionCount);
    console.log('   Final Injections:', finalInjectionCount);
    console.log('   Injection Delta:', injectionDelta);
    console.log('   Infinite Loop Test:', injectionDelta <= 2 ? '✅ PASS' : '❌ FAIL');
    console.log('   Average Injection Time:', performanceMetrics.injectionTimes.length > 0 ? 
        Math.round(performanceMetrics.injectionTimes.reduce((a, b) => a + b, 0) / performanceMetrics.injectionTimes.length) + 'ms' : 'N/A');
    
    // Test 4: CSS Validation
    console.log('\\n🧪 TEST 4: CSS VALIDATION');
    const cssValidation = await page.evaluate(() => {
        const style = document.querySelector('style[id^="grid4-stable-v2"]');
        const cssVariables = getComputedStyle(document.documentElement);
        
        return {
            styleElementExists: !!style,
            styleLength: style ? style.textContent.length : 0,
            cssVariables: {
                primary: cssVariables.getPropertyValue('--g4-primary').trim(),
                accent: cssVariables.getPropertyValue('--g4-accent').trim(),
                sidebarWidth: cssVariables.getPropertyValue('--g4-sidebar-width').trim()
            }
        };
    });
    
    console.log('   Style Element:', cssValidation.styleElementExists ? '✅' : '❌');
    console.log('   Style Length:', cssValidation.styleLength + ' chars');
    console.log('   CSS Variables:', cssValidation.cssVariables.primary ? '✅' : '❌');
    console.log('   Primary Color:', cssValidation.cssVariables.primary);
    console.log('   Sidebar Width:', cssValidation.cssVariables.sidebarWidth);
    
    // Test 5: Form and Button Styling
    console.log('\\n🧪 TEST 5: FORM AND BUTTON STYLING');
    const stylingTest = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        const buttons = document.querySelectorAll('.btn, button');
        
        let styledInputs = 0;
        let styledButtons = 0;
        
        inputs.forEach(input => {
            const style = getComputedStyle(input);
            if (style.borderRadius !== '0px') styledInputs++;
        });
        
        buttons.forEach(button => {
            const style = getComputedStyle(button);
            if (style.borderRadius !== '0px') styledButtons++;
        });
        
        return {
            totalInputs: inputs.length,
            styledInputs,
            totalButtons: buttons.length,
            styledButtons
        };
    });
    
    console.log('   Inputs Styled:', `${stylingTest.styledInputs}/${stylingTest.totalInputs}`);
    console.log('   Buttons Styled:', `${stylingTest.styledButtons}/${stylingTest.totalButtons}`);
    
    // Take comprehensive screenshots
    const timestamp = Date.now();
    
    const loginScreenshot = `./testing/stable-v2-login-${timestamp}.png`;
    await page.screenshot({ 
        path: loginScreenshot, 
        fullPage: true 
    });
    console.log(`\\n📸 Login Screenshot: ${loginScreenshot}`);
    
    // Test 6: Recovery System
    console.log('\\n🧪 TEST 6: RECOVERY SYSTEM TEST');
    const recoveryTest = await page.evaluate(() => {
        if (!window.Grid4StableV2) return { error: 'API not available' };
        
        // Test the revert function
        window.Grid4StableV2.revert();
        
        setTimeout(() => {
            // Check if minimal recovery was applied
            const minimalStyle = document.querySelector('style[id="grid4-minimal-recovery"]');
            return {
                minimalStyleExists: !!minimalStyle,
                minimalStyleLength: minimalStyle ? minimalStyle.textContent.length : 0
            };
        }, 1000);
        
        return { triggered: true };
    });
    
    await page.waitForTimeout(1500);
    
    const recoveryValidation = await page.evaluate(() => {
        const minimalStyle = document.querySelector('style[id="grid4-minimal-recovery"]');
        return {
            minimalStyleExists: !!minimalStyle,
            minimalStyleLength: minimalStyle ? minimalStyle.textContent.length : 0
        };
    });
    
    console.log('   Recovery Triggered:', recoveryTest.triggered ? '✅' : '❌');
    console.log('   Minimal Style Applied:', recoveryValidation.minimalStyleExists ? '✅' : '❌');
    
    // Final Performance Summary
    console.log('\\n📊 PERFORMANCE SUMMARY');
    console.log('=======================');
    console.log('   Page Load Time:', performanceMetrics.pageLoadTime + 'ms');
    console.log('   Total Injections:', performanceMetrics.injectionCount);
    console.log('   Console Errors:', performanceMetrics.consoleErrors.length);
    console.log('   Network Errors:', performanceMetrics.networkErrors.length);
    console.log('   Infinite Loop Prevention:', injectionDelta <= 2 ? '✅ WORKING' : '❌ FAILED');
    
    if (performanceMetrics.consoleErrors.length > 0) {
        console.log('\\n❌ Console Errors:');
        performanceMetrics.consoleErrors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    }
    
    if (performanceMetrics.networkErrors.length > 0) {
        console.log('\\n❌ Network Errors:');
        performanceMetrics.networkErrors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error.url} - ${error.status}`);
        });
    }
    
    await browser.close();
    
    // Overall Test Results
    const overallResults = {
        apiWorking: basicValidation.apiExists && basicValidation.validation?.valid,
        contentVisible: contentTest.wrapperVisible && contentTest.navigationPositioned,
        performanceGood: injectionDelta <= 2 && performanceMetrics.pageLoadTime < 10000,
        cssWorking: cssValidation.styleElementExists && cssValidation.cssVariables.primary,
        stylingApplied: stylingTest.styledInputs > 0 || stylingTest.styledButtons > 0,
        recoveryWorking: recoveryValidation.minimalStyleExists
    };
    
    const passedTests = Object.values(overallResults).filter(Boolean).length;
    const totalTests = Object.keys(overallResults).length;
    
    console.log('\\n🎯 OVERALL TEST RESULTS');
    console.log('========================');
    console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`   Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    Object.entries(overallResults).forEach(([test, passed]) => {
        console.log(`   ${test}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    if (passedTests === totalTests) {
        console.log('\\n🎉 ALL TESTS PASSED - STABLE V2 READY FOR DEPLOYMENT');
    } else {
        console.log('\\n⚠️ SOME TESTS FAILED - REVIEW REQUIRED BEFORE DEPLOYMENT');
    }
    
    return {
        results: overallResults,
        metrics: performanceMetrics,
        passRate: (passedTests/totalTests) * 100,
        screenshot: loginScreenshot
    };
}

testStableV2Comprehensive().catch(console.error);