import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize the camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Request access to the front camera with preferred constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Request front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCapturing(true);
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setCameraError(`Camera access error: ${err.message}`);
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };

  // Capture a still frame from the video
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageSrc = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
        
        // Stop the camera after capturing
        stopCamera();
      }
    }
  };

  // Reset and start over
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageSrc = event.target?.result as string;
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Automatically start the camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="camera-container">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={isCapturing ? 'block' : 'hidden'}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {cameraError && (
              <div className="bg-destructive/10 p-4 rounded-md text-destructive text-sm">
                {cameraError}
              </div>
            )}
            
            <div className="camera-overlay">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={captureImage}
                  disabled={!isCapturing}
                  variant="primary"
                  icon={<Camera className="h-4 w-4" />}
                >
                  Capture
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <img src={capturedImage} alt="Captured" className="rounded-lg w-full" />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {capturedImage ? (
          <Button
            onClick={retakePhoto}
            variant="outline"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Retake Photo
          </Button>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label className="relative cursor-pointer">
              <Button
                type="button"
                variant="outline"
                icon={<Upload className="h-4 w-4" />}
              >
                Upload from Gallery
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                capture="user" // Attempt to use front camera if available
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;