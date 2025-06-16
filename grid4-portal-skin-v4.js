/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v4.1.1
   Enhanced Native Logo Integration + Critical Fixes
   Performance Optimized Architecture
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
    version: '4.1.1',
    debug: false,
    initialized: false,
    
    // Feature flags
    features: {
      sidebarCollapse: true,
      mobileOptimization: true,
      keyboardShortcuts: true,
      performanceMonitoring: true,
      ajaxHandling: true
    },
    
    // DOM selectors (Reference compliant)
    selectors: {
      wrapper: '.wrapper',
      header: '#header',
      navigation: '#navigation',
      navButtons: '#nav-buttons',
      content: '#content',
      panels: '.panel',
      tables: '.table'
    },
    
    // CSS classes
    classes: {
      portalActive: 'grid4-portal-active',
      sidebarCollapsed: 'grid4-sidebar-collapsed',
      mobileMenuOpen: 'grid4-mobile-menu-open'
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

      for (var i = 0; i < this.strategies.length - 1; i++) { // Exclude css-fallback for now
        var strategy = this.strategies[i];

        if (this.executeStrategy(strategy, headerLogo, navigation)) {
          this.state.strategyUsed = strategy;
          this.state.logoRelocated = true;
          G4.utils.log('Logo integration successful using strategy: ' + strategy);
          return;
        }
      }

      // If all strategies failed, use fallback
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
      // Clone logo to navigation, hide original
      var logoClone = headerLogo.cloneNode(true);
      logoClone.id = 'header-logo-clone';
      logoClone.setAttribute('data-grid4-clone', 'true');

      var navButtons = document.getElementById('nav-buttons');
      if (navButtons) {
        navigation.insertBefore(logoClone, navButtons);
      } else {
        navigation.insertBefore(logoClone, navigation.firstChild);
      }

      // Hide original logo
      headerLogo.style.display = 'none';
      headerLogo.setAttribute('data-grid4-hidden', 'true');

      G4.utils.log('Logo cloned using DOM cloning strategy');
      return true;
    },

    domRelocationStrategy: function(headerLogo, navigation) {
      // Original approach - move DOM element
      var navButtons = document.getElementById('nav-buttons');

      // Store original parent for potential restoration
      headerLogo.setAttribute('data-grid4-original-parent', headerLogo.parentNode.id || 'header');

      if (navButtons) {
        navigation.insertBefore(headerLogo, navButtons);
      } else {
        navigation.insertBefore(headerLogo, navigation.firstChild);
      }

      // Ensure visibility
      headerLogo.style.display = 'block';
      headerLogo.style.visibility = 'visible';
      headerLogo.style.opacity = '1';
      headerLogo.setAttribute('data-grid4-relocated', 'dom-relocation');

      G4.utils.log('Logo relocated using DOM relocation strategy');
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

  // Contacts Dock Enhancement Module
  G4.contactsDock = {
    isCollapsed: false,
    dockElement: null,

    init: function() {
      this.enhanceContactsDock();
      this.addCollapseToggle();
      this.loadDockState();
      this.unifyIconography();
      this.handleBrokenNativeJS();
      this.fixBrokenAvatars();
      this.improveContactInteractions();
      this.enhanceToggleButtons();
      this.addLoadingStates();
      G4.utils.log('Contacts dock enhancements initialized');
    },

    enhanceContactsDock: function() {
      var self = this;
      G4.utils.waitForElement('.dock-body', function($dock) {
        // Store reference to dock element
        self.dockElement = $dock;

        // Add modern styling classes
        $dock.addClass('grid4-contacts-dock');

        // Ensure proper structure
        self.ensureProperStructure($dock);

        G4.utils.log('Contacts dock structure enhanced');
      });
    },

    addCollapseToggle: function() {
      var self = this;
      G4.utils.waitForElement('.dock-body', function($dock) {
        // Look for existing collapse button (NetSapiens native or our custom)
        var $existingToggle = $dock.find('.dock-toggle, .dock-collapse, .dock-minimize, .grid4-dock-toggle');

        if ($existingToggle.length === 0) {
          // Create our own toggle button
          var $toggleButton = $('<button>', {
            class: 'grid4-dock-toggle',
            'aria-label': 'Toggle contacts dock',
            html: '<i class="fa fa-chevron-down" aria-hidden="true"></i>',
            css: {
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'var(--grid4-surface-elevated)',
              border: '1px solid var(--grid4-border-color)',
              color: 'var(--grid4-text-secondary)',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              zIndex: 10,
              transition: 'all 150ms ease'
            }
          });

          // Add hover effect
          $toggleButton.hover(
            function() {
              $(this).css({
                background: 'var(--grid4-accent-blue)',
                color: 'var(--grid4-text-primary)',
                borderColor: 'var(--grid4-accent-blue)'
              });
            },
            function() {
              $(this).css({
                background: 'var(--grid4-surface-elevated)',
                color: 'var(--grid4-text-secondary)',
                borderColor: 'var(--grid4-border-color)'
              });
            }
          );

          // Add to dock header
          var $header = $dock.find('.dock-contacts-header.top');
          if ($header.length) {
            $header.css('position', 'relative').append($toggleButton);
          } else {
            $dock.css('position', 'relative').prepend($toggleButton);
          }

          $existingToggle = $toggleButton;
        }

        // Bind toggle functionality to any existing toggle buttons
        $dock.find('.dock-toggle, .dock-collapse, .dock-minimize, .grid4-dock-toggle').off('click.grid4-dock').on('click.grid4-dock', function(e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggleDock();
        });

        // Also try to intercept native NetSapiens dock controls if they exist
        $dock.find('button[onclick*="dock"], button[onclick*="minimize"], button[onclick*="close"]').off('click.grid4-dock').on('click.grid4-dock', function(e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggleDock();
        });

        G4.utils.log('Contacts dock toggle button added and bound');
      });
    },

    toggleDock: function() {
      this.isCollapsed = !this.isCollapsed;
      this.applyDockState();
      this.saveDockState();

      G4.utils.log('Contacts dock toggled', 'info', { collapsed: this.isCollapsed });
    },

    applyDockState: function() {
      if (!this.dockElement) return;

      var $dock = this.dockElement;
      var $toggle = $dock.find('.grid4-dock-toggle, .dock-toggle, .dock-collapse, .dock-minimize');

      if (this.isCollapsed) {
        // Collapse the dock
        $dock.css({
          height: '60px',
          overflow: 'hidden'
        });

        // Update toggle icon
        $toggle.find('i').removeClass('fa-chevron-down fa-chevron-up').addClass('fa-chevron-up');

        // Hide dock content except header
        $dock.find('.dock-contacts-header.top').siblings().hide();

        $dock.addClass('grid4-dock-collapsed');
      } else {
        // Expand the dock
        $dock.css({
          height: '',
          overflow: ''
        });

        // Update toggle icon
        $toggle.find('i').removeClass('fa-chevron-down fa-chevron-up').addClass('fa-chevron-down');

        // Show dock content
        $dock.find('.dock-contacts-header.top').siblings().show();

        $dock.removeClass('grid4-dock-collapsed');
      }
    },

    loadDockState: function() {
      this.isCollapsed = G4.utils.storage.get('contactsDockCollapsed') || false;

      // Apply state once dock is available
      var self = this;
      G4.utils.waitForElement('.dock-body', function() {
        setTimeout(function() {
          self.applyDockState();
        }, 500); // Small delay to ensure dock is fully rendered
      });
    },

    saveDockState: function() {
      G4.utils.storage.set('contactsDockCollapsed', this.isCollapsed);
    },

    unifyIconography: function() {
      // Replace NetSapiens icons with FontAwesome equivalents
      var iconMap = {
        'nsicon-video': 'fa fa-video-camera',
        'nsicon-message': 'fa fa-comment',
        'nsicon-call': 'fa fa-phone',
        'nsicon-transfer': 'fa fa-exchange',
        'iconfont-sort': 'fa fa-sort',
        'iconfont-search': 'fa fa-search',
        'nsicon-minimize': 'fa fa-chevron-down',
        'nsicon-close': 'fa fa-times'
      };

      // Apply icon replacements
      for (var oldClass in iconMap) {
        $('.dock-body .' + oldClass).removeClass(oldClass).addClass(iconMap[oldClass]);
      }

      // Fix any remaining icon elements
      $('.dock-body .nsicon, .dock-body .iconfont').each(function() {
        var $icon = $(this);
        var classes = $icon.attr('class').split(' ');
        var hasReplacement = false;

        for (var i = 0; i < classes.length; i++) {
          if (iconMap[classes[i]]) {
            $icon.removeClass(classes[i]).addClass(iconMap[classes[i]]);
            hasReplacement = true;
            break;
          }
        }

        // If no specific replacement found, use a generic icon
        if (!hasReplacement && !$icon.hasClass('fa')) {
          $icon.addClass('fa fa-circle');
        }
      });

      G4.utils.log('Contacts dock iconography unified');
    },

    handleBrokenNativeJS: function() {
      // Since the native NetSapiens JS is broken, we need to handle some basic functionality
      var self = this;

      // Check for connection errors and style them
      G4.utils.waitForElement('.dock-body', function($dock) {
        // Monitor for connection error messages
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
              // Look for error messages and style them
              $dock.find('.alert-danger, .error-message, .connection-error').each(function() {
                var $error = $(this);
                if (!$error.hasClass('grid4-styled')) {
                  $error.addClass('grid4-styled');
                  G4.utils.log('Styled connection error message');
                }
              });

              // Re-apply icon unification to new elements
              self.unifyIconography();
            }
          });
        });

        observer.observe($dock[0], {
          childList: true,
          subtree: true
        });
      });

      // Try to provide basic functionality even without native JS
      $(document).on('click', '.dock-body .btn, .dock-body button', function(e) {
        var $btn = $(this);
        var btnText = $btn.text().toLowerCase();

        // Add visual feedback for button clicks
        $btn.addClass('grid4-btn-clicked');
        setTimeout(function() {
          $btn.removeClass('grid4-btn-clicked');
        }, 200);

        // Log the action for debugging
        G4.utils.log('Dock button clicked: ' + btnText);
      });
    },

    ensureProperStructure: function($dock) {
      // Ensure header has proper classes
      var $header = $dock.find('.dock-contacts-header.top');
      if ($header.length) {
        $header.addClass('grid4-contacts-header');
      }

      // Ensure filter bar has proper structure
      var $filterBar = $dock.find('#contacts-sort-search');
      if ($filterBar.length) {
        $filterBar.addClass('grid4-filter-bar');
      }

      // Ensure toggle buttons have proper structure
      var $toggleButtons = $dock.find('.btn-group-toggle');
      if ($toggleButtons.length) {
        $toggleButtons.addClass('grid4-toggle-buttons');
      }
    },

    fixBrokenAvatars: function() {
      // Monitor for new contact rows and fix avatars
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            $(mutation.addedNodes).find('.contact-dock-gravatar img').each(function() {
              G4.contactsDock.handleAvatarImage($(this));
            });
          }
        });
      });

      // Start observing
      var contactsContainer = document.querySelector('#scroll-container-contacts');
      if (contactsContainer) {
        observer.observe(contactsContainer, {
          childList: true,
          subtree: true
        });
      }

      // Fix existing avatars
      $('.contact-dock-gravatar img').each(function() {
        G4.contactsDock.handleAvatarImage($(this));
      });
    },

    handleAvatarImage: function($img) {
      var img = $img[0];
      if (!img) return;

      // Check if image loads successfully
      img.onerror = function() {
        // Remove the broken image element completely
        $img.remove();
        G4.utils.log('Removed broken avatar image', 'info');
      };

      img.onload = function() {
        // Image loaded successfully, ensure it's visible
        $img.css('display', 'block');
      };

      // If image src is already set and it's a 404, trigger error handler
      if (img.src && img.complete && img.naturalWidth === 0) {
        img.onerror();
      }
    },

    improveContactInteractions: function() {
      // Enhanced hover interactions for contact rows
      $(document).on('mouseenter', '.contact-row', function() {
        var $row = $(this);
        $row.addClass('grid4-contact-hover');

        // Show action buttons with staggered animation
        var $buttons = $row.find('.contact-buttons .btn');
        $buttons.each(function(index) {
          var $btn = $(this);
          setTimeout(function() {
            $btn.addClass('grid4-btn-visible');
          }, index * 50);
        });
      });

      $(document).on('mouseleave', '.contact-row', function() {
        var $row = $(this);
        $row.removeClass('grid4-contact-hover');
        $row.find('.contact-buttons .btn').removeClass('grid4-btn-visible');
      });

      // Improve click handling for contact rows
      $(document).on('click', '.contact-row', function(e) {
        // Don't trigger if clicking on action buttons
        if ($(e.target).closest('.contact-buttons').length) {
          return;
        }

        var $row = $(this);
        var contactName = $row.find('.contact-name').text();
        G4.utils.log('Contact selected: ' + contactName);

        // Add visual feedback
        $row.addClass('grid4-contact-selected');
        setTimeout(function() {
          $row.removeClass('grid4-contact-selected');
        }, 200);
      });
    },

    enhanceToggleButtons: function() {
      // Improve Contacts/Recents toggle behavior
      $(document).on('click', '#contacts-btn-toggle, #recent-btn-toggle', function(e) {
        var $btn = $(this);
        var $toggleGroup = $btn.closest('.btn-group-toggle');

        // Remove active class from siblings
        $toggleGroup.find('.btn').removeClass('active');

        // Add active class to clicked button
        $btn.addClass('active');

        // Add visual feedback
        $btn.addClass('grid4-toggle-clicked');
        setTimeout(function() {
          $btn.removeClass('grid4-toggle-clicked');
        }, 150);

        var isRecents = $btn.attr('id') === 'recent-btn-toggle';
        G4.utils.log('Switched to: ' + (isRecents ? 'Recents' : 'Contacts'));
      });
    },

    addLoadingStates: function() {
      // Add loading states for better UX
      var $contactsContainer = $('#scroll-container-contacts');
      var $recentsContainer = $('#scroll-container-recent-sessions');

      if ($contactsContainer.length) {
        this.addLoadingStateToContainer($contactsContainer, 'contacts');
      }

      if ($recentsContainer.length) {
        this.addLoadingStateToContainer($recentsContainer, 'recents');
      }
    },

    addLoadingStateToContainer: function($container, type) {
      // Monitor for empty states
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            var $container = $(mutation.target);
            var hasContent = $container.find('.contact-row, .recent-row').length > 0;

            if (!hasContent && !$container.find('.contacts-loading, .contacts-empty').length) {
              // Add empty state
              var emptyMessage = type === 'contacts' ? 'No contacts found' : 'No recent conversations';
              $container.append('<div class="contacts-empty">' + emptyMessage + '</div>');
            } else if (hasContent) {
              // Remove empty state
              $container.find('.contacts-empty').remove();
            }
          }
        });
      });

      observer.observe($container[0], {
        childList: true,
        subtree: true
      });
    }
  };

  // Layout Fixes Module (Performance Optimized)
  G4.layoutFixes = {
    modalObserver: null,

    init: function() {
      this.fixBackgroundIssues();
      this.fixHeaderOverlap();
      this.fixNavigationIcons();
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
        'background-color': 'var(--grid4-primary-dark)',
        'overflow-x': 'hidden'
      });

      // Fix any containers with white backgrounds
      $('.container, .container-fluid, .row, .main-content, .page-content').each(function() {
        var $this = $(this);
        if ($this.css('background-color') === 'rgb(255, 255, 255)' ||
            $this.css('background-color') === '#ffffff' ||
            $this.css('background-color') === 'white') {
          $this.css('background-color', 'var(--grid4-primary-dark)');
        }
      });
    },

    fixHeaderOverlap: function() {
      // Ensure header has proper z-index
      $('#header').css('z-index', '1060');

      // Style domain/masquerading elements
      $('.domain-info, .masquerade-info, .breadcrumb').css({
        'background': 'var(--grid4-surface-elevated)',
        'color': 'var(--grid4-text-primary)',
        'border': '1px solid var(--grid4-border-color)',
        'border-radius': '4px',
        'padding': '4px 12px',
        'margin': '0 8px',
        'font-size': '12px'
      });
    },

    fixNavigationIcons: function() {
      var iconMap = {
        'call center': 'f2a0',
        'call history': 'f1da',
        'history': 'f1da',
        'reports': 'f1c3',
        'report': 'f1c3',
        'settings': 'f013',
        'setting': 'f013',
        'domains': 'f0ac',
        'domain': 'f0ac',
        'sip trunks': 'f1e6',
        'trunk': 'f1e6',
        'devices': 'f10a',
        'device': 'f10a',
        'phone numbers': 'f095',
        'numbers': 'f095',
        'billing': 'f155',
        'support': 'f1cd',
        'help': 'f1cd'
      };

      $('#nav-buttons li a.nav-link').each(function(index) {
        var $this = $(this);
        var $li = $this.closest('li');
        var text = $this.text().toLowerCase().trim();

        // Skip if already has an ID (already mapped)
        if ($li.attr('id') && $li.attr('id').startsWith('nav-')) {
          return;
        }

        // Find matching icon
        var iconCode = null;
        for (var key in iconMap) {
          if (text.includes(key)) {
            iconCode = iconMap[key];
            break;
          }
        }

        // Use default if no match found
        if (!iconCode) {
          iconCode = 'f0c9'; // bars
        }

        // Add icon CSS
        var childIndex = $li.index() + 1;
        var iconCSS = `
          #nav-buttons li:nth-child(${childIndex}) a.nav-link::before {
            content: "\\${iconCode}" !important;
            font-family: "FontAwesome", "Font Awesome 5 Free" !important;
            font-weight: 900 !important;
          }
        `;

        var style = document.createElement('style');
        style.textContent = iconCSS;
        document.head.appendChild(style);
      });
    },

    fixDomainContext: function() {
      // Watch for dynamic domain context changes
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            // Fix domain context elements
            $('.domain-info, .masquerade-info, .breadcrumb').css({
              'background': 'var(--grid4-surface-elevated)',
              'color': 'var(--grid4-text-primary)',
              'border': '1px solid var(--grid4-border-color)',
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

        // Apply dark theme to modal container
        $modal.css({
          'background': 'var(--grid4-surface-dark)',
          'color': 'var(--grid4-text-primary)',
          'border': '1px solid var(--grid4-border-color)'
        });

        // Fix all text elements within modal
        $modal.find('*').each(function() {
          var $element = $(this);
          var tagName = $element.prop('tagName').toLowerCase();

          // Fix text color for various elements
          if (['p', 'span', 'div', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            if ($element.css('color') === 'rgb(255, 255, 255)' ||
                $element.css('color') === '#ffffff' ||
                $element.css('color') === 'white') {
              $element.css('color', 'var(--grid4-text-primary)');
            }
          }

          // Fix form elements
          if (['input', 'textarea', 'select'].includes(tagName)) {
            $element.css({
              'background': 'var(--grid4-surface-elevated)',
              'color': 'var(--grid4-text-primary)',
              'border': '1px solid var(--grid4-border-color)'
            });
          }

          // Fix buttons
          if (tagName === 'button' || $element.hasClass('btn')) {
            if ($element.hasClass('btn-primary')) {
              $element.css({
                'background': 'var(--grid4-accent-blue)',
                'color': 'var(--grid4-primary-dark)',
                'border-color': 'var(--grid4-accent-blue)'
              });
            } else {
              $element.css({
                'background': 'var(--grid4-surface-elevated)',
                'color': 'var(--grid4-text-primary)',
                'border': '1px solid var(--grid4-border-color)'
              });
            }
          }
        });
      });

      // Fix any tables in modals
      $('.modal table, .popup table, .dialog table').each(function() {
        var $table = $(this);
        $table.css({
          'background': 'var(--grid4-surface-dark)',
          'color': 'var(--grid4-text-primary)'
        });

        $table.find('th').css({
          'background': 'var(--grid4-surface-elevated)',
          'color': 'var(--grid4-text-primary)',
          'border-color': 'var(--grid4-border-color)'
        });

        $table.find('td').css({
          'color': 'var(--grid4-text-primary)',
          'border-color': 'var(--grid4-border-color)'
        });
      });
    }
  };

  // ===================================
  // JavaScript Fixes & Compatibility
  // ===================================
  G4.fixMomentTz = function() {
    // Fix moment.tz function missing error that breaks usage statistics
    if (typeof moment !== 'undefined' && !moment.tz) {
      this.utils.log('Adding moment.tz fallback for usage statistics...');
      moment.tz = function(date, timezone) {
        // Simple fallback - just return the moment object
        // This prevents the "moment.tz is not a function" error
        return moment(date);
      };
      this.utils.log('moment.tz fallback added successfully');
    }
  };

  // ===================================
  // Cache Busting & Regression Detection
  // ===================================
  G4.cacheDetection = {
    expectedVersion: '4.0.0',
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
      testElement.className = 'grid4-portal-active';
      document.body.appendChild(testElement);

      var computedStyle = window.getComputedStyle(testElement);
      this.cssLoaded = computedStyle.overflow === 'hidden';

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
          if (!link.href.includes('?v=')) {
            var separator = link.href.includes('?') ? '&' : '?';
            link.href += separator + 'v=' + Date.now();
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
      var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.css';
      var cacheBuster = '?v=' + Date.now() + '&cb=' + Math.random().toString(36).substr(2, 9);

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
                  node.classList && node.classList.contains('panel') ||
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

    // Fix moment.tz function missing error
    this.fixMomentTz();

    // Initialize cache detection and regression monitoring
    this.cacheDetection.init();

    // Initialize performance monitoring first
    this.performance.init();
    this.performance.mark('init_start');

    // Initialize core modules
    this.portalDetection.init();
    this.logo.init();
    this.layoutFixes.init();
    this.uiEnhancements.init();
    this.contactsDock.init();

    // Wait for navigation element before proceeding
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
  // Auto-initialization
  // ===================================
  $(document).ready(function() {
    // Small delay to ensure NetSapiens portal is ready
    setTimeout(function() {
      G4.init();
    }, 100);
  });
  
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
    console.log('🎨 CSS Variables:', {
      primaryDark: getComputedStyle(document.documentElement).getPropertyValue('--grid4-primary-dark'),
      surfaceDark: getComputedStyle(document.documentElement).getPropertyValue('--grid4-surface-dark'),
      accentBlue: getComputedStyle(document.documentElement).getPropertyValue('--grid4-accent-blue')
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
      performance: G4.performance.getMetrics(),
      errors: window.Grid4Errors || [],
      elements: {
        navigation: !!document.getElementById('navigation'),
        headerLogo: !!document.getElementById('header-logo'),
        toggleButton: !!document.getElementById('grid4-sidebar-toggle'),
        navButtons: !!document.getElementById('nav-buttons')
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
  
})(jQuery, window, document);
