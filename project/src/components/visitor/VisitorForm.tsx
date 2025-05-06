import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import CameraCapture from './CameraCapture';
import { useVisitor, VisitorFormData } from '../../contexts/VisitorContext';

const VisitorForm: React.FC = () => {
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    address: '',
    purpose: '',
    image: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    address: '',
    purpose: '',
    image: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const { createVisit, loading, error } = useVisitor();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageCapture = (imageSrc: string) => {
    setFormData(prev => ({ ...prev, image: imageSrc }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
        isValid = false;
      }
      
      if (!formData.purpose.trim()) {
        newErrors.purpose = 'Purpose is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.image) {
        newErrors.image = 'Please capture or upload a photo';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    try {
      const visit = await createVisit(formData);
      if (visit) {
        navigate('/visitor/confirmation');
      }
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Visitor Registration</CardTitle>
        <CardDescription>
          Please fill in your details to check in as a visitor
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={<User className="h-5 w-5 text-muted-foreground" />}
                error={errors.name}
                required
              />
              
              <Input
                label="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
                icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                error={errors.address}
                required
              />
              
              <div className="space-y-2">
                <label htmlFor="purpose" className="block text-sm font-medium text-foreground">
                  Purpose of Visit
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Please describe the purpose of your visit"
                    className={`
                      pl-10 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm
                      placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${errors.purpose ? 'border-destructive focus:ring-destructive' : ''}
                    `}
                    required
                  />
                </div>
                {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
              </div>
            </div>
          )}
          
          {/* Step 2: Photo Capture */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Capture Your Photo
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                  Please take a clear photo of your face using the camera below
                </p>
                
                <CameraCapture onCapture={handleImageCapture} />
                
                {errors.image && <p className="text-sm text-destructive mt-2">{errors.image}</p>}
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {currentStep === 1 ? (
          <div></div> // Empty div to maintain flex spacing
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        
        {currentStep === 1 ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={loading}
            disabled={!formData.image}
          >
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VisitorForm;