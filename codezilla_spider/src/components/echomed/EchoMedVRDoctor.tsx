import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageCircle,
  Camera,
  Settings,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Heart,
  Stethoscope,
  Brain,
  Activity,
  Thermometer,
  Wifi,
  Zap,
  Eye,
  Shield,
  Star,
  TrendingUp,

  Monitor,
  Smartphone,
  Headphones,
  WifiOff,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from "lucide-react";

export const EchoMedVRDoctor = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState(95);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [signalStrength, setSignalStrength] = useState(4);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState("Dr. Sarah Johnson");
  const [doctorSpecialty, setDoctorSpecialty] = useState("Cardiologist");
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenLevel: 98
  });

  // Simulate real-time health monitoring
  useEffect(() => {
    if (isInCall) {
      const healthInterval = setInterval(() => {
        setHealthMetrics(prev => ({
          heartRate: prev.heartRate + Math.floor(Math.random() * 6) - 3,
          bloodPressure: prev.bloodPressure,
          temperature: prev.temperature + (Math.random() * 0.4) - 0.2,
          oxygenLevel: prev.oxygenLevel + Math.floor(Math.random() * 4) - 2
        }));
      }, 3000);

      const connectionInterval = setInterval(() => {
        setConnectionQuality(prev => Math.max(80, prev + Math.floor(Math.random() * 10) - 5));
        setBatteryLevel(prev => Math.max(10, prev - Math.random() * 2));
        setSignalStrength(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      }, 5000);

      return () => {
        clearInterval(healthInterval);
        clearInterval(connectionInterval);
      };
    }
  }, [isInCall]);

  const handleStartCall = () => {
    setIsLoading(true);
    // Simulate connecting to VR doctor
    setTimeout(() => {
      setIsLoading(false);
      setIsInCall(true);
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Auto-end call after 10 minutes (demo)
      setTimeout(() => {
        setIsInCall(false);
        setCallDuration(0);
        clearInterval(timer);
      }, 600000);
    }, 3000);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 4) return <Signal className="w-4 h-4 text-green-500" />;
    if (strength >= 3) return <Signal className="w-4 h-4 text-yellow-500" />;
    if (strength >= 2) return <Signal className="w-4 h-4 text-orange-500" />;
    return <WifiOff className="w-4 h-4 text-purple-500" />;
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      time: "Today, 2:00 PM",
      status: "confirmed",
      avatar: "SJ"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      time: "Tomorrow, 10:00 AM",
      status: "pending",
      avatar: "MC"
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      time: "Friday, 3:30 PM",
      status: "confirmed",
      avatar: "ER"
    }
  ];

  const recentConsultations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2 days ago",
      duration: "15 minutes",
      topic: "Heart health checkup",
      status: "completed",
      rating: 5
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      date: "1 week ago",
      duration: "20 minutes",
      topic: "Neurological symptoms",
      status: "completed",
      rating: 4
    }
  ];

  const vrFeatures = [
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Real-time health insights",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Stethoscope,
      title: "Virtual Exam",
      description: "3D health assessment",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Real-time vitals",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">VR Doctor Consultation</h2>
          <p className="text-gray-600 dark:text-gray-400">Connect with healthcare professionals in virtual reality</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          VR Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main VR Interface */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Virtual Consultation Room
              </CardTitle>
              <CardDescription>
                {isInCall ? "You are currently in a VR consultation" : "Start a virtual consultation with a healthcare professional"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* VR Display Area */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
                {!isInCall ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                        <Video className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">VR Consultation Ready</h3>
                      <p className="text-white/80">Click to start your virtual consultation</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    {/* VR Environment */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-800/50 via-blue-800/50 to-indigo-800/50"></div>
                    
                    {/* Doctor Avatar */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                        <Users className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{currentDoctor}</h3>
                      <p className="text-white/80 mb-2">{doctorSpecialty}</p>
                      <p className="text-white/60 text-sm">Virtual consultation in progress</p>
                      <div className="mt-4 text-2xl font-mono text-white">{formatTime(callDuration)}</div>
                    </div>

                    {/* Health Metrics Overlay */}
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-purple-400" />
                          <span className="text-sm">{healthMetrics.heartRate} BPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{healthMetrics.bloodPressure}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-400" />
                          <span className="text-sm">{healthMetrics.temperature.toFixed(1)}°F</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{healthMetrics.oxygenLevel}% O₂</span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Status */}
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{connectionQuality}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSignalIcon(signalStrength)}
                          <span className="text-sm">Signal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{batteryLevel}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call Controls */}
                {isInCall && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-12 h-12 rounded-full ${isVideoOn ? 'bg-white/20 text-white' : 'bg-purple-500 text-white'}`}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-12 h-12 rounded-full ${isMicOn ? 'bg-white/20 text-white' : 'bg-purple-500 text-white'}`}
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-full bg-white/20 text-white"
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-12 h-12 rounded-full"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isInCall && (
                <div className="text-center space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-spin">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Connecting to VR doctor...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleStartCall}
                      className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      size="lg"
                    >
                      <Video className="w-5 h-5" />
                      Start VR Consultation
                    </Button>
                  )}
                  
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" className="gap-2">
                      <Settings className="w-4 h-4" />
                      VR Settings
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat Support
                    </Button>
                  </div>
                </div>
              )}

              {/* VR Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vrFeatures.map((feature, index) => (
                  <div key={index} className={`text-center p-4 ${feature.bgColor} dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow`}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <feature.icon className="w-6 h-6 text-white" />
                </div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {appointment.avatar}
                    </div>
                  <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{appointment.doctor}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.specialty}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.time}</p>
                    </div>
                  </div>
                  <Badge className={
                    appointment.status === "confirmed" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Recent Consultations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentConsultations.map((consultation) => (
                <div key={consultation.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{consultation.doctor}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{consultation.topic}</p>
                      <p className="text-xs text-gray-400 mt-1">{consultation.date} • {consultation.duration}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {consultation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                  <Calendar className="w-4 h-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                  <MessageCircle className="w-4 h-4" />
                  Message Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                  <Camera className="w-4 h-4" />
                  Upload Images
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-violet-50 dark:hover:bg-violet-950/20">
                  <Brain className="w-4 h-4" />
                  AI Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* VR Requirements */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">VR Requirements</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                For the best VR consultation experience, ensure you have a compatible VR headset, 
                stable internet connection, and a quiet environment. Our VR platform supports 
                Oculus Quest, HTC Vive, and other major VR devices.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">VR Headset</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">Stable Internet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">Privacy</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
