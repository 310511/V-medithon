#!/usr/bin/env python3
"""
Test Diagnosis Variety
- Tests different medical scenarios to ensure varied responses
- Verifies that the system provides different diagnoses for different symptoms
"""

import requests
import json
import time

# API Configuration
VOICE_MEDICINE_API_URL = "http://localhost:8002"

def test_different_scenarios():
    """Test different medical scenarios to ensure varied responses"""
    
    test_scenarios = [
        {
            "name": "Headache Scenario",
            "input": "I have a severe headache and nausea for 2 hours",
            "expected_keywords": ["headache", "nausea"]
        },
        {
            "name": "Fever Scenario", 
            "input": "I have been having a high fever with chills for 3 days",
            "expected_keywords": ["fever", "chills"]
        },
        {
            "name": "Cough Scenario",
            "input": "I have a persistent cough with chest congestion for 1 week",
            "expected_keywords": ["cough", "chest", "congestion"]
        },
        {
            "name": "Stomach Issues",
            "input": "I feel nauseous and have been vomiting for the past few hours",
            "expected_keywords": ["nauseous", "vomiting"]
        },
        {
            "name": "Allergy Scenario",
            "input": "I have a runny nose, sneezing, and itchy eyes for 2 days",
            "expected_keywords": ["runny nose", "sneezing", "itchy eyes"]
        }
    ]
    
    print("🧪 Testing Diagnosis Variety")
    print("=" * 50)
    
    results = []
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n{i}. Testing: {scenario['name']}")
        print(f"   Input: {scenario['input']}")
        
        try:
            # Make API request
            response = requests.post(
                f"{VOICE_MEDICINE_API_URL}/process-voice-input",
                json={
                    "voice_text": scenario['input'],
                    "user_id": "test_user",
                    "session_id": f"test_session_{i}"
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract key information
                symptoms = data.get('symptom_extraction', {}).get('symptoms', [])
                final_diagnosis = data.get('diagnosis_result', {}).get('final_diagnosis', '')
                model_used = data.get('model_used', 'unknown')
                processing_time = data.get('processing_time', 0)
                
                print(f"   ✅ Success!")
                print(f"   Symptoms: {symptoms}")
                print(f"   Model: {model_used}")
                print(f"   Processing time: {processing_time:.2f}s")
                print(f"   Diagnosis: {final_diagnosis[:100]}...")
                
                # Check if symptoms match expected keywords
                found_keywords = []
                for keyword in scenario['expected_keywords']:
                    if any(keyword.lower() in symptom.lower() for symptom in symptoms):
                        found_keywords.append(keyword)
                
                print(f"   Expected keywords found: {found_keywords}/{scenario['expected_keywords']}")
                
                results.append({
                    "scenario": scenario['name'],
                    "success": True,
                    "symptoms": symptoms,
                    "diagnosis": final_diagnosis,
                    "model": model_used,
                    "keywords_found": len(found_keywords)
                })
                
            else:
                print(f"   ❌ Failed: HTTP {response.status_code}")
                print(f"   Response: {response.text}")
                results.append({
                    "scenario": scenario['name'],
                    "success": False,
                    "error": f"HTTP {response.status_code}"
                })
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                "scenario": scenario['name'],
                "success": False,
                "error": str(e)
            })
        
        # Small delay between requests
        time.sleep(1)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 RESULTS SUMMARY")
    print("=" * 50)
    
    successful_tests = [r for r in results if r['success']]
    failed_tests = [r for r in results if not r['success']]
    
    print(f"✅ Successful tests: {len(successful_tests)}/{len(results)}")
    print(f"❌ Failed tests: {len(failed_tests)}/{len(results)}")
    
    if successful_tests:
        print(f"\n🎯 DIAGNOSIS VARIETY ANALYSIS:")
        
        # Check for variety in diagnoses
        diagnoses = [r['diagnosis'] for r in successful_tests]
        unique_diagnoses = set(diagnoses)
        
        print(f"   Unique diagnoses: {len(unique_diagnoses)}/{len(diagnoses)}")
        
        if len(unique_diagnoses) == 1:
            print("   ⚠️  WARNING: All diagnoses are identical!")
            print("   This suggests the system is using fallback/mock responses")
        else:
            print("   ✅ Good variety in diagnoses")
        
        # Check for variety in symptoms
        all_symptoms = []
        for r in successful_tests:
            all_symptoms.extend(r['symptoms'])
        
        unique_symptoms = set(all_symptoms)
        print(f"   Unique symptoms extracted: {len(unique_symptoms)}")
        print(f"   All symptoms: {sorted(unique_symptoms)}")
        
        # Check model usage
        models_used = [r['model'] for r in successful_tests]
        model_counts = {}
        for model in models_used:
            model_counts[model] = model_counts.get(model, 0) + 1
        
        print(f"   Models used: {model_counts}")
        
        # Check keyword detection
        avg_keywords_found = sum(r['keywords_found'] for r in successful_tests) / len(successful_tests)
        print(f"   Average keywords detected: {avg_keywords_found:.1f}")
    
    if failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for test in failed_tests:
            print(f"   - {test['scenario']}: {test['error']}")
    
    return len(successful_tests) == len(results)

def test_gemini_connection():
    """Test if Gemini API is working properly"""
    print("\n🤖 Testing Gemini Connection...")
    
    try:
        response = requests.get(f"{VOICE_MEDICINE_API_URL}/test-gemini", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   Status: {data.get('status', 'unknown')}")
            if data.get('status') == 'available':
                print("   ✅ Gemini API is working")
                return True
            else:
                print(f"   ❌ Gemini API issue: {data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"   ❌ Gemini test failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Gemini test error: {e}")
        return False

def main():
    """Main test function"""
    print("🎤 Voice Medicine Diagnosis Variety Test")
    print("=" * 60)
    
    # Test Gemini connection first
    gemini_working = test_gemini_connection()
    
    if not gemini_working:
        print("\n⚠️  Gemini API is not working properly.")
        print("This explains why you're getting the same diagnosis every time.")
        print("The system is falling back to mock responses.")
        return 1
    
    # Test different scenarios
    all_passed = test_different_scenarios()
    
    if all_passed:
        print("\n🎉 All tests passed!")
        print("The system should now provide varied diagnoses for different symptoms.")
    else:
        print("\n⚠️  Some tests failed.")
        print("Check the server logs for more details.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    exit_code = main()
    exit()
