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
        version: '1.2.0'
    };
    
    // Initialize Grid4 enhancements
    function initGrid4Portal() {
        if (CONFIG.debug) {
            console.log('Grid4: Initializing portal enhancements v' + CONFIG.version + '...');
        }
        
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
        // Add fade-in animation to panels (safe enhancement)
        $('.panel, .widget, .box, .rounded').each(function(index) {
            var $elem = $(this);
            if (!$elem.hasClass('grid4-animated')) {
                $elem.addClass('grid4-animated');
                $elem.css('opacity', '0').delay(index * 50).animate({opacity: 1}, 300);
            }
        });
        
        // Enhanced table hover effects
        $('.table tbody tr').on('mouseenter', function() {
            $(this).addClass('grid4-table-hover');
        }).on('mouseleave', function() {
            $(this).removeClass('grid4-table-hover');
        });
        
        // Smooth transitions for buttons
        $('.btn').addClass('grid4-btn-enhanced');
        
        // Enhanced form focus states
        $('input, select, textarea').on('focus', function() {
            $(this).addClass('grid4-focus');
        }).on('blur', function() {
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
            } else {
                console.warn('Grid4: Navigation element not found, retrying in 1 second...');
                setTimeout(function() {
                    if ($('#navigation').length) {
                        initGrid4Portal();
                        addKeyboardShortcuts();
                        handleNavigationUpdates();
                    } else {
                        console.error('Grid4: Navigation element not found after retry');
                    }
                }, 1000);
            }
        }, 500);
    });
    
    // Also initialize on AJAX complete to handle dynamic content
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            enhanceUIInteractions();
        }, 100);
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
    
    // Global Grid4 object for debugging and control
    window.Grid4 = {
        config: CONFIG,
        reinitialize: initGrid4Portal,
        version: CONFIG.version,
        utils: {
            ensureFontAwesome: ensureFontAwesome,
            enhanceAccessibility: enhanceAccessibility,
            optimizePerformance: optimizePerformance
        }
    };
    
})();