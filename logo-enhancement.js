/* Grid4 Logo Enhancement - Dynamic Logo Replacement System
 * Replaces NetSapiens logo with Grid4 branding across all portal variations
 * Supports multiple logo variants and responsive sizing
 */

(function(window, document, $) {
    'use strict';

    const LogoEnhancement = {
        _applied: false,
        _currentLogo: null,

        // Logo variants for different contexts
        LOGO_VARIANTS: {
            'grid4-white': {
                name: 'Grid4 White Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo_white-2.png',
                description: 'Standard Grid4 white logo for dark backgrounds',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-dark': {
                name: 'Grid4 Dark Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo_dark.png',
                description: 'Grid4 dark logo for light backgrounds',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-colored': {
                name: 'Grid4 Colored Logo',
                url: 'https://grid4.com/wp-content/uploads/2019/04/grid4-logo.png',
                description: 'Full color Grid4 logo',
                fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZmlsbD0iIzAwN2JmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+R3JpZDQ8L3RleHQ+PC9zdmc+'
            },
            
            'grid4-svg-modern': {
                name: 'Grid4 Modern SVG',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2N2VlYTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJ1cmwoI2dyYWQpIiByeD0iMyIvPjxyZWN0IHg9IjI1IiB5PSI1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9InVybCgjZ3JhZCkiIHJ4PSIzIi8+PHJlY3QgeD0iNSIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0idXJsKCNncmFkKSIgcng9IjMiLz48cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0idXJsKCNncmFkKSIgcng9IjMiLz48dGV4dCB4PSI1MCIgeT0iMjgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJJbnRlciwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjYwMCI+R3JpZDQ8L3RleHQ+PC9zdmc+',
                description: 'Modern SVG logo with gradient and grid pattern',
                fallback: null // Already SVG
            }
        },

        // Comprehensive selectors for different portal layouts
        LOGO_SELECTORS: [
            // NetSapiens standard selectors
            '.header-logo img',
            '.logo img',
            '#logo img',
            '.brand img',
            '.navbar-brand img',
            
            // Generic logo selectors
            'img[src*="logo"]',
            'img[alt*="logo"]',
            'img[alt*="Logo"]',
            'img[src*="netsapiens"]',
            'img[alt*="NetSapiens"]',
            
            // Header area images
            '.header img',
            '.top-bar img',
            '.nav-header img',
            
            // Portal-specific
            '.portal-header img',
            '.portal-logo img',
            '.site-logo img',
            
            // CSS background images (handled separately)
            '.header-logo',
            '.logo',
            '#logo',
            '.brand',
            '.navbar-brand'
        ],

        init: function() {
            console.log('🎨 LogoEnhancement: Initializing logo replacement system...');
            
            // Wait for Portal Context Manager if available
            if (window.PortalContextManager) {
                $(document).on('portalManagerReady', () => {
                    this.applyLogoReplacement();
                });
                
                if (window.PortalContextManager._isReady) {
                    this.applyLogoReplacement();
                }
            } else {
                // Fallback to immediate application
                this.applyLogoReplacement();
            }
            
            // Setup monitoring for dynamic content
            this.setupDynamicMonitoring();
        },

        applyLogoReplacement: function(variant = 'grid4-white') {
            if (this._applied && this._currentLogo === variant) return;
            
            console.log(`🎨 LogoEnhancement: Applying ${variant} logo replacement...`);
            
            const logo = this.LOGO_VARIANTS[variant];
            if (!logo) {
                console.warn(`Logo variant '${variant}' not found`);
                return;
            }
            
            let replacedCount = 0;
            
            // Replace IMG elements
            this.LOGO_SELECTORS.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.tagName === 'IMG') {
                        this.replaceImageLogo(el, logo);
                        replacedCount++;
                    } else {
                        // Handle background images
                        this.replaceBackgroundLogo(el, logo);
                        replacedCount++;
                    }
                });
            });
            
            // Apply additional CSS fixes
            this.applyCSSFixes(logo);
            
            this._applied = true;
            this._currentLogo = variant;
            
            console.log(`✅ LogoEnhancement: Replaced ${replacedCount} logo instances with ${logo.name}`);
            this.showNotification(`Logo updated to ${logo.name}`, 'success');
        },

        replaceImageLogo: function(imgElement, logo) {
            // Store original for potential restoration
            if (!imgElement.hasAttribute('data-original-src')) {
                imgElement.setAttribute('data-original-src', imgElement.src);
                imgElement.setAttribute('data-original-alt', imgElement.alt || '');
            }
            
            // Create new image with error handling
            const newImg = new Image();
            newImg.onload = () => {
                imgElement.src = logo.url;
                imgElement.alt = logo.name;
                imgElement.style.maxHeight = '40px';
                imgElement.style.height = 'auto';
                imgElement.style.width = 'auto';
                imgElement.style.maxWidth = '200px';
                imgElement.classList.add('g4-logo-replaced');
                
                console.log(`🔄 LogoEnhancement: Replaced logo for ${imgElement.tagName}`);
            };
            
            newImg.onerror = () => {
                console.warn('Logo failed to load, using fallback');
                if (logo.fallback) {
                    imgElement.src = logo.fallback;
                    imgElement.alt = logo.name + ' (fallback)';
                }
            };
            
            // Start loading
            newImg.src = logo.url;
        },

        replaceBackgroundLogo: function(element, logo) {
            // Store original background
            if (!element.hasAttribute('data-original-bg')) {
                const computedStyle = window.getComputedStyle(element);
                element.setAttribute('data-original-bg', computedStyle.backgroundImage);
            }
            
            // Apply new background
            element.style.backgroundImage = `url("${logo.url}")`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.minHeight = '40px';
            element.classList.add('g4-logo-bg-replaced');
            
            console.log(`🎨 LogoEnhancement: Replaced background logo for ${element.tagName}`);
        },

        applyCSSFixes: function(logo) {
            // Remove existing logo fix styles
            const existingStyle = document.getElementById('g4-logo-enhancement');
            if (existingStyle) existingStyle.remove();
            
            const style = document.createElement('style');
            style.id = 'g4-logo-enhancement';
            style.textContent = `
                /* Grid4 Logo Enhancement CSS Fixes */
                .g4-logo-replaced,
                .g4-logo-bg-replaced {
                    filter: brightness(1) contrast(1) !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
                
                /* Hide any potential duplicate logos */
                .header-logo img:not(.g4-logo-replaced),
                .logo img:not(.g4-logo-replaced),
                #logo img:not(.g4-logo-replaced) {
                    display: none !important;
                }
                
                /* Responsive logo sizing */
                .g4-logo-replaced {
                    max-height: 40px !important;
                    height: auto !important;
                    width: auto !important;
                    max-width: 200px !important;
                    object-fit: contain !important;
                }
                
                @media (max-width: 768px) {
                    .g4-logo-replaced {
                        max-height: 32px !important;
                        max-width: 150px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .g4-logo-replaced {
                        max-height: 28px !important;
                        max-width: 120px !important;
                    }
                }
                
                /* Logo container fixes */
                .header-logo,
                .logo,
                #logo,
                .brand,
                .navbar-brand {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* Animation for logo replacement */
                .g4-logo-replaced {
                    animation: g4LogoFadeIn 0.5s ease-out;
                }
                
                @keyframes g4LogoFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            
            document.head.appendChild(style);
        },

        setupDynamicMonitoring: function() {
            // Monitor for new logo elements being added
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) { // Element node
                                    // Check if the added element contains logos
                                    const logoElements = node.querySelectorAll ? 
                                        node.querySelectorAll(this.LOGO_SELECTORS.join(', ')) : [];
                                    
                                    if (logoElements.length > 0) {
                                        console.log('🔄 LogoEnhancement: New logo elements detected, reapplying...');
                                        setTimeout(() => this.applyLogoReplacement(this._currentLogo), 100);
                                    }
                                }
                            });
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            
            // Also monitor page navigation changes
            $(document).on('ajaxComplete', () => {
                setTimeout(() => {
                    if (this._applied) {
                        this.applyLogoReplacement(this._currentLogo);
                    }
                }, 200);
            });
        },

        // Public API methods
        switchLogo: function(variant) {
            if (!this.LOGO_VARIANTS[variant]) {
                console.warn(`Logo variant '${variant}' not available`);
                return false;
            }
            
            this._applied = false; // Force reapplication
            this.applyLogoReplacement(variant);
            return true;
        },

        restoreOriginalLogos: function() {
            // Restore IMG elements
            document.querySelectorAll('.g4-logo-replaced').forEach(img => {
                const originalSrc = img.getAttribute('data-original-src');
                const originalAlt = img.getAttribute('data-original-alt');
                
                if (originalSrc) {
                    img.src = originalSrc;
                    img.alt = originalAlt;
                    img.removeAttribute('data-original-src');
                    img.removeAttribute('data-original-alt');
                    img.classList.remove('g4-logo-replaced');
                }
            });
            
            // Restore background images
            document.querySelectorAll('.g4-logo-bg-replaced').forEach(el => {
                const originalBg = el.getAttribute('data-original-bg');
                if (originalBg) {
                    el.style.backgroundImage = originalBg;
                    el.removeAttribute('data-original-bg');
                    el.classList.remove('g4-logo-bg-replaced');
                }
            });
            
            // Remove CSS fixes
            const style = document.getElementById('g4-logo-enhancement');
            if (style) style.remove();
            
            this._applied = false;
            this._currentLogo = null;
            
            console.log('🔄 LogoEnhancement: Original logos restored');
            this.showNotification('Original logos restored', 'info');
        },

        getAvailableLogos: function() {
            return Object.keys(this.LOGO_VARIANTS).map(key => ({
                key,
                name: this.LOGO_VARIANTS[key].name,
                description: this.LOGO_VARIANTS[key].description
            }));
        },

        getCurrentLogo: function() {
            return this._currentLogo;
        },

        showNotification: function(message, type) {
            if (window.toast && window.toast[type]) {
                window.toast[type](message, { duration: 3000 });
            } else if (window.G4CommandPalette && window.G4CommandPalette.showToast) {
                window.G4CommandPalette.showToast(message, type);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        }
    };

    // Auto-initialize when DOM is ready
    $(document).ready(function() {
        LogoEnhancement.init();
    });

    // Expose globally
    window.LogoEnhancement = LogoEnhancement;
    
    if (window.g4c) {
        window.g4c.LogoEnhancement = LogoEnhancement;
    }

    console.log('📦 LogoEnhancement module loaded - Grid4 branding system ready');

})(window, document, jQuery);