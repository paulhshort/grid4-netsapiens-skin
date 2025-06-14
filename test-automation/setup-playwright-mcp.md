# Setting up Microsoft Playwright MCP for NetSapiens Testing

## Overview
This guide sets up the official Microsoft Playwright MCP server for automated browser testing of the NetSapiens portal.

## Prerequisites
- Docker installed
- Claude Desktop or compatible MCP client
- Access to NetSapiens sandbox portal

## Installation Options

### Option 1: Docker MCP (Recommended)
```bash
# Use the official Microsoft Playwright MCP via Docker
docker run -i --rm --init microsoft/playwright-mcp
```

### Option 2: NPX Installation
```bash
# Install via NPX (requires Node.js)
npx @microsoft/playwright-mcp
```

### Option 3: Claude Desktop Configuration
Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init", "microsoft/playwright-mcp"]
    }
  }
}
```

## Key Features

### Browser Automation Capabilities
- **Accessibility Tree Navigation**: Uses structured data instead of screenshots
- **Cross-Browser Testing**: Chromium, Firefox, Safari (WebKit)
- **Mobile Testing**: Device emulation and touch events
- **Screenshot Capture**: Full page and element-specific screenshots
- **JavaScript Execution**: Run custom scripts in browser context

### Advantages over Puppeteer
- **Faster**: No pixel-based analysis required
- **More Reliable**: Structured accessibility data vs visual parsing
- **LLM-Friendly**: Native integration with AI models
- **Multi-Browser**: Not limited to Chromium

## Testing Strategy

### 1. Portal Structure Analysis
```javascript
// Analyze NetSapiens portal layout
await page.goto('https://portal.grid4voice.ucaas.tech/portal/home');
const structure = await page.getAccessibilityTree();
```

### 2. Grid4 Customization Testing
```javascript
// Inject and test Grid4 customizations
await page.addStyleTag({ url: 'grid4-custom-v3.css' });
await page.addScriptTag({ url: 'grid4-custom-v3.js' });
```

### 3. Cross-Browser Verification
```javascript
// Test in multiple browsers
const browsers = ['chromium', 'firefox', 'webkit'];
for (const browserType of browsers) {
  const browser = await playwright[browserType].launch();
  // Run tests...
}
```

### 4. Mobile Responsiveness
```javascript
// Test mobile viewports
await page.setViewportSize({ width: 375, height: 667 }); // iPhone
await page.setViewportSize({ width: 768, height: 1024 }); // iPad
```

## Security Considerations

### Sandbox Environment
- Use only with sandbox portal: `portal.grid4voice.ucaas.tech`
- Never test against production systems
- Credentials: `1002@grid4voice / hQAFMdWXKNj4wAg`

### Browser Security
```javascript
// Secure browser launch options
const browser = await playwright.chromium.launch({
  headless: true,
  args: [
    '--no-sandbox', // Only for containerized environments
    '--disable-web-security', // Only for testing
    '--disable-features=VizDisplayCompositor'
  ]
});
```

## Expected Test Results

### Portal Structure Discovery
- jQuery version detection (expected: 1.8.3)
- CakePHP framework confirmation
- Navigation structure analysis
- Form and table inventory

### Grid4 Enhancement Verification
- CSS injection success rate
- Logo replacement functionality
- Command palette activation (Ctrl+Shift+P)
- Mobile navigation behavior

### Performance Metrics
- Page load times
- CSS/JS injection timing
- Feature flag system response
- Cross-browser compatibility

## Output Deliverables

### Screenshots
- `portal-login.png` - Login page state
- `portal-dashboard.png` - Main dashboard
- `grid4-injected.png` - After customization injection
- `mobile-view.png` - Responsive layout
- `command-palette.png` - Feature activation

### Analysis Reports
- `portal-structure.json` - DOM and framework analysis
- `enhancement-roadmap.json` - Effort estimates and recommendations
- `compatibility-report.json` - Cross-browser test results
- `performance-metrics.json` - Load times and optimization opportunities

## Next Steps
1. Configure MCP server in Claude Desktop
2. Run initial portal structure analysis
3. Generate comprehensive enhancement roadmap
4. Provide granular effort estimates for UI/UX improvements

## Troubleshooting

### Common Issues
- **MCP Connection Failed**: Verify Docker is running
- **Login Issues**: Check sandbox portal accessibility
- **Screenshot Blank**: Ensure proper page load timing
- **CSS Not Applied**: Verify CDN accessibility from test environment

### Debug Commands
```bash
# Test Docker MCP connectivity
docker run --rm microsoft/playwright-mcp --version

# Verify portal accessibility
curl -I https://portal.grid4voice.ucaas.tech

# Check browser launch
docker run -it --rm microsoft/playwright-mcp playwright --help
```