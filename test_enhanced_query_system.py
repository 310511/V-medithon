#!/usr/bin/env python3
"""
Test the enhanced query system with structured responses
"""

import requests
import time
import subprocess
import sys
import os
import json

def test_enhanced_query_system():
    print("🔍 Testing Enhanced Query System...")
    
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
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
        
        # Add diverse test data
        print("\n3. Adding diverse test data...")
        test_data = [
            {
                "user_id": "test_user_enhanced",
                "text": "I'm working on a React project called 'E-commerce Dashboard' using TypeScript and Tailwind CSS. The project deadline is next Friday."
            },
            {
                "user_id": "test_user_enhanced", 
                "text": "Had a meeting with John Smith about the Python machine learning project. We discussed using TensorFlow and scikit-learn for data analysis."
            },
            {
                "user_id": "test_user_enhanced",
                "text": "Remember to call Dr. Johnson about the medical appointment scheduled for December 15th at 2:00 PM."
            },
            {
                "user_id": "test_user_enhanced",
                "text": "The JavaScript conference in San Francisco was amazing! Met Sarah from Google and learned about new ES2024 features."
            },
            {
                "user_id": "test_user_enhanced",
                "text": "Working on a Node.js backend API with Express and MongoDB. Need to implement JWT authentication by tomorrow."
            }
        ]
        
        for data in test_data:
            try:
                response = requests.post("http://localhost:8001/process-text", json=data, timeout=5)
                if response.status_code == 200:
                    print(f"✅ Added: {data['text'][:50]}...")
                else:
                    print(f"❌ Failed to add: {response.status_code}")
            except Exception as e:
                print(f"❌ Error adding data: {e}")
        
        # Test enhanced query system
        print("\n4. Testing Enhanced Query System...")
        
        test_queries = [
            "What projects am I working on?",
            "Tell me about React development",
            "Who did I meet at the conference?",
            "What programming languages do I use?",
            "When is my medical appointment?",
            "Tell me about machine learning",
            "What is my deadline for the e-commerce project?"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n--- Test Query {i}: '{query}' ---")
            
            try:
                # Test regular query endpoint
                response = requests.post("http://localhost:8001/query", json={
                    "user_id": "test_user_enhanced",
                    "query": query
                }, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Regular Query Response:")
                    print(f"   Matched Keywords: {data.get('matched_keywords', [])}")
                    print(f"   Total Matches: {data.get('total_matches', 0)}")
                    
                    if data.get('retrieved_memory'):
                        memory = data['retrieved_memory']
                        print(f"   Retrieved Memory:")
                        print(f"     Summary: {memory.get('summary', 'N/A')}")
                        print(f"     Topics: {memory.get('topics', [])}")
                        print(f"     Relevance Score: {memory.get('relevance_score', 0)}")
                    
                    print(f"   Final Answer: {data.get('final_answer', 'N/A')}")
                else:
                    print(f"❌ Regular query failed: {response.status_code}")
                    print(f"   Response: {response.text}")
                
                # Test Gemini query endpoint (if API key is available)
                print(f"\n   Testing Gemini Query...")
                try:
                    gemini_response = requests.post("http://localhost:8001/query-gemini", json={
                        "user_id": "test_user_enhanced",
                        "query": query,
                        "include_summary": False
                    }, timeout=15)
                    
                    if gemini_response.status_code == 200:
                        gemini_data = gemini_response.json()
                        print(f"✅ Gemini Query Response:")
                        print(f"   Matched Keywords: {gemini_data.get('matched_keywords', [])}")
                        print(f"   Total Matches: {gemini_data.get('total_matches', 0)}")
                        print(f"   Final Answer: {gemini_data.get('final_answer', 'N/A')[:100]}...")
                    elif gemini_response.status_code == 503:
                        print("   ⚠️ Gemini API not configured (expected if no API key)")
                    else:
                        print(f"   ❌ Gemini query failed: {gemini_response.status_code}")
                        print(f"   Response: {gemini_response.text}")
                        
                except Exception as e:
                    print(f"   ❌ Gemini query error: {e}")
                
            except Exception as e:
                print(f"❌ Query error: {e}")
        
        # Test with no matches
        print(f"\n--- Test Query: 'Tell me about quantum computing' (No matches expected) ---")
        try:
            response = requests.post("http://localhost:8001/query", json={
                "user_id": "test_user_enhanced",
                "query": "Tell me about quantum computing"
            }, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ No Match Response:")
                print(f"   Matched Keywords: {data.get('matched_keywords', [])}")
                print(f"   Total Matches: {data.get('total_matches', 0)}")
                print(f"   Final Answer: {data.get('final_answer', 'N/A')}")
            else:
                print(f"❌ No match query failed: {response.status_code}")
        except Exception as e:
            print(f"❌ No match query error: {e}")
        
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
    test_enhanced_query_system()
