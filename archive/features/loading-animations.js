/* Grid4 Loading Animations - RingCentral Inspired
 * Premium loading states with intelligent detection
 * Zero dependencies, high performance
 */

(function(window, document) {
  'use strict';

  // Prevent multiple initializations
  if (window.G4Loading) {
    console.warn('G4Loading already initialized');
    return;
  }

  // Performance monitoring
  var performanceStart = Date.now();

  // Feature detection
  var hasRequestAnimationFrame = typeof window.requestAnimationFrame === 'function';
  var hasIntersectionObserver = typeof window.IntersectionObserver === 'function';

  var requestAnimationFrame = hasRequestAnimationFrame ? 
    window.requestAnimationFrame.bind(window) : 
    function(callback) { return setTimeout(callback, 16); };

  // Main Loading class
  function G4Loading() {
    this.activeLoaders = new Map();
    this.progressBar = null;
    this.globalOverlay = null;
    this.interceptedRequests = 0;
    this.completedRequests = 0;
    
    this.init();
  }

  G4Loading.prototype.init = function() {
    this.injectStyles();
    this.createProgressBar();
    this.setupAjaxInterception();
    this.setupFormInterception();
    this.observePageChanges();
    
    console.log('✅ G4Loading: Initialized in ' + (Date.now() - performanceStart) + 'ms');
  };

  G4Loading.prototype.injectStyles = function() {
    if (!document.querySelector('#g4-loading-styles')) {
      var link = document.createElement('link');
      link.id = 'g4-loading-styles';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/features/loading-animations.css';
      
      // Preload for better performance
      link.onload = function() {
        console.log('✅ G4Loading: Styles loaded');
      };
      
      document.head.appendChild(link);
    }
  };

  G4Loading.prototype.createProgressBar = function() {
    if (this.progressBar) return;

    this.progressBar = document.createElement('div');
    this.progressBar.className = 'g4-progress-bar';
    this.progressBar.innerHTML = '<div class="g4-progress-fill"></div>';
    
    document.body.appendChild(this.progressBar);
  };

  // Global loading overlay with RingCentral styling
  G4Loading.prototype.showGlobal = function(options) {
    options = options || {};
    
    if (this.globalOverlay) {
      this.hideGlobal();
    }

    this.globalOverlay = document.createElement('div');
    this.globalOverlay.className = 'g4-loading-overlay';
    this.globalOverlay.setAttribute('role', 'dialog');
    this.globalOverlay.setAttribute('aria-label', 'Loading');
    this.globalOverlay.setAttribute('aria-describedby', 'g4-loading-text');

    var content = document.createElement('div');
    content.className = 'g4-loading-content';

    var spinner = document.createElement('div');
    spinner.className = 'g4-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-hidden', 'true');

    var text = document.createElement('div');
    text.className = 'g4-loading-text';
    text.id = 'g4-loading-text';
    text.textContent = options.message || 'Loading...';

    if (options.subtext) {
      var subtext = document.createElement('div');
      subtext.className = 'g4-loading-subtext';
      subtext.textContent = options.subtext;
      content.appendChild(subtext);
    }

    content.appendChild(spinner);
    content.appendChild(text);
    this.globalOverlay.appendChild(content);

    document.body.appendChild(this.globalOverlay);

    // Trigger animation
    requestAnimationFrame(function() {
      this.globalOverlay.classList.add('g4-active');
    }.bind(this));

    // Auto-hide timeout
    if (options.timeout) {
      setTimeout(function() {
        this.hideGlobal();
      }.bind(this), options.timeout);
    }

    return this.globalOverlay;
  };

  G4Loading.prototype.hideGlobal = function() {
    if (!this.globalOverlay) return;

    this.globalOverlay.classList.remove('g4-active');

    setTimeout(function() {
      if (this.globalOverlay && this.globalOverlay.parentNode) {
        this.globalOverlay.parentNode.removeChild(this.globalOverlay);
      }
      this.globalOverlay = null;
    }.bind(this), 300);
  };

  // Button loading states
  G4Loading.prototype.setButtonLoading = function(button, loading) {
    if (!button) return;

    if (loading) {
      button.classList.add('g4-loading');
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      
      // Store original text
      if (!button.hasAttribute('data-original-text')) {
        button.setAttribute('data-original-text', button.textContent);
      }
    } else {
      button.classList.remove('g4-loading');
      button.setAttribute('aria-busy', 'false');
      button.disabled = false;
      
      // Restore original text
      var originalText = button.getAttribute('data-original-text');
      if (originalText) {
        button.textContent = originalText;
      }
    }
  };

  // Form loading states
  G4Loading.prototype.setFormLoading = function(form, loading) {
    if (!form) return;

    if (loading) {
      form.classList.add('g4-form-loading');
      
      // Disable all form elements
      var elements = form.querySelectorAll('input, textarea, select, button');
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
      }
    } else {
      form.classList.remove('g4-form-loading');
      
      // Re-enable form elements
      var elements = form.querySelectorAll('input, textarea, select, button');
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }
    }
  };

  // Table loading states
  G4Loading.prototype.setTableLoading = function(table, loading) {
    if (!table) return;

    if (loading) {
      table.classList.add('g4-table-loading');
      table.setAttribute('aria-busy', 'true');
    } else {
      table.classList.remove('g4-table-loading');
      table.setAttribute('aria-busy', 'false');
    }
  };

  // Progress bar management
  G4Loading.prototype.setProgress = function(percentage) {
    if (!this.progressBar) return;

    var fill = this.progressBar.querySelector('.g4-progress-fill');
    if (fill) {
      fill.style.width = Math.max(0, Math.min(100, percentage)) + '%';
    }

    if (percentage > 0) {
      this.progressBar.classList.add('g4-active');
    } else {
      this.progressBar.classList.remove('g4-active');
    }
  };

  G4Loading.prototype.showProgress = function() {
    this.setProgress(0);
    
    // Simulate progress
    var progress = 0;
    var interval = setInterval(function() {
      progress += Math.random() * 15;
      this.setProgress(Math.min(progress, 90));
      
      if (progress >= 90) {
        clearInterval(interval);
      }
    }.bind(this), 200);

    return interval;
  };

  G4Loading.prototype.completeProgress = function() {
    this.setProgress(100);
    
    setTimeout(function() {
      this.setProgress(0);
    }.bind(this), 500);
  };

  // Skeleton loading creation
  G4Loading.prototype.createSkeleton = function(element, options) {
    options = options || {};
    
    if (!element) return;

    var skeleton = document.createElement('div');
    skeleton.className = 'g4-skeleton';
    
    if (options.type === 'text') {
      skeleton.classList.add('g4-skeleton-text');
    } else if (options.type === 'title') {
      skeleton.classList.add('g4-skeleton-title');
    } else if (options.type === 'avatar') {
      skeleton.classList.add('g4-skeleton-avatar');
    } else if (options.type === 'button') {
      skeleton.classList.add('g4-skeleton-button');
    }
    
    if (options.width) skeleton.style.width = options.width;
    if (options.height) skeleton.style.height = options.height;
    
    element.appendChild(skeleton);
    return skeleton;
  };

  // AJAX interception with intelligent loading
  G4Loading.prototype.setupAjaxInterception = function() {
    var self = this;

    // Only if feature is enabled
    if (!window.g4c || !window.g4c.isFeatureEnabled('loadingAnimations')) {
      return;
    }

    // XMLHttpRequest interception
    if (window.XMLHttpRequest) {
      var originalOpen = XMLHttpRequest.prototype.open;
      var originalSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function(method, url) {
        this._g4_method = method;
        this._g4_url = url;
        return originalOpen.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function(data) {
        var xhr = this;
        
        // Only show loading for certain requests
        if (this._g4_method === 'POST' || this._g4_method === 'PUT' || this._g4_method === 'DELETE') {
          self.interceptedRequests++;
          
          // Show progress if no other loading is active
          if (self.interceptedRequests === 1) {
            self.showProgress();
          }

          var originalOnReadyStateChange = xhr.onreadystatechange;
          
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              self.completedRequests++;
              
              // Hide progress when all requests complete
              if (self.completedRequests >= self.interceptedRequests) {
                self.completeProgress();
                self.interceptedRequests = 0;
                self.completedRequests = 0;
              }
            }
            
            if (originalOnReadyStateChange) {
              originalOnReadyStateChange.apply(xhr, arguments);
            }
          };
        }

        return originalSend.apply(this, arguments);
      };
    }

    // jQuery AJAX hooks (if available)
    if (window.jQuery) {
      var $ = window.jQuery;
      
      $(document).ajaxStart(function() {
        if (self.interceptedRequests === 0) {
          self.showProgress();
        }
        self.interceptedRequests++;
      });

      $(document).ajaxComplete(function() {
        self.completedRequests++;
        if (self.completedRequests >= self.interceptedRequests) {
          self.completeProgress();
          self.interceptedRequests = 0;
          self.completedRequests = 0;
        }
      });
    }
  };

  // Form submission interception
  G4Loading.prototype.setupFormInterception = function() {
    var self = this;

    // Only if feature is enabled
    if (!window.g4c || !window.g4c.isFeatureEnabled('loadingAnimations')) {
      return;
    }

    document.addEventListener('submit', function(e) {
      var form = e.target;
      if (form.tagName === 'FORM') {
        // Set form loading state
        self.setFormLoading(form, true);
        
        // Find submit button and set loading
        var submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
        if (submitButton) {
          self.setButtonLoading(submitButton, true);
        }

        // Reset loading states after a delay (fallback)
        setTimeout(function() {
          self.setFormLoading(form, false);
          if (submitButton) {
            self.setButtonLoading(submitButton, false);
          }
        }, 5000);
      }
    });
  };

  // Page change detection
  G4Loading.prototype.observePageChanges = function() {
    var self = this;

    // Listen for page navigation (SPA-style)
    var originalPushState = history.pushState;
    var originalReplaceState = history.replaceState;

    history.pushState = function() {
      self.showProgress();
      setTimeout(function() { self.completeProgress(); }, 500);
      return originalPushState.apply(history, arguments);
    };

    history.replaceState = function() {
      self.showProgress();
      setTimeout(function() { self.completeProgress(); }, 500);
      return originalReplaceState.apply(history, arguments);
    };

    // Listen for back/forward navigation
    window.addEventListener('popstate', function() {
      self.showProgress();
      setTimeout(function() { self.completeProgress(); }, 500);
    });
  };

  // Dots loading animation
  G4Loading.prototype.createDotsLoader = function(element) {
    if (!element) return;

    var loader = document.createElement('div');
    loader.className = 'g4-dots-loading';
    loader.innerHTML = '<span></span><span></span><span></span>';
    
    element.appendChild(loader);
    return loader;
  };

  // Utility methods
  G4Loading.prototype.isElementInViewport = function(element) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Create global instance
  window.G4Loading = new G4Loading();

  // Expose convenience methods globally
  window.loading = {
    show: function(options) { return window.G4Loading.showGlobal(options); },
    hide: function() { return window.G4Loading.hideGlobal(); },
    setButton: function(button, loading) { return window.G4Loading.setButtonLoading(button, loading); },
    setForm: function(form, loading) { return window.G4Loading.setFormLoading(form, loading); },
    setTable: function(table, loading) { return window.G4Loading.setTableLoading(table, loading); },
    setProgress: function(percentage) { return window.G4Loading.setProgress(percentage); },
    createSkeleton: function(element, options) { return window.G4Loading.createSkeleton(element, options); },
    createDots: function(element) { return window.G4Loading.createDotsLoader(element); }
  };

  // Enhanced button click handling
  document.addEventListener('click', function(e) {
    var button = e.target;
    
    // Auto-detect buttons that should show loading
    if ((button.tagName === 'BUTTON' || button.tagName === 'INPUT') && 
        button.type === 'submit' && 
        !button.classList.contains('g4-no-loading')) {
      
      window.G4Loading.setButtonLoading(button, true);
      
      // Reset after timeout (fallback)
      setTimeout(function() {
        window.G4Loading.setButtonLoading(button, false);
      }, 3000);
    }
  });

  // Integration with Grid4 feature system
  if (window.g4c && window.g4c.isFeatureEnabled('loadingAnimations')) {
    console.log('✅ G4Loading: Loading animations enabled');
    
    // Show a quick demo
    setTimeout(function() {
      if (window.toast) {
        window.toast.info('Loading animations active!', {
          duration: 2000
        });
      }
    }, 2000);
  }

  // Performance monitoring
  window.addEventListener('load', function() {
    var loadTime = Date.now() - performanceStart;
    console.log('⚡ G4Loading: Ready in ' + loadTime + 'ms');
  });

})(window, document);