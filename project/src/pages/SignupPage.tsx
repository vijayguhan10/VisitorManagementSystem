import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to use the visitor management system
          </p>
        </div>
        <AuthForm type="signup" />
      </div>
    </div>
  );
};

export default SignupPage;