// NetSapiens Portal Testing Configuration
module.exports = {
  // Portal Configuration
  portal: {
    baseUrl: 'https://portal.grid4voice.ucaas.tech',
    loginUrl: 'https://portal.grid4voice.ucaas.tech/portal/home',
    credentials: {
      username: process.env.PORTAL_USER || '1002@grid4voice',
      password: process.env.PORTAL_PASSWORD || 'hQAFMdWXKNj4wAg'
    }
  },
  
  // Grid4 Customization URLs
  grid4: {
    cssUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.css',
    jsUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-custom-v3.js',
    commandPaletteCssUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.css',
    commandPaletteJsUrl: 'https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/command-palette.js'
  },
  
  // Selectors for Testing
  selectors: {
    // Login elements
    login: {
      usernameField: 'input[name="username"], input[type="email"], #username',
      passwordField: 'input[name="password"], input[type="password"], #password',
      loginButton: 'input[type="submit"], button[type="submit"], .btn-login, #login-btn'
    },
    
    // Portal elements to test
    portal: {
      header: '#header, .header, .navbar',
      logo: '#header-logo, .logo, .header-logo',
      navigation: '#navigation, .navigation, .sidebar, .nav',
      navButtons: '#nav-buttons, .nav-buttons',
      content: '#content, .content, .main-content',
      wrapper: '.wrapper, .container, .main-container'
    },
    
    // Grid4 specific elements
    grid4: {
      commandPalette: '.g4c-command-palette-overlay',
      commandPaletteInput: '.g4c-command-palette-input',
      mobileToggle: '.grid4-mobile-toggle'
    }
  },
  
  // Puppeteer Configuration
  puppeteer: {
    headless: false, // Set to true for CI/automated runs
    slowMo: 50, // Slow down operations for easier debugging
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  },
  
  // Test Configuration
  timeouts: {
    navigation: 30000,
    element: 10000,
    short: 5000
  },
  
  // Screenshot Configuration
  screenshots: {
    outputDir: './test-results/screenshots',
    prefix: 'grid4-test'
  }
};