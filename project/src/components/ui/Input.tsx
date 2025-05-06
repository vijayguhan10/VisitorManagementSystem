import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={`
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-destructive focus:ring-destructive' : ''}
              ${className}
            `}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;