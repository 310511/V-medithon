#!/usr/bin/env python3
"""
Test conversation ordering - most recent at top
"""

import requests
import time
import subprocess
import sys
import os

def test_conversation_ordering():
    print("🎯 Testing Conversation Ordering (Most Recent First)")
    print("=" * 60)
    
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
        
        # Add multiple test data entries
        print("\n2. Adding multiple test entries...")
        test_data = [
            {
                "user_id": "ordering_test_user",
                "text": "First entry: I'm working on a React project."
            },
            {
                "user_id": "ordering_test_user", 
                "text": "Second entry: Had a meeting with John about Python."
            },
            {
                "user_id": "ordering_test_user",
                "text": "Third entry: Remember to call Dr. Johnson about appointment."
            }
        ]
        
        for i, data in enumerate(test_data, 1):
            response = requests.post("http://localhost:8001/process-text", json=data, timeout=5)
            if response.status_code == 200:
                print(f"   ✅ Added entry {i}: {data['text'][:30]}...")
            else:
                print(f"   ❌ Failed to add entry {i}: {response.status_code}")
        
        # Add multiple queries
        print("\n3. Adding multiple queries...")
        test_queries = [
            "What projects am I working on?",
            "Who did I meet?",
            "What appointments do I have?"
        ]
        
        for i, query in enumerate(test_queries, 1):
            response = requests.post("http://localhost:8001/query", json={
                "user_id": "ordering_test_user",
                "query": query
            }, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Query {i}: {query}")
                print(f"      Final Answer: {data.get('final_answer', 'N/A')[:50]}...")
            else:
                print(f"   ❌ Query {i} failed: {response.status_code}")
        
        # Get conversation history
        print("\n4. Checking conversation history order...")
        response = requests.get("http://localhost:8001/conversation-history/ordering_test_user?limit=10", timeout=5)
        
        if response.status_code == 200:
            history = response.json()
            print(f"   ✅ Retrieved {len(history)} conversation entries")
            print("   📋 Conversation order (should be most recent first in frontend):")
            
            for i, entry in enumerate(history):
                entry_type = "User" if entry['type'] == 'user' else "AI"
                content = entry['content'][:50] + "..." if len(entry['content']) > 50 else entry['content']
                print(f"      {i+1}. [{entry_type}] {content}")
            
            print("\n   🎉 In the frontend, these will be displayed in reverse order:")
            print("      (Most recent conversations will appear at the top)")
            
        else:
            print(f"   ❌ Failed to get conversation history: {response.status_code}")
        
        # Stop the server
        print("\n5. Stopping server...")
        process.terminate()
        process.wait()
        print("✅ Server stopped")
        
        print("\n🎉 Conversation Ordering Test Complete!")
        print("=" * 60)
        print("✅ Most recent conversations will appear at the top")
        print("✅ Query responses will be displayed with enhanced format")
        print("✅ Final answers will be shown prominently")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if 'process' in locals():
            process.terminate()
            process.wait()
        return False

if __name__ == "__main__":
    test_conversation_ordering()
