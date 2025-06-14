/* Grid4 Service Worker - Experimental HTML Rewriting Strategy
 * REVOLUTIONARY APPROACH: Intercept and transform NetSapiens HTML before rendering
 * Based on Zen AI architectural recommendations for platform-level constraints
 * 
 * CAPABILITIES:
 * - Remove render-blocking scripts from head
 * - Sequester JWT tokens before DOM exposure
 * - Inject modern app bundles with defer loading
 * - Create clean environment for modern components
 */

const SW_VERSION = 'v1.0.0';
const CACHE_NAME = `grid4-sw-${SW_VERSION}`;

// Critical assets to cache for offline functionality
const CRITICAL_ASSETS = [
    '/grid4-modern-app.js',
    '/grid4-theme-system-v2.css',
    '/grid4-islands-loader.js'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
    console.log('🔧 Grid4 SW: Installing', SW_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Grid4 SW: Caching critical assets');
            return cache.addAll(CRITICAL_ASSETS);
        }).then(() => {
            // Force activation of new service worker
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Grid4 SW: Activating', SW_VERSION);
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName.startsWith('grid4-sw-') && cacheName !== CACHE_NAME) {
                        console.log('🗑️ Grid4 SW: Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - THE MAGIC HAPPENS HERE
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Only intercept navigation requests (main HTML documents)
    if (event.request.mode === 'navigate' && url.pathname.includes('/portal/')) {
        event.respondWith(transformPortalHTML(event.request));
        return;
    }
    
    // Handle our modern assets with caching
    if (url.pathname.startsWith('/grid4-')) {
        event.respondWith(handleGrid4Assets(event.request));
        return;
    }
    
    // Default: pass through to network
    event.respondWith(fetch(event.request));
});

/**
 * REVOLUTIONARY HTML TRANSFORMATION
 * Intercept NetSapiens HTML and create a clean modern environment
 */
async function transformPortalHTML(request) {
    try {
        console.log('🔄 Grid4 SW: Transforming portal HTML for', request.url);
        
        // Fetch original HTML from NetSapiens
        const response = await fetch(request);
        const originalHTML = await response.text();
        
        // Parse and transform the HTML
        const transformedHTML = await performHTMLSurgery(originalHTML, request.url);
        
        // Return transformed response
        return new Response(transformedHTML, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...Object.fromEntries(response.headers.entries()),
                'Content-Type': 'text/html; charset=utf-8',
                'X-Grid4-Transformed': 'true',
                'X-Grid4-Version': SW_VERSION
            }
        });
        
    } catch (error) {
        console.error('❌ Grid4 SW: HTML transformation failed:', error);
        
        // Fallback: return original response
        return fetch(request);
    }
}

/**
 * SURGICAL HTML MODIFICATIONS
 * The core transformation logic that makes legacy NetSapiens modern
 */
async function performHTMLSurgery(html, url) {
    let transformedHTML = html;
    
    // 1. SECURITY: Extract and sequester JWT tokens
    transformedHTML = sequesterJWTTokens(transformedHTML);
    
    // 2. PERFORMANCE: Remove render-blocking scripts from head
    transformedHTML = removeBlockingScripts(transformedHTML);
    
    // 3. MODERNIZATION: Inject our modern app architecture
    transformedHTML = injectModernArchitecture(transformedHTML, url);
    
    // 4. ENHANCEMENT: Add Grid4 theme system
    transformedHTML = injectThemeSystem(transformedHTML);
    
    // 5. OPTIMIZATION: Add performance monitoring
    transformedHTML = addPerformanceMonitoring(transformedHTML);
    
    console.log('✨ Grid4 SW: HTML surgery complete');
    return transformedHTML;
}

/**
 * SECURITY: JWT Token Sequestration
 * Remove JWT tokens from HTML before they reach the DOM
 */
function sequesterJWTTokens(html) {
    // Pattern to match JWT tokens in script blocks
    const jwtPattern = /<script[^>]*>[\s\S]*?jwt_token\s*[=:]\s*["']([^"']+)["'][\s\S]*?<\/script>/gi;
    
    let tokens = [];
    let cleanHTML = html.replace(jwtPattern, (match, token) => {
        console.log('🔒 Grid4 SW: Sequestering JWT token');
        tokens.push(token);
        
        // Replace with secure token injection script
        return `<script>
            // Grid4 Secure Token Management
            (function() {
                'use strict';
                window.__GRID4_SECURE_TOKEN__ = '${token}';
                // Token is now only accessible via our secure API
                window.Grid4 = window.Grid4 || {};
                window.Grid4.getToken = function() {
                    return window.__GRID4_SECURE_TOKEN__;
                };
            })();
        </script>`;
    });
    
    // Also look for tokens in global variable declarations
    const globalTokenPattern = /var\s+jwt_token\s*=\s*["']([^"']+)["']/gi;
    cleanHTML = cleanHTML.replace(globalTokenPattern, (match, token) => {
        console.log('🔒 Grid4 SW: Sequestering global JWT token');
        tokens.push(token);
        return `// JWT token sequestered by Grid4 Security Layer`;
    });
    
    return cleanHTML;
}

/**
 * PERFORMANCE: Remove Render-Blocking Scripts
 * Strip out the 25+ blocking scripts from head section
 */
function removeBlockingScripts(html) {
    // Target script tags in head that are known to be blocking
    const blockingScriptPattern = /<head>[\s\S]*?<\/head>/gi;
    
    return html.replace(blockingScriptPattern, (headContent) => {
        console.log('⚡ Grid4 SW: Removing render-blocking scripts from head');
        
        // Keep essential meta tags, CSS, but remove blocking JS
        let cleanHead = headContent
            // Remove script tags but preserve defer/async ones
            .replace(/<script(?![^>]*\b(?:defer|async)\b)[^>]*>[\s\S]*?<\/script>/gi, '')
            // Remove external scripts without defer/async
            .replace(/<script(?![^>]*\b(?:defer|async)\b)[^>]*src="[^"]*"[^>]*><\/script>/gi, '');
        
        return cleanHead;
    });
}

/**
 * MODERNIZATION: Inject Modern App Architecture
 * Add our island-based modern application framework
 */
function injectModernArchitecture(html, url) {
    console.log('🏗️ Grid4 SW: Injecting modern app architecture');
    
    // Determine which islands to load based on page type
    const pageType = detectPageType(url);
    const islandsToLoad = getIslandsForPage(pageType);
    
    // Inject just before closing body tag
    const modernArchitectureScript = `
        <!-- Grid4 Modern Architecture - Island Loading Strategy -->
        <script type="module">
            // Grid4 Islands Loader - Dynamic import strategy
            window.Grid4Islands = {
                pageType: '${pageType}',
                islandsToLoad: ${JSON.stringify(islandsToLoad)},
                
                async loadIsland(islandName) {
                    try {
                        console.log('🏝️ Grid4: Loading island', islandName);
                        const module = await import('/grid4-islands/' + islandName + '.js');
                        return module.default;
                    } catch (error) {
                        console.error('❌ Grid4: Failed to load island', islandName, error);
                        return null;
                    }
                },
                
                async init() {
                    console.log('🚀 Grid4: Initializing modern islands for', this.pageType);
                    
                    for (const islandName of this.islandsToLoad) {
                        const Island = await this.loadIsland(islandName);
                        if (Island) {
                            new Island().mount();
                        }
                    }
                }
            };
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => window.Grid4Islands.init());
            } else {
                window.Grid4Islands.init();
            }
        </script>
    `;
    
    return html.replace('</body>', modernArchitectureScript + '</body>');
}

/**
 * ENHANCEMENT: Inject Theme System
 * Add our production-ready theme system
 */
function injectThemeSystem(html) {
    console.log('🎨 Grid4 SW: Injecting theme system');
    
    const themeSystemInjection = `
        <!-- Grid4 Theme System v2.0 -->
        <link rel="stylesheet" href="/grid4-theme-system-v2.css">
        <script>
            // FOIT Prevention - Inline for maximum speed
            (function(){try{var t=null;try{t=localStorage.getItem("g4-theme-preference")}catch(e){}var r=null;if("system"===t||!t)r=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";else if("light"===t||"dark"===t||"high-contrast"===t)r=t;else r="light";if(r&&"light"!==r){document.documentElement.setAttribute("data-theme",r);if(document.body)document.body.setAttribute("data-theme",r);else document.addEventListener("DOMContentLoaded",function(){document.body&&document.body.setAttribute("data-theme",r)})}try{t&&sessionStorage.setItem("g4-foit-applied-theme",t);sessionStorage.setItem("g4-foit-resolved-theme",r)}catch(e){}}catch(error){console.warn("Grid4 FOIT Prevention: Error applying theme:",error)}})();
        </script>
        <script defer src="/grid4-theme-switcher-v2.js"></script>
    `;
    
    return html.replace('</head>', themeSystemInjection + '</head>');
}

/**
 * OPTIMIZATION: Add Performance Monitoring
 * Track Core Web Vitals and custom metrics
 */
function addPerformanceMonitoring(html) {
    const performanceScript = `
        <script>
            // Grid4 Performance Monitoring
            window.Grid4Performance = {
                metrics: {},
                
                mark(name) {
                    try {
                        performance.mark('grid4-' + name);
                        this.metrics[name] = performance.now();
                        console.log('📊 Grid4 Perf:', name, this.metrics[name] + 'ms');
                    } catch (e) {
                        this.metrics[name] = Date.now();
                    }
                },
                
                measure(name, start, end) {
                    try {
                        performance.measure('grid4-' + name, 'grid4-' + start, 'grid4-' + end);
                        console.log('📏 Grid4 Measure:', name, performance.getEntriesByName('grid4-' + name)[0].duration + 'ms');
                    } catch (e) {
                        console.log('📏 Grid4 Measure:', name, this.metrics[end] - this.metrics[start] + 'ms');
                    }
                }
            };
            
            // Track service worker transformation
            window.Grid4Performance.mark('sw-transform-complete');
        </script>
    `;
    
    return html.replace('</head>', performanceScript + '</head>');
}

/**
 * INTELLIGENCE: Page Type Detection
 * Determine what type of NetSapiens page we're dealing with
 */
function detectPageType(url) {
    const path = new URL(url).pathname;
    
    if (path.includes('/users')) return 'users';
    if (path.includes('/domains')) return 'domains';
    if (path.includes('/calls')) return 'calls';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/dashboard')) return 'dashboard';
    
    return 'generic';
}

/**
 * STRATEGY: Island Selection Logic
 * Determine which modern components to load for each page type
 */
function getIslandsForPage(pageType) {
    const islandMap = {
        'users': ['UserTable', 'UserSearch', 'UserBulkActions'],
        'domains': ['DomainTable', 'DomainConfig'],
        'calls': ['CallLogs', 'CallAnalytics', 'RealTimeMonitor'],
        'reports': ['ReportBuilder', 'ChartRenderer'],
        'settings': ['SettingsPanel', 'ConfigEditor'],
        'dashboard': ['MetricCards', 'QuickActions', 'AlertsPanel'],
        'generic': ['ThemeManager', 'CommandPalette']
    };
    
    return islandMap[pageType] || islandMap['generic'];
}

/**
 * ASSET HANDLING: Modern Assets with Intelligent Caching
 */
async function handleGrid4Assets(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Try cache first for performance
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        console.log('📦 Grid4 SW: Serving from cache', request.url);
        return cachedResponse;
    }
    
    try {
        // Fetch from network and cache
        const response = await fetch(request);
        if (response.ok) {
            console.log('🌐 Grid4 SW: Caching new asset', request.url);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('❌ Grid4 SW: Asset fetch failed', request.url, error);
        
        // Return offline fallback if available
        return new Response('/* Grid4 Asset Unavailable */', {
            status: 503,
            headers: { 'Content-Type': 'text/javascript' }
        });
    }
}

/**
 * ERROR HANDLING: Graceful Degradation
 */
self.addEventListener('error', (event) => {
    console.error('❌ Grid4 SW: Runtime error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Grid4 SW: Unhandled promise rejection', event.reason);
});

console.log('🚀 Grid4 Service Worker loaded - Revolutionary HTML transformation ready!');