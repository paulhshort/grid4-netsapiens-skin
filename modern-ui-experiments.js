/* Grid4 Modern UI Experiments - Fonts, Frameworks & Tooling
 * Testing sleek modern enhancements within CSS/JS injection constraints
 * Features: Google Fonts, Tailwind-inspired utilities, modern icons, micro-interactions
 */

(function(window, document, $) {
    'use strict';

    const ModernUIExperiments = {
        _loaded: false,
        _experiments: {},

        // Modern font combinations to test
        FONT_EXPERIMENTS: {
            'inter-system': {
                name: 'Inter + System UI',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    * {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                        font-feature-settings: 'cv05', 'cv11', 'ss01' !important;
                        text-rendering: optimizeLegibility !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: 600 !important;
                        letter-spacing: -0.025em !important;
                    }
                `,
                description: 'Inter font with system fallbacks - Modern, readable, professional'
            },
            
            'poppins-modern': {
                name: 'Poppins Modern',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                    * {
                        font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-weight: 600 !important;
                        letter-spacing: -0.02em !important;
                    }
                    .nav-text, .nav-link {
                        font-weight: 500 !important;
                    }
                `,
                description: 'Poppins - Geometric, friendly, modern SaaS look'
            },
            
            'jetbrains-mono': {
                name: 'JetBrains Mono (Dev-focused)',
                css: `
                    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
                    body, * {
                        font-family: 'Inter', system-ui, sans-serif !important;
                    }
                    code, pre, .code, [class*="code"], input[type="text"], input[type="password"] {
                        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                        font-feature-settings: 'liga' 1, 'calt' 1 !important;
                    }
                `,
                description: 'Inter + JetBrains Mono - Perfect for developer-focused portals'
            }
        },

        // Tailwind-inspired utility classes that work with injection
        UTILITY_FRAMEWORK: `
            /* Tailwind-inspired utilities - Inject-friendly */
            .g4-flex { display: flex !important; }
            .g4-inline-flex { display: inline-flex !important; }
            .g4-grid { display: grid !important; }
            .g4-hidden { display: none !important; }
            
            /* Flexbox utilities */
            .g4-items-center { align-items: center !important; }
            .g4-items-start { align-items: flex-start !important; }
            .g4-items-end { align-items: flex-end !important; }
            .g4-justify-center { justify-content: center !important; }
            .g4-justify-between { justify-content: space-between !important; }
            .g4-justify-around { justify-content: space-around !important; }
            .g4-flex-col { flex-direction: column !important; }
            .g4-flex-row { flex-direction: row !important; }
            .g4-flex-wrap { flex-wrap: wrap !important; }
            .g4-flex-1 { flex: 1 1 0% !important; }
            
            /* Spacing utilities */
            .g4-m-0 { margin: 0 !important; }
            .g4-m-1 { margin: 0.25rem !important; }
            .g4-m-2 { margin: 0.5rem !important; }
            .g4-m-3 { margin: 0.75rem !important; }
            .g4-m-4 { margin: 1rem !important; }
            .g4-m-6 { margin: 1.5rem !important; }
            .g4-m-8 { margin: 2rem !important; }
            
            .g4-p-0 { padding: 0 !important; }
            .g4-p-1 { padding: 0.25rem !important; }
            .g4-p-2 { padding: 0.5rem !important; }
            .g4-p-3 { padding: 0.75rem !important; }
            .g4-p-4 { padding: 1rem !important; }
            .g4-p-6 { padding: 1.5rem !important; }
            .g4-p-8 { padding: 2rem !important; }
            
            /* Text utilities */
            .g4-text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .g4-text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .g4-text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .g4-text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .g4-text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .g4-text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
            
            .g4-font-light { font-weight: 300 !important; }
            .g4-font-normal { font-weight: 400 !important; }
            .g4-font-medium { font-weight: 500 !important; }
            .g4-font-semibold { font-weight: 600 !important; }
            .g4-font-bold { font-weight: 700 !important; }
            
            .g4-text-left { text-align: left !important; }
            .g4-text-center { text-align: center !important; }
            .g4-text-right { text-align: right !important; }
            
            /* Border utilities */
            .g4-border { border: 1px solid #e5e7eb !important; }
            .g4-border-2 { border: 2px solid #e5e7eb !important; }
            .g4-border-0 { border: 0 !important; }
            .g4-rounded { border-radius: 0.25rem !important; }
            .g4-rounded-md { border-radius: 0.375rem !important; }
            .g4-rounded-lg { border-radius: 0.5rem !important; }
            .g4-rounded-xl { border-radius: 0.75rem !important; }
            .g4-rounded-full { border-radius: 9999px !important; }
            
            /* Shadow utilities */
            .g4-shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
            .g4-shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important; }
            .g4-shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
            .g4-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
            
            /* Modern button styles */
            .g4-btn-modern {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0.5rem 1rem !important;
                font-weight: 500 !important;
                border-radius: 0.375rem !important;
                transition: all 0.2s ease !important;
                border: none !important;
                cursor: pointer !important;
                text-decoration: none !important;
            }
            
            .g4-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }
            .g4-btn-primary:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3) !important;
            }
            
            .g4-btn-secondary {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #f8f9fa !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            .g4-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            /* Modern form controls */
            .g4-input-modern {
                appearance: none !important;
                border: 1px solid #d1d5db !important;
                border-radius: 0.375rem !important;
                padding: 0.5rem 0.75rem !important;
                font-size: 0.875rem !important;
                transition: all 0.2s ease !important;
                background: rgba(255, 255, 255, 0.05) !important;
                color: #f8f9fa !important;
            }
            .g4-input-modern:focus {
                outline: none !important;
                border-color: #3b82f6 !important;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }
            
            /* Glassmorphism effects */
            .g4-glass {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .g4-glass-dark {
                background: rgba(0, 0, 0, 0.2) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            /* Micro-interactions */
            .g4-hover-lift:hover {
                transform: translateY(-2px) !important;
                transition: transform 0.2s ease !important;
            }
            
            .g4-hover-glow:hover {
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.4) !important;
                transition: box-shadow 0.3s ease !important;
            }
            
            .g4-pulse {
                animation: g4-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
            }
            
            @keyframes g4-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .g4-fade-in {
                animation: g4-fadeIn 0.5s ease-out !important;
            }
            
            @keyframes g4-fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `,

        // Modern icon system using Lucide (lightweight alternative to Font Awesome)
        ICON_SYSTEM: {
            lucide: {
                name: 'Lucide Icons',
                cdnUrl: 'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
                css: `
                    .lucide {
                        width: 24px;
                        height: 24px;
                        stroke: currentColor;
                        stroke-width: 2;
                        fill: none;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                    }
                    .lucide-sm { width: 16px; height: 16px; }
                    .lucide-lg { width: 32px; height: 32px; }
                    .lucide-xl { width: 48px; height: 48px; }
                `,
                description: 'Lucide - Modern, lightweight SVG icons'
            },
            
            heroicons: {
                name: 'Heroicons',
                setup: 'Manual SVG injection',
                description: 'Heroicons - Beautiful hand-crafted SVG icons from Tailwind team'
            }
        },

        init: function() {
            if (this._loaded) return;
            
            console.log('🎨 ModernUIExperiments: Initializing modern UI toolkit...');
            
            // Load utility framework
            this.loadUtilityFramework();
            
            // Set up experiment controls
            this.setupExperimentControls();
            
            // Load default font experiment
            this.applyFontExperiment('inter-system');
            
            // Load icon system
            this.loadIconSystem('lucide');
            
            this._loaded = true;
            console.log('✅ ModernUIExperiments: Modern UI toolkit ready');
        },

        loadUtilityFramework: function() {
            const style = document.createElement('style');
            style.id = 'g4-utility-framework';
            style.textContent = this.UTILITY_FRAMEWORK;
            document.head.appendChild(style);
            
            console.log('🔧 ModernUIExperiments: Utility framework loaded');
        },

        applyFontExperiment: function(experimentName) {
            const experiment = this.FONT_EXPERIMENTS[experimentName];
            if (!experiment) {
                console.warn(`Font experiment '${experimentName}' not found`);
                return;
            }
            
            // Remove existing font experiment
            const existing = document.getElementById('g4-font-experiment');
            if (existing) existing.remove();
            
            // Apply new font experiment
            const style = document.createElement('style');
            style.id = 'g4-font-experiment';
            style.setAttribute('data-experiment', experimentName);
            style.textContent = experiment.css;
            document.head.appendChild(style);
            
            this._experiments.currentFont = experimentName;
            console.log(`🔤 ModernUIExperiments: Applied font experiment '${experiment.name}'`);
            
            this.showNotification(`Font changed to ${experiment.name}`, 'info');
        },

        loadIconSystem: function(systemName) {
            const system = this.ICON_SYSTEM[systemName];
            if (!system) {
                console.warn(`Icon system '${systemName}' not found`);
                return;
            }
            
            if (system.css) {
                const style = document.createElement('style');
                style.id = 'g4-icon-system';
                style.textContent = system.css;
                document.head.appendChild(style);
            }
            
            if (system.cdnUrl) {
                const script = document.createElement('script');
                script.src = system.cdnUrl;
                script.onload = () => {
                    console.log(`🎯 ModernUIExperiments: ${system.name} loaded`);
                    this.enhanceExistingIcons();
                };
                document.head.appendChild(script);
            }
            
            console.log(`🎨 ModernUIExperiments: Loading ${system.name}`);
        },

        enhanceExistingIcons: function() {
            // Replace common icons with modern alternatives
            const iconMappings = {
                'icon-home': 'home',
                'icon-user': 'user',
                'icon-settings': 'settings',
                'icon-phone': 'phone',
                'icon-mail': 'mail',
                'icon-search': 'search',
                'icon-plus': 'plus',
                'icon-edit': 'edit-2',
                'icon-trash': 'trash-2',
                'icon-download': 'download'
            };
            
            Object.entries(iconMappings).forEach(([oldClass, lucideName]) => {
                const elements = document.querySelectorAll(`.${oldClass}`);
                elements.forEach(el => {
                    if (window.lucide) {
                        el.innerHTML = window.lucide.icons[lucideName] || '';
                        el.classList.add('lucide');
                    }
                });
            });
        },

        setupExperimentControls: function() {
            // Add keyboard shortcuts for quick experimentation
            document.addEventListener('keydown', (e) => {
                // Ctrl+Alt+F = cycle fonts
                if (e.ctrlKey && e.altKey && e.key === 'f') {
                    e.preventDefault();
                    this.cycleFontExperiment();
                }
                
                // Ctrl+Alt+U = toggle utility classes demo
                if (e.ctrlKey && e.altKey && e.key === 'u') {
                    e.preventDefault();
                    this.demoUtilityClasses();
                }
                
                // Ctrl+Alt+G = toggle glassmorphism
                if (e.ctrlKey && e.altKey && e.key === 'g') {
                    e.preventDefault();
                    this.toggleGlassmorphism();
                }
            });
            
            console.log('⌨️  ModernUIExperiments: Keyboard shortcuts ready');
            console.log('   Ctrl+Alt+F = Cycle fonts');
            console.log('   Ctrl+Alt+U = Demo utility classes');
            console.log('   Ctrl+Alt+G = Toggle glassmorphism');
        },

        cycleFontExperiment: function() {
            const fontNames = Object.keys(this.FONT_EXPERIMENTS);
            const currentIndex = fontNames.indexOf(this._experiments.currentFont || 'inter-system');
            const nextIndex = (currentIndex + 1) % fontNames.length;
            const nextFont = fontNames[nextIndex];
            
            this.applyFontExperiment(nextFont);
        },

        demoUtilityClasses: function() {
            // Apply utility classes to common elements as a demo
            const navButtons = document.querySelectorAll('#nav-buttons li a');
            navButtons.forEach((btn, index) => {
                btn.classList.add('g4-btn-modern', index % 2 === 0 ? 'g4-btn-primary' : 'g4-btn-secondary');
                btn.classList.add('g4-hover-lift', 'g4-m-2');
            });
            
            // Apply to form inputs
            const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], select, textarea');
            inputs.forEach(input => {
                input.classList.add('g4-input-modern');
            });
            
            this.showNotification('Utility classes demo applied!', 'success');
        },

        toggleGlassmorphism: function() {
            const navigation = document.getElementById('navigation');
            if (navigation) {
                navigation.classList.toggle('g4-glass-dark');
                
                const isEnabled = navigation.classList.contains('g4-glass-dark');
                this.showNotification(`Glassmorphism ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
            }
        },

        showNotification: function(message, type) {
            // Try multiple notification systems
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        },

        // API for external use
        getAvailableExperiments: function() {
            return {
                fonts: Object.keys(this.FONT_EXPERIMENTS),
                icons: Object.keys(this.ICON_SYSTEM),
                currentFont: this._experiments.currentFont
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        ModernUIExperiments.init();
    });

    // Expose globally
    window.ModernUIExperiments = ModernUIExperiments;
    
    if (window.g4c) {
        window.g4c.ModernUIExperiments = ModernUIExperiments;
    }

    console.log('📦 ModernUIExperiments module loaded - Press Ctrl+Alt+F to cycle fonts!');

})(window, document, jQuery);