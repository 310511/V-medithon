#!/usr/bin/env python3
"""
Test Gemini API integration with infinite memory system
"""

import os
import sys
import requests
import json
from datetime import datetime

# Test configuration
GEMINI_API_KEY = "AIzaSyByWvWkLKedG2WKnxtVhefQBRLZyrwf-tE"
INFINITE_MEMORY_URL = "https://dosewise-infinite-memory.onrender.com"

def test_gemini_api_direct():
    """Test Gemini API directly"""
    print("🧪 Testing Gemini API directly...")
    
    try:
        import google.generativeai as genai
        
        # Configure Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Create model (updated model name)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Test prompt
        prompt = "Hello, this is a test of the Gemini API integration. Please respond with a simple greeting."
        
        # Generate response
        response = model.generate_content(prompt)
        
        print(f"✅ Gemini API Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        return False

def test_infinite_memory_api():
    """Test infinite memory API with Gemini integration"""
    print("\n🧪 Testing Infinite Memory API...")
    
    try:
        # Test health endpoint
        health_url = f"{INFINITE_MEMORY_URL}/health"
        response = requests.get(health_url, timeout=10)
        
        if response.status_code == 200:
            print("✅ Infinite Memory API is healthy")
        else:
            print(f"⚠️ Infinite Memory API health check failed: {response.status_code}")
            return False
            
        # Test memory storage with AI analysis
        memory_url = f"{INFINITE_MEMORY_URL}/process-text"
        test_memory = {
            "text": "Patient John Doe has diabetes and needs insulin monitoring",
            "user_id": "test_user_123"
        }
        
        response = requests.post(memory_url, json=test_memory, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Memory stored successfully: {result.get('id', 'Unknown ID')}")
            
            # Test AI analysis
            if 'ai_analysis' in result:
                print(f"✅ AI Analysis: {result['ai_analysis']}")
            else:
                print("⚠️ No AI analysis in response")
                
            return True
        else:
            print(f"❌ Memory storage failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Infinite Memory API Error: {e}")
        return False

def test_gemini_infinite_memory_integration():
    """Test the complete integration"""
    print("\n🚀 Testing Complete Gemini + Infinite Memory Integration...")
    
    try:
        # Test conversation endpoint
        conversation_url = f"{INFINITE_MEMORY_URL}/query-gemini"
        test_conversation = {
            "query": "What are the symptoms of diabetes?",
            "user_id": "test_user_123"
        }
        
        response = requests.post(conversation_url, json=test_conversation, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Conversation processed successfully")
            print(f"✅ AI Response: {result.get('response', 'No response')}")
            
            if 'memory_id' in result:
                print(f"✅ Memory ID: {result['memory_id']}")
                
            return True
        else:
            print(f"❌ Conversation failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Integration Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🔬 DoseWise Healthcare AI - Gemini API Integration Test")
    print("=" * 60)
    
    # Test 1: Direct Gemini API
    gemini_ok = test_gemini_api_direct()
    
    # Test 2: Infinite Memory API
    memory_ok = test_infinite_memory_api()
    
    # Test 3: Complete Integration
    integration_ok = test_gemini_infinite_memory_integration()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print(f"   Gemini API Direct: {'✅ PASS' if gemini_ok else '❌ FAIL'}")
    print(f"   Infinite Memory API: {'✅ PASS' if memory_ok else '❌ FAIL'}")
    print(f"   Complete Integration: {'✅ PASS' if integration_ok else '❌ FAIL'}")
    
    if all([gemini_ok, memory_ok, integration_ok]):
        print("\n🎉 All tests passed! Gemini API is fully integrated!")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
    
    return all([gemini_ok, memory_ok, integration_ok])

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)