import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';
import { CriptoScene } from './scenes/CriptoScene';
import { TeoriaScene } from './scenes/TeoriaScene';
import { PerformanceScene } from './scenes/PerformanceScene';

export interface DidacticVideoProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  sceneType: 'cripto' | 'teoria' | 'performance';
}

export const DidacticVideo: React.FC<DidacticVideoProps> = ({
  title,
  subtitle,
  audioSrc,
  sceneType,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // Fade in scene
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  
  // Fade out audio at the end
  const audioVolume = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  const renderScene = () => {
    switch (sceneType) {
      case 'cripto':
        return <CriptoScene />;
      case 'teoria':
        return <TeoriaScene />;
      case 'performance':
        return <PerformanceScene />;
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      <Audio src={audioSrc} volume={audioVolume} />
      
      {/* Intro Overlay - Fades out after 5 seconds */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <AbsoluteFill className="flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
          <h1 className="text-6xl font-bold text-white mb-4 text-center px-4" style={{ fontFamily: 'Arial' }}>
            {title}
          </h1>
          <h2 className="text-3xl text-blue-400" style={{ fontFamily: 'Arial' }}>
            {subtitle}
          </h2>
        </AbsoluteFill>
      </Sequence>

      {/* Main Content */}
      <AbsoluteFill style={{ opacity }}>
        {renderScene()}
      </AbsoluteFill>

      {/* Persistent Footer */}
      <AbsoluteFill className="justify-end items-center pb-10 pointer-events-none">
        <div className="text-white text-xl bg-black bg-opacity-50 px-4 py-2 rounded">
          Primos.mat.br | Explicação Didática IA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
