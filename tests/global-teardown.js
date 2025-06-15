/**
 * Global Teardown for Grid4 NetSapiens Testing
 * 
 * This file runs once after all tests to clean up and generate reports.
 */

const fs = require('fs');
const path = require('path');

async function globalTeardown() {
    console.log('🧹 Starting Grid4 NetSapiens Test Suite Global Teardown...');
    
    // Generate test summary report
    const testResultsDir = 'test-results';
    const summaryFile = path.join(testResultsDir, 'test-summary.json');
    
    try {
        // Read test results if available
        const resultsFile = path.join(testResultsDir, 'results.json');
        let testResults = null;
        
        if (fs.existsSync(resultsFile)) {
            testResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        }
        
        // Count screenshots and artifacts
        const screenshotsDir = path.join(testResultsDir, 'screenshots');
        const artifactsDir = path.join(testResultsDir, 'artifacts');
        
        const screenshotCount = fs.existsSync(screenshotsDir) ? 
            fs.readdirSync(screenshotsDir).length : 0;
        const artifactCount = fs.existsSync(artifactsDir) ? 
            fs.readdirSync(artifactsDir).length : 0;
        
        // Generate summary
        const summary = {
            timestamp: new Date().toISOString(),
            testResults: testResults ? {
                total: testResults.stats?.total || 0,
                passed: testResults.stats?.passed || 0,
                failed: testResults.stats?.failed || 0,
                skipped: testResults.stats?.skipped || 0,
                duration: testResults.stats?.duration || 0
            } : null,
            artifacts: {
                screenshots: screenshotCount,
                totalArtifacts: artifactCount
            },
            directories: {
                testResults: fs.existsSync(testResultsDir),
                screenshots: fs.existsSync(screenshotsDir),
                artifacts: fs.existsSync(artifactsDir),
                htmlReport: fs.existsSync(path.join(testResultsDir, 'html-report'))
            }
        };
        
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
        console.log('📊 Test summary generated:', summaryFile);
        
        // Log summary to console
        if (summary.testResults) {
            console.log(`\n📈 Test Results Summary:`);
            console.log(`   Total: ${summary.testResults.total}`);
            console.log(`   Passed: ${summary.testResults.passed}`);
            console.log(`   Failed: ${summary.testResults.failed}`);
            console.log(`   Skipped: ${summary.testResults.skipped}`);
            console.log(`   Duration: ${(summary.testResults.duration / 1000).toFixed(2)}s`);
        }
        
        console.log(`\n📁 Artifacts Generated:`);
        console.log(`   Screenshots: ${summary.artifacts.screenshots}`);
        console.log(`   Total Artifacts: ${summary.artifacts.totalArtifacts}`);
        
        // Clean up old artifacts if needed
        const maxArtifactAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        const now = Date.now();
        
        if (fs.existsSync(artifactsDir)) {
            const files = fs.readdirSync(artifactsDir);
            let cleanedCount = 0;
            
            files.forEach(file => {
                const filePath = path.join(artifactsDir, file);
                const stats = fs.statSync(filePath);
                
                if (now - stats.mtime.getTime() > maxArtifactAge) {
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                }
            });
            
            if (cleanedCount > 0) {
                console.log(`🗑️ Cleaned up ${cleanedCount} old artifact files`);
            }
        }
        
        // Generate quick access links
        const linksFile = path.join(testResultsDir, 'quick-links.md');
        const links = `# Grid4 NetSapiens Test Results

## Quick Access Links

- [HTML Report](./html-report/index.html)
- [Test Summary](./test-summary.json)
- [Environment Info](./environment-info.json)
- [Screenshots](./screenshots/)
- [Artifacts](./artifacts/)

## Test Commands

\`\`\`bash
# Run all tests
npm run test:all

# Run visual regression tests
npm run test:visual-regression

# Run cross-browser tests
npm run test:cross-browser

# Run deployment validation
npm run test:deployment

# View test report
npm run test:report
\`\`\`

Generated: ${new Date().toISOString()}
`;
        
        fs.writeFileSync(linksFile, links);
        console.log('🔗 Quick links generated:', linksFile);
        
    } catch (error) {
        console.error('❌ Error during teardown:', error.message);
    }
    
    console.log('✅ Global teardown completed');
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Review test results: open test-results/html-report/index.html`);
    console.log(`   2. Check screenshots: test-results/screenshots/`);
    console.log(`   3. View summary: test-results/test-summary.json`);
}

module.exports = globalTeardown;
