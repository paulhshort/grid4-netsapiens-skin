/* Grid4 Command Palette - Modern fuzzy search interface */
/* Uses Microfuzz for lightweight, fast search functionality */

(function() {
    'use strict';
    
    // Ensure we have our global namespace
    window.g4c = window.g4c || {};
    
    // Command palette state
    var commandPalette = {
        isOpen: false,
        selectedIndex: 0,
        searchResults: [],
        commandIndex: [],
        overlay: null,
        input: null,
        resultsContainer: null,
        microfuzz: null
    };
    
    /**
     * Load Microfuzz library dynamically
     */
    function loadMicrofuzz(callback) {
        if (window.MicroFuzz) {
            callback(window.MicroFuzz);
            return;
        }
        
        console.log('Grid4: Loading Microfuzz library...');
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/Nozbe/microfuzz@main/dist/microfuzz.js';
        script.onload = function() {
            console.log('Grid4: Microfuzz loaded successfully');
            callback(window.MicroFuzz);
        };
        script.onerror = function() {
            console.error('Grid4: Failed to load Microfuzz library');
            // Fallback to simple string matching
            callback({
                filter: function(query, items, options) {
                    if (!query) return items.slice(0, 20);
                    var results = [];
                    var queryLower = query.toLowerCase();
                    for (var i = 0; i < items.length && results.length < 20; i++) {
                        var item = items[i];
                        var text = options.getText(item).toLowerCase();
                        if (text.indexOf(queryLower) !== -1) {
                            results.push(item);
                        }
                    }
                    return results;
                }
            });
        };
        document.head.appendChild(script);
    }
    
    /**
     * Build the command index from DOM navigation
     */
    function buildCommandIndex() {
        var commands = [];
        
        try {
            // Navigation commands from sidebar
            var navItems = document.querySelectorAll('#nav-buttons li a.nav-link');
            for (var i = 0; i < navItems.length; i++) {
                var item = navItems[i];
                var textEl = item.querySelector('.nav-text');
                if (textEl && item.href) {
                    var title = textEl.textContent.trim();
                    if (title) {
                        commands.push({
                            id: 'nav_' + i,
                            title: 'Go to ' + title,
                            subtitle: 'Navigate to ' + title + ' page',
                            category: 'Navigation',
                            icon: '🧭',
                            action: function(url) {
                                return function() {
                                    window.location.href = url;
                                };
                            }(item.href),
                            keywords: [title, 'go', 'navigate', 'open', 'page']
                        });
                    }
                }
            }
            
            // Add some built-in commands
            commands.push({
                id: 'refresh',
                title: 'Refresh Page',
                subtitle: 'Reload the current page',
                category: 'Actions',
                icon: '🔄',
                shortcut: 'F5',
                action: function() {
                    window.location.reload();
                },
                keywords: ['refresh', 'reload', 'update']
            });
            
            commands.push({
                id: 'home',
                title: 'Go to Home',
                subtitle: 'Navigate to the dashboard',
                category: 'Navigation',
                icon: '🏠',
                action: function() {
                    window.location.href = '/portal/home';
                },
                keywords: ['home', 'dashboard', 'main', 'start']
            });
            
            commands.push({
                id: 'settings',
                title: 'Platform Settings',
                subtitle: 'Access system configuration',
                category: 'Navigation',
                icon: '⚙️',
                action: function() {
                    var settingsUrl = '/portal/uiconfigs';
                    if (document.querySelector('a[href*="uiconfigs"]')) {
                        settingsUrl = document.querySelector('a[href*="uiconfigs"]').href;
                    }
                    window.location.href = settingsUrl;
                },
                keywords: ['settings', 'config', 'configuration', 'platform', 'admin']
            });
            
            // Feature flag management commands
            commands.push({
                id: 'enable_debug',
                title: 'Enable Debug Mode',
                subtitle: 'Turn on debugging features',
                category: 'Development',
                icon: '🐛',
                action: function() {
                    window.g4c.enableFeature('debugMode');
                    alert('Debug mode enabled! Refresh the page to see changes.');
                },
                keywords: ['debug', 'enable', 'development', 'dev']
            });
            
            commands.push({
                id: 'clear_features',
                title: 'Clear All Feature Flags',
                subtitle: 'Reset all Grid4 customization settings',
                category: 'Development',
                icon: '🧹',
                action: function() {
                    if (confirm('Clear all Grid4 feature flags? This will reset your customization settings.')) {
                        window.g4c.clearAllFeatures();
                        alert('Feature flags cleared! Refresh the page to see changes.');
                    }
                },
                keywords: ['clear', 'reset', 'features', 'flags', 'development']
            });
            
            console.log('Grid4: Command index built with ' + commands.length + ' commands');
            
        } catch (error) {
            console.error('Grid4: Error building command index:', error);
        }
        
        return commands;
    }
    
    /**
     * Create the command palette HTML structure
     */
    function createPaletteHTML() {
        var overlay = document.createElement('div');
        overlay.className = 'g4c-command-palette-overlay';
        overlay.innerHTML = `
            <div class="g4c-command-palette">
                <input type="text" 
                       class="g4c-command-palette-input" 
                       placeholder="Type a command or search..."
                       autocomplete="off"
                       spellcheck="false">
                <div class="g4c-command-palette-results"></div>
                <div class="g4c-command-palette-footer">
                    <div class="g4c-command-palette-hint">
                        <span><span class="g4c-command-palette-key">↑↓</span> Navigate</span>
                        <span><span class="g4c-command-palette-key">Enter</span> Select</span>
                        <span><span class="g4c-command-palette-key">Esc</span> Close</span>
                    </div>
                    <div>Grid4 Command Palette</div>
                </div>
            </div>
        `;
        
        // Add click-to-close functionality
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hidePalette();
            }
        });
        
        return overlay;
    }
    
    /**
     * Render search results
     */
    function renderResults(results) {
        if (!commandPalette.resultsContainer) return;
        
        commandPalette.searchResults = results;
        commandPalette.selectedIndex = 0;
        
        if (results.length === 0) {
            commandPalette.resultsContainer.innerHTML = `
                <div class="g4c-command-palette-empty">
                    No commands found. Try a different search term.
                </div>
            `;
            return;
        }
        
        // Group results by category
        var categories = {};
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var category = result.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({ item: result, index: i });
        }
        
        var html = '';
        var categoryOrder = ['Navigation', 'Actions', 'Development', 'Other'];
        
        for (var c = 0; c < categoryOrder.length; c++) {
            var categoryName = categoryOrder[c];
            if (!categories[categoryName] || categories[categoryName].length === 0) continue;
            
            html += '<div class="g4c-command-palette-category">' + categoryName + '</div>';
            
            for (var j = 0; j < categories[categoryName].length; j++) {
                var item = categories[categoryName][j];
                var command = item.item;
                var globalIndex = item.index;
                
                var shortcutHtml = command.shortcut ? 
                    '<span class="g4c-command-palette-shortcut">' + command.shortcut + '</span>' : '';
                
                html += `
                    <div class="g4c-command-palette-item" data-index="${globalIndex}">
                        <div class="g4c-command-palette-icon">${command.icon || '📄'}</div>
                        <div class="g4c-command-palette-content">
                            <div class="g4c-command-palette-title">${command.title}</div>
                            ${command.subtitle ? '<div class="g4c-command-palette-subtitle">' + command.subtitle + '</div>' : ''}
                        </div>
                        ${shortcutHtml}
                    </div>
                `;
            }
        }
        
        commandPalette.resultsContainer.innerHTML = html;
        updateSelection();
        
        // Add click handlers
        var items = commandPalette.resultsContainer.querySelectorAll('.g4c-command-palette-item');
        for (var k = 0; k < items.length; k++) {
            (function(index) {
                items[index].addEventListener('click', function() {
                    commandPalette.selectedIndex = parseInt(this.getAttribute('data-index'));
                    executeSelected();
                });
            })(k);
        }
    }
    
    /**
     * Update visual selection
     */
    function updateSelection() {
        if (!commandPalette.resultsContainer) return;
        
        var items = commandPalette.resultsContainer.querySelectorAll('.g4c-command-palette-item');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('g4c-selected');
        }
        
        if (commandPalette.selectedIndex >= 0 && commandPalette.selectedIndex < items.length) {
            var selectedItem = items[commandPalette.selectedIndex];
            selectedItem.classList.add('g4c-selected');
            
            // Scroll into view if needed
            selectedItem.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Execute the selected command
     */
    function executeSelected() {
        if (commandPalette.selectedIndex >= 0 && 
            commandPalette.selectedIndex < commandPalette.searchResults.length) {
            
            var command = commandPalette.searchResults[commandPalette.selectedIndex];
            
            try {
                hidePalette();
                
                if (typeof command.action === 'function') {
                    // Small delay to ensure palette is hidden before action
                    setTimeout(function() {
                        command.action();
                    }, 100);
                }
                
                console.log('Grid4: Executed command:', command.title);
                
            } catch (error) {
                console.error('Grid4: Error executing command:', error);
                alert('Error executing command: ' + command.title);
            }
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        if (!commandPalette.isOpen) return;
        
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                hidePalette();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (commandPalette.selectedIndex < commandPalette.searchResults.length - 1) {
                    commandPalette.selectedIndex++;
                    updateSelection();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (commandPalette.selectedIndex > 0) {
                    commandPalette.selectedIndex--;
                    updateSelection();
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                executeSelected();
                break;
        }
    }
    
    /**
     * Handle search input with debouncing
     */
    function handleSearch() {
        var query = commandPalette.input.value.trim();
        
        // Clear previous timeout
        if (handleSearch.timeout) {
            clearTimeout(handleSearch.timeout);
        }
        
        // Debounce search
        handleSearch.timeout = setTimeout(function() {
            performSearch(query);
        }, 150);
    }
    
    /**
     * Perform the actual search
     */
    function performSearch(query) {
        try {
            var results;
            
            if (!query) {
                // Show all commands when no query
                results = commandPalette.commandIndex.slice(0, 20);
            } else if (commandPalette.microfuzz && commandPalette.microfuzz.filter) {
                // Use Microfuzz for fuzzy search
                results = commandPalette.microfuzz.filter(query, commandPalette.commandIndex, {
                    getText: function(command) {
                        return [command.title, command.subtitle || '', command.keywords.join(' ')].join(' ');
                    },
                    limit: 20
                });
            } else {
                // Fallback search
                results = [];
                var queryLower = query.toLowerCase();
                for (var i = 0; i < commandPalette.commandIndex.length && results.length < 20; i++) {
                    var command = commandPalette.commandIndex[i];
                    var searchText = [command.title, command.subtitle || '', command.keywords.join(' ')].join(' ').toLowerCase();
                    if (searchText.indexOf(queryLower) !== -1) {
                        results.push(command);
                    }
                }
            }
            
            renderResults(results);
            
        } catch (error) {
            console.error('Grid4: Error performing search:', error);
            renderResults([]);
        }
    }
    
    /**
     * Show the command palette
     */
    function showPalette() {
        if (commandPalette.isOpen) return;
        
        commandPalette.isOpen = true;
        
        if (!commandPalette.overlay) {
            commandPalette.overlay = createPaletteHTML();
            commandPalette.input = commandPalette.overlay.querySelector('.g4c-command-palette-input');
            commandPalette.resultsContainer = commandPalette.overlay.querySelector('.g4c-command-palette-results');
            
            // Add event listeners
            commandPalette.input.addEventListener('input', handleSearch);
            document.addEventListener('keydown', handleKeyboard);
        }
        
        document.body.appendChild(commandPalette.overlay);
        
        // Trigger animation
        setTimeout(function() {
            commandPalette.overlay.classList.add('g4c-active');
        }, 10);
        
        // Focus input and show initial results
        commandPalette.input.focus();
        commandPalette.input.value = '';
        performSearch('');
        
        console.log('Grid4: Command palette opened');
    }
    
    /**
     * Hide the command palette
     */
    function hidePalette() {
        if (!commandPalette.isOpen) return;
        
        commandPalette.isOpen = false;
        
        if (commandPalette.overlay) {
            commandPalette.overlay.classList.remove('g4c-active');
            commandPalette.overlay.classList.add('g4c-closing');
            
            setTimeout(function() {
                if (commandPalette.overlay && commandPalette.overlay.parentNode) {
                    commandPalette.overlay.parentNode.removeChild(commandPalette.overlay);
                }
                if (commandPalette.overlay) {
                    commandPalette.overlay.classList.remove('g4c-closing');
                }
            }, 150);
        }
        
        console.log('Grid4: Command palette closed');
    }
    
    /**
     * Initialize the command palette system
     */
    window.g4c.initCommandPalette = function() {
        console.log('Grid4: Initializing Command Palette...');
        
        loadMicrofuzz(function(microfuzz) {
            commandPalette.microfuzz = microfuzz;
            commandPalette.commandIndex = buildCommandIndex();
            console.log('Grid4: Command Palette ready with ' + commandPalette.commandIndex.length + ' commands');
        });
    };
    
    /**
     * Show command palette (called by the main script)
     */
    window.g4c.showCommandPalette = function() {
        showPalette();
    };
    
    /**
     * Hide command palette (public API)
     */
    window.g4c.hideCommandPalette = function() {
        hidePalette();
    };
    
    /**
     * Add custom command to the palette
     */
    window.g4c.addCommand = function(command) {
        if (commandPalette.commandIndex) {
            commandPalette.commandIndex.push(command);
            console.log('Grid4: Command added:', command.title);
        }
    };
    
    console.log('Grid4: Command Palette module loaded');
    
})();