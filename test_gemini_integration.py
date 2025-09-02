#!/usr/bin/env python3
"""
Test script for Gemini API integration with Infinite Memory
"""

import requests
import json
import time

def test_gemini_integration():
    """Test the Gemini-powered query endpoint"""
    base_url = "http://localhost:8001"
    
    print("🤖 Testing Gemini API Integration...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Health Check: OK")
        else:
            print(f"❌ Health Check: Status {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Health Check: {e}")
        return
    
    # Test 2: Add some test data first
    print("\n2. Adding test data...")
    test_user_id = "gemini_test_user"
    
    # Add some memories
    test_texts = [
        "I love working on AI projects and machine learning",
        "My favorite programming language is Python",
        "I'm planning to learn more about natural language processing",
        "I have a meeting tomorrow at 2 PM about the new project",
        "I need to finish the documentation by Friday"
    ]
    
    for text in test_texts:
        try:
            response = requests.post(f"{base_url}/process-text", json={
                "user_id": test_user_id,
                "text": text
            })
            if response.status_code == 200:
                print(f"✅ Added memory: {text[:30]}...")
            else:
                print(f"❌ Failed to add memory: {response.status_code}")
        except Exception as e:
            print(f"❌ Error adding memory: {e}")
    
    # Test 3: Test regular query (without Gemini)
    print("\n3. Testing regular query...")
    try:
        response = requests.post(f"{base_url}/query", json={
            "user_id": test_user_id,
            "query": "What programming languages do I like?"
        })
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Regular Query: {result['answer'][:100]}...")
        else:
            print(f"❌ Regular Query: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Regular Query Error: {e}")
    
    # Test 4: Test Gemini-powered query
    print("\n4. Testing Gemini-powered query...")
    try:
        response = requests.post(f"{base_url}/query-gemini", json={
            "user_id": test_user_id,
            "query": "What are my main interests and upcoming tasks?",
            "include_summary": True
        })
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Gemini Query Answer: {result['answer'][:200]}...")
            if result.get('summary'):
                print(f"📊 Gemini Summary: {result['summary'][:200]}...")
            if result.get('data_points'):
                print(f"📈 Data Points: {result['data_points']}")
        elif response.status_code == 503:
            print("⚠️  Gemini API not configured (GEMINI_API_KEY not set)")
            print("   This is expected if you haven't set up the API key yet")
        else:
            print(f"❌ Gemini Query: Status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Gemini Query Error: {e}")
    
    # Test 5: Test conversation history
    print("\n5. Testing conversation history...")
    try:
        response = requests.get(f"{base_url}/conversation-history/{test_user_id}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Conversation History: {len(result['conversations'])} conversations")
        else:
            print(f"❌ Conversation History: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Conversation History Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Gemini Integration Test Complete!")
    print("\nTo use Gemini features:")
    print("1. Get a Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Set environment variable: GEMINI_API_KEY=AIzaSyA8dKcom49mGUHTPZSl326gJNRiXvgoQy0
    print("3. Restart the backend")

if __name__ == "__main__":
    test_gemini_integration()
