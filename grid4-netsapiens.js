/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * Modern UI JavaScript for enhanced functionality
 * Version: 1.0.5
 * Author: Grid4 Communications
 * 
 * Major rewrite v1.0.5:
 * - Complete navigation detection overhaul based on NetSapiens structure
 * - Direct targeting of #nav-buttons for navigation items
 * - Extensive debug logging
 * - Simplified dashboard approach
 */

(function($) {
    'use strict';

    // Defensive check for jQuery
    if (typeof $ === 'undefined' || !$) {
        console.error('Grid4 Portal: jQuery is required but not available');
        return;
    }

    // Configuration
    const G4Config = {
        sidebarStorageKey: 'g4-sidebar-expanded',
        animationDuration: 300,
        mobileBreakpoint: 768,
        chartColors: {
            primary: '#1DA1F2',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            muted: '#64748b'
        },
        debugMode: true // Enable extensive logging
    };

    // Navigation mapping - comprehensive list
    const navigationMapping = {
        'home': { icon: 'ph-house', label: 'Home' },
        'users': { icon: 'ph-users', label: 'Users' },
        'resellers': { icon: 'ph-storefront', label: 'Resellers' },
        'domains': { icon: 'ph-globe', label: 'Domains' },
        'callhistory': { icon: 'ph-phone', label: 'Call History' },
        'callqueues': { icon: 'ph-headphones', label: 'Call Queues' },
        'attendants': { icon: 'ph-squares-four', label: 'Auto Attendants' },
        'conferences': { icon: 'ph-video-camera', label: 'Conference Rooms' },
        'siptrunks': { icon: 'ph-server', label: 'SIP Trunks' },
        'routeprofiles': { icon: 'ph-map-pin', label: 'Route Profiles' },
        'routes': { icon: 'ph-map-pin', label: 'Route Profiles' },
        'inventory': { icon: 'ph-devices', label: 'Inventory' },
        'phones': { icon: 'ph-device-mobile', label: 'Phones' },
        'timeframes': { icon: 'ph-clock', label: 'Time Frames' },
        'voicemails': { icon: 'ph-voicemail', label: 'Voicemail' },
        'music': { icon: 'ph-music-note', label: 'Music on Hold' },
        'settings': { icon: 'ph-gear', label: 'Platform Settings' },
        'uiconfigs': { icon: 'ph-gear', label: 'Platform Settings' },
        'contacts': { icon: 'ph-address-book', label: 'Contacts' },
        'agents': { icon: 'ph-headset', label: 'Agents' },
        'answerrules': { icon: 'ph-funnel', label: 'Answer Rules' },
        'stats': { icon: 'ph-chart-bar', label: 'Statistics' },
        'reports': { icon: 'ph-chart-line', label: 'Reports' },
        'cdrschedule': { icon: 'ph-calendar', label: 'CDR Schedule' },
        'billing': { icon: 'ph-receipt', label: 'Billing' },
        'phonenumbers': { icon: 'ph-hash', label: 'Phone Numbers' },
        'messages': { icon: 'ph-envelope', label: 'Messages' },
        'builder': { icon: 'ph-wrench', label: 'Phone Config' }
    };

    /**
     * Grid4 Portal Transformation Main Class
     */
    class Grid4Portal {
        constructor() {
            this.log('🚀 Grid4 Portal v1.0.5 - Initializing...');
            try {
                this.sidebarExpanded = this.getSavedSidebarState();
                this.isMobile = window.innerWidth <= G4Config.mobileBreakpoint;
                this.navigationItems = [];
                this.initAttempts = 0;
                this.maxInitAttempts = 5;
                
                // Start initialization process
                this.init();
            } catch (error) {
                console.error('Grid4 Portal initialization error:', error);
            }
        }

        /**
         * Enhanced logging
         */
        log(...args) {
            if (G4Config.debugMode) {
                console.log('[G4 Portal]', ...args);
            }
        }

        /**
         * Initialize the transformation
         */
        init() {
            this.log(`Initialization attempt ${this.initAttempts + 1}/${this.maxInitAttempts}`);
            
            // Wait for DOM and NetSapiens to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.performInitialization(), 1500);
                });
            } else {
                // DOM is ready, but wait for NetSapiens
                setTimeout(() => this.performInitialization(), 1500);
            }
        }

        /**
         * Perform actual initialization
         */
        performInitialization() {
            try {
                this.log('Starting transformation...');
                
                // Check dependencies
                if (!this.checkDependencies()) {
                    this.retryInit();
                    return;
                }

                // Check if we're in the right context
                const isManagerPortal = document.title && document.title.includes('Manager Portal');
                const isGrid4Domain = window.location.hostname.includes('gridfour') || 
                                    window.location.href.includes('grid4comm');
                
                this.log('Portal type:', isManagerPortal ? 'Manager' : 'User');
                this.log('Grid4 domain:', isGrid4Domain);

                // Clean up any previous attempts
                this.cleanup();
                
                // Apply layout fixes first
                this.applyLayoutFixes();
                
                // Add transformed class to body
                $('body').addClass('g4-transformed');
                
                // Extract navigation from NetSapiens
                this.extractNetSapiensNavigation();
                
                // Create our sidebar
                this.createSidebar();
                
                // Fix dashboard if on home page
                if (this.isHomePage()) {
                    this.fixDashboard();
                }
                
                // Setup event listeners
                this.setupEventListeners();
                
                // Add custom styles
                this.addCustomStyles();
                
                this.log('✅ Transformation complete!');
                
            } catch (error) {
                console.error('Grid4 Portal initialization error:', error);
                this.retryInit();
            }
        }

        /**
         * Check for required dependencies
         */
        checkDependencies() {
            const deps = {
                'jQuery': typeof $ !== 'undefined',
                'document.body': document.body !== null,
                'NetSapiens navigation': $('#nav-buttons').length > 0 || $('#navigation').length > 0
            };
            
            let allPresent = true;
            Object.entries(deps).forEach(([name, present]) => {
                this.log(`Dependency ${name}:`, present ? '✓' : '✗');
                if (!present) allPresent = false;
            });
            
            return allPresent;
        }

        /**
         * Retry initialization
         */
        retryInit() {
            this.initAttempts++;
            if (this.initAttempts < this.maxInitAttempts) {
                this.log(`Retrying in 2 seconds...`);
                setTimeout(() => this.init(), 2000);
            } else {
                console.error('❌ Grid4 Portal failed to initialize after maximum attempts');
                // Try one last time with fallback navigation
                this.createSidebarWithFallback();
            }
        }

        /**
         * Clean up previous attempts
         */
        cleanup() {
            $('#g4-sidebar').remove();
            $('.g4-dashboard-metrics').remove();
            $('.g4-dashboard-charts').remove();
            $('#g4-dynamic-styles').remove();
            $('body').removeClass('g4-transformed');
        }

        /**
         * Apply critical layout fixes
         */
        applyLayoutFixes() {
            this.log('Applying layout fixes...');
            
            // Ensure wrapper exists and has proper styling
            if (!$('.wrapper').length) {
                $('body').wrapInner('<div class="wrapper"></div>');
            }
            
            $('.wrapper').css({
                'position': 'relative',
                'min-height': '100vh',
                'margin-left': '0',
                'transition': 'margin-left 0.3s ease'
            });
            
            $('body').css({
                'margin': '0',
                'overflow-x': 'hidden'
            });
        }

        /**
         * Extract navigation from NetSapiens portal
         */
        extractNetSapiensNavigation() {
            this.log('🔍 Extracting NetSapiens navigation...');
            this.navigationItems = [];
            
            // Debug all navigation structures
            this.log('Debugging navigation structures:');
            this.log('  #nav-buttons exists:', $('#nav-buttons').length > 0);
            this.log('  #navigation exists:', $('#navigation').length > 0);
            this.log('  .nav-bg-image exists:', $('.nav-bg-image').length);
            
            // Method 1: Try to get items from #nav-buttons (main navigation)
            const $navButtons = $('#nav-buttons');
            if ($navButtons.length) {
                this.log('Found #nav-buttons with', $navButtons.find('li').length, 'items');
                
                $navButtons.find('li').each((index, li) => {
                    const $li = $(li);
                    const $link = $li.find('a').first();
                    
                    if ($link.length) {
                        const href = $link.attr('href');
                        const id = $li.attr('id'); // e.g., 'nav-home', 'nav-domains'
                        const text = $li.find('.nav-text').text().trim() || 
                                   $link.text().trim() ||
                                   $link.attr('title') || '';
                        
                        this.log(`  Li #${index}: id="${id}", text="${text}", href="${href}"`);
                        
                        if (href && text) {
                            // Extract controller from ID or href
                            let controller = '';
                            if (id && id.startsWith('nav-')) {
                                controller = id.replace('nav-', '');
                            } else if (href) {
                                const match = href.match(/\/portal\/([^\/\?]+)/);
                                if (match) controller = match[1];
                            }
                            
                            // Skip items that look like custom Grid4 additions
                            const skipTexts = ['grid4 knowledgebase', 'grid4 web calling', 'grid4 hd conferencing', 
                                             'grid4 analytics', 'my account', 'user portal'];
                            if (skipTexts.some(skip => text.toLowerCase().includes(skip))) {
                                this.log(`    Skipping custom item: ${text}`);
                                continue;
                            }
                            
                            this.navigationItems.push({
                                controller: controller,
                                href: href,
                                text: text,
                                id: id
                            });
                            
                            this.log(`    ✓ Added: ${text} (${controller})`);
                        }
                    }
                });
            }
            
            // Method 2: Try Apps dropdown which often has the full menu
            const $appsDropdown = $('[href="#apps-dropdown"], [data-target="#apps-dropdown"], .apps-dropdown').first();
            if ($appsDropdown.length) {
                this.log('Found Apps dropdown, checking menu items...');
                const $dropdownMenu = $appsDropdown.next('.dropdown-menu').length ? 
                                    $appsDropdown.next('.dropdown-menu') : 
                                    $('#apps-dropdown');
                                    
                if ($dropdownMenu.length) {
                    $dropdownMenu.find('a').each((i, link) => {
                        const $link = $(link);
                        const href = $link.attr('href');
                        const text = $link.text().trim();
                        
                        if (href && text && href.includes('/portal/')) {
                            const match = href.match(/\/portal\/([^\/\?]+)/);
                            if (match) {
                                const controller = match[1];
                                
                                // Check if we already have this controller
                                if (!this.navigationItems.find(item => item.controller === controller)) {
                                    this.navigationItems.push({
                                        controller: controller,
                                        href: href,
                                        text: text,
                                        source: 'apps-dropdown'
                                    });
                                    this.log(`  Found in Apps dropdown: ${text} (${controller})`);
                                }
                            }
                        }
                    });
                }
            }
            
            // Method 3: Check all dropdowns in header
            if (this.navigationItems.length < 5) {
                this.log('Checking all header dropdowns...');
                $('#header .dropdown-menu a, .navbar .dropdown-menu a').each((i, link) => {
                    const $link = $(link);
                    const href = $link.attr('href');
                    const text = $link.text().trim();
                    
                    if (href && text && href.includes('/portal/') && 
                        !text.toLowerCase().includes('logout') && 
                        !text.toLowerCase().includes('help') &&
                        !text.toLowerCase().includes('profile')) {
                        
                        const match = href.match(/\/portal\/([^\/\?]+)/);
                        if (match) {
                            const controller = match[1];
                            
                            // Check if we already have this controller
                            if (!this.navigationItems.find(item => item.controller === controller)) {
                                this.navigationItems.push({
                                    controller: controller,
                                    href: href,
                                    text: text,
                                    source: 'header-dropdown'
                                });
                                this.log(`  Found in header dropdown: ${text} (${controller})`);
                            }
                        }
                    }
                });
            }
            
            this.log(`Total navigation items found: ${this.navigationItems.length}`);
            
            // Log all found items for debugging
            if (this.navigationItems.length > 0) {
                this.log('Navigation items summary:');
                this.navigationItems.forEach(item => {
                    this.log(`  - ${item.text} (${item.controller}) from ${item.source || 'nav-buttons'}`);
                });
            }
        }

        /**
         * Create sidebar navigation
         */
        createSidebar() {
            this.log('Creating sidebar...');
            
            const sidebarHTML = `
                <div class="g4-sidebar ${this.sidebarExpanded ? 'expanded' : ''}" id="g4-sidebar">
                    <div class="g4-sidebar-header">
                        <div class="g4-logo">
                            <div class="g4-logo-icon">G4</div>
                            <span class="g4-logo-text">Grid4 CloudVoice</span>
                        </div>
                        <button class="g4-sidebar-toggle" id="g4-sidebar-toggle" aria-label="Toggle sidebar">
                            <i class="ph ph-list"></i>
                        </button>
                    </div>
                    <nav class="g4-sidebar-nav">
                        ${this.generateNavigationHTML()}
                    </nav>
                </div>
            `;
            
            $('body').prepend(sidebarHTML);
            
            // Update wrapper margin
            const $wrapper = $('.wrapper');
            if (this.sidebarExpanded) {
                $wrapper.addClass('sidebar-expanded');
            }
        }

        /**
         * Generate navigation HTML
         */
        generateNavigationHTML() {
            let html = '';
            const currentPath = window.location.pathname;
            
            // Always start with Home
            const homeActive = currentPath.includes('/home') || currentPath.endsWith('/');
            html += `
                <a href="/portal/home" class="g4-nav-item ${homeActive ? 'active' : ''}">
                    <i class="ph ph-house"></i>
                    <span>Home</span>
                </a>
            `;
            
            // Add detected navigation items
            if (this.navigationItems.length > 0) {
                // Sort by priority
                const priority = ['resellers', 'domains', 'siptrunks', 'routeprofiles', 
                                'inventory', 'callhistory', 'uiconfigs', 'users',
                                'callqueues', 'attendants', 'conferences'];
                
                const sorted = [...this.navigationItems].sort((a, b) => {
                    const aIndex = priority.indexOf(a.controller);
                    const bIndex = priority.indexOf(b.controller);
                    if (aIndex === -1 && bIndex === -1) return 0;
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;
                    return aIndex - bIndex;
                });
                
                sorted.forEach(item => {
                    if (item.controller === 'home') return; // Skip home, already added
                    
                    const mapping = navigationMapping[item.controller] || {
                        icon: 'ph-circle',
                        label: item.text
                    };
                    
                    const isActive = currentPath.includes(item.controller);
                    
                    html += `
                        <a href="${item.href}" class="g4-nav-item ${isActive ? 'active' : ''}">
                            <i class="ph ${mapping.icon}"></i>
                            <span>${mapping.label}</span>
                        </a>
                    `;
                });
            } else {
                // Use comprehensive fallback
                this.log('Using fallback navigation');
                const fallback = [
                    { href: '/portal/resellers', controller: 'resellers' },
                    { href: '/portal/domains', controller: 'domains' },
                    { href: '/portal/siptrunks', controller: 'siptrunks' },
                    { href: '/portal/routeprofiles', controller: 'routeprofiles' },
                    { href: '/portal/inventory', controller: 'inventory' },
                    { href: '/portal/callhistory', controller: 'callhistory' },
                    { href: '/portal/uiconfigs', controller: 'uiconfigs' }
                ];
                
                fallback.forEach(item => {
                    const mapping = navigationMapping[item.controller];
                    const isActive = currentPath.includes(item.controller);
                    
                    html += `
                        <a href="${item.href}" class="g4-nav-item ${isActive ? 'active' : ''}">
                            <i class="ph ${mapping.icon}"></i>
                            <span>${mapping.label}</span>
                        </a>
                    `;
                });
            }
            
            return html;
        }

        /**
         * Create sidebar with fallback (emergency method)
         */
        createSidebarWithFallback() {
            this.log('Creating sidebar with fallback navigation...');
            this.navigationItems = [];
            this.createSidebar();
        }

        /**
         * Check if on home page
         */
        isHomePage() {
            return window.location.pathname.includes('/home') || 
                   window.location.pathname.endsWith('/portal/') ||
                   $('#content').find('.quick-nav-home').length > 0;
        }

        /**
         * Fix dashboard layout
         */
        fixDashboard() {
            this.log('Fixing dashboard layout...');
            
            // Remove any existing custom dashboard elements
            $('.g4-dashboard-metrics').remove();
            
            // Create simple metric cards
            const metricsHTML = `
                <div class="g4-dashboard-metrics">
                    <div class="g4-metric-card">
                        <div class="g4-metric-label">Active Calls</div>
                        <div class="g4-metric-value">--</div>
                        <div class="g4-metric-icon"><i class="ph ph-phone"></i></div>
                    </div>
                    <div class="g4-metric-card">
                        <div class="g4-metric-label">Total Users</div>
                        <div class="g4-metric-value">--</div>
                        <div class="g4-metric-icon"><i class="ph ph-users"></i></div>
                    </div>
                    <div class="g4-metric-card">
                        <div class="g4-metric-label">Devices Online</div>
                        <div class="g4-metric-value">--</div>
                        <div class="g4-metric-icon"><i class="ph ph-devices"></i></div>
                    </div>
                    <div class="g4-metric-card">
                        <div class="g4-metric-label">Queue Calls</div>
                        <div class="g4-metric-value">--</div>
                        <div class="g4-metric-icon"><i class="ph ph-headphones"></i></div>
                    </div>
                </div>
            `;
            
            // Find the best place to insert
            const $content = $('#content');
            if ($content.length) {
                // Insert after page title or at the beginning
                const $pageTitle = $content.find('h2, h3, .page-header').first();
                if ($pageTitle.length) {
                    $pageTitle.after(metricsHTML);
                } else {
                    $content.prepend(metricsHTML);
                }
            }
        }

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Sidebar toggle
            $(document).off('click.g4portal').on('click.g4portal', '#g4-sidebar-toggle', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
            
            // Keyboard shortcuts
            $(document).off('keydown.g4portal').on('keydown.g4portal', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                    e.preventDefault();
                    this.toggleSidebar();
                }
            });
        }

        /**
         * Toggle sidebar
         */
        toggleSidebar() {
            this.sidebarExpanded = !this.sidebarExpanded;
            const $sidebar = $('#g4-sidebar');
            const $wrapper = $('.wrapper');
            
            if (this.sidebarExpanded) {
                $sidebar.addClass('expanded');
                $wrapper.addClass('sidebar-expanded');
            } else {
                $sidebar.removeClass('expanded');
                $wrapper.removeClass('sidebar-expanded');
            }
            
            this.saveSidebarState();
        }

        /**
         * Save sidebar state
         */
        saveSidebarState() {
            try {
                localStorage.setItem(G4Config.sidebarStorageKey, this.sidebarExpanded.toString());
            } catch (e) {
                // Ignore
            }
        }

        /**
         * Get saved sidebar state
         */
        getSavedSidebarState() {
            try {
                return localStorage.getItem(G4Config.sidebarStorageKey) === 'true';
            } catch (e) {
                return false;
            }
        }

        /**
         * Add custom styles
         */
        addCustomStyles() {
            const styles = `
                <style id="g4-dynamic-styles">
                    /* Dashboard metric card styles */
                    .g4-dashboard-metrics {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 1rem;
                        margin: 1.5rem 0;
                    }
                    
                    .g4-metric-card {
                        flex: 1 1 250px;
                        min-width: 250px;
                        max-width: 300px;
                        padding: 1.5rem;
                        background: var(--g4-surface);
                        border: 1px solid var(--g4-border);
                        border-radius: var(--radius-lg);
                        position: relative;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .g4-metric-label {
                        font-size: 0.875rem;
                        color: var(--g4-text-muted);
                        margin-bottom: 0.5rem;
                    }
                    
                    .g4-metric-value {
                        font-size: 2rem;
                        font-weight: 700;
                        color: var(--g4-text);
                        margin-bottom: 0.5rem;
                    }
                    
                    .g4-metric-icon {
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        width: 48px;
                        height: 48px;
                        background: rgba(29, 161, 242, 0.1);
                        border-radius: var(--radius);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .g4-metric-icon i {
                        font-size: 1.5rem;
                        color: var(--g4-primary);
                    }
                    
                    /* Responsive */
                    @media (max-width: 768px) {
                        .g4-dashboard-metrics {
                            flex-direction: column;
                        }
                        
                        .g4-metric-card {
                            max-width: 100%;
                        }
                    }
                </style>
            `;
            
            if (!$('#g4-dynamic-styles').length) {
                $('head').append(styles);
            }
        }
    }

    // Initialize when ready
    $(document).ready(function() {
        // Only initialize once
        if (!window.Grid4Portal) {
            window.Grid4Portal = new Grid4Portal();
            window.g4 = window.Grid4Portal;
        }
    });

})(typeof jQuery !== 'undefined' ? jQuery : null);