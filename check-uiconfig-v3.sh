#!/bin/bash

# NetSapiens API Configuration
NS_API_BASE_URL="https://gridfour.trynetsapiens.com/ns-api/"
NS_API_KEY="nss_YBWs3OXqlRchEGJ6KJyvkQ56OVGFpuoqw6YH1OGgIzOkrg8K0bcf7fe5"
NS_DEFAULT_DOMAIN="grid4comm"

echo "NetSapiens API UI Configuration Check v3"
echo "========================================"

# Based on the portal URL pattern: /portal/uiconfigs/index/details/PORTAL_EXTRA_JS
# Let's try to match the API structure

# Method 1: Try uiconfigs endpoint with specific config names
echo -e "\nMethod 1: Specific config endpoints"
echo "-----------------------------------"
echo "PORTAL_CSS_CUSTOM:"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/uiconfigs/PORTAL_CSS_CUSTOM" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw: $(curl -s "https://gridfour.trynetsapiens.com/ns-api/uiconfigs/PORTAL_CSS_CUSTOM" -H "Authorization: Bearer ${NS_API_KEY}")"

echo -e "\nPORTAL_EXTRA_JS:"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/uiconfigs/PORTAL_EXTRA_JS" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw: $(curl -s "https://gridfour.trynetsapiens.com/ns-api/uiconfigs/PORTAL_EXTRA_JS" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 2: Try with domain parameter
echo -e "\n\nMethod 2: With domain parameter"
echo "-------------------------------"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig/${NS_DEFAULT_DOMAIN}" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw: $(curl -s "https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig/${NS_DEFAULT_DOMAIN}" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 3: Try OAuth2 style
echo -e "\n\nMethod 3: OAuth2 style with Bearer token"
echo "----------------------------------------"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/v2/domains/${NS_DEFAULT_DOMAIN}/uiconfig" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw: $(curl -s "https://gridfour.trynetsapiens.com/ns-api/v2/domains/${NS_DEFAULT_DOMAIN}/uiconfig" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 4: Check if we need to specify reseller/hostname
echo -e "\n\nMethod 4: With full hierarchy"
echo "-----------------------------"
curl -s -X POST "https://gridfour.trynetsapiens.com/ns-api/v2/" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "object=uiconfig&action=read&config_name=PORTAL_CSS_CUSTOM&hostname=gridfour.trynetsapiens.com&reseller=*&domain=${NS_DEFAULT_DOMAIN}&role=*&user=*&format=json" \
    | jq '.' 2>/dev/null || echo "Raw: $(curl -s -X POST "https://gridfour.trynetsapiens.com/ns-api/v2/" -H "Authorization: Bearer ${NS_API_KEY}" -H "Content-Type: application/x-www-form-urlencoded" -d "object=uiconfig&action=read&config_name=PORTAL_CSS_CUSTOM&hostname=gridfour.trynetsapiens.com&reseller=*&domain=${NS_DEFAULT_DOMAIN}&role=*&user=*&format=json")"

# Method 5: Try listing all configs
echo -e "\n\nMethod 5: List all UI configs"
echo "-----------------------------"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw: $(curl -s "https://gridfour.trynetsapiens.com/ns-api/v2/uiconfig" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 6: Check API version/capabilities
echo -e "\n\nMethod 6: API info"
echo "------------------"
curl -s -X GET "https://gridfour.trynetsapiens.com/ns-api/" \
    -H "Authorization: Bearer ${NS_API_KEY}" | head -20