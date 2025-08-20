import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  BarChart3, 
  Eye, 
  Stethoscope, 
  Shield, 
  Award, 
  Zap, 
  Sparkles, 
  Globe,
  AlertTriangle,
  GraduationCap,
  Video,
  Lock,
  Star
} from "lucide-react";
import { EchoMedAIAssistant } from "@/components/echomed/EchoMedAIAssistant";
import { EchoMedDashboard } from "@/components/echomed/EchoMedDashboard";
import { EchoMedAnalysis } from "@/components/echomed/EchoMedAnalysis";
import { EchoMedSymptomChecker } from "@/components/echomed/EchoMedSymptomChecker";
import { EchoMedVRDoctor } from "@/components/echomed/EchoMedVRDoctor";
import { EchoMedEmergencyChat } from "@/components/echomed/EchoMedEmergencyChat";
import { EchoMedLearningCenter } from "@/components/echomed/EchoMedLearningCenter";
import { EchoMedMentalWellness } from "@/components/echomed/EchoMedMentalWellness";
import { EchoMedHealthHub } from "@/components/echomed/EchoMedHealthHub";

const EchoMedAI = () => {
  const [activeTab, setActiveTab] = useState("assistant");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-yellow-200 dark:bg-yellow-800 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse animation-delay-3000"></div>
        <div className="absolute top-3/4 right-1/3 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-md opacity-40 animate-spin animation-delay-5000"></div>
      </div>
      
      {/* Hero Section with Enhanced Animations */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-8 animate-fade-in-up">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-6 shadow-2xl animate-pulse group-hover:scale-110 transition-transform duration-300 ease-out">
                  <Heart className="w-10 h-10 text-white animate-heartbeat" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-200">
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                AI-Powered Healthcare
              </Badge>
            </div>
            
            <h1 className={`text-5xl lg:text-7xl font-bold mb-8 leading-tight transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x hover:animate-pulse transition-all duration-300">
                EchoMed AI
              </span>
              <span className="block text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mt-4 animate-fade-in-up animation-delay-300">
                Your Personal Health Assistant
              </span>
            </h1>
            
            <p className={`text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Experience compassionate AI-powered healthcare guidance. Get instant medical insights, 
              symptom analysis, and personalized health recommendations with our advanced AI assistant.
            </p>

            <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 ease-out delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 animate-fade-in-up animation-delay-800"
                onClick={() => handleTabChange("assistant")}
              >
                <MessageCircle className="w-5 h-5 mr-2 animate-pulse" />
                Start Chatting
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 animate-fade-in-up animation-delay-900"
                onClick={() => handleTabChange("symptom-checker")}
              >
                <Eye className="w-5 h-5 mr-2" />
                Symptom Checker
              </Button>
            </div>
          </div>

          {/* Enhanced Stats with Staggered Animations */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 ease-out delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "99.2%", label: "Accuracy Rate", icon: CheckCircle, color: "from-green-500 to-emerald-500", delay: "delay-100" },
              { number: "24/7", label: "Available", icon: Clock, color: "from-blue-500 to-indigo-500", delay: "delay-200" },
              { number: "50K+", label: "Users Helped", icon: Users, color: "from-purple-500 to-violet-500", delay: "delay-300" },
              { number: "150+", label: "Countries", icon: Globe, color: "from-indigo-500 to-blue-500", delay: "delay-400" }
            ].map((stat, index) => (
              <Card 
                key={index} 
                className={`text-center border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-fade-in-up ${stat.delay} transform hover:-translate-y-2`}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}>
                    <stat.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Tab Navigation */}
          <div className={`transition-all duration-1000 ease-out delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-9 mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-2 animate-fade-in-up animation-delay-1300">
                <TabsTrigger 
                  value="assistant" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger 
                  value="mental-wellness" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <Brain className="w-5 h-5" />
                  Mental Wellness
                </TabsTrigger>
                <TabsTrigger 
                  value="health-hub" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <Video className="w-5 h-5" />
                  Health Hub
                </TabsTrigger>
                <TabsTrigger 
                  value="learning" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <GraduationCap className="w-5 h-5" />
                  Learning
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <BarChart3 className="w-5 h-5" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <Activity className="w-5 h-5" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="symptom-checker" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <Eye className="w-5 h-5" />
                  Symptom Checker
                </TabsTrigger>
                <TabsTrigger 
                  value="vr-doctor" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-1"
                >
                  <Stethoscope className="w-5 h-5" />
                  VR Doctor
                </TabsTrigger>
              </TabsList>

              {/* Tab Content with Smooth Transitions */}
              <div className="transition-all duration-500 ease-in-out">
                <TabsContent value="assistant" className="space-y-8 animate-fade-in">
                  <EchoMedAIAssistant />
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
                  <EchoMedDashboard />
                </TabsContent>

                <TabsContent value="analysis" className="space-y-8 animate-fade-in">
                  <EchoMedAnalysis />
                </TabsContent>

                <TabsContent value="symptom-checker" className="space-y-8 animate-fade-in">
                  <EchoMedSymptomChecker />
                </TabsContent>

                <TabsContent value="emergency" className="space-y-8 animate-fade-in">
                  <EchoMedEmergencyChat />
                </TabsContent>
                
                <TabsContent value="mental-wellness" className="space-y-8 animate-fade-in">
                  <EchoMedMentalWellness />
                </TabsContent>
                
                <TabsContent value="health-hub" className="space-y-8 animate-fade-in">
                  <EchoMedHealthHub />
                </TabsContent>
                
                <TabsContent value="learning" className="space-y-8 animate-fade-in">
                  <EchoMedLearningCenter />
                </TabsContent>
                
                <TabsContent value="vr-doctor" className="space-y-8 animate-fade-in">
                  <EchoMedVRDoctor />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                Advanced Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the cutting-edge capabilities that make EchoMed AI the most advanced health assistant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Diagnosis",
                description: "Advanced machine learning algorithms provide accurate symptom analysis and health insights with 99.2% accuracy.",
                color: "from-blue-500 to-blue-600",
                features: ["Symptom Analysis", "Risk Assessment", "Treatment Suggestions"]
                  },
                  {
                    icon: Stethoscope,
                    title: "Medical Expertise",
                description: "Trained on vast medical databases with up-to-date healthcare information and best practices from leading institutions.",
                color: "from-indigo-500 to-indigo-600",
                features: ["Evidence-Based", "Latest Research", "Professional Standards"]
                  },
                  {
                    icon: Shield,
                    title: "Privacy First",
                description: "Your health conversations are encrypted and protected with enterprise-grade security and HIPAA compliance.",
                color: "from-purple-500 to-purple-600",
                features: ["End-to-End Encryption", "HIPAA Compliant", "Data Protection"]
                  },
                  {
                    icon: Activity,
                    title: "Real-time Monitoring",
                description: "Track your health metrics and get personalized recommendations based on your data and trends.",
                color: "from-violet-500 to-violet-600",
                features: ["Health Tracking", "Trend Analysis", "Personalized Insights"]
                  },
                  {
                    icon: Users,
                    title: "Personalized Care",
                description: "Tailored health advice based on your medical history, lifestyle, preferences, and unique health profile.",
                color: "from-blue-500 to-indigo-500",
                features: ["Custom Profiles", "Lifestyle Integration", "Adaptive Learning"]
                  },
                  {
                    icon: Award,
                    title: "Proven Excellence",
                description: "Trusted by healthcare professionals and patients worldwide for reliable guidance and exceptional care.",
                color: "from-purple-500 to-violet-500",
                features: ["Medical Validation", "Global Trust", "Continuous Improvement"]
                  }
                ].map((feature, index) => (
                  <Card 
                    key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-purple-500 to-blue-500"></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}>
                      <feature.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.features.map((feat, featIndex) => (
                        <div key={featIndex} className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Built with cutting-edge AI, machine learning, and medical expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, title: "Deep Learning", description: "Advanced neural networks trained on millions of medical cases" },
              { icon: Lock, title: "Secure & Private", description: "Enterprise-grade encryption and HIPAA compliance" },
              { icon: Zap, title: "Real-time Processing", description: "Instant responses with cloud-powered computing" },
              { icon: Star, title: "Medical Validation", description: "Reviewed and validated by healthcare professionals" }
            ].map((tech, index) => (
              <div key={index} className="text-center text-white group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tech.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                <p className="text-white/80 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Experience the Future of Healthcare
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of users who trust EchoMed AI for their health guidance. 
            Start your journey towards better health with our compassionate AI assistant.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
          <Button 
            size="lg" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            onClick={() => handleTabChange("assistant")}
          >
              <Heart className="w-6 h-6 mr-3" />
            Start Chatting with Dr. Echo
          </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => handleTabChange("symptom-checker")}
            >
              <Eye className="w-6 h-6 mr-3" />
              Check Symptoms
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EchoMedAI;
