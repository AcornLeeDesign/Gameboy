import { useState, useEffect } from 'react';

function GameScreen() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div className="text-[0.8em]">TETRIS</div>
      <div className="text-[0.6em] mt-[0.2em]">
        {frame % 4 === 0 ? '■■■■' : 
         frame % 4 === 1 ? '■□□■' :
         frame % 4 === 2 ? '■□□■' : '■■■■'}
      </div>
      <div className="text-[0.6em] mt-[0.2em]">SCORE: 1234</div>
    </div>
  );
}

export default GameScreen; 