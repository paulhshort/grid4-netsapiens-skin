const { chromium } = require('playwright');

const PORTAL_URL = 'https://portal.grid4voice.net/portal/home';
const USERNAME = '321@grid4.com';
const PASSWORD = '2107Cr00ks!';

async function analyzeModalStructure() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        // Navigate and login
        await page.goto(PORTAL_URL);
        await page.waitForLoadState('networkidle');
        
        // Login if needed
        const needsLogin = await page.locator('input[name="data[User][login]"]').isVisible().catch(() => false);
        if (needsLogin) {
            await page.fill('input[name="data[User][login]"]', USERNAME);
            await page.fill('input[name="data[User][password]"]', PASSWORD);
            await page.click('input[type="submit"][value="Login"]');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
        }
        
        // Test both themes
        for (const theme of ['light', 'dark']) {
            console.log(`\n========== TESTING ${theme.toUpperCase()} THEME ==========`);
            
            // Set theme
            const currentTheme = await page.evaluate(() => {
                const shell = document.querySelector('#grid4-app-shell');
                return shell?.classList.contains('theme-dark') ? 'dark' : 'light';
            });
            
            if (currentTheme !== theme) {
                await page.click('#grid4-theme-toggle');
                // Handle refresh dialog
                page.once('dialog', async dialog => {
                    await dialog.accept();
                });
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(3000);
            }
            
            // Open modal
            await page.click('li:has-text("Users")');
            await page.waitForTimeout(1000);
            await page.click('a:has-text("Add")');
            await page.waitForSelector('.modal.in', { timeout: 10000 });
            await page.waitForTimeout(1000);
            
            // Analyze DOM structure
            const analysis = await page.evaluate(() => {
                const modal = document.querySelector('.modal.in');
                const modalContent = document.querySelector('.modal-content');
                const body = document.body;
                const shell = document.querySelector('#grid4-app-shell');
                
                // Check CSS files loaded
                const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                    .map(link => link.href)
                    .filter(href => href.includes('grid4') || href.includes('MODAL'));
                
                // Check load order
                const modalFixCSS = document.querySelector('link[href*="MODAL-FIX-COMPREHENSIVE.css"]');
                const mainCSS = document.querySelector('link[href*="grid4-portal-skin-v5.0.11.css"]');
                
                return {
                    bodyClasses: body.className,
                    shellClasses: shell?.className || 'Shell not found',
                    modalLocation: modal ? (modal.parentElement === body ? 'Direct child of body' : 'Nested in: ' + modal.parentElement.tagName) : 'Modal not found',
                    modalClasses: modal?.className || 'Modal not found',
                    modalContentClasses: modalContent?.className || 'Modal content not found',
                    modalStyles: modalContent ? {
                        backgroundColor: window.getComputedStyle(modalContent).backgroundColor,
                        color: window.getComputedStyle(modalContent).color,
                        computedVars: {
                            '--g4-modal-bg-primary': getComputedStyle(body).getPropertyValue('--g4-modal-bg-primary'),
                            '--g4-modal-text': getComputedStyle(body).getPropertyValue('--g4-modal-text')
                        }
                    } : null,
                    cssFiles: cssFiles,
                    loadOrder: {
                        modalFixPosition: modalFixCSS ? Array.from(document.querySelectorAll('link')).indexOf(modalFixCSS) : -1,
                        mainCSSPosition: mainCSS ? Array.from(document.querySelectorAll('link')).indexOf(mainCSS) : -1
                    }
                };
            });
            
            console.log('DOM Analysis:', JSON.stringify(analysis, null, 2));
            
            // Check which CSS rules are actually applying
            const appliedRules = await page.evaluate(() => {
                const modalContent = document.querySelector('.modal-content');
                if (!modalContent) return 'No modal content found';
                
                const sheets = Array.from(document.styleSheets);
                const matchingRules = [];
                
                sheets.forEach(sheet => {
                    try {
                        const rules = Array.from(sheet.cssRules || sheet.rules || []);
                        rules.forEach(rule => {
                            if (rule.selectorText && modalContent.matches(rule.selectorText)) {
                                matchingRules.push({
                                    selector: rule.selectorText,
                                    styles: rule.style.cssText,
                                    source: sheet.href || 'inline'
                                });
                            }
                        });
                    } catch (e) {
                        // Cross-origin stylesheets will throw
                    }
                });
                
                return matchingRules;
            });
            
            console.log('\nApplied CSS Rules:', appliedRules);
            
            // Take screenshot
            await page.screenshot({ path: `modal-${theme}-debug.png`, fullPage: true });
            
            // Close modal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

analyzeModalStructure();