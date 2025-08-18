
import React from 'react';
import { AlertTriangleIcon, RetryIcon } from './IconComponents';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-red-50 p-6">
      <div className="max-w-md">
        <AlertTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold font-display text-red-800 mb-3">
          Oops! Something went wrong.
        </h1>
        <p className="text-md text-red-700 bg-red-100 p-3 rounded-md mb-8">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="group inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          <RetryIcon className="h-5 w-5 mr-3 transform group-hover:rotate-180 transition-transform" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
