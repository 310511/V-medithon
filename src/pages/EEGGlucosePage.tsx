import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bluetooth, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { PhoneBluetoothConnector } from '@/components/eeg-glucose/PhoneBluetoothConnector';
import { MobileEEGOptimized } from '@/components/eeg-glucose/MobileEEGOptimized';
import { MealInsulinDashboard } from '@/components/meal-insulin/MealInsulinDashboard';

interface GlucoseEstimate {
  estimated_glucose: number;
  confidence: number;
  method: string;
  timestamp: string;
}

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  gatt?: any;
  services?: any[];
  addEventListener?: (event: string, callback: () => void) => void;
}

export function EEGGlucosePage() {
  const [activeTab, setActiveTab] = useState('phone-bluetooth');
  const [currentGlucose, setCurrentGlucose] = useState<number | null>(null);
  const [glucoseHistory, setGlucoseHistory] = useState<GlucoseEstimate[]>([]);
  const [connectedBluetoothDevice, setConnectedBluetoothDevice] = useState<BluetoothDevice | null>(null);

  const handleGlucoseEstimate = (estimate: GlucoseEstimate) => {
    setCurrentGlucose(estimate.estimated_glucose);
    setGlucoseHistory(prev => [...prev.slice(-9), estimate]);
  };

  const handleBluetoothDeviceConnected = (device: BluetoothDevice) => {
    setConnectedBluetoothDevice(device);
  };

  const handleBluetoothDeviceDisconnected = (deviceId: string) => {
    setConnectedBluetoothDevice(null);
  };

  const handleBluetoothError = (error: string) => {
    console.error('Bluetooth Error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 dark:from-blue-400/10 dark:to-indigo-400/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
              <Bluetooth className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Phone Bluetooth Glucose Monitor
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect your phone via Bluetooth to control its torch and measure glucose levels non-invasively
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Real Phone Connection
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <Target className="h-4 w-4 mr-2" />
              Torch Control
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              <Activity className="h-4 w-4 mr-2" />
              Glucose Measurement
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Application Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-3xl grid-cols-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
                <TabsTrigger 
                  value="phone-bluetooth" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <Bluetooth className="h-4 w-4 mr-2" />
                  Phone Bluetooth
                </TabsTrigger>
                <TabsTrigger 
                  value="mobile-eeg" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Mobile EEG
                </TabsTrigger>
                <TabsTrigger 
                  value="insulin" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Insulin Prediction
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="phone-bluetooth" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Bluetooth className="h-6 w-6" />
                    Phone Bluetooth Connector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PhoneBluetoothConnector 
                    onPhoneConnected={handleBluetoothDeviceConnected}
                    onPhoneDisconnected={handleBluetoothDeviceDisconnected}
                    onError={handleBluetoothError}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mobile-eeg" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Activity className="h-6 w-6" />
                    Mobile-Optimized EEG Interface
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Touch-optimized interface for mobile EEG glucose measurement with gesture controls
                  </p>
                </CardHeader>
                <CardContent>
                  <MobileEEGOptimized 
                    onMeasurementComplete={(glucose, confidence) => {
                      setCurrentGlucose({
                        estimated_glucose: glucose,
                        confidence: confidence,
                        method: 'mobile-eeg',
                        timestamp: new Date().toISOString()
                      });
                    }}
                    onError={handleBluetoothError}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insulin" className="mt-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Target className="h-6 w-6" />
                    Meal Insulin Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MealInsulinDashboard 
                    eegGlucoseEstimate={currentGlucose}
                    onEEGGlucoseRequest={() => {
                      if (connectedBluetoothDevice) {
                        console.log('EEG glucose request for connected device:', connectedBluetoothDevice.name);
                      } else {
                        console.log('No Bluetooth device connected');
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Current Glucose Display */}
      {currentGlucose && (
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
                  Latest Glucose Reading
                </h3>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {currentGlucose} mg/dL
                </div>
                <p className="text-green-700 dark:text-green-300">
                  Measured via Phone Bluetooth Connection
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 dark:bg-gray-950">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            Phone Bluetooth Glucose Monitor - Connect your phone for torch control and glucose measurement
          </p>
        </div>
      </footer>
    </div>
  );
}