# Modal CSS Rollback Plan

## Current Working Modal CSS (Before Transparency Fix)

If the transparency fix causes modals to break, revert Section 23, 24, and 25 to this:

```css
/* ============================================
   SECTION 23: NetSapiens Modal Compatibility Fix
   Based on investigation findings - NetSapiens uses Bootstrap 2 HTML with custom positioning
   ============================================ */

/* Work with NetSapiens' expected modal positioning */
.modal {
  position: fixed !important; /* Override portal.css absolute positioning */
  top: 40% !important; /* Lower from center to accommodate taller modals */
  left: 50% !important;
  z-index: 1050 !important;
  width: 600px !important; /* NetSapiens expects 600px */
  margin: -200px 0 0 -300px !important; /* Reduced top margin for better centering */
  max-height: 60vh !important; /* Reduced to 60% viewport height */
  overflow: visible !important; /* Allow content to be scrollable */
}

/* Ensure modal body is scrollable for long content */
.modal .modal-body {
  max-height: calc(60vh - 150px) !important; /* Account for header/footer with 60vh */
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* Adjust positioning for different screen sizes */
@media (max-height: 768px) {
  .modal {
    top: 30% !important; /* Higher on smaller screens */
    margin-top: -100px !important;
    max-height: 80vh !important;
  }
  
  .modal .modal-body {
    max-height: calc(80vh - 150px) !important;
  }
}

/* Handle Bootstrap 2's hide class that NetSapiens uses */
.modal.hide {
  display: none;
}

/* Ensure proper display when shown */
.modal.in {
  display: block !important;
}

/* Bootstrap 2 fade states - NetSapiens expects these */
.modal.fade {
  top: -25%;
  opacity: 0;
  -webkit-transition: opacity 0.3s linear, top 0.3s ease-out;
  -moz-transition: opacity 0.3s linear, top 0.3s ease-out;
  -o-transition: opacity 0.3s linear, top 0.3s ease-out;
  transition: opacity 0.3s linear, top 0.3s ease-out;
}

.modal.fade.in {
  top: 40% !important; /* Match our fixed positioning */
  opacity: 1;
}

/* Ensure our theme colors still apply */
body.theme-dark .modal {
  background-color: #242b3a !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

body.theme-light .modal {
  background-color: #ffffff !important;
}

/* End NetSapiens Modal Fix */

/* ============================================
   SECTION 24: Modal Dark Mode Footer/Header Fix
   Target correct element for theme detection (#grid4-app-shell instead of body)
   ============================================ */

/* Dark mode modal styling - NetSapiens adds theme to app shell, not body */
#grid4-app-shell.theme-dark ~ .modal .modal-content,
#grid4-app-shell.theme-dark .modal .modal-content,
.theme-dark .modal .modal-content {
  background-color: #242b3a !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #e9ecef !important;
}

#grid4-app-shell.theme-dark ~ .modal .modal-header,
#grid4-app-shell.theme-dark .modal .modal-header,
.theme-dark .modal .modal-header {
  background-color: #1e2736 !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  color: #e9ecef !important;
}

#grid4-app-shell.theme-dark ~ .modal .modal-footer,
#grid4-app-shell.theme-dark .modal .modal-footer,
.theme-dark .modal .modal-footer {
  background-color: #1e2736 !important;
  background: #1e2736 !important;
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

#grid4-app-shell.theme-dark ~ .modal .modal-header .close,
#grid4-app-shell.theme-dark .modal .modal-header .close,
.theme-dark .modal .modal-header .close {
  color: #e9ecef !important;
  opacity: 0.8;
}

#grid4-app-shell.theme-dark ~ .modal .modal-header .close:hover,
#grid4-app-shell.theme-dark .modal .modal-header .close:hover,
.theme-dark .modal .modal-header .close:hover {
  opacity: 1;
}

/* End Modal Dark Mode Fix */

/* Ensure modal elements are interactive */
.modal {
  pointer-events: auto !important;
}
.modal .modal-dialog,
.modal .modal-content,
.modal .modal-header,
.modal .modal-body,
.modal .modal-footer {
  pointer-events: auto !important;
}
```

## JavaScript Modal Functions (Keep These)

The JavaScript modal functions should remain as they are:
- `fixModalFooterDarkMode()` 
- `fixModalTransparency()`

These provide fallback support and should not break anything.

## To Rollback:

1. Remove Section 25 (Modal Transparency Fix) entirely
2. Keep Sections 23 and 24 as shown above
3. Remove the dropdown animation CSS if it causes issues
4. The fax icon fix should be safe to keep

## Testing Checklist After Any Modal Changes:

1. [ ] Modals appear when triggered (not invisible)
2. [ ] Modals are centered on screen (not off to the side)
3. [ ] Dark mode: Modal backgrounds are dark (#242b3a)
4. [ ] Dark mode: Modal footer is dark (#1e2736) 
5. [ ] Light mode: Modal backgrounds are white
6. [ ] No transparency/see-through issues
7. [ ] Modal can be closed with X button
8. [ ] Modal can be closed with Cancel/Close buttons
9. [ ] Test on multiple pages (Users, Domains, etc.)
10. [ ] Test on different screen sizes (4K, 1080p)