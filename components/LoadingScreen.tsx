
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message: string;
}

const loadingMessages = [
    "Analyzing your ingredients...",
    "Consulting with our AI chef...",
    "Finding the tastiest recipes...",
    "Preparing your delicious options...",
    "Just a moment more..."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const [dynamicMessage, setDynamicMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
        setDynamicMessage(prev => {
            const currentIndex = loadingMessages.indexOf(prev);
            const nextIndex = (currentIndex + 1) % loadingMessages.length;
            return loadingMessages[nextIndex];
        });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-emerald-50 text-emerald-800 p-4">
      <svg className="animate-spin h-16 w-16 text-emerald-500 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h2 className="text-2xl font-bold font-display mb-2">{message}</h2>
      <p className="text-lg text-emerald-600 transition-opacity duration-500">{dynamicMessage}</p>
    </div>
  );
};

export default LoadingScreen;
