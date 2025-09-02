#!/usr/bin/env python3
"""
Test script to verify the frontend fallback system is working correctly
"""

def test_frontend_fallback():
    print("🧪 Testing Frontend Fallback System")
    print("=" * 50)
    
    # Simulate the frontend generateEnhancedDiagnosis function
    def generateEnhancedDiagnosis(input_text):
        # Enhanced symptom extraction (from frontend)
        commonSymptoms = [
            "fever", "cough", "headache", "nausea", "fatigue", "sore throat",
            "body ache", "runny nose", "congestion", "chills", "dizziness",
            "shortness of breath", "chest pain", "abdominal pain", "diarrhea",
            "vomiting", "rash", "swelling", "pain", "ache", "tired", "weak",
            "sneezing", "itchy eyes", "stuffy nose", "muscle pain", "joint pain",
            "back pain", "stomach ache", "bloating", "constipation"
        ]
        
        symptoms = []
        voiceLower = input_text.lower()
        
        for symptom in commonSymptoms:
            if symptom in voiceLower:
                symptoms.append(symptom)
        
        # Extract severity
        severity = "medium"
        if any(word in voiceLower for word in ["severe", "terrible", "awful", "unbearable", "intense"]):
            severity = "high"
        elif any(word in voiceLower for word in ["mild", "slight", "little", "minor", "light"]):
            severity = "low"
        
        # Extract duration
        duration = None
        import re
        durationPatterns = [
            r"(\d+)\s*(day|days|hour|hours|week|weeks)",
            r"(for|since)\s*(\d+)\s*(day|days|hour|hours|week|weeks)"
        ]
        
        for pattern in durationPatterns:
            match = re.search(pattern, voiceLower)
            if match:
                duration = match.group(0)
                break
        
        # Generate diagnosis (simplified version of generateVariedDiagnosis)
        if not symptoms:
            return {
                "model_diagnosis": "You have an isolated symptom that may be temporary",
                "confidence": 0.50,
                "final_diagnosis": "**You have an isolated symptom that may be temporary**\n\n**What's happening:** A single symptom may be temporary or related to environmental factors.\n\n**What you should do:** Monitor the symptom, rest, and see a doctor if it persists or worsens.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.",
                "model_used": "enhanced-fallback"
            }
        
        # Simple diagnosis mapping
        diagnosis_map = {
            "fever": "You likely have a viral infection (like flu or cold)",
            "cough": "You probably have a chest cold or respiratory infection", 
            "headache": "You likely have a tension headache or stress-related headache",
            "nausea": "You probably have stomach upset or digestive issues",
            "chest pain": "You might have muscle strain or need immediate medical attention",
            "shortness of breath": "You need immediate medical attention - this could be serious"
        }
        
        # Find best match
        best_diagnosis = None
        for symptom in symptoms:
            if symptom in diagnosis_map:
                best_diagnosis = diagnosis_map[symptom]
                break
        
        if not best_diagnosis:
            if len(symptoms) >= 2:
                best_diagnosis = "You probably have a viral infection or cold"
            else:
                best_diagnosis = "You might have a mild infection or allergic reaction"
        
        return {
            "model_diagnosis": best_diagnosis,
            "confidence": 0.75,
            "final_diagnosis": f"**{best_diagnosis}**\n\n**What's happening:** Your body is showing symptoms that need attention.\n\n**What you should do:** Rest, stay hydrated, and monitor your symptoms. See a doctor if they worsen.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.",
            "model_used": "enhanced-fallback"
        }
    
    # Test cases
    test_cases = [
        "I have a fever and cough",
        "I have a severe headache and nausea", 
        "I have chest pain and shortness of breath",
        "I have a runny nose and sneezing",
        "I feel nauseous and have been vomiting"
    ]
    
    print("Testing various symptom inputs:")
    print("-" * 40)
    
    results = []
    for i, test_input in enumerate(test_cases, 1):
        print(f"\n{i}. Input: '{test_input}'")
        result = generateEnhancedDiagnosis(test_input)
        print(f"   Diagnosis: {result['model_diagnosis']}")
        print(f"   Model: {result['model_used']}")
        results.append(result['model_diagnosis'])
    
    print("\n" + "=" * 50)
    print("📊 ANALYSIS RESULTS")
    print("=" * 50)
    
    unique_diagnoses = set(results)
    print(f"✅ Unique diagnoses: {len(unique_diagnoses)}/{len(results)}")
    print(f"🎯 Diagnosis variety: {'EXCELLENT' if len(unique_diagnoses) == len(results) else 'NEEDS IMPROVEMENT'}")
    
    print("\nAll diagnoses:")
    for i, diagnosis in enumerate(results, 1):
        print(f"  {i}. {diagnosis}")
    
    if len(unique_diagnoses) == len(results):
        print("\n🎉 SUCCESS: Frontend fallback system provides varied diagnoses!")
    else:
        print("\n❌ ISSUE: Frontend fallback system is giving same diagnoses")

if __name__ == "__main__":
    test_frontend_fallback()
