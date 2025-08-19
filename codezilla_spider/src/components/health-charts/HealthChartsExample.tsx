import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets,
  Brain,
  Sparkles,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { HealthChart } from './HealthChart';
import { ChartModal } from './ChartModal';
import './chart-styles.css';

// Example metric configurations
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

// Generate synthetic health data
const generateHealthData = (metric: string, count: number = 20) => {
  const data = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 2000); // 2 second intervals
    
    let baseValue: number;
    let variance: number;
    
    switch (metric) {
      case 'heartRate':
        baseValue = 72;
        variance = 8;
        break;
      case 'bloodPressure':
        baseValue = 120;
        variance = 6;
        break;
      case 'temperature':
        baseValue = 36.8;
        variance = 0.3;
        break;
      case 'oxygenLevel':
        baseValue = 98;
        variance = 2;
        break;
      default:
        baseValue = 50;
        variance = 10;
    }
    
    const value = baseValue + (Math.random() - 0.5) * variance;
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 10) / 10
    });
  }
  
  return data;
};

export const HealthChartsExample: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  
  // Health data state
  const [heartRateData, setHeartRateData] = useState(generateHealthData('heartRate'));
  const [bloodPressureData, setBloodPressureData] = useState(generateHealthData('bloodPressure'));
  const [temperatureData, setTemperatureData] = useState(generateHealthData('temperature'));
  const [oxygenLevelData, setOxygenLevelData] = useState(generateHealthData('oxygenLevel'));

  // Streaming data effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      // Update heart rate data
      setHeartRateData(prev => {
        const newValue = 72 + (Math.random() - 0.5) * 8;
        return [...prev.slice(1), {
          timestamp: now.toISOString(),
          value: Math.round(newValue)
        }];
      });

      // Update blood pressure data
      setBloodPressureData(prev => {
        const newValue = 120 + (Math.random() - 0.5) * 6;
        return [...prev.slice(1), {
          timestamp: now.toISOString(),
          value: Math.round(newValue)
        }];
      });

      // Update temperature data
      setTemperatureData(prev => {
        const newValue = 36.8 + (Math.random() - 0.5) * 0.3;
        return [...prev.slice(1), {
          timestamp: now.toISOString(),
          value: Math.round(newValue * 10) / 10
        }];
      });

      // Update oxygen level data
      setOxygenLevelData(prev => {
        const newValue = 98 + (Math.random() - 0.5) * 2;
        return [...prev.slice(1), {
          timestamp: now.toISOString(),
          value: Math.round(newValue)
        }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle chart point click
  const handleChartClick = (data: any, metric: string) => {
    setModalData({ data, metric });
    setSelectedChart(metric);
  };

  // Reset data
  const resetData = () => {
    setHeartRateData(generateHealthData('heartRate'));
    setBloodPressureData(generateHealthData('bloodPressure'));
    setTemperatureData(generateHealthData('temperature'));
    setOxygenLevelData(generateHealthData('oxygenLevel'));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Charts Demo</h1>
          <p className="text-gray-600 mt-2">
            Modern, responsive health monitoring charts with real-time data streaming
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Reduced Motion</span>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              aria-label="Toggle reduced motion"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
            className="gap-2"
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isStreaming ? 'Pause' : 'Resume'} Streaming
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetData}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-r from-red-50 to-pink-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {heartRateData[heartRateData.length - 1]?.value || 0} bpm
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {isStreaming ? 'Live' : 'Paused'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                  <p className="text-xl font-bold text-gray-900">
                    {bloodPressureData[bloodPressureData.length - 1]?.value || 0} mmHg
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {isStreaming ? 'Live' : 'Paused'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperature</p>
                  <p className="text-xl font-bold text-gray-900">
                    {temperatureData[temperatureData.length - 1]?.value || 0}°C
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {isStreaming ? 'Live' : 'Paused'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Oxygen Level</p>
                  <p className="text-xl font-bold text-gray-900">
                    {oxygenLevelData[oxygenLevelData.length - 1]?.value || 0}%
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {isStreaming ? 'Live' : 'Paused'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HealthChart
            data={heartRateData}
            metric={metrics.heartRate}
            type="line"
            height={300}
            onPointClick={(data) => handleChartClick(data, 'heartRate')}
            className="chart-fade-in"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <HealthChart
            data={bloodPressureData}
            metric={metrics.bloodPressure}
            type="area"
            height={300}
            onPointClick={(data) => handleChartClick(data, 'bloodPressure')}
            className="chart-fade-in"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <HealthChart
            data={temperatureData}
            metric={metrics.temperature}
            type="line"
            height={300}
            onPointClick={(data) => handleChartClick(data, 'temperature')}
            className="chart-fade-in"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <HealthChart
            data={oxygenLevelData}
            metric={metrics.oxygenLevel}
            type="area"
            height={300}
            onPointClick={(data) => handleChartClick(data, 'oxygenLevel')}
            className="chart-fade-in"
          />
        </motion.div>
      </div>

      {/* Features Showcase */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Chart Features
          </CardTitle>
          <CardDescription>
            Explore the modern features and capabilities of our health charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">🎨 Modern Design</h4>
              <p className="text-sm text-gray-600">
                Clean gradients, smooth animations, and responsive layouts that adapt to any screen size.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">⚡ Real-time Updates</h4>
              <p className="text-sm text-gray-600">
                Live data streaming with smooth transitions and intelligent data management for optimal performance.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">♿ Accessibility</h4>
              <p className="text-sm text-gray-600">
                Full keyboard navigation, screen reader support, and respect for user motion preferences.
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
          metric={metrics[modalData.metric as keyof typeof metrics]}
          type={modalData.metric === 'bloodPressure' || modalData.metric === 'oxygenLevel' ? 'area' : 'line'}
        />
      )}
    </div>
  );
};

export default HealthChartsExample;
