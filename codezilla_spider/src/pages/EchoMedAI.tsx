import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
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
  Video
} from "lucide-react";
import { EchoMedAIAssistant } from "@/components/echomed/EchoMedAIAssistant";
import { EchoMedDashboard } from "@/components/echomed/EchoMedDashboard";
import { EchoMedAnalysis } from "@/components/echomed/EchoMedAnalysis";
import { EchoMedSymptomChecker } from "@/components/echomed/EchoMedSymptomChecker";
import { EchoMedVRDoctor } from "@/components/echomed/EchoMedVRDoctor";

const EchoMedAI = () => {
  const [activeTab, setActiveTab] = useState("assistant");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-pink-950 dark:via-red-950 dark:to-orange-950">
      
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white border-0 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Healthcare
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                EchoMed AI
              </span>
              <span className="block text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mt-2">
                Your Personal Health Assistant
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience compassionate AI-powered healthcare guidance. Get instant medical insights, 
              symptom analysis, and personalized health recommendations with our advanced AI assistant.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: "99.2%", label: "Accuracy Rate", icon: CheckCircle },
              { number: "24/7", label: "Available", icon: Clock },
              { number: "50K+", label: "Users Helped", icon: Users },
              { number: "150+", label: "Countries", icon: Globe }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="assistant" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <ActivitySquare className="w-4 h-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="symptom-checker" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Symptom Checker
              </TabsTrigger>
              <TabsTrigger value="vr-doctor" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                VR Doctor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assistant" className="space-y-6">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Heart className="w-6 h-6 text-pink-600" />
                    Dr. Echo - Your AI Health Assistant
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Start a conversation with our AI assistant for personalized health guidance, 
                    symptom analysis, and medical insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EchoMedAIAssistant />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <EchoMedDashboard />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <EchoMedAnalysis />
            </TabsContent>

            <TabsContent value="symptom-checker" className="space-y-6">
              <EchoMedSymptomChecker />
            </TabsContent>

            <TabsContent value="vr-doctor" className="space-y-6">
              <EchoMedVRDoctor />
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Diagnosis",
                    description: "Advanced machine learning algorithms provide accurate symptom analysis and health insights.",
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: Stethoscope,
                    title: "Medical Expertise",
                    description: "Trained on vast medical databases with up-to-date healthcare information and best practices.",
                    color: "from-green-500 to-green-600"
                  },
                  {
                    icon: Shield,
                    title: "Privacy First",
                    description: "Your health conversations are encrypted and protected with enterprise-grade security.",
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: Activity,
                    title: "Real-time Monitoring",
                    description: "Track your health metrics and get personalized recommendations based on your data.",
                    color: "from-orange-500 to-orange-600"
                  },
                  {
                    icon: Users,
                    title: "Personalized Care",
                    description: "Tailored health advice based on your medical history, lifestyle, and preferences.",
                    color: "from-pink-500 to-pink-600"
                  },
                  {
                    icon: Award,
                    title: "Proven Excellence",
                    description: "Trusted by healthcare professionals and patients worldwide for reliable guidance.",
                    color: "from-indigo-500 to-indigo-600"
                  }
                ].map((feature, index) => (
                  <Card 
                    key={index}
                    className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card className="border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">About EchoMed AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      EchoMed AI represents the future of personalized healthcare, combining cutting-edge artificial intelligence 
                      with compassionate patient care. Our AI assistant, Dr. Echo, is designed to provide immediate, accurate, 
                      and empathetic health guidance while maintaining the highest standards of medical ethics and privacy.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To make healthcare more accessible, understandable, and human-centered through AI technology. 
                      We believe everyone deserves access to quality health information and guidance, regardless of 
                      their location or circumstances.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Technology & Safety</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Built with state-of-the-art machine learning models trained on comprehensive medical databases, 
                      EchoMed AI provides evidence-based health insights while maintaining strict privacy and security protocols. 
                      All interactions are encrypted and comply with healthcare data protection standards.
                    </p>

                    <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-lg mt-8">
                      <h4 className="font-semibold text-gray-800 mb-2">Important Notice</h4>
                      <p className="text-gray-700 text-sm">
                        EchoMed AI is designed to provide health information and guidance but should not replace 
                        professional medical advice. Always consult with qualified healthcare providers for diagnosis 
                        and treatment decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-600 via-red-600 to-orange-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Experience the Future of Healthcare Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust EchoMed AI for their health guidance. 
            Start your journey towards better health with our compassionate AI assistant.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            onClick={() => setActiveTab("assistant")}
          >
            <Heart className="w-5 h-5 mr-2" />
            Start Chatting with Dr. Echo
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EchoMedAI;
