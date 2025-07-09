/**
 * Grid4 Communications - BasicJS Deployment Verification Script
 * 
 * This script verifies that the basicJS libraries are loaded and functional
 * Run this in the browser console after deployment to validate integration
 */

(function() {
    'use strict';
    
    console.log('🔍 Grid4 BasicJS Deployment Verification Starting...');
    
    const results = {
        libraries: {},
        errors: [],
        warnings: [],
        success: true
    };
    
    // Test Socket.IO availability
    function testSocketIO() {
        try {
            if (typeof io !== 'undefined') {
                results.libraries.socketIO = {
                    status: '✅ Available',
                    version: io.version || 'Unknown',
                    type: typeof io
                };
                console.log('✅ Socket.IO detected:', io.version);
            } else {
                results.libraries.socketIO = {
                    status: '❌ Not Found',
                    error: 'io object not available'
                };
                results.errors.push('Socket.IO not loaded');
                results.success = false;
            }
        } catch (e) {
            results.libraries.socketIO = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('Socket.IO test failed: ' + e.message);
        }
    }
    
    // Test jQuery UI availability
    function testjQueryUI() {
        try {
            if (typeof $ !== 'undefined' && $.ui) {
                results.libraries.jQueryUI = {
                    status: '✅ Available',
                    version: $.ui.version || 'Unknown',
                    widgets: Object.keys($.ui).length
                };
                console.log('✅ jQuery UI detected:', $.ui.version);
            } else if (typeof $ !== 'undefined') {
                results.libraries.jQueryUI = {
                    status: '⚠️ jQuery available but UI missing',
                    jQueryVersion: $.fn.jquery
                };
                results.warnings.push('jQuery found but jQuery UI not detected');
            } else {
                results.libraries.jQueryUI = {
                    status: '❌ Not Found',
                    error: 'jQuery not available'
                };
                results.errors.push('jQuery/jQuery UI not loaded');
            }
        } catch (e) {
            results.libraries.jQueryUI = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('jQuery UI test failed: ' + e.message);
        }
    }
    
    // Test Date.js extensions
    function testDateJS() {
        try {
            if (typeof Date.prototype.addDays === 'function') {
                results.libraries.dateJS = {
                    status: '✅ Available',
                    methods: ['addDays', 'addMonths', 'addYears'].filter(m => 
                        typeof Date.prototype[m] === 'function'
                    ).length
                };
                console.log('✅ Date.js extensions detected');
            } else {
                results.libraries.dateJS = {
                    status: '❌ Not Found',
                    error: 'Date extensions not available'
                };
                results.warnings.push('Date.js extensions not detected');
            }
        } catch (e) {
            results.libraries.dateJS = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('Date.js test failed: ' + e.message);
        }
    }
    
    // Test MD5 function
    function testMD5() {
        try {
            if (typeof md5 === 'function') {
                const testHash = md5('test');
                if (testHash === '098f6bcd4621d373cade4e832627b4f6') {
                    results.libraries.md5 = {
                        status: '✅ Available',
                        test: 'Passed'
                    };
                    console.log('✅ MD5 function working correctly');
                } else {
                    results.libraries.md5 = {
                        status: '⚠️ Available but incorrect output',
                        expected: '098f6bcd4621d373cade4e832627b4f6',
                        actual: testHash
                    };
                    results.warnings.push('MD5 function produces unexpected output');
                }
            } else {
                results.libraries.md5 = {
                    status: '❌ Not Found',
                    error: 'md5 function not available'
                };
                results.warnings.push('MD5 function not detected');
            }
        } catch (e) {
            results.libraries.md5 = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('MD5 test failed: ' + e.message);
        }
    }
    
    // Test ICU internationalization
    function testICU() {
        try {
            if (typeof window.icu === 'object' && window.icu.getLocale) {
                results.libraries.icu = {
                    status: '✅ Available',
                    locale: window.icu.getLocale(),
                    language: window.icu.getLanguage()
                };
                console.log('✅ ICU internationalization detected');
            } else {
                results.libraries.icu = {
                    status: '❌ Not Found',
                    error: 'ICU object not available'
                };
                results.warnings.push('ICU internationalization not detected');
            }
        } catch (e) {
            results.libraries.icu = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('ICU test failed: ' + e.message);
        }
    }
    
    // Test translation function
    function testTranslation() {
        try {
            if (typeof window._ === 'function') {
                results.libraries.translation = {
                    status: '✅ Available',
                    type: typeof window._
                };
                console.log('✅ Translation function detected');
            } else {
                results.libraries.translation = {
                    status: '❌ Not Found',
                    error: 'Translation function not available'
                };
                results.warnings.push('Translation function not detected');
            }
        } catch (e) {
            results.libraries.translation = {
                status: '❌ Error',
                error: e.message
            };
            results.errors.push('Translation test failed: ' + e.message);
        }
    }
    
    // Check for JavaScript errors
    function checkConsoleErrors() {
        // This is a basic check - in practice, you'd want to monitor console.error
        const errorCount = results.errors.length;
        const warningCount = results.warnings.length;
        
        console.log(`📊 Verification Summary:`);
        console.log(`   Libraries tested: ${Object.keys(results.libraries).length}`);
        console.log(`   Errors: ${errorCount}`);
        console.log(`   Warnings: ${warningCount}`);
        
        if (errorCount === 0 && warningCount === 0) {
            console.log('🎉 All tests passed! BasicJS deployment successful.');
        } else if (errorCount === 0) {
            console.log('⚠️ Deployment successful with warnings. Check details above.');
        } else {
            console.log('❌ Deployment has errors. Check details above.');
            results.success = false;
        }
    }
    
    // Run all tests
    function runVerification() {
        console.log('Testing Socket.IO...');
        testSocketIO();
        
        console.log('Testing jQuery UI...');
        testjQueryUI();
        
        console.log('Testing Date.js...');
        testDateJS();
        
        console.log('Testing MD5...');
        testMD5();
        
        console.log('Testing ICU...');
        testICU();
        
        console.log('Testing Translation...');
        testTranslation();
        
        checkConsoleErrors();
        
        // Return results for programmatic access
        return results;
    }
    
    // Auto-run verification
    const verificationResults = runVerification();
    
    // Make results available globally
    window.Grid4BasicJSVerification = verificationResults;
    
    console.log('🔍 Verification complete. Results available in window.Grid4BasicJSVerification');
    
})();

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Deploy the grid4-enhanced-basicjs.js file
 * 2. Update NetSapiens PORTAL_EXTRA_JS configuration
 * 3. Load your portal in a browser
 * 4. Open browser console (F12)
 * 5. Paste this entire script and press Enter
 * 6. Review the verification results
 * 
 * EXPECTED OUTPUT:
 * - ✅ Socket.IO detected
 * - ✅ jQuery UI detected  
 * - ✅ Date.js extensions detected
 * - ✅ MD5 function working correctly
 * - ✅ ICU internationalization detected
 * - ✅ Translation function detected
 * - 🎉 All tests passed! BasicJS deployment successful.
 */
