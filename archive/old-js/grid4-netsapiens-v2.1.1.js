/* Grid4 Communications Custom NetSapiens Portal JavaScript v3.0.0 */
/* Enhanced with Cirrus-inspired functionality and third-party libraries */
/* Based on NetSapiens Portal Improvement Roadmap Phase 3 */

(function(window, $) {
    'use strict';

    // Early jQuery availability check with enhanced retry logic
    if (typeof $ === 'undefined' && typeof jQuery === 'undefined') {
        console.log('Grid4: jQuery not available, retrying...');
        var retryCount = 0;
        var maxRetries = 50;

        var checkJQuery = function() {
            if (typeof window.jQuery !== 'undefined') {
                // Re-invoke with jQuery available
                (function(window, $) {
                    // Continue with main script
                    initGrid4Portal(window, $);
                })(window, window.jQuery);
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(checkJQuery, 100);
            } else {
                console.error('Grid4: jQuery not available after ' + maxRetries + ' attempts');
            }
        };

        checkJQuery();
        return;
    }

    var $ = window.jQuery || window.$;

    // Main initialization function
    function initGrid4Portal(window, $) {

    // Main Grid4 NetSapiens object with enhanced Cirrus-inspired functionality
    var Grid4NetSapiens = {
        version: '3.0.0',
        initialized: false,
        modules: {},
        libraries: {},
        config: {
            companyName: 'Grid4 Communications',
            brandColor: '#0099ff',
            debug: true,
            sidebarWidth: 220,
            maxInitAttempts: 100,
            retryDelay: 100,
            // Enhanced configuration options
            enableBackgroundSelection: true,
            enableGlassMorphism: true,
            enablePageDetection: true,
            enableAdvancedStyling: true,
            cookiePrefix: 'grid4_',
            backgroundOptions: [
                'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/backgrounds/dark-blue.jpg',
                'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/backgrounds/dark-purple.jpg',
                'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/backgrounds/dark-gray.jpg'
            ]
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
        
        // Initialize all modules in dependency order with enhanced Cirrus-inspired modules
        initializeModules: function() {
            var initOrder = [
                'compatibility',
                'libraries',
                'pageDetection',
                'backgroundSystem',
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

    // Libraries Module - Enhanced third-party library management inspired by Cirrus
    Grid4NetSapiens.modules.libraries = {
        loaded: {},

        init: function() {
            this.loadCookieLibrary();
            this.setupLazyLoading();
            this.initializeMarkJS();
        },

        loadCookieLibrary: function() {
            if (typeof Cookies === 'undefined') {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js';
                script.onload = function() {
                    Grid4NetSapiens.modules.libraries.loaded.cookies = true;
                    Grid4NetSapiens.logDebug('Cookies library loaded');
                };
                document.head.appendChild(script);
            } else {
                this.loaded.cookies = true;
            }
        },

        setupLazyLoading: function() {
            // Basic lazy loading for images - simplified version of what's in basicJS.js
            if (typeof $ !== 'undefined') {
                $(document).ready(function() {
                    $('img[data-src]').each(function() {
                        var $img = $(this);
                        var src = $img.attr('data-src');
                        if (src) {
                            $img.attr('src', src).removeAttr('data-src');
                        }
                    });
                });
                this.loaded.lazyLoading = true;
                Grid4NetSapiens.logDebug('Lazy loading initialized');
            }
        },

        initializeMarkJS: function() {
            // Placeholder for Mark.js text highlighting functionality
            // Can be expanded later if needed
            this.loaded.markJS = true;
            Grid4NetSapiens.logDebug('Mark.js placeholder initialized');
        }
    };

    // Page Detection Module - Inspired by Cirrus page detection system
    Grid4NetSapiens.modules.pageDetection = {
        currentPage: '',
        pageClasses: [],

        init: function() {
            if (!Grid4NetSapiens.config.enablePageDetection) return;

            this.detectCurrentPage();
            this.addPageClasses();
            this.bindPageChangeEvents();
        },

        detectCurrentPage: function() {
            var currentUrl = window.location.href;
            var pathname = window.location.pathname;

            // Remove trailing slash for consistency
            if (currentUrl.endsWith('/')) {
                currentUrl = currentUrl.slice(0, -1);
            }

            // Detect page type based on URL patterns (inspired by cirrus.js)
            if (pathname.includes('/portal/users')) {
                this.currentPage = 'users';
                this.pageClasses = ['users'];
            } else if (pathname.includes('/portal/attendants')) {
                this.currentPage = 'attendants';
                this.pageClasses = ['attendants'];
            } else if (pathname.includes('/portal/callqueues')) {
                this.currentPage = 'callqueues';
                this.pageClasses = ['callqueues'];
            } else if (pathname.includes('/portal/conferences')) {
                this.currentPage = 'conferences';
                this.pageClasses = ['conferences'];
            } else if (pathname.includes('/portal/timeframes')) {
                this.currentPage = 'timeframes';
                this.pageClasses = ['timeframes'];
            } else if (pathname.includes('/portal/music')) {
                this.currentPage = 'music';
                this.pageClasses = ['music'];
            } else if (pathname.includes('/portal/inventory')) {
                this.currentPage = 'inventory';
                this.pageClasses = ['inventory'];
            } else if (pathname.includes('/portal/callhistory')) {
                this.currentPage = 'callhistory';
                this.pageClasses = ['callhistory'];
            } else if (pathname.includes('/portal/stats')) {
                this.currentPage = 'stats';
                this.pageClasses = ['stats'];
            } else if (pathname.includes('/portal/home') || pathname === '/portal' || pathname === '/portal/') {
                this.currentPage = 'home';
                this.pageClasses = ['home'];
            } else {
                // Extract page name from URL
                var lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);
                this.currentPage = lastPart.replace(/[^a-zA-Z0-9]/g, '');
                this.pageClasses = [this.currentPage];
            }

            Grid4NetSapiens.logDebug('Page detected: ' + this.currentPage);
        },

        addPageClasses: function() {
            var bodyElement = document.body;

            // Add Grid4 namespace class
            bodyElement.classList.add('grid4-portal');

            // Add page-specific classes
            this.pageClasses.forEach(function(className) {
                if (className) {
                    bodyElement.classList.add('grid4-page-' + className);
                    bodyElement.classList.add(className); // Also add without prefix for compatibility
                }
            });

            Grid4NetSapiens.logDebug('Page classes added: ' + this.pageClasses.join(', '));
        },

        bindPageChangeEvents: function() {
            // Listen for AJAX navigation changes (common in NetSapiens portal)
            var self = this;

            // Monitor for URL changes
            var currentUrl = window.location.href;
            setInterval(function() {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    self.detectCurrentPage();
                    self.addPageClasses();
                    Grid4NetSapiens.logDebug('Page change detected, classes updated');
                }
            }, 1000);
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

    // Background System Module - Inspired by Cirrus background selection system
    Grid4NetSapiens.modules.backgroundSystem = {
        selectedBackground: null,
        backgroundOptions: [],

        init: function() {
            if (!Grid4NetSapiens.config.enableBackgroundSelection) return;

            this.backgroundOptions = Grid4NetSapiens.config.backgroundOptions;
            this.loadSavedBackground();
            this.createBackgroundSelector();
            this.bindEvents();
        },

        loadSavedBackground: function() {
            var self = this;

            // Wait for cookies library to be available
            var checkCookies = function() {
                if (typeof Cookies !== 'undefined') {
                    var savedBackground = Cookies.get(Grid4NetSapiens.config.cookiePrefix + 'selectedBackground');

                    if (savedBackground) {
                        self.selectedBackground = savedBackground;
                        self.applyBackground(savedBackground);
                    } else {
                        // Apply default background
                        var defaultBackground = self.backgroundOptions[0];
                        self.applyBackground(defaultBackground);
                        self.saveBackground(defaultBackground);
                    }
                } else {
                    setTimeout(checkCookies, 100);
                }
            };

            checkCookies();
        },

        applyBackground: function(backgroundUrl) {
            if (backgroundUrl) {
                document.body.style.backgroundImage = 'url("' + backgroundUrl + '")';
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundAttachment = 'fixed';
                this.selectedBackground = backgroundUrl;
                Grid4NetSapiens.logDebug('Background applied: ' + backgroundUrl);
            }
        },

        saveBackground: function(backgroundUrl) {
            if (typeof Cookies !== 'undefined') {
                Cookies.set(Grid4NetSapiens.config.cookiePrefix + 'selectedBackground', backgroundUrl, { expires: 365 });
                Grid4NetSapiens.logDebug('Background saved to cookies: ' + backgroundUrl);
            }
        },

        createBackgroundSelector: function() {
            // Create background selection UI (simplified version of Cirrus system)
            var selectorHtml = '<div id="grid4-background-selector" style="display: none;">' +
                '<div class="grid4-bg-options">';

            this.backgroundOptions.forEach(function(bgUrl, index) {
                selectorHtml += '<div class="grid4-bg-option" data-background="' + bgUrl + '" ' +
                    'style="background-image: url(' + bgUrl + '); width: 50px; height: 50px; ' +
                    'background-size: cover; display: inline-block; margin: 5px; cursor: pointer; ' +
                    'border: 2px solid transparent; border-radius: 4px;"></div>';
            });

            selectorHtml += '</div></div>';

            // Add to page
            $('body').append(selectorHtml);

            // Add toggle button (can be styled with CSS)
            var toggleButton = '<button id="grid4-bg-toggle" style="position: fixed; top: 10px; right: 10px; ' +
                'z-index: 9999; background: rgba(0,0,0,0.7); color: white; border: none; ' +
                'padding: 8px 12px; border-radius: 4px; cursor: pointer;">BG</button>';

            $('body').append(toggleButton);
        },

        bindEvents: function() {
            var self = this;

            // Toggle selector visibility
            $(document).on('click', '#grid4-bg-toggle', function() {
                $('#grid4-background-selector').toggle();
            });

            // Background option selection
            $(document).on('click', '.grid4-bg-option', function() {
                var backgroundUrl = $(this).data('background');

                // Remove selected class from all options
                $('.grid4-bg-option').css('border-color', 'transparent');

                // Add selected class to clicked option
                $(this).css('border-color', Grid4NetSapiens.config.brandColor);

                // Apply and save background
                self.applyBackground(backgroundUrl);
                self.saveBackground(backgroundUrl);

                // Hide selector
                $('#grid4-background-selector').hide();
            });

            // Close selector when clicking outside
            $(document).on('click', function(e) {
                if (!$(e.target).closest('#grid4-background-selector, #grid4-bg-toggle').length) {
                    $('#grid4-background-selector').hide();
                }
            });
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
    
    // Performance Module - Enhanced monitoring and optimization
    Grid4NetSapiens.modules.performance = {
        metrics: {
            initStart: 0,
            initEnd: 0,
            ajaxCalls: 0,
            errors: 0,
            lastAjaxTime: 0
        },
        
        errorHandler: {
            errors: [],
            maxErrors: 50,
            
            logError: function(error, context, data) {
                var errorInfo = {
                    message: error.message || error,
                    context: context || 'Unknown',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    portalVersion: Grid4NetSapiens.version,
                    data: data || null
                };
                
                this.errors.push(errorInfo);
                
                // Keep only the most recent errors
                if (this.errors.length > this.maxErrors) {
                    this.errors = this.errors.slice(-this.maxErrors);
                }
                
                Grid4NetSapiens.modules.performance.metrics.errors++;
                console.error('Grid4 Error [' + context + ']:', errorInfo);
                
                // Integration with external error reporting if available
                if (window.bugsnagClient) {
                    window.bugsnagClient.notify(error, {
                        context: 'Grid4 Portal Customization - ' + context,
                        severity: 'warning',
                        metadata: { grid4: errorInfo }
                    });
                }
            },
            
            getRecentErrors: function() {
                return this.errors.slice(-10); // Return last 10 errors
            }
        },
        
        init: function() {
            this.startTiming();
            this.setupErrorHandling();
            this.optimizeEventHandlers();
            this.monitorAjax();
            this.trackPerformanceMetrics();
        },
        
        setupErrorHandling: function() {
            var self = this;
            
            // Global error handler
            window.addEventListener('error', function(event) {
                self.errorHandler.logError(event.error || event.message, 'Global Error', {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            });
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', function(event) {
                self.errorHandler.logError(event.reason, 'Unhandled Promise Rejection');
            });
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
            var self = this;
            
            // Debounced resize handler
            var resizeTimeout;
            $(window).on('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    try {
                        Grid4NetSapiens.modules.navigation.handleResize();
                    } catch (error) {
                        self.errorHandler.logError(error, 'Resize Handler');
                    }
                }, 150);
            });
            
            // Throttled scroll handler for performance
            var scrollTimeout;
            var isScrolling = false;
            $(window).on('scroll', function() {
                if (!isScrolling) {
                    window.requestAnimationFrame(function() {
                        // Handle scroll-based optimizations here
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            });
        },
        
        monitorAjax: function() {
            var self = this;
            
            // Enhanced NetSapiens endpoint monitoring
            var netSapiensEndpoints = {
                portal: ['/portal/home', '/portal/dashboard', '/portal/navigation'],
                users: ['/portal/users', '/portal/user'],
                calls: ['/portal/calls', '/portal/callqueue', '/portal/conferences'],
                admin: ['/portal/admin', '/portal/settings']
            };
            
            var allEndpoints = [];
            Object.keys(netSapiensEndpoints).forEach(function(category) {
                allEndpoints = allEndpoints.concat(netSapiensEndpoints[category]);
            });
            
            // AJAX Complete monitoring with performance tracking
            $(document).ajaxComplete(function(event, xhr, settings) {
                try {
                    if (self.isNetSapiensCall(settings.url, allEndpoints)) {
                        self.metrics.ajaxCalls++;
                        self.metrics.lastAjaxTime = performance.now();
                        
                        // Re-apply navigation enhancements with error handling
                        setTimeout(function() {
                            try {
                                Grid4NetSapiens.modules.navigation.shortenLabels();
                                Grid4NetSapiens.logDebug('Navigation refreshed after AJAX call');
                            } catch (error) {
                                self.errorHandler.logError(error, 'AJAX Navigation Refresh');
                            }
                        }, 100);
                    }
                } catch (error) {
                    self.errorHandler.logError(error, 'AJAX Complete Handler');
                }
            });
            
            // AJAX Error monitoring
            $(document).ajaxError(function(event, xhr, settings, thrownError) {
                if (self.isNetSapiensCall(settings.url, allEndpoints)) {
                    self.errorHandler.logError(thrownError || 'AJAX Error', 'AJAX Request Failed', {
                        url: settings.url,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseText: xhr.responseText ? xhr.responseText.substring(0, 200) : null
                    });
                }
            });
        },
        
        isNetSapiensCall: function(url, endpoints) {
            if (!url) return false;
            return endpoints.some(function(endpoint) {
                return url.indexOf(endpoint) !== -1;
            });
        },
        
        trackPerformanceMetrics: function() {
            var self = this;
            
            // Track performance metrics if available
            if (window.performance && window.performance.timing) {
                setTimeout(function() {
                    var timing = window.performance.timing;
                    var metrics = {
                        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                        pageLoad: timing.loadEventEnd - timing.navigationStart,
                        domComplete: timing.domComplete - timing.navigationStart
                    };
                    
                    Grid4NetSapiens.logDebug('Performance metrics: ' + JSON.stringify(metrics));
                    
                    // Store metrics for reporting
                    self.metrics.pageMetrics = metrics;
                }, 1000);
            }
        },
        
        generateReport: function() {
            return {
                version: Grid4NetSapiens.version,
                metrics: this.metrics,
                recentErrors: this.errorHandler.getRecentErrors(),
                timestamp: new Date().toISOString()
            };
        }
    };
    
    // Enhanced resize handler for navigation module
    Grid4NetSapiens.modules.navigation.handleResize = function() {
        try {
            var width = $(window).width();
            if (width <= 768) {
                $('#navigation').removeClass('mobile-active');
                $('.grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
                Grid4NetSapiens.logDebug('Mobile navigation collapsed on resize');
            }
        } catch (error) {
            Grid4NetSapiens.reportError(error, 'Navigation Resize Handler');
        }
    };
    
    // Add global error wrapper to main Grid4NetSapiens object
    Grid4NetSapiens.reportError = function(error, context, data) {
        if (this.modules.performance && this.modules.performance.errorHandler) {
            this.modules.performance.errorHandler.logError(error, context, data);
        } else {
            console.error('Grid4 Error [' + (context || 'Unknown') + ']:', error);
        }
    };
    
    Grid4NetSapiens.getPerformanceReport = function() {
        if (this.modules.performance) {
            return this.modules.performance.generateReport();
        }
        return null;
    };
    
    // Expose Grid4NetSapiens to global scope for NetSapiens compatibility
    window.Grid4NetSapiens = Grid4NetSapiens;
    
    // Initialize when DOM is ready with enhanced error handling
    $(document).ready(function() {
        try {
            Grid4NetSapiens.init();
            
            // Complete timing after module initialization
            setTimeout(function() {
                try {
                    if (Grid4NetSapiens.modules.performance) {
                        Grid4NetSapiens.modules.performance.endTiming();
                    }
                } catch (error) {
                    Grid4NetSapiens.reportError(error, 'Performance Timing Completion');
                }
            }, 100);
            
        } catch (error) {
            console.error('Grid4: Critical initialization error:', error);
            // Attempt fallback initialization
            setTimeout(function() {
                if (Grid4NetSapiens.fallbackInit) {
                    Grid4NetSapiens.fallbackInit();
                }
            }, 500);
        }
    });

    } // End of initGrid4Portal function

    // Call the main initialization
    initGrid4Portal(window, $);

})(window, window.jQuery || window.$);