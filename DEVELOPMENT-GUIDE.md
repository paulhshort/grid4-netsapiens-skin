# Grid4 NetSapiens Portal Development Guide

## Overview

This guide provides a comprehensive development workflow for customizing the NetSapiens portal with Grid4 branding and functionality. It combines local development tools, automated testing with Playwright MCP, and deployment strategies optimized for the NetSapiens portal architecture.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development proxy server
npm run dev

# 3. Open development environment
# Navigate to: http://localhost:3000

# 4. Run tests with Playwright MCP
npm run test:all
```

## Development Environment Architecture

### 1. Development Proxy Server

The development proxy (`dev-proxy/server.js`) provides:

- **Hot-reloading**: CSS changes apply instantly without page refresh
- **Local file serving**: Serves your local CSS/JS files instead of CDN versions
- **Portal proxying**: Proxies all other requests to the live NetSapiens portal
- **Development tools**: Injects debugging helpers and performance monitoring

**Key Features:**
- WebSocket-based hot-reload for CSS
- Automatic URL replacement for Grid4 assets
- Development mode indicators
- Error tracking and debugging tools

### 2. Enhanced Grid4 JavaScript

The Grid4 JavaScript now includes development-specific features:

```javascript
// Development mode detection
config: {
    developmentMode: window.location.hostname === 'localhost' || 
                    window.location.search.includes('grid4-dev=true'),
    hotReload: true,
    debugPanel: true,
    performanceMonitoring: true
}
```

**Development Tools Available:**
- `window.Grid4Dev` - Development utilities object
- Debug panel with real-time metrics
- Performance monitoring
- Module testing utilities
- Portal state inspection

### 3. Playwright MCP Integration

Automated testing using Playwright MCP for:

- **Visual regression testing**: Screenshot comparison across viewports
- **Cross-browser compatibility**: Chrome, Firefox, Safari testing
- **Deployment validation**: CDN resource verification
- **Performance monitoring**: Load time and resource usage tracking

## Development Workflow

### Step 1: Local Development Setup

```bash
# Start the development proxy
npm run dev

# Or with file watching
npm run dev:watch
```

This starts:
- Development proxy server on `http://localhost:3000`
- WebSocket server on `ws://localhost:3001` for hot-reload
- File watcher for automatic CSS/JS updates

### Step 2: Development Testing

Navigate to `http://localhost:3000` and you'll see:
- 🚀 Development mode indicator in top-right
- 🐛 Debug panel toggle button
- Hot-reload notifications for CSS changes
- Development console tools available

**Available Development Tools:**

```javascript
// In browser console:
Grid4Dev.utils.reload()           // Reload Grid4 without page refresh
Grid4Dev.utils.toggleDebug()      // Toggle debug mode
Grid4Dev.utils.testModules()      // Test all modules
Grid4Dev.utils.inspectPortal()    // Inspect NetSapiens portal state
Grid4Dev.utils.getPerformance()   // Get performance metrics
```

### Step 3: Automated Testing with Playwright MCP

Run comprehensive tests using the Playwright MCP:

```bash
# Run all test suites
npm run test:all

# Run specific test types
npm run test:visual-regression    # Visual regression testing
npm run test:cross-browser       # Cross-browser compatibility
npm run test:deployment          # Deployment validation

# View test results
npm run test:report
```

**Test Coverage:**
- Visual regression across 4 viewport sizes (desktop, laptop, tablet, mobile)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Deployment validation (CDN resources, injection verification)
- Performance impact assessment
- Grid4 branding application verification

### Step 4: Live Testing

Test against the actual NetSapiens portal:

```javascript
// Inject development files for testing (run in browser console)
(function() {
    // Remove existing custom assets
    $('link[href*="grid4-netsapiens.css"]').remove();
    $('script[src*="grid4-netsapiens.js"]').remove();
    
    // Inject local development versions
    $('<link>', {
        rel: 'stylesheet',
        href: 'http://localhost:3000/grid4-netsapiens.css?v=' + Date.now()
    }).appendTo('head');
    
    $('<script>', {
        src: 'http://localhost:3000/grid4-netsapiens.js?v=' + Date.now()
    }).appendTo('body');
})();
```

## Testing Strategy

### 1. Visual Regression Testing

Automatically captures and compares screenshots:

```bash
# Run visual regression tests
npm run test:visual-regression
```

**Coverage:**
- Home, Users, Call History, Conferences, Contacts, Voicemails pages
- Desktop (1920x1080), Laptop (1366x768), Tablet (768x1024), Mobile (375x667)
- Grid4 navigation sidebar, header, mobile navigation
- Theme variations (if available)

### 2. Cross-Browser Compatibility

Tests across multiple browsers and devices:

```bash
# Run cross-browser tests
npm run test:cross-browser
```

**Validation:**
- Core Grid4 functionality across browsers
- jQuery compatibility (NetSapiens uses jQuery 1.8.3)
- CSS feature support (custom properties, flexbox, transforms)
- JavaScript ES5 compatibility
- Responsive design behavior
- Performance consistency

### 3. Deployment Validation

Verifies production deployment:

```bash
# Run deployment validation
npm run test:deployment
```

**Checks:**
- CDN resource availability and integrity
- CSS/JS injection verification
- Grid4 branding application
- Navigation customization
- Responsive behavior
- Performance impact assessment
- Error handling and monitoring

### 4. Interactive Testing with Playwright MCP

Use the Playwright MCP for interactive testing:

```bash
# Navigate to the portal
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"

# Take screenshots for comparison
browser_take_screenshot_Playwright --filename "grid4-current-state.png"

# Test specific functionality
browser_click_Playwright --element "Users navigation link" --ref "#nav-users a"

# Validate Grid4 customizations
browser_snapshot_Playwright
```

## NetSapiens Portal Integration

### Portal Architecture Understanding

Based on the NetSapiens portal reference, our development approach respects:

**Technology Stack:**
- Backend: CakePHP 1.3.x with PHP 5.x/7.x
- Frontend: jQuery 1.8.3, Bootstrap-style CSS, FontAwesome 4.7
- Constraints: Single CSS and JS file injection only

**Key DOM Structure:**
```html
<div class="wrapper">
    <div id="header"><!-- Logo, user menu --></div>
    <div id="navigation">
        <ul id="nav-buttons"><!-- Navigation menu items --></ul>
    </div>
    <div id="content"><!-- Page-specific content --></div>
</div>
```

**Configuration Variables:**
- `PORTAL_CSS_CUSTOM`: URL to Grid4 CSS file
- `PORTAL_EXTRA_JS`: URL to Grid4 JavaScript file
- `PORTAL_CSP_STYLE_ADDITIONS`: CSP allowlist for CSS sources
- `PORTAL_CSP_SCRIPT_ADDITIONS`: CSP allowlist for JS sources

### Grid4 Customization Strategy

Our approach follows the **non-destructive enhancement** pattern:

1. **CSS Architecture**: Uses CSS custom properties and scoped selectors
2. **JavaScript Modules**: Modular architecture with safe DOM manipulation
3. **Progressive Enhancement**: Core features work, advanced features enhance
4. **Error Boundaries**: Graceful degradation when features fail

## Deployment Process

### 1. Build and Test

```bash
# Build production files
npm run build

# Run comprehensive tests
npm run test:all

# Verify test results
npm run test:report
```

### 2. Version and Deploy

```bash
# Tag release
git tag -a v2.1.1 -m "Grid4 NetSapiens skin v2.1.1"
git push origin v2.1.1

# CDN URLs automatically update:
# https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css
# https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js
```

### 3. Portal Configuration

Update NetSapiens portal configuration:

```
PORTAL_CSS_CUSTOM: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css
PORTAL_EXTRA_JS: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js
PORTAL_CSP_STYLE_ADDITIONS: https://cdn.statically.io 'unsafe-inline'
PORTAL_CSP_SCRIPT_ADDITIONS: https://cdn.statically.io
```

## Troubleshooting

### Common Issues

1. **CSS not loading**: Check CSP headers and CDN accessibility
2. **JavaScript errors**: Verify jQuery 1.8.3 compatibility (no ES6+ features)
3. **Styles not applying**: Increase CSS specificity or check cascade order
4. **AJAX breaks customizations**: Use `ajaxComplete` handlers or `MutationObserver`

### Debug Tools

```javascript
// Enable debug mode
Grid4NetSapiens.config.debug = true;

// Access development tools
Grid4Dev.utils.inspectPortal();
Grid4Dev.utils.getPerformance();

// Run module tests
Grid4Dev.utils.testModules();
```

### Performance Monitoring

The development environment includes performance monitoring:
- Initialization timing
- Module load times
- Paint timing metrics
- Memory usage tracking

## Next Steps

1. **Enhanced Visual Testing**: Expand screenshot coverage for edge cases
2. **Accessibility Testing**: Add WCAG compliance validation
3. **Performance Optimization**: Implement lazy loading for advanced features
4. **User Feedback Integration**: Add feedback collection mechanisms
5. **Advanced Theming**: Implement dynamic theme switching

## Resources

- [NetSapiens Portal Reference](./netsapiens-portal-skin-reference.md)
- [Test Results](./test-results/html-report/index.html)
- [Development Proxy Configuration](./dev-proxy/config.js)
- [Playwright Configuration](./playwright.grid4.config.js)

---

This development guide provides a complete workflow for efficiently developing, testing, and deploying Grid4 NetSapiens portal customizations while respecting the portal's architecture and constraints.
