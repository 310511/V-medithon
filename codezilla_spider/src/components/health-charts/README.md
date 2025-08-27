# Health Charts - Modern React Charting Library

A complete redesign of health monitoring charts with modern animations, full responsiveness, and exceptional user experience. Built with React, Recharts, and Framer Motion.

## ✨ Features

- **🎨 Modern Design**: Clean gradients, soft shadows, and rounded corners
- **⚡ Real-time Updates**: Smooth animations with intelligent data management
- **📱 Fully Responsive**: Adapts perfectly to mobile, tablet, and desktop
- **♿ Accessibility**: Keyboard navigation, screen reader support, reduced motion
- **🎯 Interactive**: Hover tooltips, click modals, and detailed analytics
- **🚀 Performance**: Optimized for 60fps with virtualized data handling
- **🌙 Dark Mode**: Automatic theme switching based on system preference

## 📦 Installation

### Dependencies

```bash
npm install recharts framer-motion lucide-react
```

### Required UI Components

This library uses Shadcn UI components. Ensure you have these installed:

```bash
npx shadcn@latest add card badge button dialog switch progress
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { HealthChart } from './components/health-charts/HealthChart';
import { Heart } from 'lucide-react';

const metric = {
  title: "Heart Rate",
  unit: "bpm",
  color: "#ef4444",
  icon: Heart,
  threshold: {
    warning: 90,
    critical: 100
  }
};

const data = [
  { timestamp: "2024-01-01T10:00:00Z", value: 72 },
  { timestamp: "2024-01-01T10:02:00Z", value: 75 },
  // ... more data points
];

function App() {
  return (
    <HealthChart
      data={data}
      metric={metric}
      type="line"
      height={300}
    />
  );
}
```

### Advanced Usage with Streaming Data

```tsx
import { useState, useEffect } from 'react';
import { HealthChart } from './components/health-charts/HealthChart';
import { ChartModal } from './components/health-charts/ChartModal';

function HealthDashboard() {
  const [data, setData] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev.slice(1), {
        timestamp: new Date().toISOString(),
        value: Math.random() * 100
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleChartClick = (data) => {
    setSelectedChart(data);
  };

  return (
    <div>
      <HealthChart
        data={data}
        metric={metric}
        type="area"
        height={300}
        onPointClick={handleChartClick}
      />
      
      {selectedChart && (
        <ChartModal
          isOpen={!!selectedChart}
          onClose={() => setSelectedChart(null)}
          data={selectedChart}
          metric={metric}
        />
      )}
    </div>
  );
}
```

## 📚 API Reference

### HealthChart Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<{timestamp: string, value: number}>` | `[]` | Chart data points |
| `metric` | `MetricConfig` | - | Metric configuration object |
| `type` | `'line' \| 'area' \| 'bar'` | `'line'` | Chart type |
| `height` | `number` | `300` | Chart height in pixels |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showReference` | `boolean` | `true` | Show threshold reference lines |
| `animate` | `boolean` | `true` | Enable animations |
| `className` | `string` | `''` | Additional CSS classes |
| `onPointClick` | `(data: any) => void` | - | Click handler for data points |

#### MetricConfig

```typescript
interface MetricConfig {
  title: string;           // Display name
  unit: string;           // Unit of measurement
  color: string;          // Chart color (hex)
  icon: React.Component;  // Lucide React icon
  minValue?: number;      // Minimum value for Y-axis
  maxValue?: number;      // Maximum value for Y-axis
  threshold?: {           // Optional thresholds
    warning: number;
    critical: number;
  };
}
```

### ChartModal Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Modal visibility |
| `onClose` | `() => void` | - | Close handler |
| `data` | `Array` | `[]` | Chart data |
| `metric` | `MetricConfig` | - | Metric configuration |
| `type` | `'line' \| 'area' \| 'bar'` | `'line'` | Chart type |

## 🎨 Customization

### CSS Variables

The library uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --chart-primary: 220 13% 18%;
  --chart-secondary: 220 9% 46%;
  --chart-accent: 262 83% 58%;
  --chart-success: 142 76% 36%;
  --chart-warning: 38 92% 50%;
  --chart-danger: 0 84% 60%;
  
  /* Animation */
  --chart-animation-fast: 200ms;
  --chart-animation-normal: 300ms;
  --chart-animation-slow: 600ms;
  
  /* Easing */
  --chart-ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --chart-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Custom Styling

```css
/* Custom chart styles */
.health-chart-container {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.health-chart-line {
  stroke-width: 4;
  filter: drop-shadow(0 0 8px currentColor);
}
```

## 📱 Responsive Design

The charts automatically adapt to different screen sizes:

- **Mobile (≤640px)**: Simplified tooltips, reduced stroke width
- **Tablet (641px-1024px)**: Standard layout with touch-friendly interactions
- **Desktop (>1024px)**: Full feature set with hover effects

## ♿ Accessibility

### Features

- **Keyboard Navigation**: Tab through chart elements
- **Screen Reader Support**: ARIA labels and descriptions
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **High Contrast**: Maintains WCAG AA compliance
- **Focus Indicators**: Clear focus states for all interactive elements

### Usage

```tsx
// The charts automatically handle accessibility
<HealthChart
  data={data}
  metric={metric}
  // No additional accessibility props needed
/>
```

## 🚀 Performance Optimization

### Data Management

- **Virtualization**: Large datasets are automatically sampled
- **Memoization**: Chart calculations are memoized
- **Debounced Updates**: Smooth animations without performance impact
- **Efficient Re-renders**: Only updates when data changes

### Best Practices

```tsx
// ✅ Good: Memoize data processing
const processedData = useMemo(() => 
  data.map(item => ({ ...item, processed: true })), 
  [data]
);

// ✅ Good: Use stable references
const metric = useMemo(() => ({
  title: "Heart Rate",
  unit: "bpm",
  color: "#ef4444",
  icon: Heart
}), []);

// ❌ Avoid: Creating objects in render
<HealthChart metric={{ title: "Heart Rate" }} /> // Don't do this
```

## 🎯 Animation Configuration

### Default Settings

- **Duration**: 300ms (normal), 200ms (fast), 600ms (slow)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth)
- **Reduced Motion**: Automatically disabled when user prefers reduced motion

### Custom Animation

```tsx
// Override animation duration
<HealthChart
  data={data}
  metric={metric}
  animate={true} // Enable/disable animations
/>
```

## 🔧 Troubleshooting

### Common Issues

1. **Charts not rendering**
   - Ensure Recharts is installed: `npm install recharts`
   - Check data format: `[{timestamp: string, value: number}]`

2. **Animations not working**
   - Verify Framer Motion is installed: `npm install framer-motion`
   - Check for `prefers-reduced-motion` in system settings

3. **Responsive issues**
   - Ensure parent container has proper width constraints
   - Check CSS custom properties are loaded

4. **Performance problems**
   - Limit data points to ~100 for optimal performance
   - Use `useMemo` for expensive calculations
   - Consider data sampling for large datasets

### Debug Mode

```tsx
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Chart data:', data);
  console.log('Metric config:', metric);
}
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions and support:

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [Full docs](https://docs.example.com)

---

**Made with ❤️ for modern health applications**
