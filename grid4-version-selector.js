/* GRID4 VERSION SELECTOR - A/B Testing System */
/* Allows switching between v1.0.5 (stable) and v2.0 (experimental) */

(function() {
    'use strict';
    
    console.log('🎯 Grid4 Version Selector - A/B Testing System');
    
    // VERSION DETECTION FROM URL PARAMETERS
    function getRequestedVersion() {
        const urlParams = new URLSearchParams(window.location.search);
        const versionParam = urlParams.get('grid4_version');
        
        if (versionParam === 'v2' || versionParam === '2.0' || versionParam === 'experimental') {
            return '2.0-experimental';
        }
        
        if (versionParam === 'v1' || versionParam === '1.0.5' || versionParam === 'stable') {
            return '1.0.5-stable';
        }
        
        // Default to stable if no version specified
        return '1.0.5-stable';
    }
    
    // DYNAMIC CSS LOADING
    function loadStylesheet(url, id) {
        return new Promise((resolve, reject) => {
            // Remove existing stylesheet if present
            const existing = document.getElementById(id);
            if (existing) {
                existing.remove();
            }
            
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            
            link.onload = () => {
                console.log(`✅ Grid4: Loaded stylesheet - ${id}`);
                resolve();
            };
            
            link.onerror = () => {
                console.error(`❌ Grid4: Failed to load stylesheet - ${id}`);
                reject(new Error(`Failed to load ${url}`));
            };
            
            document.head.appendChild(link);
        });
    }
    
    // DYNAMIC SCRIPT LOADING
    function loadScript(url, id) {
        return new Promise((resolve, reject) => {
            // Remove existing script if present
            const existing = document.getElementById(id);
            if (existing) {
                existing.remove();
            }
            
            const script = document.createElement('script');
            script.id = id;
            script.type = 'text/javascript';
            script.src = url;
            
            script.onload = () => {
                console.log(`✅ Grid4: Loaded script - ${id}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Grid4: Failed to load script - ${id}`);
                reject(new Error(`Failed to load ${url}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // VERSION CONFIGURATION
    const VERSIONS = {
        '1.0.5-stable': {
            name: 'v1.0.5 Stable',
            description: 'Emergency hotfix with race condition fixes',
            css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.css',
            js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-emergency-hotfix-v105.js',
            features: [
                'MutationObserver for dynamic content',
                'DOM validation and error handling',
                'Conditional debug mode',
                'Cross-browser compatibility fixes',
                'Performance optimization'
            ],
            stability: 'Production Ready',
            architecture: 'CSS !important overrides + Class-based targeting'
        },
        
        '2.0-experimental': {
            name: 'v2.0 Experimental',
            description: 'CSS @layer architecture - No !important wars',
            css: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-experimental.css',
            js: 'https://cdn.statically.io/gh/paulcjschindler/grid4-netsapiens-skin/main/grid4-skin-v2-experimental.js',
            features: [
                'CSS @layer cascade architecture',
                'Modern design system with CSS custom properties',
                'Enhanced accessibility support',
                'Progressive enhancement',
                'Reduced motion and high contrast support',
                'No !important conflicts',
                'Advanced browser capability detection'
            ],
            stability: 'Experimental - Test Only',
            architecture: 'CSS @layer + Token-based design system'
        }
    };
    
    // VERSION LOADING AND INITIALIZATION
    async function initializeVersion(versionKey) {
        const version = VERSIONS[versionKey];
        
        if (!version) {
            console.error(`❌ Grid4: Unknown version requested - ${versionKey}`);
            return;
        }
        
        console.log(`🚀 Grid4: Loading ${version.name}...`);
        console.log(`📋 Description: ${version.description}`);
        console.log(`🏗️ Architecture: ${version.architecture}`);
        console.log(`🎯 Stability: ${version.stability}`);
        
        try {
            // Load CSS first for FOUC prevention
            await loadStylesheet(version.css, `grid4-css-${versionKey}`);
            
            // Load JavaScript
            await loadScript(version.js, `grid4-js-${versionKey}`);
            
            // Store version info globally
            window.Grid4LoadedVersion = {
                key: versionKey,
                config: version,
                loadedAt: new Date().toISOString()
            };
            
            console.log(`✅ Grid4: ${version.name} loaded successfully`);
            
            // Show version indicator
            showVersionIndicator(version, versionKey);
            
        } catch (error) {
            console.error(`❌ Grid4: Failed to load ${version.name}:`, error);
            
            // Fallback to stable version if experimental fails
            if (versionKey !== '1.0.5-stable') {
                console.log('🔄 Grid4: Falling back to stable version...');
                await initializeVersion('1.0.5-stable');
            }
        }
    }
    
    // VERSION INDICATOR UI
    function showVersionIndicator(version, versionKey) {
        // Remove existing indicator
        const existing = document.getElementById('grid4-version-indicator');
        if (existing) {
            existing.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.id = 'grid4-version-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: ${versionKey.includes('experimental') ? '#f59e0b' : '#10b981'};
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
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"
               onclick="window.Grid4VersionSelector.showSwitcher()">
                📦 Grid4 ${version.name}
                <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
                    Click to switch versions
                </div>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 10 seconds unless experimental
        if (!versionKey.includes('experimental')) {
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
                        🎯 Grid4 Version Selector
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #d1d5db;">
                        Choose between stable production version or experimental CSS @layer architecture.
                    </p>
                    
                    ${Object.entries(VERSIONS).map(([key, version]) => `
                        <div style="
                            margin-bottom: 16px;
                            padding: 16px;
                            background: ${currentVersion === key ? 'rgba(0, 212, 255, 0.1)' : 'rgba(55, 65, 81, 0.2)'};
                            border-radius: 8px;
                            border: 1px solid ${currentVersion === key ? '#00d4ff' : '#374151'};
                            cursor: pointer;
                        " onclick="window.Grid4VersionSelector.switchToVersion('${key}')">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <h3 style="margin: 0; color: #f9fafb; font-size: 16px;">
                                    ${version.name} ${currentVersion === key ? '(Current)' : ''}
                                </h3>
                                <span style="
                                    background: ${key.includes('experimental') ? '#f59e0b' : '#10b981'};
                                    color: white;
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    font-size: 10px;
                                    font-weight: 600;
                                ">
                                    ${version.stability}
                                </span>
                            </div>
                            <p style="margin: 0 0 12px 0; color: #d1d5db; font-size: 14px;">
                                ${version.description}
                            </p>
                            <div style="font-size: 12px; color: #9ca3af;">
                                <strong>Architecture:</strong> ${version.architecture}
                            </div>
                            <ul style="margin: 8px 0 0 0; padding-left: 16px; font-size: 12px; color: #9ca3af;">
                                ${version.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
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
    
    // VERSION SWITCHING
    function switchToVersion(versionKey) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('grid4_version', versionKey === '1.0.5-stable' ? 'v1' : 'v2');
        
        console.log(`🔄 Grid4: Switching to ${VERSIONS[versionKey].name}...`);
        window.location.href = currentUrl.toString();
    }
    
    // GLOBAL API
    window.Grid4VersionSelector = {
        showSwitcher: showVersionSwitcher,
        switchToVersion: switchToVersion,
        getCurrentVersion: getRequestedVersion,
        getVersions: () => VERSIONS,
        getLoadedVersion: () => window.Grid4LoadedVersion
    };
    
    // AUTO-INITIALIZATION
    const requestedVersion = getRequestedVersion();
    console.log(`🎯 Grid4: Auto-loading version ${requestedVersion}`);
    initializeVersion(requestedVersion);
    
    // Keyboard shortcut for version switcher
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            showVersionSwitcher();
        }
    });
    
    console.log('✅ Grid4 Version Selector initialized - Use Ctrl+Shift+V to switch versions');
    
})();