import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { InventoryTable } from "@/components/dashboard/InventoryTable";
import { BlockchainActivity } from "@/components/dashboard/BlockchainActivity";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { InventoryAnalytics } from "@/components/dashboard/InventoryAnalytics";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  Star,
  Users,
  Package,
  Globe,
  Lock,
  Sparkles,
  Rocket,
  Target,
  Award,
  Clock,
  DollarSign,
  Heart,
  ShoppingCart,
  Eye,
  Brain,
  Disc3,
  Plane,
  Dna,
  Utensils,
  Stethoscope,
  Dumbbell
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    toast.success("Welcome to DoseWise HealthHub! Redirecting to dashboard...");
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleListInventory = () => {
    console.log("List button clicked!");
    toast.success("List button clicked! Opening inventory list...");
    setTimeout(() => {
      navigate('/inventory');
    }, 500);
  };

  const handleViewAnalytics = () => {
    console.log("View button clicked!");
    toast.success("View button clicked! Loading analytics dashboard...");
    setTimeout(() => {
      navigate('/ml-predictions');
    }, 500);
  };

  const handleStartTrial = () => {
    toast.success("Starting your free trial! Redirecting to sign up...");
    setTimeout(() => {
      navigate('/signup');
    }, 1000);
  };

  const handleRFIDScanner = () => {
    toast.info("Opening RFID Scanner...");
    setTimeout(() => {
      navigate('/rfid');
    }, 500);
  };

  const handleAIAssistant = () => {
    toast.info("Launching AI Assistant...");
    setTimeout(() => {
      navigate('/echomed-ai');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Floating Particles */}
          <div className="particle absolute top-1/4 left-1/4"></div>
          <div className="particle absolute top-1/3 right-1/3"></div>
          <div className="particle absolute bottom-1/4 left-1/3"></div>
          <div className="particle absolute bottom-1/3 right-1/4"></div>
          <div className="particle absolute top-1/2 left-1/2"></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
              backgroundSize: '50px 50px',
              transform: `translateY(${scrollY * 0.5}px)`
            }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium animate-pulse hover-scale">
                  <Sparkles className="w-4 h-4 mr-2 animate-bounce-gentle" />
                  AI-Powered Health & Wellness Platform
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold">
                  <span className="gradient-text-animate">
                    DoseWise
                  </span>
                  <span className="block text-4xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mt-2 animate-slide-in-up">
                    HealthHub
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Your comprehensive health and wellness ecosystem. From blockchain-secured medical inventory to AI-powered mental health tracking, 
                  fitness analytics, and personalized wellness recommendations - all in one unified platform.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group hover-lift hover-glow"
                >
                  <span className="animate-wave">Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform animate-bounce-gentle" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200 hover-lift interactive-card glass">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI-Powered Health</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-200 hover-lift interactive-card glass">
                  <Heart className="w-4 h-4 animate-bounce-gentle" />
                  <span className="text-sm font-medium">Mental Wellness</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-purple-100 text-purple-700 rounded-full border border-purple-200 hover-lift interactive-card glass">
                  <Activity className="w-4 h-4 animate-bounce-gentle" />
                  <span className="text-sm font-medium">Fitness Tracking</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200 hover-lift interactive-card glass">
                  <Shield className="w-4 h-4 animate-bounce-gentle" />
                  <span className="text-sm font-medium">Blockchain Secure</span>
                </div>
              </div>


            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
              <div className="relative">
                {/* Animated Pulse Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                
                {/* Main Pulse Container */}
                <div className="relative w-96 h-96 mx-auto">
                  {/* Purple Blue Pulse Rings */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 opacity-20 animate-pulse-ring"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-30 animate-pulse-ring" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute inset-8 rounded-full bg-gradient-to-r from-purple-300 to-blue-400 opacity-40 animate-pulse-ring" style={{ animationDelay: '0.6s' }}></div>
                  
                  {/* Core Heart with Pulse Animation */}
                  <div className="absolute inset-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-700 flex items-center justify-center shadow-2xl animate-pulse-core">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm animate-pulse-glow">
                        <Heart className="w-8 h-8 text-white fill-current" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">DoseWise</h3>
                      <p className="text-sm opacity-90">Wellness Connected</p>
                    </div>
                  </div>
                  
                  {/* Purple Blue Floating Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-8 right-8 w-6 h-6 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '0.4s' }}></div>
                  <div className="absolute bottom-8 left-8 w-6 h-6 bg-purple-300 rounded-full animate-float" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '0.8s' }}></div>
                  
                  {/* Purple Blue Data Flow Points */}
                  <div className="absolute top-1/2 left-0 w-3 h-3 bg-purple-400 rounded-full animate-data-flow"></div>
                  <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-400 rounded-full animate-data-flow" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute left-1/2 top-0 w-3 h-3 bg-purple-300 rounded-full animate-data-flow" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute left-1/2 bottom-0 w-3 h-3 bg-blue-300 rounded-full animate-data-flow" style={{ animationDelay: '0.9s' }}></div>
                  
                  {/* Purple Blue Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                    <line x1="50%" y1="50%" x2="0" y2="50%" stroke="url(#purpleGradient)" strokeWidth="2" opacity="0.3" className="animate-pulse" />
                    <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="url(#blueGradient)" strokeWidth="2" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <line x1="50%" y1="50%" x2="50%" y2="0" stroke="url(#purpleLightGradient)" strokeWidth="2" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                    <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="url(#blueLightGradient)" strokeWidth="2" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
                    
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="purpleLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0" />
                        <stop offset="100%" stopColor="#C4B5FD" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="blueLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#93C5FD" stopOpacity="0" />
                        <stop offset="100%" stopColor="#93C5FD" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                {/* Stats Cards Around Pulse */}
                <div className="absolute -top-8 -left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">1,247</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Items Tracked</p>
                </div>
                
                <div className="absolute -bottom-8 -right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">100%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Blockchain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

             {/* Features Section */}
       <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-float animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text-animate mb-6 animate-fade-in-scale">
              Our Feature Tiers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up">
              Strategically organized features to solve critical healthcare challenges with AI-powered innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Animated Stats Section */}
            <div className="col-span-full mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 glass hover-lift interactive-card">
                  <div className="text-3xl font-bold text-blue-600 mb-2 animate-bounce-gentle">1,247</div>
                  <div className="text-sm text-gray-600">Items Tracked</div>
                </div>
                <div className="text-center p-6 glass hover-lift interactive-card">
                  <div className="text-3xl font-bold text-purple-600 mb-2 animate-bounce-gentle">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center p-6 glass hover-lift interactive-card">
                  <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce-gentle">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
                <div className="text-center p-6 glass hover-lift interactive-card">
                  <div className="text-3xl font-bold text-pink-600 mb-2 animate-bounce-gentle">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
              </div>
            </div>

            {/* Tier 1 - Core Features */}
            <div className="col-span-full mb-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-3">
                  <span className="text-4xl">🎯</span>
                  TIER 1 - Core Features
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">Our primary focus for solving critical healthcare challenges</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">Meal Insulin Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4">AI-powered glucose prediction and insulin dosage calculation to prevent overdose/underdose</p>
                    <Button 
                      onClick={() => navigate('/meal-insulin')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      Try Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">Phone Bluetooth Glucose</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4">Innovative mobile glucose monitoring using phone torch and Bluetooth connectivity</p>
                    <Button 
                      onClick={() => navigate('/eeg-glucose')}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                    >
                      Connect Phone
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">Mobile-First Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4">Responsive design with touch interactions and performance optimization for all devices</p>
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
                    >
                      Explore Platform
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tier 2 - Supporting Features */}
            <div className="col-span-full mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-3">
                  <span className="text-3xl">💡</span>
                  TIER 2 - Supporting Features
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">Advanced capabilities that enhance our core solution</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">AI Disease Diagnosis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">ML-powered disease detection and healthcare innovation</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">Blockchain Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">Secure medical records with modern cybersecurity approach</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">Predictive Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">ML predictions for readmission risk and cost optimization</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">EchoMed AI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">Comprehensive health AI with voice integration</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Tier 3 - Additional Features */}
            <div className="col-span-full">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-3">
                  <span className="text-2xl">📝</span>
                  TIER 3 - Additional Features
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300">Comprehensive platform capabilities for complete healthcare solutions</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: Dna,
                    title: "GeneTrust AI Studio",
                    description: "Advanced gene editing with AI prediction and blockchain verification",
                    color: "from-emerald-500 to-teal-600"
                  },
                  {
                    icon: Dumbbell,
                    title: "Fitness Dashboard",
                    description: "Comprehensive fitness tracking and AI-powered workout recommendations",
                    color: "from-teal-500 to-cyan-600"
                  },
                  {
                    icon: Plane,
                    title: "Drone Delivery",
                    description: "AI-powered medical supply delivery with real-time tracking",
                    color: "from-indigo-500 to-blue-600"
                  },
                  {
                    icon: Package,
                    title: "Marketplace",
                    description: "Healthcare marketplace for medical supplies and equipment",
                    color: "from-yellow-500 to-orange-600"
                  },
                  {
                    icon: Activity,
                    title: "Inventory Management",
                    description: "Smart inventory tracking and automated restocking systems",
                    color: "from-orange-500 to-red-600"
                  },
                  {
                    icon: Brain,
                    title: "Zenith Wellness",
                    description: "Mental wellness tracking and personalized health recommendations",
                    color: "from-violet-500 to-purple-600"
                  }
                ].map((feature, index) => (
                  <Card 
                    key={index}
                    className={`group hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm ${
                      isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,247", label: "Items Tracked", icon: Package },
              { number: "99.9%", label: "Uptime", icon: CheckCircle },
              { number: "24/7", label: "Support", icon: Clock },
              { number: "50+", label: "Healthcare Partners", icon: Users }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-white ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-white/80" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Stats Overview */}
          <section className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Dashboard Overview</h2>
            <StatsGrid />
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Inventory & Alerts */}
            <div className="lg:col-span-2 space-y-8">
              <InventoryTable />
            </div>
            
            {/* Right Column - Activity & Alerts */}
            <div className="space-y-8">
              <AlertsPanel />
              <BlockchainActivity />
            </div>
          </div>

          {/* Inventory Analytics Dashboard */}
          <section className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <InventoryAnalytics />
          </section>
        </div>
      </main>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white/30 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-white/25 rounded-full animate-float animation-delay-4000"></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.3) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              transform: `translateY(${scrollY * 0.3}px)`
            }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-scale gradient-text-animate">
              Ready to Transform Your Healthcare Inventory?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-in-up">
              Join leading healthcare facilities worldwide in adopting blockchain-powered inventory management. 
              Experience the future of secure, transparent, and automated healthcare supply chain management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartTrial}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover-lift hover-glow group"
              >
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce-gentle" />
                <span className="animate-wave">Start Free Trial</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text-animate mb-6 animate-fade-in-scale">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up">
              See what healthcare professionals are saying about MedChain
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                hospital: "City General Hospital",
                content: "MedChain has revolutionized our inventory management. The blockchain transparency gives us complete confidence in our supply chain.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Hospital Administrator",
                hospital: "Regional Medical Center",
                content: "The automated alerts and real-time tracking have significantly reduced our stockouts and improved patient care.",
                rating: 5
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Director of Operations",
                hospital: "University Health System",
                content: "The AI-powered analytics help us predict demand accurately and optimize our inventory levels like never before.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card 
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover-lift interactive-card glass ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
                }`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">{testimonial.hospital}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;