
# Netsapiens Manager Portal  
## Custom CSS & JS Injection — Context & Technical Specification

---

## Table of Contents

1. [Overview](#1-overview)  
2. [Environment & Injection Mechanism](#2-environment--injection-mechanism)  
3. [Built-In Branding vs. Deep-Dive Customizations](#3-built-in-branding-vs-deep-dive-customizations)  
4. [Current Pain Points & Goals](#4-current-pain-points--goals)  
5. [Required UI Changes](#5-required-ui-changes)  
   5.1 [Left Sidebar (Menu)](#51-left-sidebar-menu)  
   5.2 [Main Content Panels & Widgets](#52-main-content-panels--widgets)  
   5.3 [Global Blending & Cohesion](#53-global-blending--cohesion)  
6. [CSS Variables & Selectors Reference](#6-css-variables--selectors-reference)  
7. [JavaScript DOM Enhancements](#7-javascript-dom-enhancements)  
8. [Deliverables & Packaging](#8-deliverables--packaging)  
9. [Testing & Validation Checklist](#9-testing--validation-checklist)  
10. [Browser Compatibility & Performance](#10-browser-compatibility--performance)  

---

## 1. Overview

Deliver a polished, dark-themed UI for the Netsapiens Manager Portal by injecting:

- **One** custom CSS file (`PORTAL_CSS_CUSTOM`)
- **One** custom JS file (`PORTAL_EXTRA_JS`)

The goal is modern, cohesive visuals—compact sidebar, high-contrast typography, and flatter panels—while preserving all existing portal features.

---

## 2. Environment & Injection Mechanism

- **Platform**: CakePHP/HTML/jQuery-1.8.3 based web portal (Bootstrap-style classes).  
- **Injection**:
  - `PORTAL_CSS_CUSTOM`: URL or local path to a single CSS file, loaded _after_ default styles.
  - `PORTAL_EXTRA_JS`: URL or local path to a single JavaScript file, loaded _after_ default scripts.
- **Constraint**: Only one custom CSS and one custom JS file allowed.
- **Dynamic Content**: Must re-apply DOM tweaks after AJAX loads (use `MutationObserver` or `$(document).ajaxComplete`).

---

## 3. Built-In Branding vs. Deep-Dive Customizations

| Built-In Configs                                   | Deep-Dive Custom CSS/JS                                  |
| -------------------------------------------------- | -------------------------------------------------------- |
| `PORTAL_CSS_BACKGROUND`, `PORTAL_CSS_PRIMARY_1/2`   | Precise selector overrides, flexible values, layout tweaks|
| `PORTAL_CSS_COLOR_MENU_BAR`                        | Custom sidebar layout, padding, icon maps                |
| `PORTAL_CSS_FOOTER_COLOR`, `PORTAL_LOGGED_IN_POWERED_BY` | Flatter panel styling, complex label text changes         |
| Image uploads (`.png` logos by FQDN/domain)         | DOM-based text remapping, animation enhancements         |

Use built-in configs for broad color/font changes. Rely on custom CSS/JS for granular overrides.

---

## 4. Current Pain Points & Goals

- **Sidebar Items**:  
  - Too tall, low contrast (gray text on dark blue).  
  - Some labels are verbose.
- **Panels & Widgets**:  
  - Strong borders & shadows create “floating cards” look.  
  - Lack of integration with page background.
- **Cross-Browser Issues**:  
  - Edge shows positioning/display quirks on fixed sidebar.
- **Performance Warnings**:  
  - Long `readystatechange` handlers; heavy shadows/transitions.

**Goals**  
- Compact, crisp menu.  
- High-contrast text & icons.  
- Flatter, more integrated panels.  
- Consistent behavior in Chrome, Firefox, Edge, Safari.

---

## 5. Required UI Changes

### 5.1. Left Sidebar (Menu)

#### Padding & Height
- Reduce vertical padding from `16px` → `10–12px`.
- Optionally enforce `min-height: 40px`.

#### Color & Contrast
| Element                  | Before                       | After                                    |
| ------------------------ | ---------------------------- | ---------------------------------------- |
| Menu text (`.nav-text`)  | `var(--grid4-text-muted)`    | `var(--grid4-text-primary)` or `#e2eaf5` |
| Icons (`::before`)       | `var(--grid4-text-muted)`    | `var(--grid4-accent-light-blue)`         |
| Hover/Active color       | subtle                        | brighter `var(--grid4-accent-blue)`      |

#### Label Text Remapping (JS)
| Original           | Replacement   |
| ------------------ | ------------- |
| Auto Attendants    | Attendants    |
| Call Queues        | Queues        |
| Music On Hold      | Hold          |

### 5.2. Main Content Panels & Widgets

Primary selectors: `.panel`, `.widget`, `.box`, `.home-panel-main .rounded`

- **Background**:  
  `background-color: var(--grid4-panel-header)` (darker)  
- **Borders**:  
  Remove or soften: `border: none;` or `1px solid rgba(255,255,255,0.1);`  
- **Shadows**:  
  Reduce: `box-shadow: 0 1px 3px rgba(0,0,0,0.2);` or remove entirely  
- **Headers (`.panel-heading`)**:  
  Match body background or use a slightly darker shade for unity.

### 5.3. Global Blending & Cohesion

- **Sidebar** (`#navigation`):  
  - Remove heavy `border-right` & `box-shadow`.  
  - Subtle gradient or single-tone background.  
- **Overall**:  
  - Differentiate areas by background shade & spacing, not harsh outlines.

---

## 6. CSS Variables & Selectors Reference

```css
:root {
  --grid4-primary-dark:     #1a2332;
  --grid4-secondary-dark:   #2d3a4b;
  --grid4-accent-blue:      #0099ff;
  --grid4-accent-light-blue:#4db8ff;
  --grid4-panel-bg:         #3a4556;
  --grid4-panel-header:     #2d3a4b;
  --grid4-text-primary:     #ffffff;
  --grid4-text-secondary:   #b3c2d3;
  --grid4-text-muted:       #8892a3;
  --grid4-border-color:     #4a5668;
  --grid4-hover-bg:         #4a5668;
  --grid4-active-bg:        #5a6a7d;
  --grid4-sidebar-width:    220px;
  --grid4-sidebar-bg:       #1e2736;
  --grid4-sidebar-border:   #334155;
}

/* Key Selectors */
#navigation { /* sidebar container */ }
#nav-buttons li a.nav-link { /* each menu link */ }
.nav-text { /* menu text span */ }
.nav-link::before { /* menu icon pseudo-element */ }

.panel, .widget, .box { /* content cards */ }
```

---

## 7. JavaScript DOM Enhancements

- **Label Remapping** (run on load & after AJAX):

  ```js
  function remapMenuLabels() {
    const map = {
      'Auto Attendants': 'Attendants',
      'Call Queues':     'Queues',
      'Music On Hold':   'Hold'
    };
    $('#nav-buttons .nav-text').each(function() {
      const txt = $(this).text().trim();
      if (map[txt]) $(this).text(map[txt]);
    });
  }

  // Run on initial load:
  $(document).ready(remapMenuLabels);
  // Re-run after AJAX loads:
  $(document).ajaxComplete(remapMenuLabels);
  ```

- **Dynamic Sidebar Toggle** (already in place; ensure `mobile-active` class handling).
- **MutationObserver**: Re-apply enhancements if content is replaced via client-side routing.

---

## 8. Deliverables & Packaging

- **File #1**: `custom-portal.css`  
  - Containing all CSS overrides and variable definitions.
- **File #2**: `custom-portal.js`  
  - Containing DOM label remapping, any dynamic fixes, and invocation hooks.
- **Configuration**:
  - `PORTAL_CSS_CUSTOM` → `/var/www/html/custom/custom-portal.css`
  - `PORTAL_EXTRA_JS`   → `/var/www/html/custom/custom-portal.js`
- **Version Control**: Tag releases (e.g., `v1.0.0-sidebar-enhancement`).

---

## 9. Testing & Validation Checklist

- [ ] Sidebar items’ height reduced and consistent.  
- [ ] Menu text & icons contrast ≥ WCAG AA.  
- [ ] Label text remapped correctly on initial load and after AJAX.  
- [ ] Panels/background blend as specified—borders/shadows softened.  
- [ ] No JavaScript errors in console.  
- [ ] Functionality intact: links, dropdowns, tooltips.  
- [ ] Mobile toggle works (≤768px width).  
- [ ] Content loads dynamically without losing custom styles.

---

## 10. Browser Compatibility & Performance

- **Browsers**: Chrome, Firefox, Edge (latest), Safari.  
- **CSS**: Use vendor‐prefixed properties where needed (e.g., `-webkit-transform`).  
- **JS**: Stick to jQuery 1.8.3 APIs; avoid modern ES6 features unless transpiled.  
- **Performance**:
  - Minimize heavy box-shadows & CSS filters.  
  - Debounce/throttle resize & scroll listeners.  
  - Use CSS transitions over JS animations where possible.

---

*End of Context & Spec Package*  
```

This standalone Markdown document captures all relevant details, requirements, code references, and validation steps—ready to share with any developer or team.
