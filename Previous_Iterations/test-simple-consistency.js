const { chromium } = require('playwright');

async function testCurrentState() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing current Grid4 portal state...');
        
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
        
        // Go to inventory page (where issues are most visible)
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(5000);
        
        // Take full screenshot
        await page.screenshot({ 
            path: './test-results/current-state-full.png',
            fullPage: true 
        });
        
        // Get detailed status
        const status = await page.evaluate(() => {
            const body = document.body;
            const wrapper = document.querySelector('.wrapper');
            const navigation = document.querySelector('#navigation');
            const breadcrumb = document.querySelector('.breadcrumb, .top-header, .navbar-fixed-top, .navbar');
            const versionSelector = document.querySelector('#grid4-version-indicator');
            const logo = document.querySelector('.grid4-sidebar-logo, .grid4-logo-replaced');
            
            // Check all wrapper-like elements
            const wrappers = document.querySelectorAll('.wrapper, div.wrapper, #content .wrapper');
            const wrapperBackgrounds = Array.from(wrappers).map(w => ({
                element: w.tagName + (w.className ? '.' + w.className.split(' ')[0] : ''),
                background: getComputedStyle(w).backgroundColor,
                backgroundImage: getComputedStyle(w).backgroundImage
            }));
            
            return {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent.split(' ').pop(), // Just browser name
                url: window.location.href,
                
                // Grid4 Status
                grid4: {
                    bodyClasses: body.className,
                    cssLoaded: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                    jsLoaded: typeof window.Grid4SmartLoader !== 'undefined',
                    bodyBackground: getComputedStyle(body).backgroundColor
                },
                
                // Layout Elements
                elements: {
                    wrapper: {
                        exists: !!wrapper,
                        background: wrapper ? getComputedStyle(wrapper).backgroundColor : 'N/A',
                        backgroundImage: wrapper ? getComputedStyle(wrapper).backgroundImage : 'N/A'
                    },
                    navigation: {
                        exists: !!navigation,
                        background: navigation ? getComputedStyle(navigation).backgroundColor : 'N/A'
                    },
                    breadcrumb: {
                        exists: !!breadcrumb,
                        background: breadcrumb ? getComputedStyle(breadcrumb).backgroundColor : 'N/A',
                        color: breadcrumb ? getComputedStyle(breadcrumb).color : 'N/A'
                    },
                    logo: {
                        exists: !!logo,
                        type: logo ? logo.className : 'N/A',
                        position: logo ? {
                            top: logo.getBoundingClientRect().top,
                            left: logo.getBoundingClientRect().left
                        } : 'N/A'
                    }
                },
                
                // Issues
                issues: {
                    versionSelector: !!versionSelector,
                    whiteWrappers: wrapperBackgrounds.filter(w => 
                        w.background.includes('255, 255, 255') || w.background === 'rgb(255, 255, 255)'
                    ),
                    horizontalOverflow: body.scrollWidth > window.innerWidth,
                    overflowAmount: body.scrollWidth - window.innerWidth
                },
                
                // All wrapper backgrounds for debugging
                allWrapperBackgrounds: wrapperBackgrounds
            };
        });
        
        console.log('\n📊 CURRENT PORTAL STATE ANALYSIS');
        console.log('=====================================');
        console.log(`🕐 Test Time: ${status.timestamp}`);
        console.log(`🌐 Browser: ${status.userAgent}`);
        console.log(`🔗 URL: ${status.url}`);
        
        console.log('\n🎯 Grid4 Status:');
        console.log(`   CSS Loaded: ${status.grid4.cssLoaded ? '✅' : '❌'}`);
        console.log(`   JS Loaded: ${status.grid4.jsLoaded ? '✅' : '❌'}`);
        console.log(`   Body Classes: ${status.grid4.bodyClasses.includes('grid4-emergency-active') ? '✅' : '❌'}`);
        console.log(`   Body Background: ${status.grid4.bodyBackground}`);
        
        console.log('\n📱 Layout Elements:');
        console.log(`   Wrapper: ${status.elements.wrapper.exists ? '✅' : '❌'} - BG: ${status.elements.wrapper.background}`);
        console.log(`   Navigation: ${status.elements.navigation.exists ? '✅' : '❌'} - BG: ${status.elements.navigation.background}`);
        console.log(`   Breadcrumb: ${status.elements.breadcrumb.exists ? '✅' : '❌'} - BG: ${status.elements.breadcrumb.background}`);
        console.log(`   Logo: ${status.elements.logo.exists ? '✅' : '❌'} - Type: ${status.elements.logo.type}`);
        
        console.log('\n🚨 Issues Detected:');
        console.log(`   Version Selector: ${status.issues.versionSelector ? '❌ PRESENT' : '✅ ABSENT'}`);
        console.log(`   White Wrappers: ${status.issues.whiteWrappers.length > 0 ? '❌ ' + status.issues.whiteWrappers.length : '✅ NONE'}`);
        console.log(`   Horizontal Overflow: ${status.issues.horizontalOverflow ? '❌ ' + status.issues.overflowAmount + 'px' : '✅ NONE'}`);
        
        if (status.issues.whiteWrappers.length > 0) {
            console.log('\n🔍 White Background Elements:');
            status.issues.whiteWrappers.forEach((w, i) => {
                console.log(`   ${i+1}. ${w.element} - ${w.background}`);
            });
        }
        
        console.log('\n📸 Screenshot saved: test-results/current-state-full.png');
        
        // Test different pages for consistency
        const pagesToTest = [
            '/portal/home',
            '/portal/uiconfigs/index/firebase',
            '/portal/inventory'
        ];
        
        for (const pageUrl of pagesToTest) {
            await page.goto(`https://portal.grid4voice.ucaas.tech${pageUrl}`, { 
                waitUntil: 'networkidle' 
            });
            await page.waitForTimeout(3000);
            
            const pageAnalysis = await page.evaluate(() => {
                const wrapper = document.querySelector('.wrapper');
                const versionSelector = document.querySelector('#grid4-version-indicator');
                
                return {
                    page: window.location.pathname,
                    wrapperBg: wrapper ? getComputedStyle(wrapper).backgroundColor : 'N/A',
                    versionSelector: !!versionSelector,
                    bodyBg: getComputedStyle(document.body).backgroundColor
                };
            });
            
            const pageName = pageUrl.split('/').pop() || 'home';
            await page.screenshot({ 
                path: `./test-results/page-${pageName}.png`,
                fullPage: false 
            });
            
            console.log(`\n📄 ${pageAnalysis.page}:`);
            console.log(`   Wrapper BG: ${pageAnalysis.wrapperBg}`);
            console.log(`   Body BG: ${pageAnalysis.bodyBg}`);
            console.log(`   Version Selector: ${pageAnalysis.versionSelector ? '❌ PRESENT' : '✅ ABSENT'}`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: './test-results/error-state.png' });
    }
    
    await browser.close();
}

testCurrentState();