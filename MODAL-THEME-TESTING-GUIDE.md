# Modal Theme Testing Guide - v5.0.11

## Summary of Changes

### 1. CSS Modal Theming (Section 16 added to grid4-portal-skin-v5.0.11.css)
- **Comprehensive dark theme support** for all modal types (Bootstrap & jQuery UI)
- **Precise selectors** using `body.theme-dark` prefix for high specificity
- **Form element theming** - inputs, textareas, selects with dark backgrounds
- **Label transparency fix** - forced transparent backgrounds on all labels
- **Button theming** - dark theme appropriate button colors
- **Light theme consistency** - ensures white backgrounds in light mode

### 2. JavaScript Auto-Refresh (grid4-portal-skin-v5.0.11.js)
- **Smart refresh logic** - checks for open modals before refreshing
- **User warning** - if modals are open, warns about potential data loss
- **Automatic refresh** - if no modals open, refreshes after 300ms delay

## Manual Testing Checklist

### Dark Theme Modal Tests

1. **Login and Set Dark Theme**
   - [ ] Navigate to https://portal.grid4voice.net/portal/home
   - [ ] Login with your credentials
   - [ ] Ensure dark theme is active (dark sidebar/background)

2. **Test "Add User" Modal**
   - [ ] Click Users → Add
   - [ ] Verify modal has dark background (#242b3a)
   - [ ] Check form inputs have dark backgrounds (#1a2332)
   - [ ] Confirm labels have transparent backgrounds (no white boxes)
   - [ ] Test input focus states (should have cyan border)
   - [ ] Close modal with ESC or X button

3. **Test "Add Call Queue" Modal**
   - [ ] Click Call Center → Call Queues → Add
   - [ ] Verify dark theme is applied consistently
   - [ ] Check radio buttons and their labels
   - [ ] Confirm no white backgrounds on form elements

4. **Test "Add Time Frame" Modal**
   - [ ] Click System → Schedules → Add
   - [ ] Check all form elements are properly themed
   - [ ] Verify help text is readable (muted color)

5. **Test Complex Modals**
   - [ ] Try editing an existing user or phone
   - [ ] Check tables within modals (if any)
   - [ ] Verify all sections maintain dark theme

### Light Theme Modal Tests

1. **Switch to Light Theme**
   - [ ] Click the theme toggle button
   - [ ] Accept the refresh dialog if it appears
   - [ ] Verify light theme is active (white background)

2. **Repeat Modal Tests**
   - [ ] Test same modals as above
   - [ ] Verify white backgrounds (#ffffff)
   - [ ] Check form inputs have appropriate light theme
   - [ ] Confirm text is dark and readable

### Theme Switching Tests

1. **Test Auto-Refresh**
   - [ ] In dark theme, open a modal
   - [ ] Click theme toggle while modal is open
   - [ ] Verify warning dialog appears about unsaved data
   - [ ] Test both "OK" (refresh) and "Cancel" options

2. **Test Without Modals**
   - [ ] Close all modals
   - [ ] Click theme toggle
   - [ ] Verify page refreshes automatically after brief delay

## Known Issues to Verify Fixed

Based on the screenshots analyzed:

1. **White modal backgrounds in dark theme** - Should now be dark (#242b3a)
2. **Label backgrounds showing as white boxes** - Should now be transparent
3. **Form inputs with light backgrounds** - Should now match theme
4. **Poor contrast in dark theme** - Text should be light gray (#e9ecef)
5. **Browse button styling** - File inputs should be themed

## CSS Selectors Used

Key selectors for reference:
```css
/* Dark theme modal backgrounds */
body.theme-dark .modal .modal-content
body.theme-dark .ui-dialog

/* Form elements */
body.theme-dark .modal input[type="text"]
body.theme-dark .modal textarea
body.theme-dark .modal select

/* Labels - forced transparent */
body.theme-dark .modal label {
  background-color: transparent !important;
}
```

## If Issues Persist

1. **Clear browser cache** - CSS might be cached
2. **Check browser console** - Look for any CSS loading errors
3. **Verify Azure deployment** - Ensure https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/ serves latest files
4. **Check CSS specificity** - Use browser DevTools to see if styles are being overridden

## Success Criteria

- ✅ All modals have consistent theming in both light and dark modes
- ✅ No white/light elements appearing in dark theme modals
- ✅ Labels have transparent backgrounds (no boxes)
- ✅ Form elements are properly styled for each theme
- ✅ Theme switching triggers page refresh for complete re-theming
- ✅ User is warned about data loss if switching themes with open modals