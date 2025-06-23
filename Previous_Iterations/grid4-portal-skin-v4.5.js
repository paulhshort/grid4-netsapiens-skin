/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v4.5
   DUAL LIGHT/DARK THEME SYSTEM + PERFORMANCE OPTIMIZATIONS
   =================================== */

(function($, window, document) {
  'use strict';
  
  // ===================================
  // Core Namespace & Configuration
  // ===================================
  window.Grid4Portal = window.Grid4Portal || {};
  
  var G4 = window.Grid4Portal;
  
  // Configuration object
  G4.config = {
    version: '4.5.0', // Updated version number
    debug: false,
    initialized: false,
    
    // Feature flags
    features: {
      sidebarCollapse: true,
      mobileOptimization: true,
      keyboardShortcuts: true,
      performanceMonitoring: true,
      ajaxHandling: true,
      themeSwitching: true // New feature flag for theme switching
    },
    
    // DOM selectors (Reference compliant)
    selectors: {
      wrapper: '.wrapper',
      header: '#header',
      navigation: '#navigation',
      navButtons: '#nav-buttons',
      content: '#content',
      panels: '.panel',
      tables: '.table',
      userToolbar: '.user-toolbar' // Selector for theme toggle injection
    },
    
    // CSS classes
    classes: {
      portalActive: 'grid4-portal-active',
      sidebarCollapsed: 'grid4-sidebar-collapsed',
      mobileMenuOpen: 'grid4-mobile-menu-open',
      themeLight: 'theme-light', // New theme class
      themeDark: 'theme-dark'    // New theme class
    },
    
    // Timing constants
    timing: {
      fast: 150,
      normal: 250,
      slow: 350,
      maxWaitTime: 10000
    }
  };
  
  // Enable debug mode via URL parameter
  var urlParams = new URLSearchParams(window.location.search);
  G4.config.debug = urlParams.get('debug') === 'true' || 
                   localStorage.getItem('grid4_debug') === 'true';
  
  // ===================================
  // Utility Functions
  // ===================================
  G4.utils = {
    // Logging utility
    log: function(message, type, data) {
      if (!G4.config.debug) return;
      var method = console[type] || console.log;
      var timestamp = new Date().toISOString();
      method.call(console, '[Grid4Portal ' + timestamp + '] ' + message, data || '');
    },
    
    // Error handling
    error: function(message, error) {
      this.log(message, 'error', error);
      
      // Store error for debugging
      if (!window.Grid4Errors) window.Grid4Errors = [];
      window.Grid4Errors.push({
        message: message,
        error: error,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    },
    
    // Debounce function
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    
    // Wait for element to exist
    waitForElement: function(selector, callback, maxAttempts) {
      var attempts = 0;
      maxAttempts = maxAttempts || 50;
      
      var check = function() {
        attempts++;
        var $element = $(selector);
        
        if ($element.length > 0) {
          G4.utils.log('Element found: ' + selector + ' (attempt ' + attempts + ')');
          callback($element);
        } else if (attempts < maxAttempts) {
          setTimeout(check, 100);
        } else {
          G4.utils.log('Element not found after ' + maxAttempts + ' attempts: ' + selector, 'warn');
        }
      };
      
      check();
    },
    
    // Safe execution wrapper
    safeExecute: function(fn, context, errorMessage) {
      try {
        return fn.call(context || this);
      } catch (error) {
        G4.utils.error(errorMessage || 'Safe execution failed', error);
        return null;
      }
    },
    
    // Local storage helpers
    storage: {
      get: function(key) {
        try {
          var value = localStorage.getItem('grid4_' + key);
          return value ? JSON.parse(value) : null;
        } catch (e) {
          G4.utils.error('Storage get error for key: ' + key, e);
          return null;
        }
      },
      
      set: function(key, value) {
        try {
          localStorage.setItem('grid4_' + key, JSON.stringify(value));
          return true;
        } catch (e) {
          G4.utils.error('Storage set error for key: ' + key, e);
          return false;
        }
      }
    }
  };
  
  // ===================================
  // Core Modules
  // ===================================
  
  // Portal Detection Module
  G4.portalDetection = {
    isNetSapiens: false,
    currentPage: null,
    
    init: function() {
      this.detectPortal();
      this.detectCurrentPage();
      this.addPortalMarkers();
      
      G4.utils.log('Portal detection initialized', 'info', {
        isNetSapiens: this.isNetSapiens,
        currentPage: this.currentPage
      });
    },
    
    detectPortal: function() {
      // Check for NetSapiens portal indicators
      this.isNetSapiens = !!(
        $('#navigation').length ||
        $('#nav-buttons').length ||
        $('body').hasClass('portal') ||
        window.location.href.includes('/portal/')
      );
    },
    
    detectCurrentPage: function() {
      var path = window.location.pathname;
      var segments = path.split('/').filter(function(segment) {
        return segment.length > 0;
      });
      
      this.currentPage = segments[segments.length - 1] || 'home';
      
      // Clean up page name
      if (this.currentPage.includes('?')) {
        this.currentPage = this.currentPage.split('?')[0];
      }
      
      // Add page class to body
      $('body').addClass('grid4-page-' + this.currentPage);
    },
    
    addPortalMarkers: function() {
      if (this.isNetSapiens) {
        $('body').addClass(G4.config.classes.portalActive);
        G4.utils.log('Portal markers added');
      }
    }
  };
  
  // Sidebar Module
  G4.sidebar = {
    isCollapsed: false,
    isMobile: false,
    
    init: function() {
      if (!G4.config.features.sidebarCollapse) return;
      
      this.checkMobile();
      this.loadState();
      this.createToggleButton();
      this.bindEvents();
      this.applyState();
      
      G4.utils.log('Sidebar module initialized');
    },
    
    checkMobile: function() {
      this.isMobile = window.innerWidth <= 768;
    },
    
    loadState: function() {
      // Don't restore collapsed state on mobile
      if (this.isMobile) {
        this.isCollapsed = false;
      } else {
        // Default to expanded (false) for better UX
        this.isCollapsed = G4.utils.storage.get('sidebarCollapsed') || false;
      }

      G4.utils.log('Sidebar state loaded - collapsed: ' + this.isCollapsed + ', mobile: ' + this.isMobile);
    },
    
    createToggleButton: function() {
      if ($('#grid4-sidebar-toggle').length) return;
      
      var $toggle = $('<button>', {
        id: 'grid4-sidebar-toggle',
        class: 'grid4-sidebar-toggle',
        'aria-label': 'Toggle navigation sidebar',
        html: '<i class="fa fa-bars" aria-hidden="true"></i>',
        css: {
          position: 'fixed',
          top: '15px',
          left: '15px',
          zIndex: 9999, // Much higher z-index to prevent interception
          background: 'rgba(26, 35, 50, 0.9)',
          border: 'none',
          color: '#ffffff',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'auto' // Ensure it can receive clicks
        }
      });
      
      // Add hover effects
      $toggle.hover(
        function() { 
          $(this).css({
            background: 'rgba(0, 212, 255, 0.2)',
            transform: 'scale(1.05)'
          }); 
        },
        function() { 
          $(this).css({
            background: 'rgba(26, 35, 50, 0.9)',
            transform: 'scale(1)'
          }); 
        }
      );
      
      $('body').append($toggle);
    },
    
    bindEvents: function() {
      var self = this;
      
      // Toggle button click
      $(document).on('click', '#grid4-sidebar-toggle', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggle();
      });
      
      // Keyboard shortcuts
      if (G4.config.features.keyboardShortcuts) {
        $(document).on('keydown.grid4-sidebar', function(e) {
          // Ctrl/Cmd + B to toggle sidebar
          if ((e.ctrlKey || e.metaKey) && e.which === 66) {
            e.preventDefault();
            self.toggle();
          }
          
          // Escape to close mobile menu
          if (e.which === 27 && self.isMobile && !self.isCollapsed) {
            self.closeMobileMenu();
          }
        });
      }
      
      // Window resize handler
      $(window).on('resize.grid4-sidebar', G4.utils.debounce(function() {
        var wasMobile = self.isMobile;
        self.checkMobile();
        
        if (wasMobile !== self.isMobile) {
          self.handleMobileChange();
        }
      }, 250));
      
      // Click outside to close mobile menu
      $(document).on('click.grid4-sidebar', function(e) {
        if (self.isMobile && !self.isCollapsed) {
          var $target = $(e.target);
          if (!$target.closest('#navigation').length && 
              !$target.closest('#grid4-sidebar-toggle').length) {
            self.closeMobileMenu();
          }
        }
      });
    },
    
    toggle: function() {
      if (this.isMobile) {
        this.toggleMobileMenu();
      } else {
        this.toggleDesktopSidebar();
      }
      
      this.applyState();
      this.saveState();
      
      G4.utils.log('Sidebar toggled', 'info', {
        collapsed: this.isCollapsed,
        mobile: this.isMobile
      });
    },
    
    toggleMobileMenu: function() {
      this.isCollapsed = !this.isCollapsed;
    },
    
    toggleDesktopSidebar: function() {
      this.isCollapsed = !this.isCollapsed;
    },
    
    closeMobileMenu: function() {
      if (this.isMobile) {
        this.isCollapsed = true;
        this.applyState();
      }
    },
    
    applyState: function() {
      var $body = $('body');
      
      if (this.isMobile) {
        $body.removeClass(G4.config.classes.sidebarCollapsed);
        if (this.isCollapsed) {
          $body.removeClass(G4.config.classes.mobileMenuOpen);
        } else {
          $body.addClass(G4.config.classes.mobileMenuOpen);
        }
      } else {
        $body.removeClass(G4.config.classes.mobileMenuOpen);
        if (this.isCollapsed) {
          $body.addClass(G4.config.classes.sidebarCollapsed);
        } else {
          $body.removeClass(G4.config.classes.sidebarCollapsed);
        }
      }
    },
    
    saveState: function() {
      if (!this.isMobile) {
        G4.utils.storage.set('sidebarCollapsed', this.isCollapsed);
      }
    },
    
    handleMobileChange: function() {
      // Clean up classes when switching between mobile/desktop
      var $body = $('body');
      $body.removeClass(G4.config.classes.sidebarCollapsed);
      $body.removeClass(G4.config.classes.mobileMenuOpen);
      
      // Reload state for new mode
      this.loadState();
      this.applyState();
    }
  };
  
  // Navigation Enhancement Module
  G4.navigation = {
    init: function() {
      this.enhanceNavigationStructure();
      this.addNavigationText();
      this.handleActiveStates();
      this.shortenMenuLabels(); // Call label shortening on init
      
      G4.utils.log('Navigation enhancement initialized');
    },
    
    enhanceNavigationStructure: function() {
      G4.utils.safeExecute(function() {
        // Ensure all navigation links have proper nav-link class
        $(G4.config.selectors.navButtons + ' li a').each(function() {
          var $this = $(this);
          if (!$this.hasClass('nav-link')) {
            $this.addClass('nav-link');
          }
        });
        
        // Remove any legacy navigation elements
        $(G4.config.selectors.navButtons + ' .nav-button').remove();
        $(G4.config.selectors.navButtons + ' .nav-bg-image').remove();
        $(G4.config.selectors.navButtons + ' .nav-arrow').remove();
        
      }, this, 'Failed to enhance navigation structure');
    },
    
    addNavigationText: function() {
      G4.utils.safeExecute(function() {
        $(G4.config.selectors.navButtons + ' li a.nav-link').each(function() {
          var $this = $(this);
          var text = $this.text().trim();
          
          // Only add nav-text span if it doesn't exist
          if (text && !$this.find('.nav-text').length) {
            $this.html('<span class="nav-text">' + text + '</span>');
          }
        });
      }, this, 'Failed to add navigation text');
    },
    
    handleActiveStates: function() {
      G4.utils.safeExecute(function() {
        // Mark current page navigation item as active
        var currentPage = G4.portalDetection.currentPage;
        if (currentPage) {
          $(G4.config.selectors.navButtons + ' li').each(function() {
            var $this = $(this);
            var href = $this.find('a').attr('href');
            
            if (href && href.includes(currentPage)) {
              $this.addClass('current');
              $this.find('a').addClass('active');
            }
          });
        }
      }, this, 'Failed to handle active states');
    },

    // New: Function to shorten menu labels
    shortenMenuLabels: function() {
      var labelMap = {
        'Auto Attendants': 'Attendants',
        'Call Queues': 'Queues',
        'Music On Hold': 'Hold'
      };

      G4.utils.safeExecute(function() {
        $('#nav-buttons li a.nav-link .nav-text').each(function() {
          var $el = $(this);
          var originalText = $el.text().trim();
          if (labelMap[originalText]) {
            $el.text(labelMap[originalText]);
            G4.utils.log('Shortened menu label: ' + originalText + ' -> ' + labelMap[originalText]);
          }
        });
      }, this, 'Failed to shorten menu labels');
    }
  };
  
  // Performance Monitoring Module
  G4.performance = {
    startTime: null,
    metrics: {},
    
    init: function() {
      if (!G4.config.features.performanceMonitoring) return;
      
      this.startTime = performance.now();
      this.bindEvents();
      
      G4.utils.log('Performance monitoring initialized');
    },
    
    mark: function(name) {
      if (this.startTime) {
        this.metrics[name] = performance.now() - this.startTime;
        G4.utils.log('Performance mark [' + name + ']: ' + this.metrics[name].toFixed(2) + 'ms');
      }
    },
    
    bindEvents: function() {
      var self = this;
      
      // Mark when DOM is ready
      $(document).ready(function() {
        self.mark('dom_ready');
      });
      
      // Mark when window is loaded
      $(window).on('load', function() {
        self.mark('window_loaded');
      });
    },
    
    getMetrics: function() {
      return this.metrics;
    }
  };
  
  // Enhanced Logo Management Module (v4.1.0 - Multi-Strategy Integration)
  G4.logo = {
    currentStrategy: null,
    strategies: ['css-positioning', 'dom-cloning', 'dom-relocation', 'css-fallback'],
    state: {
      logoFound: false,
      logoRelocated: false,
      strategyUsed: null,
      retryCount: 0,
      maxRetries: 3
    },

    init: function() {
      this.detectAndIntegrateLogo();
      this.setupLogoMonitoring();
      G4.utils.log('Enhanced logo module initialized - multi-strategy integration');
    },

    detectAndIntegrateLogo: function() {
      var self = this;

      // Use requestAnimationFrame to avoid forced reflows
      requestAnimationFrame(function() {
        self.tryLogoIntegration();
      });
    },

    tryLogoIntegration: function() {
      var headerLogo = document.getElementById('header-logo');
      var navigation = document.getElementById('navigation');

      G4.utils.log('Logo integration attempt - headerLogo: ' + !!headerLogo + ', navigation: ' + !!navigation);

      if (!navigation) {
        G4.utils.log('Navigation element not ready, retrying...', 'warn');
        this.scheduleRetry();
        return;
      }

      if (headerLogo) {
        this.state.logoFound = true;
        G4.utils.log('Native logo found, src: ' + (headerLogo.src || headerLogo.innerHTML));

        // Check if logo has content
        var hasContent = headerLogo.src || headerLogo.innerHTML.trim() || headerLogo.style.backgroundImage;
        if (hasContent) {
          G4.utils.log('Logo has content, attempting integration...');
          this.attemptIntegrationStrategies(headerLogo, navigation);
        } else {
          G4.utils.log('Logo element found but no content, using fallback...');
          this.useFallbackStrategy(navigation);
        }
      } else {
        G4.utils.log('Native logo not found, using fallback strategy...');
        this.useFallbackStrategy(navigation);
      }
    },

    attemptIntegrationStrategies: function(headerLogo, navigation) {
      var self = this;

      // Try real logo integration strategies first (prioritize actual logo over fallback)
      for (var i = 0; i < this.strategies.length - 1; i++) { // Exclude css-fallback for now
        var strategy = this.strategies[i];

        if (this.executeStrategy(strategy, headerLogo, navigation)) {
          this.state.strategyUsed = strategy;
          this.state.logoRelocated = true;
          G4.utils.log('Logo integration successful using strategy: ' + strategy);
          return;
        }
      }

      // Only use CSS fallback if all real logo strategies failed
      G4.utils.log('All real logo strategies failed, using CSS fallback as last resort');
      this.useFallbackStrategy(navigation);
    },

    executeStrategy: function(strategy, headerLogo, navigation) {
      try {
        switch (strategy) {
          case 'css-positioning':
            return this.cssPositioningStrategy(headerLogo, navigation);
          case 'dom-cloning':
            return this.domCloningStrategy(headerLogo, navigation);
          case 'dom-relocation':
            return this.domRelocationStrategy(headerLogo, navigation);
        }
      } catch (error) {
        G4.utils.error('Strategy ' + strategy + ' failed', error);
        return false;
      }
      return false;
    },

    cssPositioningStrategy: function(headerLogo, navigation) {
      // Move logo visually using CSS without changing DOM structure
      var logoRect = headerLogo.getBoundingClientRect();
      var navRect = navigation.getBoundingClientRect();

      if (logoRect.width === 0 || logoRect.height === 0) {
        return false; // Logo not visible/loaded
      }

      // Apply CSS positioning to move logo visually
      headerLogo.style.position = 'fixed';
      headerLogo.style.top = (navRect.top + 20) + 'px';
      headerLogo.style.left = (navRect.left + (navRect.width - logoRect.width) / 2) + 'px';
      headerLogo.style.zIndex = '1001';
      headerLogo.style.transition = 'all 250ms ease';

      // Mark original position as hidden
      headerLogo.setAttribute('data-grid4-relocated', 'css-positioning');

      G4.utils.log('Logo positioned using CSS positioning strategy');
      return true;
    },

    domCloningStrategy: function(headerLogo, navigation) {
      // Enhanced DOM cloning with proper Grid4 logo styling
      // CRITICAL FIX: Preserve native NetSapiens logo functionality for logo_option_001.png

      // IMPORTANT: Preserve the original logo source before cloning
      var originalSrc = headerLogo.src || '';
      var logoImg = headerLogo.querySelector('img');
      var originalImgSrc = logoImg ? logoImg.src : '';

      G4.utils.log('Preserving original logo sources for clone - headerLogo.src: ' + originalSrc + ', img.src: ' + originalImgSrc);

      var logoClone = headerLogo.cloneNode(true);
      logoClone.id = 'header-logo-clone';
      logoClone.setAttribute('data-grid4-clone', 'true');

      var navButtons = document.getElementById('nav-buttons');
      if (navButtons) {
        navigation.insertBefore(logoClone, navButtons);
      } else {
        navigation.insertBefore(logoClone, navigation.firstChild);
      }

      // Apply Grid4-specific styling to the cloned logo
      logoClone.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin: 15px 20px !important;
        max-height: 40px !important;
        width: auto !important;
        z-index: 1001 !important;
      `;

      // Style the logo image inside the cloned header-logo div
      // CRITICAL: Ensure cloned logo preserves original src for logo_option_001.png
      var clonedLogoImg = logoClone.querySelector('img');
      if (clonedLogoImg) {
        clonedLogoImg.style.cssText = `
          max-height: 40px !important;
          width: auto !important;
          display: block !important;
        `;

        // Ensure the cloned logo has the correct src (logo_option_001.png from NetSapiens)
        if (originalImgSrc && clonedLogoImg.src !== originalImgSrc) {
          clonedLogoImg.src = originalImgSrc;
          G4.utils.log('Restored original logo image src in clone: ' + originalImgSrc);
        }
        G4.utils.log('Grid4 logo image found and styled in clone: ' + clonedLogoImg.src);
      }

      // If cloned headerLogo itself has a src, preserve it
      if (originalSrc && logoClone.src !== originalSrc) {
        logoClone.src = originalSrc;
        G4.utils.log('Restored original header logo src in clone: ' + originalSrc);
      }

      // Hide original logo
      headerLogo.style.display = 'none';
      headerLogo.setAttribute('data-grid4-hidden', 'true');

      G4.utils.log('Logo cloned using DOM cloning strategy with preserved NetSapiens functionality');
      return true;
    },

    domRelocationStrategy: function(headerLogo, navigation) {
      // CRITICAL FIX: Proper DOM relocation WITHOUT content replacement
      // Preserve native NetSapiens logo content (logo_option_001.png)
      var navButtons = document.getElementById('nav-buttons');

      // Store original parent for potential restoration
      headerLogo.setAttribute('data-grid4-original-parent', headerLogo.parentNode.id || 'header');

      // IMPORTANT: Preserve original logo content - DO NOT modify src or content
      var logoImg = headerLogo.querySelector('img');
      var originalSrc = logoImg ? logoImg.src : '';
      var originalAlt = logoImg ? logoImg.alt : '';

      G4.utils.log('Preserving native logo content - src: ' + originalSrc + ', alt: ' + originalAlt);

      // Move the logo element to navigation WITHOUT modifying its content
      if (navButtons) {
        // Insert before nav-buttons to ensure it appears at the top
        navigation.insertBefore(headerLogo, navButtons);
      } else {
        // Fallback: prepend to navigation
        navigation.insertBefore(headerLogo, navigation.firstChild);
      }

      // Apply Grid4 styling to the relocated logo container ONLY
      headerLogo.style.cssText = `
        display: block !important;
        width: 248px !important;
        height: 83px !important;
        margin: 20px auto 24px auto !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        transition: all var(--grid4-transition-normal) !important;
        order: -1 !important;
      `;

      // Style the logo image inside the header-logo div WITHOUT changing content
      if (logoImg) {
        // Apply styling but preserve original src and alt
        logoImg.style.cssText = `
          max-height: 40px !important;
          width: auto !important;
          display: block !important;
          object-fit: contain !important;
          visibility: visible !important;
          opacity: 1 !important;
        `;

        // CRITICAL: Do NOT modify src - preserve native NetSapiens logo
        G4.utils.log('Logo image styled without content modification - preserved src: ' + logoImg.src);
      }

      // CRITICAL: Do NOT modify headerLogo src if it's an img element
      // The native NetSapiens system manages the logo content

      headerLogo.setAttribute('data-grid4-relocated', 'dom-relocation');
      G4.utils.log('Logo relocated using DOM relocation strategy - native content preserved');
      return true;
    },

    useFallbackStrategy: function(navigation) {
      // CSS-based fallback approach
      this.state.strategyUsed = 'css-fallback';

      // Add CSS class to enable pseudo-element logo
      navigation.classList.add('grid4-logo-fallback');

      G4.utils.log('Using CSS fallback strategy for logo');
    },

    scheduleRetry: function() {
      var self = this;

      if (this.state.retryCount < this.state.maxRetries) {
        this.state.retryCount++;

        // Use exponential backoff for retries
        var delay = Math.min(1000 * Math.pow(2, this.state.retryCount - 1), 5000);

        setTimeout(function() {
          self.detectAndIntegrateLogo();
        }, delay);

        G4.utils.log('Scheduling logo integration retry ' + this.state.retryCount + ' in ' + delay + 'ms');
      } else {
        G4.utils.log('Max retries reached, using fallback strategy', 'warn');
        var navigation = document.getElementById('navigation');
        if (navigation) {
          this.useFallbackStrategy(navigation);
        }
      }
    },

    setupLogoMonitoring: function() {
      var self = this;

      // Optimized mutation observer with debouncing
      var observer = new MutationObserver(G4.utils.debounce(function(mutations) {
        var logoChanged = false;

        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.id === 'header-logo' ||
                  (node.querySelector && node.querySelector('#header-logo'))) {
                logoChanged = true;
              }
            });
          }
        });

        if (logoChanged && !self.state.logoRelocated) {
          G4.utils.log('Logo element detected via mutation observer');
          self.detectAndIntegrateLogo();
        }
      }, 250));

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      this.logoObserver = observer;
    },

    // Recovery function for debugging
    resetLogoIntegration: function() {
      // Clean up any existing logo modifications
      var headerLogo = document.getElementById('header-logo');
      var logoClone = document.getElementById('header-logo-clone');
      var navigation = document.getElementById('navigation');

      if (headerLogo) {
        // Reset styles
        headerLogo.style.position = '';
        headerLogo.style.top = '';
        headerLogo.style.left = '';
        headerLogo.style.zIndex = '';
        headerLogo.style.display = '';
        headerLogo.style.visibility = '';
        headerLogo.style.opacity = '';

        // Remove attributes
        headerLogo.removeAttribute('data-grid4-relocated');
        headerLogo.removeAttribute('data-grid4-hidden');

        // Restore to original parent if needed
        var originalParent = headerLogo.getAttribute('data-grid4-original-parent');
        if (originalParent) {
          var parent = document.getElementById(originalParent);
          if (parent && headerLogo.parentNode !== parent) {
            parent.appendChild(headerLogo);
          }
          headerLogo.removeAttribute('data-grid4-original-parent');
        }
      }

      if (logoClone) {
        logoClone.remove();
      }

      if (navigation) {
        navigation.classList.remove('grid4-logo-fallback');
      }

      // Reset state
      this.state = {
        logoFound: false,
        logoRelocated: false,
        strategyUsed: null,
        retryCount: 0,
        maxRetries: 3
      };

      G4.utils.log('Logo integration reset');
    },

    getStatus: function() {
      return {
        state: this.state,
        currentStrategy: this.currentStrategy,
        logoElement: document.getElementById('header-logo'),
        logoClone: document.getElementById('header-logo-clone'),
        navigationElement: document.getElementById('navigation')
      };
    }
  };

  // UI Enhancements Module
  G4.uiEnhancements = {
    init: function() {
      this.addRefreshButton();
      this.enhanceSubBar();
      G4.utils.log('UI enhancements initialized');
    },

    addRefreshButton: function() {
      G4.utils.waitForElement('#navigation-subbar', function($subbar) {
        if ($('#pageRefresh').length) return;

        // Create or find the right-side container
        var $rightContainer = $subbar.find('.subbar-right');
        if (!$rightContainer.length) {
          $rightContainer = $('<div class="subbar-right"></div>');
          $subbar.append($rightContainer);
        }

        var $refreshButton = $('<a>', {
          id: 'pageRefresh',
          href: '#',
          title: 'Refresh Page',
          html: '<i class="fa fa-refresh" aria-hidden="true"></i>',
          click: function(e) {
            e.preventDefault();
            location.reload();
          }
        });

        $rightContainer.append($refreshButton);
        G4.utils.log('Refresh button added to sub-bar');
      });
    },

    enhanceSubBar: function() {
      G4.utils.waitForElement('#navigation-subbar', function($subbar) {
        // Ensure proper flex layout
        $subbar.css({
          'display': 'flex',
          'justify-content': 'space-between',
          'align-items': 'center'
        });
      });
    }
  };

  // Layout Fixes Module (Performance Optimized)
  G4.layoutFixes = {
    modalObserver: null,

    init: function() {
      this.fixBackgroundIssues();
      this.fixHeaderOverlap();
      // Removed fixNavigationIcons as it injects dynamic <style> blocks per item
      this.fixDomainContext();
      this.setupModalMonitoring(); // Replaced aggressive interval

      G4.utils.log('Layout fixes applied');
    },

    setupModalMonitoring: function() {
      var self = this;

      // Event-driven modal detection instead of polling
      this.modalObserver = new MutationObserver(G4.utils.debounce(function(mutations) {
        var modalAdded = false;

        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                if (node.classList && (
                    node.classList.contains('modal') ||
                    node.classList.contains('popup') ||
                    node.classList.contains('dialog') ||
                    node.classList.contains('ui-dialog')
                  )) {
                  modalAdded = true;
                } else if (node.querySelector) {
                  var modalChild = node.querySelector('.modal, .popup, .dialog, .ui-dialog');
                  if (modalChild) {
                    modalAdded = true;
                  }
                }
              }
            });
          }
        });

        if (modalAdded) {
          // Use requestAnimationFrame to avoid forced reflows
          requestAnimationFrame(function() {
            self.fixModalStyling();
          });
        }
      }, 100));

      this.modalObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Also listen for common modal events
      $(document).on('shown.bs.modal show.bs.modal', function() {
        requestAnimationFrame(function() {
          self.fixModalStyling();
        });
      });
    },

    fixBackgroundIssues: function() {
      // Ensure no white backgrounds leak through
      $('html, body').css({
        'background-color': 'var(--color-bg-primary)'
      });

      // Fix any containers with white backgrounds
      $('.container, .container-fluid, .row, .main-content, .page-content').each(function() {
        var $this = $(this);
        // Check computed style to see if it's white, then set to theme variable
        if (window.getComputedStyle($this[0]).backgroundColor === 'rgb(255, 255, 255)') {
          $this.css('background-color', 'var(--color-bg-primary)');
        }
      });
    },

    fixHeaderOverlap: function() {
      // Ensure header has proper z-index
      $('#header').css('z-index', '1060');

      // Style domain/masquerading elements
      $('.domain-info, .masquerade-info, .breadcrumb').css({
        'background': 'var(--color-surface-primary)',
        'color': 'var(--color-text-primary)',
        'border': '1px solid var(--color-border)',
        'border-radius': '4px',
        'padding': '4px 12px',
        'margin': '0 8px',
        'font-size': '12px'
      });
    },

    fixDomainContext: function() {
      // Watch for dynamic domain context changes
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            // Fix domain context elements
            $('.domain-info, .masquerade-info, .breadcrumb').css({
              'background': 'var(--color-surface-primary)',
              'color': 'var(--color-text-primary)',
              'border': '1px solid var(--color-border)',
              'border-radius': '4px',
              'padding': '4px 12px',
              'margin': '0 8px'
            });

            // Fix any newly created modals or popups
            G4.layoutFixes.fixModalStyling();
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    fixModalStyling: function() {
      // Fix modals and popups that appear dynamically
      $('.modal, .popup, .dialog, .ui-dialog').each(function() {
        var $modal = $(this);

        // Apply theme variables to modal container
        $modal.css({
          'background': 'var(--color-surface-primary)',
          'color': 'var(--color-text-primary)',
          'border': '1px solid var(--color-border)'
        });

        // Fix all text elements within modal
        $modal.find('*').each(function() {
          var $element = $(this);
          var tagName = $element.prop('tagName').toLowerCase();

          // Fix text color for various elements
          if (['p', 'span', 'div', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            // Only override if the color is explicitly white or black (common defaults)
            var currentColor = window.getComputedStyle($element[0]).color;
            if (currentColor === 'rgb(255, 255, 255)' || currentColor === 'rgb(0, 0, 0)') {
                $element.css('color', 'var(--color-text-primary)');
            }
          }

          // Fix form elements
          if (['input', 'textarea', 'select'].includes(tagName)) {
            $element.css({
              'background': 'var(--color-surface-secondary)',
              'color': 'var(--color-text-primary)',
              'border': '1px solid var(--color-border)'
            });
          }

          // Fix buttons
          if (tagName === 'button' || $element.hasClass('btn')) {
            if ($element.hasClass('btn-primary')) {
              $element.css({
                'background': 'var(--color-accent-primary)',
                'color': 'var(--color-surface-primary)', // Text color for primary buttons
                'border-color': 'var(--color-accent-primary)'
              });
            } else {
              $element.css({
                'background': 'var(--color-surface-secondary)',
                'color': 'var(--color-text-primary)',
                'border': '1px solid var(--color-border)'
              });
            }
          }
        });
      });

      // Fix any tables in modals
      $('.modal table, .popup table, .dialog table').each(function() {
        var $table = $(this);
        $table.css({
          'background': 'var(--color-surface-primary)',
          'color': 'var(--color-text-primary)'
        });

        $table.find('th').css({
          'background': 'var(--color-surface-secondary)',
          'color': 'var(--color-text-primary)',
          'border-color': 'var(--color-border)'
        });

        $table.find('td').css({
          'color': 'var(--color-text-primary)',
          'border-color': 'var(--color-border)'
        });
      });
    }
  };

  // ===================================
  // Theme Management Module
  // ===================================
  G4.themeManager = {
    currentTheme: 'light', // Default theme
    localStorageKey: 'grid4_theme',
    
    init: function() {
      if (!G4.config.features.themeSwitching) return;

      this.loadTheme();
      this.applyTheme();
      this.createThemeToggleButton();
      this.bindEvents();
      G4.utils.log('Theme manager initialized. Current theme: ' + this.currentTheme);
    },

    loadTheme: function() {
      var savedTheme = G4.utils.storage.get(this.localStorageKey);
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else {
        // If no theme is saved, default to light mode and save it
        this.currentTheme = 'light';
        G4.utils.storage.set(this.localStorageKey, this.currentTheme);
      }
      G4.utils.log('Loaded theme from localStorage: ' + this.currentTheme);
    },

    applyTheme: function() {
      var $body = $('body');
      if (this.currentTheme === 'dark') {
        $body.removeClass(G4.config.classes.themeLight);
        $body.addClass(G4.config.classes.themeDark);
      } else {
        $body.removeClass(G4.config.classes.themeDark);
        $body.addClass(G4.config.classes.themeLight);
      }
      G4.utils.log('Applied theme: ' + this.currentTheme);
    },

    toggleTheme: function() {
      this.currentTheme = (this.currentTheme === 'light') ? 'dark' : 'light';
      this.applyTheme();
      G4.utils.storage.set(this.localStorageKey, this.currentTheme);
      this.updateToggleButton();
      G4.utils.log('Toggled theme to: ' + this.currentTheme);
    },

    createThemeToggleButton: function() {
      var self = this;
      G4.utils.waitForElement(G4.config.selectors.userToolbar, function($userToolbar) {
        if ($('#grid4-theme-toggle').length) return; // Prevent duplicate

        var $toggleButton = $('<button>', {
          id: 'grid4-theme-toggle',
          class: 'grid4-theme-toggle',
          title: 'Toggle theme',
          html: '<i class="fa"></i>', // Icon will be set by updateToggleButton
          css: {
            // Inline styles for immediate rendering, overridden by CSS later
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '8px',
            borderRadius: '50%',
            transition: 'background-color 150ms, color 150ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        });

        $userToolbar.prepend($toggleButton); // Prepend to ensure it's on the left of user info
        self.updateToggleButton(); // Set initial icon and aria-label
        G4.utils.log('Theme toggle button created.');
      });
    },

    updateToggleButton: function() {
      var $button = $('#grid4-theme-toggle');
      if (!$button.length) return;

      var $icon = $button.find('i.fa');
      if (this.currentTheme === 'light') {
        $icon.removeClass('fa-sun-o').addClass('fa-moon-o');
        $button.attr('aria-label', 'Activate dark mode');
      } else {
        $icon.removeClass('fa-moon-o').addClass('fa-sun-o');
        $button.attr('aria-label', 'Activate light mode');
      }
    },

    bindEvents: function() {
      var self = this;
      $(document).on('click', '#grid4-theme-toggle', function(e) {
        e.preventDefault();
        self.toggleTheme();
      });
    }
  };

  // ===================================
  // Cache Busting & Regression Detection
  // ===================================
  G4.cacheDetection = {
    // No specific version check, relying on cache busting mechanism
    cssLoaded: false,

    init: function() {
      this.detectCSSLoad();
      this.addCacheBuster();
      this.monitorRegression();
    },

    detectCSSLoad: function() {
      // Check if our CSS is properly loaded by testing a known style
      var testElement = document.createElement('div');
      testElement.style.cssText = 'position: absolute; top: -9999px; left: -9999px;';
      // Test a known property from the new theme setup
      testElement.className = G4.config.classes.portalActive + ' ' + G4.config.classes.themeLight; 
      document.body.appendChild(testElement);

      var computedStyle = window.getComputedStyle(testElement);
      // Check for a specific property that should be set by our CSS variables
      this.cssLoaded = computedStyle.backgroundColor === 'rgb(248, 249, 250)'; // This is --color-bg-primary for light theme

      document.body.removeChild(testElement);

      if (!this.cssLoaded) {
        G4.utils.log('CSS not properly loaded - potential cache issue detected', 'warn');
        this.handleCacheIssue();
      } else {
        G4.utils.log('CSS loaded successfully');
      }
    },

    addCacheBuster: function() {
      // Add cache buster to CSS if not already present
      var cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      var grid4CssFound = false;

      cssLinks.forEach(function(link) {
        if (link.href && link.href.includes('grid4-portal-skin')) {
          grid4CssFound = true;
          // Only add if not already present and not a data URI
          if (!link.href.includes('?v=') && !link.href.startsWith('data:')) {
            var separator = link.href.includes('?') ? '&' : '?';
            link.href += separator + 'v=' + G4.config.version.replace(/\./g, '') + Date.now(); // Version + timestamp
            G4.utils.log('Added cache buster to CSS: ' + link.href);
          }
        }
      });

      if (!grid4CssFound) {
        G4.utils.log('Grid4 CSS link not found - may be loaded via PORTAL_CSS_CUSTOM', 'warn');
      }
    },

    handleCacheIssue: function() {
      // Force reload CSS if cache issue detected
      var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.5.css'; // Updated filename
      var cacheBuster = '?v=' + G4.config.version.replace(/\./g, '') + Date.now() + '&cb=' + Math.random().toString(36).substr(2, 9);

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssUrl + cacheBuster;
      link.onload = function() {
        G4.utils.log('CSS reloaded successfully with cache buster');
        G4.cacheDetection.cssLoaded = true;
      };

      document.head.appendChild(link);
    },

    monitorRegression: function() {
      // Optimized monitoring for style regression on page navigation
      var self = this;
      var lastCheck = 0;
      var checkInterval = 2000; // Minimum 2 seconds between checks

      var observer = new MutationObserver(G4.utils.debounce(function(mutations) {
        var now = Date.now();
        var significantChange = false;

        // Only check if enough time has passed and there's significant DOM change
        if (now - lastCheck < checkInterval) {
          return;
        }

        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Look for significant content changes (not just small updates)
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1 && (
                  node.id === 'content' ||
                  (node.classList && node.classList.contains('panel')) ||
                  (node.querySelector && node.querySelector('.panel, #content'))
                )) {
                significantChange = true;
              }
            });
          }
        });

        if (significantChange) {
          lastCheck = now;
          // Use requestAnimationFrame to avoid forced reflows
          requestAnimationFrame(function() {
            self.detectCSSLoad();
            // Re-apply styles/JS that might be lost on AJAX content load
            G4.layoutFixes.fixModalStyling(); // Re-apply modal styles
            G4.navigation.shortenMenuLabels(); // Re-apply menu labels
          });
        }
      }, 500));

      observer.observe(document.body, {
        childList: true,
        subtree: false // Only watch direct children, not deep subtree
      });
    }
  };

    // ===================================
  // Initialization & Main Entry Point
  // ===================================
  G4.init = function() {
    if (this.config.initialized) {
      this.utils.log('Grid4Portal already initialized, skipping...');
      return;
    }

    this.utils.log('Initializing Grid4Portal v' + this.config.version);

    // Fix moment.tz function missing error (if applicable)
    // this.fixMomentTz(); // Assuming this is part of a separate fix, not directly in this file

    // Handle NetSapiens voice JS errors (if applicable)
    // this.handleNetSapiensVoiceErrors(); // Assuming this is part of a separate fix, not directly in this file

    // Initialize theme manager FIRST to prevent FOUC
    this.themeManager.init();

    // Initialize cache detection and regression monitoring
    this.cacheDetection.init();

    // Initialize performance monitoring
    this.performance.init();
    this.performance.mark('init_start');

    // Initialize core modules
    this.portalDetection.init();
    this.logo.init();
    this.layoutFixes.init();
    this.uiEnhancements.init();
    // this.contactsDock.init(); // Assuming contactsDock is a separate module that might be initialized here if needed

    // Wait for navigation element before proceeding with nav/sidebar
    this.utils.waitForElement(this.config.selectors.navigation, function($nav) {
      G4.navigation.init();
      G4.sidebar.init();

      // Mark initialization complete
      G4.performance.mark('init_complete');
      G4.config.initialized = true;

      G4.utils.log('Grid4Portal initialization complete');

      // Trigger custom event
      $(document).trigger('grid4:initialized');
    });
  };
  
  // ===================================
  // Auto-initialization (Enhanced Timing)
  // ===================================

  // Multiple initialization strategies to ensure Grid4 loads
  function initializeGrid4() {
    if (G4.config.initialized) {
      return; // Already initialized
    }

    G4.utils.log('Auto-initialization triggered');
    G4.init();
  }

  // Strategy 1: Document ready
  $(document).ready(function() {
    setTimeout(initializeGrid4, 100);
  });

  // Strategy 2: Window load (fallback)
  $(window).on('load', function() {
    setTimeout(initializeGrid4, 200);
  });

  // Strategy 3: Immediate execution if DOM is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeGrid4, 50);
  }

  // Strategy 4: Delayed fallback initialization
  setTimeout(function() {
    if (!G4.config.initialized) {
      G4.utils.log('Fallback initialization triggered after 3 seconds');
      initializeGrid4();
    }
  }, 3000);
  
  // ===================================
  // Enhanced Debug Console Helper
  // ===================================
  G4.debugInfo = function() {
    var info = {
      version: G4.config.version,
      initialized: G4.config.initialized,
      cssLoaded: G4.cacheDetection.cssLoaded,
      currentPage: G4.portalDetection.currentPage,
      isNetSapiens: G4.portalDetection.isNetSapiens,
      sidebarCollapsed: G4.sidebar ? G4.sidebar.isCollapsed : 'N/A',
      isMobile: G4.sidebar ? G4.sidebar.isMobile : 'N/A',
      performance: G4.performance.metrics,
      errors: window.Grid4Errors || [],
      logo: G4.logo ? G4.logo.getStatus() : 'N/A',
      currentTheme: G4.themeManager ? G4.themeManager.currentTheme : 'N/A', // Added theme info
      stylesheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(function(link) {
        return {
          href: link.href,
          loaded: link.sheet !== null,
          disabled: link.disabled
        };
      }),
      bodyClasses: document.body.className.split(' '),
      portalElements: {
        navigation: !!document.getElementById('navigation'),
        navButtons: !!document.getElementById('nav-buttons'),
        header: !!document.getElementById('header'),
        headerLogo: !!document.getElementById('header-logo'),
        headerLogoClone: !!document.getElementById('header-logo-clone'),
        content: !!document.getElementById('content')
      },
      computedStyles: {
        bodyBackground: window.getComputedStyle(document.body).backgroundColor,
        navigationBackground: document.getElementById('navigation') ?
          window.getComputedStyle(document.getElementById('navigation')).backgroundColor : 'N/A'
      }
    };

    console.group('🔧 Grid4Portal Debug Information v' + G4.config.version);
    console.log('📊 System Info:', info);
    console.log('🎨 CSS Variables (active theme):', {
      bgPrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary'),
      surfacePrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-surface-primary'),
      accentPrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-accent-primary'),
      textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')
    });
    console.log('🔄 Cache Status:', {
      cssLoaded: G4.cacheDetection.cssLoaded,
      timestamp: new Date().toISOString()
    });
    console.log('🖼️ Logo Status:', info.logo);
    console.groupEnd();

    return info;
  };

  // Enhanced logo debugging
  G4.debugLogo = function() {
    if (!G4.logo) {
      console.log('❌ Logo module not initialized');
      return;
    }

    var status = G4.logo.getStatus();

    console.group('🖼️ Logo Integration Debug');
    console.log('📊 Logo State:', status.state);
    console.log('🔧 Current Strategy:', status.currentStrategy);
    console.log('📍 Logo Element:', status.logoElement);
    console.log('📍 Logo Clone:', status.logoClone);
    console.log('📍 Navigation Element:', status.navigationElement);

    if (status.logoElement) {
      console.log('🎨 Logo Element Styles:', {
        display: status.logoElement.style.display,
        position: status.logoElement.style.position,
        visibility: status.logoElement.style.visibility,
        opacity: status.logoElement.style.opacity
      });
      console.log('📏 Logo Element Rect:', status.logoElement.getBoundingClientRect());
    }

    console.groupEnd();

    return status;
  };

  // Logo reset function for debugging
  G4.resetLogo = function() {
    if (G4.logo && G4.logo.resetLogoIntegration) {
      G4.logo.resetLogoIntegration();
      console.log('🔄 Logo integration reset');

      // Reinitialize after a short delay
      setTimeout(function() {
        G4.logo.init();
        console.log('🔄 Logo integration reinitialized');
      }, 500);
    } else {
      console.log('❌ Logo module not available for reset');
    }
  };

  // Force CSS reload function
  G4.forceReload = function() {
    console.log('🔄 Forcing CSS reload...');
    G4.cacheDetection.handleCacheIssue();
    setTimeout(function() {
      window.location.reload();
    }, 2000);
  };

  // ===================================
  // Enhanced Debug Functions (v4.1.1)
  // ===================================

  // Comprehensive system status function
  G4.debugInfo = function() {
    var info = {
      version: G4.config.version,
      initialized: G4.config.initialized,
      debug: G4.config.debug,
      portalDetected: G4.portalDetection.isNetSapiens,
      currentPage: G4.portalDetection.currentPage,
      logoStatus: G4.logo.getStatus(),
      sidebarState: {
        collapsed: G4.sidebar.isCollapsed,
        mobile: G4.sidebar.isMobile
      },
      currentTheme: G4.themeManager ? G4.themeManager.currentTheme : 'N/A', // Added theme info
      performance: G4.performance.getMetrics(),
      errors: window.Grid4Errors || [],
      elements: {
        navigation: !!document.getElementById('navigation'),
        headerLogo: !!document.getElementById('header-logo'),
        toggleButton: !!document.getElementById('grid4-sidebar-toggle'),
        navButtons: !!document.getElementById('nav-buttons'),
        themeToggleButton: !!document.getElementById('grid4-theme-toggle') // Added theme toggle button check
      }
    };

    console.log('=== Grid4 Portal System Status ===');
    console.table(info);
    console.log('Full details:', info);
    return info;
  };

  // System status with detailed component analysis
  G4.systemStatus = function() {
    var status = {
      core: {
        version: G4.config.version,
        initialized: G4.config.initialized,
        debug: G4.config.debug
      },
      portal: {
        detected: G4.portalDetection.isNetSapiens,
        page: G4.portalDetection.currentPage,
        bodyClasses: document.body.className
      },
      logo: G4.logo.getStatus(),
      navigation: {
        element: !!document.getElementById('navigation'),
        buttons: !!document.getElementById('nav-buttons'),
        collapsed: G4.sidebar.isCollapsed,
        mobile: G4.sidebar.isMobile
      },
      theme: G4.themeManager ? {
        current: G4.themeManager.currentTheme,
        saved: G4.utils.storage.get(G4.themeManager.localStorageKey)
      } : 'N/A', // Added theme status
      performance: G4.performance.getMetrics(),
      errors: window.Grid4Errors || []
    };

    console.log('=== Grid4 System Status Report ===');
    for (var section in status) {
      console.group(section.toUpperCase());
      console.table(status[section]);
      console.groupEnd();
    }

    return status;
  };

  // Manual logo fix function
  G4.fixLogo = function() {
    console.log('=== Manual Logo Fix Initiated ===');
    G4.logo.resetLogoIntegration();
    setTimeout(function() {
      G4.logo.detectAndIntegrateLogo();
    }, 500);
    return 'Logo fix initiated - check console for results';
  };

  // Toggle debug mode
  G4.toggleDebug = function() {
    G4.config.debug = !G4.config.debug;
    localStorage.setItem('grid4_debug', G4.config.debug.toString());
    console.log('Debug mode ' + (G4.config.debug ? 'enabled' : 'disabled'));
    return G4.config.debug;
  };

  // Force reload with cache busting
  G4.forceReload = function() {
    console.log('=== Force Reload with Cache Busting ===');
    var timestamp = Date.now();
    window.location.href = window.location.href.split('?')[0] + '?grid4_cache_bust=' + timestamp;
  };

  // Always expose G4 object globally for debugging and manual access
  window.G4 = G4;

  // Expose for debugging
  if (G4.config.debug) {
    window.Grid4Debug = G4;
  }

  // Always expose debug functions globally
  window.grid4DebugInfo = G4.debugInfo;
  window.grid4SystemStatus = G4.systemStatus;
  window.grid4FixLogo = G4.fixLogo;
  window.grid4ToggleDebug = G4.toggleDebug;
  window.grid4ForceReload = G4.forceReload;
  window.grid4InitializePortal = G4.init;
  
})(jQuery, window, document);
