const { chromium } = require('playwright');

async function debugTableFix() {
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
        
        // Navigate to inventory page
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        // Set small viewport to trigger overflow
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.waitForTimeout(3000);
        
        // Get console logs from the page
        const consoleLogs = [];
        page.on('console', msg => {
            if (msg.text().includes('Grid4')) {
                consoleLogs.push(msg.text());
            }
        });
        
        // Trigger table fixing manually
        await page.evaluate(() => {
            console.log('🔧 Manual table fixing trigger...');
            // Check if fixTableOverflow exists
            if (typeof window.fixTableOverflow === 'function') {
                window.fixTableOverflow();
            } else {
                console.log('❌ fixTableOverflow function not found on window');
            }
        });
        
        await page.waitForTimeout(2000);
        
        // Get detailed table analysis
        const analysis = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const tableData = [];
            
            tables.forEach((table, i) => {
                const wrapper = table.closest('.wrapper, .fixed-container, #content');
                tableData.push({
                    index: i,
                    tagName: table.tagName,
                    offsetWidth: table.offsetWidth,
                    classes: table.className,
                    wrapper: wrapper ? {
                        tagName: wrapper.tagName,
                        className: wrapper.className,
                        offsetWidth: wrapper.offsetWidth,
                        clientWidth: wrapper.clientWidth
                    } : null,
                    overflowDetected: wrapper ? table.offsetWidth > wrapper.clientWidth : false
                });
            });
            
            return {
                viewport: { width: window.innerWidth, height: window.innerHeight },
                tableCount: tables.length,
                tables: tableData,
                bodyScrollWidth: document.body.scrollWidth,
                bodyOffsetWidth: document.body.offsetWidth,
                hasBodyOverflow: document.body.scrollWidth > window.innerWidth
            };
        });
        
        console.log('🔍 TABLE DEBUG ANALYSIS:');
        console.log(JSON.stringify(analysis, null, 2));
        
        // Check if our CSS classes are working
        const cssStatus = await page.evaluate(() => {
            const table = document.querySelector('table');
            if (!table) return { error: 'No table found' };
            
            const computedStyle = getComputedStyle(table);
            return {
                display: computedStyle.display,
                width: computedStyle.width,
                maxWidth: computedStyle.maxWidth,
                overflowX: computedStyle.overflowX,
                tableLayout: computedStyle.tableLayout,
                classes: table.className
            };
        });
        
        console.log('🎨 CSS STATUS:', JSON.stringify(cssStatus, null, 2));
        
        await page.screenshot({ path: './test-results/debug-table-1024.png' });
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugTableFix();