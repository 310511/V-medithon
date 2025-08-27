import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const AuthDebugger: React.FC = () => {
  const { testFirebaseConnection, signInWithGoogle, user, isLoading } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const handleTestConnection = async () => {
    try {
      setTestResult('Testing Firebase connection...');
      const result = await testFirebaseConnection();
      if (result) {
        setTestResult('✅ Firebase connection successful');
        toast.success('Firebase connection test passed');
      } else {
        setTestResult('❌ Firebase connection failed');
        toast.error('Firebase connection test failed');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
      toast.error('Firebase test error');
    }
  };

  const handleTestSignIn = async () => {
    try {
      setTestResult('Testing Google sign-in...');
      const user = await signInWithGoogle();
      if (user) {
        setTestResult(`✅ Sign-in successful: ${user.email}`);
        toast.success('Google sign-in test passed');
      } else {
        setTestResult('❌ Sign-in failed - no user returned');
        toast.error('Google sign-in test failed');
      }
    } catch (error: any) {
      setTestResult(`❌ Sign-in error: ${error.message}`);
      toast.error(`Sign-in error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Current User:</p>
          <p className="text-sm text-muted-foreground">
            {user ? `${user.name} (${user.email})` : 'Not signed in'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Loading State:</p>
          <p className="text-sm text-muted-foreground">
            {isLoading ? '🔄 Loading...' : '✅ Ready'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Test Result:</p>
          <p className="text-sm text-muted-foreground">{testResult || 'No test run yet'}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleTestConnection} variant="outline" size="sm">
            Test Firebase Connection
          </Button>
          <Button onClick={handleTestSignIn} variant="outline" size="sm" disabled={isLoading}>
            Test Google Sign-In
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Check browser console for detailed logs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugger;
