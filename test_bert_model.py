#!/usr/bin/env python3
"""
Test script for the BERT Symptoms to Diagnosis model
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

def test_bert_model():
    print("🧠 Testing BERT Symptoms to Diagnosis Model")
    print("=" * 60)
    
    try:
        # Load model and tokenizer
        print("📥 Loading model and tokenizer...")
        model_name = "ajtamayoh/Symptoms_to_Diagnosis_SonatafyAI_BERT_v1"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        print(f"✅ Model loaded successfully: {model_name}")
        print(f"📊 Model config: {model.config}")
        
        # Test symptoms
        test_symptoms = [
            "I have a fever and cough",
            "I have a severe headache and nausea",
            "I have chest pain and shortness of breath",
            "I have a runny nose and sneezing",
            "I have abdominal pain and vomiting"
        ]
        
        print("\n🔬 Testing with various symptoms:")
        print("-" * 40)
        
        for i, symptoms in enumerate(test_symptoms, 1):
            print(f"\n{i}. Testing: '{symptoms}'")
            
            # Tokenize input
            inputs = tokenizer(symptoms, return_tensors="pt", truncation=True, padding=True, max_length=512)
            
            # Get model prediction
            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                probabilities = F.softmax(logits, dim=-1)
                predicted_class_id = torch.argmax(probabilities, dim=-1).item()
                confidence = probabilities[0][predicted_class_id].item()
            
            print(f"   📊 Predicted class ID: {predicted_class_id}")
            print(f"   🎯 Confidence: {confidence:.3f}")
            print(f"   📈 All probabilities: {[f'{p:.3f}' for p in probabilities[0].tolist()]}")
            
            # Try to get class labels if available
            if hasattr(model.config, 'id2label'):
                predicted_label = model.config.id2label.get(predicted_class_id, f"Class_{predicted_class_id}")
                print(f"   🏷️  Predicted label: {predicted_label}")
            else:
                print(f"   🏷️  Predicted label: Class_{predicted_class_id}")
        
        print("\n" + "=" * 60)
        print("✅ BERT model testing completed successfully!")
        
    except Exception as e:
        print(f"❌ Error testing BERT model: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_bert_model()
