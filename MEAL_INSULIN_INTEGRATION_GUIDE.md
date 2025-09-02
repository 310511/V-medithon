# 🍽️ Meal-Based Insulin System - Integration Guide

## Quick Integration Steps

### 1. Add Route to Your React App

Add this route to your main App.tsx or routing configuration:

```typescript
// In your main App.tsx or router configuration
import { MealInsulinPage } from './pages/MealInsulinPage';

// Add this route
<Route path="/meal-insulin" element={<MealInsulinPage />} />
```

### 2. Add Navigation Link

Add a navigation link to your main navigation component:

```typescript
// In your navigation component
<Link to="/meal-insulin" className="nav-link">
  <Utensils className="h-4 w-4 mr-2" />
  Meal Insulin Prediction
</Link>
```

### 3. Install Required Dependencies

Make sure you have these dependencies in your package.json:

```json
{
  "dependencies": {
    "recharts": "^2.15.4",
    "lucide-react": "^0.263.1"
  }
}
```

If not already installed:
```bash
npm install recharts lucide-react
```

### 4. Start the Backend API

```bash
# In your project directory
cd /Users/utsavgautam/V-Medithon/shine2
python start_meal_insulin_backend.py
```

### 5. Test the System

```bash
# Run the test script
python test_meal_insulin_system.py
```

## Integration with Existing V-Medithon Features

### Medical Records Integration

The meal insulin system can be integrated with your existing medical records:

```typescript
// In your medical records component, add insulin tracking
const addInsulinRecord = (prediction: MealInsulinPrediction) => {
  const medicalRecord = {
    type: 'insulin_injection',
    date: new Date(),
    title: `Insulin for ${prediction.meal_input.meal_name}`,
    description: `Recommended: ${prediction.insulin_recommendation.recommended_dosage} units`,
    dosage: prediction.insulin_recommendation.recommended_dosage,
    insulin_type: prediction.insulin_recommendation.insulin_type,
    safety_status: prediction.insulin_recommendation.safety_status
  };
  
  // Add to your existing medical records system
  addMedicalRecord(medicalRecord);
};
```

### AI Medicine Recommendation Integration

Extend your existing AI medicine system to include insulin recommendations:

```typescript
// In your AI medicine service
export const getInsulinRecommendation = async (mealData: MealInput, currentGlucose: number) => {
  const response = await fetch('/api/meal-insulin/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal_input: mealData,
      patient_id: getCurrentUserId(),
      current_glucose: currentGlucose
    })
  });
  
  return response.json();
};
```

### Blockchain Integration

For immutable insulin injection records:

```solidity
// Add to your existing smart contract
contract InsulinTracking {
    struct InsulinInjection {
        uint256 timestamp;
        uint256 dosage;
        string insulinType;
        string mealName;
        uint256 glucoseBefore;
        uint256 glucoseAfter;
        string patientId;
    }
    
    mapping(string => InsulinInjection[]) public patientInjections;
    
    function logInsulinInjection(
        string memory patientId,
        uint256 dosage,
        string memory insulinType,
        string memory mealName,
        uint256 glucoseBefore,
        uint256 glucoseAfter
    ) public {
        InsulinInjection memory injection = InsulinInjection({
            timestamp: block.timestamp,
            dosage: dosage,
            insulinType: insulinType,
            mealName: mealName,
            glucoseBefore: glucoseBefore,
            glucoseAfter: glucoseAfter,
            patientId: patientId
        });
        
        patientInjections[patientId].push(injection);
    }
}
```

## API Integration Examples

### Frontend Service Integration

Create a service file for insulin predictions:

```typescript
// src/services/insulinService.ts
export class InsulinService {
  private baseUrl = 'http://localhost:8001';
  
  async predictInsulin(mealData: MealInput, currentGlucose: number) {
    const response = await fetch(`${this.baseUrl}/api/meal-insulin/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meal_input: mealData,
        patient_id: 'current-user',
        current_glucose: currentGlucose
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get insulin prediction');
    }
    
    return response.json();
  }
  
  async updatePatientProfile(profile: PatientInsulinProfile) {
    const response = await fetch(`${this.baseUrl}/api/meal-insulin/patient-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    
    return response.json();
  }
  
  async submitFeedback(feedback: FeedbackData) {
    const response = await fetch(`${this.baseUrl}/api/meal-insulin/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    
    return response.json();
  }
}

export const insulinService = new InsulinService();
```

### Database Integration

If you want to integrate with your existing database:

```python
# Add to your existing database models
from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

class InsulinInjection(Base):
    __tablename__ = "insulin_injections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey('patients.id'))
    meal_name = Column(String(255))
    meal_type = Column(String(50))
    meal_time = Column(DateTime)
    carbohydrates = Column(Float)
    protein = Column(Float)
    fat = Column(Float)
    fiber = Column(Float)
    glycemic_index = Column(Float)
    current_glucose = Column(Float)
    predicted_peak_glucose = Column(Float)
    recommended_dosage = Column(Float)
    actual_glucose = Column(Float, nullable=True)
    actual_insulin_taken = Column(Float, nullable=True)
    safety_status = Column(String(20))
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Testing the Integration

### 1. Start Both Services

```bash
# Terminal 1: Start the insulin API
cd /Users/utsavgautam/V-Medithon/shine2
python start_meal_insulin_backend.py

# Terminal 2: Start your React app
npm run dev
```

### 2. Test the Integration

```bash
# Run the test script
python test_meal_insulin_system.py
```

### 3. Access the Feature

Navigate to: `http://localhost:5173/meal-insulin`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the API allows your frontend origin
2. **Port Conflicts**: Ensure port 8001 is available for the API
3. **Missing Dependencies**: Install required npm packages
4. **API Not Starting**: Check Python dependencies and syntax

### Debug Mode

Enable debug logging:
```bash
export DEBUG=meal_insulin:*
python start_meal_insulin_backend.py
```

## Next Steps

1. **Customize the UI**: Modify the components to match your app's design
2. **Add Authentication**: Integrate with your existing auth system
3. **Database Integration**: Connect to your existing database
4. **Mobile Optimization**: Make the interface mobile-friendly
5. **Advanced Features**: Add CGM integration, meal database, etc.

## Support

For integration issues:
1. Check the main README: `MEAL_INSULIN_SYSTEM_README.md`
2. Run the test script: `python test_meal_insulin_system.py`
3. Check API documentation: `http://localhost:8001/docs`
4. Review console logs for errors
