import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, Copy, RefreshCw } from 'lucide-react';

interface QRCodeData {
  rfid_tag_id: string;
  item_name: string;
  item_id: string;
  timestamp: string;
  checksum: string;
}

export const QRCodeGenerator: React.FC = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    rfid_tag_id: "RFID_TEST_001",
    item_name: "Test Medicine",
    item_id: "ITEM_TEST_001",
    timestamp: new Date().toISOString(),
    checksum: "test123"
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Auto-generate QR code on component mount
  React.useEffect(() => {
    const initialGenerate = async () => {
      setIsGenerating(true);
      try {
        const jsonString = JSON.stringify(qrData);
        const encodedData = encodeURIComponent(jsonString);
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
        console.log('Auto-generating QR code with URL:', qrApiUrl);
        
        const response = await fetch(qrApiUrl);
        if (response.ok) {
          setQrCodeUrl(qrApiUrl);
        }
      } catch (error) {
        console.error('Error auto-generating QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };
    
    initialGenerate();
  }, []);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const jsonString = JSON.stringify(qrData);
      const encodedData = encodeURIComponent(jsonString);
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
      console.log('Generating QR code with URL:', qrApiUrl);
      
      // Test if the URL is accessible
      const response = await fetch(qrApiUrl);
      if (response.ok) {
        setQrCodeUrl(qrApiUrl);
      } else {
        throw new Error('QR code generation failed');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
      alert('QR data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${qrData.rfid_tag_id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateRandomData = () => {
    const randomId = Math.random().toString(36).substr(2, 8).toUpperCase();
    const items = [
      "Aspirin 100mg",
      "Ibuprofen 200mg",
      "Paracetamol 500mg",
      "Vitamin C 1000mg",
      "Calcium Carbonate",
      "Iron Supplement",
      "Omega-3 Fish Oil",
      "Probiotic Capsule"
    ];
    
    setQrData({
      rfid_tag_id: `RFID_${randomId}`,
      item_name: items[Math.floor(Math.random() * items.length)],
      item_id: `ITEM_${randomId}`,
      timestamp: new Date().toISOString(),
      checksum: Math.random().toString(36).substr(2, 8)
    });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <QrCode className="w-5 h-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="rfid_tag_id">RFID Tag ID</Label>
              <Input
                id="rfid_tag_id"
                value={qrData.rfid_tag_id}
                onChange={(e) => setQrData({ ...qrData, rfid_tag_id: e.target.value })}
                placeholder="RFID_TAG_001"
              />
            </div>
            <div>
              <Label htmlFor="item_name">Item Name</Label>
              <Input
                id="item_name"
                value={qrData.item_name}
                onChange={(e) => setQrData({ ...qrData, item_name: e.target.value })}
                placeholder="Medicine Name"
              />
            </div>
            <div>
              <Label htmlFor="item_id">Item ID</Label>
              <Input
                id="item_id"
                value={qrData.item_id}
                onChange={(e) => setQrData({ ...qrData, item_id: e.target.value })}
                placeholder="ITEM_001"
              />
            </div>
            <div>
              <Label htmlFor="checksum">Checksum</Label>
              <Input
                id="checksum"
                value={qrData.checksum}
                onChange={(e) => setQrData({ ...qrData, checksum: e.target.value })}
                placeholder="abc123def456"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={generateQRCode}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>
              <Button
                onClick={generateRandomData}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Random
              </Button>
            </div>
            
            {qrCodeUrl && (
              <div className="space-y-3">
                <div className="text-center p-4 bg-white/70 rounded-lg border border-purple-200">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="mx-auto max-w-full h-auto"
                    onError={(e) => {
                      console.error('QR code image failed to load');
                      e.currentTarget.style.display = 'none';
                      // Show fallback text
                      const fallback = e.currentTarget.parentElement?.querySelector('.qr-fallback');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                  <div className="qr-fallback hidden text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">QR Code Preview Unavailable</p>
                    <p className="text-xs text-gray-500">Use the download button to save the QR code</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-white/50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-700 mb-2">Generated JSON Data:</h4>
          <pre className="text-xs text-purple-600 bg-purple-50 p-3 rounded overflow-x-auto">
            {JSON.stringify(qrData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
