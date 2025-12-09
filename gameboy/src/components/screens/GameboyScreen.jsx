import { Footer, SmallScreen } from '../../utilities/BarrelExport';

function GameboyScreen({ content = 'default' }) {
  const isSmallScreen = content === 'smallscreen';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        fontSize: '1rem',
        color: '#0f380f',
        // border: '2px solid black',
        justifyContent: isSmallScreen ? 'center' : 'flex-start', // Center horizontally only if SmallScreen
        alignItems: isSmallScreen ? 'center' : 'flex-start',   // Center vertically only if SmallScreen
      }}
    >
      {content === 'footer' && <Footer key="footer" />}
      {isSmallScreen && <SmallScreen key="smallscreen" />}
    </div>
  );
}

export default GameboyScreen; 