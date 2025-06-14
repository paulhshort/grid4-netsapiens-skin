/* Grid4 Vertical Centering Fix - Adaptive Enhancement Module
 * Solves cross-browser/cross-system navigation centering inconsistencies
 * First implementation of the Portal Context Manager enhancement pattern
 * Self-validating with closed-loop feedback system
 */

(function(window, document, $) {
    'use strict';

    const VerticalCenteringFix = {
        _isApplied: false,
        _retryCount: 0,
        _maxRetries: 3,

        // CSS fixes for different scenarios
        CENTERING_FIXES: {
            // Standard flexbox centering
            flexbox: `
                #navigation {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    min-height: 100vh !important;
                }
                #nav-buttons {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    width: 100% !important;
                }
            `,

            // CSS Grid centering (fallback)
            grid: `
                #navigation {
                    display: grid !important;
                    grid-template-rows: 1fr auto 1fr !important;
                    min-height: 100vh !important;
                    align-content: center !important;
                }
                #nav-buttons {
                    grid-row: 2 !important;
                }
            `,

            // Transform-based centering (legacy browsers)
            transform: `
                #navigation {
                    position: relative !important;
                    min-height: 100vh !important;
                }
                #nav-buttons {
                    position: absolute !important;
                    top: 50% !important;
                    left: 0 !important;
                    right: 0 !important;
                    transform: translateY(-50%) !important;
                }
            `,

            // Table-cell centering (ultimate fallback)
            table: `
                #navigation {
                    display: table-cell !important;
                    vertical-align: middle !important;
                    min-height: 100vh !important;
                    width: 220px !important;
                }
                #nav-buttons {
                    display: block !important;
                }
            `
        },

        init: function() {
            console.log('🎯 VerticalCenteringFix: Initializing adaptive enhancement module...');

            // Wait for Portal Context Manager to be ready
            $(document).on('portalManagerReady', (event, portalManager) => {
                this.handlePortalManagerReady(portalManager);
            });

            // If Portal Context Manager is already ready, proceed immediately
            if (window.PortalContextManager && window.PortalContextManager._isReady) {
                this.handlePortalManagerReady(window.PortalContextManager);
            }
        },

        handlePortalManagerReady: function(portalManager) {
            console.log('🎯 VerticalCenteringFix: Portal Context Manager ready, checking navigation centering...');

            // Check if navigation is properly centered
            const isCentered = portalManager.getLayoutFlag('isNavVerticallyCentered');
            
            if (isCentered) {
                console.log('✅ VerticalCenteringFix: Navigation is already properly centered');
                return;
            }

            console.log('❌ VerticalCenteringFix: Navigation centering issue detected, applying fix...');
            this.applyFix(portalManager);
        },

        applyFix: function(portalManager) {
            // Try different centering methods in order of preference
            const methods = ['flexbox', 'grid', 'transform', 'table'];
            
            for (const method of methods) {
                if (this.tryMethod(method, portalManager)) {
                    console.log(`✅ VerticalCenteringFix: Successfully applied ${method} centering method`);
                    this._isApplied = true;
                    return;
                }
            }

            console.warn('⚠️ VerticalCenteringFix: All centering methods failed');
        },

        tryMethod: function(method, portalManager) {
            try {
                console.log(`🔧 VerticalCenteringFix: Trying ${method} centering method...`);

                // Apply the CSS fix
                this.injectCSS(method, this.CENTERING_FIXES[method]);

                // Wait a moment for layout to settle
                setTimeout(() => {
                    this.validateFix(method, portalManager);
                }, 100);

                return true; // Method was applied, validation will happen async
            } catch (error) {
                console.error(`❌ VerticalCenteringFix: Error applying ${method} method:`, error);
                return false;
            }
        },

        injectCSS: function(method, css) {
            // Remove any existing centering fix
            const existingStyle = document.getElementById('g4-vertical-centering-fix');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Create new style element
            const style = document.createElement('style');
            style.id = 'g4-vertical-centering-fix';
            style.setAttribute('data-method', method);
            style.textContent = `
                /* Grid4 Vertical Centering Fix - ${method} method */
                ${css}
                
                /* Additional responsive adjustments */
                @media (max-width: 768px) {
                    #navigation {
                        min-height: auto !important;
                        position: static !important;
                    }
                    #nav-buttons {
                        position: static !important;
                        transform: none !important;
                    }
                }
            `;

            document.head.appendChild(style);
            console.log(`🎨 VerticalCenteringFix: Applied ${method} CSS fix`);
        },

        validateFix: function(method, portalManager) {
            console.log(`🔬 VerticalCenteringFix: Validating ${method} fix...`);

            // Re-run the centering probe
            const isNowCentered = portalManager.revalidateProbe('isNavVerticallyCentered');

            if (isNowCentered) {
                console.log(`🎉 VerticalCenteringFix: ${method} method successful! Navigation is now centered.`);
                this._isApplied = true;
                this._retryCount = 0;
                
                // Show success notification if toast system is available
                this.showNotification(`Navigation centering fixed using ${method} method`, 'success');
                
                return true;
            } else {
                console.warn(`⚠️ VerticalCenteringFix: ${method} method failed validation`);
                
                // Retry with next method if we haven't exceeded retry limit
                if (this._retryCount < this._maxRetries) {
                    this._retryCount++;
                    console.log(`🔄 VerticalCenteringFix: Retrying with different method (attempt ${this._retryCount}/${this._maxRetries})`);
                    
                    // Remove failed CSS and try next method
                    const failedStyle = document.getElementById('g4-vertical-centering-fix');
                    if (failedStyle) {
                        failedStyle.remove();
                    }
                    
                    return false; // Will trigger next method
                } else {
                    console.error('❌ VerticalCenteringFix: All retry attempts exhausted');
                    this.showNotification('Navigation centering fix failed after multiple attempts', 'error');
                    return false;
                }
            }
        },

        showNotification: function(message, type) {
            try {
                // Try Grid4 toast system first
                if (window.toast && window.toast[type]) {
                    window.toast[type](message, { duration: 5000 });
                    return;
                }

                // Try command palette toast system
                if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                    window.G4CommandPalette.showToast(message, type);
                    return;
                }

                // Fallback to console
                console.log(`${type.toUpperCase()}: ${message}`);
            } catch (error) {
                console.warn('VerticalCenteringFix: Error showing notification:', error);
            }
        },

        // Public API for manual testing
        forceReapply: function() {
            console.log('🔄 VerticalCenteringFix: Force reapplying fix...');
            this._isApplied = false;
            this._retryCount = 0;
            
            if (window.PortalContextManager && window.PortalContextManager._isReady) {
                this.handlePortalManagerReady(window.PortalContextManager);
            } else {
                console.warn('⚠️ VerticalCenteringFix: Portal Context Manager not ready');
            }
        },

        // Get current status for debugging
        getStatus: function() {
            const appliedMethod = document.getElementById('g4-vertical-centering-fix')?.getAttribute('data-method');
            
            return {
                isApplied: this._isApplied,
                appliedMethod: appliedMethod || null,
                retryCount: this._retryCount,
                portalManagerReady: window.PortalContextManager?._isReady || false,
                navigationElements: {
                    navigation: !!document.getElementById('navigation'),
                    navButtons: !!document.getElementById('nav-buttons')
                }
            };
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        VerticalCenteringFix.init();
    });

    // Expose globally for debugging and manual control
    window.VerticalCenteringFix = VerticalCenteringFix;
    
    // Also expose on Grid4 namespace if available
    if (window.g4c) {
        window.g4c.VerticalCenteringFix = VerticalCenteringFix;
    }

    console.log('📦 VerticalCenteringFix module loaded - First adaptive enhancement ready');

})(window, document, jQuery);