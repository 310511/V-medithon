import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Share2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, Calendar, Target } from 'lucide-react';
import { HealthChart } from './HealthChart';
import './chart-styles.css';

interface MetricConfig {
  title: string;
  unit: string;
  color: string;
  icon: React.ComponentType<any>;
  minValue?: number;
  maxValue?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<{ timestamp: string; value: number }>;
  metric: MetricConfig;
  type?: 'line' | 'area' | 'bar';
}

export const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, data, metric, type = 'line' }) => {
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const delta = currentValue - previousValue;
  const deltaPercent = previousValue ? (delta / previousValue) * 100 : 0;

  const stats = React.useMemo(() => {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const recentValues = values.slice(-5);
    const recentAverage = recentValues.reduce((acc, val) => acc + val, 0) / recentValues.length;
    
    return {
      min,
      max,
      average: average.toFixed(1),
      recentAverage: recentAverage.toFixed(1),
      trend: recentAverage > average ? 'up' : 'down',
      totalPoints: data.length
    };
  }, [data]);

  const getStatus = () => {
    if (!metric.threshold) return { status: 'normal', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    
    if (currentValue >= metric.threshold.critical) {
      return { status: 'critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (currentValue >= metric.threshold.warning) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    } else {
      return { status: 'normal', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const status = getStatus();
  const formatValue = (value: number) => {
    if (metric.unit === '°C') return `${value.toFixed(1)}°C`;
    if (metric.unit === '%') return `${Math.round(value)}%`;
    if (metric.unit === 'bpm') return Math.round(value);
    if (metric.unit === 'mmHg') return Math.round(value);
    return value.toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
            </div>
            {metric.title} - Detailed Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Status</span>
                <Badge className={status.color}>
                  <status.icon className="w-4 h-4 mr-1" />
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: metric.color }}>
                    {formatValue(currentValue)}
                  </div>
                  <div className="text-sm text-gray-500">{metric.unit}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg">
                    {delta >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {delta >= 0 ? '+' : ''}{formatValue(delta)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">vs previous</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {deltaPercent >= 0 ? '+' : ''}{deltaPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">change</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-semibold">{formatValue(stats.min)}</div>
                <div className="text-xs text-gray-500">Minimum</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-lg font-semibold">{formatValue(stats.max)}</div>
                <div className="text-xs text-gray-500">Maximum</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-lg font-semibold">{formatValue(parseFloat(stats.average))}</div>
                <div className="text-xs text-gray-500">Average</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-lg font-semibold">{formatValue(parseFloat(stats.recentAverage))}</div>
                <div className="text-xs text-gray-500">Recent Avg</div>
              </CardContent>
            </Card>
          </div>

          {/* Expanded Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Historical Data
              </CardTitle>
              <CardDescription>
                Detailed view of {metric.title} over time with {stats.totalPoints} data points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <HealthChart 
                  data={data} 
                  metric={metric} 
                  type={type} 
                  height={350} 
                  showGrid={true} 
                  showReference={true} 
                  animate={true} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                View Trends
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartModal;
