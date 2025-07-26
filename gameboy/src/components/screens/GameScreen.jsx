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
      <div style={{ fontSize: '10px' }}>TETRIS</div>
      <div style={{ fontSize: '8px', marginTop: '2px' }}>
        {frame % 4 === 0 ? '■■■■' : 
         frame % 4 === 1 ? '■□□■' :
         frame % 4 === 2 ? '■□□■' : '■■■■'}
      </div>
      <div style={{ fontSize: '8px', marginTop: '2px' }}>SCORE: 1234</div>
    </div>
  );
}

export default GameScreen; 