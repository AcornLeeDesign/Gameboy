import GameboyModel from './components/GameboyModel.jsx';
import { GradientBackground } from "react-gradient-animation";


function App() {
  return (
    <div className="min-h-screen min-w-full">
      <div className="m-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] flex flex-col">
        {/* 
        <header className="h-1/24 flex">
          <h1 className="text-2xl">Gameboy</h1>
        </header> 
        */}
        <main className="h-full flex flex-col items-center justify-center">
          <GradientBackground
            count={5}
            size={{ min: 800, max: 1000, pulse: .2 }}
            speed={{ x: { min: 0.3, max: 1 }, y: { min: 0.3, max: 1 } }}
            colors={{
              background: '#ffffff',
              particles: ["#1e3a8a", "#1e40af", "#7c3aed"],
            }}
            blending="overlay"
            opacity={{ center: 0.3, edge: 0 }}
            skew={0}
            shapes={["c"]}
            style={{ opacity: 0.5 }}
          />
          <GameboyModel />
        </main>
        {/*
        <footer className="h-1/24 flex items-end">
          <p className="text-[0.8em]">made with blender and cursor ai.</p>
        </footer> 
        */}
      </div> 
    </div>
  );
}

export default App; 