import { test, expect } from '@playwright/test';

test('Manual contacts dock check', async ({ page }) => {
  console.log('🔍 Opening portal for manual navigation...');
  
  // Just open the portal
  await page.goto('https://portal.grid4voice.ucaas.tech');
  
  console.log('👤 Please login manually and navigate to:');
  console.log('https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_Monday_test2/Migration+domain+for+Grid4+Communications');
  console.log('');
  console.log('🎯 Once you see the custom dark theme applied, I will:');
  console.log('  1. Take screenshots of the contacts dock');
  console.log('  2. Check console errors');
  console.log('  3. Test theme toggle');
  console.log('  4. Test page navigation for FOUC');
  console.log('');
  console.log('⏱️  You have 3 minutes to navigate...');
  
  // Wait for manual navigation (3 minutes)
  await page.waitForTimeout(180000);
  
  // Check if we're in the right place (custom CSS should be loaded)
  const hasCustomCSS = await page.evaluate(() => {
    // Check if Grid4 theme class exists
    return document.documentElement.classList.contains('theme-dark') || 
           document.documentElement.classList.contains('theme-light') ||
           document.body.classList.contains('grid4-portal-active');
  });
  
  if (!hasCustomCSS) {
    console.log('❌ Custom CSS not detected. Please ensure you navigated to the Grid4_Monday_test2 domain.');
    return;
  }
  
  console.log('✅ Custom CSS detected! Starting checks...');
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'test-results/portal-with-custom-css.png', 
    fullPage: true 
  });
  
  // Check for contacts dock
  const contactsDock = page.locator('.dock-popup, #dock-popup').first();
  
  if (await contactsDock.count() > 0) {
    console.log('📞 Contacts dock found! Taking specific screenshot...');
    
    // Take screenshot of contacts dock
    await contactsDock.screenshot({ 
      path: 'test-results/contacts-dock-styled.png' 
    });
    
    // Get styles
    const dockStyles = await contactsDock.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        display: computed.display,
        visibility: computed.visibility,
        borderColor: computed.borderColor
      };
    });
    
    console.log('🎨 Contacts dock styles:', dockStyles);
    
    // Check if our theme colors are applied
    const isThemed = dockStyles.backgroundColor.includes('26, 35, 50') || // Dark theme
                    dockStyles.backgroundColor.includes('248, 249, 250'); // Light theme
    
    if (isThemed) {
      console.log('✅ Contacts dock appears to be themed correctly!');
    } else {
      console.log('⚠️  Contacts dock may not be fully themed');
    }
  } else {
    console.log('📞 Contacts dock not visible. You may need to open it manually.');
  }
  
  // Test theme toggle
  const themeToggle = page.locator('#grid4-theme-toggle');
  if (await themeToggle.count() > 0) {
    console.log('🌓 Testing theme toggle...');
    
    const beforeTheme = await page.evaluate(() => 
      document.documentElement.className
    );
    
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const afterTheme = await page.evaluate(() => 
      document.documentElement.className
    );
    
    if (beforeTheme !== afterTheme) {
      console.log('✅ Theme toggle is working!');
    } else {
      console.log('❌ Theme toggle may not be working');
    }
    
    // Take screenshot after theme change
    await page.screenshot({ 
      path: 'test-results/after-theme-toggle.png', 
      fullPage: true 
    });
  }
  
  // Check console errors
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`ERROR: ${msg.text()}`);
    } else if (msg.type() === 'warn') {
      consoleMessages.push(`WARN: ${msg.text()}`);
    }
  });
  
  // Wait to collect any errors
  await page.waitForTimeout(2000);
  
  if (consoleMessages.length > 0) {
    console.log('⚠️  Console messages found:');
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
  } else {
    console.log('✅ No console errors detected');
  }
  
  // Test navigation for FOUC
  console.log('🔄 Testing navigation for FOUC...');
  
  // Click on Users or another nav item
  const usersLink = page.locator('a[href*="users"], #nav-buttons a').first();
  if (await usersLink.count() > 0) {
    // Take rapid screenshots during navigation
    await usersLink.click();
    
    for (let i = 0; i < 3; i++) {
      await page.screenshot({ 
        path: `test-results/navigation-${i}.png` 
      });
      await page.waitForTimeout(200);
    }
    
    console.log('📸 Navigation screenshots captured');
  }
  
  console.log('🎉 Testing complete! Check test-results/ for screenshots.');
});