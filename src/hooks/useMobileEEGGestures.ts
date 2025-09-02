import { useCallback, useEffect, useRef } from 'react';

interface EEGGestureCallbacks {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useMobileEEGGestures = (callbacks: EEGGestureCallbacks) => {
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const touchCountRef = useRef<number>(0);

  // Minimum distance for swipe detection (in pixels)
  const SWIPE_THRESHOLD = 50;
  // Maximum time for swipe detection (in milliseconds)
  const SWIPE_TIME_THRESHOLD = 300;
  // Long press duration (in milliseconds)
  const LONG_PRESS_DURATION = 500;
  // Double tap time window (in milliseconds)
  const DOUBLE_TAP_WINDOW = 300;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    touchStartRef.current = touchPoint;
    touchCountRef.current = e.touches.length;

    // Start long press timer
    if (callbacks.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        callbacks.onLongPress?.();
        // Provide haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, LONG_PRESS_DURATION);
    }
  }, [callbacks]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle multi-touch gestures
    if (e.touches.length === 2 && callbacks.onPinch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Calculate scale based on initial distance
      if (touchStartRef.current) {
        const initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touchStartRef.current.x, 2) +
          Math.pow(touch2.clientY - touchStartRef.current.y, 2)
        );
        const scale = distance / initialDistance;
        callbacks.onPinch(scale);
      }
    }
  }, [callbacks]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    // Cancel long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    touchEndRef.current = touchPoint;

    // Calculate swipe distance and direction
    const deltaX = touchPoint.x - touchStartRef.current.x;
    const deltaY = touchPoint.y - touchStartRef.current.y;
    const deltaTime = touchPoint.time - touchStartRef.current.time;

    // Check for swipe gestures
    if (deltaTime < SWIPE_TIME_THRESHOLD) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && callbacks.onSwipeRight) {
            callbacks.onSwipeRight();
            navigator.vibrate?.(25);
          } else if (deltaX < 0 && callbacks.onSwipeLeft) {
            callbacks.onSwipeLeft();
            navigator.vibrate?.(25);
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && callbacks.onSwipeDown) {
            callbacks.onSwipeDown();
            navigator.vibrate?.(25);
          } else if (deltaY < 0 && callbacks.onSwipeUp) {
            callbacks.onSwipeUp();
            navigator.vibrate?.(25);
          }
        }
      } else {
        // Check for double tap
        const currentTime = Date.now();
        if (currentTime - lastTapRef.current < DOUBLE_TAP_WINDOW && callbacks.onDoubleTap) {
          callbacks.onDoubleTap();
          navigator.vibrate?.(50);
          lastTapRef.current = 0; // Reset to prevent triple tap
        } else {
          lastTapRef.current = currentTime;
        }
      }
    }

    // Reset touch references
    touchStartRef.current = null;
    touchEndRef.current = null;
    touchCountRef.current = 0;
  }, [callbacks]);

  const handleTouchCancel = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    // Cancel long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Reset touch references
    touchStartRef.current = null;
    touchEndRef.current = null;
    touchCountRef.current = 0;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const element = document.body;
    
    // Add touch event listeners with passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
      
      // Clean up any pending timers
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  // Return gesture state and controls
  return {
    isLongPressing: longPressTimerRef.current !== null,
    touchCount: touchCountRef.current,
    clearLongPress: () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };
};
