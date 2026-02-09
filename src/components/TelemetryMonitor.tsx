import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TelemetryMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState({
    latency: 0,
    uptime: '0h 0m',
    status: 'OFFLINE',
    discoveries: 1240 // Base mock number that increments
  });

  useEffect(() => {
    // Initial Start Time (Simulated Server Start)
    const startTime = Date.now() - (1000 * 60 * 60 * 2 + 1000 * 60 * 15); // Start 2h 15m ago

    const updateTelemetry = async () => {
      const startPing = performance.now();
      try {
        // Real ping to own server
        await fetch('/', { method: 'HEAD', cache: 'no-store' });
        const endPing = performance.now();
        const currentLatency = Math.round(endPing - startPing);

        // Calculate Uptime
        const now = Date.now();
        const diff = now - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTelemetry(prev => ({
          ...prev,
          latency: currentLatency,
          status: 'ONLINE',
          uptime: `${hours}h ${minutes}m`,
          discoveries: prev.discoveries + (Math.random() > 0.7 ? 1 : 0) // Simulate live activity
        }));
      } catch (e) {
        setTelemetry(prev => ({ ...prev, status: 'OFFLINE', latency: 0 }));
      }
    };

    // Initial call
    updateTelemetry();

    // Interval
    const interval = setInterval(updateTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      onClick={() => navigate('/telemetria-sistema')}
      className="border-y border-white/5 py-12 mt-12 bg-black/20 backdrop-blur-sm animate-fade-in cursor-pointer hover:bg-white/5 transition-colors group"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "DISPONIBILIDADE", value: telemetry.uptime },
          { label: "LATÊNCIA REAL", value: telemetry.status === 'ONLINE' ? `${telemetry.latency}ms` : '--' },
          { label: "PRIMOS VERIFICADOS", value: telemetry.discoveries.toLocaleString() },
          { label: "STATUS DO SISTEMA", value: telemetry.status, color: telemetry.status === 'ONLINE' ? 'text-green-500' : 'text-red-500' }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className={`text-3xl font-mono font-bold ${stat.color || 'text-white'} group-hover:scale-105 transition-transform duration-300`}>
              {stat.value}
            </span>
            <span className="text-xs text-primary/60 font-mono tracking-widest uppercase flex items-center justify-center gap-1">
              {stat.label}
              {stat.label === 'STATUS DO SISTEMA' && (
                <span className={`w-2 h-2 rounded-full ${telemetry.status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] text-primary font-mono border border-primary/30 px-2 py-1 rounded">
          CLIQUE PARA VER RELATÓRIO TÉCNICO COMPLETO
        </span>
      </div>
    </div>
  );
};

export default TelemetryMonitor;
