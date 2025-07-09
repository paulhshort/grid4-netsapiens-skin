/* Grid4 FOIT Prevention Script - MUST BE INLINED IN HTML HEAD
 * Prevents Flash of Incorrect Theme (FOIT) by applying theme before page render
 * This script should be embedded as an inline <script> in the HTML <head>
 * 
 * USAGE IN NETSAPIENS PORTAL:
 * Add this as an inline script in the portal template or inject via PORTAL_EXTRA_JS
 * 
 * <script>
 * // PASTE THE MINIFIED VERSION OF THIS SCRIPT HERE
 * </script>
 */

(function() {
    'use strict';
    
    try {
        // Get stored theme preference
        var theme = null;
        
        try {
            theme = localStorage.getItem('g4-theme-preference');
        } catch (e) {
            // localStorage not available, use system detection
        }
        
        // Resolve theme preference
        var resolvedTheme = null;
        
        if (theme === 'system' || !theme) {
            // Detect OS preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                resolvedTheme = 'dark';
            } else {
                resolvedTheme = 'light';
            }
        } else if (theme === 'light' || theme === 'dark' || theme === 'high-contrast') {
            resolvedTheme = theme;
        } else {
            // Invalid theme, fallback to light
            resolvedTheme = 'light';
        }
        
        // Apply theme immediately to prevent FOIT
        if (resolvedTheme && resolvedTheme !== 'light') {
            // Light theme is the default, so only set attribute for non-light themes
            document.documentElement.setAttribute('data-theme', resolvedTheme);
            
            // Also set on body for compatibility (will be overridden by theme system)
            if (document.body) {
                document.body.setAttribute('data-theme', resolvedTheme);
            } else {
                // Body not ready yet, set when it's available
                document.addEventListener('DOMContentLoaded', function() {
                    if (document.body) {
                        document.body.setAttribute('data-theme', resolvedTheme);
                    }
                });
            }
        }
        
        // Store the resolved theme for the theme system to pick up
        try {
            if (theme) {
                sessionStorage.setItem('g4-foit-applied-theme', theme);
            }
            sessionStorage.setItem('g4-foit-resolved-theme', resolvedTheme);
        } catch (e) {
            // sessionStorage not available, theme system will handle fallback
        }
        
    } catch (error) {
        // Silent fail - don't break the page if something goes wrong
        console.warn('Grid4 FOIT Prevention: Error applying theme:', error);
    }
})();

/* MINIFIED VERSION FOR INLINE USE:
 * Copy this minified version for actual inline embedding:
 * 
(function(){try{var t=null;try{t=localStorage.getItem("g4-theme-preference")}catch(e){}var r=null;if("system"===t||!t)r=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";else if("light"===t||"dark"===t||"high-contrast"===t)r=t;else r="light";if(r&&"light"!==r){document.documentElement.setAttribute("data-theme",r);if(document.body)document.body.setAttribute("data-theme",r);else document.addEventListener("DOMContentLoaded",function(){document.body&&document.body.setAttribute("data-theme",r)})}try{t&&sessionStorage.setItem("g4-foit-applied-theme",t);sessionStorage.setItem("g4-foit-resolved-theme",r)}catch(e){}}catch(error){console.warn("Grid4 FOIT Prevention: Error applying theme:",error)}})();
 *
 */