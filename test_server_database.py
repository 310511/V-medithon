#!/usr/bin/env python3
"""
Test database through server
"""

import requests
import time
import subprocess
import sys
import os
import sqlite3

def test_server_database():
    print("🔍 Testing Database Through Server...")
    
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
        
        # Add test memory through API
        print("\n2. Adding test memory through API...")
        test_data = {
            "user_id": "server_test_user",
            "text": "I love programming in Python and building web applications with React."
        }
        
        response = requests.post("http://localhost:8001/process-text", json=test_data, timeout=5)
        if response.status_code == 200:
            print("✅ Test memory added through API")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Failed to add test memory: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        # Check database directly
        print("\n3. Checking database directly...")
        conn = sqlite3.connect("infinite_memory.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM memories")
        total_memories = cursor.fetchone()[0]
        print(f"✅ Total memories in database: {total_memories}")
        
        cursor.execute("SELECT user_id, content, summary FROM memories WHERE user_id = 'server_test_user'")
        memories = cursor.fetchall()
        print(f"✅ Memories for server_test_user: {len(memories)}")
        
        for i, memory in enumerate(memories):
            print(f"   Memory {i+1}:")
            print(f"     User ID: {memory[0]}")
            print(f"     Content: {memory[1][:100]}...")
            print(f"     Summary: {memory[2]}")
        
        conn.close()
        
        # Test search through API
        print("\n4. Testing search through API...")
        response = requests.post("http://localhost:8001/query", json={
            "user_id": "server_test_user",
            "query": "Python"
        }, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Search response:")
            print(f"   Matched Keywords: {data.get('matched_keywords', [])}")
            print(f"   Total Matches: {data.get('total_matches', 0)}")
            print(f"   Final Answer: {data.get('final_answer', 'N/A')}")
        else:
            print(f"❌ Search failed: {response.status_code}")
            print(f"   Response: {response.text}")
        
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
    test_server_database()
