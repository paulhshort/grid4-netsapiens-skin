const { chromium } = require('playwright');

async function testEmergencyMinimal() {
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🚨 Testing emergency minimal CSS fix...');
        
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
        
        // Test basic functionality
        const basicTest = await page.evaluate(() => {
            return {
                contentVisible: !!document.querySelector('#content') && 
                               getComputedStyle(document.querySelector('#content')).display !== 'none',
                contentHasText: document.querySelector('#content')?.innerText?.length > 100,
                wrapperVisible: !!document.querySelector('.wrapper') && 
                               getComputedStyle(document.querySelector('.wrapper')).display !== 'none',
                tablesVisible: document.querySelectorAll('table').length > 0,
                versionSelector: !!document.querySelector('#grid4-version-indicator'),
                bodyBackground: getComputedStyle(document.body).backgroundColor,
                navigationBackground: document.querySelector('#navigation') ? 
                    getComputedStyle(document.querySelector('#navigation')).backgroundColor : 'N/A'
            };
        });
        
        console.log('\n🧪 EMERGENCY MINIMAL TEST RESULTS:');
        console.log('===================================');
        console.log(`Content Visible: ${basicTest.contentVisible ? '✅' : '❌'}`);
        console.log(`Content Has Text: ${basicTest.contentHasText ? '✅' : '❌'}`);
        console.log(`Wrapper Visible: ${basicTest.wrapperVisible ? '✅' : '❌'}`);
        console.log(`Tables Visible: ${basicTest.tablesVisible ? '✅' : '❌'}`);
        console.log(`Version Selector: ${basicTest.versionSelector ? '❌ PRESENT' : '✅ HIDDEN'}`);
        console.log(`Body Background: ${basicTest.bodyBackground}`);
        console.log(`Navigation Background: ${basicTest.navigationBackground}`);
        
        await page.screenshot({ 
            path: './test-results/emergency-minimal-test.png',
            fullPage: true 
        });
        
        // Test add/edit functionality
        console.log('\n🔧 Testing add/edit functionality...');
        
        // Look for add button and test it
        const addButtonTest = await page.evaluate(() => {
            // Find add buttons using multiple approaches
            let addButton = document.querySelector('button[onclick*="add"], a[href*="add"], .btn[onclick*="add"]');
            
            // If not found, try text-based search
            if (!addButton) {
                const buttons = Array.from(document.querySelectorAll('button, a, .btn'));
                addButton = buttons.find(btn => 
                    btn.innerText && btn.innerText.toLowerCase().includes('add')
                );
            }
            
            return {
                addButtonExists: !!addButton,
                addButtonText: addButton ? addButton.innerText : 'N/A',
                addButtonVisible: addButton ? getComputedStyle(addButton).display !== 'none' : false
            };
        });
        
        console.log(`Add Button Found: ${addButtonTest.addButtonExists ? '✅' : '❌'}`);
        console.log(`Add Button Text: ${addButtonTest.addButtonText}`);
        console.log(`Add Button Visible: ${addButtonTest.addButtonVisible ? '✅' : '❌'}`);
        
        if (addButtonTest.addButtonExists && addButtonTest.addButtonVisible) {
            try {
                await page.click('button[onclick*="add"], a[href*="add"], .btn[onclick*="add"]');
                await page.waitForTimeout(3000);
                
                const afterClick = await page.evaluate(() => {
                    return {
                        url: window.location.href,
                        contentVisible: !!document.querySelector('#content') && 
                                       getComputedStyle(document.querySelector('#content')).display !== 'none',
                        bodyHasContent: document.body.innerText.length > 100,
                        isBlankScreen: document.body.innerText.trim().length < 50
                    };
                });
                
                console.log('\n📊 AFTER CLICKING ADD:');
                console.log(`URL: ${afterClick.url}`);
                console.log(`Content Visible: ${afterClick.contentVisible ? '✅' : '❌'}`);
                console.log(`Body Has Content: ${afterClick.bodyHasContent ? '✅' : '❌'}`);
                console.log(`Is Blank Screen: ${afterClick.isBlankScreen ? '❌ YES' : '✅ NO'}`);
                
                await page.screenshot({ 
                    path: './test-results/emergency-minimal-after-add.png',
                    fullPage: true 
                });
                
            } catch (clickError) {
                console.log(`❌ Add button click failed: ${clickError.message}`);
            }
        }
        
        console.log('\n📸 Screenshots saved:');
        console.log('   - emergency-minimal-test.png');
        console.log('   - emergency-minimal-after-add.png');
        
    } catch (error) {
        console.error('❌ Emergency test failed:', error.message);
    }
    
    await browser.close();
}

testEmergencyMinimal();