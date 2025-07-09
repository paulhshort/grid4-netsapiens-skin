const { chromium } = require('playwright');

async function findOverflowCulprit() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        // Login first
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
        
        // Set problematic viewport
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.waitForTimeout(3000);
        
        // Find all elements wider than the viewport
        const overflowElements = await page.evaluate(() => {
            const viewport = window.innerWidth;
            const allElements = document.querySelectorAll('*');
            const culprits = [];
            
            allElements.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const styles = getComputedStyle(el);
                
                // Check if element extends past viewport
                if (rect.right > viewport || el.scrollWidth > viewport || el.offsetWidth > viewport) {
                    culprits.push({
                        tagName: el.tagName,
                        id: el.id || '',
                        className: el.className || '',
                        offsetWidth: el.offsetWidth,
                        scrollWidth: el.scrollWidth,
                        clientWidth: el.clientWidth,
                        rect: {
                            left: rect.left,
                            right: rect.right,
                            width: rect.width
                        },
                        computedWidth: styles.width,
                        position: styles.position,
                        overflow: styles.overflow,
                        overflowX: styles.overflowX,
                        marginRight: styles.marginRight,
                        paddingRight: styles.paddingRight,
                        borderRight: styles.borderRight
                    });
                }
            });
            
            // Sort by how far they extend beyond viewport
            culprits.sort((a, b) => Math.max(b.rect.right - viewport, b.scrollWidth - viewport) - 
                                    Math.max(a.rect.right - viewport, a.scrollWidth - viewport));
            
            return {
                viewport: { width: viewport, height: window.innerHeight },
                bodyScrollWidth: document.body.scrollWidth,
                bodyOffsetWidth: document.body.offsetWidth,
                culpritCount: culprits.length,
                topCulprits: culprits.slice(0, 10) // Top 10 worst offenders
            };
        });
        
        console.log('🔍 OVERFLOW CULPRIT ANALYSIS:');
        console.log(`Viewport: ${overflowElements.viewport.width}px`);
        console.log(`Body scroll width: ${overflowElements.bodyScrollWidth}px`);
        console.log(`Body offset width: ${overflowElements.bodyOffsetWidth}px`);
        console.log(`Overflow: ${overflowElements.bodyScrollWidth - overflowElements.viewport.width}px`);
        console.log(`\nFound ${overflowElements.culpritCount} elements extending beyond viewport:\n`);
        
        overflowElements.topCulprits.forEach((culprit, i) => {
            console.log(`${i + 1}. ${culprit.tagName}${culprit.id ? '#' + culprit.id : ''}${culprit.className ? '.' + culprit.className.split(' ')[0] : ''}`);
            console.log(`   Offset Width: ${culprit.offsetWidth}px`);
            console.log(`   Scroll Width: ${culprit.scrollWidth}px`);
            console.log(`   Rect Right: ${culprit.rect.right}px (extends ${culprit.rect.right - overflowElements.viewport.width}px beyond viewport)`);
            console.log(`   Position: ${culprit.position}, Overflow-X: ${culprit.overflowX}`);
            console.log('');
        });
        
        await page.screenshot({ path: './test-results/overflow-culprits.png' });
        
    } catch (error) {
        console.error('❌ Analysis failed:', error.message);
    }
    
    await browser.close();
}

findOverflowCulprit();