import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function GameboyModel({ onLoaded, mouse, ...props }) {
  const group = useRef();
  const [loadError, setLoadError] = useState(null);
  const [materialsFixed, setMaterialsFixed] = useState(false);
  
  // Load GLTF with error handling
  let scene;
  try {
    const gltf = useGLTF('/gameboy_2.gltf', true);
    scene = gltf.scene;
  } catch (error) {
    console.error('Error loading GLTF:', error);
    setLoadError(error);
  }

  // Debug function to check circuitboard visibility
  const debugCircuitboardVisibility = () => {
    if (!scene) return;
    
    const circuitboards = [];
    scene.traverse((object) => {
      if (object.isMesh && object.name) {
        const meshName = object.name.toLowerCase();
        if (meshName.includes('circuitboard') || meshName.includes('mini_circuit')) {
          circuitboards.push({
            name: object.name,
            visible: object.visible,
            material: object.material ? {
              opacity: object.material.opacity,
              transparent: object.material.transparent,
              side: object.material.side,
              needsUpdate: object.material.needsUpdate
            } : 'No material'
          });
        }
      }
    });
    
    console.log('Circuitboard objects found:', circuitboards);
    return circuitboards.length > 0;
  };

  // Fix circuitboard materials with better handling
  useEffect(() => {
    if (!scene || loadError) return;
    
    let materialsUpdated = false;
    
    scene.traverse((object) => {
      if (object.isMesh && object.name) {
        const meshName = object.name.toLowerCase();
        if (meshName.includes('circuitboard') || meshName.includes('mini_circuit')) {
          // Ensure material exists and is properly configured
          if (object.material) {
            // Clone material to avoid affecting other instances
            object.material = object.material.clone();
            
            // Set visibility properties
            object.material.opacity = 1;
            object.material.transparent = false;
            object.material.alphaTest = 0;
            object.material.side = THREE.DoubleSide; // Ensure both sides are visible
            object.material.needsUpdate = true;
            
            // Ensure the mesh itself is visible
            object.visible = true;
            object.castShadow = true;
            object.receiveShadow = true;
            
            // Force material update
            if (object.material.map) {
              object.material.map.needsUpdate = true;
            }
            
            materialsUpdated = true;
            console.log(`Fixed material for: ${object.name}`);
          }
        }
      }
    });
    
    if (materialsUpdated) {
      setMaterialsFixed(true);
      console.log('Circuitboard materials updated successfully');
      
      // Debug visibility after a short delay
      setTimeout(() => {
        const foundCircuitboards = debugCircuitboardVisibility();
        if (!foundCircuitboards) {
          console.warn('No circuitboard objects found in scene!');
        }
      }, 200);
    }
    
    // Delay onLoaded callback to ensure materials are applied
    if (onLoaded) {
      setTimeout(() => onLoaded(), 100);
    }
  }, [scene, onLoaded, loadError]);

  // Model rotation state
  const targetRotation = useRef([0, 0]);
  const currentRotation = useRef([0, 0]);

  useFrame(() => {
    // Only update rotation if materials are fixed to prevent rendering before setup
    if (!materialsFixed) return;
    
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

  // Error fallback
  if (loadError) {
    return (
      <Html center>
        <div style={{ color: 'red', textAlign: 'center' }}>
          <h3>Failed to load 3D model</h3>
          <p>Please refresh the page</p>
        </div>
      </Html>
    );
  }

  if (!scene) return null;

  return <primitive ref={group} object={scene} {...props} />;
}

function CameraSetup() {
  const { camera, gl } = useThree();
  useEffect(() => {
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);
    gl.setClearColor(0x000000, 1);
    
    // Optimize renderer settings
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputEncoding = THREE.sRGBEncoding;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
  }, [camera, gl]);
  return null;
}

function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // Detect device capabilities for performance optimization
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    maxDPR: 1.5
  });

  useEffect(() => {
    // Simple device capability detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const isLowEnd = !gl || navigator.hardwareConcurrency <= 2;
    
    setDeviceCapabilities({
      isLowEnd,
      maxDPR: isLowEnd ? 1 : Math.min(window.devicePixelRatio * 1.5, 2)
    });
  }, []);

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
    <div>
      <Canvas
        className="block w-full h-full m-0 p-0"
        shadows={!deviceCapabilities.isLowEnd}
        dpr={deviceCapabilities.maxDPR}
        camera={{ fov: 50, near: 1, far: 1000, position: [0, 8, 0] }}
        style={{ width: '100vw', height: '100vh', display: 'block', background: '#000' }}
        gl={{ 
          antialias: !deviceCapabilities.isLowEnd,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <CameraSetup />
        <ambientLight intensity={0.5} color={0x000000} />
        <directionalLight
          position={[2, 12, 0]}
          intensity={1}
          castShadow={!deviceCapabilities.isLowEnd}
          shadow-mapSize-width={deviceCapabilities.isLowEnd ? 1024 : 2048}
          shadow-mapSize-height={deviceCapabilities.isLowEnd ? 1024 : 2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        />
        <Suspense fallback={
          <Html center>
            <div style={{ color: 'white', textAlign: 'center' }}>
              Loading 3D Model...
            </div>
          </Html>
        }>
          <GameboyModel onLoaded={handleModelLoaded} mouse={mouse} />
        </Suspense>
      </Canvas>
      <LoadingScreen 
        isModelLoaded={isModelLoaded}
        onComplete={() => console.log('Loading complete!')}
      />
    </div>
  );
}

export default App;
