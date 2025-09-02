#!/usr/bin/env python3
import requests

# Test if the endpoint exists by checking the OpenAPI schema
response = requests.get("http://localhost:8001/openapi.json")
if response.status_code == 200:
    schema = response.json()
    paths = schema.get("paths", {})
    if "/query-gemini" in paths:
        print("✅ /query-gemini endpoint exists in OpenAPI schema")
        print(f"Method: {list(paths['/query-gemini'].keys())}")
    else:
        print("❌ /query-gemini endpoint not found in OpenAPI schema")
        print("Available endpoints:")
        for path in paths.keys():
            print(f"  - {path}")
else:
    print(f"❌ Failed to get OpenAPI schema: {response.status_code}")
