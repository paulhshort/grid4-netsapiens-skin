/* GRID4 EMERGENCY MODAL FIX - REPLACE BROKEN NUCLEAR LOADER */
/* Minimal fix to restore portal functionality so settings can be updated */

(function() {
    'use strict';
    
    console.log('🚨 GRID4 EMERGENCY MODAL FIX - Restoring portal functionality');
    
    // IMMEDIATELY STOP ANY EXISTING LOOPS
    if (window.Grid4ImmediateNuclear) {
        console.log('🛑 Disabling broken nuclear loader...');
        delete window.Grid4ImmediateNuclear;
    }
    
    // REMOVE ALL EXISTING GRID4 STYLES TO RESTORE FUNCTIONALITY
    function removeAllGrid4Styles() {
        console.log('🧹 Emergency cleanup - removing all Grid4 styles...');
        
        const selectors = [
            'style[id*="grid4"]',
            'style[id*="nuclear"]', 
            'link[href*="grid4"]'
        ];
        
        let removedCount = 0;
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                console.log(`🗑️ Removing: ${el.id || el.href}`);
                el.remove();
                removedCount++;
            });
        });
        
        console.log(`✅ Removed ${removedCount} Grid4 elements`);
        
        // Remove body class
        document.body.classList.remove('grid4-active', 'grid4-nuclear-active');
        
        return removedCount;
    }
    
    // MINIMAL SIDEBAR STYLING - NON-INTRUSIVE
    const MINIMAL_CSS = `
/* GRID4 EMERGENCY FIX - MINIMAL SIDEBAR ONLY */
:root {
    --g4-sidebar-width: 220px;
    --g4-primary: #1a2332;
    --g4-accent: #00d4ff;
}

/* MINIMAL sidebar positioning - DO NOT TOUCH MODALS OR CONTENT */
#navigation, #nav-buttons {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: var(--g4-sidebar-width) !important;
    height: 100vh !important;
    background: var(--g4-primary) !important;
    z-index: 999 !important;
    overflow-y: auto !important;
}

/* MINIMAL content offset - PRESERVE ALL OTHER STYLES */
.wrapper {
    margin-left: var(--g4-sidebar-width) !important;
}

/* MINIMAL nav styling */
#navigation a, #nav-buttons a {
    color: #ffffff !important;
    display: block !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
}

#navigation a:hover, #nav-buttons a:hover {
    background: rgba(0, 212, 255, 0.1) !important;
}

/* DO NOT TOUCH MODALS, FORMS, OR ANY OTHER ELEMENTS */
/* This CSS is intentionally minimal to avoid breaking functionality */
`;
    
    function applyMinimalStyling() {
        console.log('🎨 Applying minimal emergency styling...');
        
        const style = document.createElement('style');
        style.id = 'grid4-emergency-minimal';
        style.textContent = MINIMAL_CSS;
        document.head.appendChild(style);
        
        console.log('✅ Emergency minimal styling applied');
    }
    
    // EXECUTE EMERGENCY FIX
    function executeEmergencyFix() {
        try {
            // Remove all broken styles
            removeAllGrid4Styles();
            
            // Apply minimal working styles
            applyMinimalStyling();
            
            console.log('🚨 EMERGENCY FIX COMPLETE');
            console.log('📝 You can now update PORTAL_EXTRA_JS to:');
            console.log('   https://cdn.jsdelivr.net/gh/paulhshort/grid4-netsapiens-skin@main/grid4-stable-v2.js');
            
        } catch (error) {
            console.error('❌ Emergency fix failed:', error);
        }
    }
    
    // DISABLE ALL AJAX RE-INJECTION
    // NO MORE AUTOMATIC RE-INJECTION TO PREVENT LOOPS
    
    // EXECUTE IMMEDIATELY
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeEmergencyFix);
    } else {
        executeEmergencyFix();
    }
    
    // CREATE SAFE API
    window.Grid4EmergencyFix = {
        version: 'EMERGENCY-1.0',
        status: 'ACTIVE',
        removeStyles: removeAllGrid4Styles,
        applyMinimal: applyMinimalStyling
    };
    
    console.log('🚨 Grid4 Emergency Fix loaded - portal functionality should be restored');
    
})();