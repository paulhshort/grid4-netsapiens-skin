// Enhanced Reconnaissance Script for NetSapiens Portal
// Focus on architectural intelligence for accurate roadmap generation

const config = require('./config');

class PortalReconnaissance {
  constructor(page) {
    this.page = page;
    this.networkRequests = [];
    this.ajaxPatterns = [];
  }

  async setupNetworkMonitoring() {
    console.log('🌐 Setting up network monitoring...');
    
    // Capture all network requests
    this.page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      const resourceType = request.resourceType();
      
      // Focus on AJAX/XHR requests
      if (resourceType === 'xhr' || resourceType === 'fetch') {
        this.networkRequests.push({
          url: url,
          method: method,
          resourceType: resourceType,
          timestamp: new Date(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });

    // Capture responses for analysis
    this.page.on('response', (response) => {
      const request = response.request();
      const resourceType = request.resourceType();
      
      if (resourceType === 'xhr' || resourceType === 'fetch') {
        // Store response data for pattern analysis
        response.text().then(body => {
          const requestData = this.networkRequests.find(req => 
            req.url === request.url() && req.timestamp
          );
          if (requestData) {
            requestData.responseStatus = response.status();
            requestData.responseHeaders = response.headers();
            requestData.responseBody = body.substring(0, 1000); // First 1KB
          }
        }).catch(() => {
          // Ignore errors for binary responses
        });
      }
    });
  }

  async analyzeLayoutStructure() {
    console.log('🏗️ Analyzing main layout structure...');
    
    const layoutAnalysis = await this.page.evaluate(() => {
      const analysis = {
        layoutType: 'unknown',
        mainStructure: {},
        iframes: [],
        contentAreas: [],
        panelStructure: 'unknown'
      };
      
      // Check for iframe-based architecture
      const iframes = document.querySelectorAll('iframe');
      analysis.iframes = Array.from(iframes).map(iframe => ({
        src: iframe.src,
        id: iframe.id,
        className: iframe.className,
        width: iframe.width,
        height: iframe.height,
        parent: iframe.parentElement.tagName
      }));
      
      // Analyze main content structure
      const possibleContainers = [
        '#content', '.content', '.main-content',
        '#wrapper', '.wrapper', '.container',
        'main', '.main', '#main'
      ];
      
      for (const selector of possibleContainers) {
        const element = document.querySelector(selector);
        if (element) {
          analysis.mainStructure[selector] = {
            tagName: element.tagName,
            children: element.children.length,
            hasTable: !!element.querySelector('table'),
            hasNestedDivs: element.querySelectorAll('div').length,
            hasNestedTables: element.querySelectorAll('table').length,
            depth: this.getElementDepth(element)
          };
        }
      }
      
      // Check for table-based layout
      const tables = document.querySelectorAll('table');
      const layoutTables = Array.from(tables).filter(table => {
        // Heuristic: layout tables are usually large and nested
        return table.rows.length > 3 && 
               table.querySelector('td') &&
               !table.className.includes('data') &&
               !table.id.includes('data');
      });
      
      if (layoutTables.length > 0) {
        analysis.layoutType = 'table-based';
        analysis.panelStructure = 'table-cells';
      } else if (analysis.iframes.length > 0) {
        analysis.layoutType = 'iframe-based';
        analysis.panelStructure = 'iframe-content';
      } else {
        analysis.layoutType = 'div-based';
        analysis.panelStructure = 'css-flexbox-or-float';
      }
      
      // Helper function for element depth
      function getElementDepth(element) {
        let depth = 0;
        let current = element;
        while (current.parentElement) {
          depth++;
          current = current.parentElement;
        }
        return depth;
      }
      
      return analysis;
    });
    
    console.log('📊 Layout Analysis Results:');
    console.log(`  Layout Type: ${layoutAnalysis.layoutType}`);
    console.log(`  Panel Structure: ${layoutAnalysis.panelStructure}`);
    console.log(`  IFrames Found: ${layoutAnalysis.iframes.length}`);
    console.log(`  Main Containers: ${Object.keys(layoutAnalysis.mainStructure).length}`);
    
    return layoutAnalysis;
  }

  async analyzeGlobalJavaScript() {
    console.log('🔍 Analyzing global JavaScript footprint...');
    
    const jsAnalysis = await this.page.evaluate(() => {
      const analysis = {
        globalVariables: {},
        jqueryPlugins: [],
        frameworkDetection: {},
        customFunctions: [],
        conflicts: []
      };
      
      // Capture global namespace pollution
      const standardGlobals = [
        'window', 'document', 'navigator', 'location', 'history',
        'console', 'setTimeout', 'setInterval', 'JSON', 'Array',
        'Object', 'String', 'Number', 'Boolean', 'undefined',
        'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURI',
        'decodeURI', 'encodeURIComponent', 'decodeURIComponent'
      ];
      
      const globalKeys = Object.keys(window);
      const customGlobals = globalKeys.filter(key => 
        !standardGlobals.includes(key) && 
        typeof window[key] !== 'undefined'
      );
      
      // Categorize global variables
      customGlobals.forEach(key => {
        const value = window[key];
        const type = typeof value;
        
        analysis.globalVariables[key] = {
          type: type,
          isFunction: type === 'function',
          isObject: type === 'object' && value !== null,
          size: type === 'string' ? value.length : 
                type === 'object' ? Object.keys(value || {}).length : 1
        };
        
        // Check for potential conflicts with our naming
        if (key.toLowerCase().includes('grid') || 
            key.toLowerCase().includes('g4') ||
            key.toLowerCase().includes('command')) {
          analysis.conflicts.push(key);
        }
        
        // Detect framework globals
        if (key === 'jQuery' || key === '$') {
          analysis.frameworkDetection.jquery = {
            version: window.jQuery ? window.jQuery.fn.jquery : 'unknown',
            plugins: Object.keys(window.jQuery ? window.jQuery.fn : {})
          };
          analysis.jqueryPlugins = Object.keys(window.jQuery ? window.jQuery.fn : {});
        }
      });
      
      // Check for CakePHP indicators
      if (globalKeys.some(key => key.toLowerCase().includes('cake'))) {
        analysis.frameworkDetection.cakephp = true;
      }
      
      // Look for custom functions that might be useful
      customGlobals.forEach(key => {
        if (typeof window[key] === 'function') {
          const funcStr = window[key].toString();
          if (funcStr.includes('ajax') || 
              funcStr.includes('post') || 
              funcStr.includes('get') ||
              funcStr.includes('form')) {
            analysis.customFunctions.push({
              name: key,
              purpose: 'ajax-related',
              signature: funcStr.substring(0, 100) + '...'
            });
          }
        }
      });
      
      return analysis;
    });
    
    console.log('🔧 JavaScript Analysis Results:');
    console.log(`  Custom Globals: ${Object.keys(jsAnalysis.globalVariables).length}`);
    console.log(`  jQuery Version: ${jsAnalysis.frameworkDetection.jquery?.version || 'Not found'}`);
    console.log(`  jQuery Plugins: ${jsAnalysis.jqueryPlugins.length}`);
    console.log(`  Potential Conflicts: ${jsAnalysis.conflicts.length}`);
    console.log(`  Custom Functions: ${jsAnalysis.customFunctions.length}`);
    
    if (jsAnalysis.conflicts.length > 0) {
      console.log(`  ⚠️ Naming Conflicts: ${jsAnalysis.conflicts.join(', ')}`);
    }
    
    return jsAnalysis;
  }

  async analyzeCSSArchitecture() {
    console.log('🎨 Analyzing CSS architecture and specificity...');
    
    const cssAnalysis = await this.page.evaluate(() => {
      const analysis = {
        stylesheets: [],
        importantCount: 0,
        totalRules: 0,
        averageSpecificity: 0,
        overrideComplexity: 'unknown'
      };
      
      // Analyze loaded stylesheets
      const stylesheets = Array.from(document.styleSheets);
      
      stylesheets.forEach((sheet, index) => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          const sheetAnalysis = {
            href: sheet.href,
            index: index,
            ruleCount: rules.length,
            importantRules: 0,
            specificitySum: 0
          };
          
          rules.forEach(rule => {
            if (rule.style) {
              const styleText = rule.style.cssText;
              
              // Count !important declarations
              const importantMatches = styleText.match(/!important/g);
              if (importantMatches) {
                sheetAnalysis.importantRules += importantMatches.length;
                analysis.importantCount += importantMatches.length;
              }
              
              // Rough specificity calculation
              if (rule.selectorText) {
                const specificity = this.calculateSpecificity(rule.selectorText);
                sheetAnalysis.specificitySum += specificity;
              }
            }
          });
          
          analysis.stylesheets.push(sheetAnalysis);
          analysis.totalRules += sheetAnalysis.ruleCount;
          
        } catch (e) {
          // CORS or other errors accessing stylesheet
          analysis.stylesheets.push({
            href: sheet.href,
            index: index,
            error: 'Access denied (likely CORS)',
            ruleCount: 0,
            importantRules: 0
          });
        }
      });
      
      // Calculate averages and complexity
      if (analysis.totalRules > 0) {
        const totalSpecificity = analysis.stylesheets.reduce(
          (sum, sheet) => sum + (sheet.specificitySum || 0), 0
        );
        analysis.averageSpecificity = Math.round(totalSpecificity / analysis.totalRules);
        
        const importantRatio = analysis.importantCount / analysis.totalRules;
        if (importantRatio > 0.1) {
          analysis.overrideComplexity = 'high';
        } else if (importantRatio > 0.05) {
          analysis.overrideComplexity = 'medium';
        } else {
          analysis.overrideComplexity = 'low';
        }
      }
      
      // Helper function for specificity calculation
      function calculateSpecificity(selector) {
        const ids = (selector.match(/#/g) || []).length * 100;
        const classes = (selector.match(/\./g) || []).length * 10;
        const elements = selector.split(/[\s>+~]/).length;
        return ids + classes + elements;
      }
      
      return analysis;
    });
    
    console.log('🎨 CSS Analysis Results:');
    console.log(`  Stylesheets: ${cssAnalysis.stylesheets.length}`);
    console.log(`  Total Rules: ${cssAnalysis.totalRules}`);
    console.log(`  !Important Count: ${cssAnalysis.importantCount}`);
    console.log(`  Override Complexity: ${cssAnalysis.overrideComplexity}`);
    console.log(`  Average Specificity: ${cssAnalysis.averageSpecificity}`);
    
    return cssAnalysis;
  }

  async analyzeAJAXPatterns() {
    console.log('🔄 Analyzing AJAX patterns...');
    
    // Wait a bit to collect network activity
    await this.page.waitForTimeout(5000);
    
    const patterns = this.analyzeNetworkPatterns();
    
    console.log('🔄 AJAX Pattern Analysis:');
    console.log(`  Total AJAX Requests: ${this.networkRequests.length}`);
    console.log(`  Unique Endpoints: ${patterns.uniqueEndpoints.length}`);
    console.log(`  Common Methods: ${patterns.commonMethods.join(', ')}`);
    console.log(`  API Pattern: ${patterns.apiPattern}`);
    
    return patterns;
  }

  analyzeNetworkPatterns() {
    const patterns = {
      uniqueEndpoints: [],
      commonMethods: [],
      apiPattern: 'unknown',
      requestFrequency: 0,
      responseTypes: []
    };
    
    if (this.networkRequests.length === 0) {
      return patterns;
    }
    
    // Extract unique endpoints
    const endpoints = this.networkRequests.map(req => {
      const url = new URL(req.url);
      return url.pathname;
    });
    patterns.uniqueEndpoints = [...new Set(endpoints)];
    
    // Analyze methods
    const methods = this.networkRequests.map(req => req.method);
    patterns.commonMethods = [...new Set(methods)];
    
    // Detect API patterns
    if (patterns.uniqueEndpoints.some(ep => ep.includes('/api/'))) {
      patterns.apiPattern = 'rest-api';
    } else if (patterns.uniqueEndpoints.some(ep => ep.includes('/ajax/'))) {
      patterns.apiPattern = 'ajax-endpoints';
    } else if (patterns.uniqueEndpoints.some(ep => ep.includes('.php'))) {
      patterns.apiPattern = 'php-scripts';
    }
    
    patterns.requestFrequency = this.networkRequests.length / 5; // per 5 seconds
    
    return patterns;
  }

  async generateReconnaissanceReport() {
    console.log('\n📋 GENERATING COMPREHENSIVE RECONNAISSANCE REPORT');
    console.log('=' * 60);
    
    const report = {
      timestamp: new Date().toISOString(),
      layout: await this.analyzeLayoutStructure(),
      javascript: await this.analyzeGlobalJavaScript(),
      css: await this.analyzeCSSArchitecture(),
      ajax: await this.analyzeAJAXPatterns(),
      networkRequests: this.networkRequests
    };
    
    // Save detailed report
    const fs = require('fs');
    const reportPath = `${config.screenshots.outputDir}/reconnaissance-report.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`💾 Detailed reconnaissance saved: ${reportPath}`);
    
    return report;
  }
}

module.exports = PortalReconnaissance;