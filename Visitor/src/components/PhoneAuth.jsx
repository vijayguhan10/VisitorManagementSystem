import { useState } from 'react'
import { motion } from 'framer-motion'
import FormField from './FormField'
import axios from 'axios'
function PhoneAuth({ onAuthSuccess }) {
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(number.replace(/\D/g, ''))
  }
  
  const handleSendOTP = async () => {
    // if (!validatePhoneNumber(phoneNumber)) {
    //   setError('Please enter a valid 10-digit phone number');
    //   return;
    // }
  
    setIsLoading(true);
    setError('');
  
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
    try {
      localStorage.setItem('otp', generatedOTP);
      localStorage.setItem('otpPhoneNumber', phoneNumber); 
      await axios.post(`${import.meta.env.VITE_API_URL}/twilio/sendmessage`, {
        email:phoneNumber,
        otp: generatedOTP,
      });
  
      setStep('otp');
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Get OTP from localStorage
      const storedOTP = localStorage.getItem('otp');
  
      if (otp === storedOTP) {
        onAuthSuccess(phoneNumber);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Welcome</h1>
          <p className="text-neutral-600 mt-2">
            {step === 'phone' 
              ? 'Please enter your Mail to continue'
              : 'Enter the OTP sent to your Mail'
            }
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-error-600 text-sm"
          >
            {error}
          </motion.div>
        )}
        
        {step === 'phone' ? (
          <div className="space-y-4">
            <FormField
              label="Email"
              name="Email"
              type="tel"
              placeholder="Enter your Email"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                setError('')
              }}
              required
            />
            
            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 
                ${isLoading 
                  ? 'bg-primary-100 text-primary-400 cursor-not-allowed' 
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <FormField
              label="OTP"
              name="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError('')
              }}
              required
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError('')
                }}
                className="flex-1 py-3 px-4 rounded-lg font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                Back
              </button>
              
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 
                  ${isLoading 
                    ? 'bg-primary-100 text-primary-400 cursor-not-allowed' 
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
            
            <p className="text-center text-sm text-neutral-600 mt-4">
              Didn't receive OTP?{' '}
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        )}
        
        {/* <p className="text-xs text-neutral-500 text-center mt-6">
          For demo purposes, use OTP: 123456
        </p> */}
      </motion.div>
    </div>
  )
}

export default PhoneAuth