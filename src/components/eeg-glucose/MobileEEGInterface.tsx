import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Flashlight, 
  Brain, 
  Activity, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Zap,
  Target
} from 'lucide-react';

interface MobileEEGInterfaceProps {
  onMeasurementComplete: (glucose: number, confidence: number) => void;
  onError: (error: string) => void;
}

export function MobileEEGInterface({ onMeasurementComplete, onError }: MobileEEGInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementProgress, setMeasurementProgress] = useState(0);
  const [torchIntensity, setTorchIntensity] = useState(0.8);
  const [measurementDuration, setMeasurementDuration] = useState(30);
  const [currentGlucose, setCurrentGlucose] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const measurementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const torchRef = useRef<HTMLDivElement | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
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
    };

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (measurementIntervalRef.current) {
        clearInterval(measurementIntervalRef.current);
      }
    };
  }, [onMeasurementComplete, onError]);

  // Simulate torch effect
  useEffect(() => {
    if (isMeasuring && torchRef.current) {
      const torchElement = torchRef.current;
      torchElement.style.opacity = torchIntensity.toString();
      torchElement.style.animation = 'pulse 1s ease-in-out infinite';
    } else if (torchRef.current) {
      const torchElement = torchRef.current;
      torchElement.style.opacity = '0';
      torchElement.style.animation = 'none';
    }
  }, [isMeasuring, torchIntensity]);

  // Generate synthetic EEG data
  const generateEEGData = (): number[] => {
    const samplingRate = 256; // Hz
    const duration = 1; // 1 second of data
    const samples = samplingRate * duration;
    const eegData: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const t = i / samplingRate;
      
      // Simulate EEG signal with multiple frequency components
      const alpha = 0.5 * Math.sin(2 * Math.PI * 10 * t); // 10 Hz alpha waves
      const beta = 0.3 * Math.sin(2 * Math.PI * 20 * t);  // 20 Hz beta waves
      const theta = 0.2 * Math.sin(2 * Math.PI * 6 * t);  // 6 Hz theta waves
      const noise = 0.1 * (Math.random() - 0.5);          // Random noise
      
      eegData.push(alpha + beta + theta + noise);
    }
    
    return eegData;
  };

  const startMeasurement = async () => {
    if (!isConnected || !websocketRef.current) {
      onError('Not connected to EEG server');
      return;
    }

    setIsMeasuring(true);
    setMeasurementProgress(0);
    setCurrentGlucose(null);
    setConfidence(null);

    // Start torch simulation
    console.log(`🔦 Starting torch at ${torchIntensity * 100}% intensity`);

    // Simulate measurement progress
    const progressInterval = setInterval(() => {
      setMeasurementProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / measurementDuration);
      });
    }, 1000);

    // Send EEG data every second
    const dataInterval = setInterval(() => {
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        const eegData = generateEEGData();
        
        const eegMessage = {
          eeg_signal: eegData,
          timestamp: new Date().toISOString(),
          torch_intensity: torchIntensity,
          measurement_duration: measurementDuration,
          user_id: 'mobile-user'
        };
        
        websocketRef.current.send(JSON.stringify(eegMessage));
      }
    }, 1000);

    // Stop measurement after duration
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(dataInterval);
      setIsMeasuring(false);
      setMeasurementProgress(100);
    }, measurementDuration * 1000);
  };

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return { status: 'Low', color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100' };
    if (glucose > 180) return { status: 'High', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100' };
    return { status: 'Normal', color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mobile Interface Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Mobile EEG Glucose
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Revolutionary brain-based glucose monitoring
          </p>
        </CardHeader>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Torch Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flashlight className="h-5 w-5" />
            Torch Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Intensity</label>
            <div className="flex items-center gap-3">
              <Flashlight className="h-4 w-4" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={torchIntensity}
                onChange={(e) => setTorchIntensity(parseFloat(e.target.value))}
                className="flex-1"
                disabled={isMeasuring}
              />
              <span className="text-sm font-medium w-12">{Math.round(torchIntensity * 100)}%</span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Duration</label>
            <select
              value={measurementDuration}
              onChange={(e) => setMeasurementDuration(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
              disabled={isMeasuring}
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>

          {/* Torch Visual */}
          <div className="relative">
            <div className="w-full h-32 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div
                ref={torchRef}
                className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 opacity-0 transition-opacity duration-300"
                style={{ opacity: isMeasuring ? torchIntensity : 0 }}
              />
              <div className="relative z-10 text-white text-center">
                <Brain className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {isMeasuring ? 'Measuring...' : 'Place torch here'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Measurement */}
      <Button
        onClick={startMeasurement}
        disabled={!isConnected || isMeasuring}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {isMeasuring ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Measuring...
          </>
        ) : (
          <>
            <Zap className="h-5 w-5 mr-2" />
            Start EEG Measurement
          </>
        )}
      </Button>

      {/* Measurement Progress */}
      {isMeasuring && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(measurementProgress)}%</span>
              </div>
              <Progress value={measurementProgress} className="w-full" />
              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                Keep your phone torch on your forehead and stay still...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {currentGlucose && confidence && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              Measurement Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {currentGlucose} mg/dL
              </div>
              <Badge className={`${getGlucoseStatus(currentGlucose).color} mb-4`}>
                {getGlucoseStatus(currentGlucose).status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {Math.round(confidence * 100)}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  EEG
                </div>
                <div className="text-gray-600 dark:text-gray-400">Method</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div>Set torch intensity and measurement duration</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div>Place your phone torch gently on your forehead</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div>Stay still and relaxed during measurement</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <div>View your glucose estimate when complete</div>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> This is for research purposes only. 
              Do not replace traditional glucose monitoring methods.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
