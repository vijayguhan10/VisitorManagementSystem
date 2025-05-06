import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the visitor management system
          </p>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  );
};

export default LoginPage;