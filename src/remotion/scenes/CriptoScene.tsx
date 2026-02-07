import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const CriptoScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Simple animation loop
  const cycle = 120; // 4 seconds loop
  const progress = (frame % cycle) / cycle;
  
  const scale = interpolate(progress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center gap-10">
        <div 
          style={{ 
            transform: `scale(${scale})`,
            border: '4px solid #60A5FA',
            borderRadius: '50%',
            padding: '40px',
            boxShadow: '0 0 20px #2563EB'
          }}
        >
          {/* Lock Icon Simulation */}
          <div style={{ width: 100, height: 80, background: '#FCD34D', borderRadius: 10, position: 'relative' }}>
            <div style={{ 
              width: 60, height: 60, 
              border: '10px solid #9CA3AF', 
              borderBottom: 'none',
              borderRadius: '30px 30px 0 0',
              position: 'absolute',
              top: -50,
              left: 20
            }} />
            <div style={{
              width: 20, height: 20,
              background: '#000',
              borderRadius: '50%',
              position: 'absolute',
              top: 30, left: 40
            }} />
          </div>
        </div>
        
        <div className="text-4xl text-blue-300 font-mono">
          {frame % 60 < 30 ? 'ENCRYPTING...' : 'SECURE'}
        </div>

        {/* Binary Stream */}
        <div className="font-mono text-green-500 text-xl opacity-50 break-all max-w-2xl text-center">
          {Array(100).fill(0).map((_, i) => (
             <span key={i} style={{ opacity: Math.random() > 0.5 ? 1 : 0.3 }}>
               {Math.random() > 0.5 ? '1' : '0'}
             </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
