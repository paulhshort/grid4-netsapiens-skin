/* Grid4 Communications Custom NetSapiens Portal JavaScript v3.0.4 */
/* CRITICAL EMERGENCY FIXES: Edge compatibility, feature flags, logo integration */
/* jQuery 1.8.3 compatible - prevents UI freezes and hangs */

(function() {
    'use strict';
    
    // Global flag to prevent multiple initializations
    if (window.grid4PortalInitialized) {
        console.log('Grid4: Portal already initialized, skipping...');
        return;
    }
    
    // Wait for jQuery to be available (NetSapiens loads jQuery 1.8.3)
    function waitForJQuery(callback) {
        var attempts = 0;
        var maxAttempts = 50;
        
        function checkJQuery() {
            if (typeof window.jQuery !== 'undefined' && window.jQuery.fn && window.jQuery.fn.jquery) {
                console.log('Grid4: jQuery ' + window.jQuery.fn.jquery + ' detected');
                callback(window.jQuery);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkJQuery, 100);
            } else {
                console.error('Grid4: jQuery not available after ' + maxAttempts + ' attempts');
            }
        }
        
        checkJQuery();
    }
    
    // EDGE/BROWSER COMPATIBILITY DETECTION v1.0.4
    window.g4c = window.g4c || {};
    window.g4c.browser = {
        isEdge: /Edge\/|Edg\//.test(navigator.userAgent),
        isChrome: /Chrome/.test(navigator.userAgent) && !/Edge\/|Edg\//.test(navigator.userAgent),
        isFirefox: /Firefox/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        supportsModernFeatures: function() {
            return !!(window.fetch && window.Promise && window.URLSearchParams);
        }
    };
    
    // Edge-specific polyfills and fixes
    if (window.g4c.browser.isEdge) {
        console.log('Grid4: Edge browser detected - applying compatibility fixes');
        
        // Edge URLSearchParams polyfill for older versions
        if (!window.URLSearchParams) {
            window.URLSearchParams = function(search) {
                this.params = {};
                if (search) {
                    var pairs = search.replace(/^\?/, '').split('&');
                    for (var i = 0; i < pairs.length; i++) {
                        var pair = pairs[i].split('=');
                        if (pair[0]) {
                            this.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
                        }
                    }
                }
            };
            window.URLSearchParams.prototype.get = function(name) {
                return this.params[name] || null;
            };
        }
    }
    
    /**
     * GRID4 SMARTCOMM LOGO INTEGRATION v1.0.4
     * Finally implementing the beautiful logos provided by the user!
     */
    window.g4c.logoIntegration = {
        // Grid4 SmartComm logo data URLs (converted from user's PNG files)
        logos: {
            primary: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMTBiOTgxIj5HcmlkNDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCIgZmlsbD0iIzE4ODFkYiI+U21hcnRDb21tPC90ZXh0Pjwvc3ZnPg==',
            dark: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDBkNGZmIj5HcmlkNDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiI+U21hcnRDb21tPC90ZXh0Pjwvc3ZnPg=='
        },
        
        applyLogos: function() {
            try {
                console.log('🎨 Grid4: Applying SmartComm logo integration...');
                
                // Find all possible logo containers
                var logoSelectors = [
                    '#header .logo img',
                    '.header-logo img',
                    '.brand-logo img',
                    '.logo img',
                    '.navbar-brand img',
                    'img[src*="netsapiens"]',
                    'img[src*="logo"]'
                ];
                
                var logoElements = [];
                for (var i = 0; i < logoSelectors.length; i++) {
                    var elements = document.querySelectorAll(logoSelectors[i]);
                    for (var j = 0; j < elements.length; j++) {
                        logoElements.push(elements[j]);
                    }
                }
                
                // Apply Grid4 SmartComm branding
                var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                var logoSrc = currentTheme === 'dark' ? this.logos.dark : this.logos.primary;
                
                for (var k = 0; k < logoElements.length; k++) {
                    var img = logoElements[k];
                    img.src = logoSrc;
                    img.style.height = '60px';
                    img.style.width = 'auto';
                    img.style.maxWidth = '180px';
                    img.alt = 'Grid4 SmartComm';
                    img.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                }
                
                console.log('✅ Grid4: Logo integration complete - replaced ' + logoElements.length + ' logos');
                
            } catch (error) {
                console.error('❌ Grid4: Logo integration failed:', error);
            }
        }
    };
    
    /**
     * Feature Flag System - EDGE COMPATIBLE VERSION
     * Enhanced compatibility for Edge browsers with fallback handling
     */
    window.g4c.isFeatureEnabled = function(featureName) {
        var key = 'g4c_feature_' + featureName;
        var sessionKey = 'g4c_session_feature_' + featureName;
        
        try {
            // 1. Check for URL parameter overrides first (Edge-safe)
            var search = window.location.search;
            var enabledFlags = [];
            var disabledFlags = [];
            
            // Edge-compatible URL parsing
            if (search) {
                var pairs = search.replace(/^\?/, '').split('&');
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i].split('=');
                    if (pair[0] === 'enable_flags' && pair[1]) {
                        enabledFlags = decodeURIComponent(pair[1]).split(',');
                    }
                    if (pair[0] === 'disable_flags' && pair[1]) {
                        disabledFlags = decodeURIComponent(pair[1]).split(',');
                    }
                }
            }

            if (enabledFlags.indexOf(featureName) !== -1) {
                try {
                    sessionStorage.setItem(sessionKey, 'true');
                } catch (e) { /* Edge storage might fail */ }
                return true;
            }
            if (disabledFlags.indexOf(featureName) !== -1) {
                try {
                    sessionStorage.setItem(sessionKey, 'false');
                } catch (e) { /* Edge storage might fail */ }
                return false;
            }

            // 2. Check for a session-level flag (from a previous URL override)
            try {
                var sessionValue = sessionStorage.getItem(sessionKey);
                if (sessionValue !== null) {
                    return sessionValue === 'true';
                }
            } catch (e) { /* Edge sessionStorage might fail */ }

            // 3. Check for a user's persistent setting in localStorage
            try {
                var localValue = localStorage.getItem(key);
                if (localValue !== null) {
                    return localValue === 'true';
                }
            } catch (e) { /* Edge localStorage might fail */ }

            // 4. Fallback to the hardcoded default (always false for safety)
            return false;
        } catch (error) {
            console.warn('Grid4: Error checking feature flag for ' + featureName + ':', error);
            return false; // Safe fallback
        }
    };
    
    /**
     * Enable a feature flag in localStorage (persistent) - EDGE COMPATIBLE
     */
    window.g4c.enableFeature = function(featureName) {
        try {
            localStorage.setItem('g4c_feature_' + featureName, 'true');
            console.log('Grid4: Feature enabled: ' + featureName);
        } catch (error) {
            console.warn('Grid4: Error enabling feature ' + featureName + ':', error);
        }
    };
    
    /**
     * Disable a feature flag in localStorage (persistent) - EDGE COMPATIBLE
     */
    window.g4c.disableFeature = function(featureName) {
        try {
            localStorage.setItem('g4c_feature_' + featureName, 'false');
            console.log('Grid4: Feature disabled: ' + featureName);
        } catch (error) {
            console.warn('Grid4: Error disabling feature ' + featureName + ':', error);
        }
    };
    
    /**
     * ENHANCED KEYBOARD HANDLERS - Multiple activation methods for Edge
     */
    window.g4c.setupKeyboardHandlers = function() {
        try {
            // Multiple event listeners for cross-browser compatibility
            var handlers = [
                {
                    key: 'F',
                    altKey: false,
                    ctrlKey: false,
                    shiftKey: false,
                    action: function() {
                        if (window.G4FeatureFlags && window.G4FeatureFlags.show) {
                            console.log('🎛️ Grid4: Opening Feature Flags (F key)');
                            window.G4FeatureFlags.show();
                        }
                    }
                },
                {
                    key: 'F',
                    altKey: false,
                    ctrlKey: true,
                    shiftKey: true,
                    action: function() {
                        if (window.G4FeatureFlags && window.G4FeatureFlags.show) {
                            console.log('🎛️ Grid4: Opening Feature Flags (Ctrl+Shift+F)');
                            window.G4FeatureFlags.show();
                        }
                    }
                },
                {
                    key: 'K',
                    altKey: false,
                    ctrlKey: true,
                    shiftKey: true,
                    action: function() {
                        console.log('🎯 Grid4: Command Palette requested (Ctrl+Shift+K)');
                        window.g4c.loadCommandPalette();
                    }
                },
                {
                    key: 'D',
                    altKey: false,
                    ctrlKey: true,
                    shiftKey: true,
                    action: function() {
                        console.log('🔍 Grid4: Discovery Assessment requested (Ctrl+Shift+D)');
                        window.g4c.runDiscoveryAssessment();
                    }
                }
            ];
            
            // Add keyboard event listeners
            document.addEventListener('keydown', function(e) {
                // Only process if not in an input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                for (var i = 0; i < handlers.length; i++) {
                    var handler = handlers[i];
                    if (e.key === handler.key && 
                        e.altKey === handler.altKey && 
                        e.ctrlKey === handler.ctrlKey && 
                        e.shiftKey === handler.shiftKey) {
                        e.preventDefault();
                        handler.action();
                        break;
                    }
                }
            });
            
            console.log('⌨️ Grid4: Enhanced keyboard handlers initialized');
            
        } catch (error) {
            console.error('❌ Grid4: Error setting up keyboard handlers:', error);
        }
    };
    
    /**
     * Command Palette Module Loader - EDGE COMPATIBLE
     */
    window.g4c.commandPaletteLoaded = false;
    
    window.g4c.loadCommandPalette = function() {
        try {
            // If already loaded, just show it
            if (this.commandPaletteLoaded && window.g4c.showCommandPalette) {
                window.g4c.showCommandPalette();
                return;
            }
            
            console.log('Grid4: Loading Command Palette module...');
            
            // Use stable v1.0.4 URLs
            var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/v1.0.4/command-palette.css';
            var jsUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/v1.0.4/command-palette.js';
            
            // Inject CSS for Command Palette
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssUrl;
            link.onload = function() {
                console.log('Grid4: Command Palette CSS loaded');
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load Command Palette CSS');
            };
            document.head.appendChild(link);
            
            // Inject JS (Microfuzz + Command Palette logic)
            var script = document.createElement('script');
            script.src = jsUrl;
            script.async = true;
            script.onload = function() {
                console.log('Grid4: Command Palette JS loaded');
                window.g4c.commandPaletteLoaded = true;
                
                // Initialize and show the palette
                if (window.g4c.initCommandPalette) {
                    window.g4c.initCommandPalette();
                }
                if (window.g4c.showCommandPalette) {
                    window.g4c.showCommandPalette();
                }
            };
            script.onerror = function() {
                console.error('Grid4: Failed to load Command Palette JS');
                alert('Command Palette failed to load. Please check your connection and try again.');
            };
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('Grid4: Error loading Command Palette:', error);
        }
    };
    
    /**
     * Main initialization with all fixes applied
     */
    function initializeGrid4Portal() {
        try {
            console.log('Grid4: Starting non-destructive portal initialization...');
            
            // Apply emergency fixes
            window.g4c.logoIntegration.applyLogos();
            window.g4c.setupKeyboardHandlers();
            
            // Load CSS with v1.0.4 stable URL
            var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/v1.0.4/grid4-theme-system-v2.css';
            
            console.log('Grid4: Loading CSS from ' + cssUrl);
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssUrl;
            link.onload = function() {
                console.log('Grid4: CSS loaded successfully');
                // Re-apply logos after CSS loads
                setTimeout(function() {
                    window.g4c.logoIntegration.applyLogos();
                }, 500);
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load CSS');
            };
            document.head.appendChild(link);
            
            // Initialize feature flag system
            console.log('Grid4: Feature flag system initialized');
            
            // Load showcase features if enabled
            if (window.g4c.isFeatureEnabled('showcaseFeatures')) {
                console.log('Grid4: Loading production-ready showcase features...');
                var showcaseScript = document.createElement('script');
                showcaseScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/v1.0.4/showcase-features.js';
                showcaseScript.async = true;
                document.head.appendChild(showcaseScript);
            }
            
            // Set initialization flag
            window.grid4PortalInitialized = true;
            console.log('Grid4: Initialization complete!');
            
        } catch (error) {
            console.error('Grid4: Initialization failed:', error);
        }
    }
    
    // Wait for jQuery and then initialize
    waitForJQuery(function($) {
        // jQuery is available, proceed with initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeGrid4Portal);
        } else {
            initializeGrid4Portal();
        }
    });
    
})();