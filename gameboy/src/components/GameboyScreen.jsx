import { DefaultScreen, LoadingScreen } from './screens';

function GameboyScreen({ content = 'default' }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        color: '#0f380f',
        userSelect: 'none',
        pointerEvents: 'none',
        textShadow: '1px 1px 0px rgba(0,0,0,0.2)'
      }}
    >
      {content === 'loading' && <LoadingScreen key="loading" />}
      {content === 'default' && <DefaultScreen key="default" />}
    </div>
  );
}

export default GameboyScreen; 