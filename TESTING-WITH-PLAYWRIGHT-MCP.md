# Testing Grid4 NetSapiens Skin with Playwright MCP

## Overview

This guide demonstrates how to use the Playwright MCP (Model Context Protocol) for interactive testing of the Grid4 NetSapiens portal customizations. The Playwright MCP allows real-time browser automation and testing directly from the development environment.

## Quick Start Testing

### 1. Basic Portal Navigation Test

```bash
# Navigate to the Grid4 NetSapiens portal
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"

# Take a snapshot to see the current state
browser_snapshot_Playwright

# Take a screenshot for visual verification
browser_take_screenshot_Playwright --filename "grid4-portal-initial.png"
```

### 2. Login and Grid4 Verification

```bash
# Fill login credentials (replace with actual credentials)
browser_type_Playwright --element "Username field" --ref "#username" --text "your-username"
browser_type_Playwright --element "Password field" --ref "#password" --text "your-password"

# Submit login form
browser_click_Playwright --element "Login button" --ref "input[type='submit']"

# Wait for portal to load and take snapshot
browser_wait_for_Playwright --text "Home" --time 10

# Verify Grid4 customizations loaded
browser_snapshot_Playwright
```

### 3. Grid4 Customization Verification

```bash
# Check if Grid4 CSS is loaded
browser_take_screenshot_Playwright --element "Navigation sidebar" --ref "#navigation" --filename "grid4-navigation.png"

# Test navigation functionality
browser_click_Playwright --element "Users menu item" --ref "#nav-users a"
browser_wait_for_Playwright --text "Users" --time 5

# Verify Grid4 styling on Users page
browser_take_screenshot_Playwright --filename "grid4-users-page.png"
```

## Comprehensive Testing Scenarios

### Scenario 1: Visual Regression Testing

Test Grid4 styling across different pages:

```bash
# Home page
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/home"
browser_take_screenshot_Playwright --filename "grid4-home-desktop.png"

# Users page
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/users"
browser_take_screenshot_Playwright --filename "grid4-users-desktop.png"

# Call History page
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/callhistory"
browser_take_screenshot_Playwright --filename "grid4-callhistory-desktop.png"

# Conferences page
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/conferences"
browser_take_screenshot_Playwright --filename "grid4-conferences-desktop.png"
```

### Scenario 2: Responsive Design Testing

Test Grid4 responsiveness across different viewport sizes:

```bash
# Desktop view (1920x1080)
browser_resize_Playwright --width 1920 --height 1080
browser_take_screenshot_Playwright --filename "grid4-desktop-1920.png"

# Laptop view (1366x768)
browser_resize_Playwright --width 1366 --height 768
browser_take_screenshot_Playwright --filename "grid4-laptop-1366.png"

# Tablet view (768x1024)
browser_resize_Playwright --width 768 --height 1024
browser_take_screenshot_Playwright --filename "grid4-tablet-768.png"

# Mobile view (375x667)
browser_resize_Playwright --width 375 --height 667
browser_take_screenshot_Playwright --filename "grid4-mobile-375.png"
```

### Scenario 3: Interactive Feature Testing

Test Grid4 interactive features:

```bash
# Test sidebar collapse (if implemented)
browser_click_Playwright --element "Sidebar toggle button" --ref "#sidebar-toggle"
browser_wait_for_Playwright --time 1
browser_take_screenshot_Playwright --filename "grid4-sidebar-collapsed.png"

# Test mobile navigation
browser_resize_Playwright --width 375 --height 667
browser_click_Playwright --element "Mobile menu toggle" --ref ".grid4-mobile-toggle"
browser_take_screenshot_Playwright --filename "grid4-mobile-menu-open.png"

# Test debug panel (development mode)
browser_click_Playwright --element "Debug toggle button" --ref "#grid4-debug-toggle"
browser_take_screenshot_Playwright --filename "grid4-debug-panel.png"
```

### Scenario 4: Performance Testing

Monitor Grid4 performance impact:

```bash
# Navigate to portal and measure load time
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"

# Wait for Grid4 to fully initialize
browser_wait_for_Playwright --time 5

# Take performance snapshot
browser_console_messages_Playwright

# Check for any errors
browser_snapshot_Playwright
```

## Development Testing Workflow

### 1. Local Development Testing

When using the development proxy server:

```bash
# Start development server first
# npm run dev

# Navigate to local development environment
browser_navigate_Playwright --url "http://localhost:3000"

# Test hot-reload functionality
# (Make a CSS change in another terminal)
browser_wait_for_Playwright --time 2
browser_take_screenshot_Playwright --filename "grid4-hot-reload-test.png"
```

### 2. CDN Resource Validation

Test that Grid4 resources are loading correctly:

```bash
# Navigate to portal
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"

# Check network requests for Grid4 resources
browser_network_requests_Playwright

# Verify no 404 errors for Grid4 assets
browser_console_messages_Playwright
```

### 3. Cross-Browser Testing

Test Grid4 across different browsers:

```bash
# Test in Chrome (default)
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"
browser_take_screenshot_Playwright --filename "grid4-chrome.png"

# Note: Playwright MCP may support browser switching in future versions
# For now, run tests with different Playwright projects
```

## Advanced Testing Techniques

### 1. Element-Specific Testing

Test specific Grid4 components:

```bash
# Test navigation sidebar styling
browser_take_screenshot_Playwright --element "Navigation sidebar" --ref "#navigation" --filename "grid4-nav-component.png"

# Test header customizations
browser_take_screenshot_Playwright --element "Header section" --ref "#header" --filename "grid4-header-component.png"

# Test content area styling
browser_take_screenshot_Playwright --element "Content area" --ref "#content" --filename "grid4-content-component.png"
```

### 2. State-Based Testing

Test different portal states:

```bash
# Test with data tables
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/users"
browser_wait_for_Playwright --text "Users" --time 5
browser_take_screenshot_Playwright --filename "grid4-data-table.png"

# Test with forms
browser_click_Playwright --element "Add user button" --ref ".btn-add-user"
browser_wait_for_Playwright --time 2
browser_take_screenshot_Playwright --filename "grid4-form-modal.png"

# Test with empty states (if applicable)
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/conferences"
browser_take_screenshot_Playwright --filename "grid4-empty-state.png"
```

### 3. Error State Testing

Test Grid4 behavior with errors:

```bash
# Navigate to non-existent page
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/nonexistent"
browser_take_screenshot_Playwright --filename "grid4-error-page.png"

# Check console for Grid4 errors
browser_console_messages_Playwright
```

## Automated Test Execution

### Running Predefined Test Suites

```bash
# Run all visual regression tests
npm run test:visual-regression

# Run cross-browser compatibility tests
npm run test:cross-browser

# Run deployment validation tests
npm run test:deployment

# Run complete test suite
npm run test:all
```

### Custom Test Scripts

Create custom test scripts for specific scenarios:

```javascript
// tests/custom-grid4-test.spec.js
const { test, expect } = require('@playwright/test');

test('Grid4 branding verification', async ({ page }) => {
    await page.goto('https://portal.grid4voice.ucaas.tech/portal/');
    
    // Wait for Grid4 to initialize
    await page.waitForFunction(() => {
        return window.Grid4NetSapiens && window.Grid4NetSapiens.initialized;
    });
    
    // Take screenshot
    await expect(page).toHaveScreenshot('grid4-branding-test.png');
    
    // Verify Grid4 CSS variables are applied
    const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--grid4-primary-dark');
    });
    
    expect(primaryColor).toBeTruthy();
});
```

## Test Result Analysis

### 1. Screenshot Comparison

Compare screenshots to detect visual regressions:

```bash
# View test results
npm run test:report

# Screenshots are saved in test-results/screenshots/
# Baseline screenshots in test-results/baseline-screenshots/
```

### 2. Performance Analysis

Monitor Grid4 performance impact:

```bash
# Check console messages for performance logs
browser_console_messages_Playwright

# Look for Grid4 performance markers:
# "⏱️ Grid4 Performance [module_name]: XXXms"
# "📊 Grid4 Performance Summary"
```

### 3. Error Monitoring

Track and analyze errors:

```bash
# Check for JavaScript errors
browser_console_messages_Playwright

# Look for Grid4-specific errors:
# "Grid4 Error [context]: error message"
```

## Best Practices

### 1. Test Organization

- Group related tests into scenarios
- Use descriptive filenames for screenshots
- Document test purposes and expected outcomes

### 2. Test Maintenance

- Update tests when Grid4 features change
- Maintain baseline screenshots for comparison
- Regular test execution to catch regressions

### 3. Debugging

- Use `browser_snapshot_Playwright` for interactive debugging
- Take screenshots at key points in test flows
- Monitor console messages for Grid4 debug information

### 4. Performance Considerations

- Limit screenshot frequency to avoid storage bloat
- Use appropriate wait times for portal loading
- Monitor test execution time

## Integration with Development Workflow

### 1. Pre-Deployment Testing

```bash
# Before deploying changes
npm run test:visual-regression
npm run test:deployment

# Review test results
npm run test:report
```

### 2. Continuous Integration

Integrate Playwright MCP tests into CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Grid4 Testing
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:all
```

### 3. Development Feedback Loop

1. Make Grid4 changes
2. Test with development proxy
3. Run Playwright MCP tests
4. Review results and iterate
5. Deploy when tests pass

This testing approach ensures Grid4 customizations work reliably across the NetSapiens portal while maintaining visual consistency and performance standards.
