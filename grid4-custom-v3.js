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
    
    // Main initialization function
    function initializeGrid4Portal($) {
        console.log('Grid4: Starting non-destructive portal initialization...');
        
        // Set global flag
        window.grid4PortalInitialized = true;
        
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
                });
                
                console.log('Grid4: Keyboard support added');
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
                console.log('Grid4: Wrapper background fixed');
            } catch (e) {
                console.warn('Grid4: Error fixing wrapper background:', e);
            }
        }
        
        function monitorWrapperBackground() {
            try {
                // Force fix every 2 seconds
                setInterval(forceWrapperBackground, 2000);
                
                // Also monitor for style changes if MutationObserver is available
                if (window.MutationObserver) {
                    var wrapperObserver = new MutationObserver(function(mutations) {
                        var needsWrapperFix = false;
                        for (var i = 0; i < mutations.length; i++) {
                            var mutation = mutations[i];
                            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                                var target = mutation.target;
                                if (target.classList && target.classList.contains('wrapper')) {
                                    needsWrapperFix = true;
                                    break;
                                }
                            }
                        }
                        if (needsWrapperFix) {
                            setTimeout(forceWrapperBackground, 50);
                        }
                    });
                    
                    // Start observing wrapper changes
                    var wrapperElements = document.querySelectorAll('.wrapper');
                    for (var i = 0; i < wrapperElements.length; i++) {
                        wrapperObserver.observe(wrapperElements[i], {
                            attributes: true,
                            attributeFilter: ['style']
                        });
                    }
                    console.log('Grid4: Wrapper background monitoring set up');
                }
            } catch (error) {
                console.error('Grid4: Error setting up wrapper monitoring:', error);
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
                
                // Force wrapper background fix
                forceWrapperBackground();
                monitorWrapperBackground();
                
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