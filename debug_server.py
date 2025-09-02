#!/usr/bin/env python3
"""
Debug script to test the server startup and endpoints
"""

import requests
import time
import subprocess
import sys
import os

def test_server():
    print("🔍 Debugging server startup...")
    
    # Test 1: Check if server is running
    print("\n1. Testing if server is running...")
    try:
        response = requests.get("http://localhost:8001/", timeout=2)
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Server not running: {e}")
    
    # Test 2: Try to start the server
    print("\n2. Attempting to start server...")
    try:
        # Change to backend directory and start server
        os.chdir("backend")
        process = subprocess.Popen([sys.executable, "main.py"], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE, 
                                 text=True)
        
        # Wait for server to start
        time.sleep(5)
        
        # Check if server is now running
        try:
            response = requests.get("http://localhost:8001/", timeout=2)
            if response.status_code == 200:
                print("✅ Server started successfully")
                
                # Test 3: Test the query endpoint
                print("\n3. Testing query endpoint...")
                try:
                    response = requests.post("http://localhost:8001/query", json={
                        "user_id": "test_user",
                        "query": "What are my interests?"
                    }, timeout=5)
                    print(f"Query endpoint status: {response.status_code}")
                    if response.status_code == 200:
                        print("✅ Query endpoint working")
                    else:
                        print(f"❌ Query endpoint error: {response.text}")
                except Exception as e:
                    print(f"❌ Query endpoint error: {e}")
                
                # Test 4: Test the Gemini endpoint
                print("\n4. Testing Gemini endpoint...")
                try:
                    response = requests.post("http://localhost:8001/query-gemini", json={
                        "user_id": "test_user",
                        "query": "What are my interests?",
                        "include_summary": True
                    }, timeout=5)
                    print(f"Gemini endpoint status: {response.status_code}")
                    print(f"Gemini endpoint response: {response.text}")
                    if response.status_code == 503:
                        print("✅ Gemini endpoint working (API key not set - expected)")
                    elif response.status_code == 200:
                        print("✅ Gemini endpoint working with API key")
                    else:
                        print(f"❌ Gemini endpoint error: {response.text}")
                except Exception as e:
                    print(f"❌ Gemini endpoint error: {e}")
                
                # Stop the server
                process.terminate()
                process.wait()
                return True
            else:
                print(f"❌ Server started but responded with status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Server started but not responding: {e}")
            
        # Get server output for debugging
        stdout, stderr = process.communicate()
        if stdout:
            print("Server stdout:", stdout)
        if stderr:
            print("Server stderr:", stderr)
            
        process.terminate()
        process.wait()
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
    
    return False

if __name__ == "__main__":
    test_server()
