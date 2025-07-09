/**
 * Grid4 Modern Portal Enhancement
 * Version: 4.0.0 - No Alpine.js
 * 
 * This version provides modern enhancements without Alpine.js
 * to avoid breaking the NetSapiens portal
 */

(function($) {
    'use strict';
    
    console.log('Grid4 Modern Portal Enhancement v4.0.0 loading...');
    
    // Wait for jQuery to be ready
    function waitForJQuery(callback) {
        if (typeof window.jQuery !== 'undefined' && window.jQuery.fn) {
            callback(window.jQuery);
        } else {
            setTimeout(() => waitForJQuery(callback), 50);
        }
    }
    
    waitForJQuery(function($) {
        console.log('jQuery ready, initializing enhancements...');
        
        // Theme management
        const ThemeManager = {
            init() {
                // Check for saved theme preference
                const savedTheme = localStorage.getItem('grid4_theme') || 'light';
                this.applyTheme(savedTheme);
                
                // Add theme toggle button if it doesn't exist
                if (!$('#grid4-theme-toggle').length) {
                    this.addThemeToggle();
                }
            },
            
            applyTheme(theme) {
                $('html').attr('data-theme', theme);
                if (theme === 'dark') {
                    $('html').addClass('theme-dark');
                } else {
                    $('html').removeClass('theme-dark');
                }
            },
            
            addThemeToggle() {
                const toggleHtml = `
                    <button id="grid4-theme-toggle" class="grid4-theme-toggle" title="Toggle theme">
                        <svg class="theme-icon-light" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                        </svg>
                        <svg class="theme-icon-dark" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                        </svg>
                    </button>
                `;
                
                $('body').append(toggleHtml);
                
                $('#grid4-theme-toggle').on('click', () => {
                    const currentTheme = $('html').attr('data-theme') || 'light';
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                    localStorage.setItem('grid4_theme', newTheme);
                });
            }
        };
        
        // Table enhancements
        const TableEnhancer = {
            init() {
                this.enhanceTables();
                this.addTableSearch();
                this.makeTablesSortable();
            },
            
            enhanceTables() {
                $('table.table').each(function() {
                    const $table = $(this);
                    if (!$table.hasClass('grid4-enhanced')) {
                        $table.addClass('grid4-enhanced');
                        
                        // Add responsive wrapper
                        if (!$table.parent().hasClass('table-responsive')) {
                            $table.wrap('<div class="table-responsive"></div>');
                        }
                        
                        // Add hover effects
                        $table.find('tbody tr').hover(
                            function() { $(this).addClass('hover'); },
                            function() { $(this).removeClass('hover'); }
                        );
                    }
                });
            },
            
            addTableSearch() {
                $('table.table').each(function() {
                    const $table = $(this);
                    if (!$table.prev('.grid4-table-search').length) {
                        const searchHtml = `
                            <div class="grid4-table-search">
                                <input type="text" class="form-control" placeholder="Search table..." />
                            </div>
                        `;
                        
                        $table.before(searchHtml);
                        
                        $table.prev('.grid4-table-search').find('input').on('keyup', function() {
                            const value = $(this).val().toLowerCase();
                            $table.find('tbody tr').filter(function() {
                                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                            });
                        });
                    }
                });
            },
            
            makeTablesSortable() {
                $('table.table th').each(function() {
                    const $th = $(this);
                    if (!$th.hasClass('grid4-sortable')) {
                        $th.addClass('grid4-sortable').css('cursor', 'pointer');
                        
                        $th.on('click', function() {
                            const $table = $th.closest('table');
                            const index = $th.index();
                            const isAsc = $th.hasClass('asc');
                            
                            $table.find('th').removeClass('asc desc');
                            $th.addClass(isAsc ? 'desc' : 'asc');
                            
                            const $tbody = $table.find('tbody');
                            const rows = $tbody.find('tr').toArray().sort(function(a, b) {
                                const aVal = $(a).find('td').eq(index).text();
                                const bVal = $(b).find('td').eq(index).text();
                                
                                return isAsc ? 
                                    (aVal > bVal ? -1 : aVal < bVal ? 1 : 0) :
                                    (aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
                            });
                            
                            $tbody.empty().append(rows);
                        });
                    }
                });
            }
        };
        
        // Form enhancements
        const FormEnhancer = {
            init() {
                this.enhanceForms();
                this.addValidation();
            },
            
            enhanceForms() {
                // Add focus styles
                $('input, select, textarea').on('focus', function() {
                    $(this).parent().addClass('has-focus');
                }).on('blur', function() {
                    $(this).parent().removeClass('has-focus');
                });
                
                // Add filled state
                $('input, select, textarea').each(function() {
                    if ($(this).val()) {
                        $(this).parent().addClass('has-value');
                    }
                }).on('change input', function() {
                    if ($(this).val()) {
                        $(this).parent().addClass('has-value');
                    } else {
                        $(this).parent().removeClass('has-value');
                    }
                });
            },
            
            addValidation() {
                // Phone number formatting
                $('input[type="tel"], input[name*="phone"], input[name*="fax"]').on('input', function() {
                    let value = $(this).val().replace(/\D/g, '');
                    if (value.length >= 10) {
                        value = value.slice(0, 10);
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                        $(this).val(value);
                    }
                });
                
                // Email validation
                $('input[type="email"]').on('blur', function() {
                    const email = $(this).val();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (email && !emailRegex.test(email)) {
                        $(this).addClass('error');
                        if (!$(this).next('.error-message').length) {
                            $(this).after('<span class="error-message">Please enter a valid email address</span>');
                        }
                    } else {
                        $(this).removeClass('error');
                        $(this).next('.error-message').remove();
                    }
                });
            }
        };
        
        // Initialize all modules
        $(document).ready(function() {
            console.log('Document ready, initializing Grid4 enhancements...');
            
            ThemeManager.init();
            TableEnhancer.init();
            FormEnhancer.init();
            
            // Re-run enhancements on dynamic content
            const observer = new MutationObserver(function(mutations) {
                TableEnhancer.enhanceTables();
                FormEnhancer.enhanceForms();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('Grid4 Modern Portal Enhancement initialized successfully');
        });
    });
    
})(window.jQuery || window.$);