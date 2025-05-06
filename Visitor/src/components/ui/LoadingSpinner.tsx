import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse animation-delay-200"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse animation-delay-400"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;