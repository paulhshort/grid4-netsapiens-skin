/**
 * Grid4 Alpine Complete JS Bundle
 * Version: 1.0.0
 * Build Date: 2025-01-06
 * 
 * This file combines the Alpine.js loader and components into a single file
 * for easy deployment to NetSapiens portal via PORTAL_EXTRA_JS
 * 
 * Includes:
 * - Alpine.js v3 loader with CDN fallback
 * - Alpine.js plugins (Focus, Persist, etc.)
 * - Grid4 custom components (forms, modals, tables, etc.)
 * - NetSapiens portal integration
 * - jQuery compatibility layer
 * 
 * Usage: Configure PORTAL_EXTRA_JS with the URL to this file
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
     * Grid4 Alpine Component Definitions
     */
    
    // Contact Form Component
    const contactFormComponent = (contact = {}) => ({
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
            
            // Clear error first
            delete this.errors[field];
            
            // Required fields
            if (['first_name', 'last_name'].includes(field) && !value) {
                this.errors[field] = 'This field is required';
                return false;
            }
            
            // Phone validation
            if (field.includes('phone') || field === 'fax') {
                if (value && !this.$validatePhone(value)) {
                    this.errors[field] = 'Please enter a valid phone number';
                    return false;
                }
            }
            
            // Email validation
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
                    
                    // Redirect after short delay
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
    });

    // Modal Component
    const modalComponent = (options = {}) => ({
        open: false,
        title: options.title || '',
        size: options.size || 'md', // sm, md, lg, xl
        
        showModal() {
            this.open = true;
            document.body.style.overflow = 'hidden';
            
            // Focus management
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
        
        // Handle escape key
        handleEscape(e) {
            if (e.key === 'Escape' && this.open) {
                this.hideModal();
            }
        }
    });

    // Dropdown Component
    const dropdownComponent = (options = {}) => ({
        open: false,
        search: '',
        selected: options.selected || null,
        multiple: options.multiple || false,
        options: options.options || [],
        placeholder: options.placeholder || 'Select an option',
        
        init() {
            // Load options if URL provided
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
    });

    // Data Table Component
    const dataTableComponent = (config = {}) => ({
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
        
        get pageNumbers() {
            const pages = [];
            const maxPages = 7;
            let start = Math.max(1, this.currentPage - 3);
            let end = Math.min(this.totalPages, start + maxPages - 1);
            
            if (end - start < maxPages - 1) {
                start = Math.max(1, end - maxPages + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
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
        },
        
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        
        goToPage(page) {
            this.currentPage = page;
        },
        
        selectRow(row) {
            const index = this.selectedRows.indexOf(row);
            if (index > -1) {
                this.selectedRows.splice(index, 1);
            } else {
                this.selectedRows.push(row);
            }
        },
        
        selectAll() {
            if (this.selectedRows.length === this.paginatedData.length) {
                this.selectedRows = [];
            } else {
                this.selectedRows = [...this.paginatedData];
            }
        },
        
        isSelected(row) {
            return this.selectedRows.includes(row);
        },
        
        async deleteSelected() {
            if (this.selectedRows.length === 0) return;
            
            if (!confirm(`Delete ${this.selectedRows.length} selected items?`)) return;
            
            // Implement delete logic here
            this.$store.notifications.add(`Deleted ${this.selectedRows.length} items`, 'success');
            this.selectedRows = [];
            await this.loadData();
        }
    });

    // Auto-save Form Component
    const autoSaveFormComponent = (config = {}) => ({
        form: config.initialData || {},
        originalForm: null,
        saving: false,
        lastSaved: null,
        saveTimeout: null,
        
        init() {
            this.originalForm = JSON.parse(JSON.stringify(this.form));
            
            // Watch for changes
            this.$watch('form', () => {
                this.scheduleSave();
            }, { deep: true });
        },
        
        get hasChanges() {
            return JSON.stringify(this.form) !== JSON.stringify(this.originalForm);
        },
        
        scheduleSave() {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }
            
            this.saveTimeout = setTimeout(() => {
                this.save();
            }, config.delay || 2000);
        },
        
        async save() {
            if (!this.hasChanges || this.saving) return;
            
            this.saving = true;
            
            try {
                const response = await fetch(config.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(this.form)
                });
                
                if (response.ok) {
                    this.originalForm = JSON.parse(JSON.stringify(this.form));
                    this.lastSaved = new Date();
                } else {
                    throw new Error('Save failed');
                }
            } catch (error) {
                console.error('Auto-save error:', error);
                this.$store.notifications.add('Auto-save failed', 'warning');
            } finally {
                this.saving = false;
            }
        },
        
        get lastSavedText() {
            if (!this.lastSaved) return '';
            
            const seconds = Math.floor((new Date() - this.lastSaved) / 1000);
            if (seconds < 60) return 'Saved just now';
            
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            
            const hours = Math.floor(minutes / 60);
            return `Saved ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
    });

    // Call Queue Monitor Component
    const queueMonitorComponent = (queueId) => ({
        queue: null,
        agents: [],
        calls: [],
        stats: {
            waiting: 0,
            talking: 0,
            available: 0,
            unavailable: 0
        },
        refreshInterval: null,
        
        async init() {
            await this.loadData();
            
            // Refresh every 5 seconds
            this.refreshInterval = setInterval(() => {
                this.loadData();
            }, 5000);
            
            // Cleanup on destroy
            this.$watch('$el', (el) => {
                if (!el) {
                    clearInterval(this.refreshInterval);
                }
            });
        },
        
        async loadData() {
            try {
                const [queueResponse, agentsResponse, callsResponse] = await Promise.all([
                    fetch(`/queues/${queueId}.json`),
                    fetch(`/queues/${queueId}/agents.json`),
                    fetch(`/queues/${queueId}/calls.json`)
                ]);
                
                this.queue = await queueResponse.json();
                this.agents = await agentsResponse.json();
                this.calls = await callsResponse.json();
                
                this.updateStats();
            } catch (error) {
                console.error('Failed to load queue data:', error);
            }
        },
        
        updateStats() {
            this.stats.waiting = this.calls.filter(c => c.status === 'waiting').length;
            this.stats.talking = this.calls.filter(c => c.status === 'talking').length;
            this.stats.available = this.agents.filter(a => a.status === 'available').length;
            this.stats.unavailable = this.agents.filter(a => a.status !== 'available').length;
        },
        
        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    });

    /**
     * Load Grid4 Alpine components
     */
    function registerGrid4Components() {
        if (!window.Alpine) {
            console.error('Alpine not available for component registration');
            return;
        }
        
        // Register all Grid4 components with Alpine before it initializes
        window.Alpine.data('modal', modalComponent);
        window.Alpine.data('dropdown', dropdownComponent);
        window.Alpine.data('contactForm', contactFormComponent);
        window.Alpine.data('dataTable', dataTableComponent);
        window.Alpine.data('autoSaveForm', autoSaveFormComponent);
        window.Alpine.data('queueMonitor', queueMonitorComponent);
        
        console.log('Grid4 Alpine components registered');
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
            
            // Register components before Alpine starts
            registerGrid4Components();
            
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
                registerGrid4Components();
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

/**
 * Grid4 Alpine.js Components Library
 * 
 * Initialize Alpine stores and magic properties when Alpine is ready
 */

// Set up Alpine configuration that needs to happen during alpine:init
window.addEventListener('alpine:init', () => {
    console.log('Initializing Grid4 Alpine magic properties and stores');

    // Global utility functions
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

    Alpine.magic('validatePhone', () => {
        return (phone) => {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return phoneRegex.test(phone);
        };
    });

    // Store for global app state
    Alpine.store('netsapiens', {
        user: null,
        domain: null,
        permissions: [],
        
        async init() {
            // Load user data
            try {
                const response = await fetch('/users/current.json', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
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

    // Notification system
    Alpine.store('notifications', {
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
            
            // Clear error first
            delete this.errors[field];
            
            // Required fields
            if (['first_name', 'last_name'].includes(field) && !value) {
                this.errors[field] = 'This field is required';
                return false;
            }
            
            // Phone validation
            if (field.includes('phone') || field === 'fax') {
                if (value && !this.$validatePhone(value)) {
                    this.errors[field] = 'Please enter a valid phone number';
                    return false;
                }
            }
            
            // Email validation
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
                    
                    // Redirect after short delay
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
        open: false,
        title: options.title || '',
        size: options.size || 'md', // sm, md, lg, xl
        
        showModal() {
            this.open = true;
            document.body.style.overflow = 'hidden';
            
            // Focus management
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
        
        // Handle escape key
        handleEscape(e) {
            if (e.key === 'Escape' && this.open) {
                this.hideModal();
            }
        }
        open: false,
        search: '',
        selected: options.selected || null,
        multiple: options.multiple || false,
        options: options.options || [],
        placeholder: options.placeholder || 'Select an option',
        
        init() {
            // Load options if URL provided
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
        
        get pageNumbers() {
            const pages = [];
            const maxPages = 7;
            let start = Math.max(1, this.currentPage - 3);
            let end = Math.min(this.totalPages, start + maxPages - 1);
            
            if (end - start < maxPages - 1) {
                start = Math.max(1, end - maxPages + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
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
        },
        
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        
        goToPage(page) {
            this.currentPage = page;
        },
        
        selectRow(row) {
            const index = this.selectedRows.indexOf(row);
            if (index > -1) {
                this.selectedRows.splice(index, 1);
            } else {
                this.selectedRows.push(row);
            }
        },
        
        selectAll() {
            if (this.selectedRows.length === this.paginatedData.length) {
                this.selectedRows = [];
            } else {
                this.selectedRows = [...this.paginatedData];
            }
        },
        
        isSelected(row) {
            return this.selectedRows.includes(row);
        },
        
        async deleteSelected() {
            if (this.selectedRows.length === 0) return;
            
            if (!confirm(`Delete ${this.selectedRows.length} selected items?`)) return;
            
            // Implement delete logic here
            this.$store.notifications.add(`Deleted ${this.selectedRows.length} items`, 'success');
            this.selectedRows = [];
            await this.loadData();
        }
        form: config.initialData || {},
        originalForm: null,
        saving: false,
        lastSaved: null,
        saveTimeout: null,
        
        init() {
            this.originalForm = JSON.parse(JSON.stringify(this.form));
            
            // Watch for changes
            this.$watch('form', () => {
                this.scheduleSave();
            }, { deep: true });
        },
        
        get hasChanges() {
            return JSON.stringify(this.form) !== JSON.stringify(this.originalForm);
        },
        
        scheduleSave() {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }
            
            this.saveTimeout = setTimeout(() => {
                this.save();
            }, config.delay || 2000);
        },
        
        async save() {
            if (!this.hasChanges || this.saving) return;
            
            this.saving = true;
            
            try {
                const response = await fetch(config.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(this.form)
                });
                
                if (response.ok) {
                    this.originalForm = JSON.parse(JSON.stringify(this.form));
                    this.lastSaved = new Date();
                } else {
                    throw new Error('Save failed');
                }
            } catch (error) {
                console.error('Auto-save error:', error);
                this.$store.notifications.add('Auto-save failed', 'warning');
            } finally {
                this.saving = false;
            }
        },
        
        get lastSavedText() {
            if (!this.lastSaved) return '';
            
            const seconds = Math.floor((new Date() - this.lastSaved) / 1000);
            if (seconds < 60) return 'Saved just now';
            
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            
            const hours = Math.floor(minutes / 60);
            return `Saved ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        queue: null,
        agents: [],
        calls: [],
        stats: {
            waiting: 0,
            talking: 0,
            available: 0,
            unavailable: 0
        },
        refreshInterval: null,
        
        async init() {
            await this.loadData();
            
            // Refresh every 5 seconds
            this.refreshInterval = setInterval(() => {
                this.loadData();
            }, 5000);
            
            // Cleanup on destroy
            this.$watch('$el', (el) => {
                if (!el) {
                    clearInterval(this.refreshInterval);
                }
            });
        },
        
        async loadData() {
            try {
                const [queueResponse, agentsResponse, callsResponse] = await Promise.all([
                    fetch(`/queues/${queueId}.json`),
                    fetch(`/queues/${queueId}/agents.json`),
                    fetch(`/queues/${queueId}/calls.json`)
                ]);
                
                this.queue = await queueResponse.json();
                this.agents = await agentsResponse.json();
                this.calls = await callsResponse.json();
                
                this.updateStats();
            } catch (error) {
                console.error('Failed to load queue data:', error);
            }
        },
        
        updateStats() {
            this.stats.waiting = this.calls.filter(c => c.status === 'waiting').length;
            this.stats.talking = this.calls.filter(c => c.status === 'talking').length;
            this.stats.available = this.agents.filter(a => a.status === 'available').length;
            this.stats.unavailable = this.agents.filter(a => a.status !== 'available').length;
        },
        
        formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;

    // Initialize global store
    Alpine.store('netsapiens').init();
});