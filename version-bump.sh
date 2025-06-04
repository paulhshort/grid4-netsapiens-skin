#!/bin/bash

# Version Bump Script for NetSapiens Portal Customizations
# This script generates the updated URLs with version numbers for manual update

echo "NetSapiens Portal Customization Version Bump"
echo "==========================================="
echo ""

# Get current version from CSS file
CURRENT_CSS_VERSION=$(grep -oP 'v\d+\.\d+\.\d+' grid4-netsapiens.css | head -1 | sed 's/v//')
CURRENT_JS_VERSION=$(grep -oP 'v\d+\.\d+\.\d+' grid4-netsapiens.js | head -1 | sed 's/v//')

echo "Current versions detected:"
echo "CSS: v${CURRENT_CSS_VERSION}"
echo "JS:  v${CURRENT_JS_VERSION}"
echo ""

# Calculate next patch version
IFS='.' read -ra CSS_PARTS <<< "$CURRENT_CSS_VERSION"
IFS='.' read -ra JS_PARTS <<< "$CURRENT_JS_VERSION"

# Increment patch version
NEW_CSS_PATCH=$((${CSS_PARTS[2]} + 1))
NEW_JS_PATCH=$((${JS_PARTS[2]} + 1))

NEW_CSS_VERSION="${CSS_PARTS[0]}.${CSS_PARTS[1]}.${NEW_CSS_PATCH}"
NEW_JS_VERSION="${JS_PARTS[0]}.${JS_PARTS[1]}.${NEW_JS_PATCH}"

echo "New versions will be:"
echo "CSS: v${NEW_CSS_VERSION}"
echo "JS:  v${NEW_JS_VERSION}"
echo ""

# Generate the URLs
CSS_URL="https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css?v=${NEW_CSS_VERSION}"
JS_URL="https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js?v=${NEW_JS_VERSION}"

echo "Updated URLs for NetSapiens UI Configuration:"
echo "============================================"
echo ""
echo "PORTAL_CSS_CUSTOM:"
echo "${CSS_URL}"
echo ""
echo "PORTAL_EXTRA_JS:"
echo "${JS_URL}"
echo ""

# Create a JSON file with the configuration
cat > uiconfig-update.json << EOF
{
  "domain": "grid4comm",
  "reseller": "gridfour_reseller",
  "hostname": "gridfour.trynetsapiens.com",
  "configurations": {
    "PORTAL_CSS_CUSTOM": {
      "config_name": "PORTAL_CSS_CUSTOM",
      "config_value": "${CSS_URL}",
      "version": "${NEW_CSS_VERSION}"
    },
    "PORTAL_EXTRA_JS": {
      "config_name": "PORTAL_EXTRA_JS", 
      "config_value": "${JS_URL}",
      "version": "${NEW_JS_VERSION}"
    }
  },
  "updated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "Configuration saved to: uiconfig-update.json"
echo ""
echo "Manual Update Instructions:"
echo "=========================="
echo "1. Log into: https://gridfour.trynetsapiens.com/portal/"
echo "2. Navigate to: System > UI Configuration"
echo "3. Search for: PORTAL_CSS_CUSTOM"
echo "4. Update the value to: ${CSS_URL}"
echo "5. Search for: PORTAL_EXTRA_JS"
echo "6. Update the value to: ${JS_URL}"
echo "7. Save changes"
echo ""
echo "Note: The CDN may cache files for up to 5 minutes."
echo "To force immediate update, you can add a timestamp:"
echo "${CSS_URL}&t=$(date +%s)"
echo "${JS_URL}&t=$(date +%s)"