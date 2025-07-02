/* Grid4 Modal Positioning Fix v1.0 */
/* This file specifically addresses modal centering issues in NetSapiens portal */

(function(window, $) {
    'use strict';
    
    // Wait for jQuery and NetSapiens to be ready
    function waitForDependencies(callback) {
        if (typeof $ !== 'undefined' && typeof modalResize !== 'undefined') {
            callback();
        } else {
            setTimeout(function() {
                waitForDependencies(callback);
            }, 100);
        }
    }
    
    waitForDependencies(function() {
        console.log('Grid4 Modal Fix: Initializing modal positioning override');
        
        // Store original modalResize function
        var originalModalResize = window.modalResize;
        
        // Override modalResize to prevent inline margin styles
        window.modalResize = function(modal, trace) {
            console.log('Grid4 Modal Fix: Intercepting modalResize');
            
            // Call original function to maintain functionality
            originalModalResize.apply(this, arguments);
            
            // Remove the inline margin styles that break centering
            modal.css({
                marginTop: '',
                marginLeft: ''
            });
            
            // Add our positioning class
            modal.addClass('grid4-modal-centered');
            
            // Ensure modal is visible and properly positioned
            modal.css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90vw',
                maxHeight: '90vh'
            });
            
            // Fix z-index if needed
            if (modal.css('z-index') < 1050) {
                modal.css('z-index', 1050);
            }
        };
        
        // Override modal show events to ensure proper positioning
        $(document).off('show.modal').on('show.modal', '.modal', function(e) {
            if ($(e.target).hasClass("modal")) {
                var $modal = $(this);
                console.log('Grid4 Modal Fix: Modal show event');
                
                // Ensure modal backdrop has proper z-index
                $('.modal-backdrop').css('z-index', 1040);
                
                // Apply our centering immediately
                $modal.css({
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    marginTop: '',
                    marginLeft: ''
                });
            }
        });
        
        // Fix modals after they're shown
        $(document).off('shown.modal').on('shown.modal', '.modal', function(e) {
            if ($(e.target).hasClass("modal")) {
                var $modal = $(this);
                console.log('Grid4 Modal Fix: Modal shown event');
                
                // Final positioning adjustment
                setTimeout(function() {
                    $modal.css({
                        marginTop: '',
                        marginLeft: '',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    });
                }, 10);
            }
        });
        
        // Monitor for dynamically loaded modals
        var modalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    $(mutation.addedNodes).each(function() {
                        var $node = $(this);
                        if ($node.hasClass('modal') || $node.find('.modal').length > 0) {
                            console.log('Grid4 Modal Fix: New modal detected');
                            
                            // Apply fix to new modals
                            setTimeout(function() {
                                $('.modal:visible').each(function() {
                                    var $modal = $(this);
                                    $modal.css({
                                        marginTop: '',
                                        marginLeft: '',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    });
                                });
                            }, 100);
                        }
                    });
                }
            });
        });
        
        // Start observing for new modals
        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Fix for Bootstrap modal positioning
        if ($.fn.modal && $.fn.modal.Constructor) {
            var originalShow = $.fn.modal.Constructor.prototype.show;
            $.fn.modal.Constructor.prototype.show = function() {
                originalShow.apply(this, arguments);
                
                var $modal = this.$element;
                setTimeout(function() {
                    $modal.css({
                        marginTop: '',
                        marginLeft: '',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    });
                }, 10);
            };
        }
        
        console.log('Grid4 Modal Fix: Override complete');
    });
    
})(window, window.jQuery || window.$);