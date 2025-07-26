import GameboyModel from './components/GameboyModel.jsx';

function App() {
  return (
    <div className="min-h-screen min-w-full">
      <div className="m-2 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] flex flex-col">
        <header className="h-1/24 flex">
          <h1 className="text-2xl font-['Scandia_Line_Medium']">Gameboy</h1>
        </header>
        <main className="h-full flex flex-col items-center justify-center">
          <GameboyModel />
        </main>
        <footer className="h-1/24 flex items-end">
          <p>made with blender and cursor ai.</p>
        </footer>
      </div> 
    </div>
  );
}

export default App; 