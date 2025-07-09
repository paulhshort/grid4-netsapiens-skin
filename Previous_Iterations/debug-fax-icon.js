/**
 * Debug script for fax icon visibility issue
 * Run this in the browser console after logging into NetSapiens Manager Portal
 */

(function() {
    console.log('=== FAX ICON DEBUG SCRIPT ===');
    console.log('Timestamp:', new Date().toISOString());
    
    // 1. Check if FontAwesome is loaded
    console.log('\n1. FONTAWESOME CHECK:');
    const faStylesheets = Array.from(document.styleSheets).filter(sheet => {
        try {
            return sheet.href && sheet.href.includes('font-awesome');
        } catch(e) {
            return false;
        }
    });
    console.log('FontAwesome stylesheets found:', faStylesheets.length);
    faStylesheets.forEach(sheet => console.log('  -', sheet.href));
    
    // Check for FontAwesome in page
    const faIcons = document.querySelectorAll('[class*="fa-"]');
    console.log('Total FontAwesome icons on page:', faIcons.length);
    
    // 2. Find the fax menu item
    console.log('\n2. FAX MENU ITEM:');
    const faxLink = document.querySelector('a[href*="/fax/index"]');
    if (!faxLink) {
        console.error('❌ Fax link not found!');
        return;
    }
    console.log('✓ Fax link found:', faxLink);
    console.log('  - Text content:', faxLink.textContent);
    console.log('  - HTML:', faxLink.innerHTML);
    console.log('  - Parent:', faxLink.parentElement);
    
    // 3. Check for icon element
    console.log('\n3. ICON ELEMENT:');
    const iconInFax = faxLink.querySelector('i');
    if (!iconInFax) {
        console.error('❌ No <i> element found in fax link!');
    } else {
        console.log('✓ Icon element found:', iconInFax);
        console.log('  - Classes:', iconInFax.className);
        console.log('  - HTML:', iconInFax.outerHTML);
        
        // 4. Check computed styles
        console.log('\n4. COMPUTED STYLES:');
        const iconStyles = window.getComputedStyle(iconInFax);
        console.log('  - Display:', iconStyles.display);
        console.log('  - Visibility:', iconStyles.visibility);
        console.log('  - Opacity:', iconStyles.opacity);
        console.log('  - Width:', iconStyles.width);
        console.log('  - Height:', iconStyles.height);
        console.log('  - Font-size:', iconStyles.fontSize);
        console.log('  - Color:', iconStyles.color);
        console.log('  - Position:', iconStyles.position);
        console.log('  - Z-index:', iconStyles.zIndex);
        console.log('  - Font-family:', iconStyles.fontFamily);
        console.log('  - Content (::before):', window.getComputedStyle(iconInFax, '::before').content);
        
        // 5. Check if ::before pseudo-element is working
        console.log('\n5. PSEUDO-ELEMENT CHECK:');
        const beforeStyles = window.getComputedStyle(iconInFax, '::before');
        console.log('  - Content:', beforeStyles.content);
        console.log('  - Display:', beforeStyles.display);
        console.log('  - Font-family:', beforeStyles.fontFamily);
        console.log('  - Font-size:', beforeStyles.fontSize);
        console.log('  - Width:', beforeStyles.width);
        console.log('  - Height:', beforeStyles.height);
    }
    
    // 6. Compare with working icons
    console.log('\n6. COMPARISON WITH WORKING ICONS:');
    const workingIcons = document.querySelectorAll('.mm-top-level a i.fa');
    console.log('Found', workingIcons.length, 'working icons in top menu');
    
    if (workingIcons.length > 0) {
        const firstIcon = workingIcons[0];
        console.log('First working icon:', firstIcon);
        console.log('  - Classes:', firstIcon.className);
        console.log('  - Parent link text:', firstIcon.parentElement.textContent.trim());
        
        const workingStyles = window.getComputedStyle(firstIcon);
        console.log('\nWorking icon styles:');
        console.log('  - Font-family:', workingStyles.fontFamily);
        console.log('  - Font-size:', workingStyles.fontSize);
        console.log('  - Display:', workingStyles.display);
        
        const workingBefore = window.getComputedStyle(firstIcon, '::before');
        console.log('Working icon ::before:');
        console.log('  - Content:', workingBefore.content);
        console.log('  - Font-family:', workingBefore.fontFamily);
    }
    
    // 7. Check CSS rules affecting fax icon
    console.log('\n7. CSS RULES CHECK:');
    try {
        const rules = [];
        for (let sheet of document.styleSheets) {
            try {
                for (let rule of sheet.cssRules || sheet.rules) {
                    if (rule.selectorText && (
                        rule.selectorText.includes('.fa-fax') ||
                        rule.selectorText.includes('fa-fax') ||
                        (rule.selectorText.includes('[href*="/fax"]') && rule.selectorText.includes('i'))
                    )) {
                        rules.push({
                            selector: rule.selectorText,
                            styles: rule.style.cssText,
                            source: sheet.href || 'inline'
                        });
                    }
                }
            } catch(e) {
                // Cross-origin stylesheets will throw
            }
        }
        console.log('Found', rules.length, 'CSS rules for fax icon:');
        rules.forEach(rule => {
            console.log('\n  Selector:', rule.selector);
            console.log('  Styles:', rule.styles);
            console.log('  Source:', rule.source);
        });
    } catch(e) {
        console.log('Error checking CSS rules:', e.message);
    }
    
    // 8. Check if icon is being added after our script runs
    console.log('\n8. TIMING CHECK:');
    console.log('Current icon HTML:', faxLink.innerHTML);
    
    // Set up observer to watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.target === faxLink || faxLink.contains(mutation.target)) {
                console.log('MUTATION DETECTED in fax link:', mutation);
                console.log('  - Type:', mutation.type);
                console.log('  - New HTML:', faxLink.innerHTML);
            }
        });
    });
    
    observer.observe(faxLink, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    console.log('Mutation observer set up. Will log any changes to fax link.');
    
    // 9. Try different icon classes
    console.log('\n9. TESTING DIFFERENT ICON CLASSES:');
    const testClasses = [
        'fa fa-fax',
        'fas fa-fax',
        'far fa-fax',
        'fa fa-fax fa-fw',
        'icon-fax',
        'glyphicon glyphicon-fax'
    ];
    
    testClasses.forEach(className => {
        const testIcon = document.createElement('i');
        testIcon.className = className;
        document.body.appendChild(testIcon);
        const testStyles = window.getComputedStyle(testIcon, '::before');
        console.log(`Class "${className}":`, testStyles.content !== 'none' ? '✓ Shows content' : '❌ No content');
        document.body.removeChild(testIcon);
    });
    
    // 10. Manual icon test
    console.log('\n10. MANUAL ICON INJECTION TEST:');
    if (iconInFax) {
        // Save current state
        const originalClass = iconInFax.className;
        
        // Try with a known working icon
        iconInFax.className = 'fa fa-phone';
        console.log('Changed to fa-phone - is it visible now?');
        
        setTimeout(() => {
            iconInFax.className = originalClass;
            console.log('Restored original class:', originalClass);
        }, 3000);
    }
    
    console.log('\n=== END OF DEBUG SCRIPT ===');
    console.log('Check the fax menu item now and report what you see.');
})();