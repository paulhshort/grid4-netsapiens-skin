/* Grid4 Emergency Timer Diagnostic & Fix
 * Implements Gemini's recommendation to identify and fix rogue timers
 * CRITICAL: Replaces dangerous clearInterval(1-10000) approach with surgical precision
 */

(function(window, document) {
    'use strict';

    const TimerDiagnostic = {
        _originalSetInterval: null,
        _originalClearInterval: null,
        _originalSetTimeout: null,
        _activeTimers: new Map(),
        _timerStats: {
            totalCreated: 0,
            totalCleared: 0,
            currentActive: 0,
            wrapperBackgroundTimers: [],
            suspiciousTimers: []
        },

        init: function() {
            console.log('🚨 TimerDiagnostic: Initializing emergency timer management...');
            
            // Store original functions
            this._originalSetInterval = window.setInterval;
            this._originalClearInterval = window.clearInterval;
            this._originalSetTimeout = window.setTimeout;
            
            // Replace with diagnostic versions
            this.wrapTimerFunctions();
            
            // Start monitoring
            this.startMonitoring();
            
            console.log('✅ TimerDiagnostic: Timer tracking active');
        },

        wrapTimerFunctions: function() {
            const self = this;
            
            // Wrap setInterval with diagnostics
            window.setInterval = function(callback, delay) {
                const stackTrace = new Error().stack;
                const timerId = self._originalSetInterval.call(window, callback, delay);
                
                // Track the timer
                self._activeTimers.set(timerId, {
                    type: 'interval',
                    callback: callback.toString(),
                    delay: delay,
                    created: Date.now(),
                    stackTrace: stackTrace,
                    callCount: 0
                });
                
                self._timerStats.totalCreated++;
                self._timerStats.currentActive++;
                
                // Check if this looks like a wrapper background timer
                if (self.isWrapperBackgroundTimer(callback, stackTrace)) {
                    self._timerStats.wrapperBackgroundTimers.push(timerId);
                    console.warn('🔍 TimerDiagnostic: Wrapper background timer detected:', timerId);
                }
                
                // Check for suspicious patterns
                if (delay <= 100 || self.isSuspiciousTimer(callback, stackTrace)) {
                    self._timerStats.suspiciousTimers.push(timerId);
                    console.warn('⚠️ TimerDiagnostic: Suspicious timer detected:', {
                        id: timerId,
                        delay: delay,
                        callback: callback.toString().substring(0, 100)
                    });
                }
                
                console.log('🔍 TimerDiagnostic: setInterval created:', {
                    id: timerId,
                    delay: delay,
                    source: self.getTimerSource(stackTrace)
                });
                
                return timerId;
            };
            
            // Wrap clearInterval with diagnostics  
            window.clearInterval = function(timerId) {
                if (self._activeTimers.has(timerId)) {
                    const timerInfo = self._activeTimers.get(timerId);
                    self._activeTimers.delete(timerId);
                    self._timerStats.totalCleared++;
                    self._timerStats.currentActive--;
                    
                    console.log('🧹 TimerDiagnostic: clearInterval called:', {
                        id: timerId,
                        wasActive: !!timerInfo,
                        delay: timerInfo?.delay
                    });
                }
                
                return self._originalClearInterval.call(window, timerId);
            };
            
            // Wrap setTimeout for completeness
            window.setTimeout = function(callback, delay) {
                const stackTrace = new Error().stack;
                const timerId = self._originalSetTimeout.call(window, callback, delay);
                
                // Track only long-running timeouts
                if (delay > 1000) {
                    self._activeTimers.set(timerId, {
                        type: 'timeout',
                        callback: callback.toString(),
                        delay: delay,
                        created: Date.now(),
                        stackTrace: stackTrace
                    });
                    
                    console.log('🕒 TimerDiagnostic: setTimeout created:', {
                        id: timerId,
                        delay: delay,
                        source: self.getTimerSource(stackTrace)
                    });
                }
                
                return timerId;
            };
        },

        isWrapperBackgroundTimer: function(callback, stackTrace) {
            const callbackStr = callback.toString();
            const stackStr = stackTrace;
            
            // Check for wrapper background patterns
            return (
                callbackStr.includes('wrapper') ||
                callbackStr.includes('background') ||
                callbackStr.includes('setProperty') ||
                stackStr.includes('forceWrapperBackground') ||
                stackStr.includes('grid4-custom')
            );
        },

        isSuspiciousTimer: function(callback, stackTrace) {
            const callbackStr = callback.toString();
            
            // Check for suspicious patterns
            return (
                callbackStr.includes('style.') ||
                callbackStr.includes('backgroundColor') ||
                callbackStr.includes('setProperty') ||
                callbackStr.length > 500 // Very large callbacks
            );
        },

        getTimerSource: function(stackTrace) {
            const lines = stackTrace.split('\n');
            for (let i = 1; i < Math.min(lines.length, 5); i++) {
                const line = lines[i].trim();
                if (line.includes('.js') && !line.includes('timer-fix')) {
                    return line;
                }
            }
            return 'Unknown source';
        },

        startMonitoring: function() {
            // Monitor timer health every 10 seconds
            this._originalSetInterval(() => {
                this.reportTimerHealth();
                this.cleanupSuspiciousTimers();
            }, 10000);
        },

        reportTimerHealth: function() {
            const stats = this._timerStats;
            
            console.log('📊 TimerDiagnostic: Health Report:', {
                totalCreated: stats.totalCreated,
                totalCleared: stats.totalCleared,
                currentActive: stats.currentActive,
                wrapperTimers: stats.wrapperBackgroundTimers.length,
                suspiciousTimers: stats.suspiciousTimers.length
            });
            
            // Alert if too many timers
            if (stats.currentActive > 20) {
                console.warn('⚠️ TimerDiagnostic: High timer count detected:', stats.currentActive);
            }
            
            // Alert if wrapper timers are active
            if (stats.wrapperBackgroundTimers.length > 0) {
                console.warn('🔴 TimerDiagnostic: Wrapper background timers still active:', stats.wrapperBackgroundTimers);
            }
        },

        cleanupSuspiciousTimers: function() {
            // Only clear wrapper background timers that are causing issues
            this._timerStats.wrapperBackgroundTimers.forEach(timerId => {
                const timerInfo = this._activeTimers.get(timerId);
                if (timerInfo && timerInfo.delay <= 2000) {
                    console.warn('🧹 TimerDiagnostic: Clearing problematic wrapper timer:', timerId);
                    this._originalClearInterval(timerId);
                    this._activeTimers.delete(timerId);
                    this._timerStats.currentActive--;
                }
            });
            
            // Clear the list after cleanup
            this._timerStats.wrapperBackgroundTimers = [];
        },

        // Emergency method to clear all Grid4 timers
        emergencyCleanup: function() {
            console.warn('🚨 TimerDiagnostic: EMERGENCY CLEANUP INITIATED');
            
            let clearedCount = 0;
            this._activeTimers.forEach((timerInfo, timerId) => {
                if (timerInfo.stackTrace.includes('grid4') || 
                    timerInfo.callback.includes('wrapper') ||
                    timerInfo.callback.includes('Grid4')) {
                    
                    this._originalClearInterval(timerId);
                    this._activeTimers.delete(timerId);
                    clearedCount++;
                }
            });
            
            console.log(`🧹 TimerDiagnostic: Emergency cleanup cleared ${clearedCount} Grid4 timers`);
            this._timerStats.currentActive -= clearedCount;
        },

        // Public API for debugging
        getActiveTimers: function() {
            return Array.from(this._activeTimers.entries()).map(([id, info]) => ({
                id: id,
                type: info.type,
                delay: info.delay,
                age: Date.now() - info.created,
                callback: info.callback.substring(0, 100),
                source: this.getTimerSource(info.stackTrace)
            }));
        },

        getStats: function() {
            return { ...this._timerStats };
        }
    };

    // Auto-initialize immediately
    TimerDiagnostic.init();

    // Expose globally for debugging
    window.TimerDiagnostic = TimerDiagnostic;
    
    if (window.g4c) {
        window.g4c.TimerDiagnostic = TimerDiagnostic;
    }

    console.log('📦 TimerDiagnostic loaded - Emergency timer management active');

})(window, document);