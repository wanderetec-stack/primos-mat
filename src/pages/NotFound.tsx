
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../services/reconDb';
import { Terminal, ShieldAlert, Search, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const [logStatus, setLogStatus] = useState<'logging' | 'recorded' | 'error'>('logging');

  useEffect(() => {
    const logTraffic = async () => {
      if (!supabase) {
        setLogStatus('error');
        return;
      }

      try {
        const { error } = await supabase.from('traffic_logs').insert({
          url: location.pathname,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        });

        if (error) throw error;
        setLogStatus('recorded');
      } catch (err) {
        console.error('Failed to log 404:', err);
        setLogStatus('error');
      }
    };

    logTraffic();
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full border border-green-900 bg-black/90 p-8 rounded shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        
        <div className="flex items-center gap-3 mb-6 border-b border-green-900 pb-4">
          <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider">404: ANOMALIA DETECTADA</h1>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-green-400/80">
            <Search className="w-4 h-4" />
            <span>Analisando solicitação de rota:</span>
          </div>
          <code className="block bg-green-900/20 p-3 rounded text-green-300 break-all border border-green-900/50">
            {location.pathname}
          </code>

          <div className="mt-4 p-4 bg-green-900/10 rounded border border-green-900/30">
            <h3 className="text-xs uppercase tracking-widest text-green-600 mb-2">System Logs</h3>
            <div className="space-y-1 text-xs font-mono">
              <p>[SYSTEM] Rota não encontrada no mapa atual.</p>
              <p>[HONEYPOT] Capturando metadados da solicitação...</p>
              {logStatus === 'logging' && <p className="animate-pulse">[NETWORK] Enviando relatório para a Base...</p>}
              {logStatus === 'recorded' && <p className="text-green-400">[SUCCESS] Anomalia registrada. Equipe de Reconhecimento notificada.</p>}
              {logStatus === 'error' && <p className="text-red-500">[ERROR] Falha ao contatar servidor de logs (Modo Offline).</p>}
              <p>[ACTION] Aguardando recuperação manual do operador.</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400">
            Esta página pode ter sido removida ou o link que você seguiu é antigo.
            <br />
            Nosso sistema de vigilância já está ciente desta falha.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 px-6 py-2 rounded transition-colors border border-green-800 hover:border-green-600"
          >
            <Home className="w-4 h-4" />
            Retornar à Base (Home)
          </Link>
        </div>

      </div>
      
      <div className="mt-8 text-xs text-green-900">
        PRIMOS.MAT.BR // SYSTEM ID: RECON-404
      </div>
    </div>
  );
};

export default NotFound;
