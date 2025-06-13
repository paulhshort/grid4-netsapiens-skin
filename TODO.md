# Grid4 NetSapiens Portal Theme v3 - Development TODO

## Project Overview
Complete overhaul of NetSapiens Manager Portal custom theme to fix critical functionality bugs and implement polished dark UI based on SmartComm target screenshot.

## Critical Issues to Fix
1. **JavaScript Freezes**: Portal hangs/freezes during navigation due to destructive JS conflicting with AJAX
2. **Layout Issues**: Left navigation pushed down with large gap at top  
3. **Text Contrast**: Dark text on dark backgrounds making UI unusable

## Target Aesthetic (SmartComm Screenshot)
- **Two-Tone Dark Theme**: Very dark body (`#1c1e22`) + lighter panels (`#2a3038`)
- **Flat & Minimalist**: No borders, gradients, or box-shadows
- **High-Contrast Typography**: Bright white text (`#f8f9fa`) on dark surfaces
- **Perfect Vertical Centering**: All navigation items must be centered

## Core Technical Constraints
- **Non-Destructive JS**: Must find/modify existing elements, never delete/replace
- **Hard-Coded Dark Theme**: No user-selectable backgrounds
- **Asset Paths**: Use GitHub CDN: `https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/reference/`
- **FontAwesome Icons**: Use existing FA font, no custom PNGs
- **jQuery 1.8.3 Compatibility**: Portal uses old jQuery version

## Development Progress

### ✅ Completed Tasks
- Created comprehensive TODO tracking system
- Analyzed existing broken theme files (Cirrus and Grid4 v2.1.1)
- Created grid4-custom-v3.css with complete two-tone dark theme
- Implemented navigation sidebar with perfect vertical centering
- Styled all panels/widgets/modals with flat dark aesthetic
- Fixed text contrast issues with high-specificity CSS rules
- Created non-destructive grid4-custom-v3.js initialization system
- Implemented addPageSpecificBodyClasses() for dynamic CSS targeting
- Implemented shortenMenuLabels() with comprehensive error handling
- Added MutationObserver + AJAX handlers for dynamic content

### ✅ COMPLETED - All Major Tasks
**STATUS: READY FOR PRODUCTION DEPLOYMENT**

### Key Screenshots Analysis (SmartComm Target)
**Perfect Target Aesthetic Confirmed:**
- **Two-tone colors**: Body #1c1e22 (darkest) + Panels #2a3038 (lighter dark)
- **100% Flat Design**: Zero borders, gradients, shadows, or styling effects
- **High Contrast Text**: Bright white (#f8f9fa) text on all dark surfaces
- **Navigation**: Perfect vertical sidebar with centered menu items
- **Form Issues Identified**: Dark text on dark backgrounds (Screenshot 3) - SOLVED in v3.css

### 🛡️ Zen Code Review Fixes Applied
**HIGH Priority Stability Fixes Completed:**
- ✅ Removed overly aggressive CSS `*` selectors to prevent icon/plugin breakage
- ✅ Fixed `addPageSpecificBodyClasses()` to be truly non-destructive
- ✅ Removed redundant JavaScript hover handlers (CSS handles this better)
- ✅ Minimized global namespace pollution
- ✅ Eliminated duplicate CSS rules

## Key Files to Create
- `grid4-custom-v3.css` - Complete dark theme CSS
- `grid4-custom-v3.js` - Non-destructive JavaScript functionality

## Design System Variables
```css
:root {
    --g4-primary-blue: #007bff;
    --g4-accent-orange: #fd7e14;
    --g4-accent-green: #28a745;
    --g4-dark-panel: #2a3038;  /* Panels/sidebar */
    --g4-dark-bg: #1c1e22;     /* Body background */
    --g4-text-light: #f8f9fa;
    --g4-text-muted: #adb5bd;
    --g4-sidebar-width: 220px;
    --g4-header-height: 60px;
}
```

## Menu Label Mappings
- "Auto Attendants" → "Attendants"
- "Call Queues" → "Queues"  
- "Music On Hold" → "Hold Music"
- "Time Frames" → "Schedules"
- "Route Profiles" → "Routing"

## Success Criteria Checklist
- [ ] Left menu correctly positioned with vertical centering
- [ ] Two-tone flat dark theme matches SmartComm screenshot
- [ ] All text has high contrast and perfect readability
- [ ] Zero UI freezes or hangs - 100% stability
- [ ] Menu labels correctly shortened with error handling
- [ ] Page-specific body classes work on load + AJAX navigation
- [ ] Clean, commented code with correct CDN paths

## Knowledge Base
- NetSapiens Portal: CakePHP 1.3.x with jQuery 1.8.3
- Customization via CSS/JS injection through UI config
- FontAwesome icons already loaded by base portal
- Previous attempts based on "Cirrus" theme were destructive
- Portal uses AJAX for content rendering - must not interfere

## CSP Configuration Discovery
**CRITICAL: CSP (Content Security Policy) blocks external resources!**

### Required CSP Settings
Configure these in NetSapiens Portal Settings to allow external resources:

**PORTAL_CSP_IMG_ADDITIONS**
```
https://grid4.com https://cdn.statically.io https://statically.io https://*.githubusercontent.com https://raw.githubusercontent.com
```

**PORTAL_CSP_STYLE_ADDITIONS**  
```
https://fonts.googleapis.com https://cdn.statically.io https://statically.io https://*.googleapis.com 'unsafe-inline'
```

**PORTAL_CSP_SCRIPT_ADDITIONS**
```
https://cdn.statically.io https://statically.io https://*.githubusercontent.com https://raw.githubusercontent.com 'unsafe-inline' 'unsafe-eval'
```

**PORTAL_CSP_FONT_ADDITIONS**
```
https://fonts.gstatic.com https://fonts.googleapis.com https://*.gstatic.com
```

**PORTAL_CSP_CONNECT_ADDITIONS**
```
https://cdn.statically.io https://statically.io https://grid4.com https://*.githubusercontent.com
```

### Why This Matters
- Logo replacement blocked by img-src CSP
- Google Fonts blocked by font-src CSP  
- External icons blocked by img-src CSP
- CDN script loading blocked by script-src CSP

## Session Notes
- Starting comprehensive theme overhaul
- Focus on non-destructive approach to prevent freezes
- Target is stable, beautiful, functional dark theme
- **BREAKTHROUGH**: Discovered CSP blocking external resources!