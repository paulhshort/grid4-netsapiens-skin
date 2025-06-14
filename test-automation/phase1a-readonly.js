// Phase 1a: Read-Only Reconnaissance
// Safe exploration of NetSapiens portal structure
// Zero-risk baseline mapping of all GET endpoints

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const config = {
  portal: {
    url: 'https://portal.grid4voice.ucaas.tech/portal/home',
    username: '1002@grid4voice',
    password: 'hQAFMdWXKNj4wAg'
  },
  output: {
    dir: './reconnaissance-output',
    screenshots: './reconnaissance-output/screenshots',
    data: './reconnaissance-output/data'
  },
  browser: {
    headless: false, // Visual debugging for initial runs
    timeout: 30000
  }
};

class Phase1aReconnaissance {
  constructor() {
    this.visitedUrls = new Set();
    this.discoveredPages = [];
    this.navigationStructure = {};
    this.screenshots = [];
    this.errors = [];
    
    // Ensure output directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [config.output.dir, config.output.screenshots, config.output.data].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async run() {
    console.log('🚀 Starting Phase 1a: Read-Only Reconnaissance');
    console.log('⚡ Target:', config.portal.url);
    console.log('📂 Output:', config.output.dir);
    
    const browser = await chromium.launch({ 
      headless: config.browser.headless,
      args: ['--no-sandbox', '--disable-web-security'] // Sandbox environment only
    });
    
    try {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      
      const page = await context.newPage();
      
      // Set up request/response monitoring
      await this.setupNetworkMonitoring(page);
      
      // Phase 1: Login (required for reconnaissance)
      console.log('🔐 Phase 1: Authenticating...');
      await this.authenticateUser(page);
      
      // Phase 2: Discover main navigation structure
      console.log('🗺️ Phase 2: Mapping main navigation...');
      await this.discoverMainNavigation(page);
      
      // Phase 3: Systematic page traversal
      console.log('🔍 Phase 3: Systematic page discovery...');
      await this.traverseAllPages(page);
      
      // Phase 4: Generate reconnaissance report
      console.log('📋 Phase 4: Generating report...');
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Fatal error during reconnaissance:', error);
      this.errors.push({
        type: 'fatal',
        message: error.message,
        stack: error.stack,
        timestamp: new Date()
      });
    } finally {
      await browser.close();
    }
  }

  async setupNetworkMonitoring(page) {
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/portal/')) {
        console.log('→', request.method(), url);
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        this.errors.push({
          type: 'http_error',
          status: response.status(),
          url: response.url(),
          timestamp: new Date()
        });
      }
    });
  }

  async authenticateUser(page) {
    await page.goto(config.portal.url);
    await page.waitForLoadState('networkidle');
    
    // Take login page screenshot
    await this.takeScreenshot(page, 'login-page');
    
    // Check if already logged in
    const currentUrl = page.url();
    if (currentUrl.includes('/home') && !currentUrl.includes('/login')) {
      console.log('✅ Already authenticated');
      return;
    }
    
    // Find and fill login form
    try {
      await page.fill('input[name="data[User][user]"], input[type="text"]:first-child', config.portal.username);
      await page.fill('input[name="data[User][password]"], input[type="password"]', config.portal.password);
      
      // Submit form
      await page.click('input[type="submit"], button[type="submit"], .btn-login');
      await page.waitForLoadState('networkidle');
      
      // Verify successful login
      const postLoginUrl = page.url();
      if (postLoginUrl.includes('/home') || postLoginUrl.includes('/dashboard')) {
        console.log('✅ Authentication successful');
        await this.takeScreenshot(page, 'post-login-dashboard');
      } else {
        throw new Error('Login verification failed: ' + postLoginUrl);
      }
      
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  async discoverMainNavigation(page) {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Extract main navigation structure
    const navStructure = await page.evaluate(() => {
      const navigation = {
        primary: [],
        secondary: [],
        sidebar: [],
        breadcrumbs: []
      };
      
      // Primary navigation (horizontal menu)
      const primaryNav = document.querySelectorAll('.nav, .navbar, .menu, .navigation, #nav, #menu');
      primaryNav.forEach(nav => {
        const links = nav.querySelectorAll('a[href]');
        links.forEach(link => {
          if (link.href && link.href.includes('/portal/')) {
            navigation.primary.push({
              text: link.textContent.trim(),
              href: link.href,
              parent: nav.className || nav.id
            });
          }
        });
      });
      
      // Sidebar navigation (vertical menu)
      const sidebarSelectors = ['.sidebar', '.side-nav', '.left-nav', '#sidebar', '.navigation-vertical'];
      sidebarSelectors.forEach(selector => {
        const sidebar = document.querySelector(selector);
        if (sidebar) {
          const links = sidebar.querySelectorAll('a[href]');
          links.forEach(link => {
            if (link.href && link.href.includes('/portal/')) {
              navigation.sidebar.push({
                text: link.textContent.trim(),
                href: link.href,
                selector: selector
              });
            }
          });
        }
      });
      
      // Any other links that look like navigation
      const allLinks = document.querySelectorAll('a[href*="/portal/"]');
      allLinks.forEach(link => {
        if (link.href && !navigation.primary.some(nav => nav.href === link.href) && 
            !navigation.sidebar.some(nav => nav.href === link.href)) {
          navigation.secondary.push({
            text: link.textContent.trim(),
            href: link.href,
            context: link.closest('[class]')?.className || 'unknown'
          });
        }
      });
      
      return navigation;
    });
    
    this.navigationStructure = navStructure;
    console.log(`📊 Discovered ${navStructure.primary.length} primary nav items`);
    console.log(`📊 Discovered ${navStructure.sidebar.length} sidebar nav items`);
    console.log(`📊 Discovered ${navStructure.secondary.length} secondary nav items`);
    
    // Save navigation structure
    fs.writeFileSync(
      path.join(config.output.data, 'navigation-structure.json'), 
      JSON.stringify(navStructure, null, 2)
    );
  }

  async traverseAllPages(page) {
    const allLinks = [
      ...this.navigationStructure.primary,
      ...this.navigationStructure.sidebar,
      ...this.navigationStructure.secondary
    ];
    
    console.log(`🔍 Beginning traversal of ${allLinks.length} discovered links`);
    
    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      
      if (this.visitedUrls.has(link.href)) {
        console.log(`⏭️ [${i+1}/${allLinks.length}] Skipping already visited: ${link.text}`);
        continue;
      }
      
      try {
        console.log(`🔍 [${i+1}/${allLinks.length}] Visiting: ${link.text} → ${link.href}`);
        
        await page.goto(link.href, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Allow any dynamic content to load
        
        const pageInfo = await this.analyzePage(page, link);
        this.discoveredPages.push(pageInfo);
        this.visitedUrls.add(link.href);
        
        // Take screenshot
        const screenshotName = this.sanitizeFilename(link.text || `page-${i+1}`);
        await this.takeScreenshot(page, screenshotName);
        
        // Look for additional links on this page
        const additionalLinks = await this.discoverPageLinks(page);
        
        // Add new links to our traversal list (avoiding duplicates)
        additionalLinks.forEach(newLink => {
          if (!allLinks.some(existing => existing.href === newLink.href) && 
              !this.visitedUrls.has(newLink.href)) {
            allLinks.push(newLink);
          }
        });
        
      } catch (error) {
        console.error(`❌ Error visiting ${link.href}:`, error.message);
        this.errors.push({
          type: 'page_error',
          url: link.href,
          text: link.text,
          error: error.message,
          timestamp: new Date()
        });
      }
      
      // Rate limiting to be respectful
      await page.waitForTimeout(1000);
    }
    
    console.log(`✅ Traversal complete. Visited ${this.visitedUrls.size} unique pages`);
  }

  async analyzePage(page, linkContext) {
    const analysis = await page.evaluate((context) => {
      return {
        url: window.location.href,
        title: document.title,
        linkContext: context,
        forms: Array.from(document.forms).map(form => ({
          action: form.action,
          method: form.method,
          inputs: Array.from(form.elements).map(input => ({
            name: input.name,
            type: input.type,
            required: input.required
          }))
        })),
        tables: Array.from(document.querySelectorAll('table')).map(table => ({
          rows: table.rows.length,
          columns: table.rows[0] ? table.rows[0].cells.length : 0,
          hasHeaders: !!table.querySelector('th'),
          id: table.id,
          className: table.className
        })),
        scripts: Array.from(document.scripts).map(script => ({
          src: script.src,
          inline: !script.src && script.textContent.length > 0
        })),
        stylesheets: Array.from(document.styleSheets).map(sheet => ({
          href: sheet.href,
          rules: sheet.cssRules ? sheet.cssRules.length : 0
        })),
        hasAjax: window.jQuery ? 'jQuery available' : 'No jQuery detected',
        bodyClasses: document.body.className,
        mainContent: {
          hasWrapper: !!document.querySelector('.wrapper, #wrapper'),
          hasContainer: !!document.querySelector('.container, #container'),
          hasSidebar: !!document.querySelector('.sidebar, .side-nav, #sidebar')
        }
      };
    }, linkContext);
    
    return analysis;
  }

  async discoverPageLinks(page) {
    return await page.evaluate(() => {
      const links = [];
      const pageLinks = document.querySelectorAll('a[href*="/portal/"]');
      
      pageLinks.forEach(link => {
        if (link.href && link.textContent.trim()) {
          links.push({
            text: link.textContent.trim(),
            href: link.href,
            context: 'discovered-on-page'
          });
        }
      });
      
      return links;
    });
  }

  async takeScreenshot(page, name) {
    try {
      const filename = `${this.sanitizeFilename(name)}-${Date.now()}.png`;
      const filepath = path.join(config.output.screenshots, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true,
        type: 'png'
      });
      
      this.screenshots.push({
        name: name,
        filename: filename,
        filepath: filepath,
        timestamp: new Date()
      });
      
      console.log(`📸 Screenshot saved: ${filename}`);
    } catch (error) {
      console.error(`❌ Screenshot failed for ${name}:`, error.message);
    }
  }

  sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
  }

  async generateReport() {
    const report = {
      metadata: {
        timestamp: new Date(),
        portalUrl: config.portal.url,
        phase: '1a-readonly-reconnaissance',
        duration: 'calculated-at-runtime'
      },
      summary: {
        pagesVisited: this.visitedUrls.size,
        screenshotsTaken: this.screenshots.length,
        errorsEncountered: this.errors.length,
        formsDiscovered: this.discoveredPages.reduce((sum, page) => sum + page.forms.length, 0),
        tablesDiscovered: this.discoveredPages.reduce((sum, page) => sum + page.tables.length, 0)
      },
      navigation: this.navigationStructure,
      pages: this.discoveredPages,
      screenshots: this.screenshots,
      errors: this.errors,
      insights: this.generateInsights()
    };
    
    // Save comprehensive report
    const reportPath = path.join(config.output.data, 'phase1a-reconnaissance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    const summaryPath = path.join(config.output.data, 'phase1a-summary.md');
    const summary = this.generateMarkdownSummary(report);
    fs.writeFileSync(summaryPath, summary);
    
    console.log('📋 Reports generated:');
    console.log(`  📄 ${reportPath}`);
    console.log(`  📝 ${summaryPath}`);
    console.log(`  📸 ${this.screenshots.length} screenshots in ${config.output.screenshots}`);
    
    return report;
  }

  generateInsights() {
    const insights = {
      frameworkDetection: {},
      layoutAnalysis: {},
      securityObservations: [],
      enhancementOpportunities: []
    };
    
    // Analyze jQuery usage across pages
    const jqueryPages = this.discoveredPages.filter(page => 
      page.hasAjax.includes('jQuery')
    );
    insights.frameworkDetection.jquery = {
      detected: jqueryPages.length > 0,
      pagesWithJquery: jqueryPages.length,
      percentage: (jqueryPages.length / this.discoveredPages.length * 100).toFixed(1)
    };
    
    // Layout patterns
    const wrapperPages = this.discoveredPages.filter(page => 
      page.mainContent.hasWrapper
    );
    insights.layoutAnalysis.wrapperPattern = {
      detected: wrapperPages.length > 0,
      usage: `${wrapperPages.length}/${this.discoveredPages.length} pages`
    };
    
    // Form analysis for CSRF implications
    const formsWithTokens = this.discoveredPages.filter(page =>
      page.forms.some(form => 
        form.inputs.some(input => 
          input.name && input.name.includes('_Token')
        )
      )
    );
    insights.securityObservations.push({
      type: 'csrf_tokens',
      finding: `${formsWithTokens.length} pages have forms with CSRF tokens`,
      implication: 'Phase 1b must handle token extraction for form submissions'
    });
    
    return insights;
  }

  generateMarkdownSummary(report) {
    return `# Phase 1a Reconnaissance Summary

## Overview
- **Portal**: ${report.metadata.portalUrl}
- **Timestamp**: ${report.metadata.timestamp}
- **Pages Visited**: ${report.summary.pagesVisited}
- **Screenshots**: ${report.summary.screenshotsTaken}
- **Errors**: ${report.summary.errorsEncountered}

## Navigation Structure
- **Primary Navigation**: ${report.navigation.primary.length} items
- **Sidebar Navigation**: ${report.navigation.sidebar.length} items
- **Secondary Links**: ${report.navigation.secondary.length} items

## Content Analysis
- **Forms Discovered**: ${report.summary.formsDiscovered}
- **Tables Discovered**: ${report.summary.tablesDiscovered}
- **jQuery Detection**: ${report.insights.frameworkDetection.jquery.detected ? '✅ Detected' : '❌ Not found'}

## Key Insights
${report.insights.securityObservations.map(obs => `- **${obs.type}**: ${obs.finding}`).join('\n')}

## Next Steps
1. Review screenshots for UI patterns
2. Analyze form structures for Phase 1b CRUD testing
3. Identify best candidate pages for controlled write operations

---
*Generated by Phase 1a Read-Only Reconnaissance*
`;
  }
}

// Execute if run directly
if (require.main === module) {
  const recon = new Phase1aReconnaissance();
  recon.run().catch(console.error);
}

module.exports = Phase1aReconnaissance;