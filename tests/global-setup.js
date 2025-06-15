/**
 * Global Setup for Grid4 NetSapiens Testing
 * 
 * This file runs once before all tests to set up the testing environment.
 */

const { chromium } = require('@playwright/test');
const config = require('../test-automation/config');
const fs = require('fs');
const path = require('path');

async function globalSetup() {
    console.log('🚀 Starting Grid4 NetSapiens Test Suite Global Setup...');
    
    // Create test results directories
    const dirs = [
        'test-results',
        'test-results/screenshots',
        'test-results/html-report',
        'test-results/artifacts',
        'test-results/baseline-screenshots'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        }
    });
    
    // Verify CDN resources are accessible
    console.log('🌐 Verifying CDN resources...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const cdnUrls = [
        'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css',
        'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js'
    ];
    
    for (const url of cdnUrls) {
        try {
            const response = await page.goto(url);
            if (response.ok()) {
                console.log(`✅ CDN resource accessible: ${url}`);
            } else {
                console.warn(`⚠️ CDN resource returned ${response.status()}: ${url}`);
            }
        } catch (error) {
            console.error(`❌ CDN resource failed: ${url} - ${error.message}`);
        }
    }
    
    // Verify portal accessibility
    console.log('🔐 Verifying portal accessibility...');
    try {
        await page.goto(config.portal.loginUrl);
        await page.waitForSelector('#username', { timeout: 10000 });
        console.log('✅ Portal login page accessible');
    } catch (error) {
        console.error('❌ Portal login page not accessible:', error.message);
    }
    
    // Test login credentials
    console.log('🔑 Testing login credentials...');
    try {
        await page.fill('#username', config.portal.credentials.username);
        await page.fill('#password', config.portal.credentials.password);
        await page.click('input[type="submit"]');
        
        // Wait for either successful login or error
        await Promise.race([
            page.waitForSelector('.content', { timeout: 15000 }),
            page.waitForSelector('.error, .alert-danger', { timeout: 15000 })
        ]);
        
        const isLoggedIn = await page.locator('.content').count() > 0;
        if (isLoggedIn) {
            console.log('✅ Login credentials valid');
        } else {
            console.warn('⚠️ Login may have failed - check credentials');
        }
    } catch (error) {
        console.error('❌ Login test failed:', error.message);
    }
    
    await browser.close();
    
    // Create test environment info file
    const envInfo = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        playwrightVersion: require('@playwright/test/package.json').version,
        testConfig: {
            baseURL: config.portal.baseUrl,
            username: config.portal.credentials.username,
            // Don't log password for security
            hasPassword: !!config.portal.credentials.password
        },
        cdnStatus: cdnUrls.map(url => ({ url, checked: true }))
    };
    
    fs.writeFileSync(
        path.join('test-results', 'environment-info.json'),
        JSON.stringify(envInfo, null, 2)
    );
    
    console.log('✅ Global setup completed successfully');
    console.log('📊 Environment info saved to test-results/environment-info.json');
}

module.exports = globalSetup;
