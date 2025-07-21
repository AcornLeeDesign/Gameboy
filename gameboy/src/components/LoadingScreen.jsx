import { useState, useEffect } from 'react';

function LoadingScreen({ isModelLoaded, onComplete }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // We'll show a fake progress bar that adapts to actual loading time
  useEffect(() => {
    if (!isLoading) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 3; // Slower, more realistic progress
      setLoadingProgress(Math.min(99, Math.round(progress))); // Only go to 99%, let model loading complete it
      if (progress >= 99) {
        clearInterval(interval);
      }
    }, 50); // Slightly slower interval
    return () => clearInterval(interval);
  }, [isLoading]);

  // When model is loaded, finish loading
  useEffect(() => {
    if (!isModelLoaded) return;
    
    setLoadingProgress(100);
    // Much shorter delays for better responsiveness
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowLoadingScreen(false);
        if (onComplete) onComplete();
      }, 300); // Reduced from 500ms
    }, 100); // Reduced from 200ms
  }, [isModelLoaded, onComplete]);

  if (!showLoadingScreen) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black text-white text-center z-50 transition-opacity duration-1000 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl font-bold">{Math.min(loadingProgress || 0, 100)}</div>
      </div>
    </div>
  );
}

export default LoadingScreen; 