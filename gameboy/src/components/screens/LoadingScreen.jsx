import { useState, useEffect } from 'react';

function LoadingScreen() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center text-center">
      <div className="text-[1.5em]">LOADING...</div>
      <div className={`text-[1.5em] mt-[0.3em] ${frame % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
        █
      </div>
    </div>
  );
}

export default LoadingScreen; 