/* Grid4 Feature Flag UI - Dopamine-Inducing Professional Manager
 * TDD approach with comprehensive testing
 * Zero dependencies, maximum delight
 */

(function(window, document) {
  'use strict';

  // Prevent multiple initializations
  if (window.G4FeatureFlags) {
    console.warn('G4FeatureFlags already initialized');
    return;
  }

  // Performance tracking
  var initStart = Date.now();

  // Feature flag definitions with categories and impact levels
  var DEFAULT_FLAGS = {
    // UI/UX Features
    'toastNotifications': {
      name: 'Toast Notifications',
      description: 'Beautiful toast messages for user feedback and system alerts',
      category: 'ui',
      impact: 'low',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: false
    },
    'loadingAnimations': {
      name: 'Loading Animations',
      description: 'Smooth loading states and progress indicators throughout the portal',
      category: 'ui',
      impact: 'low',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: false
    },
    'commandPalette': {
      name: 'Command Palette',
      description: 'Quick access command interface with fuzzy search (Ctrl+Shift+P)',
      category: 'ui',
      impact: 'medium',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: false
    },
    'darkMode': {
      name: 'Dark Mode',
      description: 'Premium dark theme with automatic system detection',
      category: 'ui',
      impact: 'low',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: true
    },
    
    // Performance Features
    'lazyLoading': {
      name: 'Lazy Loading',
      description: 'Intelligent content loading for improved page performance',
      category: 'performance',
      impact: 'medium',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: false
    },
    'cacheOptimization': {
      name: 'Cache Optimization',
      description: 'Smart caching strategies for faster page loads',
      category: 'performance',
      impact: 'high',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: true
    },
    'bundleOptimization': {
      name: 'Bundle Optimization',
      description: 'Optimized JavaScript and CSS loading for better performance',
      category: 'performance',
      impact: 'medium',
      enabled: false,
      version: '1.0.0',
      dependencies: [],
      experimental: false
    },
    
    // Experimental Features
    'autoToastNotifications': {
      name: 'Auto Toast Notifications',
      description: 'Automatic toast messages for AJAX requests and form submissions',
      category: 'experimental',
      impact: 'low',
      enabled: false,
      version: '0.9.0',
      dependencies: ['toastNotifications'],
      experimental: true
    },
    'advancedSearch': {
      name: 'Advanced Search',
      description: 'Enhanced search capabilities with filters and smart suggestions',
      category: 'experimental',
      impact: 'medium',
      enabled: false,
      version: '0.8.0',
      dependencies: [],
      experimental: true
    },
    'realtimeUpdates': {
      name: 'Real-time Updates',
      description: 'Live data updates without page refresh using WebSockets',
      category: 'experimental',
      impact: 'high',
      enabled: false,
      version: '0.5.0',
      dependencies: [],
      experimental: true
    }
  };

  // Main FeatureFlags class
  function G4FeatureFlags() {
    this.flags = {};
    this.modal = null;
    this.fab = null;
    this.isOpen = false;
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.analytics = {
      toggleCount: 0,
      sessionStart: Date.now(),
      interactions: []
    };
    
    this.init();
  }

  // Initialize the feature flag system
  G4FeatureFlags.prototype.init = function() {
    this.loadFlags();
    this.injectStyles();
    this.createFAB();
    this.setupKeyboardShortcuts();
    this.trackAnalytics();
    
    console.log('✅ G4FeatureFlags: Initialized in ' + (Date.now() - initStart) + 'ms');
    console.log('🎯 Loaded ' + Object.keys(this.flags).length + ' feature flags');
  };

  // Load flags from localStorage or use defaults
  G4FeatureFlags.prototype.loadFlags = function() {
    try {
      var stored = localStorage.getItem('g4_feature_flags');
      if (stored) {
        var storedFlags = JSON.parse(stored);
        
        // Merge with defaults to handle new flags
        this.flags = this.mergeFlags(DEFAULT_FLAGS, storedFlags);
      } else {
        this.flags = JSON.parse(JSON.stringify(DEFAULT_FLAGS));
      }
    } catch (error) {
      console.warn('Failed to load feature flags from storage, using defaults:', error);
      this.flags = JSON.parse(JSON.stringify(DEFAULT_FLAGS));
    }
  };

  // Merge flags handling new additions
  G4FeatureFlags.prototype.mergeFlags = function(defaults, stored) {
    var merged = {};
    
    // Start with defaults
    for (var key in defaults) {
      merged[key] = JSON.parse(JSON.stringify(defaults[key]));
      
      // Override with stored values if they exist
      if (stored[key]) {
        merged[key].enabled = stored[key].enabled;
        // Preserve other stored properties if they exist
        if (stored[key].lastModified) {
          merged[key].lastModified = stored[key].lastModified;
        }
      }
    }
    
    return merged;
  };

  // Save flags to localStorage
  G4FeatureFlags.prototype.saveFlags = function() {
    try {
      localStorage.setItem('g4_feature_flags', JSON.stringify(this.flags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
      if (window.toast) {
        window.toast.error('Failed to save feature flags');
      }
    }
  };

  // Inject CSS
  G4FeatureFlags.prototype.injectStyles = function() {
    if (!document.querySelector('#g4-ff-styles')) {
      var link = document.createElement('link');
      link.id = 'g4-ff-styles';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/features/feature-flag-ui.css';
      document.head.appendChild(link);
    }
  };

  // Create floating action button
  G4FeatureFlags.prototype.createFAB = function() {
    if (this.fab) return;

    this.fab = document.createElement('button');
    this.fab.className = 'g4-ff-fab';
    this.fab.innerHTML = '⚙️';
    this.fab.title = 'Feature Flags (F)';
    this.fab.setAttribute('aria-label', 'Open feature flags manager');
    
    var self = this;
    this.fab.addEventListener('click', function() {
      self.open();
    });

    document.body.appendChild(this.fab);
  };

  // Setup keyboard shortcuts
  G4FeatureFlags.prototype.setupKeyboardShortcuts = function() {
    var self = this;
    
    document.addEventListener('keydown', function(e) {
      // F key to open (if not in input)
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey && 
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        self.open();
      }
      
      // Escape to close
      if (e.key === 'Escape' && self.isOpen) {
        e.preventDefault();
        self.close();
      }
    });
  };

  // Open the feature flags modal
  G4FeatureFlags.prototype.open = function() {
    if (this.isOpen) return;
    
    this.createModal();
    this.isOpen = true;
    
    // Add to analytics
    this.analytics.interactions.push({
      type: 'modal_open',
      timestamp: Date.now()
    });
    
    // Focus management
    setTimeout(function() {
      var searchInput = this.modal.querySelector('.g4-ff-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }.bind(this), 100);
  };

  // Close the modal
  G4FeatureFlags.prototype.close = function() {
    if (!this.isOpen || !this.modal) return;
    
    this.modal.classList.remove('g4-ff-active');
    this.isOpen = false;
    
    setTimeout(function() {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      this.modal = null;
    }.bind(this), 300);
    
    // Add to analytics
    this.analytics.interactions.push({
      type: 'modal_close',
      timestamp: Date.now()
    });
  };

  // Create the modal
  G4FeatureFlags.prototype.createModal = function() {
    if (this.modal) return;

    this.modal = document.createElement('div');
    this.modal.className = 'g4-ff-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'g4-ff-title');

    var content = document.createElement('div');
    content.className = 'g4-ff-modal-content';

    content.innerHTML = this.getModalHTML();
    this.modal.appendChild(content);
    document.body.appendChild(this.modal);

    // Trigger animation
    setTimeout(function() {
      this.modal.classList.add('g4-ff-active');
    }.bind(this), 10);

    this.attachEventListeners();
  };

  // Get modal HTML
  G4FeatureFlags.prototype.getModalHTML = function() {
    var enabledCount = this.getEnabledCount();
    var totalCount = Object.keys(this.flags).length;
    var experimentalCount = this.getExperimentalCount();

    return `
      <div class="g4-ff-header">
        <div class="g4-ff-header-content">
          <h2 class="g4-ff-title" id="g4-ff-title">
            <span class="g4-ff-title-icon">🚀</span>
            Feature Flags
          </h2>
          <div class="g4-ff-stats">
            <div class="g4-ff-stat">
              <span class="g4-ff-stat-value">${enabledCount}</span>
              <span class="g4-ff-stat-label">Enabled</span>
            </div>
            <div class="g4-ff-stat">
              <span class="g4-ff-stat-value">${totalCount}</span>
              <span class="g4-ff-stat-label">Total</span>
            </div>
            <div class="g4-ff-stat">
              <span class="g4-ff-stat-value">${experimentalCount}</span>
              <span class="g4-ff-stat-label">Experimental</span>
            </div>
          </div>
          <button class="g4-ff-close" aria-label="Close">×</button>
        </div>
      </div>
      
      <div class="g4-ff-toolbar">
        <div class="g4-ff-search">
          <span class="g4-ff-search-icon">🔍</span>
          <input type="text" class="g4-ff-search-input" placeholder="Search features..." value="${this.searchTerm}">
        </div>
        <div class="g4-ff-filters">
          <button class="g4-ff-filter-btn ${this.activeFilter === 'all' ? 'g4-ff-active' : ''}" data-filter="all">All</button>
          <button class="g4-ff-filter-btn ${this.activeFilter === 'ui' ? 'g4-ff-active' : ''}" data-filter="ui">UI/UX</button>
          <button class="g4-ff-filter-btn ${this.activeFilter === 'performance' ? 'g4-ff-active' : ''}" data-filter="performance">Performance</button>
          <button class="g4-ff-filter-btn ${this.activeFilter === 'experimental' ? 'g4-ff-active' : ''}" data-filter="experimental">Experimental</button>
        </div>
      </div>
      
      <div class="g4-ff-content">
        <div class="g4-ff-grid">
          ${this.getFilteredFlagsHTML()}
        </div>
      </div>
    `;
  };

  // Get filtered flags HTML
  G4FeatureFlags.prototype.getFilteredFlagsHTML = function() {
    var filtered = this.getFilteredFlags();
    
    if (filtered.length === 0) {
      return `
        <div class="g4-ff-empty">
          <div class="g4-ff-empty-icon">🔍</div>
          <h3 class="g4-ff-empty-title">No features found</h3>
          <p class="g4-ff-empty-text">Try adjusting your search or filter criteria</p>
        </div>
      `;
    }

    return filtered.map(function(item) {
      var flag = item.flag;
      var key = item.key;
      
      return `
        <div class="g4-ff-card ${flag.enabled ? 'g4-ff-enabled' : 'g4-ff-disabled'} ${flag.experimental ? 'g4-ff-experimental' : ''}">
          <div class="g4-ff-card-header">
            <div class="g4-ff-card-info">
              <h3 class="g4-ff-card-title">${flag.name}</h3>
              <p class="g4-ff-card-description">${flag.description}</p>
              <span class="g4-ff-card-category g4-ff-${flag.category}">${flag.category.toUpperCase()}</span>
            </div>
            <div class="g4-ff-toggle ${flag.enabled ? 'g4-ff-enabled' : ''}" data-flag="${key}" role="switch" aria-checked="${flag.enabled}" tabindex="0">
              <div class="g4-ff-toggle-handle">${flag.enabled ? '✓' : ''}</div>
            </div>
          </div>
          <div class="g4-ff-card-actions">
            <div class="g4-ff-card-meta">
              <div class="g4-ff-card-impact">
                <span class="g4-ff-impact-icon g4-ff-impact-${flag.impact}"></span>
                <span>${flag.impact} impact</span>
              </div>
              <div>v${flag.version}</div>
              ${flag.experimental ? '<div>🧪 Experimental</div>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Get filtered flags
  G4FeatureFlags.prototype.getFilteredFlags = function() {
    var self = this;
    var flags = [];
    
    for (var key in this.flags) {
      var flag = this.flags[key];
      
      // Apply search filter
      if (this.searchTerm) {
        var searchLower = this.searchTerm.toLowerCase();
        if (flag.name.toLowerCase().indexOf(searchLower) === -1 &&
            flag.description.toLowerCase().indexOf(searchLower) === -1) {
          continue;
        }
      }
      
      // Apply category filter
      if (this.activeFilter !== 'all') {
        if (this.activeFilter === 'experimental' && !flag.experimental) {
          continue;
        } else if (this.activeFilter !== 'experimental' && flag.category !== this.activeFilter) {
          continue;
        }
      }
      
      flags.push({ key: key, flag: flag });
    }
    
    return flags;
  };

  // Attach event listeners
  G4FeatureFlags.prototype.attachEventListeners = function() {
    var self = this;
    
    // Close button
    var closeBtn = this.modal.querySelector('.g4-ff-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        self.close();
      });
    }
    
    // Click outside to close
    this.modal.addEventListener('click', function(e) {
      if (e.target === self.modal) {
        self.close();
      }
    });
    
    // Search input
    var searchInput = this.modal.querySelector('.g4-ff-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        self.searchTerm = e.target.value;
        self.updateContent();
      });
    }
    
    // Filter buttons
    var filterBtns = this.modal.querySelectorAll('.g4-ff-filter-btn');
    for (var i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener('click', function(e) {
        var filter = e.target.getAttribute('data-filter');
        self.setFilter(filter);
      });
    }
    
    // Toggle switches
    var toggles = this.modal.querySelectorAll('.g4-ff-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function(e) {
        var flagKey = e.currentTarget.getAttribute('data-flag');
        self.toggleFlag(flagKey, e.currentTarget);
      });
      
      // Keyboard support for toggles
      toggles[i].addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var flagKey = e.currentTarget.getAttribute('data-flag');
          self.toggleFlag(flagKey, e.currentTarget);
        }
      });
    }
  };

  // Set filter
  G4FeatureFlags.prototype.setFilter = function(filter) {
    this.activeFilter = filter;
    this.updateContent();
  };

  // Update modal content
  G4FeatureFlags.prototype.updateContent = function() {
    var content = this.modal.querySelector('.g4-ff-content .g4-ff-grid');
    var toolbar = this.modal.querySelector('.g4-ff-toolbar');
    
    if (content) {
      content.innerHTML = this.getFilteredFlagsHTML();
      this.attachToggleListeners();
    }
    
    // Update filter buttons
    var filterBtns = toolbar.querySelectorAll('.g4-ff-filter-btn');
    for (var i = 0; i < filterBtns.length; i++) {
      var btn = filterBtns[i];
      var filter = btn.getAttribute('data-filter');
      
      if (filter === this.activeFilter) {
        btn.classList.add('g4-ff-active');
      } else {
        btn.classList.remove('g4-ff-active');
      }
    }
  };

  // Attach toggle listeners after content update
  G4FeatureFlags.prototype.attachToggleListeners = function() {
    var self = this;
    var toggles = this.modal.querySelectorAll('.g4-ff-toggle');
    
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function(e) {
        var flagKey = e.currentTarget.getAttribute('data-flag');
        self.toggleFlag(flagKey, e.currentTarget);
      });
    }
  };

  // Toggle a feature flag with celebrations!
  G4FeatureFlags.prototype.toggleFlag = function(flagKey, toggleElement) {
    if (!this.flags[flagKey]) return;
    
    var flag = this.flags[flagKey];
    var wasEnabled = flag.enabled;
    
    // Check dependencies
    if (!wasEnabled && flag.dependencies.length > 0) {
      var missingDeps = [];
      for (var i = 0; i < flag.dependencies.length; i++) {
        var dep = flag.dependencies[i];
        if (!this.flags[dep] || !this.flags[dep].enabled) {
          missingDeps.push(this.flags[dep] ? this.flags[dep].name : dep);
        }
      }
      
      if (missingDeps.length > 0) {
        if (window.toast) {
          window.toast.warning('Please enable dependencies first: ' + missingDeps.join(', '));
        }
        return;
      }
    }
    
    // Toggle the flag
    flag.enabled = !flag.enabled;
    flag.lastModified = Date.now();
    
    // Update UI
    this.updateToggleUI(toggleElement, flag.enabled);
    
    // Celebrations for enabling features!
    if (flag.enabled && !wasEnabled) {
      this.celebrate(toggleElement);
      if (window.toast) {
        window.toast.success(`${flag.name} enabled!`, {
          title: 'Feature Activated',
          duration: 3000
        });
      }
    } else if (!flag.enabled && wasEnabled) {
      if (window.toast) {
        window.toast.info(`${flag.name} disabled`, {
          duration: 2000
        });
      }
    }
    
    // Save to storage
    this.saveFlags();
    
    // Update analytics
    this.analytics.toggleCount++;
    this.analytics.interactions.push({
      type: 'flag_toggle',
      flag: flagKey,
      enabled: flag.enabled,
      timestamp: Date.now()
    });
    
    // Update stats in header
    this.updateStats();
    
    // Trigger global feature flag event
    this.triggerFlagEvent(flagKey, flag.enabled);
  };

  // Update toggle UI
  G4FeatureFlags.prototype.updateToggleUI = function(toggleElement, enabled) {
    var handle = toggleElement.querySelector('.g4-ff-toggle-handle');
    var card = toggleElement.closest('.g4-ff-card');
    
    if (enabled) {
      toggleElement.classList.add('g4-ff-enabled');
      toggleElement.setAttribute('aria-checked', 'true');
      if (handle) handle.textContent = '✓';
      if (card) {
        card.classList.remove('g4-ff-disabled');
        card.classList.add('g4-ff-enabled');
      }
    } else {
      toggleElement.classList.remove('g4-ff-enabled');
      toggleElement.setAttribute('aria-checked', 'false');
      if (handle) handle.textContent = '';
      if (card) {
        card.classList.remove('g4-ff-enabled');
        card.classList.add('g4-ff-disabled');
      }
    }
  };

  // Celebrate feature activation!
  G4FeatureFlags.prototype.celebrate = function(toggleElement) {
    // Add ripple effect
    toggleElement.classList.add('g4-ff-ripple');
    setTimeout(function() {
      toggleElement.classList.remove('g4-ff-ripple');
    }, 300);
    
    // Add celebration animation
    toggleElement.classList.add('g4-ff-celebrating');
    setTimeout(function() {
      toggleElement.classList.remove('g4-ff-celebrating');
    }, 600);
    
    // Confetti burst!
    this.createConfetti(toggleElement);
  };

  // Create confetti effect
  G4FeatureFlags.prototype.createConfetti = function(sourceElement) {
    var rect = sourceElement.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    
    var colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'];
    var confettiContainer = document.createElement('div');
    confettiContainer.className = 'g4-ff-confetti';
    
    for (var i = 0; i < 15; i++) {
      var piece = document.createElement('div');
      piece.className = 'g4-ff-confetti-piece';
      piece.style.left = centerX + (Math.random() - 0.5) * 100 + 'px';
      piece.style.top = centerY + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (2 + Math.random()) + 's';
      
      confettiContainer.appendChild(piece);
    }
    
    document.body.appendChild(confettiContainer);
    
    setTimeout(function() {
      if (confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
    }, 3500);
  };

  // Update stats in header
  G4FeatureFlags.prototype.updateStats = function() {
    if (!this.modal) return;
    
    var enabledStat = this.modal.querySelector('.g4-ff-stat:first-child .g4-ff-stat-value');
    if (enabledStat) {
      enabledStat.textContent = this.getEnabledCount();
    }
  };

  // Trigger global feature flag event
  G4FeatureFlags.prototype.triggerFlagEvent = function(flagKey, enabled) {
    try {
      var event = new CustomEvent('g4FlagToggle', {
        detail: {
          flag: flagKey,
          enabled: enabled,
          flags: this.flags
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // Fallback for older browsers
      if (window.g4c && window.g4c.onFlagToggle) {
        window.g4c.onFlagToggle(flagKey, enabled, this.flags);
      }
    }
  };

  // Utility methods
  G4FeatureFlags.prototype.getEnabledCount = function() {
    var count = 0;
    for (var key in this.flags) {
      if (this.flags[key].enabled) count++;
    }
    return count;
  };

  G4FeatureFlags.prototype.getExperimentalCount = function() {
    var count = 0;
    for (var key in this.flags) {
      if (this.flags[key].experimental) count++;
    }
    return count;
  };

  // Public API
  G4FeatureFlags.prototype.isEnabled = function(flagKey) {
    return this.flags[flagKey] && this.flags[flagKey].enabled;
  };

  G4FeatureFlags.prototype.enable = function(flagKey) {
    if (this.flags[flagKey]) {
      this.flags[flagKey].enabled = true;
      this.saveFlags();
      this.triggerFlagEvent(flagKey, true);
    }
  };

  G4FeatureFlags.prototype.disable = function(flagKey) {
    if (this.flags[flagKey]) {
      this.flags[flagKey].enabled = false;
      this.saveFlags();
      this.triggerFlagEvent(flagKey, false);
    }
  };

  G4FeatureFlags.prototype.getAnalytics = function() {
    return {
      toggleCount: this.analytics.toggleCount,
      sessionDuration: Date.now() - this.analytics.sessionStart,
      interactions: this.analytics.interactions.slice(),
      enabledFeatures: this.getEnabledCount(),
      totalFeatures: Object.keys(this.flags).length
    };
  };

  // Analytics tracking
  G4FeatureFlags.prototype.trackAnalytics = function() {
    var self = this;
    
    // Track time spent with modal open
    setInterval(function() {
      if (self.isOpen) {
        self.analytics.interactions.push({
          type: 'modal_active',
          timestamp: Date.now()
        });
      }
    }, 30000); // Every 30 seconds
  };

  // Create global instance
  window.G4FeatureFlags = new G4FeatureFlags();

  // Expose convenience methods globally
  window.featureFlags = {
    isEnabled: function(flag) { return window.G4FeatureFlags.isEnabled(flag); },
    enable: function(flag) { return window.G4FeatureFlags.enable(flag); },
    disable: function(flag) { return window.G4FeatureFlags.disable(flag); },
    open: function() { return window.G4FeatureFlags.open(); },
    close: function() { return window.G4FeatureFlags.close(); },
    getAnalytics: function() { return window.G4FeatureFlags.getAnalytics(); }
  };

  // Integration with existing feature flag system
  if (window.g4c) {
    // Override the existing isFeatureEnabled function to use our system
    var originalIsFeatureEnabled = window.g4c.isFeatureEnabled;
    window.g4c.isFeatureEnabled = function(flagKey) {
      // Check our system first
      if (window.G4FeatureFlags.flags[flagKey]) {
        return window.G4FeatureFlags.isEnabled(flagKey);
      }
      
      // Fallback to original system
      if (originalIsFeatureEnabled) {
        return originalIsFeatureEnabled.call(this, flagKey);
      }
      
      return false;
    };
  }

  // Success message
  console.log('✅ G4FeatureFlags: Ready! Press F to open or click the gear icon');
  console.log('🎯 Available shortcuts: F (open), Escape (close)');

})(window, document);