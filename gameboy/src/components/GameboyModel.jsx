import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import LoadingScreen from './LoadingScreen';

function GameboyModel({ onLoaded, mouse, ...props }) {
  const group = useRef();
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
      }
    });
    if (onLoaded) onLoaded();
  }, [scene, onLoaded]);

  // Model rotation state
  const targetRotation = useRef([0, 0]);
  const currentRotation = useRef([0, 0]);

  useFrame(() => {
    // Easing
    currentRotation.current[0] += (targetRotation.current[0] - currentRotation.current[0]) * 0.05;
    currentRotation.current[1] += (targetRotation.current[1] - currentRotation.current[1]) * 0.05;
    if (group.current) {
      group.current.rotation.x = currentRotation.current[0];
      group.current.rotation.y = currentRotation.current[1];
    }
  });

  // Update target rotation from mouse
  useEffect(() => {
    if (!mouse) return;
    const maxY = Math.PI / 24;
    const maxX = Math.PI / 32;
    targetRotation.current[1] = -mouse.x * maxY;
    targetRotation.current[0] = -mouse.y * maxX;
  }, [mouse]);

  return <primitive ref={group} object={scene} {...props} />;
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
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Mouse move handler for rotation
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
  };

  return (
    <div className="flex w-full h-full flex items-center justify-center m-0 p-0 overflow-hidden">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        className="bg-black"
        shadows
        dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
        camera={{ fov: 50, near: 1, far: 1000, position: [0, 8, 0] }}
      >
        <CameraSetup />
        <ambientLight intensity={1} color={0x242424} />
        <directionalLight
          position={[4, 16, 0]}
          intensity={1}
          castShadow
          shadow-mapSize-width={128}
          shadow-mapSize-height={128}
        />
        <Suspense fallback={null}>
          <GameboyModel onLoaded={handleModelLoaded} mouse={mouse} />
        </Suspense>
        {/* Optionally add environment for better lighting */}
        {/* <Environment preset="city" /> */}
      </Canvas>
      <LoadingScreen 
        isModelLoaded={isModelLoaded}
        onComplete={() => console.log('Loading complete!')}
      />
    </div>
  );
}

export default App;
