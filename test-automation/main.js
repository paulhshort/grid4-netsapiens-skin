// Main NetSapiens Portal Testing Script
// Uses Puppeteer for comprehensive testing of Grid4 customizations

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const LoginPage = require('./pageObjects/loginPage');
const PortalPage = require('./pageObjects/portalPage');

// Create screenshots directory if it doesn't exist
const screenshotDir = config.screenshots.outputDir;
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Global error tracking
const errors = [];

async function runPortalTests() {
  console.log('🚀 Starting Grid4 NetSapiens Portal Tests...');
  console.log('=' * 60);
  
  let browser;
  let page;
  
  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch(config.puppeteer);
    page = await browser.newPage();
    
    // Set up console logging
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push({ type: 'console', message: text, timestamp: new Date() });
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warn') {
        console.log(`⚠️ Console Warning: ${text}`);
      } else if (text.includes('Grid4')) {
        console.log(`🎯 Grid4 Log: ${text}`);
      }
    });
    
    // Set up error tracking
    page.on('pageerror', (error) => {
      errors.push({ type: 'page', message: error.message, timestamp: new Date() });
      console.log(`💥 Page Error: ${error.message}`);
    });
    
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const portalPage = new PortalPage(page);
    
    // Test Suite
    const testResults = {
      login: false,
      injection: false,
      structure: null,
      logo: null,
      commandPalette: false,
      mobile: null,
      errors: []
    };
    
    console.log('\n📝 Test Plan:');
    console.log('  1. Login to NetSapiens Portal');
    console.log('  2. Analyze Portal Structure');
    console.log('  3. Inject Grid4 Customizations');
    console.log('  4. Test Logo Replacement');
    console.log('  5. Test Command Palette');
    console.log('  6. Test Mobile Responsiveness');
    console.log('  7. Generate Enhancement Roadmap');
    console.log('\n' + '=' * 60);
    
    // 1. Login Test
    console.log('\n🔐 TEST 1: Portal Login');
    console.log('-' * 30);
    
    await loginPage.navigateToLogin();
    await loginPage.takeScreenshot('01-login-page');
    
    const loginSuccess = await loginPage.login();
    testResults.login = loginSuccess;
    
    if (loginSuccess) {
      await loginPage.takeScreenshot('02-post-login');
      console.log('✅ Login test passed');
    } else {
      throw new Error('Login failed - cannot continue tests');
    }
    
    // 2. Portal Structure Analysis
    console.log('\n🔍 TEST 2: Portal Structure Analysis');
    console.log('-' * 40);
    
    await portalPage.waitForPortalLoad();
    const structure = await portalPage.analyzePortalStructure();
    testResults.structure = structure;
    
    await portalPage.takeScreenshot('03-portal-structure');
    console.log('✅ Structure analysis completed');
    
    // 3. Grid4 Injection Test
    console.log('\n💉 TEST 3: Grid4 Customization Injection');
    console.log('-' * 45);
    
    const injectionSuccess = await portalPage.injectGrid4Customizations();
    testResults.injection = injectionSuccess;
    
    if (injectionSuccess) {
      await portalPage.takeScreenshot('04-grid4-injected');
      console.log('✅ Grid4 injection test passed');
    } else {
      console.warn('⚠️ Grid4 injection may have issues');
    }
    
    // 4. Logo Replacement Test
    console.log('\n🖼️ TEST 4: Logo Replacement');
    console.log('-' * 30);
    
    const logoAnalysis = await portalPage.testLogoReplacement();
    testResults.logo = logoAnalysis;
    
    await portalPage.takeScreenshot('05-logo-test');
    console.log('✅ Logo test completed');
    
    // 5. Command Palette Test
    console.log('\n🎯 TEST 5: Command Palette');
    console.log('-' * 30);
    
    const commandPaletteSuccess = await portalPage.testCommandPalette();
    testResults.commandPalette = commandPaletteSuccess;
    
    if (commandPaletteSuccess) {
      console.log('✅ Command Palette test passed');
    } else {
      console.warn('⚠️ Command Palette test failed');
    }
    
    // 6. Mobile Responsiveness Test
    console.log('\n📱 TEST 6: Mobile Responsiveness');
    console.log('-' * 35);
    
    const mobileAnalysis = await portalPage.testMobileResponsiveness();
    testResults.mobile = mobileAnalysis;
    
    await portalPage.takeScreenshot('06-final-desktop');
    console.log('✅ Mobile responsiveness test completed');
    
    // 7. Error Collection
    const consoleErrors = await portalPage.getConsoleErrors();
    testResults.errors = [...errors, ...consoleErrors];
    
    // Generate comprehensive report
    console.log('\n📊 GENERATING ENHANCEMENT ROADMAP');
    console.log('=' * 50);
    
    await generateEnhancementRoadmap(testResults);
    
    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    
    if (page) {
      await page.screenshot({ 
        path: `${screenshotDir}/${config.screenshots.prefix}-error.png`,
        fullPage: true 
      });
    }
    
    throw error;
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('🌐 Browser closed');
    }
  }
}

async function generateEnhancementRoadmap(testResults) {
  console.log('\n🎯 ENHANCEMENT ROADMAP BASED ON TESTING');
  console.log('=' * 55);
  
  const roadmap = {
    foundation: {
      status: 'complete',
      confidence: testResults.injection ? 'high' : 'medium',
      notes: []
    },
    quickWins: [],
    mediumEffort: [],
    highEffort: [],
    constraints: []
  };
  
  // Analyze foundation
  if (testResults.structure) {
    if (testResults.structure.jqueryVersion) {
      console.log(`📚 jQuery Version: ${testResults.structure.jqueryVersion}`);
      roadmap.constraints.push(`jQuery ${testResults.structure.jqueryVersion} compatibility required`);
    }
    
    if (testResults.structure.cakephp) {
      console.log('🍰 CakePHP Framework: Detected');
      roadmap.constraints.push('CakePHP 1.3.x legacy framework');
    }
    
    console.log(`📋 Forms: ${testResults.structure.forms.length} detected`);
    console.log(`📊 Tables: ${testResults.structure.tables.length} detected`);
    console.log(`🧭 Navigation: ${testResults.structure.navigation.itemCount || 0} items`);
  }
  
  // Quick Wins (High Confidence, Low Effort)
  console.log('\n🟢 QUICK WINS (1-4 hours each):');
  console.log('-' * 35);
  
  const quickWins = [
    {
      name: 'Toast Notifications',
      effort: 'low',
      confidence: 'high',
      reason: 'Replace alert() calls with modern toasts',
      implementation: 'Intercept window.alert, inject custom DOM'
    },
    {
      name: 'CSS Loading Animations',
      effort: 'low', 
      confidence: 'high',
      reason: 'Pure CSS keyframe animations',
      implementation: 'Add spinner classes, target form buttons'
    },
    {
      name: 'Enhanced Button Hovers',
      effort: 'low',
      confidence: 'high', 
      reason: 'CSS-only enhancements',
      implementation: 'Target .btn classes with transitions'
    }
  ];
  
  if (testResults.structure.tables.length > 0) {
    quickWins.push({
      name: 'Table Row Hover Effects',
      effort: 'low',
      confidence: 'high',
      reason: `${testResults.structure.tables.length} tables detected`,
      implementation: 'CSS :hover and :nth-child selectors'
    });
  }
  
  roadmap.quickWins = quickWins;
  quickWins.forEach(item => {
    console.log(`  ✓ ${item.name} - ${item.reason}`);
  });
  
  // Medium Effort Features  
  console.log('\n🟡 MEDIUM EFFORT (1-2 days each):');
  console.log('-' * 38);
  
  const mediumEffort = [
    {
      name: 'Smart Tooltips',
      effort: 'medium',
      confidence: testResults.structure.jqueryVersion ? 'high' : 'medium',
      reason: 'jQuery available for enhanced tooltips',
      implementation: 'jQuery hover events + positioned divs'
    }
  ];
  
  if (testResults.structure.navigation.hasDropdowns) {
    mediumEffort.push({
      name: 'Enhanced Dropdown Menus',
      effort: 'medium',
      confidence: 'medium',
      reason: 'Existing dropdowns detected',
      implementation: 'CSS animations + jQuery enhancements'
    });
  }
  
  if (!testResults.mobile?.hasToggle) {
    mediumEffort.push({
      name: 'Mobile Navigation Toggle',
      effort: 'medium', 
      confidence: 'high',
      reason: 'No mobile toggle detected',
      implementation: 'CSS media queries + jQuery slideToggle'
    });
  }
  
  roadmap.mediumEffort = mediumEffort;
  mediumEffort.forEach(item => {
    console.log(`  ◉ ${item.name} - ${item.reason}`);
  });
  
  // High Effort Projects
  console.log('\n🔴 HIGH EFFORT (1+ weeks each):');
  console.log('-' * 35);
  
  const highEffort = [
    {
      name: 'SPA-like Navigation',
      effort: 'high',
      confidence: 'experimental',
      reason: 'Transform to single-page app experience',
      implementation: 'Intercept links, fetch content, History API'
    },
    {
      name: 'Advanced Data Tables',
      effort: 'high',
      confidence: testResults.structure.tables.length > 0 ? 'medium' : 'low',
      reason: `${testResults.structure.tables.length} tables for enhancement`,
      implementation: 'Client-side sorting, filtering, pagination'
    }
  ];
  
  roadmap.highEffort = highEffort;
  highEffort.forEach(item => {
    console.log(`  ⚡ ${item.name} - ${item.reason}`);
  });
  
  // Critical Issues
  if (testResults.errors.length > 0) {
    console.log('\n⚠️ CRITICAL ISSUES TO ADDRESS:');
    console.log('-' * 35);
    testResults.errors.slice(0, 5).forEach(error => {
      console.log(`  ❌ ${error.message}`);
    });
  }
  
  // Command Palette Enhancement
  if (!testResults.commandPalette) {
    console.log('\n🎯 COMMAND PALETTE ISSUES:');
    console.log('-' * 30);
    console.log('  ⚠️ Command Palette failed to activate');
    console.log('  📝 Requires debugging of Ctrl+Shift+P shortcut');
    console.log('  💡 Consider alternative activation methods');
  }
  
  // Save roadmap to file
  const roadmapPath = `${config.screenshots.outputDir}/enhancement-roadmap.json`;
  fs.writeFileSync(roadmapPath, JSON.stringify(roadmap, null, 2));
  console.log(`\n💾 Detailed roadmap saved: ${roadmapPath}`);
  
  return roadmap;
}

// Export for programmatic use
module.exports = { runPortalTests, generateEnhancementRoadmap };

// Run if called directly
if (require.main === module) {
  runPortalTests()
    .then(() => {
      console.log('\n🎉 Testing completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Testing failed:', error);
      process.exit(1);
    });
}