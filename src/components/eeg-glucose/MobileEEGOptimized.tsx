import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Bluetooth, 
  Flashlight,
  Camera,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';
import { useMobilePerformance } from '@/hooks/useMobilePerformance';
import { useMobileGestures } from '@/hooks/useMobileGestures';

interface MobileEEGOptimizedProps {
  onMeasurementComplete: (glucose: number, confidence: number) => void;
  onError: (error: string) => void;
}

export function MobileEEGOptimized({ onMeasurementComplete, onError }: MobileEEGOptimizedProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementProgress, setMeasurementProgress] = useState(0);
  const [currentGlucose, setCurrentGlucose] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [signalStrength, setSignalStrength] = useState<number | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const measurementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const torchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mobile performance optimization
  const { metrics, shouldReduceAnimations, getOptimalImageQuality } = useMobilePerformance();
  
  // Mobile gestures
  const { onSwipeUp, onSwipeDown, onLongPress, onDoubleTap } = useMobileGestures({
    onSwipeUp: () => toggleTorch(),
    onSwipeDown: () => toggleCamera(),
    onLongPress: () => startMeasurement(),
    onDoubleTap: () => stopMeasurement()
  });

  // Check mobile device capabilities
  useEffect(() => {
    // Check battery API if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }

    // Check connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType) {
        const signalMap: { [key: string]: number } = {
          'slow-2g': 1,
          '2g': 2,
          '3g': 3,
          '4g': 4
        };
        setSignalStrength(signalMap[connection.effectiveType] || 3);
      }
    }
  }, []);

  // Connect to EEG WebSocket
  const connectToEEG = useCallback(() => {
    const deviceId = `mobile_${Date.now()}`;
    const wsUrl = `ws://localhost:8002/ws/eeg/${deviceId}`;
    
    try {
      websocketRef.current = new WebSocket(wsUrl);
      
      websocketRef.current.onopen = () => {
        console.log('✅ Connected to EEG server');
        setIsConnected(true);
      };
      
      websocketRef.current.onmessage = (event) => {
        try {
          const glucoseEstimate = JSON.parse(event.data);
          setCurrentGlucose(glucoseEstimate.estimated_glucose);
          setConfidence(glucoseEstimate.confidence);
          setIsMeasuring(false);
          setMeasurementProgress(0);
          onMeasurementComplete(glucoseEstimate.estimated_glucose, glucoseEstimate.confidence);
        } catch (err) {
          console.error('Error parsing glucose estimate:', err);
          onError('Failed to parse glucose estimate');
        }
      };
      
      websocketRef.current.onclose = () => {
        console.log('❌ Disconnected from EEG server');
        setIsConnected(false);
        setIsMeasuring(false);
      };
      
      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError('Connection failed. Please check if the EEG server is running.');
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      onError('Failed to connect to EEG server');
    }
  }, [onMeasurementComplete, onError]);

  // Start measurement with mobile optimizations
  const startMeasurement = useCallback(() => {
    if (!isConnected || isMeasuring) return;
    
    setIsMeasuring(true);
    setMeasurementProgress(0);
    
    // Simulate measurement progress with mobile-optimized intervals
    const progressInterval = setInterval(() => {
      setMeasurementProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsMeasuring(false);
          // Simulate glucose reading
          const simulatedGlucose = 85 + Math.random() * 30;
          const simulatedConfidence = 85 + Math.random() * 10;
          setCurrentGlucose(simulatedGlucose);
          setConfidence(simulatedConfidence);
          onMeasurementComplete(simulatedGlucose, simulatedConfidence);
          return 100;
        }
        return prev + 2;
      });
    }, shouldReduceAnimations() ? 100 : 50);
    
    measurementIntervalRef.current = progressInterval;
  }, [isConnected, isMeasuring, shouldReduceAnimations, onMeasurementComplete]);

  // Stop measurement
  const stopMeasurement = useCallback(() => {
    if (measurementIntervalRef.current) {
      clearInterval(measurementIntervalRef.current);
      measurementIntervalRef.current = null;
    }
    setIsMeasuring(false);
    setMeasurementProgress(0);
  }, []);

  // Toggle torch with mobile optimization
  const toggleTorch = useCallback(async () => {
    try {
      if (!isCameraActive) {
        // Request camera access first
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();
        
        if (capabilities.torch) {
          await videoTrack.applyConstraints({ 
            advanced: [{ torch: !isTorchOn }] 
          });
          setIsTorchOn(!isTorchOn);
        } else {
          onError('Torch not supported on this device');
        }
        
        // Stop the stream to save battery
        stream.getTracks().forEach(track => track.stop());
      } else {
        // If camera is already active, just toggle torch
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        await videoTrack.applyConstraints({ 
          advanced: [{ torch: !isTorchOn }] 
        });
        setIsTorchOn(!isTorchOn);
      }
    } catch (err) {
      console.error('Torch toggle error:', err);
      onError('Failed to toggle torch. Please check camera permissions.');
    }
  }, [isTorchOn, isCameraActive, onError]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    try {
      if (!isCameraActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraActive(true);
        // Auto-stop camera after 30 seconds to save battery
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          setIsCameraActive(false);
        }, 30000);
      } else {
        setIsCameraActive(false);
      }
    } catch (err) {
      console.error('Camera toggle error:', err);
      onError('Failed to access camera. Please check permissions.');
    }
  }, [isCameraActive, onError]);

  // Initialize connection on mount
  useEffect(() => {
    connectToEEG();
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (measurementIntervalRef.current) {
        clearInterval(measurementIntervalRef.current);
      }
      if (torchIntervalRef.current) {
        clearInterval(torchIntervalRef.current);
      }
    };
  }, [connectToEEG]);

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      {/* Mobile Status Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="font-medium">Mobile EEG</span>
            </div>
            <div className="flex items-center gap-3">
              {batteryLevel && (
                <div className="flex items-center gap-1">
                  <Battery className="h-4 w-4" />
                  <span>{batteryLevel}%</span>
                </div>
              )}
              {signalStrength && (
                <div className="flex items-center gap-1">
                  <Signal className="h-4 w-4" />
                  <span>{signalStrength}/4</span>
                </div>
              )}
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <div className="font-medium">
                  {isConnected ? 'EEG Connected' : 'EEG Disconnected'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? 'Ready for measurement' : 'Connecting...'}
                </div>
              </div>
            </div>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Controls */}
      <div className="grid grid-cols-2 gap-3">
        {/* Torch Control */}
        <Card className="touch-manipulation">
          <CardContent className="p-4 text-center">
            <Flashlight className={`h-8 w-8 mx-auto mb-2 ${isTorchOn ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div className="text-sm font-medium mb-2">Torch</div>
            <Button
              onClick={toggleTorch}
              className={`w-full ${isTorchOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'}`}
              size="sm"
            >
              {isTorchOn ? 'ON' : 'OFF'}
            </Button>
          </CardContent>
        </Card>

        {/* Camera Control */}
        <Card className="touch-manipulation">
          <CardContent className="p-4 text-center">
            <Camera className={`h-8 w-8 mx-auto mb-2 ${isCameraActive ? 'text-green-500' : 'text-gray-400'}`} />
            <div className="text-sm font-medium mb-2">Camera</div>
            <Button
              onClick={toggleCamera}
              className={`w-full ${isCameraActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
              size="sm"
            >
              {isCameraActive ? 'ON' : 'OFF'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Measurement Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Glucose Measurement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMeasuring && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Measuring...</span>
                <span>{measurementProgress}%</span>
              </div>
              <Progress value={measurementProgress} className="h-2" />
            </div>
          )}

          {currentGlucose && (
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {currentGlucose.toFixed(1)} mg/dL
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Confidence: {confidence?.toFixed(1)}%
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={startMeasurement}
              disabled={!isConnected || isMeasuring}
              className="w-full"
              size="lg"
            >
              {isMeasuring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Measuring...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={stopMeasurement}
              disabled={!isMeasuring}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Gesture Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium mb-2">📱 Mobile Gestures:</div>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Swipe Up:</strong> Toggle Torch</li>
              <li>• <strong>Swipe Down:</strong> Toggle Camera</li>
              <li>• <strong>Long Press:</strong> Start Measurement</li>
              <li>• <strong>Double Tap:</strong> Stop Measurement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      {metrics.isLowEndDevice && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low-end device detected.</strong> Some features may be limited for better performance.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
