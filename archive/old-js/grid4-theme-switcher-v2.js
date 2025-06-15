/* Grid4 Theme Switcher v2.0 - Production-Ready Theme Management
 * Dopamine-driven UX with smooth transitions and persistent preferences
 * FOIT (Flash of Incorrect Theme) prevention with blocking inline script
 * jQuery 1.8.3 compatible for legacy NetSapiens environment
 */

(function(window, document, $) {
    'use strict';

    // Theme management namespace
    window.Grid4Themes = window.Grid4Themes || {
        version: '2.0.0',
        initialized: false,
        currentTheme: 'system',
        themes: ['light', 'dark', 'high-contrast', 'system'],
        
        // Theme configuration with metadata
        themeConfig: {
            light: {
                name: 'Light',
                icon: '☀️',
                description: 'Clean and bright interface'
            },
            dark: {
                name: 'Dark', 
                icon: '🌙',
                description: 'Easy on the eyes'
            },
            'high-contrast': {
                name: 'High Contrast',
                icon: '⚫',
                description: 'Maximum accessibility'
            },
            system: {
                name: 'System',
                icon: '💻',
                description: 'Follow OS preference'
            }
        },

        // Initialize theme system
        init: function() {
            if (this.initialized) return;
            
            console.log('🎨 Grid4Themes: Initializing theme system v2.0...');
            
            // Load theme CSS immediately for best performance
            this.loadThemeCSS();
            
            // Set initial theme (FOIT prevention already handled by inline script)
            this.applyStoredTheme();
            
            // Create theme switcher UI
            this.createThemeSwitcher();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Monitor OS theme changes
            this.setupSystemThemeMonitoring();
            
            this.initialized = true;
            console.log('✨ Grid4Themes: Theme system ready with dopamine-driven UX!');
            
            // Show subtle notification
            this.showThemeNotification('Theme system loaded', 'success');
        },

        // Load theme CSS with cache busting
        loadThemeCSS: function() {
            try {
                // Check if CSS is already loaded
                var existingLink = document.querySelector('link[href*="grid4-theme-system-v2.css"]');
                if (existingLink) {
                    console.log('🎨 Grid4Themes: CSS already loaded');
                    return;
                }
                
                var timestamp = new Date().getTime();
                var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-theme-system-v2.css?v=' + timestamp;
                
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = cssUrl;
                link.onload = function() {
                    console.log('🎨 Grid4Themes: Theme CSS loaded successfully');
                };
                link.onerror = function() {
                    console.error('❌ Grid4Themes: Failed to load theme CSS');
                };
                
                document.head.appendChild(link);
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error loading theme CSS:', error);
            }
        },

        // Apply stored theme or detect OS preference
        applyStoredTheme: function() {
            try {
                var storedTheme = this.getStoredTheme();
                this.setTheme(storedTheme, false); // Don't store again
                
                console.log('🎨 Grid4Themes: Applied theme:', storedTheme);
            } catch (error) {
                console.error('❌ Grid4Themes: Error applying stored theme:', error);
                this.setTheme('light'); // Safe fallback
            }
        },

        // Get theme from localStorage or detect OS preference
        getStoredTheme: function() {
            try {
                var stored = localStorage.getItem('g4-theme-preference');
                if (stored && this.themes.indexOf(stored) !== -1) {
                    return stored;
                }
                
                // Fallback to system detection
                return this.detectSystemTheme();
            } catch (error) {
                console.warn('⚠️ Grid4Themes: localStorage not available, using system theme');
                return this.detectSystemTheme();
            }
        },

        // Detect OS theme preference
        detectSystemTheme: function() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        },

        // Set theme with smooth transition
        setTheme: function(theme, shouldStore) {
            if (shouldStore !== false) shouldStore = true;
            
            try {
                var resolvedTheme = theme;
                
                // Resolve 'system' to actual theme
                if (theme === 'system') {
                    resolvedTheme = this.detectSystemTheme();
                }
                
                // Apply theme to document
                if (resolvedTheme === 'light') {
                    document.documentElement.removeAttribute('data-theme');
                    document.body.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', resolvedTheme);
                    document.body.setAttribute('data-theme', resolvedTheme);
                }
                
                this.currentTheme = theme; // Store the original preference
                
                // Store preference
                if (shouldStore) {
                    try {
                        localStorage.setItem('g4-theme-preference', theme);
                    } catch (e) {
                        console.warn('⚠️ Grid4Themes: Could not store theme preference');
                    }
                }
                
                // Update switcher UI
                this.updateSwitcherUI();
                
                // Dispatch theme change event
                this.dispatchThemeEvent(theme, resolvedTheme);
                
                // Show success notification
                var themeConfig = this.themeConfig[theme];
                if (themeConfig && shouldStore) {
                    this.showThemeNotification(
                        themeConfig.icon + ' ' + themeConfig.name + ' theme applied',
                        'success'
                    );
                }
                
                console.log('🎨 Grid4Themes: Theme set to', theme, '(resolved:', resolvedTheme + ')');
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error setting theme:', error);
            }
        },

        // Create beautiful theme switcher UI
        createThemeSwitcher: function() {
            try {
                // Remove existing switcher
                $('.g4-theme-switcher').remove();
                
                var switcher = $('<div class="g4-theme-switcher"></div>');
                
                // Create theme buttons
                for (var i = 0; i < this.themes.length; i++) {
                    var theme = this.themes[i];
                    var config = this.themeConfig[theme];
                    
                    var button = $('<button class="g4-theme-button" data-theme="' + theme + '" title="' + config.description + '">' +
                        config.icon +
                        '</button>');
                    
                    switcher.append(button);
                }
                
                // Add to page
                $('body').append(switcher);
                
                // Update initial state
                this.updateSwitcherUI();
                
                // Add smooth entrance animation
                setTimeout(function() {
                    switcher.css({
                        'transform': 'translateX(0)',
                        'opacity': '1'
                    });
                }, 100);
                
                console.log('🎨 Grid4Themes: Theme switcher UI created');
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error creating theme switcher:', error);
            }
        },

        // Update switcher UI to reflect current theme
        updateSwitcherUI: function() {
            try {
                $('.g4-theme-button').removeClass('active');
                $('.g4-theme-button[data-theme="' + this.currentTheme + '"]').addClass('active');
            } catch (error) {
                console.error('❌ Grid4Themes: Error updating switcher UI:', error);
            }
        },

        // Setup event listeners
        setupEventListeners: function() {
            var self = this;
            
            try {
                // Theme button clicks (delegated for dynamic content)
                $(document).on('click', '.g4-theme-button', function(e) {
                    e.preventDefault();
                    
                    var theme = $(this).data('theme');
                    if (theme) {
                        // Add click animation
                        $(this).css('transform', 'scale(0.95)');
                        setTimeout(function() {
                            $(this).css('transform', 'scale(1)');
                        }.bind(this), 150);
                        
                        self.setTheme(theme);
                    }
                });
                
                // Keyboard shortcuts
                $(document).on('keydown', function(e) {
                    // Ctrl+Shift+T for theme switcher
                    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                        e.preventDefault();
                        self.showThemeMenu();
                    }
                    
                    // Quick theme toggles
                    if (e.ctrlKey && e.shiftKey && e.key === '1') {
                        e.preventDefault();
                        self.setTheme('light');
                    }
                    if (e.ctrlKey && e.shiftKey && e.key === '2') {
                        e.preventDefault();
                        self.setTheme('dark');
                    }
                    if (e.ctrlKey && e.shiftKey && e.key === '3') {
                        e.preventDefault();
                        self.setTheme('high-contrast');
                    }
                });
                
                console.log('🎨 Grid4Themes: Event listeners setup complete');
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error setting up event listeners:', error);
            }
        },

        // Monitor OS theme changes
        setupSystemThemeMonitoring: function() {
            var self = this;
            
            try {
                if (window.matchMedia) {
                    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    
                    // Modern browsers
                    if (mediaQuery.addEventListener) {
                        mediaQuery.addEventListener('change', function() {
                            if (self.currentTheme === 'system') {
                                self.setTheme('system', false);
                                self.showThemeNotification('🔄 Theme updated to match system', 'info');
                            }
                        });
                    }
                    // Legacy browsers (like our jQuery 1.8.3 environment)
                    else if (mediaQuery.addListener) {
                        mediaQuery.addListener(function() {
                            if (self.currentTheme === 'system') {
                                self.setTheme('system', false);
                                self.showThemeNotification('🔄 Theme updated to match system', 'info');
                            }
                        });
                    }
                }
                
                console.log('🎨 Grid4Themes: System theme monitoring active');
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error setting up system theme monitoring:', error);
            }
        },

        // Show theme selection menu
        showThemeMenu: function() {
            try {
                // Create modal overlay
                var overlay = $('<div class="g4-theme-menu-overlay"></div>').css({
                    'position': 'fixed',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': '100%',
                    'background': 'rgba(0, 0, 0, 0.5)',
                    'z-index': '1000000',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'opacity': '0',
                    'transition': 'opacity 200ms ease-out'
                });
                
                // Create menu
                var menu = $('<div class="g4-theme-menu"></div>').css({
                    'background': 'var(--g4-bg-elevated)',
                    'border': '1px solid var(--g4-border-default)',
                    'border-radius': 'var(--g4-radius-lg)',
                    'padding': 'var(--g4-space-lg)',
                    'box-shadow': 'var(--g4-shadow-lg)',
                    'transform': 'scale(0.9)',
                    'transition': 'transform 200ms ease-out'
                });
                
                var title = $('<h3>Choose Theme</h3>').css({
                    'color': 'var(--g4-text-primary)',
                    'margin': '0 0 var(--g4-space-md) 0',
                    'font-size': 'var(--g4-font-size-lg)'
                });
                
                menu.append(title);
                
                // Add theme options
                for (var i = 0; i < this.themes.length; i++) {
                    var theme = this.themes[i];
                    var config = this.themeConfig[theme];
                    var isActive = theme === this.currentTheme;
                    
                    var option = $('<button class="g4-theme-menu-option" data-theme="' + theme + '"></button>').css({
                        'display': 'block',
                        'width': '100%',
                        'padding': 'var(--g4-space-md)',
                        'margin': '0 0 var(--g4-space-sm) 0',
                        'background': isActive ? 'var(--g4-interactive-bg)' : 'var(--g4-bg-elevated)',
                        'color': isActive ? 'var(--g4-interactive-text)' : 'var(--g4-text-primary)',
                        'border': '1px solid var(--g4-border-default)',
                        'border-radius': 'var(--g4-radius-md)',
                        'cursor': 'pointer',
                        'text-align': 'left',
                        'transition': 'all var(--g4-transition-fast)'
                    }).html(
                        '<span style="font-size: 20px; margin-right: 12px;">' + config.icon + '</span>' +
                        '<strong>' + config.name + '</strong><br>' +
                        '<small style="opacity: 0.8;">' + config.description + '</small>'
                    );
                    
                    menu.append(option);
                }
                
                overlay.append(menu);
                $('body').append(overlay);
                
                // Animate in
                setTimeout(function() {
                    overlay.css('opacity', '1');
                    menu.css('transform', 'scale(1)');
                }, 10);
                
                // Handle clicks
                var self = this;
                overlay.on('click', function(e) {
                    if (e.target === overlay[0]) {
                        self.hideThemeMenu();
                    }
                });
                
                $('.g4-theme-menu-option').on('click', function() {
                    var theme = $(this).data('theme');
                    self.setTheme(theme);
                    self.hideThemeMenu();
                });
                
                // Escape key
                $(document).on('keydown.theme-menu', function(e) {
                    if (e.key === 'Escape') {
                        self.hideThemeMenu();
                    }
                });
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error showing theme menu:', error);
            }
        },

        // Hide theme menu
        hideThemeMenu: function() {
            var overlay = $('.g4-theme-menu-overlay');
            var menu = $('.g4-theme-menu');
            
            overlay.css('opacity', '0');
            menu.css('transform', 'scale(0.9)');
            
            setTimeout(function() {
                overlay.remove();
                $(document).off('keydown.theme-menu');
            }, 200);
        },

        // Dispatch theme change event
        dispatchThemeEvent: function(theme, resolvedTheme) {
            try {
                // jQuery custom event
                $(document).trigger('g4:theme-changed', {
                    theme: theme,
                    resolvedTheme: resolvedTheme,
                    timestamp: Date.now()
                });
                
                // Native custom event
                if (window.CustomEvent) {
                    var event = new CustomEvent('g4-theme-changed', {
                        detail: {
                            theme: theme,
                            resolvedTheme: resolvedTheme,
                            timestamp: Date.now()
                        }
                    });
                    document.dispatchEvent(event);
                }
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error dispatching theme event:', error);
            }
        },

        // Show elegant notification
        showThemeNotification: function(message, type) {
            if (!message) return;
            
            try {
                type = type || 'info';
                
                var notification = $('<div class="g4-theme-notification"></div>').css({
                    'position': 'fixed',
                    'bottom': '20px',
                    'left': '50%',
                    'transform': 'translateX(-50%) translateY(100px)',
                    'background': 'var(--g4-bg-elevated)',
                    'color': 'var(--g4-text-primary)',
                    'border': '1px solid var(--g4-border-default)',
                    'border-radius': 'var(--g4-radius-full)',
                    'padding': 'var(--g4-space-sm) var(--g4-space-lg)',
                    'box-shadow': 'var(--g4-shadow-lg)',
                    'z-index': '1000001',
                    'font-size': 'var(--g4-font-size-sm)',
                    'white-space': 'nowrap',
                    'opacity': '0',
                    'transition': 'all var(--g4-transition-base)'
                });
                
                notification.text(message);
                $('body').append(notification);
                
                // Animate in
                setTimeout(function() {
                    notification.css({
                        'opacity': '1',
                        'transform': 'translateX(-50%) translateY(0)'
                    });
                }, 10);
                
                // Auto remove
                setTimeout(function() {
                    notification.css({
                        'opacity': '0',
                        'transform': 'translateX(-50%) translateY(-20px)'
                    });
                    
                    setTimeout(function() {
                        notification.remove();
                    }, 250);
                }, 2000);
                
            } catch (error) {
                console.error('❌ Grid4Themes: Error showing notification:', error);
            }
        },

        // Get current theme info
        getCurrentTheme: function() {
            return {
                theme: this.currentTheme,
                resolvedTheme: this.currentTheme === 'system' ? this.detectSystemTheme() : this.currentTheme,
                config: this.themeConfig[this.currentTheme]
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        // Small delay to ensure our CSS loads first
        setTimeout(function() {
            window.Grid4Themes.init();
        }, 100);
    });

    // Expose on global g4c namespace
    if (window.g4c) {
        window.g4c.themes = window.Grid4Themes;
    }

    console.log('📦 Grid4 Theme Switcher v2.0 loaded - Dopamine-driven theme experience ready!');

})(window, document, jQuery);