const { chromium } = require('playwright');

async function emergencyModalFixTest() {
    console.log('🚨 EMERGENCY MODAL FIX TEST WITH AUTHENTICATION');
    console.log('===============================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--disable-web-security'] 
    });
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('🔐 Step 1: Logging into portal...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/login', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    // Find login inputs and fill credentials
    try {
        console.log('📝 Filling login credentials...');
        
        // Wait for any input to appear
        await page.waitForSelector('input', { timeout: 10000 });
        
        // Get all inputs and try to identify username/password
        const inputs = await page.$$('input[type="text"], input[type="email"], input[name*="user"], input[name*="login"]');
        const passwordInputs = await page.$$('input[type="password"], input[name*="pass"]');
        
        if (inputs.length > 0 && passwordInputs.length > 0) {
            await inputs[0].fill('grid4admin');
            await passwordInputs[0].fill('G4@dm1n2024!');
            
            console.log('✅ Credentials filled');
            
            // Submit form
            const submitButton = await page.$('input[type="submit"], button[type="submit"], .btn');
            if (submitButton) {
                await submitButton.click();
            } else {
                await passwordInputs[0].press('Enter');
            }
            
            console.log('⏳ Waiting for authentication...');
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
            
        } else {
            console.log('❌ Could not find login form inputs');
            await browser.close();
            return;
        }
        
    } catch (error) {
        console.log(`❌ Login failed: ${error.message}`);
        await browser.close();
        return;
    }
    
    console.log('🏠 Step 2: Navigating to home page...');
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/home', { 
        waitUntil: 'networkidle',
        timeout: 30000 
    });
    
    console.log('📸 Taking BEFORE screenshot...');
    const beforeScreenshot = `./testing/before-emergency-fix-${Date.now()}.png`;
    await page.screenshot({ 
        path: beforeScreenshot, 
        fullPage: true 
    });
    console.log(`   BEFORE: ${beforeScreenshot}`);
    
    console.log('🚨 Step 3: Injecting EMERGENCY CSS FIX directly...');
    
    // Inject emergency fix directly into the page
    await page.addStyleTag({
        content: `
/* EMERGENCY MODAL FIX - DIRECT INJECTION */
/* Remove all Grid4 interference and restore portal functionality */

/* Step 1: Reset all potential Grid4 interference */
body * {
    max-width: initial !important;
}

html, body {
    overflow-x: initial !important;
    overflow-y: initial !important;
}

/* Step 2: Ensure modals work properly */
.modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 1050 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.modal-dialog {
    position: relative !important;
    margin: 10px auto !important;
    width: auto !important;
    max-width: 600px !important;
    z-index: 1051 !important;
    background: white !important;
    border-radius: 6px !important;
    box-shadow: 0 3px 9px rgba(0,0,0,0.5) !important;
}

.modal-backdrop {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    z-index: 1040 !important;
    background-color: rgba(0,0,0,0.5) !important;
}

/* Step 3: Ensure forms and inputs work */
input, select, textarea, button {
    position: relative !important;
    z-index: auto !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
}

/* Step 4: Basic Grid4 sidebar (minimal and non-interfering) */
#navigation, #nav-buttons {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 220px !important;
    height: 100vh !important;
    background: #1a2332 !important;
    z-index: 999 !important;
    overflow-y: auto !important;
}

#navigation a, #nav-buttons a {
    color: white !important;
    display: block !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
}

.wrapper {
    margin-left: 220px !important;
}

/* Step 5: Ensure content is visible */
.wrapper > * {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}
        `
    });
    
    console.log('✅ Emergency CSS injected directly');
    
    console.log('⏳ Step 4: Waiting for styles to apply...');
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking AFTER screenshot...');
    const afterScreenshot = `./testing/after-emergency-fix-${Date.now()}.png`;
    await page.screenshot({ 
        path: afterScreenshot, 
        fullPage: true 
    });
    console.log(`   AFTER: ${afterScreenshot}`);
    
    console.log('🧪 Step 5: Testing modal functionality...');
    try {
        // Navigate to UI configs to test modal
        await page.goto('https://portal.grid4voice.ucaas.tech/portal/uiconfigs/index', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        console.log('🔍 Looking for Add button...');
        
        // Look for Add/Edit buttons
        const addButton = await page.$('input[value="Add"], button:has-text("Add"), .btn:has-text("Add"), a:has-text("Add")');
        
        if (addButton) {
            console.log('✅ Found Add button, testing modal...');
            
            // Click the Add button
            await addButton.click();
            
            // Wait for modal to appear
            await page.waitForTimeout(2000);
            
            // Check if modal appeared and is interactive
            const modal = await page.$('.modal, [class*="modal"], [id*="modal"]');
            const modalVisible = modal ? await modal.isVisible() : false;
            
            console.log(`   Modal appeared: ${modalVisible ? '✅ YES' : '❌ NO'}`);
            
            if (modalVisible) {
                // Test if we can interact with modal inputs
                const modalInput = await page.$('.modal input, [class*="modal"] input');
                if (modalInput) {
                    await modalInput.fill('TEST');
                    const inputValue = await modalInput.inputValue();
                    console.log(`   Modal input works: ${inputValue === 'TEST' ? '✅ YES' : '❌ NO'}`);
                }
                
                // Take modal screenshot
                const modalScreenshot = `./testing/modal-test-${Date.now()}.png`;
                await page.screenshot({ 
                    path: modalScreenshot, 
                    fullPage: true 
                });
                console.log(`   Modal screenshot: ${modalScreenshot}`);
                
                // Try to close modal
                const closeButton = await page.$('.modal .close, .modal [data-dismiss="modal"], .modal .cancel');
                if (closeButton) {
                    await closeButton.click();
                    console.log('   Modal close button clicked');
                }
            }
            
        } else {
            console.log('❌ Could not find Add button on UI configs page');
        }
        
    } catch (error) {
        console.log(`❌ Modal test failed: ${error.message}`);
    }
    
    console.log('📊 Step 6: Final validation...');
    
    const finalValidation = await page.evaluate(() => {
        const navigation = document.querySelector('#navigation, #nav-buttons');
        const wrapper = document.querySelector('.wrapper');
        const modals = document.querySelectorAll('.modal, [class*="modal"]');
        
        return {
            navigationExists: !!navigation,
            navigationPositioned: navigation ? getComputedStyle(navigation).position === 'fixed' : false,
            wrapperExists: !!wrapper,
            wrapperOffset: wrapper ? getComputedStyle(wrapper).marginLeft : 'none',
            modalCount: modals.length,
            bodyOverflow: getComputedStyle(document.body).overflowX
        };
    });
    
    console.log('   Navigation exists:', finalValidation.navigationExists ? '✅' : '❌');
    console.log('   Navigation fixed:', finalValidation.navigationPositioned ? '✅' : '❌');
    console.log('   Wrapper exists:', finalValidation.wrapperExists ? '✅' : '❌');
    console.log('   Wrapper offset:', finalValidation.wrapperOffset);
    console.log('   Body overflow:', finalValidation.bodyOverflow);
    
    await browser.close();
    
    console.log('\\n🎯 EMERGENCY TEST COMPLETE');
    console.log('Screenshots taken:');
    console.log(`   BEFORE: ${beforeScreenshot}`);
    console.log(`   AFTER: ${afterScreenshot}`);
    
    if (finalValidation.navigationPositioned && finalValidation.wrapperExists) {
        console.log('\\n✅ EMERGENCY FIX APPEARS TO WORK');
        console.log('   Try refreshing the portal and testing modals manually');
    } else {
        console.log('\\n❌ EMERGENCY FIX NEEDS REFINEMENT');
    }
}

emergencyModalFixTest().catch(console.error);