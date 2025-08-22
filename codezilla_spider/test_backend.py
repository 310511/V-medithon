#!/usr/bin/env python3
"""
Test script to verify the backend API is working
"""

import requests
import json
import time

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing EchoMed Backend API...")
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: AI Health Consultation
    try:
        test_data = {
            "user_id": "test-user",
            "message": "I have a headache",
            "conversation_history": []
        }
        response = requests.post(
            f"{base_url}/ai/health/consultation",
            json=test_data,
            timeout=30
        )
        print(f"✅ AI Health Consultation: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   AI Response: {result.get('response', 'No response')[:100]}...")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ AI Health Consultation failed: {e}")
    
    # Test 3: AI Medicine Recommendations
    try:
        test_data = {
            "user_id": "test-user",
            "symptoms": "I have a severe headache with nausea",
            "include_ai_analysis": True
        }
        response = requests.post(
            f"{base_url}/ai/medicine/recommend",
            json=test_data,
            timeout=30
        )
        print(f"✅ AI Medicine Recommendations: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Success: {result.get('success', False)}")
            if result.get('success'):
                data = result.get('data', {})
                print(f"   Urgency Level: {data.get('urgency_level', 'Unknown')}")
                print(f"   Recommendations: {len(data.get('recommendations', []))} items")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ AI Medicine Recommendations failed: {e}")
    
    print("\n🎉 Backend testing completed!")

if __name__ == "__main__":
    test_backend()
