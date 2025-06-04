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
        debug: true
    };
    
    // Initialize Grid4 enhancements
    function initGrid4Portal() {
        if (CONFIG.debug) {
            console.log('Grid4: Initializing portal enhancements...');
        }
        
        // Add mobile toggle for navigation
        addMobileToggle();
        
        // Add Grid4 branding
        addGrid4Branding();
        
        // Add toolbar enhancements (from Sean's approach)
        addToolbarEnhancements();
        
        // Enhanced UI interactions
        enhanceUIInteractions();
        
        if (CONFIG.debug) {
            console.log('Grid4: Portal enhancements complete');
        }
    }
    
    // Add mobile toggle button for navigation
    function addMobileToggle() {
        if ($('.grid4-mobile-toggle').length) return; // Already exists
        
        var toggleHtml = '<button class="grid4-mobile-toggle" id="grid4-mobile-toggle">' +
                        '<i class="fa fa-bars"></i>' +
                        '</button>';
        
        $('body').append(toggleHtml);
        
        // Mobile toggle functionality
        $('#grid4-mobile-toggle').on('click', function() {
            $('#navigation').toggleClass('mobile-active');
        });
        
        // Close on overlay click
        $(document).on('click', function(e) {
            if ($(window).width() <= 768 && 
                !$(e.target).closest('#navigation, #grid4-mobile-toggle').length) {
                $('#navigation').removeClass('mobile-active');
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
            }
            initGrid4Portal();
            addKeyboardShortcuts();
            handleNavigationUpdates();
        }, 500);
    });
    
    // Also initialize on AJAX complete to handle dynamic content
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            enhanceUIInteractions();
        }, 100);
    });
    
    // Global Grid4 object for debugging
    window.Grid4 = {
        config: CONFIG,
        reinitialize: initGrid4Portal,
        version: '1.1.0'
    };
    
})();