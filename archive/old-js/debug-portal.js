/* GRID4 DEBUG TESTING - Login and analyze what's actually loading */

const { chromium } = require('playwright');
const fs = require('fs').promises;

const PORTAL_URL = 'https://portal.grid4voice.ucaas.tech';
const TEST_CREDENTIALS = {
    username: '1002@grid4voice',
    password: 'hQAFMdWXKNj4wAg'
};

async function debugPortalLoading() {
    console.log('🔍 Grid4 Debug - Analyzing portal loading...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for debugging
        slowMo: 1000,     // Slow down actions
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Capture all console logs
    const logs = [];
    page.on('console', msg => {
        const logLine = `[${new Date().toISOString()}] ${msg.type()}: ${msg.text()}`;
        console.log(logLine);
        logs.push(logLine);
    });
    
    // Capture network requests
    const requests = [];
    page.on('request', request => {
        const reqLog = `REQUEST: ${request.method()} ${request.url()}`;
        console.log(reqLog);
        requests.push(reqLog);
    });
    
    page.on('response', response => {
        const respLog = `RESPONSE: ${response.status()} ${response.url()}`;
        console.log(respLog);
        requests.push(respLog);
    });
    
    try {
        console.log('🚀 Navigating to portal...');
        await page.goto(PORTAL_URL, { waitUntil: 'networkidle' });
        
        console.log('🔐 Attempting login...');
        
        // Check if we need to login
        const loginForm = await page.locator('input[name="username"], input[type="email"]').first();
        if (await loginForm.isVisible()) {
            console.log('📝 Filling login form...');
            await loginForm.fill(TEST_CREDENTIALS.username);
            
            const passwordField = await page.locator('input[name="password"], input[type="password"]').first();
            await passwordField.fill(TEST_CREDENTIALS.password);
            
            // Submit form
            await page.keyboard.press('Enter');
            console.log('⏳ Waiting for login...');
            await page.waitForTimeout(3000);
        }
        
        console.log('🎯 Testing version parameters...');
        
        // Test each version
        const versions = ['v1', 'v2-hybrid', 'v2'];
        
        for (const version of versions) {
            console.log(`\n🧪 Testing version: ${version}`);
            
            const testUrl = `${PORTAL_URL}/?grid4_version=${version}`;
            await page.goto(testUrl, { waitUntil: 'networkidle' });
            
            await page.waitForTimeout(3000);
            
            // Check what CSS/JS files are loaded
            const loadedCss = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                    .map(link => link.href)
                    .filter(href => href.includes('grid4') || href.includes('cdn.statically.io'));
            });
            
            const loadedJs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('script[src]'))
                    .map(script => script.src)
                    .filter(src => src.includes('grid4') || src.includes('cdn.statically.io'));
            });
            
            console.log(`📄 CSS Files for ${version}:`, loadedCss);
            console.log(`📜 JS Files for ${version}:`, loadedJs);
            
            // Check if smart loader is working
            const smartLoaderActive = await page.evaluate(() => {
                return typeof window.Grid4SmartLoader !== 'undefined';
            });
            
            const versionDetected = await page.evaluate(() => {
                return window.Grid4SmartLoader ? 
                    window.Grid4SmartLoader.currentVersion() : 
                    'Smart loader not found';
            });
            
            console.log(`🎯 Smart Loader Active: ${smartLoaderActive}`);
            console.log(`📦 Version Detected: ${versionDetected}`);
            
            // Take screenshot
            const screenshotPath = `./debug-screenshots/debug-${version}-${Date.now()}.png`;
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });
            console.log(`📸 Screenshot: ${screenshotPath}`);
            
            // Check navigation layout
            const navInfo = await page.evaluate(() => {
                const nav = document.querySelector('#navigation, .navigation, nav');
                if (!nav) return 'No navigation found';
                
                const styles = window.getComputedStyle(nav);
                return {
                    position: styles.position,
                    left: styles.left,
                    width: styles.width,
                    backgroundColor: styles.backgroundColor,
                    display: styles.display
                };
            });
            
            console.log(`🧭 Navigation Info for ${version}:`, navInfo);
        }
        
        // Save debug report
        const report = {
            timestamp: new Date().toISOString(),
            logs: logs,
            requests: requests,
            summary: 'Debug analysis complete'
        };
        
        await fs.mkdir('./debug-screenshots', { recursive: true });
        await fs.writeFile('./debug-report.json', JSON.stringify(report, null, 2));
        
        console.log('\n✅ Debug analysis complete!');
        console.log('📄 Report saved to: debug-report.json');
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

// Run debug
if (require.main === module) {
    debugPortalLoading().catch(console.error);
}

module.exports = { debugPortalLoading };