const { chromium } = require('playwright');

async function debugMissingContent() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging missing content issue...');
        
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
        
        // Analyze content visibility
        const contentAnalysis = await page.evaluate(() => {
            // Find all major content containers
            const containers = [
                '#content',
                '.content',
                '.wrapper',
                '.main-content',
                '.grid4-content-enhanced',
                '.container',
                '.container-fluid',
                'main',
                '[role="main"]'
            ];
            
            const containerInfo = containers.map(selector => {
                const element = document.querySelector(selector);
                if (!element) return { selector, exists: false };
                
                const rect = element.getBoundingClientRect();
                const styles = getComputedStyle(element);
                
                return {
                    selector,
                    exists: true,
                    visible: styles.display !== 'none' && styles.visibility !== 'hidden',
                    dimensions: {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    },
                    styles: {
                        display: styles.display,
                        visibility: styles.visibility,
                        opacity: styles.opacity,
                        overflow: styles.overflow,
                        position: styles.position,
                        zIndex: styles.zIndex,
                        marginLeft: styles.marginLeft,
                        width: styles.width,
                        maxWidth: styles.maxWidth
                    },
                    innerHTML: element.innerHTML.length > 0,
                    children: element.children.length
                };
            }).filter(info => info.exists);
            
            // Check if content is hidden by CSS
            const hiddenElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const styles = getComputedStyle(el);
                return (styles.display === 'none' || 
                        styles.visibility === 'hidden' || 
                        styles.opacity === '0') && 
                       el.innerHTML.length > 100; // Likely content
            }).map(el => ({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                display: getComputedStyle(el).display,
                visibility: getComputedStyle(el).visibility,
                opacity: getComputedStyle(el).opacity,
                contentLength: el.innerHTML.length
            }));
            
            return {
                containers: containerInfo,
                hiddenElements: hiddenElements.slice(0, 10), // Top 10
                bodyClasses: document.body.className,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
        });
        
        console.log('\n📊 CONTENT VISIBILITY ANALYSIS:');
        console.log('================================');
        
        console.log('\n📦 Content Containers:');
        contentAnalysis.containers.forEach(container => {
            console.log(`\n   ${container.selector}:`);
            console.log(`      Visible: ${container.visible ? '✅' : '❌'}`);
            console.log(`      Dimensions: ${container.dimensions.width}x${container.dimensions.height}`);
            console.log(`      Position: ${container.dimensions.left}, ${container.dimensions.top}`);
            console.log(`      Display: ${container.styles.display}`);
            console.log(`      Visibility: ${container.styles.visibility}`);
            console.log(`      Margin-Left: ${container.styles.marginLeft}`);
            console.log(`      Width: ${container.styles.width}`);
            console.log(`      Has Content: ${container.innerHTML ? '✅' : '❌'}`);
            console.log(`      Children: ${container.children}`);
        });
        
        if (contentAnalysis.hiddenElements.length > 0) {
            console.log('\n🙈 Hidden Elements (with content):');
            contentAnalysis.hiddenElements.forEach((el, i) => {
                console.log(`   ${i+1}. ${el.tagName}${el.className ? '.' + el.className.split(' ')[0] : ''}`);
                console.log(`      Display: ${el.display}, Visibility: ${el.visibility}, Opacity: ${el.opacity}`);
                console.log(`      Content Length: ${el.contentLength} chars`);
            });
        }
        
        // Try to programmatically access Platform Settings
        console.log('\n🔧 Attempting to access Platform Settings programmatically...');
        
        try {
            await page.goto('https://portal.grid4voice.ucaas.tech/portal/admin/platform_settings', { 
                waitUntil: 'networkidle',
                timeout: 10000
            });
            
            const settingsStatus = await page.evaluate(() => {
                return {
                    url: window.location.href,
                    title: document.title,
                    hasError: !!document.querySelector('.error, .alert-danger, .exception'),
                    hasForm: !!document.querySelector('form'),
                    hasInput: !!document.querySelector('input[name*="PORTAL_EXTRA_JS"], input[name*="extra"], input[name*="js"]'),
                    bodyText: document.body.innerText.substring(0, 200)
                };
            });
            
            console.log('\n🔧 Platform Settings Access:');
            console.log(`   URL: ${settingsStatus.url}`);
            console.log(`   Title: ${settingsStatus.title}`);
            console.log(`   Has Error: ${settingsStatus.hasError ? '❌' : '✅'}`);
            console.log(`   Has Form: ${settingsStatus.hasForm ? '✅' : '❌'}`);
            console.log(`   Has JS Input: ${settingsStatus.hasInput ? '✅' : '❌'}`);
            console.log(`   Body Text: ${settingsStatus.bodyText}`);
            
            await page.screenshot({ path: './test-results/platform-settings-debug.png' });
            
        } catch (settingsError) {
            console.log(`❌ Platform Settings access failed: ${settingsError.message}`);
        }
        
        await page.screenshot({ path: './test-results/missing-content-debug.png' });
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugMissingContent();