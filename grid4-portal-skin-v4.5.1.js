/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v4.5.14 - DOCK STRUCTURE PRESERVATION & LAYOUT FIXES
   DUAL LIGHT/DARK THEME SYSTEM + PERFORMANCE OPTIMIZATIONS
   =================================== */

// ===================================
// IMMEDIATE THEME APPLICATION (FOUC Prevention)
// ===================================
// This self-executing function runs immediately, before the DOM is fully loaded.
// It checks localStorage for a saved theme and applies the corresponding class
// to the <body> tag to prevent a flash of the default theme.
(function() {
  try {
    var theme = localStorage.getItem('grid4_theme');
    // Default to 'light' if no theme is found in localStorage
    var activeTheme = theme ? JSON.parse(theme) : 'light';
    
    // Remove both classes to ensure a clean state, then add the active one.
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add('theme-' + activeTheme);
    
    // ENHANCED FOUC PREVENTION: Apply critical inline styles immediately
    // This ensures basic theming is applied even before CSS loads
    var criticalStyles = document.createElement('style');
    criticalStyles.textContent = activeTheme === 'dark' ? 
      'html,body{background-color:#1a2332 !important;color:#e9ecef !important;}' +
      '.wrapper{background-color:#1a2332 !important;}' +
      '#navigation{background-color:#1e2736 !important;}' +
      '#header{background-color:#1e2736 !important;}' +
      '.panel{background-color:#242b3a !important;}' :
      'html,body{background-color:#f8f9fa !important;color:#212529 !important;}' +
      '.wrapper{background-color:#f8f9fa !important;}' +
      '#navigation{background-color:#e9ecef !important;}' +
      '#header{background-color:#e9ecef !important;}' +
      '.panel{background-color:#ffffff !important;}';
    
    // Insert at the very beginning of head for highest priority
    var firstChild = document.head.firstChild;
    if (firstChild) {
      document.head.insertBefore(criticalStyles, firstChild);
    } else {
      document.head.appendChild(criticalStyles);
    }
  } catch (e) {
    // Fallback to light theme in case of any error
    document.documentElement.classList.add('theme-light');
    console.error('Failed to apply theme from localStorage', e);
  }
})();


(function($, window, document) {
  'use strict';
  
  // ===================================
  // Core Namespace & Configuration
  // ===================================
  window.Grid4Portal = window.Grid4Portal || {};
  
  var G4 = window.Grid4Portal;
  
  // Configuration object
  G4.config = {
    version: '4.5.14', // Updated version number - DOCK STRUCTURE PRESERVATION & LAYOUT FIXES
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
      userToolbar: '.user-toolbar', // Selector for user menu in header
      // Contacts Dock selectors are removed as we no longer interact with it via JS
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
      
      // Store error for debugging (cap at 50 errors to prevent memory leaks)
      if (!window.Grid4Errors) window.Grid4Errors = [];
      window.Grid4Errors.push({
        message: message,
        error: error,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      // Cap array size
      if (window.Grid4Errors.length > 50) {
        window.Grid4Errors = window.Grid4Errors.slice(-50);
      }
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
    $body: null, // Cache body element
    
    init: function() {
      if (!G4.config.features.sidebarCollapse) return;
      
      // Cache commonly used elements
      this.$body = $('body');
      
      this.checkMobile();
      this.loadState();
      this.createToggleButton();
      this.createMobileToggle(); // v4.5.12
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
    
    createMobileToggle: function() {
      // v4.5.12 - Professional mobile toggle
      if ($('#grid4-mobile-toggle').length) return;
      
      var $mobileToggle = $('<button>', {
        id: 'grid4-mobile-toggle',
        class: 'grid4-mobile-toggle',
        'aria-label': 'Toggle mobile menu',
        html: '<span></span>',
        css: {
          display: 'none' // CSS will show on mobile
        }
      });
      
      $('body').append($mobileToggle);
      G4.utils.log('Mobile toggle created');
    },
    
    bindEvents: function() {
      var self = this;
      
      // Toggle button click
      $(document).on('click', '#grid4-sidebar-toggle', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggle();
      });
      
      // v4.5.12 - Mobile toggle click
      $(document).on('click', '#grid4-mobile-toggle', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggleMobileMenu();
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
      if (this.isMobile) {
        this.$body.removeClass(G4.config.classes.sidebarCollapsed);
        if (this.isCollapsed) {
          this.$body.removeClass(G4.config.classes.mobileMenuOpen);
        } else {
          this.$body.addClass(G4.config.classes.mobileMenuOpen);
        }
      } else {
        this.$body.removeClass(G4.config.classes.mobileMenuOpen);
        if (this.isCollapsed) {
          this.$body.addClass(G4.config.classes.sidebarCollapsed);
        } else {
          this.$body.removeClass(G4.config.classes.sidebarCollapsed);
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
      this.$body.removeClass(G4.config.classes.sidebarCollapsed);
      this.$body.removeClass(G4.config.classes.mobileMenuOpen);
      
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
  
  // Table Header Fix Module (v4.5.12)
  G4.tableHeaderFix = {
    init: function() {
      this.fixFloatingHeaders();
      this.bindTableEvents();
      G4.utils.log('Table header fix module initialized');
    },
    
    fixFloatingHeaders: function() {
      G4.utils.safeExecute(function() {
        // Fix floating table headers after they're created
        $('.tableFloatingHeader').each(function() {
          var $floatingHeader = $(this);
          var $originalTable = $('.tableFloatingHeaderOriginal');
          
          if ($originalTable.length) {
            // Force width matching
            $floatingHeader.css({
              'width': $originalTable.outerWidth() + 'px',
              'table-layout': 'fixed'
            });
            
            // Match column widths
            var $originalCells = $originalTable.find('thead th');
            var $floatingCells = $floatingHeader.find('thead th');
            
            $originalCells.each(function(index) {
              if ($floatingCells.eq(index).length) {
                $floatingCells.eq(index).css('width', $(this).outerWidth() + 'px');
              }
            });
          }
        });
      }, this, 'Failed to fix floating headers');
    },
    
    bindTableEvents: function() {
      var self = this;
      
      // Re-fix headers after AJAX updates
      $(document).on('ajaxComplete', function() {
        setTimeout(function() {
          self.fixFloatingHeaders();
        }, 500); // Give DataTables time to render
      });
      
      // Re-fix on window resize
      $(window).on('resize', G4.utils.debounce(function() {
        self.fixFloatingHeaders();
      }, 250));
      
      // Watch for DataTables initialization
      if ($.fn.DataTable) {
        $(document).on('init.dt', function() {
          setTimeout(function() {
            self.fixFloatingHeaders();
          }, 100);
        });
      }
    }
  };
  
  // Logo Management Module (Simplified for CSS injection)
  G4.logo = {
    init: function() {
      this.hideHeaderLogo();
      G4.utils.log('Logo module initialized: Header logo hidden, relying on CSS for sidebar logo.');
    },

    // Hides the original header logo element
    hideHeaderLogo: function() {
      G4.utils.waitForElement('#header-logo', function($headerLogo) {
        // Apply aggressive inline styles to ensure it's hidden
        $headerLogo.css({
          'display': 'none !important',
          'visibility': 'hidden !important',
          'opacity': '0 !important',
          'width': '0 !important',
          'height': '0 !important',
          'max-width': '0 !important',
          'max-height': '0 !important',
          'position': 'absolute !important',
          'left': '-9999px !important'
        });
        G4.utils.log('Original header logo hidden via JS inline styles.');
      }, 10); // Short maxAttempts as it should be there quickly
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
      // NOTE: This function is kept for compatibility but should be minimized
      // Most styling should be handled by CSS variables in the stylesheet
      
      // Only apply critical fixes for modals that absolutely need JS intervention
      var $modals = $('.modal:visible, .popup:visible, .dialog:visible, .ui-dialog:visible');
      
      if ($modals.length === 0) return; // Exit early if no visible modals
      
      // Apply minimal fixes only where CSS can't reach
      $modals.each(function() {
        var $modal = $(this);
        
        // Only fix if modal doesn't have our theme class
        if (!$modal.hasClass('grid4-styled')) {
          $modal.addClass('grid4-styled');
          
          // Apply critical styles that CSS variables can't handle
          // Most styling should be in CSS using selectors like:
          // .grid4-styled { background: var(--color-surface-primary) !important; }
        }
      });
    }
  };

  // ===================================
  // Theme Management Module
  // ===================================
  G4.themeManager = {
    currentTheme: 'light', // Default theme
    localStorageKey: 'grid4_theme',
    $html: null, // Cache html element
    
    init: function() {
      if (!G4.config.features.themeSwitching) return;

      // Cache commonly used elements
      this.$html = $(document.documentElement);
      
      // The immediate script at the top of the file handles the initial load.
      // This init function will just set up the toggle button.
      this.currentTheme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
      this.bindEvents(); // Bind events FIRST to ensure delegation is set up
      this.createThemeToggleButton();
      G4.utils.log('Theme manager initialized. Current theme: ' + this.currentTheme);
    },

    applyTheme: function() {
      if (this.currentTheme === 'dark') {
        this.$html.removeClass(G4.config.classes.themeLight).addClass(G4.config.classes.themeDark);
      } else {
        this.$html.removeClass(G4.config.classes.themeDark).addClass(G4.config.classes.themeLight);
      }
      G4.utils.log('Applied theme: ' + this.currentTheme);
    },

    toggleTheme: function() {
      this.currentTheme = (this.currentTheme === 'light') ? 'dark' : 'light';
      this.applyTheme();
      G4.utils.storage.set('theme', this.currentTheme); // Fixed: use simple key without prefix
      this.updateToggleButton();
      G4.utils.log('Toggled theme to: ' + this.currentTheme);
    },

    createThemeToggleButton: function() {
      var self = this;
      G4.utils.waitForElement(G4.config.selectors.navigation, function($navigation) {
        if ($('#grid4-theme-toggle').length) return; // Prevent duplicate

        var $toggleButton = $('<button>', {
          id: 'grid4-theme-toggle',
          class: 'grid4-theme-toggle',
          type: 'button', // Explicitly set type
          title: 'Toggle theme',
          html: '<i class="fa"></i>', // Icon will be set by updateToggleButton
          'aria-label': 'Toggle theme' // Initial aria-label, updated later
        });

        // Ensure button is clickable with explicit styles
        $toggleButton.css({
          'pointer-events': 'auto',
          'z-index': '9999'
        });

        // Append to the navigation element itself for bottom-left positioning
        $navigation.append($toggleButton); 
        self.updateToggleButton(); // Set initial icon and aria-label
        G4.utils.log('Theme toggle button created in sidebar.');
        
        // v4.5.12 - Also create user toolbar in sidebar
        self.createUserToolbar();
      });
    },
    
    createUserToolbar: function() {
      var self = this;
      // Move user toolbar from header to sidebar
      var $headerUser = $('#header .header-user, #header-user, .header-user').first();
      if ($headerUser.length && !$('#navigation .user-toolbar').length) {
        var $userToolbar = $('<div class="user-toolbar"></div>');
        var $userInfo = $('<div class="user-info"></div>');
        
        // Extract user name and actions
        var userName = $headerUser.find('.user-name, .username, [class*="user"]').text() || 'User';
        var $userActions = $headerUser.find('a').clone();
        
        $userInfo.append('<span class="user-name">' + userName + '</span>');
        if ($userActions.length) {
          var $actions = $('<div class="user-actions"></div>');
          $userActions.each(function() {
            $actions.append($(this));
          });
          $userInfo.append($actions);
        }
        
        $userToolbar.append($userInfo);
        $('#navigation').append($userToolbar);
        
        G4.utils.log('User toolbar moved to sidebar');
      }
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
      // Use capture phase to ensure we get the event first
      $(document).on('click.grid4-theme', '#grid4-theme-toggle', function(e) {
        e.preventDefault();
        e.stopPropagation();
        G4.utils.log('Theme toggle button clicked!');
        self.toggleTheme();
      });
    }
  };

  // ===================================
  // Contacts Dock Module (Removed custom JS functionality)
  // ===================================
  // The Contacts Dock functionality is now entirely managed by native NetSapiens JS.
  // Our custom JS will no longer interfere with its display, minimize/maximize logic.
  // The CSS ensures basic styling and initial hidden state.
  G4.contactsDock = {
    init: function() {
      // We no longer load content via custom AJAX or manage state via JS.
      // The native portal handles this.
      G4.utils.log('Contacts Dock module initialized (no custom JS functionality).');
      // The CSS rule .dock-popup { visibility: hidden; } handles initial state.
      // Native JS will make it visible when opened.
    }
    // No bindEvents, loadContactsDock, minimizeDockPopup, applyDockVisibilityState
    // as these are now deferred to native portal JS.
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
      this.maintainThemeOnNavigation();
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
      var cssUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v4.5.7.css'; // Updated filename
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
    },
    
    // Maintain theme classes during AJAX navigation
    maintainThemeOnNavigation: function() {
      var self = this;
      
      // Ensure theme class persists on body/html during navigation
      var themeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            var currentTheme = G4.themeManager ? G4.themeManager.currentTheme : 'light';
            var $target = $(mutation.target);
            
            // Ensure theme class is maintained on html element
            if (mutation.target === document.documentElement) {
              if (!$target.hasClass('theme-' + currentTheme)) {
                $target.addClass('theme-' + currentTheme);
                G4.utils.log('Restored theme class on html element');
              }
            }
            
            // Ensure grid4-portal-active is maintained on body
            if (mutation.target === document.body && G4.portalDetection.isNetSapiens) {
              if (!$target.hasClass(G4.config.classes.portalActive)) {
                $target.addClass(G4.config.classes.portalActive);
              }
            }
          }
        });
      });
      
      // Observe class changes on both html and body
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      G4.utils.log('Theme maintenance observer initialized');
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

    // The immediate theme script has already run.
    // Initialize theme manager to set up the toggle button.
    this.themeManager.init();

    // Initialize cache detection and regression monitoring
    this.cacheDetection.init();

    // Initialize performance monitoring
    this.performance.init();
    this.performance.mark('init_start');

    // Initialize core modules
    this.portalDetection.init();
    this.logo.init(); // Now handles hiding header logo
    this.layoutFixes.init();
    this.uiEnhancements.init();
    this.tableHeaderFix.init(); // v4.5.12 - Fix table header alignment
    G4.contactsDock.init(); // Initialize contacts dock module (now just logs, no custom behavior)

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
      logo: 'Header hidden, sidebar via CSS ::before', // Simplified logo status
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
        content: !!document.getElementById('content'),
        contactsDockPopup: !!$(G4.config.selectors.contactsDockPopup).length
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
    console.log('🖼️ Logo Status:', 'Header logo hidden, sidebar logo via CSS ::before');
    console.groupEnd();

    return info;
  };

  // Enhanced logo debugging (simplified for new logo strategy)
  G4.debugLogo = function() {
    if (!G4.logo) {
      console.log('❌ Logo module not initialized');
      return;
    }
    console.group('🖼️ Logo Integration Debug');
    console.log('Strategy: Header logo hidden via JS, sidebar logo injected via CSS ::before.');
    console.log('Header #header-logo element hidden:', $('#header-logo').css('display') === 'none');
    console.log('Navigation #navigation::before background-image:', window.getComputedStyle(document.getElementById('navigation'), '::before').backgroundImage);
    console.groupEnd();
  };

  // Logo reset function for debugging (simplified for new logo strategy)
  G4.resetLogo = function() {
    if (G4.logo && G4.logo.hideHeaderLogo) {
      G4.logo.hideHeaderLogo();
      console.log('🔄 Logo integration reset (header logo re-hidden)');
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
      logoStatus: 'Header hidden, sidebar via CSS ::before',
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
        themeToggleButton: !!document.getElementById('grid4-theme-toggle'), // Added theme toggle button check
        contactsDockPopup: !!$(G4.config.selectors.contactsDockPopup).length
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
      logo: 'Header hidden, sidebar via CSS ::before',
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
      contactsDock: 'Managed by native JS only. Initial visibility:hidden via CSS.', // Simplified status for dock
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
    if (G4.logo && G4.logo.hideHeaderLogo) {
      G4.logo.hideHeaderLogo();
    }
    return 'Logo fix initiated - header logo re-hidden, sidebar logo relies on CSS.';
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
  
  // ===================================
  // v4.5.12 - AGGRESSIVE STYLE ENFORCEMENT
  // ===================================
  
  // Function to force apply our styles
  function enforceGrid4Styles() {
    // 1. Fix table header alignment
    $('.tableFloatingHeader, .tableFloatingHeaderOriginal').each(function() {
      var $header = $(this);
      var $originalTable = $('.table-container table:not(.tableFloatingHeader)').first();
      
      if ($originalTable.length) {
        // Force width match
        var tableWidth = $originalTable.outerWidth();
        $header[0].style.setProperty('width', tableWidth + 'px', 'important');
        $header[0].style.setProperty('table-layout', 'auto', 'important');
        
        // Match column widths
        var $headerCells = $header.find('th');
        var $bodyCells = $originalTable.find('tbody tr:first td');
        
        if ($headerCells.length === $bodyCells.length) {
          $bodyCells.each(function(index) {
            var width = $(this).outerWidth();
            $headerCells.eq(index)[0].style.setProperty('width', width + 'px', 'important');
            $headerCells.eq(index)[0].style.setProperty('min-width', width + 'px', 'important');
            $headerCells.eq(index)[0].style.setProperty('max-width', width + 'px', 'important');
          });
        }
      }
    });
    
    // 2. Force form button bar opacity
    $('.form-actions, .floating-footer, [style*="position: fixed"][style*="bottom"]').each(function() {
      var $el = $(this);
      if ($el.css('position') === 'fixed' || $el.hasClass('affix-form-actions')) {
        var isDarkTheme = $('html').hasClass('theme-dark');
        var bgColor = isDarkTheme ? '#242b3a' : '#ffffff';
        var borderColor = isDarkTheme ? '#4a5568' : '#e2e8f0';
        
        $el[0].style.setProperty('background', bgColor, 'important');
        $el[0].style.setProperty('background-color', bgColor, 'important');
        $el[0].style.setProperty('opacity', '1', 'important');
        $el[0].style.setProperty('height', '64px', 'important');
        $el[0].style.setProperty('z-index', '9999', 'important');
        $el[0].style.setProperty('border-top', '2px solid ' + borderColor, 'important');
        $el[0].style.setProperty('padding', '10px 20px', 'important');
      }
    });
    
    // 3. Force legend text color in dark theme
    if ($('html').hasClass('theme-dark')) {
      $('legend').each(function() {
        this.style.setProperty('color', '#0099ff', 'important');
        this.style.setProperty('background', 'transparent', 'important');
        this.style.setProperty('font-size', '16px', 'important');
        this.style.setProperty('font-weight', '600', 'important');
      });
      
      // Also fix any inline dark colors
      $('[style*="color: #333"], [style*="color: rgb(51"], [style*="color:#333"], [style*="color:rgb(51"]').each(function() {
        this.style.setProperty('color', '#0099ff', 'important');
      });
    }
    
    // 4. CRITICAL: Fix dock structure and layout (v4.5.14)
    // Ensure proper proportions and horizontal layouts
    $('.dock-overlay, .dock-popup-overlay').each(function() {
      var $dock = $(this);
      
      // Fix contact row heights
      $dock.find('.contact-row, .roster-item, [class*="contact"], [class*="roster"]').each(function() {
        this.style.setProperty('height', 'auto', 'important');
        this.style.setProperty('padding', '4px 8px', 'important');
        this.style.setProperty('line-height', '1.2', 'important');
      });
      
      // Fix action buttons to be horizontal
      $dock.find('.contact-actions, .hover-actions, .action-buttons, [class*="actions"]').each(function() {
        this.style.setProperty('display', 'flex', 'important');
        this.style.setProperty('flex-direction', 'row', 'important');
        this.style.setProperty('gap', '4px', 'important');
        this.style.setProperty('height', 'auto', 'important');
      });
      
      // Fix button sizes
      $dock.find('button, .btn, .button, a.button').each(function() {
        this.style.setProperty('padding', '2px 6px', 'important');
        this.style.setProperty('font-size', '12px', 'important');
        this.style.setProperty('height', 'auto', 'important');
        this.style.setProperty('min-height', '20px', 'important');
        this.style.setProperty('line-height', '1', 'important');
      });
      
      // Fix icon sizes
      $dock.find('i, .icon, [class*="icon"], .fa, .fas, .far').each(function() {
        this.style.setProperty('font-size', '14px', 'important');
        this.style.setProperty('width', '14px', 'important');
        this.style.setProperty('height', '14px', 'important');
      });
    });
    
    // 5. Ensure chat messages are NOT inside dock
    $('[id^="uc-message-box-"]').each(function() {
      var $chatBox = $(this);
      var $parent = $chatBox.parent();
      
      // If chat is inside dock, move it out
      if ($parent.hasClass('dock-overlay') || $parent.hasClass('dock-popup-overlay') || $parent.closest('.dock-overlay').length) {
        $chatBox.appendTo('body');
        $chatBox[0].style.setProperty('position', 'fixed', 'important');
        $chatBox[0].style.setProperty('z-index', '9998', 'important');
        $chatBox[0].style.setProperty('right', '20px', 'important');
        $chatBox[0].style.setProperty('bottom', '80px', 'important');
      }
    });
  }
  
  // Debounce helper
  function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Apply fixes on initial load
  $(document).ready(function() {
    setTimeout(enforceGrid4Styles, 100);
  });
  
  // Apply after AJAX calls
  $(document).ajaxComplete(function() {
    setTimeout(enforceGrid4Styles, 150);
  });
  
  // MutationObserver for dynamic changes
  if (typeof MutationObserver !== 'undefined') {
    var styleObserver = new MutationObserver(debounce(function(mutations) {
      var needsUpdate = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          needsUpdate = true;
        }
        if (mutation.type === 'childList') {
          var hasRelevantNodes = false;
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              var tagName = node.tagName ? node.tagName.toLowerCase() : '';
              if (tagName === 'legend' || tagName === 'table' || node.className && node.className.includes && (node.className.includes('form-actions') || node.className.includes('floating'))) {
                hasRelevantNodes = true;
              }
            }
          });
          if (hasRelevantNodes) needsUpdate = true;
        }
      });
      
      if (needsUpdate) {
        enforceGrid4Styles();
      }
    }, 100));
    
    // Start observing
    styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });
  }
  
  // Also enforce on window resize (for table headers)
  $(window).on('resize', debounce(enforceGrid4Styles, 250));
  
  // Expose for debugging
  window.grid4EnforceStyles = enforceGrid4Styles;
  
})(jQuery, window, document);
