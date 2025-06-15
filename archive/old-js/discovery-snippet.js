/* Grid4 Discovery Snippet - Environment Capability Probe
 * Implements Gemini AI's brilliant environmental assessment strategy
 * CRITICAL: This MUST be deployed first to determine CSP constraints and guide architecture
 */

(function() {
    'use strict';
    
    console.log('🔍 Grid4 Discovery Snippet: Starting environment capability assessment...');
    
    // Create visual discovery box for immediate feedback
    const discoveryBox = document.createElement('div');
    discoveryBox.id = 'g4-discovery-report';
    discoveryBox.style.cssText = `
        position: fixed !important;
        bottom: 10px !important;
        right: 10px !important;
        padding: 15px !important;
        background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
        color: #e0e0e0 !important;
        border: 2px solid #667eea !important;
        border-radius: 8px !important;
        z-index: 999999 !important;
        font-family: 'Courier New', monospace !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
        max-width: 350px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        backdrop-filter: blur(10px) !important;
    `;
    
    document.body.appendChild(discoveryBox);
    
    const report = (title, status, isSuccess = null) => {
        const color = isSuccess === true ? '#4caf50' : 
                     isSuccess === false ? '#f44336' : 
                     '#ffeb3b';
        
        discoveryBox.innerHTML += `<strong style="color: #667eea">${title}:</strong> <span style="color: ${color}">${status}</span><br>`;
        console.log(`🔍 Discovery: ${title} - ${status.replace(/<[^>]*>/g, '')}`);
    };
    
    // Header with timestamp
    const timestamp = new Date().toLocaleString();
    discoveryBox.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px; color: #667eea; font-weight: bold;">
            🔍 Grid4 Discovery Report<br>
            <span style="font-size: 10px; color: #cbd5e1;">${timestamp}</span>
        </div>
    `;
    
    report('Discovery Snippet', 'LOADED ✓', true);
    report('jQuery Version', window.jQuery ? `${window.jQuery.fn.jquery}` : 'Not Found', !!window.jQuery);
    report('User Agent', navigator.userAgent.split(' ').slice(-2).join(' '));
    
    // Test 1: External Fetch Capability (connect-src CSP directive)
    setTimeout(() => {
        fetch('https://api.github.com/zen', { 
            method: 'GET', 
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            report('External Fetch (connect-src)', 'ALLOWED ✓', true);
            report('  ↳ Status', `${response.status} ${response.type}`, true);
        })
        .catch((err) => {
            report('External Fetch (connect-src)', 'BLOCKED ✗', false);
            report('  ↳ Error', err.message, false);
        });
    }, 100);
    
    // Test 2: Service Worker Registration Capability
    setTimeout(() => {
        if ('serviceWorker' in navigator) {
            // Test with a dummy service worker path
            navigator.serviceWorker.register('data:text/javascript,// Test SW', { 
                scope: '/test-scope/' 
            })
            .then((registration) => {
                report('Service Worker (worker-src)', 'REGISTRATION OK ✓', true);
                report('  ↳ Scope', registration.scope, true);
                // Clean up test registration
                registration.unregister();
            })
            .catch((err) => {
                report('Service Worker (worker-src)', 'BLOCKED ✗', false);
                report('  ↳ Error', err.message.substring(0, 30) + '...', false);
            });
        } else {
            report('Service Worker API', 'NOT AVAILABLE', false);
        }
    }, 200);
    
    // Test 3: Dynamic Import Capability (script-src)
    setTimeout(() => {
        try {
            const testModule = 'export const g4Test = "success";';
            const blob = new Blob([testModule], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            
            import(url)
            .then((module) => {
                report('Dynamic Import (blob:)', 'ALLOWED ✓', true);
                report('  ↳ Module Import', module.g4Test || 'Loaded', true);
                URL.revokeObjectURL(url);
            })
            .catch((err) => {
                report('Dynamic Import (blob:)', 'BLOCKED ✗', false);
                report('  ↳ Error', err.message.substring(0, 30) + '...', false);
                URL.revokeObjectURL(url);
            });
        } catch (e) {
            report('Dynamic Import (blob:)', 'NOT SUPPORTED ✗', false);
            report('  ↳ Error', e.message.substring(0, 30) + '...', false);
        }
    }, 300);
    
    // Test 4: WebSocket Capability
    setTimeout(() => {
        try {
            const testSocket = new WebSocket('wss://echo.websocket.org/');
            
            testSocket.onopen = function() {
                report('WebSocket Connection', 'ALLOWED ✓', true);
                testSocket.close();
            };
            
            testSocket.onerror = function() {
                report('WebSocket Connection', 'BLOCKED ✗', false);
            };
            
            // Timeout if no response in 3 seconds
            setTimeout(() => {
                if (testSocket.readyState === WebSocket.CONNECTING) {
                    report('WebSocket Connection', 'TIMEOUT ⏱', false);
                    testSocket.close();
                }
            }, 3000);
            
        } catch (e) {
            report('WebSocket API', 'NOT SUPPORTED ✗', false);
        }
    }, 400);
    
    // Test 5: Local Storage Capability
    setTimeout(() => {
        try {
            const testKey = 'g4-discovery-test';
            const testValue = 'capability-check';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                report('localStorage', 'AVAILABLE ✓', true);
            } else {
                report('localStorage', 'MALFUNCTION ⚠', false);
            }
        } catch (e) {
            report('localStorage', 'BLOCKED ✗', false);
        }
    }, 500);
    
    // Test 6: CSP Header Detection (if available)
    setTimeout(() => {
        try {
            // Check for CSP violations in console
            const originalError = console.error;
            let cspViolation = false;
            
            console.error = function(...args) {
                if (args.some(arg => String(arg).includes('Content Security Policy'))) {
                    cspViolation = true;
                }
                originalError.apply(console, args);
            };
            
            // Trigger a potential CSP violation
            const testScript = document.createElement('script');
            testScript.innerHTML = 'window.g4CSPTest = true;';
            document.head.appendChild(testScript);
            document.head.removeChild(testScript);
            
            setTimeout(() => {
                console.error = originalError;
                
                if (cspViolation) {
                    report('CSP Detection', 'VIOLATIONS DETECTED ⚠', false);
                } else if (window.g4CSPTest) {
                    report('CSP Detection', 'PERMISSIVE OR NONE', true);
                    delete window.g4CSPTest;
                } else {
                    report('CSP Detection', 'UNKNOWN STATUS ?', null);
                }
            }, 200);
            
        } catch (e) {
            report('CSP Detection', 'ERROR IN TEST', false);
        }
    }, 600);
    
    // Test 7: iframe Capability (for potential bridge pattern)
    setTimeout(() => {
        try {
            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.src = 'data:text/html,<script>parent.postMessage("g4-iframe-test", "*");</script>';
            
            const messageHandler = (event) => {
                if (event.data === 'g4-iframe-test') {
                    report('iframe Bridge Pattern', 'VIABLE ✓', true);
                    window.removeEventListener('message', messageHandler);
                    document.body.removeChild(testFrame);
                }
            };
            
            window.addEventListener('message', messageHandler);
            document.body.appendChild(testFrame);
            
            // Timeout if no response
            setTimeout(() => {
                window.removeEventListener('message', messageHandler);
                if (document.body.contains(testFrame)) {
                    document.body.removeChild(testFrame);
                    report('iframe Bridge Pattern', 'BLOCKED OR TIMEOUT ✗', false);
                }
            }, 2000);
            
        } catch (e) {
            report('iframe Bridge Pattern', 'ERROR ✗', false);
        }
    }, 700);
    
    // Final summary after all tests
    setTimeout(() => {
        discoveryBox.innerHTML += `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #667eea; font-size: 10px; color: #cbd5e1;">
                <strong>Next Steps:</strong><br>
                📸 Screenshot this report<br>
                🔄 Refresh to re-test<br>
                🚀 Deploy Application Shell based on results
            </div>
        `;
        
        console.log('🔍 Discovery Complete! Check visual report in bottom-right corner.');
        console.log('📋 Results will guide Grid4 architecture decisions.');
        
        // Store results in sessionStorage for programmatic access
        try {
            const results = {
                timestamp: timestamp,
                userAgent: navigator.userAgent,
                jquery: window.jQuery ? window.jQuery.fn.jquery : null,
                capabilities: {
                    externalFetch: 'Testing...',
                    serviceWorker: 'Testing...',
                    dynamicImport: 'Testing...',
                    webSocket: 'Testing...',
                    localStorage: 'Testing...',
                    iframe: 'Testing...'
                }
            };
            
            sessionStorage.setItem('g4-discovery-results', JSON.stringify(results));
            console.log('💾 Results stored in sessionStorage["g4-discovery-results"]');
        } catch (e) {
            console.warn('⚠️ Could not store results in sessionStorage');
        }
        
    }, 8000);
    
    // Add close button for the report
    setTimeout(() => {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute !important;
            top: 5px !important;
            right: 8px !important;
            background: none !important;
            border: none !important;
            color: #f44336 !important;
            font-size: 16px !important;
            cursor: pointer !important;
            font-weight: bold !important;
        `;
        closeBtn.onclick = () => discoveryBox.remove();
        discoveryBox.appendChild(closeBtn);
    }, 1000);
    
})();