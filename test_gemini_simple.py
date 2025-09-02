#!/usr/bin/env python3
import requests
import json

# Test the Gemini endpoint with minimal data
try:
    response = requests.post("http://localhost:8001/query-gemini", json={
        "user_id": "test_user",
        "query": "test query"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 503:
        print("✅ Expected: Gemini API not configured")
    elif response.status_code == 200:
        print("✅ Success!")
    else:
        print(f"❌ Unexpected status: {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")