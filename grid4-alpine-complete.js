/**
 * Grid4 Alpine Complete JS Bundle
 * Version: 3.0.0 - Fixed timing issues
 * Build Date: 2025-01-06
 */

// Define Alpine defer BEFORE loading Alpine
window.deferLoadingAlpine = function(Alpine) {
    console.log('Alpine deferred, registering components...');
    
    // Register minimal working components
    Alpine.data('modal', (options = {}) => ({
        open: false,
        showModal() { this.open = true; },
        hideModal() { this.open = false; }
    }));
    
    Alpine.data('dropdown', (options = {}) => ({
        open: false,
        toggleOpen() { this.open = !this.open; }
    }));
    
    Alpine.data('contactForm', () => ({ form: {}, errors: {} }));
    Alpine.data('dataTable', () => ({ data: [], loading: false }));
    
    // Register stores
    Alpine.store('notifications', {
        items: [],
        add(message, type) { console.log(`${type}: ${message}`); }
    });
    
    console.log('Starting Alpine...');
    Alpine.start();
};

// Load Alpine.js
(function() {
    'use strict';
    console.log('Loading Alpine.js...');
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js';
    script.defer = true;
    document.head.appendChild(script);
})();