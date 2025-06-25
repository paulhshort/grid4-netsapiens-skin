/**
 * Modern Portal Injection Examples
 * Practical, ready-to-use code for NetSapiens portal modernization
 * Compatible with PORTAL_EXTRA_JS injection point
 */

(function() {
    'use strict';
    
    // Wait for NetSapiens jQuery to be ready
    var initAttempts = 0;
    var init = function() {
        if (typeof jQuery === 'undefined' || !jQuery.fn || !jQuery.fn.jquery) {
            if (++initAttempts < 50) {
                setTimeout(init, 100);
                return;
            }
            console.error('Modern Portal: jQuery not found after 50 attempts');
            return;
        }
        
        console.log('Modern Portal: Initializing with jQuery ' + jQuery.fn.jquery);
        initializeModernPortal();
    };
    
    function initializeModernPortal() {
        // Create our namespace
        window.ModernPortal = {
            version: '1.0.0',
            legacyJQuery: window.jQuery,
            legacy$: window.$,
            initialized: false,
            components: {},
            utils: {},
            config: {
                debug: true,
                apiBase: '/api/v2',
                cdnBase: 'https://unpkg.com'
            }
        };
        
        // Capture legacy global variables
        ModernPortal.legacyGlobals = {
            sub_domain: window.sub_domain || '',
            sub_user: window.sub_user || '',
            sub_scope: window.sub_scope || '',
            socket_urls: window.socket_urls || [],
            jwt: localStorage.getItem('ns_t') || ''
        };
        
        // Load modern libraries
        loadModernStack();
    }
    
    // Dynamic script loader
    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.error('Modern Portal: Failed to load script: ' + src);
        };
        document.head.appendChild(script);
    }
    
    // Dynamic stylesheet loader
    function loadStylesheet(href, callback) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = callback;
        document.head.appendChild(link);
    }
    
    // Load modern libraries in sequence
    function loadModernStack() {
        console.log('Modern Portal: Loading modern stack...');
        
        // Step 1: Load modern jQuery in no-conflict mode
        loadScript('https://unpkg.com/jquery@3.7.1/dist/jquery.min.js', function() {
            ModernPortal.jQuery = jQuery.noConflict(true);
            ModernPortal.$ = ModernPortal.jQuery;
            console.log('Modern Portal: jQuery 3.7.1 loaded in no-conflict mode');
            
            // Step 2: Load Alpine.js for reactive components
            loadScript('https://unpkg.com/alpinejs@3.13.0/dist/cdn.min.js', function() {
                window.Alpine.start();
                console.log('Modern Portal: Alpine.js loaded');
                
                // Step 3: Load utility libraries
                loadUtilityLibraries();
            });
        });
    }
    
    function loadUtilityLibraries() {
        // Load Day.js for date handling
        loadScript('https://unpkg.com/dayjs@1.11.10/dayjs.min.js', function() {
            ModernPortal.dayjs = window.dayjs;
            
            // Load Axios for modern HTTP requests
            loadScript('https://unpkg.com/axios@1.6.2/dist/axios.min.js', function() {
                ModernPortal.axios = window.axios.create({
                    baseURL: ModernPortal.config.apiBase,
                    headers: {
                        'Authorization': 'Bearer ' + ModernPortal.legacyGlobals.jwt
                    }
                });
                
                // Load UI libraries
                loadUILibraries();
            });
        });
    }
    
    function loadUILibraries() {
        // Load Tailwind CSS (configured for our namespace)
        loadScript('https://cdn.tailwindcss.com', function() {
            tailwind.config = {
                prefix: 'mp-',
                important: '.mp-modern',
                theme: {
                    extend: {
                        colors: {
                            primary: '#0099ff',
                            secondary: '#1a2332',
                            accent: '#00d4ff',
                            dark: '#0d1117'
                        }
                    }
                }
            };
            
            // Load notification library
            loadStylesheet('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css');
            loadScript('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js', function() {
                ModernPortal.notify = new Notyf({
                    duration: 4000,
                    position: { x: 'right', y: 'top' },
                    types: [
                        {
                            type: 'success',
                            background: '#0099ff',
                            icon: false
                        },
                        {
                            type: 'error',
                            background: '#ff4444',
                            icon: false
                        }
                    ]
                });
                
                // All libraries loaded, initialize components
                initializeComponents();
            });
        });
    }
    
    function initializeComponents() {
        console.log('Modern Portal: Initializing components...');
        
        // Add modern class to body for CSS scoping
        document.body.classList.add('mp-enabled');
        
        // Initialize Alpine.js components
        initializeAlpineComponents();
        
        // Enhance existing UI elements
        enhanceExistingUI();
        
        // Set up global utilities
        setupUtilities();
        
        ModernPortal.initialized = true;
        console.log('Modern Portal: Initialization complete!');
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('modernPortalReady', {
            detail: { version: ModernPortal.version }
        }));
    }
    
    function initializeAlpineComponents() {
        // Modern search component
        Alpine.data('modernSearch', () => ({
            query: '',
            results: [],
            loading: false,
            open: false,
            
            async search() {
                if (this.query.length < 2) {
                    this.results = [];
                    return;
                }
                
                this.loading = true;
                try {
                    // Simulate API call - replace with actual endpoint
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.results = [
                        { id: 1, name: 'User 1', type: 'user' },
                        { id: 2, name: 'Extension 101', type: 'extension' }
                    ];
                    this.open = true;
                } catch (error) {
                    ModernPortal.notify.error('Search failed: ' + error.message);
                } finally {
                    this.loading = false;
                }
            }
        }));
        
        // Modern data table component
        Alpine.data('modernTable', () => ({
            items: [],
            loading: true,
            sortField: 'name',
            sortDirection: 'asc',
            currentPage: 1,
            itemsPerPage: 20,
            
            async init() {
                await this.loadData();
            },
            
            async loadData() {
                this.loading = true;
                try {
                    const response = await ModernPortal.axios.get('/users');
                    this.items = response.data;
                } catch (error) {
                    ModernPortal.notify.error('Failed to load data');
                    this.items = [];
                } finally {
                    this.loading = false;
                }
            },
            
            sort(field) {
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }
                // Re-sort items
                this.items.sort((a, b) => {
                    const aVal = a[field];
                    const bVal = b[field];
                    const modifier = this.sortDirection === 'asc' ? 1 : -1;
                    return aVal > bVal ? modifier : -modifier;
                });
            },
            
            get paginatedItems() {
                const start = (this.currentPage - 1) * this.itemsPerPage;
                return this.items.slice(start, start + this.itemsPerPage);
            },
            
            get totalPages() {
                return Math.ceil(this.items.length / this.itemsPerPage);
            }
        }));
    }
    
    function enhanceExistingUI() {
        // Example 1: Enhance user table if it exists
        const userTable = document.querySelector('#user-list-container');
        if (userTable && !userTable.hasAttribute('x-data')) {
            const modernTable = document.createElement('div');
            modernTable.className = 'mp-modern';
            modernTable.setAttribute('x-data', 'modernTable');
            modernTable.innerHTML = `
                <div class="mp-bg-white mp-rounded-lg mp-shadow-lg mp-p-6">
                    <div class="mp-flex mp-justify-between mp-items-center mp-mb-4">
                        <h2 class="mp-text-2xl mp-font-bold mp-text-gray-900">Users</h2>
                        <button @click="loadData()" 
                                :disabled="loading"
                                class="mp-px-4 mp-py-2 mp-bg-primary mp-text-white mp-rounded-md hover:mp-bg-blue-600 mp-transition-colors">
                            <span x-show="!loading">Refresh</span>
                            <span x-show="loading">Loading...</span>
                        </button>
                    </div>
                    
                    <div x-show="loading" class="mp-text-center mp-py-8">
                        <div class="mp-inline-block mp-animate-spin mp-rounded-full mp-h-8 mp-w-8 mp-border-b-2 mp-border-primary"></div>
                    </div>
                    
                    <table x-show="!loading" class="mp-min-w-full mp-divide-y mp-divide-gray-200">
                        <thead class="mp-bg-gray-50">
                            <tr>
                                <th @click="sort('name')" class="mp-px-6 mp-py-3 mp-text-left mp-text-xs mp-font-medium mp-text-gray-500 mp-uppercase mp-tracking-wider mp-cursor-pointer hover:mp-bg-gray-100">
                                    Name
                                    <span x-show="sortField === 'name'">
                                        <span x-show="sortDirection === 'asc'">↑</span>
                                        <span x-show="sortDirection === 'desc'">↓</span>
                                    </span>
                                </th>
                                <th @click="sort('extension')" class="mp-px-6 mp-py-3 mp-text-left mp-text-xs mp-font-medium mp-text-gray-500 mp-uppercase mp-tracking-wider mp-cursor-pointer hover:mp-bg-gray-100">
                                    Extension
                                    <span x-show="sortField === 'extension'">
                                        <span x-show="sortDirection === 'asc'">↑</span>
                                        <span x-show="sortDirection === 'desc'">↓</span>
                                    </span>
                                </th>
                                <th class="mp-px-6 mp-py-3 mp-text-left mp-text-xs mp-font-medium mp-text-gray-500 mp-uppercase mp-tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="mp-bg-white mp-divide-y mp-divide-gray-200">
                            <template x-for="item in paginatedItems" :key="item.id">
                                <tr class="hover:mp-bg-gray-50">
                                    <td class="mp-px-6 mp-py-4 mp-whitespace-nowrap" x-text="item.name"></td>
                                    <td class="mp-px-6 mp-py-4 mp-whitespace-nowrap" x-text="item.extension"></td>
                                    <td class="mp-px-6 mp-py-4 mp-whitespace-nowrap">
                                        <button @click="$dispatch('edit-user', item)" class="mp-text-primary hover:mp-text-blue-900">Edit</button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    
                    <div x-show="!loading && totalPages > 1" class="mp-mt-4 mp-flex mp-justify-between mp-items-center">
                        <button @click="currentPage = Math.max(1, currentPage - 1)" 
                                :disabled="currentPage === 1"
                                class="mp-px-3 mp-py-1 mp-border mp-rounded mp-text-sm"
                                :class="currentPage === 1 ? 'mp-opacity-50 mp-cursor-not-allowed' : 'hover:mp-bg-gray-100'">
                            Previous
                        </button>
                        <span class="mp-text-sm mp-text-gray-700">
                            Page <span x-text="currentPage"></span> of <span x-text="totalPages"></span>
                        </span>
                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                                :disabled="currentPage === totalPages"
                                class="mp-px-3 mp-py-1 mp-border mp-rounded mp-text-sm"
                                :class="currentPage === totalPages ? 'mp-opacity-50 mp-cursor-not-allowed' : 'hover:mp-bg-gray-100'">
                            Next
                        </button>
                    </div>
                </div>
            `;
            
            // Replace old table with modern version
            userTable.style.display = 'none';
            userTable.parentNode.insertBefore(modernTable, userTable.nextSibling);
        }
        
        // Example 2: Add modern search to navigation
        const navBar = document.querySelector('#navigation');
        if (navBar && !document.querySelector('#modern-search')) {
            const searchContainer = document.createElement('div');
            searchContainer.id = 'modern-search';
            searchContainer.className = 'mp-modern mp-inline-block mp-ml-4';
            searchContainer.setAttribute('x-data', 'modernSearch');
            searchContainer.innerHTML = `
                <div class="mp-relative">
                    <input type="text" 
                           x-model="query" 
                           @input.debounce.300ms="search()"
                           @focus="open = true"
                           @click.away="open = false"
                           placeholder="Search..."
                           class="mp-w-64 mp-px-4 mp-py-2 mp-border mp-border-gray-300 mp-rounded-md mp-text-sm focus:mp-outline-none focus:mp-ring-2 focus:mp-ring-primary">
                    
                    <div x-show="open && results.length > 0" 
                         x-transition
                         class="mp-absolute mp-z-50 mp-w-full mp-mt-1 mp-bg-white mp-rounded-md mp-shadow-lg mp-border mp-border-gray-200">
                        <template x-for="result in results" :key="result.id">
                            <a href="#" 
                               @click.prevent="open = false; ModernPortal.utils.navigateToResult(result)"
                               class="mp-block mp-px-4 mp-py-2 mp-text-sm hover:mp-bg-gray-100">
                                <span x-text="result.name"></span>
                                <span class="mp-text-gray-500 mp-text-xs" x-text="'(' + result.type + ')'"></span>
                            </a>
                        </template>
                    </div>
                    
                    <div x-show="loading" class="mp-absolute mp-right-3 mp-top-3">
                        <div class="mp-animate-spin mp-h-4 mp-w-4 mp-border-2 mp-border-primary mp-border-t-transparent mp-rounded-full"></div>
                    </div>
                </div>
            `;
            
            // Find a good spot in navigation to insert search
            const navButtons = navBar.querySelector('#nav-buttons');
            if (navButtons) {
                navButtons.appendChild(searchContainer);
            }
        }
        
        // Example 3: Enhance all tables with better styling
        ModernPortal.utils.enhanceTables = function() {
            const tables = document.querySelectorAll('table.table:not(.mp-enhanced)');
            tables.forEach(table => {
                table.classList.add('mp-enhanced');
                table.style.transition = 'all 0.3s ease';
                
                // Add hover effects to rows
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    row.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = '#f3f4f6';
                    });
                    row.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = '';
                    });
                });
            });
        };
        
        ModernPortal.utils.enhanceTables();
    }
    
    function setupUtilities() {
        // Modern modal helper
        ModernPortal.utils.showModal = function(options) {
            const modal = document.createElement('div');
            modal.className = 'mp-modern mp-fixed mp-inset-0 mp-z-50 mp-overflow-y-auto';
            modal.setAttribute('x-data', '{ open: true }');
            modal.setAttribute('x-show', 'open');
            modal.innerHTML = `
                <div class="mp-flex mp-items-center mp-justify-center mp-min-h-screen mp-px-4">
                    <div x-show="open" 
                         @click="open = false"
                         x-transition:enter="mp-transition mp-ease-out mp-duration-300"
                         x-transition:enter-start="mp-opacity-0"
                         x-transition:enter-end="mp-opacity-100"
                         x-transition:leave="mp-transition mp-ease-in mp-duration-200"
                         x-transition:leave-start="mp-opacity-100"
                         x-transition:leave-end="mp-opacity-0"
                         class="mp-fixed mp-inset-0 mp-bg-gray-500 mp-bg-opacity-75"></div>
                    
                    <div x-show="open"
                         @click.away="open = false"
                         x-transition:enter="mp-transition mp-ease-out mp-duration-300"
                         x-transition:enter-start="mp-opacity-0 mp-translate-y-4 sm:mp-translate-y-0 sm:mp-scale-95"
                         x-transition:enter-end="mp-opacity-100 mp-translate-y-0 sm:mp-scale-100"
                         x-transition:leave="mp-transition mp-ease-in mp-duration-200"
                         x-transition:leave-start="mp-opacity-100 mp-translate-y-0 sm:mp-scale-100"
                         x-transition:leave-end="mp-opacity-0 mp-translate-y-4 sm:mp-translate-y-0 sm:mp-scale-95"
                         class="mp-relative mp-bg-white mp-rounded-lg mp-overflow-hidden mp-shadow-xl mp-transform mp-transition-all sm:mp-max-w-lg sm:mp-w-full">
                        <div class="mp-bg-white mp-px-4 mp-pt-5 mp-pb-4 sm:mp-p-6 sm:mp-pb-4">
                            <h3 class="mp-text-lg mp-leading-6 mp-font-medium mp-text-gray-900 mp-mb-4">
                                ${options.title || 'Modal'}
                            </h3>
                            <div class="mp-mt-2">
                                ${options.content || ''}
                            </div>
                        </div>
                        <div class="mp-bg-gray-50 mp-px-4 mp-py-3 sm:mp-px-6 sm:mp-flex sm:mp-flex-row-reverse">
                            ${options.footer || `
                                <button @click="open = false" 
                                        class="mp-w-full mp-inline-flex mp-justify-center mp-rounded-md mp-border mp-border-transparent mp-shadow-sm mp-px-4 mp-py-2 mp-bg-primary mp-text-base mp-font-medium mp-text-white hover:mp-bg-blue-700 focus:mp-outline-none sm:mp-ml-3 sm:mp-w-auto sm:mp-text-sm">
                                    Close
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            Alpine.initTree(modal);
            
            return {
                close: function() {
                    modal.remove();
                }
            };
        };
        
        // API wrapper with legacy jQuery AJAX fallback
        ModernPortal.utils.api = {
            get: function(url, options) {
                if (ModernPortal.axios) {
                    return ModernPortal.axios.get(url, options);
                } else {
                    // Fallback to legacy jQuery
                    return ModernPortal.legacyJQuery.ajax({
                        url: url,
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + ModernPortal.legacyGlobals.jwt
                        }
                    });
                }
            },
            
            post: function(url, data, options) {
                if (ModernPortal.axios) {
                    return ModernPortal.axios.post(url, data, options);
                } else {
                    return ModernPortal.legacyJQuery.ajax({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        headers: {
                            'Authorization': 'Bearer ' + ModernPortal.legacyGlobals.jwt
                        }
                    });
                }
            }
        };
        
        // Form enhancement helper
        ModernPortal.utils.enhanceForm = function(formSelector) {
            const form = document.querySelector(formSelector);
            if (!form || form.hasAttribute('x-data')) return;
            
            form.setAttribute('x-data', `{
                submitting: false,
                errors: {},
                async submit() {
                    this.submitting = true;
                    this.errors = {};
                    
                    try {
                        const formData = new FormData($el);
                        const data = Object.fromEntries(formData);
                        
                        const response = await ModernPortal.utils.api.post($el.action, data);
                        ModernPortal.notify.success('Form submitted successfully!');
                        
                        // Redirect or update UI
                        if (response.data.redirect) {
                            window.location.href = response.data.redirect;
                        }
                    } catch (error) {
                        if (error.response && error.response.data.errors) {
                            this.errors = error.response.data.errors;
                        } else {
                            ModernPortal.notify.error('An error occurred. Please try again.');
                        }
                    } finally {
                        this.submitting = false;
                    }
                }
            }`);
            
            form.setAttribute('@submit.prevent', 'submit');
            
            // Add loading state to submit button
            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
            if (submitBtn) {
                submitBtn.setAttribute(':disabled', 'submitting');
                submitBtn.setAttribute('x-text', "submitting ? 'Submitting...' : '" + submitBtn.textContent + "'");
            }
        };
        
        // Navigate helper that works with NetSapiens routing
        ModernPortal.utils.navigate = function(path) {
            // Use the legacy jQuery to trigger any existing navigation handlers
            if (window.loadPage && typeof window.loadPage === 'function') {
                window.loadPage(path);
            } else {
                window.location.href = path;
            }
        };
        
        // Event bus for component communication
        ModernPortal.events = {
            listeners: {},
            
            on: function(event, callback) {
                if (!this.listeners[event]) {
                    this.listeners[event] = [];
                }
                this.listeners[event].push(callback);
            },
            
            off: function(event, callback) {
                if (!this.listeners[event]) return;
                const index = this.listeners[event].indexOf(callback);
                if (index > -1) {
                    this.listeners[event].splice(index, 1);
                }
            },
            
            emit: function(event, data) {
                if (!this.listeners[event]) return;
                this.listeners[event].forEach(callback => callback(data));
            }
        };
        
        // Debug helper
        if (ModernPortal.config.debug) {
            window.MP = ModernPortal; // Short alias for console debugging
            console.log('Modern Portal Debug Mode: Use window.MP to access the Modern Portal object');
        }
    }
    
    // Initialize everything
    setTimeout(init, 100);
    
})();