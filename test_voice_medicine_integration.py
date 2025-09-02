#!/usr/bin/env python3
"""
Test Voice Medicine Integration
- Tests the voice medicine API endpoints
- Verifies Gemini integration
- Tests symptom extraction and diagnosis
"""

import requests
import json
import time
import sys
from pathlib import Path

# API Configuration
VOICE_MEDICINE_API_URL = "http://localhost:8002"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{VOICE_MEDICINE_API_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_gemini_connection():
    """Test Gemini API connection"""
    print("\n🤖 Testing Gemini connection...")
    try:
        response = requests.get(f"{VOICE_MEDICINE_API_URL}/test-gemini")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Gemini test: {data}")
            return data.get("status") == "available"
        else:
            print(f"❌ Gemini test failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Gemini test error: {e}")
        return False

def test_symptom_extraction():
    """Test symptom extraction endpoint"""
    print("\n🔬 Testing symptom extraction...")
    try:
        test_input = {
            "voice_text": "I have been having a fever for three days with cough and body ache",
            "user_id": "test_user",
            "session_id": "test_session"
        }
        
        response = requests.post(
            f"{VOICE_MEDICINE_API_URL}/extract-symptoms",
            json=test_input
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Symptom extraction successful:")
            print(f"   Symptoms: {data.get('symptoms', [])}")
            print(f"   Duration: {data.get('duration', 'N/A')}")
            print(f"   Severity: {data.get('severity', 'N/A')}")
            print(f"   Model used: {data.get('model_used', 'N/A')}")
            return True
        else:
            print(f"❌ Symptom extraction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Symptom extraction error: {e}")
        return False

def test_full_diagnosis():
    """Test full voice input processing"""
    print("\n🏥 Testing full diagnosis...")
    try:
        test_input = {
            "voice_text": "I've been having a fever for three days with cough and body ache. I also feel very tired and have a headache.",
            "user_id": "test_user",
            "session_id": "test_session_full"
        }
        
        response = requests.post(
            f"{VOICE_MEDICINE_API_URL}/process-voice-input",
            json=test_input
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Full diagnosis successful:")
            print(f"   Session ID: {data.get('session_id')}")
            print(f"   Processing time: {data.get('processing_time', 0):.2f}s")
            print(f"   Model used: {data.get('model_used', 'N/A')}")
            
            # Extract symptoms
            symptoms = data.get('symptom_extraction', {}).get('symptoms', [])
            print(f"   Extracted symptoms: {symptoms}")
            
            # Diagnosis result
            diagnosis = data.get('diagnosis_result', {})
            print(f"   Final diagnosis: {diagnosis.get('final_diagnosis', 'N/A')}")
            print(f"   Urgency level: {diagnosis.get('urgency_level', 'N/A')}")
            
            # Recommendations
            recommendations = diagnosis.get('recommendations', [])
            print(f"   Recommendations: {len(recommendations)} items")
            
            # Disclaimer
            disclaimer = diagnosis.get('disclaimer', '')
            print(f"   Disclaimer included: {'✅' if 'consult a qualified doctor' in disclaimer else '❌'}")
            
            return True
        else:
            print(f"❌ Full diagnosis failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Full diagnosis error: {e}")
        return False

def test_multiple_scenarios():
    """Test multiple medical scenarios"""
    print("\n🧪 Testing multiple medical scenarios...")
    
    test_scenarios = [
        {
            "name": "Common Cold",
            "input": "I have a runny nose, sore throat, and mild cough for 2 days"
        },
        {
            "name": "Headache",
            "input": "I've been having a severe headache for several hours with sensitivity to light"
        },
        {
            "name": "Fever",
            "input": "I have a high fever, chills, and body aches for 1 day"
        },
        {
            "name": "Stomach Issues",
            "input": "I feel nauseous and have been vomiting for the past few hours"
        }
    ]
    
    success_count = 0
    
    for scenario in test_scenarios:
        print(f"\n   Testing: {scenario['name']}")
        try:
            test_input = {
                "voice_text": scenario['input'],
                "user_id": "test_user",
                "session_id": f"test_session_{scenario['name'].lower().replace(' ', '_')}"
            }
            
            response = requests.post(
                f"{VOICE_MEDICINE_API_URL}/process-voice-input",
                json=test_input
            )
            
            if response.status_code == 200:
                data = response.json()
                diagnosis = data.get('diagnosis_result', {})
                print(f"   ✅ {scenario['name']}: {diagnosis.get('final_diagnosis', 'N/A')[:50]}...")
                success_count += 1
            else:
                print(f"   ❌ {scenario['name']}: Failed ({response.status_code})")
                
        except Exception as e:
            print(f"   ❌ {scenario['name']}: Error - {e}")
    
    print(f"\n   Results: {success_count}/{len(test_scenarios)} scenarios successful")
    return success_count == len(test_scenarios)

def main():
    """Main test function"""
    print("🎤 Voice Medicine Integration Test")
    print("=" * 50)
    
    # Check if server is running
    print("Checking if voice medicine server is running...")
    try:
        response = requests.get(f"{VOICE_MEDICINE_API_URL}/", timeout=5)
        if response.status_code == 200:
            print("✅ Voice medicine server is running")
        else:
            print("❌ Voice medicine server is not responding properly")
            return 1
    except Exception as e:
        print(f"❌ Cannot connect to voice medicine server: {e}")
        print("Please start the server first with: python start_voice_medicine_backend.py")
        return 1
    
    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("Gemini Connection", test_gemini_connection),
        ("Symptom Extraction", test_symptom_extraction),
        ("Full Diagnosis", test_full_diagnosis),
        ("Multiple Scenarios", test_multiple_scenarios)
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed_tests += 1
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"🎯 Test Results: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Voice medicine integration is working correctly.")
        return 0
    else:
        print("⚠️ Some tests failed. Please check the server configuration.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
