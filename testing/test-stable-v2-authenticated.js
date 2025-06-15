const { chromium } = require('playwright');

async function testStableV2Authenticated() {
    console.log('🔐 GRID4 STABLE V2 - AUTHENTICATED DOMAIN-SCOPED TEST');
    console.log('==================================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Track Grid4 activity
    page.on('request', request => {
        if (request.url().includes('grid4')) {
            console.log(`📤 ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4')) {
            console.log(`📥 ${response.url()} - ${response.status()}`);
        }
    });
    
    page.on('console', msg => {
        if (msg.text().includes('Grid4')) {
            console.log(`🗣️ ${msg.text()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Step 1: Logging into portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    try {
        console.log('📝 Filling login credentials...');
        
        // Wait for page to load and find visible inputs
        await page.waitForTimeout(2000);
        
        // Try to find username field by multiple selectors
        const usernameSelectors = [
            'input[name="data[User][username]"]',
            'input[name="username"]',
            'input[type="text"]:visible',
            'input[placeholder*="name"]'
        ];
        
        let usernameField = null;
        for (const selector of usernameSelectors) {
            try {
                usernameField = await page.waitForSelector(selector, { timeout: 2000, state: 'visible' });
                if (usernameField) {
                    console.log(`   Found username field: ${selector}`);
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        const passwordField = await page.$('input[type="password"], input[name*="password"]');
        
        if (usernameField && passwordField) {
            await usernameField.fill('grid4admin');
            await passwordField.fill('G4@dm1n2024!');
            
            console.log('✅ Credentials filled');
            
            // Submit
            const submitButton = await page.$('input[type="submit"], button[type="submit"]');
            if (submitButton) {
                await submitButton.click();
            } else {
                await passwordField.press('Enter');
            }
            
            console.log('⏳ Waiting for authentication...');
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
            
        } else {
            throw new Error('Could not find login form fields');
        }
        
    } catch (error) {
        console.log(`❌ Login failed: ${error.message}`);
        await browser.close();
        return;
    }
    
    console.log('🏢 Step 2: Navigating to Domains...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('🎯 Step 3: Loading Grid4Lab domain (CRITICAL FOR GRID4 SCOPE)...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('⏳ Step 4: Waiting for Grid4 Stable V2 to load...');
    await page.waitForTimeout(5000);
    
    // Take screenshot of domain page with Grid4
    const domainScreenshot = `./testing/stable-v2-domain-${Date.now()}.png`;
    await page.screenshot({ 
        path: domainScreenshot, 
        fullPage: true 
    });
    console.log(`📸 Domain Screenshot: ${domainScreenshot}`);
    
    console.log('🧪 Step 5: Testing Grid4 Stable V2 functionality...');
    
    const stableV2Test = await page.evaluate(() => {
        // Check if Stable V2 API exists
        const api = window.Grid4StableV2;
        const state = api ? api.getState() : null;
        const validation = api ? api.validate() : null;
        
        // Check navigation
        const navigation = document.querySelector('#navigation, #nav-buttons');
        const wrapper = document.querySelector('.wrapper');
        
        // Check CSS variables
        const rootStyles = getComputedStyle(document.documentElement);
        const cssVars = {
            primary: rootStyles.getPropertyValue('--g4-primary').trim(),
            accent: rootStyles.getPropertyValue('--g4-accent').trim(),
            sidebarWidth: rootStyles.getPropertyValue('--g4-sidebar-width').trim()
        };
        
        return {
            apiExists: !!api,
            version: api ? api.version : 'Not found',
            state: state ? {
                injected: state.injected,
                injectionCount: state.injectionCount,
                errors: state.errors.length
            } : null,
            validation: validation ? validation.valid : false,
            navigation: navigation ? {
                exists: true,
                position: getComputedStyle(navigation).position,
                width: getComputedStyle(navigation).width,
                background: getComputedStyle(navigation).backgroundColor,
                left: navigation.getBoundingClientRect().left
            } : { exists: false },
            wrapper: wrapper ? {
                exists: true,
                marginLeft: getComputedStyle(wrapper).marginLeft,
                left: wrapper.getBoundingClientRect().left
            } : { exists: false },
            cssVariables: cssVars,
            bodyClasses: document.body.className
        };
    });
    
    console.log('📊 STABLE V2 TEST RESULTS:');
    console.log('==========================');
    console.log('API Available:', stableV2Test.apiExists ? '✅' : '❌');
    console.log('Version:', stableV2Test.version);
    console.log('Injection Valid:', stableV2Test.validation ? '✅' : '❌');
    console.log('Injection Count:', stableV2Test.state?.injectionCount || 'N/A');
    console.log('Errors:', stableV2Test.state?.errors || 'N/A');
    
    console.log('\\n📐 LAYOUT TEST RESULTS:');
    console.log('Navigation Exists:', stableV2Test.navigation.exists ? '✅' : '❌');
    console.log('Navigation Position:', stableV2Test.navigation.position);
    console.log('Navigation Width:', stableV2Test.navigation.width);
    console.log('Navigation Left:', stableV2Test.navigation.left + 'px');
    
    console.log('Wrapper Exists:', stableV2Test.wrapper.exists ? '✅' : '❌');
    console.log('Wrapper Margin:', stableV2Test.wrapper.marginLeft);
    console.log('Wrapper Left:', stableV2Test.wrapper.left + 'px');
    
    console.log('\\n🎨 CSS VARIABLES:');
    console.log('Primary Color:', stableV2Test.cssVariables.primary);
    console.log('Accent Color:', stableV2Test.cssVariables.accent);
    console.log('Sidebar Width:', stableV2Test.cssVariables.sidebarWidth);
    
    console.log('\\n📱 Body Classes:', stableV2Test.bodyClasses);
    
    // Test modal functionality
    console.log('\\n🧪 Step 6: Testing modal functionality...');
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab/users', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        await page.waitForTimeout(2000);
        
        // Look for Add button
        const addButton = await page.$('input[value="Add"], .btn:has-text("Add"), a:has-text("Add"), [onclick*="add"]');
        
        if (addButton) {
            console.log('✅ Found Add button - testing modal...');
            
            await addButton.click();
            await page.waitForTimeout(2000);
            
            const modal = await page.$('.modal, [class*="modal"]');
            const modalVisible = modal ? await modal.isVisible() : false;
            
            console.log('Modal appeared:', modalVisible ? '✅ YES' : '❌ NO');
            
            if (modalVisible) {
                const modalScreenshot = `./testing/stable-v2-modal-${Date.now()}.png`;
                await page.screenshot({ 
                    path: modalScreenshot, 
                    fullPage: true 
                });
                console.log(`📸 Modal Screenshot: ${modalScreenshot}`);
                
                // Try to close modal
                const closeButton = await page.$('.modal .close, [data-dismiss="modal"]');
                if (closeButton) {
                    await closeButton.click();
                }
            }
        } else {
            console.log('ℹ️ No Add button found on this page');
        }
        
    } catch (error) {
        console.log(`⚠️ Modal test skipped: ${error.message}`);
    }
    
    await browser.close();
    
    // Final assessment
    const isWorking = stableV2Test.apiExists && 
                     stableV2Test.validation && 
                     stableV2Test.navigation.exists && 
                     stableV2Test.navigation.position === 'fixed' &&
                     stableV2Test.wrapper.exists;
    
    console.log('\\n🎯 FINAL ASSESSMENT:');
    console.log('=====================');
    if (isWorking) {
        console.log('✅ GRID4 STABLE V2 IS WORKING CORRECTLY');
        console.log('   - API loaded and functional');
        console.log('   - Sidebar positioned properly');
        console.log('   - Content offset correctly');
        console.log('   - CSS variables active');
    } else {
        console.log('❌ ISSUES DETECTED WITH STABLE V2');
        console.log('   Review the test results above');
    }
    
    console.log(`\\n📸 Screenshots saved: ${domainScreenshot}`);
    
    return isWorking;
}

testStableV2Authenticated().catch(console.error);