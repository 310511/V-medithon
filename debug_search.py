#!/usr/bin/env python3
"""
Debug the search functionality
"""

import requests
import time
import subprocess
import sys
import os

def debug_search():
    print("🔍 Debugging Search Functionality...")
    
    # Start the server
    print("\n1. Starting the server...")
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
        
        print("✅ Server is running")
        
        # Add a simple test memory
        print("\n2. Adding test memory...")
        test_data = {
            "user_id": "debug_user",
            "text": "I love programming in Python and building web applications with React."
        }
        
        response = requests.post("http://localhost:8001/process-text", json=test_data, timeout=5)
        if response.status_code == 200:
            print("✅ Test memory added successfully")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Failed to add test memory: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Test direct memory retrieval
        print("\n3. Testing direct memory retrieval...")
        try:
            response = requests.get("http://localhost:8001/memories/debug_user", timeout=5)
            if response.status_code == 200:
                memories = response.json()
                print(f"✅ Retrieved {len(memories.get('memories', []))} memories")
                for memory in memories.get('memories', []):
                    print(f"   Memory: {memory.get('summary', 'N/A')}")
                    print(f"   Content: {memory.get('content', 'N/A')[:100]}...")
            else:
                print(f"❌ Failed to retrieve memories: {response.status_code}")
        except Exception as e:
            print(f"❌ Error retrieving memories: {e}")
        
        # Test search with simple query
        print("\n4. Testing search with simple query...")
        test_queries = [
            "Python",
            "programming", 
            "React",
            "web applications",
            "love"
        ]
        
        for query in test_queries:
            print(f"\n   Testing query: '{query}'")
            try:
                response = requests.post("http://localhost:8001/query", json={
                    "user_id": "debug_user",
                    "query": query
                }, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"   ✅ Status: 200")
                    print(f"   Matched Keywords: {data.get('matched_keywords', [])}")
                    print(f"   Total Matches: {data.get('total_matches', 0)}")
                    print(f"   Final Answer: {data.get('final_answer', 'N/A')}")
                    
                    if data.get('retrieved_memory'):
                        memory = data['retrieved_memory']
                        print(f"   Retrieved Memory Summary: {memory.get('summary', 'N/A')}")
                else:
                    print(f"   ❌ Status: {response.status_code}")
                    print(f"   Response: {response.text}")
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
        
        # Stop the server
        print("\n5. Stopping server...")
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
    debug_search()
