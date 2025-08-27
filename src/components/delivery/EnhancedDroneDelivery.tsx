import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Plane, Package, MapPin, Clock, Battery, Signal, Wind, 
  Navigation, CheckCircle, AlertTriangle, Route, Target, 
  Zap, Shield, Box, Cloud, Fuel, Eye, Camera, FileText, 
  MessageSquare, BarChart3, TrendingUp
} from 'lucide-react';

interface EnhancedDroneDeliveryProps {
  className?: string;
}

export const EnhancedDroneDelivery: React.FC<EnhancedDroneDeliveryProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Sample data
  const drones = [
    {
      id: 'drone-001',
      name: 'VitalSync Drone Alpha',
      status: 'in-flight',
      battery: 85.0,
      fuel_level: 92.0,
      signal_strength: 95.0,
      altitude: 120,
      speed: 45.0,
      temperature: 22.0,
      wind_speed: 8.0,
      maintenance_status: 'excellent',
      flight_hours: 156.5,
      total_deliveries: 247
    },
    {
      id: 'drone-002',
      name: 'VitalSync Drone Beta',
      status: 'available',
      battery: 95.0,
      fuel_level: 98.0,
      signal_strength: 98.0,
      altitude: 0,
      speed: 0.0,
      temperature: 24.0,
      wind_speed: 5.0,
      maintenance_status: 'excellent',
      flight_hours: 89.2,
      total_deliveries: 134
    }
  ];

  const deliveries = [
    {
      id: 'delivery-001',
      package_id: 'PKG-2024-001',
      destination: 'City General Hospital',
      status: 'in-flight',
      drone_id: 'drone-001',
      estimated_time: '15 min',
      distance: 2.3,
      priority: 'urgent',
      items: ['Emergency Medicine', 'Blood Samples', 'Medical Supplies'],
      customer_info: {
        name: 'Dr. Sarah Johnson',
        phone: '+1-555-0123',
        email: 'sarah.johnson@cityhospital.com'
      },
      tracking_code: 'TRK-2024-001',
      signature_required: true,
      photo_proof_required: true
    }
  ];

  const weatherData = {
    condition: 'clear',
    temperature: 22.0,
    wind_speed: 8.0,
    humidity: 65.0,
    visibility: 10.0
  };

  useEffect(() => {
    connectToBackend();
  }, []);

  const connectToBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/status');
      if (response.ok) {
        setBackendConnected(true);
      }
    } catch (error) {
      console.log('Enhanced backend not available');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-flight': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackDelivery = async () => {
    if (!trackingCode) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/tracking/${trackingCode}`);
      if (response.ok) {
        const result = await response.json();
        setTrackingResult(result);
      } else {
        setTrackingResult({ error: 'Delivery not found' });
      }
    } catch (error) {
      setTrackingResult({ error: 'Tracking service unavailable' });
    }
  };

  const handleEmergencyLanding = async (droneId: string) => {
    try {
      await fetch(`http://localhost:8000/api/drones/${droneId}/emergency-landing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: 40.7128,
          lng: -74.0060,
          altitude: 0
        })
      });
      console.log('Emergency landing initiated');
    } catch (error) {
      console.error('Failed to initiate emergency landing');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enhanced Drone Delivery System
        </h1>
        <p className="text-muted-foreground">Advanced AI-powered medical supply delivery with comprehensive safety and tracking</p>
        <div className="mt-4 flex gap-2 justify-center">
          <Button
            onClick={() => setActiveTab('flight-planning')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Route className="w-4 h-4 mr-2" />
            Flight Planning
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('safety')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Safety Features
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flight-planning">Flight Planning</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{drones.length}</div>
                <p className="text-sm text-muted-foreground">Active Drones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed Deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {deliveries.filter(d => d.status === 'in-flight').length}
                </div>
                <p className="text-sm text-muted-foreground">In Flight</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${backendConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {backendConnected ? 'Online' : 'Offline'}
                </div>
                <p className="text-sm text-muted-foreground">System Status</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Drone Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Live Drone Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drones.map(drone => (
                  <Card key={drone.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{drone.name}</h4>
                        <Badge className={getStatusColor(drone.status)}>
                          {drone.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4" />
                          <span className="text-sm">{drone.battery.toFixed(1)}%</span>
                          <Progress value={drone.battery} className="flex-1 h-2" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4" />
                          <span className="text-sm">{drone.fuel_level.toFixed(1)}%</span>
                          <Progress value={drone.fuel_level} className="flex-1 h-2" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Signal className="h-4 w-4" />
                          <span className="text-sm">{drone.signal_strength}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm">{drone.altitude}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">{drone.speed} km/h</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleEmergencyLanding(drone.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Emergency
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Weather & Flight Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{weatherData.wind_speed} km/h</div>
                  <div className="text-sm text-muted-foreground">Wind Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{weatherData.humidity}%</div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{weatherData.visibility} km</div>
                  <div className="text-sm text-muted-foreground">Visibility</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flight Planning Tab */}
        <TabsContent value="flight-planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                AI-Powered Flight Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Route Optimization</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>AI-driven shortest path calculation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Weather-aware route planning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Obstacle avoidance integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multi-drop delivery optimization</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fuel Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Real-time fuel consumption tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Wind resistance calculations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Optimal refueling scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Range optimization algorithms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Enhanced Safety Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Advanced Geofencing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Emergency Landing Protocols</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Collision Avoidance AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Flight Recording & Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Predictive Maintenance Alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Safety Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-4">
                    All safety systems operational
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">100%</div>
                      <div className="text-muted-foreground">System Health</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">0</div>
                      <div className="text-muted-foreground">Active Alerts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Real-time Delivery Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking code (e.g., TRK-2024-001)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTrackDelivery}>
                    <Eye className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
                
                {trackingResult && (
                  <div className="border rounded-lg p-4">
                    {trackingResult.error ? (
                      <div className="text-red-600">{trackingResult.error}</div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Tracking Results</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <div className="font-medium">{trackingResult.status}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ETA:</span>
                            <div className="font-medium">{trackingResult.estimated_arrival}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-bold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Delivery Time</span>
                    <span className="font-bold text-blue-600">18 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deliveries Today</span>
                    <span className="font-bold text-purple-600">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Efficiency</span>
                    <span className="font-bold text-orange-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Weather Conditions</span>
                    <span className="font-bold text-green-600">Optimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air Traffic</span>
                    <span className="font-bold text-blue-600">Clear</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Health</span>
                    <span className="font-bold text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Strength</span>
                    <span className="font-bold text-green-600">Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
