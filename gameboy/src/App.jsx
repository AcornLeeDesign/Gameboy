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
      <main className="w-full h-screen">
          <GradientBackground
            count={5}
            size={{ min: 800, max: 1000, pulse: .2 }}
            speed={{ x: { min: 0.3, max: 1 }, y: { min: 0.3, max: 1 } }}
            colors={{
              background: '#f8fafc',
              particles: ["#334155", "#475569", "#64748b", "#94a3b8", "#7dd3fc", "#0ea5e9"],
            }}
            blending="overlay"
            opacity={{ center: 0.4, edge: 0 }}
            skew={0}
            shapes={["c"]}
            style={{ opacity: 0.6 }}
          />
          <div className="w-full h-screen">
            <Canvas
              style={{ zIndex: 1, touchAction: 'none' }}
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
  );
}

export default App; 