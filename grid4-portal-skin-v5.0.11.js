/* ===================================================================
   GRID4 NETSAPIENS PORTAL SKIN v5.0.11
   ARCHITECTURE: SCOPED APP SHELL
   - JS is focused on shell injection and theme management.
   - Enhanced theme switching without flash (requestAnimationFrame)
   - Cache-busting helper function (generateUrls) for easy deployment
   - FaxEdge script integration
   - Improved modal theming for dynamic content
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
            version: '5.0.11',
            shellId: 'grid4-app-shell',
            themeKey: 'grid4_theme',
            defaultTheme: 'theme-dark',
            initialized: false
        },
        
        // Debug function for fax icon
        debugFaxIcon: function() {
            return this.uiEnhancements.debugFaxIcon();
        },

        // --- INITIALIZATION ---
        init: function() {
            if (this.config.initialized) return;
            console.log(`Initializing Grid4 Portal Skin v${this.config.version}`);

            this.shellManager.init();
            this.themeManager.init();
            this.uiEnhancements.init();
            this.modalManager.init();
            
            // Load external scripts after initialization
            this.scriptLoader.init();

            // Make body visible now that styles are ready
            $('body').css('opacity', 1);
            
            this.config.initialized = true;
            console.log('Grid4 Portal Skin Initialized.');
        },

        /**
         * Script loader module - handles external script loading
         */
        scriptLoader: {
            scripts: [
                {
                    name: 'FaxEdge',
                    src: 'https://securefaxportal-prod.s3.amazonaws.com/ns-script.js',
                    checkExisting: 'ns-script.js'
                }
                // Modal fixes are now integrated into main CSS
                // Removed external modal fix files to avoid conflicts
            ],
            
            init: function() {
                // Load scripts sequentially to ensure order
                this.loadScriptsSequentially(0);
            },
            
            loadScriptsSequentially: function(index) {
                if (index >= this.scripts.length) {
                    console.log('All external resources loaded');
                    return;
                }
                
                const resourceConfig = this.scripts[index];
                const isCSS = resourceConfig.type === 'css';
                
                // Check if already loaded
                const selector = isCSS ? 
                    `link[href*="${resourceConfig.checkExisting}"]` : 
                    `script[src*="${resourceConfig.checkExisting}"]`;
                    
                if (resourceConfig.checkExisting && $(selector).length > 0) {
                    console.log(`${resourceConfig.name} already loaded`);
                    this.loadScriptsSequentially(index + 1);
                    return;
                }
                
                if (isCSS) {
                    // Handle CSS loading
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = resourceConfig.src;
                    
                    link.onload = () => {
                        console.log(`${resourceConfig.name} loaded successfully`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    
                    link.onerror = () => {
                        console.error(`Failed to load ${resourceConfig.name}`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    
                    document.head.appendChild(link);
                } else {
                    // Handle JavaScript loading
                    const script = document.createElement('script');
                    script.src = resourceConfig.src;
                    script.async = true;
                    
                    script.onload = () => {
                        console.log(`${resourceConfig.name} loaded successfully`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    
                    script.onerror = () => {
                        console.error(`Failed to load ${resourceConfig.name}`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    
                    document.body.appendChild(script);
                }
            }
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
                
                // Add context-aware body classes
                this.addContextClasses();
            },
            
            addContextClasses: function() {
                const path = window.location.pathname;
                const $body = $('body');
                
                // Add page-specific classes
                if (path.includes('/users')) {
                    $body.addClass('page-users');
                } else if (path.includes('/domains')) {
                    $body.addClass('page-domains');
                } else if (path.includes('/agents')) {
                    $body.addClass('page-agents');
                } else if (path.includes('/conferences')) {
                    $body.addClass('page-conferences');
                } else if (path.includes('/queues')) {
                    $body.addClass('page-queues');
                }
                
                console.log('Context classes added for:', path);
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
                    
                    // Pre-apply theme to body to prevent white flash
                    $('body').attr('data-theme-transitioning', 'true');
                    
                    // Update body background immediately
                    const bgColor = newTheme === 'theme-dark' ? '#1a2332' : '#f8f9fa';
                    $('body').css('background-color', bgColor);
                    
                    $shell.removeClass('theme-light theme-dark').addClass(newTheme);
                    localStorage.setItem(Grid4Portal.config.themeKey, newTheme);
                    this.updateToggleIcon(newTheme);

                    // Force repaint without display:none trick
                    requestAnimationFrame(() => {
                        // Ensure HTML element also gets the background
                        $('html').css('background-color', bgColor);
                        
                        // Force recalculation of backgrounds
                        const elements = ['body', 'html', '.wrapper', '#content', '#grid4-app-shell'];
                        elements.forEach(selector => {
                            const $el = $(selector);
                            if ($el.length) {
                                $el[0].offsetHeight; // Force reflow
                            }
                        });
                        
                        // Clean up
                        setTimeout(() => {
                            $('body').removeAttr('data-theme-transitioning');
                        }, 300);
                    });

                    // Re-theme open modals
                    Grid4Portal.modalManager.themeOpenModals();
                    
                    console.log(`Theme switched to: ${newTheme}`);
                    
                    // Auto-refresh page for complete theme application
                    // Check if there are open modals that might have unsaved data
                    const hasOpenModals = $('.modal.in').length > 0 || $('.ui-dialog:visible').length > 0;
                    
                    if (hasOpenModals) {
                        // If modals are open, warn the user
                        if (confirm('Switching themes requires a page refresh to apply all styling correctly.\n\nYou have open forms that may contain unsaved data.\n\nDo you want to refresh the page now?')) {
                            location.reload();
                        } else {
                            console.log('Theme switch completed without refresh - some elements may not be fully themed');
                        }
                    } else {
                        // No open modals, safe to refresh
                        console.log('Refreshing page for complete theme application...');
                        setTimeout(() => {
                            location.reload();
                        }, 300); // Small delay to let animation complete
                    }
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
                this.addToolbarEnhancements();
                this.enhanceNavigation();
                this.handleDomainBanner();
                this.improveDropdowns();
            },

            hideHeaderLogo: function() {
                $('#header-logo').hide();
            },
            
            addToolbarEnhancements: function() {
                // Admin tools dropdown removed per request
                return;
                
                /* REMOVED: Admin Tools dropdown
                // Admin tools dropdown implementation
                const $toolbar = $('.user-toolbar');
                if (!$toolbar.length || $('#grid4-admin-dropdown').length) return;
                
                // Check if user has admin/super user permissions
                // Look for indicators in the UI that suggest admin access
                const hasAdminAccess = 
                    // Check if viewing domains or resellers (admin-only pages)
                    window.location.pathname.includes('/domains') ||
                    window.location.pathname.includes('/resellers') ||
                    // Check for admin menu items
                    $('#nav-buttons').text().includes('Domains') ||
                    $('#nav-buttons').text().includes('Resellers') ||
                    // Check user role in header if available
                    $('.user-info').text().includes('Admin') ||
                    $('.user-info').text().includes('Super') ||
                    // Check for platform settings access
                    $('#nav-buttons a[href*="platform"]').length > 0;
                
                // Only show admin tools for admin users
                if (!hasAdminAccess) {
                    console.log('Grid4 Skin: Admin tools hidden - user lacks admin access');
                    return;
                }
                
                // Admin tools configuration
                const adminTools = [
                    { name: 'SiPbx (Core) Admin', url: '/admin', icon: 'fa-server' },
                    { name: 'NDP (Endpoints) Admin', url: '/ndp', icon: 'fa-plug' },
                    { name: 'Recording Admin', url: '/recording', icon: 'fa-microphone' },
                    { name: 'Insight Portal', url: '/insight', icon: 'fa-bar-chart' }
                ];
                
                // Documentation links
                const docLinks = [
                    { name: 'API Documentation', url: 'https://docs.ns-api.com/', icon: 'fa-book', external: true },
                    { name: 'NetSapiens Docs', url: 'https://docs.netsapiens.com/', icon: 'fa-question-circle', external: true }
                ];
                
                // Create dropdown HTML
                const dropdownHtml = `
                    <li class="dropdown" id="grid4-admin-dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-cog"></i> Admin Tools <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            ${adminTools.map(tool => `
                                <li><a href="${tool.url}" target="_blank">
                                    <i class="fa ${tool.icon}"></i> ${tool.name}
                                </a></li>
                            `).join('')}
                            <li class="divider"></li>
                            ${docLinks.map(link => `
                                <li><a href="${link.url}" ${link.external ? 'target="_blank"' : ''}>
                                    <i class="fa ${link.icon}"></i> ${link.name}
                                </a></li>
                            `).join('')}
                        </ul>
                    </li>
                `;
                
                // Add to toolbar
                $toolbar.append(dropdownHtml);
                
                // Add styles for admin dropdown
                if (!$('#grid4-admin-dropdown-styles').length) {
                    const styles = `
                        <style id="grid4-admin-dropdown-styles">
                            #grid4-admin-dropdown .dropdown-menu {
                                min-width: 220px;
                            }
                            #grid4-admin-dropdown .dropdown-menu a {
                                padding: 8px 20px;
                                transition: all 0.2s ease;
                            }
                            #grid4-admin-dropdown .dropdown-menu a:hover {
                                background-color: var(--accent-primary);
                                color: #ffffff !important;
                            }
                            #grid4-admin-dropdown .dropdown-menu .fa {
                                width: 20px;
                                margin-right: 8px;
                            }
                        </style>
                    `;
                    $('head').append(styles);
                }
                
                console.log('Admin tools dropdown added to toolbar');
                */
            },
            
            handleDomainBanner: function() {
                let isAdjusting = false;
                
                const adjustContentForBanner = () => {
                    // Prevent recursive calls
                    if (isAdjusting) return;
                    isAdjusting = true;
                    
                    const $domainMessage = $('#domain-message:visible');
                    const $fixedContainer = $('.fixed-container:visible');
                    const $content = $('#content');
                    
                    if (!$content.length) {
                        isAdjusting = false;
                        return;
                    }
                    
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
                    
                    // Reset flag after a small delay
                    setTimeout(() => {
                        isAdjusting = false;
                    }, 50);
                };
                
                // Run immediately
                adjustContentForBanner();
                
                // Run again after delays to catch dynamic content
                setTimeout(adjustContentForBanner, 100);
                setTimeout(adjustContentForBanner, 500);
                setTimeout(adjustContentForBanner, 1000);
                
                // Also run on window resize
                $(window).on('resize', adjustContentForBanner);
                
                // Watch for changes with debouncing
                let observerTimeout;
                const observer = new MutationObserver(() => {
                    clearTimeout(observerTimeout);
                    observerTimeout = setTimeout(() => {
                        adjustContentForBanner();
                    }, 100); // Debounce mutations
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
                
                // First, wrap link text in nav-text spans if not already wrapped
                $('#nav-buttons li a').each(function() {
                    const $link = $(this);
                    // Skip if already has nav-text
                    if ($link.find('.nav-text').length) return;
                    
                    // Find text content, excluding child elements
                    const $navButton = $link.find('.nav-button');
                    const $navArrow = $link.find('.nav-arrow');
                    
                    // Get text that's directly in the link (not in child elements)
                    const linkClone = $link.clone();
                    linkClone.find('*').remove();
                    const text = linkClone.text().trim();
                    
                    if (text) {
                        // Create nav-text span and insert it after nav-button
                        const $navText = $(`<span class="nav-text">${text}</span>`);
                        if ($navButton.length) {
                            $navButton.after($navText);
                        } else {
                            $link.prepend($navText);
                        }
                        
                        // Remove the original text node
                        $link.contents().filter(function() {
                            return this.nodeType === 3 && this.textContent.trim() === text;
                        }).remove();
                    }
                });
                
                // Add icons if not present (using Font Awesome 4.7)
                const iconMap = {
                    // Common menu items
                    'Home': 'fa-home',
                    'Agents': 'fa-users',
                    'Users': 'fa-user',
                    'Conferences': 'fa-video-camera',  // Fixed for FA 4.7
                    'Auto Attendants': 'fa-phone',
                    'Call Queues': 'fa-list',
                    'Time Frames': 'fa-clock-o',
                    'Music On Hold': 'fa-music',
                    'Music on Hold': 'fa-music',  // Alternative capitalization
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
                    'System': 'fa-server',
                    
                    // Admin top-level items
                    'Resellers': 'fa-briefcase',
                    'Domains': 'fa-globe',
                    'SIP Trunks': 'fa-exchange',
                    
                    // User/My Account items
                    'Messages': 'fa-comments-o',
                    'Contacts': 'fa-address-book-o',  // FA 4.7 version
                    'Answering Rules': 'fa-sliders',
                    'Phones': 'fa-phone',
                    'My Account': 'fa-user-circle-o'
                };
                
                // Add icons to all navigation items
                $('#nav-buttons li').each(function() {
                    const $li = $(this);
                    const $link = $li.find('a').first();
                    const $text = $link.find('.nav-text');
                    const text = $text.text().trim();
                    
                    // Debug logging for fax specifically
                    if (text.toLowerCase().includes('fax')) {
                        console.log('Grid4 Debug: Found fax item:', {
                            text: text,
                            hasNavText: $text.length > 0,
                            hasIcon: $link.find('.fa').length > 0,
                            iconMap: iconMap[text]
                        });
                    }
                    
                    if (iconMap[text] && !$link.find('.fa').length) {
                        // Insert icon before the text span
                        $text.before(`<i class="fa ${iconMap[text]}"></i> `);
                    } else if (!iconMap[text] && text) {
                        // Log menu items without icons for future reference
                        console.log(`Grid4 Skin: No icon defined for menu item: "${text}"`);
                    }
                });
            },
            
            // Debug function for fax icon
            debugFaxIcon: function() {
                console.log('=== FAX ICON DEBUG ===');
                
                const iconMap = {
                    'Fax': 'fa-fax'
                };
                
                // Check all nav items
                $('#nav-buttons li').each(function() {
                    const $li = $(this);
                    const $link = $li.find('a').first();
                    const $navText = $link.find('.nav-text');
                    const navTextContent = $navText.text().trim();
                    const fullText = $link.text().trim();
                    const hasIcon = $link.find('.fa').length > 0;
                    
                    if (fullText.toLowerCase().includes('fax')) {
                        console.log('FOUND FAX ITEM:', {
                            fullText: fullText,
                            navTextContent: navTextContent,
                            hasNavText: $navText.length > 0,
                            hasIcon: hasIcon,
                            href: $link.attr('href'),
                            iconShouldBe: iconMap[navTextContent] || 'NOT IN MAP'
                        });
                        
                        // Try to add icon manually for testing
                        if (!hasIcon && iconMap[navTextContent]) {
                            console.log('Attempting to add icon manually...');
                            $navText.before(`<i class="fa ${iconMap[navTextContent]}"></i> `);
                            console.log('Icon added manually - check if it appears');
                        }
                    }
                });
                
                // Re-run enhance navigation
                console.log('Re-running enhanceNavigation...');
                this.enhanceNavigation();
            },
            
            improveDropdowns: function() {
                // Add hover intent behavior to dropdowns with better timing
                const dropdownTimers = new Map();
                const HOVER_OPEN_DELAY = 150; // Delay before opening on hover
                const HOVER_CLOSE_DELAY = 400; // Delay before closing on leave
                
                // Handle dropdown hover with appropriate delays
                $(document).on('mouseenter', '.dropdown, .btn-group', function() {
                    const $this = $(this);
                    const id = $this.get(0);
                    
                    // Clear any pending close timer
                    if (dropdownTimers.has(id)) {
                        clearTimeout(dropdownTimers.get(id));
                        dropdownTimers.delete(id);
                    }
                    
                    // Only open on hover if not already open
                    if (!$this.hasClass('open')) {
                        const openTimer = setTimeout(() => {
                            $this.addClass('open');
                            dropdownTimers.delete(id);
                        }, HOVER_OPEN_DELAY);
                        dropdownTimers.set(id, openTimer);
                    }
                }).on('mouseleave', '.dropdown, .btn-group', function() {
                    const $this = $(this);
                    const id = $this.get(0);
                    
                    // Clear any pending open timer
                    if (dropdownTimers.has(id)) {
                        clearTimeout(dropdownTimers.get(id));
                    }
                    
                    // Add delay before closing
                    const closeTimer = setTimeout(() => {
                        $this.removeClass('open');
                        dropdownTimers.delete(id);
                    }, HOVER_CLOSE_DELAY);
                    dropdownTimers.set(id, closeTimer);
                });
                
                // Keep dropdown open when hovering over menu
                $(document).on('mouseenter', '.dropdown-menu', function() {
                    const $parent = $(this).closest('.dropdown, .btn-group');
                    const id = $parent.get(0);
                    
                    // Clear any close timer for parent
                    if (dropdownTimers.has(id)) {
                        clearTimeout(dropdownTimers.get(id));
                        dropdownTimers.delete(id);
                    }
                }).on('mouseleave', '.dropdown-menu', function() {
                    const $parent = $(this).closest('.dropdown, .btn-group');
                    const id = $parent.get(0);
                    
                    // Add delay before closing parent
                    const closeTimer = setTimeout(() => {
                        $parent.removeClass('open');
                        dropdownTimers.delete(id);
                    }, HOVER_CLOSE_DELAY);
                    dropdownTimers.set(id, closeTimer);
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
                    this.ensureModalInteractivity();
                });
                
                $(document).on('hidden.bs.modal', () => {
                    this.restoreInteractivity();
                });
                
                // Force dark mode footer styling
                this.fixModalFooterDarkMode();
                
                // Fix modal transparency issues
                this.fixModalTransparency();
                
                // Also watch for dynamically added modals
                this.observeModalAdditions();
            },
            
            fixModalFooterDarkMode: function() {
                // NetSapiens uses non-standard modal events
                $(document).on('shown.modal shown.bs.modal show.modal', '.modal', function() {
                    // Check if we're in dark mode - theme is on app shell, not body
                    const isDarkMode = $('#' + Grid4Portal.config.shellId).hasClass('theme-dark');
                    if (isDarkMode) {
                        // Force dark background on modal footers
                        setTimeout(() => {
                            $('.modal-footer').each(function() {
                                $(this).css({
                                    'background-color': '#1e2736 !important',
                                    'background': '#1e2736 !important',
                                    'border-top': '1px solid rgba(255, 255, 255, 0.1)'
                                });
                            });
                        }, 50); // Small delay to ensure modal is fully rendered
                    }
                });
            },
            
            fixModalTransparency: function() {
                // Fix modal transparency issues across browsers
                $(document).on('shown.modal shown.bs.modal show.modal', '.modal', function() {
                    const $modal = $(this);
                    const $modalContent = $modal.find('.modal-content');
                    const isDarkMode = $('#' + Grid4Portal.config.shellId).hasClass('theme-dark');
                    
                    // Remove any backdrop filters that cause transparency
                    $modalContent.css({
                        'backdrop-filter': 'none',
                        '-webkit-backdrop-filter': 'none',
                        'opacity': '1'
                    });
                    
                    // Apply solid backgrounds based on theme
                    if (isDarkMode) {
                        $modalContent.css({
                            'background': '#242b3a',
                            'background-color': '#242b3a'
                        });
                        
                        // Force text colors for dark theme
                        $modal.find('h4').css('color', '#e9ecef');
                        $modal.find('legend').css({
                            'color': '#e9ecef',
                            'border-bottom-color': 'rgba(255, 255, 255, 0.1)'
                        });
                        $modal.find('.help-block, .help-inline').css('color', '#adb5bd');
                    } else {
                        $modalContent.css({
                            'background': '#ffffff',
                            'background-color': '#ffffff'
                        });
                        
                        // Force text colors for light theme
                        $modal.find('h4').css('color', '#333333');
                        $modal.find('legend').css({
                            'color': '#333333',
                            'border-bottom-color': '#e5e5e5'
                        });
                        $modal.find('.help-block, .help-inline').css('color', '#6c757d');
                    }
                    
                    // Ensure modal body is also opaque
                    $modal.find('.modal-body').css({
                        'opacity': '1',
                        'background': 'transparent'
                    });
                });
            },
            
            ensureModalInteractivity: function() {
                // Get current theme
                const currentTheme = localStorage.getItem(Grid4Portal.config.themeKey) || Grid4Portal.config.defaultTheme;
                
                // Find all visible modals
                const $modals = $('.modal.in');
                
                // Don't move modals - let Bootstrap handle positioning
                // Just ensure proper theming
                $modals.each(function() {
                    const $modal = $(this);
                    $modal.addClass('g4-themed').addClass(currentTheme);
                    
                    // Ensure modal-dialog is properly positioned
                    const $dialog = $modal.find('.modal-dialog');
                    if ($dialog.length && !$dialog.css('margin')) {
                        // Bootstrap should already handle this, but ensure it's set
                        $dialog.css({
                            'margin': '30px auto',
                            'position': 'relative'
                        });
                    }
                });
                
                console.log('Grid4 Skin: Applied modal theming');
            },
            
            restoreInteractivity: function() {
                // Clean up modal-open class if no modals remain
                if ($('.modal.in').length === 0) {
                    $('body').removeClass('modal-open');
                    // Also remove theme classes from body
                    $('body').removeClass('theme-dark theme-light');
                }
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
                                    // Also fix footer if in dark mode
                                    const isDarkMode = $('#' + Grid4Portal.config.shellId).hasClass('theme-dark');
                                    if (isDarkMode) {
                                        setTimeout(() => {
                                            $node.find('.modal-footer').css({
                                                'background-color': '#1e2736 !important',
                                                'background': '#1e2736 !important'
                                            });
                                        }, 100);
                                    }
                                } else {
                                    $node.find('.modal').each((i, el) => {
                                        this.themeModal(el);
                                        // Fix footers in found modals
                                        const isDarkMode = $('#' + Grid4Portal.config.shellId).hasClass('theme-dark');
                                        if (isDarkMode) {
                                            $(el).find('.modal-footer').css({
                                                'background-color': '#1e2736 !important',
                                                'background': '#1e2736 !important'
                                            });
                                        }
                                    });
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
         * Helper function to generate URLs for deployment.
         * Azure SWA handles caching more reliably than CDN.
         * Run Grid4Portal.generateUrls() in the console when updating.
         */
        generateUrls: function() {
            const baseUrl = 'https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/';
            const cssFile = 'grid4-portal-skin-v5.0.11.css';
            const jsFile = 'grid4-portal-skin-v5.0.11.js';

            const cssUrl = `${baseUrl}${cssFile}`;
            const jsUrl = `${baseUrl}${jsFile}`;

            console.group("📋 URLs for NetSapiens UI Variables");
            console.log("%cPORTAL_CSS_CUSTOM:", "font-weight:bold; color: #00d4ff;");
            console.log(cssUrl);
            console.log("%cPORTAL_EXTRA_JS:", "font-weight:bold; color: #00d4ff;");
            console.log(jsUrl);
            console.log("\n💡 Azure SWA provides automatic cache invalidation on deployment");
            console.groupEnd();
            
            // Optional: Copy to clipboard if available
            try {
                const urlText = `CSS: ${cssUrl}\nJS: ${jsUrl}`;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(urlText).then(() => {
                        console.log("✅ URLs copied to clipboard!");
                    });
                }
            } catch (e) {
                console.log("ℹ️ Copy these URLs manually to update NetSapiens UI variables");
            }
            
            return { css: cssUrl, js: jsUrl };
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