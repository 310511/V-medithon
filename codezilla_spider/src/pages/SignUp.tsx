import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Building, Phone, Mail, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  organization: string;
  department: string;
  position: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  receiveNewsletter: boolean;
}

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, updateProfile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
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
    agreeToTerms: false,
    agreeToPrivacy: false,
    receiveNewsletter: false
  });

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SignUpForm],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        toast.success('Successfully signed in with Google!');
        navigate('/'); // Redirect to home page instead of profile-setup
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!form.agreeToTerms || !form.agreeToPrivacy) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate email sign-up
      const mockUser = {
        id: 'email_' + Date.now(),
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        picture: undefined,
        role: 'user' as const,
        phone: form.phone,
        organization: form.organization,
        department: form.department,
        position: form.position,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        preferences: {
          theme: 'system' as const,
          notifications: true,
          language: 'en'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('medchain_user', JSON.stringify(mockUser));
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="organization">Organization *</Label>
        <Input
          id="organization"
          value={form.organization}
          onChange={(e) => handleInputChange('organization', e.target.value)}
          placeholder="Your Company Name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={form.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="IT, HR, etc."
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={form.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            placeholder="Manager, Developer, etc."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={form.address.street}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            placeholder="New York"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={form.address.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            placeholder="NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={form.address.zipCode}
            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
            placeholder="10001"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={form.address.country}
            onChange={(e) => handleInputChange('address.country', e.target.value)}
            placeholder="United States"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a strong password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={form.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToPrivacy"
            checked={form.agreeToPrivacy}
            onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', checked as boolean)}
          />
          <Label htmlFor="agreeToPrivacy" className="text-sm">
            I agree to the <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="receiveNewsletter"
            checked={form.receiveNewsletter}
            onCheckedChange={(checked) => handleInputChange('receiveNewsletter', checked as boolean)}
          />
          <Label htmlFor="receiveNewsletter" className="text-sm">
            I would like to receive newsletters and updates
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Join MedChain to access secure healthcare inventory management
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Google Sign-In */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <GoogleSignIn
              onSuccess={handleGoogleSignIn}
              onError={(error) => toast.error(error.message)}
            />
          </div>

          {/* Email Sign-Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="ml-auto"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
