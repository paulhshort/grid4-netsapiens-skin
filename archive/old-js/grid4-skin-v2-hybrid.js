/* GRID4 SKIN v2.0 HYBRID - JAVASCRIPT WITH INLINE STYLE DEFENSE */
/* Combines @layer benefits with defensive programming for production stability */

(function() {
    'use strict';
    
    console.log('🔄 Grid4 Skin v2.0 Hybrid - @Layer + Defensive Architecture');
    
    // PREVENT MULTIPLE INITIALIZATION
    if (window.grid4V2HybridActive) {
        console.log('Grid4 v2.0 Hybrid: Already active, skipping...');
        return;
    }
    window.grid4V2HybridActive = true;
    
    // VERSION AND ARCHITECTURE INFO
    const GRID4_V2_HYBRID_VERSION = '2.0.0-hybrid';
    const ARCHITECTURE_MODE = 'layer-plus-defensive';
    
    // FEATURE FLAGS AND CAPABILITIES
    const FEATURE_FLAGS = {
        css_layers: CSS && CSS.supports && CSS.supports('@layer'),
        inline_style_monitoring: true,
        defensive_overrides: true,
        debug_mode: isDebugMode(),
        accessibility_mode: true
    };
    
    // DEBUG MODE DETECTION
    function isDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('grid4_debug') === 'true' || 
               urlParams.get('grid4_version') === 'v2-hybrid';
    }
    
    // ENHANCED ARCHITECTURE VALIDATION
    function validateHybridArchitecture() {
        const requirements = {
            'CSS @layer support': CSS && CSS.supports && CSS.supports('@layer'),
            'CSS custom properties': CSS && CSS.supports && CSS.supports('color', 'var(--test)'),
            'MutationObserver API': typeof MutationObserver !== 'undefined',
            'URL parameters': typeof URLSearchParams !== 'undefined',
            'Modern selectors': CSS && CSS.supports && CSS.supports('selector(:focus-visible)')
        };
        
        const capabilities = {
            // Core CSS Features
            cssLayers: requirements['CSS @layer support'],
            cssCustomProperties: requirements['CSS custom properties'],
            modernSelectors: requirements['Modern selectors'],
            
            // JavaScript APIs
            mutationObserver: requirements['MutationObserver API'],
            urlParams: requirements['URL parameters'],
            
            // Browser Features
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
            
            // Performance APIs
            performanceObserver: typeof PerformanceObserver !== 'undefined',
            intersectionObserver: typeof IntersectionObserver !== 'undefined'
        };
        
        let compatibilityScore = Object.values(requirements).filter(Boolean).length;
        let totalRequirements = Object.keys(requirements).length;
        
        console.log('📊 Grid4 v2.0 Hybrid: Architecture Validation');
        console.table(requirements);
        console.log(`🎯 Compatibility Score: ${compatibilityScore}/${totalRequirements} (${Math.round(compatibilityScore/totalRequirements*100)}%)`);
        
        // Store globally for debugging
        window.Grid4V2HybridCapabilities = capabilities;
        
        return {
            compatible: compatibilityScore >= totalRequirements - 1, // Allow 1 missing feature
            score: compatibilityScore,
            total: totalRequirements,
            capabilities: capabilities
        };
    }
    
    // ARCHITECTURE MODE DETECTION
    function determineArchitectureMode() {
        const validation = validateHybridArchitecture();
        
        if (validation.capabilities.cssLayers) {
            console.log('🎯 Grid4: Using CSS @layer primary mode with defensive fallbacks');
            return 'layer-primary';
        } else {
            console.log('⚠️ Grid4: CSS @layer not supported, using defensive-primary mode');
            return 'defensive-primary';
        }
    }
    
    // DOM STRUCTURE VALIDATION WITH ENHANCED REPORTING
    function validateDomStructure() {
        const criticalElements = {
            '#navigation, .navigation': 'Main Navigation Panel',
            '#content, .content': 'Main Content Area',
            '#nav-buttons, .nav-buttons': 'Navigation Buttons Container',
            '#header, .header': 'Header Section'
        };
        
        const optionalElements = {
            'table, .table': 'Data Tables',
            'input, select, textarea': 'Form Elements',
            'button, .btn': 'Interactive Buttons'
        };
        
        let criticalFound = 0;
        let optionalFound = 0;
        const foundElements = {};
        
        // Check critical elements
        for (const [selector, description] of Object.entries(criticalElements)) {
            const element = document.querySelector(selector);
            if (element) {
                foundElements[selector] = element;
                criticalFound++;
                console.log(`✅ Grid4: Found ${description}`);
            } else {
                console.error(`❌ GRID4 HYBRID COMPATIBILITY: Missing critical element
            - Selector: "${selector}"
            - Description: ${description}
            `);
            }
        }
        
        // Check optional elements (for enhancement tracking)
        for (const [selector, description] of Object.entries(optionalElements)) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                foundElements[selector] = elements;
                optionalFound++;
                console.log(`✅ Grid4: Found ${elements.length} ${description}`);
            }
        }
        
        const isValid = criticalFound === Object.keys(criticalElements).length;
        
        if (isValid) {
            console.log('✅ Grid4 v2.0 Hybrid: All critical DOM elements validated');
        } else {
            console.warn('⚠️ Grid4 v2.0 Hybrid: Some critical elements missing - degraded functionality expected');
        }
        
        return { 
            valid: isValid, 
            elements: foundElements,
            criticalFound: criticalFound,
            criticalTotal: Object.keys(criticalElements).length,
            optionalFound: optionalFound,
            optionalTotal: Object.keys(optionalElements).length
        };
    }
    
    // HYBRID CSS CLASS APPLICATION
    function applyHybridClasses() {
        try {
            console.log('📐 Grid4 v2.0 Hybrid: Applying CSS classes...');
            
            const architectureMode = determineArchitectureMode();
            
            // Apply body classes
            document.body.classList.add('grid4-v2-hybrid-active');
            document.documentElement.setAttribute('data-grid4-version', '2.0.0-hybrid');
            document.documentElement.setAttribute('data-grid4-architecture', architectureMode);
            
            // Enable debug mode visualization if requested
            if (FEATURE_FLAGS.debug_mode) {
                document.body.setAttribute('data-grid4-debug', 'true');
                console.log('🐛 Grid4 v2.0 Hybrid: Debug mode enabled');
            }
            
            // Apply layout classes to core elements
            const navigation = document.querySelector('#navigation, .navigation');
            if (navigation) {
                navigation.classList.add('grid4-v2-hybrid-enhanced');
                console.log('✅ Grid4: Navigation enhanced (hybrid mode)');
            }
            
            const content = document.querySelector('#content, .content');
            if (content) {
                content.classList.add('grid4-v2-hybrid-enhanced');
                console.log('✅ Grid4: Content area enhanced (hybrid mode)');
            }
            
            const header = document.querySelector('#header, .header');
            if (header) {
                header.classList.add('grid4-v2-hybrid-enhanced');
                console.log('✅ Grid4: Header enhanced (hybrid mode)');
            }
            
            const navButtons = document.querySelector('#nav-buttons, .nav-buttons');
            if (navButtons) {
                navButtons.classList.add('grid4-v2-hybrid-enhanced');
                
                // Apply classes to navigation links
                const links = navButtons.querySelectorAll('a');
                links.forEach(link => {
                    link.classList.add('grid4-v2-hybrid-nav-link');
                });
                
                console.log(`✅ Grid4: Navigation buttons enhanced (${links.length} links)`);
            }
            
            console.log('✅ Grid4 v2.0 Hybrid: CSS class application complete');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0 Hybrid: CSS class application failed:', error);
        }
    }
    
    // INLINE STYLE MONITORING SYSTEM - Defense against JavaScript style injection
    function initializeInlineStyleMonitoring() {
        if (!FEATURE_FLAGS.inline_style_monitoring || !window.MutationObserver) {
            console.warn('⚠️ Grid4: Inline style monitoring not available');
            return;
        }
        
        console.log('🛡️ Grid4: Initializing inline style defense system...');
        
        const criticalElements = [
            '#navigation', '.navigation',
            '#content', '.content',
            '#header', '.header',
            '#nav-buttons', '.nav-buttons'
        ];
        
        const problematicStyleProperties = [
            'position', 'display', 'background', 'color', 
            'width', 'height', 'z-index', 'transform'
        ];
        
        let conflictCount = 0;
        
        function handleInlineStyleConflict(element, mutation) {
            const inlineStyle = element.getAttribute('style');
            if (!inlineStyle) return;
            
            // Check if this element is critical
            const isCritical = criticalElements.some(selector => 
                element.matches && element.matches(selector)
            );
            
            if (!isCritical) return;
            
            // Check for problematic style properties
            const hasProblematicStyles = problematicStyleProperties.some(prop => 
                inlineStyle.includes(prop + ':')
            );
            
            if (hasProblematicStyles) {
                conflictCount++;
                
                console.warn(`🚨 Grid4: Inline style conflict detected (#${conflictCount})`, {
                    element: element,
                    inlineStyle: inlineStyle,
                    selector: criticalElements.find(sel => element.matches && element.matches(sel)),
                    timestamp: new Date().toISOString()
                });
                
                // Log conflict for debugging
                if (FEATURE_FLAGS.debug_mode) {
                    element.setAttribute('data-grid4-style-conflict', conflictCount.toString());
                }
                
                // Option 1: Log only (safest)
                // Option 2: Remove problematic styles (aggressive)
                // Option 3: Add defensive classes (balanced)
                
                // Balanced approach: Add defensive class
                element.classList.add('grid4-v2-hybrid-conflict-detected');
            }
        }
        
        const styleObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    handleInlineStyleConflict(mutation.target, mutation);
                }
            });
        });
        
        const config = { 
            attributes: true, 
            attributeFilter: ['style'],
            subtree: true 
        };
        
        styleObserver.observe(document.body, config);
        console.log('🛡️ Grid4: Inline style monitoring active');
        
        // Expose observer control for debugging
        if (FEATURE_FLAGS.debug_mode) {
            window.Grid4V2Hybrid.styleObserver = styleObserver;
            window.Grid4V2Hybrid.getStyleConflicts = () => {
                return {
                    count: conflictCount,
                    elements: document.querySelectorAll('[data-grid4-style-conflict]')
                };
            };
        }
    }
    
    // PROGRESSIVE ENHANCEMENT SYSTEM
    function enhanceElements() {
        // Form elements
        const formElements = document.querySelectorAll('input, select, textarea, button, .btn');
        let formEnhanced = 0;
        
        formElements.forEach(element => {
            if (!element.classList.contains('grid4-v2-hybrid-enhanced')) {
                element.classList.add('grid4-v2-hybrid-enhanced');
                formEnhanced++;
            }
        });
        
        // Tables
        const tables = document.querySelectorAll('table, .table');
        let tablesEnhanced = 0;
        
        tables.forEach(table => {
            if (!table.classList.contains('grid4-v2-hybrid-enhanced')) {
                table.classList.add('grid4-v2-hybrid-enhanced');
                tablesEnhanced++;
            }
        });
        
        if (formEnhanced > 0 || tablesEnhanced > 0) {
            console.log(`✅ Grid4: Enhanced ${formEnhanced} form elements, ${tablesEnhanced} tables`);
        }
        
        return { formEnhanced, tablesEnhanced };
    }
    
    // LOGO REPLACEMENT WITH ENHANCED FALLBACKS
    function replaceLogo() {
        try {
            console.log('🎨 Grid4 v2.0 Hybrid: Enhanced logo replacement...');
            
            const logoDataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDBkNGZmIj5HcmlkNDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiI+U21hcnRDb21tPC90ZXh0Pjwvc3ZnPg==';
            
            // Enhanced selectors with better specificity
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
                '[class*="logo"] img',
                '[id*="logo"] img'
            ];
            
            let replacedCount = 0;
            
            logoSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                images.forEach(img => {
                    if (!img.classList.contains('grid4-v2-hybrid-logo-replaced')) {
                        img.src = logoDataUrl;
                        img.alt = 'Grid4 SmartComm';
                        img.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                        img.classList.add('grid4-v2-hybrid-logo-replaced', 'grid4-v2-hybrid-logo');
                        replacedCount++;
                    }
                });
            });
            
            // Text-based logo replacement
            const textSelectors = ['h1', 'h2', '.brand-text', '.logo-text', '.navbar-brand', '.header-title'];
            textSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.textContent && 
                        el.textContent.toLowerCase().includes('netsapiens') && 
                        !el.classList.contains('grid4-v2-hybrid-text-replaced')) {
                        el.textContent = 'Grid4 SmartComm';
                        el.classList.add('grid4-v2-hybrid-text-replaced');
                        replacedCount++;
                    }
                });
            });
            
            // Fallback injection if no logos found
            if (replacedCount === 0) {
                const headerCandidates = document.querySelectorAll('#header, .header, .top-header, .navbar, .brand-container');
                for (const header of headerCandidates) {
                    if (header && !header.querySelector('.grid4-v2-hybrid-logo')) {
                        const logoImg = document.createElement('img');
                        logoImg.src = logoDataUrl;
                        logoImg.alt = 'Grid4 SmartComm';
                        logoImg.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                        logoImg.className = 'grid4-v2-hybrid-logo grid4-v2-hybrid-logo-replaced';
                        header.prepend(logoImg);
                        replacedCount++;
                        break;
                    }
                }
            }
            
            console.log(`✅ Grid4 v2.0 Hybrid: Logo replacement complete - ${replacedCount} logos processed`);
            
        } catch (error) {
            console.error('❌ Grid4 v2.0 Hybrid: Logo replacement failed:', error);
        }
    }
    
    // ENHANCED MUTATION OBSERVER FOR DYNAMIC CONTENT
    function initializeDynamicContentObserver() {
        if (!window.MutationObserver) {
            console.warn('⚠️ Grid4: MutationObserver not available, using fallback polling');
            setInterval(() => {
                enhanceElements();
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
                            // Check for elements needing enhancement
                            if (node.matches && (
                                node.matches('input, select, textarea, button, table') || 
                                node.querySelector('input, select, textarea, button, table')
                            )) {
                                needsEnhancement = true;
                            }
                            
                            // Check for images/logos
                            if (node.matches && (
                                node.matches('img') || 
                                node.querySelector('img')
                            )) {
                                needsLogoReplacement = true;
                            }
                        }
                    }
                }
                
                if (needsEnhancement && needsLogoReplacement) break;
            }
            
            if (needsEnhancement) {
                console.log('🔄 Grid4 v2.0 Hybrid: Dynamic content detected, enhancing elements...');
                enhanceElements();
            }
            
            if (needsLogoReplacement) {
                console.log('🔄 Grid4 v2.0 Hybrid: Dynamic images detected, replacing logos...');
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
        console.log('👀 Grid4 v2.0 Hybrid: Enhanced MutationObserver active');
        
        // Expose observer control
        if (FEATURE_FLAGS.debug_mode) {
            window.Grid4V2Hybrid.contentObserver = observer;
        }
    }
    
    // KEYBOARD SHORTCUTS FOR HYBRID MODE
    function setupKeyboardHandlers() {
        try {
            console.log('⌨️ Grid4 v2.0 Hybrid: Setting up keyboard handlers...');
            
            document.addEventListener('keydown', function(e) {
                // Skip if in input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
                    e.target.contentEditable === 'true') {
                    return;
                }
                
                const key = e.key ? e.key.toLowerCase() : '';
                const keyCode = e.keyCode || e.which;
                
                // F key - Hybrid status modal
                if (key === 'f' || keyCode === 70) {
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        e.preventDefault();
                        showHybridStatusModal();
                        return;
                    }
                }
                
                // Ctrl+Shift+H - Hybrid features toggle
                if (e.ctrlKey && e.shiftKey && (key === 'h' || keyCode === 72)) {
                    e.preventDefault();
                    console.log('🔄 Grid4 v2.0 Hybrid: Feature toggle requested');
                    toggleHybridFeatures();
                    return;
                }
            });
            
            console.log('✅ Grid4 v2.0 Hybrid: Keyboard handlers active');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0 Hybrid: Keyboard handler setup failed:', error);
        }
    }
    
    // HYBRID STATUS MODAL
    function showHybridStatusModal() {
        try {
            // Remove existing modal
            const existing = document.querySelector('.grid4-v2-hybrid-modal');
            if (existing) {
                existing.remove();
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'grid4-v2-hybrid-modal';
            
            const capabilities = window.Grid4V2HybridCapabilities || {};
            const validation = validateHybridArchitecture();
            const styleConflicts = FEATURE_FLAGS.debug_mode && window.Grid4V2Hybrid.getStyleConflicts ? 
                window.Grid4V2Hybrid.getStyleConflicts() : { count: 0 };
            
            modal.innerHTML = `
                <div class="grid4-v2-hybrid-modal-content">
                    <h2 style="margin: 0 0 16px 0; color: #00d4ff; font-size: 24px;">
                        🔄 Grid4 Skin v2.0 Hybrid
                    </h2>
                    
                    <div class="grid4-v2-hybrid-status-card">
                        <h3 style="color: #f59e0b;">⚡ Hybrid Architecture Status</h3>
                        <ul style="margin: 8px 0; padding-left: 20px; color: #d1d5db;">
                            <li>CSS @Layer Support: ${capabilities.cssLayers ? '✅ Active' : '❌ Using Fallbacks'}</li>
                            <li>Defensive Overrides: ✅ Active (grid4-overrides layer)</li>
                            <li>Inline Style Monitoring: ${FEATURE_FLAGS.inline_style_monitoring ? '✅ Active' : '❌ Disabled'}</li>
                            <li>Architecture Mode: ${document.documentElement.getAttribute('data-grid4-architecture') || 'unknown'}</li>
                            <li>Compatibility Score: ${validation.score}/${validation.total} (${Math.round(validation.score/validation.total*100)}%)</li>
                            <li>Style Conflicts Detected: ${styleConflicts.count}</li>
                        </ul>
                    </div>
                    
                    <div class="grid4-v2-hybrid-status-card">
                        <h3 style="color: #10b981;">🛡️ Defense Systems</h3>
                        <ul style="margin: 8px 0; padding-left: 20px; color: #d1d5db;">
                            <li>High-Specificity Selectors: ✅ Ready</li>
                            <li>!important Emergency Mode: ✅ Available</li>
                            <li>Inline Style Detection: ${FEATURE_FLAGS.inline_style_monitoring ? '✅ Monitoring' : '❌ Disabled'}</li>
                            <li>Dynamic Content Observer: ✅ Active</li>
                            <li>Graceful Fallbacks: ✅ Implemented</li>
                        </ul>
                    </div>
                    
                    <div class="grid4-v2-hybrid-status-card">
                        <h3 style="color: #667eea;">⌨️ Keyboard Shortcuts</h3>
                        <ul style="margin: 8px 0; padding-left: 20px; color: #d1d5db;">
                            <li><strong>F</strong> - Hybrid Status Modal (this dialog)</li>
                            <li><strong>Ctrl+Shift+H</strong> - Toggle Hybrid Features</li>
                            <li><strong>Ctrl+Shift+K</strong> - Command Palette</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 24px;">
                        <button onclick="this.closest('.grid4-v2-hybrid-modal').remove()" style="
                            background: #ef4444;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 500;
                        ">
                            Close
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            console.log('✅ Grid4 v2.0 Hybrid: Status modal displayed');
            
        } catch (error) {
            console.error('❌ Grid4 v2.0 Hybrid: Status modal failed:', error);
        }
    }
    
    // HYBRID FEATURE TOGGLE
    function toggleHybridFeatures() {
        FEATURE_FLAGS.inline_style_monitoring = !FEATURE_FLAGS.inline_style_monitoring;
        FEATURE_FLAGS.defensive_overrides = !FEATURE_FLAGS.defensive_overrides;
        
        console.log('🔄 Grid4 v2.0 Hybrid: Features toggled', FEATURE_FLAGS);
        
        // Re-initialize systems if needed
        if (FEATURE_FLAGS.inline_style_monitoring) {
            initializeInlineStyleMonitoring();
        }
    }
    
    // INITIALIZATION SEQUENCE
    function initializeGrid4V2Hybrid() {
        console.log('🚀 Grid4 v2.0 Hybrid: Initialization starting...');
        
        // Step 1: Architecture validation
        const validation = validateHybridArchitecture();
        
        // Step 2: DOM structure validation
        const domValidation = validateDomStructure();
        
        if (!domValidation.valid) {
            console.error('🛑 Grid4 v2.0 Hybrid: Critical DOM elements missing, using degraded mode');
        }
        
        // Step 3: Apply hybrid CSS classes
        applyHybridClasses();
        
        // Step 4: Initialize defense systems
        initializeInlineStyleMonitoring();
        
        // Step 5: Wait for DOM if needed, then enhance
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                enhanceElements();
                replaceLogo();
                setupKeyboardHandlers();
                initializeDynamicContentObserver();
                console.log('✅ Grid4 v2.0 Hybrid: DOM ready initialization complete');
            });
        } else {
            enhanceElements();
            replaceLogo();
            setupKeyboardHandlers();
            initializeDynamicContentObserver();
            console.log('✅ Grid4 v2.0 Hybrid: Immediate initialization complete');
        }
        
        console.log('✅ Grid4 v2.0 Hybrid: Full system loaded');
    }
    
    // GLOBAL API - Conditional exposure
    if (FEATURE_FLAGS.debug_mode) {
        window.Grid4V2Hybrid = {
            version: GRID4_V2_HYBRID_VERSION,
            architecture: ARCHITECTURE_MODE,
            featureFlags: FEATURE_FLAGS,
            validation: validateHybridArchitecture,
            domValidation: validateDomStructure,
            replaceLogo: replaceLogo,
            enhanceElements: enhanceElements,
            showStatus: showHybridStatusModal,
            toggleFeatures: toggleHybridFeatures,
            // Will be populated by monitoring systems
            styleObserver: null,
            contentObserver: null,
            getStyleConflicts: null,
            status: function() {
                console.log(`Grid4 Skin v${GRID4_V2_HYBRID_VERSION} - Hybrid Architecture`);
                console.log('Architecture mode:', ARCHITECTURE_MODE);
                console.log('CSS @layer support:', FEATURE_FLAGS.css_layers);
                console.log('Feature flags:', FEATURE_FLAGS);
                console.log('Logo replacements:', document.querySelectorAll('.grid4-v2-hybrid-logo-replaced').length);
                console.log('Enhanced elements:', document.querySelectorAll('.grid4-v2-hybrid-enhanced').length);
            }
        };
        console.log('🐛 Grid4 v2.0 Hybrid: Full debug API exposed');
    } else {
        // Minimal production API
        window.Grid4V2Hybrid = {
            version: GRID4_V2_HYBRID_VERSION,
            architecture: ARCHITECTURE_MODE,
            status: function() {
                console.log(`Grid4 Skin v${GRID4_V2_HYBRID_VERSION} - Active`);
            }
        };
    }
    
    // START INITIALIZATION
    initializeGrid4V2Hybrid();
    
    console.log('🎉 Grid4 Skin v2.0 Hybrid - CSS @layer + defensive architecture fully loaded!');
    
})();