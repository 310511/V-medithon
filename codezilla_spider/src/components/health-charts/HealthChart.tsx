import React, { useState, useCallback, useMemo } from 'react';
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets,
  Eye,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';
import './chart-styles.css';

// CSS Variables for consistent theming
const chartColors = {
  primary: 'hsl(var(--chart-primary, 220 13% 18%))',
  secondary: 'hsl(var(--chart-secondary, 220 9% 46%))',
  accent: 'hsl(var(--chart-accent, 262 83% 58%))',
  success: 'hsl(var(--chart-success, 142 76% 36%))',
  warning: 'hsl(var(--chart-warning, 38 92% 50%))',
  danger: 'hsl(var(--chart-danger, 0 84% 60%))',
  background: 'hsl(var(--chart-background, 0 0% 100%))',
  surface: 'hsl(var(--chart-surface, 220 14% 96%))',
  border: 'hsl(var(--chart-border, 220 13% 91%))'
};

// Custom tooltip component
const ChartTooltip = ({ active, payload, label, metric, formatValue }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const previousValue = data.payload.previousValue;
  const currentValue = data.value;
  const delta = previousValue ? currentValue - previousValue : 0;
  const deltaPercent = previousValue ? (delta / previousValue) * 100 : 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 z-50" style={{ minWidth: '200px' }}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
          <span className="font-semibold text-gray-900">{metric.title}</span>
        </div>
        <div className="text-2xl font-bold" style={{ color: metric.color }}>
          {formatValue(currentValue)}
        </div>
        {previousValue && (
          <div className="flex items-center gap-1 text-sm">
            {delta >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>
              {delta >= 0 ? '+' : ''}{formatValue(delta)} ({deltaPercent >= 0 ? '+' : ''}{deltaPercent.toFixed(1)}%)
            </span>
          </div>
        )}
        <div className="text-xs text-gray-500">
          {new Date(label).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Simple active dot component without animations
const ActiveDot = (props: any) => (
  <circle
    cx={props.cx}
    cy={props.cy}
    r={6}
    fill={props.fill}
    stroke="white"
    strokeWidth={2}
  />
);

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

interface HealthChartProps {
  data: Array<{ timestamp: string; value: number }>;
  metric: MetricConfig;
  type?: 'line' | 'area' | 'bar';
  height?: number;
  showGrid?: boolean;
  showReference?: boolean;
  animate?: boolean;
  className?: string;
  onPointClick?: (data: any) => void;
}

export const HealthChart: React.FC<HealthChartProps> = ({ 
  data, 
  metric, 
  type = 'line', 
  height = 300, 
  showGrid = true, 
  showReference = true, 
  animate = true, 
  className = '', 
  onPointClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Process data for chart
  const processedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      previousValue: index > 0 ? data[index - 1].value : null,
      timestamp: item.timestamp || new Date().toISOString()
    }));
  }, [data]);

  // Calculate chart domain
  const domain = useMemo(() => {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range * 0.1;
    
    return [
      metric.minValue ?? Math.max(0, min - padding),
      metric.maxValue ?? max + padding
    ];
  }, [data, metric]);

  // Format value based on metric type
  const formatValue = useCallback((value: number) => {
    if (metric.unit === '°C') return `${value.toFixed(1)}°C`;
    if (metric.unit === '%') return `${Math.round(value)}%`;
    if (metric.unit === 'bpm') return Math.round(value);
    if (metric.unit === 'mmHg') return Math.round(value);
    return value.toFixed(1);
  }, [metric.unit]);

  // Handle point click
  const handlePointClick = useCallback((data: any) => {
    if (onPointClick) {
      onPointClick(data);
    }
  }, [onPointClick]);

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      onClick: handlePointClick
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.3} />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke={chartColors.secondary}
              fontSize={12}
            />
            <YAxis 
              domain={domain}
              stroke={chartColors.secondary}
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip 
              content={<ChartTooltip metric={metric} formatValue={formatValue} />}
              cursor={{ stroke: chartColors.border, strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              fill={metric.color}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={false}
              activeDot={<ActiveDot fill={metric.color} />}
            />
            {showReference && metric.threshold && (
              <>
                <ReferenceLine 
                  y={metric.threshold.warning} 
                  stroke={chartColors.warning} 
                  strokeDasharray="3 3" 
                  strokeWidth={1}
                />
                <ReferenceLine 
                  y={metric.threshold.critical} 
                  stroke={chartColors.danger} 
                  strokeDasharray="3 3" 
                  strokeWidth={1}
                />
              </>
            )}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.3} />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke={chartColors.secondary}
              fontSize={12}
            />
            <YAxis 
              domain={domain}
              stroke={chartColors.secondary}
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip 
              content={<ChartTooltip metric={metric} formatValue={formatValue} />}
              cursor={{ fill: chartColors.surface, opacity: 0.3 }}
            />
            <Bar
              dataKey="value"
              fill={metric.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default: // line chart
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.3} />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke={chartColors.secondary}
              fontSize={12}
            />
            <YAxis 
              domain={domain}
              stroke={chartColors.secondary}
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip 
              content={<ChartTooltip metric={metric} formatValue={formatValue} />}
              cursor={{ stroke: chartColors.border, strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              strokeWidth={3}
              dot={false}
              activeDot={<ActiveDot fill={metric.color} />}
            />
            {showReference && metric.threshold && (
              <>
                <ReferenceLine 
                  y={metric.threshold.warning} 
                  stroke={chartColors.warning} 
                  strokeDasharray="3 3" 
                  strokeWidth={1}
                />
                <ReferenceLine 
                  y={metric.threshold.critical} 
                  stroke={chartColors.danger} 
                  strokeDasharray="3 3" 
                  strokeWidth={1}
                />
              </>
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className={`w-full transition-all duration-300 ${className}`}>
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {metric.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Real-time monitoring
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {data.length} data points
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
                aria-label={isExpanded ? "Minimize chart" : "Expand chart"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div 
            className="w-full overflow-hidden transition-all duration-300"
            style={{ height: isExpanded ? 500 : height }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          
          {/* Current value display */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatValue(data[data.length - 1]?.value || 0)}
              </span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthChart;
