#!/bin/bash

# NetSapiens API Configuration
NS_API_BASE_URL="https://gridfour.trynetsapiens.com/ns-api/v2/"
NS_API_KEY="nss_YBWs3OXqlRchEGJ6KJyvkQ56OVGFpuoqw6YH1OGgIzOkrg8K0bcf7fe5"
NS_DOMAIN="grid4comm"  # NetSapiens domain (not internet domain)
NS_RESELLER="gridfour_reseller"
NS_HOSTNAME="gridfour.trynetsapiens.com"

echo "NetSapiens UI Configuration Manager"
echo "==================================="
echo "Domain: $NS_DOMAIN"
echo "Reseller: $NS_RESELLER"
echo "Hostname: $NS_HOSTNAME"
echo ""

# Function to read UI config
read_uiconfig() {
    local config_name=$1
    echo "Reading $config_name..."
    
    # Try the correct API format based on NetSapiens structure
    response=$(curl -s -X POST "${NS_API_BASE_URL}" \
        -H "Authorization: Bearer ${NS_API_KEY}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "object=uiconfig" \
        -d "action=read" \
        -d "config_name=${config_name}" \
        -d "domain=${NS_DOMAIN}" \
        -d "reseller=${NS_RESELLER}" \
        -d "hostname=${NS_HOSTNAME}" \
        -d "format=json")
    
    echo "Response: $response"
    echo ""
}

# Function to update UI config with version bump
update_uiconfig() {
    local config_name=$1
    local config_value=$2
    echo "Updating $config_name to: $config_value"
    
    response=$(curl -s -X POST "${NS_API_BASE_URL}" \
        -H "Authorization: Bearer ${NS_API_KEY}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "object=uiconfig" \
        -d "action=update" \
        -d "config_name=${config_name}" \
        -d "config_value=${config_value}" \
        -d "domain=${NS_DOMAIN}" \
        -d "reseller=${NS_RESELLER}" \
        -d "hostname=${NS_HOSTNAME}" \
        -d "role=*" \
        -d "user=*" \
        -d "format=json")
    
    echo "Response: $response"
    echo ""
}

# Check current configurations
echo "1. Current Configurations:"
echo "--------------------------"
read_uiconfig "PORTAL_CSS_CUSTOM"
read_uiconfig "PORTAL_EXTRA_JS"

# Example of how to update with version bump
echo "2. Version Bump Example:"
echo "------------------------"
echo "To update CSS with version bump:"
echo 'update_uiconfig "PORTAL_CSS_CUSTOM" "https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.css?v=1.3.2"'
echo ""
echo "To update JS with version bump:"
echo 'update_uiconfig "PORTAL_EXTRA_JS" "https://cdn.statically.io/gh/paulhshort/grid4-netsapiens-skin/main/grid4-netsapiens.js?v=1.3.2"'

# Try alternative approach with S-Bus style parameters
echo -e "\n3. Trying S-Bus style query:"
echo "-----------------------------"
curl -s -X POST "${NS_API_BASE_URL}" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "request[object]=uiconfig&request[action]=read&request[config_name]=PORTAL_CSS_CUSTOM&request[domain]=${NS_DOMAIN}&request[reseller]=${NS_RESELLER}"