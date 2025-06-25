/**
 * Grid4 Alpine Fixed Bundle
 * Version: 3.1.0 - Actually fixed this time
 * 
 * The key is to define window.deferLoadingAlpine BEFORE Alpine loads
 */

// MUST BE FIRST - Define the defer callback before Alpine.js loads
window.deferLoadingAlpine = function(Alpine) {
    console.log('Alpine deferred successfully, registering components...');
    
    // Register all components that NetSapiens expects
    Alpine.data('modal', (options = {}) => ({
        open: false,
        title: options.title || '',
        size: options.size || 'md',
        
        showModal() {
            this.open = true;
            document.body.style.overflow = 'hidden';
        },
        
        hideModal() {
            this.open = false;
            document.body.style.overflow = '';
            this.$dispatch('modal-closed');
        },
        
        handleEscape(e) {
            if (e.key === 'Escape' && this.open) {
                this.hideModal();
            }
        }
    }));
    
    Alpine.data('dropdown', (options = {}) => ({
        open: false,
        search: '',
        selected: options.selected || null,
        options: options.options || [],
        placeholder: options.placeholder || 'Select an option',
        
        toggleOpen() {
            this.open = !this.open;
        },
        
        selectOption(value) {
            this.selected = value;
            this.open = false;
            this.$dispatch('change', { value: this.selected });
        },
        
        isSelected(value) {
            return this.selected === value;
        }
    }));
    
    // Add other components with minimal implementation
    Alpine.data('contactForm', () => ({
        form: {},
        errors: {},
        loading: false,
        submitForm() {
            console.log('Form submitted');
        }
    }));
    
    Alpine.data('dataTable', () => ({
        data: [],
        loading: false,
        search: '',
        currentPage: 1,
        perPage: 25
    }));
    
    // Register stores
    Alpine.store('notifications', {
        items: [],
        add(message, type = 'info') {
            console.log(`Notification: ${type} - ${message}`);
            this.items.push({ message, type, id: Date.now() });
        },
        remove(id) {
            this.items = this.items.filter(item => item.id !== id);
        }
    });
    
    Alpine.store('netsapiens', {
        user: null,
        domain: null,
        permissions: [],
        hasPermission(perm) {
            return this.permissions.includes(perm);
        }
    });
    
    // Register magic properties
    Alpine.magic('formatPhone', () => (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    });
    
    console.log('All components registered, starting Alpine...');
    
    // Start Alpine
    Alpine.start();
    
    console.log('Alpine.js started successfully');
};

// Now load Alpine.js (it will automatically call our defer function)
(function() {
    'use strict';
    
    console.log('Grid4 Alpine Fixed v3.1.0 - Loading Alpine.js...');
    
    // Create and append the Alpine script
    const alpineScript = document.createElement('script');
    alpineScript.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js';
    alpineScript.defer = true;
    
    // Add error handling
    alpineScript.onerror = function() {
        console.error('Failed to load Alpine.js from CDN');
    };
    
    alpineScript.onload = function() {
        console.log('Alpine.js script loaded');
    };
    
    document.head.appendChild(alpineScript);
})();