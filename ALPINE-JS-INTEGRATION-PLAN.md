# Alpine.js Integration Plan for NetSapiens Portal

## Executive Summary

This document outlines a comprehensive strategy for integrating Alpine.js v3 into the NetSapiens portal via custom JavaScript injection. Alpine.js will modernize the portal's UI interactions while maintaining compatibility with the existing jQuery-based infrastructure.

## Table of Contents

1. [Alpine.js Overview](#alpinejs-overview)
2. [Integration Strategy](#integration-strategy)
3. [Component Library](#component-library)
4. [Performance & Compatibility](#performance--compatibility)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Code Examples](#code-examples)

## Alpine.js Overview

### Why Alpine.js for NetSapiens Portal?

Alpine.js is ideal for modernizing the NetSapiens portal because:

- **Minimal footprint**: Only 15KB gzipped (vs jQuery's 32.5KB)
- **No build step required**: Perfect for JS injection approach
- **jQuery-friendly**: Can coexist with existing jQuery code
- **Declarative syntax**: Reduces JavaScript complexity
- **Reactive data binding**: Modern state management without complexity

### Core Alpine.js Features

- **15 directives**: x-data, x-show, x-if, x-for, x-model, etc.
- **6 magic properties**: $el, $refs, $event, $dispatch, $watch, $nextTick
- **2 methods**: Alpine.data(), Alpine.store()

## Integration Strategy

### 1. Safe Loading Mechanism

```javascript
/* Alpine.js Loader for NetSapiens Portal */
(function(window, document) {
    'use strict';
    
    // Configuration
    const ALPINE_VERSION = '3.14.1';
    const ALPINE_CDN = `https://unpkg.com/alpinejs@${ALPINE_VERSION}/dist/cdn.min.js`;
    
    // Check if Alpine is already loaded
    if (window.Alpine) {
        console.log('Alpine.js already loaded');
        return;
    }
    
    // Wait for jQuery to be available
    function waitForjQuery(callback) {
        if (window.jQuery) {
            callback(window.jQuery);
        } else {
            setTimeout(() => waitForjQuery(callback), 100);
        }
    }
    
    // Load Alpine.js
    function loadAlpine() {
        const script = document.createElement('script');
        script.src = ALPINE_CDN;
        script.defer = true;
        
        // Initialize Alpine after load
        script.onload = function() {
            // Register global stores
            initializeAlpineStores();
            
            // Register global components
            registerAlpineComponents();
            
            // Start Alpine
            window.Alpine.start();
            
            console.log('Alpine.js v' + window.Alpine.version + ' initialized');
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('alpine:loaded'));
        };
        
        document.head.appendChild(script);
    }
    
    // Initialize Alpine stores for state management
    function initializeAlpineStores() {
        // Global UI state store
        Alpine.store('ui', {
            sidebarOpen: true,
            theme: 'dark',
            loading: false,
            notifications: [],
            
            toggleSidebar() {
                this.sidebarOpen = !this.sidebarOpen;
            },
            
            addNotification(message, type = 'info') {
                const id = Date.now();
                this.notifications.push({ id, message, type });
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    this.removeNotification(id);
                }, 5000);
            },
            
            removeNotification(id) {
                this.notifications = this.notifications.filter(n => n.id !== id);
            }
        });
        
        // User preferences store
        Alpine.store('preferences', {
            init() {
                // Load from localStorage
                const saved = localStorage.getItem('grid4_preferences');
                if (saved) {
                    Object.assign(this, JSON.parse(saved));
                }
            },
            
            compactMode: false,
            animationsEnabled: true,
            
            save() {
                localStorage.setItem('grid4_preferences', JSON.stringify({
                    compactMode: this.compactMode,
                    animationsEnabled: this.animationsEnabled
                }));
            }
        });
    }
    
    // Wait for jQuery then load Alpine
    waitForjQuery(function($) {
        // Ensure DOM is ready
        $(document).ready(function() {
            loadAlpine();
        });
    });
    
})(window, document);
```

### 2. Progressive Enhancement Strategy

```javascript
/* Progressive Enhancement with Alpine.js */

// Register reusable Alpine components
function registerAlpineComponents() {
    // Enhanced dropdown component
    Alpine.data('dropdown', () => ({
        open: false,
        
        toggle() {
            this.open = !this.open;
        },
        
        close() {
            this.open = false;
        },
        
        // Handle escape key
        init() {
            this.$watch('open', value => {
                if (value) {
                    this.$nextTick(() => {
                        this.$refs.menu?.focus();
                    });
                }
            });
        }
    }));
    
    // Enhanced modal component
    Alpine.data('modal', () => ({
        show: false,
        
        open() {
            this.show = true;
            document.body.style.overflow = 'hidden';
        },
        
        close() {
            this.show = false;
            document.body.style.overflow = '';
        },
        
        // Handle escape key
        handleKeydown(e) {
            if (e.key === 'Escape' && this.show) {
                this.close();
            }
        },
        
        init() {
            document.addEventListener('keydown', this.handleKeydown.bind(this));
        },
        
        destroy() {
            document.removeEventListener('keydown', this.handleKeydown.bind(this));
        }
    }));
    
    // Enhanced tabs component
    Alpine.data('tabs', () => ({
        activeTab: 0,
        
        selectTab(index) {
            this.activeTab = index;
            
            // Update URL hash without scrolling
            const tabId = this.$refs[`tab_${index}`]?.id;
            if (tabId) {
                history.replaceState(null, null, `#${tabId}`);
            }
        },
        
        init() {
            // Check URL hash on init
            const hash = window.location.hash.slice(1);
            if (hash) {
                const tabElement = document.getElementById(hash);
                if (tabElement) {
                    const index = parseInt(tabElement.dataset.tabIndex);
                    if (!isNaN(index)) {
                        this.activeTab = index;
                    }
                }
            }
        }
    }));
}
```

### 3. jQuery to Alpine Migration Pattern

```javascript
/* Migration patterns from jQuery to Alpine.js */

// BEFORE: jQuery approach
$(document).ready(function() {
    $('#toggleButton').click(function() {
        $('#menu').toggle();
        $(this).toggleClass('active');
    });
    
    // Complex state management
    var filterState = {
        search: '',
        category: 'all',
        sortBy: 'name'
    };
    
    $('#searchInput').on('input', function() {
        filterState.search = $(this).val();
        updateResults();
    });
});

// AFTER: Alpine.js approach
<div x-data="dataTable()">
    <button @click="menuOpen = !menuOpen" 
            :class="{ 'active': menuOpen }">
        Toggle Menu
    </button>
    
    <div x-show="menuOpen" x-transition>
        <!-- Menu content -->
    </div>
    
    <!-- Data table with filtering -->
    <input x-model="filters.search" 
           @input="filterData"
           placeholder="Search...">
    
    <select x-model="filters.category" @change="filterData">
        <option value="all">All Categories</option>
        <template x-for="category in categories">
            <option :value="category" x-text="category"></option>
        </template>
    </select>
</div>

<script>
function dataTable() {
    return {
        menuOpen: false,
        filters: {
            search: '',
            category: 'all',
            sortBy: 'name'
        },
        data: [],
        filteredData: [],
        
        init() {
            // Fetch initial data
            this.fetchData();
        },
        
        async fetchData() {
            // Integration with existing jQuery AJAX
            const response = await $.ajax({
                url: '/portal/api/data',
                method: 'GET'
            });
            
            this.data = response.data;
            this.filterData();
        },
        
        filterData() {
            this.filteredData = this.data.filter(item => {
                const matchesSearch = item.name
                    .toLowerCase()
                    .includes(this.filters.search.toLowerCase());
                
                const matchesCategory = this.filters.category === 'all' 
                    || item.category === this.filters.category;
                
                return matchesSearch && matchesCategory;
            });
        }
    }
}
</script>
```

## Component Library

### 1. Data Table Component

```javascript
/* Alpine.js Enhanced Data Table */
Alpine.data('dataTable', () => ({
    // State
    data: [],
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 25,
    sortColumn: 'name',
    sortDirection: 'asc',
    searchTerm: '',
    loading: false,
    selectedRows: new Set(),
    
    // Computed properties
    get totalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    
    get paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredData.slice(start, end);
    },
    
    get allSelected() {
        return this.paginatedData.length > 0 && 
               this.paginatedData.every(item => this.selectedRows.has(item.id));
    },
    
    // Methods
    async init() {
        await this.loadData();
        
        // Watch for search changes with debounce
        let searchTimeout;
        this.$watch('searchTerm', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterAndSort();
            }, 300);
        });
    },
    
    async loadData() {
        this.loading = true;
        try {
            // Use existing jQuery AJAX infrastructure
            const response = await $.ajax({
                url: '/portal/api/users',
                method: 'GET',
                dataType: 'json'
            });
            
            this.data = response.data || [];
            this.filterAndSort();
        } catch (error) {
            Alpine.store('ui').addNotification('Failed to load data', 'error');
        } finally {
            this.loading = false;
        }
    },
    
    filterAndSort() {
        // Filter
        let filtered = this.data;
        
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                Object.values(item).some(value => 
                    String(value).toLowerCase().includes(term)
                )
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            const aVal = a[this.sortColumn];
            const bVal = b[this.sortColumn];
            
            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        this.filteredData = filtered;
        this.currentPage = 1; // Reset to first page
    },
    
    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.filterAndSort();
    },
    
    toggleSelectAll() {
        if (this.allSelected) {
            this.paginatedData.forEach(item => this.selectedRows.delete(item.id));
        } else {
            this.paginatedData.forEach(item => this.selectedRows.add(item.id));
        }
    },
    
    toggleSelect(id) {
        if (this.selectedRows.has(id)) {
            this.selectedRows.delete(id);
        } else {
            this.selectedRows.add(id);
        }
    },
    
    async deleteSelected() {
        if (this.selectedRows.size === 0) return;
        
        if (!confirm(`Delete ${this.selectedRows.size} items?`)) return;
        
        this.loading = true;
        try {
            await $.ajax({
                url: '/portal/api/users/bulk-delete',
                method: 'POST',
                data: JSON.stringify({
                    ids: Array.from(this.selectedRows)
                }),
                contentType: 'application/json'
            });
            
            // Remove from local data
            this.data = this.data.filter(item => !this.selectedRows.has(item.id));
            this.selectedRows.clear();
            this.filterAndSort();
            
            Alpine.store('ui').addNotification('Items deleted successfully', 'success');
        } catch (error) {
            Alpine.store('ui').addNotification('Failed to delete items', 'error');
        } finally {
            this.loading = false;
        }
    }
}));
```

### 2. Form Validation Component

```javascript
/* Alpine.js Form Validation */
Alpine.data('formValidation', () => ({
    // Form data
    formData: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    },
    
    // Validation errors
    errors: {},
    
    // Validation rules
    rules: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50
        },
        email: {
            required: true,
            email: true
        },
        phone: {
            required: false,
            phone: true
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
        },
        confirmPassword: {
            required: true,
            match: 'password'
        }
    },
    
    // Validation methods
    validate(field) {
        const value = this.formData[field];
        const rules = this.rules[field];
        const errors = [];
        
        if (rules.required && !value) {
            errors.push('This field is required');
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Minimum length is ${rules.minLength} characters`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Maximum length is ${rules.maxLength} characters`);
        }
        
        if (rules.email && value && !this.isValidEmail(value)) {
            errors.push('Invalid email address');
        }
        
        if (rules.phone && value && !this.isValidPhone(value)) {
            errors.push('Invalid phone number');
        }
        
        if (rules.pattern && value && !rules.pattern.test(value)) {
            errors.push('Password must contain uppercase, lowercase, and number');
        }
        
        if (rules.match && value !== this.formData[rules.match]) {
            errors.push('Passwords do not match');
        }
        
        this.errors[field] = errors;
        
        return errors.length === 0;
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        return /^\+?[\d\s\-\(\)]+$/.test(phone);
    },
    
    validateAll() {
        let isValid = true;
        
        Object.keys(this.rules).forEach(field => {
            if (!this.validate(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    async submit() {
        if (!this.validateAll()) {
            Alpine.store('ui').addNotification('Please fix validation errors', 'error');
            return;
        }
        
        this.loading = true;
        
        try {
            const response = await $.ajax({
                url: '/portal/api/users',
                method: 'POST',
                data: JSON.stringify(this.formData),
                contentType: 'application/json'
            });
            
            Alpine.store('ui').addNotification('User created successfully', 'success');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            Alpine.store('ui').addNotification('Failed to create user', 'error');
        } finally {
            this.loading = false;
        }
    },
    
    resetForm() {
        this.formData = {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        };
        this.errors = {};
    }
}));
```

### 3. Real-time Search Component

```javascript
/* Alpine.js Real-time Search */
Alpine.data('liveSearch', () => ({
    query: '',
    results: [],
    loading: false,
    showDropdown: false,
    selectedIndex: -1,
    cache: new Map(),
    
    async search() {
        if (this.query.length < 2) {
            this.results = [];
            this.showDropdown = false;
            return;
        }
        
        // Check cache first
        if (this.cache.has(this.query)) {
            this.results = this.cache.get(this.query);
            this.showDropdown = true;
            return;
        }
        
        this.loading = true;
        
        try {
            const response = await $.ajax({
                url: '/portal/api/search',
                method: 'GET',
                data: { q: this.query },
                dataType: 'json'
            });
            
            this.results = response.results || [];
            this.cache.set(this.query, this.results);
            this.showDropdown = this.results.length > 0;
            
        } catch (error) {
            console.error('Search failed:', error);
            this.results = [];
        } finally {
            this.loading = false;
        }
    },
    
    selectResult(result) {
        this.query = result.name;
        this.showDropdown = false;
        
        // Navigate or perform action
        if (result.url) {
            window.location.href = result.url;
        }
    },
    
    handleKeydown(event) {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectedIndex = Math.min(
                    this.selectedIndex + 1, 
                    this.results.length - 1
                );
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                break;
                
            case 'Enter':
                event.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectResult(this.results[this.selectedIndex]);
                }
                break;
                
            case 'Escape':
                this.showDropdown = false;
                this.selectedIndex = -1;
                break;
        }
    },
    
    init() {
        // Debounced search
        let searchTimeout;
        this.$watch('query', () => {
            clearTimeout(searchTimeout);
            this.selectedIndex = -1;
            
            searchTimeout = setTimeout(() => {
                this.search();
            }, 300);
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.showDropdown = false;
            }
        });
    }
}));
```

## Performance & Compatibility

### 1. Performance Optimization Strategies

```javascript
/* Performance-optimized Alpine.js patterns */

// 1. Lazy Loading Components
Alpine.data('lazyComponent', () => ({
    loaded: false,
    content: null,
    
    async load() {
        if (this.loaded) return;
        
        try {
            const response = await fetch('/portal/api/component-data');
            this.content = await response.json();
            this.loaded = true;
        } catch (error) {
            console.error('Failed to load component:', error);
        }
    },
    
    // Use Intersection Observer for truly lazy loading
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.load();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(this.$el);
    }
}));

// 2. Virtual Scrolling for Large Lists
Alpine.data('virtualScroll', () => ({
    items: [],
    visibleItems: [],
    itemHeight: 50,
    containerHeight: 500,
    scrollTop: 0,
    
    get totalHeight() {
        return this.items.length * this.itemHeight;
    },
    
    get startIndex() {
        return Math.floor(this.scrollTop / this.itemHeight);
    },
    
    get endIndex() {
        return Math.min(
            this.startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
            this.items.length
        );
    },
    
    updateVisibleItems() {
        this.visibleItems = this.items.slice(this.startIndex, this.endIndex);
    },
    
    handleScroll(event) {
        this.scrollTop = event.target.scrollTop;
        this.updateVisibleItems();
    },
    
    init() {
        this.updateVisibleItems();
        
        // Use RAF for smooth scrolling
        let rafId;
        this.$refs.container.addEventListener('scroll', (e) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => this.handleScroll(e));
        });
    }
}));

// 3. Optimized Event Handling
document.addEventListener('alpine:init', () => {
    // Global event delegation for performance
    Alpine.magic('delegate', (el) => {
        return {
            click(selector, handler) {
                el.addEventListener('click', (e) => {
                    const target = e.target.closest(selector);
                    if (target) {
                        handler.call(target, e);
                    }
                });
            }
        };
    });
});
```

### 2. Browser Compatibility Approach

```javascript
/* Browser compatibility layer */

// Feature detection
const browserSupport = {
    hasProxy: typeof Proxy !== 'undefined',
    hasPromise: typeof Promise !== 'undefined',
    hasIntersectionObserver: typeof IntersectionObserver !== 'undefined',
    hasFetch: typeof fetch !== 'undefined'
};

// Polyfill loader for older browsers
if (!browserSupport.hasProxy) {
    console.warn('Proxy not supported. Alpine.js v3 requires Proxy support.');
    // Consider loading Alpine v2 or showing upgrade message
}

// Fetch polyfill for older browsers
if (!browserSupport.hasFetch) {
    // Use jQuery.ajax as fallback
    window.fetch = function(url, options = {}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: options.method || 'GET',
                data: options.body,
                headers: options.headers,
                success: (data) => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(data),
                        text: () => Promise.resolve(JSON.stringify(data))
                    });
                },
                error: (xhr) => {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            });
        });
    };
}
```

### 3. Memory Management

```javascript
/* Memory leak prevention patterns */

Alpine.data('memoryOptimized', () => ({
    // Store references for cleanup
    listeners: [],
    timers: [],
    observers: [],
    
    // Add event listener with tracking
    addListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.listeners.push({ element, event, handler });
    },
    
    // Add timer with tracking
    addTimer(callback, delay) {
        const id = setTimeout(callback, delay);
        this.timers.push(id);
        return id;
    },
    
    // Cleanup method
    destroy() {
        // Remove all event listeners
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // Clear all timers
        this.timers.forEach(id => clearTimeout(id));
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Clear arrays
        this.listeners = [];
        this.timers = [];
        this.observers = [];
    }
}));
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. **Alpine.js Loader Integration**
   - Implement safe loading mechanism
   - Set up global stores
   - Create base component registry
   - Test with existing jQuery code

2. **Basic Components**
   - Dropdown menus
   - Modal dialogs
   - Tooltips
   - Tab panels

### Phase 2: Data Components (Week 3-4)
1. **Data Table Enhancement**
   - Sorting and filtering
   - Pagination
   - Row selection
   - Inline editing

2. **Form Components**
   - Validation framework
   - Dynamic form fields
   - File uploads
   - Auto-save functionality

### Phase 3: Advanced Features (Week 5-6)
1. **Real-time Features**
   - Live search
   - Auto-complete
   - Real-time notifications
   - WebSocket integration

2. **Performance Optimization**
   - Virtual scrolling
   - Lazy loading
   - Component code-splitting
   - Caching strategies

### Phase 4: Portal-Specific Integration (Week 7-8)
1. **NetSapiens Components**
   - Call queue management
   - User presence indicators
   - Conference room controls
   - Voicemail interface

2. **Testing & Refinement**
   - Cross-browser testing
   - Performance profiling
   - User acceptance testing
   - Documentation

## Code Examples

### 1. NetSapiens Call Queue Component

```html
<!-- Call Queue Management with Alpine.js -->
<div x-data="callQueueManager()" class="call-queue-container">
    <!-- Queue Stats -->
    <div class="queue-stats">
        <div class="stat-card" x-show="stats.active > 0">
            <span class="stat-value" x-text="stats.active"></span>
            <span class="stat-label">Active Calls</span>
        </div>
        <div class="stat-card">
            <span class="stat-value" x-text="stats.waiting"></span>
            <span class="stat-label">Waiting</span>
        </div>
        <div class="stat-card">
            <span class="stat-value" x-text="stats.avgWaitTime"></span>
            <span class="stat-label">Avg Wait</span>
        </div>
    </div>
    
    <!-- Queue List -->
    <div class="queue-list">
        <template x-for="call in calls" :key="call.id">
            <div class="queue-item" 
                 :class="{ 'priority': call.priority }"
                 x-transition>
                
                <div class="caller-info">
                    <strong x-text="call.callerName || call.callerNumber"></strong>
                    <span class="wait-time" x-text="formatWaitTime(call.waitTime)"></span>
                </div>
                
                <div class="actions">
                    <button @click="answer(call)" 
                            class="btn btn-sm btn-success"
                            :disabled="answering">
                        Answer
                    </button>
                    <button @click="transfer(call)" 
                            class="btn btn-sm btn-primary">
                        Transfer
                    </button>
                </div>
            </div>
        </template>
    </div>
    
    <!-- Loading State -->
    <div x-show="loading" class="loading-overlay">
        <div class="spinner-border"></div>
    </div>
</div>

<script>
function callQueueManager() {
    return {
        calls: [],
        stats: {
            active: 0,
            waiting: 0,
            avgWaitTime: '0:00'
        },
        loading: false,
        answering: false,
        updateInterval: null,
        
        init() {
            // Initial load
            this.fetchQueueData();
            
            // Set up real-time updates
            this.updateInterval = setInterval(() => {
                this.fetchQueueData();
            }, 5000);
            
            // WebSocket connection for real-time updates
            this.connectWebSocket();
        },
        
        async fetchQueueData() {
            try {
                const response = await $.ajax({
                    url: '/portal/api/callqueue/status',
                    method: 'GET'
                });
                
                this.calls = response.calls || [];
                this.stats = response.stats || this.stats;
                
            } catch (error) {
                console.error('Failed to fetch queue data:', error);
            }
        },
        
        connectWebSocket() {
            // Integration with existing NetSapiens WebSocket
            if (window.nsWebSocket) {
                window.nsWebSocket.on('queue:update', (data) => {
                    this.handleQueueUpdate(data);
                });
            }
        },
        
        handleQueueUpdate(data) {
            // Real-time queue updates
            if (data.type === 'new_call') {
                this.calls.push(data.call);
                this.stats.waiting++;
            } else if (data.type === 'call_answered') {
                this.calls = this.calls.filter(c => c.id !== data.callId);
                this.stats.waiting--;
                this.stats.active++;
            }
        },
        
        async answer(call) {
            this.answering = true;
            
            try {
                await $.ajax({
                    url: `/portal/api/callqueue/answer/${call.id}`,
                    method: 'POST'
                });
                
                // Remove from queue
                this.calls = this.calls.filter(c => c.id !== call.id);
                
                Alpine.store('ui').addNotification('Call answered', 'success');
                
            } catch (error) {
                Alpine.store('ui').addNotification('Failed to answer call', 'error');
            } finally {
                this.answering = false;
            }
        },
        
        async transfer(call) {
            // Open transfer modal
            this.$dispatch('open-transfer-modal', { call });
        },
        
        formatWaitTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        
        destroy() {
            // Cleanup
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        }
    };
}
</script>
```

### 2. Presence Indicator Component

```html
<!-- User Presence Indicator -->
<div x-data="presenceIndicator()" 
     x-init="init"
     class="presence-indicator">
     
    <div class="presence-badge" 
         :class="'status-' + status"
         @click="showMenu = !showMenu">
         
        <span class="status-dot"></span>
        <span x-text="statusText"></span>
        <i class="fa fa-chevron-down"></i>
    </div>
    
    <div x-show="showMenu" 
         x-transition
         @click.away="showMenu = false"
         class="presence-menu">
         
        <button @click="setStatus('available')" 
                class="presence-option">
            <span class="status-dot status-available"></span>
            Available
        </button>
        
        <button @click="setStatus('busy')" 
                class="presence-option">
            <span class="status-dot status-busy"></span>
            Busy
        </button>
        
        <button @click="setStatus('away')" 
                class="presence-option">
            <span class="status-dot status-away"></span>
            Away
        </button>
        
        <button @click="setStatus('offline')" 
                class="presence-option">
            <span class="status-dot status-offline"></span>
            Appear Offline
        </button>
        
        <div class="presence-divider"></div>
        
        <div class="custom-status">
            <input x-model="customMessage" 
                   @keyup.enter="updateCustomStatus"
                   placeholder="Set status message..."
                   class="form-control form-control-sm">
        </div>
    </div>
</div>

<script>
Alpine.data('presenceIndicator', () => ({
    status: 'available',
    customMessage: '',
    showMenu: false,
    
    get statusText() {
        const statusMap = {
            available: 'Available',
            busy: 'Busy',
            away: 'Away',
            offline: 'Offline'
        };
        
        return this.customMessage || statusMap[this.status];
    },
    
    async init() {
        // Load current status
        try {
            const response = await $.ajax({
                url: '/portal/api/user/presence',
                method: 'GET'
            });
            
            this.status = response.status;
            this.customMessage = response.message || '';
            
        } catch (error) {
            console.error('Failed to load presence:', error);
        }
    },
    
    async setStatus(newStatus) {
        const oldStatus = this.status;
        this.status = newStatus;
        this.showMenu = false;
        
        try {
            await $.ajax({
                url: '/portal/api/user/presence',
                method: 'PUT',
                data: JSON.stringify({
                    status: newStatus,
                    message: this.customMessage
                }),
                contentType: 'application/json'
            });
            
        } catch (error) {
            // Revert on error
            this.status = oldStatus;
            Alpine.store('ui').addNotification('Failed to update status', 'error');
        }
    },
    
    async updateCustomStatus() {
        await this.setStatus(this.status);
    }
}));
</script>

<style>
/* Presence indicator styles */
.presence-indicator {
    position: relative;
}

.presence-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--color-surface-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--grid4-radius-md);
    cursor: pointer;
    transition: all var(--grid4-transition-fast);
}

.presence-badge:hover {
    background: var(--color-surface-secondary);
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.status-available .status-dot,
.status-dot.status-available {
    background-color: var(--color-accent-green);
}

.status-busy .status-dot,
.status-dot.status-busy {
    background-color: var(--color-accent-red);
}

.status-away .status-dot,
.status-dot.status-away {
    background-color: var(--color-accent-yellow);
}

.status-offline .status-dot,
.status-dot.status-offline {
    background-color: var(--color-text-muted);
}

.presence-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: var(--color-surface-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--grid4-radius-md);
    box-shadow: var(--grid4-shadow-elevated);
    min-width: 200px;
    z-index: 1000;
}

.presence-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background var(--grid4-transition-fast);
}

.presence-option:hover {
    background: var(--color-surface-secondary);
}

.presence-divider {
    height: 1px;
    background: var(--color-border);
    margin: 4px 0;
}

.custom-status {
    padding: 8px;
}
</style>
```

## Best Practices & Guidelines

### 1. Component Design Principles

- **Single Responsibility**: Each Alpine component should have one clear purpose
- **Reusability**: Design components to be reusable across different contexts
- **Progressive Enhancement**: Components should work without JavaScript when possible
- **Accessibility**: Include proper ARIA attributes and keyboard navigation

### 2. State Management

- **Local State**: Use x-data for component-specific state
- **Global State**: Use Alpine.store for application-wide state
- **Persistence**: Use localStorage for user preferences
- **Real-time**: Integrate with WebSockets for live updates

### 3. Performance Guidelines

- **Lazy Loading**: Load components only when needed
- **Debouncing**: Debounce expensive operations like search
- **Virtual Scrolling**: Use for lists with 100+ items
- **Memory Management**: Clean up listeners and timers

### 4. Testing Strategy

- **Unit Tests**: Test Alpine components in isolation
- **Integration Tests**: Test interaction with jQuery code
- **E2E Tests**: Use Playwright for full user workflows
- **Performance Tests**: Monitor bundle size and runtime performance

## Conclusion

Alpine.js provides an excellent path for modernizing the NetSapiens portal UI while maintaining compatibility with existing jQuery infrastructure. The declarative nature of Alpine.js will reduce code complexity, improve maintainability, and provide a better developer experience.

The phased implementation approach allows for gradual migration without disrupting existing functionality, while the component library provides ready-to-use patterns for common UI needs.

By following this plan, the NetSapiens portal will benefit from:
- Modern reactive UI without a heavy framework
- Improved performance and smaller bundle size
- Better code organization and maintainability
- Enhanced user experience with smooth interactions
- Future-proof architecture that can evolve with web standards