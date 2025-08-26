import { useEffect, useRef, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function GameboyModel({ onLoaded, screenContent = 'default', GameboyScreenComponent, ...props }) {
  const base = import.meta.env.BASE_URL;
  const url = base.endsWith('/') ? `${base}gameboy_2.gltf` : `${base}/gameboy_2.gltf`;
  const { scene } = useGLTF(url, true);
  const meshRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Global mousemove listener - only on desktop
  useEffect(() => {
    if (isMobile) return; // Don't add mouse listener on mobile
    
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  
  // Fix up circuitboard materials and set render order for Top_support
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh && object.name) {
        const meshName = object.name.toLowerCase();
        if (meshName.includes('circuitboard') || meshName.includes('mini_circuit')) {
          object.material.opacity = 1;
          object.material.transparent = false;
        }
        
        // Set Top_support to render after case mesh
        if (object.name === 'Top_support') {
          object.renderOrder = 1;
        }
      }
    });
    if (onLoaded) onLoaded();
  }, [scene, onLoaded]);

  // Smooth rotation based on mouse position across entire canvas - only on desktop
  useFrame(() => {
    if (meshRef.current && !isMobile) {
      // Tilt model based on mouse position
      // Increased tilt significantly: from 0.07 to 0.12 radians (≈6.9 degrees)
      const maxRotation = 0.12;
      meshRef.current.rotation.x = mouse.y * maxRotation;
      meshRef.current.rotation.y = mouse.x * maxRotation;
    }
  });

  return (
    <>
      <directionalLight 
        position={[0.4, 2, 0]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
      />
      <group
        ref={meshRef}
        {...props}
      >
        <primitive object={scene} />
        <Html
          position={[0, 0.55, -0.7]}
          rotation={[Math.PI / -2, 0, 0]}
          transform
          occlude
          distanceFactor={1}
          raycast={isMobile ? undefined : () => null}
          style={{
            width: '610px',
            height: '810px',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            touchAction: isMobile ? 'auto' : 'none'
          }}
        >
          <GameboyScreenComponent content={screenContent} />
        </Html>
      </group>
    </>
  );
}

export default GameboyModel;
