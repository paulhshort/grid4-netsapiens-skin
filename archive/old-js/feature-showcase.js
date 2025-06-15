/* Grid4 Feature Showcase - Interactive Demo System
 * Demonstrates all Grid4 enhancements with live examples
 * Perfect for testing sleek, modern, polished, pleasant, and universally appealing design
 */

(function(window, document, $) {
    'use strict';

    const FeatureShowcase = {
        _showcaseOpen: false,
        _currentDemo: null,

        FEATURES: {
            'consistency-engine': {
                name: 'Consistency Engine',
                description: 'Universal polish ensuring sleek, modern design across all pages',
                demo: function() {
                    this.demoConsistencyEngine();
                },
                commands: [
                    'ConsistencyEngine.refresh() - Refresh all enhancements',
                    'ConsistencyEngine.getStats() - View enhancement statistics'
                ]
            },
            
            'modern-fonts': {
                name: 'Modern Fonts',
                description: 'Professional typography with Inter, Poppins, and JetBrains Mono',
                demo: function() {
                    this.demoModernFonts();
                },
                commands: [
                    'Ctrl+Alt+F - Cycle through font experiments',
                    'ModernUIExperiments.applyFontExperiment("inter-system") - Apply Inter font',
                    'ModernUIExperiments.applyFontExperiment("poppins-modern") - Apply Poppins font'
                ]
            },
            
            'utility-framework': {
                name: 'Utility Framework',
                description: 'Tailwind-inspired utilities for rapid UI development',
                demo: function() {
                    this.demoUtilityFramework();
                },
                commands: [
                    'Ctrl+Alt+U - Demo utility classes',
                    'Ctrl+Alt+G - Toggle glassmorphism effects'
                ]
            },
            
            'logo-system': {
                name: 'Grid4 Logo System',
                description: 'Dynamic logo replacement with multiple variants',
                demo: function() {
                    this.demoLogoSystem();
                },
                commands: [
                    'LogoEnhancement.switchLogo("grid4-white") - Switch to white logo',
                    'LogoEnhancement.switchLogo("grid4-colored") - Switch to colored logo',
                    'LogoEnhancement.getAvailableLogos() - List all logo variants'
                ]
            },
            
            'adaptive-system': {
                name: 'Adaptive Enhancement System',
                description: 'Portal Context Manager with self-healing capabilities',
                demo: function() {
                    this.demoAdaptiveSystem();
                },
                commands: [
                    'PortalContextManager.getContextInfo() - Get portal context',
                    'VerticalCenteringFix.getStatus() - Check centering status',
                    'VerticalCenteringFix.forceReapply() - Force reapply centering fix'
                ]
            },
            
            'command-palette': {
                name: 'Command Palette',
                description: 'VS Code-inspired command interface for power users',
                demo: function() {
                    this.demoCommandPalette();
                },
                commands: [
                    'Ctrl+Shift+K - Open command palette',
                    'Type "grid4" to see Grid4-specific commands',
                    'Type "nav" to see navigation commands'
                ]
            },
            
            'micro-interactions': {
                name: 'Micro-interactions',
                description: 'Delightful hover effects, animations, and feedback',
                demo: function() {
                    this.demoMicroInteractions();
                },
                commands: [
                    'Hover over any button or interactive element',
                    'Click elements to see ripple effects',
                    'Focus inputs to see modern focus states'
                ]
            }
        },

        init: function() {
            console.log('🎭 FeatureShowcase: Initializing interactive demo system...');
            
            // Setup showcase activation
            this.setupShowcaseActivation();
            
            // Add showcase CSS
            this.addShowcaseCSS();
            
            console.log('✅ FeatureShowcase: Demo system ready - Press Ctrl+Shift+D to open showcase');
        },

        setupShowcaseActivation: function() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+D to open showcase
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                    e.preventDefault();
                    this.toggleShowcase();
                }
            });
        },

        toggleShowcase: function() {
            if (this._showcaseOpen) {
                this.closeShowcase();
            } else {
                this.openShowcase();
            }
        },

        openShowcase: function() {
            this.createShowcaseUI();
            this._showcaseOpen = true;
            console.log('🎭 FeatureShowcase: Showcase opened');
        },

        closeShowcase: function() {
            const showcase = document.getElementById('g4-feature-showcase');
            if (showcase) {
                showcase.remove();
            }
            this._showcaseOpen = false;
            console.log('🎭 FeatureShowcase: Showcase closed');
        },

        createShowcaseUI: function() {
            // Remove existing showcase
            const existing = document.getElementById('g4-feature-showcase');
            if (existing) existing.remove();

            const showcase = document.createElement('div');
            showcase.id = 'g4-feature-showcase';
            showcase.className = 'g4-feature-showcase';
            
            showcase.innerHTML = `
                <div class="g4-showcase-backdrop"></div>
                <div class="g4-showcase-modal">
                    <div class="g4-showcase-header">
                        <h2>Grid4 Feature Showcase</h2>
                        <p>Interactive demonstrations of sleek, modern, polished design</p>
                        <button class="g4-showcase-close">&times;</button>
                    </div>
                    <div class="g4-showcase-content">
                        <div class="g4-showcase-sidebar">
                            <h3>Features</h3>
                            <ul class="g4-feature-list">
                                ${Object.entries(this.FEATURES).map(([key, feature]) => `
                                    <li>
                                        <button class="g4-feature-item" data-feature="${key}">
                                            <strong>${feature.name}</strong>
                                            <span>${feature.description}</span>
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="g4-showcase-main">
                            <div class="g4-demo-area">
                                <h3>Select a feature to see live demonstration</h3>
                                <p>Each feature showcases Grid4's commitment to sleek, modern, polished, pleasant, and universally appealing design.</p>
                                
                                <div class="g4-quick-actions">
                                    <h4>Quick Actions</h4>
                                    <button class="g4-btn g4-btn-primary" onclick="ModernUIExperiments.cycleFontExperiment()">
                                        Cycle Fonts
                                    </button>
                                    <button class="g4-btn g4-btn-secondary" onclick="LogoEnhancement.switchLogo('grid4-colored')">
                                        Switch Logo
                                    </button>
                                    <button class="g4-btn g4-btn-accent" onclick="ConsistencyEngine.refresh()">
                                        Refresh Polish
                                    </button>
                                </div>
                                
                                <div class="g4-stats-display">
                                    <h4>System Status</h4>
                                    <div class="g4-stats-grid">
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Enhanced Elements</span>
                                            <span class="g4-stat-value" id="enhanced-count">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Active Features</span>
                                            <span class="g4-stat-value" id="active-features">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Current Font</span>
                                            <span class="g4-stat-value" id="current-font">Loading...</span>
                                        </div>
                                        <div class="g4-stat">
                                            <span class="g4-stat-label">Current Logo</span>
                                            <span class="g4-stat-value" id="current-logo">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="g4-showcase-footer">
                        <p>💡 <strong>Tip:</strong> All features work together to create a cohesive, professional experience across every page and interaction.</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(showcase);
            
            // Setup event listeners
            this.setupShowcaseEvents(showcase);
            
            // Update stats
            this.updateStats();
            
            // Auto-focus first feature
            setTimeout(() => {
                const firstFeature = showcase.querySelector('.g4-feature-item');
                if (firstFeature) firstFeature.click();
            }, 100);
        },

        setupShowcaseEvents: function(showcase) {
            // Close button
            showcase.querySelector('.g4-showcase-close').onclick = () => this.closeShowcase();
            
            // Backdrop click
            showcase.querySelector('.g4-showcase-backdrop').onclick = () => this.closeShowcase();
            
            // Feature buttons
            showcase.querySelectorAll('.g4-feature-item').forEach(btn => {
                btn.onclick = () => {
                    const featureKey = btn.dataset.feature;
                    this.showFeatureDemo(featureKey);
                    
                    // Update active state
                    showcase.querySelectorAll('.g4-feature-item').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });
        },

        showFeatureDemo: function(featureKey) {
            const feature = this.FEATURES[featureKey];
            if (!feature) return;
            
            const demoArea = document.querySelector('.g4-demo-area');
            demoArea.innerHTML = `
                <h3>${feature.name}</h3>
                <p>${feature.description}</p>
                
                <div class="g4-demo-content">
                    <h4>Live Demonstration</h4>
                    <div class="g4-demo-examples" id="demo-examples-${featureKey}">
                        <!-- Demo content will be inserted here -->
                    </div>
                </div>
                
                <div class="g4-demo-commands">
                    <h4>Available Commands</h4>
                    <ul>
                        ${feature.commands.map(cmd => `<li><code>${cmd}</code></li>`).join('')}
                    </ul>
                </div>
            `;
            
            // Run the demo
            feature.demo.call(this);
            this._currentDemo = featureKey;
        },

        demoConsistencyEngine: function() {
            const container = document.getElementById('demo-examples-consistency-engine');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Button Consistency</h5>
                    <button class="demo-btn">Primary Button</button>
                    <button class="demo-btn secondary">Secondary Button</button>
                    <button class="demo-btn danger">Danger Button</button>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Form Consistency</h5>
                    <input type="text" placeholder="Consistent input styling" class="demo-input">
                    <select class="demo-input">
                        <option>Consistent select styling</option>
                    </select>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Table Consistency</h5>
                    <table class="demo-table">
                        <thead>
                            <tr><th>Name</th><th>Value</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Example Row</td><td>Sample Data</td><td>Active</td></tr>
                            <tr><td>Another Row</td><td>More Data</td><td>Inactive</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        },

        demoModernFonts: function() {
            const container = document.getElementById('demo-examples-modern-fonts');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Font Comparison</h5>
                    <div class="font-sample inter-font">
                        <strong>Inter Font:</strong> The quick brown fox jumps over the lazy dog. 1234567890
                        <br><small>Professional, readable, modern - perfect for business applications</small>
                    </div>
                    <div class="font-sample poppins-font">
                        <strong>Poppins Font:</strong> The quick brown fox jumps over the lazy dog. 1234567890
                        <br><small>Geometric, friendly, approachable - great for user-facing interfaces</small>
                    </div>
                    <div class="font-sample jetbrains-font">
                        <strong>JetBrains Mono:</strong> function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }
                        <br><small>Monospace, developer-focused - ideal for code and technical content</small>
                    </div>
                </div>
            `;
        },

        demoUtilityFramework: function() {
            const container = document.getElementById('demo-examples-utility-framework');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Utility Classes in Action</h5>
                    <div class="g4-flex g4-items-center g4-justify-between g4-p-4 g4-border g4-rounded-lg g4-shadow-md">
                        <span class="g4-font-semibold">Flexbox Layout</span>
                        <button class="g4-btn-modern g4-btn-primary g4-hover-lift">Action</button>
                    </div>
                    
                    <div class="g4-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                        <div class="g4-p-4 g4-glass g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Glass Effect</h6>
                            <p class="g4-text-sm">Glassmorphism styling</p>
                        </div>
                        <div class="g4-p-4 g4-glass-dark g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Dark Glass</h6>
                            <p class="g4-text-sm">Dark glassmorphism</p>
                        </div>
                        <div class="g4-p-4 g4-shadow-lg g4-rounded-lg g4-text-center">
                            <h6 class="g4-font-semibold">Shadow Effect</h6>
                            <p class="g4-text-sm">Modern shadows</p>
                        </div>
                    </div>
                </div>
            `;
        },

        demoLogoSystem: function() {
            const container = document.getElementById('demo-examples-logo-system');
            const availableLogos = window.LogoEnhancement ? window.LogoEnhancement.getAvailableLogos() : [];
            
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Logo Variants</h5>
                    <div class="logo-grid">
                        ${availableLogos.map(logo => `
                            <div class="logo-option" onclick="LogoEnhancement.switchLogo('${logo.key}')">
                                <div class="logo-preview" data-logo="${logo.key}"></div>
                                <strong>${logo.name}</strong>
                                <small>${logo.description}</small>
                            </div>
                        `).join('')}
                    </div>
                    <p><strong>Current Logo:</strong> <span id="current-logo-display">Loading...</span></p>
                </div>
            `;
            
            // Update current logo display
            if (window.LogoEnhancement) {
                document.getElementById('current-logo-display').textContent = 
                    window.LogoEnhancement.getCurrentLogo() || 'None';
            }
        },

        demoAdaptiveSystem: function() {
            const container = document.getElementById('demo-examples-adaptive-system');
            const contextInfo = window.PortalContextManager ? window.PortalContextManager.getContextInfo() : {};
            const centeringStatus = window.VerticalCenteringFix ? window.VerticalCenteringFix.getStatus() : {};
            
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Portal Context Detection</h5>
                    <div class="context-info">
                        <p><strong>Fingerprint:</strong> ${contextInfo.fingerprint || 'Not detected'}</p>
                        <p><strong>Context Ready:</strong> ${contextInfo.isReady ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Layout Flags:</strong> ${Object.keys(contextInfo.layoutFlags || {}).length} detected</p>
                    </div>
                </div>
                
                <div class="g4-demo-example">
                    <h5>Vertical Centering Status</h5>
                    <div class="centering-info">
                        <p><strong>Fix Applied:</strong> ${centeringStatus.isApplied ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Method Used:</strong> ${centeringStatus.appliedMethod || 'None'}</p>
                        <p><strong>Navigation Elements:</strong> ${centeringStatus.navigationElements?.navigation ? '✅' : '❌'} Navigation, ${centeringStatus.navigationElements?.navButtons ? '✅' : '❌'} Nav Buttons</p>
                        <button onclick="VerticalCenteringFix.forceReapply()" class="g4-btn-modern g4-btn-secondary">
                            Force Reapply
                        </button>
                    </div>
                </div>
            `;
        },

        demoCommandPalette: function() {
            const container = document.getElementById('demo-examples-command-palette');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Command Palette Features</h5>
                    <div class="command-demo">
                        <button onclick="window.G4CommandPalette?.open()" class="g4-btn-modern g4-btn-primary">
                            Open Command Palette
                        </button>
                        <p>Or press <kbd>Ctrl+Shift+K</kbd></p>
                        
                        <h6>Available Commands:</h6>
                        <ul class="command-list">
                            <li>🏠 Navigation commands (home, inventory, domains)</li>
                            <li>🎨 Grid4 features (theme toggle, feature flags)</li>
                            <li>⚡ Quick actions (search, export, refresh)</li>
                            <li>❓ Help commands (shortcuts, about)</li>
                        </ul>
                    </div>
                </div>
            `;
        },

        demoMicroInteractions: function() {
            const container = document.getElementById('demo-examples-micro-interactions');
            container.innerHTML = `
                <div class="g4-demo-example">
                    <h5>Interactive Elements</h5>
                    <div class="interaction-demo">
                        <button class="g4-interactive g4-btn-modern g4-btn-primary g4-hover-lift">
                            Hover for Lift Effect
                        </button>
                        <button class="g4-interactive g4-btn-modern g4-btn-secondary g4-hover-glow">
                            Hover for Glow Effect
                        </button>
                        <div class="g4-interactive g4-p-4 g4-border g4-rounded-lg g4-hover-lift" style="cursor: pointer;">
                            <p class="g4-font-semibold">Interactive Card</p>
                            <p class="g4-text-sm">Click or hover to see effects</p>
                        </div>
                        <input type="text" placeholder="Focus me for modern focus state" class="g4-input-modern">
                    </div>
                </div>
            `;
        },

        updateStats: function() {
            setTimeout(() => {
                if (window.ConsistencyEngine) {
                    const stats = window.ConsistencyEngine.getStats();
                    document.getElementById('enhanced-count').textContent = stats.enhancedElements;
                    document.getElementById('active-features').textContent = stats.appliedEnhancements.length;
                }
                
                if (window.ModernUIExperiments) {
                    const experiments = window.ModernUIExperiments.getAvailableExperiments();
                    document.getElementById('current-font').textContent = experiments.currentFont || 'Default';
                }
                
                if (window.LogoEnhancement) {
                    document.getElementById('current-logo').textContent = 
                        window.LogoEnhancement.getCurrentLogo() || 'Default';
                }
            }, 500);
        },

        addShowcaseCSS: function() {
            const style = document.createElement('style');
            style.id = 'g4-feature-showcase-css';
            style.textContent = `
                .g4-feature-showcase {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10001;
                    font-family: 'Inter', system-ui, sans-serif;
                    animation: g4ShowcaseFadeIn 0.3s ease-out;
                }
                
                .g4-showcase-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .g4-showcase-modal {
                    position: absolute;
                    top: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    background: linear-gradient(135deg, #1a2332 0%, #2a3038 100%);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                }
                
                .g4-showcase-header {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                }
                
                .g4-showcase-header h2 {
                    color: #ffffff;
                    margin: 0 0 0.5rem 0;
                    font-size: 1.875rem;
                    font-weight: 600;
                }
                
                .g4-showcase-header p {
                    color: #cbd5e1;
                    margin: 0;
                    font-size: 1rem;
                }
                
                .g4-showcase-close {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .g4-showcase-close:hover {
                    color: #ffffff;
                }
                
                .g4-showcase-content {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }
                
                .g4-showcase-sidebar {
                    width: 300px;
                    padding: 2rem;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    overflow-y: auto;
                }
                
                .g4-showcase-sidebar h3 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .g4-feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .g4-feature-item {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #ffffff;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .g4-feature-item:hover,
                .g4-feature-item.active {
                    background: rgba(103, 126, 234, 0.2);
                    border-color: #667eea;
                    transform: translateY(-1px);
                }
                
                .g4-feature-item strong {
                    display: block;
                    margin-bottom: 0.25rem;
                    font-size: 0.875rem;
                }
                
                .g4-feature-item span {
                    font-size: 0.75rem;
                    color: #cbd5e1;
                    line-height: 1.4;
                }
                
                .g4-showcase-main {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                }
                
                .g4-demo-area h3 {
                    color: #ffffff;
                    margin: 0 0 0.5rem 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                
                .g4-demo-area p {
                    color: #cbd5e1;
                    margin: 0 0 2rem 0;
                }
                
                .g4-demo-example {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                
                .g4-demo-example h5 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-quick-actions {
                    margin-bottom: 2rem;
                }
                
                .g4-quick-actions h4 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    margin-right: 0.5rem;
                    margin-bottom: 0.5rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                
                .g4-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .g4-btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #f8f9fa;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .g4-btn-accent {
                    background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
                    color: white;
                }
                
                .g4-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .g4-stats-display {
                    margin-bottom: 2rem;
                }
                
                .g4-stats-display h4 {
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .g4-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
                
                .g4-stat {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    text-align: center;
                }
                
                .g4-stat-label {
                    display: block;
                    color: #cbd5e1;
                    font-size: 0.75rem;
                    margin-bottom: 0.25rem;
                }
                
                .g4-stat-value {
                    display: block;
                    color: #ffffff;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .g4-showcase-footer {
                    padding: 1.5rem 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .g4-showcase-footer p {
                    color: #cbd5e1;
                    margin: 0;
                    font-size: 0.875rem;
                }
                
                @keyframes g4ShowcaseFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                kbd {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    padding: 0.125rem 0.25rem;
                    font-size: 0.75rem;
                    color: #ffffff;
                }
                
                code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.125rem 0.25rem;
                    border-radius: 3px;
                    font-size: 0.75rem;
                    color: #00d4ff;
                }
            `;
            
            document.head.appendChild(style);
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        FeatureShowcase.init();
    });

    // Expose globally
    window.FeatureShowcase = FeatureShowcase;
    
    if (window.g4c) {
        window.g4c.FeatureShowcase = FeatureShowcase;
    }

    console.log('📦 FeatureShowcase loaded - Press Ctrl+Shift+D to open interactive demo');

})(window, document, jQuery);