import React from 'react';
import { Info, Code, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
          SOBRE O <span className="text-primary">PROJETO</span>
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-xl border-l-4 border-l-primary space-y-6">
          <p className="text-gray-300 leading-relaxed text-lg">
            O <span className="text-primary font-bold">PRIMOS.MAT.BR</span> é uma iniciativa acadêmica e educacional dedicada à exploração da Teoria dos Números, com foco específico na natureza dos números primos.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Desenvolvido para ser uma referência em design e performance, este projeto une a elegância da matemática pura com a estética da tecnologia moderna.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              icon: <Code className="text-primary" />,
              title: "Código Aberto & Transparência",
              desc: "Nossos algoritmos são executados localmente, garantindo transparência total no processamento dos dados."
            },
            {
              icon: <ShieldCheck className="text-primary" />,
              title: "Segurança & Privacidade",
              desc: "Foco absoluto em anonimato. Sem trackers, sem anúncios, sem coleta de dados desnecessária."
            },
            {
              icon: <Info className="text-primary" />,
              title: "Propósito Educacional",
              desc: "Ferramenta auxiliar para estudantes de ciência da computação e matemática."
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="text-white font-mono font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-xl text-center space-y-4">
        <h2 className="text-2xl font-mono font-bold text-white">Missão</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          "Democratizar o acesso a ferramentas matemáticas de precisão, fomentando o interesse pela criptografia e segurança digital em um ambiente moderno e seguro."
        </p>
      </div>
    </div>
  );
};

export default About;
