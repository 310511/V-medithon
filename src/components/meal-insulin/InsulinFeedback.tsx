import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, CheckCircle, AlertTriangle, Brain } from 'lucide-react';

interface FeedbackData {
  session_id: string;
  actual_glucose: number;
  actual_insulin_taken: number;
  notes?: string;
}

interface SessionData {
  session_id: string;
  meal_input: {
    meal_name: string;
    meal_type: string;
    meal_time: string;
  };
  glucose_prediction: {
    predicted_peak_glucose: number;
  };
  insulin_recommendation: {
    recommended_dosage: number;
  };
  timestamp: string;
}

export function InsulinFeedback() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackData>({
    session_id: '',
    actual_glucose: 0,
    actual_insulin_taken: 0,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [modelStats, setModelStats] = useState<any>(null);

  // Load sessions and stats on component mount
  useEffect(() => {
    loadSessions();
    loadModelStats();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/sessions/default-user?limit=20');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setMessage({type: 'error', text: 'Failed to load sessions'});
    } finally {
      setIsLoading(false);
    }
  };

  const loadModelStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/stats');
      if (response.ok) {
        const data = await response.json();
        setModelStats(data);
      }
    } catch (err) {
      console.error('Failed to load model stats:', err);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    setFeedback(prev => ({
      ...prev,
      session_id: sessionId
    }));
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.session_id || feedback.actual_glucose <= 0) {
      setMessage({type: 'error', text: 'Please select a session and enter actual glucose reading'});
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        setMessage({type: 'success', text: 'Feedback submitted successfully! Thank you for helping improve the model.'});
        setFeedback({
          session_id: '',
          actual_glucose: 0,
          actual_insulin_taken: 0,
          notes: ''
        });
        setSelectedSession('');
        loadModelStats(); // Refresh stats
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (err) {
      setMessage({type: 'error', text: 'Failed to submit feedback. Please try again.'});
      console.error('Feedback error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trainModel = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/meal-insulin/train-model', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({type: 'success', text: `Model training ${data.message}. Training samples: ${data.training_samples}`});
        loadModelStats(); // Refresh stats
      } else {
        throw new Error('Failed to train model');
      }
    } catch (err) {
      setMessage({type: 'error', text: 'Failed to train model. Please try again.'});
      console.error('Training error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const getSelectedSessionData = () => {
    return sessions.find(s => s.session_id === selectedSession);
  };

  const calculateAccuracy = () => {
    if (!selectedSession) return null;
    const session = getSelectedSessionData();
    if (!session) return null;

    const predictedGlucose = session.glucose_prediction.predicted_peak_glucose;
    const actualGlucose = feedback.actual_glucose;
    const error = Math.abs(predictedGlucose - actualGlucose);
    const accuracy = Math.max(0, 100 - (error / actualGlucose) * 100);
    
    return {
      error: error.toFixed(1),
      accuracy: accuracy.toFixed(1)
    };
  };

  const accuracy = calculateAccuracy();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <MessageSquare className="h-8 w-8 inline mr-2" />
          Insulin Prediction Feedback
        </h1>
        <p className="text-gray-600">
          Help improve the AI model by providing feedback on predictions
        </p>
      </div>

      {/* Model Statistics */}
      {modelStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Model Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{modelStats.total_sessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{modelStats.total_feedback}</div>
                <div className="text-sm text-gray-600">Feedback Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{modelStats.total_patients}</div>
                <div className="text-sm text-gray-600">Patients</div>
              </div>
              <div className="text-center">
                <Badge className={modelStats.model_trained ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {modelStats.model_trained ? 'Trained' : 'Rule-based'}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Model Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Session to Provide Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No sessions available for feedback</p>
                <p className="text-sm text-gray-500">Create some predictions first to provide feedback</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSession === session.session_id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSessionSelect(session.session_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{session.meal_input.meal_name}</div>
                        <div className="text-sm text-gray-600">
                          {session.meal_input.meal_type} • {formatDateTime(session.timestamp)}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold text-blue-600">
                          {session.insulin_recommendation.recommended_dosage} units
                        </div>
                        <div className="text-gray-600">
                          Predicted: {session.glucose_prediction.predicted_peak_glucose} mg/dL
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Provide Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSession ? (
              <>
                {getSelectedSessionData() && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold mb-2">Selected Session</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Meal:</strong> {getSelectedSessionData()!.meal_input.meal_name}</div>
                      <div><strong>Predicted Glucose:</strong> {getSelectedSessionData()!.glucose_prediction.predicted_peak_glucose} mg/dL</div>
                      <div><strong>Recommended Insulin:</strong> {getSelectedSessionData()!.insulin_recommendation.recommended_dosage} units</div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="actual_glucose">Actual Peak Glucose (mg/dL)</Label>
                  <Input
                    id="actual_glucose"
                    type="number"
                    value={feedback.actual_glucose}
                    onChange={(e) => setFeedback({...feedback, actual_glucose: parseFloat(e.target.value) || 0})}
                    placeholder="Enter actual glucose reading"
                    min="50"
                    max="500"
                  />
                </div>

                <div>
                  <Label htmlFor="actual_insulin_taken">Actual Insulin Taken (units)</Label>
                  <Input
                    id="actual_insulin_taken"
                    type="number"
                    value={feedback.actual_insulin_taken}
                    onChange={(e) => setFeedback({...feedback, actual_insulin_taken: parseFloat(e.target.value) || 0})}
                    placeholder="Enter actual insulin taken"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={feedback.notes || ''}
                    onChange={(e) => setFeedback({...feedback, notes: e.target.value})}
                    placeholder="Any additional notes about the prediction accuracy..."
                    rows={3}
                  />
                </div>

                {accuracy && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Prediction Accuracy</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Error:</span>
                        <span className="font-semibold ml-2">{accuracy.error} mg/dL</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Accuracy:</span>
                        <span className="font-semibold ml-2">{accuracy.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                )}

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

                <Button 
                  onClick={handleSubmitFeedback} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Select a session to provide feedback</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Model Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Retrain Model with Feedback</h4>
              <p className="text-sm text-gray-600">
                Use collected feedback to improve prediction accuracy
              </p>
            </div>
            <Button 
              onClick={trainModel} 
              disabled={isSubmitting}
              variant="outline"
            >
              {isSubmitting ? 'Training...' : 'Train Model'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
