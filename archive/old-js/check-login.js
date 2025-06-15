const { chromium } = require('playwright');

async function checkLogin() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/login');
        await page.waitForTimeout(3000);
        
        // Get login form structure
        const formInfo = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.map(input => ({
                type: input.type,
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                className: input.className
            }));
        });
        
        console.log('Login form inputs:', JSON.stringify(formInfo, null, 2));
        
        await page.screenshot({ path: './test-results/login-form.png' });
        console.log('Login form screenshot saved');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    await browser.close();
}

checkLogin();