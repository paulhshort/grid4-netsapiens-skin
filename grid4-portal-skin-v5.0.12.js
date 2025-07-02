/* ===================================================================
   GRID4 NETSAPIENS PORTAL SKIN v5.0.12
   ARCHITECTURE: SCOPED APP SHELL
   - JS is focused on shell injection and theme management.
   - Enhanced theme switching without flash (requestAnimationFrame)
   - Cache-busting helper function (generateUrls) for easy deployment
   - FaxEdge script integration
   - Improved modal theming for dynamic content
   - INTEGRATED: All modal fixes (positioning, transparency, form styling)
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
            version: '5.0.12',
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
            this.modalFixes.init(); // Initialize integrated modal fixes
            
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
                // Removed MODAL-FIX-COMPREHENSIVE files since they're now integrated
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
                    
                if ($(selector).length) {
                    console.log(`${resourceConfig.name} already loaded`);
                    this.loadScriptsSequentially(index + 1);
                    return;
                }
                
                if (isCSS) {
                    // Load CSS
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = resourceConfig.src;
                    link.onload = () => {
                        console.log(`${resourceConfig.name} CSS loaded`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    link.onerror = () => {
                        console.error(`Failed to load ${resourceConfig.name} CSS`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    document.head.appendChild(link);
                } else {
                    // Load JavaScript
                    const script = document.createElement('script');
                    script.src = resourceConfig.src;
                    script.async = true;
                    script.onload = () => {
                        console.log(`${resourceConfig.name} script loaded`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    script.onerror = () => {
                        console.error(`Failed to load ${resourceConfig.name} script`);
                        this.loadScriptsSequentially(index + 1);
                    };
                    document.body.appendChild(script);
                }
            }
        },

        /**
         * App Shell Manager - handles the main container setup
         */
        shellManager: {
            init: function() {
                const $body = $('body');
                const shellId = Grid4Portal.config.shellId;
                
                // Check if shell already exists
                if ($('#' + shellId).length) {
                    console.log('Grid4 App Shell already exists.');
                    return;
                }

                // Create the app shell
                const $shell = $('<div>', { id: shellId });
                
                // Wrap all body content in the shell
                $body.wrapInner($shell);
                
                console.log('Grid4 App Shell created.');
            }
        },

        /**
         * Theme Manager - handles theme switching and persistence
         */
        themeManager: {
            init: function() {
                const savedTheme = this.getSavedTheme();
                this.applyTheme(savedTheme);
                this.bindThemeToggle();
                console.log(`Theme initialized: ${savedTheme}`);
            },

            getSavedTheme: function() {
                try {
                    return localStorage.getItem(Grid4Portal.config.themeKey) || Grid4Portal.config.defaultTheme;
                } catch (e) {
                    console.error('Could not access localStorage:', e);
                    return Grid4Portal.config.defaultTheme;
                }
            },

            saveTheme: function(theme) {
                try {
                    localStorage.setItem(Grid4Portal.config.themeKey, theme);
                } catch (e) {
                    console.error('Could not save theme to localStorage:', e);
                }
            },

            applyTheme: function(theme) {
                const $shell = $('#' + Grid4Portal.config.shellId);
                
                // Use requestAnimationFrame for smoother transition
                requestAnimationFrame(() => {
                    // Add transitioning class to disable transitions temporarily
                    $shell.addClass('theme-transitioning');
                    
                    // Remove all theme classes and add the new one
                    $shell.removeClass('theme-light theme-dark').addClass(theme);
                    
                    // Update modals to match theme
                    Grid4Portal.modalManager.updateModalThemes(theme);
                    
                    // Remove transitioning class after a frame
                    requestAnimationFrame(() => {
                        $shell.removeClass('theme-transitioning');
                    });
                });
            },

            toggleTheme: function() {
                const currentTheme = this.getSavedTheme();
                const newTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
                
                this.saveTheme(newTheme);
                this.applyTheme(newTheme);
                
                console.log(`Theme switched to: ${newTheme}`);
                
                // Trigger custom event for other components
                $(document).trigger('grid4:themeChanged', { theme: newTheme });
            },

            bindThemeToggle: function() {
                // Create theme toggle button if it doesn't exist
                if (!$('#grid4-theme-toggle').length) {
                    const $toggleBtn = $('<button>', {
                        id: 'grid4-theme-toggle',
                        class: 'btn btn-sm',
                        title: 'Toggle Theme',
                        html: '<i class="icon-adjust"></i>',
                        css: {
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 9999,
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    });
                    
                    $('body').append($toggleBtn);
                }
                
                // Bind click event
                $(document).off('click.grid4Theme').on('click.grid4Theme', '#grid4-theme-toggle', () => {
                    this.toggleTheme();
                });
            }
        },

        /**
         * UI Enhancements - various UI improvements
         */
        uiEnhancements: {
            init: function() {
                this.fixSidebarNavigation();
                this.enhanceDataTables();
                this.improveFormControls();
                this.addMobileSupport();
                this.fixDomainBanner();
            },

            fixSidebarNavigation: function() {
                // Ensure sidebar is properly styled
                const $sidebar = $('#sidebar');
                if (!$sidebar.length) return;

                // Remove collapse classes that interfere with visibility
                $sidebar.find('.nav-collapse, .collapse').removeClass('collapse').addClass('in');
                
                // Add active indicators
                $sidebar.find('.nav > li > a').each(function() {
                    const $link = $(this);
                    const href = $link.attr('href');
                    if (href && window.location.href.indexOf(href) > -1) {
                        $link.parent('li').addClass('active');
                    }
                });
            },

            enhanceDataTables: function() {
                // Add hover effects to tables
                $('table').not('.no-hover').addClass('table-hover');
                
                // Ensure sortable headers are properly styled
                $('th.sortable, th a[href*="sort"]').each(function() {
                    const $this = $(this);
                    if (!$this.hasClass('enhanced')) {
                        $this.addClass('enhanced');
                    }
                });
            },

            improveFormControls: function() {
                // Add focus effects to form controls
                $(document).on('focus', 'input, select, textarea', function() {
                    $(this).addClass('focused');
                }).on('blur', 'input, select, textarea', function() {
                    $(this).removeClass('focused');
                });
            },

            addMobileSupport: function() {
                // Create mobile sidebar toggle
                if (!$('.sidebar-toggle').length) {
                    const $toggle = $('<div>', {
                        class: 'sidebar-toggle',
                        html: '<span></span><span></span><span></span>'
                    });
                    
                    $('body').append($toggle);
                }
                
                // Toggle sidebar on mobile
                $(document).off('click.sidebarToggle').on('click.sidebarToggle', '.sidebar-toggle', function() {
                    $('#sidebar').toggleClass('active');
                    $(this).toggleClass('active');
                });
                
                // Close sidebar when clicking outside on mobile
                $(document).off('click.sidebarClose').on('click.sidebarClose', function(e) {
                    if ($(window).width() <= 768) {
                        if (!$(e.target).closest('#sidebar, .sidebar-toggle').length) {
                            $('#sidebar').removeClass('active');
                            $('.sidebar-toggle').removeClass('active');
                        }
                    }
                });
            },

            fixDomainBanner: function() {
                // Dynamically adjust content spacing based on domain banner
                const adjustContentSpacing = () => {
                    const $domainBanner = $('.domain-banner, #domain-banner').first();
                    const $content = $('#content');
                    const $navbar = $('.navbar-inner');
                    
                    if ($domainBanner.length && $domainBanner.is(':visible')) {
                        const bannerHeight = $domainBanner.outerHeight() || 0;
                        const navbarHeight = $navbar.outerHeight() || 45;
                        const totalOffset = bannerHeight + navbarHeight;
                        
                        $content.css('padding-top', totalOffset + 'px');
                        $('#sidebar').css('top', totalOffset + 'px');
                    }
                };
                
                // Run on load and resize
                adjustContentSpacing();
                $(window).on('resize.domainBanner', adjustContentSpacing);
                
                // Also check after a delay to catch dynamically loaded content
                setTimeout(adjustContentSpacing, 1000);
            }
        },

        /**
         * Modal Manager - handles modal theming and behavior
         */
        modalManager: {
            init: function() {
                this.bindModalEvents();
                this.patchModalFunctions();
            },

            bindModalEvents: function() {
                // Theme modals when they show
                $(document).on('show.bs.modal show shown', '.modal', (e) => {
                    const $modal = $(e.target);
                    this.themeModal($modal);
                });
                
                // Re-theme modals after AJAX content loads
                $(document).ajaxComplete(() => {
                    setTimeout(() => {
                        $('.modal:visible').each((i, modal) => {
                            this.themeModal($(modal));
                        });
                    }, 100);
                });
            },

            themeModal: function($modal) {
                const currentTheme = Grid4Portal.themeManager.getSavedTheme();
                const themeClass = currentTheme === 'theme-dark' ? 'theme-dark' : 'theme-light';
                
                // Add theme classes
                $modal.removeClass('theme-light theme-dark').addClass('g4-themed ' + themeClass);
                
                // Ensure modal content is properly themed
                $modal.find('.modal-content').addClass('g4-themed');
                
                // Theme form elements within modal
                this.themeModalForms($modal);
            },

            themeModalForms: function($modal) {
                // Force re-style all form elements
                $modal.find('input, textarea, select, label, .form-group, .control-group').each(function() {
                    const $el = $(this);
                    // Remove any inline styles that might interfere
                    $el.css('background', '');
                    $el.css('background-color', '');
                });
                
                // Ensure labels have no background
                $modal.find('label, .control-label').css({
                    'background': 'none',
                    'background-color': 'transparent'
                });
            },

            updateModalThemes: function(theme) {
                const themeClass = theme === 'theme-dark' ? 'theme-dark' : 'theme-light';
                
                $('.modal').each((i, modal) => {
                    const $modal = $(modal);
                    $modal.removeClass('theme-light theme-dark').addClass(themeClass);
                    
                    if ($modal.is(':visible')) {
                        this.themeModal($modal);
                    }
                });
            },

            patchModalFunctions: function() {
                // Patch Bootstrap modal to ensure theming
                const originalShow = $.fn.modal.Constructor.prototype.show;
                
                $.fn.modal.Constructor.prototype.show = function() {
                    originalShow.apply(this, arguments);
                    
                    // Theme the modal after showing
                    const $element = this.$element;
                    setTimeout(() => {
                        Grid4Portal.modalManager.themeModal($element);
                    }, 10);
                };
            }
        },

        /**
         * Integrated Modal Fixes - comprehensive modal positioning and styling fixes
         */
        modalFixes: {
            originalFunctions: {},
            
            init: function() {
                console.log('[Grid4 Modal Fix] Initializing comprehensive modal fixes');
                
                // Store original functions
                this.storeOriginalFunctions();
                
                // Override modalResize function
                this.overrideModalResize();
                
                // Override loadModal function
                this.overrideLoadModal();
                
                // Fix body scroll lock
                this.fixBodyScrollLock();
                
                // Patch loading spinner
                this.patchLoadingSpinner();
                
                // Apply fixes to existing modals
                this.applyModalFixes();
                
                // Monitor for new modals
                this.startModalObserver();
                
                // Fix modal backdrop z-index
                this.fixBackdropZIndex();
                
                // Fix transparency issues
                this.fixModalTransparency();
                
                // Add resize handler
                this.addResizeHandler();
                
                // Initialize after delay
                setTimeout(() => this.applyModalFixes(), 1000);
                
                // Add public API
                this.addPublicAPI();
                
                console.log('[Grid4 Modal Fix] Initialization complete');
            },
            
            storeOriginalFunctions: function() {
                this.originalFunctions.modalResize = window.modalResize;
                this.originalFunctions.loadModal = window.loadModal;
                this.originalFunctions.hideModal = window.hideModal;
                this.originalFunctions.ajax = $.ajax;
            },
            
            overrideModalResize: function() {
                const self = this;
                
                if (typeof modalResize !== 'undefined') {
                    window.modalResize = function(modal, trace) {
                        console.log('[Grid4 Modal Fix] modalResize override called');
                        
                        // Call original function for core functionality
                        if (self.originalFunctions.modalResize) {
                            self.originalFunctions.modalResize.call(this, modal, trace);
                        }
                        
                        // Remove inline styles that break our CSS positioning
                        if (modal && modal.length) {
                            modal.css({
                                'margin-top': '',
                                'margin-left': '',
                                'margin-right': '',
                                'margin-bottom': ''
                            });
                            
                            // Add our positioning class
                            modal.addClass('grid4-modal-positioned');
                            
                            // Use CSS custom property for max-height instead of inline style
                            const modalBody = modal.find('.modal-body');
                            if (modalBody.length) {
                                const windowHeight = $(window).height();
                                const headerHeight = modal.find('.modal-header').outerHeight() || 50;
                                const footerHeight = modal.find('.modal-footer').outerHeight() || 70;
                                const maxHeight = windowHeight - headerHeight - footerHeight - 100;
                                
                                // Set CSS variable instead of inline style
                                modal[0].style.setProperty('--modal-max-height', maxHeight + 'px');
                                modalBody.css('max-height', '');
                            }
                        }
                        
                        // Fix transparency after resize
                        if (modal && modal.length) {
                            self.fixModalTransparency(modal[0]);
                        }
                    };
                }
            },
            
            overrideLoadModal: function() {
                const self = this;
                
                if (typeof loadModal !== 'undefined') {
                    window.loadModal = function(modalId, path) {
                        const modalObj = $(modalId);
                        
                        // Preserve theme-related classes
                        let preservedClasses = [];
                        if (modalObj.length) {
                            const classList = modalObj.attr('class') || '';
                            const classesToPreserve = classList.match(/grid4-[\w-]+|modal-[\w-]+|theme-[\w-]+/g) || [];
                            preservedClasses = classesToPreserve;
                        }
                        
                        // Call original function
                        const result = self.originalFunctions.loadModal.call(this, modalId, path);
                        
                        // Restore preserved classes after a delay
                        setTimeout(function() {
                            if (modalObj.length && preservedClasses.length) {
                                preservedClasses.forEach(function(className) {
                                    if (!modalObj.hasClass(className)) {
                                        modalObj.addClass(className);
                                    }
                                });
                            }
                        }, 100);
                        
                        return result;
                    };
                }
            },
            
            fixBodyScrollLock: function() {
                $(document).on('show.bs.modal show.modal', '.modal', function(e) {
                    const scrollTop = $(window).scrollTop();
                    
                    // Use class-based approach instead of inline styles
                    $('body').addClass('grid4-modal-open')
                             .attr('data-scroll-position', scrollTop);
                    
                    // Ensure modal has proper theme classes
                    const $modal = $(this);
                    if (!$modal.hasClass('grid4-modal-styled')) {
                        $modal.addClass('grid4-modal-styled');
                    }
                });
                
                $(document).on('hidden.bs.modal hidden.modal', '.modal', function(e) {
                    // Restore scroll position
                    const scrollPosition = $('body').attr('data-scroll-position');
                    
                    $('body').removeClass('grid4-modal-open')
                             .removeAttr('data-scroll-position');
                    
                    if (scrollPosition) {
                        $(window).scrollTop(parseInt(scrollPosition, 10));
                    }
                });
            },
            
            patchLoadingSpinner: function() {
                const self = this;
                
                // Override the loading HTML if it's defined globally
                if (window.loadingHtml) {
                    window.loadingHtml = '<div class="loading-container grid4-modal-loading">' +
                        '<div class="loading-spinner la-ball-spin-clockwise">' +
                        '<div></div><div></div><div></div><div></div>' +
                        '<div></div><div></div><div></div><div></div>' +
                        '</div>' +
                        '</div>';
                }
                
                // Patch ajax to fix loading containers
                $.ajax = function(options) {
                    if (options && options.beforeSend) {
                        const originalBeforeSend = options.beforeSend;
                        options.beforeSend = function(xhr, settings) {
                            // Call original
                            const result = originalBeforeSend.call(this, xhr, settings);
                            
                            // Fix any loading containers that were just created
                            $('.loading-container').each(function() {
                                const $container = $(this);
                                if (!$container.hasClass('grid4-modal-loading')) {
                                    $container.addClass('grid4-modal-loading');
                                    // Remove inline styles
                                    $container.css({
                                        'top': '',
                                        'padding': ''
                                    });
                                }
                            });
                            
                            return result;
                        };
                    }
                    
                    return self.originalFunctions.ajax.call(this, options);
                };
            },
            
            applyModalFixes: function() {
                $('.modal').each(function() {
                    const $modal = $(this);
                    
                    // Remove any inline margin styles
                    $modal.css({
                        'margin': '',
                        'margin-top': '',
                        'margin-left': '',
                        'margin-right': '',
                        'margin-bottom': ''
                    });
                    
                    // Add our classes
                    $modal.addClass('grid4-modal-positioned grid4-modal-styled');
                    
                    // Fix modal-dialog if present
                    const $dialog = $modal.find('.modal-dialog');
                    if ($dialog.length) {
                        $dialog.css({
                            'margin': '',
                            'transform': ''
                        });
                    }
                    
                    // Fix transparency
                    Grid4Portal.modalFixes.fixModalTransparency(this);
                });
            },
            
            fixModalTransparency: function(modal) {
                if (!modal) return;
                
                // Remove any transparent background styles
                const transparentElements = modal.querySelectorAll('[style*="transparent"]');
                transparentElements.forEach(function(elem) {
                    const style = elem.getAttribute('style');
                    if (style && (style.includes('background-color: transparent') || 
                                 style.includes('background: transparent'))) {
                        elem.style.backgroundColor = '';
                        elem.style.background = '';
                    }
                });
                
                // Force opaque backgrounds on modal components
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.backgroundColor = '';
                    modalContent.style.opacity = '1';
                }
                
                const modalBody = modal.querySelector('.modal-body');
                if (modalBody) {
                    modalBody.style.backgroundColor = '';
                    modalBody.style.opacity = '1';
                }
                
                const modalHeader = modal.querySelector('.modal-header');
                if (modalHeader) {
                    modalHeader.style.backgroundColor = '';
                    modalHeader.style.opacity = '1';
                }
                
                const modalFooter = modal.querySelector('.modal-footer');
                if (modalFooter) {
                    modalFooter.style.backgroundColor = '';
                    modalFooter.style.opacity = '1';
                }
            },
            
            startModalObserver: function() {
                const self = this;
                
                const modalObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) {
                                    const $node = $(node);
                                    if ($node.hasClass('modal') || $node.find('.modal').length) {
                                        setTimeout(() => self.applyModalFixes(), 10);
                                    }
                                    
                                    // Check for modals within added content
                                    if (node.classList && node.classList.contains('modal')) {
                                        self.fixModalTransparency(node);
                                    }
                                    const modals = node.querySelectorAll('.modal');
                                    modals.forEach(modal => self.fixModalTransparency(modal));
                                }
                            });
                        }
                    });
                });
                
                // Start observing
                modalObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            },
            
            fixBackdropZIndex: function() {
                $(document).on('shown.bs.modal shown.modal', '.modal', function() {
                    let zIndex = 1040;
                    const $backdrop = $('.modal-backdrop').not('.modal-stack');
                    
                    $backdrop.each(function() {
                        zIndex += 10;
                        $(this).css('z-index', zIndex);
                    });
                    
                    $(this).css('z-index', zIndex + 10);
                });
            },
            
            addResizeHandler: function() {
                $(window).on('resize.grid4modal', function() {
                    $('.modal:visible').each(function() {
                        const $modal = $(this);
                        // Update CSS variable for max height
                        if ($modal[0]) {
                            const windowHeight = $(window).height();
                            const maxHeight = windowHeight - 200;
                            $modal[0].style.setProperty('--modal-max-height', maxHeight + 'px');
                        }
                    });
                });
            },
            
            addPublicAPI: function() {
                window.Grid4ModalFix = {
                    version: '1.0.0',
                    applyFixes: () => this.applyModalFixes(),
                    ensurePlacement: () => this.ensureModalPlacement(),
                    fixTransparency: (modal) => this.fixModalTransparency(modal),
                    debug: function() {
                        console.log('[Grid4 Modal Fix] Debug Info:');
                        console.log('- Modals found:', $('.modal').length);
                        console.log('- Visible modals:', $('.modal:visible').length);
                        console.log('- Modal backdrops:', $('.modal-backdrop').length);
                        console.log('- Body classes:', $('body').attr('class'));
                        $('.modal').each(function(i, modal) {
                            console.log('- Modal', i, ':', {
                                id: modal.id,
                                classes: modal.className,
                                visible: $(modal).is(':visible'),
                                inlineStyles: modal.style.cssText
                            });
                        });
                    }
                };
            },
            
            ensureModalPlacement: function() {
                $('.modal').each(function() {
                    const $modal = $(this);
                    const $appShell = $('#grid4-app-shell');
                    
                    // Only move if modal is outside app shell
                    if ($appShell.length && !$appShell.find($modal).length) {
                        // Check if modal should be moved (not a system modal)
                        const modalId = $modal.attr('id');
                        if (modalId && !modalId.match(/system|alert|confirm/i)) {
                            $modal.appendTo($appShell);
                        }
                    }
                });
            }
        },

        /**
         * Helper function to generate cache-busted URLs
         */
        generateUrls: function(baseUrl, version) {
            const timestamp = new Date().getTime();
            return {
                css: `${baseUrl}/grid4-portal-skin-v${version}.css?v=${timestamp}`,
                js: `${baseUrl}/grid4-portal-skin-v${version}.js?v=${timestamp}`
            };
        }
    };

    // Initialize when DOM is ready
    $(document).ready(function() {
        // Wait a bit for NetSapiens to initialize
        setTimeout(function() {
            Grid4Portal.init();
        }, 100);
    });

    // Expose the main object for debugging
    window.Grid4Portal = Grid4Portal;

})(jQuery, window, document);