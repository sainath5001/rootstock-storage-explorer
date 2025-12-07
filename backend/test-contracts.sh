#!/bin/bash

# Test script for contract addresses
# Usage: ./test-contracts.sh

API_URL="http://localhost:3001/api"

echo "=== Testing Contract Addresses via API ==="
echo ""

addresses=(
  "0x2acc95758f8b5f583470ba265eb685a8f45fc9d5:RIF Token"
  "0xe700691da7b9851f2f35f8b8182c69c53ccad9db:DOC Token"
  "0x440cd83c160de5c96ddb20246815ea44c7abbca8:BPRO Token"
)

for entry in "${addresses[@]}"; do
  IFS=':' read -r address name <<< "$entry"
  echo "Testing $name..."
  echo "Address: $address"
  
  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/storage?address=$address")
  http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
  body=$(echo "$response" | sed '/HTTP_CODE/d')
  
  if [ "$http_code" = "200" ]; then
    slot_count=$(echo "$body" | grep -o '"slot":' | wc -l)
    echo "✓ SUCCESS - Found $slot_count storage slots"
    echo ""
  else
    echo "✗ FAILED - HTTP $http_code"
    echo "Response: $body" | head -3
    echo ""
  fi
done

echo "=== Test Complete ==="

