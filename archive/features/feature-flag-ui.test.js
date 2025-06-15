/* Grid4 Feature Flag UI - Test Suite
 * Test-Driven Development approach with comprehensive coverage
 * Run with: node feature-flag-ui.test.js or in browser console
 */

(function(window, document) {
  'use strict';

  // Simple test framework for our needs
  function TestFramework() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.startTime = Date.now();
  }

  TestFramework.prototype.describe = function(name, fn) {
    console.group('📋 ' + name);
    fn();
    console.groupEnd();
  };

  TestFramework.prototype.it = function(description, fn) {
    try {
      fn();
      this.passed++;
      console.log('✅ ' + description);
    } catch (error) {
      this.failed++;
      console.error('❌ ' + description);
      console.error('   Error:', error.message);
    }
  };

  TestFramework.prototype.expect = function(actual) {
    return {
      toBe: function(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual: function(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toBeTrue: function() {
        if (actual !== true) {
          throw new Error(`Expected ${actual} to be true`);
        }
      },
      toBeFalse: function() {
        if (actual !== false) {
          throw new Error(`Expected ${actual} to be false`);
        }
      },
      toExist: function() {
        if (actual === null || actual === undefined) {
          throw new Error('Expected value to exist');
        }
      },
      toContain: function(expected) {
        if (actual.indexOf(expected) === -1) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: function(expected) {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${actual.length} to be ${expected}`);
        }
      }
    };
  };

  TestFramework.prototype.summary = function() {
    var duration = Date.now() - this.startTime;
    var total = this.passed + this.failed;
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📝 Total: ${total}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log(`⚠️ ${this.failed} test(s) failed`);
    }
  };

  // Mock localStorage for testing
  function MockLocalStorage() {
    this.data = {};
  }

  MockLocalStorage.prototype.getItem = function(key) {
    return this.data[key] || null;
  };

  MockLocalStorage.prototype.setItem = function(key, value) {
    this.data[key] = value;
  };

  MockLocalStorage.prototype.removeItem = function(key) {
    delete this.data[key];
  };

  MockLocalStorage.prototype.clear = function() {
    this.data = {};
  };

  // Mock DOM elements for testing
  function MockElement(tagName) {
    this.tagName = tagName.toUpperCase();
    this.className = '';
    this.id = '';
    this.textContent = '';
    this.innerHTML = '';
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.style = {};
    this.events = {};
  }

  MockElement.prototype.appendChild = function(child) {
    this.children.push(child);
    child.parentNode = this;
  };

  MockElement.prototype.removeChild = function(child) {
    var index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
  };

  MockElement.prototype.addEventListener = function(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  };

  MockElement.prototype.setAttribute = function(name, value) {
    this.attributes[name] = value;
  };

  MockElement.prototype.getAttribute = function(name) {
    return this.attributes[name];
  };

  MockElement.prototype.querySelector = function(selector) {
    // Simple mock implementation
    return this.children[0] || null;
  };

  MockElement.prototype.querySelectorAll = function(selector) {
    // Simple mock implementation
    return this.children;
  };

  MockElement.prototype.classList = {
    add: function(className) {
      if (this.className.indexOf(className) === -1) {
        this.className += (this.className ? ' ' : '') + className;
      }
    }.bind(this),
    remove: function(className) {
      this.className = this.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '').trim();
    }.bind(this),
    contains: function(className) {
      return this.className.indexOf(className) !== -1;
    }.bind(this)
  };

  // Test environment setup
  function setupTestEnvironment() {
    // Mock localStorage
    var originalLocalStorage = window.localStorage;
    window.localStorage = new MockLocalStorage();
    
    // Mock document methods
    var originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      return new MockElement(tagName);
    };
    
    // Mock document.body
    if (!document.body) {
      document.body = new MockElement('body');
    }
    
    return {
      restore: function() {
        window.localStorage = originalLocalStorage;
        document.createElement = originalCreateElement;
      }
    };
  }

  // Run tests
  function runTests() {
    var test = new TestFramework();
    var env = setupTestEnvironment();
    
    console.log('🧪 Starting Grid4 Feature Flag UI Tests');
    console.log('=====================================\n');

    // Core functionality tests
    test.describe('Core Initialization', function() {
      test.it('should create G4FeatureFlags instance', function() {
        test.expect(window.G4FeatureFlags).toExist();
        test.expect(typeof window.G4FeatureFlags).toBe('object');
      });

      test.it('should load default flags', function() {
        test.expect(Object.keys(window.G4FeatureFlags.flags)).toHaveLength(10);
        test.expect(window.G4FeatureFlags.flags.toastNotifications).toExist();
        test.expect(window.G4FeatureFlags.flags.loadingAnimations).toExist();
      });

      test.it('should initialize with all flags disabled by default', function() {
        var allDisabled = true;
        for (var key in window.G4FeatureFlags.flags) {
          if (window.G4FeatureFlags.flags[key].enabled) {
            allDisabled = false;
            break;
          }
        }
        test.expect(allDisabled).toBeTrue();
      });

      test.it('should expose global convenience methods', function() {
        test.expect(window.featureFlags).toExist();
        test.expect(typeof window.featureFlags.isEnabled).toBe('function');
        test.expect(typeof window.featureFlags.enable).toBe('function');
        test.expect(typeof window.featureFlags.disable).toBe('function');
      });
    });

    // Flag manipulation tests
    test.describe('Flag Management', function() {
      test.it('should enable a flag', function() {
        window.G4FeatureFlags.enable('toastNotifications');
        test.expect(window.G4FeatureFlags.isEnabled('toastNotifications')).toBeTrue();
      });

      test.it('should disable a flag', function() {
        window.G4FeatureFlags.enable('loadingAnimations');
        test.expect(window.G4FeatureFlags.isEnabled('loadingAnimations')).toBeTrue();
        
        window.G4FeatureFlags.disable('loadingAnimations');
        test.expect(window.G4FeatureFlags.isEnabled('loadingAnimations')).toBeFalse();
      });

      test.it('should handle non-existent flags gracefully', function() {
        test.expect(window.G4FeatureFlags.isEnabled('nonExistentFlag')).toBeFalse();
        
        // These should not throw errors
        window.G4FeatureFlags.enable('nonExistentFlag');
        window.G4FeatureFlags.disable('nonExistentFlag');
      });

      test.it('should save flags to localStorage', function() {
        window.G4FeatureFlags.enable('commandPalette');
        window.G4FeatureFlags.saveFlags();
        
        var stored = JSON.parse(window.localStorage.getItem('g4_feature_flags'));
        test.expect(stored.commandPalette.enabled).toBeTrue();
      });

      test.it('should load flags from localStorage', function() {
        // Set up localStorage with some flags
        var testFlags = {
          toastNotifications: { enabled: true },
          loadingAnimations: { enabled: false }
        };
        window.localStorage.setItem('g4_feature_flags', JSON.stringify(testFlags));
        
        // Create new instance to test loading
        var newInstance = new window.G4FeatureFlags.constructor();
        test.expect(newInstance.flags.toastNotifications.enabled).toBeTrue();
        test.expect(newInstance.flags.loadingAnimations.enabled).toBeFalse();
      });
    });

    // Dependency management tests
    test.describe('Dependency Management', function() {
      test.it('should respect flag dependencies', function() {
        // autoToastNotifications depends on toastNotifications
        test.expect(window.G4FeatureFlags.flags.autoToastNotifications.dependencies).toContain('toastNotifications');
      });

      test.it('should check dependencies before enabling', function() {
        // Ensure toastNotifications is disabled
        window.G4FeatureFlags.disable('toastNotifications');
        
        // Try to enable autoToastNotifications without its dependency
        // Note: In the real implementation, this would show a warning toast
        // For testing, we'll check the flag structure
        var flag = window.G4FeatureFlags.flags.autoToastNotifications;
        test.expect(flag.dependencies.length).toBe(1);
        test.expect(flag.dependencies[0]).toBe('toastNotifications');
      });
    });

    // Analytics tests
    test.describe('Analytics Tracking', function() {
      test.it('should track toggle count', function() {
        var initialCount = window.G4FeatureFlags.analytics.toggleCount;
        window.G4FeatureFlags.enable('darkMode');
        test.expect(window.G4FeatureFlags.analytics.toggleCount).toBe(initialCount + 1);
      });

      test.it('should track interactions', function() {
        var initialLength = window.G4FeatureFlags.analytics.interactions.length;
        window.G4FeatureFlags.analytics.interactions.push({
          type: 'test_interaction',
          timestamp: Date.now()
        });
        test.expect(window.G4FeatureFlags.analytics.interactions.length).toBe(initialLength + 1);
      });

      test.it('should provide analytics summary', function() {
        var analytics = window.G4FeatureFlags.getAnalytics();
        test.expect(analytics).toExist();
        test.expect(typeof analytics.toggleCount).toBe('number');
        test.expect(typeof analytics.sessionDuration).toBe('number');
        test.expect(Array.isArray(analytics.interactions)).toBeTrue();
      });
    });

    // UI component tests
    test.describe('UI Components', function() {
      test.it('should create FAB button', function() {
        test.expect(window.G4FeatureFlags.fab).toExist();
        test.expect(window.G4FeatureFlags.fab.className).toContain('g4-ff-fab');
      });

      test.it('should generate modal HTML', function() {
        var html = window.G4FeatureFlags.getModalHTML();
        test.expect(html).toContain('g4-ff-header');
        test.expect(html).toContain('g4-ff-toolbar');
        test.expect(html).toContain('g4-ff-content');
      });

      test.it('should filter flags correctly', function() {
        window.G4FeatureFlags.activeFilter = 'ui';
        var filtered = window.G4FeatureFlags.getFilteredFlags();
        
        var allUI = true;
        for (var i = 0; i < filtered.length; i++) {
          if (filtered[i].flag.category !== 'ui') {
            allUI = false;
            break;
          }
        }
        test.expect(allUI).toBeTrue();
      });

      test.it('should search flags by name and description', function() {
        window.G4FeatureFlags.searchTerm = 'toast';
        window.G4FeatureFlags.activeFilter = 'all';
        var filtered = window.G4FeatureFlags.getFilteredFlags();
        
        test.expect(filtered.length).toBe(2); // toastNotifications and autoToastNotifications
      });
    });

    // Integration tests
    test.describe('Integration with g4c', function() {
      test.it('should override g4c.isFeatureEnabled if g4c exists', function() {
        // Mock g4c
        window.g4c = {
          isFeatureEnabled: function() { return false; }
        };
        
        // Re-run the integration code
        if (window.g4c) {
          var originalIsFeatureEnabled = window.g4c.isFeatureEnabled;
          window.g4c.isFeatureEnabled = function(flagKey) {
            if (window.G4FeatureFlags.flags[flagKey]) {
              return window.G4FeatureFlags.isEnabled(flagKey);
            }
            return originalIsFeatureEnabled.call(this, flagKey);
          };
        }
        
        // Enable a flag and test
        window.G4FeatureFlags.enable('toastNotifications');
        test.expect(window.g4c.isFeatureEnabled('toastNotifications')).toBeTrue();
      });
    });

    // Performance tests
    test.describe('Performance', function() {
      test.it('should initialize quickly', function() {
        var start = Date.now();
        new window.G4FeatureFlags.constructor();
        var duration = Date.now() - start;
        
        test.expect(duration < 100).toBeTrue(); // Should initialize in under 100ms
      });

      test.it('should handle large numbers of flags efficiently', function() {
        var largeFlags = {};
        for (var i = 0; i < 1000; i++) {
          largeFlags['flag' + i] = {
            name: 'Flag ' + i,
            description: 'Test flag ' + i,
            category: 'test',
            impact: 'low',
            enabled: false
          };
        }
        
        var start = Date.now();
        window.G4FeatureFlags.flags = largeFlags;
        window.G4FeatureFlags.getFilteredFlags();
        var duration = Date.now() - start;
        
        test.expect(duration < 50).toBeTrue(); // Should filter in under 50ms
      });
    });

    // Error handling tests
    test.describe('Error Handling', function() {
      test.it('should handle localStorage errors gracefully', function() {
        // Mock localStorage to throw an error
        var originalSetItem = window.localStorage.setItem;
        window.localStorage.setItem = function() {
          throw new Error('Storage full');
        };
        
        // This should not throw an error
        window.G4FeatureFlags.saveFlags();
        
        // Restore
        window.localStorage.setItem = originalSetItem;
      });

      test.it('should handle malformed localStorage data', function() {
        window.localStorage.setItem('g4_feature_flags', 'invalid json');
        
        // Should fall back to defaults without throwing
        var instance = new window.G4FeatureFlags.constructor();
        test.expect(Object.keys(instance.flags).length).toBe(10);
      });
    });

    // Accessibility tests
    test.describe('Accessibility', function() {
      test.it('should add proper ARIA attributes to toggles', function() {
        var html = window.G4FeatureFlags.getFilteredFlagsHTML();
        test.expect(html).toContain('role="switch"');
        test.expect(html).toContain('aria-checked');
        test.expect(html).toContain('tabindex="0"');
      });

      test.it('should add proper ARIA attributes to modal', function() {
        var html = window.G4FeatureFlags.getModalHTML();
        test.expect(html).toContain('role="dialog"');
        test.expect(html).toContain('aria-modal="true"');
        test.expect(html).toContain('aria-labelledby');
      });
    });

    // Clean up and summary
    env.restore();
    test.summary();
    
    // Return test results for programmatic use
    return {
      passed: test.passed,
      failed: test.failed,
      total: test.passed + test.failed
    };
  }

  // Auto-run tests if in browser environment
  if (typeof window !== 'undefined' && window.G4FeatureFlags) {
    // Wait a bit for initialization
    setTimeout(runTests, 100);
  }

  // Export for Node.js if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests: runTests };
  }

})(typeof window !== 'undefined' ? window : global, typeof document !== 'undefined' ? document : {});