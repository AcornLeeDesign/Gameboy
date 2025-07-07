import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

function GameboyModel({ onLoaded, mouse, ...props }) {
  const group = useRef();
  const { scene } = useGLTF('/gameboy_2.gltf', true);
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
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);
    gl.setClearColor(0x000000, 1);
  }, [camera, gl]);
  return null;
}

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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

  // Loading progress simulation (since useGLTF doesn't provide progress natively)
  // We'll show a fake progress bar for 1.2s, then fade out
  useEffect(() => {
    if (!isLoading) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10 + 5;
      setLoadingProgress(Math.min(100, Math.round(progress)));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isLoading]);

  // When model is loaded, finish loading
  const handleModelLoaded = () => {
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLoadingScreen(false), 500);
    }, 200);
  };

  return (
    <div>
      <Canvas
        id="myThreeJsCanvas"
        shadows
        dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
        camera={{ fov: 50, near: 1, far: 1000, position: [0, 8, 0] }}
        style={{ width: '100vw', height: '100vh', display: 'block', background: '#000' }}
      >
        <CameraSetup />
        <ambientLight intensity={0.5} color={0x000000} />
        <directionalLight
          position={[2, 12, 0]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <GameboyModel onLoaded={handleModelLoaded} mouse={mouse} />
        </Suspense>
        {/* Optionally add environment for better lighting */}
        {/* <Environment preset="city" /> */}
      </Canvas>
      {showLoadingScreen && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black text-white text-center z-50 transition-opacity duration-1000 ${
            isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: 'Courier New, monospace' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold">{Math.min(loadingProgress || 0, 100)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
