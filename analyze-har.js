const fs = require('fs');

function analyzeHAR() {
    console.log('🔍 ANALYZING HAR FILE - Resource Loading Analysis');
    console.log('=' .repeat(60));
    
    try {
        const harData = JSON.parse(fs.readFileSync('./testing/808pm-edge portal.grid4voice.ucaas.tech.har', 'utf8'));
        const entries = harData.log.entries;
        
        console.log(`📊 Total Network Requests: ${entries.length}`);
        
        // Filter and categorize resources
        const grid4Resources = [];
        const netsapiensResources = [];
        const cssResources = [];
        const jsResources = [];
        const failedResources = [];
        
        entries.forEach((entry, index) => {
            const url = entry.request.url;
            const status = entry.response.status;
            const method = entry.request.method;
            const mimeType = entry.response.content.mimeType || '';
            
            // Categorize resources
            if (url.includes('grid4') || url.includes('statically.io')) {
                grid4Resources.push({
                    url,
                    status,
                    method,
                    mimeType,
                    size: entry.response.content.size || 0,
                    time: entry.time || 0
                });
            }
            
            if (url.includes('portal.grid4voice.ucaas.tech') && 
                (url.includes('.css') || url.includes('.js') || url.includes('basicCSS') || url.includes('selectivity'))) {
                netsapiensResources.push({
                    url,
                    status,
                    method,
                    mimeType,
                    size: entry.response.content.size || 0,
                    time: entry.time || 0
                });
            }
            
            if (mimeType.includes('css') || url.includes('.css')) {
                cssResources.push({ url, status, size: entry.response.content.size || 0 });
            }
            
            if (mimeType.includes('javascript') || url.includes('.js')) {
                jsResources.push({ url, status, size: entry.response.content.size || 0 });
            }
            
            if (status >= 400) {
                failedResources.push({
                    url,
                    status,
                    method,
                    statusText: entry.response.statusText || 'Unknown'
                });
            }
        });
        
        // Analysis Results
        console.log('\n🎯 GRID4 RESOURCES:');
        console.log('=' .repeat(40));
        if (grid4Resources.length === 0) {
            console.log('❌ NO GRID4 RESOURCES FOUND!');
            console.log('   This indicates Grid4 loader is NOT executing or NOT loading files');
        } else {
            grid4Resources.forEach((resource, i) => {
                console.log(`${i+1}. ${resource.url.split('/').pop()}`);
                console.log(`   Status: ${resource.status} | Size: ${resource.size} bytes | Time: ${resource.time}ms`);
                console.log(`   Full URL: ${resource.url}`);
                console.log('');
            });
        }
        
        console.log('\n🏗️  NETSAPIENS PORTAL RESOURCES:');
        console.log('=' .repeat(40));
        netsapiensResources.slice(0, 10).forEach((resource, i) => {
            console.log(`${i+1}. ${resource.url.split('/').pop()}`);
            console.log(`   Status: ${resource.status} | Size: ${resource.size} bytes`);
            console.log(`   Full URL: ${resource.url}`);
            console.log('');
        });
        
        console.log('\n📄 CSS FILES ANALYSIS:');
        console.log('=' .repeat(40));
        const cssFiles = cssResources.filter(r => r.status === 200);
        cssFiles.forEach((css, i) => {
            const filename = css.url.split('/').pop().split('?')[0];
            const isGrid4 = css.url.includes('grid4') || css.url.includes('statically.io');
            console.log(`${i+1}. ${filename} ${isGrid4 ? '(GRID4)' : '(NetSapiens)'}`);
            console.log(`   Status: ${css.status} | Size: ${css.size} bytes`);
            if (isGrid4) {
                console.log(`   🎯 Grid4 File: ${css.url}`);
            }
            console.log('');
        });
        
        console.log('\n📜 JAVASCRIPT FILES ANALYSIS:');
        console.log('=' .repeat(40));
        const jsFiles = jsResources.filter(r => r.status === 200);
        jsFiles.forEach((js, i) => {
            const filename = js.url.split('/').pop().split('?')[0];
            const isGrid4 = js.url.includes('grid4') || js.url.includes('statically.io');
            console.log(`${i+1}. ${filename} ${isGrid4 ? '(GRID4)' : '(NetSapiens)'}`);
            console.log(`   Status: ${js.status} | Size: ${js.size} bytes`);
            if (isGrid4) {
                console.log(`   🎯 Grid4 File: ${js.url}`);
            }
            console.log('');
        });
        
        console.log('\n❌ FAILED RESOURCES:');
        console.log('=' .repeat(40));
        if (failedResources.length === 0) {
            console.log('✅ No failed resources found');
        } else {
            failedResources.forEach((failed, i) => {
                console.log(`${i+1}. ${failed.url.split('/').pop()}`);
                console.log(`   Status: ${failed.status} ${failed.statusText}`);
                console.log(`   URL: ${failed.url}`);
                console.log('');
            });
        }
        
        // Key Analysis Questions
        console.log('\n🤔 KEY ANALYSIS:');
        console.log('=' .repeat(40));
        
        const hasGrid4Loader = grid4Resources.some(r => r.url.includes('grid4-smart-loader-production.js'));
        const hasGrid4CSS = grid4Resources.some(r => r.url.includes('.css'));
        const hasBasicCSS = netsapiensResources.some(r => r.url.includes('basicCSS'));
        const hasSelectivity = netsapiensResources.some(r => r.url.includes('selectivity'));
        
        console.log(`1. Grid4 Smart Loader Loading: ${hasGrid4Loader ? '✅ YES' : '❌ NO'}`);
        console.log(`2. Grid4 CSS Files Loading: ${hasGrid4CSS ? '✅ YES' : '❌ NO'}`);
        console.log(`3. NetSapiens basicCSS Loading: ${hasBasicCSS ? '✅ YES' : '❌ NO'}`);
        console.log(`4. NetSapiens selectivity.js Loading: ${hasSelectivity ? '✅ YES' : '❌ NO'}`);
        console.log(`5. Total Grid4 Resources: ${grid4Resources.length}`);
        console.log(`6. Total Failed Resources: ${failedResources.length}`);
        
        if (!hasGrid4Loader) {
            console.log('\n🚨 CRITICAL ISSUE: Grid4 Smart Loader is NOT loading!');
            console.log('   Check PORTAL_EXTRA_JS setting in NetSapiens admin');
        }
        
        if (hasGrid4Loader && !hasGrid4CSS) {
            console.log('\n⚠️  WARNING: Grid4 loader found but NO CSS files loading');
            console.log('   This suggests the loader is running but failing to load CSS');
        }
        
        // Check load order
        console.log('\n⏰ LOAD ORDER ANALYSIS:');
        console.log('=' .repeat(40));
        const orderedResources = entries
            .filter(e => e.request.url.includes('grid4') || e.request.url.includes('basicCSS') || e.request.url.includes('selectivity'))
            .map(e => ({
                url: e.request.url.split('/').pop().split('?')[0],
                time: e.startedDateTime,
                status: e.response.status
            }))
            .sort((a, b) => new Date(a.time) - new Date(b.time));
            
        orderedResources.forEach((resource, i) => {
            console.log(`${i+1}. ${resource.url} (Status: ${resource.status})`);
        });
        
        console.log('\n📋 SUMMARY:');
        console.log('=' .repeat(40));
        console.log(`Total Resources Analyzed: ${entries.length}`);
        console.log(`Grid4 Resources Found: ${grid4Resources.length}`);
        console.log(`NetSapiens Portal Resources: ${netsapiensResources.length}`);
        console.log(`CSS Files: ${cssResources.length}`);
        console.log(`JavaScript Files: ${jsResources.length}`);
        console.log(`Failed Requests: ${failedResources.length}`);
        
    } catch (error) {
        console.error('❌ Error analyzing HAR file:', error.message);
    }
}

analyzeHAR();