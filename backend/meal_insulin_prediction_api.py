#!/usr/bin/env python3
"""
Meal-Based Insulin Prediction System
- Predicts glucose levels based on meal timing and content
- Calculates optimal insulin dosages
- Provides safety validations
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
import math

app = FastAPI(
    title="Meal-Based Insulin Prediction API",
    description="AI-powered insulin dosage recommendations based on meal timing and glucose prediction",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:5173", "http://localhost:3006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class MealInput(BaseModel):
    meal_name: str
    meal_type: str  # breakfast, lunch, dinner, snack
    meal_time: datetime
    carbohydrates: float = Field(..., description="Carbohydrates in grams")
    protein: float = Field(default=0, description="Protein in grams")
    fat: float = Field(default=0, description="Fat in grams")
    fiber: float = Field(default=0, description="Fiber in grams")
    glycemic_index: Optional[float] = Field(default=None, description="Glycemic index")
    serving_size: str = Field(default="1 serving", description="Serving size description")

class PatientInsulinProfile(BaseModel):
    patient_id: str
    insulin_sensitivity_factor: float = Field(..., description="mg/dL per unit of insulin")
    carb_ratio: float = Field(..., description="grams of carbs per unit of insulin")
    correction_factor: float = Field(..., description="units per 50mg/dL above target")
    target_glucose_min: float = Field(default=80, description="Target glucose minimum")
    target_glucose_max: float = Field(default=120, description="Target glucose maximum")
    active_insulin_duration: int = Field(default=180, description="Active insulin duration in minutes")

class GlucosePrediction(BaseModel):
    current_glucose: float
    predicted_peak_glucose: float
    predicted_peak_time: datetime
    glucose_curve: List[Dict[str, Any]]  # Time series data
    confidence_score: float

class InsulinRecommendation(BaseModel):
    recommended_dosage: float
    carb_insulin: float
    correction_insulin: float
    insulin_type: str
    injection_time: datetime
    expected_glucose_after: float
    safety_status: str  # safe, warning, danger
    warnings: List[str]
    confidence_score: float

class MealInsulinPrediction(BaseModel):
    meal_input: MealInput
    glucose_prediction: GlucosePrediction
    insulin_recommendation: InsulinRecommendation
    session_id: str
    timestamp: datetime

class FeedbackData(BaseModel):
    session_id: str
    actual_glucose: float
    actual_insulin_taken: float
    notes: Optional[str] = None

# ML Models
class GlucosePredictionModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = 'models/glucose_prediction_model.joblib'
        self.scaler_path = 'models/glucose_scaler.joblib'
        
        # Try to load existing model
        self._load_model()
    
    def _load_model(self):
        """Load existing trained model if available"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.is_trained = True
                print("Loaded existing glucose prediction model")
        except Exception as e:
            print(f"Could not load existing model: {e}")
            self.is_trained = False
    
    def train_model(self, training_data):
        """Train the glucose prediction model"""
        try:
            # Feature engineering
            features = self._engineer_features(training_data)
            targets = [d['glucose_peak'] for d in training_data]
            
            if len(features) < 10:  # Need minimum data for training
                print("Insufficient training data")
                return False
            
            # Scale features
            features_scaled = self.scaler.fit_transform(features)
            
            # Train model
            self.model.fit(features_scaled, targets)
            self.is_trained = True
            
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # Save model
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            print("Model trained and saved successfully")
            return True
        except Exception as e:
            print(f"Model training failed: {e}")
            return False
    
    def predict_glucose(self, meal_data, patient_profile, current_glucose):
        """Predict glucose response to meal"""
        if not self.is_trained:
            # Use rule-based prediction if model not trained
            return self._rule_based_prediction(meal_data, patient_profile, current_glucose)
        
        try:
            # Feature engineering
            features = self._create_features(meal_data, patient_profile, current_glucose)
            features_scaled = self.scaler.transform([features])
            
            # Predict
            predicted_peak = self.model.predict(features_scaled)[0]
            
            # Generate glucose curve
            glucose_curve = self._generate_glucose_curve(
                current_glucose, predicted_peak, meal_data.meal_time
            )
            
            return {
                'predicted_peak_glucose': max(predicted_peak, current_glucose + 10),  # Ensure minimum rise
                'predicted_peak_time': meal_data.meal_time + timedelta(minutes=90),
                'glucose_curve': glucose_curve,
                'confidence_score': 0.85
            }
        except Exception as e:
            print(f"ML prediction failed, using rule-based: {e}")
            return self._rule_based_prediction(meal_data, patient_profile, current_glucose)
    
    def _engineer_features(self, training_data):
        """Engineer features for training"""
        features = []
        for data in training_data:
            feature_vector = [
                data['carbs'],
                data['protein'],
                data['fat'],
                data['fiber'],
                data.get('glycemic_index', 50),
                data['meal_hour'],
                data['current_glucose'],
                data['insulin_sensitivity'],
                data['carb_ratio']
            ]
            features.append(feature_vector)
        return np.array(features)
    
    def _create_features(self, meal_data, patient_profile, current_glucose):
        """Create feature vector for prediction"""
        meal_hour = meal_data.meal_time.hour
        
        return [
            meal_data.carbohydrates,
            meal_data.protein,
            meal_data.fat,
            meal_data.fiber,
            meal_data.glycemic_index or 50,  # Default GI
            meal_hour,
            current_glucose,
            patient_profile.insulin_sensitivity_factor,
            patient_profile.carb_ratio
        ]
    
    def _rule_based_prediction(self, meal_data, patient_profile, current_glucose):
        """Fallback rule-based prediction"""
        # Simple glucose prediction based on carbs and GI
        carb_impact = meal_data.carbohydrates * 4  # 4 mg/dL per gram of carbs
        gi_factor = (meal_data.glycemic_index or 50) / 100
        
        # Adjust for protein and fat (slower absorption)
        protein_factor = meal_data.protein * 0.5  # Protein has some glucose impact
        fat_factor = meal_data.fat * 0.1  # Fat slows absorption
        
        # Time-based adjustment
        meal_hour = meal_data.meal_time.hour
        if 6 <= meal_hour <= 10:  # Breakfast - higher sensitivity
            time_factor = 1.2
        elif 11 <= meal_hour <= 15:  # Lunch - normal
            time_factor = 1.0
        elif 16 <= meal_hour <= 20:  # Dinner - normal
            time_factor = 1.0
        else:  # Late night - lower sensitivity
            time_factor = 0.8
        
        predicted_peak = current_glucose + (carb_impact * gi_factor * time_factor) + protein_factor - fat_factor
        
        # Generate simple glucose curve
        glucose_curve = self._generate_glucose_curve(
            current_glucose, predicted_peak, meal_data.meal_time
        )
        
        return {
            'predicted_peak_glucose': max(predicted_peak, current_glucose + 10),
            'predicted_peak_time': meal_data.meal_time + timedelta(minutes=90),
            'glucose_curve': glucose_curve,
            'confidence_score': 0.70
        }
    
    def _generate_glucose_curve(self, current_glucose, peak_glucose, meal_time):
        """Generate glucose curve over time"""
        curve = []
        peak_time = meal_time + timedelta(minutes=90)
        
        # Generate points every 15 minutes for 4 hours
        for i in range(16):  # 4 hours * 4 points per hour
            time_point = meal_time + timedelta(minutes=i * 15)
            
            if time_point <= peak_time:
                # Rising phase
                progress = (time_point - meal_time).total_seconds() / (peak_time - meal_time).total_seconds()
                glucose = current_glucose + (peak_glucose - current_glucose) * progress
            else:
                # Falling phase
                fall_duration = timedelta(hours=2, minutes=30)  # 2.5 hours to return to baseline
                fall_progress = (time_point - peak_time).total_seconds() / fall_duration.total_seconds()
                fall_progress = min(fall_progress, 1.0)  # Cap at 1.0
                glucose = peak_glucose - (peak_glucose - current_glucose) * fall_progress * 0.7
            
            curve.append({
                'time': time_point.isoformat(),
                'glucose': round(glucose, 1)
            })
        
        return curve

class InsulinDosageCalculator:
    def __init__(self):
        pass
    
    def calculate_insulin_dosage(self, meal_data, patient_profile, glucose_prediction):
        """Calculate optimal insulin dosage"""
        # Carb-based insulin calculation
        carb_insulin = meal_data.carbohydrates / patient_profile.carb_ratio
        
        # Correction insulin for predicted high glucose
        if glucose_prediction['predicted_peak_glucose'] > patient_profile.target_glucose_max:
            glucose_excess = glucose_prediction['predicted_peak_glucose'] - patient_profile.target_glucose_max
            correction_insulin = glucose_excess / patient_profile.insulin_sensitivity_factor
        else:
            correction_insulin = 0
        
        total_insulin = carb_insulin + correction_insulin
        
        # Safety checks
        safety_status, warnings = self._safety_check(total_insulin, patient_profile, meal_data)
        
        # Calculate expected glucose after insulin
        expected_glucose_after = max(
            glucose_prediction['predicted_peak_glucose'] - (total_insulin * patient_profile.insulin_sensitivity_factor),
            patient_profile.target_glucose_min
        )
        
        return {
            'recommended_dosage': round(total_insulin, 1),
            'carb_insulin': round(carb_insulin, 1),
            'correction_insulin': round(correction_insulin, 1),
            'insulin_type': 'Rapid-acting',
            'injection_time': meal_data.meal_time - timedelta(minutes=15),  # 15 min before meal
            'expected_glucose_after': round(expected_glucose_after, 1),
            'safety_status': safety_status,
            'warnings': warnings,
            'confidence_score': glucose_prediction['confidence_score']
        }
    
    def _safety_check(self, total_insulin, patient_profile, meal_data):
        """Perform safety checks on insulin dosage"""
        warnings = []
        safety_status = "safe"
        
        # Check for excessive dosage
        if total_insulin > 20:  # Arbitrary high threshold
            warnings.append("High insulin dosage recommended. Please consult your doctor.")
            safety_status = "warning"
        
        if total_insulin > 30:
            warnings.append("DANGER: Extremely high insulin dosage. Do not proceed without medical supervision.")
            safety_status = "danger"
        
        # Check for very low dosage
        if total_insulin < 0.5:
            warnings.append("Very low insulin dosage. Consider if insulin is needed.")
        
        # Check for high carb meals
        if meal_data.carbohydrates > 100:
            warnings.append("High carbohydrate meal detected. Monitor glucose closely.")
        
        # Check for very high predicted glucose
        if total_insulin > 0 and total_insulin * patient_profile.insulin_sensitivity_factor > 200:
            warnings.append("Large glucose correction needed. Consider splitting the dose.")
        
        return safety_status, warnings

# Initialize models
glucose_model = GlucosePredictionModel()
insulin_calculator = InsulinDosageCalculator()

# In-memory storage (replace with database in production)
patient_profiles = {}
meal_sessions = {}
feedback_data = []

# Create default patient profile for testing
default_profile = PatientInsulinProfile(
    patient_id="default-user",
    insulin_sensitivity_factor=50,  # 50 mg/dL per unit
    carb_ratio=15,  # 15g carbs per unit
    correction_factor=1.0,  # 1 unit per 50mg/dL above target
    target_glucose_min=80,
    target_glucose_max=120,
    active_insulin_duration=180
)
patient_profiles["default-user"] = default_profile

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Meal-Based Insulin Prediction API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "cors_enabled": True
    }

class PredictionRequest(BaseModel):
    meal_input: MealInput
    patient_id: str = "default-user"
    current_glucose: float = 100

@app.post("/api/meal-insulin/predict", response_model=MealInsulinPrediction)
async def predict_meal_insulin(request: PredictionRequest):
    """Main endpoint for meal-based insulin prediction"""
    try:
        # Extract data from request
        meal_input = request.meal_input
        patient_id = request.patient_id
        current_glucose = request.current_glucose
        
        # Get patient profile
        if patient_id not in patient_profiles:
            raise HTTPException(status_code=404, detail="Patient profile not found")
        
        patient_profile = patient_profiles[patient_id]
        
        # Predict glucose response
        glucose_prediction_data = glucose_model.predict_glucose(
            meal_input, patient_profile, current_glucose
        )
        
        glucose_prediction = GlucosePrediction(
            current_glucose=current_glucose,
            predicted_peak_glucose=glucose_prediction_data['predicted_peak_glucose'],
            predicted_peak_time=glucose_prediction_data['predicted_peak_time'],
            glucose_curve=glucose_prediction_data['glucose_curve'],
            confidence_score=glucose_prediction_data['confidence_score']
        )
        
        # Calculate insulin dosage
        insulin_data = insulin_calculator.calculate_insulin_dosage(
            meal_input, patient_profile, glucose_prediction_data
        )
        
        insulin_recommendation = InsulinRecommendation(**insulin_data)
        
        # Create session
        session_id = str(uuid.uuid4())
        session = MealInsulinPrediction(
            meal_input=meal_input,
            glucose_prediction=glucose_prediction,
            insulin_recommendation=insulin_recommendation,
            session_id=session_id,
            timestamp=datetime.now()
        )
        
        # Store session
        meal_sessions[session_id] = session
        
        return session
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/meal-insulin/patient-profile")
async def create_patient_profile(profile: PatientInsulinProfile):
    """Create or update patient insulin profile"""
    patient_profiles[profile.patient_id] = profile
    return {"message": "Patient profile created successfully", "patient_id": profile.patient_id}

@app.get("/api/meal-insulin/patient-profile/{patient_id}")
async def get_patient_profile(patient_id: str):
    """Get patient insulin profile"""
    if patient_id not in patient_profiles:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient_profiles[patient_id]

@app.get("/api/meal-insulin/sessions/{patient_id}")
async def get_patient_sessions(patient_id: str, limit: int = 10):
    """Get recent meal insulin sessions for a patient"""
    # Filter sessions by patient (in a real app, this would be in the database)
    patient_sessions = []
    for session in meal_sessions.values():
        # For now, we'll return all sessions since we don't have patient_id in meal_input
        patient_sessions.append(session)
    
    # Sort by timestamp and limit
    patient_sessions.sort(key=lambda x: x.timestamp, reverse=True)
    return patient_sessions[:limit]

@app.post("/api/meal-insulin/feedback")
async def submit_feedback(feedback: FeedbackData):
    """Submit feedback for model improvement"""
    if feedback.session_id not in meal_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Store feedback for model retraining
    feedback_data.append({
        'session_id': feedback.session_id,
        'actual_glucose': feedback.actual_glucose,
        'actual_insulin_taken': feedback.actual_insulin_taken,
        'notes': feedback.notes,
        'timestamp': datetime.now()
    })
    
    return {"message": "Feedback submitted successfully"}

@app.get("/api/meal-insulin/stats")
async def get_system_stats():
    """Get system statistics"""
    return {
        "total_sessions": len(meal_sessions),
        "total_patients": len(patient_profiles),
        "total_feedback": len(feedback_data),
        "model_trained": glucose_model.is_trained,
        "system_status": "operational"
    }

@app.post("/api/meal-insulin/train-model")
async def train_model():
    """Train the glucose prediction model with feedback data"""
    if len(feedback_data) < 10:
        return {"message": "Insufficient feedback data for training", "data_points": len(feedback_data)}
    
    # Convert feedback data to training format
    training_data = []
    for feedback in feedback_data:
        if feedback['session_id'] in meal_sessions:
            session = meal_sessions[feedback['session_id']]
            meal = session.meal_input
            
            training_data.append({
                'carbs': meal.carbohydrates,
                'protein': meal.protein,
                'fat': meal.fat,
                'fiber': meal.fiber,
                'glycemic_index': meal.glycemic_index or 50,
                'meal_hour': meal.meal_time.hour,
                'current_glucose': session.glucose_prediction.current_glucose,
                'insulin_sensitivity': 50,  # Default value
                'carb_ratio': 15,  # Default value
                'glucose_peak': feedback['actual_glucose']
            })
    
    # Train model
    success = glucose_model.train_model(training_data)
    
    if success:
        return {"message": "Model trained successfully", "training_samples": len(training_data)}
    else:
        return {"message": "Model training failed", "training_samples": len(training_data)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
