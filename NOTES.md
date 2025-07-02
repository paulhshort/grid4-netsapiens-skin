# Grid4 NetSapiens Portal Skin - Development Notes

## Current Critical Issue: Modal Positioning (2025-01-02)

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

### Root Cause Analysis
The issue appears to be related to our modal positioning CSS that's trying to work against Bootstrap 3's default behavior:
1. Our CSS in lines 1649-1668 is still interfering with Bootstrap's positioning
2. The modal is not properly centered due to conflicting CSS rules
3. Bootstrap 3 expects specific structure that our CSS is disrupting

### Next Steps
1. Completely remove all custom modal positioning CSS
2. Only keep modal theming (colors, borders, etc.)
3. Let Bootstrap handle ALL positioning logic
4. Test with minimal CSS to confirm fix
5. Add back theming without touching position/transform/margin properties

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