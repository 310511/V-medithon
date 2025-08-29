import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Mic, Eye, TrendingUp, BarChart3, MessageSquare, FileText, Zap, Target, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Prediction {
  id: string;
  type: 'demand' | 'outbreak' | 'behavior' | 'supply' | 'risk';
  title: string;
  description: string;
  confidence: number;
  prediction: string;
  factors: string[];
  lastUpdated: string;
  status: 'active' | 'completed' | 'failed';
  accuracy: number;
}

interface NLPFeature {
  id: string;
  type: 'voice' | 'chatbot' | 'document' | 'sentiment' | 'report';
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  usageCount: number;
  lastUsed: string;
  language: string;
}

interface ComputerVision {
  id: string;
  type: 'recognition' | 'inspection' | 'counting' | 'processing' | 'monitoring';
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'processing';
  accuracy: number;
  processingTime: number;
  lastUsed: string;
  imageCount: number;
}

const AIMLEnhancementsDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [nlpFeatures, setNlpFeatures] = useState<NLPFeature[]>([]);
  const [computerVision, setComputerVision] = useState<ComputerVision[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Mock data
  useEffect(() => {
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        type: 'demand',
        title: 'Medicine Demand Forecast',
        description: 'Predicting medicine demand for next 30 days based on seasonal patterns and historical data',
        confidence: 87,
        prediction: '15% increase in cardiovascular medicines',
        factors: ['Seasonal flu', 'Weather patterns', 'Historical trends'],
        lastUpdated: '2024-02-15',
        status: 'active',
        accuracy: 92
      },
      {
        id: '2',
        type: 'outbreak',
        title: 'Disease Outbreak Prediction',
        description: 'Early warning system for potential disease outbreaks in the region',
        confidence: 94,
        prediction: 'Low risk of flu outbreak in next 2 weeks',
        factors: ['Vaccination rates', 'Weather conditions', 'Travel patterns'],
        lastUpdated: '2024-02-15',
        status: 'active',
        accuracy: 89
      },
      {
        id: '3',
        type: 'behavior',
        title: 'Patient Behavior Analysis',
        description: 'Analyzing patient medication adherence patterns',
        confidence: 78,
        prediction: '25% of patients likely to miss doses this week',
        factors: ['Previous adherence', 'Medication complexity', 'Age group'],
        lastUpdated: '2024-02-14',
        status: 'active',
        accuracy: 85
      }
    ];

    const mockNLPFeatures: NLPFeature[] = [
      {
        id: '1',
        type: 'voice',
        name: 'Voice Commands',
        description: 'Voice-controlled dashboard for hands-free operation',
        status: 'active',
        accuracy: 95,
        usageCount: 1250,
        lastUsed: '2024-02-15',
        language: 'English, Spanish'
      },
      {
        id: '2',
        type: 'chatbot',
        name: 'AI Customer Support',
        description: 'Intelligent chatbot for customer inquiries and support',
        status: 'active',
        accuracy: 88,
        usageCount: 3420,
        lastUsed: '2024-02-15',
        language: 'English'
      },
      {
        id: '3',
        type: 'document',
        name: 'Document Analysis',
        description: 'Extract data from medical documents and prescriptions',
        status: 'training',
        accuracy: 82,
        usageCount: 890,
        lastUsed: '2024-02-14',
        language: 'English'
      }
    ];

    const mockComputerVision: ComputerVision[] = [
      {
        id: '1',
        type: 'recognition',
        name: 'Medicine Recognition',
        description: 'Identify medicines from images using computer vision',
        status: 'active',
        accuracy: 96,
        processingTime: 2.5,
        lastUsed: '2024-02-15',
        imageCount: 1560
      },
      {
        id: '2',
        type: 'inspection',
        name: 'Quality Inspection',
        description: 'Visual quality control for medicine packaging',
        status: 'active',
        accuracy: 94,
        processingTime: 1.8,
        lastUsed: '2024-02-15',
        imageCount: 2340
      },
      {
        id: '3',
        type: 'counting',
        name: 'Inventory Counting',
        description: 'Automated stock counting using image processing',
        status: 'processing',
        accuracy: 91,
        processingTime: 3.2,
        lastUsed: '2024-02-14',
        imageCount: 890
      }
    ];

    setPredictions(mockPredictions);
    setNlpFeatures(mockNLPFeatures);
    setComputerVision(mockComputerVision);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 80) return 'bg-yellow-500';
    if (confidence >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const predictionTrendsData = [
    { month: 'Jan', accuracy: 85, confidence: 82 },
    { month: 'Feb', accuracy: 87, confidence: 84 },
    { month: 'Mar', accuracy: 89, confidence: 86 },
    { month: 'Apr', accuracy: 91, confidence: 88 },
    { month: 'May', accuracy: 93, confidence: 90 },
    { month: 'Jun', accuracy: 95, confidence: 92 }
  ];

  const modelPerformanceData = [
    { name: 'Demand Prediction', accuracy: 92, usage: 1250 },
    { name: 'Outbreak Detection', accuracy: 89, usage: 890 },
    { name: 'Behavior Analysis', accuracy: 85, usage: 1560 },
    { name: 'Voice Recognition', accuracy: 95, usage: 3420 },
    { name: 'Medicine Recognition', accuracy: 96, usage: 2340 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI & ML Enhancements</h1>
          <p className="text-gray-600 dark:text-gray-400">Advanced artificial intelligence and machine learning features</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Analytics
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Train New Model
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Advanced Predictions</TabsTrigger>
          <TabsTrigger value="nlp">Natural Language Processing</TabsTrigger>
          <TabsTrigger value="vision">Computer Vision</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Models</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{predictions.length + nlpFeatures.length + computerVision.length}</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9,460</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground">Average response</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Trends</CardTitle>
                <CardDescription>Accuracy and confidence improvements over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
                <CardDescription>Accuracy vs usage across different models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#3b82f6" />
                    <Bar dataKey="usage" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{prediction.title}</CardTitle>
                      <CardDescription>{prediction.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getConfidenceColor(prediction.confidence)}>
                        {prediction.confidence}% confidence
                      </Badge>
                      <Badge variant={prediction.status === 'active' ? 'default' : 'secondary'}>
                        {prediction.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Prediction</Label>
                      <p className="text-sm text-gray-600">{prediction.prediction}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Accuracy</Label>
                      <p className="text-sm text-gray-600">{prediction.accuracy}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p className="text-sm text-gray-600">{new Date(prediction.lastUpdated).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-gray-600">{prediction.type}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Key Factors</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Update Model</Button>
                    <Button size="sm">Run Prediction</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* NLP Tab */}
        <TabsContent value="nlp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nlpFeatures.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {feature.type === 'voice' && <Mic className="w-4 h-4" />}
                        {feature.type === 'chatbot' && <MessageSquare className="w-4 h-4" />}
                        {feature.type === 'document' && <FileText className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <CardDescription>{feature.type.toUpperCase()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <Badge variant="default">{feature.accuracy}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usage</span>
                    <Badge variant="outline">{feature.usageCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600">Language:</span>
                    <p className="text-sm text-gray-600">{feature.language}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Test</Button>
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button size="sm">Activate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Computer Vision Tab */}
        <TabsContent value="vision" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {computerVision.map((vision) => (
              <Card key={vision.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        <Eye className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{vision.name}</CardTitle>
                      <CardDescription>{vision.type.toUpperCase()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <Badge variant="default">{vision.accuracy}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processing Time</span>
                    <Badge variant="outline">{vision.processingTime}s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(vision.status)}>
                      {vision.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Images Processed</span>
                    <Badge variant="secondary">{vision.imageCount}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Test</Button>
                    <Button variant="outline" size="sm">Upload Image</Button>
                    <Button size="sm">Process Batch</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIMLEnhancementsDashboard;
