/* Grid4 Cache Buster - For debugging inconsistent loading across systems */

(function() {
    'use strict';
    
    console.log('🔧 Grid4 Cache Buster: Starting...');
    
    /**
     * Force reload all Grid4 assets with timestamp
     */
    function bustAllCaches() {
        var timestamp = new Date().getTime();
        var reloaded = [];
        
        try {
            // Remove existing Grid4 CSS
            var existingCSS = document.querySelectorAll('link[href*="grid4-custom-v3.css"], link[href*="command-palette.css"]');
            for (var i = 0; i < existingCSS.length; i++) {
                existingCSS[i].parentNode.removeChild(existingCSS[i]);
                reloaded.push('Removed: ' + existingCSS[i].href);
            }
            
            // Reload main CSS with cache bust
            var mainCSS = document.createElement('link');
            mainCSS.rel = 'stylesheet';
            mainCSS.type = 'text/css';
            mainCSS.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css?debug=' + timestamp;
            mainCSS.onload = function() {
                console.log('🎯 Grid4 Cache Buster: Main CSS reloaded successfully');
            };
            document.head.appendChild(mainCSS);
            reloaded.push('Reloaded: Main CSS');
            
            // Clear all Grid4 feature flags for clean state
            if (window.g4c && window.g4c.clearAllFeatures) {
                window.g4c.clearAllFeatures();
                reloaded.push('Cleared: All feature flags');
            }
            
            // Clear any session/local storage related to caching
            try {
                for (var key in sessionStorage) {
                    if (key.indexOf('g4c_') === 0) {
                        sessionStorage.removeItem(key);
                        reloaded.push('Cleared session: ' + key);
                    }
                }
            } catch (e) {
                console.warn('Could not clear session storage');
            }
            
            console.log('🔧 Grid4 Cache Buster: Operations completed:');
            reloaded.forEach(function(item) {
                console.log('  ✓ ' + item);
            });
            
            alert('Cache busted! Page will reload in 2 seconds to apply changes.');
            
            // Reload page after brief delay
            setTimeout(function() {
                window.location.reload(true); // Force reload from server
            }, 2000);
            
        } catch (error) {
            console.error('🚨 Grid4 Cache Buster: Error:', error);
            alert('Cache buster encountered an error. Check console for details.');
        }
    }
    
    /**
     * Add debug information about current state
     */
    function debugCurrentState() {
        console.log('🔍 Grid4 Debug: Current State Analysis');
        console.log('Browser:', navigator.userAgent);
        console.log('URL:', window.location.href);
        console.log('Timestamp:', new Date().toISOString());
        
        // Check CSS loading
        var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        console.log('📄 CSS Files loaded:');
        for (var i = 0; i < cssLinks.length; i++) {
            if (cssLinks[i].href.indexOf('grid4') !== -1 || cssLinks[i].href.indexOf('command-palette') !== -1) {
                console.log('  ✓ ' + cssLinks[i].href);
            }
        }
        
        // Check Grid4 status
        if (window.g4c) {
            console.log('🎛️ Grid4 Status:');
            console.log('  - Feature system available:', typeof window.g4c.isFeatureEnabled === 'function');
            console.log('  - Command palette available:', typeof window.g4c.loadCommandPalette === 'function');
            console.log('  - Command palette loaded:', window.g4c.commandPaletteLoaded);
        } else {
            console.log('❌ Grid4 system not initialized');
        }
        
        // Check NetSapiens logo status
        var logoElement = document.querySelector('#header-logo');
        if (logoElement) {
            var computedStyle = window.getComputedStyle(logoElement);
            console.log('🖼️ Logo Status:');
            console.log('  - Background image:', computedStyle.backgroundImage);
            console.log('  - Display:', computedStyle.display);
            console.log('  - Visibility:', computedStyle.visibility);
        }
    }
    
    // Expose functions globally for easy console access
    window.g4cDebug = {
        bustCache: bustAllCaches,
        debugState: debugCurrentState,
        forceReload: function() {
            console.log('🔄 Force reloading page...');
            window.location.reload(true);
        }
    };
    
    // Auto-run debug state analysis
    debugCurrentState();
    
    console.log('🔧 Grid4 Cache Buster: Ready!');
    console.log('💡 Usage:');
    console.log('  - g4cDebug.bustCache() - Clear all caches and reload');
    console.log('  - g4cDebug.debugState() - Show current state info');
    console.log('  - g4cDebug.forceReload() - Force reload page');
    
})();