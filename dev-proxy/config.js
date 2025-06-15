/**
 * Grid4 NetSapiens Development Proxy Configuration
 */

module.exports = {
    // Server configuration
    server: {
        port: process.env.DEV_PORT || 3000,
        wsPort: process.env.WS_PORT || 3001,
        host: process.env.DEV_HOST || 'localhost'
    },
    
    // Target portal configuration
    target: {
        url: process.env.TARGET_PORTAL || 'https://portal.grid4voice.ucaas.tech',
        // Alternative targets for different environments
        sandbox: 'https://portal.grid4voice.ucaas.tech',
        production: 'https://portal.grid4voice.com', // Update when available
        local: 'http://localhost:8080' // If you ever get local NetSapiens running
    },
    
    // File watching configuration
    watch: {
        files: [
            'grid4-netsapiens.css',
            'grid4-netsapiens.js',
            'grid4-netsapiens-v*.js',
            'grid4-netsapiens-v*.css',
            'dist/**/*',
            'backgrounds/**/*'
        ],
        ignored: [
            'node_modules/**/*',
            '.git/**/*',
            'test-results/**/*',
            'screenshots/**/*',
            'comparison/**/*'
        ]
    },
    
    // Hot-reload configuration
    hotReload: {
        enabled: true,
        cssReload: true,      // Reload CSS without page refresh
        jsNotification: true, // Show notification for JS changes
        debounceMs: 100      // Debounce file change events
    },
    
    // Development features
    development: {
        showIndicators: true,     // Show dev mode indicators
        injectDebugTools: true,   // Inject debugging helpers
        logRequests: false,       // Log all proxy requests
        mockResponses: false      // Enable response mocking (future feature)
    },
    
    // URL replacement patterns
    urlReplacements: [
        {
            // Replace CDN CSS with local version
            pattern: /https:\/\/cdn\.statically\.io\/gh\/paulhshort\/grid4-netsapiens-skin\/main\/grid4-netsapiens\.css/g,
            replacement: 'http://localhost:3000/grid4-netsapiens.css'
        },
        {
            // Replace CDN JS with local version
            pattern: /https:\/\/cdn\.statically\.io\/gh\/paulhshort\/grid4-netsapiens-skin\/main\/grid4-netsapiens\.js/g,
            replacement: 'http://localhost:3000/grid4-netsapiens.js'
        },
        {
            // Replace any versioned files
            pattern: /https:\/\/cdn\.statically\.io\/gh\/paulhshort\/grid4-netsapiens-skin\/main\/(grid4-netsapiens-v[\d.]+\.(css|js))/g,
            replacement: 'http://localhost:3000/$1'
        }
    ],
    
    // Proxy configuration
    proxy: {
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        timeout: 30000,
        headers: {
            'X-Grid4-Dev-Mode': 'true',
            'X-Grid4-Dev-Version': require('../package.json').version
        }
    },
    
    // CORS configuration
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    
    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        colorize: true,
        timestamp: true,
        format: 'dev'
    }
};
