# 🍽️ Meal-Based Insulin Prediction System

## Overview

The Meal-Based Insulin Prediction System is a specialized AI-powered module that predicts blood glucose levels based on meal timing and content, then suggests optimal insulin dosages. This system is designed to prevent insulin overdose and underdose, ultimately improving diabetes management.

## 🎯 Key Features

### Core Functionality
- **Meal Input Interface**: Comprehensive meal data entry (carbs, protein, fat, timing)
- **AI Glucose Prediction**: ML-based glucose level forecasting
- **Smart Insulin Calculation**: Optimal dosage calculation based on predicted glucose
- **Safety Validation**: Overdose/underdose prevention with real-time warnings
- **Visual Feedback**: Glucose curve visualization and trend analysis

### AI/ML Integration
- **Glucose Prediction Model**: Random Forest for glucose response prediction
- **Feature Engineering**: Carbs, GI, timing, patient profile integration
- **Confidence Scoring**: Model confidence for recommendations
- **Feedback Loop**: Continuous learning from actual results

### Safety Features
- **Dosage Limits**: Prevents dangerous insulin amounts
- **Warning System**: Alerts for unusual recommendations
- **Confidence Thresholds**: Lower confidence = more warnings
- **Emergency Alerts**: Critical safety warnings

## 🏗️ System Architecture

```
User Input (Meal + Timing) 
    ↓
Feature Engineering (Carbs, Protein, Fat, Timing)
    ↓
Glucose Prediction Model (ML)
    ↓
Insulin Dosage Calculator (Rule-based + ML)
    ↓
Safety Validation
    ↓
Final Recommendation
```

## 📁 File Structure

```
shine2/
├── backend/
│   └── meal_insulin_prediction_api.py    # Main API server
├── src/
│   ├── components/meal-insulin/
│   │   ├── MealInsulinDashboard.tsx      # Main prediction interface
│   │   ├── PatientInsulinProfile.tsx     # Profile management
│   │   └── InsulinFeedback.tsx           # Feedback system
│   └── pages/
│       └── MealInsulinPage.tsx           # Main page component
├── start_meal_insulin_backend.py         # Startup script
└── MEAL_INSULIN_SYSTEM_README.md         # This file
```

## 🚀 Quick Start

### 1. Start the Backend API

```bash
# Navigate to the project directory
cd /Users/utsavgautam/V-Medithon/shine2

# Start the backend server
python start_meal_insulin_backend.py
```

The API will be available at:
- **Server**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

### 2. Access the Frontend

Navigate to the meal insulin page in your React application:
```
http://localhost:5173/meal-insulin
```

### 3. Set Up Your Profile

1. Go to the "Patient Profile" tab
2. Configure your insulin parameters:
   - Insulin Sensitivity Factor (mg/dL per unit)
   - Carbohydrate Ratio (grams per unit)
   - Correction Factor (units per 50mg/dL above target)
   - Target Glucose Range
   - Active Insulin Duration

### 4. Make Predictions

1. Go to the "Predict Insulin" tab
2. Enter your meal details:
   - Meal name and type
   - Meal timing
   - Carbohydrates, protein, fat, fiber
   - Current glucose level
3. Click "Get Insulin Recommendation"
4. Review the AI recommendation and safety warnings

### 5. Provide Feedback

1. Go to the "Feedback" tab
2. Select a previous session
3. Enter actual glucose readings and insulin taken
4. Submit feedback to improve the model

## 🔧 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/meal-insulin/predict` | Get insulin recommendation for a meal |
| POST | `/api/meal-insulin/patient-profile` | Create/update patient profile |
| GET | `/api/meal-insulin/patient-profile/{patient_id}` | Get patient profile |
| GET | `/api/meal-insulin/sessions/{patient_id}` | Get recent sessions |
| POST | `/api/meal-insulin/feedback` | Submit feedback |
| GET | `/api/meal-insulin/stats` | Get system statistics |
| POST | `/api/meal-insulin/train-model` | Retrain model with feedback |

### Example API Usage

```python
import requests

# Get insulin recommendation
response = requests.post('http://localhost:8001/api/meal-insulin/predict', json={
    "meal_input": {
        "meal_name": "Grilled Chicken with Rice",
        "meal_type": "dinner",
        "meal_time": "2024-01-15T19:00:00",
        "carbohydrates": 45,
        "protein": 25,
        "fat": 10,
        "fiber": 3,
        "glycemic_index": 60
    },
    "patient_id": "default-user",
    "current_glucose": 100
})

prediction = response.json()
print(f"Recommended insulin: {prediction['insulin_recommendation']['recommended_dosage']} units")
```

## 🧠 Machine Learning Models

### Glucose Prediction Model

The system uses a Random Forest Regressor to predict glucose response:

**Features Used:**
- Carbohydrates (grams)
- Protein (grams)
- Fat (grams)
- Fiber (grams)
- Glycemic Index
- Meal hour (0-23)
- Current glucose level
- Insulin sensitivity factor
- Carbohydrate ratio

**Model Performance:**
- **Training Data**: User feedback and historical data
- **Accuracy**: Improves over time with feedback
- **Fallback**: Rule-based prediction when ML model not available

### Insulin Dosage Calculation

**Formula:**
```
Total Insulin = Carb Insulin + Correction Insulin

Carb Insulin = Carbohydrates / Carb Ratio
Correction Insulin = (Predicted Glucose - Target Max) / Insulin Sensitivity Factor
```

**Safety Checks:**
- Maximum dosage limits
- High carbohydrate meal warnings
- Large correction dose alerts
- Confidence-based warnings

## 🛡️ Safety Features

### Overdose Prevention
- Maximum dosage limits (20 units warning, 30 units danger)
- High carbohydrate meal detection
- Large correction dose warnings
- Confidence-based safety levels

### Warning System
- **Safe**: Normal recommendations
- **Warning**: High dosage or unusual patterns
- **Danger**: Extremely high dosage requiring medical supervision

### Medical Disclaimer
- Clear warnings that recommendations are for guidance only
- Emphasis on consulting healthcare providers
- Not a replacement for professional medical advice

## 📊 Data Models

### Meal Input
```typescript
interface MealInput {
  meal_name: string;
  meal_type: string; // breakfast, lunch, dinner, snack
  meal_time: string;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemic_index?: number;
  serving_size: string;
}
```

### Patient Profile
```typescript
interface PatientInsulinProfile {
  patient_id: string;
  insulin_sensitivity_factor: number; // mg/dL per unit
  carb_ratio: number; // grams per unit
  correction_factor: number; // units per 50mg/dL above target
  target_glucose_min: number;
  target_glucose_max: number;
  active_insulin_duration: number; // minutes
}
```

### Prediction Result
```typescript
interface MealInsulinPrediction {
  meal_input: MealInput;
  glucose_prediction: {
    current_glucose: number;
    predicted_peak_glucose: number;
    predicted_peak_time: string;
    glucose_curve: Array<{time: string; glucose: number}>;
    confidence_score: number;
  };
  insulin_recommendation: {
    recommended_dosage: number;
    carb_insulin: number;
    correction_insulin: number;
    insulin_type: string;
    injection_time: string;
    expected_glucose_after: number;
    safety_status: string; // safe, warning, danger
    warnings: string[];
    confidence_score: number;
  };
  session_id: string;
  timestamp: string;
}
```

## 🔄 Integration with V-Medithon

### Existing System Integration
- **Medical Records**: Extends existing patient management
- **AI Services**: Integrates with OpenAI medicine recommendation system
- **Blockchain**: Can be extended for immutable injection records
- **Notifications**: Uses existing alert system

### Database Integration
The system can be integrated with your existing database by:
1. Adding insulin-specific tables to your schema
2. Extending patient profiles with insulin parameters
3. Storing predictions and feedback for model improvement

## 🧪 Testing

### Manual Testing
1. **Profile Setup**: Create and update patient profiles
2. **Prediction Testing**: Test with various meal combinations
3. **Safety Testing**: Verify overdose prevention works
4. **Feedback Testing**: Submit feedback and retrain model

### API Testing
```bash
# Test the API endpoints
curl -X POST "http://localhost:8001/api/meal-insulin/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "meal_input": {
      "meal_name": "Test Meal",
      "meal_type": "lunch",
      "meal_time": "2024-01-15T12:00:00",
      "carbohydrates": 30,
      "protein": 15,
      "fat": 5,
      "fiber": 2
    },
    "patient_id": "default-user",
    "current_glucose": 100
  }'
```

## 🚀 Future Enhancements

### Planned Features
1. **CGM Integration**: Real-time glucose monitoring
2. **Meal Database**: Pre-loaded nutritional information
3. **Advanced ML**: LSTM models for time series prediction
4. **Mobile App**: Dedicated mobile application
5. **Healthcare Provider Dashboard**: Doctor monitoring interface

### Advanced Analytics
1. **Pattern Recognition**: Identify eating and glucose patterns
2. **Personalized Recommendations**: Individual-specific optimizations
3. **Risk Assessment**: Long-term diabetes management insights
4. **Integration with Wearables**: Fitness tracker data integration

## 🛠️ Troubleshooting

### Common Issues

1. **API Not Starting**
   - Check if port 8001 is available
   - Verify Python dependencies are installed
   - Check for syntax errors in the API file

2. **Predictions Not Working**
   - Ensure patient profile is configured
   - Check if meal data is complete
   - Verify API is running and accessible

3. **Frontend Not Loading**
   - Check if React app is running
   - Verify API endpoints are correct
   - Check browser console for errors

### Debug Mode
Enable debug logging by setting environment variable:
```bash
export DEBUG=meal_insulin:*
python start_meal_insulin_backend.py
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at http://localhost:8001/docs
3. Check console logs for error messages
4. Verify all dependencies are installed

## ⚠️ Medical Disclaimer

**IMPORTANT**: This system is designed for educational and informational purposes only. The AI-powered insulin recommendations should not replace professional medical advice, diagnosis, or treatment. Always consult with your healthcare provider before making any changes to your insulin regimen or diabetes management plan.

The predictions and recommendations provided by this system are based on general algorithms and may not be appropriate for your specific medical condition. Individual responses to insulin can vary significantly, and what works for one person may not work for another.

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
