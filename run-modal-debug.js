const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate and wait
  await page.goto('https://portal.grid4voice.net/portal/users');
  await page.waitForLoadState('networkidle');
  
  // Click Add User button
  await page.click('button:has-text("Add User")');
  await page.waitForTimeout(1000);
  
  // Execute analysis
  const analysis = await page.evaluate(() => {
    // Helper function to check if element is in viewport
    function isInViewport(elem) {
        if (\!elem) return false;
        const rect = elem.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Find the modal elements
    const modal = document.querySelector('.modal');
    const modalDialog = document.querySelector('.modal-dialog');
    const modalContent = document.querySelector('.modal-content');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    // Get computed styles
    const modalStyles = modal ? window.getComputedStyle(modal) : null;
    const dialogStyles = modalDialog ? window.getComputedStyle(modalDialog) : null;
    const contentStyles = modalContent ? window.getComputedStyle(modalContent) : null;

    // Extract key properties
    const analysis = {
        modal: {
            exists: \!\!modal,
            classes: modal?.className,
            display: modalStyles?.display,
            position: modalStyles?.position,
            top: modalStyles?.top,
            left: modalStyles?.left,
            width: modalStyles?.width,
            height: modalStyles?.height,
            opacity: modalStyles?.opacity,
            visibility: modalStyles?.visibility,
            transform: modalStyles?.transform,
            zIndex: modalStyles?.zIndex,
            backgroundColor: modalStyles?.backgroundColor,
            margin: modalStyles?.margin,
            inViewport: modal ? isInViewport(modal) : false,
            boundingRect: modal?.getBoundingClientRect()
        },
        modalDialog: {
            exists: \!\!modalDialog,
            classes: modalDialog?.className,
            display: dialogStyles?.display,
            position: dialogStyles?.position,
            margin: dialogStyles?.margin,
            transform: dialogStyles?.transform,
            width: dialogStyles?.width,
            boundingRect: modalDialog?.getBoundingClientRect()
        },
        modalContent: {
            exists: \!\!modalContent,
            classes: modalContent?.className,
            display: contentStyles?.display,
            backgroundColor: contentStyles?.backgroundColor,
            boundingRect: modalContent?.getBoundingClientRect()
        },
        backdrop: {
            exists: \!\!modalBackdrop,
            classes: modalBackdrop?.className,
            display: modalBackdrop ? window.getComputedStyle(modalBackdrop).display : null,
            zIndex: modalBackdrop ? window.getComputedStyle(modalBackdrop).zIndex : null
        }
    };

    // Get any inline styles
    if (modal) {
        analysis.modal.inlineStyles = modal.getAttribute('style');
    }
    if (modalDialog) {
        analysis.modalDialog.inlineStyles = modalDialog.getAttribute('style');
    }

    return analysis;
  });
  
  console.log('Modal Analysis:', JSON.stringify(analysis, null, 2));
  
  await browser.close();
})();
