const { chromium, firefox, webkit } = require('playwright');

async function testBrowserConsistency() {
    const browsers = [
        { name: 'Chrome', browser: chromium },
        { name: 'Firefox', browser: firefox },
        { name: 'Safari', browser: webkit }
    ];
    
    const results = [];
    
    for (const browserInfo of browsers) {
        console.log(`\n🔍 Testing ${browserInfo.name}...`);
        
        let browser;
        try {
            browser = await browserInfo.browser.launch({ 
                headless: false,
                args: ['--start-maximized']
            });
            const page = await browser.newPage();
            
            // Clear cache and cookies
            await page.context().clearCookies();
            await page.evaluate(() => {
                if ('caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => caches.delete(name));
                    });
                }
                localStorage.clear();
                sessionStorage.clear();
            });
            
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
            
            // Navigate to inventory page
            await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
                waitUntil: 'networkidle' 
            });
            await page.waitForTimeout(5000); // Allow full loading
            
            // Take screenshot
            await page.screenshot({ 
                path: `./test-results/browser-${browserInfo.name.toLowerCase()}.png`,
                fullPage: true 
            });
            
            // Get detailed analysis
            const analysis = await page.evaluate(() => {
                const body = document.body;
                const wrapper = document.querySelector('.wrapper');
                const navigation = document.querySelector('#navigation');
                const breadcrumb = document.querySelector('.breadcrumb, .top-header, .navbar-fixed-top');
                const versionSelector = document.querySelector('#grid4-version-indicator, .grid4-version-switcher');
                
                return {
                    userAgent: navigator.userAgent,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    },
                    grid4Status: {
                        bodyClasses: body.className,
                        cssLoaded: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                        jsLoaded: typeof window.Grid4SmartLoader !== 'undefined'
                    },
                    layout: {
                        bodyBg: getComputedStyle(body).backgroundColor,
                        wrapperBg: wrapper ? getComputedStyle(wrapper).backgroundColor : 'not found',
                        wrapperExists: !!wrapper,
                        navigationExists: !!navigation,
                        navigationBg: navigation ? getComputedStyle(navigation).backgroundColor : 'not found'
                    },
                    breadcrumb: {
                        exists: !!breadcrumb,
                        background: breadcrumb ? getComputedStyle(breadcrumb).backgroundColor : 'not found',
                        color: breadcrumb ? getComputedStyle(breadcrumb).color : 'not found'
                    },
                    versionSelector: {
                        exists: !!versionSelector,
                        visible: versionSelector ? getComputedStyle(versionSelector).display !== 'none' : false
                    },
                    overflow: {
                        bodyScrollWidth: body.scrollWidth,
                        bodyOffsetWidth: body.offsetWidth,
                        hasHorizontalOverflow: body.scrollWidth > window.innerWidth
                    },
                    logo: {
                        sidebarLogo: !!document.querySelector('.grid4-sidebar-logo'),
                        anyGrid4Logo: !!document.querySelector('.grid4-logo-replaced')
                    }
                };
            });
            
            results.push({
                browser: browserInfo.name,
                analysis: analysis
            });
            
            console.log(`✅ ${browserInfo.name} analysis complete`);
            
        } catch (error) {
            console.error(`❌ ${browserInfo.name} test failed:`, error.message);
            results.push({
                browser: browserInfo.name,
                error: error.message
            });
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
    
    // Compare results and identify inconsistencies
    console.log('\n🔍 BROWSER CONSISTENCY ANALYSIS');
    console.log('=====================================');
    
    results.forEach(result => {
        if (result.error) {
            console.log(`\n❌ ${result.browser}: FAILED - ${result.error}`);
            return;
        }
        
        const a = result.analysis;
        console.log(`\n🌐 ${result.browser}:`);
        console.log(`   Grid4 CSS: ${a.grid4Status.cssLoaded ? '✅' : '❌'}`);
        console.log(`   Grid4 JS: ${a.grid4Status.jsLoaded ? '✅' : '❌'}`);
        console.log(`   Body Classes: ${a.grid4Status.bodyClasses.includes('grid4-emergency-active') ? '✅' : '❌'}`);
        console.log(`   Body Background: ${a.layout.bodyBg}`);
        console.log(`   Wrapper Background: ${a.layout.wrapperBg}`);
        console.log(`   Navigation Background: ${a.layout.navigationBg}`);
        console.log(`   Breadcrumb Background: ${a.breadcrumb.background}`);
        console.log(`   Version Selector: ${a.versionSelector.exists ? '❌ PRESENT' : '✅ ABSENT'}`);
        console.log(`   Sidebar Logo: ${a.logo.sidebarLogo ? '✅ YES' : '❌ NO'}`);
        console.log(`   Horizontal Overflow: ${a.overflow.hasHorizontalOverflow ? '❌ YES' : '✅ NO'}`);
    });
    
    // Identify specific inconsistencies
    console.log('\n🚨 INCONSISTENCIES DETECTED:');
    
    const backgrounds = results.map(r => r.analysis?.layout?.wrapperBg).filter(Boolean);
    const uniqueBackgrounds = [...new Set(backgrounds)];
    if (uniqueBackgrounds.length > 1) {
        console.log(`❌ Wrapper backgrounds vary: ${uniqueBackgrounds.join(', ')}`);
    }
    
    const versionSelectors = results.map(r => r.analysis?.versionSelector?.exists);
    if (versionSelectors.some(v => v === true)) {
        console.log(`❌ Version selector still appears in some browsers`);
    }
    
    const logos = results.map(r => r.analysis?.logo?.sidebarLogo);
    if (logos.some(l => l === false)) {
        console.log(`❌ Sidebar logo missing in some browsers`);
    }
    
    console.log('\n📸 Screenshots saved in test-results/');
}

testBrowserConsistency().catch(console.error);