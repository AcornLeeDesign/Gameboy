import GameboyModel from './components/GameboyModel.jsx';

function App() {
  return (
    <div className="App">
      <header className="absolute top-0 left-0 w-full z-10">
        <h1>Gameboy</h1>
      </header>
      <main>
        <GameboyModel />
      </main>
      <footer>
        <p>© 2025 Gameboy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 