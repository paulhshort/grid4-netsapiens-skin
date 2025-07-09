/* ===================================
   GRID4 NETSAPIENS PORTAL SKIN v5.0 - MINIMAL JS
   Only handle theme toggle - DON'T TOUCH ANYTHING ELSE
   =================================== */

(function($) {
  'use strict';
  
  // Only run after jQuery loads
  function waitForJQuery() {
    if (typeof $ === 'undefined' || !$.fn || !$.fn.jquery) {
      setTimeout(waitForJQuery, 100);
      return;
    }
    initMinimalGrid4();
  }
  
  function initMinimalGrid4() {
    // Only add theme toggle button
    if (!$('#grid4-theme-toggle').length) {
      var $toggle = $('<button id="grid4-theme-toggle">Toggle Theme</button>');
      $('#navigation').append($toggle);
      
      $toggle.on('click', function() {
        var isLight = $('html').hasClass('theme-light');
        $('html').removeClass('theme-light theme-dark');
        $('html').addClass(isLight ? 'theme-dark' : 'theme-light');
        localStorage.setItem('grid4_theme', JSON.stringify(isLight ? 'dark' : 'light'));
      });
    }
    
    // Apply saved theme
    var savedTheme = localStorage.getItem('grid4_theme');
    if (savedTheme) {
      var theme = JSON.parse(savedTheme);
      $('html').removeClass('theme-light theme-dark').addClass('theme-' + theme);
    } else {
      $('html').addClass('theme-light');
    }
  }
  
  // Start waiting for jQuery
  waitForJQuery();
  
})(window.jQuery);