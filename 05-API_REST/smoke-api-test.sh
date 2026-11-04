#!/usr/bin/env bash

BASE_URL="http://localhost:3000/api"

echo "=== 1. READ ALL CITIES (GET) ==="
curl -s -X GET "$BASE_URL/cities"
echo -e "\n"

echo "=== 2. READ ALL HOTELS (GET) ==="
curl -s -X GET "$BASE_URL/hotels"
echo -e "\n"

echo "=== 3. CREATE HOTEL (POST) ==="
# Returns 204 No Content
curl -i -s -X POST "$BASE_URL/hotels" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hyatt Seattle",
    "type": "hotel",
    "city": "Seattle",
    "stateProvinceCode": "WA",
    "countryCode": "US",
    "highRate": 320,
    "lowRate": 210
  }'
echo -e "\n"

echo "=== 4. READ SPECIFIC HOTEL (GET by ID) ==="
# Using ID '1' from the initial mock dataset
curl -s -X GET "$BASE_URL/hotels/1"
echo -e "\n"

echo "=== 5. UPDATE HOTEL (PUT by ID) ==="
# Returns 204 No Content
curl -i -s -X PUT "$BASE_URL/hotels/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Motif Seattle (Renovated)",
    "highRate": 349,
    "lowRate": 279
  }'
echo -e "\n"

echo "=== 6. VERIFY UPDATE (GET by ID) ==="
curl -s -X GET "$BASE_URL/hotels/1"
echo -e "\n"

echo "=== 7. DELETE HOTEL (DELETE by ID) ==="
# Returns 204 No Content
curl -i -s -X DELETE "$BASE_URL/hotels/1"
echo -e "\n"

echo "=== 8. VERIFY DELETION (GET by ID) ==="
# Should return null / empty JSON
curl -s -X GET "$BASE_URL/hotels/1"
echo -e "\n"