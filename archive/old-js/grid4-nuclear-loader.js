/* GRID4 NUCLEAR LOADER - Direct Portal Injection */
/* Bypasses all caching and loading issues - Injects CSS immediately */

(function() {
    'use strict';
    
    console.log('💥 GRID4 NUCLEAR LOADER - DIRECT INJECTION MODE');
    
    // IMMEDIATE CSS INJECTION - NO WAITING
    const CSS_CONTENT = `
/* GRID4 NUCLEAR CSS - IMMEDIATE LOAD */
:root {
    --g4-primary: #1a2332;
    --g4-accent: #00d4ff;
    --g4-bg-dark: #1e2736;
    --g4-bg-light: #f8f9fa;
    --g4-text-light: #ffffff;
    --g4-text-dark: #333333;
    --g4-sidebar-width: 220px;
    --g4-z-sidebar: 1000;
}

/* BOOTSTRAP 2 NEUTRALIZATION */
.row [class*="span"], .row-fluid [class*="span"] {
    float: none !important;
    width: auto !important;
    margin-left: 0 !important;
    display: block !important;
}
.row { margin-left: 0 !important; }

/* NUCLEAR SIDEBAR FIX */
#navigation, #nav-buttons {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: var(--g4-sidebar-width) !important;
    height: 100vh !important;
    background: var(--g4-bg-dark) !important;
    z-index: var(--g4-z-sidebar) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1) !important;
}

/* NUCLEAR CONTENT OFFSET */
.wrapper, .page-container, #content, .fixed-container {
    margin-left: var(--g4-sidebar-width) !important;
    min-height: 100vh !important;
    padding: 20px !important;
    background-color: var(--g4-bg-light) !important;
}

/* NUCLEAR NAVIGATION STYLING */
#navigation ul, #nav-buttons ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
}

#navigation li, #nav-buttons li {
    display: block !important;
    width: 100% !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    margin: 0 !important;
}

#navigation a, #nav-buttons a {
    display: block !important;
    padding: 15px 20px !important;
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

#navigation a:hover, #nav-buttons a:hover {
    background-color: rgba(0, 212, 255, 0.1) !important;
    color: var(--g4-accent) !important;
    transform: translateX(5px) !important;
}

#navigation .active a, #nav-buttons .active a,
#navigation .current a, #nav-buttons .current a {
    background-color: var(--g4-accent) !important;
    color: var(--g4-primary) !important;
    font-weight: 600 !important;
    border-left: 4px solid #ffffff !important;
}

/* NUCLEAR ICON FIX */
#navigation a::before, #nav-buttons a::before,
#navigation a::after, #nav-buttons a::after {
    content: none !important;
    display: none !important;
}

/* FONT AWESOME ICONS */
#nav-home-super a::before, #nav-home a::before { content: "🏠 " !important; }
#nav-users a::before { content: "👥 " !important; }
#nav-inventory a::before { content: "📋 " !important; }
#nav-call-reports a::before { content: "📊 " !important; }
#nav-call-center a::before { content: "📞 " !important; }
#nav-admin a::before { content: "⚙️ " !important; }

/* NUCLEAR BUTTON FIXES */
.btn {
    border-radius: 4px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
    border: 1px solid transparent !important;
    cursor: pointer !important;
}

.btn-primary {
    background-color: var(--g4-accent) !important;
    border-color: var(--g4-accent) !important;
    color: var(--g4-primary) !important;
}

/* NUCLEAR FORM FIXES */
input[type="text"], input[type="email"], input[type="password"],
input[type="number"], select, textarea {
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 8px 12px !important;
    font-size: 14px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    background-color: #ffffff !important;
}

input:focus, select:focus, textarea:focus {
    border-color: var(--g4-accent) !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2) !important;
}

/* NUCLEAR OVERFLOW FIXES */
#chart_div, .chart-container, .dashboard-chart {
    overflow-x: auto !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

.dataTables_wrapper {
    overflow-x: auto !important;
    max-width: 100% !important;
    background-color: #ffffff !important;
    border-radius: 8px !important;
    padding: 20px !important;
    margin-top: 20px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

table {
    max-width: 100% !important;
    table-layout: auto !important;
    word-wrap: break-word !important;
}

/* NUCLEAR MODAL FIXES */
.modal { z-index: 1050 !important; }
.modal-header {
    background-color: var(--g4-primary) !important;
    color: var(--g4-text-light) !important;
    border-bottom: 2px solid var(--g4-accent) !important;
}

/* NUCLEAR RESPONSIVE */
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
        padding: 10px !important;
    }
}

/* NUCLEAR SAFETY */
* { box-sizing: border-box !important; }
body { position: relative !important; min-height: 100vh !important; }
`;
    
    // IMMEDIATE INJECTION
    function injectNuclearCSS() {
        console.log('💥 INJECTING NUCLEAR CSS...');
        
        // Remove any existing Grid4 styles
        const existing = document.querySelectorAll('link[href*="grid4"], style[id*="grid4"]');
        existing.forEach(el => el.remove());
        
        // Create and inject new style
        const style = document.createElement('style');
        style.id = 'grid4-nuclear-css';
        style.type = 'text/css';
        style.textContent = CSS_CONTENT;
        
        // Insert at the very end to override everything
        document.head.appendChild(style);
        
        console.log('💥 NUCLEAR CSS INJECTED - ' + CSS_CONTENT.length + ' characters');
        
        // Force immediate re-render
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        return true;
    }
    
    // IMMEDIATE EXECUTION
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNuclearCSS);
    } else {
        injectNuclearCSS();
    }
    
    // FORCE RE-INJECTION ON ANY AJAX ACTIVITY
    if (window.jQuery || window.$) {
        const $ = window.jQuery || window.$;
        $(document).ajaxComplete(function() {
            console.log('💥 AJAX DETECTED - RE-INJECTING NUCLEAR CSS');
            setTimeout(injectNuclearCSS, 100);
        });
    }
    
    // GLOBAL NUCLEAR API
    window.Grid4Nuclear = {
        reinject: injectNuclearCSS,
        version: 'NUCLEAR-1.0',
        status: 'ACTIVE'
    };
    
    console.log('💥 GRID4 NUCLEAR LOADER ACTIVE - No CDN dependencies, no caching issues');
    
})();