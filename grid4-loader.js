/* Grid4 Communications - Dynamic JavaScript Loader */
/* Loads both basicJS libraries and Grid4 customizations */
/* Use this as the PORTAL_EXTRA_JS URL if you prefer separate files */

(function() {
    'use strict';
    
    console.log('Grid4 Loader: Starting dynamic script loading...');
    
    // Configuration
    var config = {
        baseUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/',
        scripts: [
            {
                name: 'basicJS Libraries',
                url: 'reference/js/basicJS.js',
                required: true
            },
            {
                name: 'Grid4 Custom Portal',
                url: 'grid4-custom-v3.js',
                required: true,
                dependsOn: ['basicJS Libraries'] // Wait for basicJS to load first
            }
        ],
        timeout: 30000 // 30 second timeout per script
    };
    
    var loadedScripts = {};
    var loadingQueue = [];
    
    // Script loading function
    function loadScript(scriptConfig, callback) {
        var script = document.createElement('script');
        var timeoutId;
        var completed = false;
        
        function complete(success, error) {
            if (completed) return;
            completed = true;
            
            clearTimeout(timeoutId);
            
            if (success) {
                loadedScripts[scriptConfig.name] = true;
                console.log('Grid4 Loader: Successfully loaded ' + scriptConfig.name);
                callback(null);
            } else {
                console.error('Grid4 Loader: Failed to load ' + scriptConfig.name, error);
                callback(error || new Error('Script load failed'));
            }
        }
        
        // Set up timeout
        timeoutId = setTimeout(function() {
            complete(false, new Error('Script load timeout'));
        }, config.timeout);
        
        // Set up event handlers
        script.onload = function() {
            complete(true);
        };
        
        script.onerror = function() {
            complete(false, new Error('Script load error'));
        };
        
        // Start loading
        script.src = config.baseUrl + scriptConfig.url;
        script.async = true;
        document.head.appendChild(script);
        
        console.log('Grid4 Loader: Loading ' + scriptConfig.name + ' from ' + script.src);
    }
    
    // Check if dependencies are loaded
    function dependenciesLoaded(scriptConfig) {
        if (!scriptConfig.dependsOn || scriptConfig.dependsOn.length === 0) {
            return true;
        }
        
        return scriptConfig.dependsOn.every(function(dep) {
            return loadedScripts[dep];
        });
    }
    
    // Process loading queue
    function processQueue() {
        var readyToLoad = [];
        var stillWaiting = [];
        
        loadingQueue.forEach(function(item) {
            if (dependenciesLoaded(item.script)) {
                readyToLoad.push(item);
            } else {
                stillWaiting.push(item);
            }
        });
        
        loadingQueue = stillWaiting;
        
        readyToLoad.forEach(function(item) {
            loadScript(item.script, item.callback);
        });
    }
    
    // Queue script for loading
    function queueScript(scriptConfig, callback) {
        loadingQueue.push({
            script: scriptConfig,
            callback: callback
        });
        
        // Process queue after a short delay to allow batching
        setTimeout(processQueue, 10);
    }
    
    // Load all scripts
    function loadAllScripts() {
        var totalScripts = config.scripts.length;
        var completedScripts = 0;
        var hasErrors = false;
        
        function onScriptComplete(error) {
            completedScripts++;
            
            if (error) {
                hasErrors = true;
            }
            
            if (completedScripts === totalScripts) {
                if (hasErrors) {
                    console.error('Grid4 Loader: Some scripts failed to load');
                } else {
                    console.log('Grid4 Loader: All scripts loaded successfully!');
                }
            }
            
            // Continue processing queue for dependent scripts
            processQueue();
        }
        
        // Queue all scripts
        config.scripts.forEach(function(scriptConfig) {
            queueScript(scriptConfig, onScriptComplete);
        });
    }
    
    // Start loading process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllScripts);
    } else {
        loadAllScripts();
    }
    
})();

/*
 * USAGE INSTRUCTIONS:
 * 
 * Option 1 - Use this loader (separate files):
 * Set PORTAL_EXTRA_JS to: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-loader.js
 * 
 * Option 2 - Use combined file (recommended):
 * Set PORTAL_EXTRA_JS to: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-enhanced-basicjs.js
 * 
 * The combined file (Option 2) is recommended because:
 * - Single HTTP request (faster loading)
 * - No dependency management needed
 * - Simpler deployment
 * - More reliable
 */
