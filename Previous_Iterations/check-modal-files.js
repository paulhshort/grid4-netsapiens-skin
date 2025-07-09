// Script to check if MODAL-FIX-COMPREHENSIVE files are loaded
(function() {
    console.log('=== Checking for MODAL-FIX-COMPREHENSIVE files ===');
    
    // Check for CSS files
    const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
    const modalCSSLoaded = cssFiles.some(href => href.includes('MODAL-FIX-COMPREHENSIVE.css'));
    console.log('MODAL-FIX-COMPREHENSIVE.css loaded:', modalCSSLoaded);
    
    // Check for JS files
    const jsFiles = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
    const modalJSLoaded = jsFiles.some(src => src.includes('MODAL-FIX-COMPREHENSIVE.js'));
    console.log('MODAL-FIX-COMPREHENSIVE.js loaded:', modalJSLoaded);
    
    // Check if grid4 modal functions exist
    console.log('Grid4ModalPositioning exists:', typeof window.Grid4ModalPositioning \!== 'undefined');
    
    // Check for any modals with grid4-modal-positioned class
    const positionedModals = document.querySelectorAll('.grid4-modal-positioned');
    console.log('Modals with grid4-modal-positioned class:', positionedModals.length);
    
    // Return summary
    return {
        cssLoaded: modalCSSLoaded,
        jsLoaded: modalJSLoaded,
        grid4Functions: typeof window.Grid4ModalPositioning \!== 'undefined',
        positionedModals: positionedModals.length,
        cssFiles: cssFiles.filter(f => f.includes('grid4') || f.includes('MODAL')),
        jsFiles: jsFiles.filter(f => f.includes('grid4') || f.includes('MODAL'))
    };
})();
EOF < /dev/null
