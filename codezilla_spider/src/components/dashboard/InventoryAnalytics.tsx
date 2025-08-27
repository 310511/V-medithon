import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Package, DollarSign, Activity, 
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Eye, Download, RefreshCw, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';

// Mock data generator
const generateMockData = () => {
  const salesData = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    salesData.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 25000) + 5000,
    });
  }

  const categoryData = [
    { name: 'Antibiotics', sales: 850, revenue: 4200, stock: 300, growth: 12.5 },
    { name: 'Consumables', sales: 1200, revenue: 6800, stock: 450, growth: 8.3 },
    { name: 'Diabetes Care', sales: 650, revenue: 3200, stock: 200, growth: 15.2 },
    { name: 'Equipment', sales: 450, revenue: 8900, stock: 150, growth: -2.1 },
    { name: 'Pain Management', sales: 950, revenue: 5400, stock: 280, growth: 6.7 },
    { name: 'Cardiovascular', sales: 750, revenue: 6100, stock: 220, growth: 9.8 },
    { name: 'Respiratory', sales: 580, revenue: 3800, stock: 180, growth: 4.2 },
  ];

  const inventoryStatus = [
    { name: 'In Stock', value: 450, color: '#10B981' },
    { name: 'Low Stock', value: 85, color: '#F59E0B' },
    { name: 'Out of Stock', value: 25, color: '#EF4444' },
    { name: 'Expiring Soon', value: 40, color: '#8B5CF6' },
  ];

  const alerts = [
    { type: 'critical', message: 'Paracetamol 500mg stock critically low', time: '2 min ago' },
    { type: 'warning', message: 'Insulin vials expiring in 30 days', time: '5 min ago' },
    { type: 'info', message: 'New shipment from MedSupply Co. arrived', time: '10 min ago' },
    { type: 'success', message: 'Monthly inventory audit completed', time: '1 hour ago' },
  ];

  return { salesData, categoryData, inventoryStatus, alerts };
};

export const InventoryAnalytics = () => {
  const [data, setData] = useState(generateMockData());
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('sales');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time data update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = { ...prevData };
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = newData.salesData.findIndex(item => item.date === today);
        
        if (todayIndex !== -1) {
          newData.salesData[todayIndex] = {
            ...newData.salesData[todayIndex],
            sales: newData.salesData[todayIndex].sales + Math.floor(Math.random() * 10),
            orders: newData.salesData[todayIndex].orders + Math.floor(Math.random() * 2),
            revenue: newData.salesData[todayIndex].revenue + Math.floor(Math.random() * 100),
          };
        }

        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setIsRefreshing(false);
    }, 1000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-950/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20';
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-950/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" />
              <Bar dataKey="revenue" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'inventory':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.inventoryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.inventoryStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Medicine Inventory Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Sales</p>
                <p className="text-2xl font-bold">
                  {data.salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
                </p>
                <p className="text-blue-100 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% from last month
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Revenue</p>
                <p className="text-2xl font-bold">
                  ${data.salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </p>
                <p className="text-green-100 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8.3% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">
                  {data.salesData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                </p>
                <p className="text-purple-100 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15.2% from last month
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold">
                  ${(data.salesData.reduce((sum, item) => sum + item.revenue, 0) / 
                     data.salesData.reduce((sum, item) => sum + item.orders, 0)).toFixed(2)}
                </p>
                <p className="text-orange-100 text-sm flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -2.1% from last month
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls and Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Real-time Analytics Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedChart === 'sales' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('sales')}
              >
                <LineChartIcon className="w-4 h-4 mr-1" />
                Sales
              </Button>
              <Button
                variant={selectedChart === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('revenue')}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Revenue
              </Button>
              <Button
                variant={selectedChart === 'categories' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('categories')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Categories
              </Button>
              <Button
                variant={selectedChart === 'inventory' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('inventory')}
              >
                <PieChartIcon className="w-4 h-4 mr-1" />
                Inventory
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Inventory Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.alerts.map((alert, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alert Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{alert.message}</p>
                    <p className="text-sm text-gray-500">Time: {alert.time}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
