#!/usr/bin/env python3
"""
Test script to debug the complex input issue
"""

def test_complex_input():
    print("🧪 Testing Complex Input: 'I'm suffering from leg pain, I've done vomit 3 times and I also have some stomach ache.'")
    print("=" * 80)
    
    # Simulate the current generateEnhancedDiagnosis function
    def generateEnhancedDiagnosis(input_text):
        # Enhanced symptom extraction with comprehensive medical terms (optimized)
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
            if any(word in voiceLower for word in ["sick", "ill", "unwell"]):
                import random
                vagueSymptoms = ["fatigue", "nausea", "headache", "body ache", "fever"]
                symptoms.append(random.choice(vagueSymptoms))
                print(f"  ✅ Added vague symptom: {symptoms[-1]}")
            elif any(word in voiceLower for word in ["tired", "exhausted", "weak"]):
                symptoms.append("fatigue")
                print(f"  ✅ Added fatigue symptom")
            elif any(word in voiceLower for word in ["stomach", "belly", "gut"]):
                symptoms.append("abdominal pain")
                print(f"  ✅ Added abdominal pain symptom")
            elif any(word in voiceLower for word in ["breathing", "breath"]):
                symptoms.append("shortness of breath")
                print(f"  ✅ Added breathing symptom")
            elif any(word in voiceLower for word in ["throat", "swallow"]):
                symptoms.append("sore throat")
                print(f"  ✅ Added throat symptom")
            elif any(word in voiceLower for word in ["nose", "sneeze"]):
                symptoms.append("runny nose")
                print(f"  ✅ Added nose symptom")
            elif any(word in voiceLower for word in ["cold", "flu"]):
                symptoms.extend(["fever", "cough"])
                print(f"  ✅ Added cold/flu symptoms")
            elif any(word in voiceLower for word in ["don't feel well", "not feeling good", "feel bad"]):
                import random
                randomSymptoms = ["fatigue", "nausea", "headache", "body ache", "fever", "abdominal pain"]
                symptoms.append(random.choice(randomSymptoms))
                print(f"  ✅ Added random symptom: {symptoms[-1]}")
            else:
                print("  ❌ No vague patterns matched either!")
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
                print(f"  ✅ Using generic response: {randomResponse}")
                return {
                    "model_diagnosis": randomResponse,
                    "confidence": 0.45,
                    "final_diagnosis": f"**{randomResponse}**\n\n**What's happening:** Your body is showing signs of discomfort that could have various causes.\n\n**What you should do:** Rest, stay hydrated, monitor your symptoms, and consider what might have triggered this feeling. If symptoms persist or worsen, consult a healthcare provider.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.",
                    "model_used": "enhanced-fallback"
                }
        
        # Enhanced diagnosis mapping with comprehensive medical conditions
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
    test_input = "I'm suffering from leg pain, I've done vomit 3 times and I also have some stomach ache."
    
    print("Testing complex medical input:")
    print("-" * 80)
    
    result = generateEnhancedDiagnosis(test_input)
    
    print("\n" + "=" * 80)
    print("📊 ANALYSIS RESULTS")
    print("=" * 80)
    print(f"✅ Model diagnosis: {result['model_diagnosis']}")
    print(f"✅ Confidence: {result['confidence']}")
    print(f"✅ Model used: {result['model_used']}")
    
    if "No diagnosis" in result['model_diagnosis']:
        print("\n❌ ISSUE FOUND: System is returning 'No diagnosis available'!")
        print("   This explains why the user sees no diagnosis in the UI.")
    else:
        print("\n✅ SUCCESS: System is generating proper diagnoses!")

if __name__ == "__main__":
    test_complex_input()
