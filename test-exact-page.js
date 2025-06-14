const { chromium } = require('playwright');

async function testExactPage() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized', '--disable-web-security']
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
        
        // Navigate to the exact URL from user screenshot
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        // Wait and scroll to make sure all content loads
        await page.waitForTimeout(3000);
        
        // Set viewport to match user's screenshot (wider view)
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(2000);
        
        // Take screenshot before analyzing
        await page.screenshot({ 
            path: './test-results/exact-page-wide.png',
            fullPage: true 
        });
        
        // Get the actual table that's causing overflow
        const tableAnalysis = await page.evaluate(() => {
            // Find the main data table (the one with inventory items)
            const dataTables = Array.from(document.querySelectorAll('table')).filter(table => {
                const rows = table.querySelectorAll('tr');
                return rows.length > 5; // Has actual data
            });
            
            if (dataTables.length === 0) return { error: 'No data tables found' };
            
            const mainTable = dataTables[dataTables.length - 1]; // Get the last/main table
            const wrapper = mainTable.closest('.wrapper, .fixed-container, #content');
            
            return {
                table: {
                    tagName: mainTable.tagName,
                    offsetWidth: mainTable.offsetWidth,
                    scrollWidth: mainTable.scrollWidth,
                    clientWidth: mainTable.clientWidth,
                    computedWidth: getComputedStyle(mainTable).width,
                    columns: mainTable.querySelectorAll('thead th').length,
                    rows: mainTable.querySelectorAll('tbody tr').length
                },
                wrapper: wrapper ? {
                    tagName: wrapper.tagName,
                    className: wrapper.className,
                    offsetWidth: wrapper.offsetWidth,
                    scrollWidth: wrapper.scrollWidth,
                    computedWidth: getComputedStyle(wrapper).width,
                    overflow: getComputedStyle(wrapper).overflow,
                    overflowX: getComputedStyle(wrapper).overflowX
                } : null,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                overflowDetected: mainTable.offsetWidth > (wrapper ? wrapper.clientWidth : window.innerWidth)
            };
        });
        
        console.log('📊 TABLE ANALYSIS:', JSON.stringify(tableAnalysis, null, 2));
        
        // Now test with a smaller viewport to reproduce the overflow
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(2000);
        
        const smallViewportAnalysis = await page.evaluate(() => {
            const body = document.body;
            const content = document.querySelector('#content');
            
            return {
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                body: {
                    scrollWidth: body.scrollWidth,
                    offsetWidth: body.offsetWidth,
                    hasHorizontalOverflow: body.scrollWidth > window.innerWidth
                },
                content: content ? {
                    scrollWidth: content.scrollWidth,
                    offsetWidth: content.offsetWidth,
                    hasOverflow: content.scrollWidth > content.offsetWidth
                } : null
            };
        });
        
        console.log('📱 SMALL VIEWPORT ANALYSIS:', JSON.stringify(smallViewportAnalysis, null, 2));
        
        await page.screenshot({ 
            path: './test-results/exact-page-small.png',
            fullPage: true 
        });
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: './test-results/error-exact.png' });
    }
    
    await browser.close();
}

testExactPage();