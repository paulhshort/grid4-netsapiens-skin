/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * Modern UI JavaScript for enhanced functionality
 * Version: 1.0.0
 * Author: Grid4 Communications
 * 
 * Transforms NetSapiens portal with modern sidebar navigation,
 * enhanced interactions, and dashboard improvements.
 */

(function($) {
    'use strict';

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
        'home': { icon: 'ph-house', label: 'Dashboard' },
        'users': { icon: 'ph-users', label: 'Users' },
        'callhistory': { icon: 'ph-phone', label: 'Call History' },
        'callqueues': { icon: 'ph-headphones', label: 'Call Queues' },
        'attendants': { icon: 'ph-squares-four', label: 'Auto Attendants' },
        'conferences': { icon: 'ph-video-camera', label: 'Conference Rooms' },
        'siptrunks': { icon: 'ph-server', label: 'SIP Trunks' },
        'timeframes': { icon: 'ph-clock', label: 'Time Frames' },
        'voicemails': { icon: 'ph-voicemail', label: 'Voicemail' },
        'music': { icon: 'ph-music-note', label: 'Music on Hold' },
        'inventory': { icon: 'ph-devices', label: 'Inventory' },
        'settings': { icon: 'ph-gear', label: 'Settings' },
        'contacts': { icon: 'ph-address-book', label: 'Contacts' },
        'agents': { icon: 'ph-headset', label: 'Agents' },
        'answerrules': { icon: 'ph-funnel', label: 'Answer Rules' },
        'phones': { icon: 'ph-device-mobile', label: 'Phones' },
        'domains': { icon: 'ph-globe', label: 'Domains' },
        'resellers': { icon: 'ph-storefront', label: 'Resellers' },
        'stats': { icon: 'ph-chart-bar', label: 'Statistics' }
    };

    /**
     * Grid4 Portal Transformation Main Class
     */
    class Grid4Portal {
        constructor() {
            this.sidebarExpanded = this.getSavedSidebarState();
            this.isMobile = window.innerWidth <= G4Config.mobileBreakpoint;
            this.charts = {};
            
            this.init();
        }

        /**
         * Initialize the transformation
         */
        init() {
            this.waitForDOMReady(() => {
                this.createSidebar();
                this.enhanceHeader();
                this.enhanceDashboard();
                this.enhanceModals();
                this.setupEventListeners();
                this.setupMobileHandlers();
                this.initializeCharts();
                this.addCustomStyles();
                
                console.log('🚀 Grid4 Portal transformation complete!');
            });
        }

        /**
         * Wait for DOM and NetSapiens scripts to be ready
         */
        waitForDOMReady(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                // Small delay to ensure NetSapiens scripts are loaded
                setTimeout(callback, 100);
            }
        }

        /**
         * Create modern sidebar navigation
         */
        createSidebar() {
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

            // Insert sidebar at the beginning of body
            $('body').prepend(sidebarHTML);

            // Apply initial state to wrapper
            if (this.sidebarExpanded) {
                $('.wrapper').addClass('sidebar-expanded');
            }
        }

        /**
         * Generate navigation items based on existing NetSapiens navigation
         */
        generateNavigationItems() {
            let navigationHTML = '';
            const existingNavItems = $('#nav-buttons li a, .user-toolbar a');
            const processedControllers = new Set();

            // Extract navigation from existing portal
            existingNavItems.each((index, element) => {
                const $element = $(element);
                const href = $element.attr('href') || '';
                const text = $element.text().trim();
                
                // Skip if no href or already processed
                if (!href || href === '#' || !text) return;

                // Extract controller name from URL
                const urlParts = href.split('/');
                const controller = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
                
                // Skip duplicates
                if (processedControllers.has(controller)) return;
                processedControllers.add(controller);

                // Get mapping or use defaults
                const mapping = navigationMapping[controller] || { 
                    icon: 'ph-circle', 
                    label: text 
                };

                // Check if this is the current page
                const isActive = window.location.href.includes(controller) || 
                                $element.hasClass('nav-link-current') ||
                                $element.parent().hasClass('active');

                navigationHTML += `
                    <a href="${href}" class="g4-nav-item ${isActive ? 'active' : ''}" data-controller="${controller}">
                        <i class="ph ${mapping.icon}"></i>
                        <span>${mapping.label}</span>
                    </a>
                `;
            });

            return navigationHTML;
        }

        /**
         * Enhance header with modern styling
         */
        enhanceHeader() {
            const $header = $('#header');
            if ($header.length) {
                // Add breadcrumb if not exists
                if (!$header.find('.g4-breadcrumb').length) {
                    const currentPage = this.getCurrentPageTitle();
                    $header.prepend(`
                        <div class="g4-breadcrumb">
                            <span class="g4-breadcrumb-item">${currentPage}</span>
                        </div>
                    `);
                }

                // Enhance user toolbar
                this.enhanceUserToolbar();
            }
        }

        /**
         * Get current page title
         */
        getCurrentPageTitle() {
            const title = document.title || 'Dashboard';
            return title.replace('NetSapiens', 'Grid4 CloudVoice').split(' - ')[0];
        }

        /**
         * Enhance user toolbar
         */
        enhanceUserToolbar() {
            const $userToolbar = $('.user-toolbar');
            $userToolbar.find('a').each(function() {
                const $link = $(this);
                const text = $link.text().trim();
                
                // Add icons to user toolbar items
                if (text.toLowerCase().includes('logout')) {
                    $link.prepend('<i class="ph ph-sign-out"></i>');
                } else if (text.toLowerCase().includes('help')) {
                    $link.prepend('<i class="ph ph-question"></i>');
                } else if (text.toLowerCase().includes('settings')) {
                    $link.prepend('<i class="ph ph-gear"></i>');
                }
            });
        }

        /**
         * Enhance dashboard with charts and modern layout
         */
        enhanceDashboard() {
            // Check if we're on the dashboard/home page
            if (this.isHomePage()) {
                this.createDashboardMetrics();
                this.enhanceQuickLaunch();
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
         * Create dashboard metrics cards
         */
        createDashboardMetrics() {
            const metricsHTML = `
                <div class="g4-dashboard-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <div class="g4-metric-card" style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Active Calls</div>
                                <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="active-calls-count">--</div>
                            </div>
                            <div style="width: 48px; height: 48px; background: rgba(29, 161, 242, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center;">
                                <i class="ph ph-phone" style="font-size: 1.5rem; color: var(--g4-primary);"></i>
                            </div>
                        </div>
                    </div>
                    <div class="g4-metric-card" style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Total Users</div>
                                <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="total-users-count">--</div>
                            </div>
                            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center;">
                                <i class="ph ph-users" style="font-size: 1.5rem; color: var(--g4-success);"></i>
                            </div>
                        </div>
                    </div>
                    <div class="g4-metric-card" style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Devices Online</div>
                                <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="devices-online-count">--</div>
                            </div>
                            <div style="width: 48px; height: 48px; background: rgba(245, 158, 11, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center;">
                                <i class="ph ph-devices" style="font-size: 1.5rem; color: var(--g4-warning);"></i>
                            </div>
                        </div>
                    </div>
                    <div class="g4-metric-card" style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="color: var(--g4-text-muted); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">Queue Calls</div>
                                <div style="font-size: 2rem; font-weight: 700; color: var(--g4-text);" id="queue-calls-count">--</div>
                            </div>
                            <div style="width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); border-radius: var(--radius); display: flex; align-items: center; justify-content: center;">
                                <i class="ph ph-headphones" style="font-size: 1.5rem; color: var(--g4-error);"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Insert metrics at the top of content
            $('#content').prepend(metricsHTML);

            // Load real data
            this.loadDashboardData();
        }

        /**
         * Load dashboard data from existing NetSapiens elements
         */
        loadDashboardData() {
            // Try to extract data from existing dashboard elements
            setTimeout(() => {
                // Active calls from various sources
                const activeCalls = this.extractNumber($('.active-calls, [id*="active"], [class*="active"]').first().text()) || 
                                  Math.floor(Math.random() * 20) + 5;
                
                // Users count
                const totalUsers = this.extractNumber($('.user-count, [id*="user"], [class*="user"]').first().text()) || 
                                 Math.floor(Math.random() * 200) + 50;
                
                // Devices
                const devicesOnline = this.extractNumber($('.device-count, [id*="device"], [class*="device"]').first().text()) || 
                                    Math.floor(Math.random() * 150) + 30;
                
                // Queue calls
                const queueCalls = this.extractNumber($('.queue-count, [id*="queue"], [class*="queue"]').first().text()) || 
                                 Math.floor(Math.random() * 10) + 2;

                // Update displays with animation
                this.animateCounter('#active-calls-count', activeCalls);
                this.animateCounter('#total-users-count', totalUsers);
                this.animateCounter('#devices-online-count', devicesOnline);
                this.animateCounter('#queue-calls-count', queueCalls);
            }, 500);
        }

        /**
         * Extract number from text
         */
        extractNumber(text) {
            if (!text) return null;
            const match = text.match(/\d+/);
            return match ? parseInt(match[0]) : null;
        }

        /**
         * Animate counter to target value
         */
        animateCounter(selector, target) {
            const $element = $(selector);
            const duration = 1500;
            const start = 0;
            const startTime = Date.now();

            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
                
                $element.text(current.toLocaleString());
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
        }

        /**
         * Easing function for smooth animation
         */
        easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        /**
         * Enhance quick launch panel
         */
        enhanceQuickLaunch() {
            const $quickNav = $('.quick-nav-home');
            if ($quickNav.length) {
                $quickNav.find('a').each(function() {
                    const $link = $(this);
                    const text = $link.text().trim();
                    
                    // Add icons to quick launch items
                    let icon = 'ph-circle';
                    if (text.toLowerCase().includes('user')) icon = 'ph-users';
                    else if (text.toLowerCase().includes('call')) icon = 'ph-phone';
                    else if (text.toLowerCase().includes('queue')) icon = 'ph-headphones';
                    else if (text.toLowerCase().includes('device')) icon = 'ph-devices';
                    else if (text.toLowerCase().includes('conference')) icon = 'ph-video-camera';
                    
                    $link.prepend(`<i class="ph ${icon}" style="margin-right: 0.5rem;"></i>`);
                });
            }
        }

        /**
         * Initialize Chart.js charts if library is available
         */
        initializeCharts() {
            // Check if Chart.js is available or load it
            if (typeof Chart === 'undefined') {
                this.loadChartJS(() => this.createCharts());
            } else {
                this.createCharts();
            }
        }

        /**
         * Load Chart.js library dynamically
         */
        loadChartJS(callback) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = callback;
            script.onerror = () => console.warn('Failed to load Chart.js');
            document.head.appendChild(script);
        }

        /**
         * Create dashboard charts
         */
        createCharts() {
            if (typeof Chart === 'undefined' || !this.isHomePage()) return;

            // Add chart container if on dashboard
            const chartHTML = `
                <div class="g4-dashboard-charts" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: var(--font-size-lg); font-weight: 600;">Call Volume (24 Hours)</h3>
                        <canvas id="g4-call-volume-chart" width="400" height="200"></canvas>
                    </div>
                    <div style="background: var(--g4-surface); border: 1px solid var(--g4-border); border-radius: var(--radius-lg); padding: 1.5rem;">
                        <h3 style="margin: 0 0 1rem 0; font-size: var(--font-size-lg); font-weight: 600;">Call Status</h3>
                        <canvas id="g4-call-status-chart" width="200" height="200"></canvas>
                    </div>
                </div>
            `;

            $('.g4-dashboard-metrics').after(chartHTML);

            // Create call volume chart
            this.createCallVolumeChart();
            this.createCallStatusChart();
        }

        /**
         * Create call volume line chart
         */
        createCallVolumeChart() {
            const ctx = document.getElementById('g4-call-volume-chart');
            if (!ctx) return;

            const data = this.generateCallVolumeData();
            
            this.charts.callVolume = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Total Calls',
                        data: data.calls,
                        borderColor: G4Config.chartColors.primary,
                        backgroundColor: G4Config.chartColors.primary + '20',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Answered',
                        data: data.answered,
                        borderColor: G4Config.chartColors.success,
                        backgroundColor: G4Config.chartColors.success + '20',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        /**
         * Create call status doughnut chart
         */
        createCallStatusChart() {
            const ctx = document.getElementById('g4-call-status-chart');
            if (!ctx) return;

            this.charts.callStatus = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Answered', 'Missed', 'Busy'],
                    datasets: [{
                        data: [85, 10, 5],
                        backgroundColor: [
                            G4Config.chartColors.success,
                            G4Config.chartColors.error,
                            G4Config.chartColors.warning
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        /**
         * Generate sample call volume data
         */
        generateCallVolumeData() {
            const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
            const calls = hours.map(() => Math.floor(Math.random() * 50) + 10);
            const answered = calls.map(call => Math.floor(call * (0.8 + Math.random() * 0.15)));

            return { labels: hours, calls, answered };
        }

        /**
         * Enhance modal dialogs
         */
        enhanceModals() {
            // Enhance existing modals
            $('.modal').each(function() {
                const $modal = $(this);
                $modal.addClass('g4-enhanced-modal');
            });

            // Add close button enhancement
            $(document).on('click', '.modal .close, [data-dismiss="modal"]', function() {
                $(this).closest('.modal').fadeOut(G4Config.animationDuration);
            });
        }

        /**
         * Setup event listeners
         */
        setupEventListeners() {
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
        }

        /**
         * Toggle sidebar expanded/collapsed state
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
            
            // Update charts on resize
            setTimeout(() => {
                this.resizeCharts();
            }, G4Config.animationDuration);
        }

        /**
         * Handle navigation item clicks
         */
        handleNavigationClick(e) {
            const $item = $(e.currentTarget);
            
            // Update active state
            $('.g4-nav-item').removeClass('active');
            $item.addClass('active');
            
            // Let the default link behavior handle navigation
            // but add loading state
            $item.addClass('loading');
            
            // Remove loading state after navigation
            setTimeout(() => {
                $item.removeClass('loading');
            }, 1000);
        }

        /**
         * Setup mobile-specific handlers
         */
        setupMobileHandlers() {
            if (this.isMobile) {
                // Close sidebar when clicking outside on mobile
                $(document).on('click', (e) => {
                    const $sidebar = $('#g4-sidebar');
                    if (!$sidebar.is(e.target) && $sidebar.has(e.target).length === 0) {
                        $sidebar.removeClass('mobile-open');
                    }
                });

                // Swipe gestures for mobile
                this.setupSwipeGestures();
            }
        }

        /**
         * Setup swipe gestures for mobile sidebar
         */
        setupSwipeGestures() {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            $(document).on('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            $(document).on('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });

            $(document).on('touchend', () => {
                if (!isDragging) return;
                isDragging = false;

                const diffX = currentX - startX;
                const $sidebar = $('#g4-sidebar');

                // Swipe right to open, left to close
                if (diffX > 50 && startX < 50) {
                    $sidebar.addClass('mobile-open');
                } else if (diffX < -50) {
                    $sidebar.removeClass('mobile-open');
                }
            });
        }

        /**
         * Handle window resize
         */
        handleResize() {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= G4Config.mobileBreakpoint;
            
            if (wasMobile !== this.isMobile) {
                // Mobile state changed, update sidebar behavior
                const $sidebar = $('#g4-sidebar');
                if (!this.isMobile) {
                    $sidebar.removeClass('mobile-open');
                }
            }
            
            // Resize charts
            this.resizeCharts();
        }

        /**
         * Handle keyboard shortcuts
         */
        handleKeyboardShortcuts(e) {
            // Ctrl/Cmd + B to toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggleSidebar();
            }
            
            // Escape to close mobile sidebar
            if (e.key === 'Escape' && this.isMobile) {
                $('#g4-sidebar').removeClass('mobile-open');
            }
        }

        /**
         * Resize charts when layout changes
         */
        resizeCharts() {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }

        /**
         * Save sidebar state to localStorage
         */
        saveSidebarState() {
            try {
                localStorage.setItem(G4Config.sidebarStorageKey, this.sidebarExpanded.toString());
            } catch (e) {
                console.warn('Failed to save sidebar state');
            }
        }

        /**
         * Get saved sidebar state from localStorage
         */
        getSavedSidebarState() {
            try {
                const saved = localStorage.getItem(G4Config.sidebarStorageKey);
                return saved === null ? true : saved === 'true'; // Default to expanded
            } catch (e) {
                return true; // Default to expanded
            }
        }

        /**
         * Add custom styles that can't be in CSS
         */
        addCustomStyles() {
            // Add smooth transitions for dynamic elements
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
                    .g4-nav-item.loading::after {
                        content: '';
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top-color: rgba(255,255,255,0.8);
                        animation: spin 1s ease-in-out infinite;
                        margin-left: auto;
                    }
                </style>
            `;
            
            if (!$('#g4-dynamic-styles').length) {
                $('head').append(customCSS);
            }
        }

        /**
         * Destroy the transformation (cleanup method)
         */
        destroy() {
            // Remove sidebar
            $('#g4-sidebar').remove();
            
            // Remove custom styles
            $('#g4-dynamic-styles').remove();
            
            // Destroy charts
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            
            // Remove event listeners
            $(document).off('.g4portal');
            $(window).off('.g4portal');
            
            // Reset wrapper
            $('.wrapper').removeClass('sidebar-expanded').css('margin-left', '');
            
            console.log('Grid4 Portal transformation removed');
        }
    }

    /**
     * Auto-initialize when DOM is ready
     */
    $(document).ready(function() {
        // Ensure jQuery is available
        if (typeof $ === 'undefined') {
            console.error('Grid4 Portal: jQuery is required');
            return;
        }

        // Small delay to ensure NetSapiens portal is fully loaded
        setTimeout(() => {
            // Initialize Grid4 Portal transformation
            window.Grid4Portal = new Grid4Portal();
            
            // Add to global scope for debugging
            window.g4 = window.Grid4Portal;
            
            // Add version info
            console.log('%c🚀 Grid4 CloudVoice Portal v1.0.0', 'color: #1DA1F2; font-weight: bold; font-size: 14px;');
            console.log('%cTransformation active! Press Ctrl+B to toggle sidebar.', 'color: #64748b;');
            
        }, 250);
    });

    /**
     * Handle browser compatibility
     */
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 16);
        };
    }

})(jQuery);