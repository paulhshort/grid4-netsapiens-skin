const { chromium } = require('playwright');

async function testInventoryOverflow() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🔐 Logging into portal...');
        
        // Go to login page
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        
        // Fill login form
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        
        // Click login button and wait for navigation
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        console.log('✅ Logged in successfully');
        
        // Navigate to inventory page (where user sees overflow)
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        // Wait for page to fully load
        await page.waitForTimeout(5000);
        
        // Take initial screenshot
        await page.screenshot({ 
            path: './test-results/inventory-before-fix.png',
            fullPage: true 
        });
        
        // Get detailed overflow analysis
        const overflowAnalysis = await page.evaluate(() => {
            const body = document.body;
            const content = document.querySelector('#content');
            const tables = document.querySelectorAll('table');
            const wrappers = document.querySelectorAll('.wrapper');
            const fixedContainers = document.querySelectorAll('.fixed-container');
            
            // Get table info
            const tableInfo = Array.from(tables).map((table, i) => ({
                index: i,
                offsetWidth: table.offsetWidth,
                scrollWidth: table.scrollWidth,
                clientWidth: table.clientWidth,
                computedWidth: getComputedStyle(table).width,
                parent: table.parentElement ? table.parentElement.tagName : 'none',
                parentWidth: table.parentElement ? table.parentElement.offsetWidth : 0
            }));
            
            // Get wrapper info
            const wrapperInfo = Array.from(wrappers).map((wrapper, i) => ({
                index: i,
                offsetWidth: wrapper.offsetWidth,
                scrollWidth: wrapper.scrollWidth,
                computedWidth: getComputedStyle(wrapper).width,
                overflow: getComputedStyle(wrapper).overflow,
                overflowX: getComputedStyle(wrapper).overflowX
            }));
            
            return {
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                body: {
                    scrollWidth: body.scrollWidth,
                    offsetWidth: body.offsetWidth,
                    clientWidth: body.clientWidth,
                    hasOverflow: body.scrollWidth > window.innerWidth
                },
                content: content ? {
                    scrollWidth: content.scrollWidth,
                    offsetWidth: content.offsetWidth,
                    computedWidth: getComputedStyle(content).width,
                    marginLeft: getComputedStyle(content).marginLeft
                } : null,
                tables: tableInfo,
                wrappers: wrapperInfo,
                fixedContainers: Array.from(fixedContainers).map(fc => ({
                    offsetWidth: fc.offsetWidth,
                    computedWidth: getComputedStyle(fc).width
                }))
            };
        });
        
        console.log('🔍 OVERFLOW ANALYSIS:', JSON.stringify(overflowAnalysis, null, 2));
        
        // Look for elements wider than viewport
        const wideElements = await page.evaluate(() => {
            const viewport = window.innerWidth;
            const allElements = document.querySelectorAll('*');
            const wide = [];
            
            allElements.forEach((el, i) => {
                if (el.offsetWidth > viewport) {
                    wide.push({
                        tagName: el.tagName,
                        className: el.className,
                        id: el.id,
                        offsetWidth: el.offsetWidth,
                        scrollWidth: el.scrollWidth,
                        computedWidth: getComputedStyle(el).width,
                        position: getComputedStyle(el).position
                    });
                }
            });
            
            return wide;
        });
        
        console.log('📏 ELEMENTS WIDER THAN VIEWPORT:', JSON.stringify(wideElements, null, 2));
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: './test-results/error-inventory.png' });
    }
    
    await browser.close();
}

testInventoryOverflow();