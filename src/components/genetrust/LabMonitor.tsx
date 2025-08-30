import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Lightbulb, 
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
  color: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
}

const LabMonitor = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize sensor data
  useEffect(() => {
    const initialSensors: SensorData[] = [
      {
        id: 'temp',
        name: 'Temperature',
        value: 23.5,
        unit: '°C',
        status: 'normal',
        icon: Thermometer,
        color: '#8eff8b',
        trend: 'stable',
        lastUpdate: '2 min ago'
      },
      {
        id: 'humidity',
        name: 'Humidity',
        value: 45.2,
        unit: '%',
        status: 'normal',
        icon: Droplets,
        color: '#8eff8b',
        trend: 'down',
        lastUpdate: '1 min ago'
      },
      {
        id: 'pressure',
        name: 'Pressure',
        value: 1013.2,
        unit: 'hPa',
        status: 'normal',
        icon: Gauge,
        color: '#8eff8b',
        trend: 'stable',
        lastUpdate: '3 min ago'
      },
      {
        id: 'light',
        name: 'Light Level',
        value: 850,
        unit: 'lux',
        status: 'warning',
        icon: Lightbulb,
        color: '#ffdb58',
        trend: 'up',
        lastUpdate: '1 min ago'
      },
      {
        id: 'co2',
        name: 'CO₂ Level',
        value: 420,
        unit: 'ppm',
        status: 'normal',
        icon: Activity,
        color: '#8eff8b',
        trend: 'stable',
        lastUpdate: '2 min ago'
      },
      {
        id: 'ph',
        name: 'pH Level',
        value: 7.2,
        unit: '',
        status: 'critical',
        icon: Activity,
        color: '#ff4242',
        trend: 'down',
        lastUpdate: '30 sec ago'
      }
    ];
    setSensors(initialSensors);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing sensor data...');
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSensors(prev => prev.map(sensor => ({
      ...sensor,
      value: sensor.value + (Math.random() - 0.5) * 2,
      lastUpdate: 'Just now',
      status: Math.random() > 0.8 ? 'warning' : sensor.status
    })));
    
    setIsRefreshing(false);
    toast.success('Sensor data updated!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/genetrust')}
            className="mb-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to GeneTrust
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mr-4">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Lab Monitor
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time IoT sensor data visualization and environmental control
                </p>
              </div>
            </div>
            
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Sensor Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {sensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="p-3 rounded-full mr-3"
                        style={{ backgroundColor: `${sensor.color}20` }}
                      >
                        <sensor.icon className="w-6 h-6" style={{ color: sensor.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{sensor.name}</CardTitle>
                        <CardDescription className="text-sm">
                          Last update: {sensor.lastUpdate}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(sensor.status)}
                      {getTrendIcon(sensor.trend)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {sensor.value.toFixed(1)}
                      <span className="text-2xl text-gray-600 dark:text-gray-400 ml-1">
                        {sensor.unit}
                      </span>
                    </div>
                    <Badge className={getStatusColor(sensor.status)}>
                      {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-medium">{sensor.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Trend</span>
                      <span className="font-medium capitalize">{sensor.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensors.filter(s => s.status === 'normal').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Normal Sensors</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensors.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Warning Sensors</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensors.filter(s => s.status === 'critical').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Critical Sensors</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sensors.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Sensors</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-2xl p-8 border border-green-200 dark:border-green-800"
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Real-Time Monitoring
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Continuous monitoring of laboratory environmental conditions ensures optimal experimental 
              conditions and reproducibility. All sensor data is logged and can be exported for analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Thermometer className="w-4 h-4 mr-2" />
                Temperature Control
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Droplets className="w-4 h-4 mr-2" />
                Humidity Monitoring
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Gauge className="w-4 h-4 mr-2" />
                Pressure Tracking
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Lightbulb className="w-4 h-4 mr-2" />
                Light Management
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { LabMonitor };
