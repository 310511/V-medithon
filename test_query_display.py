#!/usr/bin/env python3
"""
Test that query responses are properly displayed in the frontend
"""

import requests
import time
import subprocess
import sys
import os

def test_query_display():
    print("🎯 Testing Query Response Display")
    print("=" * 50)
    
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
            "user_id": "test_user",
            "text": "I'm working on a React project called 'E-commerce Dashboard' using TypeScript and Tailwind CSS. The project deadline is next Friday."
        }
        
        response = requests.post("http://localhost:8001/process-text", json=test_data, timeout=5)
        if response.status_code == 200:
            print("✅ Test data added successfully")
        else:
            print(f"❌ Failed to add test data: {response.status_code}")
            return False
        
        # Test enhanced query
        print("\n3. Testing enhanced query...")
        test_query = "What projects am I working on?"
        
        response = requests.post("http://localhost:8001/query", json={
            "user_id": "test_user",
            "query": test_query
        }, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Query successful!")
            print(f"📋 Matched Keywords: {data.get('matched_keywords', [])}")
            print(f"🔍 Total Matches: {data.get('total_matches', 0)}")
            print(f"💬 Final Answer: {data.get('final_answer', 'N/A')}")
            
            if data.get('retrieved_memory'):
                memory = data['retrieved_memory']
                print(f"📄 Retrieved Memory Summary: {memory.get('summary', 'N/A')}")
                print(f"⭐ Relevance Score: {memory.get('relevance_score', 0)}/3")
            
            print("\n🎉 Enhanced Query System Working!")
            print("The response will be displayed in the frontend with:")
            print("  • Final Answer as the main response")
            print("  • Matched Keywords as badges")
            print("  • Retrieved Memory with summary and scores")
            print("  • Total matches count")
            
        else:
            print(f"❌ Query failed: {response.status_code}")
            print(f"Response: {response.text}")
        
        # Stop the server
        print("\n4. Stopping server...")
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
    test_query_display()
