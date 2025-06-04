#!/bin/bash

# NetSapiens Configuration
NS_BASE_URL="https://gridfour.trynetsapiens.com"
NS_USERNAME="1004@gridfour"
NS_PASSWORD="Sb0j1003@MsH"
NS_DOMAIN="grid4comm"
NS_RESELLER="gridfour_reseller"

echo "NetSapiens Authentication and API Test"
echo "======================================"

# Step 1: Try to authenticate and get session
echo "1. Attempting authentication..."
echo "-------------------------------"

# Try login to get session cookie
login_response=$(curl -s -c cookies.txt -X POST "${NS_BASE_URL}/portal/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=${NS_USERNAME}" \
    -d "password=${NS_PASSWORD}" \
    -d "domain=gridfour" \
    -L)

# Check if we got a session
echo "Checking for session cookie..."
cat cookies.txt | grep -i "session"

# Step 2: Try to access UI configs through portal with session
echo -e "\n2. Accessing UI configs via portal..."
echo "------------------------------------"

# Try to get PORTAL_CSS_CUSTOM config
css_config=$(curl -s -b cookies.txt \
    "${NS_BASE_URL}/portal/uiconfigs/index/details/PORTAL_CSS_CUSTOM" \
    -H "Accept: application/json")

echo "CSS Config response (first 500 chars):"
echo "$css_config" | head -c 500

# Step 3: Try API with different auth methods
echo -e "\n\n3. Testing API endpoints with session..."
echo "----------------------------------------"

# Method A: With session cookie
curl -s -b cookies.txt -X GET \
    "${NS_BASE_URL}/ns-api/v2/?object=uiconfig&action=read&config_name=PORTAL_CSS_CUSTOM&domain=${NS_DOMAIN}" \
    -H "Accept: application/json" | head -c 200

echo -e "\n\n4. Try direct portal API calls..."
echo "----------------------------------"

# Try to get the actual values through AJAX endpoints the portal might use
curl -s -b cookies.txt -X POST \
    "${NS_BASE_URL}/portal/uiconfigs/getConfigValue" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "X-Requested-With: XMLHttpRequest" \
    -d "config_name=PORTAL_CSS_CUSTOM" \
    -d "domain=${NS_DOMAIN}"

# Clean up
rm -f cookies.txt

echo -e "\n\n5. Manual Check Instructions:"
echo "------------------------------"
echo "Since API access seems restricted, you can manually check the current values:"
echo "1. Log into: ${NS_BASE_URL}/portal/"
echo "2. Navigate to: System > UI Configuration"
echo "3. Search for: PORTAL_CSS_CUSTOM and PORTAL_EXTRA_JS"
echo "4. Current values should show the CDN URLs with version parameters"