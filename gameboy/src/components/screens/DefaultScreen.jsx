import { useState, useEffect } from 'react';

function DefaultScreen() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div>GAMEBOY</div>
      <div style={{ fontSize: '10px', marginTop: '4px' }}>NINTENDO</div>
      <div style={{ fontSize: '8px', marginTop: '8px' }}>
        {frame % 2 === 0 ? 'PRESS START' : '           '}
      </div>
    </div>
  );
}

export default DefaultScreen; 