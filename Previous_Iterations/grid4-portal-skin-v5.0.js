/* ===================================================================
   GRID4 NETSAPIENS PORTAL SKIN v5.0
   ARCHITECTURE: SCOPED APP SHELL
   - JS is focused on shell injection and theme management.
   - No longer attempts to fix or style the Contacts Dock.
   - Cleaner, more maintainable, and event-driven.
   =================================================================== */

(function($, window, document) {
    'use strict';

    // Self-executing function to prevent Flash of Unstyled Content (FOUC)
    // This runs immediately, before the main script.
    (function() {
        try {
            const theme = localStorage.getItem('grid4_theme') || 'theme-dark';
            // Create a temporary style tag to set the body background color instantly.
            const style = document.createElement('style');
            const bgColor = theme === 'theme-dark' ? '#1a2332' : '#f8f9fa';
            style.textContent = `body { background-color: ${bgColor} !important; opacity: 0; }`;
            document.head.appendChild(style);
        } catch (e) {
            console.error('Grid4 FOUC Prevention Failed:', e);
        }
    })();

    const Grid4Portal = {
        // --- CONFIGURATION ---
        config: {
            version: '5.0.10',
            shellId: 'grid4-app-shell',
            themeKey: 'grid4_theme',
            defaultTheme: 'theme-dark',
            initialized: false
        },

        // --- INITIALIZATION ---
        init: function() {
            if (this.config.initialized) return;
            console.log(`Initializing Grid4 Portal Skin v${this.config.version}`);

            this.shellManager.init();
            this.themeManager.init();
            this.uiEnhancements.init();
            this.modalManager.init();

            // Make body visible now that styles are ready
            $('body').css('opacity', 1);
            
            this.config.initialized = true;
            console.log('Grid4 Portal Skin Initialized.');
        },

        // --- MODULES ---

        /**
         * Manages the creation of the scoped app shell.
         */
        shellManager: {
            init: function() {
                const shellSelector = '#' + Grid4Portal.config.shellId;
                if ($(shellSelector).length === 0) {
                    $('.wrapper').wrap(`<div id="${Grid4Portal.config.shellId}"></div>`);
                    console.log('Grid4 App Shell injected.');
                }
            }
        },

        /**
         * Manages the light/dark theme.
         */
        themeManager: {
            init: function() {
                this.createToggleButton();
                this.applyTheme();
                this.bindEvents();
            },
            
            applyTheme: function() {
                const savedTheme = localStorage.getItem(Grid4Portal.config.themeKey) || Grid4Portal.config.defaultTheme;
                $('#' + Grid4Portal.config.shellId).removeClass('theme-light theme-dark').addClass(savedTheme);
                this.updateToggleIcon(savedTheme);
                console.log(`Theme applied: ${savedTheme}`);
            },

            createToggleButton: function() {
                if ($('#grid4-theme-toggle').length > 0) return;
                const toggleButton = `
                    <button id="grid4-theme-toggle" title="Toggle Theme">
                        <i class="fa"></i>
                    </button>`;
                $('#navigation').append(toggleButton);
            },

            bindEvents: function() {
                $(document).on('click', '#grid4-theme-toggle', () => {
                    const $shell = $('#' + Grid4Portal.config.shellId);
                    const newTheme = $shell.hasClass('theme-dark') ? 'theme-light' : 'theme-dark';
                    
                    $shell.removeClass('theme-light theme-dark').addClass(newTheme);
                    localStorage.setItem(Grid4Portal.config.themeKey, newTheme);
                    this.updateToggleIcon(newTheme);

                    // Re-theme open modals
                    Grid4Portal.modalManager.themeOpenModals();
                    
                    console.log(`Theme switched to: ${newTheme}`);
                });
            },

            updateToggleIcon: function(theme) {
                const $icon = $('#grid4-theme-toggle .fa');
                if (theme === 'theme-dark') {
                    $icon.removeClass('fa-moon-o').addClass('fa-sun-o');
                } else {
                    $icon.removeClass('fa-sun-o').addClass('fa-moon-o');
                }
            }
        },

        /**
         * Manages small UI tweaks and enhancements.
         */
        uiEnhancements: {
            init: function() {
                this.hideHeaderLogo();
                this.enhanceNavigation();
                this.handleDomainBanner();
                this.improveDropdowns();
            },

            hideHeaderLogo: function() {
                $('#header-logo').hide();
            },
            
            handleDomainBanner: function() {
                const adjustContentForBanner = () => {
                    const $domainMessage = $('#domain-message:visible');
                    const $fixedContainer = $('.fixed-container:visible');
                    const $content = $('#content');
                    
                    if (!$content.length) return;
                    
                    let bannerBottom = 0;
                    
                    // Get the bottom position of domain message if visible
                    if ($domainMessage.length > 0) {
                        const rect = $domainMessage[0].getBoundingClientRect();
                        const domainBottom = rect.bottom;
                        if (domainBottom > bannerBottom) {
                            bannerBottom = domainBottom;
                        }
                    }
                    
                    // Get the bottom position of fixed container if visible
                    if ($fixedContainer.length > 0) {
                        const rect = $fixedContainer[0].getBoundingClientRect();
                        const fixedBottom = rect.bottom;
                        if (fixedBottom > bannerBottom) {
                            bannerBottom = fixedBottom;
                        }
                    }
                    
                    // Apply padding to push content below banner
                    if (bannerBottom > 0) {
                        // Add extra 10px for spacing
                        const paddingNeeded = bannerBottom + 10;
                        $content.css('padding-top', paddingNeeded + 'px');
                        $('body').addClass('has-domain-banner');
                        console.log('Domain banner detected, padding content by:', paddingNeeded);
                    } else {
                        $content.css('padding-top', '');
                        $('body').removeClass('has-domain-banner');
                    }
                };
                
                // Run immediately
                adjustContentForBanner();
                
                // Run again after delays to catch dynamic content
                setTimeout(adjustContentForBanner, 100);
                setTimeout(adjustContentForBanner, 500);
                setTimeout(adjustContentForBanner, 1000);
                
                // Also run on window resize
                $(window).on('resize', adjustContentForBanner);
                
                // Watch for changes
                const observer = new MutationObserver(() => {
                    adjustContentForBanner();
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            },

            enhanceNavigation: function() {
                // Add nav-link class to navigation items for Bootstrap compatibility
                $('#nav-buttons li a').addClass('nav-link');
                
                // Ensure active state is properly highlighted
                $('#nav-buttons .nav-link-current').find('a').addClass('active');
                
                // Add icons if not present (using Font Awesome 4.7)
                const iconMap = {
                    'Home': 'fa-home',
                    'Agents': 'fa-users',
                    'Users': 'fa-user',
                    'Conferences': 'fa-video-camera',  // Fixed for FA 4.7
                    'Auto Attendants': 'fa-phone',
                    'Call Queues': 'fa-list',
                    'Time Frames': 'fa-clock-o',
                    'Music On Hold': 'fa-music',
                    'Route Profiles': 'fa-random',
                    'Inventory': 'fa-cube',
                    'Call History': 'fa-history',
                    'Platform Settings': 'fa-cog',
                    'Call Center': 'fa-headphones',  // Fixed for FA 4.7
                    'Reports': 'fa-bar-chart',  // Fixed for FA 4.7
                    'Billing': 'fa-dollar',  // Fixed for FA 4.7
                    'Voicemail': 'fa-envelope',  // Fixed for FA 4.7
                    'Fax': 'fa-fax',
                    'Extensions': 'fa-phone-square',
                    'Devices': 'fa-mobile',  // Fixed for FA 4.7
                    'Numbers': 'fa-hashtag',
                    'Features': 'fa-star',
                    'System': 'fa-server'
                };
                
                // Add icons to all navigation items
                $('#nav-buttons li').each(function() {
                    const $li = $(this);
                    const $link = $li.find('a').first();
                    const $text = $link.find('.nav-text');
                    const text = $text.text().trim();
                    
                    // Debug log
                    if (text === 'Conferences' || text === 'Call Center') {
                        console.log(`Found menu item: ${text}`);
                    }
                    
                    if (iconMap[text] && !$link.find('.fa').length) {
                        // Insert icon before the text span
                        $text.before(`<i class="fa ${iconMap[text]}"></i> `);
                    }
                });
            },
            
            improveDropdowns: function() {
                // Add hover intent behavior to dropdowns
                let dropdownTimer;
                
                // Handle dropdown hover with delay
                $(document).on('mouseenter', '.dropdown, .btn-group', function() {
                    const $this = $(this);
                    clearTimeout(dropdownTimer);
                    
                    // Open dropdown on hover
                    $this.addClass('open');
                }).on('mouseleave', '.dropdown, .btn-group', function() {
                    const $this = $(this);
                    
                    // Add delay before closing
                    dropdownTimer = setTimeout(() => {
                        $this.removeClass('open');
                    }, 300); // 300ms delay
                });
                
                // Keep dropdown open when hovering over menu
                $(document).on('mouseenter', '.dropdown-menu', function() {
                    clearTimeout(dropdownTimer);
                }).on('mouseleave', '.dropdown-menu', function() {
                    const $parent = $(this).closest('.dropdown, .btn-group');
                    
                    dropdownTimer = setTimeout(() => {
                        $parent.removeClass('open');
                    }, 300);
                });
                
                // Ensure click still works
                $(document).on('click', '.dropdown-toggle', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const $parent = $(this).parent();
                    $parent.toggleClass('open');
                });
            }
        },
        
        /**
         * Handles theming for dynamically loaded modals.
         */
        modalManager: {
            init: function() {
                // Listen for Bootstrap's modal events
                $(document).on('shown.bs.modal', (event) => {
                    this.themeModal(event.target);
                });
                
                // Also watch for dynamically added modals
                this.observeModalAdditions();
            },

            themeModal: function(modalElement) {
                const $modal = $(modalElement);
                const currentTheme = localStorage.getItem(Grid4Portal.config.themeKey) || Grid4Portal.config.defaultTheme;
                
                // Add our theming class and the current theme to the modal
                $modal.addClass('g4-themed').addClass(currentTheme);
                
                // Also theme any nested modals or modal-like elements
                $modal.find('.modal-content').addClass('g4-themed');
            },

            themeOpenModals: function() {
                $('.modal.in, .modal.show').each((i, el) => this.themeModal(el));
            },
            
            observeModalAdditions: function() {
                // Use MutationObserver to catch modals added after page load
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                const $node = $(node);
                                if ($node.hasClass('modal')) {
                                    this.themeModal(node);
                                } else {
                                    $node.find('.modal').each((i, el) => this.themeModal(el));
                                }
                            }
                        });
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        },

        /**
         * Performance monitoring (disabled in production)
         */
        performance: {
            logMetric: function(name, duration) {
                if (Grid4Portal.config.debug) {
                    console.log(`[Grid4 Performance] ${name}: ${duration}ms`);
                }
            }
        }
    };

    // --- JQUERY PLUGIN EXTENSION ---
    // Make Grid4Portal accessible as a jQuery plugin
    $.fn.grid4Portal = function(method) {
        if (Grid4Portal[method]) {
            return Grid4Portal[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return Grid4Portal.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.grid4Portal');
        }
    };

    // --- ENTRY POINT ---
    $(document).ready(function() {
        // Wait for NetSapiens portal to fully initialize
        const initTimer = setTimeout(function checkInit() {
            // Check if key portal elements exist
            if ($('#navigation').length && $('#content').length && $('.wrapper').length) {
                Grid4Portal.init();
            } else {
                // Retry after a short delay
                setTimeout(checkInit, 100);
            }
        }, 100);
    });

    // Expose Grid4Portal to global scope for debugging
    window.Grid4Portal = Grid4Portal;

})(jQuery, window, document);