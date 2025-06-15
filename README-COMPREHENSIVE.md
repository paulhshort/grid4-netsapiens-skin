# Grid4 NetSapiens Portal Skin - Complete Development Suite

A comprehensive customization package for the NetSapiens portal with Grid4 Communications branding, featuring a complete development environment, automated testing with Playwright MCP, and production deployment workflow.

## 🚀 Features

### Portal Customization
- **Modern Dark Theme**: Professional dark color scheme with Grid4 branding
- **Enhanced Navigation**: Improved sidebar with better organization and visual hierarchy
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Lightweight CSS and JavaScript with minimal impact

### Development Environment
- **🔄 Hot-Reloading Development Proxy**: CSS changes apply instantly without page refresh
- **🐛 Interactive Debug Panel**: Real-time performance monitoring and error tracking
- **📊 Performance Monitoring**: Built-in timing and resource usage tracking
- **🛠️ Development Tools**: Comprehensive debugging utilities and portal inspection

### Testing Suite
- **🧪 Playwright MCP Integration**: Interactive browser automation and testing
- **📸 Visual Regression Testing**: Automated screenshot comparison across viewports
- **🌐 Cross-Browser Compatibility**: Chrome, Firefox, Safari testing
- **✅ Deployment Validation**: CDN resource verification and integration testing

## 🎯 Quick Start

### For NetSapiens Administrators

```
PORTAL_CSS_CUSTOM: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css
PORTAL_EXTRA_JS: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js
PORTAL_CSP_STYLE_ADDITIONS: https://cdn.statically.io 'unsafe-inline'
PORTAL_CSP_SCRIPT_ADDITIONS: https://cdn.statically.io
```

### For Developers

```bash
# Clone and setup
git clone https://github.com/paulhshort/grid4-netsapiens-skin.git
cd grid4-netsapiens-skin
npm install

# Start development environment
npm run dev
# Open http://localhost:3000 - proxies live portal with local customizations

# Run comprehensive tests
npm run test:all

# View test results
npm run test:report
```

## 🛠️ Development Environment

### Development Proxy Server

The development proxy (`dev-proxy/server.js`) provides a complete local development environment:

**Core Features:**
- **Hot-Reload**: WebSocket-based CSS hot-reloading without page refresh
- **Local File Serving**: Serves your local CSS/JS files instead of CDN versions
- **Portal Proxying**: Proxies all requests to live NetSapiens portal
- **URL Replacement**: Automatically replaces CDN URLs with local development URLs

**Development Tools:**
- **Debug Panel**: Real-time metrics, error tracking, module testing
- **Performance Monitoring**: Initialization timing, paint metrics, memory usage
- **Development Indicators**: Visual indicators showing development mode is active
- **Error Tracking**: Comprehensive error logging and reporting

```bash
# Start development server
npm run dev

# With file watching (auto-restart on changes)
npm run dev:watch
```

### Enhanced Grid4 JavaScript

Development mode includes comprehensive debugging tools:

```javascript
// Available in browser console
Grid4Dev.utils.reload()           // Reload Grid4 without page refresh
Grid4Dev.utils.toggleDebug()      // Toggle debug mode
Grid4Dev.utils.testModules()      // Test all modules
Grid4Dev.utils.inspectPortal()    // Inspect NetSapiens portal state
Grid4Dev.utils.getPerformance()   // Get performance metrics
```

**Development Features:**
- Automatic development mode detection
- Interactive debug panel with toggle button
- Real-time performance monitoring
- Module testing and validation
- Portal state inspection

## 🧪 Comprehensive Testing with Playwright MCP

### Automated Test Suites

```bash
# Visual regression testing across viewports and pages
npm run test:visual-regression

# Cross-browser compatibility (Chrome, Firefox, Safari)
npm run test:cross-browser

# Deployment validation (CDN resources, integration)
npm run test:deployment

# Complete test suite
npm run test:all

# View detailed HTML test report
npm run test:report
```

### Interactive Testing with Playwright MCP

Real-time browser automation for development and debugging:

```bash
# Navigate to portal
browser_navigate_Playwright --url "https://portal.grid4voice.ucaas.tech/portal/"

# Take screenshots for comparison
browser_take_screenshot_Playwright --filename "grid4-current-state.png"

# Test specific functionality
browser_click_Playwright --element "Users navigation link" --ref "#nav-users a"

# Validate Grid4 customizations
browser_snapshot_Playwright

# Test responsive design
browser_resize_Playwright --width 375 --height 667
browser_take_screenshot_Playwright --filename "grid4-mobile.png"
```

### Test Coverage

**Visual Regression Testing:**
- Home, Users, Call History, Conferences, Contacts, Voicemails pages
- Desktop (1920x1080), Laptop (1366x768), Tablet (768x1024), Mobile (375x667)
- Grid4 navigation sidebar, header, mobile navigation components
- Theme variations and branding elements

**Cross-Browser Compatibility:**
- Core Grid4 functionality across browsers
- jQuery 1.8.3 compatibility validation
- CSS feature support (custom properties, flexbox, transforms)
- JavaScript ES5 compatibility
- Responsive design behavior
- Performance consistency

**Deployment Validation:**
- CDN resource availability and integrity
- CSS/JS injection verification
- Grid4 branding application
- Navigation customization
- Performance impact assessment
- Error handling and monitoring

## 🏗️ Architecture

### NetSapiens Portal Integration

Based on the comprehensive [NetSapiens Portal Reference](./netsapiens-portal-skin-reference.md):

**Technology Stack:**
- Backend: CakePHP 1.3.x with PHP 5.x/7.x
- Frontend: jQuery 1.8.3, Bootstrap-style CSS, FontAwesome 4.7
- Constraints: Single CSS and JS file injection only

**DOM Structure:**
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

**Non-Destructive Enhancement Pattern:**
1. **CSS Architecture**: CSS custom properties with scoped selectors
2. **JavaScript Modules**: Modular architecture with safe DOM manipulation
3. **Progressive Enhancement**: Core features work, advanced features enhance
4. **Error Boundaries**: Graceful degradation when features fail

## 🚀 Deployment

### Automatic CDN Deployment

Changes to `main` branch automatically deploy via Statically CDN:

- **CSS**: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css`
- **JS**: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js`

### Version Management

```bash
# Create versioned release
git tag -a v2.1.1 -m "Grid4 NetSapiens skin v2.1.1"
git push origin v2.1.1

# Use specific version in portal configuration
PORTAL_CSS_CUSTOM: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/v2.1.1/grid4-netsapiens.css
```

### Deployment Workflow

1. **Development**: Use development proxy for local testing
2. **Testing**: Run comprehensive Playwright MCP test suite
3. **Validation**: Verify test results and performance metrics
4. **Deployment**: Push to main branch for automatic CDN deployment
5. **Verification**: Run deployment validation tests

## 📚 Documentation

- **[Development Guide](./DEVELOPMENT-GUIDE.md)**: Complete development workflow and best practices
- **[Testing Guide](./TESTING-WITH-PLAYWRIGHT-MCP.md)**: Playwright MCP testing instructions and examples
- **[NetSapiens Reference](./netsapiens-portal-skin-reference.md)**: Portal architecture and integration reference
- **[Configuration Guide](./dev-proxy/config.js)**: Development proxy configuration options

## 🔧 Development Workflow

### 1. Local Development
```bash
npm run dev                    # Start development proxy
# Edit CSS/JS files - see changes instantly at http://localhost:3000
```

### 2. Testing
```bash
npm run test:visual-regression # Visual regression testing
npm run test:cross-browser     # Cross-browser compatibility
npm run test:deployment        # Deployment validation
npm run test:all              # Complete test suite
```

### 3. Interactive Testing
```bash
# Use Playwright MCP for real-time testing
browser_navigate_Playwright --url "http://localhost:3000"
browser_take_screenshot_Playwright --filename "development-test.png"
```

### 4. Deployment
```bash
git add .
git commit -m "Feature: Enhanced navigation styling"
git push origin main          # Automatic CDN deployment
npm run test:deployment       # Verify deployment
```

## 🛡️ Browser Support & Performance

### Browser Compatibility
- **Chrome**: 60+ (full support)
- **Firefox**: 55+ (full support)  
- **Safari**: 12+ (full support)
- **Edge**: 79+ (full support)
- **Internet Explorer**: 11 (basic support)

### Performance Metrics
- **CSS Size**: ~15KB minified
- **JavaScript Size**: ~25KB minified
- **Load Impact**: <100ms additional load time
- **Memory Usage**: <2MB additional memory

## 🐛 Troubleshooting

### Common Issues
1. **CSS not loading**: Check CSP headers and CDN accessibility
2. **JavaScript errors**: Verify jQuery 1.8.3 compatibility (no ES6+ features)
3. **Styles not applying**: Check CSS specificity and cascade order
4. **AJAX breaks customizations**: Use `ajaxComplete` handlers or `MutationObserver`

### Debug Tools
```javascript
// Enable debug mode
Grid4NetSapiens.config.debug = true;

// Access development tools
Grid4Dev.utils.inspectPortal();
Grid4Dev.utils.getPerformance();
Grid4Dev.utils.testModules();
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test: `npm run test:all`
4. Commit changes: `git commit -am 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Create Pull Request

### Development Guidelines
- Follow existing code patterns and architecture
- Add tests for new features
- Update documentation for changes
- Ensure cross-browser compatibility
- Test with actual NetSapiens portal

---

**Grid4 Communications** - Transforming business communications with innovative VoIP solutions and comprehensive development tools.
