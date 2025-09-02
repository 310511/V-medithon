#!/usr/bin/env python3
"""
Test script for Infinite Memory with Permanent Storage Integration
"""

import requests
import json
import time

def test_infinite_memory_integration():
    """Test the infinite memory API integration"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Infinite Memory with Permanent Storage Integration")
    print("=" * 60)
    
    # Test 1: Health Check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check Passed")
            print(f"   Status: {data['status']}")
            print(f"   Version: {data['version']}")
            print(f"   Database: {data['database']}")
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False
    
    # Test 2: Process Text
    print("\n2. Testing Text Processing...")
    try:
        test_text = "I have a headache and need to take medicine. This is important to remember."
        payload = {
            "user_id": "test_user_123",
            "text": test_text
        }
        
        response = requests.post(f"{base_url}/process-text", json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Text Processing Passed")
            print(f"   Importance Score: {data['importance_score']}")
            print(f"   Sentiment: {data['sentiment']}")
            print(f"   Topics: {data['topics']}")
            print(f"   Entities: {data['entities']}")
        else:
            print(f"❌ Text Processing Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Text Processing Error: {e}")
        return False
    
    # Test 3: Query Memory
    print("\n3. Testing Memory Query...")
    try:
        query_payload = {
            "user_id": "test_user_123",
            "query": "What did I say about my headache?"
        }
        
        response = requests.post(f"{base_url}/query", json=query_payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Memory Query Passed")
            print(f"   Answer: {data['answer'][:100]}...")
            print(f"   Context Items: {len(data['context'])}")
        else:
            print(f"❌ Memory Query Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Memory Query Error: {e}")
        return False
    
    # Test 4: Create Task
    print("\n4. Testing Task Creation...")
    try:
        task_payload = {
            "patient_id": "test_user_123",
            "summary": "Take medicine for headache",
            "start_date": "2024-01-01",
            "end_date": "2024-01-02",
            "description": "Remember to take pain relief medicine as discussed"
        }
        
        response = requests.post(f"{base_url}/tasks/create", json=task_payload)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Task Creation Passed")
            print(f"   Task ID: {data['task_id']}")
            print(f"   Summary: {data['summary']}")
            print(f"   Completed: {data['completed']}")
        else:
            print(f"❌ Task Creation Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Task Creation Error: {e}")
        return False
    
    # Test 5: Get Tasks
    print("\n5. Testing Task Retrieval...")
    try:
        response = requests.get(f"{base_url}/tasks/test_user_123")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Task Retrieval Passed")
            print(f"   Tasks Found: {len(data)}")
            if data:
                print(f"   First Task: {data[0]['summary']}")
        else:
            print(f"❌ Task Retrieval Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Task Retrieval Error: {e}")
        return False
    
    # Test 6: Get Memory Report
    print("\n6. Testing Memory Report...")
    try:
        response = requests.get(f"{base_url}/memory-report/test_user_123?days=7")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Memory Report Passed")
            print(f"   Total Interactions: {data['total_interactions']}")
            print(f"   Average Importance: {data['average_importance']:.2f}")
            print(f"   Memory Trends: {len(data['memory_trends'])} days")
        else:
            print(f"❌ Memory Report Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Memory Report Error: {e}")
        return False
    
    # Test 7: Get Conversation History
    print("\n7. Testing Conversation History...")
    try:
        response = requests.get(f"{base_url}/conversation-history/test_user_123")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Conversation History Passed")
            print(f"   Conversations Found: {len(data['conversations'])}")
        else:
            print(f"❌ Conversation History Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Conversation History Error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 All Tests Passed! Infinite Memory Integration is Working!")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    print("Starting Infinite Memory Integration Test...")
    print("Make sure the backend is running on http://localhost:8000")
    print("Press Ctrl+C to cancel, or wait 5 seconds to start...")
    
    try:
        time.sleep(5)
        success = test_infinite_memory_integration()
        if success:
            print("\n✅ Integration test completed successfully!")
        else:
            print("\n❌ Integration test failed!")
    except KeyboardInterrupt:
        print("\n🛑 Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Test error: {e}")
