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
import { HealthChart } from "../health-charts/HealthChart";
import { ChartModal } from "../health-charts/ChartModal";

export const EchoMedDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  
  // Health data state
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState(120);
  const [temperature, setTemperature] = useState(36.8);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [stressLevel, setStressLevel] = useState(65);
  const [sleepQuality, setSleepQuality] = useState(82);
  const [hydrationLevel, setHydrationLevel] = useState(78);

  // Historical data for charts
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([72, 75, 73, 78, 76, 74, 77, 75, 73, 76, 74, 78]);
  const [bloodPressureHistory, setBloodPressureHistory] = useState<number[]>([120, 118, 122, 119, 121, 117, 123, 120, 118, 121, 119, 122]);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([36.8, 36.9, 37.0, 36.7, 36.8, 37.1, 36.9, 37.0, 36.8, 36.9, 37.0, 36.8]);
  const [oxygenHistory, setOxygenHistory] = useState<number[]>([98, 97, 99, 98, 97, 98, 99, 98, 97, 98, 99, 98]);

  // Convert history arrays to chart data format
  const convertToChartData = (history: number[], metricName: string) => {
    const now = new Date();
    return history.map((value, index) => ({
      timestamp: new Date(now.getTime() - (history.length - index - 1) * 2000).toISOString(),
      value: value
    }));
  };

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

      // Update historical data
      setHeartRateHistory(prev => [...prev.slice(1), heartRate]);
      setBloodPressureHistory(prev => [...prev.slice(1), bloodPressure]);
      setTemperatureHistory(prev => [...prev.slice(1), temperature]);
      setOxygenHistory(prev => [...prev.slice(1), oxygenLevel]);
    }, 2000);

    return () => clearInterval(dataInterval);
  }, [heartRate, bloodPressure, temperature, oxygenLevel]);

  // Metric configurations
  const metrics = {
    heartRate: {
      title: "Heart Rate",
      unit: "bpm",
      color: "#ef4444",
      icon: Heart,
      minValue: 50,
      maxValue: 120,
      threshold: {
        warning: 90,
        critical: 100
      }
    },
    bloodPressure: {
      title: "Blood Pressure",
      unit: "mmHg",
      color: "#3b82f6",
      icon: Activity,
      minValue: 100,
      maxValue: 140,
      threshold: {
        warning: 130,
        critical: 140
      }
    },
    temperature: {
      title: "Body Temperature",
      unit: "°C",
      color: "#f97316",
      icon: Thermometer,
      minValue: 36.0,
      maxValue: 38.0,
      threshold: {
        warning: 37.5,
        critical: 38.0
      }
    },
    oxygenLevel: {
      title: "Oxygen Saturation",
      unit: "%",
      color: "#06b6d4",
      icon: Droplets,
      minValue: 90,
      maxValue: 100,
      threshold: {
        warning: 95,
        critical: 92
      }
    }
  };

  const healthMetrics = [
    {
      title: "Heart Rate",
      value: Math.round(heartRate),
      unit: "bpm",
      status: heartRate > 90 ? "elevated" : heartRate < 60 ? "low" : "normal",
      icon: Heart,
      color: "#ef4444",
      bgColor: "bg-red-50",
      progress: heartRate,
      history: heartRateHistory,
      trend: heartRate > heartRateHistory[heartRateHistory.length - 2] ? "up" : "down"
    },
    {
      title: "Blood Pressure",
      value: Math.round(bloodPressure),
      unit: "mmHg",
      status: bloodPressure > 125 ? "elevated" : "normal",
      icon: Activity,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
      progress: bloodPressure,
      history: bloodPressureHistory,
      trend: bloodPressure > bloodPressureHistory[bloodPressureHistory.length - 2] ? "up" : "down"
    },
    {
      title: "Temperature",
      value: temperature.toFixed(1),
      unit: "°C",
      status: temperature > 37.0 ? "elevated" : "normal",
      icon: Thermometer,
      color: "#f97316",
      bgColor: "bg-orange-50",
      progress: temperature * 10,
      history: temperatureHistory,
      trend: temperature > temperatureHistory[temperatureHistory.length - 2] ? "up" : "down"
    },
    {
      title: "Oxygen Saturation",
      value: Math.round(oxygenLevel),
      unit: "%",
      status: oxygenLevel < 97 ? "low" : "normal",
      icon: Droplets,
      color: "#06b6d4",
      bgColor: "bg-cyan-50",
      progress: oxygenLevel,
      history: oxygenHistory,
      trend: oxygenLevel > oxygenHistory[oxygenHistory.length - 2] ? "up" : "down"
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

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="w-4 h-4 text-red-500" /> : 
      <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  // Handle chart click
  const handleChartClick = (data: any, metricKey: string) => {
    setModalData({ data, metricKey });
    setSelectedChart(metricKey);
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
          <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <metric.icon className={`w-6 h-6`} style={{ color: metric.color }} />
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
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

      {/* Modern Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <HealthChart
          data={convertToChartData(heartRateHistory, 'heartRate')}
          metric={metrics.heartRate}
          type="line"
          height={300}
          onPointClick={(data) => handleChartClick(data, 'heartRate')}
        />

        {/* Blood Pressure Chart */}
        <HealthChart
          data={convertToChartData(bloodPressureHistory, 'bloodPressure')}
          metric={metrics.bloodPressure}
          type="area"
          height={300}
          onPointClick={(data) => handleChartClick(data, 'bloodPressure')}
        />

        {/* Temperature Chart */}
        <HealthChart
          data={convertToChartData(temperatureHistory, 'temperature')}
          metric={metrics.temperature}
          type="line"
          height={300}
          onPointClick={(data) => handleChartClick(data, 'temperature')}
        />

        {/* Oxygen Level Chart */}
        <HealthChart
          data={convertToChartData(oxygenHistory, 'oxygenLevel')}
          metric={metrics.oxygenLevel}
          type="area"
          height={300}
          onPointClick={(data) => handleChartClick(data, 'oxygenLevel')}
        />
      </div>

      {/* Health Gauges Section */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Health Indicators
          </CardTitle>
          <CardDescription>
            Live monitoring of key health indicators with enhanced visualizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{Math.round(stressLevel)}%</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-ping opacity-30"></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Stress Level</p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{Math.round(sleepQuality)}%</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30"></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Sleep Quality</p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{Math.round(hydrationLevel)}%</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-30"></div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Hydration</p>
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
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center group">
              <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Record Symptoms</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center group">
              <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">View Reports</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center group">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Book Appointment</p>
            </button>
            <button className="p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-center group">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">AI Consultation</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Chart Modal */}
      {modalData && (
        <ChartModal
          isOpen={!!selectedChart}
          onClose={() => {
            setSelectedChart(null);
            setModalData(null);
          }}
          data={modalData.data}
          metric={metrics[modalData.metricKey as keyof typeof metrics]}
          type={modalData.metricKey === 'bloodPressure' || modalData.metricKey === 'oxygenLevel' ? 'area' : 'line'}
        />
      )}
    </div>
  );
};
