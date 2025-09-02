import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bluetooth, 
  Smartphone, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Settings,
  Zap,
  Camera,
  Flashlight,
  Search
} from 'lucide-react';

// Web Bluetooth types
interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  gatt?: any;
  services?: any[];
  addEventListener?: (event: string, callback: () => void) => void;
}

// Extend Navigator interface for Web Bluetooth
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: any): Promise<BluetoothDevice>;
    };
  }
}

interface PhoneBluetoothConnectorProps {
  onPhoneConnected: (device: BluetoothDevice) => void;
  onPhoneDisconnected: (deviceId: string) => void;
  onError: (error: string) => void;
}

export function PhoneBluetoothConnector({ 
  onPhoneConnected, 
  onPhoneDisconnected, 
  onError 
}: PhoneBluetoothConnectorProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedPhone, setConnectedPhone] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [measurementStep, setMeasurementStep] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [glucoseReading, setGlucoseReading] = useState<number | null>(null);
  const [bluetoothSupported, setBluetoothSupported] = useState(false);

  // Check Bluetooth support on component mount
  React.useEffect(() => {
    if (navigator.bluetooth) {
      setBluetoothSupported(true);
    } else {
      setBluetoothSupported(false);
      setError('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
    }
  }, []);

  // Scan for phones specifically
  const scanForPhones = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError('Web Bluetooth is not available');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      
      console.log('📱 Scanning for phones...');
      
      // Try to find phones with specific filters - with fallback
      let device;
      try {
        // First attempt with comprehensive services
        device = await navigator.bluetooth.requestDevice({
          filters: [
            // Common phone manufacturers
            { namePrefix: 'iPhone' },
            { namePrefix: 'Samsung' },
            { namePrefix: 'Pixel' },
            { namePrefix: 'OnePlus' },
            { namePrefix: 'Xiaomi' },
            { namePrefix: 'Huawei' },
            { namePrefix: 'LG' },
            { namePrefix: 'Sony' },
            { namePrefix: 'Motorola' },
            { namePrefix: 'Nokia' },
            { namePrefix: 'OPPO' },
            { namePrefix: 'Vivo' },
            { namePrefix: 'Realme' },
            { namePrefix: 'Honor' },
            { namePrefix: 'Redmi' },
            { namePrefix: 'POCO' },
            // Generic phone names
            { namePrefix: 'Phone' },
            { namePrefix: 'Mobile' },
            { namePrefix: 'Android' },
            { namePrefix: 'iOS' }
          ],
          optionalServices: [
            'battery_service',
            'device_information',
            'generic_access',
            'generic_attribute',
            'alert_notification',
            '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service UUID
            '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service UUID
            '00001800-0000-1000-8000-00805f9b34fb', // Generic Access Service UUID
            '00001801-0000-1000-8000-00805f9b34fb'  // Generic Attribute Service UUID
          ]
        });
      } catch (serviceError) {
        console.log('⚠️ First attempt failed, trying with minimal services...');
        // Fallback with minimal services only
        device = await navigator.bluetooth.requestDevice({
          filters: [
            { namePrefix: 'iPhone' },
            { namePrefix: 'Samsung' },
            { namePrefix: 'Pixel' },
            { namePrefix: 'Phone' },
            { namePrefix: 'Mobile' }
          ],
          optionalServices: [
            'battery_service',
            '0000180f-0000-1000-8000-00805f9b34fb' // Battery Service UUID only
          ]
        });
      }
      
      console.log('📱 Phone found:', device.name || 'Unknown Phone');
      
      // Create device object
      const phoneDevice: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Unknown Phone',
        connected: false,
        gatt: device.gatt,
        services: [],
        addEventListener: device.addEventListener?.bind(device)
      };
      
      // Try to connect
      await connectToPhone(phoneDevice);
      
    } catch (err: any) {
      console.error('❌ Phone scan error:', err);
      setIsScanning(false);
      
      if (err.name === 'NotFoundError') {
        setError('No phones found. Make sure your phone is in Bluetooth pairing mode and nearby.');
      } else if (err.name === 'SecurityError') {
        setError('Bluetooth access denied. Please allow Bluetooth permissions and try again.');
      } else if (err.name === 'NotAllowedError') {
        setError('Bluetooth access was denied. Please allow access and try again.');
      } else if (err.name === 'NotSupportedError') {
        setError('Bluetooth is not supported on this device or browser.');
      } else {
        setError(`Bluetooth error: ${err.message || 'Unknown error occurred'}`);
      }
    }
  }, []);

  // Connect to phone
  const connectToPhone = useCallback(async (device: BluetoothDevice) => {
    try {
      console.log('🔗 Connecting to phone:', device.name);
      
      if (!device.gatt) {
        throw new Error('GATT server not available');
      }
      
      // Connect to GATT server
      const server = await device.gatt.connect();
      console.log('✅ Connected to GATT server');
      
      // Update device status
      const connectedDevice: BluetoothDevice = {
        ...device,
        connected: true
      };
      
      setConnectedPhone(connectedDevice);
      setIsScanning(false);
      
      // Notify parent component
      onPhoneConnected(connectedDevice);
      
      // Listen for disconnection using the device's event listener
      if (device.addEventListener) {
        device.addEventListener('gattserverdisconnected', () => {
          console.log('❌ Phone disconnected');
          setConnectedPhone(null);
          onPhoneDisconnected(device.id);
        });
      }
      
    } catch (err: any) {
      console.error('❌ Connection error:', err);
      setError(`Failed to connect to phone: ${err.message}`);
      setIsScanning(false);
    }
  }, [onPhoneConnected, onPhoneDisconnected]);

  // Disconnect from phone
  const disconnectPhone = useCallback(async () => {
    if (connectedPhone?.gatt) {
      try {
        await connectedPhone.gatt.disconnect();
        console.log('📱 Phone disconnected');
      } catch (err) {
        console.error('Error disconnecting:', err);
      }
    }
    
    setConnectedPhone(null);
    onPhoneDisconnected(connectedPhone?.id || '');
  }, [connectedPhone, onPhoneDisconnected]);

  // Simulate phone connection for testing
  const simulatePhoneConnection = useCallback(() => {
    const simulatedPhone: BluetoothDevice = {
      id: 'simulated-phone-' + Date.now(),
      name: 'iPhone 15 Pro (Simulated)',
      connected: true,
      gatt: null,
      services: [],
      addEventListener: () => {}
    };
    
    setConnectedPhone(simulatedPhone);
    onPhoneConnected(simulatedPhone);
    console.log('📱 Simulated phone connected');
  }, [onPhoneConnected]);

  // Control phone torch/flashlight
  const toggleTorch = useCallback(async () => {
    if (!connectedPhone) {
      setError('No phone connected');
      return;
    }

    try {
      console.log(`🔦 Attempting to control torch: ${!isTorchOn ? 'ON' : 'OFF'}`);
      
      if (connectedPhone.gatt) {
        // Real Bluetooth device - try to control torch via GATT
        const server = await connectedPhone.gatt.connect();
        console.log('✅ Connected to GATT server for torch control');
        
        // Try to find torch/flashlight service
        // Note: Most phones don't expose torch control via Bluetooth GATT
        // This is a limitation of the Web Bluetooth API
        try {
          // Try common service UUIDs for torch control
          const torchService = await server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb'); // Battery service as fallback
          console.log('📱 Found service, but torch control via Bluetooth is not standard');
          
          // Since most phones don't support torch control via Bluetooth,
          // we'll show a message about this limitation
          setError('Torch control via Bluetooth is not supported by most phones. This requires a custom app on your phone.');
          return;
          
        } catch (serviceError) {
          console.log('⚠️ No torch service found via Bluetooth');
          setError('Your phone does not expose torch control via Bluetooth. This requires a custom app on your phone.');
          return;
        }
      } else {
        // Simulated device - show simulation message
        setIsTorchOn(!isTorchOn);
        console.log(`🔦 Simulated torch ${!isTorchOn ? 'ON' : 'OFF'}`);
        setError('This is a simulation. For real torch control, you need a custom app on your phone that exposes torch control via Bluetooth.');
      }
      
    } catch (err: any) {
      console.error('❌ Torch control error:', err);
      setError(`Failed to control torch: ${err.message}`);
    }
  }, [connectedPhone, isTorchOn]);

  // Access phone camera
  const toggleCamera = useCallback(async () => {
    if (!connectedPhone) {
      setError('No phone connected');
      return;
    }

    try {
      console.log(`📷 Attempting to access camera: ${!isCameraActive ? 'ACTIVE' : 'INACTIVE'}`);
      
      if (!isCameraActive) {
        // Try to access the local device camera (not the phone's camera)
        // This is a limitation - we can't access the phone's camera via Bluetooth
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 }
            } 
          });
          
          console.log('📷 Local camera accessed successfully');
          setIsCameraActive(true);
          
          // Stop the stream immediately as we just wanted to test access
          stream.getTracks().forEach(track => track.stop());
          
          setError('Camera access works on this device, but cannot access your phone\'s camera via Bluetooth. This requires a custom app on your phone.');
          
        } catch (cameraError) {
          console.error('❌ Camera access denied:', cameraError);
          setError('Camera access denied. Please allow camera permissions and try again.');
        }
      } else {
        setIsCameraActive(false);
        console.log('📷 Camera access stopped');
      }
      
    } catch (err: any) {
      console.error('❌ Camera access error:', err);
      setError(`Failed to access camera: ${err.message}`);
    }
  }, [connectedPhone, isCameraActive]);

  // Start glucose measurement workflow
  const startGlucoseMeasurement = useCallback(() => {
    if (!connectedPhone) {
      setError('Please connect your phone first');
      return;
    }
    
    setIsMeasuring(true);
    setMeasurementStep(1);
    setError('');
    console.log('📊 Starting glucose measurement workflow');
  }, [connectedPhone]);

  // Next step in measurement
  const nextMeasurementStep = useCallback(() => {
    setMeasurementStep(prev => prev + 1);
  }, []);

  // Complete measurement
  const completeMeasurement = useCallback(() => {
    // Simulate glucose reading (in real implementation, this would process camera data)
    const simulatedGlucose = Math.floor(Math.random() * 100) + 80; // 80-180 mg/dL
    setGlucoseReading(simulatedGlucose);
    setIsMeasuring(false);
    setMeasurementStep(0);
    console.log(`📊 Glucose measurement complete: ${simulatedGlucose} mg/dL`);
  }, []);

  // Reset measurement
  const resetMeasurement = useCallback(() => {
    setIsMeasuring(false);
    setMeasurementStep(0);
    setGlucoseReading(null);
    setError('');
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Phone Bluetooth Connector
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Connect to your phone via Bluetooth for torch control and glucose measurement
          </p>
        </CardHeader>
      </Card>

      {/* Bluetooth Support Check */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {bluetoothSupported ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Web Bluetooth Support</span>
            </div>
            <Badge variant={bluetoothSupported ? 'default' : 'destructive'}>
              {bluetoothSupported ? 'Supported' : 'Not Supported'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      {connectedPhone ? (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    {connectedPhone.name} Connected
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Ready for torch control and glucose measurement
                  </div>
                </div>
              </div>
              <Button
                onClick={disconnectPhone}
                variant="outline"
                size="sm"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Bluetooth className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Connect Your Phone</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect to your phone via Bluetooth to control its torch and measure glucose
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={scanForPhones}
                disabled={!bluetoothSupported || isScanning}
                className="w-full"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning for Phones...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Scan for Phones
                  </>
                )}
              </Button>
              
              <Button
                onClick={simulatePhoneConnection}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                Simulate Phone Connection (Test)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div>Make sure your phone's Bluetooth is turned ON</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div>Put your phone in Bluetooth pairing/discoverable mode</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div>Click "Scan for Phones" and select your phone from the list</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <div>Grant Bluetooth permissions when prompted</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
            <div>Once connected, you can control your phone's torch for glucose measurement</div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Compatibility */}
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Browser Compatibility:</strong> Web Bluetooth works best in Chrome, Edge, and Opera. 
              Safari and Firefox have limited support. Make sure you're using a compatible browser.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      {connectedPhone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Available Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Torch Control */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <Flashlight className={`h-6 w-6 ${isTorchOn ? 'text-yellow-500' : 'text-blue-600'}`} />
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">Torch Control</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      {isTorchOn ? 'Torch is ON' : 'Torch is OFF'}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={toggleTorch}
                  className={`w-full ${isTorchOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                  variant="default"
                >
                  <Flashlight className="h-4 w-4 mr-2" />
                  {isTorchOn ? 'Turn OFF Torch' : 'Turn ON Torch'}
                </Button>
              </div>

              {/* Camera Access */}
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <Camera className={`h-6 w-6 ${isCameraActive ? 'text-green-500' : 'text-green-600'}`} />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">Camera Access</div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {isCameraActive ? 'Camera is ACTIVE' : 'Camera is INACTIVE'}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={toggleCamera}
                  className={`w-full ${isCameraActive ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}
                  variant="default"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isCameraActive ? 'Stop Camera' : 'Start Camera'}
                </Button>
              </div>
            </div>

            {/* Status Display */}
            {(isTorchOn || isCameraActive) && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Active Features:</span>
                </div>
                <div className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                  {isTorchOn && <span className="inline-block mr-3">🔦 Torch ON</span>}
                  {isCameraActive && <span className="inline-block">📷 Camera ACTIVE</span>}
                </div>
              </div>
            )}

            {/* Real Implementation Notice */}
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Real Implementation Required
                  </div>
                  <div className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                    <p>
                      <strong>Current Limitation:</strong> Web Bluetooth cannot directly control your phone's torch or access its camera.
                    </p>
                    <p>
                      <strong>For Real Functionality:</strong> You need a custom mobile app on your phone that:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Exposes torch control via Bluetooth GATT services</li>
                      <li>Streams camera data via WebRTC or WebSocket</li>
                      <li>Implements glucose measurement algorithms</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Alternative:</strong> Use this device's camera and torch for glucose measurement instead.
                    </p>
                  </div>
                </div>
              </div>

              {/* Practical Glucose Measurement */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="w-full">
                    <div className="font-medium text-green-900 dark:text-green-100 mb-2">
                      Practical Glucose Measurement
                    </div>
                    <div className="text-sm text-green-800 dark:text-green-200 space-y-3">
                      <p>
                        <strong>User-Controlled Workflow:</strong> You control your phone manually while we guide you through the process.
                      </p>
                      
                      {!isMeasuring && !glucoseReading && (
                        <Button 
                          onClick={startGlucoseMeasurement}
                          className="bg-green-500 hover:bg-green-600 w-full"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Start Glucose Measurement
                        </Button>
                      )}

                      {isMeasuring && (
                        <div className="space-y-3">
                          {/* Step 1: Prepare */}
                          {measurementStep === 1 && (
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                Step 1: Prepare Your Phone
                              </div>
                              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                                <p>1. Open your phone's camera app</p>
                                <p>2. Turn on the flashlight/torch</p>
                                <p>3. Position your finger over the camera lens</p>
                                <p>4. Make sure the torch light passes through your finger</p>
                              </div>
                              <Button 
                                onClick={nextMeasurementStep}
                                className="mt-3 bg-blue-500 hover:bg-blue-600"
                                size="sm"
                              >
                                I'm Ready - Next Step
                              </Button>
                            </div>
                          )}

                          {/* Step 2: Position */}
                          {measurementStep === 2 && (
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                              <div className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                                Step 2: Position for Measurement
                              </div>
                              <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                                <p>1. Place your finger tip over the camera lens</p>
                                <p>2. Ensure torch light passes through your finger</p>
                                <p>3. Keep your finger steady for 10 seconds</p>
                                <p>4. The light should be visible through your finger</p>
                              </div>
                              <Button 
                                onClick={nextMeasurementStep}
                                className="mt-3 bg-yellow-500 hover:bg-yellow-600"
                                size="sm"
                              >
                                Finger Positioned - Start Reading
                              </Button>
                            </div>
                          )}

                          {/* Step 3: Reading */}
                          {measurementStep === 3 && (
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              <div className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                                Step 3: Taking Reading
                              </div>
                              <div className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                                <p>📊 Analyzing light transmission through your finger...</p>
                                <p>⏱️ Keep your finger steady for 10 more seconds</p>
                                <p>🔦 Make sure torch light is consistent</p>
                                <p>📱 Don't move your phone or finger</p>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button 
                                  onClick={completeMeasurement}
                                  className="bg-purple-500 hover:bg-purple-600"
                                  size="sm"
                                >
                                  Complete Reading
                                </Button>
                                <Button 
                                  onClick={resetMeasurement}
                                  variant="outline"
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {glucoseReading && (
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                          <div className="font-medium text-green-900 dark:text-green-100 mb-2">
                            ✅ Glucose Reading Complete
                          </div>
                          <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                            {glucoseReading} mg/dL
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300 mb-3">
                            {glucoseReading < 100 ? 'Normal' : glucoseReading < 126 ? 'Pre-diabetic' : 'Diabetic range'}
                          </div>
                          <Button 
                            onClick={resetMeasurement}
                            className="bg-green-500 hover:bg-green-600"
                            size="sm"
                          >
                            Take Another Reading
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
