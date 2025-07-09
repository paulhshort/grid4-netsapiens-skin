/**
 * Test Modal Theming - Grid4 NetSapiens Portal
 * Tests modal appearance in both light and dark themes
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;

// Configuration
const PORTAL_URL = 'https://portal.grid4voice.net/portal/home';
const USERNAME = '321@grid4.com';
const PASSWORD = '2107Cr00ks!';
const SCREENSHOTS_DIR = './modal-theme-test-screenshots';

// Modal test scenarios
const MODAL_TESTS = [
    {
        name: 'add-user',
        menuPath: ['li:has-text("Users")', 'a:has-text("Add")'],
        modalTitle: 'Add a User',
        formElements: ['input[name="UserName"]', 'input[name="UserPassword"]']
    },
    {
        name: 'add-call-queue',
        menuPath: ['li:has-text("Call Center")', 'a:has-text("Call Queues")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add a Call Queue',
        formElements: ['input[name="QueueName"]', 'input[type="radio"]']
    },
    {
        name: 'add-timeframe',
        menuPath: ['li:has-text("System")', 'a:has-text("Schedules")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add a Domain Time Frame',
        formElements: ['input[name="TimeFrameName"]', 'input[type="radio"]']
    }
];

async function ensureDir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        console.log(`Directory ${dir} already exists or cannot be created`);
    }
}

async function login(page) {
    console.log('Logging in to portal...');
    await page.goto(PORTAL_URL);
    await page.waitForLoadState('networkidle');
    
    // Check if already logged in
    const loggedIn = await page.locator('#header-user').isVisible().catch(() => false);
    if (loggedIn) {
        console.log('Already logged in');
        return;
    }
    
    // Login
    await page.fill('input[name="login"]', USERNAME);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
}

async function setTheme(page, theme) {
    console.log(`Setting theme to: ${theme}`);
    
    // Check current theme
    const isDark = await page.evaluate(() => {
        return document.querySelector('#grid4-app-shell').classList.contains('theme-dark');
    });
    
    const needsSwitch = (theme === 'dark' && !isDark) || (theme === 'light' && isDark);
    
    if (needsSwitch) {
        // Click theme toggle
        await page.click('#grid4-theme-toggle');
        
        // Handle refresh dialog if it appears
        page.on('dialog', async dialog => {
            console.log('Handling theme refresh dialog...');
            await dialog.accept(); // Accept the refresh
        });
        
        // Wait for page to reload
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    }
}

async function testModalTheme(page, test, theme) {
    console.log(`\nTesting ${test.name} modal in ${theme} theme...`);
    
    try {
        // Navigate to the modal
        for (const selector of test.menuPath) {
            await page.waitForSelector(selector, { timeout: 10000 });
            await page.click(selector);
            await page.waitForTimeout(500);
        }
        
        // Wait for modal to appear
        await page.waitForSelector('.modal.in, .ui-dialog:visible', { timeout: 10000 });
        await page.waitForTimeout(1000); // Let animations complete
        
        // Take screenshot
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${SCREENSHOTS_DIR}/${theme}-${test.name}-${timestamp}.png`;
        await page.screenshot({ path: filename, fullPage: true });
        console.log(`Screenshot saved: ${filename}`);
        
        // Check modal styling
        const modalStyles = await page.evaluate(() => {
            const modal = document.querySelector('.modal-content') || document.querySelector('.ui-dialog');
            if (!modal) return null;
            
            const styles = window.getComputedStyle(modal);
            const header = modal.querySelector('.modal-header, .ui-dialog-titlebar');
            const input = modal.querySelector('input[type="text"], input[type="email"]');
            const label = modal.querySelector('label, .control-label');
            
            return {
                background: styles.backgroundColor,
                color: styles.color,
                border: styles.borderColor,
                headerBg: header ? window.getComputedStyle(header).backgroundColor : null,
                inputBg: input ? window.getComputedStyle(input).backgroundColor : null,
                inputColor: input ? window.getComputedStyle(input).color : null,
                labelBg: label ? window.getComputedStyle(label).backgroundColor : null,
                labelColor: label ? window.getComputedStyle(label).color : null
            };
        });
        
        console.log('Modal styles:', modalStyles);
        
        // Verify theme-appropriate colors
        if (theme === 'dark') {
            console.log('Checking dark theme colors...');
            // Dark theme should have dark backgrounds
            const isDarkBg = modalStyles.background.includes('36, 43, 58') || // #242b3a
                           modalStyles.background.includes('30, 39, 54');   // #1e2736
            const isLightText = modalStyles.color.includes('233, 236, 239'); // #e9ecef
            
            console.log(`Dark background: ${isDarkBg}, Light text: ${isLightText}`);
        } else {
            console.log('Checking light theme colors...');
            // Light theme should have white/light backgrounds
            const isLightBg = modalStyles.background.includes('255, 255, 255') || // #ffffff
                            modalStyles.background.includes('248, 249, 250');   // #f8f9fa
            const isDarkText = modalStyles.color.includes('33, 37, 41');       // #212529
            
            console.log(`Light background: ${isLightBg}, Dark text: ${isDarkText}`);
        }
        
        // Close modal
        const closeButton = await page.locator('.modal-header .close, .ui-dialog-titlebar-close').first();
        if (await closeButton.isVisible()) {
            await closeButton.click();
        } else {
            // ESC key as backup
            await page.keyboard.press('Escape');
        }
        
        await page.waitForTimeout(500);
        
    } catch (error) {
        console.error(`Error testing ${test.name}:`, error.message);
        
        // Try to close any open modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
    }
}

async function runTests() {
    console.log('Starting modal theme tests...');
    await ensureDir(SCREENSHOTS_DIR);
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        await login(page);
        
        // Test in both themes
        for (const theme of ['dark', 'light']) {
            await setTheme(page, theme);
            
            // Test each modal type
            for (const test of MODAL_TESTS) {
                await testModalTheme(page, test, theme);
                
                // Return to home page between tests
                await page.goto(PORTAL_URL);
                await page.waitForLoadState('networkidle');
            }
        }
        
        console.log('\nAll tests completed!');
        console.log(`Screenshots saved in: ${SCREENSHOTS_DIR}`);
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
runTests().catch(console.error);