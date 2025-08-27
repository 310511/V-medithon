import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin' | 'manager' | 'staff';
  phone?: string;
  organization?: string;
  department?: string;
  position?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<UserProfile | undefined>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  testFirebaseConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Convert Firebase user to our UserProfile format
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          picture: firebaseUser.photoURL || undefined,
          role: 'user',
          phone: firebaseUser.phoneNumber || '',
          organization: '',
          department: '',
          position: '',
          dateOfBirth: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          },
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
        };

        // Load additional profile data from localStorage if available
        const savedProfile = localStorage.getItem(`medchain_user_${firebaseUser.uid}`);
        if (savedProfile) {
          const additionalData = JSON.parse(savedProfile);
          Object.assign(userProfile, additionalData);
        }

        setUser(userProfile);
        localStorage.setItem('medchain_user', JSON.stringify(userProfile));
        
        // Auto-redirect to home page after successful authentication
        if (window.location.pathname === '/signin' || window.location.pathname === '/signup') {
          window.location.href = '/';
        }
      } else {
        setUser(null);
        localStorage.removeItem('medchain_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Check if Firebase is available
      if (!auth || !googleProvider) {
        console.warn('Firebase not available, using fallback authentication');
        // Fallback to simulated authentication
        const fallbackUser: UserProfile = {
          id: 'fallback-user-' + Date.now(),
          email: 'user@example.com',
          name: 'Demo User',
          picture: undefined,
          role: 'user',
          phone: '',
          organization: '',
          department: '',
          position: '',
          dateOfBirth: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(fallbackUser);
        localStorage.setItem('medchain_user', JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      
      // Use Firebase Google Auth
      console.log('Attempting Firebase Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log('Firebase sign-in successful:', firebaseUser.email);
      
      // Create user profile immediately
      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        picture: firebaseUser.photoURL || undefined,
        role: 'user',
        phone: firebaseUser.phoneNumber || '',
        organization: '',
        department: '',
        position: '',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        },
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
      };

      // Load additional profile data from localStorage if available
      const savedProfile = localStorage.getItem(`medchain_user_${firebaseUser.uid}`);
      if (savedProfile) {
        const additionalData = JSON.parse(savedProfile);
        Object.assign(userProfile, additionalData);
      }

      setUser(userProfile);
      localStorage.setItem('medchain_user', JSON.stringify(userProfile));
      
      // Return success
      return userProfile;
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups for this site.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in.');
      } else {
        throw new Error('Sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will handle clearing the user state
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = {
        ...user,
        ...profile,
        updatedAt: new Date().toISOString()
      };
      
      // Save additional profile data to localStorage with user ID
      localStorage.setItem(`medchain_user_${user.id}`, JSON.stringify(profile));
      localStorage.setItem('medchain_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const savedUser = localStorage.getItem('medchain_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Test Firebase connectivity
  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      console.log('Auth object:', auth);
      console.log('Google provider:', googleProvider);
      
      if (!auth || !googleProvider) {
        console.error('Firebase auth objects not available');
        return false;
      }
      
      // Check if we can access Firebase auth
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser);
      
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshUser,
    testFirebaseConnection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
