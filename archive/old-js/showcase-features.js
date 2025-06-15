/* Grid4 Showcase Features - Dopamine Fun + Professional Polish
 * Integrates all premium features with RingCentral-inspired design
 * Ready for production deployment and demonstration
 */

(function(window, document) {
  'use strict';

  // Prevent multiple initializations
  if (window.G4Showcase) {
    console.warn('G4Showcase already initialized');
    return;
  }

  var SHOWCASE_VERSION = '1.0.0';
  var initStart = Date.now();

  // Main Showcase class
  function G4Showcase() {
    this.features = {};
    this.loadOrder = [
      'feature-flag-ui',
      'toast-notifications', 
      'loading-animations'
    ];
    this.loadedCount = 0;
    this.totalFeatures = this.loadOrder.length;
    
    this.init();
  }

  G4Showcase.prototype.init = function() {
    console.log('🚀 Grid4 Showcase Features v' + SHOWCASE_VERSION);
    console.log('🎨 Initializing RingCentral-inspired premium experience...');
    
    this.showLoadingProgress();
    this.loadFeatures();
    this.setupIntegrations();
    this.addShowcaseControls();
    
    // Welcome sequence
    this.scheduleWelcome();
  };

  // Show loading progress for the showcase
  G4Showcase.prototype.showLoadingProgress = function() {
    var progressContainer = document.createElement('div');
    progressContainer.id = 'g4-showcase-loader';
    progressContainer.innerHTML = `
      <style>
        #g4-showcase-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(0, 123, 255, 0.1);
          z-index: 10001;
          overflow: hidden;
        }
        #g4-showcase-progress {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #66b3ff);
          width: 0%;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        #g4-showcase-progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: g4-shimmer 2s infinite;
        }
        @keyframes g4-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
      <div id="g4-showcase-progress"></div>
    `;
    
    document.body.appendChild(progressContainer);
    this.progressBar = progressContainer.querySelector('#g4-showcase-progress');
  };

  // Update loading progress
  G4Showcase.prototype.updateProgress = function(percentage) {
    if (this.progressBar) {
      this.progressBar.style.width = percentage + '%';
    }
  };

  // Hide loading progress
  G4Showcase.prototype.hideProgress = function() {
    var loader = document.getElementById('g4-showcase-loader');
    if (loader) {
      setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }, 500);
    }
  };

  // Load features dynamically
  G4Showcase.prototype.loadFeatures = function() {
    var self = this;
    var baseUrl = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/features/';
    
    this.loadOrder.forEach(function(featureName, index) {
      setTimeout(function() {
        self.loadFeature(featureName, baseUrl);
      }, index * 200); // Stagger loading for smooth effect
    });
  };

  // Load individual feature
  G4Showcase.prototype.loadFeature = function(featureName, baseUrl) {
    var self = this;
    
    console.log('📦 Loading feature: ' + featureName);
    
    // Load CSS first
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = baseUrl + featureName + '.css';
    cssLink.onload = function() {
      // Then load JavaScript
      var jsScript = document.createElement('script');
      jsScript.src = baseUrl + featureName + '.js';
      jsScript.onload = function() {
        self.onFeatureLoaded(featureName);
      };
      jsScript.onerror = function() {
        console.error('❌ Failed to load ' + featureName + '.js');
        self.onFeatureLoaded(featureName, true);
      };
      document.head.appendChild(jsScript);
    };
    cssLink.onerror = function() {
      console.error('❌ Failed to load ' + featureName + '.css');
      self.onFeatureLoaded(featureName, true);
    };
    
    document.head.appendChild(cssLink);
  };

  // Handle feature loaded
  G4Showcase.prototype.onFeatureLoaded = function(featureName, hasError) {
    this.loadedCount++;
    var progress = (this.loadedCount / this.totalFeatures) * 100;
    
    if (hasError) {
      console.warn('⚠️ ' + featureName + ' loaded with errors');
    } else {
      console.log('✅ ' + featureName + ' loaded successfully');
      this.features[featureName] = true;
    }
    
    this.updateProgress(progress);
    
    // All features loaded
    if (this.loadedCount === this.totalFeatures) {
      setTimeout(function() {
        this.onAllFeaturesLoaded();
      }.bind(this), 300);
    }
  };

  // All features loaded callback
  G4Showcase.prototype.onAllFeaturesLoaded = function() {
    var loadTime = Date.now() - initStart;
    console.log('🎉 All showcase features loaded in ' + loadTime + 'ms');
    
    this.hideProgress();
    this.activateShowcaseMode();
  };

  // Activate showcase mode
  G4Showcase.prototype.activateShowcaseMode = function() {
    // Add showcase body class for special styling
    document.body.classList.add('g4-showcase-active');
    
    // Enable key features automatically for demo
    if (window.featureFlags) {
      setTimeout(function() {
        window.featureFlags.enable('toastNotifications');
        window.featureFlags.enable('loadingAnimations');
      }, 1000);
    }
  };

  // Setup integrations between features
  G4Showcase.prototype.setupIntegrations = function() {
    var self = this;
    
    // Listen for feature flag changes
    window.addEventListener('g4FlagToggle', function(event) {
      var detail = event.detail;
      console.log('🔄 Feature toggled:', detail.flag, detail.enabled ? 'ON' : 'OFF');
      
      // Show toast notification for feature changes
      if (window.toast && detail.flag !== 'toastNotifications') {
        if (detail.enabled) {
          window.toast.success('Feature enabled: ' + detail.flag, {
            duration: 3000
          });
        } else {
          window.toast.info('Feature disabled: ' + detail.flag, {
            duration: 2000
          });
        }
      }
    });

    // Integrate loading animations with AJAX
    if (window.G4Loading) {
      // Demo loading states periodically
      setInterval(function() {
        if (Math.random() > 0.95) { // 5% chance every interval
          self.demoLoadingState();
        }
      }, 5000);
    }
  };

  // Demo loading states
  G4Showcase.prototype.demoLoadingState = function() {
    if (!window.loading) return;
    
    var demoActions = [
      function() {
        window.loading.setProgress(0);
        setTimeout(function() { window.loading.setProgress(30); }, 200);
        setTimeout(function() { window.loading.setProgress(70); }, 500);
        setTimeout(function() { window.loading.setProgress(100); }, 800);
        setTimeout(function() { window.loading.setProgress(0); }, 1200);
      },
      function() {
        var buttons = document.querySelectorAll('button, input[type="submit"]');
        if (buttons.length > 0) {
          var randomButton = buttons[Math.floor(Math.random() * buttons.length)];
          window.loading.setButton(randomButton, true);
          setTimeout(function() {
            window.loading.setButton(randomButton, false);
          }, 2000);
        }
      }
    ];
    
    var randomDemo = demoActions[Math.floor(Math.random() * demoActions.length)];
    randomDemo();
  };

  // Add showcase controls
  G4Showcase.prototype.addShowcaseControls = function() {
    var self = this;
    
    // Add showcase panel (minimized by default)
    var panel = document.createElement('div');
    panel.id = 'g4-showcase-panel';
    panel.innerHTML = `
      <style>
        #g4-showcase-panel {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 16px;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          z-index: 9998;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
        }
        #g4-showcase-panel:hover {
          background: rgba(0, 0, 0, 0.95);
          transform: scale(1.05);
        }
        #g4-showcase-panel.minimized {
          padding: 8px 12px;
        }
        #g4-showcase-panel.minimized .g4-showcase-details {
          display: none;
        }
        .g4-showcase-title {
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .g4-showcase-details {
          opacity: 0.8;
          line-height: 1.4;
        }
        .g4-showcase-version {
          background: rgba(0, 123, 255, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
        }
      </style>
      <div class="g4-showcase-title">
        🎨 Grid4 Showcase
        <span class="g4-showcase-version">v${SHOWCASE_VERSION}</span>
      </div>
      <div class="g4-showcase-details">
        Features loaded: ${this.totalFeatures}<br>
        Press F for Feature Flags<br>
        RingCentral-inspired design
      </div>
    `;
    
    panel.addEventListener('click', function() {
      panel.classList.toggle('minimized');
    });
    
    document.body.appendChild(panel);
    
    // Minimize after a few seconds
    setTimeout(function() {
      panel.classList.add('minimized');
    }, 8000);
  };

  // Schedule welcome sequence
  G4Showcase.prototype.scheduleWelcome = function() {
    var self = this;
    
    // Wait for all features to load
    setTimeout(function() {
      self.showWelcomeSequence();
    }, 2000);
  };

  // Show welcome sequence
  G4Showcase.prototype.showWelcomeSequence = function() {
    if (!window.toast) return;
    
    var messages = [
      {
        type: 'success',
        title: 'Welcome to Grid4 Portal',
        message: 'Experience enhanced with premium features',
        duration: 4000
      },
      {
        type: 'info',
        title: 'Feature Flags Available',
        message: 'Press F to explore and toggle features',
        duration: 3000,
        delay: 1500
      },
      {
        type: 'info',
        title: 'Professional Polish',
        message: 'RingCentral-inspired design with Grid4 branding',
        duration: 3000,
        delay: 3000
      }
    ];
    
    messages.forEach(function(msg, index) {
      setTimeout(function() {
        window.toast[msg.type](msg.message, {
          title: msg.title,
          duration: msg.duration
        });
      }, msg.delay || 0);
    });
  };

  // Demo mode for showcasing features
  G4Showcase.prototype.startDemo = function() {
    console.log('🎬 Starting showcase demo mode');
    
    if (window.toast) {
      window.toast.info('Demo mode started', {
        title: 'Showcase Demo',
        duration: 2000
      });
    }
    
    // Demo sequence
    var demoSteps = [
      function() {
        // Demo toast notifications
        setTimeout(function() {
          if (window.toast) {
            window.toast.success('Data saved successfully!');
          }
        }, 1000);
      },
      function() {
        // Demo loading animations
        setTimeout(function() {
          if (window.loading) {
            var interval = window.loading.showProgress();
            setTimeout(function() {
              window.loading.completeProgress();
            }, 3000);
          }
        }, 2500);
      },
      function() {
        // Demo feature flags
        setTimeout(function() {
          if (window.featureFlags) {
            window.featureFlags.open();
            if (window.toast) {
              window.toast.info('Explore feature toggles!', {
                duration: 3000
              });
            }
          }
        }, 5000);
      }
    ];
    
    demoSteps.forEach(function(step) {
      step();
    });
  };

  // Performance monitoring
  G4Showcase.prototype.getPerformanceMetrics = function() {
    return {
      initTime: Date.now() - initStart,
      featuresLoaded: this.loadedCount,
      totalFeatures: this.totalFeatures,
      loadSuccess: Object.keys(this.features).length,
      version: SHOWCASE_VERSION,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  };

  // Export analytics
  G4Showcase.prototype.exportAnalytics = function() {
    var analytics = {
      showcase: this.getPerformanceMetrics(),
      featureFlags: window.featureFlags ? window.featureFlags.getAnalytics() : null,
      session: {
        startTime: initStart,
        duration: Date.now() - initStart,
        userInteractions: this.getUserInteractionCount()
      }
    };
    
    console.log('📊 Showcase Analytics:', analytics);
    return analytics;
  };

  // Get user interaction count
  G4Showcase.prototype.getUserInteractionCount = function() {
    // Simple heuristic based on various interaction counters
    var count = 0;
    
    if (window.G4FeatureFlags) {
      count += window.G4FeatureFlags.analytics.toggleCount;
    }
    
    // Add more interaction counting as needed
    return count;
  };

  // Create global instance
  window.G4Showcase = new G4Showcase();

  // Expose convenience methods
  window.showcase = {
    demo: function() { return window.G4Showcase.startDemo(); },
    analytics: function() { return window.G4Showcase.exportAnalytics(); },
    metrics: function() { return window.G4Showcase.getPerformanceMetrics(); }
  };

  // Development helpers
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    console.log('🔧 Development mode detected');
    console.log('🎯 Available commands:');
    console.log('   showcase.demo() - Start feature demo');
    console.log('   showcase.analytics() - Export analytics');
    console.log('   featureFlags.open() - Open feature manager');
    console.log('   window.G4Showcase - Main showcase instance');
  }

})(window, document);