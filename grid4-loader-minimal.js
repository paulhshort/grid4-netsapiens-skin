/* Grid4 Communications - Minimal JavaScript Loader */
/* Loads only Grid4 customizations (bypasses problematic basicJS due to CDN size limits) */
/* Use this as PORTAL_EXTRA_JS URL for reliable deployment */

(function() {
    'use strict';
    
    console.log('Grid4 Minimal Loader: Starting script loading...');
    
    // Configuration
    var config = {
        baseUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/',
        script: 'grid4-custom-v3.js',
        timeout: 15000 // 15 second timeout
    };
    
    // Script loading function
    function loadScript(callback) {
        var script = document.createElement('script');
        var timeoutId;
        var completed = false;
        
        function complete(success, error) {
            if (completed) return;
            completed = true;
            
            clearTimeout(timeoutId);
            
            if (success) {
                console.log('Grid4 Minimal Loader: Successfully loaded Grid4 customizations');
                if (callback) callback(null);
            } else {
                console.error('Grid4 Minimal Loader: Failed to load Grid4 customizations', error);
                if (callback) callback(error || new Error('Script load failed'));
            }
        }
        
        // Set up timeout
        timeoutId = setTimeout(function() {
            complete(false, new Error('Script load timeout'));
        }, config.timeout);
        
        // Set up event handlers
        script.onload = function() {
            complete(true);
        };
        
        script.onerror = function() {
            complete(false, new Error('Script load error'));
        };
        
        // Start loading
        script.src = config.baseUrl + config.script;
        script.async = true;
        document.head.appendChild(script);
        
        console.log('Grid4 Minimal Loader: Loading ' + script.src);
    }
    
    // Start loading process
    function initialize() {
        loadScript(function(error) {
            if (error) {
                console.error('Grid4 Minimal Loader: Initialization failed:', error);
                console.log('Grid4 Minimal Loader: Portal will function normally without enhancements');
            } else {
                console.log('Grid4 Minimal Loader: Initialization complete!');
            }
        });
    }
    
    // Wait for DOM or start immediately if ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();

/*
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * Use this minimal loader to avoid CDN size limit issues:
 * Set PORTAL_EXTRA_JS to: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-loader-minimal.js
 * Set PORTAL_CSS_CUSTOM to: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css
 * 
 * This provides core Grid4 functionality (navigation, theming, mobile support)
 * without the 32K+ line library dependencies that cause CDN issues.
 */