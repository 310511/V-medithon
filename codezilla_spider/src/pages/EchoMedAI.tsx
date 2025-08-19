import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Brain, 
  Stethoscope, 
  Activity, 
  Shield,
  Sparkles,
  Users,
  Globe,
  Award,
  Clock,
  CheckCircle,
  BarChart3,
  ActivitySquare,
  Eye,
  Video,
  Zap,
  Star,
  TrendingUp,
  Pulse,
  Microscope,
  Pill,
  Thermometer,
  Wifi,
  Lock
} from "lucide-react";
import { EchoMedAIAssistant } from "@/components/echomed/EchoMedAIAssistant";
import { EchoMedDashboard } from "@/components/echomed/EchoMedDashboard";
import { EchoMedAnalysis } from "@/components/echomed/EchoMedAnalysis";
import { EchoMedSymptomChecker } from "@/components/echomed/EchoMedSymptomChecker";
import { EchoMedVRDoctor } from "@/components/echomed/EchoMedVRDoctor";

const EchoMedAI = () => {
  const [activeTab, setActiveTab] = useState("assistant");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-6 shadow-2xl animate-pulse">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 px-6 py-3 text-base font-semibold shadow-lg">
                <Zap className="w-5 h-5 mr-2" />
                AI-Powered Healthcare
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                EchoMed AI
              </span>
              <span className="block text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mt-4">
                Your Personal Health Assistant
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Experience compassionate AI-powered healthcare guidance. Get instant medical insights, 
              symptom analysis, and personalized health recommendations with our advanced AI assistant.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab("assistant")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab("symptom-checker")}
              >
                <Eye className="w-5 h-5 mr-2" />
                Symptom Checker
              </Button>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "99.2%", label: "Accuracy Rate", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
              { number: "24/7", label: "Available", icon: Clock, color: "from-blue-500 to-indigo-500" },
              { number: "50K+", label: "Users Helped", icon: Users, color: "from-purple-500 to-violet-500" },
              { number: "150+", label: "Countries", icon: Globe, color: "from-indigo-500 to-blue-500" }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 relative">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-2">
              <TabsTrigger value="assistant" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
                <MessageCircle className="w-5 h-5" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
                <ActivitySquare className="w-5 h-5" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="symptom-checker" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
                <Eye className="w-5 h-5" />
                Symptom Checker
              </TabsTrigger>
              <TabsTrigger value="vr-doctor" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
                <Video className="w-5 h-5" />
                VR Doctor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assistant" className="space-y-8">
              <Card className="border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </div>
                    Dr. Echo - Your AI Health Assistant
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    Start a conversation with our AI assistant for personalized health guidance, 
                    symptom analysis, and medical insights.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <EchoMedAIAssistant />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-8">
              <EchoMedDashboard />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <EchoMedAnalysis />
            </TabsContent>

            <TabsContent value="symptom-checker" className="space-y-8">
              <EchoMedSymptomChecker />
            </TabsContent>

            <TabsContent value="vr-doctor" className="space-y-8">
              <EchoMedVRDoctor />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                      </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                        {item}
                    </div>
                    ))}
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
              { icon: Wifi, title: "Real-time Processing", description: "Instant responses with cloud-powered computing" },
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
            onClick={() => setActiveTab("assistant")}
          >
              <Heart className="w-6 h-6 mr-3" />
            Start Chatting with Dr. Echo
          </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => setActiveTab("symptom-checker")}
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
