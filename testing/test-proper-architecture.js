const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');

async function testProperArchitecture() {
    console.log('🎯 TESTING GRID4 PROPER ARCHITECTURE');
    console.log('=====================================');
    
    // Test in multiple browsers
    const browsers = [
        { name: 'Chromium', launcher: chromium },
        { name: 'Firefox', launcher: firefox },
        { name: 'Edge (WebKit)', launcher: webkit }
    ];
    
    for (const browser of browsers) {
        console.log(`\n🌐 Testing in ${browser.name}...`);
        
        try {
            const browserInstance = await browser.launcher.launch({ 
                headless: false,
                args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
            });
            
            const page = await browserInstance.newPage();
            
            // Set viewport for consistent testing
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            // Navigate to portal
            console.log('📍 Navigating to portal...');
            await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });
            
            // Wait for Grid4 loader to complete
            console.log('⏳ Waiting for Grid4 loader...');
            await page.waitForTimeout(5000);
            
            // Check if Grid4 proper architecture CSS loaded
            const grid4LoadStatus = await page.evaluate(() => {
                const styleSheets = Array.from(document.styleSheets);
                const grid4Sheet = styleSheets.find(sheet => 
                    sheet.href && sheet.href.includes('grid4-proper-architecture.css')
                );
                return {
                    loaded: !!grid4Sheet,
                    totalSheets: styleSheets.length,
                    grid4Url: grid4Sheet ? grid4Sheet.href : 'Not found'
                };
            });
            
            console.log(`  CSS Load Status: ${grid4LoadStatus.loaded ? '✅ LOADED' : '❌ NOT LOADED'}`);
            console.log(`  Total Stylesheets: ${grid4LoadStatus.totalSheets}`);
            if (grid4LoadStatus.loaded) {
                console.log(`  Grid4 URL: ${grid4LoadStatus.grid4Url}`);
            }
            
            // Check navigation icons specifically
            const iconStatus = await page.evaluate(() => {
                const navLinks = document.querySelectorAll('#navigation a, #nav-buttons a');
                const results = [];
                
                navLinks.forEach((link, index) => {
                    const computed = window.getComputedStyle(link);
                    const beforeStyle = window.getComputedStyle(link, '::before');
                    const afterStyle = window.getComputedStyle(link, '::after');
                    
                    results.push({
                        index,
                        text: link.textContent.trim(),
                        id: link.parentElement ? link.parentElement.id : 'unknown',
                        beforeContent: beforeStyle.content,
                        afterContent: afterStyle.content,
                        fontFamily: beforeStyle.fontFamily,
                        visible: computed.display !== 'none'
                    });
                });
                
                return results;
            });
            
            console.log('  🔍 Navigation Icon Analysis:');
            iconStatus.forEach(icon => {
                console.log(`    ${icon.id}: "${icon.text}"`);
                console.log(`      Before: ${icon.beforeContent} | After: ${icon.afterContent}`);
                console.log(`      Font: ${icon.fontFamily}`);
                console.log(`      Visible: ${icon.visible}`);
            });
            
            // Check layout measurements
            const layoutMetrics = await page.evaluate(() => {
                const sidebar = document.querySelector('#navigation, #nav-buttons');
                const content = document.querySelector('#content, .wrapper');
                
                if (sidebar && content) {
                    const sidebarRect = sidebar.getBoundingClientRect();
                    const contentRect = content.getBoundingClientRect();
                    
                    return {
                        sidebarWidth: sidebarRect.width,
                        sidebarPosition: window.getComputedStyle(sidebar).position,
                        contentMarginLeft: window.getComputedStyle(content).marginLeft,
                        contentLeft: contentRect.left,
                        noOverlap: contentRect.left >= sidebarRect.right
                    };
                } else {
                    return { error: 'Sidebar or content not found' };
                }
            });
            
            console.log('  📐 Layout Metrics:');
            if (layoutMetrics.error) {
                console.log(`    ❌ ${layoutMetrics.error}`);
            } else {
                console.log(`    Sidebar Width: ${layoutMetrics.sidebarWidth}px`);
                console.log(`    Sidebar Position: ${layoutMetrics.sidebarPosition}`);
                console.log(`    Content Margin Left: ${layoutMetrics.contentMarginLeft}`);
                console.log(`    Content Left: ${layoutMetrics.contentLeft}px`);
                console.log(`    No Overlap: ${layoutMetrics.noOverlap ? '✅ YES' : '❌ NO'}`);
            }
            
            // Take screenshot for visual verification
            const screenshotPath = `./testing/proper-architecture-${browser.name.toLowerCase()}-${Date.now()}.png`;
            await page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
            console.log(`  📸 Screenshot saved: ${screenshotPath}`);
            
            // Test add/edit functionality by trying to access UI configs
            console.log('  🧪 Testing Add/Edit Functionality...');
            try {
                await page.goto('https://portal.grid4voice.ucaas.tech/portal/uiconfigs/index', { 
                    waitUntil: 'networkidle',
                    timeout: 15000 
                });
                
                await page.waitForTimeout(3000);
                
                // Check if page loaded properly
                const pageContent = await page.evaluate(() => {
                    const content = document.querySelector('#content, .content, .wrapper');
                    return {
                        hasContent: !!content,
                        isEmpty: content ? content.textContent.trim().length < 50 : true,
                        title: document.title,
                        url: window.location.href
                    };
                });
                
                console.log(`    Page Title: ${pageContent.title}`);
                console.log(`    Has Content: ${pageContent.hasContent ? '✅ YES' : '❌ NO'}`);
                console.log(`    Content Empty: ${pageContent.isEmpty ? '❌ YES' : '✅ NO'}`);
                console.log(`    URL: ${pageContent.url}`);
                
                // Take screenshot of UI configs page
                const configScreenshot = `./testing/uiconfigs-${browser.name.toLowerCase()}-${Date.now()}.png`;
                await page.screenshot({ 
                    path: configScreenshot, 
                    fullPage: true 
                });
                console.log(`    📸 UI Configs screenshot: ${configScreenshot}`);
                
            } catch (error) {
                console.log(`    ❌ Add/Edit test failed: ${error.message}`);
            }
            
            await browserInstance.close();
            console.log(`✅ ${browser.name} testing complete`);
            
        } catch (error) {
            console.error(`❌ ${browser.name} test failed:`, error.message);
        }
    }
    
    console.log('\n🏁 TESTING COMPLETE');
    console.log('Check screenshots in testing/ directory for visual verification');
}

testProperArchitecture().catch(console.error);