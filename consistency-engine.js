/* Grid4 Consistency Engine - Universal Polish & Appeal System
 * Ensures sleek, modern, polished, pleasant, and universally appealing design
 * across every page, view, and interaction in the NetSapiens portal
 */

(function(window, document, $) {
    'use strict';

    const ConsistencyEngine = {
        _initialized: false,
        _pageObserver: null,
        _interactionObserver: null,
        _appliedEnhancements: new Set(),

        // Design System - Core principles for consistency
        DESIGN_SYSTEM: {
            colors: {
                primary: '#007bff',
                primaryHover: '#0056b3',
                secondary: '#6c757d',
                success: '#28a745',
                warning: '#ffc107',
                danger: '#dc3545',
                info: '#17a2b8',
                light: '#f8f9fa',
                dark: '#343a40',
                
                // Grid4 Brand Colors
                brandPrimary: '#667eea',
                brandSecondary: '#764ba2',
                brandAccent: '#00d4ff',
                
                // Neutral Grays (professionally calibrated)
                gray50: '#f9fafb',
                gray100: '#f3f4f6',
                gray200: '#e5e7eb',
                gray300: '#d1d5db',
                gray400: '#9ca3af',
                gray500: '#6b7280',
                gray600: '#4b5563',
                gray700: '#374151',
                gray800: '#1f2937',
                gray900: '#111827'
            },
            
            typography: {
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSizes: {
                    xs: '0.75rem',    // 12px
                    sm: '0.875rem',   // 14px  
                    base: '1rem',     // 16px
                    lg: '1.125rem',   // 18px
                    xl: '1.25rem',    // 20px
                    '2xl': '1.5rem',  // 24px
                    '3xl': '1.875rem', // 30px
                    '4xl': '2.25rem'   // 36px
                },
                fontWeights: {
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700
                },
                lineHeights: {
                    tight: 1.25,
                    normal: 1.5,
                    relaxed: 1.75
                }
            },
            
            spacing: {
                xs: '0.25rem',   // 4px
                sm: '0.5rem',    // 8px
                md: '1rem',      // 16px
                lg: '1.5rem',    // 24px
                xl: '2rem',      // 32px
                '2xl': '3rem',   // 48px
                '3xl': '4rem'    // 64px
            },
            
            borderRadius: {
                none: '0',
                sm: '0.125rem',  // 2px
                base: '0.25rem', // 4px
                md: '0.375rem',  // 6px
                lg: '0.5rem',    // 8px
                xl: '0.75rem',   // 12px
                full: '9999px'
            },
            
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            
            transitions: {
                fast: '150ms ease-out',
                base: '250ms ease-out',
                slow: '500ms ease-out'
            }
        },

        // Universal Enhancement Rules - Applied to every page
        UNIVERSAL_ENHANCEMENTS: {
            // All buttons get consistent styling
            buttons: {
                selector: 'button, input[type="submit"], input[type="button"], .btn, a.button',
                styles: {
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    transition: 'all 0.2s ease-out',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                },
                interactions: {
                    hover: {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    },
                    active: {
                        transform: 'translateY(0)'
                    }
                }
            },
            
            // All form inputs get modern styling
            inputs: {
                selector: 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input[type="number"], textarea, select',
                styles: {
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8f9fa',
                    transition: 'all 0.2s ease-out'
                },
                interactions: {
                    focus: {
                        outline: 'none',
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }
                }
            },
            
            // All tables get modern styling
            tables: {
                selector: 'table',
                styles: {
                    width: '100%',
                    borderCollapse: 'collapse',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                },
                childStyles: {
                    'th': {
                        backgroundColor: '#374151',
                        color: '#f9fafb',
                        fontWeight: '600',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        letterSpacing: '0.025em'
                    },
                    'td': {
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                    },
                    'tr:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.05)'
                    }
                }
            },
            
            // All cards/panels get consistent styling
            cards: {
                selector: '.panel, .card, .widget, .box, .content-box',
                styles: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                }
            },
            
            // All links get hover effects
            links: {
                selector: 'a:not(.btn):not(.button):not(.nav-link)',
                styles: {
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease-out'
                },
                interactions: {
                    hover: {
                        color: '#1d4ed8',
                        textDecoration: 'underline'
                    }
                }
            }
        },

        // Page-specific enhancements
        PAGE_SPECIFIC_ENHANCEMENTS: {
            // Dashboard/Home page
            home: {
                selector: 'body.page-home, body[class*="dashboard"]',
                enhancements: ['addWelcomeAnimation', 'enhanceDashboardCards', 'addQuickActions']
            },
            
            // User management pages
            users: {
                selector: 'body.page-users, body[class*="user"]',
                enhancements: ['enhanceUserTables', 'addUserQuickFilters', 'improveUserForms']
            },
            
            // Domain management
            domains: {
                selector: 'body.page-domains, body[class*="domain"]',
                enhancements: ['enhanceDomainCards', 'addDomainSearch', 'improveDomainNavigation']
            },
            
            // Settings pages
            settings: {
                selector: 'body.page-settings, body[class*="setting"], body[class*="config"]',
                enhancements: ['enhanceSettingsForms', 'addSettingsSearch', 'improveSettingsNavigation']
            }
        },

        init: function() {
            if (this._initialized) return;
            
            console.log('✨ ConsistencyEngine: Initializing universal polish system...');
            
            // Load design system CSS
            this.loadDesignSystemCSS();
            
            // Apply universal enhancements
            this.applyUniversalEnhancements();
            
            // Setup page monitoring
            this.setupPageMonitoring();
            
            // Setup interaction monitoring
            this.setupInteractionMonitoring();
            
            // Apply page-specific enhancements
            this.applyPageSpecificEnhancements();
            
            this._initialized = true;
            console.log('✅ ConsistencyEngine: Universal polish system ready');
        },

        loadDesignSystemCSS: function() {
            const style = document.createElement('style');
            style.id = 'g4-design-system';
            style.textContent = this.generateDesignSystemCSS();
            document.head.appendChild(style);
            
            console.log('🎨 ConsistencyEngine: Design system CSS loaded');
        },

        generateDesignSystemCSS: function() {
            const ds = this.DESIGN_SYSTEM;
            
            return `
                /* Grid4 Design System - Universal Consistency */
                :root {
                    /* Colors */
                    --g4-primary: ${ds.colors.primary};
                    --g4-primary-hover: ${ds.colors.primaryHover};
                    --g4-brand-primary: ${ds.colors.brandPrimary};
                    --g4-brand-secondary: ${ds.colors.brandSecondary};
                    --g4-brand-accent: ${ds.colors.brandAccent};
                    
                    /* Typography */
                    --g4-font-family: ${ds.typography.fontFamily};
                    --g4-font-size-base: ${ds.typography.fontSizes.base};
                    --g4-font-weight-normal: ${ds.typography.fontWeights.normal};
                    --g4-font-weight-medium: ${ds.typography.fontWeights.medium};
                    --g4-font-weight-semibold: ${ds.typography.fontWeights.semibold};
                    --g4-line-height-normal: ${ds.typography.lineHeights.normal};
                    
                    /* Spacing */
                    --g4-spacing-sm: ${ds.spacing.sm};
                    --g4-spacing-md: ${ds.spacing.md};
                    --g4-spacing-lg: ${ds.spacing.lg};
                    --g4-spacing-xl: ${ds.spacing.xl};
                    
                    /* Border Radius */
                    --g4-radius-base: ${ds.borderRadius.base};
                    --g4-radius-md: ${ds.borderRadius.md};
                    --g4-radius-lg: ${ds.borderRadius.lg};
                    
                    /* Shadows */
                    --g4-shadow-sm: ${ds.shadows.sm};
                    --g4-shadow-base: ${ds.shadows.base};
                    --g4-shadow-md: ${ds.shadows.md};
                    --g4-shadow-lg: ${ds.shadows.lg};
                    
                    /* Transitions */
                    --g4-transition-fast: ${ds.transitions.fast};
                    --g4-transition-base: ${ds.transitions.base};
                }
                
                /* Universal Font Application */
                * {
                    font-family: var(--g4-font-family) !important;
                    font-feature-settings: 'cv05', 'cv11', 'ss01' !important;
                    text-rendering: optimizeLegibility !important;
                }
                
                /* Universal Smooth Scrolling */
                html {
                    scroll-behavior: smooth !important;
                }
                
                /* Universal Focus Styles */
                *:focus {
                    outline: 2px solid var(--g4-brand-primary) !important;
                    outline-offset: 2px !important;
                }
                
                /* Universal Selection Styles */
                ::selection {
                    background: var(--g4-brand-primary) !important;
                    color: white !important;
                }
                
                /* Modern Scrollbars */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: var(--g4-brand-primary);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--g4-brand-secondary);
                }
                
                /* Universal Loading Animation */
                .g4-loading {
                    position: relative;
                    overflow: hidden;
                }
                
                .g4-loading::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    animation: g4-shimmer 1.5s infinite;
                }
                
                @keyframes g4-shimmer {
                    to {
                        left: 100%;
                    }
                }
                
                /* Universal Micro-interactions */
                .g4-interactive {
                    transition: all var(--g4-transition-base) !important;
                }
                
                .g4-interactive:hover {
                    transform: translateY(-1px) !important;
                }
                
                .g4-interactive:active {
                    transform: translateY(0) !important;
                }
                
                /* Universal Error States */
                .error, .invalid, .has-error {
                    border-color: ${ds.colors.danger} !important;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
                }
                
                /* Universal Success States */
                .success, .valid, .has-success {
                    border-color: ${ds.colors.success} !important;
                    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
                }
                
                /* Universal Disabled States */
                [disabled], .disabled {
                    opacity: 0.6 !important;
                    cursor: not-allowed !important;
                    pointer-events: none !important;
                }
            `;
        },

        applyUniversalEnhancements: function() {
            console.log('🔧 ConsistencyEngine: Applying universal enhancements...');
            
            Object.entries(this.UNIVERSAL_ENHANCEMENTS).forEach(([name, config]) => {
                this.applyEnhancement(name, config);
            });
        },

        applyEnhancement: function(name, config) {
            const elements = document.querySelectorAll(config.selector);
            if (elements.length === 0) return;
            
            console.log(`🎯 ConsistencyEngine: Enhancing ${elements.length} ${name} elements`);
            
            elements.forEach(el => {
                // Apply base styles
                if (config.styles) {
                    Object.assign(el.style, this.processStyles(config.styles));
                }
                
                // Apply child styles
                if (config.childStyles) {
                    Object.entries(config.childStyles).forEach(([childSelector, styles]) => {
                        const childElements = el.querySelectorAll(childSelector);
                        childElements.forEach(child => {
                            Object.assign(child.style, this.processStyles(styles));
                        });
                    });
                }
                
                // Setup interactions
                if (config.interactions) {
                    this.setupElementInteractions(el, config.interactions);
                }
                
                // Mark as enhanced
                el.classList.add('g4-enhanced', `g4-enhanced-${name}`);
            });
            
            this._appliedEnhancements.add(name);
        },

        processStyles: function(styles) {
            const processed = {};
            Object.entries(styles).forEach(([property, value]) => {
                // Convert camelCase to kebab-case for CSS
                const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                processed[cssProperty] = value;
            });
            return processed;
        },

        setupElementInteractions: function(element, interactions) {
            Object.entries(interactions).forEach(([event, styles]) => {
                element.addEventListener(event, () => {
                    Object.assign(element.style, this.processStyles(styles));
                });
                
                // Reset styles on opposite events
                if (event === 'hover') {
                    element.addEventListener('mouseleave', () => {
                        // Reset hover styles
                        Object.keys(styles).forEach(prop => {
                            element.style[prop] = '';
                        });
                    });
                }
            });
        },

        setupPageMonitoring: function() {
            // Monitor for new content being added to pages
            if (window.MutationObserver) {
                this._pageObserver = new MutationObserver((mutations) => {
                    let shouldReapply = false;
                    
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Check if new elements need enhancement
                                    Object.values(this.UNIVERSAL_ENHANCEMENTS).forEach(config => {
                                        if (node.matches && node.matches(config.selector)) {
                                            shouldReapply = true;
                                        }
                                        if (node.querySelectorAll && node.querySelectorAll(config.selector).length > 0) {
                                            shouldReapply = true;
                                        }
                                    });
                                }
                            });
                        }
                    });
                    
                    if (shouldReapply) {
                        // Debounce reapplication
                        clearTimeout(this._reapplyTimeout);
                        this._reapplyTimeout = setTimeout(() => {
                            console.log('🔄 ConsistencyEngine: Reapplying enhancements to new content');
                            this.applyUniversalEnhancements();
                        }, 100);
                    }
                });
                
                this._pageObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        },

        setupInteractionMonitoring: function() {
            // Add pleasant interaction feedback to all interactive elements
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (this.isInteractiveElement(target)) {
                    this.addInteractionFeedback(target);
                }
            }, true);
        },

        isInteractiveElement: function(element) {
            const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
            const interactiveClasses = ['btn', 'button', 'link', 'nav-link'];
            
            return interactiveTags.includes(element.tagName.toLowerCase()) ||
                   interactiveClasses.some(cls => element.classList.contains(cls)) ||
                   element.onclick ||
                   element.getAttribute('role') === 'button';
        },

        addInteractionFeedback: function(element) {
            // Add ripple effect for pleasant feedback
            const ripple = document.createElement('span');
            ripple.classList.add('g4-ripple');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: g4-ripple-effect 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },

        applyPageSpecificEnhancements: function() {
            Object.entries(this.PAGE_SPECIFIC_ENHANCEMENTS).forEach(([pageName, config]) => {
                if (document.querySelector(config.selector)) {
                    console.log(`📄 ConsistencyEngine: Applying ${pageName} page enhancements`);
                    config.enhancements.forEach(enhancement => {
                        if (typeof this[enhancement] === 'function') {
                            this[enhancement]();
                        }
                    });
                }
            });
        },

        // Public API
        refresh: function() {
            console.log('🔄 ConsistencyEngine: Refreshing all enhancements...');
            this.applyUniversalEnhancements();
            this.applyPageSpecificEnhancements();
        },

        getStats: function() {
            return {
                initialized: this._initialized,
                appliedEnhancements: Array.from(this._appliedEnhancements),
                enhancedElements: document.querySelectorAll('.g4-enhanced').length,
                designSystemLoaded: !!document.getElementById('g4-design-system')
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        ConsistencyEngine.init();
    });

    // Expose globally
    window.ConsistencyEngine = ConsistencyEngine;
    
    if (window.g4c) {
        window.g4c.ConsistencyEngine = ConsistencyEngine;
    }

    // Add ripple effect CSS
    const rippleCSS = document.createElement('style');
    rippleCSS.textContent = `
        @keyframes g4-ripple-effect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleCSS);

    console.log('📦 ConsistencyEngine loaded - Universal polish and appeal system ready');

})(window, document, jQuery);