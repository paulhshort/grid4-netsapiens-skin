// Inspecting modal CSS in light theme
console.log('=== MODAL CSS INSPECTION ===');

// Check body classes
const bodyClasses = document.body.className;
console.log('Body classes:', bodyClasses);

// Check for theme-specific classes on #grid4-app-shell
const appShell = document.querySelector('#grid4-app-shell');
if (appShell) {
    console.log('App shell classes:', appShell.className);
}

// Find the modal
const modal = document.querySelector('.modal');
if (modal) {
    console.log('Modal found, classes:', modal.className);
    
    // Check if modal is inside or outside app shell
    const isInsideAppShell = appShell && appShell.contains(modal);
    console.log('Modal inside app shell:', isInsideAppShell);
    
    // Get modal-content element
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        const styles = window.getComputedStyle(modalContent);
        console.log('Modal content computed styles:');
        console.log('- background-color:', styles.backgroundColor);
        console.log('- color:', styles.color);
        
        // Get all matching CSS rules
        const sheets = Array.from(document.styleSheets);
        console.log('\nCSS Rules affecting .modal-content:');
        
        sheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                rules.forEach(rule => {
                    if (rule.selectorText && rule.selectorText.includes('.modal-content')) {
                        console.log('\nFrom:', sheet.href || 'inline');
                        console.log('Selector:', rule.selectorText);
                        console.log('Styles:', rule.style.cssText);
                    }
                });
            } catch (e) {
                // Cross-origin stylesheets might throw
            }
        });
    }
}

// Check for CSS variables
const rootStyles = window.getComputedStyle(document.documentElement);
console.log('\nCSS Variables:');
console.log('--modal-bg:', rootStyles.getPropertyValue('--modal-bg'));
console.log('--modal-text:', rootStyles.getPropertyValue('--modal-text'));
