import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Mobile-optimized Button component
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-2.5 text-base min-h-[44px]", // Mobile-friendly minimum height
      lg: "px-6 py-3 text-lg min-h-[48px]"
    };
    
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500 dark:text-gray-200 dark:hover:bg-gray-800",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };
    
    const widthClasses = fullWidth ? "w-full" : "";
    
    return (
      <button
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          widthClasses,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

MobileButton.displayName = "MobileButton";

// Mobile-optimized Input component
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            "block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

// Mobile-optimized Card component
interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, padding = 'md', shadow = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      sm: "p-3",
      md: "p-4",
      lg: "p-6"
    };
    
    const shadowClasses = {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg"
    };
    
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
          paddingClasses[padding],
          shadowClasses[shadow],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = "MobileCard";

// Mobile-optimized Touchable component for better touch feedback
interface TouchableProps extends React.HTMLAttributes<HTMLDivElement> {
  onPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
}

export const Touchable = forwardRef<HTMLDivElement, TouchableProps>(
  ({ className, onPress, disabled = false, activeOpacity = 0.7, children, ...props }, ref) => {
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!disabled && onPress) {
        e.currentTarget.style.opacity = activeOpacity.toString();
      }
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      e.currentTarget.style.opacity = '1';
      if (!disabled && onPress) {
        onPress();
      }
    };
    
    const handleTouchCancel = (e: React.TouchEvent) => {
      e.currentTarget.style.opacity = '1';
    };
    
    return (
      <div
        className={cn(
          "transition-opacity duration-150",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && onPress && "cursor-pointer",
          className
        )}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Touchable.displayName = "Touchable";

// Mobile-optimized Swipeable component
interface SwipeableProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const Swipeable = forwardRef<HTMLDivElement, SwipeableProps>(
  ({ className, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50, children, ...props }, ref) => {
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    };
    
    return (
      <div
        className={cn("touch-manipulation", className)}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Swipeable.displayName = "Swipeable";

// Mobile-optimized Loading component
interface MobileLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <svg
        className={cn("animate-spin text-blue-600", sizeClasses[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

// Mobile-optimized Error component
interface MobileErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const MobileError: React.FC<MobileErrorProps> = ({ title = 'Error', message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message}</p>
      </div>
      {onRetry && (
        <MobileButton onClick={onRetry} variant="outline" size="sm">
          Try Again
        </MobileButton>
      )}
    </div>
  );
};
