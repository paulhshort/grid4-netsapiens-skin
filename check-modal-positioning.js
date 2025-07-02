// Check modal positioning
await page.evaluate(() => {
    const modal = document.querySelector('.modal:not(.hide)');
    if (modal) {
        const computedStyle = window.getComputedStyle(modal);
        const rect = modal.getBoundingClientRect();
        
        console.log('Modal positioning debug:');
        console.log('- Position:', computedStyle.position);
        console.log('- Display:', computedStyle.display);
        console.log('- Top:', computedStyle.top);
        console.log('- Left:', computedStyle.left);
        console.log('- Transform:', computedStyle.transform);
        console.log('- Margin:', computedStyle.margin);
        console.log('- Width:', computedStyle.width);
        console.log('- Height:', computedStyle.height);
        console.log('- BoundingRect:', rect);
        console.log('- Classes:', modal.className);
        
        // Check if modalResize function exists
        console.log('- modalResize exists:', typeof window.modalResize \!== 'undefined');
        console.log('- grid4-modal-positioned class:', modal.classList.contains('grid4-modal-positioned'));
        
        // Check for inline styles
        console.log('- Inline styles:', modal.getAttribute('style'));
        
        // Check parent overlay
        const overlay = modal.closest('.modal-backdrop') || modal.parentElement;
        if (overlay) {
            console.log('- Parent overlay classes:', overlay.className);
            console.log('- Parent overlay style:', overlay.getAttribute('style'));
        }
    }
    
    return modal ? modal.outerHTML.substring(0, 200) : 'No modal found';
});
EOF < /dev/null
