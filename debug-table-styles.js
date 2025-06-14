const { chromium } = require('playwright');

async function debugTableStyles() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
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
        
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/inventory', { 
            waitUntil: 'networkidle' 
        });
        
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.waitForTimeout(3000);
        
        // Get detailed table style analysis
        const tableAnalysis = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const mainTable = Array.from(tables).find(table => table.offsetWidth > 500);
            
            if (!mainTable) return { error: 'No main table found' };
            
            const computedStyle = getComputedStyle(mainTable);
            const wrapper = mainTable.closest('.wrapper, #content');
            const wrapperStyle = wrapper ? getComputedStyle(wrapper) : null;
            
            return {
                table: {
                    tagName: mainTable.tagName,
                    className: mainTable.className,
                    id: mainTable.id,
                    hasInlineStyle: !!mainTable.style.width,
                    inlineWidth: mainTable.style.width,
                    offsetWidth: mainTable.offsetWidth,
                    clientWidth: mainTable.clientWidth,
                    scrollWidth: mainTable.scrollWidth,
                    computedStyles: {
                        width: computedStyle.width,
                        maxWidth: computedStyle.maxWidth,
                        minWidth: computedStyle.minWidth,
                        tableLayout: computedStyle.tableLayout,
                        borderCollapse: computedStyle.borderCollapse,
                        overflow: computedStyle.overflow,
                        overflowX: computedStyle.overflowX,
                        display: computedStyle.display,
                        boxSizing: computedStyle.boxSizing
                    }
                },
                wrapper: wrapper ? {
                    tagName: wrapper.tagName,
                    className: wrapper.className,
                    offsetWidth: wrapper.offsetWidth,
                    clientWidth: wrapper.clientWidth,
                    scrollWidth: wrapper.scrollWidth,
                    computedStyles: {
                        width: wrapperStyle.width,
                        maxWidth: wrapperStyle.maxWidth,
                        overflow: wrapperStyle.overflow,
                        overflowX: wrapperStyle.overflowX,
                        marginLeft: wrapperStyle.marginLeft
                    }
                } : null,
                bodyHasGrid4Class: document.body.classList.contains('grid4-emergency-active'),
                cssLoadStatus: {
                    grid4StylesFound: !!document.querySelector('link[href*="grid4-emergency-hotfix"]'),
                    bodyClasses: document.body.className
                }
            };
        });
        
        console.log('🔍 TABLE STYLE ANALYSIS:');
        console.log(JSON.stringify(tableAnalysis, null, 2));
        
        // Try to force the table width manually as a test
        await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const mainTable = Array.from(tables).find(table => table.offsetWidth > 500);
            if (mainTable) {
                console.log('🔧 Forcing table width manually...');
                mainTable.style.width = '100%';
                mainTable.style.maxWidth = '100%';
                mainTable.style.tableLayout = 'fixed';
                mainTable.style.boxSizing = 'border-box';
                
                // Force wrapper constraints
                const wrapper = mainTable.closest('.wrapper, #content');
                if (wrapper) {
                    wrapper.style.overflowX = 'auto';
                    wrapper.style.maxWidth = '100%';
                }
            }
        });
        
        await page.waitForTimeout(2000);
        
        // Check if manual forcing worked
        const afterForcing = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const mainTable = Array.from(tables).find(table => table.className.includes('table'));
            return {
                bodyScrollWidth: document.body.scrollWidth,
                bodyOffsetWidth: document.body.offsetWidth,
                tableOffsetWidth: mainTable ? mainTable.offsetWidth : 'not found',
                overflow: document.body.scrollWidth > window.innerWidth
            };
        });
        
        console.log('\n📊 AFTER MANUAL FORCING:');
        console.log(JSON.stringify(afterForcing, null, 2));
        
        await page.screenshot({ path: './test-results/debug-styles-forced.png' });
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    
    await browser.close();
}

debugTableStyles();