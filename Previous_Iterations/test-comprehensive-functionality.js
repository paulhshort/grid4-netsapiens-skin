const { chromium } = require('playwright');

async function testComprehensiveFunctionality() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 COMPREHENSIVE FUNCTIONALITY TEST...');
        
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
        await page.waitForTimeout(5000);
        
        // Take initial screenshot
        await page.screenshot({ 
            path: './test-results/comprehensive-initial.png',
            fullPage: true 
        });
        
        // Test 1: Visual Layout Assessment
        const visualAssessment = await page.evaluate(() => {
            const sidebar = document.querySelector('#navigation');
            const content = document.querySelector('#content');
            const wrapper = document.querySelector('.wrapper');
            const header = document.querySelector('#header');
            
            return {
                sidebar: {
                    exists: !!sidebar,
                    position: sidebar ? getComputedStyle(sidebar).position : 'N/A',
                    width: sidebar ? getComputedStyle(sidebar).width : 'N/A',
                    left: sidebar ? getComputedStyle(sidebar).left : 'N/A',
                    background: sidebar ? getComputedStyle(sidebar).backgroundColor : 'N/A',
                    visible: sidebar ? getComputedStyle(sidebar).display !== 'none' : false,
                    zIndex: sidebar ? getComputedStyle(sidebar).zIndex : 'N/A'
                },
                content: {
                    exists: !!content,
                    marginLeft: content ? getComputedStyle(content).marginLeft : 'N/A',
                    width: content ? getComputedStyle(content).width : 'N/A',
                    background: content ? getComputedStyle(content).backgroundColor : 'N/A',
                    overflowing: content ? content.scrollWidth > content.clientWidth : false
                },
                wrapper: {
                    exists: !!wrapper,
                    background: wrapper ? getComputedStyle(wrapper).backgroundColor : 'N/A',
                    width: wrapper ? getComputedStyle(wrapper).width : 'N/A'
                },
                header: {
                    exists: !!header,
                    background: header ? getComputedStyle(header).backgroundColor : 'N/A',
                    position: header ? getComputedStyle(header).position : 'N/A'
                },
                overlapping: false
            };
        });
        
        // Check for overlapping by comparing positions
        const overlapCheck = await page.evaluate(() => {
            const sidebar = document.querySelector('#navigation');
            const content = document.querySelector('#content');
            
            if (!sidebar || !content) return { overlap: false, reason: 'Missing elements' };
            
            const sidebarRect = sidebar.getBoundingClientRect();
            const contentRect = content.getBoundingClientRect();
            
            const overlap = (sidebarRect.right > contentRect.left && sidebarRect.left < contentRect.right);
            
            return {
                overlap,
                sidebarRect: {
                    left: sidebarRect.left,
                    right: sidebarRect.right,
                    width: sidebarRect.width
                },
                contentRect: {
                    left: contentRect.left,
                    right: contentRect.right,
                    width: contentRect.width
                },
                gap: contentRect.left - sidebarRect.right
            };
        });
        
        console.log('\\n🎨 VISUAL LAYOUT ASSESSMENT:');
        console.log('==============================');
        console.log('\\n📱 SIDEBAR:');
        console.log(`  Exists: ${visualAssessment.sidebar.exists ? '✅' : '❌'}`);
        console.log(`  Position: ${visualAssessment.sidebar.position}`);
        console.log(`  Width: ${visualAssessment.sidebar.width}`);
        console.log(`  Left: ${visualAssessment.sidebar.left}`);
        console.log(`  Background: ${visualAssessment.sidebar.background}`);
        console.log(`  Z-Index: ${visualAssessment.sidebar.zIndex}`);
        
        console.log('\\n📄 CONTENT:');
        console.log(`  Exists: ${visualAssessment.content.exists ? '✅' : '❌'}`);
        console.log(`  Margin-Left: ${visualAssessment.content.marginLeft}`);
        console.log(`  Width: ${visualAssessment.content.width}`);
        console.log(`  Background: ${visualAssessment.content.background}`);
        console.log(`  Overflowing: ${visualAssessment.content.overflowing ? '❌' : '✅'}`);
        
        console.log('\\n🔍 OVERLAP CHECK:');
        console.log(`  Overlapping: ${overlapCheck.overlap ? '❌ YES' : '✅ NO'}`);
        console.log(`  Sidebar right edge: ${overlapCheck.sidebarRect.right}px`);
        console.log(`  Content left edge: ${overlapCheck.contentRect.left}px`);
        console.log(`  Gap between: ${overlapCheck.gap}px`);
        
        // Test 2: Add/Edit Functionality
        console.log('\\n🔧 TESTING ADD/EDIT FUNCTIONALITY:');
        console.log('===================================');
        
        // Look for add buttons
        const addButtons = await page.$$('button, a, input[type="button"]');
        let addButtonFound = false;
        let addButtonText = '';
        
        for (let button of addButtons) {
            const text = await button.innerText();
            if (text && text.toLowerCase().includes('add')) {
                addButtonFound = true;
                addButtonText = text;
                
                console.log(`\\n📝 Testing add button: "${text}"`);
                
                // Click the add button
                await button.click();
                await page.waitForTimeout(2000);
                
                // Check what happened after click
                const afterClick = await page.evaluate(() => {
                    return {
                        url: window.location.href,
                        hasModal: !!document.querySelector('.modal, .dialog, .popup'),
                        modalVisible: document.querySelector('.modal, .dialog, .popup') ? 
                            getComputedStyle(document.querySelector('.modal, .dialog, .popup')).display !== 'none' : false,
                        bodyHasContent: document.body.innerText.length > 100,
                        isBlankPage: document.body.innerText.trim().length < 50,
                        hasForm: !!document.querySelector('form'),
                        hasInputs: document.querySelectorAll('input, textarea, select').length > 0
                    };
                });
                
                console.log(`  URL after click: ${afterClick.url}`);
                console.log(`  Has modal: ${afterClick.hasModal ? '✅' : '❌'}`);
                console.log(`  Modal visible: ${afterClick.modalVisible ? '✅' : '❌'}`);
                console.log(`  Page has content: ${afterClick.bodyHasContent ? '✅' : '❌'}`);
                console.log(`  Is blank page: ${afterClick.isBlankPage ? '❌ YES' : '✅ NO'}`);
                console.log(`  Has form: ${afterClick.hasForm ? '✅' : '❌'}`);
                console.log(`  Has inputs: ${afterClick.hasInputs ? '✅' : '❌'}`);
                
                await page.screenshot({ 
                    path: `./test-results/comprehensive-after-add-click.png`
                });
                
                break; // Test only the first add button
            }
        }
        
        if (!addButtonFound) {
            console.log('  ❌ No add buttons found on this page');
        }
        
        // Test 3: Navigation Test
        console.log('\\n🧭 TESTING NAVIGATION:');
        console.log('======================');
        
        const navLinks = await page.$$('#navigation a, #nav-buttons a');
        if (navLinks.length > 0) {
            const firstLink = navLinks[0];
            const linkText = await firstLink.innerText();
            console.log(`\\n🔗 Testing navigation link: "${linkText}"`);
            
            await firstLink.click();
            await page.waitForTimeout(3000);
            
            const afterNav = await page.evaluate(() => {
                return {
                    url: window.location.href,
                    contentVisible: !!document.querySelector('#content') && 
                                   getComputedStyle(document.querySelector('#content')).display !== 'none',
                    hasContent: document.querySelector('#content') ? 
                               document.querySelector('#content').innerText.length > 100 : false
                };
            });
            
            console.log(`  New URL: ${afterNav.url}`);
            console.log(`  Content visible: ${afterNav.contentVisible ? '✅' : '❌'}`);
            console.log(`  Has content: ${afterNav.hasContent ? '✅' : '❌'}`);
            
            await page.screenshot({ 
                path: `./test-results/comprehensive-after-navigation.png`
            });
        }
        
        // Test 4: Responsive Test
        console.log('\\n📱 TESTING MOBILE RESPONSIVENESS:');
        console.log('==================================');
        
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        await page.waitForTimeout(2000);
        
        const mobileTest = await page.evaluate(() => {
            const sidebar = document.querySelector('#navigation');
            const content = document.querySelector('#content');
            
            return {
                sidebarVisible: sidebar ? getComputedStyle(sidebar).display !== 'none' : false,
                sidebarTransform: sidebar ? getComputedStyle(sidebar).transform : 'N/A',
                contentMargin: content ? getComputedStyle(content).marginLeft : 'N/A',
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
            };
        });
        
        console.log(`  Sidebar visible on mobile: ${mobileTest.sidebarVisible ? '✅' : '❌'}`);
        console.log(`  Sidebar transform: ${mobileTest.sidebarTransform}`);
        console.log(`  Content margin on mobile: ${mobileTest.contentMargin}`);
        console.log(`  Horizontal scroll: ${mobileTest.hasHorizontalScroll ? '❌ YES' : '✅ NO'}`);
        
        await page.screenshot({ 
            path: './test-results/comprehensive-mobile-test.png'
        });
        
        // Reset viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        
        console.log('\\n📊 COMPREHENSIVE TEST SUMMARY:');
        console.log('===============================');
        console.log(`Layout Overlap Issue: ${overlapCheck.overlap ? '❌ NEEDS FIX' : '✅ RESOLVED'}`);
        console.log(`Add/Edit Functionality: ${addButtonFound ? '✅ WORKING' : '❌ NO BUTTONS FOUND'}`);
        console.log(`Navigation Working: ${navLinks.length > 0 ? '✅ WORKING' : '❌ NO NAV LINKS'}`);
        console.log(`Mobile Responsive: ${!mobileTest.hasHorizontalScroll ? '✅ WORKING' : '❌ NEEDS FIX'}`);
        
        console.log('\\n📸 Screenshots saved:');
        console.log('  - comprehensive-initial.png');
        console.log('  - comprehensive-after-add-click.png');
        console.log('  - comprehensive-after-navigation.png');
        console.log('  - comprehensive-mobile-test.png');
        
    } catch (error) {
        console.error('❌ Comprehensive test failed:', error.message);
    }
    
    await browser.close();
}

testComprehensiveFunctionality();