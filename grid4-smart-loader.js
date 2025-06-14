/* GRID4 SMART LOADER PRODUCTION - Zero version selector, stable only */
/* Updated for production stability - Version selector completely disabled */

// RACE CONDITION FIX: Wait for complete page load before executing
window.addEventListener('load', function() {
    'use strict';
    
    console.log('🎯 Grid4 Smart Loader - Detecting version from URL...');
    
    // VERSION DETECTION FROM URL PARAMETERS
    function getRequestedVersion() {
        const urlParams = new URLSearchParams(window.location.search);
        const versionParam = urlParams.get('grid4_version');
        
        if (versionParam === 'v2' || versionParam === '2.0' || versionParam === 'experimental') {
            return 'v2-experimental';
        }
        
        if (versionParam === 'v2-hybrid' || versionParam === 'hybrid' || versionParam === '2.0-hybrid') {
            return 'v2-hybrid';
        }
        
        if (versionParam === 'v1' || versionParam === '1.0.5' || versionParam === 'stable') {
            return 'v1-stable';
        }
        
        // FORCE SINGLE VERSION - NO MORE VERSION CONFUSION
        return 'v1-stable';
    }
    
    // AGGRESSIVE CACHE BUSTING - Force fresh files
    const CACHE_BUST = Date.now(); // Force fresh CDN fetch
    const SECONDARY_BUST = Math.random().toString(36).substr(2, 9); // Extra randomness
    const VERSIONS = {
        'v1-stable': {
            name: 'v1.0.5 Stable',
            css: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-emergency-minimal.css?v=${CACHE_BUST}&r=${SECONDARY_BUST}`,
            js: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.js?v=${CACHE_BUST}&r=${SECONDARY_BUST}`
        },
        'v2-hybrid': {
            name: 'v2.0 Hybrid',
            css: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-skin-v2-hybrid.css',
            js: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-skin-v2-hybrid.js'
        },
        'v2-experimental': {
            name: 'v2.0 Fixed Architecture',
            css: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-skin-v2-experimental-fixed.css',
            js: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-skin-v2-experimental.js'
        }
    };
    
    // DYNAMIC CSS LOADING
    function loadStylesheet(url, id) {
        return new Promise((resolve, reject) => {
            // Remove existing Grid4 stylesheets
            const existing = document.querySelectorAll('link[id^="grid4-css"]');
            existing.forEach(link => link.remove());
            
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            
            link.onload = () => {
                console.log(`✅ Grid4: Loaded CSS - ${id}`);
                resolve();
            };
            
            link.onerror = () => {
                console.error(`❌ Grid4: Failed to load CSS - ${id}`);
                reject(new Error(`Failed to load ${url}`));
            };
            
            document.head.appendChild(link);
        });
    }
    
    // DYNAMIC SCRIPT LOADING
    function loadScript(url, id) {
        return new Promise((resolve, reject) => {
            // Remove existing Grid4 scripts
            const existing = document.querySelectorAll('script[id^="grid4-js"]');
            existing.forEach(script => script.remove());
            
            const script = document.createElement('script');
            script.id = id;
            script.type = 'text/javascript';
            script.src = url;
            
            script.onload = () => {
                console.log(`✅ Grid4: Loaded JS - ${id}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Grid4: Failed to load JS - ${id}`);
                reject(new Error(`Failed to load ${url}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // VERSION INDICATOR UI - DISABLED FOR PRODUCTION
    function showVersionIndicator(versionName, versionKey) {
        // DISABLED: No version selector in production to avoid confusion
        console.log(`🔒 Grid4: Version ${versionName} (${versionKey}) - Version selector disabled for stability`);
        
        // Remove any existing indicator
        const existing = document.getElementById('grid4-version-indicator');
        if (existing) {
            existing.remove();
        }
        
        // Return early - no UI created
        return;
    }
    
    // VERSION SWITCHER UI - DISABLED FOR PRODUCTION
    function showVersionSwitcher() {
        // DISABLED: No version switching in production
        console.log('🔒 Grid4: Version switcher disabled for production stability');
        
        // Remove any existing switcher UI
        const existing = document.querySelector('.grid4-version-switcher');
        if (existing) {
            existing.remove();
        }
        
        return; // Exit early - no UI created
    }
    
    // VERSION SWITCHING (URL update) - DISABLED FOR PRODUCTION
    function switchToVersion(versionKey) {
        // DISABLED: No version switching in production
        console.log(`🔒 Grid4: Version switching to ${versionKey} disabled for production stability`);
        return;
    }
    
    // KEYBOARD SHORTCUTS - DISABLED FOR PRODUCTION  
    function setupKeyboardShortcuts() {
        // DISABLED: No keyboard version switching in production
        console.log('🔒 Grid4: Keyboard shortcuts disabled for production stability');
        return;
    }
    
    // INLINE CRITICAL CSS - Reduces FOUC delay
    function injectCriticalCSS() {
        const criticalCSS = `
            /* GRID4 CRITICAL CSS - Immediate layout prevention */
            :root {
                --g4-sidebar-width: 220px;
                --g4-content-offset: 220px;
                --g4-primary: #667eea;
                --g4-dark-bg: #1a2332;
                --g4-dark-surface: #1e2736;
                --g4-text-light: #f3f4f6;
            }
            body.grid4-loading * { opacity: 0 !important; transition: opacity 0.3s ease !important; }
            body.grid4-ready * { opacity: 1 !important; }
        `;
        
        const style = document.createElement('style');
        style.id = 'grid4-critical';
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
        
        // Add loading class to prevent FOUC
        document.body.classList.add('grid4-loading');
    }

    // MAIN INITIALIZATION
    async function initializeSmartLoader() {
        try {
            // Inject critical CSS immediately
            injectCriticalCSS();
            
            const requestedVersion = getRequestedVersion();
            const versionConfig = VERSIONS[requestedVersion];
            
            console.log(`🚀 Grid4: Loading ${versionConfig.name}...`);
            
            // Load CSS first (prevents FOUC)
            await loadStylesheet(versionConfig.css, `grid4-css-${requestedVersion}`);
            
            // Load JavaScript
            await loadScript(versionConfig.js, `grid4-js-${requestedVersion}`);
            
            // DISABLED - No more version selector confusion
            // showVersionIndicator(versionConfig.name, requestedVersion);
            
            // DISABLED - No keyboard shortcuts in production
            // setupKeyboardShortcuts();
            
            // Remove loading class to show content
            setTimeout(() => {
                document.body.classList.remove('grid4-loading');
                document.body.classList.add('grid4-ready');
            }, 100);
            
            console.log(`✅ Grid4: ${versionConfig.name} loaded successfully`);
            
        } catch (error) {
            console.error('❌ Grid4 Smart Loader failed:', error);
            
            // Fallback to stable version
            if (getRequestedVersion() !== 'v1-stable') {
                console.log('🔄 Grid4: Falling back to stable version...');
                const stableConfig = VERSIONS['v1-stable'];
                try {
                    await loadStylesheet(stableConfig.css, 'grid4-css-fallback');
                    await loadScript(stableConfig.js, 'grid4-js-fallback');
                    // showVersionIndicator(stableConfig.name + ' (Fallback)', 'v1-stable'); // DISABLED
                } catch (fallbackError) {
                    console.error('❌ Grid4: Even fallback failed:', fallbackError);
                }
            }
        }
    }
    
    // GLOBAL API
    window.Grid4SmartLoader = {
        version: '1.0.0',
        currentVersion: getRequestedVersion,
        showVersionSwitcher: showVersionSwitcher,
        switchToVersion: switchToVersion,
        reload: initializeSmartLoader
    };
    
    // AUTO-INITIALIZE - Now guaranteed to run after full page load
    try {
        console.log('🔍 Grid4: Page fully loaded, initializing...');
        initializeSmartLoader();
    } catch (error) {
        console.error('❌ Grid4: Critical initialization error:', error);
        console.error('Stack trace:', error.stack);
        
        // Fallback: Try basic CSS injection
        try {
            const fallbackCSS = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.css';
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fallbackCSS;
            document.head.appendChild(link);
            console.log('🩹 Grid4: Fallback CSS injected');
        } catch (fallbackError) {
            console.error('❌ Grid4: Even fallback failed:', fallbackError);
        }
    }
    
    console.log('🔒 Grid4 Smart Loader v1.0.6 Production - Version selector eliminated for production stability');
    
}); // End window.load event listener