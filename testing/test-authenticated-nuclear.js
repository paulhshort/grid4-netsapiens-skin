const { chromium } = require('playwright');

async function testAuthenticatedNuclear() {
    console.log('🔐 TESTING NUCLEAR WITH ACTUAL AUTHENTICATION');
    console.log('============================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    
    // Track all Grid4 activity
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
    
    console.log('🔐 Step 1: Going to login page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('📝 Step 2: Logging in with credentials...');
    
    // Find and fill login form
    try {
        // Try different login field selectors
        await page.waitForSelector('input', { timeout: 5000 });
        
        const inputs = await page.$$('input');
        console.log(`   Found ${inputs.length} input fields`);
        
        if (inputs.length >= 2) {
            // First input should be username
            await inputs[0].fill('grid4admin');
            // Second input should be password  
            await inputs[1].fill('G4@dm1n2024!');
            
            console.log('   Credentials filled');
            
            // Find and click login button
            const submitButton = await page.$('input[type="submit"], button[type="submit"], .btn');
            if (submitButton) {
                await submitButton.click();
                console.log('   Login button clicked');
            } else {
                // Try pressing Enter
                await inputs[1].press('Enter');
                console.log('   Pressed Enter to submit');
            }
            
            // Wait for navigation
            console.log('⏳ Step 3: Waiting for login to complete...');
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
            
        } else {
            console.log('   ❌ Could not find proper login form');
            await browser.close();
            return;
        }
        
    } catch (error) {
        console.log(`   ❌ Login failed: ${error.message}`);
        await browser.close();
        return;
    }
    
    console.log('🏠 Step 4: Navigating to main portal...');
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('login')) {
        console.log('   Still on login page - authentication failed');
        await browser.close();
        return;
    }
    
    // Navigate to home to see the actual portal interface
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('⏳ Step 5: Waiting for portal to fully load...');
    await page.waitForTimeout(5000);
    
    // Take screenshot of actual portal BEFORE nuclear injection
    const beforeScreenshot = `./testing/before-nuclear-${Date.now()}.png`;
    await page.screenshot({ 
        path: beforeScreenshot, 
        fullPage: true 
    });
    console.log(`📸 BEFORE screenshot: ${beforeScreenshot}`);
    
    // Check current navigation state
    const beforeNavigation = await page.evaluate(() => {
        const nav = document.querySelector('#navigation, #nav-buttons');
        if (!nav) return { error: 'No navigation found' };
        
        const style = window.getComputedStyle(nav);
        const rect = nav.getBoundingClientRect();
        
        return {
            exists: true,
            position: style.position,
            left: style.left,
            width: style.width,
            backgroundColor: style.backgroundColor,
            actualLeft: Math.round(rect.left),
            actualWidth: Math.round(rect.width),
            visible: rect.width > 0 && rect.height > 0
        };
    });
    
    console.log('🔍 Navigation BEFORE Nuclear:');
    if (beforeNavigation.error) {
        console.log(`   ❌ ${beforeNavigation.error}`);
    } else {
        console.log(`   Position: ${beforeNavigation.position}`);
        console.log(`   Left: ${beforeNavigation.left} (actual: ${beforeNavigation.actualLeft}px)`);
        console.log(`   Width: ${beforeNavigation.width} (actual: ${beforeNavigation.actualWidth}px)`);
        console.log(`   Background: ${beforeNavigation.backgroundColor}`);
        console.log(`   Visible: ${beforeNavigation.visible ? '✅ YES' : '❌ NO'}`);
    }
    
    console.log('💥 Step 6: Injecting Nuclear CSS...');
    
    // Inject nuclear loader
    await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-nuclear-loader.js'
    });
    
    console.log('⏳ Step 7: Waiting for nuclear to take effect...');
    await page.waitForTimeout(3000);
    
    // Take screenshot AFTER nuclear injection
    const afterScreenshot = `./testing/after-nuclear-${Date.now()}.png`;
    await page.screenshot({ 
        path: afterScreenshot, 
        fullPage: true 
    });
    console.log(`📸 AFTER screenshot: ${afterScreenshot}`);
    
    // Check navigation AFTER nuclear
    const afterNavigation = await page.evaluate(() => {
        const nav = document.querySelector('#navigation, #nav-buttons');
        if (!nav) return { error: 'No navigation found' };
        
        const style = window.getComputedStyle(nav);
        const rect = nav.getBoundingClientRect();
        
        // Check CSS variables
        const rootStyles = window.getComputedStyle(document.documentElement);
        const g4Primary = rootStyles.getPropertyValue('--g4-primary').trim();
        const g4SidebarWidth = rootStyles.getPropertyValue('--g4-sidebar-width').trim();
        
        return {
            exists: true,
            position: style.position,
            left: style.left,
            width: style.width,
            backgroundColor: style.backgroundColor,
            actualLeft: Math.round(rect.left),
            actualWidth: Math.round(rect.width),
            visible: rect.width > 0 && rect.height > 0,
            g4Primary,
            g4SidebarWidth,
            nuclearActive: !!window.Grid4Nuclear
        };
    });
    
    console.log('🔍 Navigation AFTER Nuclear:');
    if (afterNavigation.error) {
        console.log(`   ❌ ${afterNavigation.error}`);
    } else {
        console.log(`   Position: ${afterNavigation.position} ${afterNavigation.position === 'fixed' ? '✅' : '❌'}`);
        console.log(`   Left: ${afterNavigation.left} (actual: ${afterNavigation.actualLeft}px)`);
        console.log(`   Width: ${afterNavigation.width} (actual: ${afterNavigation.actualWidth}px)`);
        console.log(`   Background: ${afterNavigation.backgroundColor}`);
        console.log(`   CSS Variables: --g4-primary: ${afterNavigation.g4Primary}, --g4-sidebar-width: ${afterNavigation.g4SidebarWidth}`);
        console.log(`   Nuclear Active: ${afterNavigation.nuclearActive ? '✅ YES' : '❌ NO'}`);
    }
    
    // Check content offset
    const contentCheck = await page.evaluate(() => {
        const content = document.querySelector('.wrapper, #content');
        if (!content) return { error: 'No content wrapper found' };
        
        const style = window.getComputedStyle(content);
        const rect = content.getBoundingClientRect();
        
        return {
            marginLeft: style.marginLeft,
            actualLeft: Math.round(rect.left),
            backgroundColor: style.backgroundColor
        };
    });
    
    console.log('📄 Content Status:');
    if (contentCheck.error) {
        console.log(`   ❌ ${contentCheck.error}`);
    } else {
        console.log(`   Margin Left: ${contentCheck.marginLeft}`);
        console.log(`   Actual Left: ${contentCheck.actualLeft}px (should be ~220px)`);
        console.log(`   Background: ${contentCheck.backgroundColor}`);
    }
    
    // Test navigation functionality
    console.log('🧪 Step 8: Testing navigation functionality...');
    try {
        // Try clicking on a navigation item
        const navLink = await page.$('#navigation a, #nav-buttons a');
        if (navLink) {
            const linkText = await navLink.textContent();
            console.log(`   Found navigation link: "${linkText}"`);
            
            // Don't actually click to avoid navigation - just check if clickable
            const isClickable = await navLink.isEnabled();
            console.log(`   Navigation clickable: ${isClickable ? '✅ YES' : '❌ NO'}`);
        } else {
            console.log('   ❌ No navigation links found');
        }
    } catch (error) {
        console.log(`   ❌ Navigation test failed: ${error.message}`);
    }
    
    await browser.close();
    console.log('✅ Authenticated nuclear test complete');
    
    console.log('\n📋 SUMMARY:');
    console.log(`   Before Screenshot: ${beforeScreenshot}`);
    console.log(`   After Screenshot: ${afterScreenshot}`);
    console.log(`   Navigation Found: ${beforeNavigation.exists ? '✅' : '❌'}`);
    console.log(`   Nuclear Applied: ${afterNavigation.nuclearActive ? '✅' : '❌'}`);
    console.log(`   Position Fixed: ${afterNavigation.position === 'fixed' ? '✅' : '❌'}`);
}

testAuthenticatedNuclear().catch(console.error);