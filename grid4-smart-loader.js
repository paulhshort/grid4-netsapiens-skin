/* GRID4 SMART LOADER - Single JS file that detects version and loads accordingly */
/* Use this as your PORTAL_EXTRA_JS - it will handle everything dynamically */

(function() {
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
        
        // Default to latest stable if no version specified
        return 'v1-stable';
    }
    
    // VERSION CONFIGURATION WITH ACTUAL CDN URLS
    const VERSIONS = {
        'v1-stable': {
            name: 'v1.0.5 Stable',
            css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.css',
            js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.js'
        },
        'v2-hybrid': {
            name: 'v2.0 Hybrid',
            css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-hybrid.css',
            js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-hybrid.js'
        },
        'v2-experimental': {
            name: 'v2.0 Pure @layer',
            css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-experimental.css',
            js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-experimental.js'
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
    
    // VERSION INDICATOR UI
    function showVersionIndicator(versionName, versionKey) {
        // Remove existing indicator
        const existing = document.getElementById('grid4-version-indicator');
        if (existing) {
            existing.remove();
        }
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.id = 'grid4-version-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: ${versionKey.includes('experimental') ? '#f59e0b' : versionKey.includes('hybrid') ? '#10b981' : '#667eea'};
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                z-index: 999999;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease;
            " 
            onmouseover="this.style.transform='scale(1.05)'" 
            onmouseout="this.style.transform='scale(1)'"
            onclick="window.Grid4SmartLoader.showVersionSwitcher()">
                📦 ${versionName}
                <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
                    Click to switch • Press F for info
                </div>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 10 seconds for stable version
        if (versionKey === 'v1-stable') {
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.style.opacity = '0.3';
                }
            }, 10000);
        }
    }
    
    // VERSION SWITCHER UI
    function showVersionSwitcher() {
        // Remove existing switcher
        const existing = document.querySelector('.grid4-version-switcher');
        if (existing) {
            existing.remove();
            return;
        }
        
        const currentVersion = getRequestedVersion();
        
        const modal = document.createElement('div');
        modal.className = 'grid4-version-switcher';
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: #1e2736;
                    padding: 32px;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    color: #f9fafb;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h2 style="margin: 0 0 16px 0; color: #00d4ff; font-size: 24px;">
                        🎯 Grid4 Version Switcher
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #d1d5db;">
                        Change URL parameter to switch versions (within NetSapiens injection constraints).
                    </p>
                    
                    ${Object.entries(VERSIONS).map(([key, version]) => `
                        <div style="
                            margin-bottom: 16px;
                            padding: 16px;
                            background: ${currentVersion === key ? 'rgba(0, 212, 255, 0.1)' : 'rgba(55, 65, 81, 0.2)'};
                            border-radius: 8px;
                            border: 1px solid ${currentVersion === key ? '#00d4ff' : '#374151'};
                            cursor: pointer;
                        " onclick="window.Grid4SmartLoader.switchToVersion('${key}')">
                            <h3 style="margin: 0 0 8px 0; color: #f9fafb; font-size: 16px;">
                                ${version.name} ${currentVersion === key ? '(Current)' : ''}
                            </h3>
                            <div style="font-size: 12px; color: #9ca3af;">
                                Add <strong>?grid4_version=${key.replace('v1-stable', 'v1').replace('v2-hybrid', 'v2-hybrid').replace('v2-experimental', 'v2')}</strong> to URL
                            </div>
                        </div>
                    `).join('')}
                    
                    <div style="text-align: center; margin-top: 24px;">
                        <button onclick="document.querySelector('.grid4-version-switcher').remove()" style="
                            background: #ef4444;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 500;
                        ">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // VERSION SWITCHING (URL update)
    function switchToVersion(versionKey) {
        const currentUrl = new URL(window.location);
        
        let paramValue;
        switch(versionKey) {
            case 'v1-stable':
                paramValue = 'v1';
                break;
            case 'v2-hybrid':
                paramValue = 'v2-hybrid';
                break;
            case 'v2-experimental':
                paramValue = 'v2';
                break;
            default:
                paramValue = 'v1';
        }
        
        currentUrl.searchParams.set('grid4_version', paramValue);
        
        console.log(`🔄 Grid4: Switching to ${VERSIONS[versionKey].name}...`);
        window.location.href = currentUrl.toString();
    }
    
    // KEYBOARD SHORTCUTS
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Skip if in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                e.target.contentEditable === 'true') {
                return;
            }
            
            // F key - Version switcher
            if (e.key === 'f' || e.key === 'F') {
                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    e.preventDefault();
                    showVersionSwitcher();
                    return;
                }
            }
            
            // Ctrl+Shift+V - Also version switcher
            if (e.ctrlKey && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
                e.preventDefault();
                showVersionSwitcher();
                return;
            }
        });
    }
    
    // MAIN INITIALIZATION
    async function initializeSmartLoader() {
        try {
            const requestedVersion = getRequestedVersion();
            const versionConfig = VERSIONS[requestedVersion];
            
            console.log(`🚀 Grid4: Loading ${versionConfig.name}...`);
            
            // Load CSS first (prevents FOUC)
            await loadStylesheet(versionConfig.css, `grid4-css-${requestedVersion}`);
            
            // Load JavaScript
            await loadScript(versionConfig.js, `grid4-js-${requestedVersion}`);
            
            // Show version indicator
            showVersionIndicator(versionConfig.name, requestedVersion);
            
            // Setup keyboard shortcuts
            setupKeyboardShortcuts();
            
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
                    showVersionIndicator(stableConfig.name + ' (Fallback)', 'v1-stable');
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
    
    // AUTO-INITIALIZE WHEN DOM IS READY
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSmartLoader);
    } else {
        initializeSmartLoader();
    }
    
    console.log('🎉 Grid4 Smart Loader initialized - Use ?grid4_version=v2-hybrid to test!');
    
})();