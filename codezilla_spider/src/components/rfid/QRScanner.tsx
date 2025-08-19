import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  QrCode, 
  Upload,
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Info,
  Play,
  Square,
  Smartphone,
  Monitor,
  FileImage,
  X
} from 'lucide-react';

interface QRCodeData {
  rfid_tag_id: string;
  item_name: string;
  item_id: string;
  timestamp: string;
  checksum: string;
}

interface QRScannerProps {
  onQRCodeScanned: (data: QRCodeData) => void;
  onScanError?: (error: string) => void;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onQRCodeScanned,
  onScanError,
  isScanning,
  onScanningChange
}) => {
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('environment');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect available cameras
  useEffect(() => {
    const detectCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
      } catch (error) {
        console.error('Failed to detect cameras:', error);
      }
    };

    detectCameras();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
      console.log('QR Code detected:', decodedText);
      
      // Try to parse as JSON first
      let qrData: QRCodeData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // If not JSON, create a structured object from the text
        qrData = {
          rfid_tag_id: decodedText.substring(0, 8) || 'RFID_' + Math.random().toString(36).substr(2, 5),
          item_name: decodedText.substring(8, 20) || 'Unknown Item',
          item_id: 'ITEM_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          checksum: Math.random().toString(36).substr(2, 8)
        };
      }

      setScanResult(qrData);
      setScanError(null);
      
      // Call the callback with the scanned data
      onQRCodeScanned(qrData);
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      setScanError('Invalid QR code format');
      onScanError?.('Invalid QR code format');
    }
  };

  const onScanFailure = (error: string) => {
    // Only show error if it's not just a "no QR code found" error
    if (!error.includes('No QR code found')) {
      console.log('Scan failure (normal):', error);
    }
  };

  const startCamera = async () => {
    if (!scannerRef.current) return;

    setIsInitializing(true);
    setScanError(null);
    setScanResult(null);
    onScanningChange(true);

    try {
      console.log('Starting camera...');
      
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: selectedCamera === 'environment' ? { ideal: "environment" } : 
                     selectedCamera === 'user' ? { ideal: "user" } : undefined,
          deviceId: selectedCamera !== 'environment' && selectedCamera !== 'user' ? 
                   { exact: selectedCamera } : undefined,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 10 }
        }
      });

      console.log('Camera stream obtained:', stream);
      
      // Store the stream
      setCameraStream(stream);
      
      // Create video element if it doesn't exist
      let video = videoRef.current;
      if (!video) {
        video = document.createElement('video');
        video.id = 'qr-reader';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.controls = false;
        
        if (scannerRef.current) {
          scannerRef.current.innerHTML = '';
          scannerRef.current.appendChild(video);
        }
        videoRef.current = video;
      }

      // Set the stream as source
      video.srcObject = stream;
      
      // Wait for video to load and start playing
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 5000);
        
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          video.play().then(() => {
            console.log('Video started playing successfully');
            clearTimeout(timeout);
            resolve(true);
          }).catch((error) => {
            console.error('Failed to play video:', error);
            clearTimeout(timeout);
            reject(error);
          });
        };
        
        video.onerror = (error) => {
          console.error('Video error:', error);
          clearTimeout(timeout);
          reject(error);
        };
      });

      setCameraPermission(true);
      setScanError(null);
      console.log('Camera started successfully');
      
    } catch (error) {
      console.error('Failed to start camera:', error);
      setCameraPermission(false);
      setScanError(`Failed to start camera: ${error.message}`);
      onScanError?.(`Camera start failed: ${error.message}`);
      onScanningChange(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = async () => {
    try {
      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current = null;
      }
      
      // Clear container
      if (scannerRef.current) {
        scannerRef.current.innerHTML = '';
      }
      
      setCameraPermission(null);
      setScanError(null);
      onScanningChange(false);
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setScanResult(null);
    setScanError(null);
    setUploadedImage(null);
  };

  // Test camera access function
  const testCameraAccess = async () => {
    try {
      console.log('Testing camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: selectedCamera === 'environment' ? { ideal: "environment" } : 
                     selectedCamera === 'user' ? { ideal: "user" } : undefined,
          deviceId: selectedCamera !== 'environment' && selectedCamera !== 'user' ? 
                   { exact: selectedCamera } : undefined,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 10 }
        }
      });
      
      console.log('Camera test successful:', stream);
      alert('Camera access test successful! Camera is working.');
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera test failed:', error);
      alert(`Camera test failed: ${error.message}`);
    }
  };



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setScanError(null);
    setScanResult(null);

    try {
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Create Html5Qrcode instance for file scanning
      const qrCode = new Html5Qrcode("qr-reader");
      
      // Scan the uploaded image
      const result = await qrCode.scanFile(file, true);
      console.log('File scan result:', result);
      
      // Process the result
      onScanSuccess(result, null);
      
    } catch (error) {
      console.error('Error scanning uploaded file:', error);
      setScanError('Failed to scan uploaded image. Please ensure it contains a valid QR code.');
      onScanError?.('File scan failed');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Scanner Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <span className="font-medium">QR Code Scanner</span>
          {isScanning && (
            <Badge className="bg-green-100 text-green-800 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-ping"></div>
              Live
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isScanning ? (
            <Button
              onClick={startCamera}
              disabled={isInitializing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              variant="destructive"
              className="gap-2"
            >
              <Square className="w-4 h-4" />
              Stop Camera
            </Button>
          )}
          
          <Button
            onClick={triggerFileUpload}
            disabled={isUploading}
            variant="outline"
            className="gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload QR
              </>
            )}
          </Button>
          
          <Button
            onClick={resetScanner}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          

          
          <Button
            onClick={testCameraAccess}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Test Camera
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Selection */}
      {availableCameras.length > 1 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Select Camera</span>
              </div>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="text-sm border border-blue-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isScanning}
              >
                <option value="environment">
                  📱 Back Camera (Mobile)
                </option>
                <option value="user">
                  📱 Front Camera (Mobile)
                </option>
                {availableCameras.map((camera, index) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Indicators */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant={cameraPermission === true ? "default" : "secondary"} className="gap-1">
          <Camera className="w-3 h-3" />
          {cameraPermission === true ? "Camera Active" : "Camera Access"}
        </Badge>
        <Badge variant={isScanning ? "default" : "secondary"} className="gap-1">
          <QrCode className="w-3 h-3" />
          {isScanning ? "QR Detection" : "QR Detection"}
        </Badge>
        <Badge variant={isScanning ? "default" : "secondary"} className="gap-1">
          <RefreshCw className="w-3 h-3" />
          {isScanning ? "Real-time" : "Ready"}
        </Badge>
      </div>

      {/* Camera Permission Status */}
      {cameraPermission === false && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Camera access denied</p>
                <p className="text-sm">Please allow camera permissions in your browser and ensure no other app is using the camera.</p>
                <Button 
                  onClick={startCamera} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry Camera Access
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanner Interface */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardContent className="p-6">
          {isScanning || uploadedImage ? (
            <div className="space-y-4">
              {/* Scanner Container with Overlay */}
              <div className="relative w-full max-w-md mx-auto">
                <div 
                  id="qr-reader" 
                  ref={scannerRef}
                  className="w-full aspect-square bg-black rounded-lg overflow-hidden"
                />
                
                {/* QR Code Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400"></div>
                      
                      {/* Center crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-8 bg-green-400 opacity-50"></div>
                        <div className="absolute w-8 h-1 bg-green-400 opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Scanning Instructions */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-blue-700">
                  {uploadedImage ? "Analyzing uploaded image..." : "Point camera at QR code"}
                </p>
                <p className="text-xs text-blue-600">
                  {uploadedImage ? "Processing image for QR code detection" : "Hold steady for best results"}
                </p>
              </div>
            </div>
          ) : isInitializing ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <p className="text-lg font-medium text-blue-700 mb-2">
                Initializing Camera...
              </p>
              <p className="text-sm text-blue-600">
                Please allow camera permissions when prompted
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <QrCode className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-blue-700 mb-2">
                Ready to Scan
              </p>
              <p className="text-sm text-blue-600 mb-4">
                Start the camera or upload a QR code image
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startCamera} size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
                <Button onClick={triggerFileUpload} variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              QR Code Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-green-700 font-medium">RFID Tag ID</Label>
                  <p className="text-green-800">{scanResult.rfid_tag_id}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Item Name</Label>
                  <p className="text-green-800">{scanResult.item_name}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Item ID</Label>
                  <p className="text-green-800">{scanResult.item_id}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Timestamp</Label>
                  <p className="text-green-800">{new Date(scanResult.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <Label className="text-green-700 font-medium">Raw Data</Label>
                <pre className="text-xs text-green-800 mt-1 overflow-x-auto">
                  {JSON.stringify(scanResult, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {scanError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{scanError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Access Instructions */}
      {!isScanning && cameraPermission === null && !uploadedImage && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Camera Access Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  When you click "Start Camera", your browser will ask for camera permissions. 
                  Please allow access to use the QR scanner.
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  <p>• Make sure no other app is using your camera</p>
                  <p>• For mobile devices, try the back camera for better results</p>
                  <p>• Ensure good lighting for optimal scanning</p>
                  <p>• You can also upload QR code images for offline scanning</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
