/**
 * Grid4 NetSapiens Portal - Comprehensive Modal Fix JavaScript
 * Version: 1.0.0
 * Date: 2025-01-02
 * 
 * This JavaScript file addresses modal functionality issues including:
 * - Overriding modalResize to prevent inline style conflicts
 * - Preserving theme classes during AJAX loads
 * - Fixing body scroll lock implementation
 * - Making loading spinners theme-aware
 * - Preventing JavaScript from breaking CSS positioning
 */

(function() {
    'use strict';
    
    // Wait for jQuery and DOM to be ready
    var checkJQuery = setInterval(function() {
        if (typeof jQuery !== 'undefined' && jQuery.fn.jquery) {
            clearInterval(checkJQuery);
            initializeModalFixes();
        }
    }, 100);
    
    function initializeModalFixes() {
        console.log('[Grid4 Modal Fix] Initializing comprehensive modal fixes');
        
        // Store original functions
        var originalModalResize = window.modalResize;
        var originalLoadModal = window.loadModal;
        var originalHideModal = window.hideModal;
        
        /**
         * Override modalResize to prevent inline style conflicts
         * This function is called multiple times during modal lifecycle
         */
        if (typeof modalResize !== 'undefined') {
            window.modalResize = function(modal, trace) {
                // Call original function for core functionality
                if (originalModalResize) {
                    originalModalResize.call(this, modal, trace);
                }
                
                // Remove inline styles that break our CSS positioning
                if (modal && modal.length) {
                    modal.css({
                        'margin-top': '',
                        'margin-left': '',
                        'margin-right': '',
                        'margin-bottom': ''
                    });
                    
                    // Add our positioning class
                    modal.addClass('grid4-modal-positioned');
                    
                    // Use CSS custom property for max-height instead of inline style
                    var modalBody = modal.find('.modal-body');
                    if (modalBody.length) {
                        var windowHeight = $(window).height();
                        var headerHeight = modal.find('.modal-header').outerHeight() || 50;
                        var footerHeight = modal.find('.modal-footer').outerHeight() || 70;
                        var maxHeight = windowHeight - headerHeight - footerHeight - 100; // 100px for margins
                        
                        // Set CSS variable instead of inline style
                        modal[0].style.setProperty('--modal-max-height', maxHeight + 'px');
                        modalBody.css('max-height', ''); // Remove inline max-height
                    }
                }
            };
        }
        
        /**
         * Override loadModal to preserve theme classes
         */
        if (typeof loadModal !== 'undefined') {
            window.loadModal = function(modalId, path) {
                var modalObj = $(modalId);
                
                // Preserve theme-related classes
                var preservedClasses = [];
                if (modalObj.length) {
                    var classList = modalObj.attr('class') || '';
                    // Preserve grid4 theme classes and modal state classes
                    var classesToPreserve = classList.match(/grid4-[\w-]+|modal-[\w-]+|theme-[\w-]+/g) || [];
                    preservedClasses = classesToPreserve;
                }
                
                // Call original function
                var result = originalLoadModal.call(this, modalId, path);
                
                // Restore preserved classes after a delay (to ensure content is loaded)
                setTimeout(function() {
                    if (modalObj.length && preservedClasses.length) {
                        preservedClasses.forEach(function(className) {
                            if (!modalObj.hasClass(className)) {
                                modalObj.addClass(className);
                            }
                        });
                    }
                }, 100);
                
                return result;
            };
        }
        
        /**
         * Fix body scroll lock implementation
         */
        $(document).on('show.bs.modal show.modal', '.modal', function(e) {
            var scrollTop = $(window).scrollTop();
            
            // Use class-based approach instead of inline styles
            $('body').addClass('grid4-modal-open')
                     .attr('data-scroll-position', scrollTop);
            
            // Ensure modal has proper theme classes
            var $modal = $(this);
            if (!$modal.hasClass('grid4-modal-styled')) {
                $modal.addClass('grid4-modal-styled');
            }
        });
        
        $(document).on('hidden.bs.modal hidden.modal', '.modal', function(e) {
            // Restore scroll position
            var scrollPosition = $('body').attr('data-scroll-position');
            
            $('body').removeClass('grid4-modal-open')
                     .removeAttr('data-scroll-position');
            
            if (scrollPosition) {
                $(window).scrollTop(parseInt(scrollPosition, 10));
            }
        });
        
        /**
         * Fix loading spinner HTML to be theme-aware
         */
        function patchLoadingSpinner() {
            // Override the loading HTML if it's defined globally
            if (window.loadingHtml) {
                window.loadingHtml = '<div class="loading-container grid4-modal-loading">' +
                    '<div class="loading-spinner la-ball-spin-clockwise">' +
                    '<div></div><div></div><div></div><div></div>' +
                    '<div></div><div></div><div></div><div></div>' +
                    '</div>' +
                    '</div>';
            }
            
            // Patch any function that creates loading spinners
            var originalAjax = $.ajax;
            $.ajax = function(options) {
                if (options && options.beforeSend) {
                    var originalBeforeSend = options.beforeSend;
                    options.beforeSend = function(xhr, settings) {
                        // Call original
                        var result = originalBeforeSend.call(this, xhr, settings);
                        
                        // Fix any loading containers that were just created
                        $('.loading-container').each(function() {
                            var $container = $(this);
                            if (!$container.hasClass('grid4-modal-loading')) {
                                $container.addClass('grid4-modal-loading');
                                // Remove inline styles
                                $container.css({
                                    'top': '',
                                    'padding': ''
                                });
                            }
                        });
                        
                        return result;
                    };
                }
                
                return originalAjax.call(this, options);
            };
        }
        
        /**
         * Ensure modals stay within #grid4-app-shell
         */
        function ensureModalPlacement() {
            $('.modal').each(function() {
                var $modal = $(this);
                var $appShell = $('#grid4-app-shell');
                
                // Only move if modal is outside app shell
                if ($appShell.length && !$appShell.find($modal).length) {
                    // Check if modal should be moved (not a system modal)
                    var modalId = $modal.attr('id');
                    if (modalId && !modalId.match(/system|alert|confirm/i)) {
                        $modal.appendTo($appShell);
                    }
                }
            });
        }
        
        /**
         * Apply fixes to existing modals
         */
        function applyModalFixes() {
            $('.modal').each(function() {
                var $modal = $(this);
                
                // Remove any inline margin styles
                $modal.css({
                    'margin': '',
                    'margin-top': '',
                    'margin-left': '',
                    'margin-right': '',
                    'margin-bottom': ''
                });
                
                // Add our classes
                $modal.addClass('grid4-modal-positioned grid4-modal-styled');
                
                // Fix modal-dialog if present
                var $dialog = $modal.find('.modal-dialog');
                if ($dialog.length) {
                    $dialog.css({
                        'margin': '',
                        'transform': ''
                    });
                }
            });
        }
        
        /**
         * Monitor for new modals added to DOM
         */
        var modalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            var $node = $(node);
                            if ($node.hasClass('modal') || $node.find('.modal').length) {
                                setTimeout(applyModalFixes, 10);
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing
        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        /**
         * Fix Bootstrap modal backdrop z-index issues
         */
        $(document).on('shown.bs.modal shown.modal', '.modal', function() {
            var zIndex = 1040;
            var $backdrop = $('.modal-backdrop').not('.modal-stack');
            
            $backdrop.each(function() {
                zIndex += 10;
                $(this).css('z-index', zIndex);
            });
            
            $(this).css('z-index', zIndex + 10);
        });
        
        /**
         * Initialize all fixes
         */
        function initialize() {
            console.log('[Grid4 Modal Fix] Applying initial fixes');
            
            // Apply fixes to existing modals
            applyModalFixes();
            
            // Ensure proper placement
            ensureModalPlacement();
            
            // Patch loading spinner
            patchLoadingSpinner();
            
            // Add resize handler
            $(window).on('resize.grid4modal', function() {
                $('.modal:visible').each(function() {
                    var $modal = $(this);
                    // Update CSS variable for max height
                    if ($modal[0]) {
                        var windowHeight = $(window).height();
                        var maxHeight = windowHeight - 200; // Reserve space for header/footer
                        $modal[0].style.setProperty('--modal-max-height', maxHeight + 'px');
                    }
                });
            });
        }
        
        // Initialize when DOM is ready
        $(document).ready(initialize);
        
        // Also initialize after a delay to catch late-loading content
        setTimeout(initialize, 1000);
        
        /**
         * Public API for debugging
         */
        window.Grid4ModalFix = {
            version: '1.0.0',
            applyFixes: applyModalFixes,
            ensurePlacement: ensureModalPlacement,
            debug: function() {
                console.log('[Grid4 Modal Fix] Debug Info:');
                console.log('- Modals found:', $('.modal').length);
                console.log('- Visible modals:', $('.modal:visible').length);
                console.log('- Modal backdrops:', $('.modal-backdrop').length);
                console.log('- Body classes:', $('body').attr('class'));
                $('.modal').each(function(i, modal) {
                    console.log('- Modal', i, ':', {
                        id: modal.id,
                        classes: modal.className,
                        visible: $(modal).is(':visible'),
                        inlineStyles: modal.style.cssText
                    });
                });
            }
        };
        
        console.log('[Grid4 Modal Fix] Initialization complete');
    }
})();