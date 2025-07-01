# Azure Static Web Apps Deployment Context

## Overview
We have migrated from using Statically CDN to Azure Static Web Apps for hosting our Grid4 NetSapiens portal customization files (CSS and JS). This provides better control, reliability, and direct integration with our GitHub repository.

## Current Infrastructure

### Azure Static Web Apps
- **Resource Name**: `netsapiens-customizations`
- **Resource Group**: `rg_netsapiens`
- **Default Hostname**: `ambitious-coast-0a8b2110f.1.azurestaticapps.net`
- **Region**: East US 2
- **Plan**: Free tier

### Production URLs
Replace the old CDN URLs with these new Azure-hosted URLs:

#### Current Version (v5.0.11)
- **CSS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.css`
- **JS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.js`

#### Previous Version (v5.0)
- **CSS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.css`
- **JS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.js`

#### Legacy Files
- **CSS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-netsapiens.css`
- **JS**: `https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-netsapiens.js`

### Old CDN URLs (DEPRECATED - DO NOT USE)
- ~~`https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v5.0.11.css`~~
- ~~`https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-portal-skin-v5.0.11.js`~~

## CI/CD Pipeline

### GitHub Actions Workflow
Location: `.github/workflows/azure-static-web-apps-ambitious-coast-0a8b2110f.yml`

**Key Features:**
- Automatically deploys on push to `main` branch
- Handles pull request previews
- Skips build process (`skip_app_build: true`) since we're serving static files
- Uses secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_COAST_0A8B2110F`

**Workflow Configuration:**
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_COAST_0A8B2110F }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "" # Built app content directory - optional
          skip_app_build: true # Skip build since we're serving static files directly
```

## CORS Configuration

### staticwebapp.config.json
This file configures CORS and caching for all assets:

```json
{
  "routes": [
    {
      "route": "/*",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "3600",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "responseOverrides": {
    "404": {
      "statusCode": 404,
      "path": "/404.html"
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
    "Strict-Transport-Security": "max-age=10886400; includeSubDomains; preload"
  }
}
```

**CORS Status**: ✅ Configured to allow all origins (`*`)

## Required Files

### index.html
Azure Static Web Apps requires an index.html file. We created a simple landing page that lists all available assets and provides usage instructions.

## Deployment Process

1. **Automatic Deployment**: Any push to `main` branch triggers deployment
2. **Deployment Time**: ~1-2 minutes
3. **No Build Required**: Static files are served directly
4. **Immediate Availability**: Files are accessible immediately after successful deployment

## Testing Assets

To verify deployment and CORS headers:
```bash
# Test CSS with headers
curl -I https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.css

# Test JS with headers
curl -I https://ambitious-coast-0a8b2110f.1.azurestaticapps.net/grid4-portal-skin-v5.0.11.js
```

Expected headers:
- `access-control-allow-origin: *`
- `content-type: text/css` or `text/javascript`
- `cache-control: public, max-age=31536000, immutable`

## NetSapiens Portal Configuration

Update these parameters in the NetSapiens portal:
- `PORTAL_CSS_CUSTOM`: Use the Azure Static Web Apps CSS URL
- `PORTAL_EXTRA_JS`: Use the Azure Static Web Apps JS URL

### Target Portals
1. **Sandbox**: `https://portal.grid4voice.ucaas.tech/`
2. **Production 1**: `https://portal.grid4voice.net`
3. **Production 2**: `https://portal.smartcomm.io`

## Benefits Over CDN

1. **Direct Control**: No dependency on third-party CDN service
2. **Better Performance**: Azure's global edge network
3. **CI/CD Integration**: Automatic deployments from GitHub
4. **CORS Configuration**: Full control over headers
5. **Caching Strategy**: Immutable caching for better performance
6. **Security Headers**: Enhanced security with custom headers
7. **No Build Process**: Faster deployments for static files

## Future Considerations

1. **Custom Domain**: Consider setting up `assets.grid4.com` or similar
2. **CORS Restriction**: Could limit to specific domains instead of `*`
3. **Versioning Strategy**: Implement proper version tags/releases
4. **Staging Environment**: Use PR previews for testing
5. **CDN Integration**: Azure Static Web Apps includes CDN functionality

## Important Notes

- All files in the repository root are automatically served
- No build process is required or executed
- CORS is configured to allow all origins for maximum compatibility
- Files are cached with immutable headers for performance
- The deployment typically completes within 1-2 minutes of pushing to main

## Monitoring Deployments

Check deployment status:
```bash
# View recent workflow runs
gh run list --limit 5

# View specific run details
gh run view [RUN_ID]

# Watch a run in progress
gh run watch
```

## File Naming Convention

When creating new versions:
1. Use semantic versioning: `grid4-portal-skin-vX.Y.Z.css/js`
2. Keep previous versions for rollback capability
3. Update the index.html to list new versions
4. Test thoroughly before updating portal configurations

This infrastructure ensures reliable, fast delivery of portal customization assets with full version control and automated deployment.