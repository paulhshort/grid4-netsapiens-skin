// Quick modal position checker
// Run in browser console after opening a modal

(function() {
  const modal = document.querySelector('.modal');
  if (!modal) {
    console.log('No modal found');
    return;
  }
  
  const computed = window.getComputedStyle(modal);
  const rect = modal.getBoundingClientRect();
  
  console.log('=== MODAL POSITIONING DEBUG ===');
  console.log('Computed Styles:');
  console.log('  position:', computed.position);
  console.log('  top:', computed.top);
  console.log('  left:', computed.left);
  console.log('  width:', computed.width);
  console.log('  height:', computed.height);
  console.log('  margin:', computed.margin);
  console.log('  transform:', computed.transform);
  console.log('  display:', computed.display);
  
  console.log('\nBounding Rect:');
  console.log('  top:', rect.top);
  console.log('  left:', rect.left);
  console.log('  width:', rect.width);
  console.log('  height:', rect.height);
  
  console.log('\nViewport:');
  console.log('  width:', window.innerWidth);
  console.log('  height:', window.innerHeight);
  
  console.log('\nCalculated Center:');
  console.log('  Expected left:', (window.innerWidth - rect.width) / 2);
  console.log('  Actual left:', rect.left);
  console.log('  Difference:', rect.left - (window.innerWidth - rect.width) / 2);
  
  // Check parent positioning context
  console.log('\nParent Context:');
  console.log('  offsetParent:', modal.offsetParent ? modal.offsetParent.tagName : 'none');
  
  // Check for CSS conflicts
  const allStyles = document.styleSheets;
  let conflictingRules = [];
  
  for (let i = 0; i < allStyles.length; i++) {
    try {
      const rules = allStyles[i].cssRules || allStyles[i].rules;
      if (!rules) continue;
      
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.selectorText && rule.selectorText.includes('.modal') && !rule.selectorText.includes('.modal-')) {
          if (rule.style.position || rule.style.left || rule.style.margin) {
            conflictingRules.push({
              selector: rule.selectorText,
              position: rule.style.position,
              left: rule.style.left,
              margin: rule.style.margin,
              source: allStyles[i].href || 'inline'
            });
          }
        }
      }
    } catch (e) {
      // Cross-origin stylesheets
    }
  }
  
  console.log('\nConflicting CSS Rules:');
  console.log(conflictingRules);
})();