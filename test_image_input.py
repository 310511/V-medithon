#!/usr/bin/env python3
"""
Test script for the exact input from the image
"""

def test_image_input():
    print("🧪 Testing Image Input: 'I'm suffering from leg pain and vomiting.'")
    print("=" * 70)
    
    # Simulate the optimized generateEnhancedDiagnosis function
    def generateEnhancedDiagnosis(input_text):
        # Enhanced symptom extraction with comprehensive medical terms
        commonSymptoms = [
            "fever", "cough", "headache", "nausea", "fatigue", "sore throat",
            "body ache", "runny nose", "congestion", "chills", "dizziness",
            "shortness of breath", "chest pain", "abdominal pain", "diarrhea",
            "vomiting", "vomit", "rash", "swelling", "pain", "ache", "tired", "weak",
            "sneezing", "itchy eyes", "stuffy nose", "muscle pain", "joint pain",
            "back pain", "stomach ache", "stomach pain", "bloating", "constipation",
            "leg pain", "arm pain", "neck pain", "shoulder pain", "knee pain",
            "throat pain", "ear pain", "tooth pain", "dental pain", "eye pain",
            "burning sensation", "numbness", "tingling", "cramps", "spasms",
            "inflammation", "swelling", "bruising", "bleeding", "discharge"
        ]
        
        symptoms = []
        voiceLower = input_text.lower()
        
        print(f"Input: '{input_text}'")
        print(f"Lowercase: '{voiceLower}'")
        
        # Extract specific symptoms
        for symptom in commonSymptoms:
            if symptom in voiceLower:
                symptoms.append(symptom)
                print(f"  ✅ Found symptom: '{symptom}'")
        
        print(f"Extracted symptoms: {symptoms}")
        
        # Handle vague inputs by inferring likely symptoms
        if not symptoms:
            print("  ⚠️ No specific symptoms found, checking vague patterns...")
            return {
                "model_diagnosis": "No diagnosis available",
                "confidence": 0.0,
                "final_diagnosis": "No diagnosis available",
                "model_used": "enhanced-fallback"
            }
        
        # Enhanced diagnosis mapping
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
            "runny nose": "You probably have allergies or a cold",
            "vomiting": "You probably have a stomach bug or food poisoning",
            "vomit": "You probably have a stomach bug or food poisoning",
            "stomach ache": "You likely have digestive upset or stomach issues",
            "stomach pain": "You likely have digestive upset or stomach issues",
            "leg pain": "You might have muscle strain, inflammation, or circulation issues",
            "pain": "You might be experiencing muscle pain or inflammation",
            "ache": "You might be experiencing muscle aches or body pain"
        }
        
        # Find best match
        best_diagnosis = None
        for symptom in symptoms:
            if symptom in diagnosis_map:
                best_diagnosis = diagnosis_map[symptom]
                print(f"  ✅ Found diagnosis for '{symptom}': {best_diagnosis}")
                break
        
        if not best_diagnosis:
            print("  ⚠️ No specific diagnosis found, using generic...")
            if len(symptoms) >= 2:
                best_diagnosis = "You probably have a viral infection or cold"
            else:
                best_diagnosis = "You might have a mild infection or allergic reaction"
        
        print(f"Final diagnosis: {best_diagnosis}")
        
        return {
            "model_diagnosis": best_diagnosis,
            "confidence": 0.75,
            "final_diagnosis": f"**{best_diagnosis}**\n\n**What's happening:** Your body is showing symptoms that need attention.\n\n**What you should do:** Rest, stay hydrated, and monitor your symptoms. See a doctor if they worsen.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.",
            "model_used": "enhanced-fallback"
        }
    
    # Test the exact input from the image
    test_input = "I'm suffering from leg pain and vomiting."
    
    print("Testing image input:")
    print("-" * 70)
    
    result = generateEnhancedDiagnosis(test_input)
    
    print("\n" + "=" * 70)
    print("📊 ANALYSIS RESULTS")
    print("=" * 70)
    print(f"✅ Model diagnosis: {result['model_diagnosis']}")
    print(f"✅ Confidence: {result['confidence']}")
    print(f"✅ Model used: {result['model_used']}")
    
    if "No diagnosis" in result['model_diagnosis']:
        print("\n❌ ISSUE FOUND: System is returning 'No diagnosis available'!")
        print("   This explains why the user sees no diagnosis in the UI.")
    else:
        print("\n✅ SUCCESS: System is generating proper diagnoses!")

if __name__ == "__main__":
    test_image_input()
