#!/usr/bin/env python3
"""
Test script for the ML Backend
"""

import requests
import time
import json

def test_ml_backend():
    """Test the ML backend API"""
    
    # Test health check
    try:
        print("🔍 Testing ML Backend Health...")
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            print("✅ ML Backend is healthy!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ ML Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to ML Backend: {e}")
        return False
    
    # Test available models
    try:
        print("\n🔍 Testing Available Models...")
        response = requests.get("http://localhost:8001/models", timeout=5)
        if response.status_code == 200:
            models = response.json()
            print("✅ Models endpoint working!")
            print(f"Available models: {models}")
        else:
            print(f"❌ Models endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Models endpoint error: {e}")
    
    # Test statistics
    try:
        print("\n🔍 Testing Statistics...")
        response = requests.get("http://localhost:8001/stats", timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Statistics endpoint working!")
            print(f"Stats: {stats}")
        else:
            print(f"❌ Statistics endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Statistics endpoint error: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Starting ML Backend Test...")
    print("=" * 50)
    
    # Wait a bit for backend to start
    print("⏳ Waiting for backend to start...")
    time.sleep(2)
    
    success = test_ml_backend()
    
    if success:
        print("\n🎉 ML Backend Test Completed Successfully!")
        print("\n📋 Next Steps:")
        print("1. Open your browser to the React app")
        print("2. Go to Gene Expression Audit Trail")
        print("3. Upload a CSV file for real-time ML analysis")
        print("4. Watch the console for detailed logging")
    else:
        print("\n❌ ML Backend Test Failed!")
        print("\n🔧 Troubleshooting:")
        print("1. Check if Python is running")
        print("2. Check if required packages are installed")
        print("3. Check if port 8001 is available")
        print("4. Look for error messages in the backend console")
