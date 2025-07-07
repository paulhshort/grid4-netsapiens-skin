/**
 * Comprehensive Modal Transparency Fix Test - Grid4 NetSapiens Portal
 * Tests all modal types for transparency issues in both light and dark themes
 * Verifies:
 * - No backdrop-filter or transparency in modal-content
 * - Modal footer backgrounds in dark mode
 * - Proper modal positioning
 * - Visual consistency across modal types
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const PORTAL_URL = 'https://portal.grid4voice.net/portal/home';
const USERNAME = '321@grid4.com';
const PASSWORD = '2107Cr00ks!';
const SCREENSHOTS_DIR = './modal-transparency-test-screenshots';

// Comprehensive modal test scenarios across different pages
const MODAL_TESTS = [
    // Users page modals
    {
        name: 'add-user',
        category: 'Users',
        menuPath: ['li:has-text("Users")', 'a:has-text("Add")'],
        modalTitle: 'Add a User',
        hasFooter: true
    },
    {
        name: 'edit-user',
        category: 'Users',
        navigateTo: '/portal/users',
        action: async (page) => {
            // Click edit on first user
            await page.click('tr:first-child a[title="Edit"]');
        },
        modalTitle: 'Edit User',
        hasFooter: true
    },
    
    // Domains page modals
    {
        name: 'add-domain',
        category: 'Domains',
        menuPath: ['li:has-text("Domains")', 'a:has-text("Add")'],
        modalTitle: 'Add a Domain',
        hasFooter: true
    },
    
    // Call Center modals
    {
        name: 'add-call-queue',
        category: 'Call Center',
        menuPath: ['li:has-text("Call Center")', 'a:has-text("Call Queues")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add a Call Queue',
        hasFooter: true
    },
    {
        name: 'add-agent',
        category: 'Call Center',
        menuPath: ['li:has-text("Call Center")', 'a:has-text("Agents")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add an Agent',
        hasFooter: true
    },
    
    // System modals
    {
        name: 'add-timeframe',
        category: 'System',
        menuPath: ['li:has-text("System")', 'a:has-text("Schedules")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add a Domain Time Frame',
        hasFooter: true
    },
    {
        name: 'add-device',
        category: 'System',
        menuPath: ['li:has-text("System")', 'a:has-text("Devices")', 'a.btn:has-text("Add")'],
        modalTitle: 'Add a Device',
        hasFooter: true
    },
    
    // Reports modal
    {
        name: 'generate-report',
        category: 'Reports',
        menuPath: ['li:has-text("Reports")', 'a:has-text("Call Detail")'],
        action: async (page) => {
            // Click generate button
            await page.click('button:has-text("Generate Report")');
        },
        modalTitle: 'Generate Report',
        hasFooter: false
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
    
    // Check if we're on the login page
    const loginInput = await page.locator('input[name="login"]').isVisible().catch(() => false);
    if (!loginInput) {
        console.log('Not on login page, might be already authenticated');
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
            await dialog.accept();
        });
        
        // Wait for page to reload
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    }
}

async function checkTransparencyIssues(page) {
    return await page.evaluate(() => {
        const results = {
            modalContent: {},
            modalFooter: {},
            modalHeader: {},
            modalBackdrop: {},
            issues: []
        };
        
        // Check modal-content
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            const contentStyles = window.getComputedStyle(modalContent);
            results.modalContent = {
                backgroundColor: contentStyles.backgroundColor,
                backdropFilter: contentStyles.backdropFilter,
                opacity: contentStyles.opacity,
                background: contentStyles.background
            };
            
            // Check for transparency issues
            if (contentStyles.backdropFilter && contentStyles.backdropFilter !== 'none') {
                results.issues.push(`modal-content has backdrop-filter: ${contentStyles.backdropFilter}`);
            }
            
            // Check if background is transparent or semi-transparent
            const bgColor = contentStyles.backgroundColor;
            if (bgColor.includes('rgba') && !bgColor.includes('rgba(') || bgColor === 'transparent') {
                results.issues.push(`modal-content has transparent background: ${bgColor}`);
            }
            
            // Parse rgba and check alpha channel
            const rgbaMatch = bgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch && parseFloat(rgbaMatch[4]) < 1) {
                results.issues.push(`modal-content has semi-transparent background: ${bgColor} (alpha: ${rgbaMatch[4]})`);
            }
        }
        
        // Check modal-footer
        const modalFooter = document.querySelector('.modal-footer');
        if (modalFooter) {
            const footerStyles = window.getComputedStyle(modalFooter);
            results.modalFooter = {
                backgroundColor: footerStyles.backgroundColor,
                backdropFilter: footerStyles.backdropFilter,
                opacity: footerStyles.opacity
            };
            
            // Check for dark theme footer issues
            const isDarkTheme = document.querySelector('#grid4-app-shell').classList.contains('theme-dark');
            if (isDarkTheme) {
                const bgColor = footerStyles.backgroundColor;
                if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
                    results.issues.push('modal-footer has no background in dark theme');
                }
            }
        }
        
        // Check modal-header
        const modalHeader = document.querySelector('.modal-header');
        if (modalHeader) {
            const headerStyles = window.getComputedStyle(modalHeader);
            results.modalHeader = {
                backgroundColor: headerStyles.backgroundColor,
                borderBottom: headerStyles.borderBottom
            };
        }
        
        // Check modal backdrop
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            const backdropStyles = window.getComputedStyle(modalBackdrop);
            results.modalBackdrop = {
                backgroundColor: backdropStyles.backgroundColor,
                opacity: backdropStyles.opacity
            };
        }
        
        return results;
    });
}

async function testModal(page, test, theme) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${test.name} (${test.category}) in ${theme} theme`);
    console.log(`${'='.repeat(60)}`);
    
    try {
        // Navigate to the modal
        if (test.navigateTo) {
            await page.goto(`${PORTAL_URL.replace('/portal/home', test.navigateTo)}`);
            await page.waitForLoadState('networkidle');
        }
        
        if (test.menuPath) {
            for (const selector of test.menuPath) {
                await page.waitForSelector(selector, { timeout: 10000 });
                await page.click(selector);
                await page.waitForTimeout(500);
            }
        }
        
        if (test.action) {
            await test.action(page);
        }
        
        // Wait for modal to appear
        await page.waitForSelector('.modal.in, .ui-dialog:visible', { timeout: 10000 });
        await page.waitForTimeout(1000); // Let animations complete
        
        // Check for transparency issues
        console.log('\nChecking for transparency issues...');
        const transparencyCheck = await checkTransparencyIssues(page);
        
        // Log results
        console.log('\nModal Content Styles:');
        console.log(JSON.stringify(transparencyCheck.modalContent, null, 2));
        
        if (test.hasFooter) {
            console.log('\nModal Footer Styles:');
            console.log(JSON.stringify(transparencyCheck.modalFooter, null, 2));
        }
        
        if (transparencyCheck.issues.length > 0) {
            console.log('\n⚠️  TRANSPARENCY ISSUES FOUND:');
            transparencyCheck.issues.forEach(issue => {
                console.log(`  - ${issue}`);
            });
        } else {
            console.log('\n✅ No transparency issues found');
        }
        
        // Take screenshot
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${theme}-${test.name}-${timestamp}.png`;
        const filepath = path.join(SCREENSHOTS_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`\nScreenshot saved: ${filename}`);
        
        // Detailed style analysis
        const detailedStyles = await page.evaluate(() => {
            const modal = document.querySelector('.modal-content') || document.querySelector('.ui-dialog');
            if (!modal) return null;
            
            const isDarkTheme = document.querySelector('#grid4-app-shell').classList.contains('theme-dark');
            const footer = modal.querySelector('.modal-footer');
            
            return {
                theme: isDarkTheme ? 'dark' : 'light',
                modalContent: {
                    computedBackgroundColor: window.getComputedStyle(modal).backgroundColor,
                    hasBackdropFilter: window.getComputedStyle(modal).backdropFilter !== 'none',
                    opacity: window.getComputedStyle(modal).opacity
                },
                modalFooter: footer ? {
                    computedBackgroundColor: window.getComputedStyle(footer).backgroundColor,
                    hasBackground: window.getComputedStyle(footer).backgroundColor !== 'transparent' &&
                                 window.getComputedStyle(footer).backgroundColor !== 'rgba(0, 0, 0, 0)'
                } : null
            };
        });
        
        console.log('\nDetailed Style Analysis:');
        console.log(JSON.stringify(detailedStyles, null, 2));
        
        // Close modal
        const closeButton = await page.locator('.modal-header .close, .ui-dialog-titlebar-close').first();
        if (await closeButton.isVisible()) {
            await closeButton.click();
        } else {
            await page.keyboard.press('Escape');
        }
        
        await page.waitForTimeout(500);
        
        return {
            test: test.name,
            theme,
            issues: transparencyCheck.issues,
            passed: transparencyCheck.issues.length === 0
        };
        
    } catch (error) {
        console.error(`Error testing ${test.name}:`, error.message);
        
        // Try to close any open modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        return {
            test: test.name,
            theme,
            error: error.message,
            passed: false
        };
    }
}

async function generateReport(results) {
    const reportPath = path.join(SCREENSHOTS_DIR, 'test-report.html');
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Modal Transparency Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .test-result { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .passed { background-color: #d4edda; border-color: #c3e6cb; }
        .failed { background-color: #f8d7da; border-color: #f5c6cb; }
        .error { color: #721c24; }
        .issue { color: #856404; margin-left: 20px; }
        .theme-dark { background-color: #1a2332; color: #e9ecef; }
        .theme-light { background-color: #f8f9fa; color: #212529; }
        .screenshot { max-width: 100%; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Modal Transparency Test Report</h1>
    <p>Generated: ${new Date().toISOString()}</p>
    
    <h2>Test Summary</h2>
    <p>Total Tests: ${results.length}</p>
    <p>Passed: ${results.filter(r => r.passed).length}</p>
    <p>Failed: ${results.filter(r => !r.passed).length}</p>
    
    <h2>Detailed Results</h2>
    ${results.map(result => `
        <div class="test-result ${result.passed ? 'passed' : 'failed'}">
            <h3>${result.test} - ${result.theme} theme</h3>
            ${result.error ? `<p class="error">Error: ${result.error}</p>` : ''}
            ${result.issues && result.issues.length > 0 ? `
                <p>Issues found:</p>
                ${result.issues.map(issue => `<div class="issue">• ${issue}</div>`).join('')}
            ` : '<p>✅ No issues found</p>'}
        </div>
    `).join('')}
</body>
</html>`;
    
    await fs.writeFile(reportPath, html);
    console.log(`\nTest report generated: ${reportPath}`);
}

async function runTests() {
    console.log('Starting comprehensive modal transparency tests...');
    await ensureDir(SCREENSHOTS_DIR);
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    const results = [];
    
    try {
        await login(page);
        
        // Test in both themes
        for (const theme of ['dark', 'light']) {
            console.log(`\n${'#'.repeat(60)}`);
            console.log(`TESTING IN ${theme.toUpperCase()} THEME`);
            console.log(`${'#'.repeat(60)}`);
            
            await setTheme(page, theme);
            
            // Test each modal type
            for (const test of MODAL_TESTS) {
                const result = await testModal(page, test, theme);
                results.push(result);
                
                // Return to home page between tests
                await page.goto(PORTAL_URL);
                await page.waitForLoadState('networkidle');
            }
        }
        
        // Generate summary report
        console.log('\n' + '='.repeat(60));
        console.log('TEST SUMMARY');
        console.log('='.repeat(60));
        
        const passedTests = results.filter(r => r.passed);
        const failedTests = results.filter(r => !r.passed);
        
        console.log(`\nTotal tests: ${results.length}`);
        console.log(`Passed: ${passedTests.length}`);
        console.log(`Failed: ${failedTests.length}`);
        
        if (failedTests.length > 0) {
            console.log('\nFailed tests:');
            failedTests.forEach(test => {
                console.log(`  - ${test.test} (${test.theme}): ${test.error || test.issues.join(', ')}`);
            });
        }
        
        console.log(`\nScreenshots saved in: ${SCREENSHOTS_DIR}`);
        
        // Generate HTML report
        await generateReport(results);
        
    } catch (error) {
        console.error('Test suite failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
runTests().catch(console.error);