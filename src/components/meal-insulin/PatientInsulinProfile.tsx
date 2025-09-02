import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Save, CheckCircle, AlertTriangle } from 'lucide-react';

interface PatientInsulinProfile {
  patient_id: string;
  insulin_sensitivity_factor: number;
  carb_ratio: number;
  correction_factor: number;
  target_glucose_min: number;
  target_glucose_max: number;
  active_insulin_duration: number;
}

export function PatientInsulinProfile() {
  const [profile, setProfile] = useState<PatientInsulinProfile>({
    patient_id: 'default-user',
    insulin_sensitivity_factor: 50,
    carb_ratio: 15,
    correction_factor: 1.0,
    target_glucose_min: 80,
    target_glucose_max: 120,
    active_insulin_duration: 180
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/api/meal-insulin/patient-profile/${profile.patient_id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setMessage({type: 'error', text: 'Failed to load profile'});
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/patient-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage({type: 'success', text: 'Profile saved successfully!'});
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (err) {
      setMessage({type: 'error', text: 'Failed to save profile. Please try again.'});
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof PatientInsulinProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const getInsulinSensitivityDescription = (factor: number) => {
    if (factor < 30) return "Very sensitive - small doses have large effects";
    if (factor < 50) return "Sensitive - moderate doses needed";
    if (factor < 70) return "Normal sensitivity";
    return "Less sensitive - larger doses needed";
  };

  const getCarbRatioDescription = (ratio: number) => {
    if (ratio < 10) return "High carb sensitivity - small amounts of carbs need insulin";
    if (ratio < 15) return "Moderate carb sensitivity";
    if (ratio < 20) return "Normal carb sensitivity";
    return "Low carb sensitivity - can handle more carbs per unit";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <User className="h-8 w-8 inline mr-2" />
          Patient Insulin Profile
        </h1>
        <p className="text-gray-600">
          Configure your insulin sensitivity and dosing parameters
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Insulin Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Insulin Sensitivity Factor */}
            <div className="space-y-2">
              <Label htmlFor="insulin_sensitivity_factor">
                Insulin Sensitivity Factor (mg/dL per unit)
              </Label>
              <Input
                id="insulin_sensitivity_factor"
                type="number"
                value={profile.insulin_sensitivity_factor}
                onChange={(e) => handleInputChange('insulin_sensitivity_factor', e.target.value)}
                placeholder="50"
                min="10"
                max="100"
                step="5"
              />
              <p className="text-sm text-gray-600">
                {getInsulinSensitivityDescription(profile.insulin_sensitivity_factor)}
              </p>
            </div>

            {/* Carb Ratio */}
            <div className="space-y-2">
              <Label htmlFor="carb_ratio">
                Carbohydrate Ratio (grams per unit)
              </Label>
              <Input
                id="carb_ratio"
                type="number"
                value={profile.carb_ratio}
                onChange={(e) => handleInputChange('carb_ratio', e.target.value)}
                placeholder="15"
                min="5"
                max="30"
                step="1"
              />
              <p className="text-sm text-gray-600">
                {getCarbRatioDescription(profile.carb_ratio)}
              </p>
            </div>

            {/* Correction Factor */}
            <div className="space-y-2">
              <Label htmlFor="correction_factor">
                Correction Factor (units per 50mg/dL above target)
              </Label>
              <Input
                id="correction_factor"
                type="number"
                value={profile.correction_factor}
                onChange={(e) => handleInputChange('correction_factor', e.target.value)}
                placeholder="1.0"
                min="0.5"
                max="3.0"
                step="0.1"
              />
              <p className="text-sm text-gray-600">
                How much insulin to take for every 50mg/dL above your target glucose
              </p>
            </div>

            {/* Target Glucose Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_glucose_min">
                  Target Glucose Minimum (mg/dL)
                </Label>
                <Input
                  id="target_glucose_min"
                  type="number"
                  value={profile.target_glucose_min}
                  onChange={(e) => handleInputChange('target_glucose_min', e.target.value)}
                  placeholder="80"
                  min="70"
                  max="100"
                  step="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_glucose_max">
                  Target Glucose Maximum (mg/dL)
                </Label>
                <Input
                  id="target_glucose_max"
                  type="number"
                  value={profile.target_glucose_max}
                  onChange={(e) => handleInputChange('target_glucose_max', e.target.value)}
                  placeholder="120"
                  min="100"
                  max="150"
                  step="5"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your target glucose range: {profile.target_glucose_min} - {profile.target_glucose_max} mg/dL
            </p>

            {/* Active Insulin Duration */}
            <div className="space-y-2">
              <Label htmlFor="active_insulin_duration">
                Active Insulin Duration (minutes)
              </Label>
              <Input
                id="active_insulin_duration"
                type="number"
                value={profile.active_insulin_duration}
                onChange={(e) => handleInputChange('active_insulin_duration', e.target.value)}
                placeholder="180"
                min="120"
                max="300"
                step="30"
              />
              <p className="text-sm text-gray-600">
                How long your insulin remains active in your body (typically 3-4 hours for rapid-acting)
              </p>
            </div>

            {/* Profile Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Profile Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Insulin Sensitivity:</span>
                  <span className="font-semibold ml-2">{profile.insulin_sensitivity_factor} mg/dL/unit</span>
                </div>
                <div>
                  <span className="text-blue-700">Carb Ratio:</span>
                  <span className="font-semibold ml-2">{profile.carb_ratio}g/unit</span>
                </div>
                <div>
                  <span className="text-blue-700">Correction Factor:</span>
                  <span className="font-semibold ml-2">{profile.correction_factor} units/50mg/dL</span>
                </div>
                <div>
                  <span className="text-blue-700">Target Range:</span>
                  <span className="font-semibold ml-2">{profile.target_glucose_min}-{profile.target_glucose_max} mg/dL</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={saveProfile} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Insulin Sensitivity Factor</h4>
              <p className="text-sm text-gray-600">
                This tells you how much your blood glucose will drop for each unit of insulin you take. 
                A lower number means you're more sensitive to insulin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Carbohydrate Ratio</h4>
              <p className="text-sm text-gray-600">
                This tells you how many grams of carbohydrates are covered by one unit of insulin. 
                A lower number means you need more insulin for the same amount of carbs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Correction Factor</h4>
              <p className="text-sm text-gray-600">
                This tells you how much insulin to take when your blood glucose is above your target range.
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> These values should be determined with your healthcare provider. 
                The AI recommendations are for guidance only and should not replace medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
