import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  BarChart3,
  Brain,
  Activity,
  Sparkles,
  RefreshCw,
  Download,
  Search,
  Calendar,
  Target,
  Zap
} from "lucide-react";

interface Prediction {
  item_name: string;
  prediction: {
  current_stock: number;
    predicted_demand: number;
  days_until_stockout: number;
  threshold: number;
    confidence_score: number;
    trend_direction: string;
    category: string;
  };
}

export const EnhancedMLPredictionsDashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  useEffect(() => {
    const mockPredictions: Prediction[] = [
      {
        item_name: "Paracetamol 500mg",
        prediction: {
          current_stock: 45,
          predicted_demand: 12.5,
          days_until_stockout: 3,
          threshold: 100,
          confidence_score: 0.85,
          trend_direction: "increasing",
          category: "Pain Relief"
        }
      },
      {
        item_name: "Amoxicillin 250mg",
        prediction: {
          current_stock: 120,
          predicted_demand: 8.2,
          days_until_stockout: 14,
          threshold: 50,
          confidence_score: 0.92,
          trend_direction: "stable",
          category: "Antibiotics"
        }
      }
    ];

    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStockLevelPercentage = (current: number, threshold: number) => {
    return Math.min((current / threshold) * 100, 100);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredPredictions = () => {
    return predictions.filter(item => 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const urgentItems = filteredPredictions().filter(item => item.prediction.days_until_stockout <= 7);
  const moderateItems = filteredPredictions().filter(item => 
    item.prediction.days_until_stockout > 7 && item.prediction.days_until_stockout <= 14
  );
  const safeItems = filteredPredictions().filter(item => item.prediction.days_until_stockout > 14);

  if (loading) {
  return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading predictions...</p>
                </div>
                </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
          <h2 className="text-2xl font-bold text-gray-800">ML Predictions Dashboard</h2>
          <p className="text-gray-600">AI-powered inventory forecasting and stock management</p>
                    </div>
        <Badge className="bg-gradient-to-r from-pink-500 to-red-600 text-white">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
                    </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
          placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Urgent Items */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-5 w-5" />
              Critical Alerts ({urgentItems.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
            {urgentItems.length > 0 ? (
              urgentItems.map((item, index) => (
                <div key={index} className="border border-red-200 rounded-xl p-4 bg-gradient-to-r from-red-50 to-pink-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{item.item_name}</h4>
                              <Badge variant="destructive" className="font-medium">
                                {item.prediction.days_until_stockout} days left
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{item.prediction.category}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Current Stock</p>
                                <p className="text-lg font-bold text-red-600">{item.prediction.current_stock}</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Predicted Demand</p>
                                <p className="text-lg font-bold">{item.prediction.predicted_demand.toFixed(1)}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock Level</span>
                                <span className="font-medium">{getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold)} 
                                className="h-2 bg-gray-200"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Critical Alerts</h3>
                          <p className="text-gray-600">All items are well-stocked</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Moderate Items */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-700">
                        <Clock className="h-5 w-5" />
              Watch List ({moderateItems.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
            {moderateItems.length > 0 ? (
              moderateItems.map((item, index) => (
                <div key={index} className="border border-yellow-200 rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{item.item_name}</h4>
                              <Badge variant="secondary" className="font-medium">
                                {item.prediction.days_until_stockout} days left
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{item.prediction.category}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Current Stock</p>
                                <p className="text-lg font-bold text-yellow-600">{item.prediction.current_stock}</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Predicted Demand</p>
                                <p className="text-lg font-bold">{item.prediction.predicted_demand.toFixed(1)}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock Level</span>
                                <span className="font-medium">{getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold)} 
                                className="h-2 bg-gray-200"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Items in Watch List</h3>
                          <p className="text-gray-600">All items are well-stocked</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

        {/* Safe Items */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Well Stocked ({safeItems.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
            {safeItems.length > 0 ? (
              safeItems.map((item, index) => (
                <div key={index} className="border border-green-200 rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{item.item_name}</h4>
                    <Badge className="bg-green-100 text-green-700 font-medium">
                                {item.prediction.days_until_stockout} days left
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{item.prediction.category}</p>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Current Stock</p>
                      <p className="text-lg font-bold text-green-600">{item.prediction.current_stock}</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-xs text-gray-500">Predicted Demand</p>
                                <p className="text-lg font-bold">{item.prediction.predicted_demand.toFixed(1)}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock Level</span>
                                <span className="font-medium">{getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold)} 
                                className="h-2 bg-gray-200"
                              />
                            </div>
                                </div>
              ))
            ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Items in Safe Zone</h3>
                <p className="text-gray-600">All items need attention</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-pink-50 to-red-50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-pink-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
                    </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Restock
                    </Button>
            <Button variant="outline" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </Button>
            <Button variant="outline" className="gap-2">
              <Target className="w-4 h-4" />
              Set Alerts
            </Button>
                  </div>
                      </CardContent>
                    </Card>
                  </div>
  );
}; 
