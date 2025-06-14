/* Grid4 Enhancement Suite - Bundled Build
 * Generated automatically by build.sh
 * Version: v3.2.1749871692
 * Build Time: Fri Jun 13 11:28:12 PM EDT 2025
 * 
 * Includes:
 * - Portal Context Manager (adaptive multi-tenant detection)
 * - Consistency Engine v2 (class-based CSS architecture) 
 * - Logo Enhancement (Grid4 branding system)
 * - Modern UI Experiments (fonts, frameworks, tooling)
 * - Feature Flags UI (beautiful feature management)
 * - Feature Showcase (interactive demo system)
 * - Vertical Centering Fix (cross-browser compatibility)
 * - Emergency Timer Diagnostic (development only)
 * - Main Grid4 Bootstrap (core initialization)
 */

console.log('🚀 Grid4 Enhancement Suite Bundle loading...');

/* Grid4 Portal Context Manager - Adaptive Multi-Tenant Enhancement System
 * Handles portal variations, cross-browser rendering, and dynamic layout monitoring
 * Two-phase initialization: DOM detection + layout validation
 * Self-healing and performance-optimized for NetSapiens environments
 */

(function(window, document, $) {
    'use strict';

    const PortalContextManager = {
        _context: null,
        _fingerprint: null,
        _layoutFlags: {},
        _isReady: false,
        _resizeDebounceTimer: null,
        _domObserver: null,

        // Selector database built from discovery tool findings
        SELECTOR_MAP: {
            'classic_portal': {
                tenantId: '.breadcrumb-item:last-child',
                userListRow: '#content table tbody tr',
                navigationContainer: '#navigation',
                mainContent: '#content',
                currentUser: '.header-user',
                navButtons: '#nav-buttons',
                sidebar: '.sidebar'
            },
            'modern_portal': {
                tenantId: '#session-info .domain-name',
                userListRow: '.data-table .user-row',
                navigationContainer: '.sidebar',
                mainContent: '.main-content',
                currentUser: '.user-info',
                navButtons: '.nav-container',
                sidebar: '.navigation-sidebar'
            },
            'bootstrap_portal': {
                tenantId: '.container-fluid .breadcrumb .active',
                userListRow: '.table tbody tr',
                navigationContainer: '.navbar',
                mainContent: '.container-fluid .content',
                currentUser: '.navbar-text .user',
                navButtons: '.navbar-nav',
                sidebar: '.sidebar-nav'
            },
            'react_portal': {
                tenantId: '[data-react-component="TenantInfo"]',
                userListRow: '[data-react-component="UserRow"]',
                navigationContainer: '[data-react-component="Navigation"]',
                mainContent: '[data-react-component="MainContent"]',
                currentUser: '[data-react-component="UserProfile"]',
                navButtons: '[data-react-component="NavButtons"]',
                sidebar: '[data-react-component="Sidebar"]'
            }
        },

        // Layout detection signatures
        FINGERPRINT_CHECKS: {
            hasOldNavigation: '#nav-buttons.classic',
            hasReactComponents: '[data-react-component]',
            hasBootstrap4: '.container-fluid',
            hasVerticalNav: '.sidebar.vertical',
            hasFlexboxNav: '.navigation[style*="flex"]',
            hasGridLayout: '.portal-grid'
        },

        // Helper for debouncing
        _debounce: function(func, delay) {
            clearTimeout(this._resizeDebounceTimer);
            this._resizeDebounceTimer = setTimeout(func, delay);
        },

        // Phase 1: DOM Structure Detection
        detectPortalContext: function() {
            console.log('🔍 PortalContextManager: Detecting portal structure...');
            
            const fingerprintParts = [];
            for (const [key, selector] of Object.entries(this.FINGERPRINT_CHECKS)) {
                if ($(selector).length > 0) {
                    fingerprintParts.push(key);
                }
            }
            
            this._fingerprint = fingerprintParts.join('|') || 'unknown';
            
            // Try to find matching context
            let matchedContext = null;
            for (const [contextName, selectors] of Object.entries(this.SELECTOR_MAP)) {
                // Test if this context's key selectors exist
                const keyTests = [selectors.navigationContainer, selectors.mainContent];
                const foundCount = keyTests.filter(selector => $(selector).length > 0).length;
                
                if (foundCount >= keyTests.length * 0.8) { // 80% match required
                    matchedContext = contextName;
                    break;
                }
            }
            
            this._context = matchedContext ? this.SELECTOR_MAP[matchedContext] : null;
            
            if (!this._context) {
                console.warn(`❌ PortalContextManager: Unknown portal fingerprint '${this._fingerprint}'. Features will run in fallback mode.`);
                // Create a fallback context with generic selectors
                this._context = {
                    tenantId: 'title, .breadcrumb-item:last-child, .domain-name',
                    userListRow: 'table tbody tr, .user-row, .data-row',
                    navigationContainer: '#navigation, .sidebar, .navbar, nav',
                    mainContent: '#content, .main-content, .container-fluid',
                    currentUser: '.user-info, .header-user, .current-user',
                    navButtons: '#nav-buttons, .nav-container, .navbar-nav',
                    sidebar: '.sidebar, .navigation, .nav-panel'
                };
            } else {
                console.log(`✅ PortalContextManager: Detected context '${matchedContext}' with fingerprint '${this._fingerprint}'`);
            }
            
            // Log available elements for debugging
            this.logDetectedElements();
        },

        logDetectedElements: function() {
            if (!this._context) return;
            
            console.log('📊 PortalContextManager: Element detection summary:');
            for (const [key, selector] of Object.entries(this._context)) {
                const elements = $(selector);
                console.log(`  ${key}: ${elements.length} elements found (${selector})`);
            }
        },

        // Phase 2: Layout Validation
        runLayoutProbes: function() {
            if (!this._context) {
                console.warn('⚠️ PortalContextManager: Cannot run layout probes without valid context');
                return;
            }
            
            console.log('🔬 PortalContextManager: Running layout validation probes...');
            
            // Probe 1: Navigation Vertical Centering
            const navContainer = $(this.getSelector('navigationContainer')).first();
            const mainContent = $(this.getSelector('mainContent')).first();
            this._layoutFlags.isNavVerticallyCentered = this._isVerticallyCentered(navContainer, mainContent);
            
            // Probe 2: Sidebar Layout Detection
            const sidebar = $(this.getSelector('sidebar')).first();
            this._layoutFlags.hasSidebarLayout = sidebar.length > 0 && sidebar.is(':visible');
            
            // Probe 3: Responsive Breakpoint Detection
            this._layoutFlags.isMobileView = $(window).width() < 768;
            this._layoutFlags.isTabletView = $(window).width() >= 768 && $(window).width() < 1024;
            this._layoutFlags.isDesktopView = $(window).width() >= 1024;
            
            // Probe 4: Grid4 Enhancements Status
            this._layoutFlags.hasGrid4Styles = $('body').hasClass('grid4-enhanced') || 
                                               $('link[href*="grid4"]').length > 0;
            
            console.log('📊 PortalContextManager: Layout flags updated:', this._layoutFlags);
            
            // Announce layout validation completion
            $(document).trigger('portalLayoutRevalidated', [this]);
        },

        // Re-validate specific layout probe
        revalidateProbe: function(probeKey) {
            if (!this._context) return false;
            
            console.log(`🔬 Re-validating probe: ${probeKey}`);
            let result = false;
            
            switch (probeKey) {
                case 'isNavVerticallyCentered':
                    const navContainer = $(this.getSelector('navigationContainer')).first();
                    const mainContent = $(this.getSelector('mainContent')).first();
                    result = this._isVerticallyCentered(navContainer, mainContent);
                    break;
                    
                case 'hasSidebarLayout':
                    const sidebar = $(this.getSelector('sidebar')).first();
                    result = sidebar.length > 0 && sidebar.is(':visible');
                    break;
                    
                case 'hasGrid4Styles':
                    result = $('body').hasClass('grid4-enhanced') || 
                             $('link[href*="grid4"]').length > 0;
                    break;
                    
                default:
                    console.warn(`⚠️ Unknown probe key: ${probeKey}`);
                    return false;
            }
            
            this._layoutFlags[probeKey] = result;
            console.log(`📊 Probe '${probeKey}' result: ${result}`);
            return result;
        },

        // Dynamic monitoring setup
        startMonitoring: function() {
            console.log('👁️ PortalContextManager: Starting dynamic monitoring...');
            
            // 1. Monitor window resize (debounced for performance)
            $(window).on('resize.portalManager', () => {
                this._debounce(() => {
                    console.log('📐 Window resized, re-validating layout...');
                    this.runLayoutProbes();
                }, 250);
            });
            
            // 2. Monitor DOM changes in main content (targeted observation)
            const mainContentSelector = this.getSelector('mainContent');
            if (mainContentSelector && window.MutationObserver) {
                const targetNode = $(mainContentSelector).first()[0];
                if (targetNode) {
                    this._domObserver = new MutationObserver((mutationsList) => {
                        // Only care about significant DOM changes
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList' && 
                                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                                console.log('🔄 DOM change detected in main content, re-validating...');
                                this._debounce(() => this.runLayoutProbes(), 100);
                                return;
                            }
                        }
                    });
                    
                    this._domObserver.observe(targetNode, { 
                        childList: true, 
                        subtree: false 
                    });
                    
                    console.log('✅ DOM observer attached to main content');
                }
            }
        },

        // Helper: Check if elements are vertically centered
        _isVerticallyCentered: function(parentElement, childElement, tolerance = 3) {
            if (!parentElement || !parentElement.length || 
                !childElement || !childElement.length) {
                return false;
            }
            
            try {
                const parentRect = parentElement[0].getBoundingClientRect();
                const childRect = childElement[0].getBoundingClientRect();
                
                const parentMidpoint = parentRect.top + (parentRect.height / 2);
                const childMidpoint = childRect.top + (childRect.height / 2);
                
                const difference = Math.abs(parentMidpoint - childMidpoint);
                const isCentered = difference <= tolerance;
                
                console.log(`🔍 Vertical centering check: ${difference}px difference (tolerance: ${tolerance}px) = ${isCentered ? 'CENTERED' : 'NOT CENTERED'}`);
                
                return isCentered;
            } catch (error) {
                console.warn('⚠️ Error checking vertical centering:', error);
                return false;
            }
        },

        // Public API: Get selector for current context
        getSelector: function(key) {
            if (!this._context) {
                console.warn(`⚠️ PortalContextManager: Cannot get selector '${key}' - no valid context`);
                return null;
            }
            
            const selector = this._context[key];
            if (!selector) {
                console.warn(`⚠️ PortalContextManager: Selector '${key}' not defined for current context`);
                return null;
            }
            
            return selector;
        },

        // Public API: Get layout flag
        getLayoutFlag: function(key) {
            return this._layoutFlags[key];
        },

        // Public API: Get current context info
        getContextInfo: function() {
            return {
                fingerprint: this._fingerprint,
                context: this._context ? Object.keys(this._context) : null,
                layoutFlags: this._layoutFlags,
                isReady: this._isReady
            };
        },

        // Main initialization
        init: function() {
            console.log('🚀 PortalContextManager: Initializing adaptive enhancement system...');
            
            // Phase 1: DOM Structure Detection (on document ready)
            this.detectPortalContext();
            
            // Phase 2: Layout Validation (on window load)
            $(window).on('load.portalManager', () => {
                console.log('🔍 PortalContextManager: Phase 2 - Layout validation and monitoring setup');
                
                // Run initial layout probes
                this.runLayoutProbes();
                
                // Start dynamic monitoring
                this.startMonitoring();
                
                // Mark as ready and announce
                this._isReady = true;
                $(document).trigger('portalManagerReady', [this]);
                
                console.log('✅ PortalContextManager: Fully initialized and monitoring for changes');
                console.log('📊 Context Info:', this.getContextInfo());
            });
        },

        // Cleanup method
        destroy: function() {
            console.log('🧹 PortalContextManager: Cleaning up...');
            
            // Remove event listeners
            $(window).off('.portalManager');
            
            // Disconnect DOM observer
            if (this._domObserver) {
                this._domObserver.disconnect();
                this._domObserver = null;
            }
            
            // Clear timers
            if (this._resizeDebounceTimer) {
                clearTimeout(this._resizeDebounceTimer);
                this._resizeDebounceTimer = null;
            }
            
            // Reset state
            this._isReady = false;
            this._context = null;
            this._fingerprint = null;
            this._layoutFlags = {};
        }
    };

    // Auto-initialize when jQuery is ready
    $(document).ready(function() {
        PortalContextManager.init();
    });

    // Expose globally for other modules
    window.PortalContextManager = PortalContextManager;

    // Also expose on Grid4 namespace if available
    if (window.g4c) {
        window.g4c.PortalContextManager = PortalContextManager;
    }

    console.log('📦 PortalContextManager module loaded');

})(window, document, jQuery);/* Grid4 Consistency Engine v2.0 - Class-Based CSS Architecture
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

})(window, document, jQuery);/* Grid4 Logo Enhancement - Dynamic Logo Replacement System
 * Replaces NetSapiens logo with Grid4 branding across all portal variations
 * Supports multiple logo variants and responsive sizing
 */

(function(window, document, $) {
    'use strict';

    const LogoEnhancement = {
        _applied: false,
        _currentLogo: null,

        // Logo variants for different contexts
        LOGO_VARIANTS: {
            'grid4-white': {
                name: 'Grid4 White Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo_white-2.png',
                description: 'Standard Grid4 white logo for dark backgrounds',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-dark': {
                name: 'Grid4 Dark Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo_dark.png',
                description: 'Grid4 dark logo for light backgrounds',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-colored': {
                name: 'Grid4 Colored Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo.png',
                description: 'Full color Grid4 logo',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iIzAwN2JmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-svg-modern': {
                name: 'Grid4 Modern SVG',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2N2VlYTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJ1cmwoI2dyYWQpIiByeD0iMyIvPjxyZWN0IHg9IjI1IiB5PSI1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9InVybCgjZ3JhZCkiIHJ4PSIzIi8+PHJlY3QgeD0iNSIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0idXJsKCNncmFkKSIgcng9IjMiLz48cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0idXJsKCNncmFkKSIgcng9IjMiLz48dGV4dCB4PSI1MCIgeT0iMjgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjYwMCI+R3JpZDQ8L3RleHQ+PC9zdmc+',
                description: 'Modern SVG logo with gradient and grid pattern',
                fallback: null // Already SVG
            }
        },

        // Comprehensive selectors for different portal layouts
        LOGO_SELECTORS: [
            // NetSapiens standard selectors
            '.header-logo img',
            '.logo img',
            '#logo img',
            '.brand img',
            '.navbar-brand img',
            
            // Generic logo selectors
            'img[src*="logo"]',
            'img[alt*="logo"]',
            'img[alt*="Logo"]',
            'img[src*="netsapiens"]',
            'img[alt*="NetSapiens"]',
            
            // Header area images
            '.header img',
            '.top-bar img',
            '.nav-header img',
            
            // Portal-specific
            '.portal-header img',
            '.portal-logo img',
            '.site-logo img',
            
            // CSS background images (handled separately)
            '.header-logo',
            '.logo',
            '#logo',
            '.brand',
            '.navbar-brand'
        ],

        init: function() {
            console.log('🎨 LogoEnhancement: Initializing logo replacement system...');
            
            // Wait for Portal Context Manager if available
            if (window.PortalContextManager) {
                $(document).on('portalManagerReady', () => {
                    this.applyLogoReplacement();
                });
                
                if (window.PortalContextManager._isReady) {
                    this.applyLogoReplacement();
                }
            } else {
                // Fallback to immediate application
                this.applyLogoReplacement();
            }
            
            // Setup monitoring for dynamic content
            this.setupDynamicMonitoring();
        },

        applyLogoReplacement: function(variant = 'grid4-white') {
            if (this._applied && this._currentLogo === variant) return;
            
            console.log(`🎨 LogoEnhancement: Applying ${variant} logo replacement...`);
            
            const logo = this.LOGO_VARIANTS[variant];
            if (!logo) {
                console.warn(`Logo variant '${variant}' not found`);
                return;
            }
            
            let replacedCount = 0;
            
            // Replace IMG elements
            this.LOGO_SELECTORS.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.tagName === 'IMG') {
                        this.replaceImageLogo(el, logo);
                        replacedCount++;
                    } else {
                        // Handle background images
                        this.replaceBackgroundLogo(el, logo);
                        replacedCount++;
                    }
                });
            });
            
            // Apply additional CSS fixes
            this.applyCSSFixes(logo);
            
            this._applied = true;
            this._currentLogo = variant;
            
            console.log(`✅ LogoEnhancement: Replaced ${replacedCount} logo instances with ${logo.name}`);
            this.showNotification(`Logo updated to ${logo.name}`, 'success');
        },

        replaceImageLogo: function(imgElement, logo) {
            // Store original for potential restoration
            if (!imgElement.hasAttribute('data-original-src')) {
                imgElement.setAttribute('data-original-src', imgElement.src);
                imgElement.setAttribute('data-original-alt', imgElement.alt || '');
            }
            
            // Create new image with error handling
            const newImg = new Image();
            newImg.onload = () => {
                imgElement.src = logo.url;
                imgElement.alt = logo.name;
                imgElement.style.maxHeight = '40px';
                imgElement.style.height = 'auto';
                imgElement.style.width = 'auto';
                imgElement.style.maxWidth = '200px';
                imgElement.classList.add('g4-logo-replaced');
                
                console.log(`🔄 LogoEnhancement: Replaced logo for ${imgElement.tagName}`);
            };
            
            newImg.onerror = () => {
                console.warn('Logo failed to load, using fallback');
                if (logo.fallback) {
                    imgElement.src = logo.fallback;
                    imgElement.alt = logo.name + ' (fallback)';
                }
            };
            
            // Start loading
            newImg.src = logo.url;
        },

        replaceBackgroundLogo: function(element, logo) {
            // Store original background
            if (!element.hasAttribute('data-original-bg')) {
                const computedStyle = window.getComputedStyle(element);
                element.setAttribute('data-original-bg', computedStyle.backgroundImage);
            }
            
            // Apply new background
            element.style.backgroundImage = `url("${logo.url}")`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.minHeight = '40px';
            element.classList.add('g4-logo-bg-replaced');
            
            console.log(`🎨 LogoEnhancement: Replaced background logo for ${element.tagName}`);
        },

        applyCSSFixes: function(logo) {
            // Remove existing logo fix styles
            const existingStyle = document.getElementById('g4-logo-enhancement');
            if (existingStyle) existingStyle.remove();
            
            const style = document.createElement('style');
            style.id = 'g4-logo-enhancement';
            style.textContent = `
                /* Grid4 Logo Enhancement CSS Fixes */
                .g4-logo-replaced,
                .g4-logo-bg-replaced {
                    filter: brightness(1) contrast(1) !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
                
                /* Hide any potential duplicate logos */
                .header-logo img:not(.g4-logo-replaced),
                .logo img:not(.g4-logo-replaced),
                #logo img:not(.g4-logo-replaced) {
                    display: none !important;
                }
                
                /* Responsive logo sizing */
                .g4-logo-replaced {
                    max-height: 40px !important;
                    height: auto !important;
                    width: auto !important;
                    max-width: 200px !important;
                    object-fit: contain !important;
                }
                
                @media (max-width: 768px) {
                    .g4-logo-replaced {
                        max-height: 32px !important;
                        max-width: 150px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .g4-logo-replaced {
                        max-height: 28px !important;
                        max-width: 120px !important;
                    }
                }
                
                /* Logo container fixes */
                .header-logo,
                .logo,
                #logo,
                .brand,
                .navbar-brand {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* Animation for logo replacement */
                .g4-logo-replaced {
                    animation: g4LogoFadeIn 0.5s ease-out;
                }
                
                @keyframes g4LogoFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            
            document.head.appendChild(style);
        },

        setupDynamicMonitoring: function() {
            // Monitor for new logo elements being added
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Check if the added element contains logos
                                    const logoElements = node.querySelectorAll ? 
                                        node.querySelectorAll(this.LOGO_SELECTORS.join(', ')) : [];
                                    
                                    if (logoElements.length > 0) {
                                        console.log('🔄 LogoEnhancement: New logo elements detected, reapplying...');
                                        setTimeout(() => this.applyLogoReplacement(this._currentLogo), 100);
                                    }
                                }
                            });
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            
            // Also monitor page navigation changes
            $(document).on('ajaxComplete', () => {
                setTimeout(() => {
                    if (this._applied) {
                        this.applyLogoReplacement(this._currentLogo);
                    }
                }, 200);
            });
        },

        // Public API methods
        switchLogo: function(variant) {
            if (!this.LOGO_VARIANTS[variant]) {
                console.warn(`Logo variant '${variant}' not available`);
                return false;
            }
            
            this._applied = false; // Force reapplication
            this.applyLogoReplacement(variant);
            return true;
        },

        restoreOriginalLogos: function() {
            // Restore IMG elements
            document.querySelectorAll('.g4-logo-replaced').forEach(img => {
                const originalSrc = img.getAttribute('data-original-src');
                const originalAlt = img.getAttribute('data-original-alt');
                
                if (originalSrc) {
                    img.src = originalSrc;
                    img.alt = originalAlt;
                    img.removeAttribute('data-original-src');
                    img.removeAttribute('data-original-alt');
                    img.classList.remove('g4-logo-replaced');
                }
            });
            
            // Restore background images
            document.querySelectorAll('.g4-logo-bg-replaced').forEach(el => {
                const originalBg = el.getAttribute('data-original-bg');
                if (originalBg) {
                    el.style.backgroundImage = originalBg;
                    el.removeAttribute('data-original-bg');
                    el.classList.remove('g4-logo-bg-replaced');
                }
            });
            
            // Remove CSS fixes
            const style = document.getElementById('g4-logo-enhancement');
            if (style) style.remove();
            
            this._applied = false;
            this._currentLogo = null;
            
            console.log('🔄 LogoEnhancement: Original logos restored');
            this.showNotification('Original logos restored', 'info');
        },

        getAvailableLogos: function() {
            return Object.keys(this.LOGO_VARIANTS).map(key => ({
                key,
                name: this.LOGO_VARIANTS[key].name,
                description: this.LOGO_VARIANTS[key].description
            }));
        },

        getCurrentLogo: function() {
            return this._currentLogo;
        },

        showNotification: function(message, type) {
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        LogoEnhancement.init();
    });

    // Expose globally
    window.LogoEnhancement = LogoEnhancement;
    
    if (window.g4c) {
        window.g4c.LogoEnhancement = LogoEnhancement;
    }

    console.log('📦 LogoEnhancement module loaded - Grid4 branding system ready');

})(window, document, jQuery);/* Grid4 Modern UI Experiments - Fonts, Frameworks & Tooling
 * Testing sleek modern enhancements within CSS/JS injection constraints
 * Features: Google Fonts, Tailwind-inspired utilities, modern icons, micro-interactions
 */

(function(window, document, $) {
    'use strict';

    const ModernUIExperiments = {
        _loaded: false,
        _experiments: {},

        // Modern font combinations to test
        FONT_EXPERIMENTS: {
            'inter-system': {
                name: 'Inter + System UI',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    * {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                        font-feature-settings: 'cv05', 'cv11', 'ss01' !important;
                        text-rendering: optimizeLegibility !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: 600 !important;
                        letter-spacing: -0.025em !important;
                    }
                `,
                description: 'Inter font with system fallbacks - Modern, readable, professional'
            },
            
            'poppins-modern': {
                name: 'Poppins Modern',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                    * {
                        font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: 600 !important;
                        letter-spacing: -0.02em !important;
                    }
                    .nav-text, .nav-link {
                        font-weight: 500 !important;
                    }
                `,
                description: 'Poppins - Geometric, friendly, modern SaaS look'
            },
            
            'jetbrains-mono': {
                name: 'JetBrains Mono (Dev-focused)',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
                    body, * {
                        font-family: 'Inter', system-ui, sans-serif !important;
                    }
                    code, pre, .code, [class*="code"], input[type="text"], input[type="password"] {
                        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                        font-feature-settings: 'liga' 1, 'calt' 1 !important;
                    }
                `,
                description: 'Inter + JetBrains Mono - Perfect for developer-focused portals'
            }
        },

        // Tailwind-inspired utility classes that work with injection
        UTILITY_FRAMEWORK: `
            /* Tailwind-inspired utilities - Inject-friendly */
            .g4-flex { display: flex !important; }
            .g4-inline-flex { display: inline-flex !important; }
            .g4-grid { display: grid !important; }
            .g4-hidden { display: none !important; }
            
            /* Flexbox utilities */
            .g4-items-center { align-items: center !important; }
            .g4-items-start { align-items: flex-start !important; }
            .g4-items-end { align-items: flex-end !important; }
            .g4-justify-center { justify-content: center !important; }
            .g4-justify-between { justify-content: space-between !important; }
            .g4-justify-around { justify-content: space-around !important; }
            .g4-flex-col { flex-direction: column !important; }
            .g4-flex-row { flex-direction: row !important; }
            .g4-flex-wrap { flex-wrap: wrap !important; }
            .g4-flex-1 { flex: 1 1 0% !important; }
            
            /* Spacing utilities */
            .g4-m-0 { margin: 0 !important; }
            .g4-m-1 { margin: 0.25rem !important; }
            .g4-m-2 { margin: 0.5rem !important; }
            .g4-m-3 { margin: 0.75rem !important; }
            .g4-m-4 { margin: 1rem !important; }
            .g4-m-6 { margin: 1.5rem !important; }
            .g4-m-8 { margin: 2rem !important; }
            
            .g4-p-0 { padding: 0 !important; }
            .g4-p-1 { padding: 0.25rem !important; }
            .g4-p-2 { padding: 0.5rem !important; }
            .g4-p-3 { padding: 0.75rem !important; }
            .g4-p-4 { padding: 1rem !important; }
            .g4-p-6 { padding: 1.5rem !important; }
            .g4-p-8 { padding: 2rem !important; }
            
            /* Text utilities */
            .g4-text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .g4-text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .g4-text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .g4-text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .g4-text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .g4-text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            
            .g4-font-light { font-weight: 300 !important; }
            .g4-font-normal { font-weight: 400 !important; }
            .g4-font-medium { font-weight: 500 !important; }
            .g4-font-semibold { font-weight: 600 !important; }
            .g4-font-bold { font-weight: 700 !important; }
            
            .g4-text-left { text-align: left !important; }
            .g4-text-center { text-align: center !important; }
            .g4-text-right { text-align: right !important; }
            
            /* Border utilities */
            .g4-border { border: 1px solid #e5e7eb !important; }
            .g4-border-2 { border: 2px solid #e5e7eb !important; }
            .g4-border-0 { border: 0 !important; }
            .g4-rounded { border-radius: 0.25rem !important; }
            .g4-rounded-md { border-radius: 0.375rem !important; }
            .g4-rounded-lg { border-radius: 0.5rem !important; }
            .g4-rounded-xl { border-radius: 0.75rem !important; }
            .g4-rounded-full { border-radius: 9999px !important; }
            
            /* Shadow utilities */
            .g4-shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
            .g4-shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important; }
            .g4-shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
            .g4-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
            
            /* Modern button styles */
            .g4-btn-modern {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0.5rem 1rem !important;
                font-weight: 500 !important;
                border-radius: 0.375rem !important;
                transition: all 0.2s ease !important;
                border: none !important;
                cursor: pointer !important;
                text-decoration: none !important;
            }
            
            .g4-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }
            .g4-btn-primary:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3) !important;
            }
            
            .g4-btn-secondary {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #f8f9fa !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            .g4-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            /* Modern form controls */
            .g4-input-modern {
                appearance: none !important;
                border: 1px solid #d1d5db !important;
                border-radius: 0.375rem !important;
                padding: 0.5rem 0.75rem !important;
                font-size: 0.875rem !important;
                transition: all 0.2s ease !important;
                background: rgba(255, 255, 255, 0.05) !important;
                color: #f8f9fa !important;
            }
            .g4-input-modern:focus {
                outline: none !important;
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }
            
            /* Glassmorphism effects */
            .g4-glass {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .g4-glass-dark {
                background: rgba(0, 0, 0, 0.2) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            /* Micro-interactions */
            .g4-hover-lift:hover {
                transform: translateY(-2px) !important;
                transition: transform 0.2s ease !important;
            }
            
            .g4-hover-glow:hover {
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.4) !important;
                transition: box-shadow 0.3s ease !important;
            }
            
            .g4-pulse {
                animation: g4-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
            }
            
            @keyframes g4-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .g4-fade-in {
                animation: g4-fadeIn 0.5s ease-out !important;
            }
            
            @keyframes g4-fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `,

        // Modern icon system using Lucide (lightweight alternative to Font Awesome)
        ICON_SYSTEM: {
            lucide: {
                name: 'Lucide Icons',
                cdnUrl: 'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
                css: `
                    .lucide {
                        width: 24px;
                        height: 24px;
                        stroke: currentColor;
                        stroke-width: 2;
                        fill: none;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                    }
                    .lucide-sm { width: 16px; height: 16px; }
                    .lucide-lg { width: 32px; height: 32px; }
                    .lucide-xl { width: 48px; height: 48px; }
                `,
                description: 'Lucide - Modern, lightweight SVG icons'
            },
            
            heroicons: {
                name: 'Heroicons',
                setup: 'Manual SVG injection',
                description: 'Heroicons - Beautiful hand-crafted SVG icons from Tailwind team'
            }
        },

        init: function() {
            if (this._loaded) return;
            
            console.log('🎨 ModernUIExperiments: Initializing modern UI toolkit...');
            
            // Load utility framework
            this.loadUtilityFramework();
            
            // Set up experiment controls
            this.setupExperimentControls();
            
            // Load default font experiment
            this.applyFontExperiment('inter-system');
            
            // Load icon system
            this.loadIconSystem('lucide');
            
            this._loaded = true;
            console.log('✅ ModernUIExperiments: Modern UI toolkit ready');
        },

        loadUtilityFramework: function() {
            const style = document.createElement('style');
            style.id = 'g4-utility-framework';
            style.textContent = this.UTILITY_FRAMEWORK;
            document.head.appendChild(style);
            
            console.log('🔧 ModernUIExperiments: Utility framework loaded');
        },

        applyFontExperiment: function(experimentName) {
            const experiment = this.FONT_EXPERIMENTS[experimentName];
            if (!experiment) {
                console.warn(`Font experiment '${experimentName}' not found`);
                return;
            }
            
            // Remove existing font experiment
            const existing = document.getElementById('g4-font-experiment');
            if (existing) existing.remove();
            
            // Apply new font experiment
            const style = document.createElement('style');
            style.id = 'g4-font-experiment';
            style.setAttribute('data-experiment', experimentName);
            style.textContent = experiment.css;
            document.head.appendChild(style);
            
            this._experiments.currentFont = experimentName;
            console.log(`🔤 ModernUIExperiments: Applied font experiment '${experiment.name}'`);
            
            this.showNotification(`Font changed to ${experiment.name}`, 'info');
        },

        loadIconSystem: function(systemName) {
            const system = this.ICON_SYSTEM[systemName];
            if (!system) {
                console.warn(`Icon system '${systemName}' not found`);
                return;
            }
            
            if (system.css) {
                const style = document.createElement('style');
                style.id = 'g4-icon-system';
                style.textContent = system.css;
                document.head.appendChild(style);
            }
            
            if (system.cdnUrl) {
                const script = document.createElement('script');
                script.src = system.cdnUrl;
                script.onload = () => {
                    console.log(`🎯 ModernUIExperiments: ${system.name} loaded`);
                    this.enhanceExistingIcons();
                };
                document.head.appendChild(script);
            }
            
            console.log(`🎨 ModernUIExperiments: Loading ${system.name}`);
        },

        enhanceExistingIcons: function() {
            // Replace common icons with modern alternatives
            const iconMappings = {
                'icon-home': 'home',
                'icon-user': 'user',
                'icon-settings': 'settings',
                'icon-phone': 'phone',
                'icon-mail': 'mail',
                'icon-search': 'search',
                'icon-plus': 'plus',
                'icon-edit': 'edit-2',
                'icon-trash': 'trash-2',
                'icon-download': 'download'
            };
            
            Object.entries(iconMappings).forEach(([oldClass, lucideName]) => {
                const elements = document.querySelectorAll(`.${oldClass}`);
                elements.forEach(el => {
                    if (window.lucide) {
                        el.innerHTML = window.lucide.icons[lucideName] || '';
                        el.classList.add('lucide');
                    }
                });
            });
        },

        setupExperimentControls: function() {
            // Add keyboard shortcuts for quick experimentation
            document.addEventListener('keydown', (e) => {
                // Ctrl+Alt+F = cycle fonts
                if (e.ctrlKey && e.altKey && e.key === 'f') {
                    e.preventDefault();
                    this.cycleFontExperiment();
                }
                
                // Ctrl+Alt+U = toggle utility classes demo
                if (e.ctrlKey && e.altKey && e.key === 'u') {
                    e.preventDefault();
                    this.demoUtilityClasses();
                }
                
                // Ctrl+Alt+G = toggle glassmorphism
                if (e.ctrlKey && e.altKey && e.key === 'g') {
                    e.preventDefault();
                    this.toggleGlassmorphism();
                }
            });
            
            console.log('⌨️  ModernUIExperiments: Keyboard shortcuts ready');
            console.log('   Ctrl+Alt+F = Cycle fonts');
            console.log('   Ctrl+Alt+U = Demo utility classes');
            console.log('   Ctrl+Alt+G = Toggle glassmorphism');
        },

        cycleFontExperiment: function() {
            const fontNames = Object.keys(this.FONT_EXPERIMENTS);
            const currentIndex = fontNames.indexOf(this._experiments.currentFont || 'inter-system');
            const nextIndex = (currentIndex + 1) % fontNames.length;
            const nextFont = fontNames[nextIndex];
            
            this.applyFontExperiment(nextFont);
        },

        demoUtilityClasses: function() {
            // Apply utility classes to common elements as a demo
            const navButtons = document.querySelectorAll('#nav-buttons li a');
            navButtons.forEach((btn, index) => {
                btn.classList.add('g4-btn-modern', index % 2 === 0 ? 'g4-btn-primary' : 'g4-btn-secondary');
                btn.classList.add('g4-hover-lift', 'g4-m-2');
            });
            
            // Apply to form inputs
            const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], select, textarea');
            inputs.forEach(input => {
                input.classList.add('g4-input-modern');
            });
            
            this.showNotification('Utility classes demo applied!', 'success');
        },

        toggleGlassmorphism: function() {
            const navigation = document.getElementById('navigation');
            if (navigation) {
                navigation.classList.toggle('g4-glass-dark');
                
                const isEnabled = navigation.classList.contains('g4-glass-dark');
                this.showNotification(`Glassmorphism ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
            }
        },

        showNotification: function(message, type) {
            // Try multiple notification systems
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        },

        // API for external use
        getAvailableExperiments: function() {
            return {
                fonts: Object.keys(this.FONT_EXPERIMENTS),
                icons: Object.keys(this.ICON_SYSTEM),
                currentFont: this._experiments.currentFont
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        ModernUIExperiments.init();
    });

    // Expose globally
    window.ModernUIExperiments = ModernUIExperiments;
    
    if (window.g4c) {
        window.g4c.ModernUIExperiments = ModernUIExperiments;
    }

    console.log('📦 ModernUIExperiments module loaded - Press Ctrl+Alt+F to cycle fonts!');

})(window, document, jQuery);/* Grid4 Feature Flags UI - Beautiful Feature Management Interface
 * Professional feature flag management with modern design
 * Integrates with Grid4's existing feature flag system
 */

(function(window, document, $) {
    'use strict';

    const FeatureFlagsUI = {
        _isOpen: false,
        _currentFilter: 'all',
        
        // Complete feature definitions matching the screenshot
        FEATURES: {
            'toastNotifications': {
                name: 'Toast Notifications',
                description: 'Beautiful toast messages for user feedback and system alerts',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'loadingAnimations': {
                name: 'Loading Animations', 
                description: 'Smooth loading states and progress indicators throughout the portal',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'commandPalette': {
                name: 'Command Palette',
                description: 'Quick access command interface with fuzzy search (Ctrl+Shift+K)',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'darkMode': {
                name: 'Dark Mode',
                description: 'Premium dark theme with automatic system detection',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'lazyLoading': {
                name: 'Lazy Loading',
                description: 'Intelligent content loading for improved page performance',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'cacheOptimization': {
                name: 'Cache Optimization',
                description: 'Smart caching strategies for faster page loads',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'bundleOptimization': {
                name: 'Bundle Optimization',
                description: 'Optimized JavaScript and CSS loading for better performance',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'autoToastNotifications': {
                name: 'Auto Toast Notifications',
                description: 'Automatic toast messages for AJAX requests and form submissions',
                category: 'experimental',
                enabled: true,
                experimental: true
            },
            'advancedSearch': {
                name: 'Advanced Search',
                description: 'Enhanced search capabilities with filters and smart suggestions',
                category: 'experimental',
                enabled: false,
                experimental: true
            },
            'realTimeUpdates': {
                name: 'Real-time Updates',
                description: 'Live data updates without page refresh using WebSockets',
                category: 'experimental',
                enabled: true,
                experimental: true
            }
        },

        init: function() {
            console.log('🎛️ FeatureFlagsUI: Initializing feature management interface...');
            
            // Setup keyboard shortcut (F key when command palette is open, or Ctrl+Shift+F)
            this.setupKeyboardShortcuts();
            
            // Sync with existing Grid4 feature flags
            this.syncWithGrid4FeatureFlags();
            
            console.log('✅ FeatureFlagsUI: Feature flags interface ready');
        },

        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+F to open feature flags
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
                    e.preventDefault();
                    this.toggle();
                    return;
                }
                
                // F key when not in input field
                if (e.key === 'f' && !e.ctrlKey && !e.altKey && 
                    !['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
                    e.preventDefault();
                    this.toggle();
                }
            });
        },

        syncWithGrid4FeatureFlags: function() {
            // Sync with existing Grid4 feature flag system
            if (window.g4c && window.g4c.isFeatureEnabled) {
                Object.keys(this.FEATURES).forEach(key => {
                    const isEnabled = window.g4c.isFeatureEnabled(key);
                    this.FEATURES[key].enabled = isEnabled;
                });
            }
        },

        toggle: function() {
            if (this._isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open: function() {
            this.createUI();
            this._isOpen = true;
            console.log('🎛️ FeatureFlagsUI: Feature flags interface opened');
        },

        close: function() {
            const modal = document.getElementById('g4-feature-flags-ui');
            if (modal) {
                modal.remove();
            }
            this._isOpen = false;
            console.log('🎛️ FeatureFlagsUI: Feature flags interface closed');
        },

        createUI: function() {
            // Remove existing modal
            const existing = document.getElementById('g4-feature-flags-ui');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'g4-feature-flags-ui';
            modal.className = 'g4-feature-flags-modal';
            
            modal.innerHTML = this.generateHTML();
            document.body.appendChild(modal);
            
            // Add event listeners
            this.setupEventListeners(modal);
            
            // Add CSS if not already present
            this.addCSS();
            
            // Update statistics
            this.updateStatistics();
        },

        generateHTML: function() {
            const stats = this.getStatistics();
            
            return `
                <div class="g4-ff-backdrop"></div>
                <div class="g4-ff-container">
                    <div class="g4-ff-header">
                        <div class="g4-ff-title-section">
                            <h2>🎛️ Feature Flags</h2>
                            <button class="g4-ff-close">&times;</button>
                        </div>
                        <div class="g4-ff-stats">
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.enabled}</span>
                                <span class="g4-ff-stat-label">Enabled</span>
                            </div>
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.total}</span>
                                <span class="g4-ff-stat-label">Total</span>
                            </div>
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.experimental}</span>
                                <span class="g4-ff-stat-label">Experimental</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="g4-ff-filters">
                        <button class="g4-ff-filter ${this._currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'ui' ? 'active' : ''}" data-filter="ui">UI/UX</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'performance' ? 'active' : ''}" data-filter="performance">Performance</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'experimental' ? 'active' : ''}" data-filter="experimental">Experimental</button>
                    </div>
                    
                    <div class="g4-ff-content">
                        <div class="g4-ff-search">
                            <input type="text" placeholder="Search features..." class="g4-ff-search-input">
                        </div>
                        
                        <div class="g4-ff-features-grid">
                            ${this.generateFeatureCards()}
                        </div>
                    </div>
                    
                    <div class="g4-ff-footer">
                        <p><strong>💡 Tip:</strong> Press <kbd>F</kbd> to toggle this interface, or <kbd>Ctrl+Shift+F</kbd> as alternative</p>
                    </div>
                </div>
            `;
        },

        generateFeatureCards: function() {
            return Object.entries(this.FEATURES)
                .filter(([key, feature]) => {
                    if (this._currentFilter === 'all') return true;
                    return feature.category === this._currentFilter;
                })
                .map(([key, feature]) => {
                    const categoryClass = `g4-ff-category-${feature.category}`;
                    const experimentalBadge = feature.experimental ? '<span class="g4-ff-experimental-badge">EXPERIMENTAL</span>' : '';
                    
                    return `
                        <div class="g4-ff-feature-card ${categoryClass}" data-feature="${key}" data-category="${feature.category}">
                            <div class="g4-ff-feature-header">
                                <h3>${feature.name}</h3>
                                <label class="g4-ff-toggle">
                                    <input type="checkbox" ${feature.enabled ? 'checked' : ''} data-feature="${key}">
                                    <span class="g4-ff-toggle-slider"></span>
                                </label>
                            </div>
                            <p class="g4-ff-feature-description">${feature.description}</p>
                            <div class="g4-ff-feature-footer">
                                <span class="g4-ff-category-tag">${feature.category.toUpperCase()}</span>
                                ${experimentalBadge}
                            </div>
                        </div>
                    `;
                }).join('');
        },

        setupEventListeners: function(modal) {
            // Close button
            modal.querySelector('.g4-ff-close').onclick = () => this.close();
            
            // Backdrop click
            modal.querySelector('.g4-ff-backdrop').onclick = () => this.close();
            
            // Filter buttons
            modal.querySelectorAll('.g4-ff-filter').forEach(btn => {
                btn.onclick = () => {
                    this._currentFilter = btn.dataset.filter;
                    this.refreshFeatureGrid();
                    
                    // Update active filter
                    modal.querySelectorAll('.g4-ff-filter').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });
            
            // Feature toggles
            modal.querySelectorAll('.g4-ff-toggle input').forEach(toggle => {
                toggle.onchange = (e) => {
                    const featureKey = e.target.dataset.feature;
                    const enabled = e.target.checked;
                    this.toggleFeature(featureKey, enabled);
                };
            });
            
            // Search input
            const searchInput = modal.querySelector('.g4-ff-search-input');
            searchInput.oninput = (e) => {
                this.filterFeaturesBySearch(e.target.value);
            };
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            });
        },

        refreshFeatureGrid: function() {
            const grid = document.querySelector('.g4-ff-features-grid');
            if (grid) {
                grid.innerHTML = this.generateFeatureCards();
                this.setupFeatureToggles();
            }
        },

        setupFeatureToggles: function() {
            document.querySelectorAll('.g4-ff-toggle input').forEach(toggle => {
                toggle.onchange = (e) => {
                    const featureKey = e.target.dataset.feature;
                    const enabled = e.target.checked;
                    this.toggleFeature(featureKey, enabled);
                };
            });
        },

        toggleFeature: function(featureKey, enabled) {
            // Update internal state
            if (this.FEATURES[featureKey]) {
                this.FEATURES[featureKey].enabled = enabled;
            }
            
            // Update Grid4 feature flag system
            if (window.g4c) {
                if (enabled) {
                    window.g4c.enableFeature(featureKey);
                } else {
                    window.g4c.disableFeature(featureKey);
                }
            }
            
            // Update statistics
            this.updateStatistics();
            
            // Show notification
            this.showNotification(
                `${this.FEATURES[featureKey]?.name || featureKey} ${enabled ? 'enabled' : 'disabled'}`,
                enabled ? 'success' : 'info'
            );
            
            console.log(`🎛️ FeatureFlagsUI: ${featureKey} ${enabled ? 'enabled' : 'disabled'}`);
        },

        filterFeaturesBySearch: function(query) {
            const cards = document.querySelectorAll('.g4-ff-feature-card');
            const searchTerm = query.toLowerCase();
            
            cards.forEach(card => {
                const featureKey = card.dataset.feature;
                const feature = this.FEATURES[featureKey];
                const searchText = `${feature.name} ${feature.description}`.toLowerCase();
                
                if (searchText.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        },

        getStatistics: function() {
            const features = Object.values(this.FEATURES);
            return {
                total: features.length,
                enabled: features.filter(f => f.enabled).length,
                experimental: features.filter(f => f.experimental && f.enabled).length
            };
        },

        updateStatistics: function() {
            const stats = this.getStatistics();
            const modal = document.getElementById('g4-feature-flags-ui');
            if (!modal) return;
            
            const statNumbers = modal.querySelectorAll('.g4-ff-stat-number');
            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = stats.enabled;
                statNumbers[1].textContent = stats.total;
                statNumbers[2].textContent = stats.experimental;
            }
        },

        showNotification: function(message, type) {
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        },

        addCSS: function() {
            if (document.getElementById('g4-feature-flags-ui-css')) return;
            
            const style = document.createElement('style');
            style.id = 'g4-feature-flags-ui-css';
            style.textContent = `
                .g4-feature-flags-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10002;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: g4FFModalIn 0.3s ease-out;
                }
                
                .g4-ff-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .g4-ff-container {
                    position: absolute;
                    top: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    max-width: 1200px;
                    max-height: 800px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .g4-ff-header {
                    padding: 2rem;
                    color: white;
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-title-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .g4-ff-title-section h2 {
                    margin: 0;
                    font-size: 1.875rem;
                    font-weight: 600;
                }
                
                .g4-ff-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                
                .g4-ff-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .g4-ff-stats {
                    display: flex;
                    gap: 2rem;
                }
                
                .g4-ff-stat {
                    text-align: center;
                }
                
                .g4-ff-stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }
                
                .g4-ff-stat-label {
                    font-size: 0.875rem;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-filters {
                    display: flex;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    background: rgba(255, 255, 255, 0.9);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-filter {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: #4b5563;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .g4-ff-filter:hover,
                .g4-ff-filter.active {
                    background: #667eea;
                    color: white;
                    transform: translateY(-1px);
                }
                
                .g4-ff-content {
                    flex: 1;
                    padding: 2rem;
                    background: white;
                    overflow-y: auto;
                }
                
                .g4-ff-search {
                    margin-bottom: 2rem;
                }
                
                .g4-ff-search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                
                .g4-ff-search-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .g4-ff-features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                
                .g4-ff-feature-card {
                    padding: 1.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    background: #f9fafb;
                    transition: all 0.2s;
                }
                
                .g4-ff-feature-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-category-ui {
                    border-left: 4px solid #3b82f6;
                }
                
                .g4-ff-category-performance {
                    border-left: 4px solid #10b981;
                }
                
                .g4-ff-category-experimental {
                    border-left: 4px solid #f59e0b;
                }
                
                .g4-ff-feature-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .g4-ff-feature-header h3 {
                    margin: 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                }
                
                .g4-ff-toggle {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 24px;
                }
                
                .g4-ff-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .g4-ff-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.3s;
                    border-radius: 24px;
                }
                
                .g4-ff-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                }
                
                .g4-ff-toggle input:checked + .g4-ff-toggle-slider {
                    background-color: #10b981;
                }
                
                .g4-ff-toggle input:checked + .g4-ff-toggle-slider:before {
                    transform: translateX(24px);
                }
                
                .g4-ff-feature-description {
                    color: #6b7280;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin: 0 0 1rem 0;
                }
                
                .g4-ff-feature-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .g4-ff-category-tag {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: #e5e7eb;
                    color: #6b7280;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-experimental-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-footer {
                    padding: 1.5rem 2rem;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                }
                
                .g4-ff-footer p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 0.875rem;
                }
                
                kbd {
                    background: #e5e7eb;
                    border: 1px solid #d1d5db;
                    border-radius: 3px;
                    padding: 0.125rem 0.25rem;
                    font-size: 0.75rem;
                    color: #374151;
                }
                
                @keyframes g4FFModalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @media (max-width: 768px) {
                    .g4-ff-container {
                        top: 2%;
                        left: 2%;
                        width: 96%;
                        height: 96%;
                    }
                    
                    .g4-ff-features-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .g4-ff-stats {
                        gap: 1rem;
                    }
                    
                    .g4-ff-filters {
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }
                }
            `;
            
            document.head.appendChild(style);
        },

        // Public API
        getFeatureStatus: function(featureKey) {
            return this.FEATURES[featureKey]?.enabled || false;
        },

        getAllFeatures: function() {
            return { ...this.FEATURES };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        FeatureFlagsUI.init();
    });

    // Expose globally
    window.FeatureFlagsUI = FeatureFlagsUI;
    
    if (window.g4c) {
        window.g4c.FeatureFlagsUI = FeatureFlagsUI;
    }

    console.log('📦 FeatureFlagsUI loaded - Press F or Ctrl+Shift+F to manage features');

})(window, document, jQuery);/* Grid4 Feature Showcase - Interactive Demo System
 * Demonstrates all Grid4 enhancements with live examples
 * Perfect for testing sleek, modern, polished, pleasant, and universally appealing design
 */

(function(window, document, $) {
    'use strict';

    const FeatureShowcase = {
        _showcaseOpen: false,
        _currentDemo: null,

        FEATURES: {
            'consistency-engine': {
                name: 'Consistency Engine',
                description: 'Universal polish ensuring sleek, modern design across all pages',
                demo: function() {
                    this.demoConsistencyEngine();
                },
                commands: [
                    'ConsistencyEngine.refresh() - Refresh all enhancements',
                    'ConsistencyEngine.getStats() - View enhancement statistics'
                ]
            },
            
            'modern-fonts': {
                name: 'Modern Fonts',
                description: 'Professional typography with Inter, Poppins, and JetBrains Mono',
                demo: function() {
                    this.demoModernFonts();
                },
                commands: [
                    'Ctrl+Alt+F - Cycle through font experiments',
                    'ModernUIExperiments.applyFontExperiment("inter-system") - Apply Inter font',
                    'ModernUIExperiments.applyFontExperiment("poppins-modern") - Apply Poppins font'
                ]
            },
            
            'utility-framework': {
                name: 'Utility Framework',
                description: 'Tailwind-inspired utilities for rapid UI development',
                demo: function() {
                    this.demoUtilityFramework();
                },
                commands: [
                    'Ctrl+Alt+U - Demo utility classes',
                    'Ctrl+Alt+G - Toggle glassmorphism effects'
                ]
            },
            
            'logo-system': {
                name: 'Grid4 Logo System',
                description: 'Dynamic logo replacement with multiple variants',
                demo: function() {
                    this.demoLogoSystem();
                },
                commands: [
                    'LogoEnhancement.switchLogo("grid4-white") - Switch to white logo',
                    'LogoEnhancement.switchLogo("grid4-colored") - Switch to colored logo',
                    'LogoEnhancement.getAvailableLogos() - List all logo variants'
                ]
            },
            
            'adaptive-system': {
                name: 'Adaptive Enhancement System',
                description: 'Portal Context Manager with self-healing capabilities',
                demo: function() {
                    this.demoAdaptiveSystem();
                },
                commands: [
                    'PortalContextManager.getContextInfo() - Get portal context',
                    'VerticalCenteringFix.getStatus() - Check centering status',
                    'VerticalCenteringFix.forceReapply() - Force reapply centering fix'
                ]
            },
            
            'command-palette': {
                name: 'Command Palette',
                description: 'VS Code-inspired command interface for power users',
                demo: function() {
                    this.demoCommandPalette();
                },
                commands: [
                    'Ctrl+Shift+K - Open command palette',
                    'Type "grid4" to see Grid4-specific commands',
                    'Type "nav" to see navigation commands'
                ]
            },
            
            'micro-interactions': {
                name: 'Micro-interactions',
                description: 'Delightful hover effects, animations, and feedback',
                demo: function() {
                    this.demoMicroInteractions();
                },
                commands: [
                    'Hover over any button or interactive element',
                    'Click elements to see ripple effects',
                    'Focus inputs to see modern focus states'
                ]
            }
        },

        init: function() {
            console.log('🎭 FeatureShowcase: Initializing interactive demo system...');
            
            // Setup showcase activation
            this.setupShowcaseActivation();
            
            // Add showcase CSS
            this.addShowcaseCSS();
            
            console.log('✅ FeatureShowcase: Demo system ready - Press Ctrl+Shift+D to open showcase');
        },

        setupShowcaseActivation: function() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+D to open showcase
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                    e.preventDefault();
                    this.toggleShowcase();
                }
            });
        },

        toggleShowcase: function() {
            if (this._showcaseOpen) {
                this.closeShowcase();
            } else {
                this.openShowcase();
            }
        },

        openShowcase: function() {
            this.createShowcaseUI();
            this._showcaseOpen = true;
            console.log('🎭 FeatureShowcase: Showcase opened');
        },

        closeShowcase: function() {
            const showcase = document.getElementById('g4-feature-showcase');
            if (showcase) {
                showcase.remove();
            }
            this._showcaseOpen = false;
            console.log('🎭 FeatureShowcase: Showcase closed');
        },

        createShowcaseUI: function() {
            // Remove existing showcase
            const existing = document.getElementById('g4-feature-showcase');
            if (existing) existing.remove();

            const showcase = document.createElement('div');
            showcase.id = 'g4-feature-showcase';
            showcase.className = 'g4-feature-showcase';
            
            showcase.innerHTML = `
                <div class="g4-showcase-backdrop"></div>
                <div class="g4-showcase-modal">
                    <div class="g4-showcase-header">
                        <h2>Grid4 Feature Showcase</h2>
                        <p>Interactive demonstrations of sleek, modern, polished design</p>
                        <button class="g4-showcase-close">&times;</button>
                    </div>
                    <div class="g4-showcase-content">
                        <div class="g4-showcase-sidebar">
                            <h3>Features</h3>
                            <ul class="g4-feature-list">
                                ${Object.entries(this.FEATURES).map(([key, feature]) => `
                                    <li>
                                        <button class="g4-feature-item" data-feature="${key}">
                                            <strong>${feature.name}</strong>
                                            <span>${feature.description}</span>
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="g4-showcase-main">
                            <div class="g4-demo-area">
                                <h3>Select a feature to see live demonstration</h3>
                                <p>Each feature showcases Grid4's commitment to sleek, modern, polished, pleasant, and universally appealing design.</p>
                                
                                <div class="g4-quick-actions">
                                    <h4>Quick Actions</h4>
                                    <button class="g4-btn g4-btn-primary" onclick="ModernUIExperiments.cycleFontExperiment()">
                                        Cycle Fonts
                                    </button>
                                    <button class="g4-btn g4-btn-secondary" onclick="LogoEnhancement.switchLogo('grid4-colored')">
                                        Switch Logo
                                    </button>
                                    <button class="g4-btn g4-btn-accent" onclick="ConsistencyEngine.refresh()">
                                        Refresh Polish
                                    </button>
                                </div>
                                
                                <div class="g4-stats-display">
                                    <h4>System Status</h4>
                                    <div class="g4-stats-grid">
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Enhanced Elements</span>
                                            <span class="g4-stat-value" id="enhanced-count">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Active Features</span>
                                            <span class="g4-stat-value" id="active-features">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Current Font</span>
                                            <span class="g4-stat-value" id="current-font">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Current Logo</span>
                                            <span class="g4-stat-value" id="current-logo">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="g4-showcase-footer">
                        <p>💡 <strong>Tip:</strong> All features work together to create a cohesive, professional experience across every page and interaction.</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(showcase);
            
            // Setup event listeners
            this.setupShowcaseEvents(showcase);
            
            // Update stats
            this.updateStats();
            
            // Auto-focus first feature
            setTimeout(() => {
                const firstFeature = showcase.querySelector('.g4-feature-item');
                if (firstFeature) firstFeature.click();
            }, 100);
        },

        setupShowcaseEvents: function(showcase) {
            // Close button
            showcase.querySelector('.g4-showcase-close').onclick = () => this.closeShowcase();
            
            // Backdrop click
            showcase.querySelector('.g4-showcase-backdrop').onclick = () => this.closeShowcase();
            
            // Feature buttons
            showcase.querySelectorAll('.g4-feature-item').forEach(btn => {
                btn.onclick = () => {
                    const featureKey = btn.dataset.feature;
                    this.showFeatureDemo(featureKey);
                    
                    // Update active state
                    showcase.querySelectorAll('.g4-feature-item').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });
        },

        showFeatureDemo: function(featureKey) {
            const feature = this.FEATURES[featureKey];
            if (!feature) return;
            
            const demoArea = document.querySelector('.g4-demo-area');
            demoArea.innerHTML = `
                <h3>${feature.name}</h3>
                <p>${feature.description}</p>
                
                <div class="g4-demo-content">
                    <h4>Live Demonstration</h4>
                    <div class="g4-demo-examples" id="demo-examples-${featureKey}">
                        <!-- Demo content will be inserted here -->
                    </div>
                </div>
                
                <div class="g4-demo-commands">
                    <h4>Available Commands</h4>
                    <ul>
                        ${feature.commands.map(cmd => `<li><code>${cmd}</code></li>`).join('')}
                    </ul>
                </div>
            `;
            
            // Run the demo
            feature.demo.call(this);
            this._currentDemo = featureKey;
        },

        demoConsistencyEngine: function() {
            const container = document.getElementById('demo-examples-consistency-engine');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Button Consistency</h5>
                    <button class="demo-btn">Primary Button</button>
                    <button class="demo-btn secondary">Secondary Button</button>
                    <button class="demo-btn danger">Danger Button</button>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Form Consistency</h5>
                    <input type="text" placeholder="Consistent input styling" class="demo-input">
                    <select class="demo-input">
                        <option>Consistent select styling</option>
                    </select>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Table Consistency</h5>
                    <table class="demo-table">
                        <thead>
                            <tr><th>Name</th><th>Value</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Example Row</td><td>Sample Data</td><td>Active</td></tr>
                            <tr><td>Another Row</td><td>More Data</td><td>Inactive</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        },

        demoModernFonts: function() {
            const container = document.getElementById('demo-examples-modern-fonts');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Font Comparison</h5>
                    <div class="font-sample inter-font">
                        <strong>Inter Font:</strong> The quick brown fox jumps over the lazy dog. 1234567890
                        <br><small>Professional, readable, modern - perfect for business applications</small>
                    </div>
                    <div class="font-sample poppins-font">
                        <strong>Poppins Font:</strong> The quick brown fox jumps over the lazy dog. 1234567890
                        <br><small>Geometric, friendly, approachable - great for user-facing interfaces</small>
                    </div>
                    <div class="font-sample jetbrains-font">
                        <strong>JetBrains Mono:</strong> function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }
                        <br><small>Monospace, developer-focused - ideal for code and technical content</small>
                    </div>
                </div>
            `;
        },

        demoUtilityFramework: function() {
            const container = document.getElementById('demo-examples-utility-framework');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Utility Classes in Action</h5>
                    <div class="g4-flex g4-items-center g4-justify-between g4-p-4 g4-border g4-rounded-lg g4-shadow-md">
                        <span class="g4-font-semibold">Flexbox Layout</span>
                        <button class="g4-btn-modern g4-btn-primary g4-hover-lift">Action</button>
                    </div>
                    
                    <div class="g4-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                        <div class="g4-p-4 g4-glass g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Glass Effect</h6>
                            <p class="g4-text-sm">Glassmorphism styling</p>
                        </div>
                        <div class="g4-p-4 g4-glass-dark g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Dark Glass</h6>
                            <p class="g4-text-sm">Dark glassmorphism</p>
                        </div>
                        <div class="g4-p-4 g4-shadow-lg g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Shadow Effect</h6>
                            <p class="g4-text-sm">Modern shadows</p>
                        </div>
                    </div>
                </div>
            `;
        },

        demoLogoSystem: function() {
            const container = document.getElementById('demo-examples-logo-system');
            const availableLogos = window.LogoEnhancement ? window.LogoEnhancement.getAvailableLogos() : [];
            
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Logo Variants</h5>
                    <div class="logo-grid">
                        ${availableLogos.map(logo => `
                            <div class="logo-option" onclick="LogoEnhancement.switchLogo('${logo.key}')">
                                <div class="logo-preview" data-logo="${logo.key}"></div>
                                <strong>${logo.name}</strong>
                                <small>${logo.description}</small>
                            </div>
                        `).join('')}
                    </div>
                    <p><strong>Current Logo:</strong> <span id="current-logo-display">Loading...</span></p>
                </div>
            `;
            
            // Update current logo display
            if (window.LogoEnhancement) {
                document.getElementById('current-logo-display').textContent = 
                    window.LogoEnhancement.getCurrentLogo() || 'None';
            }
        },

        demoAdaptiveSystem: function() {
            const container = document.getElementById('demo-examples-adaptive-system');
            const contextInfo = window.PortalContextManager ? window.PortalContextManager.getContextInfo() : {};
            const centeringStatus = window.VerticalCenteringFix ? window.VerticalCenteringFix.getStatus() : {};
            
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Portal Context Detection</h5>
                    <div class="context-info">
                        <p><strong>Fingerprint:</strong> ${contextInfo.fingerprint || 'Not detected'}</p>
                        <p><strong>Context Ready:</strong> ${contextInfo.isReady ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Layout Flags:</strong> ${Object.keys(contextInfo.layoutFlags || {}).length} detected</p>
                    </div>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Vertical Centering Status</h5>
                    <div class="centering-info">
                        <p><strong>Fix Applied:</strong> ${centeringStatus.isApplied ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Method Used:</strong> ${centeringStatus.appliedMethod || 'None'}</p>
                        <p><strong>Navigation Elements:</strong> ${centeringStatus.navigationElements?.navigation ? '✅' : '❌'} Navigation, ${centeringStatus.navigationElements?.navButtons ? '✅' : '❌'} Nav Buttons</p>
                        <button onclick="VerticalCenteringFix.forceReapply()" class="g4-btn-modern g4-btn-secondary">
                            Force Reapply
                        </button>
                    </div>
                </div>
            `;
        },

        demoCommandPalette: function() {
            const container = document.getElementById('demo-examples-command-palette');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Command Palette Features</h5>
                    <div class="command-demo">
                        <button onclick="window.G4CommandPalette?.open()" class="g4-btn-modern g4-btn-primary">
                            Open Command Palette
                        </button>
                        <p>Or press <kbd>Ctrl+Shift+K</kbd></p>
                        
                        <h6>Available Commands:</h6>
                        <ul class="command-list">
                            <li>🏠 Navigation commands (home, inventory, domains)</li>
                            <li>🎨 Grid4 features (theme toggle, feature flags)</li>
                            <li>⚡ Quick actions (search, export, refresh)</li>
                            <li>❓ Help commands (shortcuts, about)</li>
                        </ul>
                    </div>
                </div>
            `;
        },

        demoMicroInteractions: function() {
            const container = document.getElementById('demo-examples-micro-interactions');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Interactive Elements</h5>
                    <div class="interaction-demo">
                        <button class="g4-interactive g4-btn-modern g4-btn-primary g4-hover-lift">
                            Hover for Lift Effect
                        </button>
                        <button class="g4-interactive g4-btn-modern g4-btn-secondary g4-hover-glow">
                            Hover for Glow Effect
                        </button>
                        <div class="g4-interactive g4-p-4 g4-border g4-rounded-lg g4-hover-lift" style="cursor: pointer;">
                            <p class="g4-font-semibold">Interactive Card</p>
                            <p class="g4-text-sm">Click or hover to see effects</p>
                        </div>
                        <input type="text" placeholder="Focus me for modern focus state" class="g4-input-modern">
                    </div>
                </div>
            `;
        },

        updateStats: function() {
            setTimeout(() => {
                if (window.ConsistencyEngine) {
                    const stats = window.ConsistencyEngine.getStats();
                    document.getElementById('enhanced-count').textContent = stats.enhancedElements;
                    document.getElementById('active-features').textContent = stats.appliedEnhancements.length;
                }
                
                if (window.ModernUIExperiments) {
                    const experiments = window.ModernUIExperiments.getAvailableExperiments();
                    document.getElementById('current-font').textContent = experiments.currentFont || 'Default';
                }
                
                if (window.LogoEnhancement) {
                    document.getElementById('current-logo').textContent = 
                        window.LogoEnhancement.getCurrentLogo() || 'Default';
                }
            }, 500);
        },

        addShowcaseCSS: function() {
            const style = document.createElement('style');
            style.id = 'g4-feature-showcase-css';
            style.textContent = `
                .g4-feature-showcase {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10001;
                    font-family: 'Inter', system-ui, sans-serif;
                    animation: g4ShowcaseFadeIn 0.3s ease-out;
                }
                
                .g4-showcase-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .g4-showcase-modal {
                    position: absolute;
                    top: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    background: linear-gradient(135deg, #1a2332 0%, #2a3038 100%);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                }
                
                .g4-showcase-header {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                }
                
                .g4-showcase-header h2 {
                    color: #ffffff;
                    margin: 0 0 0.5rem 0;
                    font-size: 1.875rem;
                    font-weight: 600;
                }
                
                .g4-showcase-header p {
                    color: #cbd5e1;
                    margin: 0;
                    font-size: 1rem;
                }
                
                .g4-showcase-close {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .g4-showcase-close:hover {
                    color: #ffffff;
                }
                
                .g4-showcase-content {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }
                
                .g4-showcase-sidebar {
                    width: 300px;
                    padding: 2rem;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    overflow-y: auto;
                }
                
                .g4-showcase-sidebar h3 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .g4-feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .g4-feature-item {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #ffffff;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .g4-feature-item:hover,
                .g4-feature-item.active {
                    background: rgba(103, 126, 234, 0.2);
                    border-color: #667eea;
                    transform: translateY(-1px);
                }
                
                .g4-feature-item strong {
                    display: block;
                    margin-bottom: 0.25rem;
                    font-size: 0.875rem;
                }
                
                .g4-feature-item span {
                    font-size: 0.75rem;
                    color: #cbd5e1;
                    line-height: 1.4;
                }
                
                .g4-showcase-main {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                }
                
                .g4-demo-area h3 {
                    color: #ffffff;
                    margin: 0 0 0.5rem 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                
                .g4-demo-area p {
                    color: #cbd5e1;
                    margin: 0 0 2rem 0;
                }
                
                .g4-demo-example {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                
                .g4-demo-example h5 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-quick-actions {
                    margin-bottom: 2rem;
                }
                
                .g4-quick-actions h4 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    margin-right: 0.5rem;
                    margin-bottom: 0.5rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                
                .g4-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .g4-btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #f8f9fa;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .g4-btn-accent {
                    background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
                    color: white;
                }
                
                .g4-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .g4-stats-display {
                    margin-bottom: 2rem;
                }
                
                .g4-stats-display h4 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
                
                .g4-stat {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    text-align: center;
                }
                
                .g4-stat-label {
                    display: block;
                    color: #cbd5e1;
                    font-size: 0.75rem;
                    margin-bottom: 0.25rem;
                }
                
                .g4-stat-value {
                    display: block;
                    color: #ffffff;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .g4-showcase-footer {
                    padding: 1.5rem 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .g4-showcase-footer p {
                    color: #cbd5e1;
                    margin: 0;
                    font-size: 0.875rem;
                }
                
                @keyframes g4ShowcaseFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                kbd {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    padding: 0.125rem 0.25rem;
                    font-size: 0.75rem;
                    color: #ffffff;
                }
                
                code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.125rem 0.25rem;
                    border-radius: 3px;
                    font-size: 0.75rem;
                    color: #00d4ff;
                }
            `;
            
            document.head.appendChild(style);
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        FeatureShowcase.init();
    });

    // Expose globally
    window.FeatureShowcase = FeatureShowcase;
    
    if (window.g4c) {
        window.g4c.FeatureShowcase = FeatureShowcase;
    }

    console.log('📦 FeatureShowcase loaded - Press Ctrl+Shift+D to open interactive demo');

})(window, document, jQuery);/* Grid4 Vertical Centering Fix - Adaptive Enhancement Module
 * Solves cross-browser/cross-system navigation centering inconsistencies
 * First implementation of the Portal Context Manager enhancement pattern
 * Self-validating with closed-loop feedback system
 */

(function(window, document, $) {
    'use strict';

    const VerticalCenteringFix = {
        _isApplied: false,
        _retryCount: 0,
        _maxRetries: 3,

        // CSS fixes for different scenarios
        CENTERING_FIXES: {
            // Standard flexbox centering
            flexbox: `
                #navigation {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    min-height: 100vh !important;
                }
                #nav-buttons {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    width: 100% !important;
                }
            `,

            // CSS Grid centering (fallback)
            grid: `
                #navigation {
                    display: grid !important;
                    grid-template-rows: 1fr auto 1fr !important;
                    min-height: 100vh !important;
                    align-content: center !important;
                }
                #nav-buttons {
                    grid-row: 2 !important;
                }
            `,

            // Transform-based centering (legacy browsers)
            transform: `
                #navigation {
                    position: relative !important;
                    min-height: 100vh !important;
                }
                #nav-buttons {
                    position: absolute !important;
                    top: 50% !important;
                    left: 0 !important;
                    right: 0 !important;
                    transform: translateY(-50%) !important;
                }
            `,

            // Table-cell centering (ultimate fallback)
            table: `
                #navigation {
                    display: table-cell !important;
                    vertical-align: middle !important;
                    min-height: 100vh !important;
                    width: 220px !important;
                }
                #nav-buttons {
                    display: block !important;
                }
            `
        },

        init: function() {
            console.log('🎯 VerticalCenteringFix: Initializing adaptive enhancement module...');

            // Wait for Portal Context Manager to be ready
            $(document).on('portalManagerReady', (event, portalManager) => {
                this.handlePortalManagerReady(portalManager);
            });

            // If Portal Context Manager is already ready, proceed immediately
            if (window.PortalContextManager && window.PortalContextManager._isReady) {
                this.handlePortalManagerReady(window.PortalContextManager);
            }
        },

        handlePortalManagerReady: function(portalManager) {
            console.log('🎯 VerticalCenteringFix: Portal Context Manager ready, checking navigation centering...');

            // Check if navigation is properly centered
            const isCentered = portalManager.getLayoutFlag('isNavVerticallyCentered');
            
            if (isCentered) {
                console.log('✅ VerticalCenteringFix: Navigation is already properly centered');
                return;
            }

            console.log('❌ VerticalCenteringFix: Navigation centering issue detected, applying fix...');
            this.applyFix(portalManager);
        },

        applyFix: function(portalManager) {
            // Try different centering methods in order of preference
            const methods = ['flexbox', 'grid', 'transform', 'table'];
            
            for (const method of methods) {
                if (this.tryMethod(method, portalManager)) {
                    console.log(`✅ VerticalCenteringFix: Successfully applied ${method} centering method`);
                    this._isApplied = true;
                    return;
                }
            }

            console.warn('⚠️ VerticalCenteringFix: All centering methods failed');
        },

        tryMethod: function(method, portalManager) {
            try {
                console.log(`🔧 VerticalCenteringFix: Trying ${method} centering method...`);

                // Apply the CSS fix
                this.injectCSS(method, this.CENTERING_FIXES[method]);

                // Wait a moment for layout to settle
                setTimeout(() => {
                    this.validateFix(method, portalManager);
                }, 100);

                return true; // Method was applied, validation will happen async
            } catch (error) {
                console.error(`❌ VerticalCenteringFix: Error applying ${method} method:`, error);
                return false;
            }
        },

        injectCSS: function(method, css) {
            // Remove any existing centering fix
            const existingStyle = document.getElementById('g4-vertical-centering-fix');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Create new style element
            const style = document.createElement('style');
            style.id = 'g4-vertical-centering-fix';
            style.setAttribute('data-method', method);
            style.textContent = `
                /* Grid4 Vertical Centering Fix - ${method} method */
                ${css}
                
                /* Additional responsive adjustments */
                @media (max-width: 768px) {
                    #navigation {
                        min-height: auto !important;
                        position: static !important;
                    }
                    #nav-buttons {
                        position: static !important;
                        transform: none !important;
                    }
                }
            `;

            document.head.appendChild(style);
            console.log(`🎨 VerticalCenteringFix: Applied ${method} CSS fix`);
        },

        validateFix: function(method, portalManager) {
            console.log(`🔬 VerticalCenteringFix: Validating ${method} fix...`);

            // Re-run the centering probe
            const isNowCentered = portalManager.revalidateProbe('isNavVerticallyCentered');

            if (isNowCentered) {
                console.log(`🎉 VerticalCenteringFix: ${method} method successful! Navigation is now centered.`);
                this._isApplied = true;
                this._retryCount = 0;
                
                // Show success notification if toast system is available
                this.showNotification(`Navigation centering fixed using ${method} method`, 'success');
                
                return true;
            } else {
                console.warn(`⚠️ VerticalCenteringFix: ${method} method failed validation`);
                
                // Retry with next method if we haven't exceeded retry limit
                if (this._retryCount < this._maxRetries) {
                    this._retryCount++;
                    console.log(`🔄 VerticalCenteringFix: Retrying with different method (attempt ${this._retryCount}/${this._maxRetries})`);
                    
                    // Remove failed CSS and try next method
                    const failedStyle = document.getElementById('g4-vertical-centering-fix');
                    if (failedStyle) {
                        failedStyle.remove();
                    }
                    
                    return false; // Will trigger next method
                } else {
                    console.error('❌ VerticalCenteringFix: All retry attempts exhausted');
                    this.showNotification('Navigation centering fix failed after multiple attempts', 'error');
                    return false;
                }
            }
        },

        showNotification: function(message, type) {
            try {
                // Try Grid4 toast system first
                if (window.toast && window.toast[type]) {
                    window.toast[type](message, { duration: 5000 });
                    return;
                }

                // Try command palette toast system
                if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                    window.G4CommandPalette.showToast(message, type);
                    return;
                }

                // Fallback to console
                console.log(`${type.toUpperCase()}: ${message}`);
            } catch (error) {
                console.warn('VerticalCenteringFix: Error showing notification:', error);
            }
        },

        // Public API for manual testing
        forceReapply: function() {
            console.log('🔄 VerticalCenteringFix: Force reapplying fix...');
            this._isApplied = false;
            this._retryCount = 0;
            
            if (window.PortalContextManager && window.PortalContextManager._isReady) {
                this.handlePortalManagerReady(window.PortalContextManager);
            } else {
                console.warn('⚠️ VerticalCenteringFix: Portal Context Manager not ready');
            }
        },

        // Get current status for debugging
        getStatus: function() {
            const appliedMethod = document.getElementById('g4-vertical-centering-fix')?.getAttribute('data-method');
            
            return {
                isApplied: this._isApplied,
                appliedMethod: appliedMethod || null,
                retryCount: this._retryCount,
                portalManagerReady: window.PortalContextManager?._isReady || false,
                navigationElements: {
                    navigation: !!document.getElementById('navigation'),
                    navButtons: !!document.getElementById('nav-buttons')
                }
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        VerticalCenteringFix.init();
    });

    // Expose globally for debugging and manual control
    window.VerticalCenteringFix = VerticalCenteringFix;
    
    // Also expose on Grid4 namespace if available
    if (window.g4c) {
        window.g4c.VerticalCenteringFix = VerticalCenteringFix;
    }

    console.log('📦 VerticalCenteringFix module loaded - First adaptive enhancement ready');

})(window, document, jQuery);/* Grid4 Communications Custom NetSapiens Portal JavaScript v3.0 */
/* Complete overhaul - Non-destructive approach for maximum stability */
/* jQuery 1.8.3 compatible - prevents UI freezes and hangs */

(function() {
    'use strict';
    
    // Global flag to prevent multiple initializations
    if (window.grid4PortalInitialized) {
        console.log('Grid4: Portal already initialized, skipping...');
        return;
    }
    
    // Wait for jQuery to be available (NetSapiens loads jQuery 1.8.3)
    function waitForJQuery(callback) {
        var attempts = 0;
        var maxAttempts = 50;
        
        function checkJQuery() {
            if (typeof window.jQuery !== 'undefined' && window.jQuery.fn && window.jQuery.fn.jquery) {
                console.log('Grid4: jQuery ' + window.jQuery.fn.jquery + ' detected');
                callback(window.jQuery);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkJQuery, 100);
            } else {
                console.error('Grid4: jQuery not available after ' + maxAttempts + ' attempts');
            }
        }
        
        checkJQuery();
    }
    
    // Global namespace for Grid4 Custom features
    window.g4c = window.g4c || {};
    
    /**
     * Feature Flag System - Professional-grade control for safe development
     * Precedence: URL Parameter > Session Storage > Local Storage > Default (false)
     * @param {string} featureName - The feature name (e.g., 'commandPalette')
     * @returns {boolean}
     */
    window.g4c.isFeatureEnabled = function(featureName) {
        var key = 'g4c_feature_' + featureName;
        var sessionKey = 'g4c_session_feature_' + featureName;
        
        try {
            // 1. Check for URL parameter overrides first
            var urlParams = new URLSearchParams(window.location.search);
            var enabledFlags = (urlParams.get('enable_flags') || '').split(',');
            var disabledFlags = (urlParams.get('disable_flags') || '').split(',');

            if (enabledFlags.indexOf(featureName) !== -1) {
                sessionStorage.setItem(sessionKey, 'true'); // Persist for the session
                return true;
            }
            if (disabledFlags.indexOf(featureName) !== -1) {
                sessionStorage.setItem(sessionKey, 'false'); // Persist for the session
                return false;
            }

            // 2. Check for a session-level flag (from a previous URL override)
            var sessionValue = sessionStorage.getItem(sessionKey);
            if (sessionValue !== null) {
                return sessionValue === 'true';
            }

            // 3. Check for a user's persistent setting in localStorage
            var localValue = localStorage.getItem(key);
            if (localValue !== null) {
                return localValue === 'true';
            }

            // 4. Fallback to the hardcoded default (always false for safety)
            return false;
        } catch (error) {
            console.warn('Grid4: Error checking feature flag for ' + featureName + ':', error);
            return false; // Safe fallback
        }
    };
    
    /**
     * Enable a feature flag in localStorage (persistent)
     * @param {string} featureName - The feature name
     */
    window.g4c.enableFeature = function(featureName) {
        try {
            localStorage.setItem('g4c_feature_' + featureName, 'true');
            console.log('Grid4: Feature enabled: ' + featureName);
        } catch (error) {
            console.warn('Grid4: Error enabling feature ' + featureName + ':', error);
        }
    };
    
    /**
     * Disable a feature flag in localStorage (persistent)
     * @param {string} featureName - The feature name
     */
    window.g4c.disableFeature = function(featureName) {
        try {
            localStorage.setItem('g4c_feature_' + featureName, 'false');
            console.log('Grid4: Feature disabled: ' + featureName);
        } catch (error) {
            console.warn('Grid4: Error disabling feature ' + featureName + ':', error);
        }
    };
    
    /**
     * Clear all Grid4 feature flags (for debugging)
     */
    window.g4c.clearAllFeatures = function() {
        try {
            var keysToRemove = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.indexOf('g4c_') === 0) {
                    keysToRemove.push(key);
                }
            }
            for (var j = 0; j < keysToRemove.length; j++) {
                localStorage.removeItem(keysToRemove[j]);
            }
            console.log('Grid4: All feature flags cleared');
        } catch (error) {
            console.warn('Grid4: Error clearing feature flags:', error);
        }
    };
    
    /**
     * Command Palette Module Loader - Modular, on-demand loading
     * This implements the architecture recommended by our planning session
     */
    window.g4c.commandPaletteLoaded = false;
    
    window.g4c.loadCommandPalette = function() {
        try {
            // If already loaded, just show it
            if (this.commandPaletteLoaded && window.g4c.showCommandPalette) {
                window.g4c.showCommandPalette();
                return;
            }
            
            // First-time loading
            console.log('Grid4: Loading Command Palette module...');
            
            // Inject CSS for Command Palette with cache busting
            var timestamp = new Date().getTime();
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.css?v=' + timestamp;
            link.onload = function() {
                console.log('Grid4: Command Palette CSS loaded');
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load Command Palette CSS');
            };
            document.head.appendChild(link);
            
            // Inject JS (Microfuzz + Command Palette logic) with cache busting
            var script = document.createElement('script');
            script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.js?v=' + timestamp;
            script.onload = function() {
                console.log('Grid4: Command Palette JS loaded');
                window.g4c.commandPaletteLoaded = true;
                
                // Initialize and show the palette
                if (window.g4c.initCommandPalette) {
                    window.g4c.initCommandPalette();
                }
                if (window.g4c.showCommandPalette) {
                    window.g4c.showCommandPalette();
                }
            };
            script.onerror = function() {
                console.error('Grid4: Failed to load Command Palette JS');
                alert('Command Palette failed to load. Please check your connection and try again.');
            };
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('Grid4: Error loading Command Palette:', error);
        }
    };

    /**
     * Ensure CSS is loaded - critical for consistency across systems
     */
    function ensureCSSLoaded() {
        try {
            // Check if our CSS is already loaded
            var existingLink = document.querySelector('link[href*="grid4-custom-v3.css"]');
            if (existingLink) {
                console.log('Grid4: CSS already loaded');
                return;
            }
            
            // Load CSS with cache busting to ensure latest version
            var timestamp = new Date().getTime();
            var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css?v=' + timestamp;
            
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssUrl;
            link.onload = function() {
                console.log('Grid4: CSS loaded successfully with cache bust');
            };
            link.onerror = function() {
                console.error('Grid4: Failed to load CSS');
            };
            
            document.head.appendChild(link);
            console.log('Grid4: Loading CSS from ' + cssUrl);
            
        } catch (error) {
            console.error('Grid4: Error loading CSS:', error);
        }
    }

    // Main initialization function
    function initializeGrid4Portal($) {
        console.log('Grid4: Starting non-destructive portal initialization...');
        
        // Set global flag
        window.grid4PortalInitialized = true;
        
        // Ensure CSS is loaded for consistency
        ensureCSSLoaded();
        
        console.log('Grid4: Feature flag system initialized');
        
        // Keep track of classes we added
        var lastPageClasses = [];
        
        // Core functions
        function addPageSpecificBodyClasses() {
            try {
                var pathname = window.location.pathname;
                var body = document.body;
                
                // Remove only the classes we added last time (non-destructive)
                if (lastPageClasses.length > 0) {
                    body.classList.remove.apply(body.classList, lastPageClasses);
                }
                lastPageClasses = []; // Reset the tracker
                
                // Parse pathname and add new classes
                var pathParts = pathname.split('/').filter(function(part) {
                    return part && part !== 'portal';
                });
                
                if (pathParts.length > 0) {
                    var pageClass = 'page-' + pathParts[0];
                    body.classList.add(pageClass);
                    lastPageClasses.push(pageClass);
                    
                    if (pathParts.length > 1) {
                        var subpageClass = 'subpage-' + pathParts[1];
                        body.classList.add(subpageClass);
                        lastPageClasses.push(subpageClass);
                    }
                }
                
                console.log('Grid4: Page classes updated for ' + pathname);
            } catch (error) {
                console.error('Grid4: Error in addPageSpecificBodyClasses:', error);
            }
        }
        
        function shortenMenuLabels() {
            try {
                var labelMap = {
                    'Auto Attendants': 'Attendants',
                    'Call Queues': 'Queues',
                    'Music On Hold': 'Hold Music',
                    'Time Frames': 'Schedules',
                    'Route Profiles': 'Routing'
                };
                
                // Find navigation text elements using jQuery
                $('#nav-buttons .nav-text').each(function() {
                    try {
                        var $navText = $(this);
                        var originalText = $navText.text().trim();
                        
                        if (labelMap[originalText]) {
                            $navText.text(labelMap[originalText]);
                            console.log('Grid4: Label shortened: ' + originalText + ' -> ' + labelMap[originalText]);
                        }
                    } catch (innerError) {
                        console.warn('Grid4: Error shortening individual label:', innerError);
                    }
                });
            } catch (error) {
                console.error('Grid4: Error in shortenMenuLabels:', error);
            }
        }
        
        function addMobileToggle() {
            try {
                // Check if mobile toggle already exists
                if ($('.grid4-mobile-toggle').length > 0) {
                    return;
                }
                
                var toggleButton = $('<button class="grid4-mobile-toggle" aria-label="Toggle Navigation">' +
                    '<i class="fa fa-bars"></i>' +
                    '</button>');
                
                $('body').append(toggleButton);
                
                toggleButton.on('click', function() {
                    $('#navigation').toggleClass('mobile-active');
                    $(this).find('i').toggleClass('fa-bars fa-times');
                });
                
                console.log('Grid4: Mobile toggle added');
            } catch (error) {
                console.error('Grid4: Error adding mobile toggle:', error);
            }
        }
        
        function enhanceNavigation() {
            try {
                // Find existing navigation elements (non-destructive)
                var $navigation = $('#navigation');
                var $navButtons = $('#nav-buttons');
                
                if ($navigation.length === 0 || $navButtons.length === 0) {
                    console.warn('Grid4: Navigation elements not found, skipping enhancement');
                    return;
                }
                
                // Add CSS classes for styling (non-destructive)
                $navigation.addClass('grid4-enhanced');
                $navButtons.addClass('grid4-nav-list');
                
                // Add structural classes to navigation links (no hover handlers - CSS handles this)
                $('#nav-buttons li a.nav-link').each(function() {
                    try {
                        var $link = $(this);
                        $link.addClass('grid4-nav-item');
                    } catch (innerError) {
                        console.warn('Grid4: Error enhancing individual nav link:', innerError);
                    }
                });
                
                console.log('Grid4: Navigation enhanced successfully');
            } catch (error) {
                console.error('Grid4: Error enhancing navigation:', error);
            }
        }
        
        function setupDynamicContentHandling() {
            try {
                // MutationObserver for dynamic content changes
                if (window.MutationObserver) {
                    var observer = new MutationObserver(function(mutations) {
                        var shouldRefresh = false;
                        
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                for (var i = 0; i < mutation.addedNodes.length; i++) {
                                    var node = mutation.addedNodes[i];
                                    if (node.nodeType === 1) { // Element node
                                        shouldRefresh = true;
                                        break;
                                    }
                                }
                            }
                        });
                        
                        if (shouldRefresh) {
                            // Debounce the refresh
                            clearTimeout(window.grid4RefreshTimeout);
                            window.grid4RefreshTimeout = setTimeout(function() {
                                addPageSpecificBodyClasses();
                                shortenMenuLabels();
                            }, 200);
                        }
                    });
                    
                    // Observe the content area for changes
                    var contentArea = document.getElementById('content');
                    if (contentArea) {
                        observer.observe(contentArea, {
                            childList: true,
                            subtree: true
                        });
                        console.log('Grid4: MutationObserver set up for dynamic content');
                    }
                }
                
                // AJAX completion handler (jQuery 1.8.3 compatible)
                $(document).ajaxComplete(function(event, xhr, settings) {
                    try {
                        // Check if this is a NetSapiens portal AJAX call
                        if (settings.url && settings.url.indexOf('/portal/') !== -1) {
                            // Debounce the refresh
                            clearTimeout(window.grid4AjaxTimeout);
                            window.grid4AjaxTimeout = setTimeout(function() {
                                addPageSpecificBodyClasses();
                                shortenMenuLabels();
                                console.log('Grid4: Content refreshed after AJAX call');
                            }, 100);
                        }
                    } catch (error) {
                        console.warn('Grid4: Error in AJAX complete handler:', error);
                    }
                });
                
                console.log('Grid4: Dynamic content handling set up');
            } catch (error) {
                console.error('Grid4: Error setting up dynamic content handling:', error);
            }
        }
        
        function addKeyboardSupport() {
            try {
                $(document).on('keydown', function(e) {
                    // Escape key closes mobile menu
                    if (e.keyCode === 27) {
                        $('#navigation').removeClass('mobile-active');
                        $('.grid4-mobile-toggle i').removeClass('fa-times').addClass('fa-bars');
                    }
                    
                    // Command Palette: Ctrl+Shift+P (like VS Code) (feature flag protected)
                    if (window.g4c.isFeatureEnabled('commandPalette') && e.ctrlKey && e.shiftKey && e.key === 'P') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Grid4: Command Palette triggered (Ctrl+Shift+P)');
                        window.g4c.loadCommandPalette();
                    }
                });
                
                console.log('Grid4: Keyboard support added');
                
                // Log feature flag status for debugging
                if (window.g4c.isFeatureEnabled('commandPalette')) {
                    console.log('Grid4: Command Palette feature is ENABLED - Press Ctrl+Shift+P to activate');
                } else {
                    console.log('Grid4: Command Palette feature is DISABLED - Enable with g4c.enableFeature("commandPalette")');
                }
            } catch (error) {
                console.error('Grid4: Error adding keyboard support:', error);
            }
        }
        
        function addAccessibilityEnhancements() {
            try {
                // Add ARIA labels
                $('#navigation').attr('aria-label', 'Main Navigation');
                $('#nav-buttons').attr('role', 'navigation');
                
                console.log('Grid4: Accessibility enhancements added');
            } catch (error) {
                console.error('Grid4: Error adding accessibility enhancements:', error);
            }
        }
        
        function forceWrapperBackground() {
            try {
                // Prevent multiple calls - set flag after first execution
                if (window.g4c && window.g4c.wrapperBackgroundFixed) {
                    return; // Already fixed, no need to repeat
                }
                
                var wrappers = document.querySelectorAll('.wrapper');
                var fixedCount = 0;
                for (var i = 0; i < wrappers.length; i++) {
                    var wrapper = wrappers[i];
                    wrapper.style.setProperty('background-color', '#1c1e22', 'important');
                    wrapper.style.setProperty('background', '#1c1e22', 'important');
                    fixedCount++;
                }
                
                // Mark as fixed to prevent future calls
                if (window.g4c) {
                    window.g4c.wrapperBackgroundFixed = true;
                }
                
                if (fixedCount > 0) {
                    console.log('Grid4: Wrapper background fixed (' + fixedCount + ' elements)');
                }
            } catch (e) {
                console.warn('Grid4: Error fixing wrapper background:', e);
            }
        }
        
        function initializeAll() {
            try {
                console.log('Grid4: Initializing all modules...');
                
                // CRITICAL: Stop any existing wrapper background loops
                stopWrapperBackgroundMonitoring();
                
                // Load Grid4 Showcase Features first (dopamine-inducing premium experience)
                loadShowcaseFeatures();
                
                // Load Adaptive Enhancement System (handles multi-tenant variations)
                loadAdaptiveEnhancementSystem();
                
                // Initialize core functions
                addPageSpecificBodyClasses();
                enhanceNavigation();
                shortenMenuLabels();
                addMobileToggle();
                setupDynamicContentHandling();
                addKeyboardSupport();
                addAccessibilityEnhancements();
                
                // Force wrapper background fix (once only)
                forceWrapperBackground();
                
                console.log('Grid4: Initialization complete!');
            } catch (error) {
                console.error('Grid4: Error during initialization:', error);
            }
        }
        
        function stopWrapperBackgroundMonitoring() {
            try {
                // Clear only specific, known Grid4 intervals
                if (window.g4c && window.g4c.wrapperMonitorInterval) {
                    clearInterval(window.g4c.wrapperMonitorInterval);
                    window.g4c.wrapperMonitorInterval = null;
                    console.log('Grid4: Stopped specific wrapper background monitoring loop');
                }
                
                // REMOVED DANGEROUS GLOBAL TIMER CLEARING
                // The previous approach of clearing all intervals (1-10000) was dangerous
                // and could break the entire NetSapiens portal functionality.
                // Now using surgical timer identification via TimerDiagnostic instead.
                
                console.log('Grid4: Safe performance cleanup completed - dangerous timer clearing removed');
            } catch (error) {
                console.warn('Grid4: Error stopping wrapper monitoring:', error);
            }
        }
        
        /**
         * Load Grid4 Showcase Features - Dopamine-inducing premium experience
         * RingCentral-inspired design with professional polish
         * Includes: Toast Notifications, Loading Animations, Feature Flag UI
         */
        function loadShowcaseFeatures() {
            try {
                console.log('Grid4: Loading showcase features...');
                
                // Check if showcase features should be loaded (default: enabled for demo)
                if (!window.g4c.isFeatureEnabled('showcaseFeatures')) {
                    window.g4c.enableFeature('showcaseFeatures');
                }
                
                if (window.g4c.isFeatureEnabled('showcaseFeatures')) {
                    var script = document.createElement('script');
                    script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/showcase-features.js';
                    script.async = true;
                    script.onload = function() {
                        console.log('Grid4: 🎉 Showcase features loaded - RingCentral-inspired experience activated!');
                    };
                    script.onerror = function() {
                        console.warn('Grid4: Failed to load showcase features - falling back to basic theme');
                    };
                    document.head.appendChild(script);
                }
                
                // Load Command Palette (enabled by default for productivity)
                if (!window.g4c.isFeatureEnabled('commandPalette')) {
                    window.g4c.enableFeature('commandPalette');
                }
                
                if (window.g4c.isFeatureEnabled('commandPalette')) {
                    loadCommandPalette();
                }
            } catch (error) {
                console.error('Grid4: Error loading showcase features:', error);
            }
        }
        
        /**
         * Load Command Palette - VS Code inspired command interface
         * Activation: Ctrl+Shift+P
         */
        function loadCommandPalette() {
            try {
                console.log('Grid4: Loading command palette...');
                
                var script = document.createElement('script');
                script.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.js';
                script.async = true;
                script.onload = function() {
                    console.log('Grid4: 🎯 Command Palette loaded - Press Ctrl+Shift+K to activate!');
                };
                script.onerror = function() {
                    console.warn('Grid4: Failed to load command palette');
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('Grid4: Error loading command palette:', error);
            }
        }
        
        /**
         * Load Adaptive Enhancement System - Portal Context Manager + Enhancement Modules
         * Handles multi-tenant portal variations and cross-browser rendering issues
         * Self-healing architecture for consistent user experience
         */
        function loadAdaptiveEnhancementSystem() {
            try {
                console.log('Grid4: Loading adaptive enhancement system...');
                
                // First, load the Portal Context Manager
                var contextManagerScript = document.createElement('script');
                contextManagerScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/portal-context-manager.js';
                contextManagerScript.async = true;
                contextManagerScript.onload = function() {
                    console.log('Grid4: 🔍 Portal Context Manager loaded - Adaptive system ready');
                    
                    // Then load enhancement modules
                contextManagerScript.onerror = function() {
                    console.warn('Grid4: Failed to load Portal Context Manager - falling back to basic enhancements');
                };
                document.head.appendChild(contextManagerScript);
                
            } catch (error) {
                console.error('Grid4: Error loading adaptive enhancement system:', error);
            }
        }
        
        /**
         * Load Individual Enhancement Modules
         * Each module is self-contained and handles its own initialization
         */
                consistencyEngineScript.onerror = function() {
                    console.warn('Grid4: Failed to load Consistency Engine');
                };
                document.head.appendChild(consistencyEngineScript);
                
                // Load Logo Enhancement (Grid4 branding system)
                var logoEnhancementScript = document.createElement('script');
                logoEnhancementScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/logo-enhancement.js';
                logoEnhancementScript.async = true;
                logoEnhancementScript.onload = function() {
                    console.log('Grid4: 🎨 Logo Enhancement loaded - Grid4 branding system ready');
                };
                logoEnhancementScript.onerror = function() {
                    console.warn('Grid4: Failed to load Logo Enhancement');
                };
                document.head.appendChild(logoEnhancementScript);
                
                // Load Modern UI Experiments (fonts, frameworks, tooling)
                var modernUIScript = document.createElement('script');
                modernUIScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/modern-ui-experiments.js';
                modernUIScript.async = true;
                modernUIScript.onload = function() {
                    console.log('Grid4: 🎨 Modern UI Experiments loaded - Press Ctrl+Alt+F to cycle fonts!');
                };
                modernUIScript.onerror = function() {
                    console.warn('Grid4: Failed to load Modern UI Experiments');
                };
                document.head.appendChild(modernUIScript);
                
                // Load Feature Flags UI (beautiful feature management interface)
                var featureFlagsUIScript = document.createElement('script');
                featureFlagsUIScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/feature-flags-ui.js';
                featureFlagsUIScript.async = true;
                featureFlagsUIScript.onload = function() {
                    console.log('Grid4: 🎛️ Feature Flags UI loaded - Press F to manage features!');
                };
                featureFlagsUIScript.onerror = function() {
                    console.warn('Grid4: Failed to load Feature Flags UI');
                };
                document.head.appendChild(featureFlagsUIScript);
                
                // Load Feature Showcase (interactive demo system)
                var featureShowcaseScript = document.createElement('script');
                featureShowcaseScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/feature-showcase.js';
                featureShowcaseScript.async = true;
                featureShowcaseScript.onload = function() {
                    console.log('Grid4: 🎭 Feature Showcase loaded - Press Ctrl+Shift+D for demo!');
                };
                featureShowcaseScript.onerror = function() {
                    console.warn('Grid4: Failed to load Feature Showcase');
                };
                document.head.appendChild(featureShowcaseScript);
                
                // Load Vertical Centering Fix (addresses cross-browser menu centering issues)
                var verticalCenteringScript = document.createElement('script');
                verticalCenteringScript.src = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/vertical-centering-fix.js';
                verticalCenteringScript.async = true;
                verticalCenteringScript.onload = function() {
                    console.log('Grid4: 🎯 Vertical Centering Fix loaded - Navigation centering issues resolved');
                };
                verticalCenteringScript.onerror = function() {
                    console.warn('Grid4: Failed to load Vertical Centering Fix');
                };
                document.head.appendChild(verticalCenteringScript);
                
                // Future enhancement modules can be added here
                // Example: loadResponsiveTableEnhancement(), loadAccessibilityEnhancement(), etc.
                
            } catch (error) {
                console.error('Grid4: Error loading enhancement modules:', error);
            }
        }
        
        // Wait for DOM to be ready, then initialize
        $(document).ready(function() {
            // Additional check to ensure portal elements are present
            var checkPortalReady = function() {
                if ($('#navigation').length > 0 && $('#nav-buttons').length > 0) {
                    initializeAll();
                } else {
                    // Retry up to 10 times
                    if (typeof checkPortalReady.attempts === 'undefined') {
                        checkPortalReady.attempts = 0;
                    }
                    
                    if (checkPortalReady.attempts < 10) {
                        checkPortalReady.attempts++;
                        setTimeout(checkPortalReady, 500);
                    } else {
                        console.warn('Grid4: Portal elements not found after 10 attempts');
                    }
                }
            };
            
            checkPortalReady();
        });
        
        // Expose minimal, safe API globally
        window.Grid4 = {
            version: '3.0',
            reinitialize: initializeAll
        };
    }
    
    // Start the initialization process
    waitForJQuery(initializeGrid4Portal);
    
})();