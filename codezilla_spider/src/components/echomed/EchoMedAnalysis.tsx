import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Waveform,
  Download,
  Share2,
  Heart,
  Droplets,
  Volume2,
  BrainCircuit,
  Info,
  Shield,
  Square
} from "lucide-react";
import { HealthChart } from "../health-charts/HealthChart";
import { ChartModal } from "../health-charts/ChartModal";

// Enhanced animated waveform component
const AnimatedWaveform = ({ isRecording, isProcessing }: { isRecording: boolean, isProcessing: boolean }) => {
  const [bars, setBars] = useState<number[]>(Array(40).fill(0).map(() => Math.random() * 100));

  useEffect(() => {
    if (isRecording || isProcessing) {
      const interval = setInterval(() => {
        setBars(Array(40).fill(0).map(() => Math.random() * 100));
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isRecording, isProcessing]);

  return (
    <div className="relative w-full">
      <div className="flex items-end justify-center gap-0.5 h-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 rounded-xl p-3 overflow-hidden border border-slate-200/50 shadow-sm">
        {bars.map((height, index) => (
          <div
            key={index}
            className="w-1.5 bg-gradient-to-t from-pink-500 via-red-500 to-orange-500 rounded-full transition-all duration-150 ease-out shadow-sm hover:scale-y-110"
            style={{ 
              height: `${Math.min(height, 95)}%`,
              opacity: isRecording ? 0.9 : 0.6,
              transform: isRecording ? 'scaleY(1.05)' : 'scaleY(1)',
              filter: isRecording ? 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))' : 'none'
            }}
          />
        ))}
      </div>
      
      {(isRecording || isProcessing) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Waveform className="w-3 h-3 text-pink-600" />
                <span className="text-xs font-mono text-slate-700">
                  {Math.round(Math.random() * 2000 + 1000)} Hz
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-mono text-slate-700">
                  {Math.round(Math.random() * 30 + 70)} dB
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EchoMedAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  
  // Real-time health data
  const [heartRate, setHeartRate] = useState(72);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [stressLevel, setStressLevel] = useState(45);
  const [voiceClarity, setVoiceClarity] = useState(85);
  const [emotionalStability, setEmotionalStability] = useState(78);
  const [cognitiveLoad, setCognitiveLoad] = useState(62);

  // Historical data for charts
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([72, 75, 73, 78, 76, 74, 77, 75, 73, 76, 74, 78]);
  const [respiratoryRateHistory, setRespiratoryRateHistory] = useState<number[]>([16, 15, 17, 16, 15, 18, 16, 17, 15, 16, 17, 16]);
  const [stressLevelHistory, setStressLevelHistory] = useState<number[]>([45, 42, 48, 45, 43, 47, 44, 46, 42, 45, 47, 44]);
  const [voiceClarityHistory, setVoiceClarityHistory] = useState<number[]>([85, 87, 83, 86, 88, 84, 87, 85, 86, 87, 85, 86]);
  const [emotionalStabilityHistory, setEmotionalStabilityHistory] = useState<number[]>([78, 75, 82, 79, 76, 81, 77, 80, 74, 78, 83, 76]);
  const [cognitiveLoadHistory, setCognitiveLoadHistory] = useState<number[]>([62, 65, 58, 63, 67, 59, 64, 61, 66, 60, 65, 63]);

  // Convert history arrays to chart data format
  const convertToChartData = (history: number[], metricName: string) => {
    const now = new Date();
    return history.map((value, index) => ({
      timestamp: new Date(now.getTime() - (history.length - index - 1) * 2000).toISOString(),
      value: value
    }));
  };

  // Metric configurations
  const metrics = {
    heartRate: {
      title: "Heart Rate",
      unit: "bpm",
      color: "#ef4444",
      icon: Heart,
      threshold: { warning: 85, critical: 100 }
    },
    respiratoryRate: {
      title: "Respiratory Rate",
      unit: "breaths/min",
      color: "#3b82f6",
      icon: Droplets,
      threshold: { warning: 20, critical: 25 }
    },
    stressLevel: {
      title: "Stress Level",
      unit: "%",
      color: "#f59e0b",
      icon: Activity,
      threshold: { warning: 60, critical: 75 }
    },
    voiceClarity: {
      title: "Voice Clarity",
      unit: "%",
      color: "#10b981",
      icon: Volume2,
      threshold: { warning: 70, critical: 60 }
    },
    emotionalStability: {
      title: "Emotional Stability",
      unit: "%",
      color: "#8b5cf6",
      icon: Brain,
      threshold: { warning: 60, critical: 50 }
    },
    cognitiveLoad: {
      title: "Cognitive Load",
      unit: "%",
      color: "#06b6d4",
      icon: BrainCircuit,
      threshold: { warning: 70, critical: 80 }
    }
  };

  // Update health data every 2 seconds
  useEffect(() => {
    const dataInterval = setInterval(() => {
      setHeartRate(prev => {
        const change = (Math.random() - 0.5) * 6;
        return Math.max(60, Math.min(100, prev + change));
      });

      setRespiratoryRate(prev => {
        const change = (Math.random() - 0.5) * 3;
        return Math.max(12, Math.min(20, prev + change));
      });

      setStressLevel(prev => {
        const change = (Math.random() - 0.5) * 8;
        return Math.max(20, Math.min(80, prev + change));
      });

      setVoiceClarity(prev => {
        const change = (Math.random() - 0.5) * 6;
        return Math.max(70, Math.min(95, prev + change));
      });

      setEmotionalStability(prev => {
        const change = (Math.random() - 0.5) * 8;
        return Math.max(60, Math.min(90, prev + change));
      });

      setCognitiveLoad(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(40, Math.min(80, prev + change));
      });

      // Update historical data
      setHeartRateHistory(prev => [...prev.slice(1), heartRate]);
      setRespiratoryRateHistory(prev => [...prev.slice(1), respiratoryRate]);
      setStressLevelHistory(prev => [...prev.slice(1), stressLevel]);
      setVoiceClarityHistory(prev => [...prev.slice(1), voiceClarity]);
      setEmotionalStabilityHistory(prev => [...prev.slice(1), emotionalStability]);
      setCognitiveLoadHistory(prev => [...prev.slice(1), cognitiveLoad]);
    }, 2000);

    return () => clearInterval(dataInterval);
  }, [heartRate, respiratoryRate, stressLevel, voiceClarity, emotionalStability, cognitiveLoad]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(timer);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setAnalysisComplete(true);
      }, 3000);
    }, 30000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
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

  const handleChartClick = (data: any, metricKey: string) => {
    setModalData({ data, metricKey });
    setSelectedChart(metricKey);
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Voice Health Analysis
          </h2>
          <p className="text-slate-600 mt-1">AI-powered analysis of your voice patterns and health indicators</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white animate-pulse shadow-lg">
          <Sparkles className="w-3 h-3 mr-1" />
          Live Analysis
        </Badge>
      </div>

      <Tabs defaultValue="recording" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/50">
          <TabsTrigger value="recording" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Mic className="w-4 h-4 mr-2" />
            Recording
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Activity className="w-4 h-4 mr-2" />
            Live Metrics
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recording" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recording Interface */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pink-600" />
                  Voice Recording
                </CardTitle>
                <CardDescription>
                  Record your voice for comprehensive AI health analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Status */}
                <div className="text-center">
                  {isRecording ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        <Mic className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-red-600">Recording...</p>
                        <p className="text-3xl font-mono text-slate-800 font-bold">{formatTime(recordingTime)}</p>
                      </div>
                      <Button 
                        onClick={handleStopRecording}
                        variant="destructive"
                        className="gap-2 shadow-lg"
                      >
                        Stop Recording
                      </Button>
                      
                      <AnimatedWaveform isRecording={isRecording} isProcessing={false} />
                    </div>
                  ) : isProcessing ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-spin shadow-lg">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-blue-600">Processing...</p>
                        <p className="text-sm text-slate-600">AI is analyzing your voice patterns</p>
                      </div>
                      <Progress value={75} className="w-full" />
                      
                      <AnimatedWaveform isRecording={false} isProcessing={isProcessing} />
                    </div>
                  ) : analysisComplete ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">Analysis Complete</p>
                        <p className="text-sm text-slate-600">Your results are ready</p>
                      </div>
                      <Button 
                        onClick={() => {
                          setAnalysisComplete(false);
                          setRecordingTime(0);
                        }}
                        className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-lg"
                      >
                        <Mic className="w-4 h-4" />
                        New Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg">
                        <Mic className="w-10 h-10 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-600">Ready to Record</p>
                        <p className="text-sm text-slate-500">Click to start voice analysis</p>
                      </div>
                      <Button 
                        onClick={handleStartRecording}
                        className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-lg"
                      >
                        <Mic className="w-4 h-4" />
                        Start Recording
                      </Button>
                    </div>
                  )}
                </div>

                {/* Recording Tips */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Recording Tips
                    </h4>
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

            {/* Real-time Health Metrics */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink-600" />
                  Real-time Health Metrics
                </CardTitle>
                <CardDescription>
                  Live monitoring of health indicators during analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800 animate-pulse">{Math.round(heartRate)}</p>
                    <p className="text-xs text-slate-600">Heart Rate (BPM)</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-800 animate-pulse">{Math.round(respiratoryRate)}</p>
                    <p className="text-xs text-slate-600">Respiratory Rate</p>
                  </div>
                </div>
                
                {/* Mini Dashboard Charts */}
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">Heart Rate Trend</span>
                        </div>
                        <Badge className="bg-red-100 text-red-700 text-xs">Live</Badge>
                      </div>
                      <HealthChart 
                        data={convertToChartData(heartRateHistory, 'heartRate')}
                        metric={metrics.heartRate}
                        type="line"
                        height={100}
                        onPointClick={(data) => handleChartClick(data, 'heartRate')}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-800">Respiratory Rate</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Live</Badge>
                      </div>
                      <HealthChart 
                        data={convertToChartData(respiratoryRateHistory, 'respiratoryRate')}
                        metric={metrics.respiratoryRate}
                        type="area"
                        height={100}
                        onPointClick={(data) => handleChartClick(data, 'respiratoryRate')}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Heart Rate",
                value: Math.round(heartRate),
                unit: "BPM",
                change: "+2.3%",
                trend: "up",
                color: "text-red-500",
                bgColor: "bg-red-50",
                icon: Heart
              },
              {
                title: "Stress Level",
                value: Math.round(stressLevel),
                unit: "%",
                change: "-1.2%",
                trend: "down",
                color: "text-orange-500",
                bgColor: "bg-orange-50",
                icon: Activity
              },
              {
                title: "Voice Clarity",
                value: Math.round(voiceClarity),
                unit: "%",
                change: "+0.8%",
                trend: "up",
                color: "text-green-500",
                bgColor: "bg-green-50",
                icon: Volume2
              },
              {
                title: "Cognitive Load",
                value: Math.round(cognitiveLoad),
                unit: "%",
                change: "+1.5%",
                trend: "up",
                color: "text-blue-500",
                bgColor: "bg-blue-50",
                icon: BrainCircuit
              }
            ].map((metric, index) => (
              <Card key={index} className="border-0 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                        <span className="text-sm text-slate-500">{metric.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-slate-500">vs last hour</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Primary Health Metrics */}
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                      Cardiovascular Health
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Real-time heart rate and respiratory monitoring
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Normal Range</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <HealthChart 
                  data={convertToChartData(heartRateHistory, 'heartRate')}
                  metric={metrics.heartRate}
                  type="line"
                  height={180}
                  onPointClick={(data) => handleChartClick(data, 'heartRate')}
                />
              </CardContent>
            </Card>

            {/* Voice Analysis */}
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Volume2 className="w-5 h-5 text-green-500" />
                      Voice Analysis
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Voice clarity and quality assessment
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <HealthChart 
                  data={convertToChartData(voiceClarityHistory, 'voiceClarity')}
                  metric={metrics.voiceClarity}
                  type="area"
                  height={180}
                  onPointClick={(data) => handleChartClick(data, 'voiceClarity')}
                />
              </CardContent>
            </Card>

            {/* Stress & Mental Health */}
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5 text-orange-500" />
                      Stress & Mental Health
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Stress levels and emotional stability tracking
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <HealthChart 
                  data={convertToChartData(stressLevelHistory, 'stressLevel')}
                  metric={metrics.stressLevel}
                  type="area"
                  height={180}
                  onPointClick={(data) => handleChartClick(data, 'stressLevel')}
                />
              </CardContent>
            </Card>

            {/* Cognitive Performance */}
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BrainCircuit className="w-5 h-5 text-blue-500" />
                      Cognitive Performance
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Mental load and cognitive function analysis
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Optimal</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <HealthChart 
                  data={convertToChartData(cognitiveLoadHistory, 'cognitiveLoad')}
                  metric={metrics.cognitiveLoad}
                  type="line"
                  height={180}
                  onPointClick={(data) => handleChartClick(data, 'cognitiveLoad')}
                />
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Overall Health Score</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">82/100</div>
                <p className="text-sm text-green-700">Good overall health indicators</p>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Active Alerts</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">2</div>
                <p className="text-sm text-yellow-700">Minor stress elevation detected</p>
              </CardContent>
            </Card>

            {/* Data Points */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Data Points Collected</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                <p className="text-sm text-blue-700">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">AI Health Intelligence Dashboard</h3>
              <p className="text-slate-600">Comprehensive analysis and personalized health insights</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>

          {/* Main Health Indicators Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Heart Rate Analysis",
                value: heartRate,
                unit: "bpm",
                status: heartRate > 85 ? "elevated" : heartRate > 75 ? "moderate" : "normal",
                color: "#ef4444",
                icon: Heart,
                insight: "Your heart rate shows healthy cardiovascular function",
                recommendation: "Continue regular exercise routine"
              },
              {
                title: "Respiratory Health",
                value: respiratoryRate,
                unit: "breaths/min",
                status: respiratoryRate > 20 ? "rapid" : respiratoryRate < 12 ? "slow" : "normal",
                color: "#3b82f6",
                icon: Droplets,
                insight: "Breathing pattern indicates good respiratory control",
                recommendation: "Practice deep breathing exercises"
              },
              {
                title: "Stress Assessment",
                value: stressLevel,
                unit: "%",
                status: stressLevel > 60 ? "high" : stressLevel > 40 ? "moderate" : "low",
                color: "#f59e0b",
                icon: Activity,
                insight: "Stress levels are within manageable range",
                recommendation: "Consider meditation for stress reduction"
              }
            ].map((insight, index) => (
              <Card 
                key={index} 
                className="border-0 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      insight.status === 'normal' ? 'from-green-100 to-green-200' :
                      insight.status === 'moderate' ? 'from-yellow-100 to-yellow-200' :
                      'from-red-100 to-red-200'
                    } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <insight.icon className="w-6 h-6" style={{ color: insight.color }} />
                    </div>
                    <Badge className={`${
                      insight.status === 'normal' ? 'bg-green-100 text-green-800' : 
                      insight.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    } font-medium`}>
                      {insight.status.charAt(0).toUpperCase() + insight.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 text-lg">{insight.title}</h4>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold" style={{ color: insight.color }}>
                        {Math.round(insight.value)}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">{insight.unit}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 leading-relaxed">{insight.insight}</p>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-700 leading-relaxed">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Advanced Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Analysis Dashboard Widget */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  Voice Quality Analytics
                </CardTitle>
                <CardDescription>Real-time voice analysis and quality metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Clarity Score</span>
                    <Badge className="bg-green-100 text-green-800">{Math.round(voiceClarity)}%</Badge>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${voiceClarity}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">92%</p>
                      <p className="text-xs text-green-700">Pronunciation</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">88%</p>
                      <p className="text-xs text-green-700">Fluency</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Performance Dashboard Widget */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  Cognitive Performance
                </CardTitle>
                <CardDescription>Mental load and cognitive function tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Cognitive Load</span>
                    <Badge className="bg-blue-100 text-blue-800">{Math.round(cognitiveLoad)}%</Badge>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cognitiveLoad}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">78%</p>
                      <p className="text-xs text-blue-700">Focus Level</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">85%</p>
                      <p className="text-xs text-blue-700">Mental Clarity</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Recommendations Dashboard */}
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Personalized Health Recommendations
              </CardTitle>
              <CardDescription>AI-generated insights based on your current health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Maintain current exercise routine for optimal cardiovascular health",
                  "Consider stress-reduction techniques like deep breathing",
                  "Voice patterns suggest good overall health status",
                  "Continue monitoring cognitive load during work hours"
                ].map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/70 rounded-lg border border-purple-200">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-800 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                { label: "Stress Level", value: stressLevel > 60 ? "High" : stressLevel > 40 ? "Moderate" : "Low", icon: Activity, color: "text-green-600" },
                { label: "Sleep Quality", value: "Good", icon: Clock, color: "text-blue-600" },
                { label: "Voice Clarity", value: voiceClarity > 85 ? "Excellent" : voiceClarity > 75 ? "Good" : "Fair", icon: Volume2, color: "text-purple-600" },
                { label: "Emotional State", value: "Calm", icon: TrendingUp, color: "text-pink-600" }
              ].map((metric, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <p className="text-lg font-semibold text-slate-800 animate-pulse">{metric.value}</p>
                  <p className="text-sm text-slate-600">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h4 className="font-medium text-slate-800 mb-3">AI Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Your heart rate is within normal range",
                  "Consider stress management techniques",
                  "Maintain regular sleep schedule",
                  "Stay hydrated throughout the day"
                ].map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
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
      <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
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
          type={modalData.metricKey === 'respiratoryRate' || modalData.metricKey === 'stressLevel' || modalData.metricKey === 'emotionalStability' ? 'area' : 'line'}
        />
      )}
    </div>
  );
};
