/**
 * Grid4 Alpine.js Loader
 * 
 * This file handles the loading and initialization of Alpine.js
 * in the NetSapiens portal environment, ensuring compatibility
 * with the existing jQuery-based system.
 */

(function() {
    'use strict';
    
    // Configuration
    const ALPINE_VERSION = '3.13.5';
    const ALPINE_CDN = `https://cdn.jsdelivr.net/npm/alpinejs@${ALPINE_VERSION}/dist/cdn.min.js`;
    const PLUGINS = {
        persist: `https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.13.5/dist/cdn.min.js`,
        focus: `https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.13.5/dist/cdn.min.js`,
        intersect: `https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.13.5/dist/cdn.min.js`
    };
    
    // Check if Alpine is already loaded
    if (window.Alpine) {
        console.log('Alpine.js already loaded');
        return;
    }
    
    // Create a queue for components that need to wait for Alpine
    window.AlpineQueue = window.AlpineQueue || [];
    
    /**
     * Load a script dynamically
     */
    function loadScript(src, onLoad, onError) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        
        if (onLoad) {
            script.onload = onLoad;
        }
        
        if (onError) {
            script.onerror = onError;
        }
        
        document.head.appendChild(script);
        return script;
    }
    
    /**
     * Wait for jQuery to be available
     */
    function waitForJQuery(callback) {
        if (typeof jQuery !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForJQuery(callback), 50);
        }
    }
    
    /**
     * Initialize Alpine.js plugins
     */
    function initializePlugins() {
        // Load persist plugin for local storage
        loadScript(PLUGINS.persist, () => {
            if (window.Alpine && window.AlpinePersist) {
                Alpine.plugin(AlpinePersist);
                console.log('Alpine Persist plugin loaded');
            }
        });
        
        // Load focus plugin for focus management
        loadScript(PLUGINS.focus, () => {
            if (window.Alpine && window.AlpineFocus) {
                Alpine.plugin(AlpineFocus);
                console.log('Alpine Focus plugin loaded');
            }
        });
        
        // Load intersect plugin for scroll-based actions
        loadScript(PLUGINS.intersect, () => {
            if (window.Alpine && window.AlpineIntersect) {
                Alpine.plugin(AlpineIntersect);
                console.log('Alpine Intersect plugin loaded');
            }
        });
    }
    
    /**
     * Set up Alpine.js configuration
     */
    function configureAlpine() {
        // Configure Alpine before it initializes
        document.addEventListener('alpine:init', () => {
            console.log('Alpine.js initializing...');
            
            // Set up global Alpine configuration
            Alpine.magic('jQuery', () => jQuery);
            Alpine.magic('$', () => jQuery);
            
            // Add debugging in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                Alpine.magic('log', () => console.log);
            }
            
            // Process any queued components
            if (window.AlpineQueue && window.AlpineQueue.length > 0) {
                window.AlpineQueue.forEach(fn => fn(Alpine));
                window.AlpineQueue = [];
            }
        });
        
        // Listen for Alpine initialized event
        document.addEventListener('alpine:initialized', () => {
            console.log('Alpine.js initialized successfully');
            
            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('alpine:ready', {
                detail: { Alpine: window.Alpine }
            }));
        });
    }
    
    /**
     * Load Grid4 Alpine components
     */
    function loadGrid4Components() {
        const componentScript = document.createElement('script');
        componentScript.src = '/js/grid4-alpine-components.js';
        componentScript.defer = true;
        
        componentScript.onload = () => {
            console.log('Grid4 Alpine components loaded');
        };
        
        componentScript.onerror = () => {
            console.error('Failed to load Grid4 Alpine components');
        };
        
        document.head.appendChild(componentScript);
    }
    
    /**
     * Main initialization function
     */
    function initializeAlpineFramework() {
        console.log('Initializing Alpine.js framework...');
        
        // Configure Alpine before loading
        configureAlpine();
        
        // Load Alpine.js
        const alpineScript = loadScript(ALPINE_CDN, () => {
            console.log('Alpine.js core loaded');
            
            // Load plugins after Alpine is available
            initializePlugins();
            
            // Load Grid4 components
            loadGrid4Components();
            
            // Initialize Alpine (it auto-starts, but we can force it)
            if (window.Alpine && !window.Alpine.version) {
                window.Alpine.start();
            }
        }, () => {
            console.error('Failed to load Alpine.js from CDN');
            
            // Fallback: try alternate CDN
            const fallbackCDN = 'https://unpkg.com/alpinejs@3.13.5/dist/cdn.min.js';
            loadScript(fallbackCDN, () => {
                console.log('Alpine.js loaded from fallback CDN');
                initializePlugins();
                loadGrid4Components();
            });
        });
    }
    
    /**
     * Integration with NetSapiens portal
     */
    function integrateWithPortal() {
        // Wait for both jQuery and DOM to be ready
        waitForJQuery(() => {
            jQuery(document).ready(() => {
                // Add Alpine.js attributes to existing elements
                enhanceExistingElements();
                
                // Set up event bridges between jQuery and Alpine
                setupEventBridges();
            });
        });
    }
    
    /**
     * Enhance existing portal elements with Alpine.js
     */
    function enhanceExistingElements() {
        // Add Alpine data attributes to forms
        jQuery('form.contact-form').each(function() {
            if (!this.hasAttribute('x-data')) {
                jQuery(this).attr('x-data', 'contactForm()');
            }
        });
        
        // Convert modals
        jQuery('.modal').each(function() {
            if (!this.hasAttribute('x-data')) {
                const modalId = this.id || 'modal-' + Math.random().toString(36).substr(2, 9);
                jQuery(this).attr('x-data', `modal({ id: '${modalId}' })`);
            }
        });
        
        // Convert dropdowns
        jQuery('.dropdown, select.form-control').each(function() {
            if (!this.hasAttribute('x-data') && !jQuery(this).hasClass('no-alpine')) {
                jQuery(this).attr('x-data', 'dropdown()');
            }
        });
    }
    
    /**
     * Set up event bridges between jQuery and Alpine.js
     */
    function setupEventBridges() {
        // Bridge jQuery events to Alpine
        jQuery(document).on('show.bs.modal', '.modal[x-data]', function() {
            const alpineData = Alpine.$data(this);
            if (alpineData && alpineData.showModal) {
                alpineData.showModal();
            }
        });
        
        jQuery(document).on('hide.bs.modal', '.modal[x-data]', function() {
            const alpineData = Alpine.$data(this);
            if (alpineData && alpineData.hideModal) {
                alpineData.hideModal();
            }
        });
        
        // Bridge Alpine events to jQuery
        document.addEventListener('alpine:modal-closed', (event) => {
            const modal = event.target.closest('.modal');
            if (modal) {
                jQuery(modal).modal('hide');
            }
        });
    }
    
    /**
     * Start the initialization process
     */
    function start() {
        // Check if we should wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initializeAlpineFramework();
                integrateWithPortal();
            });
        } else {
            // DOM is already ready
            initializeAlpineFramework();
            integrateWithPortal();
        }
    }
    
    // Public API
    window.Grid4Alpine = {
        loadScript: loadScript,
        waitForAlpine: function(callback) {
            if (window.Alpine) {
                callback(window.Alpine);
            } else {
                window.AlpineQueue = window.AlpineQueue || [];
                window.AlpineQueue.push(callback);
            }
        },
        enhance: enhanceExistingElements
    };
    
    // Start initialization
    start();
    
})();