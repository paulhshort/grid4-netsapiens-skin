/**
 * Grid4 Alpine Complete JS Bundle v2
 * Version: 2.0.0
 * Build Date: 2025-01-06
 * 
 * FIXED: Component registration timing
 */

(function() {
    'use strict';
    
    console.log('Grid4 Alpine.js Loader v2 starting...');
    
    // Define all components FIRST, before Alpine loads
    const Grid4Components = {
        // Modal Component
        modal: (options = {}) => ({
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
        }),
        
        // Dropdown Component
        dropdown: (options = {}) => ({
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
        }),
        
        // Contact Form Component
        contactForm: (contact = {}) => ({
            form: {
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                work_phone: contact.work_phone || '',
                cell_phone: contact.cell_phone || '',
                home_phone: contact.home_phone || '',
                fax: contact.fax || '',
                email: contact.email || '',
                company: contact.company || '',
                title: contact.title || ''
            },
            errors: {},
            loading: false,
            
            validateField(field) {
                const value = this.form[field];
                delete this.errors[field];
                
                if (['first_name', 'last_name'].includes(field) && !value) {
                    this.errors[field] = 'This field is required';
                    return false;
                }
                
                if (field.includes('phone') || field === 'fax') {
                    if (value && !this.$validatePhone(value)) {
                        this.errors[field] = 'Please enter a valid phone number';
                        return false;
                    }
                }
                
                if (field === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        this.errors[field] = 'Please enter a valid email address';
                        return false;
                    }
                }
                
                return true;
            },
            
            validateForm() {
                let isValid = true;
                Object.keys(this.form).forEach(field => {
                    if (!this.validateField(field)) {
                        isValid = false;
                    }
                });
                return isValid;
            },
            
            async submitForm() {
                if (!this.validateForm()) {
                    this.$store.notifications.add('Please fix the errors in the form', 'error');
                    return;
                }
                
                this.loading = true;
                
                try {
                    const isEdit = contact.id ? true : false;
                    const url = isEdit ? `/contacts/edit/${contact.id}` : '/contacts/add';
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify(this.form)
                    });
                    
                    if (response.ok) {
                        this.$store.notifications.add(
                            isEdit ? 'Contact updated successfully' : 'Contact created successfully',
                            'success'
                        );
                        
                        setTimeout(() => {
                            window.location.href = '/contacts';
                        }, 1000);
                    } else {
                        throw new Error('Server error');
                    }
                } catch (error) {
                    this.$store.notifications.add('Failed to save contact. Please try again.', 'error');
                    console.error('Form submission error:', error);
                } finally {
                    this.loading = false;
                }
            }
        }),
        
        // Data Table Component
        dataTable: (config = {}) => ({
            data: [],
            columns: config.columns || [],
            loading: true,
            search: '',
            sortColumn: '',
            sortDirection: 'asc',
            currentPage: 1,
            perPage: config.perPage || 25,
            selectedRows: [],
            
            async init() {
                if (config.url) {
                    await this.loadData();
                } else if (config.data) {
                    this.data = config.data;
                    this.loading = false;
                }
            },
            
            async loadData() {
                this.loading = true;
                
                try {
                    const response = await fetch(config.url);
                    const result = await response.json();
                    this.data = Array.isArray(result) ? result : result.data || [];
                } catch (error) {
                    console.error('Failed to load data:', error);
                    this.$store.notifications.add('Failed to load data', 'error');
                } finally {
                    this.loading = false;
                }
            },
            
            get filteredData() {
                if (!this.search) return this.data;
                
                const searchLower = this.search.toLowerCase();
                return this.data.filter(row => {
                    return this.columns.some(col => {
                        const value = this.getCellValue(row, col);
                        return value && value.toString().toLowerCase().includes(searchLower);
                    });
                });
            },
            
            get sortedData() {
                if (!this.sortColumn) return this.filteredData;
                
                return [...this.filteredData].sort((a, b) => {
                    const aVal = this.getCellValue(a, this.getColumn(this.sortColumn));
                    const bVal = this.getCellValue(b, this.getColumn(this.sortColumn));
                    
                    let comparison = 0;
                    if (aVal > bVal) comparison = 1;
                    if (aVal < bVal) comparison = -1;
                    
                    return this.sortDirection === 'asc' ? comparison : -comparison;
                });
            },
            
            get paginatedData() {
                const start = (this.currentPage - 1) * this.perPage;
                return this.sortedData.slice(start, start + this.perPage);
            },
            
            get totalPages() {
                return Math.ceil(this.sortedData.length / this.perPage);
            },
            
            getCellValue(row, column) {
                if (column.value) {
                    return typeof column.value === 'function' ? column.value(row) : row[column.value];
                }
                return row[column.key];
            },
            
            getColumn(key) {
                return this.columns.find(col => col.key === key);
            },
            
            sort(columnKey) {
                if (this.sortColumn === columnKey) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = columnKey;
                    this.sortDirection = 'asc';
                }
                this.currentPage = 1;
            }
        })
    };
    
    // Alpine loader configuration
    const ALPINE_CDN = 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js';
    const PLUGINS = {
        focus: 'https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.13.5/dist/cdn.min.js',
        persist: 'https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.13.5/dist/cdn.min.js',
        intersect: 'https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.13.5/dist/cdn.min.js'
    };
    
    // Wait for jQuery
    function waitForJQuery(callback) {
        if (typeof window.jQuery !== 'undefined' && window.jQuery.fn) {
            callback();
        } else {
            setTimeout(() => waitForJQuery(callback), 50);
        }
    }
    
    // Load script helper
    function loadScript(src, onload, onerror) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        
        if (onload) script.onload = onload;
        if (onerror) script.onerror = onerror;
        
        document.head.appendChild(script);
        return script;
    }
    
    // Register components with Alpine
    function registerComponents() {
        if (!window.Alpine) {
            console.error('Alpine not available for component registration');
            return;
        }
        
        // Register all components
        Object.keys(Grid4Components).forEach(name => {
            window.Alpine.data(name, Grid4Components[name]);
            console.log(`Registered Alpine component: ${name}`);
        });
        
        // Register stores
        window.Alpine.store('netsapiens', {
            user: null,
            domain: null,
            permissions: [],
            
            async init() {
                try {
                    const response = await fetch('/users/current.json', {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        this.user = data.user;
                        this.domain = data.domain;
                        this.permissions = data.permissions || [];
                    }
                } catch (error) {
                    console.error('Failed to load user data:', error);
                }
            },
            
            hasPermission(permission) {
                return this.permissions.includes(permission);
            }
        });
        
        window.Alpine.store('notifications', {
            items: [],
            
            add(message, type = 'info', duration = 5000) {
                const id = Date.now();
                const notification = { id, message, type };
                this.items.push(notification);
                
                if (duration > 0) {
                    setTimeout(() => this.remove(id), duration);
                }
                
                return id;
            },
            
            remove(id) {
                this.items = this.items.filter(item => item.id !== id);
            },
            
            clear() {
                this.items = [];
            }
        });
        
        // Register magic properties
        window.Alpine.magic('formatPhone', () => {
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
        
        window.Alpine.magic('validatePhone', () => {
            return (phone) => {
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                return phoneRegex.test(phone);
            };
        });
        
        console.log('Grid4 Alpine components registered successfully');
    }
    
    // Initialize Alpine with components
    function initializeAlpine() {
        // Set up Alpine to not auto-start
        window.Alpine = window.Alpine || {};
        window.Alpine.start = window.Alpine.start || function() {};
        
        // Add defer attribute to prevent auto-initialization
        window.deferLoadingAlpine = function(callback) {
            window.Alpine ? callback(window.Alpine) : document.addEventListener('alpine:init', callback);
        };
        
        // Load Alpine.js
        loadScript(ALPINE_CDN, () => {
            console.log('Alpine.js loaded successfully');
            
            // Register components BEFORE starting Alpine
            registerComponents();
            
            // Initialize stores
            if (window.Alpine.store) {
                window.Alpine.store('netsapiens').init();
            }
            
            // Start Alpine
            window.Alpine.start();
            console.log('Alpine.js started with Grid4 components');
            
        }, () => {
            console.error('Failed to load Alpine.js');
        });
    }
    
    // Start the initialization process
    waitForJQuery(() => {
        console.log('jQuery detected, initializing Alpine.js framework...');
        initializeAlpine();
    });
    
    // Expose components globally for debugging
    window.Grid4Alpine = {
        components: Grid4Components,
        registerComponents: registerComponents
    };
    
})();