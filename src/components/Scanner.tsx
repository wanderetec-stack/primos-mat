import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Cpu, Search, Brain, Sparkles } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

const Scanner: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'prime' | 'composite'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [executionTime, setExecutionTime] = useState(0);
  const [resultData, setResultData] = useState<{number: string, isPrime: boolean, factors?: string[], time: number} | null>(null);
  
  // Security / Rate Limiting State
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(0);
  const { sendAlert } = useTelegram();

  const getAIInsights = (n: bigint, isPrime: boolean): string => {
    if (n === 2n) return "AI CORE: The only even prime number. The basis of all binary computation.";
    if (n < 2n) return "AI CORE: Value too low. Primes are integers greater than 1.";
    
    const s = n.toString();
    const isPalindrome = s === s.split('').reverse().join('');

    if (isPrime) {
       if (isPalindrome) return "AI CORE: PALINDROMIC PRIME DETECTED! Reads the same forwards and backwards.";
       if (n > 1000000n) return "AI CORE: High-magnitude prime detected. Suitable for cryptographic key generation.";
       if ((n - 1n) % 4n === 0n) return "AI CORE: Pythagorean Prime (4n + 1). Can be expressed as sum of two squares.";
       return "AI CORE: Valid Prime Entity confirmed. Structure is indivisible.";
    } else {
       if (n % 2n === 0n) return "AI CORE: Even number detected. Trivially divisible by 2.";
       if (n % 5n === 0n) return "AI CORE: Pattern ends in 0 or 5. Divisible by 5.";
       const sum = s.split('').reduce((a, b) => a + parseInt(b), 0);
       if (sum % 3 === 0) return `AI CORE: Digital root sum is ${sum}. Divisible by 3 via divisibility rule.`;
       if (isPalindrome) return "AI CORE: Palindromic Composite. Symmetric but divisible.";
       return "AI CORE: Composite structure. Decomposable into smaller prime factors.";
    }
  };

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

    // Smart Parsing: Extract first sequence of digits
    const match = inputVal.match(/\d+/);
    if (!match) {
        setResultMessage("ERROR: NO NUMERIC DATA DETECTED IN INPUT.");
        setStatus('composite');
        return;
    }
    const targetNum = match[0];

    // Rate Limiting / Brute Force Detection
    const now = Date.now();
    if (now - lastScanTime < 1000) {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      if (newCount >= 5) {
        // Trigger Security Alert
        sendAlert('BRUTE_FORCE', `Rapid scanning detected on value: ${targetNum}`, newCount);
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
    setAiInsight('');
    
    // Simulate slight delay for "Scanner Effect"
    setTimeout(() => {
      const result = isPrime(targetNum);
      const insight = getAIInsights(BigInt(targetNum), result.isPrime);
      
      setResultData({
          number: targetNum,
          isPrime: result.isPrime,
          factors: result.factors,
          time: result.time
      });
      setAiInsight(insight);
      setResultMessage(result.isPrime ? "PRIME ENTITY CONFIRMED" : "COMPOSITE ENTITY DETECTED");
      setStatus(result.isPrime ? 'prime' : 'composite');
      setExecutionTime(result.time);
    }, 800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-6 md:p-8 rounded-2xl relative z-20 shadow-2xl animate-slide-up [animation-delay:200ms] border-t border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="relative">
            <Activity className="text-primary animate-pulse-slow" size={28} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        </div>
        <div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
                PRIMALTY SCANNER
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  v3.0 AI-CORE
                </span>
            </h2>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Quantum Heuristic Analysis Engine</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className={`text-gray-500 transition-colors ${status === 'scanning' ? 'text-primary animate-spin' : ''}`} size={20} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Digite um número (ex: 333) ou pergunte à IA..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-lg focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
                {/* AI Badge inside input */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <Brain size={14} className="text-purple-500/50" />
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">AI READY</span>
                </div>
            </div>
            
            <button
            onClick={handleScan}
            disabled={status === 'scanning'}
            className="bg-primary hover:bg-primary-dark text-black font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,127,0.2)] hover:shadow-[0_0_30px_rgba(0,255,127,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
            >
            {status === 'scanning' ? (
                <>
                <Cpu size={20} className="animate-spin" />
                SCANNING...
                </>
            ) : (
                <>
                INITIATE SCAN
                </>
            )}
            </button>
        </div>
      </div>

      {/* Status Display */}
      {status !== 'idle' && (
        <div className={`rounded-xl p-6 border transition-all duration-500 ${
          status === 'scanning' ? 'bg-blue-500/10 border-blue-500/30' :
          status === 'prime' ? 'bg-primary/10 border-primary/30' :
          'bg-red-500/10 border-red-500/30'
        } animate-in fade-in slide-in-from-bottom-4`}>
          
          <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className={`text-lg font-bold font-mono mb-1 ${
                    status === 'scanning' ? 'text-blue-400' :
                    status === 'prime' ? 'text-primary' :
                    'text-red-400'
                }`}>
                    {status === 'scanning' ? 'ANALYZING...' : resultMessage}
                </h3>
                {executionTime > 0 && (
                    <p className="text-xs text-gray-500 font-mono">
                        Execution Time: {executionTime.toFixed(2)}ms
                    </p>
                )}
            </div>
            {status === 'prime' && <CheckCircle className="text-primary" size={24} />}
            {status === 'composite' && <AlertTriangle className="text-red-400" size={24} />}
            {status === 'scanning' && <Activity className="text-blue-400 animate-pulse" size={24} />}
          </div>

          {/* AI Insights Section */}
          {aiInsight && status !== 'scanning' && (
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg animate-in zoom-in-95 duration-300">
               <div className="flex items-center gap-2 mb-2">
                 <Brain size={16} className="text-purple-400" />
                 <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Insight</span>
               </div>
               <p className="text-sm text-gray-300 font-mono leading-relaxed border-l-2 border-purple-500/30 pl-3">
                 {aiInsight}
               </p>
            </div>
          )}

          {/* Factors Display for Composite */}
          {status === 'composite' && resultData?.factors && (
            <div className="mt-4 p-3 bg-black/30 rounded border border-white/5">
                <p className="text-sm text-gray-400 mb-2">Prime Factors Found:</p>
                <div className="flex flex-wrap gap-2">
                    {resultData.factors.map((factor, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-red-300 border border-red-500/20">
                            {factor}
                        </span>
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
