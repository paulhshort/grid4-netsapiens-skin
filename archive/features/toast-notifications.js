/* Grid4 Toast Notifications - Production Ready
 * High-performance, cross-browser compatible toast system
 * Supports IE11+, all modern browsers, mobile devices
 * Zero dependencies, framework agnostic
 */

(function(window, document) {
  'use strict';

  // Prevent multiple initializations
  if (window.G4Toast) {
    console.warn('G4Toast already initialized');
    return;
  }

  // Feature detection and polyfills
  var hasRequestAnimationFrame = typeof window.requestAnimationFrame === 'function';
  var hasClassList = typeof document.createElement('div').classList !== 'undefined';
  var hasCSSCustomProperties = (function() {
    if (typeof window.CSS === 'undefined' || typeof CSS.supports === 'undefined') {
      return false;
    }
    return CSS.supports('--test', 'test');
  })();

  // Polyfill for requestAnimationFrame
  var requestAnimationFrame = hasRequestAnimationFrame ? 
    window.requestAnimationFrame.bind(window) : 
    function(callback) { return setTimeout(callback, 16); };

  // Polyfill for classList
  function addClass(element, className) {
    if (hasClassList) {
      element.classList.add(className);
    } else {
      if (element.className.indexOf(className) === -1) {
        element.className += ' ' + className;
      }
    }
  }

  function removeClass(element, className) {
    if (hasClassList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
    }
  }

  function hasClass(element, className) {
    if (hasClassList) {
      return element.classList.contains(className);
    } else {
      return element.className.indexOf(className) !== -1;
    }
  }

  // Unique ID generator
  var toastIdCounter = 0;
  function generateId() {
    return 'g4-toast-' + (++toastIdCounter) + '-' + Date.now();
  }

  // Default configuration
  var defaultOptions = {
    duration: 5000,
    position: 'top-right',
    type: 'info',
    persistent: false,
    showProgress: true,
    allowClose: true,
    showIcon: true,
    animation: true,
    pauseOnHover: true,
    onClick: null,
    onShow: null,
    onHide: null
  };

  // Icon mapping for different types
  var typeIcons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'i',
    loading: '⟳'
  };

  // Main Toast class
  function G4Toast() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  G4Toast.prototype.init = function() {
    this.createContainer();
    this.setupGlobalStyles();
    this.interceptAjaxCalls();
  };

  G4Toast.prototype.createContainer = function() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'g4-toast-container';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Notifications');
    this.container.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(this.container);
  };

  G4Toast.prototype.setupGlobalStyles = function() {
    // Inject CSS if not already present
    if (!document.querySelector('#g4-toast-styles')) {
      var link = document.createElement('link');
      link.id = 'g4-toast-styles';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/features/toast-notifications.css';
      document.head.appendChild(link);
    }
  };

  G4Toast.prototype.show = function(options) {
    if (typeof options === 'string') {
      options = { message: options };
    }

    var config = this.mergeOptions(defaultOptions, options);
    var toast = this.createToastElement(config);
    
    this.container.appendChild(toast.element);
    this.toasts.push(toast);

    // Trigger show animation
    var self = this;
    requestAnimationFrame(function() {
      addClass(toast.element, 'g4-toast-show');
      if (config.onShow) {
        config.onShow(toast);
      }
    });

    // Auto-hide logic
    if (!config.persistent && config.duration > 0) {
      this.scheduleHide(toast, config.duration);
    }

    return toast;
  };

  G4Toast.prototype.createToastElement = function(config) {
    var toastId = generateId();
    var element = document.createElement('div');
    
    element.className = 'g4-toast g4-toast-' + config.type;
    element.id = toastId;
    element.setAttribute('role', 'alert');
    element.setAttribute('aria-labelledby', toastId + '-title');
    element.setAttribute('aria-describedby', toastId + '-message');

    var html = '';

    // Icon
    if (config.showIcon) {
      html += '<div class="g4-toast-icon" aria-hidden="true">' + 
              (typeIcons[config.type] || typeIcons.info) + 
              '</div>';
    }

    // Content
    html += '<div class="g4-toast-content">';
    if (config.title) {
      html += '<div class="g4-toast-title" id="' + toastId + '-title">' + 
              this.escapeHtml(config.title) + 
              '</div>';
    }
    html += '<div class="g4-toast-message" id="' + toastId + '-message">' + 
            this.escapeHtml(config.message || '') + 
            '</div>';
    html += '</div>';

    // Close button
    if (config.allowClose) {
      html += '<button class="g4-toast-close" type="button" aria-label="Close notification" tabindex="0">×</button>';
    }

    // Progress bar
    if (config.showProgress && !config.persistent && config.duration > 0) {
      html += '<div class="g4-toast-progress"></div>';
    }

    element.innerHTML = html;

    var toast = {
      id: toastId,
      element: element,
      config: config,
      timer: null,
      progressTimer: null,
      startTime: null,
      pausedTime: 0,
      isHovered: false
    };

    this.attachEventListeners(toast);
    return toast;
  };

  G4Toast.prototype.attachEventListeners = function(toast) {
    var self = this;
    var element = toast.element;
    var config = toast.config;

    // Close button
    var closeButton = element.querySelector('.g4-toast-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.hide(toast);
      });

      closeButton.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
          e.preventDefault();
          self.hide(toast);
        }
      });
    }

    // Click handler
    if (config.onClick) {
      element.addEventListener('click', function(e) {
        config.onClick(toast, e);
      });
      element.style.cursor = 'pointer';
    }

    // Pause on hover
    if (config.pauseOnHover && !config.persistent) {
      element.addEventListener('mouseenter', function() {
        toast.isHovered = true;
        self.pauseTimer(toast);
      });

      element.addEventListener('mouseleave', function() {
        toast.isHovered = false;
        if (toast.config.duration > 0) {
          self.resumeTimer(toast);
        }
      });
    }

    // Keyboard accessibility - Escape to close
    element.addEventListener('keydown', function(e) {
      if (e.keyCode === 27) { // Escape
        self.hide(toast);
      }
    });

    // Focus management
    element.setAttribute('tabindex', '-1');
  };

  G4Toast.prototype.scheduleHide = function(toast, duration) {
    var self = this;
    toast.startTime = Date.now();

    // Progress bar animation
    var progressBar = toast.element.querySelector('.g4-toast-progress');
    if (progressBar) {
      progressBar.style.transformOrigin = 'left';
      progressBar.style.transform = 'scaleX(1)';
      progressBar.style.transition = 'transform ' + duration + 'ms linear';
      
      requestAnimationFrame(function() {
        progressBar.style.transform = 'scaleX(0)';
      });
    }

    // Hide timer
    toast.timer = setTimeout(function() {
      if (!toast.isHovered) {
        self.hide(toast);
      }
    }, duration);
  };

  G4Toast.prototype.pauseTimer = function(toast) {
    if (toast.timer) {
      clearTimeout(toast.timer);
      toast.pausedTime = Date.now() - toast.startTime;
      
      var progressBar = toast.element.querySelector('.g4-toast-progress');
      if (progressBar) {
        progressBar.style.transition = 'none';
      }
    }
  };

  G4Toast.prototype.resumeTimer = function(toast) {
    if (toast.pausedTime > 0 && toast.config.duration > toast.pausedTime) {
      var remainingTime = toast.config.duration - toast.pausedTime;
      this.scheduleHide(toast, remainingTime);
    }
  };

  G4Toast.prototype.hide = function(toast) {
    if (!toast || !toast.element || !toast.element.parentNode) {
      return;
    }

    var self = this;
    var element = toast.element;

    // Clear timers
    if (toast.timer) {
      clearTimeout(toast.timer);
    }
    if (toast.progressTimer) {
      clearTimeout(toast.progressTimer);
    }

    // Exit animation
    addClass(element, 'g4-toast-exit');

    // Remove from DOM after animation
    setTimeout(function() {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      // Remove from toasts array
      var index = self.toasts.indexOf(toast);
      if (index > -1) {
        self.toasts.splice(index, 1);
      }

      if (toast.config.onHide) {
        toast.config.onHide(toast);
      }
    }, 300);
  };

  G4Toast.prototype.hideAll = function() {
    var toastsCopy = this.toasts.slice();
    for (var i = 0; i < toastsCopy.length; i++) {
      this.hide(toastsCopy[i]);
    }
  };

  // AJAX interception for automatic notifications
  G4Toast.prototype.interceptAjaxCalls = function() {
    var self = this;

    // Only intercept if feature is enabled
    if (!window.g4c || !window.g4c.isFeatureEnabled('autoToastNotifications')) {
      return;
    }

    // XMLHttpRequest interception
    if (window.XMLHttpRequest) {
      var originalSend = XMLHttpRequest.prototype.send;
      
      XMLHttpRequest.prototype.send = function(data) {
        var xhr = this;
        
        // Store original handlers
        var originalOnLoad = xhr.onload;
        var originalOnError = xhr.onerror;

        xhr.addEventListener('load', function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Check if this is a form submission
            if (data && (xhr.method === 'POST' || xhr.method === 'PUT')) {
              self.success('Changes saved successfully');
            }
          }
        });

        xhr.addEventListener('error', function() {
          self.error('Request failed. Please try again.');
        });

        return originalSend.call(this, data);
      };
    }

    // jQuery AJAX interception (if available)
    if (window.jQuery) {
      window.jQuery(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.type === 'POST' || settings.type === 'PUT') {
          self.success('Changes saved successfully');
        }
      });

      window.jQuery(document).ajaxError(function(event, xhr, settings) {
        self.error('Request failed. Please try again.');
      });
    }
  };

  // Utility methods
  G4Toast.prototype.mergeOptions = function(defaults, options) {
    var merged = {};
    for (var key in defaults) {
      merged[key] = defaults[key];
    }
    for (var key in options) {
      merged[key] = options[key];
    }
    return merged;
  };

  G4Toast.prototype.escapeHtml = function(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Convenience methods
  G4Toast.prototype.success = function(message, options) {
    return this.show(this.mergeOptions({ type: 'success', message: message }, options || {}));
  };

  G4Toast.prototype.warning = function(message, options) {
    return this.show(this.mergeOptions({ type: 'warning', message: message }, options || {}));
  };

  G4Toast.prototype.error = function(message, options) {
    return this.show(this.mergeOptions({ type: 'error', message: message, duration: 8000 }, options || {}));
  };

  G4Toast.prototype.info = function(message, options) {
    return this.show(this.mergeOptions({ type: 'info', message: message }, options || {}));
  };

  G4Toast.prototype.loading = function(message, options) {
    return this.show(this.mergeOptions({ 
      type: 'loading', 
      message: message || 'Loading...', 
      persistent: true,
      allowClose: false,
      showProgress: false
    }, options || {}));
  };

  // Create global instance
  window.G4Toast = new G4Toast();

  // Expose convenience methods globally
  window.toast = {
    show: function(options) { return window.G4Toast.show(options); },
    success: function(message, options) { return window.G4Toast.success(message, options); },
    warning: function(message, options) { return window.G4Toast.warning(message, options); },
    error: function(message, options) { return window.G4Toast.error(message, options); },
    info: function(message, options) { return window.G4Toast.info(message, options); },
    loading: function(message, options) { return window.G4Toast.loading(message, options); },
    hide: function(toast) { return window.G4Toast.hide(toast); },
    hideAll: function() { return window.G4Toast.hideAll(); }
  };

  // Integration with Grid4 feature flag system
  if (window.g4c && window.g4c.isFeatureEnabled('toastNotifications')) {
    console.log('✅ G4Toast: Toast notifications enabled');
    
    // Show welcome message
    setTimeout(function() {
      window.toast.success('Grid4 Portal Enhanced!', {
        title: 'Welcome',
        duration: 3000
      });
    }, 1000);
  }

})(window, document);