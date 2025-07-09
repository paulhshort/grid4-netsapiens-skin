/* Grid4 Portal Diagnostic Script
 * Use this in browser console to check current state
 * Copy and paste into portal browser console for real-time debugging
 */

(function() {
    console.log('🔍 Grid4 Portal Diagnostic Report');
    console.log('=====================================');
    
    // 1. Check jQuery
    if (typeof jQuery !== 'undefined') {
        console.log('✅ jQuery:', jQuery.fn.jquery);
    } else {
        console.log('❌ jQuery: NOT FOUND');
    }
    
    // 2. Check Grid4 initialization
    if (window.grid4PortalInitialized) {
        console.log('✅ Grid4 Core: INITIALIZED');
    } else {
        console.log('❌ Grid4 Core: NOT INITIALIZED');
    }
    
    // 3. Check Grid4 namespace
    if (window.g4c) {
        console.log('✅ Grid4 Namespace: AVAILABLE');
        console.log('   Feature flags:', Object.keys(window.g4c).filter(k => k.includes('Feature')));
    } else {
        console.log('❌ Grid4 Namespace: NOT FOUND');
    }
    
    // 4. Check showcase features
    if (window.G4Showcase) {
        console.log('✅ Showcase Features: LOADED');
        console.log('   Performance:', window.G4Showcase.getPerformanceMetrics());
    } else {
        console.log('❌ Showcase Features: NOT LOADED');
    }
    
    // 5. Check individual feature components
    const features = [
        { name: 'Toast Notifications', check: () => window.G4Toast },
        { name: 'Loading Animations', check: () => window.G4Loading },
        { name: 'Feature Flags UI', check: () => window.G4FeatureFlags },
        { name: 'Command Palette', check: () => window.g4c && window.g4c.commandPaletteLoaded }
    ];
    
    console.log('\n🎯 Feature Status:');
    features.forEach(feature => {
        if (feature.check()) {
            console.log(`✅ ${feature.name}: LOADED`);
        } else {
            console.log(`❌ ${feature.name}: NOT LOADED`);
        }
    });
    
    // 6. Check CSS loading
    const cssLinks = document.querySelectorAll('link[href*="grid4"]');
    console.log('\n🎨 CSS Status:');
    console.log(`   Grid4 stylesheets found: ${cssLinks.length}`);
    cssLinks.forEach((link, i) => {
        console.log(`   ${i+1}. ${link.href}`);
    });
    
    // 7. Check portal structure
    console.log('\n🏗️ Portal Structure:');
    console.log(`   Body classes: ${document.body.className}`);
    console.log(`   Navigation found: ${!!document.querySelector('#navigation')}`);
    console.log(`   Content area: ${!!document.querySelector('#content')}`);
    console.log(`   Current URL: ${window.location.pathname}`);
    
    // 8. Feature flag states
    if (window.g4c && window.g4c.isFeatureEnabled) {
        console.log('\n🎛️ Feature Flag States:');
        const flags = ['showcaseFeatures', 'toastNotifications', 'loadingAnimations', 'commandPalette'];
        flags.forEach(flag => {
            console.log(`   ${flag}: ${window.g4c.isFeatureEnabled(flag) ? 'ENABLED' : 'DISABLED'}`);
        });
    }
    
    // 9. Browser console helpers
    console.log('\n🛠️ Available Commands:');
    console.log('   g4c.enableFeature("featureName") - Enable a feature');
    console.log('   g4c.disableFeature("featureName") - Disable a feature');
    console.log('   featureFlags.open() - Open feature manager (if loaded)');
    console.log('   showcase.demo() - Start feature demo (if loaded)');
    console.log('   window.g4c.loadCommandPalette() - Load command palette');
    
    // 10. Quick tests
    console.log('\n🧪 Quick Tests:');
    try {
        if (window.toast) {
            console.log('   Testing toast notifications...');
            window.toast.info('Diagnostic test successful!', { duration: 3000 });
        }
        
        if (window.loading) {
            console.log('   Testing loading animations...');
            window.loading.setProgress(50);
            setTimeout(() => window.loading.setProgress(0), 2000);
        }
    } catch (error) {
        console.log('   Test error:', error.message);
    }
    
    console.log('\n🎯 Next Steps:');
    if (!window.G4Showcase) {
        console.log('   1. Check network tab for failed script loads');
        console.log('   2. Verify CDN URLs are accessible');
        console.log('   3. Check browser console for JavaScript errors');
    } else {
        console.log('   1. Try: featureFlags.open() to test feature manager');
        console.log('   2. Try: showcase.demo() to run feature demo');
        console.log('   3. Press F key to open feature flags');
    }
    
    console.log('\n✨ Diagnostic complete!');
})();