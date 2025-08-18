import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Brain
} from "lucide-react";

export const EchoMedVRDoctor = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Auto-end call after 5 minutes (demo)
      setTimeout(() => {
        setIsInCall(false);
        setCallDuration(0);
        clearInterval(timer);
      }, 300000);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      time: "Today, 2:00 PM",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      time: "Tomorrow, 10:00 AM",
      status: "pending"
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      time: "Friday, 3:30 PM",
      status: "confirmed"
    }
  ];

  const recentConsultations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2 days ago",
      duration: "15 minutes",
      topic: "Heart health checkup",
      status: "completed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      date: "1 week ago",
      duration: "20 minutes",
      topic: "Neurological symptoms",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">VR Doctor Consultation</h2>
          <p className="text-gray-600">Connect with healthcare professionals in virtual reality</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          VR Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main VR Interface */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-pink-600" />
                Virtual Consultation Room
              </CardTitle>
              <CardDescription>
                {isInCall ? "You are currently in a VR consultation" : "Start a virtual consultation with a healthcare professional"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* VR Display Area */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden">
                {!isInCall ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Video className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">VR Consultation Ready</h3>
                      <p className="text-white/80">Click to start your virtual consultation</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                        <Users className="w-16 h-16" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Connected to Dr. Echo</h3>
                      <p className="text-white/80">Virtual consultation in progress</p>
                      <div className="mt-4 text-2xl font-mono">{formatTime(callDuration)}</div>
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
                        className={`w-12 h-12 rounded-full ${isVideoOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-12 h-12 rounded-full ${isMicOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
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
                      <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600">Connecting to VR doctor...</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleStartCall}
                      className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
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
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-800">AI Assistant</h4>
                  <p className="text-sm text-blue-600">Real-time health insights</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Stethoscope className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-800">Virtual Exam</h4>
                  <p className="text-sm text-green-600">3D health assessment</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-800">Health Monitoring</h4>
                  <p className="text-sm text-purple-600">Real-time vitals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{appointment.doctor}</p>
                    <p className="text-xs text-gray-500">{appointment.specialty}</p>
                    <p className="text-xs text-gray-500">{appointment.time}</p>
                  </div>
                  <Badge className={
                    appointment.status === "confirmed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-600" />
                Recent Consultations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentConsultations.map((consultation) => (
                <div key={consultation.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800">{consultation.doctor}</p>
                      <p className="text-xs text-gray-500 mt-1">{consultation.topic}</p>
                      <p className="text-xs text-gray-400 mt-1">{consultation.date} • {consultation.duration}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {consultation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-gradient-to-r from-pink-50 to-red-50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Images
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Brain className="w-4 h-4" />
                  AI Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* VR Requirements */}
      <Card className="border-0 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">VR Requirements</h4>
              <p className="text-sm text-blue-700 mt-1">
                For the best VR consultation experience, ensure you have a compatible VR headset, 
                stable internet connection, and a quiet environment. Our VR platform supports 
                Oculus Quest, HTC Vive, and other major VR devices.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
