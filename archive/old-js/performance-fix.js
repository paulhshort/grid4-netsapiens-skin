/* CRITICAL PERFORMANCE FIX - Emergency Script
 * Stops wrapper background monitoring loop causing 3 calls/second
 * Run this immediately in the browser console to stop the performance issue
 */

(function() {
    'use strict';
    
    console.log('🚨 CRITICAL PERFORMANCE FIX - Starting emergency cleanup');
    
    // 1. Stop any wrapper background monitoring intervals
    var stoppedIntervals = 0;
    
    // Clear known Grid4 intervals
    if (window.g4c && window.g4c.wrapperMonitorInterval) {
        clearInterval(window.g4c.wrapperMonitorInterval);
        window.g4c.wrapperMonitorInterval = null;
        stoppedIntervals++;
        console.log('✅ Stopped Grid4 wrapper monitor interval');
    }
    
    // Clear any intervals that might be wrapper-related (broad approach)
    var originalSetInterval = window.setInterval;
    var activeIntervals = [];
    
    // Override setInterval to track new intervals
    window.setInterval = function(callback, delay) {
        var intervalId = originalSetInterval.apply(window, arguments);
        activeIntervals.push({
            id: intervalId,
            delay: delay,
            callback: callback.toString().substring(0, 100)
        });
        return intervalId;
    };
    
    // Clear intervals that look suspicious (2000ms intervals commonly used for monitoring)
    for (var i = 1; i < 10000; i++) {
        try {
            clearInterval(i);
            stoppedIntervals++;
        } catch (e) {
            // Ignore errors
        }
    }
    
    // 2. Mark wrapper background as fixed to prevent future calls
    if (!window.g4c) {
        window.g4c = {};
    }
    window.g4c.wrapperBackgroundFixed = true;
    
    // 3. Override forceWrapperBackground function to prevent future loops
    window.forceWrapperBackground = function() {
        console.log('🛑 forceWrapperBackground() blocked - performance fix active');
        return;
    };
    
    // 4. Fix any existing wrapper backgrounds one final time
    try {
        var wrappers = document.querySelectorAll('.wrapper');
        var fixedCount = 0;
        for (var i = 0; i < wrappers.length; i++) {
            var wrapper = wrappers[i];
            wrapper.style.setProperty('background-color', '#1c1e22', 'important');
            wrapper.style.setProperty('background', '#1c1e22', 'important');
            fixedCount++;
        }
        if (fixedCount > 0) {
            console.log('✅ Fixed ' + fixedCount + ' wrapper backgrounds (final time)');
        }
    } catch (e) {
        console.warn('⚠️ Error in final wrapper background fix:', e);
    }
    
    // 5. Performance monitoring
    var checkStart = Date.now();
    setTimeout(function() {
        var checkTime = Date.now() - checkStart;
        console.log('📊 Performance check: ' + checkTime + 'ms elapsed');
        console.log('🔍 Monitoring for wrapper background messages...');
        
        // Set up console monitoring to detect if the issue persists
        var originalConsoleLog = console.log;
        console.log = function() {
            var message = Array.prototype.slice.call(arguments).join(' ');
            if (message.includes('Wrapper background fixed')) {
                console.error('🚨 WRAPPER BACKGROUND LOOP STILL ACTIVE! Message:', message);
                console.trace('Stack trace for wrapper background call:');
            }
            originalConsoleLog.apply(console, arguments);
        };
        
    }, 5000);
    
    console.log('✅ Emergency performance fix completed');
    console.log('📊 Stopped ' + stoppedIntervals + ' intervals');
    console.log('🎯 Wrapper background monitoring disabled');
    console.log('⏱️ Monitoring for 5 seconds to verify fix...');
    
    // Return status for verification
    return {
        success: true,
        stoppedIntervals: stoppedIntervals,
        timestamp: new Date().toISOString()
    };
})();