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
    <div className="text-center">
      <div>LOADING...</div>
      <div style={{ fontSize: '8px', marginTop: '4px' }}>
        {frame % 2 === 0 ? '█' : '░'}
      </div>
    </div>
  );
}

export default LoadingScreen; 