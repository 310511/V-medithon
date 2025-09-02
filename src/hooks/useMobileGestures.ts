import { useEffect, useRef, useCallback } from 'react';

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useMobileGestures = (
  onSwipe?: (direction: SwipeDirection) => void,
  onTap?: (event: TouchEvent) => void,
  onLongPress?: (event: TouchEvent) => void
) => {
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    touchEndRef.current = null;
    isLongPressRef.current = false;

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (onLongPress) {
        onLongPress(event);
      }
    }, 500); // 500ms for long press
  }, [onLongPress]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Clear long press timer if user moves
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    const start = touchStartRef.current;
    const end = touchEndRef.current;

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.timestamp - start.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Minimum distance and velocity for swipe
    const minDistance = 50;
    const minVelocity = 0.1;

    if (distance > minDistance && velocity > minVelocity && !isLongPressRef.current) {
      let direction: 'left' | 'right' | 'up' | 'down';

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (onSwipe) {
        onSwipe({ direction, distance, velocity });
      }
    } else if (distance < 10 && !isLongPressRef.current && onTap) {
      // Tap gesture
      onTap(event);
    }

    // Reset
    touchStartRef.current = null;
    touchEndRef.current = null;
    isLongPressRef.current = false;
  }, [onSwipe, onTap]);

  useEffect(() => {
    const element = document.body;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    // Expose methods for manual gesture handling if needed
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

// Hook for swipe navigation between pages
export const useSwipeNavigation = () => {
  const onSwipe = useCallback((direction: SwipeDirection) => {
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // You can implement navigation logic here
    console.log(`Swipe detected: ${direction.direction}`, direction);
  }, []);

  return useMobileGestures(onSwipe);
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (onRefresh: () => void) => {
  const onSwipe = useCallback((direction: SwipeDirection) => {
    if (direction.direction === 'down' && direction.distance > 100) {
      onRefresh();
    }
  }, [onRefresh]);

  return useMobileGestures(onSwipe);
};
