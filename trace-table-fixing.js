const { chromium } = require('playwright');

async function traceTableFixing() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        // Capture all console messages
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push(msg.text());
            console.log('🖥️ CONSOLE:', msg.text());
        });
        
        // Login and navigate
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
            waitUntil: 'networkidle' 
        });
        await page.fill('#LoginUsername', '1002@grid4voice');
        await page.fill('#LoginPassword', 'hQAFMdWXKNj4wAg');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
            page.click('.btn.btn-large.color-primary')
        ]);
        
        console.log('\n📋 CONSOLE LOGS DURING LOGIN:');
        consoleLogs.forEach(log => console.log('  ', log));
        consoleLogs.length = 0; // Clear for navigation
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        console.log('\n📋 CONSOLE LOGS DURING INVENTORY LOAD:');
        consoleLogs.forEach(log => console.log('  ', log));
        
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.waitForTimeout(3000);
        
        // Check if our functions exist and call them manually
        const functionTest = await page.evaluate(() => {
            const results = [];
            
            // Check if our functions are available
            results.push('Grid4 script loaded: ' + (typeof window.Grid4 !== 'undefined'));
            
            // Look for our table function
            let functionFound = false;
            try {
                // Try to find the function in various scopes
                if (typeof fixTableOverflow !== 'undefined') {
                    results.push('fixTableOverflow found in global scope');
                    functionFound = true;
                } else {
                    results.push('fixTableOverflow NOT found in global scope');
                }
                
                // Look for it in window
                if (typeof window.fixTableOverflow !== 'undefined') {
                    results.push('fixTableOverflow found in window');
                    functionFound = true;
                }
                
                // Manual table fixing
                console.log('🔧 MANUAL TABLE FIXING ATTEMPT...');
                const tables = document.querySelectorAll('table');
                results.push(`Found ${tables.length} tables`);
                
                tables.forEach((table, index) => {
                    const wrapper = table.closest('.wrapper, .fixed-container, #content');
                    const tableWidth = table.offsetWidth;
                    const wrapperWidth = wrapper ? wrapper.clientWidth : window.innerWidth;
                    
                    if (tableWidth > wrapperWidth) {
                        results.push(`Table ${index} overflow detected (${tableWidth}px > ${wrapperWidth}px)`);
                        
                        // Add responsive classes
                        table.classList.add('grid4-responsive-table');
                        if (wrapper) {
                            wrapper.classList.add('grid4-table-wrapper');
                        }
                        
                        // Count columns
                        const columns = table.querySelectorAll('thead th, tbody tr:first-child td').length;
                        if (columns > 10) {
                            results.push(`Wide table detected (${columns} columns) - forcing styles`);
                            table.classList.add('grid4-wide-table');
                            
                            // Force styles
                            table.style.setProperty('width', '100%', 'important');
                            table.style.setProperty('max-width', '100%', 'important');
                            table.style.setProperty('min-width', '0', 'important');
                            table.style.setProperty('table-layout', 'fixed', 'important');
                            
                            results.push(`Forced styles on table ${index}`);
                            
                            // Check if it worked
                            const newWidth = table.offsetWidth;
                            results.push(`Table ${index} width after forcing: ${newWidth}px`);
                        }
                    }
                });
                
            } catch (error) {
                results.push('Error during manual fixing: ' + error.message);
            }
            
            return results;
        });
        
        console.log('\n🔧 MANUAL FUNCTION TEST RESULTS:');
        functionTest.forEach(result => console.log('  ', result));
        
        await page.waitForTimeout(2000);
        
        // Final overflow check
        const finalCheck = await page.evaluate(() => {
            return {
                bodyScrollWidth: document.body.scrollWidth,
                bodyOffsetWidth: document.body.offsetWidth,
                overflow: document.body.scrollWidth > window.innerWidth,
                tableOffsetWidths: Array.from(document.querySelectorAll('table')).map(t => t.offsetWidth),
                wrapperWidth: document.querySelector('.grid4-content-enhanced')?.offsetWidth || 'not found'
            };
        });
        
        console.log('\n📊 FINAL CHECK:', JSON.stringify(finalCheck, null, 2));
        
    } catch (error) {
        console.error('❌ Trace failed:', error.message);
    }
    
    await browser.close();
}

traceTableFixing();