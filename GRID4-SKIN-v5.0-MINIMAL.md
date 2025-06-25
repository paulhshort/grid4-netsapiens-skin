# Grid4 NetSapiens Portal Skin v5.0 - MINIMAL APPROACH

## Complete Rewrite

### Problem with v4.x
- Too much CSS breaking NetSapiens functionality
- Trying to style everything caused conflicts
- Dock, dropdowns, tables all broken
- Each fix made it worse

### v5.0 Solution: MINIMAL
- ONLY transform navigation to sidebar
- DON'T touch anything else
- Let NetSapiens handle all other styling
- Total: ~100 lines of CSS instead of 2700+

## What v5.0 Does

### 1. Sidebar Navigation
- Converts horizontal nav to vertical sidebar (240px wide)
- Fixed position on left side
- Light/dark theme support for sidebar only

### 2. Content Adjustment  
- Pushes content right by 240px for sidebar
- That's it

### 3. Theme Toggle
- Simple button at bottom of sidebar
- Switches between light/dark themes
- Saves preference

## What v5.0 Does NOT Do
- ❌ Style buttons
- ❌ Style forms  
- ❌ Style tables
- ❌ Touch the dock
- ❌ Style dropdowns
- ❌ Move user toolbar
- ❌ Override NetSapiens styles

## Result
- Clean sidebar navigation
- Everything else works like stock NetSapiens
- No broken functionality
- No overlapping elements
- No positioning issues

## Files
- `grid4-minimal-v5.0.css` (86 lines)
- `grid4-minimal-v5.0.js` (44 lines)

## Deploy
Use these files instead of the bloated v4.x versions