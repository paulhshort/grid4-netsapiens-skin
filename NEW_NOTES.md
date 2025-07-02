# Grid4 NetSapiens Portal Skin - Development Notes

## Current Critical Issue: Modal Positioning (2025-07-02)

### Problem Description
Modals are displaying incorrectly with multiple issues:
1. Modal appears half off the right side of the screen
2. Modal is too tall vertically
3. Cannot interact with modal content properly
4. Issue is so severe that custom CSS/JS had to be removed to access account settings

### Test Environment
- URL: https://portal.grid4voice.net/portal/home
- Login: 321@grid4.com / 2107Cr00ks!
- Browser: Google Chrome (login saved)
- Testing method: Click "Add Users" button on Users page

### Visual Evidence
- Modal displaying half off right side: https://ibb.co/zHPt3xgR
- Modal too tall vertically: https://ibb.co/bgPPXYHn
- Had to remove customizations to change password: https://ibb.co/gM4BfbB9
- Settings showing removed customizations: https://ibb.co/dw6KptdK, https://ibb.co/S4zdnrvn
- My Account modal issues: https://ibb.co/jmDYRSS
- How modal SHOULD look (without customizations): https://ibb.co/hxbMKJTv

### Previous Attempts
1. **Initial Issue**: Modals appeared off to the left side
2. **First Fix Attempt**: Removed transform-based centering, restored Bootstrap defaults
   - Changed .modal to fill viewport (100% width/height)
   - Let .modal-dialog use margin: auto for centering
   - Removed JS that moved modals outside #grid4-app-shell
3. **Result**: Now modals appear half off the RIGHT side instead

### Technical Context
- NetSapiens uses Bootstrap 3.3.2
- Standard Bootstrap modal structure:
  - `.modal` (position: fixed, full viewport overlay)
  - `.modal-dialog` (centered with margin: auto)
  - `.modal-content` (actual content box)

### Current Files
- **grid4-portal-skin-v5.0.11.css**: Contains modal positioning CSS (lines 1649-1703)
- **grid4-portal-skin-v5.0.11.js**: Contains modal theming/management code

### Infrastructure
- Hosting: Azure Static Web Apps
- URL: https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/
- Files: grid4-portal-skin-v5.0.11.css and grid4-portal-skin-v5.0.11.js

### Key Findings
1. Our CSS is interfering with Bootstrap's modal positioning
2. The modal is not properly contained within the viewport
3. Possible conflict between our scoped styles (#grid4-app-shell) and global modal styles

### Playwright Testing Results (2025-01-02)
- Successfully logged into portal: https://portal.grid4voice.net/portal/home
- Tested "Add User" modal on Users page
- Modal is displaying cut off on the LEFT side (not right as initially reported)
- Modal form is visible but positioned incorrectly
- Screenshot saved showing the issue

### Root Cause Analysis - Updated
After multiple attempts, we've identified several issues:
1. We had DUPLICATE modal positioning CSS in two different sections (removed)
2. Our transform-based centering was fighting Bootstrap's margin: auto system
3. Z-index management was creating stacking context issues
4. The modal positioning might also be affected by:
   - The #grid4-app-shell wrapper with its own positioning context
   - JavaScript that modifies modal behavior
   - Possible conflicts with NetSapiens' own modal handling

### CSS Changes Made
1. Removed ALL custom modal positioning from lines 1544-1591
2. Removed modal positioning from lines 1649-1703
3. Only kept modal theming (colors, borders)
4. Let Bootstrap handle all positioning/animations

### Potential Remaining Issues
1. **pointer-events: none on #grid4-app-shell** (line 1598) - This could prevent interaction if modal is inside the shell
2. **JavaScript modal handling** - Need to ensure JS isn't interfering with Bootstrap's modal behavior
3. **App shell positioning context** - The fixed positioning of navigation/header might affect modal stacking

### Next Steps
1. Test if removing pointer-events: none helps
2. Verify modal is being rendered in correct DOM location (should be direct child of body)
3. Check if NetSapiens has custom modal handling that conflicts with our theming
4. Consider minimal test case with ONLY modal theming, no other customizations
5. Use browser DevTools to compare computed styles between working (no skin) and broken (with skin) states

### Important Notes
- Modals MUST work properly as they're critical for user workflows
- The issue affects all modals in the portal (Add Users, My Account, etc.)
- Previous fix made the problem worse (moved from left side to right side)
- Bootstrap 3 expects specific modal structure - we must work WITH it, not against it

### Testing Checklist
- [ ] Modal appears centered horizontally
- [ ] Modal appears centered vertically
- [ ] Modal is fully contained within viewport
- [ ] Modal content is interactive (can click buttons, fill forms)
- [ ] Modal backdrop covers entire viewport
- [ ] Modal works on different screen sizes
- [ ] Multiple modals can stack properly
- [ ] Modal animations work correctly

### Configuration Parameters
- `PORTAL_CSS_CUSTOM`: URL to custom CSS file
- `PORTAL_EXTRA_JS`: URL to custom JavaScript file
- These are set in NetSapiens UI Configuration

## Session History

### 2025-01-02 Session Summary
1. Started with request to restore v4.5.1 files and update logo
2. Created v5.0.11 with fixes (failed due to breaking changes)
3. Reverted to v5.0 base and applied only non-breaking fixes
4. Updated all URLs from GitHub to Azure Static Web Apps
5. Attempted to fix modal positioning issue (ongoing)

### Key Decisions
- Use #grid4-app-shell for scoping to prevent style leakage
- Maintain CSS custom properties for theming
- Work WITH Bootstrap's modal system, not against it
- Keep domain banner compact styling from v5.0
- Don't duplicate navigation icons