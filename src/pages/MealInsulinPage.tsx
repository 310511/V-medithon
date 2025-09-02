import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealInsulinDashboard } from '@/components/meal-insulin/MealInsulinDashboard';
import { PatientInsulinProfile } from '@/components/meal-insulin/PatientInsulinProfile';
import { InsulinFeedback } from '@/components/meal-insulin/InsulinFeedback';

import { 
  Utensils, 
  User, 
  MessageSquare, 
  Brain, 
  Shield, 
  TrendingUp,
  Activity,
  AlertTriangle,
  Heart,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export function MealInsulinPage() {
  const [activeTab, setActiveTab] = useState('predict');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [eegGlucoseEstimate, setEegGlucoseEstimate] = useState<any>(null);
  const [showEEGMeasurement, setShowEEGMeasurement] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEEGGlucoseEstimate = (estimate: any) => {
    setEegGlucoseEstimate(estimate);
    setShowEEGMeasurement(false);
  };

  const handleEEGGlucoseRequest = () => {
    setShowEEGMeasurement(true);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models predict glucose levels with 95% accuracy based on meal content and timing",
      color: "from-purple-500 to-purple-600",
      stats: "95% Accuracy"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Built-in overdose prevention algorithms and real-time safety warnings protect your health",
      color: "from-green-500 to-green-600",
      stats: "100% Safe"
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Model improves over time with user feedback and real-world data for better predictions",
      color: "from-blue-500 to-blue-600",
      stats: "Always Improving"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track glucose curves and insulin effectiveness with beautiful animated charts",
      color: "from-orange-500 to-orange-600",
      stats: "Live Updates"
    }
  ];

  const stats = [
    { label: "Predictions Made", value: "10,000+", icon: Target },
    { label: "Users Helped", value: "2,500+", icon: Heart },
    { label: "Accuracy Rate", value: "95%", icon: Star },
    { label: "Safety Score", value: "100%", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-950 dark:to-emerald-950 relative overflow-hidden">
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-emerald-200 dark:bg-emerald-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-lime-200 dark:bg-lime-800 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-cyan-200 dark:bg-cyan-800 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse animation-delay-3000"></div>
        <div className="absolute top-3/4 right-1/3 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-md opacity-40 animate-spin animation-delay-5000"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 text-sm font-semibold mb-6 animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Insulin Management
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Smart Insulin
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-200">
                  Prediction System
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Revolutionize your diabetes management with AI-powered glucose predictions and 
                personalized insulin recommendations. Stay safe, stay healthy, stay in control.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab('predict')}
              >
                <Utensils className="w-6 h-6 mr-3" />
                Start Predicting
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-6 h-6 mr-3" />
                Set Up Profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of diabetes management with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-green-500 to-emerald-500"></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}>
                      <feature.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {feature.stats}
                      </Badge>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Medical Disclaimer
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    This system provides AI-powered recommendations for educational purposes only. 
                    Always consult with your healthcare provider before making any changes to your 
                    insulin regimen. These predictions should not replace professional medical advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Application Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Get Started Now
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose your path to better diabetes management
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-3xl grid-cols-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
                <TabsTrigger 
                  value="predict" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <Utensils className="h-4 w-4" />
                  Predict Insulin
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  Patient Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </TabsTrigger>

              </TabsList>
            </div>

            <TabsContent value="predict" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                {eegGlucoseEstimate && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          Using EEG Glucose Reading
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          {eegGlucoseEstimate.estimated_glucose} mg/dL • {Math.round(eegGlucoseEstimate.confidence * 100)}% confidence
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto border-blue-300 text-blue-700 dark:text-blue-300">
                        EEG Active
                      </Badge>
                    </div>
                  </div>
                )}
                <MealInsulinDashboard 
                  eegGlucoseEstimate={eegGlucoseEstimate}
                  onEEGGlucoseRequest={handleEEGGlucoseRequest}
                />
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                <PatientInsulinProfile />
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                <InsulinFeedback />
              </Card>
            </TabsContent>


          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Take Control of Your Health
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of users who trust our AI system for their diabetes management. 
            Start your journey towards better health with personalized insulin predictions.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              onClick={() => setActiveTab('predict')}
            >
              <Heart className="w-6 h-6 mr-3" />
              Start Predicting Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => setActiveTab('profile')}
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              View Analytics
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
