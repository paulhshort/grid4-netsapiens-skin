/* Grid4 Feature Flags UI - Beautiful Feature Management Interface
 * Professional feature flag management with modern design
 * Integrates with Grid4's existing feature flag system
 */

(function(window, document, $) {
    'use strict';

    const FeatureFlagsUI = {
        _isOpen: false,
        _currentFilter: 'all',
        
        // Complete feature definitions matching the screenshot
        FEATURES: {
            'toastNotifications': {
                name: 'Toast Notifications',
                description: 'Beautiful toast messages for user feedback and system alerts',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'loadingAnimations': {
                name: 'Loading Animations', 
                description: 'Smooth loading states and progress indicators throughout the portal',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'commandPalette': {
                name: 'Command Palette',
                description: 'Quick access command interface with fuzzy search (Ctrl+Shift+K)',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'darkMode': {
                name: 'Dark Mode',
                description: 'Premium dark theme with automatic system detection',
                category: 'ui',
                enabled: true,
                experimental: false
            },
            'lazyLoading': {
                name: 'Lazy Loading',
                description: 'Intelligent content loading for improved page performance',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'cacheOptimization': {
                name: 'Cache Optimization',
                description: 'Smart caching strategies for faster page loads',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'bundleOptimization': {
                name: 'Bundle Optimization',
                description: 'Optimized JavaScript and CSS loading for better performance',
                category: 'performance',
                enabled: true,
                experimental: false
            },
            'autoToastNotifications': {
                name: 'Auto Toast Notifications',
                description: 'Automatic toast messages for AJAX requests and form submissions',
                category: 'experimental',
                enabled: true,
                experimental: true
            },
            'advancedSearch': {
                name: 'Advanced Search',
                description: 'Enhanced search capabilities with filters and smart suggestions',
                category: 'experimental',
                enabled: false,
                experimental: true
            },
            'realTimeUpdates': {
                name: 'Real-time Updates',
                description: 'Live data updates without page refresh using WebSockets',
                category: 'experimental',
                enabled: true,
                experimental: true
            }
        },

        init: function() {
            console.log('🎛️ FeatureFlagsUI: Initializing feature management interface...');
            
            // Setup keyboard shortcut (F key when command palette is open, or Ctrl+Shift+F)
            this.setupKeyboardShortcuts();
            
            // Sync with existing Grid4 feature flags
            this.syncWithGrid4FeatureFlags();
            
            console.log('✅ FeatureFlagsUI: Feature flags interface ready');
        },

        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+F to open feature flags
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
                    e.preventDefault();
                    this.toggle();
                    return;
                }
                
                // F key when not in input field
                if (e.key === 'f' && !e.ctrlKey && !e.altKey && 
                    !['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
                    e.preventDefault();
                    this.toggle();
                }
            });
        },

        syncWithGrid4FeatureFlags: function() {
            // Sync with existing Grid4 feature flag system
            if (window.g4c && window.g4c.isFeatureEnabled) {
                Object.keys(this.FEATURES).forEach(key => {
                    const isEnabled = window.g4c.isFeatureEnabled(key);
                    this.FEATURES[key].enabled = isEnabled;
                });
            }
        },

        toggle: function() {
            if (this._isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open: function() {
            this.createUI();
            this._isOpen = true;
            console.log('🎛️ FeatureFlagsUI: Feature flags interface opened');
        },

        close: function() {
            const modal = document.getElementById('g4-feature-flags-ui');
            if (modal) {
                modal.remove();
            }
            this._isOpen = false;
            console.log('🎛️ FeatureFlagsUI: Feature flags interface closed');
        },

        createUI: function() {
            // Remove existing modal
            const existing = document.getElementById('g4-feature-flags-ui');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'g4-feature-flags-ui';
            modal.className = 'g4-feature-flags-modal';
            
            modal.innerHTML = this.generateHTML();
            document.body.appendChild(modal);
            
            // Add event listeners
            this.setupEventListeners(modal);
            
            // Add CSS if not already present
            this.addCSS();
            
            // Update statistics
            this.updateStatistics();
        },

        generateHTML: function() {
            const stats = this.getStatistics();
            
            return `
                <div class="g4-ff-backdrop"></div>
                <div class="g4-ff-container">
                    <div class="g4-ff-header">
                        <div class="g4-ff-title-section">
                            <h2>🎛️ Feature Flags</h2>
                            <button class="g4-ff-close">&times;</button>
                        </div>
                        <div class="g4-ff-stats">
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.enabled}</span>
                                <span class="g4-ff-stat-label">Enabled</span>
                            </div>
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.total}</span>
                                <span class="g4-ff-stat-label">Total</span>
                            </div>
                            <div class="g4-ff-stat">
                                <span class="g4-ff-stat-number">${stats.experimental}</span>
                                <span class="g4-ff-stat-label">Experimental</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="g4-ff-filters">
                        <button class="g4-ff-filter ${this._currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'ui' ? 'active' : ''}" data-filter="ui">UI/UX</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'performance' ? 'active' : ''}" data-filter="performance">Performance</button>
                        <button class="g4-ff-filter ${this._currentFilter === 'experimental' ? 'active' : ''}" data-filter="experimental">Experimental</button>
                    </div>
                    
                    <div class="g4-ff-content">
                        <div class="g4-ff-search">
                            <input type="text" placeholder="Search features..." class="g4-ff-search-input">
                        </div>
                        
                        <div class="g4-ff-features-grid">
                            ${this.generateFeatureCards()}
                        </div>
                    </div>
                    
                    <div class="g4-ff-footer">
                        <p><strong>💡 Tip:</strong> Press <kbd>F</kbd> to toggle this interface, or <kbd>Ctrl+Shift+F</kbd> as alternative</p>
                    </div>
                </div>
            `;
        },

        generateFeatureCards: function() {
            return Object.entries(this.FEATURES)
                .filter(([key, feature]) => {
                    if (this._currentFilter === 'all') return true;
                    return feature.category === this._currentFilter;
                })
                .map(([key, feature]) => {
                    const categoryClass = `g4-ff-category-${feature.category}`;
                    const experimentalBadge = feature.experimental ? '<span class="g4-ff-experimental-badge">EXPERIMENTAL</span>' : '';
                    
                    return `
                        <div class="g4-ff-feature-card ${categoryClass}" data-feature="${key}" data-category="${feature.category}">
                            <div class="g4-ff-feature-header">
                                <h3>${feature.name}</h3>
                                <label class="g4-ff-toggle">
                                    <input type="checkbox" ${feature.enabled ? 'checked' : ''} data-feature="${key}">
                                    <span class="g4-ff-toggle-slider"></span>
                                </label>
                            </div>
                            <p class="g4-ff-feature-description">${feature.description}</p>
                            <div class="g4-ff-feature-footer">
                                <span class="g4-ff-category-tag">${feature.category.toUpperCase()}</span>
                                ${experimentalBadge}
                            </div>
                        </div>
                    `;
                }).join('');
        },

        setupEventListeners: function(modal) {
            // Close button
            modal.querySelector('.g4-ff-close').onclick = () => this.close();
            
            // Backdrop click
            modal.querySelector('.g4-ff-backdrop').onclick = () => this.close();
            
            // Filter buttons
            modal.querySelectorAll('.g4-ff-filter').forEach(btn => {
                btn.onclick = () => {
                    this._currentFilter = btn.dataset.filter;
                    this.refreshFeatureGrid();
                    
                    // Update active filter
                    modal.querySelectorAll('.g4-ff-filter').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });
            
            // Feature toggles
            modal.querySelectorAll('.g4-ff-toggle input').forEach(toggle => {
                toggle.onchange = (e) => {
                    const featureKey = e.target.dataset.feature;
                    const enabled = e.target.checked;
                    this.toggleFeature(featureKey, enabled);
                };
            });
            
            // Search input
            const searchInput = modal.querySelector('.g4-ff-search-input');
            searchInput.oninput = (e) => {
                this.filterFeaturesBySearch(e.target.value);
            };
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            });
        },

        refreshFeatureGrid: function() {
            const grid = document.querySelector('.g4-ff-features-grid');
            if (grid) {
                grid.innerHTML = this.generateFeatureCards();
                this.setupFeatureToggles();
            }
        },

        setupFeatureToggles: function() {
            document.querySelectorAll('.g4-ff-toggle input').forEach(toggle => {
                toggle.onchange = (e) => {
                    const featureKey = e.target.dataset.feature;
                    const enabled = e.target.checked;
                    this.toggleFeature(featureKey, enabled);
                };
            });
        },

        toggleFeature: function(featureKey, enabled) {
            // Update internal state
            if (this.FEATURES[featureKey]) {
                this.FEATURES[featureKey].enabled = enabled;
            }
            
            // Update Grid4 feature flag system
            if (window.g4c) {
                if (enabled) {
                    window.g4c.enableFeature(featureKey);
                } else {
                    window.g4c.disableFeature(featureKey);
                }
            }
            
            // Update statistics
            this.updateStatistics();
            
            // Show notification
            this.showNotification(
                `${this.FEATURES[featureKey]?.name || featureKey} ${enabled ? 'enabled' : 'disabled'}`,
                enabled ? 'success' : 'info'
            );
            
            console.log(`🎛️ FeatureFlagsUI: ${featureKey} ${enabled ? 'enabled' : 'disabled'}`);
        },

        filterFeaturesBySearch: function(query) {
            const cards = document.querySelectorAll('.g4-ff-feature-card');
            const searchTerm = query.toLowerCase();
            
            cards.forEach(card => {
                const featureKey = card.dataset.feature;
                const feature = this.FEATURES[featureKey];
                const searchText = `${feature.name} ${feature.description}`.toLowerCase();
                
                if (searchText.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        },

        getStatistics: function() {
            const features = Object.values(this.FEATURES);
            return {
                total: features.length,
                enabled: features.filter(f => f.enabled).length,
                experimental: features.filter(f => f.experimental && f.enabled).length
            };
        },

        updateStatistics: function() {
            const stats = this.getStatistics();
            const modal = document.getElementById('g4-feature-flags-ui');
            if (!modal) return;
            
            const statNumbers = modal.querySelectorAll('.g4-ff-stat-number');
            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = stats.enabled;
                statNumbers[1].textContent = stats.total;
                statNumbers[2].textContent = stats.experimental;
            }
        },

        showNotification: function(message, type) {
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        },

        addCSS: function() {
            if (document.getElementById('g4-feature-flags-ui-css')) return;
            
            const style = document.createElement('style');
            style.id = 'g4-feature-flags-ui-css';
            style.textContent = `
                .g4-feature-flags-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10002;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: g4FFModalIn 0.3s ease-out;
                }
                
                .g4-ff-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .g4-ff-container {
                    position: absolute;
                    top: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    max-width: 1200px;
                    max-height: 800px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .g4-ff-header {
                    padding: 2rem;
                    color: white;
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-title-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .g4-ff-title-section h2 {
                    margin: 0;
                    font-size: 1.875rem;
                    font-weight: 600;
                }
                
                .g4-ff-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                
                .g4-ff-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .g4-ff-stats {
                    display: flex;
                    gap: 2rem;
                }
                
                .g4-ff-stat {
                    text-align: center;
                }
                
                .g4-ff-stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }
                
                .g4-ff-stat-label {
                    font-size: 0.875rem;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-filters {
                    display: flex;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    background: rgba(255, 255, 255, 0.9);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-filter {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: #4b5563;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .g4-ff-filter:hover,
                .g4-ff-filter.active {
                    background: #667eea;
                    color: white;
                    transform: translateY(-1px);
                }
                
                .g4-ff-content {
                    flex: 1;
                    padding: 2rem;
                    background: white;
                    overflow-y: auto;
                }
                
                .g4-ff-search {
                    margin-bottom: 2rem;
                }
                
                .g4-ff-search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                
                .g4-ff-search-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .g4-ff-features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                
                .g4-ff-feature-card {
                    padding: 1.5rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    background: #f9fafb;
                    transition: all 0.2s;
                }
                
                .g4-ff-feature-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                
                .g4-ff-category-ui {
                    border-left: 4px solid #3b82f6;
                }
                
                .g4-ff-category-performance {
                    border-left: 4px solid #10b981;
                }
                
                .g4-ff-category-experimental {
                    border-left: 4px solid #f59e0b;
                }
                
                .g4-ff-feature-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .g4-ff-feature-header h3 {
                    margin: 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                }
                
                .g4-ff-toggle {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 24px;
                }
                
                .g4-ff-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .g4-ff-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.3s;
                    border-radius: 24px;
                }
                
                .g4-ff-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                }
                
                .g4-ff-toggle input:checked + .g4-ff-toggle-slider {
                    background-color: #10b981;
                }
                
                .g4-ff-toggle input:checked + .g4-ff-toggle-slider:before {
                    transform: translateX(24px);
                }
                
                .g4-ff-feature-description {
                    color: #6b7280;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin: 0 0 1rem 0;
                }
                
                .g4-ff-feature-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .g4-ff-category-tag {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: #e5e7eb;
                    color: #6b7280;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-experimental-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .g4-ff-footer {
                    padding: 1.5rem 2rem;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                }
                
                .g4-ff-footer p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 0.875rem;
                }
                
                kbd {
                    background: #e5e7eb;
                    border: 1px solid #d1d5db;
                    border-radius: 3px;
                    padding: 0.125rem 0.25rem;
                    font-size: 0.75rem;
                    color: #374151;
                }
                
                @keyframes g4FFModalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @media (max-width: 768px) {
                    .g4-ff-container {
                        top: 2%;
                        left: 2%;
                        width: 96%;
                        height: 96%;
                    }
                    
                    .g4-ff-features-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .g4-ff-stats {
                        gap: 1rem;
                    }
                    
                    .g4-ff-filters {
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }
                }
            `;
            
            document.head.appendChild(style);
        },

        // Public API
        getFeatureStatus: function(featureKey) {
            return this.FEATURES[featureKey]?.enabled || false;
        },

        getAllFeatures: function() {
            return { ...this.FEATURES };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        FeatureFlagsUI.init();
    });

    // Expose globally
    window.FeatureFlagsUI = FeatureFlagsUI;
    
    if (window.g4c) {
        window.g4c.FeatureFlagsUI = FeatureFlagsUI;
    }

    console.log('📦 FeatureFlagsUI loaded - Press F or Ctrl+Shift+F to manage features');

})(window, document, jQuery);