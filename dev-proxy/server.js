#!/usr/bin/env node

/**
 * Grid4 NetSapiens Development Proxy Server
 * 
 * This proxy server enables local development by:
 * 1. Serving local CSS/JS files with hot-reloading
 * 2. Proxying all other requests to the live NetSapiens portal
 * 3. Injecting development helpers and debugging tools
 * 4. Supporting live CSS/JS updates without page refresh
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.DEV_PORT || 3000;
const TARGET_PORTAL = process.env.TARGET_PORTAL || 'https://portal.grid4voice.net';

// Enable CORS for development
app.use(cors());

// WebSocket server for hot-reloading
const wss = new WebSocket.Server({ port: 3001 });

// Track connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('🔌 Client connected for hot-reload');
    
    ws.on('close', () => {
        clients.delete(ws);
        console.log('🔌 Client disconnected');
    });
});

// Broadcast reload message to all clients
function broadcastReload(file) {
    const message = JSON.stringify({
        type: 'reload',
        file: file,
        timestamp: Date.now()
    });
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    
    console.log(`🔄 Hot-reload triggered for: ${file}`);
}

// File watcher for hot-reloading
const watcher = chokidar.watch([
    'grid4-netsapiens.css',
    'grid4-netsapiens.js',
    'grid4-netsapiens-v*.js',
    'grid4-netsapiens-v*.css',
    'dist/**/*'
], {
    ignored: /node_modules/,
    persistent: true
});

watcher.on('change', (filePath) => {
    console.log(`📝 File changed: ${filePath}`);
    broadcastReload(filePath);
});

// Serve local development files
app.get('/grid4-netsapiens.css', (req, res) => {
    const cssPath = path.join(__dirname, '..', 'grid4-netsapiens.css');
    
    if (fs.existsSync(cssPath)) {
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        let css = fs.readFileSync(cssPath, 'utf8');
        
        // Inject development helpers
        css += `
/* Development Mode Indicators */
body::before {
    content: "🚀 GRID4 DEV MODE";
    position: fixed;
    top: 0;
    right: 0;
    background: #ff6b35;
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    z-index: 999999;
    font-family: monospace;
}

/* Hot-reload indicator */
.grid4-hot-reload-indicator {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 999999;
    font-family: monospace;
    opacity: 0;
    transition: opacity 0.3s;
}

.grid4-hot-reload-indicator.show {
    opacity: 1;
}
`;
        
        res.send(css);
    } else {
        res.status(404).send('CSS file not found');
    }
});

app.get('/grid4-netsapiens.js', (req, res) => {
    const jsPath = path.join(__dirname, '..', 'grid4-netsapiens.js');
    
    if (fs.existsSync(jsPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        let js = fs.readFileSync(jsPath, 'utf8');
        
        // Inject hot-reload client
        const hotReloadClient = `
// Grid4 Development Hot-Reload Client
(function() {
    if (typeof window.Grid4DevMode !== 'undefined') return;
    
    window.Grid4DevMode = {
        connected: false,
        ws: null,
        
        init: function() {
            this.connect();
            this.addIndicator();
            console.log('🚀 Grid4 Development Mode Active');
        },
        
        connect: function() {
            try {
                this.ws = new WebSocket('ws://localhost:3001');
                
                this.ws.onopen = () => {
                    this.connected = true;
                    console.log('🔌 Connected to Grid4 dev server');
                    this.showNotification('Connected to dev server', 'success');
                };
                
                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'reload') {
                        this.handleReload(data);
                    }
                };
                
                this.ws.onclose = () => {
                    this.connected = false;
                    console.log('🔌 Disconnected from Grid4 dev server');
                    setTimeout(() => this.connect(), 2000);
                };
                
                this.ws.onerror = (error) => {
                    console.error('🚨 Grid4 dev server error:', error);
                };
            } catch (error) {
                console.error('🚨 Failed to connect to Grid4 dev server:', error);
            }
        },
        
        handleReload: function(data) {
            console.log('🔄 Reloading:', data.file);
            
            if (data.file.endsWith('.css')) {
                this.reloadCSS();
            } else if (data.file.endsWith('.js')) {
                this.showNotification('JS updated - refresh page for changes', 'info');
            }
        },
        
        reloadCSS: function() {
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(link => {
                if (link.href.includes('grid4-netsapiens.css')) {
                    const newLink = link.cloneNode();
                    newLink.href = link.href.split('?')[0] + '?t=' + Date.now();
                    link.parentNode.insertBefore(newLink, link.nextSibling);
                    setTimeout(() => link.remove(), 100);
                }
            });
            this.showNotification('CSS reloaded', 'success');
        },
        
        addIndicator: function() {
            const indicator = document.createElement('div');
            indicator.className = 'grid4-hot-reload-indicator';
            indicator.id = 'grid4-dev-indicator';
            document.body.appendChild(indicator);
        },
        
        showNotification: function(message, type) {
            const indicator = document.getElementById('grid4-dev-indicator');
            if (indicator) {
                indicator.textContent = message;
                indicator.className = 'grid4-hot-reload-indicator show ' + type;
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 2000);
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Grid4DevMode.init());
    } else {
        Grid4DevMode.init();
    }
})();

`;
        
        js = hotReloadClient + '\n\n' + js;
        res.send(js);
    } else {
        res.status(404).send('JS file not found');
    }
});

// Serve other local files
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/backgrounds', express.static(path.join(__dirname, '..', 'backgrounds')));

// Proxy all other requests to the target portal
app.use('/', createProxyMiddleware({
    target: TARGET_PORTAL,
    changeOrigin: true,
    secure: false,
    logLevel: 'info',
    onProxyReq: (proxyReq, req, res) => {
        // Add development headers
        proxyReq.setHeader('X-Grid4-Dev-Mode', 'true');
    },
    onProxyRes: (proxyRes, req, res) => {
        // Inject our custom CSS/JS into HTML responses
        if (proxyRes.headers['content-type'] && 
            proxyRes.headers['content-type'].includes('text/html')) {
            
            // Remove content-length to allow modification
            delete proxyRes.headers['content-length'];
            
            // Modify HTML to use local files
            const originalWrite = res.write;
            const originalEnd = res.end;
            let body = '';
            
            res.write = function(chunk) {
                body += chunk;
            };
            
            res.end = function(chunk) {
                if (chunk) body += chunk;
                
                // Replace CDN URLs with local development URLs
                body = body.replace(
                    /https:\/\/cdn\.statically\.io\/gh\/paulhshort\/grid4-netsapiens-skin\/main\/grid4-netsapiens\.css/g,
                    `http://localhost:${PORT}/grid4-netsapiens.css`
                );
                
                body = body.replace(
                    /https:\/\/cdn\.statically\.io\/gh\/paulhshort\/grid4-netsapiens-skin\/main\/grid4-netsapiens\.js/g,
                    `http://localhost:${PORT}/grid4-netsapiens.js`
                );
                
                originalWrite.call(res, body);
                originalEnd.call(res);
            };
        }
    }
}));

// Start the server
app.listen(PORT, () => {
    console.log(`
🚀 Grid4 NetSapiens Development Proxy Server Started!

📍 Local Development URL: http://localhost:${PORT}
🎯 Proxying to: ${TARGET_PORTAL}
🔄 Hot-reload WebSocket: ws://localhost:3001

📝 Watching files:
   - grid4-netsapiens.css
   - grid4-netsapiens.js
   - dist/**/*

💡 Usage:
   1. Navigate to http://localhost:${PORT} in your browser
   2. Edit CSS/JS files locally
   3. See changes instantly without page refresh (CSS) or with notification (JS)

🛑 Press Ctrl+C to stop the server
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Grid4 development server...');
    watcher.close();
    wss.close();
    process.exit(0);
});
