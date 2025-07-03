// Debug script for empty screen issue when navigating to pages like Domains
// Run this in browser console after navigating to a page that shows empty

(function() {
  console.log('=== EMPTY SCREEN DEBUG ===');
  
  // Check main content containers
  const containers = [
    '#content',
    '#main-content',
    '#page-content',
    '.content',
    '.main-content',
    '.page-content',
    '#wrapper',
    '.wrapper',
    '#sub-wrapper',
    '.sub-wrapper',
    '#container',
    '.container',
    'main',
    '[role="main"]'
  ];
  
  console.log('\nChecking content containers:');
  containers.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((el, index) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        console.log(`\n${selector}[${index}]:`);
        console.log('  display:', computed.display);
        console.log('  visibility:', computed.visibility);
        console.log('  opacity:', computed.opacity);
        console.log('  position:', computed.position);
        console.log('  z-index:', computed.zIndex);
        console.log('  overflow:', computed.overflow);
        console.log('  dimensions:', rect.width + 'x' + rect.height);
        console.log('  visible:', rect.width > 0 && rect.height > 0);
        console.log('  childElementCount:', el.childElementCount);
        console.log('  innerHTML length:', el.innerHTML.length);
      });
    }
  });
  
  // Check if content is being hidden by overlapping elements
  console.log('\nChecking for overlapping elements:');
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  const elementsAtCenter = document.elementsFromPoint(centerX, centerY);
  console.log('Elements at viewport center:', elementsAtCenter.map(el => ({
    tag: el.tagName,
    id: el.id,
    class: el.className,
    zIndex: window.getComputedStyle(el).zIndex
  })));
  
  // Check body and html styles
  console.log('\nBody styles:');
  const bodyComputed = window.getComputedStyle(document.body);
  console.log('  background:', bodyComputed.backgroundColor);
  console.log('  overflow:', bodyComputed.overflow);
  console.log('  height:', bodyComputed.height);
  
  // Check for any fixed/absolute positioned elements that might be covering content
  console.log('\nFixed/Absolute positioned elements:');
  const allElements = document.querySelectorAll('*');
  const fixedElements = [];
  allElements.forEach(el => {
    const position = window.getComputedStyle(el).position;
    if (position === 'fixed' || position === 'absolute') {
      const rect = el.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 100) { // Only large elements
        fixedElements.push({
          element: el,
          tag: el.tagName,
          id: el.id,
          class: el.className,
          position: position,
          zIndex: window.getComputedStyle(el).zIndex,
          dimensions: rect.width + 'x' + rect.height
        });
      }
    }
  });
  fixedElements.sort((a, b) => (parseInt(b.zIndex) || 0) - (parseInt(a.zIndex) || 0));
  console.log(fixedElements.slice(0, 10)); // Top 10 by z-index
})();