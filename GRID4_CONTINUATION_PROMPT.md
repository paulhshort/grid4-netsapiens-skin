# Grid4 NetSapiens Portal Customization - Continuation Prompt

## Current Project Status

You are continuing work on the **Grid4 NetSapiens Portal Customization** project. This is a comprehensive portal skin that enhances the NetSapiens Manager portal with Grid4 branding, improved UI/UX, and modern functionality.

### Repository Information
- **Repository**: `grid4-netsapiens-skin` 
- **Current Version**: v4.2.3
- **Main Files**: 
  - `grid4-portal-skin-v4.js` (JavaScript customizations)
  - `grid4-portal-skin-v4.css` (CSS styling)
- **Deployment**: Files are served via CDN at `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/`

### Testing Environment Setup

**CRITICAL**: This project uses Playwright for testing. The testing environment is already configured:

1. **Login Credentials**:
   - URL: `https://portal.grid4voice.ucaas.tech/portal/login`
   - Username: `1002@grid4voice`
   - Password: `hQAFMdWXKNj4wAg`

2. **Test Domain**: `Grid4_sunday_Test` 
   - Full URL: `https://portal.grid4voice.ucaas.tech/portal/domains/manage/Grid4_sunday_Test/Migration+domain+for+Grid4+Communications`

3. **Testing Pattern**: Use Playwright to create test scripts that:
   - Login to the portal
   - Navigate to the Grid4_sunday_Test domain
   - Inject fresh versions of CSS/JS with cache busters
   - Test functionality and take screenshots

4. **Cache Busting**: Always use strong cache busters when testing:
   ```javascript
   const cacheBuster = `?v=4.2.3&cb=${Date.now()}&r=${Math.random()}`;
   ```

## Current Task Status

### ✅ Completed Tasks:
1. **Debug and Fix Logo Display Issue** - PARTIALLY COMPLETE
2. **Performance and Compatibility Optimization** - COMPLETE
3. **Code Quality and Testing** - IN PROGRESS

### ❌ Critical Issues Requiring Immediate Attention:

#### 1. **LOGO ISSUE - NOT FULLY RESOLVED**
**IMPORTANT**: The logo integration is NOT working correctly. The current implementation shows an old Grid4 logo, but it should display the **logo_option_001.png** image that is properly configured in the NetSapiens system settings.

**Problem**: 
- When Grid4 customizations are disabled, the correct "Grid4 SmartComm" logo displays properly
- When Grid4 customizations are enabled, it shows an incorrect/old Grid4 logo
- The system should use the `#header-logo` element with the correct image from NetSapiens system

**Required Fix**:
- Use the NetSapiens built-in logo selector system
- Properly relocate/resize the `#header-logo` element to navigation
- Ensure it displays the correct logo_option_001.png image
- The logo should appear as "Grid4 SmartComm" branding

#### 2. **CONTACTS DOCK CRITICAL ISSUE**
The contacts dock has severe styling and functionality problems:

**Visual Issues**:
- Incorrect styling and layout
- "Unable to connect to contacts server" error styling
- Poor visual hierarchy and spacing

**Functional Issues**:
- **Dock will not collapse/close** when Grid4 JS/CSS is injected
- Toggle buttons are non-functional
- Conflicts with native NetSapiens JavaScript

**Root Cause**: Event handling conflict between Grid4 custom JS and NetSapiens native `minimizeDockPopup()` function.

**Required Solution**: 
- Delegate to native NetSapiens `minimizeDockPopup()` function instead of custom CSS manipulation
- Find and trigger native `.dock-minimize` button clicks
- Maintain visual enhancements while preserving native functionality
- Fix styling conflicts that break the dock appearance

## Remaining Tasks

### 🔄 Task 3: Code Quality and Testing (IN PROGRESS)
- Fix logo integration to use correct logo_option_001.png
- Resolve contacts dock styling and functionality issues
- Ensure all debug functions work properly
- Test hamburger menu functionality thoroughly
- Verify Grid4 customizations load correctly in Grid4_sunday_Test domain

### 📋 Task 4: Deployment and Validation
- Use GitHub CLI (`gh`) to commit and push changes
- Increment version numbers appropriately (currently at v4.2.3)
- Test deployed changes in live NetSapiens portal environment
- Take screenshots to document working implementation

### 🧪 Task 5: Final Testing Requirements
- Test login flow with provided credentials
- Verify customizations work in Grid4_sunday_Test domain
- Confirm correct logo displays and hamburger menu functions
- Document remaining issues and recommendations

## Technical Context

### Current Architecture
- **Namespace**: `window.G4` and `window.Grid4Portal`
- **Initialization**: Multiple strategies (document ready, window load, immediate, fallback)
- **Logo Integration**: DOM cloning and relocation strategies
- **UI Enhancements**: Hamburger menu, refresh button, contacts dock improvements
- **Error Handling**: NetSapiens voice JS 404 error handling, moment.tz fallbacks

### Key Files Structure
```
grid4-portal-skin-v4.js (Main JavaScript - ~2000+ lines)
├── G4.config (Configuration)
├── G4.utils (Utilities and helpers)
├── G4.logo (Logo integration strategies)
├── G4.uiEnhancements (UI improvements)
├── G4.contactsDock (Contacts dock enhancements)
├── G4.hamburgerMenu (Mobile navigation)
└── Auto-initialization logic

grid4-portal-skin-v4.css (Main Stylesheet)
├── CSS Variables (Grid4 color scheme)
├── Navigation enhancements
├── Logo fallback strategies
├── Contacts dock styling
├── Responsive design
└── UI component improvements
```

## Immediate Next Steps

1. **Create Playwright test** to reproduce logo and contacts dock issues
2. **Fix logo integration** to use correct logo_option_001.png from NetSapiens system
3. **Resolve contacts dock** functionality by delegating to native NetSapiens functions
4. **Test thoroughly** and document all changes
5. **Commit and deploy** fixes with proper version incrementing

## Contacts Dock Fix - Technical Details

### Root Cause Analysis
The contacts dock collapse/expand functionality fails because of **event handling conflicts** between Grid4 custom JavaScript and NetSapiens native JavaScript.

**Native NetSapiens Behavior**:
- Uses `minimizeDockPopup(this)` function for dock control
- Attaches click handlers to `.dock-head-title` and `.dock-minimize` elements
- Manages internal state and CSS properties through native functions

**Grid4 Custom Behavior**:
- Creates custom `.grid4-dock-toggle` button
- Uses custom `toggleDock()` function with direct CSS manipulation
- Conflicts with native state management

### Required Fix Implementation

**Key Changes Needed in `grid4-portal-skin-v4.js`**:

1. **Find Native Button**: Locate `.dock-minimize` button in `.dock-head-buttons`
2. **Delegate to Native**: Trigger native button click instead of custom CSS manipulation
3. **Hide Native Button**: Hide original button to prevent UI confusion
4. **Sync State**: Update custom toggle icon based on native state changes

**Critical Code Pattern**:
```javascript
// In toggleDock() function - delegate to native
if (this.nativeMinimizeButton && this.nativeMinimizeButton.length > 0) {
    this.nativeMinimizeButton.trigger('click'); // Trigger native function
    // Update custom UI after native state change
    setTimeout(() => {
        // Sync custom toggle icon with native state
        this.updateToggleIcon();
    }, G4.config.timing.fast);
}
```

**Testing Requirements**:
- Verify dock collapses/expands correctly with custom toggle
- Ensure no visual flickering or race conditions
- Confirm state persistence across page reloads
- Test both connected and "Unable to connect" states

## Important Notes

- Always test with fresh browser sessions to avoid cache issues
- Use strong cache busters when injecting updated files
- Monitor console for Grid4-related messages and errors
- Take screenshots to document before/after states
- Maintain backward compatibility with NetSapiens native functionality
- Prioritize user experience and visual consistency

## Memory Context
- NetSapiens portal has constraints: only PORTAL_EXTRA_JS and PORTAL_CSS_CUSTOM fields available
- User prefers dynamic loader approach over concatenated files
- Grid4 logo should be sourced from NetSapiens system settings, not hardcoded URLs
- Contacts dock issues are blocking user adoption
- Testing should be done in Grid4_sunday_Test domain context
- Use GitHub CLI (`gh cli`) for repository operations and commits
