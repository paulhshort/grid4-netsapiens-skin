#!/usr/bin/env node

/**
 * Grid4 Emergency Hotfix v1.0.5 - Test Setup Validation
 * 
 * Quick validation script to ensure the test environment is properly configured
 * before running the full test suite.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Grid4 Emergency Hotfix v1.0.5 - Test Setup Validation');
console.log('=========================================================\n');

// Files to check
const requiredFiles = [
  './grid4-emergency-hotfix-v105.css',
  './grid4-emergency-hotfix-v105.js', 
  './grid4-emergency-hotfix-validation.spec.js',
  './playwright.config.js',
  './run-emergency-hotfix-tests.js',
  './package.json'
];

const optionalFiles = [
  './test-results/emergency-hotfix-v105'
];

let validationPassed = true;

// 1. Check required files exist
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    validationPassed = false;
  }
});

// 2. Validate emergency hotfix files content
console.log('\n🔧 Validating emergency hotfix files...');

try {
  const cssContent = fs.readFileSync('./grid4-emergency-hotfix-v105.css', 'utf8');
  const jsContent = fs.readFileSync('./grid4-emergency-hotfix-v105.js', 'utf8');
  
  // Check CSS file
  const cssChecks = [
    { pattern: /grid4-emergency-active/, description: 'Main CSS class selector' },
    { pattern: /CSS GRID APPLICATION SHELL/, description: 'Grid layout implementation' },
    { pattern: /overflow-x: hidden/, description: 'Horizontal overflow prevention' },
    { pattern: /grid-template-columns/, description: 'CSS Grid columns' },
    { pattern: /@media.*max-width.*768px/, description: 'Mobile responsive styles' }
  ];
  
  cssChecks.forEach(check => {
    if (cssContent.match(check.pattern)) {
      console.log(`   ✅ CSS: ${check.description}`);
    } else {
      console.log(`   ⚠️ CSS: ${check.description} - Not found`);
    }
  });
  
  // Check JS file
  const jsChecks = [
    { pattern: /Emergency Hotfix v1\.0\.5/, description: 'Version identifier' },
    { pattern: /grid4EmergencyHotfixActive/, description: 'Conflict prevention flag' },
    { pattern: /forceBodyClasses/, description: 'Body class application' },
    { pattern: /wrapTablesInContainers/, description: 'Table responsiveness' },
    { pattern: /addMobileMenuTrigger/, description: 'Mobile menu functionality' },
    { pattern: /measureOverflow/, description: 'Overflow measurement utility' }
  ];
  
  jsChecks.forEach(check => {
    if (jsContent.match(check.pattern)) {
      console.log(`   ✅ JS: ${check.description}`);
    } else {
      console.log(`   ⚠️ JS: ${check.description} - Not found`);
    }
  });
  
} catch (error) {
  console.log(`   ❌ Error reading hotfix files: ${error.message}`);
  validationPassed = false;
}

// 3. Check Node.js and npm
console.log('\n🔧 Checking Node.js environment...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ Node.js: ${nodeVersion}`);
  console.log(`   ✅ npm: ${npmVersion}`);
} catch (error) {
  console.log(`   ❌ Node.js/npm check failed: ${error.message}`);
  validationPassed = false;
}

// 4. Check package.json dependencies
console.log('\n📦 Checking package dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.playwright) {
    console.log(`   ✅ Playwright dependency: ${packageJson.dependencies.playwright}`);
  } else {
    console.log(`   ⚠️ Playwright dependency not found in package.json`);
  }
  
  // Check if playwright is actually installed
  try {
    const playwrightVersion = execSync('npx playwright --version', { encoding: 'utf8' }).trim();
    console.log(`   ✅ Playwright installed: ${playwrightVersion}`);
  } catch (error) {
    console.log(`   ❌ Playwright not installed - run: npm install playwright`);
    validationPassed = false;
  }
  
} catch (error) {
  console.log(`   ❌ Error checking dependencies: ${error.message}`);
  validationPassed = false;
}

// 5. Validate test file syntax
console.log('\n🧪 Validating test file syntax...');
try {
  const testContent = fs.readFileSync('./grid4-emergency-hotfix-validation.spec.js', 'utf8');
  
  // Check for critical test functions
  const testChecks = [
    { pattern: /test\.describe.*Critical Validation/, description: 'Main test suite' },
    { pattern: /should load without horizontal scrollbars/, description: 'Overflow test' },
    { pattern: /should apply proper CSS Grid layout/, description: 'Grid layout test' },
    { pattern: /should eliminate navigation styling issues/, description: 'Navigation test' },
    { pattern: /should ensure tables are responsive/, description: 'Table responsiveness test' },
    { pattern: /should have functional mobile menu/, description: 'Mobile menu test' },
    { pattern: /measureOverflow/, description: 'Overflow measurement function' },
    { pattern: /checkGridLayout/, description: 'Grid layout check function' },
    { pattern: /injectHotfixFiles/, description: 'Hotfix injection function' }
  ];
  
  testChecks.forEach(check => {
    if (testContent.match(check.pattern)) {
      console.log(`   ✅ Test: ${check.description}`);
    } else {
      console.log(`   ⚠️ Test: ${check.description} - Not found`);
    }
  });
  
} catch (error) {
  console.log(`   ❌ Error validating test file: ${error.message}`);
  validationPassed = false;
}

// 6. Create results directory if needed
console.log('\n📁 Checking results directory...');
const resultsDir = './test-results/emergency-hotfix-v105';
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
  console.log(`   ✅ Created results directory: ${resultsDir}`);
} else {
  console.log(`   ✅ Results directory exists: ${resultsDir}`);
}

// 7. Check environment variables
console.log('\n🔐 Checking environment configuration...');
const envVars = [
  { name: 'PORTAL_USER', defaultValue: '1002@grid4voice', required: false },
  { name: 'PORTAL_PASSWORD', defaultValue: '[configured in test file]', required: false },
  { name: 'HEADLESS', defaultValue: 'true', required: false }
];

envVars.forEach(envVar => {
  const value = process.env[envVar.name];
  if (value) {
    console.log(`   ✅ ${envVar.name}: ${envVar.name === 'PORTAL_PASSWORD' ? '***' : value}`);
  } else {
    console.log(`   ℹ️ ${envVar.name}: Using default (${envVar.defaultValue})`);
  }
});

// 8. Quick syntax check of key files
console.log('\n✅ Running syntax validation...');
const filesToValidate = [
  './playwright.config.js',
  './run-emergency-hotfix-tests.js'
];

filesToValidate.forEach(file => {
  try {
    require(path.resolve(file));
    console.log(`   ✅ ${file} - Syntax OK`);
  } catch (error) {
    console.log(`   ❌ ${file} - Syntax Error: ${error.message}`);
    validationPassed = false;
  }
});

// Final summary
console.log('\n' + '='.repeat(60));
console.log('🏁 VALIDATION SUMMARY');
console.log('='.repeat(60));

if (validationPassed) {
  console.log('✅ All validations passed! Ready to run emergency hotfix tests.');
  console.log('\nNext steps:');
  console.log('   1. Run tests: node run-emergency-hotfix-tests.js');
  console.log('   2. Or with visible browser: node run-emergency-hotfix-tests.js --headless=false');
  console.log('   3. For specific browser: node run-emergency-hotfix-tests.js --browser=chromium');
  console.log('\nThe test suite will validate:');
  console.log('   • No horizontal scrollbars across all viewports');
  console.log('   • Proper CSS Grid layout architecture');  
  console.log('   • Clean navigation styling (no overlapping icons)');
  console.log('   • Responsive table behavior');
  console.log('   • Mobile menu functionality');
  console.log('   • Version selector positioning');
} else {
  console.log('❌ Some validations failed. Please fix the issues above before running tests.');
  console.log('\nCommon fixes:');
  console.log('   • Install Playwright: npm install playwright');
  console.log('   • Install browser binaries: npx playwright install');
  console.log('   • Check file paths and permissions');
}

console.log(`\nTest results will be saved to: ${resultsDir}`);
console.log('Screenshots will be generated for visual validation.');

process.exit(validationPassed ? 0 : 1);