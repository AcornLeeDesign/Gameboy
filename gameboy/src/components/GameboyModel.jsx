import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, PresentationControls, Html } from '@react-three/drei'
import InitialLoadingScreen from './InitialLoadingScreen';
import GameboyScreen from './GameboyScreen';

function GameboyModel({ onLoaded, screenContent = 'default', ...props }) {
  const base = import.meta.env.BASE_URL;
  const url = base.endsWith('/') ? `${base}gameboy_2.gltf` : `${base}/gameboy_2.gltf`;
  const { scene } = useGLTF(url, true);
  
  // Fix up circuitboard materials
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh && object.name) {
        const meshName = object.name.toLowerCase();
        if (meshName.includes('circuitboard') || meshName.includes('mini_circuit')) {
          object.material.opacity = 1;
          object.material.transparent = false;
        }
      }
    });
    if (onLoaded) onLoaded();
  }, [scene, onLoaded]);

  return (
    <>
      <primitive object={scene} {...props} />
      <Html
        position={[0, 0.55, -0.7]}
        rotation={[Math.PI / -2, 0, 0]}
        transform
        occlude
        distanceFactor={1}
        style={{
          width: '610px',
          height: '810px',
          pointerEvents: 'none'
        }}
      >
        <GameboyScreen content={screenContent} />
      </Html>
    </>
  );
}



function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [screenContent, setScreenContent] = useState('loading');

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // Keep loading screen for 3 seconds, then go to default
    setTimeout(() => setScreenContent('default'), 4000);
  };

  return (
    <div className="flex w-full h-full flex items-center justify-center m-0 p-0 overflow-hidden">
      <Canvas
        style={{ width: '100%', height: '100%', zIndex: 1, touchAction: 'none' }}
        shadows
        dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
        camera={{ fov: 50, position: [0, 7, 0] }}
      >
        <Suspense fallback={null}>
          <directionalLight 
            position={[1, 4, 0]} 
            rotation={[45 * Math.PI, 0, 0]}
            intensity={1} 
            castShadow 
            shadow-mapSize-width={128}
            shadow-mapSize-height={128}
          />
          <PresentationControls
            global
            zoom={0.8}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 20, 0]}
            azimuth={[-Math.PI / 20, Math.PI / 20]}
            damping={0.2}
            spring={{ tension: 0.8, friction: 0.05 }}
            snap
          >
            <GameboyModel onLoaded={handleModelLoaded} screenContent={screenContent} />
          </PresentationControls>
        </Suspense>
      </Canvas>
      <InitialLoadingScreen 
        isModelLoaded={isModelLoaded}
        onComplete={() => console.log('gameboy loaded')}
      />
    </div>
  );
}

export default App;
