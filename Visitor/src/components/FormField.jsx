import { useState } from 'react'
import { motion } from 'framer-motion'

function FormField({ label, name, type, placeholder, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false)
  
  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)
  
  return (
    <div className="relative">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`block w-full px-4 py-3 rounded-lg transition-all duration-200 
            ${focused ? 'ring-2 ring-primary-300 border-primary-400' : 'border-neutral-300'} 
            ${error ? 'border-error-300 bg-error-50' : 'border'}
            focus:outline-none`}
          required={required}
        />
        
        {focused && (
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-lg pointer-events-none border-2 border-primary-400"
          ></motion.span>
        )}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default FormField