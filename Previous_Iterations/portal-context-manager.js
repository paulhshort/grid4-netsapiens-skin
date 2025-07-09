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

})(window, document, jQuery);