const { chromium } = require('playwright');

async function testProductionFinalAuthenticated() {
    console.log('🚀 TESTING PRODUCTION FINAL WITH AUTHENTICATION');
    console.log('==============================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Listen to all Grid4-related network activity
    page.on('request', request => {
        if (request.url().includes('grid4') || request.url().includes('jsdelivr')) {
            console.log(`📤 REQUEST: ${request.url()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('grid4') || response.url().includes('jsdelivr')) {
            console.log(`📥 RESPONSE: ${response.url()} - Status: ${response.status()}`);
        }
    });
    
    // Listen to Grid4 console messages
    page.on('console', msg => {
        if (msg.text().includes('Grid4') || msg.text().includes('grid4')) {
            console.log(`🗣️ GRID4: ${msg.text()}`);
        }
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Navigating to login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('📝 Filling login credentials...');
    // Wait for login form
    await page.waitForSelector('input[name="username"], input[name="data[User][username]"]', { timeout: 10000 });
    
    // Fill in credentials
    const usernameField = await page.$('input[name="username"], input[name="data[User][username]"]');
    const passwordField = await page.$('input[name="password"], input[name="data[User][password]"]');
    
    if (usernameField && passwordField) {
        await usernameField.fill('grid4admin');
        await passwordField.fill('G4@dm1n2024!');
        
        // Submit form
        const submitButton = await page.$('input[type="submit"], button[type="submit"], .btn-primary');
        if (submitButton) {
            await submitButton.click();
        } else {
            // Try form submission
            await passwordField.press('Enter');
        }
        
        console.log('⏳ Waiting for login to complete...');
        await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
    } else {
        console.log('❌ Could not find login form fields');
        await browser.close();
        return;
    }
    
    console.log('🏠 Navigating to home page after login...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('⏳ Waiting for Grid4 Production Final to load...');
    await page.waitForTimeout(10000);
    
    // Check CSS loading status
    const cssStatus = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        const grid4Sheet = styleSheets.find(sheet => 
            sheet.href && (
                sheet.href.includes('grid4-production-final.css') ||
                sheet.href.includes('grid4-emergency-proper-foundation.css')
            )
        );
        
        return {
            loaded: !!grid4Sheet,
            url: grid4Sheet ? grid4Sheet.href : 'Not found',
            totalSheets: styleSheets.length,
            allUrls: styleSheets.map(sheet => sheet.href).filter(Boolean)
        };
    });
    
    console.log('🎯 CSS Loading Status:');
    console.log(`   Production Final Loaded: ${cssStatus.loaded ? '✅ YES' : '❌ NO'}`);
    if (cssStatus.loaded) {
        console.log(`   URL: ${cssStatus.url}`);
    }
    console.log(`   Total Stylesheets: ${cssStatus.totalSheets}`);
    
    // Check if nuclear options are removed
    const layoutStatus = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const htmlStyle = window.getComputedStyle(document.documentElement);
        
        return {
            bodyOverflowX: bodyStyle.overflowX,
            htmlOverflowX: htmlStyle.overflowX,
            bodyMaxWidth: bodyStyle.maxWidth,
            hasHorizontalScroll: document.body.scrollWidth > document.body.clientWidth
        };
    });
    
    console.log('🔍 Layout Health Check:');
    console.log(`   Body overflow-x: ${layoutStatus.bodyOverflowX} (should NOT be hidden)`);
    console.log(`   HTML overflow-x: ${layoutStatus.htmlOverflowX} (should NOT be hidden)`);
    console.log(`   Has horizontal scroll: ${layoutStatus.hasHorizontalScroll ? '❌ YES' : '✅ NO'}`);
    
    // Check sidebar positioning
    const sidebarStatus = await page.evaluate(() => {
        const nav = document.querySelector('#navigation, #nav-buttons');
        if (!nav) return { error: 'Navigation not found' };
        
        const style = window.getComputedStyle(nav);
        const rect = nav.getBoundingClientRect();
        
        return {
            position: style.position,
            width: style.width,
            left: style.left,
            backgroundColor: style.backgroundColor,
            actualWidth: Math.round(rect.width),
            actualLeft: Math.round(rect.left),
            isFixed: style.position === 'fixed'
        };
    });
    
    console.log('📐 Sidebar Status:');
    if (sidebarStatus.error) {
        console.log(`   ❌ ${sidebarStatus.error}`);
    } else {
        console.log(`   Position: ${sidebarStatus.position} ${sidebarStatus.isFixed ? '✅' : '❌'}`);
        console.log(`   Width: ${sidebarStatus.width} (target: 220px)`);
        console.log(`   Background: ${sidebarStatus.backgroundColor}`);
        console.log(`   Actual size: ${sidebarStatus.actualWidth}px x ${sidebarStatus.actualLeft}px offset`);
    }
    
    // Check content offset
    const contentStatus = await page.evaluate(() => {
        const content = document.querySelector('.wrapper, #content');
        if (!content) return { error: 'Content wrapper not found' };
        
        const style = window.getComputedStyle(content);
        const rect = content.getBoundingClientRect();
        
        return {
            marginLeft: style.marginLeft,
            actualLeft: Math.round(rect.left),
            backgroundColor: style.backgroundColor
        };
    });
    
    console.log('📄 Content Status:');
    if (contentStatus.error) {
        console.log(`   ❌ ${contentStatus.error}`);
    } else {
        console.log(`   Margin Left: ${contentStatus.marginLeft} (target: 220px)`);
        console.log(`   Actual Left: ${contentStatus.actualLeft}px`);
        console.log(`   Background: ${contentStatus.backgroundColor}`);
    }
    
    // Check for Font Awesome icons
    const iconStatus = await page.evaluate(() => {
        const icons = [];
        const navLinks = document.querySelectorAll('#navigation a, #nav-buttons a');
        
        navLinks.forEach((link, index) => {
            if (index < 5) { // Check first 5 icons
                const beforeStyle = window.getComputedStyle(link, '::before');
                icons.push({
                    text: link.textContent.trim().substring(0, 20),
                    content: beforeStyle.content,
                    fontFamily: beforeStyle.fontFamily,
                    id: link.parentElement ? link.parentElement.id : 'unknown'
                });
            }
        });
        
        return icons;
    });
    
    console.log('🎨 Icon Status (first 5):');
    iconStatus.forEach((icon, index) => {
        console.log(`   ${index + 1}. ${icon.id}: "${icon.text}"`);
        console.log(`      Content: ${icon.content} | Font: ${icon.fontFamily}`);
    });
    
    // Test chart overflow specifically
    const chartStatus = await page.evaluate(() => {
        const chart = document.querySelector('#chart_div');
        if (!chart) return { error: 'Chart not found' };
        
        const style = window.getComputedStyle(chart);
        const parent = chart.parentElement;
        const parentStyle = parent ? window.getComputedStyle(parent) : null;
        
        return {
            overflowX: style.overflowX,
            maxWidth: style.maxWidth,
            parentOverflowX: parentStyle ? parentStyle.overflowX : 'no parent',
            chartWidth: chart.scrollWidth,
            containerWidth: chart.clientWidth
        };
    });
    
    console.log('📊 Chart Overflow Status:');
    if (chartStatus.error) {
        console.log(`   ❌ ${chartStatus.error}`);
    } else {
        console.log(`   Chart overflow-x: ${chartStatus.overflowX} (should be auto)`);
        console.log(`   Chart max-width: ${chartStatus.maxWidth}`);
        console.log(`   Chart size: ${chartStatus.chartWidth}px / ${chartStatus.containerWidth}px`);
    }
    
    // Take comprehensive screenshots
    const timestamp = Date.now();
    
    // Home page screenshot
    await page.screenshot({ 
        path: `./testing/production-final-home-${timestamp}.png`, 
        fullPage: true 
    });
    console.log(`📸 Home screenshot: ./testing/production-final-home-${timestamp}.png`);
    
    // Test navigation to inventory page
    console.log('🧪 Testing navigation to inventory page...');
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        await page.waitForTimeout(3000);
        
        await page.screenshot({ 
            path: `./testing/production-final-inventory-${timestamp}.png`, 
            fullPage: true 
        });
        console.log(`📸 Inventory screenshot: ./testing/production-final-inventory-${timestamp}.png`);
        
        // Check if inventory page has correct theming
        const inventoryTheme = await page.evaluate(() => {
            const wrapper = document.querySelector('.wrapper, #content');
            const style = wrapper ? window.getComputedStyle(wrapper) : null;
            return {
                backgroundColor: style ? style.backgroundColor : 'not found',
                hasCorrectMargin: style ? style.marginLeft === '220px' : false
            };
        });
        
        console.log('🎨 Inventory Theme Check:');
        console.log(`   Background: ${inventoryTheme.backgroundColor} (should be light)`);
        console.log(`   Correct margin: ${inventoryTheme.hasCorrectMargin ? '✅ YES' : '❌ NO'}`);
        
    } catch (error) {
        console.log(`   ❌ Could not test inventory page: ${error.message}`);
    }
    
    console.log('🧪 Testing add/edit functionality...');
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/uiconfigs/index', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        await page.waitForTimeout(3000);
        
        const configPageStatus = await page.evaluate(() => {
            const content = document.querySelector('#content, .wrapper');
            const hasTable = document.querySelector('table');
            const hasPortalExtraJS = document.body.textContent.includes('PORTAL_EXTRA_JS');
            
            return {
                hasContent: !!content,
                isEmpty: content ? content.textContent.trim().length < 50 : true,
                hasTable: !!hasTable,
                hasPortalExtraJS,
                title: document.title,
                url: window.location.href
            };
        });
        
        console.log('⚙️ Config Page Status:');
        console.log(`   Title: ${configPageStatus.title}`);
        console.log(`   Has Content: ${configPageStatus.hasContent ? '✅ YES' : '❌ NO'}`);
        console.log(`   Is Empty: ${configPageStatus.isEmpty ? '❌ YES' : '✅ NO'}`);
        console.log(`   Has Table: ${configPageStatus.hasTable ? '✅ YES' : '❌ NO'}`);
        console.log(`   Has PORTAL_EXTRA_JS: ${configPageStatus.hasPortalExtraJS ? '✅ YES' : '❌ NO'}`);
        
        await page.screenshot({ 
            path: `./testing/production-final-config-${timestamp}.png`, 
            fullPage: true 
        });
        console.log(`📸 Config screenshot: ./testing/production-final-config-${timestamp}.png`);
        
    } catch (error) {
        console.log(`   ❌ Config page test failed: ${error.message}`);
    }
    
    await browser.close();
    console.log('✅ Comprehensive production test complete!');
    console.log('\n📋 SUMMARY:');
    console.log('   - Check screenshots in testing/ directory');
    console.log('   - Verify sidebar is fixed 220px width');
    console.log('   - Confirm no horizontal scrolling');
    console.log('   - Icons should be Font Awesome, not gray rectangles');
    console.log('   - Add/edit functionality should work without blank screens');
}

testProductionFinalAuthenticated().catch(console.error);