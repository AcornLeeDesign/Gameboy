import { useEffect } from 'react';
import { useGLTF, PresentationControls, Html } from '@react-three/drei';

function GameboyModel({ onLoaded, screenContent = 'default', GameboyScreenComponent, ...props }) {
  const base = import.meta.env.BASE_URL;
  const url = base.endsWith('/') ? `${base}gameboy_2.gltf` : `${base}/gameboy_2.gltf`;
  const { scene } = useGLTF(url, true);
  
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

  return (
    <>
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
          <GameboyScreenComponent content={screenContent} />
        </Html>
      </PresentationControls>
    </>
  );
}

export default GameboyModel;
