#!/usr/bin/env python3
import requests
import json

def test_gemini_endpoint():
    print("🤖 Testing Gemini endpoint...")
    
    # Test the Gemini endpoint
    try:
        response = requests.post("http://localhost:8001/query-gemini", json={
            "user_id": "test_user",
            "query": "What are my interests?",
            "include_summary": True
        })
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 503:
            print("✅ Expected: Gemini API not configured (GEMINI_API_KEY not set)")
        elif response.status_code == 200:
            print("✅ Success: Gemini API is working!")
            result = response.json()
            print(f"Answer: {result.get('answer', 'No answer')[:200]}...")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gemini_endpoint()
