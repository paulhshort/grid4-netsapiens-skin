/**
 * Grid4 NetSapiens Cross-Browser Compatibility Testing
 * 
 * This test suite validates that the Grid4 skin works consistently
 * across different browsers and ensures compatibility with older browsers
 * that might be used in enterprise environments.
 */

const { test, expect, devices } = require('@playwright/test');
const config = require('../test-automation/config');

// Browser configurations to test
const BROWSER_CONFIGS = [
    { name: 'chromium', userAgent: 'Chrome/91.0.4472.124' },
    { name: 'firefox', userAgent: 'Firefox/89.0' },
    { name: 'webkit', userAgent: 'Safari/14.1' }
];

// Device configurations for mobile testing
const DEVICE_CONFIGS = [
    'Desktop Chrome',
    'Desktop Firefox',
    'Desktop Safari',
    'iPhone 12',
    'iPad Pro',
    'Galaxy S21'
];

// Helper function to login
async function login(page) {
    await page.goto(config.portal.loginUrl);
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.fill('#username', config.portal.credentials.username);
    await page.fill('#password', config.portal.credentials.password);
    await page.click('input[type="submit"]');
    await page.waitForSelector('.content', { timeout: 15000 });
}

// Helper function to wait for Grid4 initialization
async function waitForGrid4(page) {
    await page.waitForFunction(() => {
        return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
    }, { timeout: 15000 });
}

// Helper function to check jQuery compatibility
async function checkJQueryCompatibility(page) {
    return await page.evaluate(() => {
        if (typeof $ === 'undefined') return { available: false };
        
        return {
            available: true,
            version: $.fn.jquery,
            isCompatible: parseFloat($.fn.jquery) >= 1.8,
            methods: {
                on: typeof $.fn.on === 'function',
                delegate: typeof $.fn.delegate === 'function',
                bind: typeof $.fn.bind === 'function'
            }
        };
    });
}

// Helper function to check CSS support
async function checkCSSSupport(page) {
    return await page.evaluate(() => {
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        const support = {
            customProperties: CSS.supports('color', 'var(--test)'),
            flexbox: CSS.supports('display', 'flex'),
            grid: CSS.supports('display', 'grid'),
            transforms: CSS.supports('transform', 'translateX(10px)'),
            transitions: CSS.supports('transition', 'all 0.3s'),
            borderRadius: CSS.supports('border-radius', '5px'),
            boxShadow: CSS.supports('box-shadow', '0 0 5px rgba(0,0,0,0.5)')
        };
        
        document.body.removeChild(testElement);
        return support;
    });
}

// Main cross-browser test suite
test.describe('Grid4 Cross-Browser Compatibility', () => {
    
    // Test core functionality across browsers
    for (const browserConfig of BROWSER_CONFIGS) {
        test(`Core Grid4 functionality - ${browserConfig.name}`, async ({ page, browserName }) => {
            test.skip(browserName !== browserConfig.name, `Skipping ${browserConfig.name} test on ${browserName}`);
            
            await login(page);
            await waitForGrid4(page);
            
            // Check Grid4 object exists and is initialized
            const grid4Status = await page.evaluate(() => {
                return {
                    exists: typeof window.Grid4NetSapiens !== 'undefined',
                    initialized: window.Grid4NetSapiens && window.Grid4NetSapiens.initialized,
                    version: window.Grid4NetSapiens ? window.Grid4NetSapiens.version : null,
                    moduleCount: window.Grid4NetSapiens ? Object.keys(window.Grid4NetSapiens.modules).length : 0
                };
            });
            
            expect(grid4Status.exists).toBe(true);
            expect(grid4Status.initialized).toBe(true);
            expect(grid4Status.version).toBeTruthy();
            expect(grid4Status.moduleCount).toBeGreaterThan(0);
            
            console.log(`${browserConfig.name} - Grid4 Status:`, grid4Status);
        });
        
        test(`jQuery compatibility - ${browserConfig.name}`, async ({ page, browserName }) => {
            test.skip(browserName !== browserConfig.name, `Skipping ${browserConfig.name} test on ${browserName}`);
            
            await login(page);
            
            const jqueryStatus = await checkJQueryCompatibility(page);
            
            expect(jqueryStatus.available).toBe(true);
            expect(jqueryStatus.isCompatible).toBe(true);
            expect(jqueryStatus.methods.bind).toBe(true); // Required for NetSapiens compatibility
            
            console.log(`${browserConfig.name} - jQuery Status:`, jqueryStatus);
        });
        
        test(`CSS support - ${browserConfig.name}`, async ({ page, browserName }) => {
            test.skip(browserName !== browserConfig.name, `Skipping ${browserConfig.name} test on ${browserName}`);
            
            await login(page);
            
            const cssSupport = await checkCSSSupport(page);
            
            // Essential CSS features for Grid4
            expect(cssSupport.customProperties).toBe(true);
            expect(cssSupport.flexbox).toBe(true);
            expect(cssSupport.transforms).toBe(true);
            expect(cssSupport.transitions).toBe(true);
            
            console.log(`${browserConfig.name} - CSS Support:`, cssSupport);
        });
    }
    
    // Test responsive design across devices
    for (const deviceName of DEVICE_CONFIGS) {
        test(`Responsive design - ${deviceName}`, async ({ page, browser }) => {
            // Use device emulation
            const device = devices[deviceName];
            if (device) {
                await page.setViewportSize(device.viewport);
                if (device.userAgent) {
                    await page.setUserAgent(device.userAgent);
                }
            }
            
            await login(page);
            await waitForGrid4(page);
            
            // Check responsive behavior
            const responsiveStatus = await page.evaluate(() => {
                const width = window.innerWidth;
                const isMobile = width <= 768;
                const isTablet = width > 768 && width <= 1024;
                const isDesktop = width > 1024;
                
                return {
                    viewport: { width: window.innerWidth, height: window.innerHeight },
                    isMobile: isMobile,
                    isTablet: isTablet,
                    isDesktop: isDesktop,
                    navigation: {
                        visible: document.querySelector('#navigation') ? 
                            window.getComputedStyle(document.querySelector('#navigation')).display !== 'none' : false,
                        mobileToggle: document.querySelector('.grid4-mobile-toggle') ? 
                            window.getComputedStyle(document.querySelector('.grid4-mobile-toggle')).display !== 'none' : false
                    }
                };
            });
            
            // Verify responsive behavior
            if (responsiveStatus.isMobile) {
                // Mobile should show toggle button
                expect(responsiveStatus.navigation.mobileToggle).toBe(true);
            } else {
                // Desktop/tablet should show navigation
                expect(responsiveStatus.navigation.visible).toBe(true);
            }
            
            console.log(`${deviceName} - Responsive Status:`, responsiveStatus);
        });
    }
    
    // Test JavaScript compatibility
    test('JavaScript ES5 compatibility', async ({ page }) => {
        await login(page);
        
        // Check for ES5 compatibility (no arrow functions, const/let, etc.)
        const jsCompatibility = await page.evaluate(() => {
            // Test that Grid4 code doesn't use ES6+ features that break in older browsers
            const grid4Source = window.Grid4NetSapiens ? window.Grid4NetSapiens.toString() : '';
            
            return {
                hasArrowFunctions: /=>/.test(grid4Source),
                hasConstLet: /(const|let)\s+/.test(grid4Source),
                hasTemplateStrings: /`/.test(grid4Source),
                hasSpreadOperator: /\.\.\./.test(grid4Source)
            };
        });
        
        // Grid4 should be ES5 compatible for NetSapiens
        expect(jsCompatibility.hasArrowFunctions).toBe(false);
        expect(jsCompatibility.hasConstLet).toBe(false);
        expect(jsCompatibility.hasTemplateStrings).toBe(false);
        
        console.log('JavaScript Compatibility:', jsCompatibility);
    });
    
    // Test CSS vendor prefixes
    test('CSS vendor prefix support', async ({ page }) => {
        await login(page);
        await waitForGrid4(page);
        
        const vendorPrefixSupport = await page.evaluate(() => {
            const testElement = document.createElement('div');
            document.body.appendChild(testElement);
            
            const style = testElement.style;
            const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
            
            const support = {
                transform: false,
                transition: false,
                borderRadius: false,
                boxShadow: false
            };
            
            // Test transform support
            for (const prefix of prefixes) {
                if (style[prefix + 'transform'] !== undefined) {
                    support.transform = true;
                    break;
                }
            }
            
            // Test transition support
            for (const prefix of prefixes) {
                if (style[prefix + 'transition'] !== undefined) {
                    support.transition = true;
                    break;
                }
            }
            
            // Test border-radius
            if (style.borderRadius !== undefined) {
                support.borderRadius = true;
            }
            
            // Test box-shadow
            if (style.boxShadow !== undefined) {
                support.boxShadow = true;
            }
            
            document.body.removeChild(testElement);
            return support;
        });
        
        // Essential CSS features should be supported
        expect(vendorPrefixSupport.transform).toBe(true);
        expect(vendorPrefixSupport.transition).toBe(true);
        expect(vendorPrefixSupport.borderRadius).toBe(true);
        expect(vendorPrefixSupport.boxShadow).toBe(true);
        
        console.log('Vendor Prefix Support:', vendorPrefixSupport);
    });
    
    // Test performance across browsers
    test('Performance consistency', async ({ page }) => {
        await login(page);
        
        const performanceMetrics = await page.evaluate(() => {
            const start = performance.now();
            
            // Wait for Grid4 to initialize
            return new Promise((resolve) => {
                const checkInit = () => {
                    if (window.Grid4NetSapiens && window.Grid4NetSapiens.initialized) {
                        const end = performance.now();
                        resolve({
                            initTime: end - start,
                            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                            loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
                        });
                    } else {
                        setTimeout(checkInit, 100);
                    }
                };
                checkInit();
            });
        });
        
        // Performance should be reasonable
        expect(performanceMetrics.initTime).toBeLessThan(5000); // 5 seconds max
        
        console.log('Performance Metrics:', performanceMetrics);
    });
});
