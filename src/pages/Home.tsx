import React from 'react';
import Scanner from '../components/Scanner';
import { Database, Zap, Lock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          SYSTEM ONLINE // V1.0.5
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter text-white animate-slide-up relative z-10">
          PRIMOS<span className="text-primary">.MAT</span>.BR
        </h1>
        
        <p className="text-muted max-w-2xl mx-auto font-mono text-sm md:text-base leading-relaxed animate-slide-up [animation-delay:200ms] relative z-10">
          Infraestrutura digital de alta precisão para exploração matemática.
          <br className="hidden md:block" />
          Identificação de padrões primais em tempo real com segurança criptográfica.
        </p>
      </div>

      {/* Scanner Section */}
      <div className="animate-slide-up [animation-delay:400ms] relative z-20">
        <Scanner />
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 animate-slide-up [animation-delay:600ms]">
        {[
          { 
            icon: <Lock className="text-primary" size={24} />,
            title: "Criptografia", 
            desc: "Fundamentação matemática para protocolos de segurança digital modernos." 
          },
          { 
            icon: <Database className="text-primary" size={24} />,
            title: "Teoria dos Números", 
            desc: "Exploração pura das propriedades dos inteiros e sua distribuição." 
          },
          { 
            icon: <Zap className="text-primary" size={24} />,
            title: "Performance", 
            desc: "Algoritmos otimizados para processamento client-side instantâneo." 
          }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-8 rounded-xl hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="mb-4 p-3 bg-primary/5 rounded-lg w-fit border border-primary/10 group-hover:border-primary/30 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-white font-mono font-bold mb-3 text-lg group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats / Info Strip */}
      <div className="border-y border-white/5 py-12 mt-12 bg-black/20 backdrop-blur-sm animate-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "UPTIME", value: "99.9%" },
            { label: "LATENCY", value: "<50ms" },
            { label: "ENCRYPTION", value: "AES-256" },
            { label: "STATUS", value: "SECURE" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-3xl font-mono font-bold text-white">{stat.value}</span>
              <span className="text-xs text-primary/60 font-mono tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
