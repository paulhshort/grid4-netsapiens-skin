const { chromium, firefox, webkit } = require('playwright');

async function visualNavigationTest() {
    // Test with multiple browsers to see actual user experience
    const browsers = [
        { name: 'Chromium', engine: chromium },
        { name: 'Firefox', engine: firefox },
        { name: 'WebKit', engine: webkit }
    ];
    
    for (const browserInfo of browsers) {
        console.log(`\n🌐 TESTING WITH ${browserInfo.name.toUpperCase()}...`);
        console.log('='.repeat(50));
        
        let browser;
        try {
            browser = await browserInfo.engine.launch({ 
                headless: false,
                args: ['--start-maximized', '--disable-web-security']
            });
            const page = await browser.newPage();
            
            // Set realistic viewport
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            console.log('🔐 Logging in...');
            await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
                waitUntil: 'networkidle',
                timeout: 30000
            });
            
            await page.fill('#LoginUsername', '1002@grid4voice');
            await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
            
            // Screenshot login page
            await page.screenshot({ 
                path: `./test-results/${browserInfo.name.toLowerCase()}-01-login.png`,
                fullPage: true 
            });
            
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
                page.click('.btn.btn-large.color-primary')
            ]);
            
            console.log('📱 Taking dashboard screenshot...');
            await page.waitForTimeout(5000); // Let everything load
            await page.screenshot({ 
                path: `./test-results/${browserInfo.name.toLowerCase()}-02-dashboard.png`,
                fullPage: true 
            });
            
            // Navigate to different sections and take screenshots
            const sections = [
                { name: 'Inventory', url: '/portal/inventory' },
                { name: 'Domains', url: '/portal/domains' },
                { name: 'Call History', url: '/portal/callhistory' },
                { name: 'Resellers', url: '/portal/resellers' }
            ];
            
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                console.log(`📄 Navigating to ${section.name}...`);
                
                try {
                    await page.goto(`https://portal.grid4voice.ucaas.tech${section.url}`, { 
                        waitUntil: 'networkidle',
                        timeout: 15000
                    });
                    
                    await page.waitForTimeout(3000); // Let page settle
                    
                    // Take screenshot
                    await page.screenshot({ 
                        path: `./test-results/${browserInfo.name.toLowerCase()}-0${i+3}-${section.name.toLowerCase()}.png`,
                        fullPage: true 
                    });
                    
                    // Analyze what we see
                    const pageAnalysis = await page.evaluate(() => {
                        const sidebar = document.querySelector('#navigation');
                        const content = document.querySelector('#content');
                        const wrapper = document.querySelector('.wrapper');
                        
                        return {
                            url: window.location.href,
                            title: document.title,
                            sidebarVisible: sidebar ? 
                                (getComputedStyle(sidebar).display !== 'none' && 
                                 getComputedStyle(sidebar).visibility !== 'hidden') : false,
                            sidebarPosition: sidebar ? getComputedStyle(sidebar).position : 'N/A',
                            sidebarWidth: sidebar ? getComputedStyle(sidebar).width : 'N/A',
                            contentMargin: content ? getComputedStyle(content).marginLeft : 'N/A',
                            wrapperMargin: wrapper ? getComputedStyle(wrapper).marginLeft : 'N/A',
                            overlapping: false, // We'll calculate this
                            hasContent: !!document.querySelector('#content') && 
                                       document.querySelector('#content').innerText.length > 100,
                            bodyBg: getComputedStyle(document.body).backgroundColor,
                            hasGrid4Logo: !!document.querySelector('img[src*="data:image/svg+xml"]'),
                            versionSelector: !!document.querySelector('#grid4-version-indicator, .grid4-version-switcher')
                        };
                    });
                    
                    // Check for overlap
                    const overlapCheck = await page.evaluate(() => {
                        const sidebar = document.querySelector('#navigation');
                        const content = document.querySelector('#content');
                        
                        if (!sidebar || !content) return { overlap: false, details: 'Elements missing' };
                        
                        const sidebarRect = sidebar.getBoundingClientRect();
                        const contentRect = content.getBoundingClientRect();
                        
                        return {
                            overlap: sidebarRect.right > contentRect.left && sidebarRect.left < contentRect.right,
                            sidebarRight: sidebarRect.right,
                            contentLeft: contentRect.left,
                            gap: contentRect.left - sidebarRect.right
                        };
                    });
                    
                    console.log(`    📊 ${section.name} Analysis:`);
                    console.log(`       Sidebar Visible: ${pageAnalysis.sidebarVisible ? '✅' : '❌'}`);
                    console.log(`       Sidebar Position: ${pageAnalysis.sidebarPosition}`);
                    console.log(`       Sidebar Width: ${pageAnalysis.sidebarWidth}`);
                    console.log(`       Content Margin: ${pageAnalysis.contentMargin}`);
                    console.log(`       Wrapper Margin: ${pageAnalysis.wrapperMargin}`);
                    console.log(`       Content Overlap: ${overlapCheck.overlap ? '❌ YES' : '✅ NO'}`);
                    console.log(`       Gap: ${overlapCheck.gap}px`);
                    console.log(`       Has Content: ${pageAnalysis.hasContent ? '✅' : '❌'}`);
                    console.log(`       Grid4 Logo: ${pageAnalysis.hasGrid4Logo ? '✅' : '❌'}`);
                    console.log(`       Version Selector: ${pageAnalysis.versionSelector ? '❌ VISIBLE' : '✅ HIDDEN'}`);
                    console.log(`       Body Background: ${pageAnalysis.bodyBg}`);
                    
                    // Test add functionality if available
                    try {
                        const addButtons = await page.$$('button:has-text("Add"), a:has-text("Add"), button[onclick*="add"], a[href*="add"]');
                        if (addButtons.length > 0) {
                            console.log(`    🔧 Testing add functionality...`);
                            
                            const addButton = addButtons[0];
                            const buttonText = await addButton.innerText();
                            console.log(`       Add button found: "${buttonText}"`);
                            
                            await addButton.click();
                            await page.waitForTimeout(2000);
                            
                            // Check what happened
                            const afterAdd = await page.evaluate(() => {
                                return {
                                    url: window.location.href,
                                    hasModal: !!document.querySelector('.modal, .dialog'),
                                    modalVisible: document.querySelector('.modal') ? 
                                        getComputedStyle(document.querySelector('.modal')).display !== 'none' : false,
                                    hasForm: !!document.querySelector('form'),
                                    isBlank: document.body.innerText.trim().length < 100,
                                    bodyText: document.body.innerText.substring(0, 200)
                                };
                            });
                            
                            console.log(`       After Add Click:`);
                            console.log(`         URL: ${afterAdd.url}`);
                            console.log(`         Modal: ${afterAdd.hasModal ? '✅' : '❌'} Visible: ${afterAdd.modalVisible ? '✅' : '❌'}`);
                            console.log(`         Form: ${afterAdd.hasForm ? '✅' : '❌'}`);
                            console.log(`         Blank Page: ${afterAdd.isBlank ? '❌ YES' : '✅ NO'}`);
                            
                            await page.screenshot({ 
                                path: `./test-results/${browserInfo.name.toLowerCase()}-0${i+3}-${section.name.toLowerCase()}-add.png`,
                                fullPage: true 
                            });
                        }
                    } catch (addError) {
                        console.log(`       Add test failed: ${addError.message}`);
                    }
                    
                } catch (navError) {
                    console.log(`    ❌ Navigation to ${section.name} failed: ${navError.message}`);
                }
            }
            
            // Test mobile view
            console.log(`📱 Testing mobile responsiveness...`);
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
                waitUntil: 'networkidle' 
            });
            await page.waitForTimeout(3000);
            
            const mobileAnalysis = await page.evaluate(() => {
                const sidebar = document.querySelector('#navigation');
                const content = document.querySelector('#content');
                
                return {
                    sidebarVisible: sidebar ? getComputedStyle(sidebar).display !== 'none' : false,
                    sidebarTransform: sidebar ? getComputedStyle(sidebar).transform : 'N/A',
                    contentMargin: content ? getComputedStyle(content).marginLeft : 'N/A',
                    horizontalScroll: document.body.scrollWidth > window.innerWidth
                };
            });
            
            console.log(`    📱 Mobile Analysis:`);
            console.log(`       Sidebar Visible: ${mobileAnalysis.sidebarVisible ? '❌ SHOULD HIDE' : '✅'}`);
            console.log(`       Sidebar Transform: ${mobileAnalysis.sidebarTransform}`);
            console.log(`       Content Margin: ${mobileAnalysis.contentMargin}`);
            console.log(`       Horizontal Scroll: ${mobileAnalysis.horizontalScroll ? '❌ YES' : '✅ NO'}`);
            
            await page.screenshot({ 
                path: `./test-results/${browserInfo.name.toLowerCase()}-07-mobile.png`,
                fullPage: true 
            });
            
            console.log(`✅ ${browserInfo.name} testing complete - screenshots saved`);
            
        } catch (error) {
            console.error(`❌ ${browserInfo.name} test failed:`, error.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
        
        // Wait between browsers
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n📊 VISUAL TESTING COMPLETE');
    console.log('============================');
    console.log('Screenshots saved in ./test-results/:');
    console.log('  - [browser]-01-login.png');
    console.log('  - [browser]-02-dashboard.png');
    console.log('  - [browser]-03-inventory.png');
    console.log('  - [browser]-04-domains.png');
    console.log('  - [browser]-05-callhistory.png');
    console.log('  - [browser]-06-resellers.png');
    console.log('  - [browser]-07-mobile.png');
    console.log('  - [browser]-*-add.png (if add buttons found)');
}

visualNavigationTest();