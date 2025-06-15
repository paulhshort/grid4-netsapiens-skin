/**
 * Grid4 NetSapiens Visual Regression Testing
 * 
 * This test suite captures screenshots of key portal pages and compares them
 * against baseline images to detect visual regressions in the Grid4 skin.
 */

const { test, expect } = require('@playwright/test');
const config = require('../test-automation/config');

// Test configuration
const VIEWPORT_SIZES = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 1366, height: 768, name: 'laptop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
];

const PORTAL_PAGES = [
    { path: '/portal/home', name: 'home', waitFor: '.content' },
    { path: '/portal/users', name: 'users', waitFor: '.users-table' },
    { path: '/portal/callhistory', name: 'callhistory', waitFor: '.callhistory-table' },
    { path: '/portal/conferences', name: 'conferences', waitFor: '.conferences-table' },
    { path: '/portal/contacts', name: 'contacts', waitFor: '.contacts-table' },
    { path: '/portal/voicemails', name: 'voicemails', waitFor: '.voicemails-table' }
];

// Helper function to login and navigate
async function loginAndNavigate(page, path) {
    // Navigate to login page
    await page.goto(config.portal.loginUrl);
    
    // Wait for login form
    await page.waitForSelector('#username', { timeout: 10000 });
    
    // Fill login credentials
    await page.fill('#username', config.portal.credentials.username);
    await page.fill('#password', config.portal.credentials.password);
    
    // Submit login
    await page.click('input[type="submit"]');
    
    // Wait for successful login (home page or dashboard)
    await page.waitForSelector('.content', { timeout: 15000 });
    
    // Navigate to specific page if not home
    if (path !== '/portal/home') {
        await page.goto(config.portal.baseUrl + path);
    }
}

// Helper function to wait for Grid4 skin to load
async function waitForGrid4Skin(page) {
    // Wait for Grid4 JavaScript to initialize
    await page.waitForFunction(() => {
        return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
    }, { timeout: 10000 });
    
    // Wait for CSS to be applied
    await page.waitForFunction(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return computedStyle.getPropertyValue('--grid4-primary-dark') !== '';
    }, { timeout: 5000 });
    
    // Additional wait for animations to complete
    await page.waitForTimeout(1000);
}

// Helper function to hide dynamic content
async function hideDynamicContent(page) {
    await page.addStyleTag({
        content: `
            /* Hide dynamic content for consistent screenshots */
            .timestamp, .time, .date,
            .last-login, .last-activity,
            .call-duration, .call-time,
            .notification-badge,
            .loading, .spinner,
            .tooltip, .popover {
                visibility: hidden !important;
            }
            
            /* Hide user-specific content */
            .user-avatar, .user-name,
            .domain-specific,
            .session-info {
                visibility: hidden !important;
            }
            
            /* Stabilize animations */
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        `
    });
}

// Main test suite
test.describe('Grid4 NetSapiens Visual Regression Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for login
        test.setTimeout(60000);
        
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    });
    
    // Test each page at different viewport sizes
    for (const viewport of VIEWPORT_SIZES) {
        for (const portalPage of PORTAL_PAGES) {
            test(`${portalPage.name} page - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
                // Set viewport
                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                
                try {
                    // Login and navigate to page
                    await loginAndNavigate(page, portalPage.path);
                    
                    // Wait for page-specific content
                    if (portalPage.waitFor) {
                        await page.waitForSelector(portalPage.waitFor, { timeout: 10000 });
                    }
                    
                    // Wait for Grid4 skin to load
                    await waitForGrid4Skin(page);
                    
                    // Hide dynamic content
                    await hideDynamicContent(page);
                    
                    // Take screenshot
                    const screenshotName = `${portalPage.name}-${viewport.name}`;
                    await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
                        fullPage: true,
                        threshold: 0.2, // Allow 20% difference
                        maxDiffPixels: 1000
                    });
                    
                } catch (error) {
                    console.error(`Failed to test ${portalPage.name} at ${viewport.name}:`, error);
                    
                    // Take a screenshot of the error state for debugging
                    await page.screenshot({
                        path: `test-results/error-${portalPage.name}-${viewport.name}.png`,
                        fullPage: true
                    });
                    
                    throw error;
                }
            });
        }
    }
    
    // Test specific Grid4 components
    test('Grid4 Navigation Sidebar - Desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        await hideDynamicContent(page);
        
        // Focus on sidebar
        const sidebar = page.locator('#navigation');
        await expect(sidebar).toBeVisible();
        
        await expect(sidebar).toHaveScreenshot('grid4-sidebar.png');
    });
    
    test('Grid4 Header - Desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        await hideDynamicContent(page);
        
        // Focus on header
        const header = page.locator('.header, .navbar, .top-bar');
        if (await header.count() > 0) {
            await expect(header.first()).toHaveScreenshot('grid4-header.png');
        }
    });
    
    test('Grid4 Mobile Navigation - Mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        await hideDynamicContent(page);
        
        // Test mobile navigation toggle
        const mobileToggle = page.locator('.grid4-mobile-toggle');
        if (await mobileToggle.count() > 0) {
            await mobileToggle.click();
            await page.waitForTimeout(500);
            
            await expect(page).toHaveScreenshot('grid4-mobile-nav-open.png');
        }
    });
    
    // Test dark/light theme variations if available
    test('Grid4 Theme Variations', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        await hideDynamicContent(page);
        
        // Test default theme
        await expect(page).toHaveScreenshot('grid4-default-theme.png');
        
        // Test if theme switcher exists
        const themeSwitcher = page.locator('.theme-switcher, .grid4-theme-toggle');
        if (await themeSwitcher.count() > 0) {
            await themeSwitcher.click();
            await page.waitForTimeout(1000);
            
            await expect(page).toHaveScreenshot('grid4-alternate-theme.png');
        }
    });
});

// Test suite for Grid4-specific functionality
test.describe('Grid4 Component Testing', () => {
    
    test('Grid4 Branding Elements', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        
        // Check for Grid4 branding
        const brandingElements = [
            '.grid4-logo',
            '.grid4-branding',
            '[data-grid4-brand]'
        ];
        
        for (const selector of brandingElements) {
            const element = page.locator(selector);
            if (await element.count() > 0) {
                await expect(element.first()).toHaveScreenshot(`branding-${selector.replace(/[^a-z0-9]/gi, '-')}.png`);
            }
        }
    });
    
    test('Grid4 Color Scheme Consistency', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        await loginAndNavigate(page, '/portal/home');
        await waitForGrid4Skin(page);
        
        // Test CSS custom properties
        const colorProperties = await page.evaluate(() => {
            const root = document.documentElement;
            const computedStyle = window.getComputedStyle(root);
            
            return {
                primaryDark: computedStyle.getPropertyValue('--grid4-primary-dark'),
                accentBlue: computedStyle.getPropertyValue('--grid4-accent-blue'),
                textPrimary: computedStyle.getPropertyValue('--grid4-text-primary'),
                textSecondary: computedStyle.getPropertyValue('--grid4-text-secondary')
            };
        });
        
        // Verify color properties are set
        expect(colorProperties.primaryDark).toBeTruthy();
        expect(colorProperties.accentBlue).toBeTruthy();
        expect(colorProperties.textPrimary).toBeTruthy();
        expect(colorProperties.textSecondary).toBeTruthy();
        
        console.log('Grid4 Color Scheme:', colorProperties);
    });
});
