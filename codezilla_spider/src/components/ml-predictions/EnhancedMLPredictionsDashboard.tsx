import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  BarChart3,
  Brain,
  RefreshCw,
  Download,
  Search,
  Calendar,
  Target,
  Zap,
  Eye,
  Settings,
  Bell,
  Minus
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
    last_updated: string;
    risk_level: 'critical' | 'warning' | 'safe';
  };
}

interface PredictionStats {
  total_items: number;
  critical_items: number;
  warning_items: number;
  safe_items: number;
  avg_confidence: number;
  last_updated: string;
}

export const EnhancedMLPredictionsDashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("risk");
  const [stats, setStats] = useState<PredictionStats | null>(null);

  // Enhanced mock data with more realistic predictions
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
          category: "Pain Relief",
          last_updated: new Date().toISOString(),
          risk_level: "critical"
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
          category: "Antibiotics",
          last_updated: new Date().toISOString(),
          risk_level: "warning"
        }
      },
      {
        item_name: "Ibuprofen 400mg",
        prediction: {
          current_stock: 200,
          predicted_demand: 6.8,
          days_until_stockout: 29,
          threshold: 80,
          confidence_score: 0.78,
          trend_direction: "decreasing",
          category: "Pain Relief",
          last_updated: new Date().toISOString(),
          risk_level: "safe"
        }
      },
      {
        item_name: "Omeprazole 20mg",
        prediction: {
          current_stock: 85,
          predicted_demand: 15.3,
          days_until_stockout: 5,
          threshold: 120,
          confidence_score: 0.89,
          trend_direction: "increasing",
          category: "Gastrointestinal",
          last_updated: new Date().toISOString(),
          risk_level: "critical"
        }
      },
      {
        item_name: "Metformin 500mg",
        prediction: {
          current_stock: 150,
          predicted_demand: 9.1,
          days_until_stockout: 16,
          threshold: 100,
          confidence_score: 0.91,
          trend_direction: "stable",
          category: "Diabetes Care",
          last_updated: new Date().toISOString(),
          risk_level: "warning"
        }
      }
    ];

    setTimeout(() => {
      setPredictions(mockPredictions);
      
      // Calculate stats
      const critical = mockPredictions.filter(p => p.prediction.risk_level === 'critical').length;
      const warning = mockPredictions.filter(p => p.prediction.risk_level === 'warning').length;
      const safe = mockPredictions.filter(p => p.prediction.risk_level === 'safe').length;
      const avgConfidence = mockPredictions.reduce((sum, p) => sum + p.prediction.confidence_score, 0) / mockPredictions.length;
      
      setStats({
        total_items: mockPredictions.length,
        critical_items: critical,
        warning_items: warning,
        safe_items: safe,
        avg_confidence: avgConfidence,
        last_updated: new Date().toISOString()
      });
      
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
        return <Minus className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'from-red-500/10 to-pink-500/10 border-red-300/50 hover:from-red-500/20 hover:to-pink-500/20';
      case 'warning': return 'from-yellow-500/10 to-orange-500/10 border-yellow-300/50 hover:from-yellow-500/20 hover:to-orange-500/20';
      case 'safe': return 'from-green-500/10 to-emerald-500/10 border-green-300/50 hover:from-green-500/20 hover:to-emerald-500/20';
      default: return 'from-gray-500/10 to-slate-500/10 border-gray-300/50 hover:from-gray-500/20 hover:to-slate-500/20';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/25';
      case 'safe': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25';
    }
  };

  const getProgressColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'safe': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-500';
    }
  };

  const filteredPredictions = predictions.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.prediction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.prediction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    switch (sortBy) {
      case "risk":
        const riskOrder = { critical: 0, warning: 1, safe: 2 };
        return riskOrder[a.prediction.risk_level] - riskOrder[b.prediction.risk_level];
      case "stockout":
        return a.prediction.days_until_stockout - b.prediction.days_until_stockout;
      case "confidence":
        return b.prediction.confidence_score - a.prediction.confidence_score;
      case "name":
        return a.item_name.localeCompare(b.item_name);
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(predictions.map(p => p.prediction.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="text-lg font-semibold">Loading Predictions...</h3>
            <p className="text-gray-600 dark:text-gray-400">Analyzing inventory data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ML Predictions
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered inventory forecasting</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white">
                AI Powered
              </Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_items}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                    <p className="text-3xl font-bold text-red-600">{stats.critical_items}</p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warning Items</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.warning_items}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Confidence</p>
                    <p className="text-3xl font-bold text-green-600">{(stats.avg_confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search items or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="risk">Sort by Risk</option>
                  <option value="stockout">Sort by Stockout Days</option>
                  <option value="confidence">Sort by Confidence</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPredictions.map((item, index) => (
            <Card 
              key={index} 
              className={`border ${getRiskColor(item.prediction.risk_level)} dark:bg-gray-800 dark:border-gray-700`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-all duration-500 ease-out">
                      {item.item_name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {item.prediction.category}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(item.prediction.trend_direction)}
                    <Badge className={getRiskBadge(item.prediction.risk_level)}>
                      {item.prediction.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stock Level Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Stock Level</span>
                    <span className="font-medium">
                      {getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={getStockLevelPercentage(item.prediction.current_stock, item.prediction.threshold)} 
                    className="h-3"
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.prediction.current_stock}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days Left</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.prediction.days_until_stockout}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Predicted Demand:</span>
                    <span className="font-medium">{item.prediction.predicted_demand.toFixed(1)}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Confidence:</span>
                    <span className="font-medium">{(item.prediction.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedPredictions.length === 0 && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Predictions Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {setSearchTerm(""); setSelectedCategory("all");}} className="bg-blue-600 hover:bg-blue-700">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
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


    </div>
  );
}; 
