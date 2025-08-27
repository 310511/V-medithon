import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, 
  Eye, 
  Heart, 
  Activity, 
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

export const EchoMedSymptomChecker = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const bodyParts = [
    { id: "head", name: "Head & Face", icon: Brain, color: "bg-blue-500" },
    { id: "eyes", name: "Eyes", icon: Eye, color: "bg-blue-500" },
    { id: "chest", name: "Chest & Heart", icon: Heart, color: "bg-red-500" },
    { id: "abdomen", name: "Abdomen", icon: Stethoscope, color: "bg-amber-500" },
    { id: "general", name: "General", icon: Activity, color: "bg-purple-500" },
  ];

  const symptomsByBodyPart: Record<string, string[]> = {
    head: ["Headache", "Migraine", "Dizziness", "Confusion", "Memory problems"],
    eyes: ["Blurred vision", "Eye pain", "Red eyes", "Dry eyes", "Vision changes"],
    chest: ["Chest pain", "Shortness of breath", "Heart palpitations", "Chest tightness"],
    abdomen: ["Abdominal pain", "Bloating", "Nausea", "Vomiting", "Loss of appetite"],
    general: ["Fever", "Fatigue", "Weight changes", "Night sweats", "General weakness"],
  };

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const resetForm = () => {
    setSelectedBodyPart(null);
    setSelectedSymptoms([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Symptom Checker</h2>
          <p className="text-gray-600">Select your symptoms for AI-powered health insights</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Body Part Selection */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-600" />
                Where are you experiencing symptoms?
              </CardTitle>
              <CardDescription>
                Select the primary area of your body where you're experiencing symptoms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodyParts.map((part) => (
                  <Card 
                    key={part.id}
                    className={`cursor-pointer transition-all border-0 shadow-md ${
                      selectedBodyPart === part.id 
                        ? 'ring-2 ring-pink-500 shadow-lg' 
                        : 'hover:shadow-lg bg-white/60 hover:bg-white/80'
                    }`}
                    onClick={() => setSelectedBodyPart(part.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${part.color} flex items-center justify-center`}>
                        <part.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{part.name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Symptom Selection */}
          {selectedBodyPart && (
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-pink-600" />
                  What symptoms are you experiencing?
                </CardTitle>
                <CardDescription>
                  Select all symptoms that apply to your {bodyParts.find(bp => bp.id === selectedBodyPart)?.name.toLowerCase()}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {symptomsByBodyPart[selectedBodyPart].map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <div 
                        key={symptom}
                        className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-pink-50 border-pink-200 border' 
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        <Checkbox 
                          id={symptom}
                          checked={isSelected}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                          className="h-5 w-5"
                        />
                        <label
                          htmlFor={symptom}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {symptom}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          {selectedBodyPart && selectedSymptoms.length > 0 && (
            <div className="text-center">
              <Button 
                onClick={handleAnalyze}
                className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                size="lg"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Symptoms with AI
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Results Display */
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Symptom Analysis Complete
            </CardTitle>
            <CardDescription>
              Based on your symptoms, here are the AI-generated insights and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Symptom Summary</h4>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {bodyParts.find(bp => bp.id === selectedBodyPart)?.name}<br/>
                <strong>Symptoms:</strong> {selectedSymptoms.join(", ")}<br/>
                <strong>Total Symptoms:</strong> {selectedSymptoms.length}
              </p>
            </div>

            {/* AI Insights */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">AI Health Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Assessment</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Based on your symptoms, this appears to be a common health concern that may benefit from lifestyle adjustments and monitoring.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Recommendations</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Consider monitoring your symptoms, maintaining a healthy lifestyle, and consulting a healthcare provider if symptoms persist or worsen.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This symptom checker is for informational purposes only and is not a substitute for professional medical advice. 
                    Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetForm}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                New Assessment
              </Button>
              <Button 
                className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Sparkles className="w-4 h-4" />
                Consult Dr. Echo AI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
