/* Grid4 Consistency Engine v2.0 - Class-Based CSS Architecture
 * MASSIVE PERFORMANCE IMPROVEMENT: Converts from inline styles to CSS utility classes
 * Based on Zen AI comprehensive architectural review recommendations
 * Eliminates reflow/repaint bottlenecks while maintaining universal polish
 */

(function(window, document, $) {
    'use strict';

    const ConsistencyEngineV2 = {
        _initialized: false,
        _pageObserver: null,
        _appliedEnhancements: new Set(),
        _cssInjected: false,

        // Design System - Core principles for consistency (unchanged)
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

        // Class-based enhancement definitions (PERFORMANCE OPTIMIZED)
        ENHANCEMENT_DEFINITIONS: {
            buttons: {
                selector: 'button, input[type="submit"], input[type="button"], .btn, a.button',
                className: 'g4-button',
                hoverClassName: 'g4-button-hover'
            },
            
            inputs: {
                selector: 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input[type="number"], textarea, select',
                className: 'g4-input',
                focusClassName: 'g4-input-focus'
            },
            
            tables: {
                selector: 'table',
                className: 'g4-table',
                childSelectors: {
                    'th': 'g4-table-header',
                    'td': 'g4-table-cell',
                    'tr': 'g4-table-row'
                }
            },
            
            cards: {
                selector: '.panel, .card, .widget, .box, .content-box',
                className: 'g4-card'
            },
            
            links: {
                selector: 'a:not(.btn):not(.button):not(.nav-link)',
                className: 'g4-link'
            }
        },

        init: function() {
            if (this._initialized) return;
            
            console.log('✨ ConsistencyEngineV2: Initializing class-based CSS architecture...');
            
            // Inject CSS immediately for best performance
            this.injectOptimizedCSS();
            
            // Apply class-based enhancements
            this.applyAllEnhancements();
            
            // Setup efficient page monitoring
            this.setupOptimizedPageMonitoring();
            
            this._initialized = true;
            console.log('🚀 ConsistencyEngineV2: Class-based architecture ready - MASSIVE performance improvement!');
        },

        injectOptimizedCSS: function() {
            if (this._cssInjected) return;
            
            const style = document.createElement('style');
            style.id = 'g4-consistency-engine-v2';
            style.textContent = this.generateOptimizedCSS();
            document.head.appendChild(style);
            
            this._cssInjected = true;
            console.log('🎨 ConsistencyEngineV2: Optimized CSS injected (class-based approach)');
        },

        generateOptimizedCSS: function() {
            const ds = this.DESIGN_SYSTEM;
            
            return `
                /* Grid4 Consistency Engine v2.0 - Class-Based CSS Architecture */
                :root {
                    /* Design System Variables */
                    --g4-primary: ${ds.colors.primary};
                    --g4-primary-hover: ${ds.colors.primaryHover};
                    --g4-brand-primary: ${ds.colors.brandPrimary};
                    --g4-brand-secondary: ${ds.colors.brandSecondary};
                    --g4-brand-accent: ${ds.colors.brandAccent};
                    --g4-font-family: ${ds.typography.fontFamily};
                    --g4-transition-base: ${ds.transitions.base};
                    --g4-shadow-md: ${ds.shadows.md};
                    --g4-radius-md: ${ds.borderRadius.md};
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
                
                /* ===== ENHANCED BUTTON STYLES ===== */
                .g4-button {
                    font-family: inherit !important;
                    font-weight: 500 !important;
                    border-radius: var(--g4-radius-md) !important;
                    padding: 0.5rem 1rem !important;
                    transition: all var(--g4-transition-base) !important;
                    border: none !important;
                    cursor: pointer !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-decoration: none !important;
                    font-size: 0.875rem !important;
                    position: relative !important;
                    overflow: hidden !important;
                }
                
                .g4-button:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: var(--g4-shadow-md) !important;
                }
                
                .g4-button:active {
                    transform: translateY(0) !important;
                }
                
                /* CSS-Only Ripple Effect */
                .g4-button::after {
                    content: '' !important;
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    width: 5px !important;
                    height: 5px !important;
                    background: rgba(255, 255, 255, 0.5) !important;
                    opacity: 0 !important;
                    border-radius: 100% !important;
                    transform: scale(1, 1) translate(-50%) !important;
                    transform-origin: 50% 50% !important;
                }
                
                .g4-button:focus:not(:active)::after {
                    animation: g4-button-ripple 0.6s ease-out !important;
                }
                
                @keyframes g4-button-ripple {
                    to {
                        transform: scale(40, 40) translate(-50%) !important;
                        opacity: 0 !important;
                    }
                }
                
                /* ===== ENHANCED INPUT STYLES ===== */
                .g4-input {
                    font-family: inherit !important;
                    font-size: 0.875rem !important;
                    padding: 0.5rem 0.75rem !important;
                    border: 1px solid ${ds.colors.gray300} !important;
                    border-radius: var(--g4-radius-md) !important;
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    color: #f8f9fa !important;
                    transition: all var(--g4-transition-base) !important;
                }
                
                .g4-input:focus {
                    outline: none !important;
                    border-color: var(--g4-brand-primary) !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                }
                
                /* ===== ENHANCED TABLE STYLES ===== */
                .g4-table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    border-radius: 0.5rem !important;
                    overflow: hidden !important;
                    box-shadow: var(--g4-shadow-md) !important;
                }
                
                .g4-table-header {
                    background-color: ${ds.colors.gray700} !important;
                    color: ${ds.colors.gray50} !important;
                    font-weight: 600 !important;
                    padding: 0.75rem 1rem !important;
                    text-align: left !important;
                    font-size: 0.875rem !important;
                    letter-spacing: 0.025em !important;
                }
                
                .g4-table-cell {
                    padding: 0.75rem 1rem !important;
                    border-bottom: 1px solid ${ds.colors.gray200} !important;
                    font-size: 0.875rem !important;
                }
                
                .g4-table-row:hover {
                    background-color: rgba(102, 126, 234, 0.05) !important;
                }
                
                /* ===== ENHANCED CARD STYLES ===== */
                .g4-card {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 0.5rem !important;
                    padding: 1.5rem !important;
                    box-shadow: var(--g4-shadow-md) !important;
                    backdrop-filter: blur(10px) !important;
                    transition: all var(--g4-transition-base) !important;
                }
                
                .g4-card:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* ===== ENHANCED LINK STYLES ===== */
                .g4-link {
                    color: var(--g4-brand-primary) !important;
                    text-decoration: none !important;
                    transition: color var(--g4-transition-base) !important;
                }
                
                .g4-link:hover {
                    color: var(--g4-brand-secondary) !important;
                    text-decoration: underline !important;
                }
                
                /* ===== UNIVERSAL ERROR/SUCCESS STATES ===== */
                .g4-enhanced.error,
                .g4-enhanced.invalid,
                .g4-enhanced.has-error {
                    border-color: ${ds.colors.danger} !important;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
                }
                
                .g4-enhanced.success,
                .g4-enhanced.valid,
                .g4-enhanced.has-success {
                    border-color: ${ds.colors.success} !important;
                    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
                }
                
                /* ===== UNIVERSAL DISABLED STATES ===== */
                .g4-enhanced[disabled],
                .g4-enhanced.disabled {
                    opacity: 0.6 !important;
                    cursor: not-allowed !important;
                    pointer-events: none !important;
                }
                
                /* ===== LOADING ANIMATIONS ===== */
                .g4-loading {
                    position: relative !important;
                    overflow: hidden !important;
                }
                
                .g4-loading::after {
                    content: '' !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: -100% !important;
                    width: 100% !important;
                    height: 100% !important;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
                    animation: g4-shimmer 1.5s infinite !important;
                }
                
                @keyframes g4-shimmer {
                    to {
                        left: 100% !important;
                    }
                }
                
                /* ===== PERFORMANCE OPTIMIZATIONS ===== */
                .g4-enhanced {
                    /* Enables hardware acceleration */
                    transform: translateZ(0) !important;
                    /* Optimizes repaints */
                    will-change: transform !important;
                }
            `;
        },

        applyAllEnhancements: function() {
            console.log('🔧 ConsistencyEngineV2: Applying class-based enhancements...');
            
            Object.entries(this.ENHANCEMENT_DEFINITIONS).forEach(([name, config]) => {
                this.applyClassBasedEnhancement(name, config);
            });
        },

        applyClassBasedEnhancement: function(name, config) {
            const elements = document.querySelectorAll(config.selector);
            if (elements.length === 0) return;
            
            console.log(`🎯 ConsistencyEngineV2: Enhancing ${elements.length} ${name} elements with classes`);
            
            elements.forEach(el => {
                // Skip if already enhanced
                if (el.classList.contains('g4-enhanced')) return;
                
                // Apply base enhancement class
                el.classList.add('g4-enhanced', config.className);
                
                // Apply child classes if defined
                if (config.childSelectors) {
                    Object.entries(config.childSelectors).forEach(([childSelector, childClass]) => {
                        const childElements = el.querySelectorAll(childSelector);
                        childElements.forEach(child => {
                            child.classList.add(childClass);
                        });
                    });
                }
            });
            
            this._appliedEnhancements.add(name);
        },

        setupOptimizedPageMonitoring: function() {
            // OPTIMIZED: Only observe new nodes, not entire document re-processing
            if (window.MutationObserver) {
                this._pageObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // SURGICAL: Only enhance the new node and its children
                                    this.applyEnhancementsToNode(node);
                                }
                            });
                        }
                    });
                });
                
                this._pageObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                console.log('👁️ ConsistencyEngineV2: Optimized MutationObserver active (surgical enhancement)');
            }
        },

        applyEnhancementsToNode: function(node) {
            // PERFORMANCE: Only check new nodes, not entire document
            Object.entries(this.ENHANCEMENT_DEFINITIONS).forEach(([name, config]) => {
                // Check if the node itself matches
                if (node.matches && node.matches(config.selector) && !node.classList.contains('g4-enhanced')) {
                    node.classList.add('g4-enhanced', config.className);
                }
                
                // Check for matching children in the new node
                const childElements = node.querySelectorAll ? node.querySelectorAll(config.selector) : [];
                childElements.forEach(el => {
                    if (!el.classList.contains('g4-enhanced')) {
                        el.classList.add('g4-enhanced', config.className);
                        
                        // Apply child classes if defined
                        if (config.childSelectors) {
                            Object.entries(config.childSelectors).forEach(([childSelector, childClass]) => {
                                const children = el.querySelectorAll(childSelector);
                                children.forEach(child => {
                                    child.classList.add(childClass);
                                });
                            });
                        }
                    }
                });
            });
        },

        // Public API
        refresh: function() {
            console.log('🔄 ConsistencyEngineV2: Refreshing class-based enhancements...');
            this.applyAllEnhancements();
        },

        getStats: function() {
            return {
                initialized: this._initialized,
                cssInjected: this._cssInjected,
                appliedEnhancements: Array.from(this._appliedEnhancements),
                enhancedElements: document.querySelectorAll('.g4-enhanced').length,
                version: '2.0 (Class-Based CSS Architecture)'
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        ConsistencyEngineV2.init();
    });

    // Expose globally
    window.ConsistencyEngineV2 = ConsistencyEngineV2;
    
    if (window.g4c) {
        window.g4c.ConsistencyEngineV2 = ConsistencyEngineV2;
    }

    console.log('📦 ConsistencyEngineV2 loaded - Class-based CSS architecture for MASSIVE performance gains!');

})(window, document, jQuery);