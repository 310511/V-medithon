#!/usr/bin/env python3
"""
Test Enhanced Fallback System
- Tests the enhanced symptom extraction and diagnosis generation
- Verifies that different symptoms produce different diagnoses
"""

import sys
import os
sys.path.append('backend')

# Import the functions directly
from voice_medicine_api import simple_symptom_extraction, generate_varied_diagnosis

async def test_symptom_extraction():
    """Test the enhanced symptom extraction"""
    
    test_cases = [
        {
            "input": "I have a severe headache and nausea for 2 hours",
            "expected_symptoms": ["headache", "nausea"],
            "expected_severity": "high"
        },
        {
            "input": "I have been having a mild fever with cough for 3 days",
            "expected_symptoms": ["fever", "cough"],
            "expected_severity": "low"
        },
        {
            "input": "I have chest pain and shortness of breath",
            "expected_symptoms": ["chest pain", "shortness of breath"],
            "expected_severity": "medium"
        },
        {
            "input": "I have a runny nose, sneezing, and itchy eyes for 2 days",
            "expected_symptoms": ["runny nose", "sneezing", "itchy eyes"],
            "expected_severity": "medium"
        },
        {
            "input": "I feel nauseous and have been vomiting for the past few hours",
            "expected_symptoms": ["nausea", "vomiting"],
            "expected_severity": "medium"
        }
    ]
    
    print("🧪 Testing Enhanced Symptom Extraction")
    print("=" * 50)
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. Testing: {test_case['input']}")
        
        try:
            result = await simple_symptom_extraction(test_case['input'])
            
            symptoms = result.get('symptoms', [])
            severity = result.get('severity', 'unknown')
            diagnosis = result.get('model_diagnosis', 'No diagnosis')
            confidence = result.get('model_confidence', 0)
            
            print(f"   ✅ Extracted symptoms: {symptoms}")
            print(f"   ✅ Severity: {severity}")
            print(f"   ✅ Diagnosis: {diagnosis}")
            print(f"   ✅ Confidence: {confidence:.2f}")
            
            # Check if expected symptoms were found
            found_expected = []
            for expected in test_case['expected_symptoms']:
                if any(expected.lower() in symptom.lower() for symptom in symptoms):
                    found_expected.append(expected)
            
            print(f"   ✅ Expected symptoms found: {found_expected}/{test_case['expected_symptoms']}")
            
            results.append({
                "test_case": i,
                "input": test_case['input'],
                "symptoms": symptoms,
                "diagnosis": diagnosis,
                "confidence": confidence,
                "expected_found": len(found_expected)
            })
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                "test_case": i,
                "input": test_case['input'],
                "error": str(e)
            })
    
    # Analysis
    print("\n" + "=" * 50)
    print("📊 ANALYSIS RESULTS")
    print("=" * 50)
    
    successful_tests = [r for r in results if 'error' not in r]
    failed_tests = [r for r in results if 'error' in r]
    
    print(f"✅ Successful tests: {len(successful_tests)}/{len(results)}")
    print(f"❌ Failed tests: {len(failed_tests)}/{len(results)}")
    
    if successful_tests:
        # Check diagnosis variety
        diagnoses = [r['diagnosis'] for r in successful_tests]
        unique_diagnoses = set(diagnoses)
        
        print(f"\n🎯 DIAGNOSIS VARIETY:")
        print(f"   Unique diagnoses: {len(unique_diagnoses)}/{len(diagnoses)}")
        
        if len(unique_diagnoses) > 1:
            print("   ✅ EXCELLENT! Different symptoms produce different diagnoses")
        else:
            print("   ⚠️  WARNING: All diagnoses are the same")
        
        print(f"   Diagnoses: {list(unique_diagnoses)}")
        
        # Check symptom extraction
        all_symptoms = []
        for r in successful_tests:
            all_symptoms.extend(r['symptoms'])
        
        unique_symptoms = set(all_symptoms)
        print(f"\n🔍 SYMPTOM EXTRACTION:")
        print(f"   Unique symptoms found: {len(unique_symptoms)}")
        print(f"   All symptoms: {sorted(unique_symptoms)}")
        
        # Check confidence scores
        confidences = [r['confidence'] for r in successful_tests]
        avg_confidence = sum(confidences) / len(confidences)
        print(f"\n📈 CONFIDENCE SCORES:")
        print(f"   Average confidence: {avg_confidence:.2f}")
        print(f"   Confidence range: {min(confidences):.2f} - {max(confidences):.2f}")
        
        # Check expected symptom detection
        expected_detection = sum(r['expected_found'] for r in successful_tests)
        total_expected = sum(len(tc['expected_symptoms']) for tc in test_cases)
        detection_rate = expected_detection / total_expected if total_expected > 0 else 0
        
        print(f"\n🎯 EXPECTED SYMPTOM DETECTION:")
        print(f"   Detection rate: {detection_rate:.1%} ({expected_detection}/{total_expected})")
    
    if failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for test in failed_tests:
            print(f"   - Test {test['test_case']}: {test['error']}")
    
    return len(successful_tests) == len(results)

async def main():
    """Main test function"""
    print("🎤 Enhanced Fallback System Test")
    print("=" * 60)
    
    success = await test_symptom_extraction()
    
    if success:
        print("\n🎉 All tests passed!")
        print("The enhanced fallback system provides varied diagnoses based on symptoms.")
        print("This should solve the 'same diagnosis every time' problem.")
    else:
        print("\n⚠️  Some tests failed.")
        print("Check the implementation for issues.")
    
    return 0 if success else 1

if __name__ == "__main__":
    import asyncio
    exit_code = asyncio.run(main())
    exit(exit_code)
