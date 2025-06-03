/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * Modern UI JavaScript for enhanced functionality
 * Version: 1.0.7
 * Author: Grid4 Communications
 * 
 * MAJOR FIX v1.0.7:
 * - Completely override server-side rendered Grid4 sidebar
 * - Force proper admin navigation from Apps dropdown regardless of existing UI
 * - Ignore all existing navigation and build from scratch
 * - Fixed root cause: NetSapiens UI config was injecting custom nav server-side
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
            this.log('🚀 Grid4 Portal v1.0.7 - Initializing...');
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
                'Page content': $('#content').length > 0 || $('.wrapper').length > 0
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
            // Remove ALL existing sidebars (including pre-injected ones)
            $('#g4-sidebar').remove();
            $('.g4-sidebar').remove();
            
            // Remove any pre-existing navigation that might interfere
            $('.g4-nav-item').remove();
            
            // Clean up our additions
            $('.g4-dashboard-metrics').remove();
            $('.g4-dashboard-charts').remove();
            $('#g4-dynamic-styles').remove();
            $('body').removeClass('g4-transformed');
            
            // Remove any wrapper margin adjustments
            $('.wrapper').removeClass('sidebar-expanded').css('margin-left', '');
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
         * Extract navigation from NetSapiens portal - FORCED OVERRIDE
         */
        extractNetSapiensNavigation() {
            this.log('🔍 FORCING extraction of REAL NetSapiens admin navigation...');
            this.log('⚠️ IGNORING existing server-side rendered navigation');
            this.navigationItems = [];
            
            // Step 1: Look for Apps dropdown in header (this contains the REAL admin navigation)
            let foundRealNavigation = false;
            
            // Look for Apps dropdown more aggressively
            const $appsButton = $('a').filter(function() {
                const text = $(this).text().toLowerCase().trim();
                return text === 'apps' || text.includes('apps') || 
                       $(this).hasClass('dropdown-toggle') && $(this).next('.dropdown-menu').length > 0;
            });
            
            this.log(`Found ${$appsButton.length} potential Apps buttons`);
            
            $appsButton.each((i, btn) => {
                const $btn = $(btn);
                const $dropdown = $btn.next('.dropdown-menu').length ? 
                                $btn.next('.dropdown-menu') : 
                                $btn.parent().find('.dropdown-menu');
                
                this.log(`  Apps button ${i}: "${$btn.text().trim()}", dropdown found: ${$dropdown.length > 0}`);
                
                if ($dropdown.length) {
                    const links = $dropdown.find('a');
                    this.log(`    Found ${links.length} links in dropdown`);
                    
                    links.each((j, link) => {
                        const $link = $(link);
                        const href = $link.attr('href');
                        const text = $link.text().trim();
                        
                        this.log(`      Link ${j}: "${text}" -> ${href}`);
                        
                        if (href && text && href.includes('/portal/')) {
                            const match = href.match(/\/portal\/([^\/\?]+)/);
                            if (match) {
                                const controller = match[1];
                                
                                // This is REAL admin navigation - add ALL portal controllers except user stuff
                                const skipControllers = ['login', 'logout', 'help', 'profile', 'home'];
                                
                                if (!skipControllers.includes(controller) && 
                                    !this.navigationItems.find(item => item.controller === controller)) {
                                    
                                    this.navigationItems.push({
                                        controller: controller,
                                        href: href,
                                        text: text,
                                        source: 'real-apps-dropdown'
                                    });
                                    
                                    this.log(`        ✅ REAL ADMIN NAV: ${text} (${controller})`);
                                    foundRealNavigation = true;
                                }
                            }
                        }
                    });
                }
            });
            
            // Step 2: If we still don't have enough, scan ALL dropdowns more aggressively
            if (this.navigationItems.length < 3) {
                this.log('🔍 Not enough items found, scanning ALL header dropdowns...');
                
                $('.dropdown-menu').each((i, dropdown) => {
                    const $dropdown = $(dropdown);
                    const links = $dropdown.find('a[href*="/portal/"]');
                    
                    if (links.length > 0) {
                        this.log(`  Dropdown ${i} has ${links.length} portal links`);
                        
                        links.each((j, link) => {
                            const $link = $(link);
                            const href = $link.attr('href');
                            const text = $link.text().trim();
                            
                            if (href && text) {
                                const match = href.match(/\/portal\/([^\/\?]+)/);
                                if (match) {
                                    const controller = match[1];
                                    
                                    // Accept ANY portal controller that looks administrative
                                    const adminControllers = ['resellers', 'domains', 'siptrunks', 'routeprofiles', 
                                                            'inventory', 'callhistory', 'uiconfigs', 'users',
                                                            'callqueues', 'attendants', 'conferences', 'phones',
                                                            'timeframes', 'music', 'answerrules', 'agents',
                                                            'stats', 'reports', 'cdrschedule', 'billing'];
                                    
                                    if (adminControllers.includes(controller) && 
                                        !this.navigationItems.find(item => item.controller === controller)) {
                                        
                                        this.navigationItems.push({
                                            controller: controller,
                                            href: href,
                                            text: text,
                                            source: 'header-dropdown-scan'
                                        });
                                        
                                        this.log(`    ✅ Found admin nav: ${text} (${controller})`);
                                    }
                                }
                            }
                        });
                    }
                });
            }
            
            // Step 3: Last resort - use hardcoded admin navigation if we found nothing
            if (this.navigationItems.length === 0) {
                this.log('⚠️ NO NAVIGATION FOUND - Using hardcoded admin navigation');
                
                const hardcodedAdmin = [
                    { controller: 'resellers', href: '/portal/resellers', text: 'Resellers' },
                    { controller: 'domains', href: '/portal/domains', text: 'Domains' },
                    { controller: 'siptrunks', href: '/portal/siptrunks', text: 'SIP Trunks' },
                    { controller: 'routeprofiles', href: '/portal/routeprofiles', text: 'Route Profiles' },
                    { controller: 'inventory', href: '/portal/inventory', text: 'Inventory' },
                    { controller: 'callhistory', href: '/portal/callhistory', text: 'Call History' },
                    { controller: 'uiconfigs', href: '/portal/uiconfigs', text: 'Platform Settings' },
                    { controller: 'users', href: '/portal/users', text: 'Users' },
                    { controller: 'callqueues', href: '/portal/callqueues', text: 'Call Queues' },
                    { controller: 'attendants', href: '/portal/attendants', text: 'Auto Attendants' },
                    { controller: 'conferences', href: '/portal/conferences', text: 'Conference Rooms' }
                ];
                
                this.navigationItems = hardcodedAdmin.map(item => ({ ...item, source: 'hardcoded-admin' }));
            }
            
            this.log(`🎯 FINAL RESULT: Found ${this.navigationItems.length} REAL admin navigation items`);
            this.log('📋 Navigation items summary:');
            this.navigationItems.forEach(item => {
                this.log(`  - ${item.text} (${item.controller}) from ${item.source}`);
            });
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
            
            // Find existing NetSapiens dashboard widgets
            const $dashboardPanels = $('.home-panel-main, .panel').filter(function() {
                const $this = $(this);
                const text = $this.text();
                return text.includes('Active Calls') || text.includes('Total Users') || 
                       text.includes('Devices Online') || text.includes('Queue Calls');
            });
            
            if ($dashboardPanels.length > 0) {
                this.log(`Found ${$dashboardPanels.length} dashboard panels to transform`);
                
                // Extract values from existing panels
                let metrics = {
                    activeCalls: this.extractMetricValue($dashboardPanels, 'Active Calls'),
                    totalUsers: this.extractMetricValue($dashboardPanels, 'Total Users'),
                    devicesOnline: this.extractMetricValue($dashboardPanels, 'Devices Online'),
                    queueCalls: this.extractMetricValue($dashboardPanels, 'Queue Calls')
                };
                
                // Hide original panels
                $dashboardPanels.hide();
                
                // Create enhanced metric cards with extracted values
                const metricsHTML = `
                    <div class="g4-dashboard-metrics" style="margin-bottom: 2rem;">
                        <div class="g4-metric-card">
                            <div class="g4-metric-label">Active Calls</div>
                            <div class="g4-metric-value">${metrics.activeCalls}</div>
                            <div class="g4-metric-icon"><i class="ph ph-phone"></i></div>
                        </div>
                        <div class="g4-metric-card">
                            <div class="g4-metric-label">Total Users</div>
                            <div class="g4-metric-value">${metrics.totalUsers}</div>
                            <div class="g4-metric-icon"><i class="ph ph-users"></i></div>
                        </div>
                        <div class="g4-metric-card">
                            <div class="g4-metric-label">Devices Online</div>
                            <div class="g4-metric-value">${metrics.devicesOnline}</div>
                            <div class="g4-metric-icon"><i class="ph ph-devices"></i></div>
                        </div>
                        <div class="g4-metric-card">
                            <div class="g4-metric-label">Queue Calls</div>
                            <div class="g4-metric-value">${metrics.queueCalls}</div>
                            <div class="g4-metric-icon"><i class="ph ph-headphones"></i></div>
                        </div>
                    </div>
                `;
                
                // Insert at the beginning of content area
                const $content = $('#content');
                if ($content.length) {
                    // Find the first panel and insert before it
                    const $firstPanel = $content.find('.home-panel-main, .panel').first();
                    if ($firstPanel.length) {
                        $firstPanel.before(metricsHTML);
                    } else {
                        $content.prepend(metricsHTML);
                    }
                }
            }
        }
        
        /**
         * Extract metric value from panels
         */
        extractMetricValue($panels, metricName) {
            let value = '--';
            $panels.each(function() {
                const $panel = $(this);
                const text = $panel.text();
                if (text.includes(metricName)) {
                    // Try to find a number in the panel
                    const matches = text.match(/\d+/);
                    if (matches) {
                        value = matches[0];
                        return false; // break the loop
                    }
                }
            });
            return value;
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
        // Wait a bit for any other scripts to load
        setTimeout(function() {
            // Remove any pre-existing sidebars first
            $('#g4-sidebar').remove();
            $('.g4-sidebar').remove();
            
            // Only initialize once
            if (!window.Grid4Portal) {
                window.Grid4Portal = new Grid4Portal();
                window.g4 = window.Grid4Portal;
            }
        }, 100);
    });

})(typeof jQuery !== 'undefined' ? jQuery : null);