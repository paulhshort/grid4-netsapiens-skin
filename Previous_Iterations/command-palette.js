/* Grid4 Command Palette - VS Code Inspired Portal Enhancement
 * Activation: Ctrl+Shift+P (industry standard)
 * Features: Fuzzy search, keyboard navigation, action execution
 * Integration: NetSapiens portal navigation and functions
 */

(function(window, document) {
    'use strict';

    // Prevent multiple initializations
    if (window.G4CommandPalette) {
        console.warn('G4CommandPalette already initialized');
        return;
    }

    class G4CommandPalette {
        constructor() {
            this.isOpen = false;
            this.commands = [];
            this.filteredCommands = [];
            this.selectedIndex = 0;
            this.container = null;
            this.input = null;
            this.results = null;
            
            this.init();
        }

        init() {
            console.log('🎯 Initializing Grid4 Command Palette');
            
            this.loadCommands();
            this.setupKeyboardListeners();
            this.createUI();
            this.setupEventListeners();
            
            console.log(`✅ Command Palette ready with ${this.commands.length} commands`);
        }

        loadCommands() {
            // Core navigation commands
            this.commands = [
                // Navigation
                { 
                    id: 'nav-home', 
                    title: 'Go to Home', 
                    description: 'Navigate to dashboard', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/home'),
                    keywords: ['home', 'dashboard', 'main']
                },
                { 
                    id: 'nav-inventory', 
                    title: 'Go to Inventory', 
                    description: 'Manage phone numbers and hardware', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/inventory'),
                    keywords: ['inventory', 'numbers', 'phones', 'hardware']
                },
                { 
                    id: 'nav-domains', 
                    title: 'Go to Domains', 
                    description: 'Manage domains and tenants', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/domains'),
                    keywords: ['domains', 'tenants', 'customers']
                },
                { 
                    id: 'nav-callhistory', 
                    title: 'Go to Call History', 
                    description: 'View call logs and recordings', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/callhistory'),
                    keywords: ['calls', 'history', 'logs', 'recordings', 'cdr']
                },
                { 
                    id: 'nav-resellers', 
                    title: 'Go to Resellers', 
                    description: 'Manage reseller accounts', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/resellers'),
                    keywords: ['resellers', 'partners', 'accounts']
                },
                { 
                    id: 'nav-routing', 
                    title: 'Go to Routing', 
                    description: 'Configure call routing', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/routing'),
                    keywords: ['routing', 'routes', 'trunks', 'sip']
                },
                { 
                    id: 'nav-settings', 
                    title: 'Go to Platform Settings', 
                    description: 'System configuration', 
                    category: 'Navigation',
                    action: () => this.navigate('/portal/settings'),
                    keywords: ['settings', 'config', 'system', 'platform']
                },
                
                // Grid4 Features
                { 
                    id: 'g4-toggle-theme', 
                    title: 'Toggle Dark/Light Theme', 
                    description: 'Switch between dark and light themes', 
                    category: 'Grid4',
                    action: () => this.toggleTheme(),
                    keywords: ['theme', 'dark', 'light', 'mode']
                },
                { 
                    id: 'g4-feature-flags', 
                    title: 'Open Feature Flags', 
                    description: 'Manage Grid4 feature toggles', 
                    category: 'Grid4',
                    action: () => this.openFeatureFlags(),
                    keywords: ['features', 'flags', 'toggles', 'experimental']
                },
                { 
                    id: 'g4-refresh-styles', 
                    title: 'Refresh Grid4 Styles', 
                    description: 'Reload custom CSS and JavaScript', 
                    category: 'Grid4',
                    action: () => this.refreshStyles(),
                    keywords: ['refresh', 'reload', 'styles', 'css', 'js']
                },
                { 
                    id: 'g4-performance-check', 
                    title: 'Performance Check', 
                    description: 'Check for performance issues', 
                    category: 'Grid4',
                    action: () => this.performanceCheck(),
                    keywords: ['performance', 'speed', 'optimization', 'check']
                },
                
                // Quick Actions
                { 
                    id: 'action-search', 
                    title: 'Search Portal', 
                    description: 'Quick search across portal content', 
                    category: 'Actions',
                    action: () => this.focusSearch(),
                    keywords: ['search', 'find', 'lookup']
                },
                { 
                    id: 'action-export', 
                    title: 'Export Current View', 
                    description: 'Export current data to CSV/Excel', 
                    category: 'Actions',
                    action: () => this.exportData(),
                    keywords: ['export', 'download', 'csv', 'excel', 'data']
                },
                { 
                    id: 'action-refresh', 
                    title: 'Refresh Page', 
                    description: 'Reload current page content', 
                    category: 'Actions',
                    action: () => window.location.reload(),
                    keywords: ['refresh', 'reload', 'update']
                },
                
                // Help & Documentation
                { 
                    id: 'help-shortcuts', 
                    title: 'Keyboard Shortcuts', 
                    description: 'View available keyboard shortcuts', 
                    category: 'Help',
                    action: () => this.showShortcuts(),
                    keywords: ['shortcuts', 'keys', 'hotkeys', 'help']
                },
                { 
                    id: 'help-about', 
                    title: 'About Grid4 Portal', 
                    description: 'Version and system information', 
                    category: 'Help',
                    action: () => this.showAbout(),
                    keywords: ['about', 'version', 'info', 'system']
                }
            ];

            // Dynamically add navigation items from the portal
            this.scanPortalNavigation();
        }

        scanPortalNavigation() {
            try {
                const navItems = document.querySelectorAll('#navigation a, .nav-item a');
                
                navItems.forEach(item => {
                    const text = item.textContent?.trim();
                    const href = item.getAttribute('href');
                    
                    if (text && href && !this.commands.find(cmd => cmd.title.includes(text))) {
                        this.commands.push({
                            id: `nav-dynamic-${href.replace(/[^a-z0-9]/gi, '-')}`,
                            title: `Go to ${text}`,
                            description: `Navigate to ${text} page`,
                            category: 'Navigation',
                            action: () => this.navigate(href),
                            keywords: [text.toLowerCase(), 'navigate', 'go to']
                        });
                    }
                });
                
                console.log(`📡 Scanned ${navItems.length} navigation items`);
            } catch (error) {
                console.warn('⚠️ Error scanning portal navigation:', error);
            }
        }

        setupKeyboardListeners() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+K to open/close (avoiding print dialog)
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') {
                    e.preventDefault();
                    this.toggle();
                    return;
                }

                // Handle palette-specific keys when open
                if (this.isOpen) {
                    switch (e.key) {
                        case 'Escape':
                            e.preventDefault();
                            this.close();
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            this.selectNext();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            this.selectPrevious();
                            break;
                        case 'Enter':
                            e.preventDefault();
                            this.executeSelected();
                            break;
                    }
                }
            });
        }

        createUI() {
            // Main container
            this.container = document.createElement('div');
            this.container.id = 'g4-command-palette';
            this.container.className = 'g4-command-palette';
            this.container.style.display = 'none';
            
            // Overlay backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'g4-palette-backdrop';
            backdrop.addEventListener('click', () => this.close());
            
            // Main modal
            const modal = document.createElement('div');
            modal.className = 'g4-palette-modal';
            
            // Search input
            this.input = document.createElement('input');
            this.input.type = 'text';
            this.input.className = 'g4-palette-input';
            this.input.placeholder = 'Type a command or search...';
            this.input.addEventListener('input', (e) => this.handleInput(e.target.value));
            
            // Results container
            this.results = document.createElement('div');
            this.results.className = 'g4-palette-results';
            
            // Help text
            const helpText = document.createElement('div');
            helpText.className = 'g4-palette-help';
            helpText.innerHTML = '↑↓ Navigate • ↵ Execute • Esc Close • Ctrl+Shift+K Toggle';
            
            // Assemble UI
            modal.appendChild(this.input);
            modal.appendChild(this.results);
            modal.appendChild(helpText);
            
            this.container.appendChild(backdrop);
            this.container.appendChild(modal);
            
            // Add styles
            this.addStyles();
            
            // Append to body
            document.body.appendChild(this.container);
        }

        addStyles() {
            if (document.getElementById('g4-command-palette-styles')) return;
            
            const styles = document.createElement('style');
            styles.id = 'g4-command-palette-styles';
            styles.textContent = `
                .g4-command-palette {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .g4-palette-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                }
                
                .g4-palette-modal {
                    position: absolute;
                    top: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 600px;
                    background: #2a2d33;
                    border-radius: 12px;
                    border: 1px solid #404040;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                }
                
                .g4-palette-input {
                    width: 100%;
                    padding: 20px 24px;
                    background: transparent;
                    border: none;
                    color: #ffffff;
                    font-size: 16px;
                    outline: none;
                    border-bottom: 1px solid #404040;
                }
                
                .g4-palette-input::placeholder {
                    color: #888;
                }
                
                .g4-palette-results {
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .g4-palette-item {
                    padding: 12px 24px;
                    cursor: pointer;
                    border-bottom: 1px solid #333;
                    transition: background 0.1s ease;
                }
                
                .g4-palette-item:hover,
                .g4-palette-item.selected {
                    background: #0066cc;
                }
                
                .g4-palette-item-title {
                    color: #ffffff;
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .g4-palette-item-description {
                    color: #ccc;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .g4-palette-item-category {
                    display: inline-block;
                    background: #444;
                    color: #ccc;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    text-transform: uppercase;
                    margin-top: 4px;
                }
                
                .g4-palette-help {
                    padding: 12px 24px;
                    background: #1e2124;
                    color: #888;
                    font-size: 12px;
                    text-align: center;
                    border-top: 1px solid #333;
                }
                
                .g4-palette-no-results {
                    padding: 40px 24px;
                    text-align: center;
                    color: #888;
                }
                
                /* Animation */
                .g4-command-palette {
                    animation: g4PaletteIn 0.2s ease-out;
                }
                
                @keyframes g4PaletteIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            
            document.head.appendChild(styles);
        }

        setupEventListeners() {
            // Click handlers for results
            this.results.addEventListener('click', (e) => {
                const item = e.target.closest('.g4-palette-item');
                if (item) {
                    const index = parseInt(item.dataset.index, 10);
                    this.selectedIndex = index;
                    this.executeSelected();
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.container.style.display = 'block';
            this.input.value = '';
            this.selectedIndex = 0;
            this.filteredCommands = [...this.commands];
            this.updateResults();
            
            // Focus input after animation
            setTimeout(() => this.input.focus(), 100);
            
            console.log('🎯 Command Palette opened');
        }

        close() {
            this.isOpen = false;
            this.container.style.display = 'none';
            console.log('🎯 Command Palette closed');
        }

        handleInput(query) {
            this.selectedIndex = 0;
            
            if (!query.trim()) {
                this.filteredCommands = [...this.commands];
            } else {
                this.filteredCommands = this.fuzzySearch(query);
            }
            
            this.updateResults();
        }

        fuzzySearch(query) {
            const searchQuery = query.toLowerCase();
            
            return this.commands
                .map(command => {
                    let score = 0;
                    const titleLower = command.title.toLowerCase();
                    const descLower = command.description.toLowerCase();
                    const keywords = command.keywords || [];
                    
                    // Exact title match (highest score)
                    if (titleLower.includes(searchQuery)) {
                        score += 100;
                    }
                    
                    // Description match
                    if (descLower.includes(searchQuery)) {
                        score += 50;
                    }
                    
                    // Keyword match
                    keywords.forEach(keyword => {
                        if (keyword.toLowerCase().includes(searchQuery)) {
                            score += 30;
                        }
                    });
                    
                    // Character sequence match (fuzzy)
                    let queryIndex = 0;
                    for (let i = 0; i < titleLower.length && queryIndex < searchQuery.length; i++) {
                        if (titleLower[i] === searchQuery[queryIndex]) {
                            queryIndex++;
                            score += 10;
                        }
                    }
                    
                    return { command, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.command);
        }

        updateResults() {
            this.results.innerHTML = '';
            
            if (this.filteredCommands.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'g4-palette-no-results';
                noResults.textContent = 'No commands found';
                this.results.appendChild(noResults);
                return;
            }
            
            this.filteredCommands.forEach((command, index) => {
                const item = document.createElement('div');
                item.className = 'g4-palette-item';
                item.dataset.index = index;
                
                if (index === this.selectedIndex) {
                    item.classList.add('selected');
                }
                
                item.innerHTML = `
                    <div class="g4-palette-item-title">${command.title}</div>
                    <div class="g4-palette-item-description">${command.description}</div>
                    <div class="g4-palette-item-category">${command.category}</div>
                `;
                
                this.results.appendChild(item);
            });
        }

        selectNext() {
            if (this.filteredCommands.length === 0) return;
            
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
            this.updateResults();
            this.scrollToSelected();
        }

        selectPrevious() {
            if (this.filteredCommands.length === 0) return;
            
            this.selectedIndex = this.selectedIndex === 0 
                ? this.filteredCommands.length - 1 
                : this.selectedIndex - 1;
            this.updateResults();
            this.scrollToSelected();
        }

        scrollToSelected() {
            const selectedElement = this.results.querySelector('.g4-palette-item.selected');
            if (selectedElement) {
                selectedElement.scrollIntoView({ 
                    block: 'nearest',
                    behavior: 'smooth' 
                });
            }
        }

        executeSelected() {
            if (this.filteredCommands.length === 0) return;
            
            const command = this.filteredCommands[this.selectedIndex];
            if (command && command.action) {
                console.log(`🎯 Executing command: ${command.title}`);
                
                try {
                    command.action();
                    this.close();
                } catch (error) {
                    console.error('❌ Command execution failed:', error);
                    this.showToast('Command execution failed', 'error');
                }
            }
        }

        // Command Actions
        navigate(url) {
            if (url.startsWith('/')) {
                window.location.href = url;
            } else if (url.startsWith('http')) {
                window.open(url, '_blank');
            } else {
                window.location.href = '/portal/' + url;
            }
        }

        toggleTheme() {
            if (window.g4c && window.g4c.toggleFeature) {
                window.g4c.toggleFeature('darkTheme');
            } else {
                document.body.classList.toggle('g4-light-theme');
            }
            this.showToast('Theme toggled', 'success');
        }

        openFeatureFlags() {
            if (window.featureFlags && window.featureFlags.open) {
                window.featureFlags.open();
            } else {
                this.showToast('Feature flags not available', 'warning');
            }
        }

        refreshStyles() {
            // Force reload Grid4 CSS and JS
            const links = document.querySelectorAll('link[href*="grid4"]');
            const scripts = document.querySelectorAll('script[src*="grid4"]');
            
            links.forEach(link => {
                const newLink = link.cloneNode();
                newLink.href = link.href + '?v=' + Date.now();
                link.parentNode.replaceChild(newLink, link);
            });
            
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.src = script.src + '?v=' + Date.now();
                script.parentNode.replaceChild(newScript, script);
            });
            
            this.showToast('Styles refreshed', 'success');
        }

        performanceCheck() {
            // Check for common performance issues
            const issues = [];
            
            // Check for interval loops
            if (window.g4c && window.g4c.wrapperMonitorInterval) {
                issues.push('Wrapper background monitoring loop detected');
            }
            
            // Check resource count
            const resourceCount = performance.getEntriesByType('resource').length;
            if (resourceCount > 100) {
                issues.push(`High resource count: ${resourceCount} resources loaded`);
            }
            
            // Check for large DOM
            const elementCount = document.querySelectorAll('*').length;
            if (elementCount > 2000) {
                issues.push(`Large DOM: ${elementCount} elements`);
            }
            
            if (issues.length === 0) {
                this.showToast('No performance issues detected', 'success');
            } else {
                this.showToast(`${issues.length} performance issues found`, 'warning');
                console.warn('Performance issues:', issues);
            }
        }

        focusSearch() {
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], .search-input');
            if (searchInput) {
                searchInput.focus();
                this.showToast('Search focused', 'info');
            } else {
                this.showToast('No search field found', 'warning');
            }
        }

        exportData() {
            // Try to find export button or trigger export
            const exportBtn = document.querySelector('[onclick*="export"], .export-btn, button[title*="export"]');
            if (exportBtn) {
                exportBtn.click();
                this.showToast('Export triggered', 'success');
            } else {
                this.showToast('No export function found', 'warning');
            }
        }

        showShortcuts() {
            const shortcuts = [
                'Ctrl+Shift+K - Command Palette',
                'F - Feature Flags (if available)',
                'Ctrl+R - Refresh Page',
                'Ctrl+F - Find in Page',
                '/ - Quick Search (portal dependent)'
            ];
            
            alert('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
        }

        showAbout() {
            const info = [
                'Grid4 Portal Enhancement Suite',
                `Command Palette v1.0`,
                `Commands: ${this.commands.length}`,
                `Browser: ${navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length - 1]}`,
                `Grid4: ${window.Grid4 ? window.Grid4.version : 'Not loaded'}`
            ];
            
            alert(info.join('\n'));
        }

        showToast(message, type = 'info') {
            // Use Grid4 toast if available, otherwise fallback to console
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        }
    }

    // Initialize Command Palette
    window.G4CommandPalette = new G4CommandPalette();

    // Expose for external use
    window.commandPalette = {
        open: () => window.G4CommandPalette.open(),
        close: () => window.G4CommandPalette.close(),
        toggle: () => window.G4CommandPalette.toggle(),
        addCommand: (command) => {
            window.G4CommandPalette.commands.push(command);
            console.log(`Command added: ${command.title}`);
        }
    };

    console.log('🎯 Grid4 Command Palette initialized - Press Ctrl+Shift+K to activate');

})(window, document);
