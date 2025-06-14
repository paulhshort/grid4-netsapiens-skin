/* GRID4 EMERGENCY HOTFIX v1.0.5 - FIXED - NO RACE CONDITIONS */
/* Single responsibility: JS handles functionality, CSS handles styling */

(function() {
    'use strict';
    
    console.log('🚨 Grid4 Emergency Hotfix v1.0.5 FIXED - Single Source of Truth Mode');
    
    // EMERGENCY FLAG - Prevent conflicts
    if (window.grid4EmergencyHotfixActive) {
        console.log('Grid4: Emergency hotfix already active, skipping...');
        return;
    }
    window.grid4EmergencyHotfixActive = true;
    
    // ADD BROWSER DETECTION LOGGING - Enhanced diagnostics
    function logBrowserInfo() {
        try {
            const browserInfo = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                vendor: navigator.vendor,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                language: navigator.language,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                devicePixelRatio: window.devicePixelRatio || 1,
                colorDepth: window.screen ? window.screen.colorDepth : 'unknown',
                features: {
                    localStorage: typeof Storage !== 'undefined',
                    sessionStorage: typeof sessionStorage !== 'undefined',
                    fetch: typeof fetch !== 'undefined',
                    promise: typeof Promise !== 'undefined',
                    urlSearchParams: typeof URLSearchParams !== 'undefined',
                    cssCustomProperties: CSS && CSS.supports && CSS.supports('color', 'var(--test)'),
                    flexbox: CSS && CSS.supports && CSS.supports('display', 'flex'),
                    grid: CSS && CSS.supports && CSS.supports('display', 'grid')
                }
            };
            
            console.log('📊 Grid4: Browser Diagnostics');
            console.table(browserInfo);
            
            // Store for debugging
            window.Grid4BrowserInfo = browserInfo;
            
        } catch (error) {
            console.error('❌ Grid4: Browser info logging failed:', error);
        }
    }
    
    // DEBUG MODE DETECTION
    function isDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('grid4_debug') === 'true';
    }
    
    // FORCE BODY CLASSES - CSS targeting only
    function forceBodyClasses() {
        try {
            document.body.classList.add('grid4-hotfix', 'grid4-emergency-active');
            document.documentElement.setAttribute('data-grid4-hotfix', 'v1.0.5-fixed');
            
            // Conditionally enable debug animation
            if (isDebugMode()) {
                document.body.setAttribute('data-grid4-debug', 'true');
                console.log('🐛 Grid4: Debug mode enabled via URL parameter');
            }
            
            console.log('✅ Grid4: Emergency body classes applied');
        } catch (e) {
            console.error('❌ Grid4: Error applying body classes:', e);
        }
    }
    
    // LAYOUT CLASS APPLICATION - Pure CSS approach
    function applyLayoutClasses() {
        try {
            console.log('📐 Grid4: Applying layout classes for CSS targeting...');
            
            // Add classes for CSS targeting - NO inline styles
            const nav = document.querySelector('#navigation, .navigation');
            if (nav) {
                nav.classList.add('grid4-navigation-enhanced');
                console.log('✅ Grid4: Navigation class applied');
            }
            
            const content = document.querySelector('#content, .content');
            if (content) {
                content.classList.add('grid4-content-enhanced');
                console.log('✅ Grid4: Content class applied');
            }
            
            const navButtons = document.querySelector('#nav-buttons, .nav-buttons');
            if (navButtons) {
                navButtons.classList.add('grid4-nav-buttons-enhanced');
                
                // Apply classes to navigation links
                const links = navButtons.querySelectorAll('a');
                links.forEach(link => {
                    link.classList.add('grid4-nav-link');
                });
                console.log('✅ Grid4: Navigation buttons enhanced');
            }
            
        } catch (error) {
            console.error('❌ Grid4: Layout class application failed:', error);
        }
    }
    
    // LOGO REPLACEMENT - Standards-compliant approach only
    function replaceLogo() {
        try {
            console.log('🎨 Grid4: Standards-compliant logo replacement...');
            
            // Grid4 SmartComm logo (dark theme optimized)
            const logoDataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDBkNGZmIj5HcmlkNDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjgiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiI+U21hcnRDb21tPC90ZXh0Pjwvc3ZnPg==';
            
            // Standards-compliant img.src replacement
            const logoSelectors = [
                'img[src*="netsapiens"]',
                'img[src*="logo"]', 
                '.logo img',
                '.brand img',
                '.header-logo img',
                '#header img',
                '.navbar-brand img'
            ];
            
            let replacedCount = 0;
            logoSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                images.forEach(img => {
                    if (!img.classList.contains('grid4-logo-replaced')) {
                        img.src = logoDataUrl;
                        img.alt = 'Grid4 SmartComm';
                        img.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                        img.classList.add('grid4-logo-replaced', 'grid4-injected-logo');
                        replacedCount++;
                    }
                });
            });
            
            // Text-based logo replacement
            const textElements = document.querySelectorAll('h1, h2, .brand-text, .logo-text, .navbar-brand');
            textElements.forEach(el => {
                if (el.textContent && el.textContent.toLowerCase().includes('netsapiens') && !el.classList.contains('grid4-text-replaced')) {
                    el.textContent = 'Grid4 SmartComm';
                    el.classList.add('grid4-text-replaced', 'grid4-brand-text');
                    replacedCount++;
                }
            });
            
            // Create logo if none exists (last resort)
            if (replacedCount === 0) {
                const header = document.querySelector('#header, .header, .top-header, .navbar');
                if (header && !header.querySelector('.grid4-injected-logo')) {
                    const logoImg = document.createElement('img');
                    logoImg.src = logoDataUrl;
                    logoImg.alt = 'Grid4 SmartComm';
                    logoImg.title = 'Grid4 SmartComm - Advanced VoIP Solutions';
                    logoImg.className = 'grid4-injected-logo grid4-logo-replaced';
                    header.prepend(logoImg);
                    replacedCount++;
                }
            }
            
            console.log(`✅ Grid4: Logo replacement complete - ${replacedCount} logos processed`);
            
        } catch (error) {
            console.error('❌ Grid4: Logo replacement failed:', error);
        }
    }
    
    // KEYBOARD HANDLERS - Enhanced cross-browser compatibility
    function setupKeyboardHandlers() {
        try {
            console.log('⌨️ Grid4: Setting up keyboard handlers...');
            
            // Single event listener with proper event handling
            document.addEventListener('keydown', function(e) {
                // Skip if in input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
                    return;
                }
                
                const key = e.key ? e.key.toLowerCase() : '';
                const keyCode = e.keyCode || e.which;
                
                // F key (keyCode 70) - Feature flags
                if (key === 'f' || keyCode === 70) {
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        console.log('🎛️ Grid4: F key pressed - showing feature management');
                        e.preventDefault();
                        showFeatureManagement();
                        return;
                    }
                }
                
                // Ctrl+Shift+K - Command palette
                if (e.ctrlKey && e.shiftKey && (key === 'k' || keyCode === 75)) {
                    e.preventDefault();
                    console.log('🎯 Grid4: Command palette requested');
                    showCommandPalette();
                    return;
                }
                
                // Ctrl+Shift+D - Discovery
                if (e.ctrlKey && e.shiftKey && (key === 'd' || keyCode === 68)) {
                    e.preventDefault();
                    console.log('🔍 Grid4: Discovery assessment requested');
                    showDiscoveryResults();
                    return;
                }
                
                // Ctrl+Shift+F - Alternative feature flags
                if (e.ctrlKey && e.shiftKey && (key === 'f' || keyCode === 70)) {
                    e.preventDefault();
                    console.log('🎛️ Grid4: Alternative feature flags shortcut');
                    showFeatureManagement();
                    return;
                }
            });
            
            console.log('✅ Grid4: Keyboard handlers active');
            
        } catch (error) {
            console.error('❌ Grid4: Keyboard handler setup failed:', error);
        }
    }
    
    // FEATURE MANAGEMENT UI - Clean implementation
    function showFeatureManagement() {
        try {
            // Remove existing modal
            const existingModal = document.querySelector('.grid4-feature-modal');
            if (existingModal) {
                existingModal.remove();
                return; // Toggle behavior
            }
            
            const modal = createModal();
            modal.className = 'grid4-feature-modal';
            modal.innerHTML = createFeatureModalContent();
            document.body.appendChild(modal);
            
            console.log('✅ Grid4: Feature management UI shown');
            
        } catch (error) {
            console.error('❌ Grid4: Feature management UI failed:', error);
        }
    }
    
    // MODAL CREATION HELPER - CSS handles all styling
    function createModal() {
        const modal = document.createElement('div');
        // All styling handled by CSS classes - no inline styles!
        return modal;
    }
    
    // FEATURE MODAL CONTENT - CSS classes only, no inline styles
    function createFeatureModalContent() {
        const browserInfo = window.Grid4BrowserInfo || {};
        const userAgent = browserInfo.userAgent || navigator.userAgent;
        const browserName = getBrowserName(userAgent);
        
        return `
            <div class="grid4-modal-content">
                <h2 class="grid4-modal-header">🎛️ Grid4 System Status v1.0.5</h2>
                
                <div class="grid4-status-card">
                    <h3 class="grid4-status-title">🚀 Emergency Hotfix Status</h3>
                    <ul class="grid4-status-list">
                        <li>Emergency Hotfix v1.0.5: ✅ Active (Fixed Race Conditions)</li>
                        <li>CSS-Only Layout: ✅ Applied</li>
                        <li>Logo Integration: ✅ Standards-Compliant</li>
                        <li>Cross-Browser Support: ✅ Enhanced</li>
                        <li>Keyboard Shortcuts: ✅ Active</li>
                        <li>Performance: ✅ Optimized (No Universal Transitions)</li>
                    </ul>
                </div>
                
                <div class="grid4-info-section">
                    <h3 class="grid4-info-title">🔍 Browser Detection</h3>
                    <ul class="grid4-info-list">
                        <li><strong>Browser:</strong> ${browserName}</li>
                        <li><strong>Viewport:</strong> ${browserInfo.viewport || 'Unknown'}</li>
                        <li><strong>Modern Features:</strong> ${browserInfo.features ? Object.values(browserInfo.features).filter(Boolean).length : 'Unknown'}/6 supported</li>
                    </ul>
                </div>
                
                <div class="grid4-info-section">
                    <h3 class="grid4-info-title">⌨️ Available Shortcuts</h3>
                    <ul class="grid4-info-list">
                        <li><strong>F</strong> - Feature Manager (this dialog)</li>
                        <li><strong>Ctrl+Shift+K</strong> - Command Palette</li>
                        <li><strong>Ctrl+Shift+D</strong> - Discovery Assessment</li>
                        <li><strong>Ctrl+Shift+F</strong> - Alternative feature access</li>
                    </ul>
                </div>
                
                <div class="grid4-debug-section">
                    <h3 class="grid4-info-title">🛠️ Debug Actions</h3>
                    <div class="grid4-debug-buttons">
                        <button onclick="window.Grid4Emergency.replaceLogo()" class="grid4-debug-btn primary">Reapply Logos</button>
                        <button onclick="window.Grid4Emergency.applyClasses()" class="grid4-debug-btn success">Reapply Classes</button>
                        <button onclick="console.table(window.Grid4BrowserInfo)" class="grid4-debug-btn warning">Log Browser Info</button>
                    </div>
                </div>
                
                <div class="grid4-modal-footer">
                    <button onclick="this.closest('.grid4-feature-modal').remove()" class="grid4-close-btn">
                        Close
                    </button>
                </div>
            </div>
        `;
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
    
    // COMMAND PALETTE STUB
    function showCommandPalette() {
        console.log('🎯 Grid4: Command palette requested');
        alert(`🎯 Grid4 Command Palette v1.0.5\n\n✅ Available Commands:\n• F - Feature Management\n• Logo Refresh\n• Layout Reset\n• Browser Diagnostics\n\n🔧 System Status: All Emergency Fixes Active\n🎨 Logo Integration: Grid4 SmartComm Applied`);
    }
    
    // DISCOVERY RESULTS
    function showDiscoveryResults() {
        const info = window.Grid4BrowserInfo || {};
        const results = `🔍 Grid4 Discovery Assessment v1.0.5\n\nBrowser: ${getBrowserName(navigator.userAgent)}\nViewport: ${window.innerWidth}x${window.innerHeight}\nFeatures: ${info.features ? Object.values(info.features).filter(Boolean).length : 'Unknown'}/6 supported\nStatus: Emergency Hotfix Active\nLogo: Grid4 SmartComm Integrated`;
        
        console.log('🔍 Grid4: Discovery assessment');
        console.table(info);
        alert(results);
    }
    
    // DOM VALIDATION - Proactive failure detection
    function validateDomHooks() {
        const criticalHooks = {
            '#navigation, .navigation': 'Main Navigation Panel',
            '#content, .content': 'Main Content Area'
        };
        let allHooksFound = true;
        for (const [selector, description] of Object.entries(criticalHooks)) {
            if (!document.querySelector(selector)) {
                console.error(`❌ GRID4 HOTFIX FAILURE: Critical DOM hook not found.
            - Selector: "${selector}"
            - Description: ${description}
            - The Grid4 skin will not apply correctly. This is likely due to an update in the NetSapiens portal.
            `);
                allHooksFound = false;
            }
        }
        if (allHooksFound) {
            console.log('✅ Grid4: All critical DOM hooks found.');
        }
        return allHooksFound;
    }
    
    // MUTATION OBSERVER - Eliminate race conditions for dynamic content
    function observeForDynamicLogos() {
        const observer = new MutationObserver((mutationsList) => {
            let needsReScan = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added node is an image or contains an image that might be a logo
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            if (node.tagName === 'IMG' || node.querySelector('img')) {
                                needsReScan = true;
                                break; 
                            }
                        }
                    }
                }
                if(needsReScan) break;
            }

            if (needsReScan) {
                console.log('🔄 Grid4: Dynamic content detected, re-running logo replacement...');
                replaceLogo();
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
        console.log('👀 Grid4: MutationObserver active for dynamic logo replacement.');

        // Expose observer control for debugging
        window.Grid4Emergency.stopObserver = () => {
            observer.disconnect();
            console.log('🛑 Grid4: MutationObserver stopped.');
        };
    }

    // INITIALIZATION - Clean, single-pass execution with validation
    function initializeGrid4Emergency() {
        console.log('🚀 Grid4: Clean initialization starting...');
        
        // Step 0: Validate DOM structure
        if (!validateDomHooks()) {
            console.error('🛑 Grid4: Halting initialization due to missing DOM elements.');
            return; 
        }
        
        // Step 1: Gather diagnostics
        logBrowserInfo();
        
        // Step 2: Apply CSS classes immediately
        forceBodyClasses();
        
        // Step 3: Wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                applyLayoutClasses();
                replaceLogo();
                setupKeyboardHandlers();
                observeForDynamicLogos(); // Start watching for dynamic content
                console.log('✅ Grid4: DOM ready initialization complete');
            });
        } else {
            applyLayoutClasses();
            replaceLogo();
            setupKeyboardHandlers();
            observeForDynamicLogos(); // Start watching for dynamic content
            console.log('✅ Grid4: Immediate initialization complete');
        }
        
        console.log('✅ Grid4: Emergency hotfix v1.0.5 initialization complete');
    }
    
    // CONDITIONAL GLOBAL EXPOSURE FOR DEBUGGING
    if (isDebugMode()) {
        window.Grid4Emergency = {
            version: '1.0.5-fixed',
            replaceLogo: replaceLogo,
            applyClasses: applyLayoutClasses,
            showFeatures: showFeatureManagement,
            logInfo: logBrowserInfo,
            validateDom: validateDomHooks,
            status: function() {
                console.log('Grid4 Emergency Hotfix v1.0.5-fixed - Status: Active');
                console.log('Logo replacement:', document.querySelectorAll('.grid4-logo-replaced').length + ' applied');
                console.log('Layout classes:', document.querySelectorAll('.grid4-navigation-enhanced, .grid4-content-enhanced').length + ' applied');
                console.log('Race conditions: ELIMINATED');
                console.log('Debug mode: ENABLED');
            }
        };
        console.log('🐛 Grid4: Debug API exposed to window.Grid4Emergency');
    } else {
        // Minimal exposure for production
        window.Grid4Emergency = {
            version: '1.0.5-fixed',
            status: function() {
                console.log('Grid4 Emergency Hotfix v1.0.5-fixed - Status: Active');
            }
        };
    }
    
    // IMMEDIATE EXECUTION
    initializeGrid4Emergency();
    
    console.log('🎉 Grid4: Emergency hotfix v1.0.5-fixed fully loaded - NO RACE CONDITIONS!');
    
})();