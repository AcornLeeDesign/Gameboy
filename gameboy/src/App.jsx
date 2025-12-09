import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import GameboyModel from './components/GameboyModel.jsx';
import GameboyScreen from './components/screens/GameboyScreen.jsx';
import InitialLoadingScreen from './components/InitialLoadingScreen.jsx';

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [screenContent, setScreenContent] = useState('loading');
  const [isMobile, setIsMobile] = useState(false);
  const prevWidthRef = useRef(window.innerWidth);

  // Mobile detection with threshold-crossing guard (same logic as GameboyModel)
  useEffect(() => {
    const MOBILE_BREAKPOINT = 768;
    
    const checkMobile = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;
      
      // Only update if crossing the breakpoint threshold
      const wasMobile = prevWidth <= MOBILE_BREAKPOINT;
      const isMobileNow = currentWidth <= MOBILE_BREAKPOINT;
      
      if (wasMobile !== isMobileNow) {
        setIsMobile(isMobileNow);
        console.log(isMobileNow ? "mobile" : "desktop");
      }
      
      prevWidthRef.current = currentWidth;
    };
    
    // Initial check
    checkMobile();
    
    // Throttled resize listener to avoid excessive calls
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // Keep loading screen for 3 seconds, then go to default
    setTimeout(() => setScreenContent('footer'));
  };

  return (
    <div className="min-h-screen min-w-full">
      <main className="w-full h-screen">
          <div className="w-full h-screen">
            <Canvas
              style={{ zIndex: 1, touchAction: 'none' }}
              shadows
              dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
              camera={{ fov: 50, position: [0, 7, 0] }}
              events={isMobile ? false : undefined} // Disable R3F events on mobile
            >
              <Suspense fallback={null}>
                <GameboyModel 
                  onLoaded={handleModelLoaded} 
                  screenContent={screenContent}
                  GameboyScreenComponent={GameboyScreen}
                />
              </Suspense>
            </Canvas>
            <InitialLoadingScreen 
              isModelLoaded={isModelLoaded}
              onComplete={() => console.log('gameboy loaded')}
            />
          </div>
        </main>
    </div>
  );
}

export default App; 