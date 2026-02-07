import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-50 animate-slide-up">
      <div className="glass-panel p-6 rounded-xl border-l-4 border-l-primary relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <h4 className="text-primary font-mono font-bold text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            SYSTEM COMPLIANCE
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Utilizamos cookies essenciais para segurança e anonimato da conexão, conforme a <span className="text-white">LGPD</span>.
          </p>
        </div>

        <button 
          onClick={acceptCookies}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2 rounded text-xs font-mono font-bold tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        >
          ACEITAR PROTOCOLO
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
