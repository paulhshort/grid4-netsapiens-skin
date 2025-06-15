const { chromium } = require('playwright');

async function analyzePortalStructure() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 ANALYZING CORE NETSAPIENS PORTAL STRUCTURE...');
        
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
        
        // Analyze the actual DOM structure
        const portalAnalysis = await page.evaluate(() => {
            // Get the complete DOM hierarchy
            const getElementInfo = (element, depth = 0) => {
                if (!element || depth > 5) return null;
                
                const rect = element.getBoundingClientRect();
                const styles = getComputedStyle(element);
                
                return {
                    tagName: element.tagName,
                    id: element.id,
                    className: element.className,
                    dimensions: {
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y
                    },
                    styles: {
                        display: styles.display,
                        position: styles.position,
                        float: styles.float,
                        clear: styles.clear,
                        width: styles.width,
                        height: styles.height,
                        margin: styles.margin,
                        padding: styles.padding,
                        background: styles.backgroundColor,
                        zIndex: styles.zIndex
                    },
                    children: Array.from(element.children).map(child => 
                        getElementInfo(child, depth + 1)
                    ).filter(Boolean).slice(0, 10) // Limit children to prevent explosion
                };
            };
            
            // Analyze key containers
            const containers = [
                'body',
                '#wrapper',
                '.wrapper', 
                '#content',
                '.content',
                '#navigation',
                '.navigation',
                '#nav-buttons',
                '.nav-buttons',
                '.container',
                '.container-fluid',
                '.top-header',
                '.navbar-fixed-top',
                '.breadcrumb'
            ];
            
            const containerInfo = {};
            containers.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    containerInfo[selector] = getElementInfo(element, 0);
                }
            });
            
            // Get all stylesheets
            const stylesheets = Array.from(document.styleSheets).map(sheet => {
                try {
                    return {
                        href: sheet.href,
                        rules: sheet.cssRules ? sheet.cssRules.length : 0,
                        disabled: sheet.disabled
                    };
                } catch (e) {
                    return {
                        href: sheet.href,
                        error: 'Cannot access rules (CORS)',
                        disabled: sheet.disabled
                    };
                }
            });
            
            // Check for existing layouts
            const layoutInfo = {
                hasBootstrap: !!document.querySelector('link[href*="bootstrap"]') || 
                             !!document.querySelector('script[src*="bootstrap"]'),
                hasJQuery: typeof window.$ !== 'undefined',
                jQueryVersion: window.$ ? window.$.fn.jquery : 'N/A',
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio
                },
                bodyScrollWidth: document.body.scrollWidth,
                bodyClientWidth: document.body.clientWidth,
                overflowX: document.body.scrollWidth > window.innerWidth
            };
            
            return {
                containers: containerInfo,
                stylesheets: stylesheets,
                layout: layoutInfo,
                url: window.location.href
            };
        });
        
        console.log('\n📊 PORTAL STRUCTURE ANALYSIS');
        console.log('============================');
        
        console.log('\n🏗️  CONTAINER HIERARCHY:');
        Object.entries(portalAnalysis.containers).forEach(([selector, info]) => {
            console.log(`\n  ${selector}:`);
            console.log(`    Tag: ${info.tagName}`);
            console.log(`    ID: ${info.id || 'none'}`);
            console.log(`    Classes: ${info.className || 'none'}`);
            console.log(`    Dimensions: ${info.dimensions.width}x${info.dimensions.height}`);
            console.log(`    Position: ${info.styles.position} (${info.dimensions.x}, ${info.dimensions.y})`);
            console.log(`    Display: ${info.styles.display}`);
            console.log(`    Width: ${info.styles.width}`);
            console.log(`    Margin: ${info.styles.margin}`);
            console.log(`    Background: ${info.styles.background}`);
            console.log(`    Children: ${info.children.length}`);
            
            if (info.children.length > 0) {
                console.log('    Child elements:');
                info.children.forEach((child, i) => {
                    console.log(`      ${i+1}. ${child.tagName}${child.id ? '#' + child.id : ''}${child.className ? '.' + child.className.split(' ')[0] : ''}`);
                });
            }
        });
        
        console.log('\n📚 STYLESHEETS:');
        portalAnalysis.stylesheets.forEach((sheet, i) => {
            console.log(`  ${i+1}. ${sheet.href ? sheet.href.split('/').pop() : 'inline'} - ${sheet.rules || sheet.error} rules`);
        });
        
        console.log('\n🎯 LAYOUT INFO:');
        console.log(`  Bootstrap: ${portalAnalysis.layout.hasBootstrap ? '✅' : '❌'}`);
        console.log(`  jQuery: ${portalAnalysis.layout.hasJQuery ? '✅' : '❌'} (${portalAnalysis.layout.jQueryVersion})`);
        console.log(`  Viewport: ${portalAnalysis.layout.viewport.width}x${portalAnalysis.layout.viewport.height}`);
        console.log(`  Body scroll width: ${portalAnalysis.layout.bodyScrollWidth}`);
        console.log(`  Body client width: ${portalAnalysis.layout.bodyClientWidth}`);
        console.log(`  Horizontal overflow: ${portalAnalysis.layout.overflowX ? '❌ YES' : '✅ NO'}`);
        
        // Save detailed analysis
        await page.screenshot({ 
            path: './test-results/portal-structure-analysis.png',
            fullPage: true 
        });
        
        // Write analysis to file
        const fs = require('fs');
        fs.writeFileSync('./test-results/portal-analysis.json', JSON.stringify(portalAnalysis, null, 2));
        
        console.log('\n📄 Analysis saved to:');
        console.log('  - portal-structure-analysis.png');
        console.log('  - portal-analysis.json');
        
    } catch (error) {
        console.error('❌ Analysis failed:', error.message);
    }
    
    await browser.close();
}

analyzePortalStructure();