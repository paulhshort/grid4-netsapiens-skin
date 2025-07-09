/* Grid4 Test - Simple Verification Script */
/* This should show up in console if PORTAL_EXTRA_JS is working */

console.log('🎯 Grid4 Test: PORTAL_EXTRA_JS is working!');
console.log('🎯 Grid4 Test: Loading from CDN at:', new Date().toISOString());

// Add a visible indicator to the page
setTimeout(function() {
    var testDiv = document.createElement('div');
    testDiv.id = 'grid4-test-indicator';
    testDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;z-index:9999;font-size:12px;';
    testDiv.innerHTML = '🎯 Grid4 Test: JS Loading!';
    document.body.appendChild(testDiv);
    
    // Remove after 5 seconds
    setTimeout(function() {
        var el = document.getElementById('grid4-test-indicator');
        if (el) el.remove();
    }, 5000);
}, 1000);