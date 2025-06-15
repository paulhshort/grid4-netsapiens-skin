/* GRID4 SKIN v2.0 EXPERIMENTAL - JAVASCRIPT COMPANION */
/* Works with CSS @layer architecture - No style injection, pure functionality */

(function() {
    'use strict';
    
    console.log('🚀 Grid4 Skin v2.0 Experimental - CSS @Layer Architecture');
    
    // PREVENT MULTIPLE INITIALIZATION
    if (window.grid4V2Active) {
        console.log('Grid4 v2.0: Already active, skipping...');
        return;
    }
    window.grid4V2Active = true;
    
    // VERSION AND FEATURE DETECTION
    const GRID4_V2_VERSION = '2.0.0-experimental';
    const FEATURE_FLAGS = {
        enhanced_animations: true,
        advanced_theming: true,
        accessibility_mode: false,
        debug_mode: isDebugMode(),
        experimental_features: true
    };
    
    // DEBUG MODE DETECTION
    function isDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('grid4_debug') === 'true' || urlParams.get('grid4_version') === 'v2';
    }
    
    // ENHANCED BROWSER DETECTION - Expanded for v2.0
    function logBrowserCapabilities() {
        try {
            const capabilities = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                vendor: navigator.vendor,
                language: navigator.language,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                devicePixelRatio: window.devicePixelRatio || 1,
                colorDepth: window.screen ? window.screen.colorDepth : 'unknown',
                features: {
                    // Modern CSS Features
                    cssCustomProperties: CSS && CSS.supports && CSS.supports('color', 'var(--test)'),
                    cssGrid: CSS && CSS.supports && CSS.supports('display', 'grid'),
                    cssFlexbox: CSS && CSS.supports && CSS.supports('display', 'flex'),
                    cssLayers: CSS && CSS.supports && CSS.supports('@layer'),
                    cssContainerQueries: CSS && CSS.supports && CSS.supports('container-type: inline-size'),
                    
                    // JavaScript Features
                    mutationObserver: typeof MutationObserver !== 'undefined',
                    intersectionObserver: typeof IntersectionObserver !== 'undefined',
                    resizeObserver: typeof ResizeObserver !== 'undefined',
                    localStorage: typeof Storage !== 'undefined',
                    sessionStorage: typeof sessionStorage !== 'undefined',
                    fetch: typeof fetch !== 'undefined',
                    promise: typeof Promise !== 'undefined',
                    webComponents: typeof customElements !== 'undefined',
                    
                    // Accessibility Features
                    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
                    prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
                }
            };
            
            console.log('📊 Grid4 v2.0: Enhanced Browser Capabilities');
            console.table(capabilities);
            
            // Store globally for debugging
            window.Grid4V2Capabilities = capabilities;
            
            return capabilities;
            
        } catch (error) {
            console.error('❌ Grid4 v2.0: Browser capability detection failed:', error);
            return null;
        }
    }
    
    // V2.0 ARCHITECTURE VALIDATION
    function validateV2Architecture() {
        const criticalRequirements = {
            'CSS @layer support': CSS && CSS.supports && CSS.supports('@layer'),
            'CSS custom properties': CSS && CSS.supports && CSS.supports('color', 'var(--test)'),
            'MutationObserver API': typeof MutationObserver !== 'undefined',
            'URLSearchParams API': typeof URLSearchParams !== 'undefined'
        };
        
        let allRequirementsMet = true;
        
        for (const [requirement, supported] of Object.entries(criticalRequirements)) {
            if (!supported) {
                console.error(`❌ Grid4 v2.0: Missing requirement - ${requirement}`);
                allRequirementsMet = false;
            }
        }
        
        if (allRequirementsMet) {
            console.log('✅ Grid4 v2.0: All architecture requirements met');
        } else {
            console.warn('⚠️ Grid4 v2.0: Some features may not work on this browser');
        }
        
        return allRequirementsMet;
    }
    
    // DOM STRUCTURE VALIDATION - Enhanced for v2.0
    function validateDomStructure() {
        const criticalElements = {
            '#navigation, .navigation': 'Main Navigation Panel',
            '#content, .content': 'Main Content Area',
            '#nav-buttons, .nav-buttons': 'Navigation Buttons Container'
        };
        
        let allElementsFound = true;
        const foundElements = {};
        
        for (const [selector, description] of Object.entries(criticalElements)) {
            const element = document.querySelector(selector);
            if (!element) {
                console.error(`❌ GRID4 V2.0 COMPATIBILITY ISSUE: Critical DOM element not found.
            - Selector: "${selector}"
            - Description: ${description}
            - This may indicate structural changes in the NetSapiens portal.
            `);
                allElementsFound = false;
            } else {
                foundElements[selector] = element;
                console.log(`✅ Grid4 v2.0: Found ${description}`);
            }
        }
        
        if (allElementsFound) {
            console.log('✅ Grid4 v2.0: All critical DOM elements validated');
        }
        
        return { valid: allElementsFound, elements: foundElements };
    }
    
    // CSS CLASS APPLICATION - Pure class-based approach for @layer architecture
    function applyV2Classes() {
        try {
            console.log('📐 Grid4 v2.0: Applying CSS classes for @layer targeting...');
            
            // Apply body classes
            document.body.classList.add('grid4-v2-active');
            document.documentElement.setAttribute('data-grid4-version', '2.0.0-experimental');
            
            // Enable debug mode visualization if requested
            if (FEATURE_FLAGS.debug_mode) {
                document.body.setAttribute('data-grid4-debug', 'true');
                console.log('🐛 Grid4 v2.0: Debug mode visualization enabled');
            }
            
            // Apply layout classes to core elements
            const navigation = document.querySelector('#navigation, .navigation');
            if (navigation) {
                navigation.classList.add('grid4-v2-enhanced');
                console.log('✅ Grid4 v2.0: Navigation enhanced');
            }
            
            const content = document.querySelector('#content, .content');
            if (content) {
                content.classList.add('grid4-v2-enhanced');
                console.log('✅ Grid4 v2.0: Content area enhanced');
            }
            
            const header = document.querySelector('#header, .header');
            if (header) {
                header.classList.add('grid4-v2-enhanced');
                console.log('✅ Grid4 v2.0: Header enhanced');
            }
            
            const navButtons = document.querySelector('#nav-buttons, .nav-buttons');
            if (navButtons) {
                navButtons.classList.add('grid4-v2-enhanced');
                
                // Apply classes to navigation links
                const links = navButtons.querySelectorAll('a');
                links.forEach(link => {
                    link.classList.add('grid4-v2-nav-link');
                });
                
                console.log(`✅ Grid4 v2.0: Navigation buttons enhanced (${links.length} links)`);
            }
            
            // Enhance form elements progressively
            enhanceFormElements();
            
            // Enhance tables for better contrast
            enhanceTables();
            
            console.log('✅ Grid4 v2.0: CSS class application complete');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0: CSS class application failed:', error);
        }
    }
    
    // PROGRESSIVE FORM ENHANCEMENT
    function enhanceFormElements() {
        const formElements = document.querySelectorAll('input, select, textarea, button, .btn');
        let enhancedCount = 0;
        
        formElements.forEach(element => {
            if (!element.classList.contains('grid4-v2-enhanced')) {
                element.classList.add('grid4-v2-enhanced');
                enhancedCount++;
            }
        });
        
        if (enhancedCount > 0) {
            console.log(`✅ Grid4 v2.0: Enhanced ${enhancedCount} form elements`);
        }
    }
    
    // PROGRESSIVE TABLE ENHANCEMENT
    function enhanceTables() {
        const tables = document.querySelectorAll('table, .table');
        let enhancedCount = 0;
        
        tables.forEach(table => {
            if (!table.classList.contains('grid4-v2-enhanced')) {
                table.classList.add('grid4-v2-enhanced');
                enhancedCount++;
            }
        });
        
        if (enhancedCount > 0) {
            console.log(`✅ Grid4 v2.0: Enhanced ${enhancedCount} tables`);
        }
    }
    
    // LOGO REPLACEMENT - Standards-compliant with enhanced fallbacks
    function replaceLogo() {
        try {
            console.log('🎨 Grid4 v2.0: Enhanced logo replacement system...');
            
            // Grid4 SmartComm logo - optimized SVG
            const logoDataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDBkNGZmIj5HcmlkNDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiI+U21hcnRDb21tPC90ZXh0Pjwvc3ZnPg==';
            
            // Enhanced selectors for better logo detection
            const logoSelectors = [
                'img[src*="netsapiens"]',
                'img[src*="logo"]',
                'img[src*="brand"]',
                '.logo img',
                '.brand img',
                '.header-logo img',
                '#header img',
                '.navbar-brand img',
                '.top-header img',
                '[class*="logo"] img'
            ];
            
            let replacedCount = 0;
            
            logoSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                images.forEach(img => {
                    if (!img.classList.contains('grid4-v2-logo-replaced')) {
                        img.src = logoDataUrl;
                        img.alt = 'Grid4 SmartComm';
                        img.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                        img.classList.add('grid4-v2-logo-replaced', 'grid4-v2-logo');
                        replacedCount++;
                    }
                });
            });
            
            // Text-based logo replacement with enhanced detection
            const textSelectors = ['h1', 'h2', '.brand-text', '.logo-text', '.navbar-brand', '.header-title'];
            textSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.textContent && 
                        el.textContent.toLowerCase().includes('netsapiens') && 
                        !el.classList.contains('grid4-v2-text-replaced')) {
                        el.textContent = 'Grid4 SmartComm';
                        el.classList.add('grid4-v2-text-replaced');
                        replacedCount++;
                    }
                });
            });
            
            // Fallback logo injection if none found
            if (replacedCount === 0) {
                const headerCandidates = document.querySelectorAll('#header, .header, .top-header, .navbar, .brand-container');
                for (const header of headerCandidates) {
                    if (header && !header.querySelector('.grid4-v2-logo')) {
                        const logoImg = document.createElement('img');
                        logoImg.src = logoDataUrl;
                        logoImg.alt = 'Grid4 SmartComm';
                        logoImg.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                        logoImg.className = 'grid4-v2-logo grid4-v2-logo-replaced';
                        header.prepend(logoImg);
                        replacedCount++;
                        break;
                    }
                }
            }
            
            console.log(`✅ Grid4 v2.0: Logo replacement complete - ${replacedCount} logos processed`);
            
        } catch (error) {
            console.error('❌ Grid4 v2.0: Logo replacement failed:', error);
        }
    }
    
    // MUTATION OBSERVER - Enhanced for v2.0 with better performance
    function initializeDynamicContentObserver() {
        if (!window.MutationObserver) {
            console.warn('⚠️ Grid4 v2.0: MutationObserver not available, falling back to periodic checks');
            // Fallback for older browsers
            setInterval(() => {
                enhanceFormElements();
                enhanceTables();
                replaceLogo();
            }, 5000);
            return;
        }
        
        const observer = new MutationObserver((mutationsList) => {
            let needsEnhancement = false;
            let needsLogoReplacement = false;
            
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            // Check for form elements
                            if (node.matches && (node.matches('input, select, textarea, button') || 
                                                node.querySelector('input, select, textarea, button'))) {
                                needsEnhancement = true;
                            }
                            
                            // Check for tables
                            if (node.matches && (node.matches('table') || node.querySelector('table'))) {
                                needsEnhancement = true;
                            }
                            
                            // Check for images/logos
                            if (node.matches && (node.matches('img') || node.querySelector('img'))) {
                                needsLogoReplacement = true;
                            }
                        }
                    }
                }
                
                if (needsEnhancement && needsLogoReplacement) break;
            }
            
            if (needsEnhancement) {
                console.log('🔄 Grid4 v2.0: Dynamic content detected, enhancing elements...');
                enhanceFormElements();
                enhanceTables();
            }
            
            if (needsLogoReplacement) {
                console.log('🔄 Grid4 v2.0: Dynamic images detected, replacing logos...');
                replaceLogo();
            }
        });
        
        const config = { 
            childList: true, 
            subtree: true,
            attributes: false,
            characterData: false
        };
        
        observer.observe(document.body, config);
        console.log('👀 Grid4 v2.0: Enhanced MutationObserver active');
        
        // Expose observer control
        if (FEATURE_FLAGS.debug_mode) {
            window.Grid4V2.stopObserver = () => {
                observer.disconnect();
                console.log('🛑 Grid4 v2.0: MutationObserver stopped');
            };
        }
    }
    
    // KEYBOARD SHORTCUTS - Enhanced for v2.0
    function setupKeyboardHandlers() {
        try {
            console.log('⌨️ Grid4 v2.0: Setting up enhanced keyboard handlers...');
            
            document.addEventListener('keydown', function(e) {
                // Skip if in input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                    e.target.contentEditable === 'true') {
                    return;
                }
                
                const key = e.key ? e.key.toLowerCase() : '';
                const keyCode = e.keyCode || e.which;
                
                // F key - Feature management
                if (key === 'f' || keyCode === 70) {
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        e.preventDefault();
                        showV2StatusModal();
                        return;
                    }
                }
                
                // Ctrl+Shift+V - Version toggle (experimental)
                if (e.ctrlKey && e.shiftKey && (key === 'v' || keyCode === 86)) {
                    e.preventDefault();
                    console.log('🔄 Grid4 v2.0: Version toggle requested');
                    toggleV2Features();
                    return;
                }
                
                // Ctrl+Shift+K - Command palette
                if (e.ctrlKey && e.shiftKey && (key === 'k' || keyCode === 75)) {
                    e.preventDefault();
                    showV2CommandPalette();
                    return;
                }
            });
            
            console.log('✅ Grid4 v2.0: Enhanced keyboard handlers active');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0: Keyboard handler setup failed:', error);
        }
    }
    
    // V2.0 STATUS MODAL
    function showV2StatusModal() {
        try {
            // Remove existing modal
            const existing = document.querySelector('.grid4-v2-modal');
            if (existing) {
                existing.remove();
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'grid4-v2-modal';
            
            const capabilities = window.Grid4V2Capabilities || {};
            const supportedFeatures = capabilities.features ? 
                Object.values(capabilities.features).filter(Boolean).length : 0;
            
            modal.innerHTML = `
                <div class="grid4-v2-modal-content">
                    <h2 class="grid4-v2-modal-header">🚀 Grid4 Skin v2.0 Experimental</h2>
                    
                    <div class="grid4-v2-status-card">
                        <h3>✨ CSS @Layer Architecture Status</h3>
                        <ul>
                            <li>CSS @Layer Support: ${capabilities.features?.cssLayers ? '✅' : '❌'} ${capabilities.features?.cssLayers ? 'Active' : 'Not Supported'}</li>
                            <li>Custom Properties: ${capabilities.features?.cssCustomProperties ? '✅' : '❌'} ${capabilities.features?.cssCustomProperties ? 'Active' : 'Fallback Mode'}</li>
                            <li>Layout System: ✅ Grid + Flexbox Enhanced</li>
                            <li>Design System: ✅ Modern Token-Based</li>
                            <li>Performance: ✅ No !important Wars</li>
                            <li>Accessibility: ${capabilities.features?.prefersReducedMotion ? '✅' : '⚠️'} Motion Preferences Detected</li>
                        </ul>
                    </div>
                    
                    <div class="grid4-v2-status-card">
                        <h3>🔍 Browser Compatibility</h3>
                        <ul>
                            <li><strong>Browser:</strong> ${getBrowserName(navigator.userAgent)}</li>
                            <li><strong>Modern Features:</strong> ${supportedFeatures}/12 supported</li>
                            <li><strong>Architecture:</strong> ${validateV2Architecture() ? 'Fully Compatible' : 'Limited Support'}</li>
                        </ul>
                    </div>
                    
                    <div class="grid4-v2-status-card">
                        <h3>⌨️ Keyboard Shortcuts</h3>
                        <ul>
                            <li><strong>F</strong> - Status Modal (this dialog)</li>
                            <li><strong>Ctrl+Shift+K</strong> - Command Palette</li>
                            <li><strong>Ctrl+Shift+V</strong> - Toggle v2.0 Features</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 24px;">
                        <button onclick="this.closest('.grid4-v2-modal').remove()" 
                                style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            console.log('✅ Grid4 v2.0: Status modal displayed');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0: Status modal failed:', error);
        }
    }
    
    // COMMAND PALETTE - Simplified for v2.0
    function showV2CommandPalette() {
        const commands = [
            'Logo Refresh - Reapply Grid4 SmartComm branding',
            'Element Enhancement - Re-scan and enhance form elements',
            'Table Enhancement - Improve table contrast and styling',
            'Architecture Validation - Check browser compatibility',
            'Feature Toggle - Enable/disable experimental features',
            'Debug Mode - Toggle diagnostic information'
        ];
        
        const commandList = commands.map((cmd, i) => `${i + 1}. ${cmd}`).join('\\n');
        alert(`🎯 Grid4 v2.0 Command Palette\\n\\n${commandList}\\n\\n🆕 New in v2.0:\\n• CSS @Layer Architecture\\n• No !important Conflicts\\n• Enhanced Performance\\n• Better Accessibility`);
    }
    
    // FEATURE TOGGLE SYSTEM
    function toggleV2Features() {
        FEATURE_FLAGS.experimental_features = !FEATURE_FLAGS.experimental_features;
        console.log(`🔄 Grid4 v2.0: Experimental features ${FEATURE_FLAGS.experimental_features ? 'enabled' : 'disabled'}`);
        
        if (FEATURE_FLAGS.experimental_features) {
            document.body.classList.add('grid4-v2-experimental');
        } else {
            document.body.classList.remove('grid4-v2-experimental');
        }
    }
    
    // BROWSER NAME DETECTION
    function getBrowserName(userAgent) {
        if (userAgent.includes('Edg/')) return 'Microsoft Edge (Chromium)';
        if (userAgent.includes('Edge/')) return 'Microsoft Edge (Legacy)';
        if (userAgent.includes('Chrome/')) return 'Google Chrome';
        if (userAgent.includes('Firefox/')) return 'Mozilla Firefox';
        if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari';
        return 'Unknown Browser';
    }
    
    // INITIALIZATION SEQUENCE - V2.0 Enhanced
    function initializeGrid4V2() {
        console.log('🚀 Grid4 v2.0: Experimental initialization starting...');
        
        // Step 1: Capability detection
        const capabilities = logBrowserCapabilities();
        
        // Step 2: Architecture validation
        const architectureValid = validateV2Architecture();
        
        // Step 3: DOM structure validation
        const domValidation = validateDomStructure();
        
        if (!domValidation.valid) {
            console.error('🛑 Grid4 v2.0: Critical DOM elements missing, halting initialization');
            return;
        }
        
        // Step 4: Apply CSS classes for @layer targeting
        applyV2Classes();
        
        // Step 5: Wait for DOM if needed, then enhance
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                replaceLogo();
                setupKeyboardHandlers();
                initializeDynamicContentObserver();
                console.log('✅ Grid4 v2.0: DOM ready initialization complete');
            });
        } else {
            replaceLogo();
            setupKeyboardHandlers();
            initializeDynamicContentObserver();
            console.log('✅ Grid4 v2.0: Immediate initialization complete');
        }
        
        console.log('✅ Grid4 v2.0: Experimental skin fully loaded');
    }
    
    // GLOBAL API - Conditional exposure based on debug mode
    if (FEATURE_FLAGS.debug_mode) {
        window.Grid4V2 = {
            version: GRID4_V2_VERSION,
            featureFlags: FEATURE_FLAGS,
            capabilities: null, // Will be populated by logBrowserCapabilities
            replaceLogo: replaceLogo,
            enhanceElements: function() {
                enhanceFormElements();
                enhanceTables();
            },
            validateArchitecture: validateV2Architecture,
            validateDom: validateDomStructure,
            showStatus: showV2StatusModal,
            toggleFeatures: toggleV2Features,
            status: function() {
                console.log(`Grid4 Skin v${GRID4_V2_VERSION} - CSS @Layer Architecture`);
                console.log('Logo replacements:', document.querySelectorAll('.grid4-v2-logo-replaced').length);
                console.log('Enhanced elements:', document.querySelectorAll('.grid4-v2-enhanced').length);
                console.log('Feature flags:', FEATURE_FLAGS);
                console.log('Architecture valid:', validateV2Architecture());
            }
        };
        console.log('🐛 Grid4 v2.0: Full debug API exposed to window.Grid4V2');
    } else {
        // Minimal production API
        window.Grid4V2 = {
            version: GRID4_V2_VERSION,
            status: function() {
                console.log(`Grid4 Skin v${GRID4_V2_VERSION} - Active`);
            }
        };
    }
    
    // START INITIALIZATION
    initializeGrid4V2();
    
    console.log('🎉 Grid4 Skin v2.0 Experimental - CSS @Layer architecture fully loaded!');
    
})();