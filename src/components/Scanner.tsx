import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Cpu, Zap, Search } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

const Scanner: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'prime' | 'composite'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
  
  // Security / Rate Limiting State
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(0);
  const { sendAlert } = useTelegram();

  const isPrime = (numStr: string): { isPrime: boolean; factors?: string[]; time: number } => {
    const start = performance.now();
    try {
      const n = BigInt(numStr);
      
      if (n <= 1n) return { isPrime: false, time: performance.now() - start };
      if (n <= 3n) return { isPrime: true, time: performance.now() - start };
      if (n % 2n === 0n) return { isPrime: false, factors: ['2', (n / 2n).toString()], time: performance.now() - start };
      if (n % 3n === 0n) return { isPrime: false, factors: ['3', (n / 3n).toString()], time: performance.now() - start };

      let i = 5n;
      const limit = 10000n; 
      let iterations = 0;

      while (i * i <= n) {
        if (n % i === 0n) return { isPrime: false, factors: [i.toString(), (n / i).toString()], time: performance.now() - start };
        if (n % (i + 2n) === 0n) return { isPrime: false, factors: [(i + 2n).toString(), (n / (i + 2n)).toString()], time: performance.now() - start };
        i += 6n;
        
        iterations++;
        if (iterations > limit) {
           if (performance.now() - start > 2000) {
             throw new Error("Timeout: Number too large for browser scanner.");
           }
        }
      }
      return { isPrime: true, time: performance.now() - start };
    } catch (e) {
      console.error(e);
      return { isPrime: false, time: 0 }; // Fallback
    }
  };

  const handleScan = () => {
    if (!inputVal) return;

    // Rate Limiting / Brute Force Detection
    const now = Date.now();
    if (now - lastScanTime < 1000) {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      if (newCount >= 5) {
        // Trigger Security Alert
        sendAlert('BRUTE_FORCE', `Rapid scanning detected on value: ${inputVal}`, newCount);
        setResultMessage("WARNING: ANOMALOUS ACTIVITY DETECTED. SYSTEM LOCKED.");
        setStatus('composite'); // Fail safely
        return;
      }
    } else {
      setScanCount(0);
    }
    setLastScanTime(now);

    setStatus('scanning');
    setResultMessage('');
    
    // Simulate scanning delay for effect
    setTimeout(() => {
      try {
        const { isPrime: prime, factors, time } = isPrime(inputVal);
        setExecutionTime(time);
        
        if (prime) {
          setStatus('prime');
          setResultMessage(`TARGET IDENTIFIED: PRIME ENTITY.`);
        } else {
          setStatus('composite');
          setResultMessage(`TARGET IDENTIFIED: COMPOSITE ENTITY. Divisible by ${factors?.[0] || 'unknown'}.`);
        }
      } catch (e) {
        setStatus('composite');
        setResultMessage("ERROR: COMPUTATIONAL LIMIT EXCEEDED.");
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass-panel rounded-xl p-1 overflow-hidden">
        <div className="bg-surface/90 rounded-lg p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-3">
                <Activity className="text-primary animate-pulse-slow" />
                PRIMALITY_SCANNER_V1.0
              </h2>
              <p className="text-xs text-muted font-mono mt-1 tracking-wider">SECURE MATHEMATICAL VERIFICATION UNIT</p>
            </div>
            <Cpu className="text-primary/20 animate-spin-slow duration-[10s]" size={40} />
          </div>

          {/* Input Area */}
          <div className="flex flex-col gap-6 relative z-10">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/input:opacity-100 transition-opacity rounded"></div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setInputVal(e.target.value);
                }}
                placeholder="ENTER NUMERIC SEQUENCE..."
                className="w-full bg-black/50 border border-white/10 rounded p-5 text-xl font-mono text-primary placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-primary transition-colors" size={20} />
            </div>

            <button
              onClick={handleScan}
              disabled={status === 'scanning' || !inputVal}
              className="relative overflow-hidden bg-primary/5 hover:bg-primary/10 text-primary border border-primary/30 py-4 px-6 rounded font-mono font-bold tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status === 'scanning' ? (
                  <>
                    <Zap className="animate-bounce" size={18} />
                    PROCESSING_DATA...
                  </>
                ) : (
                  <>
                    INITIATE_SCAN
                    <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Results Area */}
          <div className={`mt-8 relative transition-all duration-500 overflow-hidden rounded border ${
            status === 'idle' ? 'border-transparent h-12' : 
            status === 'scanning' ? 'border-primary/30 bg-primary/5 h-48' : 
            'border-white/10 bg-black/40 h-auto min-h-[12rem]'
          }`}>
            
            {status === 'idle' && (
              <div className="h-full flex items-center justify-center text-muted font-mono text-xs tracking-widest opacity-50">
                [SYSTEM STANDBY] WAITING FOR INPUT...
              </div>
            )}

            {status === 'scanning' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_10px_#00ff41] animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
                <div className="font-mono text-primary text-sm animate-pulse flex flex-col items-center gap-1">
                  <span>DECRYPTING NUMERIC STRUCTURE</span>
                  <span className="text-[10px] text-primary/60">Allocating resources...</span>
                </div>
                
                {/* Decorative scanning grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[length:20px_20px] animate-pulse"></div>
              </div>
            )}

            {(status === 'prime' || status === 'composite') && (
              <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${status === 'prime' ? 'bg-primary' : 'bg-red-500'}`}></div>
                
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-full bg-opacity-10 ${status === 'prime' ? 'bg-primary' : 'bg-red-500'}`}>
                    {status === 'prime' ? (
                      <CheckCircle className={status === 'prime' ? 'text-primary' : 'text-red-500'} size={32} />
                    ) : (
                      <AlertTriangle className="text-red-500" size={32} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold font-mono text-2xl mb-2 ${status === 'prime' ? 'text-primary drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}>
                      {status === 'prime' ? 'PRIME CONFIRMED' : 'COMPOSITE DETECTED'}
                    </h3>
                    <p className="text-sm text-gray-300 font-mono leading-relaxed border-l-2 border-white/5 pl-4 py-2">
                      {resultMessage}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-[10px] font-mono text-muted uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    ALGORITHM: TRIAL_DIVISION
                  </span>
                  <span>EXEC_TIME: {executionTime.toFixed(4)}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
