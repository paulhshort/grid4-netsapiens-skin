# Netsapiens Manager Portal Customization: Context & Technical Brief

## 1. Project Overview

**Goal:** To refine and enhance the custom theme (CSS and JavaScript) for the Netsapiens Manager Portal. The objective is to achieve a modern, cohesive, and highly readable user interface, consistent across major browsers, while ensuring all modifications are safely injected and do not disrupt core portal functionality.

## 2. Target Application Environment: Netsapiens Manager Portal

*   **Platform:** A web-based portal, understood to be built on a CakePHP backend, utilizing HTML, JavaScript (including jQuery 1.8.3), and CSS. The portal likely incorporates elements or class structures similar to the Bootstrap library.
*   **Customization Method:**
    *   Custom CSS is injected via the `PORTAL_CSS_CUSTOM` UI configuration. This configuration points to a single CSS file (hosted locally or remotely).
    *   Custom JavaScript is injected via the `PORTAL_EXTRA_JS` UI configuration, also pointing to a single JS file.
*   **Asset Loading Order:** Custom CSS and JS files are loaded *after* the portal's default assets. This allows for overriding default styles and extending functionality.
*   **File Constraint:** Only one custom CSS file and one custom JavaScript file can be specified through these configurations.
*   **Dynamic Content:** The portal loads content dynamically, potentially via AJAX. Customizations, especially JavaScript DOM manipulations, must account for this to ensure persistence.

## 3. Current State & Observed Issues

*   **Visual Inconsistencies:** The current custom theme exhibits rendering differences across various web browsers. Specific issues with the sidebar positioning and display have been noted in Edge.
*   **UI Element Concerns:**
    *   **Left Menu:** Items appear too tall, and text/icon contrast against the dark background is insufficient, impacting readability. Some menu labels are overly long for a compact design.
    *   **Content Panels:** Main content panels and widgets have stark borders and shadows, making them appear disconnected from the overall theme rather than integrated.
*   **JavaScript Console Logs Indicate:**
    *   A `TypeError: moment.tz is not a function` on the home page, originating from `active-calls-graph.js`.
    *   Multiple `404 (Not Found)` errors for `/portal/cjs/netsapiens-voice-1.3.4.min.js` across various pages.
    *   Failures in fetching data for Google Analytics.
    *   Performance warnings related to long execution times for `readystatechange` handlers (e.g., taking several seconds).

## 4. Desired Visual Outcome

The aim is to achieve a polished, modern, dark-themed interface characterized by:

*   **Cohesion:** Elements should blend seamlessly, with less defined separation (e.g., softer borders, subtle shadows if any). Panels should feel integrated into the background rather than floating prominently on top.
*   **Readability:** Greatly improved text and icon legibility, especially in the navigation menu, ensuring high contrast.
*   **Compactness & Efficiency:** A more compact left navigation menu with shorter items.
*   **Consistency:** A uniform look and feel across all supported browsers.
*   The visual style should emulate a professional, contemporary aesthetic, similar to modern web application dashboards with a flat or near-flat design language.

## 5. Specific UI Modification Requirements

### 5.1. Left Vertical Navigation Menu (Primary Selectors: `#navigation`, `#nav-buttons li a.nav-link`)

*   **Item Height & Padding:** Reduce vertical padding of menu items for a more compact appearance. The current padding (e.g., `16px 24px`) results in overly tall items. Target a significantly reduced vertical padding (e.g., `10px-12px` vertical, maintaining horizontal padding).
*   **Font Color & Contrast:**
    *   **Text (e.g., `.nav-text`):** Significantly lighten the text color from its current mid-gray (defined by `var(--grid4-text-muted)`, e.g., `#8892a3`) to a high-contrast color like white (e.g., `var(--grid4-text-primary)`) or a very light blue-gray (e.g., `#e2eaf5`, `#ccd6e6`) for excellent readability against the dark sidebar background.
    *   **Icons (e.g., pseudo-element `::before` on `a.nav-link`):** Update icon colors to be clearly visible and harmonious with the text. Consider a distinct, brighter color for the default icon state (e.g., `#4DB8FF` or `var(--grid4-accent-light-blue)`) and an even brighter/accented variant for hover/active states.
*   **Text Label Shortening (Likely via JavaScript DOM manipulation):**
    *   "Auto Attendants" → "Attendants"
    *   "Call Queues" → "Queues"
    *   "Music On Hold" → "Hold"
    *   Other labels (e.g., Home, Users, Conferences, Time Frames, Route Profiles, Inventory, Call History) should remain unchanged.

### 5.2. Main Content Panels & Widgets (Primary Selectors: `.panel`, `.widget`, `.box`, `.home-panel-main .rounded`)

*   **Background Integration:** Adjust the panel background color (currently `var(--grid4-panel-bg)`, e.g., `#3a4556`) to be darker, closely matching or subtly distinct from the primary page background (`var(--grid4-primary-dark)`). The goal is for panels to feel less like separate, floating cards and more like defined areas within a cohesive background.
*   **Borders:** Make borders significantly less prominent or remove them entirely. The current border (e.g., `1px solid var(--grid4-border-color)`, `#4a5668`) contributes to the stark definition. Consider `border: none;` or a very subtle, darker border that doesn't create a strong outline.
*   **Box Shadows:** Reduce intensity significantly or remove completely to achieve a flatter, more integrated look. The current shadow (e.g., `0 2px 4px rgba(0, 0, 0, 0.3)`) is too pronounced.
*   **Panel Headers (e.g., `.panel-heading`):** Style these consistently with the updated panel body. They might use the same background as the panel body or a slightly darker shade for subtle differentiation, avoiding strong contrasting lines.

### 5.3. Overall Cohesion & Blending

*   **Left Menu Integration:** Soften the visual boundaries of the `#navigation` element. This likely involves reducing the prominence of or removing its `border-right` and `box-shadow` to help it blend more naturally with the main content area's background.
*   The overall aesthetic should shift towards a design where elements are differentiated more by subtle variations in background shades, typography, and spacing, rather than strong lines, borders, and heavy shadows.

## 6. Technical Considerations & Constraints

### 6.1. Existing Custom Codebase (To be modified)

*   **Custom CSS File (`grid4-netsapiens-css.css`):**
    *   Contains the current custom theme and should be the target for CSS modifications.
    *   Defines a set of CSS variables for colors and dimensions, which should be leveraged:
        *   `--grid4-primary-dark: #1a2332;`
        *   `--grid4-secondary-dark: #2d3a4b;`
        *   `--grid4-accent-blue: #0099ff;`
        *   `--grid4-accent-light-blue: #4db8ff;`
        *   `--grid4-panel-bg: #3a4556;`
        *   `--grid4-panel-header: #2d3a4b;`
        *   `--grid4-text-primary: #ffffff;`
        *   `--grid4-text-secondary: #b3c2d3;`
        *   `--grid4-text-muted: #8892a3;`
        *   `--grid4-border-color: #4a5668;`
        *   `--grid4-hover-bg: #4a5668;`
        *   `--grid4-active-bg: #5a6a7d;`
        *   `--grid4-sidebar-width: 220px;`
        *   `--grid4-sidebar-bg: #1e2736;`
        *   `--grid4-sidebar-border: #334155;`
*   **Custom JavaScript File (`grid4-netsapiens-js.js`):**
    *   Contains existing custom JavaScript logic and should be updated for tasks like menu text label changes.
    *   **Key existing features:** Browser detection (Edge, IE, Chrome, Firefox, Safari) with CSS class application, mobile navigation toggle, page title/footer branding updates, some UI interaction enhancements (panel animations, table hovers, form focus states – review for compatibility with new blending requirements), accessibility features (ARIA labels, skip link), and performance optimizations (throttled resize/scroll).
    *   Includes mechanisms like `MutationObserver` and `$(document).ajaxComplete()` to handle dynamic content updates, which is crucial for the persistence of JS-based modifications.

### 6.2. Development Practices

*   **Injection Safety:** All CSS and JavaScript modifications must be safe for injection and must not interfere with or break existing portal functionality, JavaScript, or DOM structure.
*   **Browser Compatibility:** Prioritize consistent rendering and functionality across the latest versions of Chrome, Firefox, Edge, and Safari. Address known Edge browser issues related to sidebar display and positioning.
*   **CSS Specificity & `!important`:** Use `!important` judiciously and only when strictly necessary to override portal styles. Prefer increasing selector specificity.
*   **JavaScript:** Utilize plain JavaScript or jQuery 1.8.3 (as per the existing environment). Ensure any new JavaScript is robust, handles potential errors gracefully, and accounts for dynamic content loading to ensure modifications persist.

## 7. Relevant Portal Configurations (Netsapiens Native Options)

The Netsapiens system provides several UI configurations for branding, which exist alongside the custom CSS/JS injection capabilities:

*   **Color Customization:**
    *   `PORTAL_CSS_BACKGROUND`: Background color for login and portal pages.
    *   `PORTAL_CSS_PRIMARY_1` / `PORTAL_CSS_PRIMARY_2`: Primary button colors, gradient colors.
    *   `PORTAL_CSS_COLOR_MENU_BAR`, `PORTAL_CSS_COLOR_MENU_BAR_PRIMARY_1`, `PORTAL_CSS_COLOR_MENU_BAR_PRIMARY_2`: Colors for the (default horizontal) menu bar.
    *   `PORTAL_CSS_FOOTER_COLOR`: Footer text color.
    *   `PORTAL_CSS_GRAPH_COLORS`: Comma-separated list for active-call graph colors.
*   **Font Customization:**
    *   `PORTAL_CSS_FONT`, `PORTAL_CSS_FONT_FILE`, `PORTAL_CSS_FONT_HEADER`, `PORTAL_CSS_GOOGLE_API_FONT`.
*   **Image Branding:**
    *   Specific image files (e.g., `portal_landing_page.png`, `portal_main_top_left.png`) can be customized via the Admin UI (System > Settings > Advanced > Images) per domain, Reseller, or FQDN.
*   **Text Branding:**
    *   `PORTAL_LOGGED_IN_POWERED_BY`: "Powered By" text.
    *   `PORTAL_LOGIN_VERSION_TITLE`: Name at the bottom of the login page.
    *   `PORTAL_TITLE_MANAGER` / `PORTAL_TITLE_USER`: Browser tab titles.

The custom CSS/JS approach is employed for more advanced styling and functional modifications that go beyond these native configuration capabilities or require precise overriding of default portal styles.
