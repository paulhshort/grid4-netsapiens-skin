/* GRID4 VERSION SWITCHING TEST - Test with logged-in session */

const { chromium } = require('playwright');
const fs = require('fs').promises;

const PORTAL_URL = 'https://portal.grid4voice.ucaas.tech';
const TEST_CREDENTIALS = {
    username: '1002@grid4voice',
    password: 'hQAFMdWXKNj4wAg'
};

const TEST_VERSIONS = [
    { param: 'v1', name: 'v1.0.5 Stable', expectedBody: 'grid4-hotfix' },
    { param: 'v2-hybrid', name: 'v2.0 Hybrid', expectedBody: 'grid4-v2-hybrid-active' },
    { param: 'v2', name: 'v2.0 Experimental', expectedBody: 'grid4-v2-active' }
];

async function testVersionSwitching() {
    console.log('🧪 Grid4 Version Switching Test - With Login Session');
    
    const browser = await chromium.launch({ 
        headless: false,  
        slowMo: 1000,     
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Capture console logs for each version
    const versionLogs = {};
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Grid4')) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${text}`);
            
            // Store logs by version for analysis
            const currentVersion = getCurrentTestVersion() || 'unknown';
            if (!versionLogs[currentVersion]) {
                versionLogs[currentVersion] = [];
            }
            versionLogs[currentVersion].push(`[${timestamp}] ${text}`);
        }
    });
    
    let currentTestVersion = null;
    function getCurrentTestVersion() {
        return currentTestVersion;
    }
    
    try {
        console.log('🚀 Logging into portal...');
        await page.goto(PORTAL_URL, { waitUntil: 'networkidle' });
        
        // Login process
        await page.waitForTimeout(2000);
        
        const loginField = page.locator('input[type="text"]').first();
        const passwordField = page.locator('input[type="password"]').first();
        
        await loginField.fill(TEST_CREDENTIALS.username);
        await passwordField.fill(TEST_CREDENTIALS.password);
        await page.keyboard.press('Enter');
        
        // Wait for login to complete
        await page.waitForTimeout(5000);
        
        console.log('✅ Login complete, starting version tests...');
        
        const testResults = [];
        
        for (const version of TEST_VERSIONS) {
            currentTestVersion = version.param;
            
            console.log(`\n🎯 Testing ${version.name} (${version.param})...`);
            
            const testUrl = `${PORTAL_URL}/?grid4_version=${version.param}`;
            console.log(`🔗 URL: ${testUrl}`);
            
            await page.goto(testUrl, { waitUntil: 'networkidle' });
            await page.waitForTimeout(5000);
            
            // Check what version was actually loaded
            const smartLoaderInfo = await page.evaluate(() => {
                return {
                    smartLoaderExists: typeof window.Grid4SmartLoader !== 'undefined',
                    currentVersion: window.Grid4SmartLoader ? window.Grid4SmartLoader.currentVersion() : null,
                    loadedVersion: window.Grid4LoadedVersion || null
                };
            });
            
            console.log(`📦 Smart Loader Info:`, smartLoaderInfo);
            
            // Check CSS/JS files loaded
            const loadedFiles = await page.evaluate(() => {
                const css = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                    .map(link => link.href)
                    .filter(href => href.includes('grid4'));
                    
                const js = Array.from(document.querySelectorAll('script[src]'))
                    .map(script => script.src)
                    .filter(src => src.includes('grid4'));
                    
                return { css, js };
            });
            
            console.log(`📄 Loaded CSS:`, loadedFiles.css);
            console.log(`📜 Loaded JS:`, loadedFiles.js);
            
            // Check body classes for version identification
            const bodyClasses = await page.evaluate(() => {
                return Array.from(document.body.classList);
            });
            
            console.log(`🏷️ Body classes:`, bodyClasses);
            
            // Check navigation structure
            const navInfo = await page.evaluate(() => {
                const nav = document.querySelector('#navigation, .navigation, nav');
                if (!nav) return { found: false };
                
                const styles = window.getComputedStyle(nav);
                return {
                    found: true,
                    position: styles.position,
                    left: styles.left,
                    width: styles.width,
                    backgroundColor: styles.backgroundColor,
                    height: styles.height
                };
            });
            
            console.log(`🧭 Navigation:`, navInfo);
            
            // Check for version indicator
            const versionIndicator = await page.evaluate(() => {
                const indicator = document.querySelector('#grid4-version-indicator');
                if (!indicator) return { found: false };
                
                return {
                    found: true,
                    text: indicator.textContent,
                    visible: indicator.offsetHeight > 0
                };
            });
            
            console.log(`📍 Version Indicator:`, versionIndicator);
            
            // Take screenshot
            const screenshotPath = `./test-screenshots/version-${version.param}-${Date.now()}.png`;
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });
            
            // Assess if this version is working correctly
            const isWorking = (
                smartLoaderInfo.smartLoaderExists &&
                loadedFiles.css.length > 0 &&
                loadedFiles.js.length > 0 &&
                navInfo.found &&
                versionIndicator.found
            );
            
            const result = {
                version: version.param,
                name: version.name,
                url: testUrl,
                isWorking: isWorking,
                smartLoader: smartLoaderInfo,
                loadedFiles: loadedFiles,
                bodyClasses: bodyClasses,
                navigation: navInfo,
                versionIndicator: versionIndicator,
                screenshot: screenshotPath,
                logs: versionLogs[version.param] || []
            };
            
            testResults.push(result);
            
            if (isWorking) {
                console.log(`✅ ${version.name} is working correctly!`);
            } else {
                console.log(`❌ ${version.name} has issues`);
            }
        }
        
        // Generate comprehensive report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalVersions: testResults.length,
                workingVersions: testResults.filter(r => r.isWorking).length,
                failedVersions: testResults.filter(r => !r.isWorking).length
            },
            results: testResults,
            allLogs: versionLogs
        };
        
        await fs.mkdir('./test-screenshots', { recursive: true });
        await fs.writeFile('./version-switching-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n📊 VERSION SWITCHING TEST SUMMARY');
        console.log('===================================');
        console.log(`Total versions tested: ${report.summary.totalVersions}`);
        console.log(`Working correctly: ${report.summary.workingVersions}`);
        console.log(`Failed: ${report.summary.failedVersions}`);
        
        testResults.forEach(result => {
            const status = result.isWorking ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.isWorking ? 'WORKING' : 'FAILED'}`);
        });
        
        console.log(`\n📄 Full report: version-switching-report.json`);
        
        return report.summary.failedVersions === 0;
        
    } catch (error) {
        console.error('❌ Version switching test failed:', error);
        
        await page.screenshot({ path: './test-screenshots/test-error.png', fullPage: true });
        return false;
    } finally {
        await browser.close();
    }
}

// Run the test
if (require.main === module) {
    testVersionSwitching().then(success => {
        if (success) {
            console.log('\n🎉 All versions are working correctly!');
            process.exit(0);
        } else {
            console.log('\n❌ Some versions have issues. Check the report for details.');
            process.exit(1);
        }
    }).catch(error => {
        console.error('💥 Test crashed:', error);
        process.exit(1);
    });
}

module.exports = { testVersionSwitching };