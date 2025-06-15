/* GRID4 IMMEDIATE NUCLEAR - Cache-Buster Version */
/* New filename to bypass CDN cache completely */

(function() {
    'use strict';
    
    console.log('💥💥 GRID4 IMMEDIATE NUCLEAR - CACHE BUSTER VERSION 2.0');
    
    // IMMEDIATE CSS INJECTION - COMPREHENSIVE VERSION
    const NUCLEAR_CSS = `
/* GRID4 IMMEDIATE NUCLEAR CSS - NO CACHE DEPENDENCIES */
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

/* BOOTSTRAP 2 NEUTRALIZATION - CRITICAL */
.row [class*="span"], .row-fluid [class*="span"] {
    float: none !important;
    width: auto !important;
    margin-left: 0 !important;
    display: block !important;
}
.row { margin-left: 0 !important; }
.btn, .nav > li > a {
    background-image: none !important;
    text-shadow: none !important;
}

/* NUCLEAR SIDEBAR - IMMEDIATE FIX */
#navigation, #nav-buttons {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: var(--g4-sidebar-width) !important;
    height: 100vh !important;
    background: linear-gradient(135deg, var(--g4-bg-dark) 0%, #1a2332 100%) !important;
    z-index: var(--g4-z-sidebar) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    box-shadow: 2px 0 15px rgba(0,0,0,0.3) !important;
    border-right: 1px solid var(--g4-accent) !important;
}

/* NUCLEAR CONTENT OFFSET - IMMEDIATE FIX */
.wrapper, .page-container, #content, .fixed-container {
    margin-left: var(--g4-sidebar-width) !important;
    min-height: 100vh !important;
    padding: 20px !important;
    background-color: var(--g4-bg-light) !important;
    position: relative !important;
    z-index: var(--g4-z-content) !important;
}

/* NUCLEAR NAVIGATION STYLING - COMPLETE */
#navigation ul, #nav-buttons ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
}

#navigation li, #nav-buttons li {
    display: block !important;
    width: 100% !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    margin: 0 !important;
    position: relative !important;
}

#navigation a, #nav-buttons a {
    display: block !important;
    padding: 16px 24px !important;
    color: var(--g4-text-light) !important;
    text-decoration: none !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border: none !important;
    background: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    position: relative !important;
}

#navigation a:hover, #nav-buttons a:hover {
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%) !important;
    color: var(--g4-accent) !important;
    transform: translateX(8px) !important;
    border-left: 3px solid var(--g4-accent) !important;
}

#navigation .active a, #nav-buttons .active a,
#navigation .current a, #nav-buttons .current a {
    background: linear-gradient(90deg, var(--g4-accent) 0%, rgba(0, 212, 255, 0.8) 100%) !important;
    color: var(--g4-primary) !important;
    font-weight: 600 !important;
    border-left: 4px solid #ffffff !important;
    box-shadow: inset 0 0 20px rgba(255,255,255,0.1) !important;
}

/* NUCLEAR ICON REMOVAL AND REPLACEMENT */
#navigation a::before, #nav-buttons a::before,
#navigation a::after, #nav-buttons a::after {
    content: none !important;
    display: none !important;
}

/* EMOJI ICONS FOR IMMEDIATE VISIBILITY */
#nav-home-super a::before, #nav-home a::before,
[href*="home"] a::before { content: "🏠 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-users a::before, [href*="users"] a::before { content: "👥 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-inventory a::before, [href*="inventory"] a::before { content: "📋 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-call-reports a::before, [href*="reports"] a::before { content: "📊 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-call-center a::before, [href*="call-center"] a::before { content: "📞 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-admin a::before, [href*="admin"] a::before { content: "⚙️ " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-billing a::before, [href*="billing"] a::before { content: "💳 " !important; font-size: 16px !important; margin-right: 8px !important; }

#nav-recordings a::before, [href*="recordings"] a::before { content: "🎵 " !important; font-size: 16px !important; margin-right: 8px !important; }

/* NUCLEAR BUTTON STYLING */
.btn {
    border-radius: 6px !important;
    padding: 10px 18px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
    border: 1px solid transparent !important;
    cursor: pointer !important;
    text-transform: none !important;
}

.btn-primary {
    background: linear-gradient(135deg, var(--g4-accent) 0%, #0088cc 100%) !important;
    border-color: var(--g4-accent) !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3) !important;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #0088cc 0%, #006699 100%) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4) !important;
}

/* NUCLEAR FORM STYLING */
input[type="text"], input[type="email"], input[type="password"],
input[type="number"], select, textarea {
    border: 2px solid #e1e5e9 !important;
    border-radius: 6px !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    background-color: #ffffff !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
}

input:focus, select:focus, textarea:focus {
    border-color: var(--g4-accent) !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2) !important;
    background-color: #ffffff !important;
}

/* NUCLEAR OVERFLOW FIXES - CRITICAL */
#chart_div, .chart-container, .dashboard-chart {
    overflow-x: auto !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
    margin: 10px 0 !important;
}

/* DATA TABLES STYLING */
.dataTables_wrapper {
    overflow-x: auto !important;
    max-width: 100% !important;
    background-color: #ffffff !important;
    border-radius: 10px !important;
    padding: 24px !important;
    margin: 20px 0 !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
    border: 1px solid #e1e5e9 !important;
}

table {
    max-width: 100% !important;
    table-layout: auto !important;
    word-wrap: break-word !important;
    border-collapse: collapse !important;
}

table th {
    background: linear-gradient(135deg, var(--g4-primary) 0%, #1a2332 100%) !important;
    color: var(--g4-text-light) !important;
    padding: 12px 16px !important;
    font-weight: 600 !important;
    border: none !important;
}

table td {
    padding: 12px 16px !important;
    border-bottom: 1px solid #e1e5e9 !important;
    background: #ffffff !important;
}

table tr:hover td {
    background: #f8f9fa !important;
}

/* NUCLEAR MODAL STYLING */
.modal {
    z-index: 1050 !important;
}

.modal-dialog {
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
}

.modal-header {
    background: linear-gradient(135deg, var(--g4-primary) 0%, #1a2332 100%) !important;
    color: var(--g4-text-light) !important;
    border-bottom: 3px solid var(--g4-accent) !important;
    padding: 20px 24px !important;
}

.modal-title {
    color: var(--g4-text-light) !important;
    font-weight: 600 !important;
    font-size: 18px !important;
}

.modal-body {
    background-color: var(--g4-bg-light) !important;
    padding: 24px !important;
}

.modal-footer {
    background-color: #f8f9fa !important;
    border-top: 1px solid #dee2e6 !important;
    padding: 16px 24px !important;
}

/* NUCLEAR RESPONSIVE DESIGN */
@media (max-width: 768px) {
    #navigation, #nav-buttons {
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
    }
    
    #navigation.mobile-show, #nav-buttons.mobile-show {
        transform: translateX(0) !important;
    }
    
    .wrapper, .page-container, #content {
        margin-left: 0 !important;
        padding: 15px !important;
    }
    
    .dataTables_wrapper {
        padding: 15px !important;
        margin: 10px 0 !important;
    }
}

/* NUCLEAR SAFETY AND PERFORMANCE */
* { box-sizing: border-box !important; }
html { scroll-behavior: smooth !important; }
body { 
    position: relative !important; 
    min-height: 100vh !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
}

/* NUCLEAR ANIMATIONS */
@keyframes slideInFromLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

#navigation, #nav-buttons {
    animation: slideInFromLeft 0.5s ease-out !important;
}

/* NUCLEAR GRADIENT ACCENTS */
.page-header, .content-header {
    background: linear-gradient(135deg, var(--g4-primary) 0%, var(--g4-bg-dark) 100%) !important;
    color: var(--g4-text-light) !important;
    padding: 20px 24px !important;
    border-radius: 8px !important;
    margin-bottom: 24px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}
`;
    
    // IMMEDIATE INJECTION FUNCTION
    function injectNuclearCSS() {
        console.log('💥💥 INJECTING IMMEDIATE NUCLEAR CSS...');
        
        // Remove ALL existing Grid4 styles
        const existing = document.querySelectorAll('link[href*="grid4"], style[id*="grid4"]');
        existing.forEach(el => {
            console.log('💥 Removing existing Grid4 style:', el.id || el.href);
            el.remove();
        });
        
        // Create and inject new style with timestamp
        const style = document.createElement('style');
        style.id = 'grid4-immediate-nuclear-' + Date.now();
        style.type = 'text/css';
        style.textContent = NUCLEAR_CSS;
        
        // Insert at the very end of head to override everything
        document.head.appendChild(style);
        
        console.log('💥💥 IMMEDIATE NUCLEAR CSS INJECTED - ' + NUCLEAR_CSS.length + ' characters');
        console.log('💥💥 Style ID:', style.id);
        
        // Force immediate re-render
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Add nuclear class to body
        document.body.classList.add('grid4-nuclear-active');
        
        return style.id;
    }
    
    // FORCE EXECUTION ON ALL PAGE STATES
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNuclearCSS);
    } else {
        injectNuclearCSS();
    }
    
    // RE-INJECT ON AJAX ACTIVITY
    if (window.jQuery || window.$) {
        const $ = window.jQuery || window.$;
        $(document).ajaxComplete(function() {
            console.log('💥💥 AJAX DETECTED - RE-INJECTING IMMEDIATE NUCLEAR CSS');
            setTimeout(injectNuclearCSS, 50);
        });
    }
    
    // NUCLEAR API
    window.Grid4ImmediateNuclear = {
        reinject: injectNuclearCSS,
        version: 'IMMEDIATE-NUCLEAR-2.0',
        status: 'ACTIVE',
        cssLength: NUCLEAR_CSS.length,
        timestamp: Date.now()
    };
    
    console.log('💥💥 GRID4 IMMEDIATE NUCLEAR 2.0 ACTIVE');
    console.log('💥💥 NO CDN CACHE, NO DEPENDENCIES, IMMEDIATE ACTIVATION');
    
})();