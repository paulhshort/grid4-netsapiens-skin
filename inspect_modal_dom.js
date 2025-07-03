const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to login page
  await page.goto('https://portal.grid4voice.net/portal/home');
  
  // Login
  await page.fill('#LoginUsername', '321@grid4.com');
  await page.fill('#LoginPassword', '2107Cr00ks\!');
  await page.click('button:has-text("Log In")');
  
  // Wait for navigation
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Set dark theme
  const themeToggle = await page.$('#grid4-theme-toggle');
  if (themeToggle) {
    await themeToggle.click();
    await page.waitForTimeout(1000);
  }
  
  // Navigate to Users
  await page.click('text=Users');
  await page.waitForTimeout(2000);
  
  // Click Add button
  await page.click('button:has-text("Add")');
  await page.waitForTimeout(2000);
  
  // Inspect modal DOM
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.modal');
    if (\!modal) return { error: 'No modal found' };
    
    // Get modal hierarchy
    let hierarchy = [];
    let current = modal;
    while (current && current \!== document.body) {
      hierarchy.push({
        tag: current.tagName.toLowerCase(),
        id: current.id || '',
        classes: Array.from(current.classList),
        style: current.getAttribute('style') || ''
      });
      current = current.parentElement;
    }
    hierarchy.push({ tag: 'body' });
    hierarchy.reverse();
    
    // Get modal structure
    const getStructure = (el, depth = 0) => {
      if (depth > 5) return null;
      
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        classes: Array.from(el.classList),
        style: el.getAttribute('style') || '',
        children: Array.from(el.children).map(child => getStructure(child, depth + 1)).filter(Boolean)
      };
    };
    
    // Check if modal is inside app shell
    const appShell = document.querySelector('#grid4-app-shell');
    const isInsideAppShell = appShell && appShell.contains(modal);
    
    // Get computed styles of modal-content
    const modalContent = modal.querySelector('.modal-content');
    const computedStyles = modalContent ? window.getComputedStyle(modalContent) : null;
    
    return {
      hierarchy,
      structure: getStructure(modal),
      isInsideAppShell,
      computedStyles: computedStyles ? {
        position: computedStyles.position,
        display: computedStyles.display,
        width: computedStyles.width,
        height: computedStyles.height,
        maxWidth: computedStyles.maxWidth,
        maxHeight: computedStyles.maxHeight,
        margin: computedStyles.margin,
        padding: computedStyles.padding,
        backgroundColor: computedStyles.backgroundColor,
        border: computedStyles.border,
        borderRadius: computedStyles.borderRadius,
        boxShadow: computedStyles.boxShadow,
        transform: computedStyles.transform,
        top: computedStyles.top,
        left: computedStyles.left,
        right: computedStyles.right,
        bottom: computedStyles.bottom,
        zIndex: computedStyles.zIndex
      } : null
    };
  });
  
  console.log(JSON.stringify(modalInfo, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: 'modal_screenshot.png', fullPage: true });
  
  // Keep browser open for manual inspection
  console.log('Browser will stay open for manual inspection. Press Ctrl+C to close.');
})();
EOF < /dev/null
