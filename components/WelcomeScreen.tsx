
import React from 'react';
import { CameraIcon, ChefHatIcon } from './IconComponents';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 p-6">
      <div className="max-w-md">
        <div className="flex justify-center items-center mb-6">
          <ChefHatIcon className="h-20 w-20 text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-4">
          Welcome to YumSnap
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Turn what's in your fridge into delicious, quick meals. Snap a photo, and let AI be your sous-chef!
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          <CameraIcon className="h-6 w-6 mr-3 transform group-hover:rotate-12 transition-transform" />
          Scan My Fridge / Pantry
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
