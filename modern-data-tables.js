/* Grid4 Modern Data Tables - Grid.js Integration
 * Implements Zen + Gemini AI recommendations for high-performance table enhancement
 * Grid.js: 2.5KB gzipped, dependency-free, enterprise-grade performance
 */

(function(window, document, $) {
    'use strict';

    const ModernDataTables = {
        _initialized: false,
        _enhancedTables: new Map(),
        _gridJSLoaded: false,

        // Grid.js CDN and configuration
        GRIDJS_CDN: 'https://unpkg.com/gridjs/dist/gridjs.umd.js',
        GRIDJS_CSS: 'https://unpkg.com/gridjs/dist/theme/mermaid.min.css',

        // Table enhancement patterns for NetSapiens portal
        TABLE_PATTERNS: {
            userTables: {
                selector: 'table[id*="user"], table.user-table, .users-table table',
                config: {
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 50,
                        summary: true
                    },
                    columns: ['Name', 'Extension', 'Email', 'Status', 'Actions'],
                    className: {
                        table: 'g4-modern-table g4-user-table',
                        header: 'g4-table-header',
                        tbody: 'g4-table-body'
                    }
                }
            },

            domainTables: {
                selector: 'table[id*="domain"], table.domain-table, .domains-table table',
                config: {
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 25,
                        summary: true
                    },
                    columns: ['Domain', 'Reseller', 'Users', 'Active Calls', 'Actions'],
                    className: {
                        table: 'g4-modern-table g4-domain-table',
                        header: 'g4-table-header',
                        tbody: 'g4-table-body'
                    }
                }
            },

            inventoryTables: {
                selector: 'table[id*="inventory"], table.inventory-table, .inventory-table table',
                config: {
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 100,
                        summary: true
                    },
                    columns: ['Device', 'MAC Address', 'Status', 'User', 'Actions'],
                    className: {
                        table: 'g4-modern-table g4-inventory-table',
                        header: 'g4-table-header',
                        tbody: 'g4-table-body'
                    }
                }
            },

            callHistoryTables: {
                selector: 'table[id*="call"], table.call-table, .call-history-table table',
                config: {
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 200,
                        summary: true
                    },
                    columns: ['Time', 'From', 'To', 'Duration', 'Status'],
                    className: {
                        table: 'g4-modern-table g4-call-table',
                        header: 'g4-table-header',
                        tbody: 'g4-table-body'
                    }
                }
            },

            genericTables: {
                selector: 'table:not(.g4-enhanced):not([class*="calendar"])',
                config: {
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 50,
                        summary: true
                    },
                    className: {
                        table: 'g4-modern-table',
                        header: 'g4-table-header',
                        tbody: 'g4-table-body'
                    }
                }
            }
        },

        init: function() {
            if (this._initialized) return;
            
            console.log('📊 ModernDataTables: Initializing Grid.js enhancement system...');
            
            // Load Grid.js library
            this.loadGridJS(() => {
                // Apply table enhancements after Grid.js loads
                this.enhanceAllTables();
                
                // Setup monitoring for new tables
                this.setupTableMonitoring();
                
                this._initialized = true;
                console.log('✅ ModernDataTables: Grid.js system ready - Enterprise-grade table performance active');
            });
        },

        loadGridJS: function(callback) {
            if (this._gridJSLoaded) {
                callback();
                return;
            }

            console.log('📦 ModernDataTables: Loading Grid.js library (2.5KB)...');
            
            // Load CSS first
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = this.GRIDJS_CSS;
            cssLink.onload = () => {
                console.log('🎨 ModernDataTables: Grid.js CSS loaded');
                
                // Then load JavaScript
                const script = document.createElement('script');
                script.src = this.GRIDJS_CDN;
                script.async = true;
                script.onload = () => {
                    console.log('⚡ ModernDataTables: Grid.js JavaScript loaded');
                    this._gridJSLoaded = true;
                    
                    // Apply custom Grid.js styling
                    this.injectCustomTableCSS();
                    
                    callback();
                };
                script.onerror = () => {
                    console.warn('❌ ModernDataTables: Failed to load Grid.js - falling back to basic enhancements');
                    this.applyBasicTableEnhancements();
                };
                document.head.appendChild(script);
            };
            document.head.appendChild(cssLink);
        },

        injectCustomTableCSS: function() {
            const style = document.createElement('style');
            style.id = 'g4-modern-tables-css';
            style.textContent = `
                /* Grid4 Modern Data Tables - Grid.js Integration */
                .g4-modern-table-container {
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                /* Grid.js Dark Theme Integration */
                .gridjs-wrapper {
                    background: transparent !important;
                }
                
                .gridjs-table {
                    background: transparent !important;
                    color: #f8f9fa !important;
                    border: none !important;
                }
                
                .gridjs-th {
                    background: #374151 !important;
                    color: #f9fafb !important;
                    border: none !important;
                    font-weight: 600 !important;
                    padding: 0.75rem 1rem !important;
                    font-size: 0.875rem !important;
                    letter-spacing: 0.025em !important;
                }
                
                .gridjs-td {
                    background: transparent !important;
                    color: #f8f9fa !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    padding: 0.75rem 1rem !important;
                    font-size: 0.875rem !important;
                }
                
                .gridjs-tr:hover .gridjs-td {
                    background: rgba(102, 126, 234, 0.1) !important;
                }
                
                /* Search styling */
                .gridjs-search {
                    margin-bottom: 1rem;
                }
                
                .gridjs-search-input {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 0.375rem !important;
                    color: #f8f9fa !important;
                    padding: 0.5rem 0.75rem !important;
                    font-size: 0.875rem !important;
                    width: 100% !important;
                    max-width: 300px !important;
                }
                
                .gridjs-search-input:focus {
                    outline: none !important;
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                }
                
                /* Pagination styling */
                .gridjs-pagination {
                    margin-top: 1rem;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                }
                
                .gridjs-pagination button {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: #f8f9fa !important;
                    padding: 0.5rem 0.75rem !important;
                    border-radius: 0.375rem !important;
                    font-size: 0.875rem !important;
                    transition: all 0.2s ease !important;
                }
                
                .gridjs-pagination button:hover {
                    background: rgba(102, 126, 234, 0.2) !important;
                    border-color: #667eea !important;
                    transform: translateY(-1px) !important;
                }
                
                .gridjs-pagination button[disabled] {
                    opacity: 0.5 !important;
                    cursor: not-allowed !important;
                }
                
                /* Summary styling */
                .gridjs-summary {
                    color: #cbd5e1 !important;
                    font-size: 0.875rem !important;
                    margin-top: 0.5rem !important;
                    text-align: center !important;
                }
                
                /* Loading animation */
                .gridjs-loading {
                    color: #667eea !important;
                    font-size: 1rem !important;
                    text-align: center !important;
                    padding: 2rem !important;
                }
                
                /* Sort indicators */
                .gridjs-th-sort {
                    cursor: pointer !important;
                    user-select: none !important;
                }
                
                .gridjs-th-sort:hover {
                    background: #4b5563 !important;
                }
                
                .gridjs-th-sort::after {
                    content: " ↕" !important;
                    opacity: 0.5 !important;
                    font-size: 0.75rem !important;
                }
                
                .gridjs-th-sort-asc::after {
                    content: " ↑" !important;
                    opacity: 1 !important;
                    color: #667eea !important;
                }
                
                .gridjs-th-sort-desc::after {
                    content: " ↓" !important;
                    opacity: 1 !important;
                    color: #667eea !important;
                }
            `;
            
            document.head.appendChild(style);
            console.log('🎨 ModernDataTables: Custom Grid.js styling applied');
        },

        enhanceAllTables: function() {
            console.log('🔧 ModernDataTables: Enhancing all tables with Grid.js...');
            
            Object.entries(this.TABLE_PATTERNS).forEach(([patternName, pattern]) => {
                this.enhanceTablesByPattern(patternName, pattern);
            });
        },

        enhanceTablesByPattern: function(patternName, pattern) {
            const tables = document.querySelectorAll(pattern.selector);
            if (tables.length === 0) return;
            
            console.log(`📊 ModernDataTables: Found ${tables.length} ${patternName} tables to enhance`);
            
            tables.forEach((table, index) => {
                this.enhanceTable(table, pattern.config, `${patternName}-${index}`);
            });
        },

        enhanceTable: function(originalTable, config, tableId) {
            try {
                // Skip if already enhanced
                if (originalTable.classList.contains('g4-enhanced-table')) return;
                
                // Extract data from existing table
                const tableData = this.extractTableData(originalTable);
                if (tableData.length === 0) return;
                
                // Create container for Grid.js
                const container = document.createElement('div');
                container.className = 'g4-modern-table-container';
                container.id = `g4-table-${tableId}`;
                
                // Insert container before original table
                originalTable.parentNode.insertBefore(container, originalTable);
                
                // Hide original table
                originalTable.style.display = 'none';
                originalTable.classList.add('g4-enhanced-table', 'g4-original-table');
                
                // Configure Grid.js
                const gridConfig = {
                    ...config,
                    data: tableData,
                    language: {
                        search: {
                            placeholder: '🔍 Search...'
                        },
                        pagination: {
                            previous: '← Previous',
                            next: 'Next →',
                            showing: 'Showing',
                            of: 'of',
                            to: 'to',
                            results: 'results'
                        }
                    }
                };
                
                // Initialize Grid.js
                const grid = new window.gridjs.Grid(gridConfig);
                grid.render(container);
                
                // Store reference
                this._enhancedTables.set(tableId, {
                    originalTable: originalTable,
                    container: container,
                    grid: grid,
                    config: gridConfig
                });
                
                console.log(`✅ ModernDataTables: Enhanced table ${tableId} with Grid.js`);
                
            } catch (error) {
                console.error(`❌ ModernDataTables: Error enhancing table ${tableId}:`, error);
                // Fallback to basic enhancement
                this.applyBasicTableEnhancement(originalTable);
            }
        },

        extractTableData: function(table) {
            const data = [];
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowData = [];
                
                cells.forEach(cell => {
                    // Extract text content, handle links and buttons
                    let cellContent = cell.textContent.trim();
                    
                    // If cell contains links or buttons, preserve them as HTML
                    const links = cell.querySelectorAll('a, button');
                    if (links.length > 0) {
                        cellContent = cell.innerHTML;
                    }
                    
                    rowData.push(cellContent);
                });
                
                if (rowData.length > 0) {
                    data.push(rowData);
                }
            });
            
            return data;
        },

        setupTableMonitoring: function() {
            // Monitor for new tables being added to the page
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Check if new node contains tables
                                    const newTables = node.tagName === 'TABLE' ? [node] : 
                                                    node.querySelectorAll ? node.querySelectorAll('table') : [];
                                    
                                    if (newTables.length > 0) {
                                        console.log(`📊 ModernDataTables: ${newTables.length} new tables detected, enhancing...`);
                                        setTimeout(() => this.enhanceAllTables(), 100);
                                    }
                                }
                            });
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                console.log('👁️ ModernDataTables: Table monitoring active');
            }
        },

        applyBasicTableEnhancements: function() {
            // Fallback enhancement when Grid.js fails to load
            console.log('📊 ModernDataTables: Applying basic table enhancements (fallback)');
            
            const tables = document.querySelectorAll('table:not(.g4-enhanced)');
            tables.forEach(table => {
                this.applyBasicTableEnhancement(table);
            });
        },

        applyBasicTableEnhancement: function(table) {
            table.classList.add('g4-enhanced', 'g4-basic-table');
            
            // Apply basic styling
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.borderRadius = '0.5rem';
            table.style.overflow = 'hidden';
            table.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            
            // Enhance headers
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
                th.style.backgroundColor = '#374151';
                th.style.color = '#f9fafb';
                th.style.fontWeight = '600';
                th.style.padding = '0.75rem 1rem';
                th.style.fontSize = '0.875rem';
            });
            
            // Enhance cells
            const cells = table.querySelectorAll('td');
            cells.forEach(td => {
                td.style.padding = '0.75rem 1rem';
                td.style.borderBottom = '1px solid #e5e7eb';
                td.style.fontSize = '0.875rem';
            });
            
            console.log('✅ ModernDataTables: Applied basic table enhancement');
        },

        // Public API
        refresh: function() {
            console.log('🔄 ModernDataTables: Refreshing all table enhancements...');
            this.enhanceAllTables();
        },

        getStats: function() {
            return {
                initialized: this._initialized,
                gridJSLoaded: this._gridJSLoaded,
                enhancedTables: this._enhancedTables.size,
                patterns: Object.keys(this.TABLE_PATTERNS),
                version: '1.0 (Grid.js Integration)'
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        ModernDataTables.init();
    });

    // Expose globally
    window.ModernDataTables = ModernDataTables;
    
    if (window.g4c) {
        window.g4c.ModernDataTables = ModernDataTables;
    }

    console.log('📦 ModernDataTables loaded - Grid.js integration for enterprise-grade table performance!');

})(window, document, jQuery);