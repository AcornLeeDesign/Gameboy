import { useState, useEffect } from 'react';

function LoadingScreen({ isModelLoaded, onComplete }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [artificialLoadingComplete, setArtificialLoadingComplete] = useState(false);

  // First: Complete artificial loading progress (0 to 100)
  useEffect(() => {
    if (!isLoading || artificialLoadingComplete) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 3; // Slower, more realistic progress
      setLoadingProgress(Math.min(100, Math.round(progress))); // Go all the way to 100%
      
      if (progress >= 100) {
        clearInterval(interval);
        setArtificialLoadingComplete(true);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isLoading, artificialLoadingComplete]);

  // Second: When artificial loading is complete, check if model is loaded and fade away
  useEffect(() => {
    if (!artificialLoadingComplete) return;
    
    // If model is already loaded, fade away immediately
    if (isModelLoaded) {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          setShowLoadingScreen(false);
          if (onComplete) onComplete();
        }, 800); // fade out transition
      }, 600); // wait before starting fade out transition
    }
  }, [artificialLoadingComplete, isModelLoaded, onComplete]);

  // Third: If model loads after artificial loading is complete, fade away
  useEffect(() => {
    if (!artificialLoadingComplete || !isModelLoaded) return;
    
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowLoadingScreen(false);
        if (onComplete) onComplete();
      }, 800); // fade out transition
    }, 600); // wait before starting fade out transition
  }, [artificialLoadingComplete, isModelLoaded, onComplete]);

  if (!showLoadingScreen) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full text-black text-center z-50 transition-opacity duration-1000 bg-[#fafafa] ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-4">
        <p className="text-xl">[...Just a minute...]</p>
        <div className="text-xl">{Math.min(loadingProgress || 0, 100)}</div>
      </div>
    </div>
  );
}

export default LoadingScreen; 