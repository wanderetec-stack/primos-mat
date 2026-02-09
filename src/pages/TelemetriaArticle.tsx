import React, { useEffect } from 'react';
import { ArrowLeft, Activity, Server, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const TelemetriaArticle: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        <article className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                INFRAESTRUTURA
              </span>
              <span className="text-gray-500 text-xs font-mono">
                SISTEMAS DISTRIBUÍDOS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tight">
              Telemetria em Tempo Real: O Pulso do Sistema
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
              Entenda como monitoramos cada milissegundo da performance para garantir a descoberta instantânea de números primos.
            </p>
          </header>

          <div className="prose prose-invert max-w-none">
            <div className="bg-black/30 rounded-xl p-6 mb-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-primary" />
                O que você vê no Dashboard?
              </h3>
              <p className="text-gray-400 mb-0">
                O painel de telemetria na página inicial não é apenas estético. Ele conecta seu navegador diretamente aos nossos servidores de borda (Edge Servers) para medir a saúde da conexão em tempo real.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 my-10">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="text-blue-400" />
                  Latência (Ping)
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  A latência é o tempo que um pacote de dados leva para viajar do seu dispositivo até nossa infraestrutura e voltar. 
                  <br/><br/>
                  Para cálculos de criptografia em tempo real, cada milissegundo conta. Nosso sistema otimizado busca manter essa latência abaixo de 50ms, garantindo que a verificação de primalidade pareça instantânea.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Server className="text-green-400" />
                  Disponibilidade (Uptime)
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Indica há quanto tempo o núcleo do sistema está operando ininterruptamente desde a última atualização crítica.
                  <br/><br/>
                  Nossa arquitetura utiliza "Hot Swapping", permitindo atualizações de código sem derrubar o serviço para os usuários.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Por que isso importa?</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Em aplicações matemáticas de alta performance, a confiança na infraestrutura é tão importante quanto a precisão dos cálculos.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Shield className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-gray-400">
                  <strong className="text-white">Transparência Total:</strong> Você sabe exatamente se o sistema está operando em capacidade máxima.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-gray-400">
                  <strong className="text-white">Detecção de Anomalias:</strong> Quedas na métrica "Primos Verificados" podem indicar ataques de negação de serviço ou falhas na rede global.
                </span>
              </li>
            </ul>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-12">
              <p className="text-sm text-primary font-mono text-center">
                ESTE SISTEMA ESTÁ OPERANDO AGORA COM CRIPTOGRAFIA DE PONTA A PONTA.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TelemetriaArticle;
