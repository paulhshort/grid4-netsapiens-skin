const { chromium } = require('playwright');

async function testVisualFixes() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🎨 TESTING VISUAL FIXES...');
        
        // Login
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(8000); // Give time for both CSS files to load
        
        // Take screenshot with visual fixes
        await page.screenshot({ 
            path: './test-results/visual-fixes-desktop.png',
            fullPage: true 
        });
        
        // Test visual elements
        const visualTest = await page.evaluate(() => {
            return {
                // CSS Files Loaded
                cssFiles: Array.from(document.querySelectorAll('link[id^="grid4-css"]')).map(link => ({
                    id: link.id,
                    href: link.href.split('/').pop().split('?')[0],
                    loaded: link.sheet !== null
                })),
                
                // Logo Test
                logo: {
                    originalLogos: document.querySelectorAll('img[src*="netsapiens"], img[src*="logo"]').length,
                    grid4Logos: document.querySelectorAll('img[src*="data:image/svg+xml"]').length,
                    logoReplacement: !!document.querySelector('img[src*="data:image/svg+xml"]')
                },
                
                // Header Styling
                header: {
                    exists: !!document.querySelector('.top-header, .header, #header'),
                    background: document.querySelector('.top-header, .header, #header') ? 
                        getComputedStyle(document.querySelector('.top-header, .header, #header')).backgroundColor : 'N/A',
                    marginLeft: document.querySelector('.top-header, .header, #header') ? 
                        getComputedStyle(document.querySelector('.top-header, .header, #header')).marginLeft : 'N/A'
                },
                
                // Navigation Styling
                navigation: {
                    linkColor: document.querySelector('#navigation a, #nav-buttons a') ? 
                        getComputedStyle(document.querySelector('#navigation a, #nav-buttons a')).color : 'N/A',
                    linkBackground: document.querySelector('#navigation a, #nav-buttons a') ? 
                        getComputedStyle(document.querySelector('#navigation a, #nav-buttons a')).backgroundColor : 'N/A',
                    borderRadius: document.querySelector('#navigation a, #nav-buttons a') ? 
                        getComputedStyle(document.querySelector('#navigation a, #nav-buttons a')).borderRadius : 'N/A'
                },
                
                // Table Styling
                table: {
                    exists: !!document.querySelector('table'),
                    background: document.querySelector('table') ? 
                        getComputedStyle(document.querySelector('table')).backgroundColor : 'N/A',
                    borderRadius: document.querySelector('table') ? 
                        getComputedStyle(document.querySelector('table')).borderRadius : 'N/A',
                    boxShadow: document.querySelector('table') ? 
                        getComputedStyle(document.querySelector('table')).boxShadow : 'N/A'
                },
                
                // Button Styling
                buttons: {
                    exists: !!document.querySelector('.btn, button'),
                    primaryColor: document.querySelector('.btn-primary, button.btn-primary') ? 
                        getComputedStyle(document.querySelector('.btn-primary, button.btn-primary')).backgroundColor : 'N/A',
                    borderRadius: document.querySelector('.btn, button') ? 
                        getComputedStyle(document.querySelector('.btn, button')).borderRadius : 'N/A'
                },
                
                // General Styling
                body: {
                    fontFamily: getComputedStyle(document.body).fontFamily,
                    background: getComputedStyle(document.body).backgroundColor
                }
            };
        });
        
        console.log('\\n🎨 VISUAL FIXES TEST RESULTS:');
        console.log('==============================');
        
        console.log('\\n📁 CSS FILES LOADED:');
        visualTest.cssFiles.forEach(file => {
            console.log(`  ${file.href}: ${file.loaded ? '✅' : '❌'} (ID: ${file.id})`);
        });
        
        console.log('\\n🏷️  LOGO REPLACEMENT:');
        console.log(`  Original Logos Found: ${visualTest.logo.originalLogos}`);
        console.log(`  Grid4 Logos Found: ${visualTest.logo.grid4Logos}`);
        console.log(`  Logo Replacement Working: ${visualTest.logo.logoReplacement ? '✅' : '❌'}`);
        
        console.log('\\n📄 HEADER STYLING:');
        console.log(`  Header Exists: ${visualTest.header.exists ? '✅' : '❌'}`);
        console.log(`  Background: ${visualTest.header.background}`);
        console.log(`  Margin Left: ${visualTest.header.marginLeft}`);
        
        console.log('\\n🧭 NAVIGATION STYLING:');
        console.log(`  Link Color: ${visualTest.navigation.linkColor}`);
        console.log(`  Link Background: ${visualTest.navigation.linkBackground}`);
        console.log(`  Border Radius: ${visualTest.navigation.borderRadius}`);
        
        console.log('\\n📊 TABLE STYLING:');
        console.log(`  Table Exists: ${visualTest.table.exists ? '✅' : '❌'}`);
        console.log(`  Background: ${visualTest.table.background}`);
        console.log(`  Border Radius: ${visualTest.table.borderRadius}`);
        console.log(`  Box Shadow: ${visualTest.table.boxShadow !== 'none' ? '✅' : '❌'}`);
        
        console.log('\\n🔘 BUTTON STYLING:');
        console.log(`  Buttons Exist: ${visualTest.buttons.exists ? '✅' : '❌'}`);
        console.log(`  Primary Color: ${visualTest.buttons.primaryColor}`);
        console.log(`  Border Radius: ${visualTest.buttons.borderRadius}`);
        
        console.log('\\n🌐 GENERAL STYLING:');
        console.log(`  Font Family: ${visualTest.body.fontFamily}`);
        console.log(`  Body Background: ${visualTest.body.background}`);
        
        // Test mobile responsiveness
        console.log('\\n📱 TESTING MOBILE RESPONSIVENESS...');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(3000);
        
        const mobileTest = await page.evaluate(() => {
            const sidebar = document.querySelector('#navigation');
            const content = document.querySelector('#content, .wrapper');
            
            return {
                sidebarHidden: sidebar ? 
                    (getComputedStyle(sidebar).visibility === 'hidden' || 
                     getComputedStyle(sidebar).opacity === '0' ||
                     getComputedStyle(sidebar).transform.includes('translateX(-100%)')) : false,
                contentFullWidth: content ? 
                    (getComputedStyle(content).marginLeft === '0px' && 
                     getComputedStyle(content).width.includes('100')) : false,
                horizontalScroll: document.body.scrollWidth > window.innerWidth,
                viewport: {
                    width: window.innerWidth,
                    bodyScrollWidth: document.body.scrollWidth
                }
            };
        });
        
        console.log('\\n📱 MOBILE TEST RESULTS:');
        console.log(`  Sidebar Hidden: ${mobileTest.sidebarHidden ? '✅' : '❌'}`);
        console.log(`  Content Full Width: ${mobileTest.contentFullWidth ? '✅' : '❌'}`);
        console.log(`  No Horizontal Scroll: ${!mobileTest.horizontalScroll ? '✅' : '❌'}`);
        console.log(`  Viewport: ${mobileTest.viewport.width}px`);
        console.log(`  Body Scroll Width: ${mobileTest.viewport.bodyScrollWidth}px`);
        
        await page.screenshot({ 
            path: './test-results/visual-fixes-mobile.png',
            fullPage: true 
        });
        
        // Reset to desktop and test add functionality
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(2000);
        
        console.log('\\n🔧 TESTING ADD FUNCTIONALITY WITH VISUAL FIXES...');
        
        try {
            const addButton = await page.$('button:has-text("Add"), a:has-text("Add")');
            if (addButton) {
                const buttonText = await addButton.innerText();
                console.log(`  Add button found: "${buttonText}"`);
                
                await addButton.click();
                await page.waitForTimeout(3000);
                
                const modalTest = await page.evaluate(() => {
                    const modal = document.querySelector('.modal, .dialog');
                    return {
                        modalExists: !!modal,
                        modalVisible: modal ? getComputedStyle(modal).display !== 'none' : false,
                        modalBackground: modal ? getComputedStyle(modal).backgroundColor : 'N/A',
                        backdropFilter: modal ? getComputedStyle(modal).backdropFilter : 'N/A',
                        zIndex: modal ? getComputedStyle(modal).zIndex : 'N/A'
                    };
                });
                
                console.log(`  Modal Exists: ${modalTest.modalExists ? '✅' : '❌'}`);
                console.log(`  Modal Visible: ${modalTest.modalVisible ? '✅' : '❌'}`);
                console.log(`  Modal Background: ${modalTest.modalBackground}`);
                console.log(`  Backdrop Filter: ${modalTest.backdropFilter}`);
                console.log(`  Z-Index: ${modalTest.zIndex}`);
                
                await page.screenshot({ 
                    path: './test-results/visual-fixes-modal.png',
                    fullPage: true 
                });
            } else {
                console.log('  ❌ No add button found for testing');
            }
        } catch (addError) {
            console.log(`  ❌ Add functionality test failed: ${addError.message}`);
        }
        
        // Final assessment
        const overallSuccess = (
            visualTest.cssFiles.length >= 2 &&
            visualTest.cssFiles.every(f => f.loaded) &&
            visualTest.body.fontFamily.includes('Inter') &&
            visualTest.body.background === 'rgb(26, 35, 50)' &&
            mobileTest.sidebarHidden &&
            !mobileTest.horizontalScroll
        );
        
        console.log('\\n📊 VISUAL FIXES SUMMARY:');
        console.log('=========================');
        console.log(`✅ CSS Files Loaded: ${visualTest.cssFiles.length >= 2 ? '✅' : '❌'} (${visualTest.cssFiles.length}/2)`);
        console.log(`✅ Grid4 Font Applied: ${visualTest.body.fontFamily.includes('Inter') ? '✅' : '❌'}`);
        console.log(`✅ Dark Background: ${visualTest.body.background === 'rgb(26, 35, 50)' ? '✅' : '❌'}`);
        console.log(`✅ Mobile Responsive: ${mobileTest.sidebarHidden && !mobileTest.horizontalScroll ? '✅' : '❌'}`);
        console.log(`\\n🎨 OVERALL VISUAL FIXES: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS WORK'}`);
        
        console.log('\\n📸 Screenshots saved:');
        console.log('  - visual-fixes-desktop.png');
        console.log('  - visual-fixes-mobile.png');
        console.log('  - visual-fixes-modal.png (if modal tested)');
        
    } catch (error) {
        console.error('❌ Visual fixes test failed:', error.message);
    }
    
    await browser.close();
}

testVisualFixes();