/**
 * Grid4 CloudVoice - NetSapiens Portal Transformation
 * SIMPLIFIED VERSION 1.0.8
 * Author: Grid4 Communications
 * 
 * SIMPLIFIED APPROACH:
 * - Remove all complex navigation detection
 * - Force hardcoded admin navigation
 * - Remove dashboard transformation (causing conflicts)
 * - Focus only on fixing the navigation issue
 */

(function($) {
    'use strict';

    // Only proceed if jQuery is available
    if (typeof $ === 'undefined') {
        console.error('Grid4 Portal: jQuery not available');
        return;
    }

    console.log('🚀 Grid4 Portal v1.0.8 - SIMPLIFIED VERSION');

    // Simple admin navigation - what should be in the sidebar
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

    function createSimpleSidebar() {
        console.log('🔨 Creating simple admin sidebar...');
        
        // Remove any existing sidebars completely
        $('#g4-sidebar, .g4-sidebar').remove();
        
        // Get current page for active state
        const currentPath = window.location.pathname;
        
        // Build navigation HTML
        let navHTML = '';
        ADMIN_NAVIGATION.forEach(item => {
            const isActive = currentPath.includes(item.controller) ? 'active' : '';
            navHTML += `
                <a href="${item.href}" class="g4-nav-item ${isActive}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
        });
        
        // Create sidebar HTML
        const sidebarHTML = `
            <div class="g4-sidebar expanded" id="g4-sidebar">
                <div class="g4-sidebar-header">
                    <div class="g4-logo">
                        <div class="g4-logo-icon">G4</div>
                        <span class="g4-logo-text">Grid4 CloudVoice</span>
                    </div>
                    <button class="g4-sidebar-toggle" id="g4-sidebar-toggle">
                        <i class="ph ph-list"></i>
                    </button>
                </div>
                <nav class="g4-sidebar-nav">
                    ${navHTML}
                </nav>
            </div>
        `;
        
        // Add to page
        $('body').prepend(sidebarHTML);
        
        // Adjust wrapper margin
        if (!$('.wrapper').length) {
            $('body').wrapInner('<div class="wrapper"></div>');
        }
        $('.wrapper').css('margin-left', '280px');
        
        console.log('✅ Simple sidebar created with', ADMIN_NAVIGATION.length, 'admin items');
    }

    function setupToggle() {
        $(document).off('click.g4toggle').on('click.g4toggle', '#g4-sidebar-toggle', function(e) {
            e.preventDefault();
            const $sidebar = $('#g4-sidebar');
            const $wrapper = $('.wrapper');
            
            if ($sidebar.hasClass('expanded')) {
                $sidebar.removeClass('expanded');
                $wrapper.css('margin-left', '60px');
            } else {
                $sidebar.addClass('expanded');
                $wrapper.css('margin-left', '280px');
            }
        });
    }

    // Simple initialization
    function init() {
        console.log('🚀 Grid4 Portal v1.0.8 initializing...');
        
        // Wait for DOM to be ready
        $(document).ready(function() {
            setTimeout(function() {
                console.log('📍 Starting simple transformation...');
                
                try {
                    createSimpleSidebar();
                    setupToggle();
                    
                    console.log('✅ Simple transformation complete!');
                    console.log('📋 Navigation items created:');
                    ADMIN_NAVIGATION.forEach(item => {
                        console.log(`  - ${item.label} (${item.controller})`);
                    });
                    
                } catch (error) {
                    console.error('❌ Error in simple transformation:', error);
                }
            }, 1000); // Give page time to load
        });
    }

    // Start initialization
    init();

})(typeof jQuery !== 'undefined' ? jQuery : window.jQuery || window.$);