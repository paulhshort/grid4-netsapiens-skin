# Grid4 CloudVoice - NetSapiens Portal Skin

A modern, responsive transformation skin for NetSapiens Manager Portal featuring a sleek sidebar navigation, Twitter-blue color scheme, and enhanced user experience inspired by modern cloud dashboards.

## 🚀 Features

- **Modern Sidebar Navigation** - Collapsible dark sidebar with smooth animations
- **Twitter-Blue Design System** - Professional color palette with Grid4 branding
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Enhanced Dashboard** - Interactive metrics cards and Chart.js visualizations
- **Improved UX** - Modern forms, buttons, tables, and modals
- **Zero Conflicts** - Designed to work alongside existing NetSapiens functionality
- **Easy Integration** - Single CSS and JS file deployment

## 📦 Quick Start

### CDN Integration (Recommended)

Add these two lines to your NetSapiens portal configuration:

```
PORTAL_CSS_CUSTOM: https://cdn.jsdelivr.net/gh/yourusername/grid4-netsapiens-skin@main/grid4-netsapiens.css
PORTAL_EXTRA_JS: https://cdn.jsdelivr.net/gh/yourusername/grid4-netsapiens-skin@main/grid4-netsapiens.js
```

### NetSapiens Configuration

1. **Login to NetSapiens Admin UI**
2. **Navigate to Platform → Brand → Custom Resources**
3. **Set the following configs:**
   - `PORTAL_CSS_CUSTOM`: CDN CSS URL
   - `PORTAL_EXTRA_JS`: CDN JavaScript URL
4. **Save changes and refresh portal**

## 🎨 Design System

### Color Palette
- **Primary**: `#1DA1F2` (Twitter Blue)
- **Surface**: `#ffffff` (Clean White)
- **Background**: `#f8fafc` (Light Gray)
- **Text**: `#1a202c` (Dark Gray)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter, system fonts
- **Modern Weight Scale**: 300-700
- **Responsive Sizing**: 0.75rem to 1.5rem

## 🔧 Features Overview

### Sidebar Navigation
- **68px → 260px** collapsible width
- **Dark theme** with hover states
- **Modern icons** via Phosphor Icons
- **Keyboard shortcut** (Ctrl/Cmd + B)
- **Mobile-friendly** with swipe gestures

### Dashboard Enhancements
- **Metrics Cards** - Active calls, users, devices, queues
- **Interactive Charts** - Call volume and status analytics
- **Real-time Data** - Integration with existing portal data
- **Responsive Grid** - Adapts to screen size

### UI Improvements
- **Modern Cards** - Elevated surfaces with subtle shadows
- **Enhanced Forms** - Better input styling and validation
- **Improved Tables** - Cleaner data presentation
- **Status Badges** - Color-coded indicators
- **Loading States** - Smooth transitions and feedback

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Expanded sidebar by default
- Full dashboard layout
- Enhanced hover states

### Tablet (768px-1023px)
- Collapsed sidebar
- Responsive grid layouts
- Touch-friendly interactions

### Mobile (<768px)
- Hidden sidebar with overlay
- Stacked card layouts
- Swipe navigation

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + B** - Toggle sidebar
- **Escape** - Close mobile sidebar
- **Tab** - Navigate focusable elements

## 🔌 Integration Details

### CSS Loading Order
1. NetSapiens default styles
2. Bootstrap framework
3. **Grid4 skin (highest specificity)**

### JavaScript Features
- **jQuery Compatible** - Works with existing portal JS
- **No Conflicts** - Namespaced and defensive coding
- **Progressive Enhancement** - Graceful degradation
- **Error Handling** - Robust fallbacks

### External Dependencies
- **Inter Font** (Google Fonts)
- **Phosphor Icons** (CDN)
- **Chart.js** (Optional, loaded dynamically)

## 🛠️ Customization

### Color Scheme
Modify CSS custom properties in the `:root` selector:

```css
:root {
  --g4-primary: #your-color;
  --g4-surface: #your-surface;
  /* ... other variables */
}
```

### Navigation Items
The JavaScript automatically maps existing NetSapiens navigation to modern icons. Custom mappings can be added to the `navigationMapping` object.

### Dashboard Metrics
Metrics are extracted from existing portal elements or can be customized in the `loadDashboardData()` function.

## 🔒 Security & Performance

### Security
- **No external API calls** - All data from existing portal
- **XSS Protection** - Proper input sanitization
- **HTTPS Ready** - All external resources use HTTPS

### Performance
- **Lightweight** - Combined < 100KB
- **Cached Assets** - CDN delivery with caching
- **Optimized CSS** - Efficient selectors and specificity
- **Lazy Loading** - Charts loaded on demand

## 🧪 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+
- **Mobile Safari** iOS 13+
- **Chrome Mobile** Android 8+

## 📊 Chart Integration

### Call Volume Chart
- **24-hour timeline** - Shows call patterns
- **Multiple datasets** - Total calls vs answered
- **Responsive** - Adapts to container size

### Call Status Chart
- **Doughnut visualization** - Answered vs missed vs busy
- **Color-coded** - Success/warning/error states
- **Interactive tooltips** - Hover for details

## 🔧 Development

### Local Development
```bash
git clone [repository-url]
cd grid4-netsapiens-skin
# Edit files and test locally
```

### File Structure
```
grid4-netsapiens-skin/
├── grid4-netsapiens.css    # Main stylesheet
├── grid4-netsapiens.js     # Main JavaScript
└── README.md              # This file
```

## 🐛 Troubleshooting

### Common Issues

**Sidebar not appearing:**
- Check that jQuery is loaded
- Verify CSS and JS files are loading
- Check browser console for errors

**Styles not applying:**
- Ensure CSS file loads after default NetSapiens styles
- Check for CSS specificity conflicts
- Verify `!important` declarations

**Charts not loading:**
- Chart.js loads automatically on dashboard
- Check network connectivity for CDN resources
- Verify dashboard page detection

## 🔄 Updates & Versioning

This skin follows semantic versioning. Updates are delivered via CDN automatically, or you can pin to specific versions:

```
# Always latest
@main/grid4-netsapiens.css

# Specific version
@v1.0.0/grid4-netsapiens.css
```

## 📄 License

Proprietary - Grid4 Communications. All rights reserved.

## 🤝 Support

For technical support or customization requests:
- **Email**: support@grid4.com
- **Documentation**: Internal Grid4 wiki
- **Issues**: Create GitHub issues for bugs

---

**Grid4 Communications** | Modern Telecommunications Solutions | Detroit, Michigan

*Transform your NetSapiens portal into a modern cloud dashboard with Grid4 CloudVoice skin.*