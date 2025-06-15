const { chromium } = require('playwright');

async function testEmergencyFoundation() {
    console.log('🚨 TESTING EMERGENCY FOUNDATION');
    console.log('================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('📍 Navigating to portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    // Wait for Grid4 loader
    console.log('⏳ Waiting for Grid4 emergency foundation...');
    await page.waitForTimeout(8000);
    
    // Check CSS loading status
    const cssStatus = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        const emergencySheet = styleSheets.find(sheet => 
            sheet.href && sheet.href.includes('grid4-emergency-proper-foundation.css')
        );
        return {
            loaded: !!emergencySheet,
            url: emergencySheet ? emergencySheet.href : 'Not found',
            totalSheets: styleSheets.length
        };
    });
    
    console.log(`🎯 Emergency Foundation Status: ${cssStatus.loaded ? '✅ LOADED' : '❌ NOT LOADED'}`);
    if (cssStatus.loaded) {
        console.log(`   URL: ${cssStatus.url}`);
    }
    console.log(`   Total Stylesheets: ${cssStatus.totalSheets}`);
    
    // Check if nuclear options are gone
    const bodyStyles = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const htmlStyle = window.getComputedStyle(document.documentElement);
        return {
            bodyOverflowX: bodyStyle.overflowX,
            htmlOverflowX: htmlStyle.overflowX,
            bodyMaxWidth: bodyStyle.maxWidth
        };
    });
    
    console.log('🔍 Nuclear Options Check:');
    console.log(`   Body overflow-x: ${bodyStyles.bodyOverflowX} (should NOT be hidden)`);
    console.log(`   HTML overflow-x: ${bodyStyles.htmlOverflowX} (should NOT be hidden)`);
    console.log(`   Body max-width: ${bodyStyles.bodyMaxWidth}`);
    
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
            top: style.top,
            actualWidth: rect.width,
            actualLeft: rect.left
        };
    });
    
    console.log('📐 Sidebar Status:');
    if (sidebarStatus.error) {
        console.log(`   ❌ ${sidebarStatus.error}`);
    } else {
        console.log(`   Position: ${sidebarStatus.position} (should be fixed)`);
        console.log(`   Width: ${sidebarStatus.width} (should be 220px)`);
        console.log(`   Left: ${sidebarStatus.left} (should be 0px)`);
        console.log(`   Actual position: ${sidebarStatus.actualLeft}px`);
    }
    
    // Check content offset
    const contentStatus = await page.evaluate(() => {
        const content = document.querySelector('.wrapper, #content');
        if (!content) return { error: 'Content wrapper not found' };
        
        const style = window.getComputedStyle(content);
        const rect = content.getBoundingClientRect();
        
        return {
            marginLeft: style.marginLeft,
            actualLeft: rect.left
        };
    });
    
    console.log('📄 Content Status:');
    if (contentStatus.error) {
        console.log(`   ❌ ${contentStatus.error}`);
    } else {
        console.log(`   Margin Left: ${contentStatus.marginLeft} (should be 220px)`);
        console.log(`   Actual Left: ${contentStatus.actualLeft}px (should be ~220px)`);
    }
    
    // Check for Font Awesome icons
    const iconStatus = await page.evaluate(() => {
        const homeLink = document.querySelector('#nav-home-super a, [href*="home"] a');
        if (!homeLink) return { error: 'Home link not found' };
        
        const beforeStyle = window.getComputedStyle(homeLink, '::before');
        return {
            content: beforeStyle.content,
            fontFamily: beforeStyle.fontFamily,
            found: !!homeLink
        };
    });
    
    console.log('🎨 Icon Status:');
    if (iconStatus.error) {
        console.log(`   ❌ ${iconStatus.error}`);
    } else {
        console.log(`   Home icon content: ${iconStatus.content}`);
        console.log(`   Font family: ${iconStatus.fontFamily}`);
    }
    
    // Take screenshot
    const screenshotPath = `./testing/emergency-foundation-${Date.now()}.png`;
    await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
    });
    console.log(`📸 Screenshot: ${screenshotPath}`);
    
    // Test horizontal overflow
    const overflowTest = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        
        return {
            bodyScrollWidth: body.scrollWidth,
            bodyClientWidth: body.clientWidth,
            htmlScrollWidth: html.scrollWidth,
            htmlClientWidth: html.clientWidth,
            hasHorizontalScroll: body.scrollWidth > body.clientWidth
        };
    });
    
    console.log('📏 Overflow Test:');
    console.log(`   Has horizontal scroll: ${overflowTest.hasHorizontalScroll ? '❌ YES' : '✅ NO'}`);
    console.log(`   Body: ${overflowTest.bodyScrollWidth}px / ${overflowTest.bodyClientWidth}px`);
    
    await browser.close();
    console.log('✅ Emergency foundation test complete');
}

testEmergencyFoundation().catch(console.error);