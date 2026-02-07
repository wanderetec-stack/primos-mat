import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const PerformanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const width = 800;
  const height = 400;
  
  // Animation progress
  const progress = (frame % 300) / 300; // 10 second loop
  
  // O(n^2) curve
  const pathDataN2 = `M 0 ${height} ` + Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * width;
    const y = height - Math.pow(i / 100, 2) * height * progress;
    return `L ${x} ${y}`;
  }).join(' ');

  // O(log n) curve
  const pathDataLogN = `M 0 ${height} ` + Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * width;
    if (i === 0) return `L ${x} ${height}`;
    const y = height - (Math.log(i + 1) / Math.log(101)) * (height * 0.5) * progress;
    return `L ${x} ${y}`;
  }).join(' ');

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-slate-900">
      <div className="relative border-l-4 border-b-4 border-white p-4" style={{ width: width + 50, height: height + 50 }}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line 
              key={i} 
              x1="0" 
              y1={i * (height / 4)} 
              x2={width} 
              y2={i * (height / 4)} 
              stroke="#334155" 
              strokeWidth="1" 
            />
          ))}

          {/* O(n^2) - Red */}
          <path d={pathDataN2} fill="none" stroke="#EF4444" strokeWidth="5" />
          <text x={width - 50} y={50} fill="#EF4444" fontSize="24" fontFamily="monospace">O(n²)</text>

          {/* O(log n) - Green */}
          <path d={pathDataLogN} fill="none" stroke="#10B981" strokeWidth="5" />
          <text x={width - 50} y={height - 50} fill="#10B981" fontSize="24" fontFamily="monospace">O(log n)</text>
        </svg>
      </div>
      <div className="mt-10 text-4xl text-white font-bold font-mono">
        Complexidade de Algoritmos
      </div>
    </AbsoluteFill>
  );
};
