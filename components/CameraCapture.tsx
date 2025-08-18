
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setError("Your browser does not support camera access.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      {error && <div className="absolute top-4 bg-red-500 text-white p-3 rounded-md">{error}</div>}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-center items-center space-x-4">
        <button onClick={onCancel} className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition">Cancel</button>
        <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full border-4 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition transform hover:scale-110 flex items-center justify-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
