# Grid4 Portal Skin v5.0.11 - TODO List

## Current Status
- Version: 5.0.10
- Main CSS: `grid4-portal-skin-v5.0.css`
- Main JS: `grid4-portal-skin-v5.0.js`
- Using CDN for delivery: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/`

## User's Recent CSS Modifications
- Theme toggle button: 34x34px (increased from 24x24px)
- Button padding: changed to `5px 5px`
- Domain message container: padding `0px 65px`, using `inline-flex` with `flex-start`
- Font sizes adjusted: xs=9px, sm=11px, base=12px, md=15px, lg=16px
- Sidebar width: 225px

## Outstanding Issues to Fix

### 1. ⚡ Cache Busting Implementation
**Problem**: Inconsistent loading, sometimes reverting to previous iterations
**Symptoms**: Fixed issues reappear after refresh/reload
**Solution needed**: 
- Add version query parameters to CSS/JS URLs
- Consider using timestamp or git commit hash
- Handle CDN caching (Statically.io may cache aggressively)
- Add cache-control headers if possible

### 2. 🎨 Theme Switching White Strip Bug
**Problem**: White strip remains on right side when switching themes
**Screenshot**: https://ibb.co/hxckG1rY
**Details**: 
- Occurs when switching from light to dark (and vice versa)
- Fixed after page refresh
- Likely the `#content` area not updating its background
**Solution needed**: 
- Force repaint of all themed elements
- May need to trigger resize event
- Check if wrapper needs background update

### 3. 📊 Table Header Styling
**Problem**: Table headers are white in both themes
**Screenshots**: 
- https://ibb.co/HDf9CZ1z
- https://ibb.co/7x7fsYNc
**Requirements**:
- Headers should be primary blue color
  - Dark theme: `#00d4ff`
  - Light theme: `#0066cc`
- Text colors:
  - White text for non-clickable headers
  - Green text (#23A455) for clickable/sortable headers
- Currently email header shows as dark grey on white

### 4. 🔘 Special Button Styling (.color-primary)
**Problem**: Buttons with class `color-primary` show white/purple gradient with black text
**Screenshot**: https://ibb.co/4nvWtWNX
**Affected elements**:
```html
<button class="btn helpsy color-primary">Add User</button>
<button class="btn helpsy color-primary">Add Call Queue</button>
<a class="btn color-primary">Add Message</a>
<a class="btn color-primary">SNAPanalytics</a>
<input class="btn color-primary span2 saving saveBtn" type="submit" value="Save">
```
**Requirements**: 
- Primary blue background (theme-aware)
- Bold white text
- Remove gradient
- Consistent with other primary buttons

### 5. 🧭 Navigation Menu Refinement
**Problem**: Menu items need better alignment and polish
**Screenshot**: https://ibb.co/PzY5CkNZ
**Issues to fix**:
- Text and icons not properly aligned
- Inconsistent spacing
- Need independent font control for nav items
**Solution needed**:
- Consider using flexbox for perfect alignment
- Add CSS variables for nav-specific typography
- Ensure icons and text baseline align

### 6. 🪟 Modal Window Inconsistencies
**Problem**: Modals sometimes fully transparent, sometimes not theme-aware
**Screenshots**: 
- https://ibb.co/PsYNyrHk (transparent background issue)
- https://ibb.co/F4LJJ4tQ (theme inconsistency)
**Requirements**:
- Consistent semi-transparent backdrop
- Theme-aware modal content
- Proper text contrast in both themes
- Fix input fields and form elements in modals

## Technical Approach

### Cache Busting Strategy
```javascript
// In grid4-portal-skin-v5.0.js
const version = '5.0.11';
const timestamp = Date.now();
$('link[href*="grid4-portal-skin"]').each(function() {
    const href = $(this).attr('href');
    $(this).attr('href', href + '?v=' + version + '&t=' + timestamp);
});
```

### Theme Switch Fix
```javascript
// Force full repaint on theme switch
themeManager.switchTheme = function(newTheme) {
    $('#grid4-app-shell').removeClass('theme-light theme-dark').addClass(newTheme);
    // Force repaint
    $('#content').hide().show(0);
    $(window).trigger('resize');
};
```

### Table Header CSS
```css
/* Primary blue headers with proper text colors */
#grid4-app-shell .table thead th {
    background-color: var(--accent-primary) !important;
    color: #ffffff !important;
}

/* Green color for sortable headers */
#grid4-app-shell .table thead th a,
#grid4-app-shell .table thead th.sortable {
    color: #23A455 !important;
}
```

### Color-Primary Button Fix
```css
/* Override NetSapiens color-primary gradient */
#grid4-app-shell .btn.color-primary {
    background: var(--accent-primary) !important;
    background-image: none !important;
    color: #ffffff !important;
    font-weight: bold !important;
    border-color: var(--accent-primary) !important;
    text-shadow: none !important;
}
```

## Implementation Priority
1. **Cache busting** - Critical for testing
2. **Theme switch white strip** - Major visual bug
3. **Color-primary buttons** - High visibility issue
4. **Table headers** - Important for consistency
5. **Navigation alignment** - Polish issue
6. **Modal theming** - Complex but important

## Notes
- All fixes must be scoped to `#grid4-app-shell`
- Use `!important` where needed to override NetSapiens
- Test in both light and dark themes
- Maintain Bootstrap compatibility