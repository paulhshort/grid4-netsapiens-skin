const { chromium } = require('playwright');

async function finalValidation() {
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
        
        // Test multiple viewport sizes
        const viewports = [
            { width: 1920, height: 1080, name: 'Desktop Large' },
            { width: 1280, height: 720, name: 'Desktop Standard' },
            { width: 1024, height: 768, name: 'Tablet Landscape' },
            { width: 768, height: 1024, name: 'Tablet Portrait' }
        ];
        
        for (const viewport of viewports) {
            console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
            
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(2000);
            
            const analysis = await page.evaluate(() => {
                const body = document.body;
                const tables = document.querySelectorAll('table');
                const largestTable = Array.from(tables).reduce((largest, table) => 
                    table.offsetWidth > (largest?.offsetWidth || 0) ? table : largest, null);
                
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
                    largestTable: largestTable ? {
                        width: largestTable.offsetWidth,
                        columns: largestTable.querySelectorAll('th, tr:first-child td').length,
                        hasWrapper: !!largestTable.closest('.grid4-table-wrapper'),
                        wrapperOverflow: largestTable.closest('.wrapper, .grid4-table-wrapper') ? 
                            getComputedStyle(largestTable.closest('.wrapper, .grid4-table-wrapper')).overflowX : 'none'
                    } : null,
                    grid4Status: {
                        bodyClasses: body.className,
                        logoPresent: !!document.querySelector('.grid4-logo-replaced'),
                        darkTheme: getComputedStyle(body).backgroundColor.includes('rgb(26, 35, 50)')
                    }
                };
            });
            
            console.log(`   - Horizontal overflow: ${analysis.body.hasHorizontalOverflow ? '❌ YES' : '✅ NO'}`);
            console.log(`   - Table wrapper applied: ${analysis.largestTable?.hasWrapper ? '✅ YES' : '❌ NO'}`);
            console.log(`   - Wrapper overflow: ${analysis.largestTable?.wrapperOverflow}`);
            console.log(`   - Grid4 active: ${analysis.grid4Status.bodyClasses.includes('grid4-emergency-active') ? '✅ YES' : '❌ NO'}`);
            
            // Take screenshot for this viewport
            await page.screenshot({ 
                path: `./test-results/final-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
                fullPage: false // Show actual viewport
            });
        }
        
        console.log('\n🎯 FINAL VALIDATION COMPLETE - Check screenshots in test-results/');
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Final validation failed:', error.message);
        await page.screenshot({ path: './test-results/error-final.png' });
    }
    
    await browser.close();
}

finalValidation();