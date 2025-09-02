#!/usr/bin/env python3
"""
Voice Medicine API with Gemini Integration
- Voice-to-text medical input processing
- Gemini API for symptom extraction
- Zabihin/Symptom_to_Diagnosis model integration
- Fallback to Gemini AI for diagnosis
- Medical disclaimer integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv
import re
import asyncio
import aiohttp

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Voice Medicine API",
    description="AI-powered voice medicine assistant with Gemini integration",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8978", "http://localhost:3006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Try different model names for compatibility
    try:
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        try:
            gemini_model = genai.GenerativeModel('gemini-1.5-pro')
        except Exception as e2:
            try:
                gemini_model = genai.GenerativeModel('gemini-pro')
            except Exception as e3:
                print(f"Warning: Could not initialize Gemini model. Error: {e3}")
                gemini_model = None
else:
    gemini_model = None
    print("Warning: GEMINI_API_KEY not found. Gemini features will be disabled.")

# Data Models
class VoiceInputRequest(BaseModel):
    voice_text: str = Field(..., description="Voice-to-text converted medical input")
    user_id: Optional[str] = Field(default="anonymous", description="User identifier")
    session_id: Optional[str] = Field(default=None, description="Session identifier")

class SymptomExtraction(BaseModel):
    symptoms: List[str] = Field(..., description="Extracted medical symptoms")
    duration: Optional[str] = Field(default=None, description="Duration of symptoms")
    severity: Optional[str] = Field(default=None, description="Severity level")
    additional_info: Optional[str] = Field(default=None, description="Additional medical information")

class DiagnosisResult(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    symptoms: List[str]
    model_diagnosis: Optional[str] = Field(default=None, description="Diagnosis from Zabihin model")
    model_confidence: Optional[float] = Field(default=None, description="Model confidence score")
    gemini_diagnosis: Optional[str] = Field(default=None, description="Gemini AI diagnosis")
    final_diagnosis: str = Field(..., description="Final diagnosis with disclaimer")
    differential_diagnoses: Optional[List[str]] = Field(default=None, description="Alternative diagnoses")
    urgency_level: str = Field(default="medium", description="Urgency level: low, medium, high")
    recommendations: List[str] = Field(default=[], description="General recommendations")
    disclaimer: str = Field(default="⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.", description="Medical disclaimer")

class VoiceMedicineResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    session_id: str
    timestamp: datetime
    input_text: str
    symptom_extraction: SymptomExtraction
    diagnosis_result: DiagnosisResult
    processing_time: float
    model_used: str

# Medical disclaimer template
MEDICAL_DISCLAIMER = "⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment."

# Gemini prompt template
GEMINI_PROMPT_TEMPLATE = """
You are a medical assistant AI. The user will provide a voice-based description of their health condition. 
Your tasks are:

1. Extract **medical keywords** (symptoms, signs, duration, severity).
2. Format them clearly as a list of symptoms.
3. If a diagnosis can be derived using the model "Zabihin/Symptom_to_Diagnosis", return the model's prediction.
4. If the model cannot identify a diagnosis or confidence is low, generate a **possible diagnosis or differential diagnoses** using your reasoning.
5. Always add this disclaimer at the end: 
   "⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment."

Please respond in the following JSON format:
{
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "duration": "duration if mentioned",
  "severity": "severity level if mentioned",
  "model_diagnosis": "Possible diagnosis from Zabihin model",
  "model_confidence": 0.85,
  "gemini_diagnosis": "Alternative diagnosis from Gemini AI",
  "final_diagnosis": "Final diagnosis with reasoning",
  "differential_diagnoses": ["alternative1", "alternative2"],
  "urgency_level": "low/medium/high",
  "recommendations": ["recommendation1", "recommendation2"]
}

User voice input (converted to text):
"""

# Mock Zabihin model for demonstration
class MockZabihinModel:
    """Mock implementation of Zabihin/Symptom_to_Diagnosis model"""
    
    def __init__(self):
        self.symptom_diagnosis_map = {
            "fever": {"diagnosis": "Possible Viral Infection", "confidence": 0.75},
            "cough": {"diagnosis": "Respiratory Infection", "confidence": 0.70},
            "headache": {"diagnosis": "Tension Headache", "confidence": 0.65},
            "nausea": {"diagnosis": "Gastrointestinal Issue", "confidence": 0.60},
            "fatigue": {"diagnosis": "General Malaise", "confidence": 0.55},
            "sore throat": {"diagnosis": "Pharyngitis", "confidence": 0.80},
            "body ache": {"diagnosis": "Musculoskeletal Pain", "confidence": 0.60},
            "runny nose": {"diagnosis": "Allergic Rhinitis", "confidence": 0.70},
            "congestion": {"diagnosis": "Nasal Congestion", "confidence": 0.65},
            "chills": {"diagnosis": "Fever-related Chills", "confidence": 0.75}
        }
    
    def predict(self, symptoms: List[str]) -> Dict[str, Any]:
        """Predict diagnosis based on symptoms"""
        if not symptoms:
            return {"diagnosis": None, "confidence": 0.0}
        
        # Find best matching symptom
        best_match = None
        best_confidence = 0.0
        
        for symptom in symptoms:
            symptom_lower = symptom.lower()
            for key, value in self.symptom_diagnosis_map.items():
                if key in symptom_lower or symptom_lower in key:
                    if value["confidence"] > best_confidence:
                        best_confidence = value["confidence"]
                        best_match = value["diagnosis"]
        
        return {
            "diagnosis": best_match,
            "confidence": best_confidence
        }

# Initialize mock model
zabihin_model = MockZabihinModel()

async def extract_symptoms_with_gemini(voice_text: str) -> Dict[str, Any]:
    """Extract symptoms using Gemini API"""
    if not gemini_model:
        # Fallback to simple keyword extraction
        return await simple_symptom_extraction(voice_text)
    
    try:
        prompt = GEMINI_PROMPT_TEMPLATE + voice_text
        
        response = gemini_model.generate_content(prompt)
        response_text = response.text
        
        # Try to parse JSON response
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                result = json.loads(json_str)
                return result
            else:
                # Fallback parsing
                return await parse_gemini_response(response_text)
        except json.JSONDecodeError:
            return await parse_gemini_response(response_text)
            
    except Exception as e:
        print(f"Gemini API error: {e}")
        return await simple_symptom_extraction(voice_text)

async def simple_symptom_extraction(voice_text: str) -> Dict[str, Any]:
    """Enhanced keyword-based symptom extraction with varied responses"""
    common_symptoms = [
        "fever", "cough", "headache", "nausea", "fatigue", "sore throat",
        "body ache", "runny nose", "congestion", "chills", "dizziness",
        "shortness of breath", "chest pain", "abdominal pain", "diarrhea",
        "vomiting", "rash", "swelling", "pain", "ache", "tired", "weak",
        "sneezing", "itchy eyes", "stuffy nose", "sore throat", "muscle pain",
        "joint pain", "back pain", "stomach ache", "bloating", "constipation"
    ]
    
    symptoms = []
    voice_lower = voice_text.lower()
    
    # Extract specific symptoms
    for symptom in common_symptoms:
        if symptom in voice_lower:
            symptoms.append(symptom)
    
    # Handle vague inputs by inferring likely symptoms
    if not symptoms:
        if any(word in voice_lower for word in ["sick", "ill", "unwell"]):
            # Randomly assign common symptoms for vague "sick" complaints
            import random
            vague_symptoms = ["fatigue", "nausea", "headache", "body ache", "fever"]
            symptoms.append(random.choice(vague_symptoms))
        elif any(word in voice_lower for word in ["tired", "exhausted", "weak"]):
            symptoms.append("fatigue")
        elif any(word in voice_lower for word in ["stomach", "belly", "gut"]):
            symptoms.append("abdominal pain")
        elif any(word in voice_lower for word in ["breathing", "breath"]):
            symptoms.append("shortness of breath")
        elif any(word in voice_lower for word in ["throat", "swallow"]):
            symptoms.append("sore throat")
        elif any(word in voice_lower for word in ["nose", "sneeze"]):
            symptoms.append("runny nose")
        elif any(word in voice_lower for word in ["cold", "flu"]):
            symptoms.extend(["fever", "cough"])
        else:
            # For completely vague inputs, provide varied generic responses
            import random
            generic_responses = [
                "You might be experiencing general malaise or fatigue",
                "You could have a mild viral infection or stress-related symptoms", 
                "You may be dealing with seasonal allergies or environmental factors",
                "You might have a minor digestive issue or food sensitivity",
                "You could be experiencing stress-related physical symptoms"
            ]
            random_response = random.choice(generic_responses)
            return {
                "model_diagnosis": random_response,
                "confidence": 0.45,
                "gemini_diagnosis": f"Based on your general complaint: {random_response}",
                "final_diagnosis": f"**{random_response}**\n\n**What's happening:** Your body is showing signs of discomfort that could have various causes.\n\n**What you should do:** Rest, stay hydrated, monitor your symptoms, and consider what might have triggered this feeling. If symptoms persist or worsen, consult a healthcare provider.\n\n{MEDICAL_DISCLAIMER}",
                "urgency_level": "low",
                "alternative_diagnoses": ["Stress-related", "Environmental Factor", "Minor Condition", "Temporary Issue"],
                "recommendations": [
                    "Get adequate rest and sleep.",
                    "Stay hydrated by drinking plenty of water.",
                    "Monitor your symptoms and note any changes.",
                    "Consider what might have triggered this feeling.",
                    "Consult a healthcare provider if symptoms persist beyond 3-5 days."
                ],
                "model_used": "enhanced-fallback"
            }
    
    # Extract duration
    duration = None
    duration_patterns = [
        r'(\d+)\s*(day|days|hour|hours|week|weeks)',
        r'(for|since)\s*(\d+)\s*(day|days|hour|hours|week|weeks)'
    ]
    
    for pattern in duration_patterns:
        match = re.search(pattern, voice_lower)
        if match:
            duration = match.group(0)
            break
    
    # Extract severity
    severity = "medium"
    if any(word in voice_lower for word in ["severe", "severe", "terrible", "awful", "unbearable", "intense"]):
        severity = "high"
    elif any(word in voice_lower for word in ["mild", "slight", "little", "minor", "light"]):
        severity = "low"
    
    # Generate varied diagnosis based on symptoms
    diagnosis_info = generate_varied_diagnosis(symptoms, severity, duration)
    
    return {
        "symptoms": symptoms,
        "duration": duration,
        "severity": severity,
        "model_diagnosis": diagnosis_info["model_diagnosis"],
        "model_confidence": diagnosis_info["confidence"],
        "gemini_diagnosis": diagnosis_info["gemini_diagnosis"],
        "final_diagnosis": diagnosis_info["final_diagnosis"],
        "differential_diagnoses": diagnosis_info["differential_diagnoses"],
        "urgency_level": diagnosis_info["urgency_level"],
        "recommendations": diagnosis_info["recommendations"]
    }

def generate_varied_diagnosis(symptoms: List[str], severity: str, duration: str) -> Dict[str, Any]:
    """Generate accurate, concise, and explanatory diagnosis based on symptoms"""
    
    # User-friendly problem-focused diagnosis mappings
    diagnosis_patterns = {
        "fever": {
            "diagnosis": "You likely have a viral infection (like flu or cold)",
            "confidence": 0.80,
            "alternatives": ["Flu", "Common Cold", "COVID-19", "Bacterial Infection"],
            "explanation": "Your body is fighting off an infection. This is normal and shows your immune system is working.",
            "what_to_do": "Rest, drink plenty of fluids, take fever reducers like acetaminophen, and monitor your temperature."
        },
        "cough": {
            "diagnosis": "You probably have a chest cold or respiratory infection",
            "confidence": 0.75,
            "alternatives": ["Chest Cold", "Bronchitis", "Allergic Reaction", "Pneumonia"],
            "explanation": "Your airways are irritated and trying to clear out mucus or irritants.",
            "what_to_do": "Use a humidifier, drink warm liquids, try honey or cough drops, and avoid smoke or dust."
        },
        "headache": {
            "diagnosis": "You likely have a tension headache or stress-related headache",
            "confidence": 0.70,
            "alternatives": ["Tension Headache", "Migraine", "Sinus Pressure", "Stress Headache"],
            "explanation": "Your head muscles are tense, possibly from stress, poor posture, or lack of sleep.",
            "what_to_do": "Rest in a dark room, apply cold compress to forehead, take ibuprofen, and try relaxation techniques."
        },
        "nausea": {
            "diagnosis": "You probably have stomach upset or digestive issues",
            "confidence": 0.75,
            "alternatives": ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
            "explanation": "Your stomach is irritated, possibly from something you ate or a mild infection.",
            "what_to_do": "Eat bland foods (crackers, rice), drink ginger tea, avoid spicy foods, and rest."
        },
        "sore throat": {
            "diagnosis": "You likely have throat inflammation from a cold or infection",
            "confidence": 0.85,
            "alternatives": ["Strep Throat", "Viral Infection", "Allergic Reaction", "Acid Reflux"],
            "explanation": "Your throat is inflamed, usually from a virus or bacteria causing irritation.",
            "what_to_do": "Gargle with warm salt water, drink warm tea with honey, use throat lozenges, and rest your voice."
        },
        "runny nose": {
            "diagnosis": "You probably have allergies or a cold",
            "confidence": 0.80,
            "alternatives": ["Common Cold", "Allergies", "Sinus Infection", "Hay Fever"],
            "explanation": "Your nose is producing extra mucus to flush out irritants or fight infection.",
            "what_to_do": "Use saline nasal spray, take antihistamines for allergies, drink plenty of fluids, and use a humidifier."
        },
        "chest pain": {
            "diagnosis": "You might have muscle strain or need immediate medical attention",
            "confidence": 0.70,
            "alternatives": ["Muscle Strain", "Heart Problem", "Anxiety", "Costochondritis"],
            "explanation": "Chest pain can be from muscle strain, but it could also be serious - especially if severe.",
            "what_to_do": "If severe or with shortness of breath, go to ER immediately. If mild, rest and apply heat."
        },
        "abdominal pain": {
            "diagnosis": "You likely have digestive upset or stomach issues",
            "confidence": 0.65,
            "alternatives": ["Indigestion", "Food Intolerance", "Stomach Bug", "Appendicitis"],
            "explanation": "Your stomach or intestines are irritated, possibly from food, stress, or mild infection.",
            "what_to_do": "Eat bland foods, avoid dairy and spicy foods, apply gentle heat, and rest."
        },
        "fatigue": {
            "diagnosis": "You're probably run down from illness, stress, or lack of sleep",
            "confidence": 0.70,
            "alternatives": ["Viral Infection", "Iron Deficiency", "Sleep Deprivation", "Stress"],
            "explanation": "Your body is tired, possibly fighting an infection or dealing with stress and poor sleep.",
            "what_to_do": "Get extra sleep, eat nutritious foods, stay hydrated, and reduce stress."
        },
        "body ache": {
            "diagnosis": "You likely have flu-like symptoms or muscle fatigue",
            "confidence": 0.75,
            "alternatives": ["Flu", "Muscle Strain", "Overexertion", "Viral Infection"],
            "explanation": "Your muscles ache, usually from your immune system fighting an infection or overuse.",
            "what_to_do": "Rest, take warm baths, use heating pads, take ibuprofen, and stay hydrated."
        },
        "chills": {
            "diagnosis": "You probably have a fever or are fighting an infection",
            "confidence": 0.80,
            "alternatives": ["Fever", "Infection", "Cold Exposure", "Anxiety"],
            "explanation": "Your body is trying to raise its temperature to fight off an infection.",
            "what_to_do": "Stay warm, rest, drink warm fluids, and monitor for fever."
        },
        "dizziness": {
            "diagnosis": "You might be dehydrated or have inner ear issues",
            "confidence": 0.65,
            "alternatives": ["Dehydration", "Low Blood Pressure", "Inner Ear Problem", "Anxiety"],
            "explanation": "Your balance system is off, possibly from dehydration, low blood pressure, or ear issues.",
            "what_to_do": "Drink plenty of water, sit down when dizzy, avoid sudden movements, and eat regular meals."
        },
        "shortness of breath": {
            "diagnosis": "You need immediate medical attention - this could be serious",
            "confidence": 0.85,
            "alternatives": ["Asthma", "Anxiety", "Pneumonia", "Heart Problem"],
            "explanation": "Difficulty breathing can indicate serious conditions and needs immediate evaluation.",
            "what_to_do": "Go to emergency room immediately, sit upright, try to stay calm, and call 911 if severe."
        },
        "diarrhea": {
            "diagnosis": "You likely have a stomach bug or food poisoning",
            "confidence": 0.80,
            "alternatives": ["Stomach Bug", "Food Poisoning", "Viral Infection", "Food Intolerance"],
            "explanation": "Your digestive system is trying to flush out harmful substances or fight infection.",
            "what_to_do": "Drink plenty of fluids, eat BRAT diet (bananas, rice, applesauce, toast), avoid dairy, and rest."
        },
        "vomiting": {
            "diagnosis": "You probably have a stomach bug or food poisoning",
            "confidence": 0.75,
            "alternatives": ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
            "explanation": "Your stomach is trying to get rid of something harmful or irritating.",
            "what_to_do": "Start with small sips of water, eat bland foods when ready, avoid dairy and spicy foods, and rest."
        }
    }
    
    # Find best matching diagnosis with enhanced logic
    best_match = None
    best_confidence = 0.0
    primary_symptom = None
    
    # Prioritize symptoms by medical importance
    priority_symptoms = ["chest pain", "shortness of breath", "fever", "severe headache", "abdominal pain"]
    
    for symptom in symptoms:
        if symptom in diagnosis_patterns:
            pattern = diagnosis_patterns[symptom]
            # Boost confidence for priority symptoms
            adjusted_confidence = pattern["confidence"]
            if symptom in priority_symptoms:
                adjusted_confidence = min(adjusted_confidence + 0.05, 0.95)
            
            if adjusted_confidence > best_confidence:
                best_confidence = adjusted_confidence
                best_match = pattern
                primary_symptom = symptom
    
    # Generate diagnosis based on symptoms
    if best_match:
        model_diagnosis = best_match["diagnosis"]
        confidence = best_match["confidence"]
        alternatives = best_match["alternatives"]
        explanation = best_match["explanation"]
        what_to_do = best_match["what_to_do"]
    else:
        # Enhanced generic diagnosis based on symptom patterns
        if len(symptoms) >= 4:
            model_diagnosis = "You likely have a multi-system viral infection (like flu)"
            confidence = 0.65
            alternatives = ["Flu", "COVID-19", "Viral Infection", "Bacterial Infection"]
            explanation = "Multiple symptoms suggest your body is fighting a widespread infection."
            what_to_do = "Rest, drink plenty of fluids, take fever reducers, and monitor your symptoms closely."
        elif len(symptoms) == 3:
            model_diagnosis = "You probably have a viral infection or cold"
            confidence = 0.60
            alternatives = ["Common Cold", "Viral Infection", "Allergic Reaction", "Mild Infection"]
            explanation = "Three symptoms together usually indicate your body is fighting an infection."
            what_to_do = "Rest, stay hydrated, take over-the-counter medications, and get plenty of sleep."
        elif len(symptoms) == 2:
            model_diagnosis = "You might have a mild infection or allergic reaction"
            confidence = 0.55
            alternatives = ["Minor Infection", "Allergic Response", "Stress-related", "Environmental Factor"]
            explanation = "Two symptoms may indicate a mild infection or something you're reacting to."
            what_to_do = "Rest, drink fluids, monitor symptoms, and see a doctor if they worsen."
        else:
            model_diagnosis = "You have an isolated symptom that may be temporary"
            confidence = 0.50
            alternatives = ["Minor Condition", "Environmental Factor", "Temporary Issue", "Stress-related"]
            explanation = "A single symptom may be temporary or related to environmental factors."
            what_to_do = "Monitor the symptom, rest, and see a doctor if it persists or worsens."
    
    # Adjust confidence based on severity and duration
    if severity == "high":
        confidence = min(confidence + 0.1, 0.95)
    elif severity == "low":
        confidence = max(confidence - 0.1, 0.30)
    
    # Adjust for duration (longer duration = higher confidence for chronic conditions)
    if duration and "week" in duration.lower():
        confidence = min(confidence + 0.05, 0.95)
    
    # Generate concise, explanatory diagnosis
    symptom_list = ', '.join(symptoms[:3])
    if len(symptoms) > 3:
        symptom_list += f" and {len(symptoms) - 3} other symptoms"
    
    gemini_diagnosis = f"Based on {symptom_list}: {model_diagnosis}. {explanation}"
    
    # Generate final diagnosis with clear explanation and actionable advice
    final_diagnosis = f"**{model_diagnosis}**\n\n**What's happening:** {explanation}\n\n**What you should do:** {what_to_do}\n\n{MEDICAL_DISCLAIMER}"
    
    # Determine urgency
    urgency_level = severity
    if "chest pain" in symptoms or "shortness of breath" in symptoms:
        urgency_level = "high"
    elif len(symptoms) >= 4 or severity == "high":
        urgency_level = "medium"
    else:
        urgency_level = "low"
    
    # Generate specific, actionable recommendations based on what_to_do
    recommendations = []
    
    # Split the what_to_do into individual actionable items
    if what_to_do:
        # Split by common separators and clean up
        items = what_to_do.replace(" and ", ", ").split(", ")
        for item in items:
            item = item.strip()
            if item and not item.endswith('.'):
                item += '.'
            recommendations.append(item)
    
    # Add urgency-based recommendations
    if urgency_level == "high":
        recommendations.insert(0, "Seek immediate medical attention.")
        recommendations.insert(1, "Do not delay professional evaluation.")
    elif urgency_level == "medium":
        recommendations.append("Schedule a doctor's appointment within 24-48 hours.")
    else:
        recommendations.append("Consult a healthcare provider if symptoms persist beyond 3-5 days.")
    
    # Duration-based recommendations
    if duration and "week" in duration.lower():
        recommendations.append("Consider scheduling a medical evaluation due to prolonged symptoms.")
    
    return {
        "model_diagnosis": model_diagnosis,
        "confidence": confidence,
        "gemini_diagnosis": gemini_diagnosis,
        "final_diagnosis": final_diagnosis,
        "differential_diagnoses": alternatives,
        "urgency_level": urgency_level,
        "recommendations": recommendations
    }

async def parse_gemini_response(response_text: str) -> Dict[str, Any]:
    """Parse Gemini response when JSON parsing fails"""
    # Extract symptoms using regex
    symptoms = []
    symptom_patterns = [
        r'symptoms?[:\s]*\[(.*?)\]',
        r'extracted[:\s]*\[(.*?)\]',
        r'keywords?[:\s]*\[(.*?)\]'
    ]
    
    for pattern in symptom_patterns:
        match = re.search(pattern, response_text, re.IGNORECASE)
        if match:
            symptoms_str = match.group(1)
            symptoms = [s.strip().strip('"\'') for s in symptoms_str.split(',')]
            break
    
    # Extract diagnosis
    diagnosis = None
    diagnosis_patterns = [
        r'diagnosis[:\s]*([^.\n]+)',
        r'possible[:\s]*([^.\n]+)',
        r'may be[:\s]*([^.\n]+)'
    ]
    
    for pattern in diagnosis_patterns:
        match = re.search(pattern, response_text, re.IGNORECASE)
        if match:
            diagnosis = match.group(1).strip()
            break
    
    return {
        "symptoms": symptoms,
        "duration": None,
        "severity": "medium",
        "model_diagnosis": None,
        "model_confidence": 0.0,
        "gemini_diagnosis": diagnosis,
        "final_diagnosis": f"{diagnosis or 'Please consult a doctor for proper diagnosis.'} {MEDICAL_DISCLAIMER}",
        "differential_diagnoses": [],
        "urgency_level": "medium",
        "recommendations": ["Rest and stay hydrated", "Monitor symptoms", "Seek medical attention if symptoms worsen"]
    }

async def get_diagnosis_with_fallback(symptoms: List[str], gemini_result: Dict[str, Any]) -> DiagnosisResult:
    """Get diagnosis using Zabihin model with Gemini fallback"""
    
    # Try Zabihin model first
    zabihin_result = zabihin_model.predict(symptoms)
    model_diagnosis = zabihin_result["diagnosis"]
    model_confidence = zabihin_result["confidence"]
    
    # Determine final diagnosis
    if model_diagnosis and model_confidence > 0.6:
        # Use model diagnosis if confidence is high
        final_diagnosis = f"{model_diagnosis}. {MEDICAL_DISCLAIMER}"
        urgency_level = "high" if model_confidence > 0.8 else "medium"
    elif gemini_result.get("gemini_diagnosis"):
        # Use Gemini diagnosis as fallback
        final_diagnosis = f"{gemini_result['gemini_diagnosis']}. {MEDICAL_DISCLAIMER}"
        urgency_level = gemini_result.get("urgency_level", "medium")
    else:
        # Generic response
        final_diagnosis = f"Based on your symptoms, please consult a healthcare professional for proper evaluation. {MEDICAL_DISCLAIMER}"
        urgency_level = "medium"
    
    return DiagnosisResult(
        symptoms=symptoms,
        model_diagnosis=model_diagnosis,
        model_confidence=model_confidence,
        gemini_diagnosis=gemini_result.get("gemini_diagnosis"),
        final_diagnosis=final_diagnosis,
        differential_diagnoses=gemini_result.get("differential_diagnoses", []),
        urgency_level=urgency_level,
        recommendations=gemini_result.get("recommendations", [
            "Rest and stay hydrated",
            "Monitor symptoms closely",
            "Seek medical attention if symptoms worsen",
            "Follow up with a healthcare provider"
        ]),
        disclaimer=MEDICAL_DISCLAIMER
    )

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "Voice Medicine API with Gemini Integration",
        "version": "2.0.0",
        "features": [
            "Voice-to-text medical input processing",
            "Gemini API symptom extraction",
            "Zabihin/Symptom_to_Diagnosis model integration",
            "AI-powered diagnosis with medical disclaimer",
            "Fallback diagnosis system"
        ],
        "gemini_available": gemini_model is not None
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_status": "available" if gemini_model else "unavailable"
    }

@app.post("/process-voice-input", response_model=VoiceMedicineResponse)
async def process_voice_input(request: VoiceInputRequest):
    """Process voice input and provide medical diagnosis"""
    start_time = datetime.now()
    
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Extract symptoms using Gemini
        gemini_result = await extract_symptoms_with_gemini(request.voice_text)
        
        # Create symptom extraction object
        symptom_extraction = SymptomExtraction(
            symptoms=gemini_result.get("symptoms", []),
            duration=gemini_result.get("duration"),
            severity=gemini_result.get("severity"),
            additional_info=request.voice_text
        )
        
        # Get diagnosis with fallback
        diagnosis_result = await get_diagnosis_with_fallback(
            symptom_extraction.symptoms, 
            gemini_result
        )
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Determine model used
        model_used = "gemini" if gemini_model else "fallback"
        if diagnosis_result.model_diagnosis and diagnosis_result.model_confidence > 0.6:
            model_used = "zabihin"
        
        return VoiceMedicineResponse(
            session_id=session_id,
            timestamp=start_time,
            input_text=request.voice_text,
            symptom_extraction=symptom_extraction,
            diagnosis_result=diagnosis_result,
            processing_time=processing_time,
            model_used=model_used
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing voice input: {str(e)}"
        )

@app.post("/extract-symptoms")
async def extract_symptoms_only(request: VoiceInputRequest):
    """Extract only symptoms from voice input"""
    try:
        gemini_result = await extract_symptoms_with_gemini(request.voice_text)
        
        return {
            "symptoms": gemini_result.get("symptoms", []),
            "duration": gemini_result.get("duration"),
            "severity": gemini_result.get("severity"),
            "model_used": "gemini" if gemini_model else "fallback"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting symptoms: {str(e)}"
        )

@app.get("/test-gemini")
async def test_gemini_connection():
    """Test Gemini API connection"""
    if not GEMINI_API_KEY:
        return {
            "status": "unavailable",
            "message": "Gemini API key not configured"
        }
    
    try:
        # List available models first
        models = genai.list_models()
        available_models = [model.name for model in models if 'generateContent' in model.supported_generation_methods]
        
        if not gemini_model:
            return {
                "status": "error",
                "message": "Gemini model not initialized",
                "available_models": available_models[:5]  # Show first 5 models
            }
        
        test_prompt = "Extract symptoms from: 'I have a fever and cough for 3 days'"
        response = gemini_model.generate_content(test_prompt)
        
        return {
            "status": "available",
            "message": "Gemini API is working",
            "test_response": response.text[:200] + "..." if len(response.text) > 200 else response.text,
            "available_models": available_models[:5]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Gemini API error: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002, log_level="info")
