/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v2.0.0
   Reference-Compliant JavaScript Architecture
   =================================== */

(function($, window, document) {
  'use strict';
  
  // ===================================
  // Namespace & Configuration
  // ===================================
  window.Grid4Skin = window.Grid4Skin || {};
  
  var G4 = window.Grid4Skin;
  
  G4.config = {
    debug: false, // Enable via URL param ?debug=true
    version: '2.0.0',
    features: {
      sidebarCollapse: true,
      keyboardShortcuts: true,
      menuEnhancement: true,
      mobileOptimization: true,
      performanceMonitoring: true,
      ajaxHandling: true
    },
    selectors: {
      wrapper: '.wrapper',
      header: '#header',
      navigation: '#navigation',
      navButtons: '#nav-buttons',
      content: '#content',
      panels: '.panel',
      tables: '.table',
      forms: 'form'
    },
    classes: {
      skinActive: 'portal-skin-active',
      sidebarCollapsed: 'sidebar-collapsed',
      mobileMenuOpen: 'mobile-menu-open'
    }
  };
  
  // Check for debug mode
  var urlParams = new URLSearchParams(window.location.search);
  G4.config.debug = urlParams.get('debug') === 'true' || 
                   localStorage.getItem('g4_debug') === 'true';
  
  // ===================================
  // Utility Functions
  // ===================================
  G4.utils = {
    log: function(message, type, data) {
      if (!G4.config.debug) return;
      var method = console[type] || console.log;
      method.call(console, '[Grid4] ' + message, data || '');
    },
    
    error: function(message, error) {
      this.log(message, 'error', error);
      
      // Report to monitoring if available
      if (window.ga) {
        ga('send', 'exception', {
          'exDescription': message,
          'exFatal': false
        });
      }
    },
    
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
    
    throttle: function(func, limit) {
      var inThrottle;
      return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function() { inThrottle = false; }, limit);
        }
      };
    },
    
    waitForElement: function(selector, callback, maxAttempts) {
      var attempts = 0;
      maxAttempts = maxAttempts || 50;
      
      var check = function() {
        attempts++;
        var $el = $(selector);
        
        if ($el.length) {
          G4.utils.log('Element found: ' + selector + ' (attempt ' + attempts + ')');
          callback($el);
        } else if (attempts < maxAttempts) {
          setTimeout(check, 100);
        } else {
          G4.utils.log('Element not found after ' + maxAttempts + ' attempts: ' + selector, 'warn');
        }
      };
      
      check();
    },
    
    addBodyClass: function(className) {
      var $body = $('body');
      if (!$body.hasClass(className)) {
        $body.addClass(className);
        G4.utils.log('Added body class: ' + className);
      }
    },
    
    removeBodyClass: function(className) {
      var $body = $('body');
      if ($body.hasClass(className)) {
        $body.removeClass(className);
        G4.utils.log('Removed body class: ' + className);
      }
    },
    
    storage: {
      get: function(key) {
        try {
          var value = localStorage.getItem('g4_' + key);
          return value ? JSON.parse(value) : null;
        } catch(e) {
          G4.utils.error('Storage get error for key: ' + key, e);
          return null;
        }
      },
      
      set: function(key, value) {
        try {
          localStorage.setItem('g4_' + key, JSON.stringify(value));
          return true;
        } catch(e) {
          G4.utils.error('Storage set error for key: ' + key, e);
          return false;
        }
      },
      
      remove: function(key) {
        try {
          localStorage.removeItem('g4_' + key);
          return true;
        } catch(e) {
          G4.utils.error('Storage remove error for key: ' + key, e);
          return false;
        }
      }
    },
    
    safeExecute: function(fn, context, errorMessage) {
      try {
        return fn.call(context || this);
      } catch (error) {
        G4.utils.error(errorMessage || 'Safe execute failed', error);
        return null;
      }
    }
  };
  
  // ===================================
  // Core Modules
  // ===================================
  
  // Page Detection Module
  G4.pageDetection = {
    currentPage: null,
    
    init: function() {
      var path = window.location.pathname;
      var segments = path.split('/').filter(function(segment) {
        return segment.length > 0;
      });
      
      // Extract page from path
      this.currentPage = segments[segments.length - 1] || 'home';
      
      // Clean up page name
      if (this.currentPage.includes('?')) {
        this.currentPage = this.currentPage.split('?')[0];
      }
      
      // Add page class
      G4.utils.addBodyClass('g4-page-' + this.currentPage);
      
      // Store for other modules
      G4.currentPage = this.currentPage;
      
      G4.utils.log('Current page detected: ' + this.currentPage);
      
      // Trigger page detection event
      $(document).trigger('g4:page:detected', [this.currentPage]);
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
      this.addToggleButton();
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
    
    addToggleButton: function() {
      if ($('#g4-sidebar-toggle').length) return;
      
      var $toggle = $('<button>', {
        id: 'g4-sidebar-toggle',
        class: 'g4-sidebar-toggle',
        html: '<i class="fa fa-bars" aria-hidden="true"></i>',
        'aria-label': 'Toggle sidebar',
        css: {
          position: 'fixed',
          top: '14px',
          left: this.isMobile ? '12px' : '12px',
          zIndex: 1001,
          background: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
          color: 'var(--g4-text-primary)',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)',
          transition: 'all 150ms ease'
        }
      });
      
      // Add hover effect
      $toggle.hover(
        function() { 
          $(this).css('background', 'rgba(0, 212, 255, 0.2)'); 
        },
        function() { 
          $(this).css('background', 'rgba(0, 0, 0, 0.7)'); 
        }
      );
      
      $('body').append($toggle);
    },
    
    bindEvents: function() {
      var self = this;
      
      // Toggle button click
      $(document).on('click', '#g4-sidebar-toggle', function(e) {
        e.preventDefault();
        self.toggle();
      });
      
      // Keyboard shortcuts
      if (G4.config.features.keyboardShortcuts) {
        $(document).on('keydown.g4-sidebar', function(e) {
          // Ctrl/Cmd + B
          if ((e.ctrlKey || e.metaKey) && e.which === 66) {
            e.preventDefault();
            self.toggle();
          }
          
          // Escape to close on mobile
          if (e.which === 27 && self.isMobile && !self.isCollapsed) {
            self.close();
          }
        });
      }
      
      // Window resize handler
      $(window).on('resize.g4-sidebar', G4.utils.debounce(function() {
        var wasMobile = self.isMobile;
        self.checkMobile();
        
        if (wasMobile !== self.isMobile) {
          self.handleMobileChange();
        }
        
        self.updateTogglePosition();
      }, 250));
      
      // Click outside to close on mobile
      $(document).on('click.g4-sidebar', function(e) {
        if (self.isMobile && !self.isCollapsed) {
          var $target = $(e.target);
          if (!$target.closest('#navigation').length && 
              !$target.closest('#g4-sidebar-toggle').length) {
            self.close();
          }
        }
      });
    },
    
    toggle: function() {
      if (this.isMobile) {
        // On mobile, toggle the mobile menu
        this.isCollapsed = !this.isCollapsed;
        G4.utils.addBodyClass(G4.config.classes.mobileMenuOpen);
        if (this.isCollapsed) {
          G4.utils.removeBodyClass(G4.config.classes.mobileMenuOpen);
        }
      } else {
        // On desktop, toggle collapse
        this.isCollapsed = !this.isCollapsed;
      }
      
      this.applyState();
      this.saveState();
      
      // Trigger event for other modules
      $(document).trigger('g4:sidebar:toggled', [this.isCollapsed, this.isMobile]);
      
      G4.utils.log('Sidebar toggled: collapsed=' + this.isCollapsed + ', mobile=' + this.isMobile);
    },
    
    close: function() {
      if (this.isMobile) {
        this.isCollapsed = true;
        G4.utils.removeBodyClass(G4.config.classes.mobileMenuOpen);
        this.applyState();
      }
    },
    
    applyState: function() {
      if (this.isMobile) {
        if (this.isCollapsed) {
          G4.utils.removeBodyClass(G4.config.classes.mobileMenuOpen);
        } else {
          G4.utils.addBodyClass(G4.config.classes.mobileMenuOpen);
        }
      } else {
        if (this.isCollapsed) {
          G4.utils.addBodyClass(G4.config.classes.sidebarCollapsed);
        } else {
          G4.utils.removeBodyClass(G4.config.classes.sidebarCollapsed);
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
      G4.utils.removeBodyClass(G4.config.classes.sidebarCollapsed);
      G4.utils.removeBodyClass(G4.config.classes.mobileMenuOpen);
      
      // Reload state for new mode
      this.loadState();
      this.applyState();
    },
    
    updateTogglePosition: function() {
      var $toggle = $('#g4-sidebar-toggle');
      if ($toggle.length) {
        $toggle.css('left', this.isMobile ? '12px' : '12px');
      }
    }
  };
  
  // Menu Enhancement Module
  G4.menuEnhancement = {
    labelMap: {
      'Auto Attendants': 'Attendants',
      'Call Queues': 'Queues', 
      'Music On Hold': 'Music',
      'Time Frames': 'Schedules',
      'Route Profiles': 'Routes',
      'Device Inventory': 'Devices'
    },
    
    init: function() {
      if (!G4.config.features.menuEnhancement) return;
      
      this.shortenLabels();
      this.addTooltips();
      this.cleanupMenuStructure();
      
      G4.utils.log('Menu enhancement initialized');
    },
    
    shortenLabels: function() {
      var self = this;
      
      G4.utils.safeExecute(function() {
        $(G4.config.selectors.navButtons + ' .nav-text').each(function() {
          var $this = $(this);
          var text = $this.text().trim();
          
          if (self.labelMap[text]) {
            $this.text(self.labelMap[text]);
            $this.attr('data-original-text', text);
          }
        });
      }, this, 'Failed to shorten menu labels');
    },
    
    addTooltips: function() {
      G4.utils.safeExecute(function() {
        $(G4.config.selectors.navButtons + ' li a.nav-link').each(function() {
          var $this = $(this);
          var $text = $this.find('.nav-text');
          var text = $text.attr('data-original-text') || $text.text().trim();
          
          if (text && !$this.attr('title')) {
            $this.attr('title', text);
          }
        });
      }, this, 'Failed to add tooltips');
    },
    
    cleanupMenuStructure: function() {
      G4.utils.safeExecute(function() {
        // Remove any redundant navigation elements
        $(G4.config.selectors.navButtons + ' .nav-button').remove();
        $(G4.config.selectors.navButtons + ' .nav-bg-image').remove();
        $(G4.config.selectors.navButtons + ' .nav-arrow').remove();
        
        // Ensure proper nav-link class structure
        $(G4.config.selectors.navButtons + ' li a').each(function() {
          var $this = $(this);
          if (!$this.hasClass('nav-link')) {
            $this.addClass('nav-link');
          }
        });
      }, this, 'Failed to cleanup menu structure');
    }
  };
  
  // Mobile Optimization Module
  G4.mobileOptimization = {
    init: function() {
      if (!G4.config.features.mobileOptimization) return;
      
      this.addViewportMeta();
      this.optimizeTouch();
      this.handleOrientation();
      
      G4.utils.log('Mobile optimization initialized');
    },
    
    addViewportMeta: function() {
      if (!$('meta[name="viewport"]').length) {
        $('<meta>', {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=no'
        }).appendTo('head');
      }
    },
    
    optimizeTouch: function() {
      // Add touch-friendly classes
      G4.utils.addBodyClass('g4-touch-optimized');
      
      // Improve touch targets
      var touchStyle = $('<style>').text(`
        @media (max-width: 768px) {
          .btn { min-height: 44px; }
          .nav-link { min-height: 48px; }
          .form-control { min-height: 44px; }
        }
      `);
      $('head').append(touchStyle);
    },
    
    handleOrientation: function() {
      $(window).on('orientationchange.g4-mobile', G4.utils.debounce(function() {
        // Close sidebar on orientation change
        if (G4.sidebar && G4.sidebar.isMobile) {
          G4.sidebar.close();
        }
        
        $(document).trigger('g4:orientation:changed');
      }, 300));
    }
  };
  
  // Performance Monitoring Module
  G4.performance = {
    marks: {},
    
    init: function() {
      if (!G4.config.features.performanceMonitoring) return;
      
      this.mark('init-start');
      this.monitorConsoleErrors();
      
      G4.utils.log('Performance monitoring initialized');
    },
    
    mark: function(name) {
      this.marks[name] = performance.now();
      if (G4.config.debug) {
        console.time('[Grid4] ' + name);
      }
    },
    
    measure: function(name, startMark) {
      if (!this.marks[startMark]) return;
      
      var duration = performance.now() - this.marks[startMark];
      G4.utils.log(name + ' completed in ' + duration.toFixed(2) + 'ms');
      
      if (G4.config.debug) {
        console.timeEnd('[Grid4] ' + startMark);
      }
      
      return duration;
    },
    
    monitorConsoleErrors: function() {
      var originalError = console.error;
      var errorCount = 0;
      
      console.error = function() {
        errorCount++;
        originalError.apply(console, arguments);
        
        if (errorCount > 10) {
          G4.utils.log('High error count detected: ' + errorCount, 'warn');
        }
      };
    },
    
    getMetrics: function() {
      return {
        userAgent: navigator.userAgent,
        viewport: window.innerWidth + 'x' + window.innerHeight,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        marks: this.marks
      };
    }
  };
  
  // AJAX Handler Module
  G4.ajaxHandler = {
    init: function() {
      if (!G4.config.features.ajaxHandling) return;
      
      this.bindAjaxEvents();
      
      G4.utils.log('AJAX handler initialized');
    },
    
    bindAjaxEvents: function() {
      var self = this;
      
      // Handle AJAX complete events
      $(document).ajaxComplete(function(event, xhr, settings) {
        G4.utils.log('AJAX completed: ' + (settings.url || 'unknown'));
        
        // Re-run enhancement modules
        setTimeout(function() {
          self.reapplyEnhancements();
        }, 100);
        
        // Trigger custom event
        $(document).trigger('g4:ajax:complete', [xhr, settings]);
      });
      
      // Handle AJAX errors
      $(document).ajaxError(function(event, xhr, settings, error) {
        G4.utils.error('AJAX error on: ' + (settings.url || 'unknown'), error);
        $(document).trigger('g4:ajax:error', [xhr, settings, error]);
      });
    },
    
    reapplyEnhancements: function() {
      G4.utils.safeExecute(function() {
        // Re-run menu enhancements
        G4.menuEnhancement.shortenLabels();
        G4.menuEnhancement.addTooltips();
        
        // Re-detect page
        G4.pageDetection.init();
        
        G4.utils.log('Enhancements reapplied after AJAX');
      }, this, 'Failed to reapply enhancements after AJAX');
    }
  };
  
  // ===================================
  // Initialization System
  // ===================================
  G4.init = function() {
    G4.performance.mark('modules-start');
    G4.utils.log('Initializing Grid4 Skin v' + G4.config.version);
    
    // Add main marker class
    G4.utils.addBodyClass(G4.config.classes.skinActive);
    
    // Initialize core modules
    G4.pageDetection.init();
    G4.sidebar.init();
    G4.menuEnhancement.init();
    G4.mobileOptimization.init();
    G4.performance.init();
    G4.ajaxHandler.init();
    
    G4.performance.measure('Module initialization', 'modules-start');
    
    // Mark as initialized
    G4.initialized = true;
    G4.initTime = Date.now();
    
    // Trigger initialization complete event
    $(document).trigger('g4:initialized');
    
    G4.utils.log('Grid4 Skin initialization complete');
    
    // Performance summary in debug mode
    if (G4.config.debug) {
      setTimeout(function() {
        console.table(G4.performance.getMetrics());
      }, 1000);
    }
  };
  
  G4.waitForReady = function() {
    // Wait for required DOM elements
    G4.utils.waitForElement(G4.config.selectors.navigation, function() {
      G4.utils.waitForElement(G4.config.selectors.navButtons, function() {
        // Small delay to ensure portal is fully ready
        setTimeout(function() {
          G4.init();
        }, 100);
      });
    });
  };
  
  // ===================================
  // Error Boundary
  // ===================================
  window.onerror = function(msg, url, line, col, error) {
    G4.utils.error('Global error: ' + msg + ' at ' + url + ':' + line, error);
    return false; // Don't suppress default browser error handling
  };
  
  // ===================================
  // Public API
  // ===================================
  G4.api = {
    version: G4.config.version,
    toggle: function() { return G4.sidebar.toggle(); },
    debug: function(enabled) { 
      G4.config.debug = enabled;
      G4.utils.storage.set('debug', enabled);
    },
    getMetrics: function() { return G4.performance.getMetrics(); },
    reinit: function() { 
      G4.utils.log('Manual reinitialization requested');
      G4.init(); 
    }
  };
  
  // ===================================
  // Auto-Start
  // ===================================
  if (document.readyState === 'loading') {
    $(document).ready(function() {
      G4.waitForReady();
    });
  } else {
    // DOM already ready
    G4.waitForReady();
  }
  
})(jQuery, window, document);