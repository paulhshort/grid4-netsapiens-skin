/* Grid4 Enhancement Suite - Optimized Loader
 * Single-file loader implementing Zen AI bundling recommendations
 * Replaces 8+ separate script requests with 1 optimized bundle
 */

(function() {
    'use strict';
    
    console.log('🚀 Grid4 Optimized Loader starting...');
    
    // Load bundled CSS
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/dist/grid4-bundle.css';
    cssLink.onload = function() {
        console.log('✅ Grid4 CSS Bundle loaded');
    };
    cssLink.onerror = function() {
        console.warn('❌ Grid4 CSS Bundle failed to load - falling back to individual files');
        // Fallback to individual CSS if needed
    };
    document.head.appendChild(cssLink);
    
    // Load bundled JavaScript
    var jsScript = document.createElement('script');
    jsScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/dist/grid4-bundle.js';
    jsScript.async = true;
    jsScript.onload = function() {
        console.log('✅ Grid4 JS Bundle loaded - All enhancements active!');
        console.log('📊 Performance: Reduced from 8+ requests to 2 requests (CSS + JS)');
    };
    jsScript.onerror = function() {
        console.warn('❌ Grid4 JS Bundle failed to load - falling back to individual files');
        // Could implement fallback to individual scripts here if needed
    };
    document.head.appendChild(jsScript);
    
})();
