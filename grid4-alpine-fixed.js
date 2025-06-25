/**
 * Grid4 Alpine Fixed Bundle
 * Version: 3.0.0
 * 
 * This version ensures components are registered BEFORE Alpine starts
 */

(function() {
    'use strict';
    
    console.log('Grid4 Alpine Fixed - Preventing Alpine auto-start...');
    
    // CRITICAL: Prevent Alpine from auto-starting by setting this BEFORE it loads
    window.deferLoadingAlpine = function(Alpine) {
        console.log('Alpine deferred, registering Grid4 components...');
        
        // Register all components
        Alpine.data('modal', (options = {}) => ({
            open: false,
            title: options.title || '',
            size: options.size || 'md',
            
            showModal() {
                this.open = true;
                document.body.style.overflow = 'hidden';
                this.$nextTick(() => {
                    const focusable = this.$el.querySelector('[autofocus]');
                    if (focusable) focusable.focus();
                });
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
            multiple: options.multiple || false,
            options: options.options || [],
            placeholder: options.placeholder || 'Select an option',
            
            init() {
                if (options.url) {
                    this.loadOptions();
                }
            },
            
            async loadOptions() {
                try {
                    const response = await fetch(options.url);
                    this.options = await response.json();
                } catch (error) {
                    console.error('Failed to load options:', error);
                }
            },
            
            get filteredOptions() {
                if (!this.search) return this.options;
                const searchLower = this.search.toLowerCase();
                return this.options.filter(option => 
                    option.label.toLowerCase().includes(searchLower) ||
                    (option.value && option.value.toString().toLowerCase().includes(searchLower))
                );
            },
            
            get selectedLabel() {
                if (!this.selected) return this.placeholder;
                if (this.multiple) {
                    const count = this.selected.length;
                    return count === 0 ? this.placeholder : `${count} selected`;
                }
                const option = this.options.find(o => o.value === this.selected);
                return option ? option.label : this.placeholder;
            },
            
            selectOption(option) {
                if (this.multiple) {
                    if (!Array.isArray(this.selected)) {
                        this.selected = [];
                    }
                    const index = this.selected.indexOf(option.value);
                    if (index > -1) {
                        this.selected.splice(index, 1);
                    } else {
                        this.selected.push(option.value);
                    }
                } else {
                    this.selected = option.value;
                    this.open = false;
                }
                this.$dispatch('change', { value: this.selected });
            },
            
            isSelected(option) {
                if (this.multiple) {
                    return this.selected && this.selected.includes(option.value);
                }
                return this.selected === option.value;
            },
            
            toggleOpen() {
                this.open = !this.open;
                if (this.open) {
                    this.$nextTick(() => {
                        this.$refs.search?.focus();
                    });
                }
            }
        }));
        
        // Add other components as simple functions for now
        Alpine.data('contactForm', () => ({
            form: {},
            errors: {},
            loading: false
        }));
        
        Alpine.data('dataTable', () => ({
            data: [],
            loading: false
        }));
        
        // Register stores
        Alpine.store('notifications', {
            items: [],
            add(message, type = 'info') {
                console.log(`Notification: ${type} - ${message}`);
            }
        });
        
        // Register magic helpers
        Alpine.magic('formatPhone', () => {
            return (phone) => {
                if (!phone) return '';
                const cleaned = phone.replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
                }
                return phone;
            };
        });
        
        console.log('Components registered, starting Alpine...');
        
        // NOW start Alpine
        Alpine.start();
    };
    
    // Load Alpine.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js';
    script.defer = true;
    document.head.appendChild(script);
    
    console.log('Alpine.js script added to page');
    
})();