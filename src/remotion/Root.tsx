import { Composition, staticFile } from 'remotion';
import { DidacticVideo } from './DidacticVideo';
import { z } from 'zod';

const didacticSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  audioSrc: z.string(),
  sceneType: z.enum(['cripto', 'teoria', 'performance']),
});

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  const DURATION_SEC = 90; // 1:30 didactic summary
  const FRAMES = FPS * DURATION_SEC;

  return (
    <>
      <Composition
        id="CriptografiaVideo"
        component={DidacticVideo}
        schema={didacticSchema}
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
      <Composition
        id="TeoriaVideo"
        component={DidacticVideo}
        schema={didacticSchema}
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
      <Composition
        id="PerformanceVideo"
        component={DidacticVideo}
        schema={didacticSchema}
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
