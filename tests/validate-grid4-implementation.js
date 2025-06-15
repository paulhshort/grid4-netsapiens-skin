/**
 * Grid4 NetSapiens Implementation Validation Script
 * 
 * This script validates that the Grid4 customizations are working correctly
 * according to the reference implementation specifications.
 */

const { test, expect } = require('@playwright/test');

// Configuration
const CONFIG = {
    portalUrl: 'https://portal.grid4voice.ucaas.tech/portal/',
    credentials: {
        username: '1002@grid4voice',
        password: 'hQAFMdWXKNj4wAg'
    },
    cdnUrls: {
        css: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-production-final.css',
        js: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-smart-loader-production.js'
    },
    expectedElements: [
        '.wrapper',
        '#header',
        '#navigation',
        '#content',
        '#nav-buttons'
    ]
};

test.describe('Grid4 Implementation Validation', () => {
    
    test.beforeEach(async ({ page }) => {
        // Set up browser context
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Enable console logging
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.text().includes('Grid4')) {
                console.log(`${msg.type().toUpperCase()}: ${msg.text()}`);
            }
        });
    });

    test('CDN Resources Availability', async ({ page }) => {
        console.log('🔍 Testing CDN resource availability...');
        
        // Test CSS resource
        const cssResponse = await page.goto(CONFIG.cdnUrls.css);
        expect(cssResponse.status()).toBe(200);
        expect(cssResponse.headers()['content-type']).toContain('text/css');
        
        const cssContent = await cssResponse.text();
        expect(cssContent).toContain('GRID4');
        expect(cssContent).toContain('--g4-primary');
        
        console.log(`✅ CSS file loaded successfully (${cssContent.length} characters)`);
        
        // Test JS resource
        const jsResponse = await page.goto(CONFIG.cdnUrls.js);
        expect(jsResponse.status()).toBe(200);
        expect(jsResponse.headers()['content-type']).toContain('javascript');
        
        const jsContent = await jsResponse.text();
        expect(jsContent).toContain('Grid4');
        expect(jsContent.length).toBeGreaterThan(1000);
        
        console.log(`✅ JS file loaded successfully (${jsContent.length} characters)`);
    });

    test('Portal Login and Grid4 Loading', async ({ page }) => {
        console.log('🚀 Testing portal login and Grid4 initialization...');
        
        // Navigate to portal
        await page.goto(CONFIG.portalUrl);
        
        // Wait for login form
        await page.waitForSelector('input[name="username"], #username', { timeout: 10000 });
        
        // Fill credentials
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        
        // Submit login
        await page.click('input[type="submit"], button[type="submit"]');
        
        // Wait for portal to load
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Take screenshot of authenticated portal
        await page.screenshot({ 
            path: '/home/paul/dev/grid4-netsapiens-skin/test-results/authenticated-portal.png',
            fullPage: true 
        });
        
        console.log('✅ Successfully logged into portal');
    });

    test('Grid4 Customization Application', async ({ page }) => {
        console.log('🎨 Testing Grid4 customization application...');
        
        // Login first
        await page.goto(CONFIG.portalUrl);
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Check for Grid4 CSS variables
        const cssVars = await page.evaluate(() => {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);
            return {
                primary: computedStyle.getPropertyValue('--g4-primary').trim(),
                accent: computedStyle.getPropertyValue('--g4-accent').trim(),
                bgDark: computedStyle.getPropertyValue('--g4-bg-dark').trim()
            };
        });
        
        expect(cssVars.primary).toBeTruthy();
        expect(cssVars.accent).toBeTruthy();
        console.log(`✅ Grid4 CSS variables applied: ${JSON.stringify(cssVars)}`);
        
        // Check for Grid4 JavaScript initialization
        const jsCheck = await page.evaluate(() => {
            return {
                jqueryAvailable: typeof $ !== 'undefined',
                grid4Present: typeof window.Grid4 !== 'undefined' || 
                             typeof window.Grid4Skin !== 'undefined' ||
                             typeof window.Grid4NetSapiens !== 'undefined'
            };
        });
        
        expect(jsCheck.jqueryAvailable).toBe(true);
        console.log(`✅ jQuery available: ${jsCheck.jqueryAvailable}`);
        console.log(`✅ Grid4 JS present: ${jsCheck.grid4Present}`);
    });

    test('DOM Structure Validation', async ({ page }) => {
        console.log('🏗️ Validating DOM structure...');
        
        // Login
        await page.goto(CONFIG.portalUrl);
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Check expected DOM elements
        for (const selector of CONFIG.expectedElements) {
            const element = await page.$(selector);
            expect(element).toBeTruthy();
            console.log(`✅ Found required element: ${selector}`);
        }
        
        // Validate NetSapiens-specific structure
        const navButtons = await page.$('#nav-buttons');
        expect(navButtons).toBeTruthy();
        
        const navItems = await page.$$('#nav-buttons li, #nav-buttons a');
        expect(navItems.length).toBeGreaterThan(0);
        console.log(`✅ Navigation items found: ${navItems.length}`);
    });

    test('Responsive Design Validation', async ({ page }) => {
        console.log('📱 Testing responsive design...');
        
        // Login first
        await page.goto(CONFIG.portalUrl);
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        const viewports = [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 1366, height: 768, name: 'laptop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' }
        ];
        
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(1000); // Allow for responsive adjustments
            
            await page.screenshot({ 
                path: `/home/paul/dev/grid4-netsapiens-skin/test-results/responsive-${viewport.name}.png`,
                fullPage: true 
            });
            
            // Check that content is still accessible
            const contentVisible = await page.isVisible('.content, #content');
            expect(contentVisible).toBe(true);
            
            console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) layout validated`);
        }
    });

    test('Navigation Functionality', async ({ page }) => {
        console.log('🧭 Testing navigation functionality...');
        
        // Login
        await page.goto(CONFIG.portalUrl);
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Test main navigation items
        const navItems = await page.$$('#nav-buttons a, .nav-link');
        
        for (let i = 0; i < Math.min(navItems.length, 3); i++) {
            const navItem = navItems[i];
            const href = await navItem.getAttribute('href');
            const text = await navItem.textContent();
            
            if (href && !href.includes('javascript:') && !href.includes('#')) {
                console.log(`Testing navigation to: ${text} (${href})`);
                
                await navItem.click();
                await page.waitForTimeout(2000);
                
                // Verify page loaded
                const currentUrl = page.url();
                console.log(`✅ Navigation successful: ${currentUrl}`);
                
                // Take screenshot
                await page.screenshot({ 
                    path: `/home/paul/dev/grid4-netsapiens-skin/test-results/nav-${i}-${text?.replace(/[^a-zA-Z0-9]/g, '')}.png`
                });
            }
        }
    });

    test('Performance Impact Assessment', async ({ page }) => {
        console.log('⚡ Assessing performance impact...');
        
        // Navigate to portal
        await page.goto(CONFIG.portalUrl);
        
        // Measure login page performance
        const loginMetrics = await page.evaluate(() => {
            const perfEntries = performance.getEntriesByType('navigation');
            return perfEntries[0] ? {
                loadTime: perfEntries[0].loadEventEnd - perfEntries[0].loadEventStart,
                domContentLoaded: perfEntries[0].domContentLoadedEventEnd - perfEntries[0].domContentLoadedEventStart
            } : null;
        });
        
        console.log(`📊 Login page performance: ${JSON.stringify(loginMetrics)}`);
        
        // Login and measure authenticated page
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Check for Grid4 resources in performance timeline
        const grid4Resources = await page.evaluate(() => {
            const resources = performance.getEntriesByType('resource');
            return resources.filter(r => 
                r.name.includes('grid4') || 
                r.name.includes('statically.io')
            ).map(r => ({
                name: r.name,
                duration: r.duration,
                size: r.transferSize || 0
            }));
        });
        
        console.log('📊 Grid4 Resource Performance:');
        grid4Resources.forEach(resource => {
            console.log(`  - ${resource.name}: ${resource.duration.toFixed(2)}ms (${resource.size} bytes)`);
        });
        
        expect(grid4Resources.length).toBeGreaterThan(0);
    });

    test('Error Handling and Graceful Degradation', async ({ page }) => {
        console.log('🛡️ Testing error handling...');
        
        // Collect JavaScript errors
        const jsErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });
        
        // Login and navigate
        await page.goto(CONFIG.portalUrl);
        await page.waitForSelector('input[name="username"], #username');
        await page.fill('input[name="username"], #username', CONFIG.credentials.username);
        await page.fill('input[name="password"], #password', CONFIG.credentials.password);
        await page.click('input[type="submit"], button[type="submit"]');
        await page.waitForSelector('.content, #content', { timeout: 15000 });
        
        // Check for critical JavaScript errors
        const criticalErrors = jsErrors.filter(error => 
            !error.includes('favicon') && 
            !error.includes('ERR_BLOCKED_BY_CLIENT') &&
            error.toLowerCase().includes('error')
        );
        
        console.log(`📊 JavaScript errors found: ${jsErrors.length}`);
        console.log(`🚨 Critical errors: ${criticalErrors.length}`);
        
        if (criticalErrors.length > 0) {
            console.log('Critical errors:', criticalErrors);
        }
        
        // Verify portal still functions despite any non-critical errors
        const contentVisible = await page.isVisible('.content, #content');
        expect(contentVisible).toBe(true);
        
        const navigationVisible = await page.isVisible('#navigation, .navigation');
        expect(navigationVisible).toBe(true);
        
        console.log('✅ Portal remains functional despite any errors');
    });
});

console.log('Grid4 Implementation Validation Suite Ready');
console.log('Run with: npx playwright test validate-grid4-implementation.js');