/**
 * Grid4 Alpine Simple - Just make it work
 * Version: 1.0.0
 */

// First, we define the defer function BEFORE Alpine loads
window.deferLoadingAlpine = function(Alpine) {
    // Define minimal components that NetSapiens expects
    Alpine.data('modal', () => ({
        open: false,
        showModal() { this.open = true; },
        hideModal() { this.open = false; }
    }));
    
    Alpine.data('dropdown', () => ({
        open: false,
        toggleOpen() { this.open = !this.open; }
    }));
    
    // Start Alpine
    Alpine.start();
};

// Now load Alpine.js
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js';
    script.defer = true;
    document.head.appendChild(script);
})();