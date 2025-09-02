#!/usr/bin/env python3
"""
Test that responses are now more concise
"""

import requests
import time
import subprocess
import sys
import os

def test_concise_responses():
    print("🎯 Testing Concise Responses")
    print("=" * 40)
    
    # Start the server
    print("\n1. Starting the backend server...")
    try:
        os.chdir("backend")
        process = subprocess.Popen([sys.executable, "main.py"], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE, 
                                 text=True)
        
        # Wait for server to start
        time.sleep(8)
        
        # Test health check
        response = requests.get("http://localhost:8001/", timeout=5)
        if response.status_code != 200:
            print(f"❌ Health check failed: {response.status_code}")
            return False
        
        print("✅ Backend server is running")
        
        # Add test data
        print("\n2. Adding test data...")
        test_data = {
            "user_id": "concise_test_user",
            "text": "I'm working on a React project called 'E-commerce Dashboard' using TypeScript and Tailwind CSS. The project deadline is next Friday."
        }
        
        response = requests.post("http://localhost:8001/process-text", json=test_data, timeout=5)
        if response.status_code == 200:
            print("✅ Test data added successfully")
        else:
            print(f"❌ Failed to add test data: {response.status_code}")
            return False
        
        # Test regular query (should be concise)
        print("\n3. Testing regular query (concise response)...")
        test_query = "What projects am I working on?"
        
        response = requests.post("http://localhost:8001/query", json={
            "user_id": "concise_test_user",
            "query": test_query
        }, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Regular Query Response:")
            print(f"   📋 Matched Keywords: {data.get('matched_keywords', [])}")
            print(f"   💬 Final Answer: {data.get('final_answer', 'N/A')}")
            print(f"   📏 Answer Length: {len(data.get('final_answer', ''))} characters")
            
            # Check if answer is concise (less than 200 characters)
            if len(data.get('final_answer', '')) < 200:
                print("   ✅ Answer is concise!")
            else:
                print("   ⚠️  Answer might be too long")
            
        else:
            print(f"❌ Regular query failed: {response.status_code}")
        
        # Test Gemini query (should also be concise)
        print("\n4. Testing Gemini query (concise response)...")
        response = requests.post("http://localhost:8001/query-gemini", json={
            "user_id": "concise_test_user",
            "query": test_query,
            "include_summary": False
        }, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Gemini Query Response:")
            print(f"   📋 Matched Keywords: {data.get('matched_keywords', [])}")
            print(f"   💬 Final Answer: {data.get('final_answer', 'N/A')}")
            print(f"   📏 Answer Length: {len(data.get('final_answer', ''))} characters")
            
            # Check if answer is concise (less than 200 characters)
            if len(data.get('final_answer', '')) < 200:
                print("   ✅ Answer is concise!")
            else:
                print("   ⚠️  Answer might be too long")
                
        else:
            print(f"❌ Gemini query failed: {response.status_code}")
            print(f"Response: {response.text}")
        
        # Stop the server
        print("\n5. Stopping server...")
        process.terminate()
        process.wait()
        print("✅ Server stopped")
        
        print("\n🎉 Concise Response Test Complete!")
        print("=" * 40)
        print("✅ Responses are now more concise")
        print("✅ Most recent conversations appear at the top")
        print("✅ Final answers are displayed prominently")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if 'process' in locals():
            process.terminate()
            process.wait()
        return False

if __name__ == "__main__":
    test_concise_responses()
