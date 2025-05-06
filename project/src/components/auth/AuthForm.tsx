import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, User } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const { login, signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setNameError('');
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    // Name validation (only for signup)
    if (type === 'signup' && !name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (type === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name, role);
      }
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle>
          {type === 'login' ? 'Login to your account' : 'Create an account'}
        </CardTitle>
        <CardDescription>
          {type === 'login'
            ? 'Enter your email and password to access your account'
            : 'Fill in the details below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <Input
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5 text-muted-foreground" />}
              error={nameError}
              required
            />
          )}
          
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            error={emailError}
            required
          />
          
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder={type === 'signup' ? 'Create a password' : 'Enter your password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Key className="h-5 w-5 text-muted-foreground" />}
            error={passwordError}
            required
          />
          
          {type === 'signup' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Account Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="visitor"
                    checked={role === 'visitor'}
                    onChange={() => setRole('visitor')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span>Visitor</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span>Admin</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Select 'Admin' if you need access to manage visitor entries
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <a
            onClick={() => navigate(type === 'login' ? '/signup' : '/login')}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;