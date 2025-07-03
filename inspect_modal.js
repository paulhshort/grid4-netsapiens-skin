// Wait for page to be ready
await page.waitForTimeout(1000);

// Execute inspection code
const modalInfo = await page.evaluate(() => {
    // Get the modal content element
    const modalContent = document.querySelector('.modal-content');
    if (\!modalContent) {
        return { error: 'Modal content not found' };
    }
    
    // Get computed styles
    const computedStyles = window.getComputedStyle(modalContent);
    
    // Get body classes
    const bodyClasses = document.body.className;
    
    // Check for any CSS files loaded
    const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map(link => link.href)
        .filter(href => href.includes('grid4') || href.includes('MODAL'));
    
    // Get all CSS rules that apply to .modal-content in light theme
    const appliedRules = [];
    try {
        for (const sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (const rule of rules) {
                    if (rule.selectorText && (
                        rule.selectorText.includes('.modal-content') || 
                        rule.selectorText.includes('body.theme-light') ||
                        rule.selectorText.includes('body:not(.theme-dark)')
                    )) {
                        appliedRules.push({
                            selector: rule.selectorText,
                            styles: rule.style.cssText
                        });
                    }
                }
            } catch (e) {
                // Skip cross-origin stylesheets
            }
        }
    } catch (e) {
        // Handle any errors
    }
    
    return {
        bodyClasses,
        modalContentStyles: {
            backgroundColor: computedStyles.backgroundColor,
            color: computedStyles.color,
            border: computedStyles.border,
            boxShadow: computedStyles.boxShadow
        },
        cssFiles,
        appliedRules: appliedRules.slice(0, 20) // Limit to first 20 rules
    };
});

console.log(JSON.stringify(modalInfo, null, 2));
EOF < /dev/null
