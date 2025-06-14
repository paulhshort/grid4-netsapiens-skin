# NetSapiens Portal Testing Guide

## Overview
This guide provides comprehensive testing procedures for the Grid4 NetSapiens portal customization, focusing on manual testing approaches since browser automation MCPs are not available.

## Testing Credentials
- **Portal URL**: https://portal.grid4voice.ucaas.tech/portal/home
- **Test Account**: 1002@grid4voice / hQAFMdWXKNj4wAg
- **Environment**: Sandbox/Development

## Manual Testing Procedures

### 1. Pre-Testing Setup
1. Open browser developer tools (F12)
2. Navigate to the Console tab for error monitoring
3. Navigate to the Network tab to monitor resource loading
4. Log into the portal using test credentials

### 2. Core UI Components Testing

#### A. Sidebar Navigation
**Test Objectives**: Verify the horizontal navigation has been transformed into a vertical sidebar

**Test Steps**:
1. Verify sidebar appears on the left side (width: 220px)
2. Check all navigation items are visible and properly styled
3. Test hover states on navigation items
4. Verify active/current page highlighting
5. Ensure FontAwesome icons are displayed correctly

**Expected Results**:
- Dark themed sidebar with Grid4 branding
- Smooth hover transitions
- Clear visual indication of active page
- All icons render properly

#### B. Mobile Responsiveness
**Test Objectives**: Verify mobile-friendly behavior

**Test Steps**:
1. Resize browser window to < 768px width
2. Verify sidebar collapses/hides
3. Check for hamburger menu toggle button
4. Test menu toggle functionality
5. Verify content area adjusts properly

**Expected Results**:
- Sidebar hidden on mobile
- Toggle button appears and functions
- Content area uses full width
- No horizontal scrolling

#### C. Modal Dialogs
**Test Objectives**: Verify modal styling and avoid white-on-white issues

**Test Steps**:
1. Open various modal dialogs (Add User, Settings, etc.)
2. Verify modal background/overlay
3. Check text visibility and contrast
4. Test form elements within modals
5. Verify close button functionality

**Expected Results**:
- Dark themed modal background
- High contrast text (no white-on-white)
- Properly styled form elements
- Functional close mechanisms

#### D. Data Tables
**Test Objectives**: Verify table styling and functionality

**Test Steps**:
1. Navigate to pages with data tables (Call History, User Management)
2. Check table headers and row styling
3. Test row hover effects
4. Verify sorting functionality (if applicable)
5. Check table responsiveness

**Expected Results**:
- Dark themed table styling
- Clear row separation
- Functional hover effects
- Responsive table behavior

#### E. Form Elements
**Test Objectives**: Verify form styling and functionality

**Test Steps**:
1. Navigate to forms (User Profile, Settings)
2. Test input field styling and focus states
3. Check dropdown menus
4. Verify button styling
5. Test form validation messages

**Expected Results**:
- Consistent dark theme styling
- Clear focus indicators
- Properly styled validation messages
- Functional form submission

### 3. Performance Testing

#### A. CSS Loading
**Test Objectives**: Verify custom CSS loads properly

**Test Steps**:
1. Monitor Network tab during page load
2. Verify `grid4-netsapiens.css` loads successfully
3. Check for any 404 errors
4. Measure load time

**Expected Results**:
- CSS file loads without errors
- Reasonable load time (< 2 seconds)
- No console errors related to styling

#### B. JavaScript Execution
**Test Objectives**: Verify custom JavaScript executes without errors

**Test Steps**:
1. Monitor Console tab for JavaScript errors
2. Verify `grid4-netsapiens.js` loads successfully
3. Check for any unhandled promise rejections
4. Test AJAX navigation (if applicable)

**Expected Results**:
- No JavaScript errors in console
- Custom functionality works as expected
- AJAX content properly styled

### 4. Cross-Browser Testing

#### A. Browser Compatibility
**Test Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Steps**:
1. Repeat core UI testing in each browser
2. Check for browser-specific styling issues
3. Verify JavaScript functionality
4. Test mobile view in each browser

#### B. Device Testing
**Test Devices**:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### 5. Regression Testing Checklist

Use this checklist after any NetSapiens platform updates:

- [ ] Sidebar renders correctly
- [ ] Navigation hover states work
- [ ] Active page highlighting functions
- [ ] Mobile toggle button appears and works
- [ ] Modal dialogs styled correctly
- [ ] No white-on-white text issues
- [ ] Form elements properly styled
- [ ] Table styling intact
- [ ] No JavaScript console errors
- [ ] AJAX content properly styled
- [ ] FontAwesome icons display correctly

### 6. Debugging Procedures

#### A. CSS Issues
1. Use browser developer tools to inspect elements
2. Check for conflicting styles
3. Verify CSS specificity
4. Look for missing `!important` declarations

#### B. JavaScript Issues
1. Check console for error messages
2. Verify jQuery is loaded
3. Check for timing issues with DOM ready
4. Verify custom functions are executing

### 7. Documentation Requirements

#### A. Issue Reporting
When reporting issues, include:
- Browser and version
- Device type and screen resolution
- Steps to reproduce
- Expected vs actual behavior
- Screenshot or video if applicable

#### B. Change Tracking
Document any changes made:
- Date of change
- Reason for change
- Files modified
- Testing results

## Tools and Resources

### Browser Developer Tools
- **Elements Tab**: Inspect HTML/CSS
- **Console Tab**: Monitor JavaScript errors
- **Network Tab**: Monitor resource loading
- **Application Tab**: Check localStorage/sessionStorage

### Testing URLs
- **Main Portal**: https://portal.grid4voice.ucaas.tech/portal/home
- **CSS File**: Direct link to your hosted CSS file
- **JS File**: Direct link to your hosted JS file

### Reference Files
- **Current CSS**: `/home/paul/dev/grid4-netsapiens-skin/grid4-netsapiens.css`
- **Current JS**: `/home/paul/dev/grid4-netsapiens-skin/grid4-netsapiens.js`
- **Backup Files**: Various versioned files in project directory

## Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Sidebar not appearing | CSS not loading | Check CSS file path in NetSapiens config |
| White text on white background | Insufficient CSS specificity | Add `!important` or increase selector specificity |
| JavaScript errors | jQuery not loaded | Verify jQuery is available before executing custom code |
| Mobile view not working | CSS media queries not applied | Check browser compatibility and CSS syntax |
| Icons not displaying | FontAwesome CDN blocked | Host FontAwesome locally or use different CDN |

## Next Steps

1. **Immediate**: Run through the complete testing checklist
2. **Short-term**: Set up automated screenshot comparison (if tools become available)
3. **Long-term**: Consider implementing a more robust testing framework

## Notes

- This testing approach compensates for the lack of browser automation tools
- Manual testing requires discipline but provides thorough coverage
- Regular testing prevents issues from accumulating
- Documentation is crucial for team collaboration and maintenance