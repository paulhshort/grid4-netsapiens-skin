# NetSapiens Portal Skin Development Reference

## Table of Contents
1. [Overview](#overview)
2. [Portal Architecture](#portal-architecture)
3. [DOM Structure Reference](#dom-structure-reference)
4. [Development Environment Setup](#development-environment-setup)
5. [CSS Development Guide](#css-development-guide)
6. [JavaScript Development Guide](#javascript-development-guide)
7. [Build & Deployment Process](#build--deployment-process)
8. [Common Patterns & Solutions](#common-patterns--solutions)
9. [Testing & Debugging](#testing--debugging)
10. [Troubleshooting Guide](#troubleshooting-guide)

## Overview

The NetSapiens Portal Skin system allows complete UI transformation through external CSS and JavaScript injection without backend modifications. This reference provides everything needed to create a professional custom skin.

### Key Capabilities
- Complete visual redesign (colors, layouts, typography)
- Add new UI components (charts, command palettes, shortcuts)
- Enhance existing functionality (better navigation, data visualization)
- Mobile responsive improvements
- Dark mode and theme systems

### Limitations
- Cannot modify server-side logic
- Limited to data already available in the DOM
- Must work within existing security constraints (CSP)
- Single CSS and JS file constraint

## Portal Architecture

### Technology Stack
```
Backend:
├── CakePHP 1.3.x (MVC Framework)
├── PHP 5.x/7.x
└── MySQL Database

Frontend:
├── jQuery 1.8.3 (2012 version)
├── Bootstrap-style CSS (custom implementation)
├── FontAwesome 4.7
├── Google Charts API
├── Moment.js (timezone support)
└── Custom WebSocket implementation (chat)
```

### Request Flow
1. User navigates to `/portal/[section]`
2. CakePHP controller processes request
3. HTML template rendered with:
   - Default CSS loaded in `<head>`
   - Custom CSS loaded after defaults
   - jQuery and portal scripts loaded
   - Custom JS loaded at end of `<body>`
4. AJAX used for some navigation/updates

### Configuration System
Portal reads these master UI variables from database:
- `PORTAL_CSS_CUSTOM` - URL to custom CSS file
- `PORTAL_EXTRA_JS` - URL to custom JavaScript file
- `PORTAL_CSP_STYLE_ADDITIONS` - Allowed CSS sources
- `PORTAL_CSP_SCRIPT_ADDITIONS` - Allowed JS sources

## DOM Structure Reference

### Page Layout Hierarchy
```html
<html>
<head>
  <!-- Portal CSS -->
  <link rel="stylesheet" href="/portal/css/basicCSS.php">
  <link rel="stylesheet" href="/portal/css/portal.php">
  <!-- Custom CSS injection point -->
  <link rel="stylesheet" href="[PORTAL_CSS_CUSTOM]">
</head>
<body>
  <div class="wrapper">
    <div id="header">
      <!-- Logo, user menu, etc -->
    </div>
    
    <div id="navigation">
      <ul id="nav-buttons">
        <!-- Navigation menu items -->
      </ul>
      <div id="navigation-subbar">
        <!-- Section title and actions -->
      </div>
    </div>
    
    <div id="content">
      <!-- Page-specific content -->
    </div>
  </div>
  
  <div id="footer">
    <!-- Footer content -->
  </div>
  
  <!-- Portal scripts -->
  <script src="/js/jquery-1.8.3.min.js"></script>
  <!-- Custom JS injection point -->
  <script src="[PORTAL_EXTRA_JS]"></script>
</body>
</html>
```

### Navigation Structure
```html
<div id="navigation">
  <ul id="nav-buttons">
    <li id="nav-home-manager" class="nav-link-current">
      <a href="/portal/home" class="nav-link">
        <div class="nav-button btn"></div>
        <span class="nav-text">Home</span>
        <div class="nav-bg-image"></div>
        <div class="nav-arrow"></div>
      </a>
    </li>
    <li id="nav-users">
      <a href="/portal/users" class="nav-link">
        <div class="nav-button btn"></div>
        <span class="nav-text">Users</span>
        <div class="nav-bg-image"></div>
        <div class="nav-arrow"></div>
      </a>
    </li>
    <!-- More menu items... -->
  </ul>
</div>
```

### Common Page Elements
```html
<!-- Content panels -->
<div class="panel">
  <div class="panel-heading">Panel Title</div>
  <div class="panel-body">
    <!-- Panel content -->
  </div>
</div>

<!-- Data tables -->
<table class="table data-table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <!-- Table rows -->
  </tbody>
</table>

<!-- Forms -->
<form class="form-horizontal">
  <div class="form-group">
    <label class="control-label">Field Label</label>
    <input type="text" class="form-control">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<!-- Modals -->
<div class="modal hide" id="myModal">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Modal Title</h3>
  </div>
  <div class="modal-body">
    <!-- Modal content -->
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal">Close</button>
  </div>
</div>
```

### Navigation Menu IDs
```
#nav-home-manager     - Dashboard/Home
#nav-users           - Users Management
#nav-conferences     - Conference Rooms
#nav-attendants      - Auto Attendants
#nav-callqueues      - Call Queues
#nav-timeframes      - Time Frames
#nav-music           - Music on Hold
#nav-routeprofiles   - Route Profiles
#nav-inventory       - Device Inventory
```

### Global JavaScript Variables
```javascript
// User context
window.sub_user      // Current user ID
window.sub_domain    // Current domain
window.sub_realm     // Authentication realm

// Configuration flags
window.SNAPmobileWebenabled
window.PORTAL_HTML5_NOTIFICATIONS
window.portalNotificationSettings

// API endpoints (if accessible)
window.apiBaseUrl    // Usually /ns-api/
```

## Development Environment Setup

### Project Structure
```
grid4-netsapiens-skin/
├── src/
│   ├── css/
│   │   ├── base.css         # Reset and variables
│   │   ├── layout.css       # Layout overrides
│   │   ├── components.css   # UI components
│   │   └── themes.css       # Color themes
│   ├── js/
│   │   ├── core.js          # Core functionality
│   │   ├── modules/         # Feature modules
│   │   └── utils.js         # Helper functions
│   └── assets/
│       └── fonts/           # Custom fonts
├── dist/
│   ├── grid4-netsapiens.css
│   └── grid4-netsapiens.js
├── build/
│   └── build.js             # Build script
├── package.json
└── README.md
```

### Local Development Setup
```bash
# Initialize project
mkdir netsapiens-portal-skin
cd netsapiens-portal-skin
npm init -y

# Install build tools
npm install --save-dev \
  concat \
  uglify-js \
  clean-css-cli \
  http-server

# Package.json scripts
{
  "scripts": {
    "build:css": "cat src/css/*.css | cleancss -o dist/portal-skin.css",
    "build:js": "uglifyjs src/js/*.js -o dist/portal-skin.js",
    "build": "npm run build:css && npm run build:js",
    "serve": "http-server dist -p 8080 --cors",
    "watch": "nodemon -w src -e css,js -x npm run build"
  }
}
```

### Testing Against Live Portal
```javascript
// Inject local development files for testing
// Run in browser console:
(function() {
  // Remove existing custom assets
  $('link[href*="PORTAL_CSS_CUSTOM"]').remove();
  $('script[src*="PORTAL_EXTRA_JS"]').remove();
  
  // Inject local versions
  $('<link>', {
    rel: 'stylesheet',
    href: 'http://localhost:8080/portal-skin.css'
  }).appendTo('head');
  
  $('<script>', {
    src: 'http://localhost:8080/portal-skin.js'
  }).appendTo('body');
})();
```

## CSS Development Guide

### CSS Architecture Pattern
```css
/* ===================================
   1. CSS Variables & Reset
   =================================== */
:root {
  /* Color System */
  --ns-dark-bg: #1a1d21;
  --ns-dark-surface: #242830;
  --ns-dark-surface-raised: #2d323b;
  --ns-primary: #0d6efd;
  --ns-primary-hover: #0b5ed7;
  --ns-text-primary: #f8f9fa;
  --ns-text-secondary: #adb5bd;
  --ns-text-muted: #6c757d;
  
  /* Layout */
  --ns-sidebar-width: 240px;
  --ns-sidebar-collapsed: 68px;
  --ns-header-height: 60px;
  --ns-content-padding: 24px;
  
  /* Transitions */
  --ns-transition-fast: 150ms ease;
  --ns-transition-normal: 250ms ease;
}

/* Global reset - be specific! */
#header,
#navigation,
#content,
.wrapper {
  box-sizing: border-box;
}

/* ===================================
   2. Layout Overrides
   =================================== */
   
/* Fix white flash issue */
.wrapper {
  background-color: var(--ns-dark-bg) !important;
  min-height: 100vh;
}

/* Fixed header */
#header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--ns-header-height);
  background: var(--ns-dark-surface);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  z-index: 1000;
}

/* Fixed sidebar */
#navigation {
  position: fixed;
  top: var(--ns-header-height);
  left: 0;
  width: var(--ns-sidebar-width);
  height: calc(100vh - var(--ns-header-height));
  background: var(--ns-dark-surface);
  transition: width var(--ns-transition-normal);
  overflow: hidden;
}

/* Collapsed state */
body.sidebar-collapsed #navigation {
  width: var(--ns-sidebar-collapsed);
}

/* Content area adjustment */
#content {
  margin-left: var(--ns-sidebar-width);
  margin-top: var(--ns-header-height);
  padding: var(--ns-content-padding);
  transition: margin-left var(--ns-transition-normal);
}

body.sidebar-collapsed #content {
  margin-left: var(--ns-sidebar-collapsed);
}

/* ===================================
   3. Component Styling
   =================================== */

/* Navigation menu */
#nav-buttons {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

#nav-buttons li a.nav-link {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  color: var(--ns-text-secondary);
  text-decoration: none;
  transition: all var(--ns-transition-fast);
  position: relative;
}

#nav-buttons li a.nav-link:hover {
  background: rgba(255,255,255,0.05);
  color: var(--ns-text-primary);
}

#nav-buttons li a.nav-link.active,
#nav-buttons li.nav-link-current a {
  background: rgba(13,110,253,0.1);
  color: var(--ns-primary);
  border-left: 3px solid var(--ns-primary);
}

/* Icon system using pseudo-elements */
#nav-buttons li a.nav-link::before {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 18px;
  width: 24px;
  margin-right: 12px;
  text-align: center;
}

/* Icon mappings */
#nav-home-manager a::before { content: "\f3fd"; }
#nav-users a::before { content: "\f0c0"; }
#nav-conferences a::before { content: "\f03d"; }
#nav-attendants a::before { content: "\f095"; }
#nav-callqueues a::before { content: "\f03a"; }
#nav-timeframes a::before { content: "\f017"; }
#nav-music a::before { content: "\f001"; }
#nav-routeprofiles a::before { content: "\f074"; }
#nav-inventory a::before { content: "\f468"; }

/* Panels */
.panel {
  background: var(--ns-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.panel-heading {
  background: var(--ns-dark-surface-raised);
  color: var(--ns-text-primary);
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* Forms */
.form-control {
  background: var(--ns-dark-surface-raised);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--ns-text-primary);
}

.form-control:focus {
  background: var(--ns-dark-surface-raised);
  border-color: var(--ns-primary);
  color: var(--ns-text-primary);
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.25);
}

/* Buttons */
.btn {
  transition: all var(--ns-transition-fast);
}

.btn-primary {
  background: var(--ns-primary);
  border-color: var(--ns-primary);
}

.btn-primary:hover {
  background: var(--ns-primary-hover);
  border-color: var(--ns-primary-hover);
}

/* Tables */
.table {
  color: var(--ns-text-primary);
}

.table th {
  background: var(--ns-dark-surface-raised);
  color: var(--ns-text-primary);
  border-color: rgba(255,255,255,0.1);
}

.table td {
  border-color: rgba(255,255,255,0.1);
}

.table-striped tbody tr:nth-of-type(odd) {
  background: rgba(255,255,255,0.02);
}

/* ===================================
   4. Mobile Responsive
   =================================== */
@media (max-width: 768px) {
  #navigation {
    transform: translateX(-100%);
  }
  
  body.mobile-menu-open #navigation {
    transform: translateX(0);
  }
  
  #content {
    margin-left: 0;
  }
  
  /* Show menu toggle on mobile */
  .mobile-menu-toggle {
    display: block !important;
  }
}
```

### CSS Best Practices
1. **Always use scoped selectors** - Never use universal selectors
2. **Prefer CSS variables** - Makes theming easier
3. **Use !important sparingly** - Only when absolutely necessary
4. **Test cascade order** - Custom CSS loads last, should win naturally
5. **Consider performance** - Avoid expensive selectors like `:not()`

## JavaScript Development Guide

### JavaScript Architecture
```javascript
/* ===================================
   Portal Skin Core Architecture
   =================================== */
(function($, window, document) {
  'use strict';
  
  // ===================================
  // Namespace & Configuration
  // ===================================
  window.PortalSkin = window.PortalSkin || {};
  
  var PS = window.PortalSkin;
  
  PS.config = {
    debug: true,
    version: '2.0.0',
    features: {
      sidebarCollapse: true,
      keyboardShortcuts: true,
      dashboardCharts: true,
      commandPalette: true,
      darkMode: true
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
    }
  };
  
  // ===================================
  // Utility Functions
  // ===================================
  PS.utils = {
    log: function(message, type) {
      if (!PS.config.debug) return;
      console[type || 'log']('[PortalSkin] ' + message);
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
        var $el = $(selector);
        
        if ($el.length) {
          callback($el);
        } else if (attempts < maxAttempts) {
          setTimeout(check, 100);
        } else {
          PS.utils.log('Element not found: ' + selector, 'warn');
        }
      };
      
      check();
    },
    
    addBodyClass: function(className) {
      if (!$('body').hasClass(className)) {
        $('body').addClass(className);
      }
    },
    
    storage: {
      get: function(key) {
        try {
          return JSON.parse(localStorage.getItem('ps_' + key));
        } catch(e) {
          return null;
        }
      },
      set: function(key, value) {
        try {
          localStorage.setItem('ps_' + key, JSON.stringify(value));
        } catch(e) {
          PS.utils.log('Storage error: ' + e.message, 'error');
        }
      }
    }
  };
  
  // ===================================
  // Core Modules
  // ===================================
  
  // Page Detection Module
  PS.pageDetection = {
    init: function() {
      var path = window.location.pathname;
      var page = path.split('/').pop() || 'home';
      
      PS.utils.addBodyClass('ps-page-' + page);
      PS.currentPage = page;
      
      PS.utils.log('Current page: ' + page);
    }
  };
  
  // Sidebar Module
  PS.sidebar = {
    isCollapsed: false,
    
    init: function() {
      if (!PS.config.features.sidebarCollapse) return;
      
      this.isCollapsed = PS.utils.storage.get('sidebarCollapsed') || false;
      this.addToggleButton();
      this.bindEvents();
      this.applyState();
      
      PS.utils.log('Sidebar module initialized');
    },
    
    addToggleButton: function() {
      if ($('#sidebar-toggle').length) return;
      
      var $toggle = $('<button>', {
        id: 'sidebar-toggle',
        class: 'sidebar-toggle',
        html: '<i class="fa fa-bars"></i>',
        css: {
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 1001,
          background: 'transparent',
          border: 'none',
          color: 'var(--ns-text-primary)',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '8px'
        }
      });
      
      $('body').append($toggle);
    },
    
    bindEvents: function() {
      var self = this;
      
      // Toggle button click
      $(document).on('click', '#sidebar-toggle', function() {
        self.toggle();
      });
      
      // Keyboard shortcut
      if (PS.config.features.keyboardShortcuts) {
        $(document).on('keydown', function(e) {
          // Ctrl/Cmd + B
          if ((e.ctrlKey || e.metaKey) && e.which === 66) {
            e.preventDefault();
            self.toggle();
          }
        });
      }
    },
    
    toggle: function() {
      this.isCollapsed = !this.isCollapsed;
      this.applyState();
      PS.utils.storage.set('sidebarCollapsed', this.isCollapsed);
      
      // Trigger event for other modules
      $(document).trigger('ps:sidebar:toggled', [this.isCollapsed]);
    },
    
    applyState: function() {
      if (this.isCollapsed) {
        PS.utils.addBodyClass('sidebar-collapsed');
      } else {
        $('body').removeClass('sidebar-collapsed');
      }
    }
  };
  
  // Menu Enhancement Module
  PS.menuEnhancement = {
    labelMap: {
      'Auto Attendants': 'Attendants',
      'Call Queues': 'Queues',
      'Music On Hold': 'Music',
      'Time Frames': 'Schedules',
      'Route Profiles': 'Routes'
    },
    
    init: function() {
      this.shortenLabels();
      this.addTooltips();
      PS.utils.log('Menu enhancement initialized');
    },
    
    shortenLabels: function() {
      var self = this;
      
      $('#nav-buttons .nav-text').each(function() {
        var $this = $(this);
        var text = $this.text().trim();
        
        if (self.labelMap[text]) {
          $this.text(self.labelMap[text]);
        }
      });
    },
    
    addTooltips: function() {
      if (!PS.sidebar.isCollapsed) return;
      
      $('#nav-buttons li a').each(function() {
        var $this = $(this);
        var text = $this.find('.nav-text').text();
        
        $this.attr('title', text);
      });
    }
  };
  
  // Dashboard Module
  PS.dashboard = {
    init: function() {
      if (PS.currentPage !== 'home') return;
      if (!PS.config.features.dashboardCharts) return;
      
      this.loadChartLibrary();
    },
    
    loadChartLibrary: function() {
      if (window.Chart) {
        this.initCharts();
        return;
      }
      
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
      script.onload = this.initCharts.bind(this);
      document.head.appendChild(script);
    },
    
    initCharts: function() {
      PS.utils.log('Initializing dashboard charts');
      
      // Find call stats
      var activeCallsText = $('.panel:contains("Active Calls")').text();
      var activeCalls = parseInt(activeCallsText.match(/\d+/) || 0);
      
      // Create chart container
      var $chartContainer = $('<div>', {
        class: 'chart-container',
        css: { 
          height: '300px',
          marginBottom: '20px',
          background: 'var(--ns-dark-surface)',
          padding: '16px',
          borderRadius: '8px'
        }
      });
      
      $chartContainer.html('<canvas id="callChart"></canvas>');
      $('#content').prepend($chartContainer);
      
      // Initialize chart
      var ctx = document.getElementById('callChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.generateTimeLabels(),
          datasets: [{
            label: 'Active Calls',
            data: this.generateMockData(activeCalls),
            borderColor: 'var(--ns-primary)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: 'var(--ns-text-primary)' }
            }
          },
          scales: {
            y: {
              ticks: { color: 'var(--ns-text-secondary)' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: 'var(--ns-text-secondary)' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    },
    
    generateTimeLabels: function() {
      var labels = [];
      var now = new Date();
      
      for (var i = 23; i >= 0; i--) {
        var time = new Date(now - i * 3600000);
        labels.push(time.getHours() + ':00');
      }
      
      return labels;
    },
    
    generateMockData: function(currentValue) {
      var data = [];
      for (var i = 0; i < 24; i++) {
        data.push(Math.floor(Math.random() * 50) + 10);
      }
      data[23] = currentValue; // Current hour
      return data;
    }
  };
  
  // Command Palette Module
  PS.commandPalette = {
    isOpen: false,
    commands: [
      { name: 'Go to Users', action: function() { window.location.href = '/portal/users'; } },
      { name: 'Go to Call Queues', action: function() { window.location.href = '/portal/callqueues'; } },
      { name: 'Toggle Sidebar', action: function() { PS.sidebar.toggle(); } },
      { name: 'Toggle Debug Mode', action: function() { PS.config.debug = !PS.config.debug; } }
    ],
    
    init: function() {
      if (!PS.config.features.commandPalette) return;
      
      this.createPalette();
      this.bindEvents();
      PS.utils.log('Command palette initialized');
    },
    
    createPalette: function() {
      var $palette = $('<div>', {
        id: 'command-palette',
        class: 'command-palette',
        css: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          maxHeight: '400px',
          background: 'var(--ns-dark-surface-raised)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '0',
          display: 'none',
          zIndex: 9999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }
      });
      
      $palette.html(`
        <input type="text" class="command-input" placeholder="Type a command..." style="
          width: 100%;
          padding: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: var(--ns-text-primary);
          font-size: 16px;
          outline: none;
        ">
        <div class="command-list" style="
          max-height: 300px;
          overflow-y: auto;
        "></div>
      `);
      
      $('body').append($palette);
    },
    
    bindEvents: function() {
      var self = this;
      
      // Open with Ctrl/Cmd + Shift + P
      $(document).on('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.which === 80) {
          e.preventDefault();
          self.toggle();
        }
      });
      
      // Close on Escape
      $(document).on('keydown', function(e) {
        if (e.which === 27 && self.isOpen) {
          self.close();
        }
      });
      
      // Filter commands
      $(document).on('input', '.command-input', function() {
        self.filterCommands($(this).val());
      });
      
      // Execute command
      $(document).on('click', '.command-item', function() {
        var index = $(this).data('index');
        self.executeCommand(index);
      });
    },
    
    toggle: function() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    
    open: function() {
      this.isOpen = true;
      $('#command-palette').fadeIn(200);
      $('.command-input').val('').focus();
      this.renderCommands();
    },
    
    close: function() {
      this.isOpen = false;
      $('#command-palette').fadeOut(200);
    },
    
    renderCommands: function(filtered) {
      var commands = filtered || this.commands;
      var $list = $('.command-list').empty();
      
      commands.forEach(function(cmd, index) {
        var $item = $('<div>', {
          class: 'command-item',
          'data-index': index,
          text: cmd.name,
          css: {
            padding: '12px 16px',
            cursor: 'pointer',
            transition: 'background 0.15s'
          }
        });
        
        $item.hover(
          function() { $(this).css('background', 'rgba(255,255,255,0.05)'); },
          function() { $(this).css('background', 'transparent'); }
        );
        
        $list.append($item);
      });
    },
    
    filterCommands: function(query) {
      var filtered = this.commands.filter(function(cmd) {
        return cmd.name.toLowerCase().includes(query.toLowerCase());
      });
      this.renderCommands(filtered);
    },
    
    executeCommand: function(index) {
      var command = this.commands[index];
      if (command && command.action) {
        command.action();
        this.close();
      }
    }
  };
  
  // ===================================
  // AJAX Handler
  // ===================================
  PS.ajaxHandler = {
    init: function() {
      var self = this;
      
      $(document).ajaxComplete(function(event, xhr, settings) {
        PS.utils.log('AJAX complete: ' + settings.url);
        
        // Re-run modules that need to update after AJAX
        PS.menuEnhancement.shortenLabels();
        PS.pageDetection.init();
        
        // Trigger custom event
        $(document).trigger('ps:ajax:complete', [settings]);
      });
    }
  };
  
  // ===================================
  // Initialization
  // ===================================
  PS.init = function() {
    PS.utils.log('Initializing Portal Skin v' + PS.config.version);
    
    // Add marker class
    PS.utils.addBodyClass('portal-skin-active');
    
    // Initialize modules
    PS.pageDetection.init();
    PS.sidebar.init();
    PS.menuEnhancement.init();
    PS.dashboard.init();
    PS.commandPalette.init();
    PS.ajaxHandler.init();
    
    // Mark as initialized
    PS.initialized = true;
    $(document).trigger('ps:initialized');
  };
  
  // Wait for portal to be ready
  PS.waitForReady = function() {
    PS.utils.waitForElement('#navigation', function() {
      PS.utils.waitForElement('#nav-buttons', function() {
        PS.init();
      });
    });
  };
  
  // Start when DOM is ready
  $(document).ready(function() {
    PS.waitForReady();
  });
  
})(jQuery, window, document);
```

### JavaScript Patterns

#### Safe DOM Manipulation
```javascript
// Always check element exists
function modifyElement(selector) {
  var $el = $(selector);
  if ($el.length === 0) {
    console.warn('Element not found:', selector);
    return;
  }
  
  // Safe to modify
  $el.addClass('modified');
}

// Use jQuery's chaining safely
$('#nav-buttons')
  .find('.nav-text')
  .filter(':contains("Users")')
  .text('People');
```

#### Event Handling
```javascript
// Use delegated events for dynamic content
$(document).on('click', '.dynamic-button', function(e) {
  e.preventDefault();
  // Handle click
});

// Namespace your events
$(document).on('click.portalSkin', '#my-button', function() {
  // Prevents conflicts
});

// Clean up when needed
$(document).off('.portalSkin');
```

#### AJAX Integration
```javascript
// Listen for all AJAX
$(document).ajaxComplete(function(event, xhr, settings) {
  // Re-apply customizations
  applyCustomStyles();
});

// Or use MutationObserver
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length) {
      // New content added
      handleNewContent();
    }
  });
});

observer.observe(document.getElementById('content'), {
  childList: true,
  subtree: true
});
```

## Build & Deployment Process

### GitHub Repository Setup
```bash
# Initialize repository
git init
git add .
git commit -m "Initial portal skin"
git remote add origin https://github.com/[username]/netsapiens-portal-skin.git
git push -u origin main
```

### GitHub Pages Deployment
1. Enable GitHub Pages in repository settings
2. Source: Deploy from branch (main)
3. Folder: /dist

Your files will be available at:
```
https://[username].github.io/netsapiens-portal-skin/portal-skin.css
https://[username].github.io/netsapiens-portal-skin/portal-skin.js
```

### CDN Options

#### jsDelivr (Recommended)
Automatically serves from GitHub with caching:
```
https://cdn.jsdelivr.net/gh/[username]/[repo]@[version]/dist/portal-skin.css
https://cdn.jsdelivr.net/gh/[username]/[repo]@[version]/dist/portal-skin.js
```

Examples:
```
# Latest from main branch
https://cdn.jsdelivr.net/gh/user/repo@main/dist/portal-skin.css

# Specific version
https://cdn.jsdelivr.net/gh/user/repo@v1.0.0/dist/portal-skin.css

# Latest release
https://cdn.jsdelivr.net/gh/user/repo@latest/dist/portal-skin.css
```

#### Statically.io
Alternative CDN for GitHub:
```
https://cdn.statically.io/gh/[username]/[repo]/[branch]/dist/portal-skin.css
```

### Versioning Strategy
```bash
# Tag releases
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Update portal config for specific version
PORTAL_CSS_CUSTOM: https://cdn.jsdelivr.net/gh/user/repo@v1.0.0/dist/portal-skin.css
```

### Build Script Example
```javascript
// build.js
const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');

// Build CSS
const cssFiles = fs.readdirSync('./src/css')
  .filter(f => f.endsWith('.css'))
  .map(f => fs.readFileSync(path.join('./src/css', f), 'utf8'))
  .join('\n');

const minifiedCSS = new CleanCSS({}).minify(cssFiles);
fs.writeFileSync('./dist/portal-skin.css', minifiedCSS.styles);

// Build JS
const jsFiles = fs.readdirSync('./src/js')
  .filter(f => f.endsWith('.js'))
  .map(f => fs.readFileSync(path.join('./src/js', f), 'utf8'))
  .join('\n');

const minifiedJS = UglifyJS.minify(jsFiles);
fs.writeFileSync('./dist/portal-skin.js', minifiedJS.code);

console.log('Build complete!');
```

## Common Patterns & Solutions

### Pattern: Feature Flags
```javascript
// Enable/disable features via URL params
var urlParams = new URLSearchParams(window.location.search);
PS.config.features.dashboardCharts = urlParams.get('charts') !== 'false';

// Or via localStorage
PS.config.features = Object.assign(PS.config.features, 
  PS.utils.storage.get('features') || {}
);
```

### Pattern: Progressive Enhancement
```javascript
// Start with basic functionality
PS.basic = {
  init: function() {
    // Core features that always work
    this.fixWhiteFlash();
    this.addPageClasses();
  }
};

// Add advanced features if supported
if (window.MutationObserver) {
  PS.advanced.init();
}
```

### Pattern: Error Boundaries
```javascript
// Wrap risky operations
PS.safeExecute = function(fn, context) {
  try {
    return fn.call(context || this);
  } catch (error) {
    PS.utils.log('Error: ' + error.message, 'error');
    
    // Report to monitoring if available
    if (window.Bugsnag) {
      Bugsnag.notifyException(error);
    }
  }
};

// Usage
PS.safeExecute(function() {
  // Risky operation
  this.initComplexFeature();
}, this);
```

### Pattern: Responsive Helpers
```javascript
PS.responsive = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  
  isMobile: function() {
    return window.innerWidth < this.breakpoints.mobile;
  },
  
  onResize: function(callback) {
    var resizeTimer;
    $(window).on('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(callback, 250);
    });
  }
};
```

## Testing & Debugging

### Browser Console Testing
```javascript
// Test injection without deployment
(function() {
  // Clear existing
  $('link[href*="portal-skin"]').remove();
  $('script[src*="portal-skin"]').remove();
  
  // Inject test versions
  $('<link>', {
    rel: 'stylesheet',
    href: 'http://localhost:8080/test.css?v=' + Date.now()
  }).appendTo('head');
  
  $.getScript('http://localhost:8080/test.js?v=' + Date.now());
})();
```

### Debug Mode
```javascript
// Enable debug mode
PortalSkin.config.debug = true;

// Or via URL
// ?debug=true

// Debug helpers
PS.debug = {
  showMetrics: function() {
    console.table({
      'Page Load': performance.timing.loadEventEnd - performance.timing.navigationStart,
      'DOM Ready': performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      'Elements': $(PS.config.selectors).length,
      'Event Handlers': $._data(document, 'events')
    });
  },
  
  inspectModule: function(moduleName) {
    console.log('Module:', moduleName);
    console.log('State:', PS[moduleName]);
  }
};
```

### Automated Testing
```javascript
// Simple test framework
PS.tests = {
  run: function() {
    var results = [];
    
    // Test: Required elements exist
    results.push({
      name: 'Navigation exists',
      passed: $('#navigation').length > 0
    });
    
    results.push({
      name: 'Menu items found',
      passed: $('#nav-buttons li').length > 0
    });
    
    // Test: CSS variables defined
    results.push({
      name: 'CSS variables loaded',
      passed: getComputedStyle(document.documentElement)
        .getPropertyValue('--ns-dark-bg') !== ''
    });
    
    // Test: No console errors
    var errorCount = 0;
    var oldError = console.error;
    console.error = function() {
      errorCount++;
      oldError.apply(console, arguments);
    };
    
    setTimeout(function() {
      results.push({
        name: 'No console errors',
        passed: errorCount === 0
      });
      
      console.table(results);
    }, 1000);
  }
};
```

### Performance Monitoring
```javascript
PS.performance = {
  marks: {},
  
  mark: function(name) {
    this.marks[name] = performance.now();
  },
  
  measure: function(name, startMark) {
    var duration = performance.now() - this.marks[startMark];
    PS.utils.log(name + ': ' + duration.toFixed(2) + 'ms');
  },
  
  profile: function() {
    this.mark('init-start');
    
    // After initialization
    this.measure('Initialization', 'init-start');
    
    // Check paint timing
    if (performance.getEntriesByType) {
      var paints = performance.getEntriesByType('paint');
      paints.forEach(function(paint) {
        PS.utils.log(paint.name + ': ' + paint.startTime.toFixed(2) + 'ms');
      });
    }
  }
};
```

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue: CSS not loading
```javascript
// Check CSP headers
console.log('CSP:', $('meta[http-equiv="Content-Security-Policy"]').attr('content'));

// Verify URL is accessible
fetch(PORTAL_CSS_CUSTOM_URL)
  .then(r => console.log('CSS Status:', r.status))
  .catch(e => console.error('CSS Error:', e));

// Solution: Update CSP settings
PORTAL_CSP_STYLE_ADDITIONS: https://cdn.jsdelivr.net 'unsafe-inline'
```

#### Issue: JavaScript errors
```javascript
// Check jQuery version
console.log('jQuery version:', $.fn.jquery);

// Test compatibility
try {
  $('<div>').on('click', function() {}); // Should work
  $('<div>').on('click', () => {}); // Arrow function - will fail
} catch(e) {
  console.error('Compatibility issue:', e);
}
```

#### Issue: Styles not applying
```css
/* Increase specificity */
body.portal-skin-active #navigation {
  /* Overrides default */
}

/* Or use !important sparingly */
.critical-fix {
  display: block !important;
}
```

#### Issue: AJAX breaks customizations
```javascript
// Solution 1: ajaxComplete
$(document).ajaxComplete(function() {
  PS.init(); // Re-run
});

// Solution 2: MutationObserver
var observer = new MutationObserver(function() {
  PS.menuEnhancement.init();
});

observer.observe(document.getElementById('content'), {
  childList: true,
  subtree: true
});
```

### Portal-Specific Quirks

1. **White Flash on Load**
   - Add background color to `.wrapper` immediately
   - Use inline critical CSS if needed

2. **Menu Icons Missing**
   - Portal uses custom icon font
   - Map to FontAwesome equivalents

3. **Form Submissions**
   - Some forms use AJAX, some full page reload
   - Handle both cases

4. **Modal Dialogs**
   - Portal uses Bootstrap 2.x style modals
   - Don't use Bootstrap 3+ syntax

5. **Global Variables**
   - Portal sets many globals (sub_user, etc.)
   - Don't overwrite these

### Performance Checklist

- [ ] CSS file < 100KB
- [ ] JS file < 100KB  
- [ ] No blocking resources
- [ ] Images optimized/sprited
- [ ] Minimal !important usage
- [ ] Efficient selectors
- [ ] Debounced scroll/resize handlers
- [ ] Removed console.log in production

### Security Considerations

1. **Don't bypass authentication**
   ```javascript
   // Bad: Don't create new API calls
   $.post('/api/admin/deleteAll'); 
   
   // Good: Only use existing portal functions
   $('#delete-button').click();
   ```

2. **Sanitize any user input**
   ```javascript
   // If accepting user input
   var sanitized = $('<div>').text(userInput).html();
   ```

3. **Don't expose sensitive data**
   ```javascript
   // Don't log sensitive information
   PS.utils.log('User data:', sanitizedData);
   ```

### Maintenance Guide

#### Version Updates
1. Test thoroughly on staging
2. Tag release in Git
3. Update CDN URL to specific version
4. Test rollback procedure
5. Document changes

#### Monitoring
```javascript
// Add error tracking
window.onerror = function(msg, url, line, col, error) {
  PS.utils.log('Global error: ' + msg, 'error');
  
  // Send to monitoring service
  if (window.ga) {
    ga('send', 'exception', {
      'exDescription': msg,
      'exFatal': false
    });
  }
};
```

#### Documentation
- Keep README updated
- Document portal version compatibility
- Note any workarounds for portal bugs
- Include screenshots of major features

## Conclusion

This reference provides everything needed to build a professional NetSapiens portal skin. Key principles:

1. **Non-destructive** - Enhance, don't replace
2. **Resilient** - Handle errors gracefully  
3. **Performant** - Optimize for speed
4. **Maintainable** - Clear code structure
5. **Compatible** - Work with portal constraints

The portal skin system is powerful but requires careful implementation. Follow these patterns and your customization will be stable, professional, and maintainable.