import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Utensils, Syringe, AlertTriangle, CheckCircle, TrendingUp, Activity, Brain, Zap } from 'lucide-react';
import { MealSuggestions } from './MealSuggestions';

interface MealInput {
  meal_name: string;
  meal_type: string;
  meal_time: string;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemic_index?: number;
  serving_size: string;
}

interface GlucosePrediction {
  current_glucose: number;
  predicted_peak_glucose: number;
  predicted_peak_time: string;
  glucose_curve: Array<{time: string; glucose: number}>;
  confidence_score: number;
}

interface InsulinRecommendation {
  recommended_dosage: number;
  carb_insulin: number;
  correction_insulin: number;
  insulin_type: string;
  injection_time: string;
  expected_glucose_after: number;
  safety_status: string;
  warnings: string[];
  confidence_score: number;
}

interface MealInsulinPrediction {
  meal_input: MealInput;
  glucose_prediction: GlucosePrediction;
  insulin_recommendation: InsulinRecommendation;
  session_id: string;
  timestamp: string;
}

interface EEGGlucoseEstimate {
  estimated_glucose: number;
  confidence: number;
  method: string;
  timestamp: string;
  features_used: number;
  session_id: string;
}

interface MealInsulinDashboardProps {
  eegGlucoseEstimate?: EEGGlucoseEstimate | null;
  onEEGGlucoseRequest?: () => void;
}

export function MealInsulinDashboard({ eegGlucoseEstimate, onEEGGlucoseRequest }: MealInsulinDashboardProps = {}) {
  const [mealInput, setMealInput] = useState<MealInput>({
    meal_name: '',
    meal_type: 'breakfast',
    meal_time: new Date().toISOString().slice(0, 16),
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    glycemic_index: 50,
    serving_size: '1 serving'
  });

  const [currentGlucose, setCurrentGlucose] = useState<number>(100);
  const [prediction, setPrediction] = useState<MealInsulinPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSessions, setRecentSessions] = useState<MealInsulinPrediction[]>([]);
  const [usingEEGGlucose, setUsingEEGGlucose] = useState<boolean>(false);

  // Load recent sessions on component mount
  useEffect(() => {
    loadRecentSessions();
  }, []);

  // Handle EEG glucose estimate updates
  useEffect(() => {
    if (eegGlucoseEstimate) {
      setCurrentGlucose(eegGlucoseEstimate.estimated_glucose);
      setUsingEEGGlucose(true);
    }
  }, [eegGlucoseEstimate]);

  const loadRecentSessions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/sessions/default-user?limit=5');
      if (response.ok) {
        const sessions = await response.json();
        setRecentSessions(sessions);
      }
    } catch (err) {
      console.error('Failed to load recent sessions:', err);
    }
  };

  const handlePredict = async () => {
    if (!mealInput.meal_name || mealInput.carbohydrates <= 0) {
      setError('Please enter meal name and carbohydrates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal_input: {
            ...mealInput,
            meal_time: new Date(mealInput.meal_time).toISOString()
          },
          patient_id: 'default-user',
          current_glucose: currentGlucose
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result);
      
      // Reload recent sessions
      loadRecentSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSafetyColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSafetyIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'danger': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const handleMealSelection = (selectedMeal: any) => {
    setMealInput({
      meal_name: selectedMeal.name,
      meal_type: selectedMeal.category,
      meal_time: mealInput.meal_time, // Keep current time
      carbohydrates: selectedMeal.carbohydrates,
      protein: selectedMeal.protein,
      fat: selectedMeal.fat,
      fiber: selectedMeal.fiber,
      glycemic_index: selectedMeal.glycemic_index,
      serving_size: selectedMeal.serving_size
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🍽️ Meal-Based Insulin Prediction
        </h1>
        <p className="text-gray-600">
          Enter your meal details to get AI-powered insulin dosage recommendations
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Meal Suggestions */}
        <div>
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="h-4 w-4" />
                Quick Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <MealSuggestions
                onSelectMeal={handleMealSelection}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Meal Input Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Meal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meal_name">Meal Name</Label>
              <Input
                id="meal_name"
                value={mealInput.meal_name}
                onChange={(e) => setMealInput({...mealInput, meal_name: e.target.value})}
                placeholder="e.g., Grilled Chicken with Rice"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meal_type">Meal Type</Label>
                <Select value={mealInput.meal_type} onValueChange={(value) => setMealInput({...mealInput, meal_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="meal_time">Meal Time</Label>
                <Input
                  id="meal_time"
                  type="datetime-local"
                  value={mealInput.meal_time}
                  onChange={(e) => setMealInput({...mealInput, meal_time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
                <Input
                  id="carbohydrates"
                  type="number"
                  value={mealInput.carbohydrates}
                  onChange={(e) => setMealInput({...mealInput, carbohydrates: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="current_glucose">Current Glucose (mg/dL)</Label>
                  {onEEGGlucoseRequest && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onEEGGlucoseRequest}
                      className="flex items-center gap-1"
                    >
                      <Brain className="h-3 w-3" />
                      EEG Measure
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    id="current_glucose"
                    type="number"
                    value={currentGlucose}
                    onChange={(e) => {
                      setCurrentGlucose(parseFloat(e.target.value) || 0);
                      setUsingEEGGlucose(false);
                    }}
                    placeholder="100"
                    className={usingEEGGlucose ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
                  />
                  {usingEEGGlucose && eegGlucoseEstimate && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <Zap className="h-3 w-3" />
                      <span>EEG: {eegGlucoseEstimate.estimated_glucose} mg/dL</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(eegGlucoseEstimate.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={mealInput.protein}
                  onChange={(e) => setMealInput({...mealInput, protein: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={mealInput.fat}
                  onChange={(e) => setMealInput({...mealInput, fat: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  value={mealInput.fiber}
                  onChange={(e) => setMealInput({...mealInput, fiber: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="glycemic_index">Glycemic Index (Optional)</Label>
              <Input
                id="glycemic_index"
                type="number"
                value={mealInput.glycemic_index || ''}
                onChange={(e) => setMealInput({...mealInput, glycemic_index: parseFloat(e.target.value) || undefined})}
                placeholder="50"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handlePredict} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Predicting...' : 'Get Insulin Recommendation'}
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Prediction Results - Full Width */}
      {prediction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Insulin Recommendation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">Recommended Insulin</h3>
                  <Badge className={getSafetyColor(prediction.insulin_recommendation.safety_status)}>
                    {getSafetyIcon(prediction.insulin_recommendation.safety_status)}
                    {prediction.insulin_recommendation.safety_status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {prediction.insulin_recommendation.recommended_dosage} units
                </div>
                <div className="text-sm text-blue-700">
                  {prediction.insulin_recommendation.insulin_type}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Carb insulin: {prediction.insulin_recommendation.carb_insulin} units | 
                  Correction: {prediction.insulin_recommendation.correction_insulin} units
                </div>
              </div>

              {/* Injection Timing */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Inject 15 minutes before meal at:</span>
                <span className="font-semibold">
                  {formatTime(prediction.insulin_recommendation.injection_time)}
                </span>
              </div>

              {/* Glucose Prediction */}
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Glucose Prediction</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700 dark:text-green-300">Current:</span>
                    <span className="font-semibold ml-2 text-blue-600 dark:text-blue-400">{prediction.glucose_prediction.current_glucose} mg/dL</span>
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-300">Peak:</span>
                    <span className="font-semibold ml-2 text-orange-600 dark:text-orange-400">{prediction.glucose_prediction.predicted_peak_glucose} mg/dL</span>
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-300">After Insulin:</span>
                    <span className="font-semibold ml-2 text-purple-600 dark:text-purple-400">{prediction.insulin_recommendation.expected_glucose_after} mg/dL</span>
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-300">Confidence:</span>
                    <span className="font-semibold ml-2 text-emerald-600 dark:text-emerald-400">{Math.round(prediction.glucose_prediction.confidence_score * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {prediction.insulin_recommendation.warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {prediction.insulin_recommendation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Glucose Curve Chart */}
              <div className="h-80">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Predicted Glucose Curve
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prediction.glucose_prediction.glucose_curve}>
                    <defs>
                      <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => formatTime(time)}
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={{ stroke: '#6b7280' }}
                    />
                    <YAxis 
                      domain={[80, 250]}
                      tickFormatter={(value) => `${value}`}
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={{ stroke: '#6b7280' }}
                      axisLine={{ stroke: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                      labelFormatter={(time) => `Time: ${formatDateTime(time)}`}
                      formatter={(value) => [`${value} mg/dL`, 'Glucose']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="glucose" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ 
                        fill: '#10b981', 
                        strokeWidth: 2, 
                        r: 5,
                        stroke: '#ffffff',
                        filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: '#10b981', 
                        strokeWidth: 2,
                        fill: '#ffffff',
                        filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4))'
                      }}
                      animationDuration={2000}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Chart Legend */}
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Predicted Glucose Level</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Peak: {prediction.glucose_prediction.predicted_peak_glucose} mg/dL at {formatTime(prediction.glucose_prediction.predicted_peak_time)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.session_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <div className="font-semibold">{session.meal_input.meal_name}</div>
                      <div className="text-gray-600">
                        {session.meal_input.meal_type} • {formatDateTime(session.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{session.insulin_recommendation.recommended_dosage} units</div>
                      <div className="text-gray-600">Insulin</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{session.glucose_prediction.predicted_peak_glucose} mg/dL</div>
                      <div className="text-gray-600">Peak Glucose</div>
                    </div>
                    <Badge className={getSafetyColor(session.insulin_recommendation.safety_status)}>
                      {session.insulin_recommendation.safety_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
