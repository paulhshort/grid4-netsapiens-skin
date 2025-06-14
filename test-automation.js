/* GRID4 AUTOMATED TESTING - Browser Automation with Playwright */

const { chromium, firefox } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// TEST CONFIGURATION
const PORTAL_URL = 'https://portal.grid4voice.ucaas.tech';
const VERSION_SELECTOR_JS = 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-version-selector.js';

const TEST_SCENARIOS = [
    { name: 'Stable v1.0.5', param: 'v1', expected: 'v1.0.5 Stable' },
    { name: 'Hybrid v2.0', param: 'v2-hybrid', expected: 'v2.0 Hybrid' },
    { name: 'Pure @layer v2.0', param: 'v2', expected: 'v2.0 Pure @layer' },
    { name: 'Debug Mode', param: 'v2-hybrid&grid4_debug=true', expected: 'v2.0 Hybrid' }
];

// COMPREHENSIVE TESTING SUITE
async function runGrid4Tests() {
    console.log('🚀 Grid4 Automated Testing Suite Starting...');
    
    const results = {
        timestamp: new Date().toISOString(),
        scenarios: [],
        summary: {}
    };
    
    // Test with multiple browsers
    for (const browserType of [chromium, firefox]) {
        const browserName = browserType.name();
        console.log(`\n🌐 Testing with ${browserName}...`);
        
        const browser = await browserType.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
        
        try {
            for (const scenario of TEST_SCENARIOS) {
                console.log(`\n🧪 Testing: ${scenario.name} (${browserName})`);
                
                const context = await browser.newContext({
                    viewport: { width: 1920, height: 1080 }
                });
                
                const page = await context.newPage();
                
                // Enable console logging
                page.on('console', msg => {
                    if (msg.text().includes('Grid4')) {
                        console.log(`📝 Console: ${msg.text()}`);
                    }
                });
                
                // Navigate to portal with version parameter
                const testUrl = `${PORTAL_URL}/?grid4_version=${scenario.param}`;
                console.log(`🔗 URL: ${testUrl}`);
                
                try {
                    await page.goto(testUrl, { 
                        waitUntil: 'networkidle',
                        timeout: 30000 
                    });
                    
                    // Inject version selector script
                    await page.addScriptTag({ url: VERSION_SELECTOR_JS });
                    
                    // Wait for Grid4 initialization
                    await page.waitForTimeout(5000);
                    
                    // Test version selector functionality
                    const testResult = await testVersionSelector(page, scenario, browserName);
                    results.scenarios.push(testResult);
                    
                } catch (error) {
                    console.error(`❌ Test failed for ${scenario.name}: ${error.message}`);
                    results.scenarios.push({
                        scenario: scenario.name,
                        browser: browserName,
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
                
                await context.close();
            }
        } finally {
            await browser.close();
        }
    }
    
    // Generate test report
    await generateTestReport(results);
    return results;
}

// VERSION SELECTOR TESTING
async function testVersionSelector(page, scenario, browserName) {
    const testResult = {
        scenario: scenario.name,
        browser: browserName,
        success: false,
        checks: {},
        timestamp: new Date().toISOString()
    };
    
    try {
        // Check 1: Version selector script loaded
        const selectorLoaded = await page.evaluate(() => {
            return typeof window.Grid4VersionSelector !== 'undefined';
        });
        testResult.checks.selectorLoaded = selectorLoaded;
        console.log(`✅ Version selector loaded: ${selectorLoaded}`);
        
        // Check 2: Correct version detected
        const detectedVersion = await page.evaluate(() => {
            return window.Grid4VersionSelector ? window.Grid4VersionSelector.getCurrentVersion() : null;
        });
        testResult.checks.versionDetected = detectedVersion;
        console.log(`🎯 Detected version: ${detectedVersion}`);
        
        // Check 3: Grid4 system loaded
        const grid4Active = await page.evaluate(() => {
            return document.body.classList.contains('grid4-hotfix') || 
                   document.body.classList.contains('grid4-v2-active') ||
                   document.body.classList.contains('grid4-v2-hybrid-active');
        });
        testResult.checks.grid4Active = grid4Active;
        console.log(`🎨 Grid4 system active: ${grid4Active}`);
        
        // Check 4: CSS loaded and applied
        const cssApplied = await page.evaluate(() => {
            const navigation = document.querySelector('#navigation, .navigation');
            if (!navigation) return false;
            
            const styles = window.getComputedStyle(navigation);
            return styles.position === 'fixed' && 
                   styles.left === '0px' && 
                   (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent');
        });
        testResult.checks.cssApplied = cssApplied;
        console.log(`🎨 CSS properly applied: ${cssApplied}`);
        
        // Check 5: Logo replacement
        const logoReplaced = await page.evaluate(() => {
            const logos = document.querySelectorAll('.grid4-logo-replaced, .grid4-v2-logo-replaced, .grid4-v2-hybrid-logo-replaced');
            return logos.length > 0;
        });
        testResult.checks.logoReplaced = logoReplaced;
        console.log(`🏷️ Logo replaced: ${logoReplaced}`);
        
        // Check 6: Version indicator visible
        const versionIndicator = await page.evaluate(() => {
            return document.querySelector('#grid4-version-indicator') !== null;
        });
        testResult.checks.versionIndicator = versionIndicator;
        console.log(`📦 Version indicator visible: ${versionIndicator}`);
        
        // Check 7: No JavaScript errors
        const jsErrors = await page.evaluate(() => {
            return window.Grid4TestErrors || [];
        });
        testResult.checks.jsErrors = jsErrors.length === 0;
        console.log(`🐛 No JS errors: ${jsErrors.length === 0}`);
        
        // Take screenshot for visual verification
        const screenshotPath = `./screenshots/${scenario.name.replace(/\s+/g, '-')}-${browserName}.png`;
        await page.screenshot({ 
            path: screenshotPath,
            fullPage: true 
        });
        testResult.screenshot = screenshotPath;
        
        // Overall success check
        testResult.success = Object.values(testResult.checks).every(check => 
            typeof check === 'boolean' ? check : true
        );
        
        if (testResult.success) {
            console.log(`✅ ${scenario.name} test PASSED in ${browserName}`);
        } else {
            console.log(`❌ ${scenario.name} test FAILED in ${browserName}`);
        }
        
    } catch (error) {
        console.error(`❌ Test execution error: ${error.message}`);
        testResult.error = error.message;
    }
    
    return testResult;
}

// TEST REPORT GENERATION
async function generateTestReport(results) {
    const reportPath = './test-results.json';
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    
    // Generate summary
    const totalTests = results.scenarios.length;
    const successfulTests = results.scenarios.filter(s => s.success).length;
    const failedTests = totalTests - successfulTests;
    
    results.summary = {
        total: totalTests,
        passed: successfulTests,
        failed: failedTests,
        successRate: `${Math.round((successfulTests / totalTests) * 100)}%`
    };
    
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${successfulTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${results.summary.successRate}`);
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS');
    console.log('===================');
    results.scenarios.forEach(scenario => {
        const status = scenario.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${scenario.scenario} (${scenario.browser})`);
        
        if (scenario.checks) {
            Object.entries(scenario.checks).forEach(([check, result]) => {
                const checkStatus = result ? '✅' : '❌';
                console.log(`  ${checkStatus} ${check}: ${result}`);
            });
        }
        
        if (scenario.error) {
            console.log(`  ❌ Error: ${scenario.error}`);
        }
    });
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
}

// VISUAL COMPARISON TESTING
async function compareVersions() {
    console.log('\n🔍 Running visual comparison tests...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    try {
        // Take screenshots of each version
        for (const scenario of TEST_SCENARIOS.slice(0, 3)) { // Skip debug mode for comparison
            const page = await context.newPage();
            
            const testUrl = `${PORTAL_URL}/?grid4_version=${scenario.param}`;
            await page.goto(testUrl, { waitUntil: 'networkidle' });
            await page.addScriptTag({ url: VERSION_SELECTOR_JS });
            await page.waitForTimeout(5000);
            
            const screenshotPath = `./comparison/${scenario.name.replace(/\s+/g, '-')}.png`;
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });
            
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
            await page.close();
        }
    } finally {
        await browser.close();
    }
}

// MAIN EXECUTION
if (require.main === module) {
    (async () => {
        try {
            // Ensure directories exist
            await fs.mkdir('./screenshots', { recursive: true });
            await fs.mkdir('./comparison', { recursive: true });
            
            // Run comprehensive tests
            const results = await runGrid4Tests();
            
            // Run visual comparisons
            await compareVersions();
            
            console.log('\n🎉 Grid4 automated testing complete!');
            
            // Exit with appropriate code
            const allPassed = results.scenarios.every(s => s.success);
            process.exit(allPassed ? 0 : 1);
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            process.exit(1);
        }
    })();
}

module.exports = { runGrid4Tests, compareVersions };