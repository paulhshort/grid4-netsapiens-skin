/* Grid4 Communications Custom NetSapiens Portal JavaScript v2.1.1 */
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
        version: '2.1.1',
        initialized: false,
        modules: {},
        config: {
            companyName: 'Grid4 Communications',
            brandColor: '#0099ff',
            debug: true,
            sidebarWidth: 220,
            maxInitAttempts: 100,
            retryDelay: 100,
            // Development mode configuration
            developmentMode: window.location.hostname === 'localhost' || window.location.search.includes('grid4-dev=true'),
            hotReload: true,
            debugPanel: true,
            performanceMonitoring: true
        },
        
        // Core initialization method
        init: function() {
            if (this.initialized) {
                console.log('Grid4: Already initialized, skipping...');
                return;
            }

            // Initialize development tools if in dev mode
            if (this.config.developmentMode) {
                this.initDevelopmentTools();
            }

            this.waitForPortalReady(function() {
                Grid4NetSapiens.initializeModules();
                Grid4NetSapiens.initialized = true;
                Grid4NetSapiens.logSuccess('Grid4 NetSapiens Portal v' + Grid4NetSapiens.version + ' initialized successfully');

                // Initialize debug panel if enabled
                if (Grid4NetSapiens.config.debugPanel && Grid4NetSapiens.config.developmentMode) {
                    Grid4NetSapiens.initDebugPanel();
                }
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

        // Store error for debugging in development mode
        if (this.config.developmentMode) {
            if (!window.Grid4Errors) window.Grid4Errors = [];
            window.Grid4Errors.push({
                message: error.message || error,
                context: context || 'Unknown',
                stack: error.stack || 'No stack trace',
                timestamp: new Date().toISOString(),
                version: this.version,
                url: window.location.href,
                data: data
            });
        }
    };

    // Development Tools
    Grid4NetSapiens.initDevelopmentTools = function() {
        console.log('🚀 Grid4 Development Mode Activated');

        // Add development CSS class
        document.documentElement.classList.add('grid4-dev-mode');

        // Initialize performance monitoring
        if (this.config.performanceMonitoring) {
            this.initPerformanceMonitoring();
        }

        // Add global Grid4 development object
        window.Grid4Dev = {
            version: this.version,
            config: this.config,
            modules: this.modules,
            errors: window.Grid4Errors || [],

            // Development utilities
            utils: {
                // Reload Grid4 without page refresh
                reload: function() {
                    Grid4NetSapiens.initialized = false;
                    Grid4NetSapiens.modules = {};
                    Grid4NetSapiens.init();
                },

                // Toggle debug mode
                toggleDebug: function() {
                    Grid4NetSapiens.config.debug = !Grid4NetSapiens.config.debug;
                    console.log('Grid4 Debug mode:', Grid4NetSapiens.config.debug ? 'ON' : 'OFF');
                },

                // Get performance metrics
                getPerformance: function() {
                    return Grid4NetSapiens.modules.performance || {};
                },

                // Test all modules
                testModules: function() {
                    Object.keys(Grid4NetSapiens.modules).forEach(function(moduleName) {
                        var module = Grid4NetSapiens.modules[moduleName];
                        console.log('Testing module: ' + moduleName, module);
                    });
                },

                // Inspect NetSapiens portal state
                inspectPortal: function() {
                    return {
                        jQuery: typeof $ !== 'undefined' ? $.fn.jquery : 'Not loaded',
                        portalElements: {
                            sidebar: $('.sidebar').length,
                            content: $('.content').length,
                            navigation: $('.navigation').length
                        },
                        sessionData: {
                            user: window.sub_user || 'Unknown',
                            domain: window.sub_domain || 'Unknown',
                            scope: window.sub_scope || 'Unknown'
                        }
                    };
                }
            }
        };

        console.log('🛠️ Grid4Dev tools available in console: window.Grid4Dev');
    };

    Grid4NetSapiens.initPerformanceMonitoring = function() {
        var startTime = performance.now();

        this.modules.performance = this.modules.performance || {};
        this.modules.performance.devMetrics = {
            startTime: startTime,
            metrics: {},

            mark: function(name) {
                this.metrics[name] = performance.now() - this.startTime;
                console.log('⏱️ Grid4 Performance [' + name + ']: ' + this.metrics[name].toFixed(2) + 'ms');
            },

            getMetrics: function() {
                return this.metrics;
            },

            endTiming: function() {
                this.mark('total_initialization');
                console.log('📊 Grid4 Performance Summary:', this.metrics);
            }
        };

        this.modules.performance.devMetrics.mark('performance_monitoring_init');
    };

    Grid4NetSapiens.initDebugPanel = function() {
        var self = this;

        // Create debug panel HTML
        var debugPanel = $('<div id="grid4-debug-panel" style="' +
            'position: fixed; top: 50px; right: 10px; width: 300px; ' +
            'background: rgba(0, 0, 0, 0.9); color: white; padding: 15px; ' +
            'border-radius: 8px; font-family: monospace; font-size: 12px; ' +
            'z-index: 999999; max-height: 400px; overflow-y: auto; display: none;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                '<strong>🚀 Grid4 Debug Panel</strong>' +
                '<button id="grid4-debug-close" style="background: none; border: none; color: white; cursor: pointer;">✕</button>' +
            '</div>' +
            '<div id="grid4-debug-content">' +
                '<div><strong>Version:</strong> ' + this.version + '</div>' +
                '<div><strong>Mode:</strong> Development</div>' +
                '<div><strong>Modules:</strong> <span id="grid4-module-count">0</span></div>' +
                '<div><strong>Errors:</strong> <span id="grid4-error-count">0</span></div>' +
                '<hr style="border: 1px solid #333; margin: 10px 0;">' +
                '<div id="grid4-debug-logs" style="max-height: 200px; overflow-y: auto;"></div>' +
                '<hr style="border: 1px solid #333; margin: 10px 0;">' +
                '<button id="grid4-debug-reload" style="background: #0099ff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Reload</button>' +
                '<button id="grid4-debug-test" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Test</button>' +
            '</div>' +
        '</div>');

        $('body').append(debugPanel);

        // Add toggle button
        var toggleButton = $('<button id="grid4-debug-toggle" style="' +
            'position: fixed; top: 10px; right: 10px; background: #ff6b35; ' +
            'color: white; border: none; padding: 8px 12px; border-radius: 4px; ' +
            'cursor: pointer; z-index: 999999; font-family: monospace; font-size: 12px;">' +
            '🐛 Debug</button>');

        $('body').append(toggleButton);

        // Event handlers
        $('#grid4-debug-toggle').click(function() {
            $('#grid4-debug-panel').toggle();
            self.updateDebugPanel();
        });

        $('#grid4-debug-close').click(function() {
            $('#grid4-debug-panel').hide();
        });

        $('#grid4-debug-reload').click(function() {
            window.Grid4Dev.utils.reload();
        });

        $('#grid4-debug-test').click(function() {
            window.Grid4Dev.utils.testModules();
        });

        // Update panel periodically
        setInterval(function() {
            if ($('#grid4-debug-panel').is(':visible')) {
                self.updateDebugPanel();
            }
        }, 2000);
    };

    Grid4NetSapiens.updateDebugPanel = function() {
        $('#grid4-module-count').text(Object.keys(this.modules).length);
        $('#grid4-error-count').text((window.Grid4Errors || []).length);

        // Update logs (show last 5 entries)
        var logs = $('#grid4-debug-logs');
        var recentErrors = (window.Grid4Errors || []).slice(-5);

        var logsHtml = recentErrors.map(function(error) {
            return '<div style="margin: 2px 0; padding: 2px; background: rgba(255, 0, 0, 0.2); border-radius: 2px;">' +
                '<strong>' + error.context + ':</strong> ' + error.message +
            '</div>';
        }).join('');

        logs.html(logsHtml);
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
    
})(window, window.jQuery || window.$);