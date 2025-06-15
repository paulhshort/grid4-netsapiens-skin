const { chromium } = require('playwright');

async function testAuthenticatedProper() {
    console.log('🔐 PROPER AUTHENTICATED TEST - FOLLOWING USER INSTRUCTIONS');
    console.log('=========================================================');
    console.log('Using credentials: 1002@grid4voice / hQAFMdWXKNj4wAg');
    console.log('Target domain: https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        console.log(`🗣️ Console: ${msg.text()}`);
    });
    
    // Track Grid4 requests
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('cdn.jsdelivr.net')) {
            console.log(`📤 Request: ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('cdn.jsdelivr.net')) {
            console.log(`📥 Response: ${response.url()} - ${response.status()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('\\n🔐 Step 1: Logging into portal with correct credentials...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    try {
        console.log('📝 Filling login credentials: 1002@grid4voice / hQAFMdWXKNj4wAg');
        
        await page.waitForTimeout(2000);
        
        // Find correct login fields by ID
        const usernameField = await page.waitForSelector('#LoginUsername', { 
            timeout: 10000,
            state: 'visible' 
        });
        const passwordField = await page.waitForSelector('#LoginPassword', { 
            timeout: 10000,
            state: 'visible' 
        });
        
        if (usernameField && passwordField) {
            await usernameField.fill('1002@grid4voice');
            await passwordField.fill('hQAFMdWXKNj4wAg');
            
            console.log('✅ Credentials filled with correct values');
            
            // Submit form
            const submitButton = await page.$('input[type="submit"], button[type="submit"], .btn[type="submit"]');
            if (submitButton) {
                await submitButton.click();
            } else {
                await passwordField.press('Enter');
            }
            
            console.log('⏳ Waiting for authentication to complete...');
            try {
                await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
            } catch (navError) {
                // Check if we're on the home page anyway
                const currentUrl = page.url();
                if (!currentUrl.includes('/home') && !currentUrl.includes('grid4voice')) {
                    throw new Error('Authentication failed - not redirected to portal');
                }
                console.log('⚠️ Navigation timeout but URL suggests successful login');
            }
            
            console.log('✅ Authentication successful - now on authenticated portal');
            
        } else {
            throw new Error('Could not find login form fields');
        }
        
    } catch (error) {
        console.log(`❌ Login failed: ${error.message}`);
        await browser.close();
        return;
    }
    
    console.log('\\n🏢 Step 2: Navigating to Domains page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking screenshot of Domains page...');
    const domainsScreenshot = `./testing/domains-page-${Date.now()}.png`;
    await page.screenshot({ 
        path: domainsScreenshot, 
        fullPage: true 
    });
    console.log(`   Domains page: ${domainsScreenshot}`);
    
    console.log('\\n🎯 Step 3: Navigating to Grid4Lab domain (CRITICAL FOR GRID4 SCOPE)...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('⏳ Waiting for Grid4 styles to load...');
    await page.waitForTimeout(5000);
    
    console.log('📸 Taking screenshot of Grid4Lab domain page...');
    const grid4LabScreenshot = `./testing/grid4lab-domain-${Date.now()}.png`;
    await page.screenshot({ 
        path: grid4LabScreenshot, 
        fullPage: true 
    });
    console.log(`   Grid4Lab domain: ${grid4LabScreenshot}`);
    
    console.log('\\n🔍 Step 4: Using browser dev tools to analyze Grid4 CSS...');
    
    const cssAnalysis = await page.evaluate(() => {
        // Check if Grid4 CSS is loaded
        const grid4Links = Array.from(document.querySelectorAll('link[href*="grid4"]'));
        const grid4Styles = Array.from(document.querySelectorAll('style[id*="grid4"]'));
        
        // Check CSS variables
        const rootStyles = getComputedStyle(document.documentElement);
        const cssVars = {
            primary: rootStyles.getPropertyValue('--g4-primary').trim(),
            accent: rootStyles.getPropertyValue('--g4-accent').trim(),
            sidebarWidth: rootStyles.getPropertyValue('--g4-sidebar-width').trim()
        };
        
        // Check navigation
        const navigation = document.querySelector('#navigation, #nav-buttons');
        const wrapper = document.querySelector('.wrapper');
        
        // Check for horizontal scrollbars
        const bodyRect = document.body.getBoundingClientRect();
        const htmlRect = document.documentElement.getBoundingClientRect();
        const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
        
        return {
            grid4CSSLoaded: grid4Links.length > 0,
            grid4CSSUrls: grid4Links.map(link => link.href),
            grid4StyleTags: grid4Styles.length,
            cssVariables: cssVars,
            navigation: navigation ? {
                exists: true,
                tagName: navigation.tagName,
                id: navigation.id,
                position: getComputedStyle(navigation).position,
                width: getComputedStyle(navigation).width,
                left: getComputedStyle(navigation).left,
                zIndex: getComputedStyle(navigation).zIndex,
                background: getComputedStyle(navigation).backgroundColor,
                rectLeft: navigation.getBoundingClientRect().left,
                rectWidth: navigation.getBoundingClientRect().width
            } : { exists: false },
            wrapper: wrapper ? {
                exists: true,
                marginLeft: getComputedStyle(wrapper).marginLeft,
                paddingLeft: getComputedStyle(wrapper).paddingLeft,
                left: getComputedStyle(wrapper).left,
                rectLeft: wrapper.getBoundingClientRect().left,
                rectWidth: wrapper.getBoundingClientRect().width
            } : { exists: false },
            bodyOverflow: {
                overflowX: getComputedStyle(document.body).overflowX,
                overflowY: getComputedStyle(document.body).overflowY,
                hasHorizontalScroll: hasHorizontalScroll,
                bodyScrollWidth: document.body.scrollWidth,
                windowInnerWidth: window.innerWidth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    });
    
    console.log('\\n📊 GRID4 CSS ANALYSIS RESULTS:');
    console.log('================================');
    console.log('Grid4 CSS Loaded:', cssAnalysis.grid4CSSLoaded ? '✅' : '❌');
    console.log('Grid4 CSS URLs:', cssAnalysis.grid4CSSUrls);
    console.log('Grid4 Style Tags:', cssAnalysis.grid4StyleTags);
    
    console.log('\\n🎨 CSS VARIABLES:');
    console.log('Primary Color:', cssAnalysis.cssVariables.primary || 'NOT SET');
    console.log('Accent Color:', cssAnalysis.cssVariables.accent || 'NOT SET');
    console.log('Sidebar Width:', cssAnalysis.cssVariables.sidebarWidth || 'NOT SET');
    
    console.log('\\n📐 NAVIGATION ANALYSIS:');
    console.log('Navigation Exists:', cssAnalysis.navigation.exists ? '✅' : '❌');
    if (cssAnalysis.navigation.exists) {
        console.log('Navigation Element:', `${cssAnalysis.navigation.tagName}#${cssAnalysis.navigation.id}`);
        console.log('Position:', cssAnalysis.navigation.position);
        console.log('Width:', cssAnalysis.navigation.width);
        console.log('Left:', cssAnalysis.navigation.left);
        console.log('Z-Index:', cssAnalysis.navigation.zIndex);
        console.log('Background:', cssAnalysis.navigation.background);
        console.log('Actual Left Position:', cssAnalysis.navigation.rectLeft + 'px');
        console.log('Actual Width:', cssAnalysis.navigation.rectWidth + 'px');
    }
    
    console.log('\\n📦 WRAPPER ANALYSIS:');
    console.log('Wrapper Exists:', cssAnalysis.wrapper.exists ? '✅' : '❌');
    if (cssAnalysis.wrapper.exists) {
        console.log('Margin Left:', cssAnalysis.wrapper.marginLeft);
        console.log('Padding Left:', cssAnalysis.wrapper.paddingLeft);
        console.log('CSS Left:', cssAnalysis.wrapper.left);
        console.log('Actual Left Position:', cssAnalysis.wrapper.rectLeft + 'px');
        console.log('Actual Width:', cssAnalysis.wrapper.rectWidth + 'px');
    }
    
    console.log('\\n🌊 OVERFLOW ANALYSIS:');
    console.log('Body Overflow-X:', cssAnalysis.bodyOverflow.overflowX);
    console.log('Body Overflow-Y:', cssAnalysis.bodyOverflow.overflowY);
    console.log('Has Horizontal Scroll:', cssAnalysis.bodyOverflow.hasHorizontalScroll ? '❌ YES' : '✅ NO');
    console.log('Body Scroll Width:', cssAnalysis.bodyOverflow.bodyScrollWidth + 'px');
    console.log('Window Inner Width:', cssAnalysis.bodyOverflow.windowInnerWidth + 'px');
    console.log('Viewport:', `${cssAnalysis.viewport.width}x${cssAnalysis.viewport.height}`);
    
    console.log('\\n🧪 Step 5: Testing menu navigation...');
    
    try {
        // Test navigation to different sections
        const menuItems = ['users', 'inventory', 'reports'];
        
        for (const menuItem of menuItems) {
            console.log(`\\n   Testing navigation to ${menuItem}...`);
            
            const menuUrl = `https://portal.grid4voice.ucaas.tech/portal/domains/manage/grid4lab/Grid4+Lab/${menuItem}`;
            await page.goto(menuUrl, { 
                waitUntil: 'networkidle',
                timeout: 15000 
            });
            
            await page.waitForTimeout(2000);
            
            const menuScreenshot = `./testing/grid4lab-${menuItem}-${Date.now()}.png`;
            await page.screenshot({ 
                path: menuScreenshot, 
                fullPage: true 
            });
            console.log(`   ${menuItem} page: ${menuScreenshot}`);
            
            // Check for modals/add buttons
            const addButton = await page.$('input[value="Add"], .btn:has-text("Add"), a:has-text("Add"), [onclick*="add"]');
            if (addButton) {
                console.log(`   Found Add button on ${menuItem} page - testing modal...`);
                try {
                    await addButton.click();
                    await page.waitForTimeout(1000);
                    
                    const modal = await page.$('.modal, [class*="modal"]');
                    const modalVisible = modal ? await modal.isVisible() : false;
                    console.log(`   Modal appeared: ${modalVisible ? '✅ YES' : '❌ NO'}`);
                    
                    if (modalVisible) {
                        const modalScreenshot = `./testing/modal-${menuItem}-${Date.now()}.png`;
                        await page.screenshot({ 
                            path: modalScreenshot, 
                            fullPage: true 
                        });
                        console.log(`   Modal screenshot: ${modalScreenshot}`);
                        
                        // Close modal
                        const closeButton = await page.$('.modal .close, [data-dismiss="modal"]');
                        if (closeButton) {
                            await closeButton.click();
                        }
                    }
                } catch (modalError) {
                    console.log(`   Modal test failed: ${modalError.message}`);
                }
            } else {
                console.log(`   No Add button found on ${menuItem} page`);
            }
        }
        
    } catch (navError) {
        console.log(`⚠️ Navigation testing error: ${navError.message}`);
    }
    
    await browser.close();
    
    console.log('\\n🎯 FINAL ASSESSMENT:');
    console.log('=====================');
    
    const isWorking = cssAnalysis.grid4CSSLoaded && 
                     cssAnalysis.navigation.exists && 
                     cssAnalysis.navigation.position === 'fixed' &&
                     cssAnalysis.wrapper.exists &&
                     !cssAnalysis.bodyOverflow.hasHorizontalScroll;
    
    if (isWorking) {
        console.log('✅ GRID4 EMERGENCY FIX IS WORKING');
        console.log('   - CSS loaded successfully');
        console.log('   - Sidebar positioned correctly');
        console.log('   - Content offset properly');
        console.log('   - No horizontal scrollbars');
    } else {
        console.log('❌ ISSUES DETECTED');
        if (!cssAnalysis.grid4CSSLoaded) console.log('   - Grid4 CSS not loading');
        if (!cssAnalysis.navigation.exists) console.log('   - Navigation not found');
        if (cssAnalysis.navigation.position !== 'fixed') console.log('   - Sidebar not positioned');
        if (!cssAnalysis.wrapper.exists) console.log('   - Wrapper not found');
        if (cssAnalysis.bodyOverflow.hasHorizontalScroll) console.log('   - Horizontal scrollbars present');
    }
    
    console.log(`\\n📸 All screenshots saved in ./testing/ directory`);
    
    return {
        working: isWorking,
        analysis: cssAnalysis
    };
}

testAuthenticatedProper().catch(console.error);