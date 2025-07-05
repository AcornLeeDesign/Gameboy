import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './App.css';

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set scene background to black

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x000000, 0.5); // Black ambient light with 0 intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 12, 0);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // Load GLB model
    const loader = new GLTFLoader();
    
    // Model rotation variables (outside loader for proper scope)
    let gameboyModel = null;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    
    loader.load(
      '/gameboy_2.gltf',
      (gltf) => {
        const model = gltf.scene;
        gameboyModel = model; // Store reference for rotation
        
        // Fix up circuitboard materials first
        model.traverse((object) => {
          if (object.isMesh && object.name) {
            const meshName = object.name.toLowerCase();
            if (meshName.includes('circuitboard') || meshName.includes('mini_circuit')) {
              object.material.opacity = 1;
              object.material.transparent = false;
            }
          }
        });
        
        scene.add(model);

        // Model loaded successfully, hide loading
        setIsLoading(false);

        // Render the scene once to display the model
        renderer.render(scene, camera);
      },
      (progress) => {
        // Calculate loading percentage
        const percentComplete = (progress.loaded / progress.total) * 100;
        setLoadingProgress(Math.round(percentComplete));
        
        // Log model size in MB when fully loaded
        if (progress.loaded === progress.total) {
          const sizeInMB = (progress.total / (1024 * 1024)).toFixed(2);
          console.log(`📦 Model loaded! Size: ${sizeInMB} MB`);
        }
      },
      (error) => {
        console.error('Error loading Gameboy model:', error);
        setIsLoading(false); // Hide loading on error too
      }
    );

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 2));
      renderer.render(scene, camera); // Re-render the scene after resize
    };
    window.addEventListener('resize', handleResize);

    // Mouse interaction for model rotation
    const handleMouseMove = (event) => {
      if (!gameboyModel) return; // Wait for model to load
      
      // Normalize mouse coordinates to -1 to 1
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Convert to subtle rotation angles (even more constrained for pressing effect)
      const maxRotationY = Math.PI / 24; // 7.5 degrees max left/right turn
      const maxRotationX = Math.PI / 32; // 5.6 degrees max forward/back tilt
      
      targetRotationY = -mouseX * maxRotationY; // Turn away from mouse horizontally (pressing effect)
      targetRotationX = -mouseY * maxRotationX; // Tilt away from mouse vertically (pressing effect)
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Smooth model rotation animation loop
    let animationId;
    const animateModel = () => {
      if (gameboyModel) {
        // Smooth interpolation with easing
        const easing = 0.05; // Slower easing for more natural movement
        currentRotationX += (targetRotationX - currentRotationX) * easing;
        currentRotationY += (targetRotationY - currentRotationY) * easing;
        
        // Apply rotations to the model (around its center pivot)
        gameboyModel.rotation.x = currentRotationX;
        gameboyModel.rotation.y = currentRotationY;
        
        renderer.render(scene, camera);
      }
      animationId = requestAnimationFrame(animateModel);
    };
    
    // Start the animation loop
    animateModel();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas"></canvas>
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-5 rounded-lg text-center z-50">
          <div>Loading Gameboy...</div>
          <div className="mt-2">
            <div className="w-48 h-2 bg-gray-300 rounded-md overflow-hidden">
              <div className={`h-full bg-green-500 transition-all duration-300 ease-in-out ${loadingProgress > 0 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div style={{ marginTop: '5px' }}>{loadingProgress}%</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
