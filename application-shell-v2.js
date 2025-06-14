/* Grid4 Application Shell v2.0 - Defensive Implementation
 * Implements Gemini AI's Observer-Based Hydration pattern
 * Resilient against legacy app timing and provides centralized entry/exit points
 */

(function(window, document, $) {
    'use strict';

    // Create the Application Shell namespace
    window.ZenAI = window.ZenAI || {
        version: '2.0.0',
        initialized: false,
        hydrated: false,
        modules: {},
        observers: [],
        
        // Centralized configuration
        config: {
            // Selectors for different page types
            selectors: {
                userTables: '#users-table, .users-table table, table[id*="user"]',
                domainTables: '#domains-table, .domains-table table, table[id*="domain"]',
                inventoryTables: '#inventory-table, .inventory-table table, table[id*="inventory"]',
                callTables: '#calls-table, .calls-table table, table[id*="call"]',
                genericTables: 'table:not(.g4-enhanced):not([class*="calendar"])',
                mainContent: '#content, .main-content, .content-wrapper',
                navigation: '#navigation, .navigation, .nav-sidebar'
            },
            
            // Feature flags
            features: {
                commandPalette: true,
                statefulUI: true,
                modernTables: true,
                optimisticUpdates: true,
                performanceMonitoring: true
            },
            
            // Performance settings
            performance: {
                observerThrottle: 100, // ms
                hydrateDelay: 50, // ms
                maxRetries: 3
            }
        },

        // Main initialization logic with defensive error handling
        init: function() {
            if (this.initialized) {
                console.warn('🔄 ZenAI: Already initialized, skipping...');
                return;
            }
            
            try {
                console.log('🚀 ZenAI Application Shell v2.0 initializing...');
                
                // Store discovery results if available
                this.loadDiscoveryResults();
                
                // Initialize core modules
                this.initializeCore();
                
                // Setup observer-based hydration
                this.setupObservers();
                
                // Setup global error handling
                this.setupErrorHandling();
                
                // Mark as initialized
                this.initialized = true;
                
                console.log('✅ ZenAI: Application Shell initialized successfully');
                
                // Dispatch initialization event
                this.dispatch('zenai:initialized', { version: this.version });
                
            } catch (error) {
                console.error('❌ ZenAI: Failed to initialize Application Shell:', error);
                this.handleCriticalError(error);
            }
        },

        // Load discovery results from previous probe
        loadDiscoveryResults: function() {
            try {
                const results = sessionStorage.getItem('g4-discovery-results');
                if (results) {
                    this.discoveryResults = JSON.parse(results);
                    console.log('📋 ZenAI: Loaded discovery results', this.discoveryResults);
                } else {
                    console.log('⚠️ ZenAI: No discovery results found - run discovery-snippet.js first');
                }
            } catch (error) {
                console.warn('⚠️ ZenAI: Could not load discovery results:', error);
            }
        },

        // Initialize core modules that don't require DOM elements
        initializeCore: function() {
            try {
                // Initialize event system
                this.initializeEventSystem();
                
                // Initialize performance monitoring
                if (this.config.features.performanceMonitoring) {
                    this.initializePerformanceMonitoring();
                }
                
                // Initialize command palette (if supported)
                if (this.config.features.commandPalette) {
                    this.initializeCommandPalette();
                }
                
                // Initialize stateful UI (localStorage-based preferences)
                if (this.config.features.statefulUI) {
                    this.initializeStatefulUI();
                }
                
                console.log('🎯 ZenAI: Core modules initialized');
                
            } catch (error) {
                console.error('❌ ZenAI: Error initializing core modules:', error);
            }
        },

        // Setup observer-based hydration for target elements
        setupObservers: function() {
            try {
                // Create main DOM observer
                const mainObserver = new MutationObserver(this.throttle((mutations) => {
                    this.handleDOMChanges(mutations);
                }, this.config.performance.observerThrottle));
                
                // Start observing
                mainObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: false // Optimize by not watching attributes
                });
                
                this.observers.push(mainObserver);
                
                // Check for existing elements
                this.checkExistingElements();
                
                console.log('👁️ ZenAI: Observer-based hydration active');
                
            } catch (error) {
                console.error('❌ ZenAI: Error setting up observers:', error);
            }
        },

        // Handle DOM changes from MutationObserver
        handleDOMChanges: function(mutations) {
            let needsHydration = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if this node or its children contain hydration targets
                            if (this.containsHydrationTargets(node)) {
                                needsHydration = true;
                            }
                        }
                    });
                }
            });
            
            if (needsHydration) {
                // Debounce hydration calls
                clearTimeout(this._hydrateTimeout);
                this._hydrateTimeout = setTimeout(() => {
                    this.performHydration();
                }, this.config.performance.hydrateDelay);
            }
        },

        // Check if node contains elements we want to hydrate
        containsHydrationTargets: function(node) {
            if (!node.querySelector) return false;
            
            return Object.values(this.config.selectors).some(selector => {
                try {
                    return node.matches && node.matches(selector) || 
                           node.querySelector(selector);
                } catch (e) {
                    return false; // Invalid selector
                }
            });
        },

        // Check for existing elements on page load
        checkExistingElements: function() {
            setTimeout(() => {
                this.performHydration();
            }, this.config.performance.hydrateDelay);
        },

        // Main hydration logic - where we enhance existing elements
        performHydration: function() {
            if (this.hydrated) {
                // Re-hydration for new elements
                console.log('🔄 ZenAI: Re-hydrating new elements...');
            } else {
                console.log('💧 ZenAI: Performing initial hydration...');
                this.hydrated = true;
            }
            
            try {
                // Hydrate tables if modern tables module is enabled
                if (this.config.features.modernTables && this.modules.modernTables) {
                    this.hydrateModernTables();
                }
                
                // Hydrate consistency engine if available
                if (this.modules.consistencyEngine) {
                    this.hydrateConsistencyEngine();
                }
                
                // Apply stateful UI preferences
                if (this.config.features.statefulUI) {
                    this.applyStatefulPreferences();
                }
                
                // Dispatch hydration event
                this.dispatch('zenai:hydrated', { 
                    timestamp: Date.now(),
                    elements: this.getHydratedElementCount()
                });
                
            } catch (error) {
                console.error('❌ ZenAI: Error during hydration:', error);
                this.handleHydrationError(error);
            }
        },

        // Hydrate modern table enhancements
        hydrateModernTables: function() {
            try {
                const tables = document.querySelectorAll(this.config.selectors.genericTables);
                
                if (tables.length > 0 && window.ModernDataTables) {
                    console.log(`📊 ZenAI: Hydrating ${tables.length} tables with modern enhancements`);
                    window.ModernDataTables.refresh();
                }
            } catch (error) {
                console.error('❌ ZenAI: Error hydrating tables:', error);
            }
        },

        // Hydrate consistency engine
        hydrateConsistencyEngine: function() {
            try {
                if (window.ConsistencyEngineV2) {
                    window.ConsistencyEngineV2.refresh();
                    console.log('✨ ZenAI: Consistency engine hydrated');
                }
            } catch (error) {
                console.error('❌ ZenAI: Error hydrating consistency engine:', error);
            }
        },

        // Initialize event system for module communication
        initializeEventSystem: function() {
            this._eventListeners = new Map();
            
            // Add event methods
            this.on = (event, callback) => {
                if (!this._eventListeners.has(event)) {
                    this._eventListeners.set(event, []);
                }
                this._eventListeners.get(event).push(callback);
            };
            
            this.off = (event, callback) => {
                if (this._eventListeners.has(event)) {
                    const listeners = this._eventListeners.get(event);
                    const index = listeners.indexOf(callback);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            };
            
            this.dispatch = (event, data) => {
                if (this._eventListeners.has(event)) {
                    this._eventListeners.get(event).forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            console.error(`❌ ZenAI: Error in event listener for ${event}:`, error);
                        }
                    });
                }
            };
        },

        // Initialize performance monitoring
        initializePerformanceMonitoring: function() {
            this.performance = {
                startTime: performance.now(),
                marks: new Map(),
                measures: new Map()
            };
            
            // Mark initialization
            this.mark('init-start');
            
            // Monitor page load
            if (document.readyState === 'complete') {
                this.mark('page-loaded');
            } else {
                window.addEventListener('load', () => {
                    this.mark('page-loaded');
                });
            }
        },

        // Initialize command palette
        initializeCommandPalette: function() {
            // Will be implemented when module is loaded
            console.log('🎯 ZenAI: Command palette initialization deferred to module load');
        },

        // Initialize stateful UI (localStorage preferences)
        initializeStatefulUI: function() {
            this.state = {
                preferences: this.loadPreferences(),
                tables: new Map(),
                ui: new Map()
            };
            
            console.log('💾 ZenAI: Stateful UI initialized', this.state.preferences);
        },

        // Load user preferences from localStorage
        loadPreferences: function() {
            try {
                const stored = localStorage.getItem('zenai-preferences');
                return stored ? JSON.parse(stored) : {
                    theme: 'auto',
                    tablePageSize: 50,
                    enableAnimations: true,
                    enableSounds: false,
                    lastUsedFeatures: []
                };
            } catch (error) {
                console.warn('⚠️ ZenAI: Could not load preferences:', error);
                return {};
            }
        },

        // Save preferences to localStorage
        savePreferences: function() {
            try {
                localStorage.setItem('zenai-preferences', JSON.stringify(this.state.preferences));
            } catch (error) {
                console.warn('⚠️ ZenAI: Could not save preferences:', error);
            }
        },

        // Apply stateful preferences to current page
        applyStatefulPreferences: function() {
            // Implementation will depend on specific features
            console.log('🎨 ZenAI: Applying stateful preferences...');
        },

        // Setup global error handling
        setupErrorHandling: function() {
            // Catch unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                if (event.reason && event.reason.message && 
                    event.reason.message.includes('ZenAI')) {
                    console.error('❌ ZenAI: Unhandled promise rejection:', event.reason);
                    event.preventDefault(); // Prevent default error handling
                }
            });
            
            // Catch global errors
            const originalError = window.onerror;
            window.onerror = (message, source, lineno, colno, error) => {
                if (source && source.includes('zenai') || 
                    message && message.includes('ZenAI')) {
                    console.error('❌ ZenAI: Global error:', { message, source, lineno, colno, error });
                }
                
                // Call original handler if it exists
                if (originalError) {
                    return originalError(message, source, lineno, colno, error);
                }
            };
        },

        // Handle critical errors that could break the application
        handleCriticalError: function(error) {
            console.error('🚨 ZenAI: CRITICAL ERROR - Initiating safe shutdown:', error);
            
            try {
                // Attempt to clean up
                this.destroy();
                
                // Show user-friendly error message
                this.showErrorNotification('Grid4 enhancements encountered an error and have been disabled to prevent issues.');
                
            } catch (cleanupError) {
                console.error('❌ ZenAI: Error during cleanup:', cleanupError);
            }
        },

        // Handle hydration-specific errors
        handleHydrationError: function(error) {
            console.error('⚠️ ZenAI: Hydration error (non-critical):', error);
            
            // Try to continue with other features
            this.dispatch('zenai:hydration-error', { error });
        },

        // Utility: throttle function calls
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Performance marking
        mark: function(name) {
            try {
                performance.mark(`zenai-${name}`);
                this.performance.marks.set(name, performance.now());
            } catch (error) {
                // Fallback for browsers without performance.mark
                this.performance.marks.set(name, Date.now());
            }
        },

        // Get count of hydrated elements
        getHydratedElementCount: function() {
            return document.querySelectorAll('.g4-enhanced').length;
        },

        // Show error notification to user
        showErrorNotification: function(message) {
            try {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed; top: 20px; right: 20px; z-index: 999999;
                    padding: 15px 20px; background: #f44336; color: white;
                    border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 10000);
                
            } catch (error) {
                // If we can't even show an error message, just log it
                console.error('Could not show error notification:', error);
            }
        },

        // Cleanup and destroy method
        destroy: function() {
            try {
                console.log('💥 ZenAI: Shutting down Application Shell...');
                
                // Clear all observers
                this.observers.forEach(observer => {
                    try {
                        observer.disconnect();
                    } catch (e) {
                        console.warn('Warning: Could not disconnect observer:', e);
                    }
                });
                this.observers = [];
                
                // Clear timeouts
                if (this._hydrateTimeout) {
                    clearTimeout(this._hydrateTimeout);
                }
                
                // Call destroy on all modules
                Object.values(this.modules).forEach(module => {
                    if (module && typeof module.destroy === 'function') {
                        try {
                            module.destroy();
                        } catch (e) {
                            console.warn('Warning: Error destroying module:', e);
                        }
                    }
                });
                
                // Clear event listeners
                if (this._eventListeners) {
                    this._eventListeners.clear();
                }
                
                // Mark as uninitialized
                this.initialized = false;
                this.hydrated = false;
                
                console.log('✅ ZenAI: Application Shell shutdown complete');
                
            } catch (error) {
                console.error('❌ ZenAI: Error during shutdown:', error);
            }
        },

        // Public API for getting status
        getStatus: function() {
            return {
                version: this.version,
                initialized: this.initialized,
                hydrated: this.hydrated,
                moduleCount: Object.keys(this.modules).length,
                enhancedElements: this.getHydratedElementCount(),
                observerCount: this.observers.length,
                discoveryResults: this.discoveryResults || null,
                preferences: this.state ? this.state.preferences : null
            };
        }
    };

    // Auto-initialize with defensive error handling
    try {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.ZenAI.init();
            });
        } else {
            // DOM is already ready
            window.ZenAI.init();
        }
    } catch (error) {
        console.error('❌ ZenAI: Failed to set up initialization:', error);
    }

    // Also expose on g4c namespace if available
    if (window.g4c) {
        window.g4c.ZenAI = window.ZenAI;
    }

    console.log('📦 ZenAI Application Shell v2.0 loaded - Observer-based hydration ready');

})(window, document, jQuery);