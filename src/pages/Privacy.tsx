import React from 'react';
import { EyeOff, Server, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">POLÍTICA DE PRIVACIDADE</h1>
        <p className="text-primary font-mono text-sm uppercase tracking-widest">Protocolo de Segurança & Anonimato</p>
      </div>
      
      <div className="glass-panel p-8 md:p-12 rounded-xl space-y-10">
        <div className="flex items-start gap-6">
          <div className="p-3 bg-primary/10 rounded-lg text-primary hidden md:block">
            <EyeOff size={24} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">
              <span className="text-primary md:hidden"><EyeOff size={18} /></span>
              1. Anonimato Absoluto
            </h3>
            <p className="text-gray-400 leading-relaxed">
              O PRIMOS.MAT.BR foi arquitetado com o princípio de <strong>Privacy by Design</strong>. Não exigimos cadastro, login ou qualquer identificação pessoal. Sua navegação é totalmente anônima.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        <div className="flex items-start gap-6">
          <div className="p-3 bg-primary/10 rounded-lg text-primary hidden md:block">
            <Server size={24} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">
               <span className="text-primary md:hidden"><Server size={18} /></span>
               2. Processamento Local (Client-Side)
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Todos os cálculos matemáticos são realizados exclusivamente no seu navegador via JavaScript. <span className="text-white">Nenhum dado numérico é transmitido para nossos servidores.</span> O que você digita, fica na sua máquina.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        <div className="flex items-start gap-6">
          <div className="p-3 bg-primary/10 rounded-lg text-primary hidden md:block">
            <FileText size={24} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2">
              <span className="text-primary md:hidden"><FileText size={18} /></span>
              3. Cookies & LGPD
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Utilizamos estritamente cookies essenciais para funcionamento técnico e segurança (proteção contra ataques DDoS). Não utilizamos cookies de rastreamento publicitário. Estamos em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 font-mono">
        Última atualização do protocolo: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Privacy;
