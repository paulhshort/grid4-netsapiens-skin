/* GRID4 STABLE V2 - ENGINEERED SOLUTION */
/* Emergency fix for infinite loop and content destruction issues */

(function() {
    'use strict';
    
    console.log('🔧 GRID4 STABLE V2 - ENGINEERING SOLUTION ACTIVE');
    
    // ========================================================================
    // PHASE 1: INJECTION STATE MANAGEMENT SYSTEM
    // ========================================================================
    
    window.Grid4State = {
        injected: false,
        injecting: false,
        lastInjection: 0,
        injectionCount: 0,
        maxInjections: 3,
        debounceDelay: 2000, // 2 seconds minimum between injections
        errors: [],
        performance: {
            startTime: Date.now(),
            injectionTimes: []
        }
    };
    
    // ========================================================================
    // PHASE 1: SMART AJAX DETECTION WITH DEBOUNCING
    // ========================================================================
    
    let ajaxDetectionTimer;
    let mutationObserver;
    
    function smartAjaxDetection() {
        // Clear existing timer
        if (ajaxDetectionTimer) {
            clearTimeout(ajaxDetectionTimer);
        }
        
        // Debounced injection
        ajaxDetectionTimer = setTimeout(() => {
            const now = Date.now();
            const timeSinceLastInjection = now - window.Grid4State.lastInjection;
            
            // Prevent infinite loops
            if (window.Grid4State.injectionCount >= window.Grid4State.maxInjections) {
                console.log('🛑 Grid4: Maximum injections reached - preventing infinite loop');
                return;
            }
            
            // Enforce minimum delay
            if (timeSinceLastInjection < window.Grid4State.debounceDelay) {
                console.log(`⏳ Grid4: Too soon for re-injection (${timeSinceLastInjection}ms < ${window.Grid4State.debounceDelay}ms)`);
                return;
            }
            
            // Check if content area exists and is visible
            const contentArea = document.querySelector('.wrapper, #content, .page-container');
            if (!contentArea || contentArea.offsetHeight === 0) {
                console.log('🔄 Grid4: Content area missing/invisible - re-injecting CSS');
                injectStableCSS();
            }
        }, 500); // 500ms debounce
    }
    
    // ========================================================================
    // PHASE 1: PRECISE ELEMENT TARGETING
    // ========================================================================
    
    function removeExistingGrid4Styles() {
        console.log('🧹 Grid4: Removing existing Grid4 styles...');
        
        // PRECISE selectors - only target actual Grid4 elements
        const selectors = [
            'style[id^="grid4-"]',           // Style tags starting with grid4-
            'link[href*="/grid4-"]',         // Link tags with /grid4- in path
            'style[id*="nuclear"]',          // Nuclear injection styles
            'script[src*="/grid4-"]'         // Grid4 script tags
        ];
        
        let removedCount = 0;
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                console.log(`🗑️ Removing: ${el.tagName} - ${el.id || el.href || el.src}`);
                el.remove();
                removedCount++;
            });
        });
        
        console.log(`✅ Grid4: Removed ${removedCount} existing Grid4 elements`);
        return removedCount;
    }
    
    // ========================================================================
    // PHASE 2: CONTENT-PRESERVING CSS ARCHITECTURE
    // ========================================================================
    
    const STABLE_CSS = `
/* GRID4 STABLE V2 - CONTENT PRESERVING CSS */

/* CSS Design Tokens */
:root {
    --g4-primary: #1a2332;
    --g4-accent: #00d4ff;
    --g4-bg-dark: #1e2736;
    --g4-bg-light: #f8f9fa;
    --g4-text-light: #ffffff;
    --g4-text-dark: #333333;
    --g4-sidebar-width: 220px;
    --g4-z-sidebar: 1000;
    --g4-z-content: 1;
}

/* Bootstrap 2.3.2 Neutralization - Surgical Approach */
.row [class*="span"], .row-fluid [class*="span"] {
    float: none !important;
    width: auto !important;
    margin-left: 0 !important;
    display: block !important;
}
.row { margin-left: 0 !important; }

/* PHASE 2: SIDEBAR POSITIONING - NON-DESTRUCTIVE */
body.grid4-active #navigation,
body.grid4-active #nav-buttons {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: var(--g4-sidebar-width) !important;
    height: 100vh !important;
    background: linear-gradient(135deg, var(--g4-bg-dark) 0%, var(--g4-primary) 100%) !important;
    z-index: var(--g4-z-sidebar) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    box-shadow: 2px 0 15px rgba(0,0,0,0.2) !important;
    border-right: 1px solid var(--g4-accent) !important;
}

/* PHASE 2: CONTENT OFFSET - PRESERVE EXISTING STRUCTURE */
body.grid4-active .wrapper {
    margin-left: var(--g4-sidebar-width) !important;
    min-height: 100vh !important;
    position: relative !important;
    z-index: var(--g4-z-content) !important;
    /* DO NOT override padding, background, or display properties */
    /* Let the portal handle its own content structure */
}

body.grid4-active #content {
    margin-left: 0 !important; /* Reset - wrapper handles the offset */
    /* Preserve all other content properties */
}

/* PHASE 2: CONTENT AREA PROTECTION */
body.grid4-active .wrapper > .container,
body.grid4-active .page-content,
body.grid4-active .main-content,
body.grid4-active #content > *,
body.grid4-active .content-area {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
}

/* PHASE 2: NAVIGATION STYLING - ENHANCED */
body.grid4-active #navigation ul,
body.grid4-active #nav-buttons ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
}

body.grid4-active #navigation li,
body.grid4-active #nav-buttons li {
    display: block !important;
    width: 100% !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    margin: 0 !important;
}

body.grid4-active #navigation a,
body.grid4-active #nav-buttons a {
    display: block !important;
    padding: 16px 20px !important;
    color: var(--g4-text-light) !important;
    text-decoration: none !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    border: none !important;
    background: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
}

body.grid4-active #navigation a:hover,
body.grid4-active #nav-buttons a:hover {
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%) !important;
    color: var(--g4-accent) !important;
    transform: translateX(5px) !important;
}

body.grid4-active #navigation .active a,
body.grid4-active #nav-buttons .active a,
body.grid4-active #navigation .current a,
body.grid4-active #nav-buttons .current a {
    background: linear-gradient(90deg, var(--g4-accent) 0%, rgba(0, 212, 255, 0.8) 100%) !important;
    color: var(--g4-primary) !important;
    font-weight: 600 !important;
    border-left: 4px solid #ffffff !important;
}

/* PHASE 2: ICON CLEANUP */
body.grid4-active #navigation a::before,
body.grid4-active #nav-buttons a::before,
body.grid4-active #navigation a::after,
body.grid4-active #nav-buttons a::after {
    content: none !important;
    display: none !important;
}

/* PHASE 2: SIMPLE EMOJI ICONS */
body.grid4-active #nav-home-super a::before,
body.grid4-active #nav-home a::before,
body.grid4-active [href*="home"] a::before { 
    content: "🏠 " !important; 
    font-size: 14px !important; 
}

body.grid4-active #nav-users a::before,
body.grid4-active [href*="users"] a::before { 
    content: "👥 " !important; 
    font-size: 14px !important; 
}

body.grid4-active #nav-inventory a::before,
body.grid4-active [href*="inventory"] a::before { 
    content: "📋 " !important; 
    font-size: 14px !important; 
}

/* PHASE 2: ENHANCED FORMS AND BUTTONS */
body.grid4-active .btn {
    border-radius: 4px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease !important;
}

body.grid4-active .btn-primary {
    background: linear-gradient(135deg, var(--g4-accent) 0%, #0088cc 100%) !important;
    border-color: var(--g4-accent) !important;
    color: #ffffff !important;
}

body.grid4-active input[type="text"],
body.grid4-active input[type="email"],
body.grid4-active input[type="password"],
body.grid4-active select,
body.grid4-active textarea {
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 8px 12px !important;
    transition: border-color 0.2s ease !important;
}

body.grid4-active input:focus,
body.grid4-active select:focus,
body.grid4-active textarea:focus {
    border-color: var(--g4-accent) !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2) !important;
}

/* PHASE 2: TABLE IMPROVEMENTS */
body.grid4-active .dataTables_wrapper {
    overflow-x: auto !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

/* PHASE 2: RESPONSIVE DESIGN */
@media (max-width: 768px) {
    body.grid4-active #navigation,
    body.grid4-active #nav-buttons {
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
    }
    
    body.grid4-active #navigation.mobile-show,
    body.grid4-active #nav-buttons.mobile-show {
        transform: translateX(0) !important;
    }
    
    body.grid4-active .wrapper {
        margin-left: 0 !important;
    }
}

/* PHASE 2: PERFORMANCE OPTIMIZATIONS */
body.grid4-active * {
    box-sizing: border-box !important;
}
`;
    
    // ========================================================================
    // PHASE 3: INJECTION SUCCESS VALIDATION
    // ========================================================================
    
    function validateInjection() {
        const sidebar = document.querySelector('#navigation, #nav-buttons');
        const content = document.querySelector('.wrapper, #content');
        const cssVariables = getComputedStyle(document.documentElement).getPropertyValue('--g4-primary');
        
        const validation = {
            sidebarExists: !!sidebar,
            sidebarPositioned: sidebar ? getComputedStyle(sidebar).position === 'fixed' : false,
            contentVisible: content ? content.offsetHeight > 0 : false,
            cssVariablesActive: !!cssVariables,
            bodyClassActive: document.body.classList.contains('grid4-active'),
            timestamp: Date.now()
        };
        
        console.log('🔍 Grid4: Injection validation:', validation);
        
        const isValid = validation.sidebarExists && 
                       validation.sidebarPositioned && 
                       validation.contentVisible && 
                       validation.cssVariablesActive;
        
        return { valid: isValid, details: validation };
    }
    
    // ========================================================================
    // PHASE 3: AUTOMATIC RECOVERY SYSTEM
    // ========================================================================
    
    function revertToMinimalSidebar() {
        console.log('🚨 Grid4: Content area broken - reverting to minimal sidebar');
        
        // Remove aggressive styles and apply minimal CSS
        const minimalCSS = `
        :root { --g4-sidebar-width: 220px; --g4-primary: #1a2332; --g4-accent: #00d4ff; }
        #navigation, #nav-buttons { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: var(--g4-sidebar-width) !important; 
            background: var(--g4-primary) !important; 
            z-index: 1000 !important; 
        }
        .wrapper { margin-left: var(--g4-sidebar-width) !important; }
        `;
        
        const style = document.createElement('style');
        style.id = 'grid4-minimal-recovery';
        style.textContent = minimalCSS;
        document.head.appendChild(style);
        
        window.Grid4State.errors.push({
            type: 'recovery',
            timestamp: Date.now(),
            message: 'Reverted to minimal sidebar due to content visibility issues'
        });
    }
    
    // ========================================================================
    // MAIN INJECTION FUNCTION
    // ========================================================================
    
    function injectStableCSS() {
        // Check if external CSS is already loaded (via PORTAL_CSS_CUSTOM)
        const externalCSS = document.querySelector('link[href*="grid4-production-final.css"], link[href*="grid4-"]');
        if (externalCSS) {
            console.log('🔗 Grid4: External CSS detected - using minimal injection mode');
            // Just add body class and skip CSS injection
            document.body.classList.add('grid4-active');
            window.Grid4State.injected = true;
            window.Grid4State.lastInjection = Date.now();
            return true;
        }
        const startTime = Date.now();
        
        // Prevent concurrent injections
        if (window.Grid4State.injecting) {
            console.log('⏳ Grid4: Injection already in progress - skipping');
            return false;
        }
        
        // Check injection limits
        if (window.Grid4State.injectionCount >= window.Grid4State.maxInjections) {
            console.log('🛑 Grid4: Maximum injection limit reached');
            return false;
        }
        
        window.Grid4State.injecting = true;
        window.Grid4State.injectionCount++;
        
        try {
            console.log(`🔧 Grid4: Starting injection #${window.Grid4State.injectionCount}...`);
            
            // Remove existing styles
            removeExistingGrid4Styles();
            
            // Create and inject new styles
            const style = document.createElement('style');
            style.id = `grid4-stable-v2-${Date.now()}`;
            style.type = 'text/css';
            style.textContent = STABLE_CSS;
            document.head.appendChild(style);
            
            // Add body class for scoped styling
            document.body.classList.add('grid4-active');
            
            // Update state
            window.Grid4State.lastInjection = Date.now();
            window.Grid4State.injected = true;
            window.Grid4State.performance.injectionTimes.push(Date.now() - startTime);
            
            console.log(`✅ Grid4: Stable CSS injected (${STABLE_CSS.length} chars, ${Date.now() - startTime}ms)`);
            
            // Validate injection
            setTimeout(() => {
                const validation = validateInjection();
                if (!validation.valid) {
                    console.warn('⚠️ Grid4: Injection validation failed:', validation.details);
                    revertToMinimalSidebar();
                } else {
                    console.log('✅ Grid4: Injection validation passed');
                }
            }, 1000);
            
            return true;
            
        } catch (error) {
            console.error('❌ Grid4: Injection failed:', error);
            window.Grid4State.errors.push({
                type: 'injection_error',
                timestamp: Date.now(),
                error: error.message
            });
            return false;
        } finally {
            window.Grid4State.injecting = false;
        }
    }
    
    // ========================================================================
    // INITIALIZATION AND MONITORING
    // ========================================================================
    
    function initializeGrid4() {
        console.log('🚀 Grid4: Initializing stable system...');
        
        // Initial injection
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectStableCSS);
        } else {
            injectStableCSS();
        }
        
        // Set up intelligent content monitoring
        if (window.MutationObserver) {
            mutationObserver = new MutationObserver((mutations) => {
                let contentChanged = false;
                
                mutations.forEach((mutation) => {
                    // Only care about additions to content areas
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                const isContentArea = node.matches && (
                                    node.matches('.wrapper, #content, .page-container') ||
                                    node.closest('.wrapper, #content, .page-container')
                                );
                                if (isContentArea) {
                                    contentChanged = true;
                                }
                            }
                        });
                    }
                });
                
                if (contentChanged) {
                    console.log('🔄 Grid4: Content area changed - checking if re-injection needed');
                    smartAjaxDetection();
                }
            });
            
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Fallback AJAX detection for older browsers
        if (window.jQuery || window.$) {
            const $ = window.jQuery || window.$;
            $(document).ajaxComplete(smartAjaxDetection);
        }
    }
    
    // ========================================================================
    // GLOBAL API
    // ========================================================================
    
    window.Grid4StableV2 = {
        version: '2.0.0',
        reinject: injectStableCSS,
        validate: validateInjection,
        revert: revertToMinimalSidebar,
        getState: () => window.Grid4State,
        getCSS: () => STABLE_CSS
    };
    
    // Start the system
    initializeGrid4();
    
    console.log('🔧 Grid4 Stable V2 initialized - engineered for stability and performance');
    
})();