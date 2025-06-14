#!/bin/bash

# Grid4 Production Deployment Script
# Creates stable Git tags for production deployment
# Prevents accidental production breaks from main branch updates

set -e

echo "🚀 Grid4 Production Deployment Script"
echo "====================================="

# Get current version from package.json or create one
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.0.0")
echo "Current version: $CURRENT_VERSION"

# Increment version automatically
IFS='.' read -ra VERSION_PARTS <<< "${CURRENT_VERSION#v}"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Auto-increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="v${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "Proposed new version: $NEW_VERSION"
read -p "Use this version? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create and push the new tag
    echo "📝 Creating Git tag: $NEW_VERSION"
    git tag -a "$NEW_VERSION" -m "Production release $NEW_VERSION - Theme system with WCAG compliance"
    
    echo "📤 Pushing tag to remote..."
    git push origin "$NEW_VERSION"
    
    echo "✅ Production deployment complete!"
    echo ""
    echo "🔗 Update your NetSapiens portal configuration:"
    echo "   CSS URL: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/$NEW_VERSION/grid4-theme-system-v2.css"
    echo "   JS URL:  https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/$NEW_VERSION/grid4-custom-v3.js"
    echo ""
    echo "🎯 Theme Switcher JS: https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/$NEW_VERSION/grid4-theme-switcher-v2.js"
    echo ""
    echo "⚠️  IMPORTANT: Add FOIT prevention script to portal HTML head:"
    echo "   <script>"
    cat foit-prevention-inline.js | grep -A 50 "MINIFIED VERSION" | tail -n +3 | head -n 1
    echo "   </script>"
    
else
    echo "❌ Deployment cancelled"
    exit 1
fi