import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const TeoriaScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Grid of numbers
  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
  
  const isPrime = (num: number) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  return (
    <AbsoluteFill className="flex items-center justify-center bg-indigo-950 p-10">
      <div className="grid grid-cols-10 gap-4">
        {numbers.map((num) => {
          const prime = isPrime(num);
          const highlight = prime && (frame % 30 < 15); // Flash primes
          
          return (
            <div
              key={num}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-300 ${
                prime 
                  ? 'bg-yellow-500 text-black scale-110 shadow-lg shadow-yellow-500/50' 
                  : 'bg-gray-700 text-gray-400'
              }`}
              style={{
                opacity: highlight ? 1 : (prime ? 0.9 : 0.5),
                transform: highlight ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-20 text-3xl text-white font-bold">
        Padrões nos Números Primos
      </div>
    </AbsoluteFill>
  );
};
