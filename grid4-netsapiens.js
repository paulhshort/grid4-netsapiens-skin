/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * AGGRESSIVE OVERRIDE VERSION 1.0.9
 * Author: Grid4 Communications
 * 
 * NUCLEAR OPTION - OVERRIDE EVERYTHING:
 * - Aggressively remove ALL competing sidebars and scripts
 * - Force complete DOM cleanup before creating our sidebar
 * - Override any server-side navigation injection
 * - Stop ALL competing initialization scripts
 */

(function($) {
    'use strict';

    console.log('🚀 Grid4 Portal v1.0.9 - AGGRESSIVE OVERRIDE MODE');
    console.log('⚠️ This script will forcefully override ALL existing navigation');

    // Admin navigation that should replace everything
    const ADMIN_NAVIGATION = [
        { href: '/portal/home', icon: 'ph-house', label: 'Home', controller: 'home' },
        { href: '/portal/resellers', icon: 'ph-storefront', label: 'Resellers', controller: 'resellers' },
        { href: '/portal/domains', icon: 'ph-globe', label: 'Domains', controller: 'domains' },
        { href: '/portal/siptrunks', icon: 'ph-server', label: 'SIP Trunks', controller: 'siptrunks' },
        { href: '/portal/routeprofiles', icon: 'ph-map-pin', label: 'Route Profiles', controller: 'routeprofiles' },
        { href: '/portal/inventory', icon: 'ph-devices', label: 'Inventory', controller: 'inventory' },
        { href: '/portal/callhistory', icon: 'ph-phone', label: 'Call History', controller: 'callhistory' },
        { href: '/portal/uiconfigs', icon: 'ph-gear', label: 'Platform Settings', controller: 'uiconfigs' },
        { href: '/portal/users', icon: 'ph-users', label: 'Users', controller: 'users' },
        { href: '/portal/callqueues', icon: 'ph-headphones', label: 'Call Queues', controller: 'callqueues' },
        { href: '/portal/attendants', icon: 'ph-squares-four', label: 'Auto Attendants', controller: 'attendants' },
        { href: '/portal/conferences', icon: 'ph-video-camera', label: 'Conference Rooms', controller: 'conferences' }
    ];

    function nuclearCleanup() {
        console.log('💣 NUCLEAR CLEANUP - Removing ALL competing elements...');
        
        // Remove all existing sidebars with any possible selector
        $(
            '#g4-sidebar, .g4-sidebar, .sidebar, .nav-sidebar, .navigation-sidebar, ' +
            '.grid4-sidebar, .custom-sidebar, .portal-sidebar, .main-sidebar, ' +
            '[class*="sidebar"], [id*="sidebar"], [class*="nav"], [id*="nav"]'
        ).each(function() {
            const $element = $(this);
            // Only remove if it looks like navigation (has links)
            if ($element.find('a').length > 3) {
                console.log('🗑️ Removing competing sidebar:', this.className, this.id);
                $element.remove();
            }
        });

        // Remove dashboard widgets/graphs that are interfering
        $('.g4-dashboard-metrics, .dashboard-widget, .chart-container, .home-panel-main').remove();
        
        // Remove any custom styles that might interfere
        $('style[id*="g4"], style[id*="grid4"], style[id*="custom"]').remove();
        
        // Stop any competing initialization
        window.Grid4Portal = null;
        window.g4 = null;
        
        console.log('✅ Nuclear cleanup complete');
    }

    function forceCreateSidebar() {
        console.log('🔨 FORCE CREATING admin sidebar...');
        
        // Nuclear cleanup first
        nuclearCleanup();
        
        const currentPath = window.location.pathname;
        
        // Build navigation HTML
        let navHTML = '';
        ADMIN_NAVIGATION.forEach(item => {
            const isActive = currentPath.includes(item.controller) ? 'active' : '';
            navHTML += `
                <a href="${item.href}" class="g4-nav-item ${isActive}" style="
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    color: rgba(255,255,255,0.8);
                    text-decoration: none;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                ">
                    <i class="${item.icon}" style="margin-right: 12px; font-size: 18px;"></i>
                    <span>${item.label}</span>
                </a>
            `;
        });
        
        // Create sidebar with inline styles to prevent conflicts
        const sidebarHTML = `
            <div id="g4-sidebar-forced" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 280px;
                height: 100vh;
                background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
                z-index: 9999;
                overflow-y: auto;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            ">
                <div style="
                    padding: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <div style="display: flex; align-items: center;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: #3498db;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            margin-right: 12px;
                        ">G4</div>
                        <span style="color: white; font-weight: 600;">Grid4 CloudVoice</span>
                    </div>
                </div>
                <nav style="padding: 20px 0;">
                    ${navHTML}
                </nav>
            </div>
        `;
        
        // Force add to page
        $('body').prepend(sidebarHTML);
        
        // Force adjust main content
        if (!$('.wrapper').length) {
            $('body').wrapInner('<div class="wrapper"></div>');
        }
        
        $('.wrapper').css({
            'margin-left': '280px',
            'transition': 'margin-left 0.3s ease',
            'min-height': '100vh'
        });
        
        // Add hover effects with JavaScript since we're using inline styles
        $('.g4-nav-item').hover(
            function() {
                $(this).css({
                    'background-color': 'rgba(255,255,255,0.1)',
                    'border-left-color': '#3498db',
                    'color': 'white'
                });
            },
            function() {
                if (!$(this).hasClass('active')) {
                    $(this).css({
                        'background-color': 'transparent',
                        'border-left-color': 'transparent',
                        'color': 'rgba(255,255,255,0.8)'
                    });
                }
            }
        );
        
        // Style active item
        $('.g4-nav-item.active').css({
            'background-color': 'rgba(52, 152, 219, 0.2)',
            'border-left-color': '#3498db',
            'color': 'white'
        });
        
        console.log('✅ FORCED sidebar created with', ADMIN_NAVIGATION.length, 'admin items');
        console.log('📋 Admin navigation items:');
        ADMIN_NAVIGATION.forEach(item => {
            console.log(`  ✅ ${item.label} (${item.controller})`);
        });
    }

    function aggressiveInit() {
        console.log('🚀 Starting AGGRESSIVE initialization...');
        
        // Wait for DOM and any competing scripts to load
        setTimeout(function() {
            console.log('💥 Phase 1: Initial cleanup and sidebar creation');
            forceCreateSidebar();
            
            // Do it again after 2 seconds in case something else loaded
            setTimeout(function() {
                console.log('💥 Phase 2: Secondary enforcement');
                if (!$('#g4-sidebar-forced').length) {
                    console.log('⚠️ Sidebar was removed, forcing recreation...');
                    forceCreateSidebar();
                }
            }, 2000);
            
            // Final enforcement after 5 seconds
            setTimeout(function() {
                console.log('💥 Phase 3: Final enforcement');
                if (!$('#g4-sidebar-forced').length) {
                    console.log('⚠️ Sidebar missing again, final force...');
                    forceCreateSidebar();
                }
            }, 5000);
            
        }, 1500); // Wait for page to load
    }

    // Multiple initialization attempts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aggressiveInit);
    } else {
        aggressiveInit();
    }

    // Also try with jQuery ready
    if (typeof $ !== 'undefined') {
        $(document).ready(aggressiveInit);
    }

    // Final fallback
    window.addEventListener('load', function() {
        setTimeout(aggressiveInit, 1000);
    });

    console.log('✅ Grid4 Portal v1.0.9 AGGRESSIVE OVERRIDE loaded and ready');

})(typeof jQuery !== 'undefined' ? jQuery : window.jQuery || window.$);