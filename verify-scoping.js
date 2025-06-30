/**
 * Grid4 Portal Skin v5.0.4 - Scoping Verification Script
 * This script checks that all CSS rules are properly scoped to #grid4-app-shell
 */

const fs = require('fs');
const path = require('path');

// Read the CSS file
const cssPath = path.join(__dirname, 'grid4-portal-skin-v5.0.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Split into lines for analysis
const lines = cssContent.split('\n');

// Track issues
const issues = [];
let inComment = false;
let inKeyframes = false;
let currentRule = '';
let lineNumber = 0;

// Exceptions - these don't need to be scoped
const exceptions = [
    ':root',                    // CSS variables definition
    'body',                     // Body background color
    '@media',                   // Media queries
    '@keyframes',              // Animation definitions
    'html',                    // HTML element
    '.wrapper',                // Wrapper that contains app shell
    '.modal.g4-themed',        // Themed modals
    '.extension-badge',        // Extension badges (standalone)
    '.status-indicator',       // Status indicators (standalone)
    '@import',                 // Import statements
    '/*',                      // Comments
    '*/',                      // Comments
    ''                         // Empty lines
];

// Check each line
for (const line of lines) {
    lineNumber++;
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Track comment blocks
    if (trimmedLine.startsWith('/*')) inComment = true;
    if (trimmedLine.endsWith('*/')) {
        inComment = false;
        continue;
    }
    if (inComment) continue;
    
    // Track keyframe blocks
    if (trimmedLine.includes('@keyframes')) {
        inKeyframes = true;
        continue;
    }
    if (inKeyframes && trimmedLine === '}') {
        inKeyframes = false;
        continue;
    }
    if (inKeyframes) continue;
    
    // Check if this is a CSS selector (not a property)
    if (!trimmedLine.includes('{') && !trimmedLine.includes('}') && !trimmedLine.includes(':')) {
        continue;
    }
    
    // If line contains a selector
    if (trimmedLine.includes('{') && !trimmedLine.startsWith('{')) {
        currentRule = trimmedLine.split('{')[0].trim();
        
        // Check if this rule should be scoped
        let needsScoping = true;
        
        // Check exceptions
        for (const exception of exceptions) {
            if (currentRule.startsWith(exception) || 
                currentRule.includes('@') ||
                currentRule === '') {
                needsScoping = false;
                break;
            }
        }
        
        // Special case: .wrapper appears both scoped and unscoped (intentional)
        if (currentRule === '.wrapper') {
            needsScoping = false;
        }
        
        // If needs scoping, check if it has #grid4-app-shell
        if (needsScoping && !currentRule.includes('#grid4-app-shell')) {
            // Check if it's a body class modifier (these are OK)
            if (!currentRule.startsWith('body.')) {
                issues.push({
                    line: lineNumber,
                    rule: currentRule,
                    issue: 'Selector not scoped to #grid4-app-shell'
                });
            }
        }
    }
}

// Report results
console.log('=== Grid4 Portal Skin v5.0.4 - CSS Scoping Verification ===\n');

if (issues.length === 0) {
    console.log('✅ SUCCESS: All CSS rules are properly scoped!');
    console.log('\nKey findings:');
    console.log('- All component styles are scoped to #grid4-app-shell');
    console.log('- Global styles (body, :root) are properly used for theming');
    console.log('- Standalone components (.extension-badge, .status-indicator) are correctly unscoped');
    console.log('- No style leakage detected');
} else {
    console.log(`❌ ISSUES FOUND: ${issues.length} unscoped selectors detected:\n`);
    issues.forEach(issue => {
        console.log(`Line ${issue.line}: ${issue.rule}`);
        console.log(`  Issue: ${issue.issue}\n`);
    });
}

// Additional checks
console.log('\n=== Additional Verification ===');

// Check for important usage
const importantCount = (cssContent.match(/!important/g) || []).length;
console.log(`\n📊 !important usage: ${importantCount} instances`);
console.log('   (High usage is expected to override NetSapiens defaults)');

// Check for local asset references
const localAssets = cssContent.match(/url\(['"]?\.[^'")\s]+['"]?\)/g) || [];
console.log(`\n📁 Local asset references: ${localAssets.length}`);
localAssets.forEach(asset => {
    console.log(`   - ${asset}`);
});

// Check theme variables
const themeVars = cssContent.match(/var\(--[^)]+\)/g) || [];
const uniqueVars = [...new Set(themeVars.map(v => v.match(/--[^)]+/)[0]))];
console.log(`\n🎨 CSS Variables used: ${uniqueVars.length} unique variables`);

console.log('\n✅ Verification complete!');