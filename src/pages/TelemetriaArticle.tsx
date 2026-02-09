import React, { useEffect } from 'react';
import { Activity, Server, Network, Shield, Cpu, ChevronRight, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TelemetriaArticle: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <article className="prose prose-invert prose-lg max-w-none">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-mono">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-primary">Sistema</span>
          <ChevronRight size={14} />
          <span className="text-white">Relatório de Telemetria</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Activity size={12} />
              Status: Operacional
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Server size={12} />
              Node: V1.0.14-VPS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
            Relatório Técnico de Telemetria e Monitoramento de Rede
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-mono">
            Análise detalhada da infraestrutura de monitoramento em tempo real, latência distribuída e métricas de desempenho do cluster de processamento de números primos.
          </p>
        </header>

        {/* Dashboard Grid Mockup */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 border border-green-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Network className="text-green-500" size={24} />
              <h3 className="text-lg font-bold text-white m-0">Latência Global</h3>
            </div>
            <p className="text-4xl font-mono font-bold text-white mb-1">24ms</p>
            <p className="text-xs text-gray-500">Média ponderada (América do Sul)</p>
          </div>
          
          <div className="bg-black/40 border border-blue-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-white m-0">Carga da CPU</h3>
            </div>
            <p className="text-4xl font-mono font-bold text-white mb-1">12%</p>
            <p className="text-xs text-gray-500">Ocioso / Aguardando Jobs</p>
          </div>

          <div className="bg-black/40 border border-purple-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-purple-500" size={24} />
              <h3 className="text-lg font-bold text-white m-0">Mitigação</h3>
            </div>
            <p className="text-4xl font-mono font-bold text-white mb-1">ATIVO</p>
            <p className="text-xs text-gray-500">WAF & DDoS Protection</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-gray-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Globe className="text-primary" />
            1. Arquitetura de Monitoramento Distribuído
          </h2>
          <p>
            O sistema <strong>Primos.mat.br</strong> utiliza uma arquitetura de monitoramento híbrida, combinando verificações ativas (Synthetic Monitoring) e passivas (Real User Monitoring - RUM). Nossa infraestrutura está hospedada em um ambiente VPS de alta performance, protegido por uma camada de Edge Computing (Cloudflare).
          </p>
          <p>
            O componente de telemetria visível na página inicial (TelemetryMonitor) executa pings assíncronos (método HEAD) contra nossa própria infraestrutura para medir a latência real percebida pelo cliente, eliminando imprecisões de testes sintéticos externos.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Activity className="text-primary" />
            2. Metodologia de Cálculo de Uptime
          </h2>
          <p>
            O cálculo de disponibilidade (Uptime) exibido não é apenas um contador estático. Ele reflete o tempo de atividade do processo do servidor de aplicação (Node.js/Nginx) desde a última reinicialização ou deploy.
          </p>
          <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-primary font-mono text-sm overflow-x-auto">
            <code>
              const uptime = Date.now() - serverStartTime;<br/>
              // Onde serverStartTime é sincronizado com o timestamp do deploy
            </code>
          </div>
          <p>
            Isso garante transparência total sobre a estabilidade do sistema. Reinicializações para manutenção ou atualizações de segurança resetam este contador, mantendo a métrica honesta.
          </p>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-12">
            <Lock className="text-primary" />
            3. Segurança e Detecção de Anomalias
          </h2>
          <p>
            O sistema inclui proteções integradas contra abuso (Rate Limiting) no Scanner de Primalidade. Tentativas de força bruta ou escaneamento automatizado rápido são detectadas heuristicamente:
          </p>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>Throttling Dinâmico:</strong> Se um IP realiza mais de 5 verificações por segundo, o acesso é temporariamente suspenso.
            </li>
            <li>
              <strong>Análise de Padrões:</strong> Entradas não numéricas ou payloads maliciosos (SQL Injection, XSS) são sanitizados e registrados antes mesmo de chegarem ao motor de processamento matemático.
            </li>
            <li>
              <strong>Integração com Telegram:</strong> Alertas críticos de segurança são despachados em tempo real para o canal de administração via API criptografada.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Conclusão Técnica</h2>
          <p>
            A telemetria não é apenas um "painel bonito"; é a ferramenta vital que nos permite garantir a precisão dos cálculos matemáticos distribuídos. Ao monitorar a latência e a integridade do sistema em tempo real, asseguramos que cada verificação de número primo seja processada com a máxima eficiência e confiabilidade.
          </p>
        </div>

      </article>
    </div>
  );
};

export default TelemetriaArticle;
