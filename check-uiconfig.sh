#!/bin/bash

# NetSapiens API Configuration
NS_API_BASE_URL="https://gridfour.trynetsapiens.com/ns-api/v2/"
NS_API_KEY="nss_YBWs3OXqlRchEGJ6KJyvkQ56OVGFpuoqw6YH1OGgIzOkrg8K0bcf7fe5"
NS_DEFAULT_DOMAIN="grid4comm"

echo "Checking UI configurations for domain: $NS_DEFAULT_DOMAIN"
echo "==========================================="

# Function to make API request
make_api_request() {
    local endpoint=$1
    local data=$2
    
    curl -s -X POST "${NS_API_BASE_URL}${endpoint}" \
        -H "Authorization: Bearer ${NS_API_KEY}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "$data"
}

# Check PORTAL_CSS_CUSTOM
echo -e "\n1. Checking PORTAL_CSS_CUSTOM configuration:"
echo "-------------------------------------------"
css_response=$(make_api_request "uiconfig" "object=uiconfig&action=read&config_name=PORTAL_CSS_CUSTOM&domain=${NS_DEFAULT_DOMAIN}&format=json")
echo "Response: $css_response"

# Check PORTAL_EXTRA_JS
echo -e "\n\n2. Checking PORTAL_EXTRA_JS configuration:"
echo "------------------------------------------"
js_response=$(make_api_request "uiconfig" "object=uiconfig&action=read&config_name=PORTAL_EXTRA_JS&domain=${NS_DEFAULT_DOMAIN}&format=json")
echo "Response: $js_response"

# Try alternative endpoint pattern based on portal URL
echo -e "\n\n3. Trying alternative API endpoint pattern:"
echo "-------------------------------------------"
alt_css=$(curl -s -X GET "${NS_API_BASE_URL}uiconfig/PORTAL_CSS_CUSTOM" \
    -H "Authorization: Bearer ${NS_API_KEY}")
echo "CSS Alternative: $alt_css"

alt_js=$(curl -s -X GET "${NS_API_BASE_URL}uiconfig/PORTAL_EXTRA_JS" \
    -H "Authorization: Bearer ${NS_API_KEY}")
echo "JS Alternative: $alt_js"