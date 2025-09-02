import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  memoryUsage?: number;
  devicePixelRatio: number;
  screenSize: string;
  isLowEndDevice: boolean;
}

export const useMobilePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
    devicePixelRatio: 1,
    screenSize: 'unknown',
    isLowEndDevice: false
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detect connection type and performance
  const detectConnection = useCallback(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      setMetrics(prev => ({
        ...prev,
        connectionType: connection.type || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      }));
    }
  }, []);

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenSize = `${screenWidth}x${screenHeight}`;
    
    // Detect low-end device based on various factors
    const isLowEndDevice = 
      devicePixelRatio <= 1.5 && 
      screenWidth <= 768 && 
      (navigator as any).hardwareConcurrency <= 4 &&
      !('serviceWorker' in navigator);

    setMetrics(prev => ({
      ...prev,
      devicePixelRatio,
      screenSize,
      isLowEndDevice
    }));

    // Try to get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }));
    }
  }, []);

  // Optimize for slow connections
  const shouldReduceAnimations = useCallback(() => {
    return metrics.effectiveType === 'slow-2g' || 
           metrics.effectiveType === '2g' || 
           metrics.saveData ||
           metrics.isLowEndDevice;
  }, [metrics]);

  // Optimize for low memory
  const shouldReduceMemoryUsage = useCallback(() => {
    return metrics.memoryUsage && metrics.memoryUsage > 0.8;
  }, [metrics]);

  // Get optimal image quality
  const getOptimalImageQuality = useCallback(() => {
    if (metrics.effectiveType === 'slow-2g' || metrics.effectiveType === '2g') {
      return 'low';
    } else if (metrics.effectiveType === '3g') {
      return 'medium';
    } else {
      return 'high';
    }
  }, [metrics]);

  // Get optimal video quality
  const getOptimalVideoQuality = useCallback(() => {
    if (metrics.effectiveType === 'slow-2g' || metrics.effectiveType === '2g') {
      return '240p';
    } else if (metrics.effectiveType === '3g') {
      return '480p';
    } else {
      return '720p';
    }
  }, [metrics]);

  // Check if we should enable offline mode
  const shouldEnableOfflineMode = useCallback(() => {
    return !isOnline || metrics.effectiveType === 'slow-2g';
  }, [isOnline, metrics]);

  // Optimize bundle loading
  const shouldLoadLazyComponents = useCallback(() => {
    return metrics.effectiveType === 'slow-2g' || 
           metrics.effectiveType === '2g' || 
           metrics.isLowEndDevice;
  }, [metrics]);

  // Set up event listeners
  useEffect(() => {
    detectConnection();
    detectDeviceCapabilities();

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', detectConnection);
    }

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for memory pressure (if available)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
        }));
      };

      const memoryInterval = setInterval(checkMemory, 5000);
      return () => {
        clearInterval(memoryInterval);
        if (connection) {
          connection.removeEventListener('change', detectConnection);
        }
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', detectConnection);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [detectConnection, detectDeviceCapabilities]);

  return {
    metrics,
    isOnline,
    shouldReduceAnimations: shouldReduceAnimations(),
    shouldReduceMemoryUsage: shouldReduceMemoryUsage(),
    getOptimalImageQuality,
    getOptimalVideoQuality,
    shouldEnableOfflineMode: shouldEnableOfflineMode(),
    shouldLoadLazyComponents: shouldLoadLazyComponents(),
    
    // Performance recommendations
    recommendations: {
      useWebP: metrics.effectiveType !== 'slow-2g' && metrics.effectiveType !== '2g',
      enableServiceWorker: !metrics.isLowEndDevice,
      reduceAnimations: shouldReduceAnimations(),
      lazyLoadImages: shouldLoadLazyComponents(),
      compressAssets: metrics.saveData || metrics.effectiveType === 'slow-2g',
      useCDN: metrics.effectiveType !== 'slow-2g',
      enableCaching: !metrics.saveData,
      reduceBundleSize: metrics.isLowEndDevice || metrics.effectiveType === 'slow-2g'
    }
  };
};

// Hook for lazy loading components based on performance
export const useLazyComponent = (componentName: string, shouldLoad: boolean) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (shouldLoad && !Component && !isLoading) {
      setIsLoading(true);
      setError(null);

      // Simulate dynamic import based on component name
      const loadComponent = async () => {
        try {
          // This would be replaced with actual dynamic imports
          // const module = await import(`@/components/${componentName}`);
          // setComponent(() => module.default);
          
          // For now, we'll just simulate loading
          await new Promise(resolve => setTimeout(resolve, 1000));
          setComponent(() => () => <div>Loaded: {componentName}</div>);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      loadComponent();
    }
  }, [shouldLoad, Component, isLoading, componentName]);

  return { Component, isLoading, error };
};

// Hook for optimizing images based on performance
export const useOptimizedImage = (src: string, fallbackSrc?: string) => {
  const { getOptimalImageQuality, shouldReduceMemoryUsage } = useMobilePerformance();
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const quality = getOptimalImageQuality();
    const shouldReduce = shouldReduceMemoryUsage();

    // Modify image source based on performance
    let optimizedSrc = src;
    
    if (quality === 'low' || shouldReduce) {
      // Use lower quality image or add compression parameters
      optimizedSrc = src.includes('?') ? `${src}&q=60&w=400` : `${src}?q=60&w=400`;
    } else if (quality === 'medium') {
      optimizedSrc = src.includes('?') ? `${src}&q=80&w=800` : `${src}?q=80&w=800`;
    }

    setImageSrc(optimizedSrc);
  }, [src, getOptimalImageQuality, shouldReduceMemoryUsage]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return {
    imageSrc,
    isLoading,
    error,
    handleImageLoad,
    handleImageError
  };
};

// Hook for managing offline functionality
export const useOfflineMode = () => {
  const { shouldEnableOfflineMode, isOnline } = useMobilePerformance();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineData, setOfflineData] = useState<Record<string, any>>({});

  useEffect(() => {
    setIsOfflineMode(shouldEnableOfflineMode);
  }, [shouldEnableOfflineMode]);

  const saveOfflineData = useCallback((key: string, data: any) => {
    if (isOfflineMode) {
      setOfflineData(prev => ({ ...prev, [key]: data }));
      localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    }
  }, [isOfflineMode]);

  const getOfflineData = useCallback((key: string) => {
    if (isOfflineMode) {
      const localData = localStorage.getItem(`offline_${key}`);
      return localData ? JSON.parse(localData) : offlineData[key];
    }
    return null;
  }, [isOfflineMode, offlineData]);

  const clearOfflineData = useCallback((key?: string) => {
    if (key) {
      setOfflineData(prev => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
      localStorage.removeItem(`offline_${key}`);
    } else {
      setOfflineData({});
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('offline_')) {
          localStorage.removeItem(k);
        }
      });
    }
  }, []);

  return {
    isOfflineMode,
    isOnline,
    saveOfflineData,
    getOfflineData,
    clearOfflineData
  };
};
