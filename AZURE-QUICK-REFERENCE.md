# Azure Static Web Apps - Quick Reference

## 🚀 Current Production URLs

### v5.0.11 (Latest)
```
CSS: https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.css
JS:  https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.js
```

### v5.0
```
CSS: https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.css
JS:  https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.js
```

## 📝 NetSapiens Configuration
```
PORTAL_CSS_CUSTOM: https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.css
PORTAL_EXTRA_JS: https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.js
```

## 🔄 Deployment
- **Auto-deploy**: Push to `main` branch
- **Deploy time**: ~1-2 minutes
- **No build required**: Static files served directly

## ✅ Key Points
- CORS enabled for all origins (*)
- Immutable caching for performance
- GitHub Actions CI/CD pipeline
- All root files are automatically served
- NO LONGER USING STATICALLY CDN!

## 🎯 Remember
When working on CSS/JS files:
1. Edit files locally
2. Test thoroughly
3. Commit and push to main
4. Wait 1-2 minutes for deployment
5. Assets are immediately available at Azure URLs