import { useState, useEffect } from 'react';

function MenuScreen() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div style={{ fontSize: '10px' }}>MENU</div>
      <div style={{ fontSize: '8px', marginTop: '2px' }}>
        {frame % 2 === 0 ? '▶' : ' '} START GAME
      </div>
      <div style={{ fontSize: '8px' }}>  OPTIONS</div>
      <div style={{ fontSize: '8px' }}>  EXIT</div>
    </div>
  );
}

export default MenuScreen; 