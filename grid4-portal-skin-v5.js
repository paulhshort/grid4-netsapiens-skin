/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v4.2.4
   CRITICAL FIXES: Logo Integration + Contacts Dock Functionality
   Performance Optimized Architecture + Auto-Initialization Fix
   =================================== */

(function($, window, document) {
  'use strict';
  
  // ===================================
  // Core Namespace & Configuration
  // ===================================
  window.Grid4Portal = window.Grid4Portal || {};
  
  var G4 = window.Grid4Portal;
  
  G4.config = {
    version: '4.2.4',
    debug: true, // Enable debug for development
    initialized: false,
    features: {
      sidebarCollapse: true,
      mobileOptimization: true,
      keyboardShortcuts: true
    },
    selectors: {
      header: '#header',
      headerLogo: '#header-logo',
      navigation: '#navigation',
      navButtons: '#nav-buttons',
      content: '#content'
    },
    classes: {
      portalActive: 'grid4-portal-active',
      sidebarCollapsed: 'grid4-sidebar-collapsed',
      mobileMenuOpen: 'grid4-mobile-menu-open'
    },
    timing: {
      fast: 150,
      normal: 250
    }
  };
  
  // ===================================
  // Utility Functions
  // ===================================
  G4.utils = {
    log: function(message, type, data) {
      if (!G4.config.debug) return;
      console[type || 'log']('[Grid4Portal] ' + message, data || '');
    },
    debounce: function(func, wait) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          func.apply(context, args);
        }, wait);
      };
    },
    waitForElement: function(selector, callback, maxAttempts) {
      var attempts = 0;
      maxAttempts = maxAttempts || 50;
      var check = function() {
        attempts++;
        var $element = $(selector);
        if ($element.length > 0) {
          callback($element);
        } else if (attempts < maxAttempts) {
          setTimeout(check, 100);
        } else {
          G4.utils.log('Element not found: ' + selector, 'warn');
        }
      };
      check();
    }
  };
  
  // ===================================
  // Logo Integration Module (v4.2.4 Refactored)
  // ===================================
  G4.logo = {
    state: {
      relocated: false,
      retries: 0,
      maxRetries: 5
    },

    init: function() {
      G4.utils.log('Logo module initialized');
      this.attemptRelocation();
    },

    attemptRelocation: function() {
      var self = this;
      G4.utils.waitForElement(G4.config.selectors.headerLogo, function($logo) {
        G4.utils.waitForElement(G4.config.selectors.navigation, function($navigation) {
          if (self.state.relocated) return;

          // Check if the logo has actual content (an image)
          if ($logo.find('img').length === 0 || !$logo.find('img').attr('src')) {
            G4.utils.log('Native logo found but is empty. Retrying...', 'warn');
            self.retryRelocation();
            return;
          }

          // Relocate the native logo element
          $logo.prependTo($navigation);
          self.state.relocated = true;
          
          // Add a class for CSS styling
          $logo.addClass('g4-relocated-logo');
          
          G4.utils.log('Logo successfully relocated to sidebar.', 'info');
        });
      }, this.state.maxRetries);
    },

    retryRelocation: function() {
      if (this.state.retries < this.state.maxRetries) {
        this.state.retries++;
        G4.utils.log('Scheduling logo relocation retry #' + this.state.retries);
        setTimeout(this.attemptRelocation.bind(this), 500 * this.state.retries);
      } else {
        G4.utils.log('Max retries for logo relocation reached.', 'error');
      }
    }
  };
  
  // ===================================
  // Contacts Dock Module (v4.2.4 Refactored)
  // ===================================
  G4.contactsDock = {
    isCollapsed: false,
    dockElement: null,
    nativeMinimizeButton: null,

    init: function() {
      var self = this;
      G4.utils.waitForElement('.dock-body', function($dock) {
        self.dockElement = $dock;
        self.findAndSetupToggle();
        self.fixConnectionErrorStyling();
      });
      G4.utils.log('Contacts Dock module initialized');
    },

    findAndSetupToggle: function() {
      // Find the native NetSapiens minimize button
      this.nativeMinimizeButton = this.dockElement.closest('.dock-popup').find('.dock-minimize');

      if (this.nativeMinimizeButton.length > 0) {
        G4.utils.log('Native dock minimize button found. Delegating control.');
        this.nativeMinimizeButton.hide(); // Hide the original to prevent UI duplication
      } else {
        G4.utils.log('Native dock minimize button not found. Toggle may not work.', 'warn');
      }

      // Create our custom toggle button
      this.createCustomToggle();
    },

    createCustomToggle: function() {
      var self = this;
      if ($('.grid4-dock-toggle').length) return;

      var $toggle = $('<button>', {
        class: 'grid4-dock-toggle',
        'aria-label': 'Toggle Contacts Dock',
        html: '<i class="fa fa-chevron-up"></i>'
      });

      $toggle.on('click.grid4', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggleDock();
      });

      var $header = this.dockElement.find('.dock-contacts-header.top');
      if ($header.length) {
        $header.css('position', 'relative').append($toggle);
      } else {
        this.dockElement.css('position', 'relative').prepend($toggle);
      }
      
      this.updateToggleIcon();
    },

    toggleDock: function() {
      if (this.nativeMinimizeButton && this.nativeMinimizeButton.length > 0) {
        G4.utils.log('Triggering native dock minimize click event.');
        this.nativeMinimizeButton.trigger('click');
        
        // The native script will handle the collapse/expand. We just need to sync our icon.
        // We check the state after a short delay to allow the native script to run.
        setTimeout(this.syncStateWithNative.bind(this), 100);
      } else {
        G4.utils.log('Fallback: Manually toggling dock state.', 'warn');
        this.dockElement.toggleClass('grid4-dock-collapsed');
        this.updateToggleIcon();
      }
    },
    
    syncStateWithNative: function() {
        // The native script hides the .dock-body. We check for its visibility.
        this.isCollapsed = !this.dockElement.is(':visible');
        this.updateToggleIcon();
        G4.utils.log('Synced dock state with native. Collapsed: ' + this.isCollapsed);
    },

    updateToggleIcon: function() {
      var $icon = $('.grid4-dock-toggle i');
      if (this.isCollapsed) {
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      } else {
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      }
    },
      
    fixConnectionErrorStyling: function() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                $(mutation.target).find('.contacts-connection.alert-danger').each(function() {
                    if (!$(this).hasClass('g4-styled')) {
                        $(this).addClass('g4-styled');
                        G4.utils.log('Connection error styled.');
                    }
                });
            });
        });
        
        observer.observe(this.dockElement[0], { childList: true, subtree: true });
    }
  };

  // ===================================
  // Main Initialization Function
  // ===================================
  function initializeGrid4Portal() {
    if (G4.config.initialized) return;
    G4.config.initialized = true;

    G4.utils.log('Initializing Grid4Portal v' + G4.config.version);
    
    // Initialize all modules
    G4.portalDetection.init();
    G4.logo.init();
    G4.sidebar.init();
    G4.navigation.init();
    G4.contactsDock.init();
    // Add other module initializations here

    G4.utils.log('Grid4Portal initialization complete.');
    $(document).trigger('grid4:initialized');
  }

  // ===================================
  // Auto-initialization Logic
  // ===================================
  $(document).ready(function() {
    // A short delay can help ensure all portal elements are ready
    setTimeout(initializeGrid4Portal, 250);
  });

})(jQuery, window, document);
