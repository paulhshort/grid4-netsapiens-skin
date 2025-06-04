#!/bin/bash

# NetSapiens API Configuration
NS_API_BASE_URL="https://gridfour.trynetsapiens.com/ns-api/v2/"
NS_API_KEY="nss_YBWs3OXqlRchEGJ6KJyvkQ56OVGFpuoqw6YH1OGgIzOkrg8K0bcf7fe5"
NS_DEFAULT_DOMAIN="grid4comm"

echo "NetSapiens API UI Configuration Check v2"
echo "========================================"

# Try different API patterns based on NetSapiens documentation

# Method 1: Direct object query
echo -e "\nMethod 1: Direct object query"
echo "-----------------------------"
curl -s -X GET "${NS_API_BASE_URL}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json" \
    -H "Authorization: Bearer ${NS_API_KEY}" | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X GET "${NS_API_BASE_URL}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 2: RESTful pattern
echo -e "\n\nMethod 2: RESTful pattern"
echo "-------------------------"
curl -s -X GET "${NS_API_BASE_URL}uiconfig?domain=${NS_DEFAULT_DOMAIN}" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Accept: application/json" | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X GET "${NS_API_BASE_URL}uiconfig?domain=${NS_DEFAULT_DOMAIN}" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 3: Try without v2 in path
echo -e "\n\nMethod 3: Without v2 path"
echo "-------------------------"
NS_API_BASE_NO_V2="https://gridfour.trynetsapiens.com/ns-api/"
curl -s -X GET "${NS_API_BASE_NO_V2}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json" \
    -H "Authorization: Bearer ${NS_API_KEY}" | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X GET "${NS_API_BASE_NO_V2}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 4: POST with form data
echo -e "\n\nMethod 4: POST with JSON body"
echo "-----------------------------"
curl -s -X POST "${NS_API_BASE_URL}" \
    -H "Authorization: Bearer ${NS_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "object": "uiconfig",
        "action": "read",
        "domain": "'${NS_DEFAULT_DOMAIN}'",
        "format": "json"
    }' | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X POST "${NS_API_BASE_URL}" -H "Authorization: Bearer ${NS_API_KEY}" -H "Content-Type: application/json" -d '{"object":"uiconfig","action":"read","domain":"'${NS_DEFAULT_DOMAIN}'","format":"json"}')"

# Method 5: Check authentication
echo -e "\n\nMethod 5: Test authentication"
echo "-----------------------------"
curl -s -X GET "${NS_API_BASE_URL}auth/test" \
    -H "Authorization: Bearer ${NS_API_KEY}" | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X GET "${NS_API_BASE_URL}auth/test" -H "Authorization: Bearer ${NS_API_KEY}")"

# Method 6: Try API key as parameter
echo -e "\n\nMethod 6: API key as parameter"
echo "------------------------------"
curl -s -X GET "${NS_API_BASE_URL}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json&api_key=${NS_API_KEY}" | jq '.' 2>/dev/null || echo "Raw response: $(curl -s -X GET "${NS_API_BASE_URL}?object=uiconfig&action=read&domain=${NS_DEFAULT_DOMAIN}&format=json&api_key=${NS_API_KEY}")"