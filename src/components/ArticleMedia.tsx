import React, { useState } from 'react';
import { Play, Pause, Volume2, Video, Headphones } from 'lucide-react';

interface MediaProps {
  type: 'audio' | 'video';
  title: string;
  duration: string;
}

const ArticleMedia: React.FC<MediaProps> = ({ type, title, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`w-full rounded-xl overflow-hidden border border-white/10 ${type === 'audio' ? 'bg-white/5' : 'bg-black/40'} mb-8`}>
      {/* Header / Label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-white/5 text-primary text-xs font-mono uppercase tracking-wider">
        {type === 'audio' ? <Headphones size={12} /> : <Video size={12} />}
        {type === 'audio' ? 'Versão em Áudio (IA Narrator)' : 'Explicação Didática (IA Video)'}
      </div>

      <div className="p-6">
        {type === 'video' ? (
          <div className="aspect-video w-full bg-black rounded-lg border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
             {/* Placeholder for Video Content */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="text-center z-10">
              <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform border border-primary/50">
                <Play size={32} className="text-primary ml-1" />
              </div>
              <p className="text-white font-bold text-lg">{title}</p>
              <p className="text-gray-400 text-sm">{duration}</p>
            </div>
            
            {/* Fake Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="w-1/3 h-full bg-primary"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">{title}</span>
                <span className="text-gray-400 text-xs">{duration}</span>
              </div>
              {/* Fake Audio Waveform */}
              <div className="flex items-end gap-1 h-8 opacity-50">
                {[...Array(40)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-primary rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>

            <Volume2 size={20} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleMedia;
