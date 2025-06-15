/**
 * Grid4 NetSapiens Deployment Validation Testing
 * 
 * This test suite validates that Grid4 customizations are properly deployed
 * and functioning correctly in the target environment.
 */

const { test, expect } = require('@playwright/test');
const config = require('../test-automation/config');

// CDN URLs to test
const CDN_URLS = {
    css: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css',
    js: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js',
    loader: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/dist/grid4-loader.js'
};

// Helper function to login
async function login(page) {
    await page.goto(config.portal.loginUrl);
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.fill('#username', config.portal.credentials.username);
    await page.fill('#password', config.portal.credentials.password);
    await page.click('input[type="submit"]');
    await page.waitForSelector('.content', { timeout: 15000 });
}

// Helper function to check CDN resource availability
async function checkCDNResource(page, url) {
    const response = await page.goto(url);
    return {
        url: url,
        status: response.status(),
        ok: response.ok(),
        headers: await response.allHeaders(),
        size: (await response.body()).length
    };
}

test.describe('Grid4 Deployment Validation', () => {
    
    test('CDN Resources Availability', async ({ page }) => {
        // Test CSS file
        const cssResult = await checkCDNResource(page, CDN_URLS.css);
        expect(cssResult.ok).toBe(true);
        expect(cssResult.status).toBe(200);
        expect(cssResult.size).toBeGreaterThan(1000); // Should have substantial content
        expect(cssResult.headers['content-type']).toContain('text/css');
        
        console.log('CSS CDN Status:', cssResult);
        
        // Test JavaScript file
        const jsResult = await checkCDNResource(page, CDN_URLS.js);
        expect(jsResult.ok).toBe(true);
        expect(jsResult.status).toBe(200);
        expect(jsResult.size).toBeGreaterThan(5000); // Should have substantial content
        expect(jsResult.headers['content-type']).toContain('javascript');
        
        console.log('JS CDN Status:', jsResult);
        
        // Test loader file if it exists
        try {
            const loaderResult = await checkCDNResource(page, CDN_URLS.loader);
            if (loaderResult.ok) {
                expect(loaderResult.status).toBe(200);
                console.log('Loader CDN Status:', loaderResult);
            }
        } catch (error) {
            console.log('Loader file not found (optional):', error.message);
        }
    });
    
    test('Grid4 CSS Injection Validation', async ({ page }) => {
        await login(page);
        
        // Check if Grid4 CSS is loaded
        const cssValidation = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            const grid4Link = links.find(link => link.href.includes('grid4-netsapiens.css'));
            
            if (!grid4Link) return { loaded: false };
            
            // Check CSS custom properties
            const root = document.documentElement;
            const computedStyle = window.getComputedStyle(root);
            
            return {
                loaded: true,
                href: grid4Link.href,
                customProperties: {
                    primaryDark: computedStyle.getPropertyValue('--grid4-primary-dark'),
                    accentBlue: computedStyle.getPropertyValue('--grid4-accent-blue'),
                    textPrimary: computedStyle.getPropertyValue('--grid4-text-primary'),
                    sidebarWidth: computedStyle.getPropertyValue('--grid4-sidebar-width')
                }
            };
        });
        
        expect(cssValidation.loaded).toBe(true);
        expect(cssValidation.href).toContain('grid4-netsapiens.css');
        expect(cssValidation.customProperties.primaryDark).toBeTruthy();
        expect(cssValidation.customProperties.accentBlue).toBeTruthy();
        
        console.log('CSS Injection Validation:', cssValidation);
    });
    
    test('Grid4 JavaScript Injection Validation', async ({ page }) => {
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        const jsValidation = await page.evaluate(() => {
            return {
                exists: typeof window.Grid4NetSapiens !== 'undefined',
                initialized: window.Grid4NetSapiens.initialized,
                version: window.Grid4NetSapiens.version,
                modules: Object.keys(window.Grid4NetSapiens.modules),
                config: window.Grid4NetSapiens.config
            };
        });
        
        expect(jsValidation.exists).toBe(true);
        expect(jsValidation.initialized).toBe(true);
        expect(jsValidation.version).toBeTruthy();
        expect(jsValidation.modules.length).toBeGreaterThan(0);
        
        console.log('JS Injection Validation:', jsValidation);
    });
    
    test('Grid4 Branding Application', async ({ page }) => {
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        // Check branding elements
        const brandingValidation = await page.evaluate(() => {
            const results = {
                logoReplacement: false,
                colorScheme: false,
                companyName: false,
                customStyling: false
            };
            
            // Check for logo replacement
            const logos = document.querySelectorAll('img[src*="logo"], .logo, [class*="logo"]');
            results.logoReplacement = logos.length > 0;
            
            // Check color scheme application
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            const bgColor = computedStyle.backgroundColor;
            results.colorScheme = bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
            
            // Check for Grid4 company name
            const textContent = document.body.textContent || '';
            results.companyName = textContent.includes('Grid4') || textContent.includes('Grid4 Communications');
            
            // Check for Grid4-specific CSS classes
            const grid4Classes = document.querySelectorAll('[class*="grid4"]');
            results.customStyling = grid4Classes.length > 0;
            
            return results;
        });
        
        expect(brandingValidation.colorScheme).toBe(true);
        expect(brandingValidation.customStyling).toBe(true);
        
        console.log('Branding Validation:', brandingValidation);
    });
    
    test('Grid4 Navigation Customization', async ({ page }) => {
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        // Check navigation customizations
        const navigationValidation = await page.evaluate(() => {
            const navigation = document.querySelector('#navigation, .navigation, .sidebar');
            if (!navigation) return { exists: false };
            
            const computedStyle = window.getComputedStyle(navigation);
            
            return {
                exists: true,
                backgroundColor: computedStyle.backgroundColor,
                width: computedStyle.width,
                position: computedStyle.position,
                hasGrid4Styling: navigation.classList.toString().includes('grid4') || 
                                computedStyle.getPropertyValue('--grid4-sidebar-width') !== ''
            };
        });
        
        expect(navigationValidation.exists).toBe(true);
        expect(navigationValidation.hasGrid4Styling).toBe(true);
        
        console.log('Navigation Validation:', navigationValidation);
    });
    
    test('Grid4 Responsive Behavior', async ({ page }) => {
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        // Test desktop view
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        
        const desktopValidation = await page.evaluate(() => {
            const navigation = document.querySelector('#navigation, .navigation, .sidebar');
            const mobileToggle = document.querySelector('.grid4-mobile-toggle, .mobile-toggle');
            
            return {
                navigationVisible: navigation ? window.getComputedStyle(navigation).display !== 'none' : false,
                mobileToggleHidden: mobileToggle ? window.getComputedStyle(mobileToggle).display === 'none' : true
            };
        });
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        const mobileValidation = await page.evaluate(() => {
            const navigation = document.querySelector('#navigation, .navigation, .sidebar');
            const mobileToggle = document.querySelector('.grid4-mobile-toggle, .mobile-toggle');
            
            return {
                mobileToggleVisible: mobileToggle ? window.getComputedStyle(mobileToggle).display !== 'none' : false,
                navigationCollapsed: navigation ? navigation.classList.contains('collapsed') || 
                                   window.getComputedStyle(navigation).transform !== 'none' : false
            };
        });
        
        expect(desktopValidation.navigationVisible).toBe(true);
        expect(mobileValidation.mobileToggleVisible).toBe(true);
        
        console.log('Desktop Validation:', desktopValidation);
        console.log('Mobile Validation:', mobileValidation);
    });
    
    test('Grid4 Performance Impact', async ({ page }) => {
        // Measure page load time without Grid4
        const baselineStart = Date.now();
        await page.goto(config.portal.loginUrl);
        await page.waitForSelector('#username');
        const baselineTime = Date.now() - baselineStart;
        
        // Login and measure with Grid4
        const grid4Start = Date.now();
        await login(page);
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        const grid4Time = Date.now() - grid4Start;
        
        const performanceMetrics = await page.evaluate(() => {
            return {
                timing: performance.timing,
                navigation: performance.navigation,
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                } : null
            };
        });
        
        // Performance should be reasonable
        expect(grid4Time).toBeLessThan(30000); // 30 seconds max
        
        console.log('Performance Metrics:', {
            baselineTime,
            grid4Time,
            overhead: grid4Time - baselineTime,
            performanceMetrics
        });
    });
    
    test('Grid4 Error Handling', async ({ page }) => {
        // Monitor console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        // Monitor network failures
        const networkErrors = [];
        page.on('response', response => {
            if (!response.ok() && response.url().includes('grid4')) {
                networkErrors.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        });
        
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        // Check for Grid4-specific errors
        const grid4Errors = await page.evaluate(() => {
            return window.Grid4Errors || [];
        });
        
        // Should have minimal errors
        expect(consoleErrors.filter(error => error.includes('Grid4')).length).toBeLessThan(3);
        expect(networkErrors.length).toBe(0);
        
        console.log('Console Errors:', consoleErrors);
        console.log('Network Errors:', networkErrors);
        console.log('Grid4 Errors:', grid4Errors);
    });
    
    test('Grid4 Configuration Validation', async ({ page }) => {
        await login(page);
        
        // Wait for Grid4 to initialize
        await page.waitForFunction(() => {
            return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
        }, { timeout: 15000 });
        
        const configValidation = await page.evaluate(() => {
            const config = window.Grid4NetSapiens.config;
            
            return {
                hasConfig: !!config,
                companyName: config.companyName,
                brandColor: config.brandColor,
                debug: config.debug,
                version: window.Grid4NetSapiens.version,
                requiredModules: ['branding', 'navigation', 'styling'].map(module => ({
                    name: module,
                    loaded: !!window.Grid4NetSapiens.modules[module]
                }))
            };
        });
        
        expect(configValidation.hasConfig).toBe(true);
        expect(configValidation.companyName).toBe('Grid4 Communications');
        expect(configValidation.brandColor).toBeTruthy();
        
        console.log('Configuration Validation:', configValidation);
    });
});
