import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Video, Headphones, AlertCircle } from 'lucide-react';

interface MediaProps {
  type: 'audio' | 'video';
  title: string;
  duration: string;
  mediaUrl?: string; // URL opcional, se não fornecida mostra aviso
}

const ArticleMedia: React.FC<MediaProps> = ({ type, title, duration, mediaUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // URL de fallback segura para demonstração se nenhuma for fornecida
  const finalUrl = mediaUrl || (type === 'audio' 
    ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
    : 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm');

  const togglePlay = () => {
    if (type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => setError(true));
      }
      setIsPlaying(!isPlaying);
    } else if (type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setError(true));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`w-full rounded-xl overflow-hidden border border-white/10 ${type === 'audio' ? 'bg-white/5' : 'bg-black/40'} mb-8 shadow-lg`}>
      {/* Header / Label */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-white/5">
        <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider">
          {type === 'audio' ? <Headphones size={12} /> : <Video size={12} />}
          {type === 'audio' ? 'Versão em Áudio (IA Narrator)' : 'Explicação Didática (IA Video)'}
        </div>
        {!mediaUrl && (
          <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-mono">
            <AlertCircle size={10} />
            DEMO MODE
          </div>
        )}
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 p-4 rounded-lg">
            <AlertCircle size={16} />
            Erro ao carregar mídia. Verifique a conexão ou a URL do arquivo.
          </div>
        ) : type === 'video' ? (
          <div className="aspect-video w-full bg-black rounded-lg border border-white/10 overflow-hidden relative group">
            <video 
              ref={videoRef}
              src={finalUrl}
              className="w-full h-full object-cover"
              controls
              poster="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setError(true)}
            >
              Seu navegador não suporta a tag de vídeo.
            </video>
            
            {/* Overlay Title (Só aparece se pausado) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-primary/50">
                  <Play size={32} className="text-primary ml-1" />
                </div>
                <p className="text-white font-bold text-lg drop-shadow-md">{title}</p>
                <p className="text-gray-300 text-sm drop-shadow-md">{duration}</p>
              </div>
            )}
          </div>
        ) : (
          /* Audio Player Customizado */
          <div className="flex items-center gap-4">
            <audio 
              ref={audioRef} 
              src={finalUrl} 
              onEnded={handleEnded}
              onError={() => setError(true)}
            />
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0 shadow-[0_0_15px_rgba(0,255,127,0.3)]"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium truncate pr-2">{title}</span>
                <span className="text-gray-400 text-xs font-mono">{duration}</span>
              </div>
              
              {/* Visualizador de Áudio Realista (CSS Animation) */}
              <div className="flex items-end gap-[2px] h-8 opacity-80 overflow-hidden mask-linear-fade">
                {[...Array(40)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-primary rounded-t-sm transition-all duration-300 origin-bottom ${isPlaying ? 'animate-music-bar' : 'h-1'}`}
                    style={{ 
                      height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '4px',
                      animationDelay: `${i * 0.05}s`,
                      opacity: isPlaying ? 1 : 0.3
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <Volume2 size={20} className="text-gray-400 hidden sm:block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleMedia;
