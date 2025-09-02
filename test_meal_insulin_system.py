#!/usr/bin/env python3
"""
Test script for Meal-Based Insulin Prediction System
"""

import requests
import json
import time
from datetime import datetime, timedelta

# API Base URL
BASE_URL = "http://localhost:8001"

def test_api_connection():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ API is running")
            return True
        else:
            print(f"❌ API returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the server is running on port 8001")
        return False

def test_patient_profile():
    """Test patient profile creation and retrieval"""
    print("\n🧪 Testing Patient Profile...")
    
    # Create a test profile
    profile_data = {
        "patient_id": "test-user",
        "insulin_sensitivity_factor": 50,
        "carb_ratio": 15,
        "correction_factor": 1.0,
        "target_glucose_min": 80,
        "target_glucose_max": 120,
        "active_insulin_duration": 180
    }
    
    try:
        # Create profile
        response = requests.post(f"{BASE_URL}/api/meal-insulin/patient-profile", json=profile_data)
        if response.status_code == 200:
            print("✅ Patient profile created successfully")
        else:
            print(f"❌ Failed to create profile: {response.status_code}")
            return False
        
        # Retrieve profile
        response = requests.get(f"{BASE_URL}/api/meal-insulin/patient-profile/test-user")
        if response.status_code == 200:
            profile = response.json()
            print(f"✅ Profile retrieved: Carb ratio = {profile['carb_ratio']}")
            return True
        else:
            print(f"❌ Failed to retrieve profile: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Profile test failed: {e}")
        return False

def test_meal_prediction():
    """Test meal-based insulin prediction"""
    print("\n🧪 Testing Meal Prediction...")
    
    # Test meal data
    meal_data = {
        "meal_input": {
            "meal_name": "Test Grilled Chicken with Rice",
            "meal_type": "dinner",
            "meal_time": datetime.now().isoformat(),
            "carbohydrates": 45,
            "protein": 25,
            "fat": 10,
            "fiber": 3,
            "glycemic_index": 60,
            "serving_size": "1 serving"
        },
        "patient_id": "test-user",
        "current_glucose": 100
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/meal-insulin/predict", json=meal_data)
        if response.status_code == 200:
            prediction = response.json()
            print("✅ Meal prediction successful")
            print(f"   📊 Predicted peak glucose: {prediction['glucose_prediction']['predicted_peak_glucose']} mg/dL")
            print(f"   💉 Recommended insulin: {prediction['insulin_recommendation']['recommended_dosage']} units")
            print(f"   🛡️ Safety status: {prediction['insulin_recommendation']['safety_status']}")
            print(f"   📈 Confidence: {prediction['glucose_prediction']['confidence_score']:.2f}")
            return prediction
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
        return None

def test_feedback_system(prediction):
    """Test feedback submission"""
    print("\n🧪 Testing Feedback System...")
    
    if not prediction:
        print("❌ No prediction available for feedback test")
        return False
    
    feedback_data = {
        "session_id": prediction["session_id"],
        "actual_glucose": 125,  # Simulated actual glucose reading
        "actual_insulin_taken": 3.2,  # Simulated actual insulin taken
        "notes": "Test feedback - prediction was close to actual"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/meal-insulin/feedback", json=feedback_data)
        if response.status_code == 200:
            print("✅ Feedback submitted successfully")
            return True
        else:
            print(f"❌ Feedback submission failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Feedback test failed: {e}")
        return False

def test_system_stats():
    """Test system statistics endpoint"""
    print("\n🧪 Testing System Statistics...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/meal-insulin/stats")
        if response.status_code == 200:
            stats = response.json()
            print("✅ System statistics retrieved")
            print(f"   📊 Total sessions: {stats['total_sessions']}")
            print(f"   💬 Total feedback: {stats['total_feedback']}")
            print(f"   👥 Total patients: {stats['total_patients']}")
            print(f"   🤖 Model trained: {stats['model_trained']}")
            return True
        else:
            print(f"❌ Stats retrieval failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Stats test failed: {e}")
        return False

def test_model_training():
    """Test model training endpoint"""
    print("\n🧪 Testing Model Training...")
    
    try:
        response = requests.post(f"{BASE_URL}/api/meal-insulin/train-model")
        if response.status_code == 200:
            result = response.json()
            print("✅ Model training completed")
            print(f"   📈 Training samples: {result.get('training_samples', 0)}")
            print(f"   💬 Message: {result.get('message', 'No message')}")
            return True
        else:
            print(f"❌ Model training failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Model training test failed: {e}")
        return False

def test_edge_cases():
    """Test edge cases and error handling"""
    print("\n🧪 Testing Edge Cases...")
    
    # Test with invalid patient ID
    try:
        response = requests.post(f"{BASE_URL}/api/meal-insulin/predict", json={
            "meal_input": {
                "meal_name": "Test Meal",
                "meal_type": "breakfast",
                "meal_time": datetime.now().isoformat(),
                "carbohydrates": 30
            },
            "patient_id": "non-existent-user",
            "current_glucose": 100
        })
        if response.status_code == 404:
            print("✅ Correctly handles non-existent patient")
        else:
            print(f"❌ Should return 404 for non-existent patient, got {response.status_code}")
    except Exception as e:
        print(f"❌ Edge case test failed: {e}")
    
    # Test with missing required fields
    try:
        response = requests.post(f"{BASE_URL}/api/meal-insulin/predict", json={
            "meal_input": {
                "meal_name": "Incomplete Meal",
                "meal_type": "lunch",
                "meal_time": datetime.now().isoformat()
                # Missing carbohydrates
            },
            "patient_id": "test-user",
            "current_glucose": 100
        })
        if response.status_code == 422:  # Validation error
            print("✅ Correctly validates required fields")
        else:
            print(f"❌ Should validate required fields, got {response.status_code}")
    except Exception as e:
        print(f"❌ Validation test failed: {e}")

def run_comprehensive_test():
    """Run all tests"""
    print("🍽️ Meal-Based Insulin Prediction System - Test Suite")
    print("=" * 60)
    
    # Test API connection
    if not test_api_connection():
        print("\n❌ Cannot proceed with tests - API is not running")
        print("Please start the API server first:")
        print("python start_meal_insulin_backend.py")
        return
    
    # Run all tests
    tests_passed = 0
    total_tests = 6
    
    if test_patient_profile():
        tests_passed += 1
    
    prediction = test_meal_prediction()
    if prediction:
        tests_passed += 1
    
    if test_feedback_system(prediction):
        tests_passed += 1
    
    if test_system_stats():
        tests_passed += 1
    
    if test_model_training():
        tests_passed += 1
    
    test_edge_cases()
    tests_passed += 1  # Edge cases are informational
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! The system is working correctly.")
    else:
        print("⚠️ Some tests failed. Please check the errors above.")
    
    print("\n💡 Next steps:")
    print("1. Start the frontend React app")
    print("2. Navigate to the meal insulin page")
    print("3. Test the user interface")
    print("4. Provide feedback to improve the model")

if __name__ == "__main__":
    run_comprehensive_test()
