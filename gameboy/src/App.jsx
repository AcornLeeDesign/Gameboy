import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import GameboyModel from "./components/GameboyModel.jsx";
import InitialLoadingScreen from "./components/InitialLoadingScreen.jsx";

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  return (
    <div className="h-screen w-screen bg-black">
      <Canvas
        shadows
        dpr={Math.min(window.devicePixelRatio * 1.5, 2)}
        camera={{ fov: 50, position: [0, 9, 0] }}
        style={{ touchAction: "none" }}
      >
        <ambientLight intensity={0.5} color="#000000" />
        <directionalLight 
          color="white"
          position={[0.6, 3, 0]} 
          intensity={0.3} 
        />

        <Suspense fallback={null}>
          <GameboyModel onLoaded={() => setIsModelLoaded(true)} />
        </Suspense>
      </Canvas>

      <InitialLoadingScreen
        isModelLoaded={isModelLoaded}
        onComplete={() => console.log("Gameboy loaded")}
      />
    </div>
  );
}

export default App;
