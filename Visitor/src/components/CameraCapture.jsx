import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { motion } from 'framer-motion'

function CameraCapture({ onCapture, currentPhoto, error }) {
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [captureComplete, setCaptureComplete] = useState(false)
  const webcamRef = useRef(null)
  
  useEffect(() => {
    if (currentPhoto) {
      setCaptureComplete(true)
    }
  }, [currentPhoto])
  
  const handleCameraToggle = useCallback(() => {
    if (cameraError) {
      setCameraError(null)
    }
    
    if (cameraEnabled) {
      setCameraEnabled(false)
    } else {
      setCameraEnabled(true)
      setCaptureComplete(false)
    }
  }, [cameraEnabled, cameraError])
  
  const handleCameraError = useCallback((error) => {
    console.error('Camera error:', error)
    setCameraError('Could not access camera. Please ensure camera permissions are granted.')
    setCameraEnabled(false)
  }, [])
  
  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      onCapture(imageSrc)
      setCaptureComplete(true)
    }
  }, [onCapture])
  
  const handleRetake = useCallback(() => {
    onCapture(null)
    setCaptureComplete(false)
  }, [onCapture])
  
  const CameraControls = () => (
    <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center">
      <button
        type="button"
        onClick={captureComplete ? handleRetake : handleCapture}
        className="px-4 py-2 bg-white text-primary-600 font-medium rounded-full shadow-md hover:bg-primary-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {captureComplete ? 'Retake Photo' : 'Capture Photo'}
      </button>
    </div>
  )
  
  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-error-600 mb-2">{error}</p>
      )}
      
      {!cameraEnabled && !currentPhoto && (
        <div 
          className="rounded-lg border-2 border-dashed border-neutral-300 p-4 bg-neutral-50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200"
          onClick={handleCameraToggle}
          style={{ height: '250px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-neutral-400 mb-3">
            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          
          <h4 className="text-neutral-700 font-medium">Click to enable camera</h4>
          <p className="text-sm text-neutral-500 mt-1">
            We need access to your camera to take a visitor photo
          </p>
        </div>
      )}
      
      {cameraError && (
        <div className="rounded-lg border border-error-200 p-4 bg-error-50 text-error-700">
          <p className="font-medium mb-1">Camera Error</p>
          <p className="text-sm">{cameraError}</p>
          <button 
            type="button"
            onClick={handleCameraToggle}
            className="mt-3 text-sm font-medium text-error-600 hover:text-error-800"
          >
            Try again
          </button>
        </div>
      )}
      
      {cameraEnabled && !currentPhoto && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-lg overflow-hidden border border-neutral-300"
          style={{ height: '280px' }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 720,
              height: 480,
              facingMode: "user"
            }}
            onUserMediaError={handleCameraError}
            className="w-full h-full object-cover"
          />
          
          <CameraControls />
          
          <div className="absolute inset-0 border-4 border-white opacity-30 pointer-events-none"></div>
          
          <button
            type="button"
            onClick={handleCameraToggle}
            className="absolute top-3 right-3 p-1 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
      
      {currentPhoto && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative rounded-lg overflow-hidden border border-neutral-300"
          style={{ height: '280px' }}
        >
          <img 
            src={currentPhoto} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          
          <CameraControls />
        </motion.div>
      )}
    </div>
  )
}

export default CameraCapture