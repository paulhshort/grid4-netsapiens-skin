# NetSapiens v2 API - UI Configuration Management

## Overview

This document details the programmatic management of NetSapiens portal UI configuration parameters, specifically `PORTAL_CSS_CUSTOM` and `PORTAL_EXTRA_JS`, through the NetSapiens v2 API.

## Key Discovery

Based on analysis of the NetSapiens codebase and portal URL patterns, the UI configurations are managed through an internal S-Bus (Service Bus) API architecture.

## API Architecture

### Object Model
```
Object: uiconfig
Actions: create, read, update, delete, count
```

### Portal URL Pattern
The manual configuration URL:
```
https://gridfour.trynetsapiens.com/portal/uiconfigs/index/details/PORTAL_EXTRA_JS
```

Maps to:
- Controller: `uiconfigs`
- Action: `index` with tab `details`
- Config Name: `PORTAL_EXTRA_JS`

## Configuration Hierarchy

UI configurations can be applied at different scope levels:

1. **Hostname** - Server/FQDN specific
2. **Reseller** - All domains under a reseller
3. **Domain** - Specific domain
4. **Role** - Based on user role (Admin, User, etc.)
5. **User** - Individual user level

## API Operations

### Authentication
- Uses OAuth 2.0 with access tokens
- Tokens managed through session variables
- Supports refresh tokens

### Create/Update Configuration

```php
// Example: Set PORTAL_CSS_CUSTOM
$payload = array(
    'object' => 'uiconfig',
    'action' => 'update',
    'config_name' => 'PORTAL_CSS_CUSTOM',
    'config_value' => 'https://cdn.example.com/grid4-netsapiens.css',
    'hostname' => 'gridfour.trynetsapiens.com',
    'reseller' => '*',
    'domain' => 'grid4comm.com',
    'role' => '*',
    'user' => '*',
    'format' => 'json'
);

// Example: Set PORTAL_EXTRA_JS
$payload = array(
    'object' => 'uiconfig',
    'action' => 'update',
    'config_name' => 'PORTAL_EXTRA_JS',
    'config_value' => 'https://cdn.example.com/grid4-netsapiens.js',
    'hostname' => 'gridfour.trynetsapiens.com',
    'reseller' => '*',
    'domain' => 'grid4comm.com',
    'role' => '*',
    'user' => '*',
    'format' => 'json'
);
```

### Read Configuration

```php
$payload = array(
    'object' => 'uiconfig',
    'action' => 'read',
    'config_name' => 'PORTAL_CSS_CUSTOM',
    'hostname' => 'gridfour.trynetsapiens.com',
    'include_defaults' => true,
    'format' => 'json'
);
```

### Delete Configuration

```php
$payload = array(
    'object' => 'uiconfig',
    'action' => 'delete',
    'config_name' => 'PORTAL_CSS_CUSTOM',
    'hostname' => 'gridfour.trynetsapiens.com',
    'reseller' => '*',
    'domain' => 'grid4comm.com',
    'role' => '*',
    'user' => '*'
);
```

## Configuration ID Format

Configurations are uniquely identified by a composite key:
```
{config_name}|{role}|{domain}|{user}|{reseller}|{hostname}
```

Example:
```
PORTAL_CSS_CUSTOM|*|grid4comm.com|*|*|gridfour.trynetsapiens.com
```

## Implementation Approach

### Using S-Bus Interface (Internal)

The NetSapiens system uses a proprietary S-Bus interface for API communications:

```php
// Pseudo-code for S-Bus request
$sbus = new SBus($oauth_token);
$response = $sbus->request($payload);
```

### Direct HTTP API (If Available)

While the internal API uses S-Bus, external API access might be available through:

```bash
POST https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig
Authorization: Bearer {oauth_token}
Content-Type: application/x-www-form-urlencoded

object=uiconfig&action=update&config_name=PORTAL_CSS_CUSTOM&config_value=...
```

## Important Considerations

1. **Authentication Required**: OAuth 2.0 access token needed
2. **Permissions**: May require admin-level permissions
3. **Caching**: Changes may be cached; cache clearing might be required
4. **Wildcards**: Use `*` for broader scope application
5. **Precedence**: More specific scopes override general ones

## Practical Usage Example

### Setting Custom CSS/JS for a Domain

```bash
# 1. Authenticate and get token
# 2. Set custom CSS
curl -X POST https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig \
  -H "Authorization: Bearer {token}" \
  -d "object=uiconfig" \
  -d "action=update" \
  -d "config_name=PORTAL_CSS_CUSTOM" \
  -d "config_value=https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css" \
  -d "domain=grid4comm.com" \
  -d "hostname=gridfour.trynetsapiens.com"

# 3. Set custom JS
curl -X POST https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig \
  -H "Authorization: Bearer {token}" \
  -d "object=uiconfig" \
  -d "action=update" \
  -d "config_name=PORTAL_EXTRA_JS" \
  -d "config_value=https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js" \
  -d "domain=grid4comm.com" \
  -d "hostname=gridfour.trynetsapiens.com"
```

## Limitations

1. **No Public Documentation**: The API endpoints are not publicly documented
2. **Internal Architecture**: S-Bus is a proprietary internal system
3. **Access Restrictions**: Direct API access may require special arrangements
4. **Version Compatibility**: API structure may vary between NetSapiens versions

## Alternative Approaches

If direct API access is not available:

1. **Selenium/Automation**: Automate the web portal UI
2. **Database Direct**: If database access is available (not recommended)
3. **Support Request**: Contact NetSapiens support for API access
4. **Partner Program**: Join NetSapiens partner program for API documentation

## Conclusion

While the NetSapiens system has the capability to programmatically manage UI configurations through its internal API, public access to these endpoints may be restricted. The portal URL pattern and codebase analysis reveal the underlying structure, but official API documentation and authentication credentials would be needed for implementation.

For production use, it's recommended to:
1. Contact NetSapiens support for official API access
2. Use the web portal interface for configuration management
3. Consider automation tools if API access is not available