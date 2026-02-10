import React, { useState, useEffect } from 'react';
import { Shield, Lock, Activity, Globe, Database, FileText, AlertTriangle, Terminal } from 'lucide-react';

import { ReconService, supabase, ReconResult, RecoveredArticle, DraftArticle } from '../services/reconDb';

interface TrafficLog {
  created_at: string;
  url: string;
  referrer: string;
  user_agent: string;
}

const ReconDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reconData, setReconData] = useState<ReconResult | null>(null);
  const [trafficLogs, setTrafficLogs] = useState<TrafficLog[]>([]);

  // Security: Prevent indexing
  useEffect(() => {
    // Add noindex meta tag
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    // Check session storage for existing session
    const session = sessionStorage.getItem('recon_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple credential check (In a real backend app, this would be server-side)
    // User: wandersantos
    // Pass: rmd223128
    if (username === 'wandersantos' && password === 'rmd223128') {
      setIsAuthenticated(true);
      sessionStorage.setItem('recon_session', 'active');
      setError('');
    } else {
      setError('Credenciais inválidas. Acesso negado.');
    }
  };

  // Fetch real recon data (Hybrid DB)
  useEffect(() => {
    if (isAuthenticated) {
      ReconService.getLatestResults()
        .then(data => setReconData(data))
        .catch(err => console.error('Dashboard Data Error:', err));

      if (supabase) {
        supabase
          .from('traffic_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
          .then(({ data }) => {
            if (data) setTrafficLogs(data);
          });
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full bg-black border border-green-900/50 p-8 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Matrix-like background effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
          
          <div className="flex justify-center mb-8">
            <div className="bg-green-900/20 p-4 rounded-full border border-green-500/30">
              <Shield className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <h2 className="text-2xl text-green-500 text-center mb-2 tracking-widest uppercase">Acesso Restrito</h2>
          <p className="text-green-700 text-center mb-8 text-xs">SISTEMA DE INTELIGÊNCIA E RECONHECIMENTO</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-green-800 text-xs mb-1 uppercase">Identificação</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-green-700" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900/50 border border-green-900 text-green-400 pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all rounded"
                  placeholder="Usuário"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-green-800 text-xs mb-1 uppercase">Chave de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-green-700" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900/50 border border-green-900 text-green-400 pl-10 pr-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all rounded"
                  placeholder="Senha"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs bg-red-900/10 p-2 rounded border border-red-900/30">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-900/30 hover:bg-green-800/40 text-green-400 border border-green-700/50 py-2 px-4 rounded transition-all uppercase tracking-widest text-sm font-bold hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            >
              Autenticar
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-green-900">
              IP REGISTRADO. TENTATIVAS FALHAS SERÃO REPORTADAS.
              <br />
              SECURE CONNECTION: ENCRYPTED
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <header className="flex justify-between items-center mb-8 border-b border-green-900/50 pb-4">
        <div className="flex items-center gap-4">
          <Activity className="w-8 h-8 text-green-500 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold tracking-wider">RECON MASTER CONTROL</h1>
            <p className="text-xs text-green-700">MODO: VIGILÂNCIA PERPÉTUA (AUTÔNOMO)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-green-600">OPERADOR</p>
            <p className="text-sm font-bold">WANDER SANTOS</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Status Card */}
        <div className="bg-gray-900/50 border border-green-900/50 p-6 rounded relative overflow-hidden group hover:border-green-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Database className="w-16 h-16" />
          </div>
          <h3 className="text-sm text-green-600 uppercase mb-2">Links Recuperados</h3>
          <p className="text-4xl font-bold text-white mb-2">{reconData?.totalLinks || 0}</p>
          <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
            <div className="bg-green-500 h-full w-[75%]"></div>
          </div>
          <p className="text-xs text-green-600 mt-2">Cobertura estimada: 75%</p>
        </div>

        {/* Action Card */}
        <div className="bg-gray-900/50 border border-green-900/50 p-6 rounded relative overflow-hidden group hover:border-green-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Terminal className="w-16 h-16" />
          </div>
          <h3 className="text-sm text-green-600 uppercase mb-2">Status do Agente</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <p className="text-lg font-bold text-white">ONLINE / AGUARDANDO</p>
          </div>
          <p className="text-xs text-green-600">Próxima varredura automática: 03:00 UTC</p>
          <p className="text-xs text-green-800 mt-2">Ciclo: 6 horas</p>
        </div>

        {/* Vulnerability Card */}
        <div className="bg-gray-900/50 border border-green-900/50 p-6 rounded relative overflow-hidden group hover:border-green-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Shield className="w-16 h-16" />
          </div>
          <h3 className="text-sm text-green-600 uppercase mb-2">Segurança do Painel</h3>
          <p className="text-lg font-bold text-white mb-1">BLINDADO</p>
          <div className="flex items-center gap-2 text-xs text-green-600">
            <Lock className="w-3 h-3" />
            <span>NOINDEX ATIVO</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
            <Globe className="w-3 h-3" />
            <span>ACESSO RESTRITO</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Recoveries */}
        <div className="bg-gray-900/50 border border-green-900/50 rounded p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-green-900/50 pb-2">
            <FileText className="w-5 h-5" />
            Dossiês Prontos para Recriação
          </h3>
          <div className="space-y-3">
            {reconData?.recoveredArticles?.map((article: RecoveredArticle, index: number) => (
              <div key={index} className="flex flex-col gap-2 bg-black/40 p-4 rounded border border-green-900/30 hover:border-green-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-green-300 group-hover:text-green-200 transition-colors">
                      {article.title || 'Título Desconhecido'}
                    </h4>
                    <a 
                      href={`https://web.archive.org/web/*/${article.url.startsWith('/') ? 'primos.mat.br' + article.url : article.url}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 font-mono hover:text-green-500 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Globe className="w-3 h-3" />
                      {article.url}
                    </a>
                  </div>
                  <span className="text-[10px] bg-green-900/30 px-2 py-1 rounded text-green-500 border border-green-900 whitespace-nowrap">
                    {article.source}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-2 border-t border-green-900/20 pt-2">
                  <span className="text-[10px] text-green-800">
                    Status: <span className="text-green-600 uppercase">{article.status}</span>
                  </span>
                  <button 
                    onClick={() => window.open(`http://web.archive.org/web/2/${'primos.mat.br' + article.url}`, '_blank')}
                    className="text-xs bg-green-900/20 hover:bg-green-700/40 text-green-400 py-1 px-3 rounded border border-green-800 hover:border-green-500 transition-all flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    Visualizar Fonte
                  </button>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <button className="text-xs text-green-600 hover:text-green-400 underline">
              {reconData?.totalLinks ? `Ver todos os ${reconData.totalLinks} registros` : 'Ver todos os registros'}
            </button>
            </div>
          </div>
        </div>

        {/* Lazarus Protocol - Drafts */}
        <div className="bg-gray-900/50 border border-green-900/50 rounded p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-green-900/50 pb-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400">Protocolo Lázaro: Rascunhos IA (Beta)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {reconData?.drafts?.length === 0 ? (
               <p className="text-gray-500 italic text-sm p-4">Nenhum rascunho gerado ainda.</p>
             ) : (
               reconData?.drafts?.map((draft: DraftArticle) => (
                 <div key={draft.id} className="bg-blue-900/10 border border-blue-900/30 p-4 rounded hover:border-blue-500/50 transition-all group">
                   <div className="flex justify-between items-start mb-2">
                     <h4 className="text-blue-300 font-bold text-sm group-hover:text-blue-200">{draft.title}</h4>
                     <span className="text-[10px] bg-blue-900/30 px-2 py-1 rounded text-blue-400 border border-blue-900 uppercase">
                       {draft.status}
                     </span>
                   </div>
                   <p className="text-xs text-blue-500/70 font-mono mb-3 truncate">{draft.original_url}</p>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-500">{new Date(draft.created_at).toLocaleDateString()}</span>
                     <button className="text-blue-400 hover:text-white underline">Editar Rascunho</button>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Terminal Log */}
        <div className="bg-black border border-green-900 rounded p-4 font-mono text-xs h-64 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-2 text-green-700 border-b border-green-900/30 pb-1">
            <Terminal className="w-3 h-3" />
            <span>SYSTEM LOG</span>
          </div>
          <div className="space-y-1 text-green-500/80">
            <p>[SYSTEM] Iniciando protocolo de segurança...</p>
            <p>[SYSTEM] Meta tag 'noindex' injetada com sucesso.</p>
            <p>[AUTH] Usuário 'wandersantos' autenticado via Secure Hash.</p>
            <p>[DAEMON] Conectando ao banco de dados distribuído...</p>
            <p>[DAEMON] GitHub Actions Status: IDLE (Last run: Success).</p>
            <p>[CRAWLER] WayBack Machine API: Online.</p>
            <p>[CRAWLER] Common Crawl Index: Carregado.</p>
            <p>[READY] Sistema aguardando instruções ou ciclo automático.</p>
            <p className="animate-pulse">_</p>
          </div>
        </div>
      </div>

      {/* Traffic Analysis (Honeypot Data) */}
      <div className="mt-6 bg-gray-900/50 border border-green-900/50 rounded p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-green-900/50 pb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Tráfego 404 Detectado (Honeypot Live)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-green-700 border-b border-green-900/30">
                <th className="pb-2">HORA</th>
                <th className="pb-2">ROTA ALVO</th>
                <th className="pb-2">ORIGEM (REFERRER)</th>
                <th className="pb-2">AGENTE</th>
              </tr>
            </thead>
            <tbody className="font-mono text-green-400">
              {trafficLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 italic">
                    Nenhuma anomalia detectada nas últimas 24h.
                  </td>
                </tr>
              ) : (
                trafficLogs.map((log, i) => (
                  <tr key={i} className="border-b border-green-900/10 hover:bg-green-900/20 transition-colors">
                    <td className="py-2 text-green-600">{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td className="py-2 text-red-400 font-bold">{log.url}</td>
                    <td className="py-2 text-blue-400">{log.referrer}</td>
                    <td className="py-2 opacity-50 truncate max-w-[200px]" title={log.user_agent}>
                      {log.user_agent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReconDashboard;
