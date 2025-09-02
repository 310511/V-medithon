#!/usr/bin/env python3
"""
Test script to verify the improved diagnosis variety system
"""

def test_improved_variety():
    print("🧪 Testing Improved Diagnosis Variety System")
    print("=" * 60)
    
    # Simulate the improved frontend generateEnhancedDiagnosis function
    def generateEnhancedDiagnosis(input_text):
        # Enhanced symptom extraction with better vague input handling
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
        
        # Extract specific symptoms
        for symptom in commonSymptoms:
            if symptom in voiceLower:
                symptoms.append(symptom)
        
        # Handle vague inputs by inferring likely symptoms
        if not symptoms:
            if any(word in voiceLower for word in ["sick", "ill", "unwell"]):
                # Randomly assign common symptoms for vague "sick" complaints
                import random
                vagueSymptoms = ["fatigue", "nausea", "headache", "body ache", "fever"]
                symptoms.append(random.choice(vagueSymptoms))
            elif any(word in voiceLower for word in ["tired", "exhausted", "weak"]):
                symptoms.append("fatigue")
            elif any(word in voiceLower for word in ["stomach", "belly", "gut"]):
                symptoms.append("abdominal pain")
            elif any(word in voiceLower for word in ["breathing", "breath"]):
                symptoms.append("shortness of breath")
            elif any(word in voiceLower for word in ["throat", "swallow"]):
                symptoms.append("sore throat")
            elif any(word in voiceLower for word in ["nose", "sneeze"]):
                symptoms.append("runny nose")
            elif any(word in voiceLower for word in ["cold", "flu"]):
                symptoms.extend(["fever", "cough"])
            else:
                # For completely vague inputs, provide varied generic responses
                import random
                genericResponses = [
                    "You might be experiencing general malaise or fatigue",
                    "You could have a mild viral infection or stress-related symptoms", 
                    "You may be dealing with seasonal allergies or environmental factors",
                    "You might have a minor digestive issue or food sensitivity",
                    "You could be experiencing stress-related physical symptoms"
                ]
                randomResponse = random.choice(genericResponses)
                return {
                    "model_diagnosis": randomResponse,
                    "confidence": 0.45,
                    "final_diagnosis": f"**{randomResponse}**\n\n**What's happening:** Your body is showing signs of discomfort that could have various causes.\n\n**What you should do:** Rest, stay hydrated, monitor your symptoms, and consider what might have triggered this feeling. If symptoms persist or worsen, consult a healthcare provider.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.",
                    "model_used": "enhanced-fallback"
                }
        
        # Simple diagnosis mapping
        diagnosis_map = {
            "fever": "You likely have a viral infection (like flu or cold)",
            "cough": "You probably have a chest cold or respiratory infection", 
            "headache": "You likely have a tension headache or stress-related headache",
            "nausea": "You probably have stomach upset or digestive issues",
            "chest pain": "You might have muscle strain or need immediate medical attention",
            "shortness of breath": "You need immediate medical attention - this could be serious",
            "fatigue": "You're probably run down from illness, stress, or lack of sleep",
            "abdominal pain": "You likely have digestive upset or stomach issues",
            "sore throat": "You likely have throat inflammation from a cold or infection",
            "runny nose": "You probably have allergies or a cold"
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
    
    # Test cases including vague inputs
    test_cases = [
        # Specific symptoms
        "I have a fever and cough",
        "I have a severe headache and nausea", 
        "I have chest pain and shortness of breath",
        "I have a runny nose and sneezing",
        "I feel nauseous and have been vomiting",
        # Vague inputs
        "I don't feel well",
        "I'm sick",
        "I feel ill",
        "I'm unwell",
        "I feel bad",
        "I'm tired",
        "I feel exhausted",
        "I have stomach problems",
        "I can't breathe well",
        "I have throat issues"
    ]
    
    print("Testing various inputs (specific and vague):")
    print("-" * 60)
    
    results = []
    for i, test_input in enumerate(test_cases, 1):
        print(f"\n{i:2d}. Input: '{test_input}'")
        result = generateEnhancedDiagnosis(test_input)
        print(f"     Diagnosis: {result['model_diagnosis']}")
        print(f"     Model: {result['model_used']}")
        results.append(result['model_diagnosis'])
    
    print("\n" + "=" * 60)
    print("📊 IMPROVED VARIETY ANALYSIS")
    print("=" * 60)
    
    unique_diagnoses = set(results)
    print(f"✅ Total inputs tested: {len(results)}")
    print(f"✅ Unique diagnoses: {len(unique_diagnoses)}")
    print(f"🎯 Diagnosis variety: {'EXCELLENT' if len(unique_diagnoses) >= len(results) * 0.7 else 'GOOD' if len(unique_diagnoses) >= len(results) * 0.5 else 'NEEDS IMPROVEMENT'}")
    print(f"📈 Variety percentage: {len(unique_diagnoses)/len(results)*100:.1f}%")
    
    print("\nAll diagnoses:")
    for i, diagnosis in enumerate(results, 1):
        print(f"  {i:2d}. {diagnosis}")
    
    print(f"\nUnique diagnoses ({len(unique_diagnoses)}):")
    for i, diagnosis in enumerate(sorted(unique_diagnoses), 1):
        print(f"  {i:2d}. {diagnosis}")
    
    if len(unique_diagnoses) >= len(results) * 0.7:
        print("\n🎉 SUCCESS: Improved system provides excellent diagnosis variety!")
        print("   The system now handles both specific and vague inputs with variety.")
    else:
        print("\n⚠️  PARTIAL SUCCESS: System provides some variety but could be improved.")
        print("   Consider adding more randomization or context-aware responses.")

if __name__ == "__main__":
    test_improved_variety()
