#!/usr/bin/env python3
"""
Test Gemini integration with API key
"""

import requests
import time
import subprocess
import sys
import os
import json

def test_gemini_integration():
    print("🤖 Testing Gemini Integration with API Key...")
    
    # Start the server
    print("\n1. Starting the server...")
    try:
        os.chdir("backend")
        process = subprocess.Popen([sys.executable, "main.py"], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE, 
                                 text=True)
        
        # Wait for server to start
        print("Waiting for server to start...")
        time.sleep(8)
        
        # Test health check
        print("\n2. Testing health check...")
        try:
            response = requests.get("http://localhost:8001/", timeout=5)
            if response.status_code == 200:
                print("✅ Server is running")
                health_data = response.json()
                print(f"   Version: {health_data.get('version', 'Unknown')}")
                print(f"   Status: {health_data.get('status', 'Unknown')}")
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
        
        # Add some test data first
        print("\n3. Adding test data...")
        try:
            response = requests.post("http://localhost:8001/process-text", json={
                "user_id": "test_user_gemini",
                "text": "I love programming in Python and building web applications. I'm interested in AI and machine learning."
            }, timeout=5)
            if response.status_code == 200:
                print("✅ Test data added successfully")
            else:
                print(f"❌ Failed to add test data: {response.status_code}")
        except Exception as e:
            print(f"❌ Error adding test data: {e}")
        
        # Test Gemini endpoint
        print("\n4. Testing Gemini endpoint...")
        try:
            response = requests.post("http://localhost:8001/query-gemini", json={
                "user_id": "test_user_gemini",
                "query": "What are my interests and skills?",
                "include_summary": True
            }, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                print("✅ Gemini endpoint working with API key!")
                data = response.json()
                print(f"   Answer: {data.get('answer', 'No answer')[:100]}...")
                if data.get('summary'):
                    print(f"   Summary: {data.get('summary', 'No summary')[:100]}...")
                print(f"   Data Points: {data.get('data_points', {})}")
            elif response.status_code == 503:
                print("❌ Gemini API not configured (API key missing)")
                print(f"   Response: {response.text}")
            elif response.status_code == 500:
                print("❌ Server error")
                print(f"   Response: {response.text}")
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Gemini endpoint error: {e}")
        
        # Test regular query endpoint for comparison
        print("\n5. Testing regular query endpoint...")
        try:
            response = requests.post("http://localhost:8001/query", json={
                "user_id": "test_user_gemini",
                "query": "What are my interests?"
            }, timeout=5)
            
            if response.status_code == 200:
                print("✅ Regular query endpoint working")
                data = response.json()
                print(f"   Results: {len(data.get('results', []))} matches found")
            else:
                print(f"❌ Regular query failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Regular query error: {e}")
        
        # Stop the server
        print("\n6. Stopping server...")
        process.terminate()
        process.wait()
        print("✅ Server stopped")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if 'process' in locals():
            process.terminate()
            process.wait()
        return False

if __name__ == "__main__":
    test_gemini_integration()
