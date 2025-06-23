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
  
  // Logo Management Module
  G4.logo = {
    logoUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-logo-white.png',

    init: function() {
      this.loadLogo();
      G4.utils.log('Logo module initialized');
    },

    loadLogo: function() {
      var self = this;
      var testImg = new Image();

      testImg.onload = function() {
        G4.utils.log('Grid4 logo loaded successfully');
      };

      testImg.onerror = function() {
        G4.utils.log('Grid4 logo not found, using CSS fallback', 'warn');
        self.addFallbackLogo();
      };

      testImg.src = this.logoUrl;
    },

    addFallbackLogo: function() {
      var fallbackCSS = `
        #navigation::before {
          background-image: none !important;
          background-color: var(--grid4-accent-blue) !important;
          border-radius: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-family: Arial, sans-serif !important;
          font-weight: bold !important;
          font-size: 18px !important;
          color: var(--grid4-primary-dark) !important;
          content: "GRID4" !important;
        }
        body.grid4-sidebar-collapsed #navigation::before {
          font-size: 12px !important;
          content: "G4" !important;
        }
      `;

      var style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);
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

  // Layout Fixes Module
  G4.layoutFixes = {
    init: function() {
      this.fixBackgroundIssues();
      this.fixHeaderOverlap();
      this.fixNavigationIcons();
      this.fixDomainContext();
      this.fixModalStyling();

      // Set up interval to periodically check for new modals
      setInterval(function() {
        G4.layoutFixes.fixModalStyling();
      }, 2000);

      G4.utils.log('Layout fixes applied');
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
    this.logo.init();
    this.layoutFixes.init();
    this.uiEnhancements.init();

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
