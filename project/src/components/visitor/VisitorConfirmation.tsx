import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { useVisitor } from '../../contexts/VisitorContext';

const VisitorConfirmation: React.FC = () => {
  const { currentVisit } = useVisitor();
  const navigate = useNavigate();
  
  if (!currentVisit) {
    // Redirect back to form if no current visit data
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <h2 className="text-xl font-semibold">No active check-in found</h2>
        <p className="text-muted-foreground">Please complete the visitor registration form</p>
        <Button 
          onClick={() => navigate('/visitor')}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Go to Registration
        </Button>
      </div>
    );
  }
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg">
        <div className="mx-auto mb-4">
          <CheckCircle className="h-16 w-16" />
        </div>
        <CardTitle className="text-3xl">Check-In Successful!</CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {currentVisit.name}</p>
                <p><span className="font-medium">Address:</span> {currentVisit.address}</p>
                <p><span className="font-medium">Purpose:</span> {currentVisit.purpose}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Checked in at {formatTime(currentVisit.entryTime)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h3 className="text-lg font-semibold mb-2 text-accent">Your Visitor ID</h3>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-mono tracking-wider">
                  {currentVisit.visitorId}
                </span>
              </div>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                Please remember this ID for checkout
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[200px] aspect-square overflow-hidden rounded-lg border-4 border-primary mb-4">
              <img 
                src={currentVisit.image} 
                alt="Visitor" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground italic">
              Visitor Photo
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center p-6 bg-secondary rounded-b-lg">
        <Button 
          onClick={() => navigate('/login')}
          variant="outline"
        >
          Done
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VisitorConfirmation;