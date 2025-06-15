/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v3.0.0
   Fresh JavaScript Implementation
   Reference-Compliant Architecture
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
    version: '3.0.0',
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
        this.isCollapsed = G4.utils.storage.get('sidebarCollapsed') || false;
      }
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
          zIndex: 1002,
          background: 'rgba(26, 35, 50, 0.9)',
          border: 'none',
          color: '#ffffff',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
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
  
  // ===================================
  // Initialization & Main Entry Point
  // ===================================
  G4.init = function() {
    if (this.config.initialized) {
      this.utils.log('Grid4Portal already initialized, skipping...');
      return;
    }
    
    this.utils.log('Initializing Grid4Portal v' + this.config.version);
    
    // Initialize performance monitoring first
    this.performance.init();
    this.performance.mark('init_start');
    
    // Initialize core modules
    this.portalDetection.init();
    
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
  
  // Expose for debugging
  if (G4.config.debug) {
    window.Grid4Debug = G4;
  }
  
})(jQuery, window, document);
