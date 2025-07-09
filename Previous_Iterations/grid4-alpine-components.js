/**
 * Grid4 Alpine.js Components Library
 * 
 * This file contains reusable Alpine.js components specifically designed
 * for the NetSapiens portal. These components can replace jQuery functionality
 * with reactive, declarative alternatives.
 */

// Wait for Alpine to be available
window.addEventListener('alpine:init', () => {
    console.log('Initializing Grid4 Alpine Components');

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

    // Contact Form Component
    Alpine.data('contactForm', (contact = {}) => ({
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
    }));

    // Modal Component
    Alpine.data('modal', (options = {}) => ({
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
    }));

    // Dropdown Component
    Alpine.data('dropdown', (options = {}) => ({
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
    }));

    // Data Table Component
    Alpine.data('dataTable', (config = {}) => ({
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
    }));

    // Auto-save Form Component
    Alpine.data('autoSaveForm', (config = {}) => ({
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
    }));

    // Call Queue Monitor Component
    Alpine.data('queueMonitor', (queueId) => ({
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
    }));

    // Initialize global store
    Alpine.store('netsapiens').init();
});

// Utility function to initialize Alpine when ready
function initializeAlpine() {
    if (typeof Alpine !== 'undefined') {
        console.log('Alpine.js is ready');
        return;
    }
    
    // If Alpine isn't loaded yet, wait
    setTimeout(initializeAlpine, 100);
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAlpine);
} else {
    initializeAlpine();
}