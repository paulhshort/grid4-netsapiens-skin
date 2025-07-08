# Font and REM Conversion Recommendations

## Web-Safe Font Options

### 1. Google Fonts (Free, CDN-hosted)
These are 100% compatible and can be loaded via CDN:

**Sans-serif options:**
- **Inter** - Modern, highly readable, excellent for UI
- **Roboto** - Clean, professional, widely used
- **Open Sans** - Classic, very readable
- **Lato** - Friendly yet professional
- **Source Sans Pro** - Adobe's UI font, very clean
- **Work Sans** - Modern, good for headings
- **Nunito Sans** - Rounded, friendly
- **Manrope** - Modern variable font

**How to implement:**
```css
/* Add to top of CSS file */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Then update your font variable */
--g4-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 2. System Font Stacks (No loading required)
These use fonts already on user's devices:

```css
/* Modern system font stack */
--g4-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* GitHub's font stack */
--g4-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
```

### 3. Variable Fonts (Modern, size-efficient)
- **Inter Variable** - One file, all weights
- **Roboto Flex** - Google's variable version
- **Plus Jakarta Sans** - Modern, clean

## Recommended REM Conversions

### Priority 1 - Layout Elements
These will have the biggest impact on scalability:

```css
/* Sidebar */
--g4-sidebar-width: 250px → 15.625rem

/* Header */
--g4-header-height: 45px → 2.8125rem

/* Content padding */
--g4-content-padding: 24px → 1.5rem

/* Border radius */
--g4-radius-sm: 4px → 0.25rem
--g4-radius-md: 6px → 0.375rem
--g4-radius-lg: 8px → 0.5rem
```

### Priority 2 - Typography
Already using variables, just convert the values:

```css
--g4-font-size-xs: 9px → 0.5625rem
--g4-font-size-sm: 11px → 0.6875rem
--g4-font-size-base: 12px → 0.75rem
--g4-font-size-md: 15px → 0.9375rem
--g4-font-size-lg: 16px → 1rem
```

### Priority 3 - Components

**Buttons:**
```css
.btn {
  padding: 6px 12px → 0.375rem 0.75rem;
  font-size: 14px → 0.875rem;
  min-height: 32px → 2rem;
}
```

**Forms:**
```css
.form-control {
  padding: 6px 10px → 0.375rem 0.625rem;
  min-height: 28px → 1.75rem;
  font-size: 14px → 0.875rem;
}
```

**Tables:**
```css
.table th,
.table td {
  padding: 10px 15px → 0.625rem 0.9375rem;
}
```

**Panels:**
```css
.panel {
  margin-bottom: 20px → 1.25rem;
  padding: 15px → 0.9375rem;
}

.panel-heading {
  padding: 10px 15px → 0.625rem 0.9375rem;
}
```

### Priority 4 - Spacing Utilities
Create REM-based spacing classes:

```css
/* Margins */
.m-1 { margin: 0.25rem !important; }
.m-2 { margin: 0.5rem !important; }
.m-3 { margin: 0.75rem !important; }
.m-4 { margin: 1rem !important; }
.m-5 { margin: 1.5rem !important; }

/* Padding - same pattern */
.p-1 { padding: 0.25rem !important; }
/* etc... */
```

## Implementation Strategy

1. **Start with CSS Variables** - Convert the root variables first
2. **Test at Multiple Zoom Levels** - 50%, 75%, 100%, 125%, 150%, 200%
3. **Use Fallbacks** - Keep pixel values as fallbacks initially
4. **Progressive Enhancement** - Convert section by section

## Benefits of REM Conversion

1. **Accessibility** - Users can scale entire UI with browser zoom
2. **Consistency** - All elements scale proportionally
3. **Maintenance** - Change root font-size to scale entire UI
4. **Responsive** - Better adaptation to different screen sizes
5. **Future-proof** - Works better with high-DPI displays

## Quick Conversion Reference

```
Pixels → REM (base 16px)
8px   → 0.5rem
10px  → 0.625rem
12px  → 0.75rem
14px  → 0.875rem
16px  → 1rem
18px  → 1.125rem
20px  → 1.25rem
24px  → 1.5rem
32px  → 2rem
40px  → 2.5rem
48px  → 3rem
```