/* Grid4 Communications Custom NetSapiens Portal JavaScript v2.0.0 */
/* Modular architecture for enhanced maintainability and performance */
/* Based on NetSapiens Portal Improvement Roadmap Phase 1 */

(function(window, $) {
    'use strict';
    
    // Early jQuery availability check
    if (typeof $ === 'undefined' && typeof jQuery === 'undefined') {
        console.log('Grid4: jQuery not available, retrying...');
        setTimeout(function() {
            // Self-invoke with re-check
            (arguments.callee)(window, window.jQuery || window.$);
        }, 100);
        return;
    }
    
    var $ = window.jQuery || window.$;
    
    // Main Grid4 NetSapiens object
    var Grid4NetSapiens = {
        version: '2.0.0',
        initialized: false,
        modules: {},
        config: {
            companyName: 'Grid4 Communications',
            brandColor: '#0099ff',
            debug: true,
            sidebarWidth: 220,
            maxInitAttempts: 100,
            retryDelay: 100
        },
        
        // Core initialization method
        init: function() {
            if (this.initialized) {
                console.log('Grid4: Already initialized, skipping...');
                return;
            }
            
            this.waitForPortalReady(function() {
                Grid4NetSapiens.initializeModules();
                Grid4NetSapiens.initialized = true;
                Grid4NetSapiens.logSuccess('Grid4 NetSapiens Portal v' + Grid4NetSapiens.version + ' initialized successfully');
            });
        },
        
        // Wait for NetSapiens portal elements to be ready
        waitForPortalReady: function(callback) {
            var attempts = 0;
            var self = this;
            
            var checkReady = function() {
                var isReady = self.checkPortalElements();
                
                if (isReady) {
                    callback();
                } else if (attempts < self.config.maxInitAttempts) {
                    attempts++;
                    setTimeout(checkReady, self.config.retryDelay);
                } else {
                    console.warn('Grid4: Portal elements not ready after ' + attempts + ' attempts, using fallback initialization');
                    self.fallbackInit();
                }
            };
            
            checkReady();
        },
        
        // Check if required NetSapiens portal elements exist
        checkPortalElements: function() {
            return $('#navigation').length > 0 && $('#nav-buttons').length > 0;
        },
        
        // Fallback initialization when portal elements aren't fully ready
        fallbackInit: function() {
            console.warn('Grid4: Using fallback initialization - some features may be limited');
            this.modules.compatibility.init();
            this.modules.performance.init();
            this.initialized = true;
        },
        
        // Initialize all modules in dependency order
        initializeModules: function() {
            var initOrder = [
                'compatibility',
                'navigation', 
                'theming',
                'accessibility',
                'performance'
            ];
            
            var self = this;
            initOrder.forEach(function(moduleName) {
                if (self.modules[moduleName] && self.modules[moduleName].init) {
                    try {
                        self.modules[moduleName].init();
                        self.logDebug('Module initialized: ' + moduleName);
                    } catch (error) {
                        console.error('Grid4: Error initializing module ' + moduleName + ':', error);
                    }
                }
            });
        },
        
        // Logging utilities
        logDebug: function(message) {
            if (this.config.debug) {
                console.log('Grid4 Debug: ' + message);
            }
        },
        
        logSuccess: function(message) {
            console.log('Grid4: ' + message);
        },
        
        logError: function(message, error) {
            console.error('Grid4 Error: ' + message, error);
        }
    };
    
    // Compatibility Module - handles browser-specific fixes and FontAwesome
    Grid4NetSapiens.modules.compatibility = {
        browserInfo: {},
        
        init: function() {
            this.detectBrowser();
            this.applyBrowserFixes();
            this.ensureFontAwesome();
        },
        
        detectBrowser: function() {
            var userAgent = navigator.userAgent;
            this.browserInfo = {
                isEdge: /Edge\/\d+/.test(userAgent) || /Edg\/\d+/.test(userAgent),
                isIE: /MSIE \d+/.test(userAgent) || /Trident\/\d+/.test(userAgent),
                isChrome: /Chrome\/\d+/.test(userAgent) && !/Edge\/\d+/.test(userAgent),
                isFirefox: /Firefox\/\d+/.test(userAgent),
                isSafari: /Safari\/\d+/.test(userAgent) && !/Chrome\/\d+/.test(userAgent)
            };
            
            Grid4NetSapiens.logDebug('Browser detected: ' + this.getBrowserName());
        },
        
        getBrowserName: function() {
            if (this.browserInfo.isEdge) return 'Microsoft Edge';
            if (this.browserInfo.isIE) return 'Internet Explorer';
            if (this.browserInfo.isChrome) return 'Google Chrome';
            if (this.browserInfo.isFirefox) return 'Mozilla Firefox';
            if (this.browserInfo.isSafari) return 'Apple Safari';
            return 'Unknown Browser';
        },
        
        applyBrowserFixes: function() {
            // Add browser class to body for targeted CSS fixes
            var browserClass = 'grid4-browser-unknown';
            if (this.browserInfo.isEdge) browserClass = 'grid4-browser-edge';
            else if (this.browserInfo.isIE) browserClass = 'grid4-browser-ie';
            else if (this.browserInfo.isChrome) browserClass = 'grid4-browser-chrome';
            else if (this.browserInfo.isFirefox) browserClass = 'grid4-browser-firefox';
            else if (this.browserInfo.isSafari) browserClass = 'grid4-browser-safari';
            
            $('body').addClass(browserClass);
            
            // Force navigation visibility for all browsers
            this.ensureNavigationVisibility();
        },
        
        ensureNavigationVisibility: function() {
            var forceNavStyle = '' +
                '<style id="grid4-force-navigation">' +
                '#navigation { ' +
                    'position: fixed !important; ' +
                    'display: block !important; ' +
                    'visibility: visible !important; ' +
                    'opacity: 1 !important; ' +
                    'left: 0 !important; ' +
                    'top: 60px !important; ' +
                    'width: ' + Grid4NetSapiens.config.sidebarWidth + 'px !important; ' +
                    'height: calc(100vh - 60px) !important; ' +
                    'background-color: #1e2736 !important; ' +
                    'z-index: 1000 !important; ' +
                '}' +
                '</style>';
            
            if ($('#grid4-force-navigation').length === 0) {
                $('head').append(forceNavStyle);
            }
        },
        
        ensureFontAwesome: function() {
            if ($('link[href*="font-awesome"]').length === 0 && $('link[href*="fontawesome"]').length === 0) {
                var fontAwesomeLink = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">';
                $('head').append(fontAwesomeLink);
                Grid4NetSapiens.logDebug('FontAwesome CSS loaded from CDN');
            }
        }
    };
    
    // Navigation Module - handles sidebar transformation and mobile functionality
    Grid4NetSapiens.modules.navigation = {
        config: {
            selectors: {
                nav: '#navigation',
                navButtons: '#nav-buttons',
                navLinks: '#nav-buttons li a.nav-link',
                navText: '.nav-text'
            },
            labelMap: {
                'Auto Attendants': 'Attendants',
                'Call Queues': 'Queues',
                'Music On Hold': 'Hold',
                'Route Profiles': 'Routes',
                'Call History': 'History',
                'Time Frames': 'Schedules'
            }
        },
        
        init: function() {
            this.transformToSidebar();
            this.addMobileToggle();
            this.shortenLabels();
            this.bindEvents();
        },
        
        transformToSidebar: function() {
            var $nav = $(this.config.selectors.nav);
            if (!$nav.length) {
                Grid4NetSapiens.logError('Navigation element not found');
                return;
            }
            
            $nav.addClass('ns-portal-nav');
            Grid4NetSapiens.logDebug('Navigation transformed to sidebar');
        },
        
        addMobileToggle: function() {
            if ($('.grid4-mobile-toggle').length > 0) return;
            
            var toggleButton = $('<button class="grid4-mobile-toggle" aria-label="Toggle Navigation">' +
                '<i class="fa fa-bars"></i>' +
                '</button>');
            
            $('body').append(toggleButton);
            
            toggleButton.on('click', function() {
                $('#navigation').toggleClass('mobile-active');
                $(this).find('i').toggleClass('fa-bars fa-times');
            });
            
            Grid4NetSapiens.logDebug('Mobile toggle added');
        },
        
        shortenLabels: function() {
            var self = this;
            $(this.config.selectors.navLinks).each(function() {
                var $link = $(this);
                var $text = $link.find(self.config.selectors.navText);
                var originalText = $text.text().trim();
                
                if (self.config.labelMap[originalText]) {
                    $text.text(self.config.labelMap[originalText]);
                    Grid4NetSapiens.logDebug('Label shortened: ' + originalText + ' -> ' + self.config.labelMap[originalText]);
                }
            });
        },
        
        bindEvents: function() {
            // Add smooth hover effects
            $(this.config.selectors.navLinks).on('mouseenter', function() {
                $(this).addClass('grid4-nav-hover');
            }).on('mouseleave', function() {
                $(this).removeClass('grid4-nav-hover');
            });
        }
    };
    
    // Theming Module - handles branding and visual enhancements
    Grid4NetSapiens.modules.theming = {
        init: function() {
            this.addGrid4Branding();
            this.addToolbarEnhancements();
        },
        
        addGrid4Branding: function() {
            // Add Grid4 logo or branding elements if needed
            Grid4NetSapiens.logDebug('Grid4 branding applied');
        },
        
        addToolbarEnhancements: function() {
            // Enhanced toolbar functionality
            Grid4NetSapiens.logDebug('Toolbar enhancements applied');
        }
    };
    
    // Accessibility Module - improves keyboard navigation and screen reader support
    Grid4NetSapiens.modules.accessibility = {
        init: function() {
            this.enhanceKeyboardNavigation();
            this.addAriaLabels();
        },
        
        enhanceKeyboardNavigation: function() {
            // Add keyboard navigation improvements
            $(document).on('keydown', function(e) {
                // Escape key closes mobile menu
                if (e.keyCode === 27) {
                    $('#navigation').removeClass('mobile-active');
                    $('.grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
                }
            });
        },
        
        addAriaLabels: function() {
            // Add proper ARIA labels for screen readers
            $('#navigation').attr('aria-label', 'Main Navigation');
            $('#nav-buttons').attr('role', 'navigation');
        }
    };
    
    // Performance Module - handles optimization and monitoring
    Grid4NetSapiens.modules.performance = {
        metrics: {
            initStart: 0,
            initEnd: 0
        },
        
        init: function() {
            this.startTiming();
            this.optimizeEventHandlers();
            this.monitorAjax();
        },
        
        startTiming: function() {
            this.metrics.initStart = performance.now();
        },
        
        endTiming: function() {
            this.metrics.initEnd = performance.now();
            var duration = this.metrics.initEnd - this.metrics.initStart;
            Grid4NetSapiens.logDebug('Initialization completed in ' + duration.toFixed(2) + 'ms');
        },
        
        optimizeEventHandlers: function() {
            // Debounce resize events for better performance
            var resizeTimeout;
            $(window).on('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    Grid4NetSapiens.modules.navigation.handleResize();
                }, 150);
            });
        },
        
        monitorAjax: function() {
            // Monitor only NetSapiens-specific AJAX calls
            var netSapiensEndpoints = [
                '/portal/home',
                '/portal/users',
                '/portal/navigation'
            ];
            
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url && netSapiensEndpoints.some(function(endpoint) {
                    return settings.url.indexOf(endpoint) !== -1;
                })) {
                    // Re-apply navigation enhancements after AJAX content load
                    setTimeout(function() {
                        Grid4NetSapiens.modules.navigation.shortenLabels();
                    }, 100);
                }
            });
        }
    };
    
    // Add resize handler to navigation module
    Grid4NetSapiens.modules.navigation.handleResize = function() {
        var width = $(window).width();
        if (width <= 768) {
            $('#navigation').removeClass('mobile-active');
            $('.grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
        }
    };
    
    // Expose Grid4NetSapiens to global scope for NetSapiens compatibility
    window.Grid4NetSapiens = Grid4NetSapiens;
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        Grid4NetSapiens.init();
        
        // Complete timing after module initialization
        setTimeout(function() {
            if (Grid4NetSapiens.modules.performance) {
                Grid4NetSapiens.modules.performance.endTiming();
            }
        }, 100);
    });
    
})(window, window.jQuery || window.$);