import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Target,
  Users,
  BarChart3,
  Brain,
  Sparkles,
  Thermometer,
  Droplets,
  Zap
} from "lucide-react";

export const EchoMedDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState(120);
  const [temperature, setTemperature] = useState(36.8);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [stressLevel, setStressLevel] = useState(65);
  const [sleepQuality, setSleepQuality] = useState(82);
  const [hydrationLevel, setHydrationLevel] = useState(78);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Update health data every 2 seconds
  useEffect(() => {
    const dataInterval = setInterval(() => {
      // Generate new heart rate data (60-100 bpm range)
      setHeartRate(prev => {
        const change = (Math.random() - 0.5) * 6;
        return Math.max(60, Math.min(100, prev + change));
      });

      // Generate new blood pressure data (110-130 mmHg range)
      setBloodPressure(prev => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(110, Math.min(130, prev + change));
      });

      // Generate new temperature data (36.5-37.2°C range)
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        return Math.max(36.5, Math.min(37.2, prev + change));
      });

      // Generate new oxygen data (96-100% range)
      setOxygenLevel(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(96, Math.min(100, prev + change));
      });

      // Update other metrics
      setStressLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)));
      setSleepQuality(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 8)));
      setHydrationLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 12)));
    }, 2000);

    return () => clearInterval(dataInterval);
  }, []);

  const healthMetrics = [
    {
      title: "Heart Rate",
      value: Math.round(heartRate),
      unit: "bpm",
      status: heartRate > 90 ? "elevated" : heartRate < 60 ? "low" : "normal",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      progress: heartRate
    },
    {
      title: "Blood Pressure",
      value: Math.round(bloodPressure),
      unit: "mmHg",
      status: bloodPressure > 125 ? "elevated" : "normal",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      progress: bloodPressure
    },
    {
      title: "Temperature",
      value: temperature.toFixed(1),
      unit: "°C",
      status: temperature > 37.0 ? "elevated" : "normal",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      progress: temperature * 10
    },
    {
      title: "Oxygen Saturation",
      value: Math.round(oxygenLevel),
      unit: "%",
      status: oxygenLevel < 97 ? "low" : "normal",
      icon: Droplets,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      progress: oxygenLevel
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-50";
      case "elevated":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Health Dashboard</h2>
          <p className="text-gray-600">Real-time health monitoring and AI insights</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Real-time Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => (
          <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800 animate-pulse">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{metric.progress.toFixed(1)}%</span>
                </div>
                
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Animated Gauges Section */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Real-time Health Gauges
          </CardTitle>
          <CardDescription>
            Live monitoring of key health indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-block">
                <svg width="80" height="80" className="transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${stressLevel}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 animate-pulse">{Math.round(stressLevel)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Stress Level</p>
              <p className="text-xs text-gray-500">{Math.round(stressLevel)}%</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <svg width="80" height="80" className="transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${sleepQuality}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 animate-pulse">{Math.round(sleepQuality)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Sleep Quality</p>
              <p className="text-xs text-gray-500">{Math.round(sleepQuality)}%</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <svg width="80" height="80" className="transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${hydrationLevel}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700 animate-pulse">{Math.round(hydrationLevel)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Hydration</p>
              <p className="text-xs text-gray-500">{Math.round(hydrationLevel)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-600" />
            AI Health Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your real-time health data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 mt-0.5 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-800">Sleep Pattern Analysis</h4>
                <p className="text-sm text-gray-600 mt-1">Your sleep quality has improved by 15% this week. Continue with your current routine.</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-gray-800">Heart Rate Alert</h4>
                <p className="text-sm text-gray-600 mt-1">Your resting heart rate is slightly elevated. Consider stress management techniques.</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-0.5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-800">Activity Recommendation</h4>
                <p className="text-sm text-gray-600 mt-1">Based on your data, try adding 10 minutes of moderate exercise daily.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-r from-pink-50 to-red-50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center">
              <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Record Symptoms</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">View Reports</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Book Appointment</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">AI Consultation</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
