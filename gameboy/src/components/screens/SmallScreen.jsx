import { useState, useEffect } from 'react';

function SmallScreen() {
  const [pairCount, setPairCount] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const maxPairs = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setPairCount(prev => {
        if (!isReversing) {
          if (prev < maxPairs) return prev + 1;
          setIsReversing(true);
          return prev;
        } else {
          if (prev > 0) return prev - 1;
          setIsReversing(false);
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isReversing]);

  return (
    <div className="relative flex justify-center items-center h-10">
      {/* Center rectangle */}
      <div className="text-[1.5em] absolute">
        █
      </div>

      {/* Symmetric pairs */}
      {[...Array(pairCount)].map((_, i) => (
        <div
          key={i}
          className="absolute text-[1.5em] transition-all duration-300"
          style={{ transform: `translateX(${-((i + 1) * 20)}px)` }}
        >
          █
        </div>
      ))}

      {[...Array(pairCount)].map((_, i) => (
        <div
          key={`r${i}`}
          className="absolute text-[1.5em] transition-all duration-300"
          style={{ transform: `translateX(${(i + 1) * 20}px)` }}
        >
          █
        </div>
      ))}
    </div>
  );
}

export default SmallScreen;
