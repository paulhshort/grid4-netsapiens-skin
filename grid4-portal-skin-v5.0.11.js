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
                    checkExisting: 'ns-script.js',
                    onload: function() {
                        console.log('Grid4 Skin: FaxEdge script loaded, waiting for menu...');
                        // FaxEdge adds menu items dynamically, wait and then add icons
                        setTimeout(() => {
                            console.log('Grid4 Skin: Updating navigation after FaxEdge load...');
                            Grid4Portal.uiEnhancements.enhanceNavigation();
                        }, 1500);
                    }
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
                        // Call custom onload if provided
                        if (resourceConfig.onload) {
                            resourceConfig.onload();
                        }
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
            ensureFontAwesome: function() {
                if (!$('link[href*="font-awesome"]').length && !$('link[href*="fontawesome"]').length) {
                    const fontAwesomeLink = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">';
                    $('head').append(fontAwesomeLink);
                    console.log('Grid4: FontAwesome 4.7 loaded');
                }
            },
            // Font configuration
            fonts: {
                'manrope': {
                    name: 'Manrope',
                    url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap',
                    stack: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'inter': {
                    name: 'Inter',
                    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                    stack: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'roboto': {
                    name: 'Roboto',
                    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
                    stack: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'open-sans': {
                    name: 'Open Sans',
                    url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
                    stack: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'lato': {
                    name: 'Lato',
                    url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
                    stack: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'source-sans': {
                    name: 'Source Sans Pro',
                    url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap',
                    stack: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'work-sans': {
                    name: 'Work Sans',
                    url: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
                    stack: '"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'nunito-sans': {
                    name: 'Nunito Sans',
                    url: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap',
                    stack: '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                },
                'system': {
                    name: 'System Font',
                    url: null,
                    stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
                },
                'aptos': {
                    name: 'Aptos (Current)',
                    url: null,
                    stack: '"Aptos", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                }
            },
            
            currentFont: 'manrope',
            
            init: function() {
                this.ensureFontAwesome();
                this.createToggleButton();
                this.applyTheme();
                this.bindEvents();
                this.initDevTools();
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
            },
            
            initDevTools: function() {
                const self = this;
                
                // Load default font (Manrope)
                this.loadFont('manrope');
                
                // Create comprehensive dev tools UI
                const devToolsHTML = `
                    <div id="grid4-dev-tools" style="
                        position: relative; 
                        margin: 10px; 
                        background: #0099ff;
                        border-radius: 8px; 
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                        <div id="grid4-dev-tools-header" style="
                            display: flex; 
                            align-items: center; 
                            justify-content: space-between; 
                            cursor: pointer; 
                            padding: 12px;
                            color: white;
                            font-weight: 600;">
                            <span style="font-size: 0.875rem;">
                                <i class="fa fa-cogs" style="margin-right: 6px;"></i>DEV TOOLS
                            </span>
                            <i class="fa fa-chevron-down" id="grid4-dev-tools-toggle" style="
                                transition: transform 0.3s;"></i>
                        </div>
                        <div id="grid4-dev-tools-content" style="
                            display: none; 
                            background: white;
                            border-radius: 0 0 8px 8px;
                            padding: 15px;
                            color: #333;
                            max-height: 70vh;
                            overflow-y: auto;">
                            
                            <!-- Typography Section -->
                            <div class="dev-section" style="margin-bottom: 20px;">
                                <h4 style="margin: 0 0 10px 0; font-size: 0.875rem; color: #0099ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
                                    <i class="fa fa-font" style="margin-right: 5px;"></i>Typography
                                </h4>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">Font Family</label>
                                    <select id="grid4-font-selector" style="
                                        width: 100%; 
                                        padding: 6px; 
                                        background: #f5f5f5; 
                                        color: #333; 
                                        border: 1px solid #ddd; 
                                        border-radius: 4px; 
                                        font-size: 0.875rem;">
                                        <option value="manrope">Manrope (Default)</option>
                                        <option value="inter">Inter</option>
                                        <option value="roboto">Roboto</option>
                                        <option value="open-sans">Open Sans</option>
                                        <option value="lato">Lato</option>
                                        <option value="source-sans">Source Sans Pro</option>
                                        <option value="work-sans">Work Sans</option>
                                        <option value="nunito-sans">Nunito Sans</option>
                                        <option value="system">System Font</option>
                                        <option value="aptos">Aptos (Original)</option>
                                    </select>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">
                                        Base Font Size: <span id="grid4-font-size-value" style="color: #0099ff; font-weight: 600;">16px</span>
                                    </label>
                                    <input type="range" id="grid4-font-size-slider" min="14" max="20" value="16" step="1" style="
                                        width: 100%; cursor: pointer;">
                                </div>
                            </div>
                            
                            <!-- Colors Section -->
                            <div class="dev-section" style="margin-bottom: 20px;">
                                <h4 style="margin: 0 0 10px 0; font-size: 0.875rem; color: #0099ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
                                    <i class="fa fa-paint-brush" style="margin-right: 5px;"></i>Colors
                                </h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">Primary Color</label>
                                        <input type="color" id="grid4-primary-color" value="#0099ff" style="
                                            width: 100%; 
                                            height: 32px; 
                                            border: 1px solid #ddd; 
                                            border-radius: 4px;
                                            cursor: pointer;">
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">Secondary Color</label>
                                        <input type="color" id="grid4-secondary-color" value="#0066cc" style="
                                            width: 100%; 
                                            height: 32px; 
                                            border: 1px solid #ddd; 
                                            border-radius: 4px;
                                            cursor: pointer;">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Spacing Section -->
                            <div class="dev-section" style="margin-bottom: 20px;">
                                <h4 style="margin: 0 0 10px 0; font-size: 0.875rem; color: #0099ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
                                    <i class="fa fa-arrows-alt" style="margin-right: 5px;"></i>Spacing
                                </h4>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">
                                        Content Padding: <span id="grid4-padding-value" style="color: #0099ff; font-weight: 600;">22px</span>
                                    </label>
                                    <input type="range" id="grid4-padding-slider" min="10" max="40" value="22" step="2" style="
                                        width: 100%; cursor: pointer;">
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">
                                        Sidebar Width: <span id="grid4-sidebar-value" style="color: #0099ff; font-weight: 600;">250px</span>
                                    </label>
                                    <input type="range" id="grid4-sidebar-slider" min="200" max="300" value="250" step="10" style="
                                        width: 100%; cursor: pointer;">
                                </div>
                            </div>
                            
                            <!-- Buttons Section -->
                            <div class="dev-section" style="margin-bottom: 20px;">
                                <h4 style="margin: 0 0 10px 0; font-size: 0.875rem; color: #0099ff; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
                                    <i class="fa fa-square" style="margin-right: 5px;"></i>Buttons
                                </h4>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">
                                        Border Radius: <span id="grid4-radius-value" style="color: #0099ff; font-weight: 600;">6px</span>
                                    </label>
                                    <input type="range" id="grid4-radius-slider" min="0" max="20" value="6" step="1" style="
                                        width: 100%; cursor: pointer;">
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 5px;">Button Style</label>
                                    <select id="grid4-button-style" style="
                                        width: 100%; 
                                        padding: 6px; 
                                        background: #f5f5f5; 
                                        color: #333; 
                                        border: 1px solid #ddd; 
                                        border-radius: 4px; 
                                        font-size: 0.875rem;">
                                        <option value="solid">Solid</option>
                                        <option value="outline">Outline</option>
                                        <option value="gradient">Gradient</option>
                                        <option value="flat">Flat</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- Actions -->
                            <div style="display: flex; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 2px solid #e0e0e0;">
                                <button id="grid4-dev-reset" style="
                                    flex: 1;
                                    padding: 8px 12px; 
                                    background: #0099ff; 
                                    color: white; 
                                    border: none; 
                                    border-radius: 4px; 
                                    font-size: 0.875rem; 
                                    cursor: pointer;
                                    font-weight: 500;">Reset All</button>
                                <button id="grid4-dev-export" style="
                                    flex: 1;
                                    padding: 8px 12px; 
                                    background: #28a745; 
                                    color: white; 
                                    border: none; 
                                    border-radius: 4px; 
                                    font-size: 0.875rem; 
                                    cursor: pointer;
                                    font-weight: 500;">Export CSS</button>
                                <button id="grid4-dev-close" style="
                                    flex: 1;
                                    padding: 8px 12px; 
                                    background: #dc3545; 
                                    color: white; 
                                    border: none; 
                                    border-radius: 4px; 
                                    font-size: 0.875rem; 
                                    cursor: pointer;
                                    font-weight: 500;">Close</button>
                            </div>
                        </div>
                    </div>`;
                
                // Insert immediately when DOM is ready
                const insertDevTools = () => {
                    const $nav = $('#navigation');
                    const $themeToggle = $('#grid4-theme-toggle');
                    
                    if ($nav.length && $themeToggle.length) {
                        // Insert dev tools before theme toggle
                        $(devToolsHTML).insertBefore($themeToggle);
                        
                        // Bind events
                        this.bindDevToolsEvents();
                        console.log('Grid4 dev tools added to navigation');
                    } else {
                        console.log('Grid4 dev tools: Navigation or theme toggle not found');
                    }
                };
                
                // Try immediately
                insertDevTools();
                
                // Also try after a short delay as fallback
                setTimeout(insertDevTools, 500);
            },
            
            bindDevToolsEvents: function() {
                const self = this;
                
                // Toggle collapse/expand
                $('#grid4-dev-tools-header').click(function() {
                    $('#grid4-dev-tools-content').slideToggle(200);
                    const $toggle = $('#grid4-dev-tools-toggle');
                    if ($toggle.hasClass('fa-chevron-down')) {
                        $toggle.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    } else {
                        $toggle.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    }
                });
                
                // Font selector change
                $('#grid4-font-selector').change(function() {
                    const selectedFont = $(this).val();
                    self.loadFont(selectedFont);
                });
                
                // Font size slider
                $('#grid4-font-size-slider').on('input', function() {
                    const size = $(this).val();
                    $('#grid4-font-size-value').text(size + 'px');
                    $('html').css('font-size', size + 'px');
                });
                
                // Color pickers
                $('#grid4-primary-color').on('input', function() {
                    const color = $(this).val();
                    $('<style id="grid4-primary-color-style">').
                        html(`:root { --accent-primary: ${color} !important; }`).remove();
                    $('head').append(`<style id="grid4-primary-color-style">:root { --accent-primary: ${color} !important; }</style>`);
                });
                
                $('#grid4-secondary-color').on('input', function() {
                    const color = $(this).val();
                    $('<style id="grid4-secondary-color-style">').
                        html(`:root { --accent-secondary: ${color} !important; }`).remove();
                    $('head').append(`<style id="grid4-secondary-color-style">:root { --accent-secondary: ${color} !important; }</style>`);
                });
                
                // Padding slider
                $('#grid4-padding-slider').on('input', function() {
                    const padding = $(this).val();
                    $('#grid4-padding-value').text(padding + 'px');
                    $('<style id="grid4-padding-style">').
                        html(`:root { --g4-content-padding: ${padding}px !important; }`).remove();
                    $('head').append(`<style id="grid4-padding-style">:root { --g4-content-padding: ${padding}px !important; }</style>`);
                });
                
                // Sidebar width slider
                $('#grid4-sidebar-slider').on('input', function() {
                    const width = $(this).val();
                    $('#grid4-sidebar-value').text(width + 'px');
                    $('<style id="grid4-sidebar-style">').
                        html(`:root { --g4-sidebar-width: ${width}px !important; }`).remove();
                    $('head').append(`<style id="grid4-sidebar-style">:root { --g4-sidebar-width: ${width}px !important; }</style>`);
                });
                
                // Border radius slider
                $('#grid4-radius-slider').on('input', function() {
                    const radius = $(this).val();
                    $('#grid4-radius-value').text(radius + 'px');
                    $('<style id="grid4-radius-style">').
                        html(`:root { --g4-radius-sm: ${radius/2}px !important; --g4-radius-md: ${radius}px !important; --g4-radius-lg: ${radius*1.5}px !important; }`).remove();
                    $('head').append(`<style id="grid4-radius-style">:root { --g4-radius-sm: ${radius/2}px !important; --g4-radius-md: ${radius}px !important; --g4-radius-lg: ${radius*1.5}px !important; }</style>`);
                });
                
                // Button style selector
                $('#grid4-button-style').change(function() {
                    const style = $(this).val();
                    let css = '';
                    switch(style) {
                        case 'outline':
                            css = `
                                #grid4-app-shell .btn-primary {
                                    background: transparent !important;
                                    color: var(--accent-primary) !important;
                                    border: 2px solid var(--accent-primary) !important;
                                }
                                #grid4-app-shell .btn-primary:hover {
                                    background: var(--accent-primary) !important;
                                    color: white !important;
                                }
                            `;
                            break;
                        case 'gradient':
                            css = `
                                #grid4-app-shell .btn-primary {
                                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)) !important;
                                    border: none !important;
                                }
                            `;
                            break;
                        case 'flat':
                            css = `
                                #grid4-app-shell .btn {
                                    box-shadow: none !important;
                                    text-transform: uppercase !important;
                                    letter-spacing: 0.5px !important;
                                    font-weight: 600 !important;
                                }
                            `;
                            break;
                    }
                    $('#grid4-button-style-css').remove();
                    if (css) {
                        $('head').append(`<style id="grid4-button-style-css">${css}</style>`);
                    }
                });
                
                // Reset button
                $('#grid4-dev-reset').click(function() {
                    // Reset all values
                    $('#grid4-font-selector').val('manrope').change();
                    $('#grid4-font-size-slider').val('16').trigger('input');
                    $('#grid4-primary-color').val('#0099ff').trigger('input');
                    $('#grid4-secondary-color').val('#0066cc').trigger('input');
                    $('#grid4-padding-slider').val('22').trigger('input');
                    $('#grid4-sidebar-slider').val('250').trigger('input');
                    $('#grid4-radius-slider').val('6').trigger('input');
                    $('#grid4-button-style').val('solid').change();
                    
                    // Remove all custom styles
                    $('[id^="grid4-"][id$="-style"]').remove();
                    $('#grid4-button-style-css').remove();
                });
                
                // Export button
                $('#grid4-dev-export').click(function() {
                    const css = [];
                    $('[id^="grid4-"][id$="-style"], [id^="grid4-"][id$="-css"]').each(function() {
                        css.push($(this).html());
                    });
                    const cssText = css.join('\n\n');
                    navigator.clipboard.writeText(cssText);
                    alert('CSS copied to clipboard!');
                });
                
                // Close button
                $('#grid4-dev-close').click(function() {
                    $('#grid4-dev-tools').fadeOut(200, function() {
                        $(this).remove();
                    });
                });
            },
            
            loadFont: function(fontKey) {
                const font = this.fonts[fontKey];
                if (!font) return;
                
                // Load Google Font if needed
                if (font.url) {
                    const fontId = 'grid4-font-' + fontKey;
                    if ($('#' + fontId).length === 0) {
                        $('<link id="' + fontId + '" rel="stylesheet" href="' + font.url + '">')
                            .appendTo('head');
                    }
                }
                
                // Apply font stack to CSS
                const fontStyle = `<style id="grid4-dynamic-font">
                    :root { --g4-font-family: ${font.stack}; }
                    #grid4-app-shell { font-family: var(--g4-font-family) !important; }
                    #grid4-app-shell * { font-family: inherit !important; }
                    body, select, button, input, textarea { font-family: var(--g4-font-family) !important; }
                </style>`;
                
                $('#grid4-dynamic-font').remove();
                $('head').append(fontStyle);
                
                this.currentFont = fontKey;
                console.log('Grid4 font changed to: ' + font.name);
            },
            
            enableRemPreview: function() {
                const remStyle = `<style id="grid4-rem-preview-style">
                    :root {
                        --g4-sidebar-width: 15.625rem;
                        --g4-header-height: 3.75rem;
                        --g4-content-padding: 1.5rem;
                        --g4-radius-sm: 0.25rem;
                        --g4-radius-md: 0.375rem;
                        --g4-radius-lg: 0.5rem;
                        --g4-font-size-xs: 0.5625rem;
                        --g4-font-size-sm: 0.6875rem;
                        --g4-font-size-base: 0.75rem;
                        --g4-font-size-md: 0.9375rem;
                        --g4-font-size-lg: 1.125rem;
                    }
                    #grid4-app-shell .btn { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
                    #grid4-app-shell .form-control { padding: 0.375rem 0.625rem; font-size: 0.875rem; }
                    #grid4-app-shell table th, #grid4-app-shell table td { padding: 0.625rem 0.9375rem; }
                </style>`;
                
                $('head').append(remStyle);
                console.log('Grid4 REM preview enabled');
            },
            
            disableRemPreview: function() {
                $('#grid4-rem-preview-style').remove();
                console.log('Grid4 REM preview disabled');
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
                    'Fax Settings': 'fa-fax',  // Added for FaxEdge
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
                    
                    if (iconMap[text] && !$link.find('.fa').length) {
                        
                        // Try multiple insertion methods
                        const $navButton = $link.find('.nav-button');
                        const $navText = $link.find('.nav-text');
                        
                        if ($navText.length) {
                            // Insert icon before nav-text span
                            $navText.before(`<i class="fa ${iconMap[text]}"></i> `);
                        } else if ($navButton.length) {
                            // Insert icon inside nav-button
                            $navButton.html(`<i class="fa ${iconMap[text]}"></i> ${$navButton.html()}`);
                        } else {
                            // Insert at beginning of link
                            $link.prepend(`<i class="fa ${iconMap[text]}"></i> `);
                        }
                    }
                });
                
                // Watch for dynamically added menu items (like Fax from FaxEdge)
                this.watchForNewMenuItems();
            },
            
            watchForNewMenuItems: function() {
                // Monitor the navigation for new items added by external scripts like FaxEdge
                const self = this; // Preserve context
                const observer = new MutationObserver((mutations) => {
                    let needsUpdate = false;
                    
                    mutations.forEach((mutation) => {
                        // Check if nodes were added
                        if (mutation.addedNodes.length) {
                            mutation.addedNodes.forEach((node) => {
                                // Check if it's a list item or contains fax
                                if (node.nodeType === 1) { // Element node
                                    const $node = $(node);
                                    const text = $node.text();
                                    if (text && text.toLowerCase().includes('fax')) {
                                        needsUpdate = true;
                                    }
                                }
                            });
                        }
                    });
                    
                    if (needsUpdate) {
                        // Small delay to ensure DOM is stable
                        setTimeout(() => {
                            self.enhanceNavigation();
                        }, 100);
                    }
                });
                
                // Start observing the navigation area
                const navArea = document.getElementById('nav-buttons');
                if (navArea) {
                    observer.observe(navArea, {
                        childList: true,
                        subtree: true
                    });
                }
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