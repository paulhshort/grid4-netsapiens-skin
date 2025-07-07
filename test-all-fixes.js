// Comprehensive test for all Grid4 NetSapiens skin fixes
// Tests: Modal transparency, fax icon, dropdown animations

(function() {
    console.log('=== GRID4 COMPREHENSIVE TEST SUITE ===');
    
    // Test 1: Check if fax icon appears
    function testFaxIcon() {
        console.log('\n--- TEST 1: Fax Icon ---');
        const faxLinks = $('#nav-buttons li a').filter(function() {
            return $(this).text().trim().toLowerCase() === 'fax';
        });
        
        if (faxLinks.length === 0) {
            console.log('❌ No Fax menu item found');
            return false;
        }
        
        const hasFaxIcon = faxLinks.find('.fa-fax').length > 0;
        const hasNavText = faxLinks.find('.nav-text').length > 0;
        
        console.log(`Fax menu items found: ${faxLinks.length}`);
        console.log(`Has .nav-text span: ${hasNavText ? '✅' : '❌'}`);
        console.log(`Has fa-fax icon: ${hasFaxIcon ? '✅' : '❌'}`);
        
        return hasFaxIcon;
    }
    
    // Test 2: Check modal transparency
    function testModalTransparency() {
        console.log('\n--- TEST 2: Modal Transparency ---');
        const $modal = $('.modal.in .modal-content');
        
        if ($modal.length === 0) {
            console.log('⚠️  No open modals to test');
            return null;
        }
        
        const computedStyle = window.getComputedStyle($modal[0]);
        const backgroundColor = computedStyle.backgroundColor;
        const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;
        const opacity = computedStyle.opacity;
        
        console.log(`Background color: ${backgroundColor}`);
        console.log(`Backdrop filter: ${backdropFilter}`);
        console.log(`Opacity: ${opacity}`);
        
        // Check for transparency issues
        const hasTransparency = backgroundColor.includes('rgba') && !backgroundColor.includes(', 1)');
        const hasBackdropFilter = backdropFilter && backdropFilter !== 'none';
        
        console.log(`Has transparent background: ${hasTransparency ? '❌' : '✅'}`);
        console.log(`Has backdrop filter: ${hasBackdropFilter ? '❌' : '✅'}`);
        
        return !hasTransparency && !hasBackdropFilter;
    }
    
    // Test 3: Check modal dark mode
    function testModalDarkMode() {
        console.log('\n--- TEST 3: Modal Dark Mode ---');
        const isDarkMode = $('#grid4-app-shell').hasClass('theme-dark');
        
        if (!isDarkMode) {
            console.log('⚠️  Not in dark mode, skipping test');
            return null;
        }
        
        const $modalFooter = $('.modal.in .modal-footer');
        if ($modalFooter.length === 0) {
            console.log('⚠️  No modal footer found');
            return null;
        }
        
        const footerBg = $modalFooter.css('background-color');
        const footerBgComputed = window.getComputedStyle($modalFooter[0]).backgroundColor;
        
        console.log(`Footer background (jQuery): ${footerBg}`);
        console.log(`Footer background (computed): ${footerBgComputed}`);
        
        // Check if it's a dark color
        const rgb = footerBgComputed.match(/\d+/g);
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            console.log(`Background brightness: ${brightness} (lower = darker)`);
            return brightness < 128; // Dark color
        }
        
        return false;
    }
    
    // Test 4: Admin tools removal
    function testAdminToolsRemoved() {
        console.log('\n--- TEST 4: Admin Tools Removal ---');
        const adminDropdown = $('#grid4-admin-dropdown');
        const adminToolsExists = adminDropdown.length > 0;
        
        console.log(`Admin tools dropdown exists: ${adminToolsExists ? '❌' : '✅'}`);
        return !adminToolsExists;
    }
    
    // Test 5: Dropdown animations
    function testDropdownAnimations() {
        console.log('\n--- TEST 5: Dropdown Animations ---');
        const $dropdown = $('.dropdown-menu:first');
        
        if ($dropdown.length === 0) {
            console.log('⚠️  No dropdown menus found');
            return null;
        }
        
        const computedStyle = window.getComputedStyle($dropdown[0]);
        const transition = computedStyle.transition;
        const visibility = computedStyle.visibility;
        
        console.log(`Dropdown transition: ${transition}`);
        console.log(`Dropdown visibility: ${visibility}`);
        
        return transition.includes('all') || transition.includes('0.2s');
    }
    
    // Test 6: Check all navigation icons
    function testAllNavigationIcons() {
        console.log('\n--- TEST 6: All Navigation Icons ---');
        let iconCount = 0;
        let missingIcons = [];
        
        $('#nav-buttons li a').each(function() {
            const $link = $(this);
            const text = $link.find('.nav-text').text().trim() || $link.text().trim();
            const hasIcon = $link.find('.fa').length > 0;
            
            if (hasIcon) {
                iconCount++;
                const iconClass = $link.find('.fa').attr('class');
                console.log(`✅ ${text}: ${iconClass}`);
            } else if (text) {
                missingIcons.push(text);
                console.log(`❌ ${text}: No icon`);
            }
        });
        
        console.log(`\nTotal icons: ${iconCount}`);
        console.log(`Missing icons: ${missingIcons.length}`);
        
        return { iconCount, missingIcons };
    }
    
    // Run all tests
    function runAllTests() {
        console.log('\n=== RUNNING ALL TESTS ===');
        console.log(`Current theme: ${$('#grid4-app-shell').attr('class')}`);
        console.log(`Page URL: ${window.location.href}`);
        
        const results = {
            faxIcon: testFaxIcon(),
            modalTransparency: testModalTransparency(),
            modalDarkMode: testModalDarkMode(),
            adminToolsRemoved: testAdminToolsRemoved(),
            dropdownAnimations: testDropdownAnimations(),
            navigationIcons: testAllNavigationIcons()
        };
        
        console.log('\n=== TEST SUMMARY ===');
        console.log(`Fax Icon: ${results.faxIcon ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Modal Transparency: ${results.modalTransparency === null ? '⚠️  SKIP' : results.modalTransparency ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Modal Dark Mode: ${results.modalDarkMode === null ? '⚠️  SKIP' : results.modalDarkMode ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Admin Tools Removed: ${results.adminToolsRemoved ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Dropdown Animations: ${results.dropdownAnimations === null ? '⚠️  SKIP' : results.dropdownAnimations ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Navigation Icons: ${results.navigationIcons.iconCount} icons found, ${results.navigationIcons.missingIcons.length} missing`);
        
        return results;
    }
    
    // Helper function to trigger a modal for testing
    window.grid4TestModal = function() {
        // Try to find and click a button that opens a modal
        const modalTriggers = $('a[data-toggle="modal"], button[data-toggle="modal"], .btn[href*="#"][href*="modal"]');
        if (modalTriggers.length > 0) {
            console.log(`Found ${modalTriggers.length} modal triggers`);
            modalTriggers.first().click();
            setTimeout(() => {
                testModalTransparency();
                testModalDarkMode();
            }, 500);
        } else {
            console.log('No modal triggers found on this page');
        }
    };
    
    // Export test functions
    window.grid4Tests = {
        runAll: runAllTests,
        testFaxIcon: testFaxIcon,
        testModal: grid4TestModal,
        testModalTransparency: testModalTransparency,
        testModalDarkMode: testModalDarkMode,
        testAdminTools: testAdminToolsRemoved,
        testDropdowns: testDropdownAnimations,
        testNavIcons: testAllNavigationIcons
    };
    
    // Auto-run tests after page load
    setTimeout(runAllTests, 2000);
    
    console.log('\n💡 TIP: Use window.grid4Tests to run individual tests');
    console.log('💡 TIP: Use window.grid4TestModal() to trigger a modal for testing');
})();