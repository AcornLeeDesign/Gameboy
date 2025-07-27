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
      <div className="text-[3em]">GAMEBOY</div>
      <div className="text-[1.4em] mt-[0.2em]">by aaron lee</div>
      <div className={`text-[2em] mt-[1em] ${frame % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
        PRESS START
      </div>
    </div>
  );
}

export default DefaultScreen; 