import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, PresentationControls, Environment, OrbitControls, Stage, Html } from '@react-three/drei'
import InitialLoadingScreen from './InitialLoadingScreen';
import GameboyScreen from './GameboyScreen';

function GameboyModel({ onLoaded, screenContent = 'default', ...props }) {
  const group = useRef();
  const screenRef = useRef();
  // const { scene } = useGLTF('/gameboy_2.gltf', true);
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
        // Find the screen mesh for positioning the HTML overlay
        if (meshName.includes('screen') || meshName.includes('display')) {
          screenRef.current = object;
        }
      }
    });
    if (onLoaded) onLoaded();
  }, [scene, onLoaded]);

  return (
    <group ref={group}>
      <primitive object={scene} {...props} />
      <Html
        position={[0, 0.5, 0.1]}
        transform
        occlude
        distanceFactor={0.5}
        style={{
          width: '200px',
          height: '160px',
          pointerEvents: 'none'
        }}
      >
        <GameboyScreen content={screenContent} />
      </Html>
    </group>
  );
}

function CameraSetup() {
  const { camera, gl } = useThree();
  useEffect(() => {
    camera.position.set(0, 6, 0);
    camera.lookAt(0, 0, 0);
    gl.setClearColor(0x000000, 1);
  }, [camera, gl]);
  return null;
}

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [screenContent, setScreenContent] = useState('default');

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // Cycle through different screen states for demo
    setTimeout(() => setScreenContent('loading'), 2000);
    setTimeout(() => setScreenContent('menu'), 4000);
    setTimeout(() => setScreenContent('game'), 6000);
  };

  return (
    <div className="flex w-full h-full flex items-center justify-center m-0 p-0 overflow-hidden">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        className="bg-black"
        shadows
        dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
        camera={{ fov: 50, position: [0, 6, 0] }}
      >
        <CameraSetup />
        <Suspense fallback={null}>
          <directionalLight 
            position={[5, 5, 0]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={128}
            shadow-mapSize-height={128}
          />
          <PresentationControls
            global
            zoom={0.8}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
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
