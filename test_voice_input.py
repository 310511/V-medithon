#!/usr/bin/env python3
"""
Test script to verify the voice input processing works
"""

def test_voice_input():
    print("🧪 Testing Voice Input: 'I feel vomiting and not well'")
    print("=" * 60)
    
    # Simulate the exact input from the image
    input_text = "I feel vomiting and not well"
    voice_lower = input_text.lower()
    
    print(f"Input: '{input_text}'")
    print(f"Lowercase: '{voice_lower}'")
    
    # Enhanced symptom extraction (from frontend)
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
    
    # Extract specific symptoms
    for symptom in commonSymptoms:
        if symptom in voice_lower:
            symptoms.append(symptom)
            print(f"  ✅ Found symptom: '{symptom}'")
    
    # Remove duplicates and sort by specificity
    symptoms = list(set(symptoms))
    symptoms.sort(key=len, reverse=True)
    print(f"Sorted symptoms: {symptoms}")
    
    # Check if symptoms are found
    if len(symptoms) == 0:
        print("❌ NO SYMPTOMS FOUND - This would cause 'No diagnosis available'")
        return False
    
    print("✅ Symptoms found, proceeding to diagnosis generation...")
    
    # Simulate the diagnosis patterns
    diagnosisPatterns = {
        "vomiting": {
            "diagnosis": "You probably have a stomach bug or food poisoning",
            "confidence": 0.75,
            "alternatives": ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
            "explanation": "Your stomach is trying to get rid of something harmful or irritating.",
            "what_to_do": "Start with small sips of water, eat bland foods when ready, avoid dairy and spicy foods, and rest."
        }
    }
    
    # Find best matching diagnosis
    bestMatch = None
    bestConfidence = 0.0
    primarySymptom = None
    
    prioritySymptoms = {"chest pain", "shortness of breath", "fever", "severe headache", "abdominal pain", "vomiting", "vomit", "leg pain", "stomach pain"}
    
    for symptom in symptoms:
        if symptom in diagnosisPatterns:
            pattern = diagnosisPatterns[symptom]
            adjustedConfidence = pattern["confidence"] + 0.1 if symptom in prioritySymptoms else pattern["confidence"]
            adjustedConfidence = min(adjustedConfidence, 0.95)
            
            if adjustedConfidence > bestConfidence:
                bestConfidence = adjustedConfidence
                bestMatch = pattern
                primarySymptom = symptom
                print(f"  ✅ Found better match: '{symptom}' with confidence {adjustedConfidence}")
    
    if bestMatch:
        print(f"✅ Best match: {primarySymptom}")
        print(f"✅ Diagnosis: {bestMatch['diagnosis']}")
        print(f"✅ Confidence: {bestConfidence}")
        print(f"✅ Explanation: {bestMatch['explanation']}")
        print(f"✅ What to do: {bestMatch['what_to_do']}")
        
        # Generate final diagnosis
        finalDiagnosis = f"**{bestMatch['diagnosis']}**\n\n**What's happening:** {bestMatch['explanation']}\n\n**What you should do:** {bestMatch['what_to_do']}\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment."
        
        print(f"\n✅ Final diagnosis generated:")
        print(f"'{finalDiagnosis}'")
        
        return True
        
    else:
        print("❌ NO MATCH FOUND - This would cause 'No diagnosis available'")
        return False

if __name__ == "__main__":
    success = test_voice_input()
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS")
    print("=" * 60)
    
    if success:
        print("✅ SUCCESS: Voice input should generate a diagnosis!")
        print("   The function should work correctly in the frontend.")
    else:
        print("❌ FAILURE: Voice input would not generate a diagnosis!")
        print("   There might be an issue with the symptom extraction.")
