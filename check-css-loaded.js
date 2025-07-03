// Check if Grid4 CSS is loaded
const stylesheets = Array.from(document.styleSheets);
const grid4CSS = stylesheets.find(sheet => sheet.href && sheet.href.includes('grid4-netsapiens.css'));

if (grid4CSS) {
  console.log('Grid4 CSS is loaded:', grid4CSS.href);
} else {
  console.log('Grid4 CSS is NOT loaded');
}

// Check for any custom CSS parameter
const customCSSLinks = document.querySelectorAll('link[rel="stylesheet"]');
console.log('All CSS files loaded:');
customCSSLinks.forEach(link => {
  console.log('-', link.href);
});
EOF < /dev/null
