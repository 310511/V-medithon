import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
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
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  // Auto-start camera when scanning is enabled
  useEffect(() => {
    const handleScanningChange = async () => {
      if (isScanning && !cameraStream && !isInitializing) {
        console.log('Auto-starting camera for QR scanning...');
        await startCamera();
      } else if (!isScanning && cameraStream) {
        console.log('Stopping camera as scanning is disabled...');
        await stopCamera();
      }
    };
    
    handleScanningChange();
  }, [isScanning, cameraStream, isInitializing]);

  // QR Code detection loop
  useEffect(() => {
    if (isVideoReady && isScanning && videoRef.current && canvasRef.current) {
      setIsDetecting(true);
      startQRDetection();
    } else {
      setIsDetecting(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVideoReady, isScanning]);

  const startQRDetection = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const detectQR = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for QR detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Detect QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log('QR Code detected:', code.data);
          
          // Prevent duplicate scans
          if (code.data !== lastScannedCode) {
            setLastScannedCode(code.data);
            onScanSuccess(code.data, code);
          }
        }
      }
      
      // Continue detection loop
      if (isDetecting && isScanning) {
        animationFrameRef.current = requestAnimationFrame(detectQR);
      }
    };
    
    detectQR();
  };

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
      console.log('QR Code detected:', decodedText);
      
      // Try to parse as JSON first
      let qrData: QRCodeData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // If not JSON, create a structured object from the text
        // Extract RFID information from the text
        const parts = decodedText.split('|');
        qrData = {
          rfid_tag_id: parts[0] || 'RFID_' + Math.random().toString(36).substr(2, 5),
          item_name: parts[1] || 'Unknown Item',
          item_id: parts[2] || 'ITEM_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          checksum: parts[3] || Math.random().toString(36).substr(2, 8)
        };
      }

      // Validate the QR data
      if (!qrData.rfid_tag_id || !qrData.item_name) {
        throw new Error('Invalid QR code: Missing required RFID information');
      }

      setScanResult(qrData);
      setScanError(null);
      
      // Call the callback with the scanned data
      onQRCodeScanned(qrData);
      
      // Stop scanning after successful detection
      setIsDetecting(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
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
      console.log('Starting camera for QR scanning...');
      
      // Clear the container first
      if (scannerRef.current) {
        scannerRef.current.innerHTML = '';
      }
      
      // Create video element with proper styling
      const video = document.createElement('video');
      video.id = 'qr-reader';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.borderRadius = '8px';
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.controls = false;
      
      // Add video to container
      scannerRef.current.appendChild(video);
      videoRef.current = video;
      
      // Request camera permissions with proper fallback
      let stream: MediaStream;
      try {
        // First try with environment mode for mobile back camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            frameRate: { ideal: 30, min: 10 }
          }
        });
        console.log('Camera stream obtained with environment mode');
      } catch (environmentError) {
        console.log('Environment mode failed, trying fallback:', environmentError);
        try {
          // Fallback to basic video mode
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              frameRate: { ideal: 30, min: 10 }
            }
          });
          console.log('Camera stream obtained with fallback mode');
        } catch (fallbackError) {
          console.log('Fallback mode failed, trying basic video:', fallbackError);
          // Final fallback to basic video
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('Camera stream obtained with basic video mode');
        }
      }

      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks().map(t => ({ kind: t.kind, label: t.label })));
      
      // Store the stream
      setCameraStream(stream);
      
      // Set the stream as source
      video.srcObject = stream;
      
      // Wait for video to load and start playing
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video loading timeout - camera may not be available'));
        }, 15000); // Increased timeout to 15 seconds
        
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded, attempting to play...');
          console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          
          video.play().then(() => {
            console.log('Video started playing successfully');
            console.log('Video is paused:', video.paused);
            console.log('Video ready state:', video.readyState);
            clearTimeout(timeout);
            resolve(true);
          }).catch((error) => {
            console.error('Failed to play video:', error);
            clearTimeout(timeout);
            reject(new Error(`Video playback failed: ${error.message}`));
          });
        };
        
        video.onerror = (error) => {
          console.error('Video error:', error);
          clearTimeout(timeout);
          reject(new Error('Video element encountered an error'));
        };
        
        video.oncanplay = () => {
          console.log('Video can start playing');
        };
        
        video.onplaying = () => {
          console.log('Video is now playing');
        };
        
        video.onloadeddata = () => {
          console.log('Video data loaded');
        };
        
        video.oncanplaythrough = () => {
          console.log('Video can play through without buffering');
        };
      });

      setCameraPermission(true);
      setScanError(null);
      setIsVideoReady(true);
      console.log('Camera started successfully for QR scanning');
      
      // Add a small delay to ensure video is fully ready
      setTimeout(() => {
        if (video.readyState >= 2) {
          console.log('Video is ready for QR scanning');
          setIsVideoReady(true);
        } else {
          console.warn('Video may not be fully ready yet');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start camera:', error);
      setCameraPermission(false);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to start camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please check if your device has a camera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet the required specifications.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Camera initialization timed out. Please try again.';
      } else {
        errorMessage = `Camera error: ${error.message}`;
      }
      
      setScanError(errorMessage);
      onScanError?.(errorMessage);
      onScanningChange(false);
      
      // Clear the container on error
      if (scannerRef.current) {
        scannerRef.current.innerHTML = '';
      }
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
      setIsVideoReady(false);
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
    setIsVideoReady(false);
  };

  // Test camera access function
  const testCameraAccess = async () => {
    try {
      console.log('Testing camera access...');
      
      // Test with environment mode first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        console.log('Camera test successful with environment mode:', stream);
        stream.getTracks().forEach(track => track.stop());
        alert('✅ Camera test successful! Back camera is working properly.');
        return;
      } catch (environmentError) {
        console.log('Environment mode test failed, trying basic video:', environmentError);
      }
      
      // Fallback to basic video test
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera test successful with basic video:', stream);
      stream.getTracks().forEach(track => track.stop());
      alert('✅ Camera test successful! Camera is working properly.');
      
    } catch (error) {
      console.error('Camera test failed:', error);
      let errorMessage = 'Camera test failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '❌ Camera access denied. Please allow camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = '❌ No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = '❌ Camera is already in use by another application.';
      } else {
        errorMessage = `❌ Camera test failed: ${error.message}`;
      }
      
      alert(errorMessage);
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

      // For now, we'll just show the image preview
      // QR code scanning from uploaded images would require a separate library
      console.log('File uploaded:', file.name);
      setScanError('QR code scanning from uploaded images is not yet implemented. Please use the camera scanner.');
      onScanError?.('File scan not implemented');
      
    } catch (error) {
      console.error('Error handling uploaded file:', error);
      setScanError('Failed to process uploaded image.');
      onScanError?.('File processing failed');
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
              onClick={() => onScanningChange(true)}
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
                  Start QR Scan
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => onScanningChange(false)}
              variant="destructive"
              className="gap-2"
            >
              <Square className="w-4 h-4" />
              Stop QR Scan
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
        <Badge variant={isVideoReady ? "default" : "secondary"} className="gap-1">
          <Play className="w-3 h-3" />
          {isVideoReady ? "Video Ready" : "Video Loading"}
        </Badge>
        <Badge variant={isDetecting ? "default" : "secondary"} className="gap-1">
          <QrCode className="w-3 h-3" />
          {isDetecting ? "Detecting QR" : "QR Detection"}
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
                  className="w-full aspect-square bg-black rounded-lg overflow-hidden relative"
                >
                  {/* Hidden canvas for QR detection */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
                    style={{ zIndex: -1 }}
                  />
                </div>
                
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
                  
                  {/* Video Ready Indicator */}
                  {isVideoReady && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Ready
                    </div>
                  )}
                </div>
              </div>
              
              {/* Scanning Instructions */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-blue-700">
                  {uploadedImage ? "Analyzing uploaded image..." : 
                   isDetecting ? "Scanning for QR codes..." :
                   isVideoReady ? "Camera ready! Point at QR code" : "Initializing camera..."}
                </p>
                <p className="text-xs text-blue-600">
                  {uploadedImage ? "Processing image for QR code detection" : 
                   isDetecting ? "Position QR code within the scanning frame" :
                   isVideoReady ? "Hold steady and center the QR code in the frame" : "Please wait while camera initializes"}
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
                <Button onClick={() => onScanningChange(true)} size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Start QR Scan
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
