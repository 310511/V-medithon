import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Package, 
  TrendingUp, 
  Activity, 
  Bell, 
  Settings,
  ArrowRight,
  Heart,
  Brain,
  Camera,
  Mic,
  Radio
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Medicine Recommendations",
      description: "Get AI-powered medicine suggestions based on symptoms",
      icon: Heart,
      href: "/ai-medicine-recommendation",
      color: "text-red-600"
    },
    {
      title: "Infinite Memory",
      description: "Advanced memory management for healthcare data",
      icon: Brain,
      href: "/infinite-memory",
      color: "text-purple-600"
    },
    {
      title: "Skin Analysis",
      description: "AI-powered skin condition analysis",
      icon: Camera,
      href: "/skin-analysis",
      color: "text-green-600"
    },
    {
      title: "Voice Medicine Assistant",
      description: "Voice-controlled medicine recommendations",
      icon: Mic,
      href: "/voice-medicine",
      color: "text-blue-600"
    },
    {
      title: "RFID Management",
      description: "Track and manage inventory with RFID technology",
      icon: Radio,
      href: "/rfid",
      color: "text-orange-600"
    },
    {
      title: "Inventory Dashboard",
      description: "Comprehensive inventory management system",
      icon: Package,
      href: "/inventory",
      color: "text-indigo-600"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
            <p className="text-gray-600 mb-4">Please sign in to access the dashboard</p>
            <Button onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-blue-100 mt-2">
              Access your healthcare management tools and AI-powered features
            </p>
          </div>
          <div className="hidden md:block">
            <Shield className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Consultations</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 unread messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(feature.href)}
                  className="w-full"
                  variant="outline"
                >
                  Access Feature
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Management
            </CardTitle>
            <CardDescription>
              Update your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              View Profile
            </Button>
            <Button 
              onClick={() => navigate('/settings')}
              variant="outline"
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Analytics
            </CardTitle>
            <CardDescription>
              View your recent activity and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/ml-predictions')}
              className="w-full"
            >
              View Analytics
            </Button>
            <Button 
              onClick={() => navigate('/inventory')}
              variant="outline"
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              Inventory Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
