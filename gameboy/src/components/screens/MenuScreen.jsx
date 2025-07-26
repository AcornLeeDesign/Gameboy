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
      <div className="text-[0.8em]">MENU</div>
      <div className="text-[0.6em] mt-[0.2em]">
        {frame % 2 === 0 ? '▶' : ' '} START GAME
      </div>
      <div className="text-[0.6em]">  OPTIONS</div>
      <div className="text-[0.6em]">  EXIT</div>
    </div>
  );
}

export default MenuScreen; 