/* Grid4 Communications Custom NetSapiens Portal JavaScript */

(function() {
    'use strict';
    
    // Wait for jQuery to be available
    if (typeof $ === 'undefined' && typeof jQuery === 'undefined') {
        console.error('Grid4: jQuery is not available. Waiting for jQuery...');
        setTimeout(arguments.callee, 100);
        return;
    }
    
    // Use jQuery or $
    var $ = window.jQuery || window.$;
    
    // Configuration
    var CONFIG = {
        companyName: 'Grid4 Communications',
        brandColor: '#0099ff',
        logoUrl: '/images/grid4-logo.png', // Update with actual logo path
        
        // Custom toolbar links (based on Sean's example)
        toolbarLinks: [
            {
                text: 'Business Website',
                url: 'https://www.grid4.com',
                target: '_blank',
                icon: 'fa-globe'
            },
            {
                text: 'API Docs',
                url: 'https://docs.ns-api.com/reference',
                target: '_blank',
                icon: 'fa-book'
            },
            {
                text: 'Documentation',
                url: 'https://documentation.netsapiens.com',
                target: '_blank',
                icon: 'fa-file-text'
            }
        ],
        
        // Admin tools dropdown (if user has admin rights)
        adminTools: {
            text: 'Admin UI',
            icon: 'fa-cog',
            items: [
                {
                    text: 'SiPbx (Core) Admin',
                    url: '/SiPbx',
                    target: '_blank'
                },
                {
                    text: 'NDP (Endpoints) Admin',
                    url: '/ndp',
                    target: '_blank'
                },
                {
                    text: 'LiCf (Recording) Admin',
                    url: '/LiCf/adminlogin.php',
                    target: '_blank'
                },
                {
                    text: 'Insight',
                    url: 'https://insight.netsapiens.com',
                    target: '_blank'
                }
            ]
        }
    };
    
    // Initialize Grid4 customizations
    function initGrid4Portal() {
        console.log('Grid4: Initializing portal customizations...');
        
        // Transform horizontal menu to vertical sidebar
        transformMenuToSidebar();
        
        // Add Grid4 branding
        addGrid4Branding();
        
        // Add custom toolbar links
        addToolbarLinks();
        
        // Enhance UI elements
        enhanceUIElements();
        
        // Add custom functionality
        addCustomFunctionality();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Add page-specific enhancements
        addPageSpecificEnhancements();
        
        console.log('Grid4: Portal customizations complete');
    }
    
    // Transform horizontal menu to vertical sidebar
    function transformMenuToSidebar() {
        console.log('Grid4: Transforming horizontal menu to vertical sidebar...');
        
        // Find the horizontal menu container
        // Based on the screenshot, the menu appears to be in a row with image-based navigation
        var $menuContainer = null;
        
        // Try multiple selectors to find the menu
        var selectors = [
            '.container > .row:first',
            '.row:has(a[href*="/portal/home"])',
            'div:has(> a[href*="/portal/home"]):has(> a[href*="/portal/users"])',
            '.text-center:has(a > img)'
        ];
        
        for (var i = 0; i < selectors.length; i++) {
            $menuContainer = $(selectors[i]).filter(function() {
                return $(this).find('a[href*="/portal/"]').length > 5; // Should have multiple portal links
            }).first();
            
            if ($menuContainer.length) break;
        }
        
        if (!$menuContainer.length) {
            console.log('Grid4: Could not find horizontal menu container');
            return;
        }
        
        // Extract menu items from the container
        var menuItems = [];
        $menuContainer.find('a[href*="/portal/"]').each(function() {
            var $link = $(this);
            var href = $link.attr('href');
            var $img = $link.find('img');
            var imgSrc = $img.attr('src') || '';
            var altText = $img.attr('alt') || '';
            var titleText = $link.attr('title') || $img.attr('title') || '';
            
            // Determine the link text
            var linkText = $link.text().trim() || altText || titleText;
            
            // Map URLs to proper names if text is not available
            var pageMapping = {
                '/portal/home': 'Home',
                '/portal/users': 'Users',
                '/portal/conferences': 'Conferences',
                '/portal/attendants': 'Auto Attendants',
                '/portal/callqueues': 'Call Queues',
                '/portal/timeframes': 'Time Frames',
                '/portal/music': 'Music On Hold',
                '/portal/routeprofiles': 'Route Profiles',
                '/portal/inventory': 'Inventory',
                '/portal/callhistory': 'Call History'
            };
            
            // Use mapping if no text found
            if (!linkText) {
                for (var path in pageMapping) {
                    if (href && href.indexOf(path) !== -1) {
                        linkText = pageMapping[path];
                        break;
                    }
                }
            }
            
            // Only add if we have both href and some identifier
            if (href && (imgSrc || linkText)) {
                menuItems.push({
                    href: href,
                    imgSrc: imgSrc,
                    text: linkText || 'Menu Item',
                    isActive: window.location.pathname === href
                });
            }
        });
        
        if (menuItems.length === 0) {
            console.log('Grid4: No menu items found');
            return;
        }
        
        // Create sidebar HTML
        var sidebarHtml = '<div class="grid4-sidebar" id="grid4-sidebar">' +
                         '<div class="grid4-sidebar-header">' +
                         '<h4 style="margin: 0; padding: 20px; color: #fff; font-size: 16px;">Navigation</h4>' +
                         '</div>' +
                         '<ul class="grid4-sidebar-nav">';
        
        menuItems.forEach(function(item) {
            var activeClass = item.isActive ? 'active' : '';
            sidebarHtml += '<li>' +
                          '<a href="' + item.href + '" class="' + activeClass + '">';
            
            if (item.imgSrc) {
                sidebarHtml += '<img src="' + item.imgSrc + '" alt="' + item.text + '">';
            } else {
                // Use a default icon if no image
                sidebarHtml += '<i class="fa fa-circle-o"></i>';
            }
            
            sidebarHtml += '<span>' + item.text + '</span>' +
                          '</a></li>';
        });
        
        sidebarHtml += '</ul></div>';
        
        // Add mobile toggle button
        var toggleHtml = '<button class="grid4-sidebar-toggle" id="grid4-sidebar-toggle">' +
                        '<i class="fa fa-bars"></i>' +
                        '</button>';
        
        // Add mobile overlay
        var overlayHtml = '<div class="grid4-sidebar-overlay" id="grid4-sidebar-overlay"></div>';
        
        // Append elements to body
        $('body').append(sidebarHtml + toggleHtml + overlayHtml);
        
        // Add body class for styling
        $('body').addClass('has-sidebar');
        
        // Setup event handlers
        setupSidebarHandlers();
        
        // Hide original menu
        $menuContainer.hide();
        
        console.log('Grid4: Sidebar created with ' + menuItems.length + ' menu items');
    }
    
    // Setup sidebar event handlers
    function setupSidebarHandlers() {
        // Mobile toggle
        $('#grid4-sidebar-toggle').on('click', function() {
            $('#grid4-sidebar').toggleClass('active');
            $('#grid4-sidebar-overlay').toggleClass('active');
            $('body').toggleClass('sidebar-open');
        });
        
        // Overlay click
        $('#grid4-sidebar-overlay').on('click', function() {
            $('#grid4-sidebar').removeClass('active');
            $(this).removeClass('active');
            $('body').removeClass('sidebar-open');
        });
        
        // Active state management
        $('.grid4-sidebar-nav a').on('click', function() {
            $('.grid4-sidebar-nav a').removeClass('active');
            $(this).addClass('active');
        });
        
        // Keyboard navigation
        $(document).on('keydown', function(e) {
            // Toggle sidebar with Ctrl+B
            if (e.ctrlKey && e.keyCode === 66) {
                e.preventDefault();
                $('#grid4-sidebar').toggleClass('collapsed');
                $('body').toggleClass('sidebar-collapsed');
            }
        });
    }
    
    // Add Grid4 branding elements
    function addGrid4Branding() {
        // Add Grid4 logo to navbar if it exists
        var $navbar = $('.navbar-brand, .logo');
        if ($navbar.length && CONFIG.logoUrl) {
            var logoHtml = '<img src="' + CONFIG.logoUrl + '" alt="Grid4" class="grid4-logo" style="height: 30px; margin-right: 10px; vertical-align: middle;">';
            $navbar.prepend(logoHtml);
        }
        
        // Update page title
        document.title = CONFIG.companyName + ' - ' + document.title;
        
        // Add custom footer text
        var $footer = $('.footer, footer');
        if ($footer.length) {
            var currentYear = new Date().getFullYear();
            var footerText = '<div class="grid4-footer-text" style="text-align: center; padding: 10px 0; color: #b3c2d3;">' +
                           'Powered by ' + CONFIG.companyName + ' © ' + currentYear + '</div>';
            $footer.append(footerText);
        }
    }
    
    // Add custom toolbar links (based on Sean's implementation)
    function addToolbarLinks() {
        // Wait for toolbar to be available
        var $toolbar = $('.user-toolbar');
        if ($toolbar.length === 0) {
            console.log('Grid4: User toolbar not found, creating fallback toolbar');
            createFallbackToolbar();
            return;
        }
        
        console.log('Grid4: Adding custom toolbar links');
        
        // Add regular links
        CONFIG.toolbarLinks.forEach(function(link) {
            var linkHtml = '<li><a href="' + link.url + '" target="' + (link.target || '_self') + '" class="header-link">' +
                         (link.icon ? '<i class="fa ' + link.icon + '"></i> ' : '') +
                         link.text + '</a></li>';
            $toolbar.prepend(linkHtml);
        });
        
        // Add admin dropdown if applicable
        if (CONFIG.adminTools && isAdminUser()) {
            var adminHtml = '<li class="dropdown">' +
                          '<a href="#" class="dropdown-toggle header-link" data-toggle="dropdown">' +
                          '<i class="fa ' + CONFIG.adminTools.icon + '"></i> ' +
                          CONFIG.adminTools.text + ' <span class="caret"></span></a>' +
                          '<ul class="dropdown-menu" role="menu">';
            
            CONFIG.adminTools.items.forEach(function(item) {
                adminHtml += '<li><a href="' + item.url + '" target="' + (item.target || '_self') + '">' + item.text + '</a></li>';
            });
            
            adminHtml += '</ul></li>';
            $toolbar.prepend(adminHtml);
        }
        
        // Ensure Bootstrap dropdown functionality
        ensureBootstrapDropdown();
    }
    
    // Create fallback toolbar if main toolbar not found
    function createFallbackToolbar() {
        var toolbarHtml = '<div class="grid4-custom-toolbar" style="position: fixed; top: 0; right: 0; z-index: 1000; padding: 10px; background: rgba(45, 58, 75, 0.95);">' +
                        '<ul style="list-style: none; margin: 0; padding: 0; display: flex; gap: 10px;">';
        
        CONFIG.toolbarLinks.forEach(function(link) {
            toolbarHtml += '<li><a href="' + link.url + '" target="' + (link.target || '_self') + '" ' +
                         'style="color: #fff; padding: 8px 15px; background: #0099ff; border-radius: 4px; text-decoration: none; display: inline-block;">' +
                         (link.icon ? '<i class="fa ' + link.icon + '"></i> ' : '') +
                         link.text + '</a></li>';
        });
        
        toolbarHtml += '</ul></div>';
        $('body').append(toolbarHtml);
    }
    
    // Check if current user is admin (basic check)
    function isAdminUser() {
        // Check for admin indicators in the page
        return $('.admin-menu').length > 0 || 
               $('[href*="/admin"]').length > 0 ||
               window.location.pathname.includes('admin');
    }
    
    // Ensure Bootstrap dropdown functionality is available
    function ensureBootstrapDropdown() {
        if (typeof $.fn.dropdown === 'undefined') {
            console.log('Grid4: Bootstrap dropdown not found, loading it dynamically');
            var script = document.createElement('script');
            script.src = 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js';
            script.onload = function() {
                console.log('Grid4: Bootstrap JS loaded successfully');
                // Re-initialize dropdowns
                $('.dropdown-toggle').dropdown();
            };
            document.head.appendChild(script);
        } else {
            // Initialize dropdowns
            $('.dropdown-toggle').dropdown();
        }
    }
    
    // Enhance various UI elements
    function enhanceUIElements() {
        // Add fade-in animation to panels
        $('.panel, .widget, .box').each(function(index) {
            $(this).css('opacity', '0').delay(index * 100).animate({opacity: 1}, 500);
        });
        
        // Enhance tables with hover effects
        $('table.table tbody tr').hover(
            function() { $(this).addClass('grid4-hover'); },
            function() { $(this).removeClass('grid4-hover'); }
        );
        
        // Add icons to common buttons if they don't have them
        $('.btn-primary:contains("Save")').each(function() {
            if (!$(this).find('i').length) {
                $(this).prepend('<i class="fa fa-save"></i> ');
            }
        });
        
        $('.btn-danger:contains("Delete")').each(function() {
            if (!$(this).find('i').length) {
                $(this).prepend('<i class="fa fa-trash"></i> ');
            }
        });
        
        $('.btn-default:contains("Cancel")').each(function() {
            if (!$(this).find('i').length) {
                $(this).prepend('<i class="fa fa-times"></i> ');
            }
        });
    }
    
    // Add custom functionality
    function addCustomFunctionality() {
        // Add quick search functionality
        addQuickSearch();
        
        // Add keyboard shortcuts
        addKeyboardShortcuts();
        
        // Add session timeout warning
        addSessionTimeoutWarning();
        
        // Enhance form validation feedback
        enhanceFormValidation();
    }
    
    // Add quick search box
    function addQuickSearch() {
        var searchHtml = '<div class="grid4-quick-search" style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; display: none;">' +
                       '<input type="text" id="grid4-search" placeholder="Quick search... (Ctrl+K)" ' +
                       'style="padding: 8px 15px; width: 300px; border-radius: 20px; border: 1px solid #4a5668; background: #2d3a4b; color: #fff;">' +
                       '</div>';
        
        $('body').append(searchHtml);
        
        // Toggle search on Ctrl+K
        $(document).on('keydown', function(e) {
            if (e.ctrlKey && e.keyCode === 75) { // Ctrl+K
                e.preventDefault();
                $('.grid4-quick-search').toggle();
                $('#grid4-search').focus();
            }
        });
        
        // Hide on Escape
        $('#grid4-search').on('keydown', function(e) {
            if (e.keyCode === 27) { // Escape
                $('.grid4-quick-search').hide();
                $(this).val('');
            }
        });
    }
    
    // Add keyboard shortcuts
    function addKeyboardShortcuts() {
        $(document).on('keydown', function(e) {
            // Alt+H for Home
            if (e.altKey && e.keyCode === 72) {
                e.preventDefault();
                window.location.href = '/portal/home';
            }
            
            // Alt+U for Users
            if (e.altKey && e.keyCode === 85) {
                e.preventDefault();
                window.location.href = '/portal/users';
            }
            
            // Alt+D for Domains
            if (e.altKey && e.keyCode === 68) {
                e.preventDefault();
                window.location.href = '/portal/domains';
            }
        });
    }
    
    // Add session timeout warning
    function addSessionTimeoutWarning() {
        var warningTime = 5 * 60 * 1000; // 5 minutes before timeout
        var sessionTimeout = 30 * 60 * 1000; // 30 minutes total
        
        setTimeout(function() {
            if (confirm('Your session will expire in 5 minutes. Would you like to extend it?')) {
                // Make a small AJAX request to refresh session
                $.get('/heartbeat');
            }
        }, sessionTimeout - warningTime);
    }
    
    // Enhance form validation feedback
    function enhanceFormValidation() {
        $('form').on('submit', function() {
            var $form = $(this);
            var isValid = true;
            
            // Check required fields
            $form.find('[required]').each(function() {
                var $field = $(this);
                if (!$field.val()) {
                    isValid = false;
                    $field.addClass('grid4-error');
                    if (!$field.next('.grid4-error-message').length) {
                        $field.after('<span class="grid4-error-message" style="color: #f44336; font-size: 12px;">This field is required</span>');
                    }
                }
            });
            
            return isValid;
        });
        
        // Remove error styling on input
        $(document).on('input', '[required]', function() {
            $(this).removeClass('grid4-error').next('.grid4-error-message').remove();
        });
    }
    
    // Initialize tooltips
    function initializeTooltips() {
        // Add tooltips to common elements
        $('[title]').each(function() {
            var $elem = $(this);
            var title = $elem.attr('title');
            $elem.attr('data-toggle', 'tooltip').attr('data-original-title', title).removeAttr('title');
        });
        
        // Initialize Bootstrap tooltips if available
        if (typeof $.fn.tooltip !== 'undefined') {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
    
    // Add page-specific enhancements
    function addPageSpecificEnhancements() {
        var pathname = window.location.pathname;
        
        // Home/Dashboard page
        if (pathname === '/portal/home' || pathname === '/') {
            enhanceDashboard();
        }
        
        // Call History page
        if (pathname.includes('callhistory')) {
            enhanceCallHistory();
        }
        
        // Users page
        if (pathname.includes('users')) {
            enhanceUsersPage();
        }
    }
    
    // Enhance dashboard page
    function enhanceDashboard() {
        // Add welcome message
        var userName = $('.user-name').text() || 'User';
        var welcomeHtml = '<div class="grid4-welcome alert alert-info" style="margin: 20px;">' +
                        '<h4>Welcome to ' + CONFIG.companyName + ', ' + userName + '!</h4>' +
                        '<p>Your communications dashboard is ready.</p></div>';
        
        $('.main-content').prepend(welcomeHtml);
        
        // Animate dashboard widgets
        $('.widget, .panel').each(function(index) {
            $(this).delay(index * 100).queue(function() {
                $(this).addClass('animated fadeInUp');
            });
        });
    }
    
    // Enhance call history page
    function enhanceCallHistory() {
        // Add call type indicators
        $('.call-history-table tbody tr').each(function() {
            var $row = $(this);
            var callType = $row.find('.call-type').text().toLowerCase();
            
            if (callType.includes('incoming')) {
                $row.addClass('incoming-call');
            } else if (callType.includes('outgoing')) {
                $row.addClass('outgoing-call');
            } else if (callType.includes('missed')) {
                $row.addClass('missed-call');
            }
        });
        
        // Add export button if not present
        if (!$('.export-calls').length) {
            var exportBtn = '<button class="btn btn-primary export-calls" style="margin: 10px;">' +
                          '<i class="fa fa-download"></i> Export Call History</button>';
            $('.call-history-controls').append(exportBtn);
        }
    }
    
    // Enhance users page
    function enhanceUsersPage() {
        // Add bulk action buttons
        var bulkActions = '<div class="grid4-bulk-actions" style="margin: 10px 0;">' +
                        '<button class="btn btn-default" id="select-all"><i class="fa fa-check-square"></i> Select All</button> ' +
                        '<button class="btn btn-primary" id="bulk-edit" disabled><i class="fa fa-edit"></i> Bulk Edit</button> ' +
                        '<button class="btn btn-danger" id="bulk-delete" disabled><i class="fa fa-trash"></i> Bulk Delete</button>' +
                        '</div>';
        
        if (!$('.grid4-bulk-actions').length) {
            $('.users-table').before(bulkActions);
        }
        
        // Add checkboxes to user rows
        $('.users-table tbody tr').each(function() {
            if (!$(this).find('.user-checkbox').length) {
                $(this).prepend('<td><input type="checkbox" class="user-checkbox"></td>');
            }
        });
    }
    
    // Document ready handler
    $(document).ready(function() {
        console.log('Grid4: Document ready, initializing customizations');
        initGrid4Portal();
    });
    
    // Also run on AJAX complete for dynamic content
    $(document).ajaxComplete(function() {
        console.log('Grid4: AJAX complete, re-initializing elements');
        enhanceUIElements();
        initializeTooltips();
    });
    
})();