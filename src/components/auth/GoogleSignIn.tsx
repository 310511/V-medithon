import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';

interface GoogleSignInProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  onSuccess,
  onError
}) => {
  const { signInWithGoogle, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignIn}
      disabled={isLoading}
      className={`w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 transition-all duration-200 ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Signing in...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Chrome className="w-4 h-4 text-red-500" />
          <span>Continue with Google</span>
        </div>
      )}
    </Button>
  );
};
