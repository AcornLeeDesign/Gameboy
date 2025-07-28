import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import GameboyModel from './components/GameboyModel.jsx';
import GameboyScreen from './components/screens/GameboyScreen.jsx';
import InitialLoadingScreen from './components/InitialLoadingScreen.jsx';
import { GradientBackground } from "react-gradient-animation";

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [screenContent, setScreenContent] = useState('loading');

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // Keep loading screen for 3 seconds, then go to default
    setTimeout(() => setScreenContent('default'), 4000);
  };

  return (
    <div className="min-h-screen min-w-full">
      <div className="m-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] flex flex-col">
        <main className="h-full flex flex-col items-center justify-center">
          <GradientBackground
            count={5}
            size={{ min: 800, max: 1000, pulse: .2 }}
            speed={{ x: { min: 0.3, max: 1 }, y: { min: 0.3, max: 1 } }}
            colors={{
              background: '#ffffff',
              particles: ["#1e3a8a", "#1e40af", "#7c3aed"],
            }}
            blending="overlay"
            opacity={{ center: 0.3, edge: 0 }}
            skew={0}
            shapes={["c"]}
            style={{ opacity: 0.5 }}
          />
          <div className="flex w-full h-full flex items-center justify-center m-0 p-0 overflow-hidden">
            <Canvas
              style={{ width: '100%', height: '100%', zIndex: 1, touchAction: 'none' }}
              shadows
              dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
              camera={{ fov: 50, position: [0, 7, 0] }}
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
    </div>
  );
}

export default App; 