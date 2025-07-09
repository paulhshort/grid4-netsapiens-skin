const { chromium } = require('playwright');

async function comprehensiveLoginTest() {
    console.log('🔐 Comprehensive Login & Theming Test');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for visual verification
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log('🚀 Step 1: Loading portal with Grid4 v1...');
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/?grid4_version=v1-stable', {
            waitUntil: 'networkidle'
        });
        
        // Take pre-login screenshot
        await page.screenshot({ 
            path: './test-screenshots/01-pre-login.png',
            fullPage: true 
        });
        
        console.log('💉 Step 2: Injecting smart loader manually...');
        await page.addScriptTag({
            url: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader.js'
        });
        
        await page.waitForTimeout(3000);
        
        // Verify smart loader is active
        const smartLoaderActive = await page.evaluate(() => {
            return typeof window.Grid4SmartLoader !== 'undefined';
        });
        console.log(`✅ Smart Loader Active: ${smartLoaderActive}`);
        
        // Take post-injection screenshot
        await page.screenshot({ 
            path: './test-screenshots/02-post-injection.png',
            fullPage: true 
        });
        
        console.log('🔐 Step 3: Attempting login...');
        
        // Fill username with correct selector
        await page.fill('input[name="data[Login][username]"]', '1002@grid4voice');
        console.log('✅ Username filled');
        
        // Fill password with correct selector  
        await page.fill('input[name="data[Login][password]"]', 'hQAFMdWXKNj4wAg');
        console.log('✅ Password filled');
        
        // Take pre-submit screenshot
        await page.screenshot({ 
            path: './test-screenshots/03-credentials-filled.png',
            fullPage: true 
        });
        
        console.log('🚀 Step 4: Submitting login form...');
        
        // Submit the form (look for submit button or press Enter)
        try {
            // Try to find and click submit button
            await page.click('input[type="submit"], button[type="submit"], .btn-submit');
        } catch {
            // Fallback: press Enter on password field
            await page.press('input[name="data[Login][password]"]', 'Enter');
        }
        
        console.log('⏳ Step 5: Waiting for login redirect...');
        
        // Wait for redirect to logged-in area
        await page.waitForFunction(() => {
            return window.location.href.includes('/portal/home') || 
                   window.location.href.includes('/portal/users') ||
                   document.querySelector('#navigation') !== null ||
                   document.body.className.includes('logged-in');
        }, { timeout: 15000 });
        
        console.log('✅ Login successful! Analyzing portal...');
        
        // Take post-login screenshot
        await page.screenshot({ 
            path: './test-screenshots/04-post-login.png',
            fullPage: true 
        });
        
        console.log('🎨 Step 6: Testing comprehensive theming...');
        
        // Analyze current state
        const portalAnalysis = await page.evaluate(() => {
            return {
                url: window.location.href,
                bodyClasses: document.body.className,
                navigationExists: document.querySelector('#navigation') !== null,
                grid4Active: document.body.classList.contains('grid4-emergency-active'),
                smartLoaderPresent: typeof window.Grid4SmartLoader !== 'undefined',
                currentVersion: window.Grid4SmartLoader ? window.Grid4SmartLoader.currentVersion() : null,
                darkThemeDetected: getComputedStyle(document.body).backgroundColor.includes('rgb(26, 35, 50)'),
                sidebarTransformed: (() => {
                    const nav = document.querySelector('#navigation');
                    if (!nav) return false;
                    const style = getComputedStyle(nav);
                    return style.position === 'fixed' && 
                           style.left === '0px' && 
                           style.width === '220px';
                })(),
                contentPanelsThemed: (() => {
                    const panels = document.querySelectorAll('.panel, .widget, .box, .card');
                    if (panels.length === 0) return 'No panels found';
                    
                    let themedCount = 0;
                    panels.forEach(panel => {
                        const bg = getComputedStyle(panel).backgroundColor;
                        if (bg.includes('rgb(30, 39, 54)') || bg.includes('rgb(26, 35, 50)')) {
                            themedCount++;
                        }
                    });
                    
                    return `${themedCount}/${panels.length} panels dark themed`;
                })(),
                navigationButtons: (() => {
                    const buttons = document.querySelectorAll('#nav-buttons a');
                    if (buttons.length === 0) return 'No nav buttons found';
                    
                    let modernCount = 0;
                    buttons.forEach(btn => {
                        const style = getComputedStyle(btn);
                        if (style.borderRadius === '12px') {
                            modernCount++;
                        }
                    });
                    
                    return `${modernCount}/${buttons.length} buttons modernized`;
                })()
            };
        });
        
        console.log('\n📊 PORTAL ANALYSIS:');
        console.log(`🌐 URL: ${portalAnalysis.url}`);
        console.log(`🏷️ Body Classes: ${portalAnalysis.bodyClasses}`);
        console.log(`🧭 Navigation Present: ${portalAnalysis.navigationExists}`);
        console.log(`🎨 Grid4 Theme Active: ${portalAnalysis.grid4Active}`);
        console.log(`🤖 Smart Loader: ${portalAnalysis.smartLoaderPresent}`);
        console.log(`📦 Version: ${portalAnalysis.currentVersion}`);
        console.log(`🌙 Dark Theme: ${portalAnalysis.darkThemeDetected}`);
        console.log(`📱 Sidebar Transformed: ${portalAnalysis.sidebarTransformed}`);
        console.log(`🎨 Content Panels: ${portalAnalysis.contentPanelsThemed}`);
        console.log(`🔘 Navigation Buttons: ${portalAnalysis.navigationButtons}`);
        
        // Navigate to different sections to test theming
        const sectionsToTest = [
            { name: 'Users', selector: 'a[href*="users"]' },
            { name: 'Call Center', selector: 'a[href*="call"]' },
            { name: 'Conferences', selector: 'a[href*="conference"]' }
        ];
        
        for (const section of sectionsToTest) {
            try {
                console.log(`\n🧪 Testing ${section.name} section...`);
                
                await page.click(section.selector);
                await page.waitForTimeout(2000);
                
                // Take screenshot of this section
                await page.screenshot({ 
                    path: `./test-screenshots/05-${section.name.toLowerCase()}-section.png`,
                    fullPage: true 
                });
                
                // Analyze theming in this section
                const sectionAnalysis = await page.evaluate(() => {
                    const tables = document.querySelectorAll('table');
                    const forms = document.querySelectorAll('form');
                    const inputs = document.querySelectorAll('input, select, textarea');
                    
                    return {
                        tablesThemed: Array.from(tables).every(table => {
                            const bg = getComputedStyle(table).backgroundColor;
                            return bg.includes('rgb(30, 39, 54)') || bg === 'rgba(0, 0, 0, 0)';
                        }),
                        formsThemed: Array.from(forms).every(form => {
                            const bg = getComputedStyle(form).backgroundColor;
                            return bg.includes('rgb(30, 39, 54)') || bg === 'rgba(0, 0, 0, 0)';
                        }),
                        inputsThemed: Array.from(inputs).every(input => {
                            const bg = getComputedStyle(input).backgroundColor;
                            return bg.includes('rgb(55, 65, 81)') || bg.includes('rgb(30, 39, 54)');
                        })
                    };
                });
                
                console.log(`  📊 Tables Themed: ${sectionAnalysis.tablesThemed}`);
                console.log(`  📝 Forms Themed: ${sectionAnalysis.formsThemed}`);
                console.log(`  🔤 Inputs Themed: ${sectionAnalysis.inputsThemed}`);
                
            } catch (error) {
                console.log(`  ⚠️ Could not test ${section.name}: ${error.message}`);
            }
        }
        
        // Final comprehensive screenshot
        await page.screenshot({ 
            path: './test-screenshots/06-final-comprehensive.png',
            fullPage: true 
        });
        
        console.log('\n✅ COMPREHENSIVE TEST COMPLETE!');
        console.log('📸 Screenshots saved to ./test-screenshots/');
        console.log('🎯 Key findings:');
        console.log(`  • Smart Loader: ${portalAnalysis.smartLoaderPresent ? '✅ Working' : '❌ Failed'}`);
        console.log(`  • Dark Theme: ${portalAnalysis.darkThemeDetected ? '✅ Active' : '❌ Not Active'}`);
        console.log(`  • Sidebar: ${portalAnalysis.sidebarTransformed ? '✅ Transformed' : '❌ Not Transformed'}`);
        console.log(`  • Modern Design: ${portalAnalysis.navigationButtons}`);
        
        // Keep browser open for manual inspection
        console.log('\n⏳ Keeping browser open for 60 seconds for manual inspection...');
        await page.waitForTimeout(60000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        // Take error screenshot
        await page.screenshot({ 
            path: './test-screenshots/ERROR-state.png',
            fullPage: true 
        });
        
    } finally {
        await browser.close();
    }
}

comprehensiveLoginTest();