import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-bold mt-8 mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button 
        onClick={() => navigate('/')}
        icon={<Home className="h-4 w-4" />}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;