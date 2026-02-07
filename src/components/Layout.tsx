import React, { useState, useEffect } from 'react';
import { Shield, Lock, Menu, X, Terminal } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { trackVisit } = useTelegram();

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === 'index.html' && (currentPage === '/' || currentPage === 'index.html')) return true;
    return currentPage.includes(path.replace('.html', ''));
  };

  return (
    <div className="min-h-screen flex flex-col text-text font-sans selection-highlight relative">
      {/* Scan line effect overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent border-transparent'}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="index.html" className="group flex items-center gap-3 text-primary font-mono text-xl tracking-tighter hover:opacity-80 transition-opacity">
            <div className="p-2 rounded bg-primary/5 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Terminal size={20} className="text-primary" />
            </div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white group-hover:to-primary transition-all duration-500">
              PRIMOS.MAT.BR
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="index.html" 
              className={`relative text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary ${
                isActive('index.html') ? 'text-primary' : 'text-muted'
              }`}
            >
              HOME
              {isActive('index.html') && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(0,255,65,0.8)] animate-fade-in"></span>
              )}
            </a>
            <a 
              href="sobre.html" 
              className={`relative text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary ${
                isActive('sobre.html') ? 'text-primary' : 'text-muted'
              }`}
            >
              SOBRE
              {isActive('sobre.html') && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(0,255,65,0.8)] animate-fade-in"></span>
              )}
            </a>
          </nav>

          <button className="md:hidden text-primary p-2 glass-button rounded" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
          <a href="index.html" className="text-lg font-medium hover:text-primary transition-colors">HOME</a>
          <a href="sobre.html" className="text-lg font-medium hover:text-primary transition-colors">SOBRE</a>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 pt-32 pb-16 relative z-10 animate-fade-in">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-sm py-12 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 text-primary/80 font-mono text-sm px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <Shield size={14} />
              <span>PROTECTED BY MATHEMATICS</span>
            </div>
            <p className="text-xs text-muted max-w-xs text-center md:text-left">
              © {new Date().getFullYear()} Primos.mat.br. Desenvolvido e criado por Wander Santos.
            </p>
          </div>
          
          <div className="flex gap-8 text-xs text-muted font-mono tracking-wide">
            <a href="privacidade.html" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">
              <Lock size={12} /> PRIVACIDADE
            </a>
            <a href="termos.html" className="hover:text-primary transition-colors hover:translate-x-1 duration-300">
              TERMOS DE USO
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
