import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

function Dpad() {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
    };

    return (
        <Html
            position={[-0.489, 0.55, 1.23]}
            rotation={[Math.PI / -2, 0, 0]}
            transform
            occlude
            distanceFactor={1}
            style={{
                pointerEvents: 'auto',
                userSelect: 'none'
            }}
        >
            <div 
                id="gameboy-dpad"
                className={`gameboy-dpad ${isPressed ? 'pressed' : ''}`}
                data-testid="dpad"
                data-component="dpad"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    width: '280px',
                    height: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    border: '5px solid #555',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#333',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                }}
            >
            </div>
        </Html>
    );
}

export default Dpad;