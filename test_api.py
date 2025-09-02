#!/usr/bin/env python3
"""
Simple test script for the infinite memory API
"""

import requests
import json

def test_api():
    base_url = "http://localhost:8001"
    
    print("🧪 Testing Infinite Memory API...")
    
    # Test 1: Health Check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Process Text
    print("\n2. Testing Text Processing...")
    try:
        payload = {
            "user_id": "test_user_123",
            "text": "Hello, this is a test message for infinite memory"
        }
        
        response = requests.post(f"{base_url}/process-text", json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Get Conversation History
    print("\n3. Testing Conversation History...")
    try:
        response = requests.get(f"{base_url}/conversation-history/test_user_123")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Conversations: {len(data.get('conversations', []))}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

<<<<<<< HEAD
if __name__ == "__main__":
    test_api()
=======



>>>>>>> a3d3a2fa81e70fb302e38c467b80d9eb68b2d9af
