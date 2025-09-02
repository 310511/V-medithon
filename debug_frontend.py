#!/usr/bin/env python3
"""
Debug script to test the frontend logic step by step
"""

def debug_frontend_logic():
    print("🔍 Debugging Frontend Logic")
    print("=" * 50)
    
    # Test input from image
    input_text = "I'm suffering from leg pain and vomiting."
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
    
    print(f"Extracted symptoms: {symptoms}")
    
    # Remove duplicates and sort by specificity (longer symptoms first)
    symptoms = list(set(symptoms))
    symptoms.sort(key=len, reverse=True)
    print(f"Sorted symptoms: {symptoms}")
    
    # Check if symptoms are found
    if len(symptoms) == 0:
        print("❌ NO SYMPTOMS FOUND - This would cause 'No diagnosis available'")
        return
    
    print("✅ Symptoms found, proceeding to diagnosis generation...")
    
    # Simulate the diagnosis patterns
    diagnosisPatterns = {
        "fever": {
            "diagnosis": "You likely have a viral infection (like flu or cold)",
            "confidence": 0.80,
            "alternatives": ["Flu", "Common Cold", "COVID-19", "Bacterial Infection"],
            "explanation": "Your body is fighting off an infection. This is normal and shows your immune system is working.",
            "what_to_do": "Rest, drink plenty of fluids, take fever reducers like acetaminophen, and monitor your temperature."
        },
        "vomiting": {
            "diagnosis": "You probably have a stomach bug or food poisoning",
            "confidence": 0.75,
            "alternatives": ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
            "explanation": "Your stomach is trying to get rid of something harmful or irritating.",
            "what_to_do": "Start with small sips of water, eat bland foods when ready, avoid dairy and spicy foods, and rest."
        },
        "leg pain": {
            "diagnosis": "You might have muscle strain, inflammation, or circulation issues",
            "confidence": 0.70,
            "alternatives": ["Muscle Strain", "Inflammation", "Circulation Issues", "Overuse Injury"],
            "explanation": "Leg pain can be caused by muscle strain, inflammation, or circulation problems.",
            "what_to_do": "Rest the leg, apply ice or heat, elevate if swollen, and avoid activities that worsen the pain."
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
        
        # Simulate the return structure
        result = {
            "session_id": "test-session",
            "timestamp": "2024-01-01T00:00:00.000Z",
            "input_text": input_text,
            "symptom_extraction": {
                "symptoms": symptoms,
                "duration": None,
                "severity": "medium",
                "additional_info": input_text
            },
            "diagnosis_result": {
                "symptoms": symptoms,
                "model_diagnosis": bestMatch["diagnosis"],
                "model_confidence": bestConfidence,
                "gemini_diagnosis": f"Based on {primarySymptom}: {bestMatch['diagnosis']}",
                "final_diagnosis": finalDiagnosis,
                "differential_diagnoses": bestMatch["alternatives"],
                "urgency_level": "medium",
                "recommendations": bestMatch["what_to_do"].split(", "),
                "disclaimer": "⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment."
            },
            "processing_time": 0.5,
            "model_used": "enhanced-fallback"
        }
        
        print(f"\n✅ Result structure:")
        print(f"diagnosis_result.final_diagnosis: '{result['diagnosis_result']['final_diagnosis']}'")
        
    else:
        print("❌ NO MATCH FOUND - This would cause 'No diagnosis available'")

if __name__ == "__main__":
    debug_frontend_logic()
