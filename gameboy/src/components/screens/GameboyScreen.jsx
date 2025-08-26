import { Footer } from '../../utilities/BarrelExport';

function GameboyScreen({ content = 'default' }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        fontSize: '1rem',
        color: '#0f380f',
      }}
    >
      {content === 'footer' && <Footer key="footer" />}
    </div>
  );
}

export default GameboyScreen; 