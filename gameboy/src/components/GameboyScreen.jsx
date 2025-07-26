import { DefaultScreen, LoadingScreen, MenuScreen, GameScreen } from './screens';

function GameboyScreen({ content = 'default' }) {
  const renderContent = () => {
    switch (content) {
      case 'loading':
        return <LoadingScreen />;
      case 'game':
        return <GameScreen />;
      case 'menu':
        return <MenuScreen />;
      default:
        return <DefaultScreen />;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#9bbc0f',
        border: '2px solid #0f380f',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#0f380f',
        userSelect: 'none',
        pointerEvents: 'none',
        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)',
        textShadow: '1px 1px 0px rgba(0,0,0,0.2)'
      }}
    >
      {renderContent()}
    </div>
  );
}

export default GameboyScreen; 