/* Grid4 Communications Custom NetSapiens Portal JavaScript v3.0 */
/* Complete overhaul - Non-destructive approach for maximum stability */
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
    
    // Global namespace for Grid4 Custom features
    window.g4c = window.g4c || {};
    
    /**
     * Feature Flag System - Professional-grade control for safe development
     * Precedence: URL Parameter > Session Storage > Local Storage > Default (false)
     * @param {string} featureName - The feature name (e.g., 'commandPalette')
     * @returns {boolean}
     */
    window.g4c.isFeatureEnabled = function(featureName) {
        var key = 'g4c_feature_' + featureName;
        var sessionKey = 'g4c_session_feature_' + featureName;
        
        try {
            // 1. Check for URL parameter overrides first
            var urlParams = new URLSearchParams(window.location.search);
            var enabledFlags = (urlParams.get('enable_flags') || '').split(',');
            var disabledFlags = (urlParams.get('disable_flags') || '').split(',');

            if (enabledFlags.indexOf(featureName) !== -1) {
                sessionStorage.setItem(sessionKey, 'true'); // Persist for the session
                return true;
            }
            if (disabledFlags.indexOf(featureName) !== -1) {
                sessionStorage.setItem(sessionKey, 'false'); // Persist for the session
                return false;
            }

            // 2. Check for a session-level flag (from a previous URL override)
            var sessionValue = sessionStorage.getItem(sessionKey);
            if (sessionValue !== null) {
                return sessionValue === 'true';
            }

            // 3. Check for a user's persistent setting in localStorage
            var localValue = localStorage.getItem(key);
            if (localValue !== null) {
                return localValue === 'true';
            }

            // 4. Fallback to the hardcoded default (always false for safety)
            return false;
        } catch (error) {
            console.warn('Grid4: Error checking feature flag for ' + featureName + ':', error);
            return false; // Safe fallback
        }
    };
    
    /**
     * Enable a feature flag in localStorage (persistent)
     * @param {string} featureName - The feature name
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
     * Disable a feature flag in localStorage (persistent)
     * @param {string} featureName - The feature name
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
     * Clear all Grid4 feature flags (for debugging)
     */
    window.g4c.clearAllFeatures = function() {
        try {
            var keysToRemove = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf('g4c_') === 0) {
                    keysToRemove.push(key);
                }
            }
            for (var j = 0; j < keysToRemove.length; j++) {
                localStorage.removeItem(keysToRemove[j]);
            }
            console.log('Grid4: All feature flags cleared');
        } catch (error) {
            console.warn('Grid4: Error clearing feature flags:', error);
        }
    };
    
    /**
     * Command Palette Module Loader - Modular, on-demand loading
     * This implements the architecture recommended by our planning session
     */
    window.g4c.commandPaletteLoaded = false;
    
    window.g4c.loadCommandPalette = function() {
        try {
            // If already loaded, just show it
            if (this.commandPaletteLoaded && window.g4c.showCommandPalette) {
                window.g4c.showCommandPalette();
                return;
            }
            
            // First-time loading
            console.log('Grid4: Loading Command Palette module...');
            
            // Inject CSS for Command Palette with cache busting
            var timestamp = new Date().getTime();
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.css?v=' + timestamp;
            link.onload = function() {
                console.log('Grid4: Command Palette CSS loaded');
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load Command Palette CSS');
            };
            document.head.appendChild(link);
            
            // Inject JS (Microfuzz + Command Palette logic) with cache busting
            var script = document.createElement('script');
            script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.js?v=' + timestamp;
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
     * Discovery Assessment - Environment Capability Probe
     * Implements Gemini AI's brilliant environmental assessment strategy
     * CRITICAL: Determines CSP constraints and guides architecture decisions
     */
    window.g4c.runDiscoveryAssessment = function() {
        try {
            console.log('🔍 Grid4: Starting Discovery Assessment...');
            
            // Load and execute discovery snippet
            var script = document.createElement('script');
            script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/discovery-snippet.js?v=' + new Date().getTime();
            script.onload = function() {
                console.log('🔍 Grid4: Discovery Assessment loaded and running!');
            };
            script.onerror = function() {
                console.error('❌ Grid4: Failed to load Discovery Assessment');
                // Fallback: Run basic inline discovery
                window.g4c.runBasicDiscovery();
            };
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('❌ Grid4: Error running Discovery Assessment:', error);
            window.g4c.runBasicDiscovery();
        }
    };

    /**
     * Basic Discovery Fallback - Simple environment checks
     */
    window.g4c.runBasicDiscovery = function() {
        try {
            console.log('🔍 Grid4: Running basic discovery fallback...');
            
            var results = {
                timestamp: new Date().toLocaleString(),
                userAgent: navigator.userAgent,
                jquery: window.jQuery ? window.jQuery.fn.jquery : 'Not Found',
                localStorage: typeof Storage !== 'undefined',
                serviceWorker: 'serviceWorker' in navigator,
                fetch: typeof fetch !== 'undefined'
            };
            
            console.table(results);
            
            alert('Basic Discovery Results:\n' +
                'jQuery: ' + results.jquery + '\n' +
                'localStorage: ' + results.localStorage + '\n' +
                'Service Worker: ' + results.serviceWorker + '\n' +
                'Fetch API: ' + results.fetch + '\n\n' +
                'For full assessment, run the complete discovery snippet.');
                
        } catch (error) {
            console.error('❌ Grid4: Error in basic discovery:', error);
        }
    };

    /**
     * Application Shell Status Reporter
     */
    window.g4c.showApplicationShellStatus = function() {
        try {
            console.log('📊 Grid4: Checking Application Shell status...');
            
            var status = {
                grid4Version: '3.0',
                zenAI: window.ZenAI ? window.ZenAI.getStatus() : 'Not Loaded',
                modules: {
                    commandPalette: window.g4c.commandPaletteLoaded || 'Not Loaded',
                    modernTables: window.ModernDataTables ? 'Loaded' : 'Not Loaded',
                    consistencyEngine: window.ConsistencyEngineV2 ? 'Loaded' : 'Not Loaded'
                },
                featureFlags: {
                    commandPalette: window.g4c.isFeatureEnabled('commandPalette'),
                    discoveryMode: window.g4c.isFeatureEnabled('discoveryMode'),
                    showcaseFeatures: window.g4c.isFeatureEnabled('showcaseFeatures')
                }
            };
            
            console.table(status);
            
            if (window.ZenAI && window.ZenAI.getStatus) {
                console.log('🤖 ZenAI Application Shell Status:', window.ZenAI.getStatus());
            }
            
            // Create visual status report
            var statusDiv = document.createElement('div');
            statusDiv.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #1a1a2e; color: #e0e0e0; padding: 20px; border-radius: 8px;
                border: 2px solid #667eea; z-index: 999999; font-family: monospace;
                max-width: 500px; max-height: 70vh; overflow-y: auto;
            `;
            statusDiv.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #667eea;">📊 Grid4 Application Shell Status</h3>
                <p><strong>Grid4 Version:</strong> ${status.grid4Version}</p>
                <p><strong>ZenAI Status:</strong> ${typeof status.zenAI === 'object' ? 'Active' : status.zenAI}</p>
                <p><strong>Command Palette:</strong> ${status.modules.commandPalette}</p>
                <p><strong>Feature Flags:</strong></p>
                <ul style="margin: 5px 0 0 20px;">
                    <li>Command Palette: ${status.featureFlags.commandPalette ? '✅' : '❌'}</li>
                    <li>Discovery Mode: ${status.featureFlags.discoveryMode ? '✅' : '❌'}</li>
                    <li>Showcase Features: ${status.featureFlags.showcaseFeatures ? '✅' : '❌'}</li>
                </ul>
                <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #667eea; border: none; color: white; border-radius: 4px; cursor: pointer;">Close</button>
            `;
            document.body.appendChild(statusDiv);
            
        } catch (error) {
            console.error('❌ Grid4: Error showing Application Shell status:', error);
        }
    };

    /**
     * Load Application Shell v2.0 - Observer-based hydration pattern
     */
    window.g4c.loadApplicationShell = function() {
        try {
            console.log('🚀 Grid4: Loading ZenAI Application Shell v2.0...');
            
            // Load discovery first if not already done
            if (!sessionStorage.getItem('g4-discovery-results')) {
                console.log('🔍 Grid4: Running discovery assessment first...');
                window.g4c.runDiscoveryAssessment();
                
                // Delay Application Shell loading to allow discovery to complete
                setTimeout(function() {
                    window.g4c.loadApplicationShell();
                }, 3000);
                return;
            }
            
            // Load Application Shell
            var script = document.createElement('script');
            script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/application-shell-v2.js?v=' + new Date().getTime();
            script.onload = function() {
                console.log('🤖 Grid4: ZenAI Application Shell v2.0 loaded successfully!');
                
                // Register our modules with ZenAI
                if (window.ZenAI) {
                    window.ZenAI.modules.grid4Core = window.g4c;
                    console.log('🔗 Grid4: Registered with ZenAI Application Shell');
                }
            };
            script.onerror = function() {
                console.error('❌ Grid4: Failed to load ZenAI Application Shell');
            };
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('❌ Grid4: Error loading Application Shell:', error);
        }
    };

    /**
     * Ensure CSS is loaded - critical for consistency across systems
     */
    function ensureCSSLoaded() {
        try {
            // Check if our CSS is already loaded
            var existingLink = document.querySelector('link[href*="grid4-custom-v3.css"]');
            if (existingLink) {
                console.log('Grid4: CSS already loaded');
                return;
            }
            
            // Load CSS with cache busting to ensure latest version
            var timestamp = new Date().getTime();
            var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css?v=' + timestamp;
            
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssUrl;
            link.onload = function() {
                console.log('Grid4: CSS loaded successfully with cache bust');
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load CSS');
            };
            
            document.head.appendChild(link);
            console.log('Grid4: Loading CSS from ' + cssUrl);
            
        } catch (error) {
            console.error('Grid4: Error loading CSS:', error);
        }
    }

    // Main initialization function
    function initializeGrid4Portal($) {
        console.log('Grid4: Starting non-destructive portal initialization...');
        
        // Set global flag
        window.grid4PortalInitialized = true;
        
        // Ensure CSS is loaded for consistency
        ensureCSSLoaded();
        
        console.log('Grid4: Feature flag system initialized');
        
        // Keep track of classes we added
        var lastPageClasses = [];
        
        // Core functions
        function addPageSpecificBodyClasses() {
            try {
                var pathname = window.location.pathname;
                var body = document.body;
                
                // Remove only the classes we added last time (non-destructive)
                if (lastPageClasses.length > 0) {
                    body.classList.remove.apply(body.classList, lastPageClasses);
                }
                lastPageClasses = []; // Reset the tracker
                
                // Parse pathname and add new classes
                var pathParts = pathname.split('/').filter(function(part) {
                    return part && part !== 'portal';
                });
                
                if (pathParts.length > 0) {
                    var pageClass = 'page-' + pathParts[0];
                    body.classList.add(pageClass);
                    lastPageClasses.push(pageClass);
                    
                    if (pathParts.length > 1) {
                        var subpageClass = 'subpage-' + pathParts[1];
                        body.classList.add(subpageClass);
                        lastPageClasses.push(subpageClass);
                    }
                }
                
                console.log('Grid4: Page classes updated for ' + pathname);
            } catch (error) {
                console.error('Grid4: Error in addPageSpecificBodyClasses:', error);
            }
        }
        
        function shortenMenuLabels() {
            try {
                var labelMap = {
                    'Auto Attendants': 'Attendants',
                    'Call Queues': 'Queues',
                    'Music On Hold': 'Hold Music',
                    'Time Frames': 'Schedules',
                    'Route Profiles': 'Routing'
                };
                
                // Find navigation text elements using jQuery
                $('#nav-buttons .nav-text').each(function() {
                    try {
                        var $navText = $(this);
                        var originalText = $navText.text().trim();
                        
                        if (labelMap[originalText]) {
                            $navText.text(labelMap[originalText]);
                            console.log('Grid4: Label shortened: ' + originalText + ' -> ' + labelMap[originalText]);
                        }
                    } catch (innerError) {
                        console.warn('Grid4: Error shortening individual label:', innerError);
                    }
                });
            } catch (error) {
                console.error('Grid4: Error in shortenMenuLabels:', error);
            }
        }
        
        function addMobileToggle() {
            try {
                // Check if mobile toggle already exists
                if ($('.grid4-mobile-toggle').length > 0) {
                    return;
                }
                
                var toggleButton = $('<button class="grid4-mobile-toggle" aria-label="Toggle Navigation">' +
                    '<i class="fa fa-bars"></i>' +
                    '</button>');
                
                $('body').append(toggleButton);
                
                toggleButton.on('click', function() {
                    $('#navigation').toggleClass('mobile-active');
                    $(this).find('i').toggleClass('fa-bars fa-times');
                });
                
                console.log('Grid4: Mobile toggle added');
            } catch (error) {
                console.error('Grid4: Error adding mobile toggle:', error);
            }
        }
        
        function enhanceNavigation() {
            try {
                // Find existing navigation elements (non-destructive)
                var $navigation = $('#navigation');
                var $navButtons = $('#nav-buttons');
                
                if ($navigation.length === 0 || $navButtons.length === 0) {
                    console.warn('Grid4: Navigation elements not found, skipping enhancement');
                    return;
                }
                
                // Add CSS classes for styling (non-destructive)
                $navigation.addClass('grid4-enhanced');
                $navButtons.addClass('grid4-nav-list');
                
                // Add structural classes to navigation links (no hover handlers - CSS handles this)
                $('#nav-buttons li a.nav-link').each(function() {
                    try {
                        var $link = $(this);
                        $link.addClass('grid4-nav-item');
                    } catch (innerError) {
                        console.warn('Grid4: Error enhancing individual nav link:', innerError);
                    }
                });
                
                console.log('Grid4: Navigation enhanced successfully');
            } catch (error) {
                console.error('Grid4: Error enhancing navigation:', error);
            }
        }
        
        function setupDynamicContentHandling() {
            try {
                // MutationObserver for dynamic content changes
                if (window.MutationObserver) {
                    var observer = new MutationObserver(function(mutations) {
                        var shouldRefresh = false;
                        
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                for (var i = 0; i < mutation.addedNodes.length; i++) {
                                    var node = mutation.addedNodes[i];
                                    if (node.nodeType === 1) { // Element node
                                        shouldRefresh = true;
                                        break;
                                    }
                                }
                            }
                        });
                        
                        if (shouldRefresh) {
                            // Debounce the refresh
                            clearTimeout(window.grid4RefreshTimeout);
                            window.grid4RefreshTimeout = setTimeout(function() {
                                addPageSpecificBodyClasses();
                                shortenMenuLabels();
                            }, 200);
                        }
                    });
                    
                    // Observe the content area for changes
                    var contentArea = document.getElementById('content');
                    if (contentArea) {
                        observer.observe(contentArea, {
                            childList: true,
                            subtree: true
                        });
                        console.log('Grid4: MutationObserver set up for dynamic content');
                    }
                }
                
                // AJAX completion handler (jQuery 1.8.3 compatible)
                $(document).ajaxComplete(function(event, xhr, settings) {
                    try {
                        // Check if this is a NetSapiens portal AJAX call
                        if (settings.url && settings.url.indexOf('/portal/') !== -1) {
                            // Debounce the refresh
                            clearTimeout(window.grid4AjaxTimeout);
                            window.grid4AjaxTimeout = setTimeout(function() {
                                addPageSpecificBodyClasses();
                                shortenMenuLabels();
                                console.log('Grid4: Content refreshed after AJAX call');
                            }, 100);
                        }
                    } catch (error) {
                        console.warn('Grid4: Error in AJAX complete handler:', error);
                    }
                });
                
                console.log('Grid4: Dynamic content handling set up');
            } catch (error) {
                console.error('Grid4: Error setting up dynamic content handling:', error);
            }
        }
        
        function addKeyboardSupport() {
            try {
                $(document).on('keydown', function(e) {
                    // Escape key closes mobile menu
                    if (e.keyCode === 27) {
                        $('#navigation').removeClass('mobile-active');
                        $('.grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
                    }
                    
                    // Command Palette: Ctrl+Shift+K (like VS Code) (feature flag protected)
                    if (window.g4c.isFeatureEnabled('commandPalette') && e.ctrlKey && e.shiftKey && e.key === 'K') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Command Palette triggered (Ctrl+Shift+K)');
                        window.g4c.loadCommandPalette();
                    }
                    
                    // Discovery Snippet: Ctrl+Shift+D (for development/testing)
                    if (window.g4c.isFeatureEnabled('discoveryMode') && e.ctrlKey && e.shiftKey && e.key === 'D') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Discovery Mode triggered (Ctrl+Shift+D)');
                        window.g4c.runDiscoveryAssessment();
                    }
                    
                    // Application Shell Status: Ctrl+Shift+S (for debugging)
                    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Application Shell Status triggered (Ctrl+Shift+S)');
                        window.g4c.showApplicationShellStatus();
                    }
                    
                    // Theme System: Ctrl+Shift+T (for theme menu)
                    if (window.g4c.isFeatureEnabled('themeSystem') && e.ctrlKey && e.shiftKey && e.key === 'T') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Theme System triggered (Ctrl+Shift+T)');
                        if (window.Grid4Themes && window.Grid4Themes.showThemeMenu) {
                            window.Grid4Themes.showThemeMenu();
                        }
                    }
                });
                
                console.log('Grid4: Keyboard support added');
                
                // Log feature flag status for debugging
                if (window.g4c.isFeatureEnabled('commandPalette')) {
                    console.log('Grid4: Command Palette feature is ENABLED - Press Ctrl+Shift+K to activate');
                } else {
                    console.log('Grid4: Command Palette feature is DISABLED - Enable with g4c.enableFeature("commandPalette")');
                }
                
                if (window.g4c.isFeatureEnabled('discoveryMode')) {
                    console.log('Grid4: Discovery Mode is ENABLED - Press Ctrl+Shift+D to run assessment');
                } else {
                    console.log('Grid4: Discovery Mode is DISABLED - Enable with g4c.enableFeature("discoveryMode")');
                }
                
                if (window.g4c.isFeatureEnabled('themeSystem')) {
                    console.log('Grid4: Theme System is ENABLED - Press Ctrl+Shift+T for theme menu');
                } else {
                    console.log('Grid4: Theme System is DISABLED - Enable with g4c.enableFeature("themeSystem")');
                }
            } catch (error) {
                console.error('Grid4: Error adding keyboard support:', error);
            }
        }
        
        function addAccessibilityEnhancements() {
            try {
                // Add ARIA labels
                $('#navigation').attr('aria-label', 'Main Navigation');
                $('#nav-buttons').attr('role', 'navigation');
                
                console.log('Grid4: Accessibility enhancements added');
            } catch (error) {
                console.error('Grid4: Error adding accessibility enhancements:', error);
            }
        }
        
        function forceWrapperBackground() {
            try {
                // Prevent multiple calls - set flag after first execution
                if (window.g4c && window.g4c.wrapperBackgroundFixed) {
                    return; // Already fixed, no need to repeat
                }
                
                var wrappers = document.querySelectorAll('.wrapper');
                var fixedCount = 0;
                for (var i = 0; i < wrappers.length; i++) {
                    var wrapper = wrappers[i];
                    wrapper.style.setProperty('background-color', '#1c1e22', 'important');
                    wrapper.style.setProperty('background', '#1c1e22', 'important');
                    fixedCount++;
                }
                
                // Mark as fixed to prevent future calls
                if (window.g4c) {
                    window.g4c.wrapperBackgroundFixed = true;
                }
                
                if (fixedCount > 0) {
                    console.log('Grid4: Wrapper background fixed (' + fixedCount + ' elements)');
                }
            } catch (e) {
                console.warn('Grid4: Error fixing wrapper background:', e);
            }
        }
        
        function initializeAll() {
            try {
                console.log('Grid4: Initializing all modules...');
                
                // CRITICAL: Stop any existing wrapper background loops
                stopWrapperBackgroundMonitoring();
                
                // Load Grid4 Showcase Features first (dopamine-inducing premium experience)
                loadShowcaseFeatures();
                
                // Load ZenAI Application Shell v2.0 (observer-based hydration pattern)
                loadZenAIApplicationShell();
                
                // Load Adaptive Enhancement System (handles multi-tenant variations)
                loadAdaptiveEnhancementSystem();
                
                // Initialize core functions
                addPageSpecificBodyClasses();
                enhanceNavigation();
                shortenMenuLabels();
                addMobileToggle();
                setupDynamicContentHandling();
                addKeyboardSupport();
                addAccessibilityEnhancements();
                
                // Force wrapper background fix (once only)
                forceWrapperBackground();
                
                console.log('Grid4: Initialization complete!');
            } catch (error) {
                console.error('Grid4: Error during initialization:', error);
            }
        }
        
        function stopWrapperBackgroundMonitoring() {
            try {
                // Clear only specific, known Grid4 intervals
                if (window.g4c && window.g4c.wrapperMonitorInterval) {
                    clearInterval(window.g4c.wrapperMonitorInterval);
                    window.g4c.wrapperMonitorInterval = null;
                    console.log('Grid4: Stopped specific wrapper background monitoring loop');
                }
                
                // REMOVED DANGEROUS GLOBAL TIMER CLEARING
                // The previous approach of clearing all intervals (1-10000) was dangerous
                // and could break the entire NetSapiens portal functionality.
                // Now using surgical timer identification via TimerDiagnostic instead.
                
                console.log('Grid4: Safe performance cleanup completed - dangerous timer clearing removed');
            } catch (error) {
                console.warn('Grid4: Error stopping wrapper monitoring:', error);
            }
        }
        
        /**
         * Load Grid4 Showcase Features - Dopamine-inducing premium experience
         * Production-ready with features ON by default for seamless user experience
         * Includes: Toast Notifications, Loading Animations, Feature Flag UI, Theme System
         */
        function loadShowcaseFeatures() {
            try {
                console.log('Grid4: Loading production-ready showcase features...');
                
                // PRODUCTION MODE: Enable all core features by default
                var coreFeatures = [
                    'showcaseFeatures',
                    'commandPalette', 
                    'themeSystem',
                    'modernTables',
                    'smoothAnimations',
                    'optimisticUpdates'
                ];
                
                coreFeatures.forEach(function(feature) {
                    if (!window.g4c.isFeatureEnabled(feature)) {
                        window.g4c.enableFeature(feature);
                        console.log('Grid4: ✅ Enabled production feature:', feature);
                    }
                });
                
                // Load Theme System FIRST for immediate visual impact
                loadThemeSystem();
                
                // Load Showcase Features
                if (window.g4c.isFeatureEnabled('showcaseFeatures')) {
                    var script = document.createElement('script');
                    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/showcase-features.js';
                    script.async = true;
                    script.onload = function() {
                        console.log('Grid4: 🎉 Showcase features loaded - Premium experience activated!');
                    };
                    script.onerror = function() {
                        console.warn('Grid4: Failed to load showcase features - continuing with core theme');
                    };
                    document.head.appendChild(script);
                }
                
                // Load Command Palette
                if (window.g4c.isFeatureEnabled('commandPalette')) {
                    loadCommandPalette();
                }
                
            } catch (error) {
                console.error('Grid4: Error loading showcase features:', error);
            }
        }
        
        /**
         * Load Theme System v2.0 - Multi-theme with WCAG compliance
         * CRITICAL: Fixes white text on white background issues
         * Includes: Light/Dark/High-Contrast themes, smooth transitions, dopamine UX
         */
        function loadThemeSystem() {
            try {
                console.log('Grid4: Loading Theme System v2.0...');
                
                // Load Theme Switcher JavaScript
                var script = document.createElement('script');
                script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-theme-switcher-v2.js?v=' + new Date().getTime();
                script.onload = function() {
                    console.log('Grid4: 🎨 Theme System v2.0 loaded - WCAG compliant themes active!');
                    
                    // Show theme loaded notification
                    if (window.Grid4Themes && window.Grid4Themes.showThemeNotification) {
                        setTimeout(function() {
                            window.Grid4Themes.showThemeNotification('🎨 Multi-theme system ready! Press Ctrl+Shift+T', 'success');
                        }, 1000);
                    }
                };
                script.onerror = function() {
                    console.error('Grid4: Failed to load Theme System - using basic styles');
                };
                document.head.appendChild(script);
                
            } catch (error) {
                console.error('Grid4: Error loading Theme System:', error);
            }
        }
        
        /**
         * Load ZenAI Application Shell v2.0 - Observer-based hydration pattern
         * Implements Gemini AI's architectural recommendations for enterprise-grade performance
         */
        function loadZenAIApplicationShell() {
            try {
                console.log('Grid4: Initializing ZenAI Application Shell v2.0...');
                
                // Enable discovery mode by default for development
                if (!window.g4c.isFeatureEnabled('discoveryMode')) {
                    window.g4c.enableFeature('discoveryMode');
                }
                
                // Load the Application Shell using our API
                setTimeout(function() {
                    window.g4c.loadApplicationShell();
                }, 1000); // Allow core features to load first
                
            } catch (error) {
                console.error('Grid4: Error loading ZenAI Application Shell:', error);
            }
        }
        
        /**
         * Load Command Palette - VS Code inspired command interface
         * Activation: Ctrl+Shift+P
         */
        function loadCommandPalette() {
            try {
                console.log('Grid4: Loading command palette...');
                
                var script = document.createElement('script');
                script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.js';
                script.async = true;
                script.onload = function() {
                    console.log('Grid4: 🎯 Command Palette loaded - Press Ctrl+Shift+K to activate!');
                };
                script.onerror = function() {
                    console.warn('Grid4: Failed to load command palette');
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('Grid4: Error loading command palette:', error);
            }
        }
        
        /**
         * Load Adaptive Enhancement System - Portal Context Manager + Enhancement Modules
         * Handles multi-tenant portal variations and cross-browser rendering issues
         * Self-healing architecture for consistent user experience
         */
        function loadAdaptiveEnhancementSystem() {
            try {
                console.log('Grid4: Loading adaptive enhancement system...');
                
                // First, load the Portal Context Manager
                var contextManagerScript = document.createElement('script');
                contextManagerScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/portal-context-manager.js';
                contextManagerScript.async = true;
                contextManagerScript.onload = function() {
                    console.log('Grid4: 🔍 Portal Context Manager loaded - Adaptive system ready');
                    
                    // Then load enhancement modules
                    loadEnhancementModules();
                };
                contextManagerScript.onerror = function() {
                    console.warn('Grid4: Failed to load Portal Context Manager - falling back to basic enhancements');
                };
                document.head.appendChild(contextManagerScript);
                
            } catch (error) {
                console.error('Grid4: Error loading adaptive enhancement system:', error);
            }
        }
        
        /**
         * Load Individual Enhancement Modules
         * Each module is self-contained and handles its own initialization
         */
        function loadEnhancementModules() {
            try {
                console.log('Grid4: Loading adaptive enhancement modules...');
                
                // Load Consistency Engine (universal polish and appeal system)
                var consistencyEngineScript = document.createElement('script');
                consistencyEngineScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/consistency-engine.js';
                consistencyEngineScript.async = true;
                consistencyEngineScript.onload = function() {
                    console.log('Grid4: ✨ Consistency Engine loaded - Universal polish system active');
                };
                consistencyEngineScript.onerror = function() {
                    console.warn('Grid4: Failed to load Consistency Engine');
                };
                document.head.appendChild(consistencyEngineScript);
                
                // Load Logo Enhancement (Grid4 branding system)
                var logoEnhancementScript = document.createElement('script');
                logoEnhancementScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/logo-enhancement.js';
                logoEnhancementScript.async = true;
                logoEnhancementScript.onload = function() {
                    console.log('Grid4: 🎨 Logo Enhancement loaded - Grid4 branding system ready');
                };
                logoEnhancementScript.onerror = function() {
                    console.warn('Grid4: Failed to load Logo Enhancement');
                };
                document.head.appendChild(logoEnhancementScript);
                
                // Load Modern UI Experiments (fonts, frameworks, tooling)
                var modernUIScript = document.createElement('script');
                modernUIScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/modern-ui-experiments.js';
                modernUIScript.async = true;
                modernUIScript.onload = function() {
                    console.log('Grid4: 🎨 Modern UI Experiments loaded - Press Ctrl+Alt+F to cycle fonts!');
                };
                modernUIScript.onerror = function() {
                    console.warn('Grid4: Failed to load Modern UI Experiments');
                };
                document.head.appendChild(modernUIScript);
                
                // Load Feature Flags UI (beautiful feature management interface)
                var featureFlagsUIScript = document.createElement('script');
                featureFlagsUIScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/feature-flags-ui.js';
                featureFlagsUIScript.async = true;
                featureFlagsUIScript.onload = function() {
                    console.log('Grid4: 🎛️ Feature Flags UI loaded - Press F to manage features!');
                };
                featureFlagsUIScript.onerror = function() {
                    console.warn('Grid4: Failed to load Feature Flags UI');
                };
                document.head.appendChild(featureFlagsUIScript);
                
                // Load Feature Showcase (interactive demo system)
                var featureShowcaseScript = document.createElement('script');
                featureShowcaseScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/feature-showcase.js';
                featureShowcaseScript.async = true;
                featureShowcaseScript.onload = function() {
                    console.log('Grid4: 🎭 Feature Showcase loaded - Press Ctrl+Shift+D for demo!');
                };
                featureShowcaseScript.onerror = function() {
                    console.warn('Grid4: Failed to load Feature Showcase');
                };
                document.head.appendChild(featureShowcaseScript);
                
                // Load Vertical Centering Fix (addresses cross-browser menu centering issues)
                var verticalCenteringScript = document.createElement('script');
                verticalCenteringScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/vertical-centering-fix.js';
                verticalCenteringScript.async = true;
                verticalCenteringScript.onload = function() {
                    console.log('Grid4: 🎯 Vertical Centering Fix loaded - Navigation centering issues resolved');
                };
                verticalCenteringScript.onerror = function() {
                    console.warn('Grid4: Failed to load Vertical Centering Fix');
                };
                document.head.appendChild(verticalCenteringScript);
                
                // Load Modern Data Tables (Grid.js integration for enterprise-grade table performance)
                var modernTablesScript = document.createElement('script');
                modernTablesScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/modern-data-tables.js';
                modernTablesScript.async = true;
                modernTablesScript.onload = function() {
                    console.log('Grid4: 📊 Modern Data Tables loaded - Enterprise-grade table performance active');
                };
                modernTablesScript.onerror = function() {
                    console.warn('Grid4: Failed to load Modern Data Tables');
                };
                document.head.appendChild(modernTablesScript);
                
                // Load Consistency Engine V2 (class-based CSS architecture for performance)
                var consistencyEngineV2Script = document.createElement('script');
                consistencyEngineV2Script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/consistency-engine-v2.js';
                consistencyEngineV2Script.async = true;
                consistencyEngineV2Script.onload = function() {
                    console.log('Grid4: ⚡ Consistency Engine V2 loaded - Class-based performance revolution active');
                };
                consistencyEngineV2Script.onerror = function() {
                    console.warn('Grid4: Failed to load Consistency Engine V2');
                };
                document.head.appendChild(consistencyEngineV2Script);
                
                // Future enhancement modules can be added here
                // Example: loadResponseDataCache(), loadAccessibilityEnhancement(), etc.
                
            } catch (error) {
                console.error('Grid4: Error loading enhancement modules:', error);
            }
        }
        
        // Wait for DOM to be ready, then initialize
        $(document).ready(function() {
            // Additional check to ensure portal elements are present
            var checkPortalReady = function() {
                if ($('#navigation').length > 0 && $('#nav-buttons').length > 0) {
                    initializeAll();
                } else {
                    // Retry up to 10 times
                    if (typeof checkPortalReady.attempts === 'undefined') {
                        checkPortalReady.attempts = 0;
                    }
                    
                    if (checkPortalReady.attempts < 10) {
                        checkPortalReady.attempts++;
                        setTimeout(checkPortalReady, 500);
                    } else {
                        console.warn('Grid4: Portal elements not found after 10 attempts');
                    }
                }
            };
            
            checkPortalReady();
        });
        
        // Expose minimal, safe API globally
        window.Grid4 = {
            version: '3.0',
            reinitialize: initializeAll
        };
    }
    
    // Start the initialization process
    waitForJQuery(initializeGrid4Portal);
    
})();