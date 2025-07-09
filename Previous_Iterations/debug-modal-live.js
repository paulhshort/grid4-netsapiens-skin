const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = await browser.contexts();
  const page = contexts[0].pages()[0];
  
  console.log('Current URL:', page.url());
  
  // Navigate to users page if not already there
  if (!page.url().includes('/portal/users')) {
    await page.goto('https://portal.grid4voice.net/portal/users');
    await page.waitForLoadState('networkidle');
  }
  
  // Get initial state
  console.log('\n=== BEFORE CLICKING ADD USER ===');
  
  // Check if any modals exist
  const modalsBefore = await page.$$('.modal');
  console.log('Number of .modal elements:', modalsBefore.length);
  
  // Click Add User button
  console.log('\n=== CLICKING ADD USER BUTTON ===');
  await page.click('button:has-text("Add User")');
  
  // Wait a bit for modal to potentially load
  await page.waitForTimeout(1000);
  
  // Get modal state after click
  console.log('\n=== AFTER CLICKING ADD USER ===');
  
  const modalInfo = await page.evaluate(() => {
    const modals = document.querySelectorAll('.modal');
    const modalData = [];
    
    modals.forEach((modal, index) => {
      const computed = window.getComputedStyle(modal);
      const rect = modal.getBoundingClientRect();
      
      modalData.push({
        index,
        id: modal.id,
        classes: modal.className,
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        position: computed.position,
        top: computed.top,
        left: computed.left,
        transform: computed.transform,
        zIndex: computed.zIndex,
        width: computed.width,
        height: computed.height,
        backgroundColor: computed.backgroundColor,
        boundingRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
        },
        innerHTML: modal.innerHTML.substring(0, 200) + '...',
        parentElement: modal.parentElement ? modal.parentElement.tagName : 'none',
        offsetParent: modal.offsetParent ? modal.offsetParent.tagName : 'none'
      });
    });
    
    // Also check for backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    const backdropData = backdrop ? {
      classes: backdrop.className,
      display: window.getComputedStyle(backdrop).display,
      opacity: window.getComputedStyle(backdrop).opacity
    } : null;
    
    // Check body classes
    const bodyClasses = document.body.className;
    
    // Get any error messages in console
    const errors = [];
    
    return {
      modals: modalData,
      backdrop: backdropData,
      bodyClasses,
      documentScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop
    };
  });
  
  console.log('\nModal Data:', JSON.stringify(modalInfo, null, 2));
  
  // Try to force modal visibility
  console.log('\n=== ATTEMPTING TO FORCE MODAL VISIBLE ===');
  
  const forceResult = await page.evaluate(() => {
    const modal = document.querySelector('.modal');
    if (!modal) return 'No modal found';
    
    // Try multiple approaches
    const attempts = [];
    
    // Save original styles
    const originalStyles = {
      display: modal.style.display,
      visibility: modal.style.visibility,
      opacity: modal.style.opacity,
      position: modal.style.position,
      top: modal.style.top,
      left: modal.style.left
    };
    
    // Attempt 1: Direct style manipulation
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.position = 'fixed';
    modal.style.top = '50px';
    modal.style.left = '50%';
    modal.style.transform = 'translateX(-50%)';
    modal.style.zIndex = '9999';
    
    const rect1 = modal.getBoundingClientRect();
    attempts.push({
      attempt: 'Direct style override',
      visible: rect1.width > 0 && rect1.height > 0,
      rect: { top: rect1.top, left: rect1.left, width: rect1.width, height: rect1.height }
    });
    
    // Check if modal has content
    const modalContent = modal.querySelector('.modal-content');
    const hasContent = modalContent && modalContent.innerHTML.length > 0;
    
    return {
      originalStyles,
      attempts,
      hasContent,
      modalHTML: modal.outerHTML.substring(0, 500)
    };
  });
  
  console.log('\nForce Visibility Result:', JSON.stringify(forceResult, null, 2));
  
  // Take a screenshot
  await page.screenshot({ path: 'modal-debug-state.png', fullPage: true });
  console.log('\nScreenshot saved as modal-debug-state.png');
  
  await browser.close();
})();