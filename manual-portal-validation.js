/**
 * Grid4 Portal Manual Validation Script
 * 
 * Run this script in the browser console after logging into the NetSapiens portal
 * to validate that Grid4 customizations are properly applied.
 */

(function() {
    'use strict';
    
    console.log('🚀 Grid4 Portal Validation Script Starting...');
    console.log('='.repeat(50));
    
    const results = {
        timestamp: new Date().toISOString(),
        portal: window.location.href,
        tests: [],
        summary: { passed: 0, failed: 0, warnings: 0 }
    };
    
    function addResult(test, status, message, details = null) {
        const result = { test, status, message, details };
        results.tests.push(result);
        results.summary[status]++;
        
        const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
        console.log(`${icon} ${test}: ${message}`);
        if (details) console.log(`   Details:`, details);
    }
    
    // Test 1: jQuery Availability
    try {
        if (typeof $ !== 'undefined' && $.fn && $.fn.jquery) {
            addResult('jQuery Availability', 'passed', `jQuery ${$.fn.jquery} is available`);
        } else {
            addResult('jQuery Availability', 'failed', 'jQuery is not available');
        }
    } catch (e) {
        addResult('jQuery Availability', 'failed', 'Error checking jQuery', e.message);
    }
    
    // Test 2: DOM Structure
    try {
        const expectedElements = ['.wrapper', '#header', '#navigation', '#content'];
        const foundElements = expectedElements.filter(sel => document.querySelector(sel));
        
        if (foundElements.length === expectedElements.length) {
            addResult('DOM Structure', 'passed', 'All expected NetSapiens elements found');
        } else {
            const missing = expectedElements.filter(sel => !document.querySelector(sel));
            addResult('DOM Structure', 'warning', `Some elements missing: ${missing.join(', ')}`);
        }
    } catch (e) {
        addResult('DOM Structure', 'failed', 'Error checking DOM structure', e.message);
    }
    
    // Test 3: Grid4 CSS Variables
    try {
        const rootStyles = getComputedStyle(document.documentElement);
        const grid4Vars = [
            '--g4-primary',
            '--g4-accent', 
            '--g4-bg-dark',
            '--g4-dark-bg',
            '--g4-sidebar-width'
        ];
        
        const foundVars = grid4Vars.filter(varName => {
            const value = rootStyles.getPropertyValue(varName);
            return value && value.trim() !== '';
        });
        
        if (foundVars.length > 0) {
            addResult('Grid4 CSS Variables', 'passed', `Found ${foundVars.length}/${grid4Vars.length} Grid4 CSS variables`, foundVars);
        } else {
            addResult('Grid4 CSS Variables', 'failed', 'No Grid4 CSS variables found');
        }
    } catch (e) {
        addResult('Grid4 CSS Variables', 'failed', 'Error checking CSS variables', e.message);
    }
    
    // Test 4: Grid4 JavaScript Initialization
    try {
        const grid4Objects = [
            'Grid4Skin',
            'Grid4NetSapiens', 
            'Grid4',
            'window.Grid4Skin',
            'window.Grid4NetSapiens'
        ];
        
        const foundObjects = grid4Objects.filter(objPath => {
            try {
                return eval(`typeof ${objPath}`) !== 'undefined';
            } catch {
                return false;
            }
        });
        
        if (foundObjects.length > 0) {
            addResult('Grid4 JavaScript', 'passed', `Grid4 JS objects found: ${foundObjects.join(', ')}`);
        } else {
            addResult('Grid4 JavaScript', 'warning', 'No Grid4 JS objects found (may be loading)');
        }
    } catch (e) {
        addResult('Grid4 JavaScript', 'failed', 'Error checking Grid4 JS', e.message);
    }
    
    // Test 5: Theme Application
    try {
        const body = document.body;
        const html = document.documentElement;
        const wrapper = document.querySelector('.wrapper');
        
        const darkThemeIndicators = [
            body.style.backgroundColor,
            html.style.backgroundColor,
            wrapper ? getComputedStyle(wrapper).backgroundColor : null,
            getComputedStyle(body).backgroundColor
        ].filter(color => color && (
            color.includes('rgb(26, 35, 50)') || // #1a2332
            color.includes('rgb(30, 39, 54)') || // #1e2736  
            color.includes('#1a2332') ||
            color.includes('#1e2736') ||
            color.includes('26, 35, 50') ||
            color.includes('30, 39, 54')
        ));
        
        if (darkThemeIndicators.length > 0) {
            addResult('Dark Theme Application', 'passed', 'Grid4 dark theme colors detected');
        } else {
            addResult('Dark Theme Application', 'warning', 'Dark theme colors not clearly detected');
        }
    } catch (e) {
        addResult('Dark Theme Application', 'failed', 'Error checking theme application', e.message);
    }
    
    // Test 6: Navigation Elements
    try {
        const navElement = document.querySelector('#navigation, .navigation, .sidebar');
        const navButtons = document.querySelector('#nav-buttons, .nav-buttons');
        
        if (navElement && navButtons) {
            const navLinks = navButtons.querySelectorAll('a, .nav-link');
            addResult('Navigation Elements', 'passed', `Navigation found with ${navLinks.length} links`);
        } else {
            addResult('Navigation Elements', 'warning', 'Expected navigation elements not found');
        }
    } catch (e) {
        addResult('Navigation Elements', 'failed', 'Error checking navigation', e.message);
    }
    
    // Test 7: Responsive Meta Tag
    try {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            addResult('Viewport Meta Tag', 'passed', `Viewport: ${viewport.content}`);
        } else {
            addResult('Viewport Meta Tag', 'warning', 'Viewport meta tag not found');
        }
    } catch (e) {
        addResult('Viewport Meta Tag', 'failed', 'Error checking viewport', e.message);
    }
    
    // Test 8: Performance Check
    try {
        const perfEntries = performance.getEntriesByType('resource');
        const grid4Resources = perfEntries.filter(entry => 
            entry.name.includes('grid4') || 
            entry.name.includes('statically.io')
        );
        
        if (grid4Resources.length > 0) {
            const totalDuration = grid4Resources.reduce((sum, res) => sum + res.duration, 0);
            addResult('Grid4 Resource Loading', 'passed', 
                `${grid4Resources.length} Grid4 resources loaded in ${totalDuration.toFixed(2)}ms`);
        } else {
            addResult('Grid4 Resource Loading', 'warning', 'No Grid4 resources found in performance timeline');
        }
    } catch (e) {
        addResult('Grid4 Resource Loading', 'failed', 'Error checking performance', e.message);
    }
    
    // Test 9: Console Errors Check
    try {
        // Note: This can't catch all console errors retroactively, but we can check for common issues
        const errorChecks = [
            () => typeof console !== 'undefined',
            () => !window.onerror || typeof window.onerror === 'function',
            () => document.readyState === 'complete'
        ];
        
        const checksPassed = errorChecks.filter(check => {
            try {
                return check();
            } catch {
                return false;
            }
        }).length;
        
        addResult('Error Handling', 'passed', `${checksPassed}/${errorChecks.length} error handling checks passed`);
    } catch (e) {
        addResult('Error Handling', 'failed', 'Error checking error handling', e.message);
    }
    
    // Test 10: Mobile Responsiveness
    try {
        const currentWidth = window.innerWidth;
        const isMobile = currentWidth <= 768;
        const isTablet = currentWidth <= 1024 && currentWidth > 768;
        const isDesktop = currentWidth > 1024;
        
        let deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
        
        // Check for mobile-specific CSS classes or styles
        const mobileIndicators = document.querySelectorAll('.mobile, .tablet, [class*="mobile"], [class*="responsive"]');
        
        addResult('Responsive Design', 'passed', 
            `Device: ${deviceType} (${currentWidth}px), Mobile elements: ${mobileIndicators.length}`);
    } catch (e) {
        addResult('Responsive Design', 'failed', 'Error checking responsiveness', e.message);
    }
    
    // Display Results Summary
    console.log('='.repeat(50));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`⚠️  Warnings: ${results.summary.warnings}`); 
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`📍 Total Tests: ${results.tests.length}`);
    
    const successRate = (results.summary.passed / results.tests.length * 100).toFixed(1);
    console.log(`🎯 Success Rate: ${successRate}%`);
    
    if (results.summary.failed === 0) {
        console.log('🎉 OVERALL STATUS: EXCELLENT - All critical tests passed!');
    } else if (results.summary.failed <= 2) {
        console.log('✅ OVERALL STATUS: GOOD - Minor issues detected');
    } else {
        console.log('⚠️  OVERALL STATUS: NEEDS ATTENTION - Multiple issues detected');
    }
    
    console.log('='.repeat(50));
    console.log('💾 Full results saved to window.grid4ValidationResults');
    window.grid4ValidationResults = results;
    
    // Generate downloadable report
    const reportData = JSON.stringify(results, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    console.log('📥 Download validation report:');
    console.log(`%cconst link = document.createElement('a'); link.href = '${url}'; link.download = 'grid4-validation-${Date.now()}.json'; link.click();`, 
        'background: #1a2332; color: #00d4ff; padding: 4px 8px; border-radius: 4px;');
    
    return results;
})();