/* Grid4 Communications Custom NetSapiens Portal JavaScript */

(function() {
    'use strict';
    
    // Wait for jQuery to be available
    if (typeof $ === 'undefined' && typeof jQuery === 'undefined') {
        console.log('Grid4: jQuery not available, waiting...');
        setTimeout(arguments.callee, 100);
        return;
    }
    
    var $ = window.jQuery || window.$;
    
    // Configuration
    var CONFIG = {
        companyName: 'Grid4 Communications',
        brandColor: '#0099ff',
        debug: true,
        version: '1.2.2'
    };
    
    // Browser detection for compatibility fixes
    var BROWSER_INFO = {
        isEdge: /Edge\/\d+/.test(navigator.userAgent) || /Edg\/\d+/.test(navigator.userAgent),
        isIE: /MSIE \d+/.test(navigator.userAgent) || /Trident\/\d+/.test(navigator.userAgent),
        isChrome: /Chrome\/\d+/.test(navigator.userAgent) && !/Edge\/\d+/.test(navigator.userAgent),
        isFirefox: /Firefox\/\d+/.test(navigator.userAgent),
        isSafari: /Safari\/\d+/.test(navigator.userAgent) && !/Chrome\/\d+/.test(navigator.userAgent)
    };
    
    // Initialize Grid4 enhancements
    function initGrid4Portal() {
        if (CONFIG.debug) {
            console.log('Grid4: Initializing portal enhancements v' + CONFIG.version + '...');
            console.log('Grid4: Browser detected as:', getBrowserName());
        }
        
        // Apply browser-specific fixes
        applyBrowserFixes();
        
        // Ensure FontAwesome is available
        ensureFontAwesome();
        
        // Add mobile toggle for navigation
        addMobileToggle();
        
        // Add Grid4 branding
        addGrid4Branding();
        
        // Add toolbar enhancements (from Sean's approach)
        addToolbarEnhancements();
        
        // Enhanced UI interactions
        enhanceUIInteractions();
        
        // Improve navigation accessibility
        enhanceAccessibility();
        
        // Add performance optimizations
        optimizePerformance();
        
        if (CONFIG.debug) {
            console.log('Grid4: Portal enhancements complete');
        }
    }
    
    // Get browser name for debugging
    function getBrowserName() {
        if (BROWSER_INFO.isEdge) return 'Microsoft Edge';
        if (BROWSER_INFO.isIE) return 'Internet Explorer';
        if (BROWSER_INFO.isChrome) return 'Google Chrome';
        if (BROWSER_INFO.isFirefox) return 'Mozilla Firefox';
        if (BROWSER_INFO.isSafari) return 'Apple Safari';
        return 'Unknown Browser';
    }
    
    // Apply browser-specific fixes
    function applyBrowserFixes() {
        var browserClass = 'grid4-browser-unknown';
        
        // Force sidebar navigation to appear regardless of browser
        var forceNavigationStyle = '<style id="grid4-force-navigation">' +
            '/* Force navigation to appear - override any conflicting styles */' +
            '#navigation { ' +
                'position: fixed !important; ' +
                'display: block !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' +
                'left: 0 !important; ' +
                'top: 60px !important; ' +
                'width: 220px !important; ' +
                'height: calc(100vh - 60px) !important; ' +
                'background-color: #1e2736 !important; ' +
                'z-index: 1000 !important; ' +
                'transform: translateX(0) !important; ' +
            '}' +
            '#nav-buttons { ' +
                'display: flex !important; ' +
                'flex-direction: column !important; ' +
                'list-style: none !important; ' +
                'margin: 0 !important; ' +
                'padding: 0 !important; ' +
            '}' +
            '.wrapper { margin-left: 220px !important; }' +
            '</style>';
        
        if (BROWSER_INFO.isEdge) {
            browserClass = 'grid4-browser-edge';
            // Additional Edge-specific fixes
            forceNavigationStyle += '<style>' +
                '/* Edge-specific additional fixes */' +
                ':root { --grid4-sidebar-width: 220px; }' +
                '</style>';
        } else if (BROWSER_INFO.isIE) {
            browserClass = 'grid4-browser-ie';
            console.warn('Grid4: Internet Explorer detected - limited functionality may be available');
        } else if (BROWSER_INFO.isChrome) {
            browserClass = 'grid4-browser-chrome';
        } else if (BROWSER_INFO.isFirefox) {
            browserClass = 'grid4-browser-firefox';
        } else if (BROWSER_INFO.isSafari) {
            browserClass = 'grid4-browser-safari';
        }
        
        // Always apply the force navigation style
        $('head').append(forceNavigationStyle);
        $('body').addClass(browserClass);
        
        if (CONFIG.debug) {
            console.log('Grid4: Applied browser class:', browserClass);
            console.log('Grid4: Force navigation style applied');
        }
    }
    
    // Ensure FontAwesome is available
    function ensureFontAwesome() {
        if (!$('link[href*="font-awesome"]').length && !$('link[href*="fontawesome"]').length) {
            if (CONFIG.debug) {
                console.log('Grid4: FontAwesome not detected, ensuring fallback icons...');
            }
            // Add fallback styling for when FontAwesome isn't available
            var fallbackStyle = '<style>' +
                '#nav-buttons li a.nav-link::before { content: "•" !important; font-family: inherit !important; }' +
                '</style>';
            $('head').append(fallbackStyle);
        }
    }
    
    // Add mobile toggle button for navigation
    function addMobileToggle() {
        if ($('.grid4-mobile-toggle').length) return; // Already exists
        
        var toggleHtml = '<button class="grid4-mobile-toggle" id="grid4-mobile-toggle" ' +
                        'aria-label="Toggle Navigation Menu" title="Toggle Navigation">' +
                        '<i class="fa fa-bars" aria-hidden="true"></i>' +
                        '</button>';
        
        $('body').append(toggleHtml);
        
        // Mobile toggle functionality with improved UX
        $('#grid4-mobile-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $nav = $('#navigation');
            var isActive = $nav.hasClass('mobile-active');
            
            $nav.toggleClass('mobile-active');
            $(this).attr('aria-expanded', !isActive);
            
            // Update icon
            var $icon = $(this).find('i');
            if (!isActive) {
                $icon.removeClass('fa-bars').addClass('fa-times');
            } else {
                $icon.removeClass('fa-times').addClass('fa-bars');
            }
        });
        
        // Close on overlay click with improved detection
        $(document).on('click touchstart', function(e) {
            if ($(window).width() <= 768 && 
                !$(e.target).closest('#navigation, #grid4-mobile-toggle').length &&
                $('#navigation').hasClass('mobile-active')) {
                $('#navigation').removeClass('mobile-active');
                $('#grid4-mobile-toggle').attr('aria-expanded', 'false');
                $('#grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
            }
        });
        
        // Handle escape key
        $(document).on('keydown', function(e) {
            if (e.keyCode === 27 && $('#navigation').hasClass('mobile-active')) {
                $('#navigation').removeClass('mobile-active');
                $('#grid4-mobile-toggle').attr('aria-expanded', 'false').focus();
                $('#grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
            }
        });
    }
    
    // Add Grid4 branding elements safely
    function addGrid4Branding() {
        // Update page title
        document.title = CONFIG.companyName + ' - ' + document.title.replace('Manager Portal - ', '');
        
        // Add custom footer text if footer exists
        var $footer = $('#footer');
        if ($footer.length && !$footer.find('.grid4-footer-text').length) {
            var currentYear = new Date().getFullYear();
            var footerText = '<div class="grid4-footer-text" style="text-align: center; padding: 10px 0; color: #b3c2d3; border-top: 1px solid #4a5668; margin-top: 10px;">' +
                           'Powered by ' + CONFIG.companyName + ' © ' + currentYear + '</div>';
            $footer.append(footerText);
        }
    }
    
    // Add toolbar enhancements (minimal, based on Sean's approach)
    function addToolbarEnhancements() {
        var $toolbar = $('.user-toolbar');
        if (!$toolbar.length) return;
        
        // Add Grid4 knowledgebase link if not exists
        var kbExists = $toolbar.find('a[href*="grid4.com"]').length;
        if (!kbExists) {
            var kbLink = '<li><a href="https://www.grid4.com" target="_blank">Grid4 Resources</a></li>';
            $toolbar.prepend(kbLink);
        }
    }
    
    // Enhance UI interactions without breaking existing functionality
    function enhanceUIInteractions() {
        // Don't interfere with portal's critical components
        var criticalSelectors = [
            '.user-toolbar',
            '#omp-usage-stats', 
            '.stats-panel-home',
            '.dropdown-menu',
            '[data-toggle="popover"]',
            '[data-toggle="tooltip"]',
            '.loading-spinner',
            '.stats-tables'
        ];
        
        // Add fade-in animation to panels (safe enhancement) but avoid critical components
        $('.panel, .widget, .box, .rounded').each(function(index) {
            var $elem = $(this);
            var isCritical = false;
            
            // Check if this element or its parents are critical
            for (var i = 0; i < criticalSelectors.length; i++) {
                if ($elem.is(criticalSelectors[i]) || $elem.closest(criticalSelectors[i]).length) {
                    isCritical = true;
                    break;
                }
            }
            
            if (!isCritical && !$elem.hasClass('grid4-animated')) {
                $elem.addClass('grid4-animated');
                // Use CSS transition instead of jQuery animation to avoid conflicts
                $elem.css({
                    'opacity': '0',
                    'transition': 'opacity 0.3s ease'
                });
                setTimeout(function() {
                    $elem.css('opacity', '1');
                }, index * 50);
            }
        });
        
        // Enhanced table hover effects (but avoid ones with existing handlers)
        $('.table tbody tr').not('[data-toggle]').off('mouseenter.grid4 mouseleave.grid4').on('mouseenter.grid4', function() {
            $(this).addClass('grid4-table-hover');
        }).on('mouseleave.grid4', function() {
            $(this).removeClass('grid4-table-hover');
        });
        
        // Smooth transitions for buttons (CSS only, no event handlers)
        $('.btn').not('[data-toggle]').addClass('grid4-btn-enhanced');
        
        // Enhanced form focus states (safe with namespaced events)
        $('input, select, textarea').not('[data-toggle]').off('focus.grid4 blur.grid4').on('focus.grid4', function() {
            $(this).addClass('grid4-focus');
        }).on('blur.grid4', function() {
            $(this).removeClass('grid4-focus');
        });
    }
    
    // Safe keyboard shortcuts
    function addKeyboardShortcuts() {
        $(document).on('keydown', function(e) {
            // Only add non-conflicting shortcuts
            if (e.altKey && e.shiftKey && e.keyCode === 72) { // Alt+Shift+H for home
                e.preventDefault();
                window.location.href = '/portal/home';
            }
        });
    }
    
    // Handle page navigation updates (preserve portal functionality)
    function handleNavigationUpdates() {
        // Watch for navigation changes and maintain our enhancements
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.target.id === 'content') {
                    // Content has changed, re-apply safe enhancements
                    setTimeout(function() {
                        enhanceUIInteractions();
                    }, 100);
                }
            });
        });
        
        var targetNode = document.getElementById('content');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }
    
    // Initialize when DOM is ready and portal scripts have loaded
    $(document).ready(function() {
        // Wait a bit to ensure portal initialization is complete
        setTimeout(function() {
            if (CONFIG.debug) {
                console.log('Grid4: Starting initialization...');
                console.log('Grid4: User Agent:', navigator.userAgent);
                console.log('Grid4: Viewport:', $(window).width() + 'x' + $(window).height());
            }
            
            // Check if navigation exists before proceeding
            if ($('#navigation').length) {
                initGrid4Portal();
                addKeyboardShortcuts();
                handleNavigationUpdates();
                
                // Verify navigation is visible after initialization
                setTimeout(function() {
                    verifyNavigationVisible();
                }, 1000);
            } else {
                console.warn('Grid4: Navigation element not found, retrying in 1 second...');
                setTimeout(function() {
                    if ($('#navigation').length) {
                        initGrid4Portal();
                        addKeyboardShortcuts();
                        handleNavigationUpdates();
                        setTimeout(function() {
                            verifyNavigationVisible();
                        }, 1000);
                    } else {
                        console.error('Grid4: Navigation element not found after retry');
                    }
                }, 1000);
            }
        }, 500);
    });
    
    // Also initialize on AJAX complete to handle dynamic content
    // But be careful not to interfere with portal's own AJAX calls
    var lastAjaxEnhance = 0;
    $(document).ajaxComplete(function(event, xhr, settings) {
        // Throttle to avoid spam and only enhance for specific non-critical calls
        var now = Date.now();
        if (now - lastAjaxEnhance < 5000) return; // Wait 5 seconds between enhancements
        
        if (settings.url && 
            !settings.url.includes('/stats/') && 
            !settings.url.includes('/home/') &&
            !settings.url.includes('/count/') &&
            !settings.url.includes('/ns-api/') &&
            !settings.url.includes('google-analytics')) {
            
            lastAjaxEnhance = now;
            if (CONFIG.debug) {
                console.log('Grid4: AJAX complete for non-critical URL, re-enhancing UI');
            }
            setTimeout(function() {
                enhanceUIInteractions();
            }, 200);
        }
    });
    
    // Add accessibility enhancements
    function enhanceAccessibility() {
        // Add ARIA labels to navigation items
        $('#nav-buttons li a.nav-link').each(function() {
            var $link = $(this);
            var text = $link.find('.nav-text').text().trim();
            if (text) {
                $link.attr('aria-label', 'Navigate to ' + text);
            }
        });
        
        // Add skip link for keyboard navigation
        if (!$('#skip-to-main').length) {
            var skipLink = '<a href="#content" id="skip-to-main" class="sr-only sr-only-focusable" ' +
                          'style="position: absolute; top: -40px; left: 6px; width: 1px; height: 1px; ' +
                          'padding: 8px 12px; background: #000; color: #fff; text-decoration: none; ' +
                          'border-radius: 4px; z-index: 10000;">Skip to main content</a>';
            $('body').prepend(skipLink);
            
            // Show skip link on focus
            $('#skip-to-main').on('focus', function() {
                $(this).css({
                    'position': 'absolute',
                    'top': '10px',
                    'left': '10px',
                    'width': 'auto',
                    'height': 'auto'
                });
            }).on('blur', function() {
                $(this).css({
                    'position': 'absolute',
                    'top': '-40px',
                    'left': '6px',
                    'width': '1px',
                    'height': '1px'
                });
            });
        }
    }
    
    // Performance optimizations
    function optimizePerformance() {
        // Throttle resize events
        var resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Update mobile toggle visibility
                var isMobile = $(window).width() <= 768;
                $('#grid4-mobile-toggle').toggle(isMobile);
                
                // Reset navigation state on desktop
                if (!isMobile) {
                    $('#navigation').removeClass('mobile-active');
                    $('#grid4-mobile-toggle').attr('aria-expanded', 'false');
                    $('#grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
                }
            }, 150);
        });
        
        // Optimize scroll performance
        var ticking = false;
        $(window).on('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    // Add scroll-based effects here if needed
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // Verify navigation is visible and working
    function verifyNavigationVisible() {
        var $nav = $('#navigation');
        var isVisible = $nav.is(':visible') && $nav.css('position') === 'fixed';
        var hasItems = $('#nav-buttons li').length > 0;
        
        if (CONFIG.debug) {
            console.log('Grid4: Navigation verification:');
            console.log('  - Element exists:', $nav.length > 0);
            console.log('  - Is visible:', isVisible);
            console.log('  - Position:', $nav.css('position'));
            console.log('  - Display:', $nav.css('display'));
            console.log('  - Left position:', $nav.css('left'));
            console.log('  - Width:', $nav.css('width'));
            console.log('  - Nav items:', hasItems ? $('#nav-buttons li').length : 0);
        }
        
        if (!isVisible || !hasItems) {
            console.warn('Grid4: Navigation not properly visible, applying emergency fixes...');
            applyEmergencyNavigationFix();
        } else {
            console.log('Grid4: Navigation verification passed');
        }
    }
    
    // Emergency navigation fix for problematic machines
    function applyEmergencyNavigationFix() {
        var emergencyCSS = '<style id="grid4-emergency-nav">' +
            '/* Emergency navigation fix - ultra aggressive */' +
            '#navigation { ' +
                'position: fixed !important; ' +
                'display: block !important; ' +
                'visibility: visible !important; ' +
                'opacity: 1 !important; ' +
                'left: 0px !important; ' +
                'top: 60px !important; ' +
                'width: 220px !important; ' +
                'height: calc(100vh - 60px) !important; ' +
                'background: #1e2736 !important; ' +
                'border-right: 1px solid #334155 !important; ' +
                'z-index: 1000 !important; ' +
                'transform: none !important; ' +
                'margin: 0 !important; ' +
                'padding: 0 !important; ' +
                'overflow-y: auto !important; ' +
            '}' +
            '#nav-buttons { ' +
                'display: flex !important; ' +
                'flex-direction: column !important; ' +
                'width: 100% !important; ' +
                'padding: 0 !important; ' +
                'margin: 0 !important; ' +
                'list-style: none !important; ' +
            '}' +
            '#nav-buttons li { width: 100% !important; margin: 0 !important; }' +
            '#nav-buttons li a.nav-link { ' +
                'display: flex !important; ' +
                'padding: 16px 24px !important; ' +
                'color: #8892a3 !important; ' +
                'text-decoration: none !important; ' +
                'align-items: center !important; ' +
            '}' +
            '.wrapper { margin-left: 220px !important; }' +
            '</style>';
        
        // Remove any existing emergency CSS first
        $('#grid4-emergency-nav').remove();
        $('head').append(emergencyCSS);
        
        console.log('Grid4: Emergency navigation fix applied');
    }
    
    // Global Grid4 object for debugging and control
    window.Grid4 = {
        config: CONFIG,
        browser: BROWSER_INFO,
        reinitialize: initGrid4Portal,
        version: CONFIG.version,
        utils: {
            ensureFontAwesome: ensureFontAwesome,
            enhanceAccessibility: enhanceAccessibility,
            optimizePerformance: optimizePerformance,
            getBrowserName: getBrowserName,
            applyBrowserFixes: applyBrowserFixes,
            verifyNavigationVisible: verifyNavigationVisible,
            applyEmergencyNavigationFix: applyEmergencyNavigationFix
        }
    };
    
})();