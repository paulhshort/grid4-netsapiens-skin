/**
 * Grid4 CSS Enhancement Only
 * Version: 1.0.0
 * 
 * This file adds minimal JavaScript enhancements without Alpine.js
 * to avoid breaking the portal
 */

(function($) {
    'use strict';
    
    // Wait for jQuery to be ready
    $(document).ready(function() {
        console.log('Grid4 CSS enhancements loaded');
        
        // Add theme toggle button if it doesn't exist
        if (!$('#grid4-theme-toggle').length) {
            var toggleHtml = '<button id="grid4-theme-toggle" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Toggle Theme</button>';
            $('body').append(toggleHtml);
            
            $('#grid4-theme-toggle').on('click', function() {
                $('html').toggleClass('theme-dark');
                localStorage.setItem('grid4_theme', $('html').hasClass('theme-dark') ? 'dark' : 'light');
            });
        }
        
        // Apply saved theme
        var savedTheme = localStorage.getItem('grid4_theme');
        if (savedTheme === 'dark') {
            $('html').addClass('theme-dark');
        }
        
        // Simple enhancements without Alpine
        // Make tables sortable
        $('table.table th').css('cursor', 'pointer').on('click', function() {
            var $th = $(this);
            var $table = $th.closest('table');
            var index = $th.index();
            var isAsc = $th.hasClass('asc');
            
            $table.find('th').removeClass('asc desc');
            $th.addClass(isAsc ? 'desc' : 'asc');
            
            // Simple sort implementation
            var $tbody = $table.find('tbody');
            var rows = $tbody.find('tr').toArray().sort(function(a, b) {
                var aVal = $(a).find('td').eq(index).text();
                var bVal = $(b).find('td').eq(index).text();
                
                return isAsc ? 
                    (aVal > bVal ? -1 : aVal < bVal ? 1 : 0) :
                    (aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
            });
            
            $tbody.empty().append(rows);
        });
        
        // Add search to tables
        $('table.table').each(function() {
            var $table = $(this);
            if (!$table.prev('.table-search').length) {
                var searchHtml = '<div class="table-search" style="margin-bottom: 10px;"><input type="text" class="form-control" placeholder="Search table..." style="max-width: 300px;"></div>';
                $table.before(searchHtml);
                
                $table.prev('.table-search').find('input').on('keyup', function() {
                    var value = $(this).val().toLowerCase();
                    $table.find('tbody tr').filter(function() {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    });
                });
            }
        });
    });
    
})(jQuery);