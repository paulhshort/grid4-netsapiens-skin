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
                    
                    // Command Palette: Ctrl+Shift+P (like VS Code) (feature flag protected)
                    if (window.g4c.isFeatureEnabled('commandPalette') && e.ctrlKey && e.shiftKey && e.key === 'P') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Command Palette triggered (Ctrl+Shift+P)');
                        window.g4c.loadCommandPalette();
                    }
                });
                
                console.log('Grid4: Keyboard support added');
                
                // Log feature flag status for debugging
                if (window.g4c.isFeatureEnabled('commandPalette')) {
                    console.log('Grid4: Command Palette feature is ENABLED - Press Ctrl+Shift+P to activate');
                } else {
                    console.log('Grid4: Command Palette feature is DISABLED - Enable with g4c.enableFeature("commandPalette")');
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
                var wrappers = document.querySelectorAll('.wrapper');
                for (var i = 0; i < wrappers.length; i++) {
                    var wrapper = wrappers[i];
                    wrapper.style.setProperty('background-color', '#1c1e22', 'important');
                    wrapper.style.setProperty('background', '#1c1e22', 'important');
                }
            } catch (e) {
                console.warn('Grid4: Error fixing wrapper background:', e);
            }
        }
        
        function initializeAll() {
            try {
                console.log('Grid4: Initializing all modules...');
                
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