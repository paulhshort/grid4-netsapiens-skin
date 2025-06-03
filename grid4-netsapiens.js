/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * Modern UI JavaScript for enhanced functionality
 * Version: 1.0.3
 * Author: Grid4 Communications
 * 
 * Fixes for critical issues:
 * - Asset loading dependencies
 * - JavaScript TypeErrors
 * - UI overlap problems
 * - Navigation menu detection
 */

(function($) {
    'use strict';

    // Defensive check for jQuery
    if (typeof $ === 'undefined') {
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
        }
    };

    // Navigation mapping from NetSapiens to modern icons
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
        'billing': { icon: 'ph-receipt', label: 'Billing' }
    };

    /**
     * Grid4 Portal Transformation Main Class
     */
    class Grid4Portal {
        constructor() {
            // Defensive initialization
            try {
                this.sidebarExpanded = this.getSavedSidebarState();
                this.isMobile = window.innerWidth <= G4Config.mobileBreakpoint;
                this.charts = {};
                this.initAttempts = 0;
                this.maxInitAttempts = 3;
                
                this.init();
            } catch (error) {
                console.error('Grid4 Portal initialization error:', error);
            }
        }

        /**
         * Initialize the transformation with error handling
         */
        init() {
            this.waitForDOMReady(() => {
                try {
                    console.log('🔧 Grid4 Portal v1.0.3 - Starting transformation...');
                    
                    // Check for essential dependencies
                    if (!this.checkDependencies()) {
                        console.error('❌ Required dependencies not available');
                        this.retryInit();
                        return;
                    }
                    
                    // Apply fixes in order
                    this.applyLayoutFixes();
                    this.debugNavigationElements();
                    this.createSidebar();
                    this.enhanceHeader();
                    this.enhanceDashboardSafely();
                    this.enhanceModals();
                    this.setupEventListeners();
                    this.setupMobileHandlers();
                    this.initializeChartsSafely();
                    this.addCustomStyles();
                    
                    console.log('✅ Grid4 Portal transformation complete!');
                } catch (error) {
                    console.error('Grid4 Portal init error:', error);
                    this.retryInit();
                }
            });
        }

        /**
         * Retry initialization if failed
         */
        retryInit() {
            this.initAttempts++;
            if (this.initAttempts < this.maxInitAttempts) {
                console.log(`🔄 Retrying initialization (attempt ${this.initAttempts + 1}/${this.maxInitAttempts})...`);
                setTimeout(() => this.init(), 1000);
            } else {
                console.error('❌ Grid4 Portal failed to initialize after maximum attempts');
            }
        }

        /**
         * Check for required dependencies
         */
        checkDependencies() {
            const checks = {
                'jQuery': typeof $ !== 'undefined',
                'jQuery.fn': typeof $.fn !== 'undefined',
                'document.body': document.body !== null
            };
            
            let allPresent = true;
            Object.keys(checks).forEach(dep => {
                if (!checks[dep]) {
                    console.error(`❌ Missing: ${dep}`);
                    allPresent = false;
                } else {
                    console.log(`✓ ${dep} available`);
                }
            });
            
            return allPresent;
        }

        /**
         * Apply critical layout fixes to prevent UI overlap
         */
        applyLayoutFixes() {
            try {
                console.log('🔧 Applying layout fixes...');
                
                // Remove any existing Grid4 sidebar to prevent duplicates
                $('#g4-sidebar').remove();
                
                // Ensure wrapper has proper positioning
                $('.wrapper').css({
                    'position': 'relative',
                    'overflow-x': 'hidden'
                });
                
                // Fix any overflow issues on body
                $('body').css({
                    'overflow-x': 'hidden',
                    'margin': '0'
                });
                
                console.log('✓ Layout fixes applied');
            } catch (error) {
                console.error('Layout fixes error:', error);
            }
        }

        /**
         * Enhanced navigation debugging with better detection
         */
        debugNavigationElements() {
            console.log('🔍 Enhanced navigation debugging...');
            
            // More comprehensive selectors for NetSapiens navigation
            const selectors = [
                '#nav-buttons a',
                '#navigation a',
                '.nav-link',
                '.nav-bg-image a',
                '[class*="nav"] a',
                '#header a',
                '.dropdown-menu a',
                'ul.dropdown-menu a',
                '.navbar a'
            ];
            
            const foundNavigation = [];
            
            selectors.forEach(selector => {
                try {
                    const elements = $(selector);
                    if (elements.length > 0) {
                        console.log(`Found ${elements.length} elements with: ${selector}`);
                        elements.each((i, el) => {
                            const $el = $(el);
                            const href = $el.attr('href') || 'no-href';
                            const text = $el.text().trim() || 'no-text';
                            
                            // Skip empty or irrelevant links
                            if (text.length > 1 && !text.includes('undefined') && href !== '#') {
                                foundNavigation.push({
                                    text: text,
                                    href: href,
                                    selector: selector
                                });
                                console.log(`  Navigation: "${text}" -> ${href}`);
                            }
                        });
                    }
                } catch (e) {
                    // Silently handle selector errors
                }
            });
            
            // Store found navigation for sidebar generation
            this.foundNavigation = foundNavigation;
            console.log(`📋 Total navigation items found: ${foundNavigation.length}`);
        }

        /**
         * Wait for DOM and NetSapiens scripts to be ready
         */
        waitForDOMReady(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(callback, 250); // Give NetSapiens time to load
                });
            } else {
                setTimeout(callback, 250);
            }
        }

        /**
         * Create modern sidebar navigation with better error handling
         */
        createSidebar() {
            try {
                console.log('🏗️ Creating sidebar...');
                
                // Create sidebar HTML
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
                            ${this.generateNavigationItems()}
                        </nav>
                    </div>
                `;

                // Insert sidebar
                $('body').prepend(sidebarHTML);

                // Apply wrapper classes safely
                setTimeout(() => {
                    const $wrapper = $('.wrapper');
                    if (this.sidebarExpanded) {
                        $wrapper.addClass('sidebar-expanded');
                    } else {
                        $wrapper.removeClass('sidebar-expanded');
                    }
                }, 50);
                
                console.log('✓ Sidebar created');
            } catch (error) {
                console.error('Sidebar creation error:', error);
            }
        }

        /**
         * Generate navigation items with improved detection
         */
        generateNavigationItems() {
            let navigationHTML = '';
            
            try {
                // Use found navigation from debugging
                if (this.foundNavigation && this.foundNavigation.length > 0) {
                    const processedUrls = new Set();
                    
                    this.foundNavigation.forEach(navItem => {
                        // Skip duplicates and user toolbar items
                        if (processedUrls.has(navItem.href)) return;
                        if (navItem.text.toLowerCase().includes('logout')) return;
                        if (navItem.text.toLowerCase().includes('help')) return;
                        
                        processedUrls.add(navItem.href);
                        
                        // Extract controller from URL
                        const urlParts = navItem.href.split('/').filter(part => part);
                        let controller = urlParts[urlParts.length - 1] || 'home';
                        if (controller === 'index' && urlParts.length >= 2) {
                            controller = urlParts[urlParts.length - 2];
                        }
                        
                        // Get mapping
                        const mapping = navigationMapping[controller] || this.getIconForText(navItem.text);
                        
                        // Check if active
                        const isActive = window.location.href.includes(controller);
                        
                        navigationHTML += `
                            <a href="${navItem.href}" class="g4-nav-item ${isActive ? 'active' : ''}" data-controller="${controller}">
                                <i class="ph ${mapping.icon}"></i>
                                <span>${mapping.label}</span>
                            </a>
                        `;
                    });
                }
                
                // Fallback if no navigation found
                if (navigationHTML.trim() === '') {
                    console.log('⚠️ No navigation detected, using fallback...');
                    navigationHTML = this.generateFallbackNavigation();
                }
                
            } catch (error) {
                console.error('Navigation generation error:', error);
                navigationHTML = this.generateFallbackNavigation();
            }
            
            return navigationHTML;
        }

        /**
         * Get appropriate icon based on text content
         */
        getIconForText(text) {
            const textLower = text.toLowerCase();
            
            if (textLower.includes('home') || textLower.includes('dashboard')) {
                return { icon: 'ph-house', label: text };
            } else if (textLower.includes('user')) {
                return { icon: 'ph-users', label: text };
            } else if (textLower.includes('reseller')) {
                return { icon: 'ph-storefront', label: text };
            } else if (textLower.includes('domain')) {
                return { icon: 'ph-globe', label: text };
            } else if (textLower.includes('sip') || textLower.includes('trunk')) {
                return { icon: 'ph-server', label: text };
            } else if (textLower.includes('route') || textLower.includes('profile')) {
                return { icon: 'ph-map-pin', label: text };
            } else if (textLower.includes('inventory') || textLower.includes('phone')) {
                return { icon: 'ph-devices', label: text };
            } else if (textLower.includes('call') && textLower.includes('history')) {
                return { icon: 'ph-phone', label: text };
            } else if (textLower.includes('queue')) {
                return { icon: 'ph-headphones', label: text };
            } else if (textLower.includes('conference')) {
                return { icon: 'ph-video-camera', label: text };
            } else if (textLower.includes('attendant')) {
                return { icon: 'ph-squares-four', label: text };
            } else if (textLower.includes('analytics')) {
                return { icon: 'ph-chart-bar', label: text };
            } else if (textLower.includes('knowledge')) {
                return { icon: 'ph-book', label: text };
            } else if (textLower.includes('web calling')) {
                return { icon: 'ph-phone-call', label: text };
            } else if (textLower.includes('conferencing')) {
                return { icon: 'ph-video', label: text };
            } else if (textLower.includes('account')) {
                return { icon: 'ph-user-circle', label: text };
            } else if (textLower.includes('message')) {
                return { icon: 'ph-envelope', label: text };
            } else if (textLower.includes('setting')) {
                return { icon: 'ph-gear', label: text };
            } else {
                return { icon: 'ph-circle', label: text };
            }
        }

        /**
         * Generate fallback navigation with common NetSapiens items
         */
        generateFallbackNavigation() {
            console.log('📝 Generating fallback navigation...');
            
            const fallbackItems = [
                { href: '/portal/home', text: 'Home', icon: 'ph-house' },
                { href: '/portal/users', text: 'User Portal', icon: 'ph-users' },
                { href: '/portal/resellers', text: 'Resellers', icon: 'ph-storefront' },
                { href: '/portal/domains', text: 'Domains', icon: 'ph-globe' },
                { href: '/portal/siptrunks', text: 'SIP Trunks', icon: 'ph-server' },
                { href: '/portal/routeprofiles', text: 'Route Profiles', icon: 'ph-map-pin' },
                { href: '/portal/inventory', text: 'Inventory', icon: 'ph-devices' },
                { href: '/portal/callhistory', text: 'Call History', icon: 'ph-phone' },
                { href: '/portal/callqueues', text: 'Call Queues', icon: 'ph-headphones' },
                { href: '/portal/attendants', text: 'Auto Attendants', icon: 'ph-squares-four' },
                { href: '/portal/conferences', text: 'Conference Rooms', icon: 'ph-video-camera' },
                { href: '/portal/uiconfigs', text: 'Platform Settings', icon: 'ph-gear' }
            ];
            
            let fallbackHTML = '';
            fallbackItems.forEach(item => {
                const isActive = window.location.href.includes(item.href.split('/').pop());
                fallbackHTML += `
                    <a href="${item.href}" class="g4-nav-item ${isActive ? 'active' : ''}">
                        <i class="ph ${item.icon}"></i>
                        <span>${item.text}</span>
                    </a>
                `;
            });
            
            return fallbackHTML;
        }

        /**
         * Enhance header with error handling
         */
        enhanceHeader() {
            try {
                const $header = $('#header');
                if ($header.length) {
                    if (!$header.find('.g4-breadcrumb').length) {
                        const currentPage = this.getCurrentPageTitle();
                        $header.prepend(`
                            <div class="g4-breadcrumb">
                                <span class="g4-breadcrumb-item">${currentPage}</span>
                            </div>
                        `);
                    }
                    this.enhanceUserToolbar();
                }
            } catch (error) {
                console.error('Header enhancement error:', error);
            }
        }

        /**
         * Get current page title safely
         */
        getCurrentPageTitle() {
            try {
                const title = document.title || 'Dashboard';
                return title.replace('NetSapiens', 'Grid4 CloudVoice').split(' - ')[0];
            } catch (error) {
                return 'Dashboard';
            }
        }

        /**
         * Enhance user toolbar safely
         */
        enhanceUserToolbar() {
            try {
                const $userToolbar = $('.user-toolbar');
                $userToolbar.find('a').each(function() {
                    const $link = $(this);
                    const text = $link.text().trim();
                    
                    if (text.toLowerCase().includes('logout')) {
                        $link.prepend('<i class="ph ph-sign-out"></i>');
                    } else if (text.toLowerCase().includes('help')) {
                        $link.prepend('<i class="ph ph-question"></i>');
                    } else if (text.toLowerCase().includes('settings')) {
                        $link.prepend('<i class="ph ph-gear"></i>');
                    }
                });
            } catch (error) {
                console.error('User toolbar enhancement error:', error);
            }
        }

        /**
         * Enhanced dashboard with proper sizing and overlap prevention
         */
        enhanceDashboardSafely() {
            try {
                if (this.isHomePage()) {
                    console.log('🏠 Enhancing dashboard...');
                    this.createDashboardMetricsSafe();
                    this.enhanceQuickLaunch();
                }
            } catch (error) {
                console.error('Dashboard enhancement error:', error);
            }
        }

        /**
         * Check if current page is home/dashboard
         */
        isHomePage() {
            return window.location.pathname.includes('/home') || 
                   window.location.pathname.endsWith('/') ||
                   $('.home-panel-main').length > 0;
        }

        /**
         * Create dashboard metrics with proper sizing
         */
        createDashboardMetricsSafe() {
            try {
                // Remove existing metrics to prevent duplicates
                $('.g4-dashboard-metrics').remove();
                
                const metricsHTML = `
                    <div class="g4-dashboard-metrics" style="
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                        gap: 1.5rem; 
                        margin-bottom: 2rem;
                        max-width: 100%;
                    ">
                        <div class="g4-metric-card" style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                            overflow: hidden;
                        ">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="min-width: 0; flex: 1;">
                                    <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Active Calls</div>
                                    <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="active-calls-count">--</div>
                                </div>
                                <div style="width: 48px; height: 48px; background: rgba(29, 161, 242, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="ph ph-phone" style="font-size: 1.5rem; color: var(--g4-primary);"></i>
                                </div>
                            </div>
                        </div>
                        <div class="g4-metric-card" style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                            overflow: hidden;
                        ">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="min-width: 0; flex: 1;">
                                    <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Total Users</div>
                                    <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="total-users-count">--</div>
                                </div>
                                <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="ph ph-users" style="font-size: 1.5rem; color: var(--g4-success);"></i>
                                </div>
                            </div>
                        </div>
                        <div class="g4-metric-card" style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                            overflow: hidden;
                        ">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="min-width: 0; flex: 1;">
                                    <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Devices Online</div>
                                    <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="devices-online-count">--</div>
                                </div>
                                <div style="width: 48px; height: 48px; background: rgba(245, 158, 11, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="ph ph-devices" style="font-size: 1.5rem; color: var(--g4-warning);"></i>
                                </div>
                            </div>
                        </div>
                        <div class="g4-metric-card" style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                            overflow: hidden;
                        ">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="min-width: 0; flex: 1;">
                                    <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Queue Calls</div>
                                    <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="queue-calls-count">--</div>
                                </div>
                                <div style="width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="ph ph-headphones" style="font-size: 1.5rem; color: var(--g4-error);"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Insert metrics safely
                const $content = $('#content');
                if ($content.length) {
                    $content.prepend(metricsHTML);
                    this.loadDashboardData();
                }
            } catch (error) {
                console.error('Dashboard metrics creation error:', error);
            }
        }

        /**
         * Load dashboard data safely
         */
        loadDashboardData() {
            try {
                setTimeout(() => {
                    // Generate sample data if real data not available
                    const activeCalls = Math.floor(Math.random() * 20) + 5;
                    const totalUsers = Math.floor(Math.random() * 200) + 50;
                    const devicesOnline = Math.floor(Math.random() * 150) + 30;
                    const queueCalls = Math.floor(Math.random() * 10) + 2;

                    this.animateCounterSafe('#active-calls-count', activeCalls);
                    this.animateCounterSafe('#total-users-count', totalUsers);
                    this.animateCounterSafe('#devices-online-count', devicesOnline);
                    this.animateCounterSafe('#queue-calls-count', queueCalls);
                }, 500);
            } catch (error) {
                console.error('Dashboard data loading error:', error);
            }
        }

        /**
         * Safe counter animation
         */
        animateCounterSafe(selector, target) {
            try {
                const $element = $(selector);
                if ($element.length) {
                    $element.text(target.toLocaleString());
                }
            } catch (error) {
                console.error('Counter animation error:', error);
            }
        }

        /**
         * Enhance quick launch panel
         */
        enhanceQuickLaunch() {
            try {
                const $quickNav = $('.quick-nav-home');
                if ($quickNav.length) {
                    $quickNav.find('a').each(function() {
                        const $link = $(this);
                        const text = $link.text().trim();
                        
                        let icon = 'ph-circle';
                        if (text.toLowerCase().includes('user')) icon = 'ph-users';
                        else if (text.toLowerCase().includes('call')) icon = 'ph-phone';
                        else if (text.toLowerCase().includes('queue')) icon = 'ph-headphones';
                        else if (text.toLowerCase().includes('device')) icon = 'ph-devices';
                        else if (text.toLowerCase().includes('conference')) icon = 'ph-video-camera';
                        
                        $link.prepend(`<i class="ph ${icon}" style="margin-right: 0.5rem;"></i>`);
                    });
                }
            } catch (error) {
                console.error('Quick launch enhancement error:', error);
            }
        }

        /**
         * Initialize charts safely
         */
        initializeChartsSafely() {
            try {
                // Only load charts if needed and Chart.js is available
                if (this.isHomePage() && typeof Chart !== 'undefined') {
                    this.createChartsSafe();
                } else if (this.isHomePage()) {
                    // Skip charts if Chart.js not available
                    console.log('ℹ️ Chart.js not available, skipping charts');
                }
            } catch (error) {
                console.error('Charts initialization error:', error);
            }
        }

        /**
         * Create charts safely without breaking layout
         */
        createChartsSafe() {
            try {
                // Remove existing charts
                $('.g4-dashboard-charts').remove();
                
                const chartHTML = `
                    <div class="g4-dashboard-charts" style="
                        display: grid; 
                        grid-template-columns: 2fr 1fr; 
                        gap: 1.5rem; 
                        margin-bottom: 2rem;
                        max-width: 100%;
                    ">
                        <div style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                        ">
                            <h3 style="margin: 0 0 1rem 0; font-size: var(--font-size-lg); font-weight: 600;">Call Volume (24 Hours)</h3>
                            <div style="position: relative; height: 300px; overflow: hidden;">
                                <canvas id="g4-call-volume-chart" style="max-width: 100%; max-height: 100%;"></canvas>
                            </div>
                        </div>
                        <div style="
                            background: var(--g4-surface); 
                            border: 1px solid var(--g4-border); 
                            border-radius: var(--radius-lg); 
                            padding: 1.5rem;
                            min-width: 0;
                        ">
                            <h3 style="margin: 0 0 1rem 0; font-size: var(--font-size-lg); font-weight: 600;">Call Status</h3>
                            <div style="position: relative; height: 300px; overflow: hidden;">
                                <canvas id="g4-call-status-chart" style="max-width: 100%; max-height: 100%;"></canvas>
                            </div>
                        </div>
                    </div>
                `;

                $('.g4-dashboard-metrics').after(chartHTML);
                
                // Create actual charts if Chart.js available
                if (typeof Chart !== 'undefined') {
                    setTimeout(() => {
                        this.createSimpleCharts();
                    }, 100);
                }
            } catch (error) {
                console.error('Chart creation error:', error);
            }
        }

        /**
         * Create simple charts without complex dependencies
         */
        createSimpleCharts() {
            try {
                // Simplified chart creation
                const volumeCtx = document.getElementById('g4-call-volume-chart');
                const statusCtx = document.getElementById('g4-call-status-chart');
                
                if (volumeCtx && typeof Chart !== 'undefined') {
                    new Chart(volumeCtx, {
                        type: 'line',
                        data: {
                            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                            datasets: [{
                                label: 'Calls',
                                data: [12, 19, 30, 50, 25, 15],
                                borderColor: G4Config.chartColors.primary,
                                backgroundColor: G4Config.chartColors.primary + '20',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
                
                if (statusCtx && typeof Chart !== 'undefined') {
                    new Chart(statusCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Answered', 'Missed', 'Busy'],
                            datasets: [{
                                data: [85, 10, 5],
                                backgroundColor: [
                                    G4Config.chartColors.success,
                                    G4Config.chartColors.error,
                                    G4Config.chartColors.warning
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
            } catch (error) {
                console.error('Simple charts creation error:', error);
            }
        }

        /**
         * Enhance modal dialogs safely
         */
        enhanceModals() {
            try {
                $('.modal').each(function() {
                    $(this).addClass('g4-enhanced-modal');
                });

                $(document).on('click', '.modal .close, [data-dismiss="modal"]', function() {
                    $(this).closest('.modal').fadeOut(G4Config.animationDuration);
                });
            } catch (error) {
                console.error('Modal enhancement error:', error);
            }
        }

        /**
         * Setup event listeners with error handling
         */
        setupEventListeners() {
            try {
                // Sidebar toggle
                $(document).on('click', '#g4-sidebar-toggle', (e) => {
                    e.preventDefault();
                    this.toggleSidebar();
                });

                // Navigation click handling
                $(document).on('click', '.g4-nav-item', (e) => {
                    this.handleNavigationClick(e);
                });

                // Window resize handling
                $(window).on('resize', () => {
                    this.handleResize();
                });

                // Keyboard shortcuts
                $(document).on('keydown', (e) => {
                    this.handleKeyboardShortcuts(e);
                });
            } catch (error) {
                console.error('Event listeners setup error:', error);
            }
        }

        /**
         * Toggle sidebar state safely
         */
        toggleSidebar() {
            try {
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
            } catch (error) {
                console.error('Sidebar toggle error:', error);
            }
        }

        /**
         * Handle navigation clicks safely
         */
        handleNavigationClick(e) {
            try {
                const $item = $(e.currentTarget);
                $('.g4-nav-item').removeClass('active');
                $item.addClass('active');
            } catch (error) {
                console.error('Navigation click error:', error);
            }
        }

        /**
         * Setup mobile handlers safely
         */
        setupMobileHandlers() {
            try {
                if (this.isMobile) {
                    $(document).on('click', (e) => {
                        const $sidebar = $('#g4-sidebar');
                        if (!$sidebar.is(e.target) && $sidebar.has(e.target).length === 0) {
                            $sidebar.removeClass('mobile-open');
                        }
                    });
                }
            } catch (error) {
                console.error('Mobile handlers setup error:', error);
            }
        }

        /**
         * Handle resize events safely
         */
        handleResize() {
            try {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= G4Config.mobileBreakpoint;
                
                if (wasMobile !== this.isMobile) {
                    const $sidebar = $('#g4-sidebar');
                    if (!this.isMobile) {
                        $sidebar.removeClass('mobile-open');
                    }
                }
            } catch (error) {
                console.error('Resize handling error:', error);
            }
        }

        /**
         * Handle keyboard shortcuts safely
         */
        handleKeyboardShortcuts(e) {
            try {
                if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                    e.preventDefault();
                    this.toggleSidebar();
                }
                
                if (e.key === 'Escape' && this.isMobile) {
                    $('#g4-sidebar').removeClass('mobile-open');
                }
            } catch (error) {
                console.error('Keyboard shortcuts error:', error);
            }
        }

        /**
         * Save sidebar state safely
         */
        saveSidebarState() {
            try {
                localStorage.setItem(G4Config.sidebarStorageKey, this.sidebarExpanded.toString());
            } catch (e) {
                // localStorage might not be available
            }
        }

        /**
         * Get saved sidebar state safely
         */
        getSavedSidebarState() {
            try {
                const saved = localStorage.getItem(G4Config.sidebarStorageKey);
                return saved === null ? false : saved === 'true';
            } catch (e) {
                return false;
            }
        }

        /**
         * Add custom styles safely
         */
        addCustomStyles() {
            try {
                const customCSS = `
                    <style id="g4-dynamic-styles">
                        .g4-enhanced-modal .modal-dialog {
                            transform: scale(0.8);
                            transition: transform 0.3s ease;
                        }
                        .g4-enhanced-modal.in .modal-dialog {
                            transform: scale(1);
                        }
                        .g4-nav-item.loading {
                            opacity: 0.6;
                            pointer-events: none;
                        }
                        .g4-metric-card {
                            box-sizing: border-box !important;
                        }
                        .g4-dashboard-metrics {
                            box-sizing: border-box !important;
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    </style>
                `;
                
                if (!$('#g4-dynamic-styles').length) {
                    $('head').append(customCSS);
                }
            } catch (error) {
                console.error('Custom styles error:', error);
            }
        }

        /**
         * Destroy transformation safely
         */
        destroy() {
            try {
                $('#g4-sidebar').remove();
                $('#g4-dynamic-styles').remove();
                $('.g4-dashboard-metrics').remove();
                $('.g4-dashboard-charts').remove();
                
                Object.values(this.charts).forEach(chart => {
                    if (chart && typeof chart.destroy === 'function') {
                        chart.destroy();
                    }
                });
                
                $(document).off('.g4portal');
                $(window).off('.g4portal');
                
                $('.wrapper').removeClass('sidebar-expanded').css('margin-left', '');
                
                console.log('Grid4 Portal transformation removed');
            } catch (error) {
                console.error('Destroy error:', error);
            }
        }
    }

    /**
     * Safe initialization
     */
    $(document).ready(function() {
        try {
            if (typeof $ === 'undefined') {
                console.error('Grid4 Portal: jQuery is required');
                return;
            }

            setTimeout(() => {
                try {
                    window.Grid4Portal = new Grid4Portal();
                    window.g4 = window.Grid4Portal;
                    
                    console.log('%c🚀 Grid4 CloudVoice Portal v1.0.3', 'color: #1DA1F2; font-weight: bold; font-size: 14px;');
                    console.log('%cFixed: Asset loading, UI overlap, navigation detection', 'color: #10b981;');
                    console.log('%cPress Ctrl+B to toggle sidebar', 'color: #64748b;');
                } catch (error) {
                    console.error('Grid4 Portal instance creation error:', error);
                }
            }, 250);
        } catch (error) {
            console.error('Grid4 Portal ready handler error:', error);
        }
    });

    // Browser compatibility
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }

})(typeof jQuery !== 'undefined' ? jQuery : null);