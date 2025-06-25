# Modern CSS Implementation Guide for NetSapiens Portal

## Quick Start

### 1. Include the CSS

Add to your NetSapiens UI configuration:

```
PORTAL_CSS_CUSTOM = /path/to/grid4-modern-css/main.css
```

Or include directly in your HTML:

```html
<link rel="stylesheet" href="/grid4-modern-css/main.css">
```

### 2. Apply Modern Container

Wrap sections you want to modernize with the `.g4-modern` class:

```html
<div class="g4-modern">
  <!-- Modern components work here without Bootstrap conflicts -->
</div>
```

## Component Examples

### Modern Buttons

```html
<!-- Primary button -->
<button class="g4-btn g4-btn--primary">
  Save Changes
</button>

<!-- Button with icon -->
<button class="g4-btn g4-btn--secondary">
  <svg class="g4-icon">...</svg>
  <span>Download Report</span>
</button>

<!-- Button group -->
<div class="g4-btn-group">
  <button class="g4-btn g4-btn--outline">Previous</button>
  <button class="g4-btn g4-btn--outline">Next</button>
</div>

<!-- Loading button -->
<button class="g4-btn g4-btn--primary g4-btn--loading">
  Processing...
</button>
```

### Modern Forms

```html
<!-- Floating label input -->
<div class="g4-field g4-field--floating">
  <input type="email" class="g4-input" id="email" placeholder=" " required>
  <label for="email" class="g4-label">Email Address</label>
  <span class="g4-help-text">We'll never share your email</span>
</div>

<!-- Input group -->
<div class="g4-input-group">
  <span class="g4-input-group-addon">$</span>
  <input type="number" class="g4-input" placeholder="0.00">
  <span class="g4-input-group-addon">.00</span>
</div>

<!-- Modern checkbox -->
<label class="g4-checkbox">
  <input type="checkbox" name="terms">
  <span>I agree to the terms and conditions</span>
</label>

<!-- Switch toggle -->
<label class="g4-switch">
  <input type="checkbox" name="notifications">
  <span class="g4-switch__track">
    <span class="g4-switch__thumb"></span>
  </span>
  <span class="g4-switch__label">Enable notifications</span>
</label>
```

### Grid Layouts

```html
<!-- Auto-responsive grid -->
<div class="g4-grid g4-grid--auto-fit">
  <div class="g4-card">Card 1</div>
  <div class="g4-card">Card 2</div>
  <div class="g4-card">Card 3</div>
</div>

<!-- 12-column grid -->
<div class="g4-grid g4-grid--cols-12 g4-grid--gap-4">
  <div class="g4-col-span-8">Main content</div>
  <div class="g4-col-span-4">Sidebar</div>
</div>

<!-- Responsive grid -->
<div class="g4-grid g4-grid--cols-1 md:g4-grid--cols-2 lg:g4-grid--cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Modern Tables

```html
<div class="g4-table-container">
  <table class="g4-table g4-table--hover g4-table--striped">
    <thead class="g4-table__head">
      <tr class="g4-table__row">
        <th class="g4-table__cell g4-table__sort" aria-sort="ascending">
          Name
        </th>
        <th class="g4-table__cell">Status</th>
        <th class="g4-table__cell is-numeric">Usage</th>
        <th class="g4-table__cell is-actions">Actions</th>
      </tr>
    </thead>
    <tbody class="g4-table__body">
      <tr class="g4-table__row">
        <td class="g4-table__cell">John Doe</td>
        <td class="g4-table__cell">
          <span class="g4-table__badge g4-table__badge--success">Active</span>
        </td>
        <td class="g4-table__cell is-numeric">85%</td>
        <td class="g4-table__cell is-actions">
          <button class="g4-btn g4-btn--ghost g4-btn--sm">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Cards with Container Queries

```html
<div class="g4-card">
  <div class="g4-card__header">
    <h3 class="g4-card__title">User Statistics</h3>
  </div>
  <div class="g4-card__body">
    <p>This card adapts based on its container size, not viewport.</p>
  </div>
  <div class="g4-card__footer">
    <button class="g4-btn g4-btn--primary">View Details</button>
  </div>
</div>
```

## Theme Switching

### Automatic Theme Detection

The CSS automatically detects system theme preference:

```css
/* Automatically applies dark theme when system is in dark mode */
@media (prefers-color-scheme: dark) {
  /* Dark theme styles applied */
}
```

### Manual Theme Control

```html
<!-- Light theme -->
<html data-theme="light">

<!-- Dark theme -->
<html data-theme="dark">

<!-- System preference (default) -->
<html>
```

### JavaScript Theme Switcher

```javascript
// Theme switcher implementation
const themeSwitcher = {
  init() {
    // Get saved theme or detect system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme);
    this.bindEvents();
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  },
  
  bindEvents() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};

// Initialize on load
themeSwitcher.init();
```

## Alpine.js Integration

The CSS is designed to work seamlessly with Alpine.js:

```html
<!-- Dropdown with Alpine.js -->
<div x-data="{ open: false }" class="g4-dropdown">
  <button @click="open = !open" class="g4-btn g4-btn--secondary">
    Options
    <svg class="g4-icon" :class="{ 'rotate-180': open }">...</svg>
  </button>
  
  <div x-show="open" 
       x-transition
       @click.outside="open = false"
       class="g4-dropdown__menu">
    <a href="#" class="g4-dropdown__item">Profile</a>
    <a href="#" class="g4-dropdown__item">Settings</a>
    <hr class="g4-dropdown__divider">
    <a href="#" class="g4-dropdown__item">Logout</a>
  </div>
</div>

<!-- Modal with Alpine.js -->
<div x-data="{ showModal: false }">
  <button @click="showModal = true" class="g4-btn g4-btn--primary">
    Open Modal
  </button>
  
  <template x-if="showModal">
    <div class="g4-modal" @click.self="showModal = false">
      <div class="g4-modal__backdrop"></div>
      <div class="g4-modal__content"
           x-show="showModal"
           x-transition>
        <div class="g4-modal__header">
          <h2>Modal Title</h2>
          <button @click="showModal = false" class="g4-btn g4-btn--ghost g4-btn--icon">
            <svg>...</svg>
          </button>
        </div>
        <div class="g4-modal__body">
          <p>Modal content goes here</p>
        </div>
        <div class="g4-modal__footer">
          <button @click="showModal = false" class="g4-btn g4-btn--ghost">
            Cancel
          </button>
          <button class="g4-btn g4-btn--primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </template>
</div>
```

## Performance Best Practices

### 1. Critical CSS

Extract and inline critical CSS for above-the-fold content:

```html
<style>
  /* Inline only critical tokens and above-the-fold styles */
  :root {
    --g4-color-surface: #ffffff;
    --g4-color-text-primary: #1a1a1a;
  }
  
  .g4-header {
    /* Critical header styles */
  }
</style>

<!-- Load full CSS asynchronously -->
<link rel="preload" href="/grid4-modern-css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### 2. Component Lazy Loading

Load component CSS only when needed:

```javascript
// Lazy load table styles when tables are present
if (document.querySelector('.g4-table')) {
  import('/grid4-modern-css/components/_tables.css');
}
```

### 3. CSS Containment

Use CSS containment for better performance:

```css
/* Already included in components */
.g4-card {
  contain: layout style paint;
}
```

## Browser Support

### Fully Supported Browsers
- Chrome/Edge 88+
- Firefox 89+
- Safari 15+

### Graceful Degradation
- Container Queries → Viewport queries fallback
- CSS Grid → Flexbox fallback
- CSS Variables → Static values fallback

### Polyfills

```html
<!-- Container Query Polyfill -->
<script>
  if (!CSS.supports('container-type', 'inline-size')) {
    import('https://unpkg.com/container-query-polyfill@^0.2.0');
  }
</script>
```

## Migration from Bootstrap 2.x

### Gradual Migration Strategy

1. **Phase 1**: Wrap new features in `.g4-modern`
   ```html
   <div class="g4-modern">
     <!-- New components here -->
   </div>
   ```

2. **Phase 2**: Replace Bootstrap components gradually
   ```html
   <!-- Old -->
   <button class="btn btn-primary">Click</button>
   
   <!-- New -->
   <button class="g4-btn g4-btn--primary">Click</button>
   ```

3. **Phase 3**: Use compatibility classes
   ```html
   <div class="g4-modern">
     <!-- Bootstrap classes automatically mapped to modern equivalents -->
     <button class="btn btn-primary">Automatically styled as g4-btn</button>
   </div>
   ```

## Customization

### Using CSS Custom Properties

```css
/* Customize at root level */
:root {
  --g4-color-primary: #your-brand-color;
  --g4-space-unit: 0.5rem; /* Change spacing scale */
}

/* Component-specific customization */
.my-custom-card {
  --g4-card-padding: var(--g4-space-8);
  --g4-card-radius: var(--g4-radius-xl);
}
```

### Creating Custom Themes

```css
/* custom-theme.css */
[data-theme="brand"] {
  --g4-color-primary: #FF6B6B;
  --g4-color-secondary: #4ECDC4;
  --g4-color-surface: #F7F7F7;
  /* ... other token overrides */
}
```

## Debugging

Enable debug mode to visualize layout:

```html
<html data-debug="true">
```

This adds colored outlines to all elements for easier debugging.

## Accessibility Checklist

- ✅ All interactive elements have focus states
- ✅ Color contrast meets WCAG 2.1 AA standards
- ✅ Reduced motion support included
- ✅ Screen reader friendly markup
- ✅ Keyboard navigation support
- ✅ ARIA attributes included where needed

## Production Optimization

### Build Process

```json
// postcss.config.js
{
  "plugins": {
    "postcss-import": {},
    "postcss-nesting": {},
    "autoprefixer": {},
    "cssnano": {
      "preset": "default"
    }
  }
}
```

### Minification

```bash
# Build production CSS
postcss grid4-modern-css/main.css -o dist/grid4-modern.min.css
```

## Support

For issues or questions:
1. Check the browser console for CSS-related errors
2. Verify `.g4-modern` wrapper is present
3. Ensure no conflicting !important rules
4. Test in isolation first
5. Use debug mode to identify layout issues