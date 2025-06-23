/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v5.2.0
   FIXES: Intelligent Logo Correction, Sizing, & Component Styling
   =================================== */

(function($, window, document) {
  'use strict';
  
  window.Grid4Portal = window.Grid4Portal || {};
  var G4 = window.Grid4Portal;
  
  G4.config = {
    version: '5.2.0',
    debug: true,
    initialized: false,
    selectors: {
      header: '#header',
      headerLogo: '#header-logo',
      navigation: '#navigation',
      content: '#content',
      contactsDock: '.dock-body',
      nativeDockMinimize: '.dock-popup .dock-minimize'
    }
  };

  G4.utils = {
    log: function(message, type = 'info') {
      if (!G4.config.debug) return;
      console[type]('[Grid4Portal] ' + message);
    },
    waitForElement: function(selector, callback) {
      let attempts = 0, maxAttempts = 50, interval = 200;
      const check = () => {
        const $element = $(selector);
        if ($element.length > 0) {
          callback($element);
        } else if (++attempts < maxAttempts) {
          setTimeout(check, interval);
        } else {
          G4.utils.log(`Element not found: ${selector}`, 'warn');
        }
      };
      check();
    }
  };

  // --- MODULE: Logo Integration (v5.2 - Intelligent Correction) ---
  G4.logo = {
    state: { relocated: false },
    correctLogoUrl: 'https://portal.grid4voice.ucaas.tech/ns-api/?object=image&action=read&filename=portal_main_top_left.png',

    init: function() {
      G4.utils.waitForElement(G4.config.selectors.headerLogo, ($logo) => {
        G4.utils.waitForElement(G4.config.selectors.navigation, ($navigation) => {
          if (this.state.relocated) return;

          // 1. Relocate the native logo container
          $logo.prependTo($navigation);
          this.state.relocated = true;
          G4.utils.log('Native logo container relocated to sidebar.');

          // 2. Inspect and correct the image source
          this.ensureCorrectLogoImage($logo);
        });
      });
    },
    
    ensureCorrectLogoImage: function($logoContainer) {
        var $img = $logoContainer.find('img');
        
        if ($img.length === 0) {
            G4.utils.log('No img tag found in logo container, creating one.');
            $img = $('<img>').appendTo($logoContainer);
        }

        // 3. Force the correct logo source to override any context-specific changes
        if ($img.attr('src') !== this.correctLogoUrl) {
            $img.attr('src', this.correctLogoUrl);
            $img.attr('alt', 'Grid4 SmartComm');
            G4.utils.log('Logo source corrected to ensure "Grid4 SmartComm" version.', 'info');
        }
    }
  };

  // --- MODULE: Contacts Dock ---
  G4.contactsDock = {
    init: function() {
      G4.utils.waitForElement(G4.config.selectors.contactsDock, ($dock) => {
        this.dockElement = $dock;
        this.setupToggle();
      });
    },
    setupToggle: function() {
      var self = this;
      var $header = self.dockElement.find('.dock-contacts-header.top');
      if ($header.length === 0) return;

      var $nativeToggle = self.dockElement.closest('.dock-popup').find(G4.config.selectors.nativeDockMinimize);
      
      if ($nativeToggle.length > 0) {
        G4.utils.log('Native dock minimize button found.');
        $nativeToggle.hide();
      }

      if ($header.find('.grid4-dock-toggle').length === 0) {
        var $customToggle = $('<button class="grid4-dock-toggle"><i class="fa fa-chevron-up"></i></button>');
        $header.css('position', 'relative').append($customToggle);
        $customToggle.on('click.grid4', function(e) {
          e.stopPropagation();
          self.toggleDock($nativeToggle);
        });
      }
      
      self.syncToggleIcon();
    },
    toggleDock: function($nativeToggle) {
      if ($nativeToggle && $nativeToggle.length > 0) {
        $nativeToggle.trigger('click');
        setTimeout(() => this.syncToggleIcon(), 150);
      }
    },
    syncToggleIcon: function() {
      var isVisible = this.dockElement.is(':visible');
      var $icon = $('.grid4-dock-toggle i');
      $icon.toggleClass('fa-chevron-down', isVisible).toggleClass('fa-chevron-up', !isVisible);
    }
  };

  // --- Main Initialization ---
  function initializeGrid4Portal() {
    if (G4.config.initialized) return;
    G4.config.initialized = true;
    G4.utils.log(`Initializing Grid4Portal v${G4.config.version}`);
    $('body').addClass('grid4-portal-active');
    G4.logo.init();
    G4.contactsDock.init();
  }

  $(document).ready(initializeGrid4Portal);

})(jQuery, window, document);
