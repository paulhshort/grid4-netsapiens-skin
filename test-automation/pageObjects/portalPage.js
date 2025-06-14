// Portal Page Object for NetSapiens Testing
const config = require('../config');

class PortalPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors;
  }

  async waitForPortalLoad() {
    console.log('⏳ Waiting for portal to fully load...');
    
    // Wait for main content area
    await this.page.waitForSelector(
      `${this.selectors.portal.content}, ${this.selectors.portal.wrapper}`,
      { timeout: config.timeouts.element }
    );
    
    // Wait for navigation
    await this.page.waitForSelector(
      this.selectors.portal.navigation,
      { timeout: config.timeouts.element }
    );
    
    console.log('✅ Portal loaded successfully');
    return this;
  }

  async injectGrid4Customizations() {
    console.log('💉 Injecting Grid4 customizations...');
    
    try {
      // Inject main CSS
      await this.page.addStyleTag({ 
        url: config.grid4.cssUrl + '?test=' + Date.now()
      });
      console.log('  ✓ Grid4 CSS injected');
      
      // Inject main JavaScript
      await this.page.addScriptTag({ 
        url: config.grid4.jsUrl + '?test=' + Date.now()
      });
      console.log('  ✓ Grid4 JavaScript injected');
      
      // Wait for initialization
      await this.page.waitForTimeout(2000);
      
      // Check if Grid4 system initialized
      const isInitialized = await this.page.evaluate(() => {
        return typeof window.g4c !== 'undefined' && typeof window.g4c.isFeatureEnabled === 'function';
      });
      
      if (isInitialized) {
        console.log('✅ Grid4 system initialized successfully');
      } else {
        console.warn('⚠️ Grid4 system may not have initialized properly');
      }
      
      return isInitialized;
      
    } catch (error) {
      console.error('❌ Failed to inject Grid4 customizations:', error.message);
      throw error;
    }
  }

  async analyzePortalStructure() {
    console.log('🔍 Analyzing portal DOM structure...');
    
    const analysis = await this.page.evaluate(() => {
      const result = {
        framework: 'unknown',
        jqueryVersion: null,
        layout: {},
        navigation: {},
        forms: [],
        tables: [],
        cakephp: false
      };
      
      // Check for jQuery
      if (typeof window.jQuery !== 'undefined') {
        result.jqueryVersion = window.jQuery.fn.jquery || 'unknown';
      }
      
      // Check for CakePHP indicators
      const cakephpIndicators = [
        'script[src*="cake"]',
        'link[href*="cake"]',
        'form[action*="cake"]',
        '.cake-',
        '#cake-'
      ];
      
      for (const indicator of cakephpIndicators) {
        if (document.querySelector(indicator)) {
          result.cakephp = true;
          break;
        }
      }
      
      // Analyze layout structure
      const layoutElements = [
        '#header', '.header',
        '#navigation', '.navigation', '.sidebar',
        '#content', '.content', '.main-content',
        '#footer', '.footer',
        '.wrapper', '.container'
      ];
      
      layoutElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          const key = selector.replace(/[#\.]/g, '');
          result.layout[key] = {
            selector: selector,
            tagName: element.tagName.toLowerCase(),
            classes: Array.from(element.classList),
            id: element.id || null,
            children: element.children.length
          };
        }
      });
      
      // Analyze navigation
      const navElement = document.querySelector('#navigation, .navigation, .sidebar');
      if (navElement) {
        const navItems = navElement.querySelectorAll('a, li, .nav-item');
        result.navigation = {
          type: navElement.tagName.toLowerCase(),
          itemCount: navItems.length,
          structure: navElement.innerHTML.length > 1000 ? 'complex' : 'simple',
          hasIcons: !!navElement.querySelector('i, .icon, .glyphicon'),
          hasDropdowns: !!navElement.querySelector('.dropdown, .submenu')
        };
      }
      
      // Analyze forms
      document.querySelectorAll('form').forEach((form, index) => {
        const inputs = form.querySelectorAll('input, select, textarea');
        result.forms.push({
          index: index,
          action: form.action || null,
          method: form.method || 'get',
          inputCount: inputs.length,
          hasFileUpload: !!form.querySelector('input[type="file"]'),
          hasValidation: !!form.querySelector('[required], .required')
        });
      });
      
      // Analyze tables
      document.querySelectorAll('table').forEach((table, index) => {
        const rows = table.querySelectorAll('tr');
        const headers = table.querySelectorAll('th');
        result.tables.push({
          index: index,
          rowCount: rows.length,
          columnCount: headers.length,
          hasActions: !!table.querySelector('button, .btn, .action'),
          hasSorting: !!table.querySelector('.sortable, [data-sort]'),
          responsive: table.classList.contains('responsive') || !!table.closest('.table-responsive')
        });
      });
      
      return result;
    });
    
    console.log('📊 Portal Structure Analysis:');
    console.log(`  Framework: CakePHP ${analysis.cakephp ? '✓' : '✗'}`);
    console.log(`  jQuery Version: ${analysis.jqueryVersion || 'Not found'}`);
    console.log(`  Layout Elements: ${Object.keys(analysis.layout).length} found`);
    console.log(`  Navigation: ${analysis.navigation.itemCount || 0} items`);
    console.log(`  Forms: ${analysis.forms.length} found`);
    console.log(`  Tables: ${analysis.tables.length} found`);
    
    return analysis;
  }

  async testCommandPalette() {
    console.log('🎯 Testing Command Palette functionality...');
    
    try {
      // First enable the feature
      await this.page.evaluate(() => {
        if (window.g4c && window.g4c.enableFeature) {
          window.g4c.enableFeature('commandPalette');
          return true;
        }
        return false;
      });
      
      // Test the keyboard shortcut
      await this.page.keyboard.down('Control');
      await this.page.keyboard.down('Shift'); 
      await this.page.keyboard.press('KeyP');
      await this.page.keyboard.up('Shift');
      await this.page.keyboard.up('Control');
      
      console.log('  ✓ Command palette shortcut triggered');
      
      // Wait for command palette to appear
      try {
        await this.page.waitForSelector(this.selectors.grid4.commandPalette, { 
          visible: true, 
          timeout: 5000 
        });
        
        console.log('✅ Command Palette opened successfully');
        
        // Take screenshot
        await this.takeScreenshot('command-palette-open');
        
        // Test typing in the palette
        await this.page.type(this.selectors.grid4.commandPaletteInput, 'home');
        await this.page.waitForTimeout(500);
        
        console.log('  ✓ Search functionality working');
        
        // Close palette with Escape
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        
        return true;
        
      } catch (e) {
        console.warn('⚠️ Command Palette did not appear');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Command Palette test failed:', error.message);
      return false;
    }
  }

  async testLogoReplacement() {
    console.log('🖼️ Testing Logo Replacement...');
    
    const logoAnalysis = await this.page.evaluate(() => {
      const logoElement = document.querySelector('#header-logo, .logo, .header-logo');
      if (!logoElement) return { found: false };
      
      const computedStyle = window.getComputedStyle(logoElement);
      return {
        found: true,
        backgroundImage: computedStyle.backgroundImage,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        innerHTML: logoElement.innerHTML,
        hasGrid4Logo: computedStyle.backgroundImage.includes('grid4-logo_white'),
        originalImages: Array.from(logoElement.querySelectorAll('img')).map(img => ({
          src: img.src,
          display: window.getComputedStyle(img).display,
          visibility: window.getComputedStyle(img).visibility
        }))
      };
    });
    
    console.log('📊 Logo Analysis:');
    if (logoAnalysis.found) {
      console.log(`  Logo element found: ✓`);
      console.log(`  Grid4 logo active: ${logoAnalysis.hasGrid4Logo ? '✓' : '✗'}`);
      console.log(`  Background image: ${logoAnalysis.backgroundImage}`);
      console.log(`  Original images: ${logoAnalysis.originalImages.length}`);
      
      if (logoAnalysis.originalImages.length > 0) {
        logoAnalysis.originalImages.forEach((img, i) => {
          console.log(`    Image ${i + 1}: ${img.display === 'none' ? 'Hidden' : 'Visible'} - ${img.src}`);
        });
      }
    } else {
      console.log('  Logo element: ✗ Not found');
    }
    
    return logoAnalysis;
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing Mobile Responsiveness...');
    
    const originalViewport = this.page.viewport();
    
    try {
      // Test mobile viewport
      await this.page.setViewport({ width: 375, height: 667 }); // iPhone size
      await this.page.waitForTimeout(1000);
      
      await this.takeScreenshot('mobile-view');
      
      // Test navigation visibility
      const mobileNav = await this.page.evaluate(() => {
        const nav = document.querySelector('#navigation, .navigation');
        if (!nav) return { found: false };
        
        const computedStyle = window.getComputedStyle(nav);
        return {
          found: true,
          display: computedStyle.display,
          transform: computedStyle.transform,
          width: computedStyle.width,
          hasToggle: !!document.querySelector('.grid4-mobile-toggle, .mobile-toggle, .hamburger')
        };
      });
      
      console.log('📱 Mobile Navigation Analysis:');
      console.log(`  Navigation found: ${mobileNav.found ? '✓' : '✗'}`);
      if (mobileNav.found) {
        console.log(`  Display: ${mobileNav.display}`);
        console.log(`  Transform: ${mobileNav.transform}`);
        console.log(`  Mobile toggle: ${mobileNav.hasToggle ? '✓' : '✗'}`);
      }
      
      // Restore original viewport
      await this.page.setViewport(originalViewport);
      
      return mobileNav;
      
    } catch (error) {
      // Restore viewport on error
      await this.page.setViewport(originalViewport);
      throw error;
    }
  }

  async takeScreenshot(filename) {
    const screenshotPath = `${config.screenshots.outputDir}/${config.screenshots.prefix}-${filename}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📷 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async getConsoleErrors() {
    // This would require setting up console listeners in the main script
    // For now, we'll check for common error indicators
    return await this.page.evaluate(() => {
      const errors = [];
      
      // Check for JavaScript errors in global error handler
      if (window.jsErrors && window.jsErrors.length > 0) {
        errors.push(...window.jsErrors);
      }
      
      // Check for missing CSS/JS resources
      const brokenLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .filter(link => link.sheet === null)
        .map(link => ({ type: 'CSS', url: link.href }));
      
      errors.push(...brokenLinks);
      
      return errors;
    });
  }
}

module.exports = PortalPage;