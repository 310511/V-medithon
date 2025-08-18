import React from "react";
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
  Sparkles
} from "lucide-react";

export const EchoMedDashboard = () => {
  // Mock data - in real implementation, this would come from your backend
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "normal",
      trend: "stable",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      progress: 72
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      trend: "stable",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      progress: 85
    },
    {
      title: "Sleep Quality",
      value: "8.2",
      unit: "hours",
      status: "good",
      trend: "improving",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      progress: 82
    },
    {
      title: "Activity Level",
      value: "7,543",
      unit: "steps",
      status: "good",
      trend: "improving",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
      progress: 75
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "consultation",
      title: "AI Health Consultation",
      description: "Completed symptom assessment for headache",
      time: "2 hours ago",
      status: "completed",
      icon: Brain
    },
    {
      id: 2,
      type: "medication",
      title: "Medication Reminder",
      description: "Time to take your prescribed medication",
      time: "4 hours ago",
      status: "pending",
      icon: AlertCircle
    },
    {
      id: 3,
      type: "appointment",
      title: "Doctor Appointment",
      description: "Upcoming appointment with Dr. Smith",
      time: "1 day ago",
      status: "scheduled",
      icon: Calendar
    },
    {
      id: 4,
      type: "exercise",
      title: "Exercise Goal",
      description: "Achieved daily step goal",
      time: "2 days ago",
      status: "completed",
      icon: Target
    }
  ];

  const aiInsights = [
    {
      title: "Sleep Pattern Analysis",
      description: "Your sleep quality has improved by 15% this week. Continue with your current routine.",
      type: "positive",
      icon: TrendingUp
    },
    {
      title: "Heart Rate Alert",
      description: "Your resting heart rate is slightly elevated. Consider stress management techniques.",
      type: "warning",
      icon: AlertCircle
    },
    {
      title: "Activity Recommendation",
      description: "Based on your data, try adding 10 minutes of moderate exercise daily.",
      type: "suggestion",
      icon: Target
    }
  ];

  const upcomingReminders = [
    {
      id: 1,
      title: "Blood Pressure Check",
      time: "Today, 2:00 PM",
      type: "measurement",
      priority: "high"
    },
    {
      id: 2,
      title: "Medication Dose",
      time: "Today, 6:00 PM",
      type: "medication",
      priority: "medium"
    },
    {
      id: 3,
      title: "Exercise Session",
      time: "Tomorrow, 7:00 AM",
      type: "exercise",
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
      case "good":
      case "completed":
        return "text-green-600 bg-green-50";
      case "warning":
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "scheduled":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Health Dashboard</h2>
          <p className="text-gray-600">Monitor your health metrics and AI insights</p>
        </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => (
          <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{metric.progress}%</span>
                </div>
                
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights Panel */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-600" />
                AI Health Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your health data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === "positive" 
                      ? "border-green-500 bg-green-50" 
                      : insight.type === "warning"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className={`w-5 h-5 mt-0.5 ${
                      insight.type === "positive" 
                        ? "text-green-600" 
                        : insight.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-600" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{reminder.title}</p>
                    <p className="text-xs text-gray-500">{reminder.time}</p>
                  </div>
                  <Badge className={
                    reminder.priority === "high" 
                      ? "bg-red-100 text-red-700" 
                      : reminder.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }>
                    {reminder.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className="w-4 h-4 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

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
