#!/usr/bin/env python3
"""
OpenAI Service for Medicine Recommendations and Health Assistance
- AI-powered medicine recommendations based on symptoms
- Health consultation and advice
- Integration with existing medicine recommendation system
"""

import json
import openai
from typing import Dict, List, Optional, Any
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

# Create a simple logger if the logger module doesn't exist
try:
    from logger import logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)
    logging.basicConfig(level=logging.INFO)

# Initialize OpenAI client
openai.api_key = settings.openai_api_key

class OpenAIMedicineService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        
    async def get_medicine_recommendations(self, symptoms: str, user_id: str = None) -> Dict[str, Any]:
        """
        Get AI-powered medicine recommendations based on symptoms
        """
        try:
            prompt = f"""
            You are Dr. Echo, an AI medical assistant specializing in medicine recommendations.
            
            A patient is experiencing the following symptoms: {symptoms}
            
            Please provide a comprehensive medicine recommendation analysis including:
            
            1. **Symptom Analysis**: Analyze the described symptoms
            2. **Recommended Medicines**: Suggest appropriate over-the-counter and prescription medicines
            3. **Dosage Information**: Provide standard dosage recommendations
            4. **Side Effects**: List common side effects
            5. **Warnings**: Important safety warnings
            6. **Alternative Options**: Suggest alternative medicines
            7. **Urgency Level**: Assess if immediate medical attention is needed
            8. **Lifestyle Recommendations**: Suggest non-medical interventions
            
            Format your response as a JSON object with the following structure:
            {{
                "symptom_analysis": "Detailed analysis of symptoms",
                "recommendations": [
                    {{
                        "medicine_name": "Medicine name",
                        "category": "Category (OTC/Prescription)",
                        "dosage": "Recommended dosage",
                        "frequency": "How often to take",
                        "side_effects": ["Side effect 1", "Side effect 2"],
                        "warnings": ["Warning 1", "Warning 2"],
                        "confidence_score": 0.85
                    }}
                ],
                "urgency_level": "low/medium/high",
                "medical_attention_needed": true/false,
                "lifestyle_recommendations": ["Recommendation 1", "Recommendation 2"],
                "follow_up_advice": "When to follow up with a doctor"
            }}
            
            Important: Always prioritize patient safety. If symptoms suggest a serious condition, recommend immediate medical attention.
            """
            
            response = await self.client.chat.completions.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are Dr. Echo, a medical AI assistant. Provide accurate, safe, and helpful medicine recommendations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            try:
                # Try to parse as JSON
                result = json.loads(content)
                return {
                    "success": True,
                    "data": result,
                    "timestamp": datetime.now().isoformat(),
                    "user_id": user_id
                }
            except json.JSONDecodeError:
                # If not valid JSON, return as text analysis
                return {
                    "success": True,
                    "data": {
                        "raw_response": content,
                        "symptom_analysis": f"AI analysis for symptoms: {symptoms}",
                        "recommendations": [],
                        "urgency_level": "medium",
                        "medical_attention_needed": False,
                        "lifestyle_recommendations": ["Consult with a healthcare professional"],
                        "follow_up_advice": "Please consult with a healthcare professional for personalized advice."
                    },
                    "timestamp": datetime.now().isoformat(),
                    "user_id": user_id
                }
                
        except Exception as e:
            logger.error(f"Error getting medicine recommendations: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "user_id": user_id
            }
    
    async def get_health_consultation(self, user_message: str, conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """
        Provide general health consultation and advice
        """
        try:
            # Build conversation context
            messages = [
                {"role": "system", "content": """
                You are Dr. Echo, an AI medical assistant. Your role is to:
                1. Provide helpful health information and advice
                2. Answer general health questions
                3. Recognize when medical attention is needed
                4. Offer lifestyle and wellness recommendations
                5. Always prioritize patient safety
                
                Important guidelines:
                - Never provide specific medical diagnoses
                - Always recommend consulting healthcare professionals for serious concerns
                - Provide evidence-based health information
                - Be empathetic and supportive
                - Use clear, understandable language
                """}
            ]
            
            # Add conversation history if available
            if conversation_history:
                for msg in conversation_history[-5:]:  # Last 5 messages for context
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })
            
            # Add current user message
            messages.append({"role": "user", "content": user_message})
            
            response = await self.client.chat.completions.acreate(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            
            return {
                "success": True,
                "response": content,
                "timestamp": datetime.now().isoformat(),
                "model_used": "gpt-4"
            }
            
        except Exception as e:
            logger.error(f"Error in health consultation: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def analyze_medical_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze medical text and extract key information
        """
        try:
            prompt = f"""
            Analyze the following medical text and extract key information:
            
            {text}
            
            Please provide a structured analysis including:
            1. Key symptoms mentioned
            2. Potential conditions
            3. Recommended actions
            4. Urgency level
            5. Follow-up recommendations
            
            Format as JSON:
            {{
                "symptoms": ["symptom1", "symptom2"],
                "potential_conditions": ["condition1", "condition2"],
                "recommended_actions": ["action1", "action2"],
                "urgency_level": "low/medium/high",
                "follow_up": "follow-up recommendations"
            }}
            """
            
            response = await self.client.chat.completions.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a medical text analysis AI. Extract and structure medical information accurately."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            try:
                result = json.loads(content)
                return {
                    "success": True,
                    "analysis": result,
                    "timestamp": datetime.now().isoformat()
                }
            except json.JSONDecodeError:
                return {
                    "success": True,
                    "analysis": {
                        "raw_analysis": content,
                        "symptoms": [],
                        "potential_conditions": [],
                        "recommended_actions": ["Consult healthcare professional"],
                        "urgency_level": "medium",
                        "follow_up": "Please consult with a healthcare professional."
                    },
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"Error analyzing medical text: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

# Global instance
openai_medicine_service = OpenAIMedicineService()
