import { Composition, staticFile } from 'remotion';
import { DidacticVideo, DidacticVideoProps } from './DidacticVideo';

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  const DURATION_SEC = 90; // 1:30 didactic summary
  const FRAMES = FPS * DURATION_SEC;

  return (
    <>
      <Composition<DidacticVideoProps, any>
        id="CriptografiaVideo"
        component={DidacticVideo}
        durationInFrames={FRAMES}
        fps={FPS}
        width={1280} // 720p for faster render
        height={720}
        defaultProps={{
          title: 'Criptografia RSA',
          subtitle: 'Segurança Matemática',
          audioSrc: staticFile('/audio/criptografia.mp3'),
          sceneType: 'cripto',
        }}
      />
      <Composition<DidacticVideoProps, any>
        id="TeoriaVideo"
        component={DidacticVideo}
        durationInFrames={FRAMES}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Teoria dos Números',
          subtitle: 'A Base da Matemática',
          audioSrc: staticFile('/audio/teoria_numeros.mp3'),
          sceneType: 'teoria',
        }}
      />
      <Composition<DidacticVideoProps, any>
        id="PerformanceVideo"
        component={DidacticVideo}
        durationInFrames={FRAMES}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{
          title: 'Performance Web',
          subtitle: 'Algoritmos e Big O',
          audioSrc: staticFile('/audio/performance.mp3'),
          sceneType: 'performance',
        }}
      />
    </>
  );
};
