/* GRID4 PORTAL CONFIG UPDATER - Update PORTAL_EXTRA_JS setting */

const { chromium } = require('playwright');

const PORTAL_URL = 'https://portal.grid4voice.ucaas.tech';
const CONFIG_URL = 'https://portal.grid4voice.ucaas.tech/portal/uiconfigs/index/details/PORTAL_EXTRA_JS';
const NEW_SMART_LOADER_URL = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader.js';
const TEST_CREDENTIALS = {
    username: '1002@grid4voice',
    password: 'hQAFMdWXKNj4wAg'
};

async function updatePortalConfig() {
    console.log('🔧 Grid4 Config Updater - Updating PORTAL_EXTRA_JS...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for debugging
        slowMo: 2000,     // Slow down actions for visibility
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Capture console logs
    page.on('console', msg => {
        console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
    });
    
    try {
        console.log('🚀 Navigating to portal...');
        await page.goto(PORTAL_URL, { waitUntil: 'networkidle' });
        
        console.log('🔐 Attempting login...');
        
        // Wait for page to load and find login form
        await page.waitForTimeout(3000);
        
        // Take screenshot to see what we're dealing with
        await page.screenshot({ path: './debug-screenshots/login-page.png', fullPage: true });
        
        // Look for login fields with more generic selectors
        const loginSelectors = [
            'input[placeholder*="Login"]',
            'input[placeholder*="Username"]', 
            'input[placeholder*="Email"]',
            'input[type="text"]',
            'input[name*="user"]',
            'input[name*="login"]',
            'input[id*="user"]',
            'input[id*="login"]'
        ];
        
        let loginField = null;
        for (const selector of loginSelectors) {
            try {
                const field = page.locator(selector).first();
                if (await field.isVisible({ timeout: 2000 })) {
                    loginField = field;
                    console.log(`✅ Found login field with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!loginField) {
            // List all input fields for debugging
            const inputs = await page.locator('input').all();
            console.log(`Found ${inputs.length} input fields:`);
            for (let i = 0; i < Math.min(inputs.length, 10); i++) {
                const input = inputs[i];
                const name = await input.getAttribute('name') || 'no-name';
                const id = await input.getAttribute('id') || 'no-id';
                const type = await input.getAttribute('type') || 'no-type';
                const placeholder = await input.getAttribute('placeholder') || 'no-placeholder';
                console.log(`  ${i+1}. name="${name}" id="${id}" type="${type}" placeholder="${placeholder}"`);
            }
            throw new Error('Could not find login field');
        }
        
        await loginField.fill(TEST_CREDENTIALS.username);
        
        // Find password field
        const passwordSelectors = [
            'input[type="password"]',
            'input[placeholder*="Password"]',
            'input[name*="pass"]',
            'input[id*="pass"]'
        ];
        
        let passwordField = null;
        for (const selector of passwordSelectors) {
            try {
                const field = page.locator(selector).first();
                if (await field.isVisible({ timeout: 2000 })) {
                    passwordField = field;
                    console.log(`✅ Found password field with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue
            }
        }
        
        if (!passwordField) {
            throw new Error('Could not find password field');
        }
        
        await passwordField.fill(TEST_CREDENTIALS.password);
        
        // Submit login form
        console.log('📝 Submitting login...');
        await page.keyboard.press('Enter');
        
        // Wait for login to complete
        await page.waitForTimeout(5000);
        
        // Check if we're logged in by looking for dashboard elements
        const isLoggedIn = await page.locator('body').evaluate(body => {
            return !body.innerHTML.includes('Login Name') && 
                   (body.innerHTML.includes('Dashboard') || 
                    body.innerHTML.includes('Manager Portal') || 
                    body.innerHTML.includes('Platform Settings'));
        });
        
        if (!isLoggedIn) {
            throw new Error('Login failed - still on login page');
        }
        
        console.log('✅ Login successful!');
        
        console.log('🎯 Navigating to PORTAL_EXTRA_JS configuration...');
        await page.goto(CONFIG_URL, { waitUntil: 'networkidle' });
        
        await page.waitForTimeout(3000);
        
        // Look for the configuration form
        console.log('🔍 Looking for configuration form...');
        
        // Try different possible selectors for the value field
        const possibleSelectors = [
            'input[name="data[Uiconfig][value]"]',
            'textarea[name="data[Uiconfig][value]"]',
            'input[name="value"]',
            'textarea[name="value"]',
            '#UiconfigValue',
            '.form-control[name*="value"]',
            'input[type="text"]',
            'textarea'
        ];
        
        let valueField = null;
        for (const selector of possibleSelectors) {
            try {
                const field = page.locator(selector).first();
                if (await field.isVisible({ timeout: 1000 })) {
                    valueField = field;
                    console.log(`✅ Found value field with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!valueField) {
            console.log('❌ Could not find value field. Taking screenshot for analysis...');
            await page.screenshot({ path: './debug-screenshots/config-page.png', fullPage: true });
            
            // Log page content for debugging
            const pageContent = await page.content();
            console.log('Page title:', await page.title());
            console.log('Current URL:', page.url());
            
            // Look for any form elements
            const formElements = await page.locator('input, textarea, select').all();
            console.log(`Found ${formElements.length} form elements:`);
            
            for (let i = 0; i < Math.min(formElements.length, 10); i++) {
                const element = formElements[i];
                const tagName = await element.evaluate(el => el.tagName);
                const name = await element.getAttribute('name') || 'no-name';
                const id = await element.getAttribute('id') || 'no-id';
                const type = await element.getAttribute('type') || 'no-type';
                console.log(`  ${i+1}. ${tagName} name="${name}" id="${id}" type="${type}"`);
            }
            
            throw new Error('Could not locate the configuration value field');
        }
        
        // Get current value
        const currentValue = await valueField.inputValue();
        console.log(`📋 Current PORTAL_EXTRA_JS value: ${currentValue}`);
        
        // Clear and set new value
        console.log('🔄 Updating to smart loader URL...');
        await valueField.clear();
        await valueField.fill(NEW_SMART_LOADER_URL);
        
        // Verify the value was set
        const newValue = await valueField.inputValue();
        console.log(`✅ New value set: ${newValue}`);
        
        if (newValue !== NEW_SMART_LOADER_URL) {
            throw new Error('Failed to set new value correctly');
        }
        
        // Look for and click save button
        console.log('💾 Looking for save button...');
        
        const saveSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Save")',
            'input[value*="Save"]',
            '.btn-primary',
            '.btn-success',
            '#submit',
            'button.save'
        ];
        
        let saveButton = null;
        for (const selector of saveSelectors) {
            try {
                const button = page.locator(selector).first();
                if (await button.isVisible({ timeout: 1000 })) {
                    saveButton = button;
                    console.log(`✅ Found save button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!saveButton) {
            console.log('⚠️ Could not find save button. Taking screenshot...');
            await page.screenshot({ path: './debug-screenshots/save-button-search.png', fullPage: true });
            
            // Try to submit the form by pressing Enter
            console.log('⌨️ Trying to submit with Enter key...');
            await valueField.press('Enter');
        } else {
            console.log('🖱️ Clicking save button...');
            await saveButton.click();
        }
        
        // Wait for save to complete
        await page.waitForTimeout(3000);
        
        // Verify the change was saved
        console.log('🔍 Verifying configuration was saved...');
        await page.reload({ waitUntil: 'networkidle' });
        
        // Find the value field again and check its content
        let verifyField = null;
        for (const selector of possibleSelectors) {
            try {
                const field = page.locator(selector).first();
                if (await field.isVisible({ timeout: 1000 })) {
                    verifyField = field;
                    break;
                }
            } catch (e) {
                // Continue
            }
        }
        
        if (verifyField) {
            const savedValue = await verifyField.inputValue();
            console.log(`📋 Verified saved value: ${savedValue}`);
            
            if (savedValue === NEW_SMART_LOADER_URL) {
                console.log('🎉 SUCCESS! PORTAL_EXTRA_JS has been updated to the smart loader!');
                console.log(`✅ New configuration: ${NEW_SMART_LOADER_URL}`);
                
                // Take a success screenshot
                await page.screenshot({ path: './debug-screenshots/config-updated-success.png', fullPage: true });
                
                return true;
            } else {
                console.log('❌ Configuration was not saved correctly');
                return false;
            }
        } else {
            console.log('⚠️ Could not verify the saved configuration');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Configuration update failed:', error);
        
        // Take error screenshot
        await page.screenshot({ path: './debug-screenshots/config-error.png', fullPage: true });
        
        return false;
    } finally {
        await browser.close();
    }
}

// Run the config updater
if (require.main === module) {
    updatePortalConfig().then(success => {
        if (success) {
            console.log('\n🎉 Configuration update completed successfully!');
            console.log('🔄 The portal should now load the Grid4 smart loader.');
            console.log('🧪 Test with: https://portal.grid4voice.ucaas.tech/?grid4_version=v1');
            process.exit(0);
        } else {
            console.log('\n❌ Configuration update failed.');
            console.log('🔧 Manual update required in NetSapiens portal.');
            process.exit(1);
        }
    }).catch(error => {
        console.error('💥 Script crashed:', error);
        process.exit(1);
    });
}

module.exports = { updatePortalConfig };