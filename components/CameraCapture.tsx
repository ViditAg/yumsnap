
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (isMounted) setError("Camera access is not supported by your browser.");
            return;
        }

        let activeStream: MediaStream | null = null;
        try {
            // Try rear camera first
            activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (err) {
            console.warn("Could not get rear camera, trying any camera.", err);
            try {
                // If that fails, try any camera
                activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                console.error("Error accessing camera:", error);
                if (!isMounted) return;

                let message = 'Could not access the camera. Please ensure permissions are granted and try again.';
                if (error instanceof DOMException) {
                    switch (error.name) {
                        case 'NotAllowedError':
                            message = 'Camera access was denied. Please go to your browser settings and allow camera access for this site.';
                            break;
                        case 'NotFoundError':
                            message = 'No camera found on your device. Please ensure you have a working camera connected.';
                            break;
                        case 'NotReadableError':
                            message = 'Your camera is currently in use by another application or hardware. Please close it and try again.';
                            break;
                        case 'OverconstrainedError':
                            message = 'No camera available that meets the requirements (e.g., resolution, facing mode).';
                            break;
                        default:
                            message = `An unexpected error occurred: ${error.message}.`;
                    }
                }
                setError(message);
                return;
            }
        }
        
        if (isMounted && videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
            streamRef.current = activeStream;
            setError(null);
        }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

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
        aria-hidden={!!error}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent flex justify-center items-center space-x-4 z-10">
        <button onClick={onCancel} className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition">Cancel</button>
        <button 
          onClick={handleCapture} 
          disabled={!!error} 
          className="w-20 h-20 bg-white rounded-full border-4 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition transform hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Capture photo"
          aria-disabled={!!error}
        >
            <div className="w-16 h-16 bg-emerald-500 rounded-full"></div>
        </button>
      </div>

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center p-6 z-20" role="alert">
          <div className="max-w-sm text-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <h3 className="text-xl font-bold text-white mb-2">Camera Problem</h3>
             <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
