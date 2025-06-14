/* Grid4 Shadow DOM Component System - True Isolation from Legacy Environment
 * REVOLUTIONARY APPROACH: Create encapsulated modern components immune to NetSapiens globals
 * Based on Zen AI recommendations for component isolation in hostile environments
 * 
 * FEATURES:
 * - Complete CSS isolation from legacy styles
 * - JavaScript namespace protection from global pollution
 * - Modern component patterns (custom elements, reactive state)
 * - Seamless integration with legacy NetSapiens data
 */

(function(window, document) {
    'use strict';

    // Grid4 Shadow Component Registry
    window.Grid4Components = window.Grid4Components || {
        version: '1.0.0',
        registry: new Map(),
        
        /**
         * Define a new Shadow DOM component
         * @param {string} name - Component name (must include hyphen)
         * @param {Object} definition - Component definition
         */
        define(name, definition) {
            if (this.registry.has(name)) {
                console.warn(`Grid4 Component ${name} already registered`);
                return;
            }
            
            const ComponentClass = this.createComponentClass(name, definition);
            customElements.define(name, ComponentClass);
            this.registry.set(name, ComponentClass);
            
            console.log(`✨ Grid4: Registered shadow component ${name}`);
        },
        
        /**
         * Create a component class with Shadow DOM isolation
         */
        createComponentClass(name, definition) {
            return class extends HTMLElement {
                constructor() {
                    super();
                    
                    // Create Shadow DOM for complete isolation
                    this.shadow = this.attachShadow({ mode: 'open' });
                    
                    // Component state
                    this._state = definition.initialState || {};
                    this._refs = {};
                    
                    // Bind methods
                    if (definition.methods) {
                        Object.keys(definition.methods).forEach(methodName => {
                            this[methodName] = definition.methods[methodName].bind(this);
                        });
                    }
                    
                    console.log(`🏗️ Grid4: Creating ${name} component`);
                }
                
                connectedCallback() {
                    this.render();
                    
                    if (definition.mounted) {
                        definition.mounted.call(this);
                    }
                    
                    // Setup observers for reactive updates
                    this.setupReactivity();
                }
                
                disconnectedCallback() {
                    if (definition.unmounted) {
                        definition.unmounted.call(this);
                    }
                }
                
                /**
                 * Render component with complete style isolation
                 */
                render() {
                    const template = definition.template ? 
                        definition.template.call(this, this._state) : 
                        '<div>Grid4 Component</div>';
                    
                    const styles = definition.styles || '';
                    
                    this.shadow.innerHTML = `
                        <style>
                            /* Reset styles to prevent legacy interference */
                            :host {
                                all: initial;
                                display: block;
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            }
                            
                            /* Component-specific styles */
                            ${styles}
                            
                            /* Grid4 Design System Variables */
                            :host {
                                --g4-primary: #667eea;
                                --g4-secondary: #764ba2;
                                --g4-accent: #00d4ff;
                                --g4-text-primary: #1f2937;
                                --g4-text-secondary: #6b7280;
                                --g4-bg-primary: #ffffff;
                                --g4-bg-secondary: #f9fafb;
                                --g4-border-default: #e5e7eb;
                                --g4-radius-md: 0.375rem;
                                --g4-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            }
                            
                            /* Dark theme support */
                            :host([theme="dark"]) {
                                --g4-text-primary: #f3f4f6;
                                --g4-text-secondary: #d1d5db;
                                --g4-bg-primary: #1f2937;
                                --g4-bg-secondary: #111827;
                                --g4-border-default: #374151;
                            }
                        </style>
                        ${template}
                    `;
                    
                    // Cache element references
                    this.cacheRefs();
                    
                    // Setup event listeners
                    this.setupEventListeners();
                }
                
                /**
                 * Cache DOM references for performance
                 */
                cacheRefs() {
                    const refElements = this.shadow.querySelectorAll('[ref]');
                    refElements.forEach(el => {
                        const refName = el.getAttribute('ref');
                        this._refs[refName] = el;
                    });
                }
                
                /**
                 * Setup event listeners with proper scope
                 */
                setupEventListeners() {
                    if (!definition.events) return;
                    
                    Object.keys(definition.events).forEach(selector => {
                        const handler = definition.events[selector];
                        const elements = this.shadow.querySelectorAll(selector);
                        
                        elements.forEach(el => {
                            // Parse event type from handler name or use click as default
                            const eventType = handler.eventType || 'click';
                            el.addEventListener(eventType, handler.bind(this));
                        });
                    });
                }
                
                /**
                 * Reactive state management
                 */
                setState(newState) {
                    const oldState = { ...this._state };
                    this._state = { ...this._state, ...newState };
                    
                    if (definition.stateChanged) {
                        definition.stateChanged.call(this, this._state, oldState);
                    }
                    
                    // Re-render if template is reactive
                    if (definition.reactive !== false) {
                        this.render();
                    }
                }
                
                /**
                 * Setup reactivity observers
                 */
                setupReactivity() {
                    // Observe attribute changes
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes') {
                                const attrName = mutation.attributeName;
                                const newValue = this.getAttribute(attrName);
                                
                                if (definition.attributeChanged) {
                                    definition.attributeChanged.call(this, attrName, newValue, mutation.oldValue);
                                }
                            }
                        });
                    });
                    
                    observer.observe(this, { attributes: true, attributeOldValue: true });
                }
                
                /**
                 * Safe communication with legacy NetSapiens environment
                 */
                emitToHost(eventName, data) {
                    const customEvent = new CustomEvent(`grid4-${eventName}`, {
                        detail: data,
                        bubbles: true,
                        composed: true // Crosses shadow boundary
                    });
                    
                    this.dispatchEvent(customEvent);
                }
                
                /**
                 * Safe data access from legacy environment
                 */
                getHostData(selector) {
                    try {
                        const hostElement = document.querySelector(selector);
                        return hostElement ? hostElement.textContent || hostElement.value : null;
                    } catch (error) {
                        console.warn(`Grid4: Could not access host data for ${selector}:`, error);
                        return null;
                    }
                }
            };
        }
    };

    /**
     * EXAMPLE COMPONENTS - Production-Ready Implementations
     */

    // Enhanced User Table Component
    Grid4Components.define('grid4-user-table', {
        initialState: {
            users: [],
            loading: false,
            sortColumn: 'name',
            sortDirection: 'asc',
            searchQuery: ''
        },
        
        template(state) {
            return `
                <div class="user-table-container">
                    <div class="table-header">
                        <h2>Users</h2>
                        <div class="search-container">
                            <input ref="searchInput" type="text" placeholder="Search users..." 
                                   value="${state.searchQuery}" class="search-input">
                        </div>
                    </div>
                    
                    <div class="table-wrapper">
                        ${state.loading ? 
                            '<div class="loading">Loading users...</div>' :
                            this.renderTable(state)
                        }
                    </div>
                </div>
            `;
        },
        
        styles: `
            .user-table-container {
                background: var(--g4-bg-primary);
                border-radius: var(--g4-radius-md);
                box-shadow: var(--g4-shadow-md);
                padding: 1.5rem;
            }
            
            .table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .table-header h2 {
                color: var(--g4-text-primary);
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .search-input {
                padding: 0.5rem 1rem;
                border: 1px solid var(--g4-border-default);
                border-radius: var(--g4-radius-md);
                font-size: 0.875rem;
                width: 300px;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--g4-primary);
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .loading {
                text-align: center;
                padding: 2rem;
                color: var(--g4-text-secondary);
            }
            
            .user-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .user-table th,
            .user-table td {
                padding: 0.75rem;
                text-align: left;
                border-bottom: 1px solid var(--g4-border-default);
            }
            
            .user-table th {
                background: var(--g4-bg-secondary);
                font-weight: 600;
                color: var(--g4-text-primary);
                cursor: pointer;
                user-select: none;
            }
            
            .user-table th:hover {
                background: #f3f4f6;
            }
            
            .user-table td {
                color: var(--g4-text-primary);
            }
            
            .user-table tr:hover {
                background: var(--g4-bg-secondary);
            }
            
            .sort-indicator {
                margin-left: 0.5rem;
                font-size: 0.75rem;
                opacity: 0.6;
            }
        `,
        
        events: {
            '[ref="searchInput"]': {
                eventType: 'input',
                handler: function(e) {
                    this.setState({ searchQuery: e.target.value });
                    this.performSearch();
                }
            },
            
            '.user-table th[data-sort]': {
                eventType: 'click',
                handler: function(e) {
                    const column = e.target.dataset.sort;
                    const direction = this._state.sortColumn === column && this._state.sortDirection === 'asc' ? 'desc' : 'asc';
                    
                    this.setState({ 
                        sortColumn: column, 
                        sortDirection: direction 
                    });
                    
                    this.sortUsers();
                }
            }
        },
        
        methods: {
            renderTable(state) {
                const filteredUsers = this.getFilteredUsers(state);
                
                return `
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th data-sort="name">
                                    Name 
                                    ${state.sortColumn === 'name' ? 
                                        `<span class="sort-indicator">${state.sortDirection === 'asc' ? '↑' : '↓'}</span>` : 
                                        ''
                                    }
                                </th>
                                <th data-sort="email">
                                    Email
                                    ${state.sortColumn === 'email' ? 
                                        `<span class="sort-indicator">${state.sortDirection === 'asc' ? '↑' : '↓'}</span>` : 
                                        ''
                                    }
                                </th>
                                <th data-sort="domain">Domain</th>
                                <th data-sort="status">Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredUsers.map(user => `
                                <tr>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.domain}</td>
                                    <td>${user.status}</td>
                                    <td>
                                        <button class="action-btn" data-user-id="${user.id}">Edit</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            },
            
            getFilteredUsers(state) {
                return state.users.filter(user => 
                    user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(state.searchQuery.toLowerCase())
                );
            },
            
            performSearch() {
                // Debounce search
                clearTimeout(this._searchTimeout);
                this._searchTimeout = setTimeout(() => {
                    this.render();
                }, 300);
            },
            
            sortUsers() {
                const sorted = [...this._state.users].sort((a, b) => {
                    const aVal = a[this._state.sortColumn] || '';
                    const bVal = b[this._state.sortColumn] || '';
                    
                    if (this._state.sortDirection === 'asc') {
                        return aVal.localeCompare(bVal);
                    } else {
                        return bVal.localeCompare(aVal);
                    }
                });
                
                this.setState({ users: sorted });
            },
            
            loadUsersFromHost() {
                // Extract user data from legacy NetSapiens table
                this.setState({ loading: true });
                
                setTimeout(() => {
                    const legacyRows = document.querySelectorAll('#content table tbody tr');
                    const users = Array.from(legacyRows).map((row, index) => {
                        const cells = row.querySelectorAll('td');
                        return {
                            id: index,
                            name: cells[0]?.textContent?.trim() || '',
                            email: cells[1]?.textContent?.trim() || '',
                            domain: cells[2]?.textContent?.trim() || '',
                            status: cells[3]?.textContent?.trim() || ''
                        };
                    });
                    
                    this.setState({ users, loading: false });
                }, 1000);
            }
        },
        
        mounted() {
            // Load data from legacy NetSapiens environment
            this.loadUsersFromHost();
            
            // Listen for legacy page updates
            document.addEventListener('DOMContentLoaded', () => {
                this.loadUsersFromHost();
            });
        }
    });

    // Theme-Aware Command Palette Component
    Grid4Components.define('grid4-command-palette', {
        initialState: {
            visible: false,
            query: '',
            selectedIndex: 0,
            commands: [
                { id: 'theme-light', name: 'Switch to Light Theme', action: 'theme:light' },
                { id: 'theme-dark', name: 'Switch to Dark Theme', action: 'theme:dark' },
                { id: 'theme-contrast', name: 'Switch to High Contrast', action: 'theme:contrast' },
                { id: 'search-users', name: 'Search Users', action: 'navigate:users' },
                { id: 'view-calls', name: 'View Call Logs', action: 'navigate:calls' },
                { id: 'settings', name: 'Open Settings', action: 'navigate:settings' }
            ]
        },
        
        template(state) {
            if (!state.visible) return '<div></div>';
            
            const filteredCommands = this.getFilteredCommands(state);
            
            return `
                <div class="command-overlay" ref="overlay">
                    <div class="command-palette">
                        <div class="command-input-container">
                            <input ref="commandInput" type="text" 
                                   placeholder="Type a command..." 
                                   value="${state.query}"
                                   class="command-input">
                        </div>
                        
                        <div class="command-list">
                            ${filteredCommands.map((cmd, index) => `
                                <div class="command-item ${index === state.selectedIndex ? 'selected' : ''}" 
                                     data-command="${cmd.action}">
                                    ${cmd.name}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        },
        
        styles: `
            .command-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 20vh;
                z-index: 999999;
            }
            
            .command-palette {
                background: var(--g4-bg-primary);
                border-radius: var(--g4-radius-md);
                box-shadow: var(--g4-shadow-md);
                width: 600px;
                max-width: 90vw;
                overflow: hidden;
            }
            
            .command-input {
                width: 100%;
                padding: 1rem;
                border: none;
                font-size: 1rem;
                background: transparent;
                color: var(--g4-text-primary);
            }
            
            .command-input:focus {
                outline: none;
            }
            
            .command-list {
                max-height: 300px;
                overflow-y: auto;
            }
            
            .command-item {
                padding: 0.75rem 1rem;
                color: var(--g4-text-primary);
                cursor: pointer;
                border-top: 1px solid var(--g4-border-default);
            }
            
            .command-item:hover,
            .command-item.selected {
                background: var(--g4-bg-secondary);
            }
        `,
        
        methods: {
            getFilteredCommands(state) {
                return state.commands.filter(cmd => 
                    cmd.name.toLowerCase().includes(state.query.toLowerCase())
                );
            },
            
            show() {
                this.setState({ visible: true });
                setTimeout(() => {
                    if (this._refs.commandInput) {
                        this._refs.commandInput.focus();
                    }
                }, 100);
            },
            
            hide() {
                this.setState({ visible: false, query: '', selectedIndex: 0 });
            },
            
            executeCommand(action) {
                console.log('Grid4: Executing command', action);
                
                if (action.startsWith('theme:')) {
                    const theme = action.split(':')[1];
                    this.emitToHost('theme-change', { theme });
                } else if (action.startsWith('navigate:')) {
                    const page = action.split(':')[1];
                    this.emitToHost('navigate', { page });
                }
                
                this.hide();
            }
        },
        
        mounted() {
            // Global keyboard listener for activation
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                    e.preventDefault();
                    this.show();
                }
                
                if (e.key === 'Escape' && this._state.visible) {
                    this.hide();
                }
            });
        }
    });

    console.log('🏗️ Grid4: Shadow DOM Component System loaded - True isolation ready!');

})(window, document);