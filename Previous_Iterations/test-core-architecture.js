const { chromium } = require('playwright');

async function testCoreArchitecture() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🏗️  TESTING CORE ARCHITECTURE IMPLEMENTATION...');
        
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
        await page.waitForTimeout(10000); // Give time for CSS to fully load
        
        // Take initial screenshot
        await page.screenshot({ 
            path: './test-results/core-architecture-loaded.png',
            fullPage: true 
        });
        
        // CRITICAL TEST: Layout Architecture Validation
        const layoutTest = await page.evaluate(() => {
            const sidebar = document.querySelector('#navigation');
            const content = document.querySelector('#content');
            const wrapper = document.querySelector('.wrapper');
            const body = document.body;
            
            // Get computed styles for each critical element
            const sidebarStyles = sidebar ? getComputedStyle(sidebar) : null;
            const contentStyles = content ? getComputedStyle(content) : null;
            const wrapperStyles = wrapper ? getComputedStyle(wrapper) : null;
            const bodyStyles = getComputedStyle(body);
            
            // Check positions and dimensions
            const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
            const contentRect = content ? content.getBoundingClientRect() : null;
            const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : null;
            
            return {
                // CSS Variables Check
                cssVars: {
                    sidebarWidth: getComputedStyle(document.documentElement).getPropertyValue('--g4-sidebar-width'),
                    primary: getComputedStyle(document.documentElement).getPropertyValue('--g4-primary'),
                    accent: getComputedStyle(document.documentElement).getPropertyValue('--g4-accent')
                },
                
                // Body Validation
                body: {
                    background: bodyStyles.backgroundColor,
                    overflowX: bodyStyles.overflowX,
                    width: bodyStyles.width,
                    fontFamily: bodyStyles.fontFamily
                },
                
                // Sidebar Critical Tests
                sidebar: {
                    exists: !!sidebar,
                    position: sidebarStyles ? sidebarStyles.position : 'N/A',
                    width: sidebarStyles ? sidebarStyles.width : 'N/A',
                    left: sidebarStyles ? sidebarStyles.left : 'N/A',
                    top: sidebarStyles ? sidebarStyles.top : 'N/A',
                    zIndex: sidebarStyles ? sidebarStyles.zIndex : 'N/A',
                    background: sidebarStyles ? sidebarStyles.backgroundColor : 'N/A',
                    height: sidebarStyles ? sidebarStyles.height : 'N/A',
                    rect: sidebarRect ? {
                        width: sidebarRect.width,
                        height: sidebarRect.height,
                        left: sidebarRect.left,
                        right: sidebarRect.right,
                        top: sidebarRect.top
                    } : null
                },
                
                // Content Area Critical Tests
                content: {
                    exists: !!content,
                    marginLeft: contentStyles ? contentStyles.marginLeft : 'N/A',
                    paddingLeft: contentStyles ? contentStyles.paddingLeft : 'N/A',
                    width: contentStyles ? contentStyles.width : 'N/A',
                    background: contentStyles ? contentStyles.backgroundColor : 'N/A',
                    rect: contentRect ? {
                        width: contentRect.width,
                        left: contentRect.left,
                        right: contentRect.right,
                        top: contentRect.top
                    } : null
                },
                
                // Wrapper Critical Tests
                wrapper: {
                    exists: !!wrapper,
                    marginLeft: wrapperStyles ? wrapperStyles.marginLeft : 'N/A',
                    width: wrapperStyles ? wrapperStyles.width : 'N/A',
                    background: wrapperStyles ? wrapperStyles.backgroundColor : 'N/A',
                    rect: wrapperRect ? {
                        width: wrapperRect.width,
                        left: wrapperRect.left,
                        right: wrapperRect.right
                    } : null
                },
                
                // Overlap Detection
                overlap: {
                    sidebarContentOverlap: sidebarRect && contentRect ? 
                        (sidebarRect.right > contentRect.left && sidebarRect.left < contentRect.right) : false,
                    gap: sidebarRect && contentRect ? contentRect.left - sidebarRect.right : 'N/A'
                },
                
                // Viewport and Overflow
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    bodyScrollWidth: document.body.scrollWidth,
                    horizontalOverflow: document.body.scrollWidth > window.innerWidth
                }
            };
        });
        
        console.log('\\n🧪 CORE ARCHITECTURE TEST RESULTS:');
        console.log('====================================');
        
        console.log('\\n🎨 CSS VARIABLES:');
        console.log(`  --g4-sidebar-width: ${layoutTest.cssVars.sidebarWidth}`);
        console.log(`  --g4-primary: ${layoutTest.cssVars.primary}`);
        console.log(`  --g4-accent: ${layoutTest.cssVars.accent}`);
        
        console.log('\\n🌐 BODY FOUNDATION:');
        console.log(`  Background: ${layoutTest.body.background}`);
        console.log(`  Overflow-X: ${layoutTest.body.overflowX}`);
        console.log(`  Width: ${layoutTest.body.width}`);
        console.log(`  Font Family: ${layoutTest.body.fontFamily}`);
        
        console.log('\\n📱 SIDEBAR ARCHITECTURE:');
        console.log(`  Exists: ${layoutTest.sidebar.exists ? '✅' : '❌'}`);
        console.log(`  Position: ${layoutTest.sidebar.position} ${layoutTest.sidebar.position === 'fixed' ? '✅' : '❌'}`);
        console.log(`  Width: ${layoutTest.sidebar.width} ${layoutTest.sidebar.width === '220px' ? '✅' : '❌'}`);
        console.log(`  Left: ${layoutTest.sidebar.left} ${layoutTest.sidebar.left === '0px' ? '✅' : '❌'}`);
        console.log(`  Top: ${layoutTest.sidebar.top} ${layoutTest.sidebar.top === '0px' ? '✅' : '❌'}`);
        console.log(`  Z-Index: ${layoutTest.sidebar.zIndex}`);
        console.log(`  Background: ${layoutTest.sidebar.background}`);
        console.log(`  Height: ${layoutTest.sidebar.height}`);
        if (layoutTest.sidebar.rect) {
            console.log(`  Actual Width: ${layoutTest.sidebar.rect.width}px`);
            console.log(`  Left Position: ${layoutTest.sidebar.rect.left}px`);
            console.log(`  Right Edge: ${layoutTest.sidebar.rect.right}px`);
        }
        
        console.log('\\n📄 CONTENT ARCHITECTURE:');
        console.log(`  Exists: ${layoutTest.content.exists ? '✅' : '❌'}`);
        console.log(`  Margin-Left: ${layoutTest.content.marginLeft} ${layoutTest.content.marginLeft === '0px' ? '✅' : '❌'}`);
        console.log(`  Padding-Left: ${layoutTest.content.paddingLeft}`);
        console.log(`  Width: ${layoutTest.content.width}`);
        console.log(`  Background: ${layoutTest.content.background}`);
        if (layoutTest.content.rect) {
            console.log(`  Left Position: ${layoutTest.content.rect.left}px`);
            console.log(`  Actual Width: ${layoutTest.content.rect.width}px`);
        }
        
        console.log('\\n📦 WRAPPER ARCHITECTURE:');
        console.log(`  Exists: ${layoutTest.wrapper.exists ? '✅' : '❌'}`);
        console.log(`  Margin-Left: ${layoutTest.wrapper.marginLeft} ${layoutTest.wrapper.marginLeft === '220px' ? '✅' : '❌'}`);
        console.log(`  Width: ${layoutTest.wrapper.width}`);
        console.log(`  Background: ${layoutTest.wrapper.background}`);
        if (layoutTest.wrapper.rect) {
            console.log(`  Left Position: ${layoutTest.wrapper.rect.left}px`);
            console.log(`  Actual Width: ${layoutTest.wrapper.rect.width}px`);
        }
        
        console.log('\\n🔍 OVERLAP ANALYSIS:');
        console.log(`  Sidebar-Content Overlap: ${layoutTest.overlap.sidebarContentOverlap ? '❌ YES' : '✅ NO'}`);
        console.log(`  Gap Between: ${layoutTest.overlap.gap}px`);
        
        console.log('\\n🌐 VIEWPORT CHECK:');
        console.log(`  Viewport: ${layoutTest.viewport.width}x${layoutTest.viewport.height}`);
        console.log(`  Body Scroll Width: ${layoutTest.viewport.bodyScrollWidth}px`);
        console.log(`  Horizontal Overflow: ${layoutTest.viewport.horizontalOverflow ? '❌ YES' : '✅ NO'}`);
        
        // TEST NAVIGATION FUNCTIONALITY
        console.log('\\n🧭 TESTING NAVIGATION FUNCTIONALITY:');
        console.log('====================================');
        
        try {
            // Find navigation links
            const navLinks = await page.$$('#navigation a, #nav-buttons a');
            console.log(`  Navigation links found: ${navLinks.length}`);
            
            if (navLinks.length > 0) {
                // Test first navigation link
                const firstLink = navLinks[0];
                const linkText = await firstLink.innerText();
                console.log(`  Testing link: "${linkText}"`);
                
                // Check if link is clickable
                const isClickable = await firstLink.isVisible() && await firstLink.isEnabled();
                console.log(`  Link clickable: ${isClickable ? '✅' : '❌'}`);
                
                if (isClickable) {
                    await firstLink.click();
                    await page.waitForTimeout(3000);
                    
                    const navigationResult = await page.evaluate(() => {
                        return {
                            url: window.location.href,
                            contentVisible: !!document.querySelector('#content') && 
                                          getComputedStyle(document.querySelector('#content')).display !== 'none'
                        };
                    });
                    
                    console.log(`  Navigation successful: ${navigationResult.url !== 'https://portal.grid4voice.ucaas.tech/portal/inventory' ? '✅' : '❌'}`);
                    console.log(`  Content still visible: ${navigationResult.contentVisible ? '✅' : '❌'}`);
                }
            }
        } catch (navError) {
            console.log(`  ❌ Navigation test failed: ${navError.message}`);
        }
        
        // TEST ADD/EDIT FUNCTIONALITY
        console.log('\\n🔧 TESTING ADD/EDIT FUNCTIONALITY:');
        console.log('==================================');
        
        // Go back to inventory for add test
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(3000);
        
        try {
            // Look for add buttons
            const addButtons = await page.$$('button, a, input[type="button"]');
            let addButtonTested = false;
            
            for (let button of addButtons) {
                const text = await button.innerText();
                if (text && text.toLowerCase().includes('add')) {
                    console.log(`  Testing add button: "${text}"`);
                    
                    await button.click();
                    await page.waitForTimeout(3000);
                    
                    const addResult = await page.evaluate(() => {
                        return {
                            hasModal: !!document.querySelector('.modal, .dialog, .popup'),
                            modalVisible: document.querySelector('.modal') ? 
                                getComputedStyle(document.querySelector('.modal')).display !== 'none' : false,
                            hasForm: !!document.querySelector('form'),
                            pageHasContent: document.body.innerText.length > 100,
                            isBlankPage: document.body.innerText.trim().length < 50
                        };
                    });
                    
                    console.log(`  Modal appeared: ${addResult.hasModal ? '✅' : '❌'}`);
                    console.log(`  Modal visible: ${addResult.modalVisible ? '✅' : '❌'}`);
                    console.log(`  Form present: ${addResult.hasForm ? '✅' : '❌'}`);
                    console.log(`  Page has content: ${addResult.pageHasContent ? '✅' : '❌'}`);
                    console.log(`  Is blank page: ${addResult.isBlankPage ? '❌ YES' : '✅ NO'}`);
                    
                    addButtonTested = true;
                    break;
                }
            }
            
            if (!addButtonTested) {
                console.log('  ❌ No add buttons found to test');
            }
            
        } catch (addError) {
            console.log(`  ❌ Add/edit test failed: ${addError.message}`);
        }
        
        // FINAL SCREENSHOT
        await page.screenshot({ 
            path: './test-results/core-architecture-final.png',
            fullPage: true 
        });
        
        // ARCHITECTURE VALIDATION SUMMARY
        const architectureValid = (
            layoutTest.sidebar.position === 'fixed' &&
            layoutTest.sidebar.width === '220px' &&
            layoutTest.wrapper.marginLeft === '220px' &&
            !layoutTest.overlap.sidebarContentOverlap &&
            !layoutTest.viewport.horizontalOverflow
        );
        
        console.log('\\n📊 ARCHITECTURE VALIDATION SUMMARY:');
        console.log('====================================');
        console.log(`✅ CSS Variables Loaded: ${layoutTest.cssVars.sidebarWidth ? '✅' : '❌'}`);
        console.log(`✅ Sidebar Fixed Position: ${layoutTest.sidebar.position === 'fixed' ? '✅' : '❌'}`);
        console.log(`✅ Sidebar Correct Width: ${layoutTest.sidebar.width === '220px' ? '✅' : '❌'}`);
        console.log(`✅ Wrapper Proper Offset: ${layoutTest.wrapper.marginLeft === '220px' ? '✅' : '❌'}`);
        console.log(`✅ No Content Overlap: ${!layoutTest.overlap.sidebarContentOverlap ? '✅' : '❌'}`);
        console.log(`✅ No Horizontal Overflow: ${!layoutTest.viewport.horizontalOverflow ? '✅' : '❌'}`);
        console.log(`\\n🏗️  OVERALL ARCHITECTURE: ${architectureValid ? '✅ VALID' : '❌ NEEDS FIXES'}`);
        
        console.log('\\n📸 Screenshots saved:');
        console.log('  - core-architecture-loaded.png');
        console.log('  - core-architecture-final.png');
        
    } catch (error) {
        console.error('❌ Core architecture test failed:', error.message);
    }
    
    await browser.close();
}

testCoreArchitecture();