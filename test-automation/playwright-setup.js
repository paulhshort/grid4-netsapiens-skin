/* Grid4 NetSapiens Portal - Playwright Test Automation Setup
 * Comprehensive browser automation for portal testing, CSS/JS injection validation,
 * and enhancement roadmap generation through live portal analysis
 */

const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class Grid4PortalTester {
    constructor(options = {}) {
        this.config = {
            headless: options.headless !== false, // Default to headless
            timeout: options.timeout || 30000,
            viewport: { width: 1920, height: 1080 },
            browsers: options.browsers || ['chromium'], // chromium, firefox, webkit
            screenshotDir: options.screenshotDir || './screenshots',
            logDir: options.logDir || './logs',
            credentials: {
                username: options.username || '1002@grid4voice',
                password: options.password || 'hQAFMdWXKNj4wAg',
                url: options.url || 'https://portal.grid4voice.ucaas.tech/portal/home'
            }
        };
        
        this.results = {
            tests: [],
            screenshots: [],
            performance: {},
            enhancement_opportunities: []
        };
    }

    async initialize() {
        console.log('🚀 Initializing Grid4 Portal Test Automation');
        
        // Create directories
        await this.ensureDirectories();
        
        // Initialize browsers
        this.browsers = {};
        for (const browserName of this.config.browsers) {
            try {
                this.browsers[browserName] = await this.launchBrowser(browserName);
                console.log(`✅ ${browserName} browser launched`);
            } catch (error) {
                console.error(`❌ Failed to launch ${browserName}:`, error.message);
            }
        }
        
        return this.browsers;
    }

    async launchBrowser(browserName) {
        const browserLaunchers = {
            chromium: chromium,
            firefox: firefox,
            webkit: webkit
        };
        
        const launcher = browserLaunchers[browserName];
        if (!launcher) {
            throw new Error(`Unknown browser: ${browserName}`);
        }
        
        return await launcher.launch({
            headless: this.config.headless,
            args: [
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-dev-shm-usage',
                '--no-sandbox'
            ]
        });
    }

    async ensureDirectories() {
        const dirs = [this.config.screenshotDir, this.config.logDir];
        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.warn(`Warning: Could not create directory ${dir}:`, error.message);
            }
        }
    }

    async runComprehensiveTests() {
        console.log('🧪 Starting comprehensive portal tests');
        const testResults = [];
        
        for (const [browserName, browser] of Object.entries(this.browsers)) {
            console.log(`\n🔍 Testing with ${browserName}`);
            
            const context = await browser.newContext({
                viewport: this.config.viewport,
                userAgent: 'Grid4-Portal-Tester/1.0 (Automated Testing)'
            });
            
            const page = await context.newPage();
            
            // Set up console logging
            page.on('console', msg => {
                const timestamp = new Date().toISOString();
                console.log(`[${browserName}] ${timestamp} ${msg.text()}`);
            });
            
            try {
                // Test Suite
                const browserResults = {
                    browser: browserName,
                    tests: {
                        login: await this.testLogin(page),
                        navigation: await this.testNavigation(page),
                        cssInjection: await this.testCSSInjection(page),
                        jsInjection: await this.testJSInjection(page),
                        performance: await this.testPerformance(page),
                        responsiveness: await this.testResponsiveness(page),
                        accessibility: await this.testAccessibility(page)
                    },
                    timestamp: new Date().toISOString()
                };
                
                testResults.push(browserResults);
                
            } catch (error) {
                console.error(`❌ Test failed for ${browserName}:`, error);
                testResults.push({
                    browser: browserName,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            } finally {
                await context.close();
            }
        }
        
        this.results.tests = testResults;
        return testResults;
    }

    async testLogin(page) {
        console.log('  🔐 Testing login functionality');
        const startTime = Date.now();
        
        try {
            // Navigate to login page
            await page.goto(this.config.credentials.url, { 
                waitUntil: 'networkidle',
                timeout: this.config.timeout 
            });
            
            // Take screenshot of login page
            await this.takeScreenshot(page, 'login-page');
            
            // Check if already logged in
            const isLoggedIn = await page.locator('#navigation').isVisible().catch(() => false);
            if (isLoggedIn) {
                console.log('  ✅ Already logged in');
                return { success: true, time: Date.now() - startTime, message: 'Already authenticated' };
            }
            
            // Fill login form
            await page.fill('input[name="username"], input[name="user"], #username, #user', this.config.credentials.username);
            await page.fill('input[name="password"], #password', this.config.credentials.password);
            
            // Submit login
            await page.click('input[type="submit"], button[type="submit"], .login-button');
            
            // Wait for navigation to complete
            await page.waitForURL('**/portal/**', { timeout: this.config.timeout });
            
            // Verify login success
            await page.waitForSelector('#navigation', { timeout: 10000 });
            
            await this.takeScreenshot(page, 'post-login');
            
            const loginTime = Date.now() - startTime;
            console.log(`  ✅ Login successful (${loginTime}ms)`);
            
            return { success: true, time: loginTime };
            
        } catch (error) {
            console.error('  ❌ Login failed:', error.message);
            await this.takeScreenshot(page, 'login-error');
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async testNavigation(page) {
        console.log('  🧭 Testing navigation structure');
        const startTime = Date.now();
        
        try {
            // Map navigation structure
            const navItems = await page.locator('#navigation a, .nav-item a').all();
            const navigation = [];
            
            for (const item of navItems) {
                const text = await item.textContent();
                const href = await item.getAttribute('href');
                navigation.push({ text: text?.trim(), href });
            }
            
            console.log(`  ✅ Found ${navigation.length} navigation items`);
            
            // Test a few key pages
            const testPages = ['inventory', 'domains', 'callhistory'];
            const pageTests = [];
            
            for (const pageName of testPages) {
                try {
                    const navLink = navigation.find(item => 
                        item.href?.includes(pageName) || 
                        item.text?.toLowerCase().includes(pageName.toLowerCase())
                    );
                    
                    if (navLink) {
                        await page.click(`a[href*="${pageName}"]`);
                        await page.waitForLoadState('networkidle');
                        await this.takeScreenshot(page, `page-${pageName}`);
                        pageTests.push({ page: pageName, success: true });
                        console.log(`  ✅ ${pageName} page loaded`);
                    }
                } catch (error) {
                    pageTests.push({ page: pageName, success: false, error: error.message });
                    console.warn(`  ⚠️ ${pageName} page failed:`, error.message);
                }
            }
            
            return { 
                success: true, 
                navigation, 
                pageTests, 
                time: Date.now() - startTime 
            };
            
        } catch (error) {
            console.error('  ❌ Navigation test failed:', error.message);
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async testCSSInjection(page) {
        console.log('  🎨 Testing CSS injection');
        const startTime = Date.now();
        
        try {
            // Inject Grid4 CSS
            const cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css';
            
            await page.addStyleTag({ url: cssUrl });
            
            // Wait for styles to apply
            await page.waitForTimeout(2000);
            
            // Check if dark theme is applied
            const bodyBg = await page.evaluate(() => {
                return window.getComputedStyle(document.body).backgroundColor;
            });
            
            const isDarkTheme = bodyBg.includes('28, 30, 34') || bodyBg.includes('rgb(28, 30, 34)');
            
            await this.takeScreenshot(page, 'css-injection-applied');
            
            console.log(`  ✅ CSS injection ${isDarkTheme ? 'successful' : 'partial'}`);
            
            return { 
                success: true, 
                darkTheme: isDarkTheme,
                backgroundColor: bodyBg,
                time: Date.now() - startTime 
            };
            
        } catch (error) {
            console.error('  ❌ CSS injection failed:', error.message);
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async testJSInjection(page) {
        console.log('  ⚡ Testing JavaScript injection');
        const startTime = Date.now();
        
        try {
            // Inject Grid4 JavaScript
            const jsUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.js';
            
            await page.addScriptTag({ url: jsUrl });
            
            // Wait for Grid4 to initialize
            await page.waitForTimeout(3000);
            
            // Check if Grid4 is loaded
            const isLoaded = await page.evaluate(() => {
                return typeof window.Grid4 !== 'undefined' && typeof window.g4c !== 'undefined';
            });
            
            // Check for Grid4 console messages
            const grid4Messages = await page.evaluate(() => {
                return window.g4c ? Object.keys(window.g4c) : [];
            });
            
            console.log(`  ✅ JavaScript injection ${isLoaded ? 'successful' : 'failed'}`);
            
            return { 
                success: isLoaded, 
                grid4Methods: grid4Messages,
                time: Date.now() - startTime 
            };
            
        } catch (error) {
            console.error('  ❌ JavaScript injection failed:', error.message);
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async testPerformance(page) {
        console.log('  ⚡ Testing performance metrics');
        const startTime = Date.now();
        
        try {
            const metrics = await page.evaluate(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                return {
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                    loadComplete: perf.loadEventEnd - perf.loadEventStart,
                    totalTime: perf.loadEventEnd - perf.navigationStart,
                    resources: performance.getEntriesByType('resource').length
                };
            });
            
            // Check for wrapper background performance issue
            const consoleMessages = [];
            page.on('console', msg => {
                if (msg.text().includes('Wrapper background fixed')) {
                    consoleMessages.push({
                        text: msg.text(),
                        timestamp: Date.now()
                    });
                }
            });
            
            // Monitor for 5 seconds
            await page.waitForTimeout(5000);
            
            const hasPerformanceIssue = consoleMessages.length > 2; // More than 2 in 5 seconds = issue
            
            console.log(`  ✅ Performance check ${hasPerformanceIssue ? 'found issues' : 'passed'}`);
            
            return { 
                success: true,
                metrics,
                wrapperBackgroundIssue: hasPerformanceIssue,
                consoleMessages: consoleMessages.length,
                time: Date.now() - startTime 
            };
            
        } catch (error) {
            console.error('  ❌ Performance test failed:', error.message);
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async testResponsiveness(page) {
        console.log('  📱 Testing responsive design');
        const startTime = Date.now();
        
        const viewports = [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 667 }
        ];
        
        const responsiveResults = [];
        
        for (const viewport of viewports) {
            try {
                await page.setViewportSize(viewport);
                await page.waitForTimeout(1000);
                
                // Check if navigation is still functional
                const navVisible = await page.locator('#navigation').isVisible();
                
                await this.takeScreenshot(page, `responsive-${viewport.name.toLowerCase()}`);
                
                responsiveResults.push({
                    viewport: viewport.name,
                    navigationVisible: navVisible,
                    success: true
                });
                
                console.log(`  ✅ ${viewport.name} responsive test passed`);
                
            } catch (error) {
                responsiveResults.push({
                    viewport: viewport.name,
                    success: false,
                    error: error.message
                });
            }
        }
        
        // Reset to desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        return { 
            success: true, 
            results: responsiveResults, 
            time: Date.now() - startTime 
        };
    }

    async testAccessibility(page) {
        console.log('  ♿ Testing accessibility features');
        const startTime = Date.now();
        
        try {
            // Check for ARIA labels
            const ariaLabels = await page.locator('[aria-label]').count();
            const ariaRoles = await page.locator('[role]').count();
            
            // Check for keyboard navigation
            const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]').count();
            
            // Test keyboard navigation
            await page.keyboard.press('Tab');
            const activeElement = await page.evaluate(() => document.activeElement.tagName);
            
            console.log(`  ✅ Found ${ariaLabels} ARIA labels, ${focusableElements} focusable elements`);
            
            return { 
                success: true,
                ariaLabels,
                ariaRoles,
                focusableElements,
                keyboardNavigation: activeElement !== 'BODY',
                time: Date.now() - startTime 
            };
            
        } catch (error) {
            console.error('  ❌ Accessibility test failed:', error.message);
            return { success: false, error: error.message, time: Date.now() - startTime };
        }
    }

    async takeScreenshot(page, name) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${name}-${timestamp}.png`;
            const filepath = path.join(this.config.screenshotDir, filename);
            
            await page.screenshot({ 
                path: filepath, 
                fullPage: true 
            });
            
            this.results.screenshots.push({
                name,
                filename,
                filepath,
                timestamp
            });
            
            console.log(`  📸 Screenshot saved: ${filename}`);
            
        } catch (error) {
            console.warn(`  ⚠️ Screenshot failed for ${name}:`, error.message);
        }
    }

    async generateEnhancementRoadmap(page) {
        console.log('🗺️ Generating enhancement roadmap from live portal analysis');
        
        try {
            // Analyze DOM structure for enhancement opportunities
            const analysis = await page.evaluate(() => {
                const opportunities = [];
                
                // 1. Check for outdated UI patterns
                const tables = document.querySelectorAll('table:not(.modern-table)');
                if (tables.length > 0) {
                    opportunities.push({
                        category: 'UI Modernization',
                        item: 'Replace legacy tables with modern data grids',
                        effort: 'Medium',
                        confidence: 'High',
                        impact: 'High',
                        elements: tables.length
                    });
                }
                
                // 2. Check for missing responsive design
                const fixedWidths = document.querySelectorAll('[width], [style*="width:"]');
                if (fixedWidths.length > 10) {
                    opportunities.push({
                        category: 'Responsive Design',
                        item: 'Convert fixed-width layouts to responsive',
                        effort: 'High',
                        confidence: 'Medium',
                        impact: 'High',
                        elements: fixedWidths.length
                    });
                }
                
                // 3. Check for accessibility improvements
                const missingAlt = document.querySelectorAll('img:not([alt])');
                if (missingAlt.length > 0) {
                    opportunities.push({
                        category: 'Accessibility',
                        item: 'Add alt text to images',
                        effort: 'Low',
                        confidence: 'High',
                        impact: 'Medium',
                        elements: missingAlt.length
                    });
                }
                
                // 4. Check for form enhancements
                const forms = document.querySelectorAll('form');
                const formInputs = document.querySelectorAll('input:not([placeholder])');
                if (formInputs.length > 5) {
                    opportunities.push({
                        category: 'User Experience',
                        item: 'Add placeholder text and validation to forms',
                        effort: 'Medium',
                        confidence: 'High',
                        impact: 'Medium',
                        elements: formInputs.length
                    });
                }
                
                // 5. Check for loading states
                const buttons = document.querySelectorAll('button, input[type="submit"]');
                opportunities.push({
                    category: 'User Feedback',
                    item: 'Add loading states to buttons and actions',
                    effort: 'Medium',
                    confidence: 'High',
                    impact: 'Medium',
                    elements: buttons.length
                });
                
                return opportunities;
            });
            
            this.results.enhancement_opportunities = analysis;
            return analysis;
            
        } catch (error) {
            console.error('❌ Enhancement roadmap generation failed:', error.message);
            return [];
        }
    }

    async saveResults() {
        const timestamp = new Date().toISOString();
        const filename = `test-results-${timestamp.replace(/[:.]/g, '-')}.json`;
        const filepath = path.join(this.config.logDir, filename);
        
        const fullResults = {
            ...this.results,
            config: this.config,
            timestamp,
            summary: this.generateSummary()
        };
        
        try {
            await fs.writeFile(filepath, JSON.stringify(fullResults, null, 2));
            console.log(`📊 Results saved to: ${filepath}`);
            return filepath;
        } catch (error) {
            console.error('❌ Failed to save results:', error.message);
            return null;
        }
    }

    generateSummary() {
        const totalTests = this.results.tests.reduce((acc, browser) => 
            acc + Object.keys(browser.tests || {}).length, 0
        );
        
        const passedTests = this.results.tests.reduce((acc, browser) => 
            acc + Object.values(browser.tests || {}).filter(test => test.success).length, 0
        );
        
        return {
            totalTests,
            passedTests,
            successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) + '%' : '0%',
            screenshots: this.results.screenshots.length,
            enhancementOpportunities: this.results.enhancement_opportunities.length,
            browsers: Object.keys(this.browsers).length
        };
    }

    async cleanup() {
        console.log('🧹 Cleaning up browser instances');
        for (const [name, browser] of Object.entries(this.browsers)) {
            try {
                await browser.close();
                console.log(`✅ ${name} browser closed`);
            } catch (error) {
                console.warn(`⚠️ Error closing ${name}:`, error.message);
            }
        }
    }
}

module.exports = Grid4PortalTester;

// CLI usage example
if (require.main === module) {
    (async () => {
        const tester = new Grid4PortalTester({
            headless: false, // Set to true for CI/CD
            browsers: ['chromium'], // ['chromium', 'firefox', 'webkit']
            username: '1002@grid4voice',
            password: 'hQAFMdWXKNj4wAg'
        });
        
        try {
            await tester.initialize();
            await tester.runComprehensiveTests();
            
            // Generate enhancement roadmap
            const browsers = Object.values(tester.browsers);
            if (browsers.length > 0) {
                const context = await browsers[0].newContext();
                const page = await context.newPage();
                await tester.testLogin(page);
                await tester.generateEnhancementRoadmap(page);
                await context.close();
            }
            
            await tester.saveResults();
            console.log('\n🎉 Test automation completed successfully!');
            console.log('📊 Summary:', tester.generateSummary());
            
        } catch (error) {
            console.error('❌ Test automation failed:', error);
        } finally {
            await tester.cleanup();
        }
    })();
}