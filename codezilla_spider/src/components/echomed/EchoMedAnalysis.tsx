import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square,
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart,
  FileAudio,
  Download,
  Share2
} from "lucide-react";

export const EchoMedAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Stop recording after 30 seconds (demo)
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(timer);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setAnalysisComplete(true);
      }, 3000);
    }, 30000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const analysisResults = {
    heartRate: 72,
    respiratoryRate: 16,
    stressLevel: "Low",
    sleepQuality: "Good",
    voiceClarity: "Clear",
    emotionalState: "Calm",
    recommendations: [
      "Your heart rate is within normal range",
      "Consider stress management techniques",
      "Maintain regular sleep schedule",
      "Stay hydrated throughout the day"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Voice Health Analysis</h2>
          <p className="text-gray-600">AI-powered analysis of your voice patterns and health indicators</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Analysis
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Interface */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-pink-600" />
              Voice Recording
            </CardTitle>
            <CardDescription>
              Record your voice for AI health analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Status */}
            <div className="text-center">
              {isRecording ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-red-600">Recording...</p>
                    <p className="text-2xl font-mono text-gray-800">{formatTime(recordingTime)}</p>
                  </div>
                  <Button 
                    onClick={handleStopRecording}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop Recording
                  </Button>
                </div>
              ) : isProcessing ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-blue-600">Processing...</p>
                    <p className="text-sm text-gray-600">AI is analyzing your voice patterns</p>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              ) : analysisComplete ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">Analysis Complete</p>
                    <p className="text-sm text-gray-600">Your results are ready</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setAnalysisComplete(false);
                      setRecordingTime(0);
                    }}
                    className="gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    New Recording
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <Mic className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-600">Ready to Record</p>
                    <p className="text-sm text-gray-500">Click to start voice analysis</p>
                  </div>
                  <Button 
                    onClick={handleStartRecording}
                    className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                  >
                    <Mic className="w-4 h-4" />
                    Start Recording
                  </Button>
                </div>
              )}
            </div>

            {/* Recording Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Recording Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Speak clearly and naturally</li>
                  <li>• Record in a quiet environment</li>
                  <li>• Speak for at least 30 seconds</li>
                  <li>• Include normal conversation topics</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* AI Processing Visualizer */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-600" />
              AI Processing
            </CardTitle>
            <CardDescription>
              Real-time analysis of voice patterns and health indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Processing Steps */}
            <div className="space-y-4">
              {[
                { step: "Voice Capture", status: isRecording ? "active" : "pending", icon: Mic },
                { step: "Pattern Analysis", status: isProcessing ? "active" : isRecording ? "pending" : "complete", icon: BarChart },
                { step: "Health Assessment", status: isProcessing ? "active" : isRecording ? "pending" : "complete", icon: Activity },
                { step: "Results Generation", status: analysisComplete ? "complete" : "pending", icon: BarChart3 }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === "active" 
                      ? "bg-blue-500 animate-pulse" 
                      : item.status === "complete"
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}>
                    <item.icon className={`w-4 h-4 ${
                      item.status === "active" || item.status === "complete" 
                        ? "text-white" 
                        : "text-gray-500"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      item.status === "active" 
                        ? "text-blue-600" 
                        : item.status === "complete"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}>
                      {item.step}
                    </p>
                  </div>
                  {item.status === "active" && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Analysis Metrics */}
            {analysisComplete && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Analysis Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{analysisResults.heartRate}</p>
                    <p className="text-xs text-gray-600">Heart Rate (BPM)</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{analysisResults.respiratoryRate}</p>
                    <p className="text-xs text-gray-600">Respiratory Rate</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      {analysisComplete && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-600" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              Comprehensive health insights from your voice analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Stress Level", value: analysisResults.stressLevel, icon: Activity, color: "text-green-600" },
                { label: "Sleep Quality", value: analysisResults.sleepQuality, icon: Clock, color: "text-blue-600" },
                { label: "Voice Clarity", value: analysisResults.voiceClarity, icon: Mic, color: "text-purple-600" },
                { label: "Emotional State", value: analysisResults.emotionalState, icon: TrendingUp, color: "text-pink-600" }
              ].map((metric, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-3">AI Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Results
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
                <Brain className="w-4 h-4" />
                AI Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-0 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">Privacy & Security</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your voice recordings are processed securely and are not stored permanently. 
                All analysis is performed using advanced AI algorithms while maintaining your privacy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
