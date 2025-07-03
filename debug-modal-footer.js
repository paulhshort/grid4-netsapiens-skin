// Run this in browser console to debug modal footer styling
function debugModalFooter() {
    const footer = document.querySelector('.modal .modal-footer');
    if (!footer) {
        console.log('No modal footer found. Please open a modal first.');
        return;
    }
    
    console.log('=== MODAL FOOTER DEBUG ===');
    
    // Get computed styles
    const computed = window.getComputedStyle(footer);
    console.log('Background Color:', computed.backgroundColor);
    console.log('Background:', computed.background);
    
    // Get all stylesheets
    const sheets = [...document.styleSheets];
    const footerRules = [];
    
    sheets.forEach((sheet, sheetIndex) => {
        try {
            const rules = [...sheet.cssRules || sheet.rules];
            rules.forEach((rule, ruleIndex) => {
                if (rule.selectorText && rule.selectorText.includes('modal-footer')) {
                    // Check if this rule matches our element
                    if (footer.matches(rule.selectorText)) {
                        footerRules.push({
                            selector: rule.selectorText,
                            background: rule.style.backgroundColor || rule.style.background,
                            source: sheet.href || 'inline',
                            specificity: calculateSpecificity(rule.selectorText),
                            index: `${sheetIndex}.${ruleIndex}`
                        });
                    }
                }
            });
        } catch (e) {
            // Cross-origin stylesheets
        }
    });
    
    // Sort by specificity and source order
    footerRules.sort((a, b) => {
        if (a.specificity !== b.specificity) {
            return b.specificity - a.specificity;
        }
        return b.index.localeCompare(a.index);
    });
    
    console.log('\nMatching CSS Rules (sorted by specificity):');
    footerRules.forEach(rule => {
        console.log(`${rule.selector} { background: ${rule.background} } - from ${rule.source}`);
    });
    
    // Check inline styles
    console.log('\nInline Styles:', footer.style.cssText || 'none');
    
    // Check parent theme
    console.log('\nTheme Detection:');
    console.log('Body has theme-dark:', document.body.classList.contains('theme-dark'));
    console.log('Body has theme-light:', document.body.classList.contains('theme-light'));
    
    // Simple specificity calculator
    function calculateSpecificity(selector) {
        let specificity = 0;
        // Count IDs
        specificity += (selector.match(/#/g) || []).length * 100;
        // Count classes, attributes, pseudo-classes
        specificity += (selector.match(/\./g) || []).length * 10;
        specificity += (selector.match(/\[/g) || []).length * 10;
        specificity += (selector.match(/:/g) || []).length * 10;
        // Count elements
        specificity += (selector.match(/^[a-z]|[\s>+~][a-z]/gi) || []).length;
        return specificity;
    }
}

debugModalFooter();