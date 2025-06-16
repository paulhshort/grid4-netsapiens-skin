// Simple script to check Grid4 status in the browser
console.log('=== Grid4 Status Check ===');

// Check if Grid4 object exists
console.log('G4 Object:', typeof window.G4);
console.log('grid4DebugInfo:', typeof window.grid4DebugInfo);
console.log('grid4FixLogo:', typeof window.grid4FixLogo);

// Check for CSS files
const cssFiles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  .filter(link => link.href.includes('grid4'))
  .map(link => ({ href: link.href, loaded: !!link.sheet }));
console.log('Grid4 CSS Files:', cssFiles);

// Check for JS files
const jsFiles = Array.from(document.querySelectorAll('script[src]'))
  .filter(script => script.src.includes('grid4'))
  .map(script => ({ src: script.src }));
console.log('Grid4 JS Files:', jsFiles);

// Check logo elements
const logoStatus = {
  headerLogo: {
    exists: !!document.getElementById('header-logo'),
    element: document.getElementById('header-logo'),
    src: document.getElementById('header-logo')?.src,
    innerHTML: document.getElementById('header-logo')?.innerHTML,
    style: document.getElementById('header-logo')?.style.cssText,
    rect: document.getElementById('header-logo')?.getBoundingClientRect()
  },
  headerLogoClone: {
    exists: !!document.getElementById('header-logo-clone'),
    element: document.getElementById('header-logo-clone')
  },
  navigation: {
    exists: !!document.getElementById('navigation'),
    element: document.getElementById('navigation'),
    classes: document.getElementById('navigation')?.className,
    hasLogoFallback: document.getElementById('navigation')?.classList.contains('grid4-logo-fallback')
  }
};

console.log('Logo Status:', logoStatus);

// If Grid4 is loaded, get debug info
if (typeof window.grid4DebugInfo === 'function') {
  console.log('=== Grid4 Debug Info ===');
  const debugInfo = window.grid4DebugInfo();
  console.log(debugInfo);
}

// Check if we're in the right domain context
console.log('Current URL:', window.location.href);
console.log('Domain:', window.location.hostname);

// Check for any Grid4-related console messages
console.log('=== Checking for Grid4 initialization ===');

// Try to manually trigger logo fix if available
if (typeof window.grid4FixLogo === 'function') {
  console.log('Attempting manual logo fix...');
  window.grid4FixLogo();
} else {
  console.log('grid4FixLogo function not available');
}
