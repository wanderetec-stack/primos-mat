import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Cpu, Search, Download, ExternalLink } from 'lucide-react';
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
    if (n === 2n) return "AI ANALYSIS: The only even prime number. The basis of all binary computation.";
    if (n < 2n) return "AI ANALYSIS: Value too low. Primes are integers greater than 1.";
    
    const s = n.toString();
    const isPalindrome = s === s.split('').reverse().join('');

    if (isPrime) {
       if (isPalindrome) return "AI ANALYSIS: PALINDROMIC PRIME DETECTED! Reads the same forwards and backwards.";
       if (n > 1000000n) return "AI ANALYSIS: High-magnitude prime detected. Suitable for cryptographic key generation.";
       if ((n - 1n) % 4n === 0n) return "AI ANALYSIS: Pythagorean Prime (4n + 1). Can be expressed as sum of two squares.";
       return "AI ANALYSIS: Valid Prime Entity confirmed. Structure is indivisible.";
    } else {
       if (n % 2n === 0n) return "AI ANALYSIS: Even number detected. Trivially divisible by 2.";
       if (n % 5n === 0n) return "AI ANALYSIS: Pattern ends in 0 or 5. Divisible by 5.";
       const sum = s.split('').reduce((a, b) => a + parseInt(b), 0);
       if (sum % 3 === 0) return `AI ANALYSIS: Digital root sum is ${sum}. Divisible by 3 via divisibility rule.`;
       if (isPalindrome) return "AI ANALYSIS: Palindromic Composite. Symmetric but divisible.";
       return "AI ANALYSIS: Composite structure. Decomposable into smaller prime factors.";
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
    
    // Simulate scanning delay for effect
    setTimeout(() => {
      try {
        const { isPrime: prime, factors, time } = isPrime(targetNum);
        setExecutionTime(time);
        setResultData({ number: targetNum, isPrime: prime, factors, time });
        
        // Generate AI Insight
        try {
            const insight = getAIInsights(BigInt(targetNum), prime);
            setAiInsight(insight);
        } catch (e) {
            setAiInsight("AI ANALYSIS: Calculation too complex for heuristic engine.");
        }

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
        setResultData(null);
      }
    }, 1200);
  };

  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    if (!resultData) return;
    
    let content = '';
    let mimeType = '';
    let fileName = `primos-check-${resultData.number}`;

    const timestamp = new Date().toISOString();

    if (format === 'json') {
      content = JSON.stringify({ ...resultData, timestamp, provider: 'Primos.mat.br' }, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else if (format === 'csv') {
      content = `Number,IsPrime,ExecutionTime(ms),Timestamp,Provider\n${resultData.number},${resultData.isPrime},${resultData.time.toFixed(4)},${timestamp},Primos.mat.br`;
      mimeType = 'text/csv';
      fileName += '.csv';
    } else {
      content = `PRIMOS.MAT.BR VERIFICATION REPORT\n=================================\nTarget: ${resultData.number}\nResult: ${resultData.isPrime ? 'PRIME' : 'COMPOSITE'}\nTime: ${resultData.time.toFixed(4)}ms\nDate: ${timestamp}\n\n${resultData.isPrime ? 'Confirmed Prime Entity.' : `Divisible Factor Found: ${resultData.factors?.[0]}`}`;
      mimeType = 'text/plain';
      fileName += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass-panel rounded-xl p-1 overflow-hidden">
        <div className="bg-surface/90 rounded-lg p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                <Activity className="text-primary animate-pulse" size={20} />
                PRIMALITY SCANNER
              </h2>
              <p className="text-xs text-muted font-mono mt-1">Real-time client-side verification engine</p>
            </div>
            <div className="flex gap-2">
               {status === 'scanning' && <span className="animate-spin text-primary"><Cpu size={20} /></span>}
               {status === 'prime' && <span className="text-primary animate-bounce"><CheckCircle size={20} /></span>}
               {status === 'composite' && <span className="text-red-500"><AlertTriangle size={20} /></span>}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative mb-8 group/input flex flex-col md:block">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="ENTER INTEGER SEQUENCE OR QUERY..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-xl md:text-2xl font-mono text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all text-center tracking-widest md:pr-40"
            />
            <button 
              onClick={handleScan}
              disabled={status === 'scanning' || !inputVal}
              className="mt-4 md:mt-0 md:absolute md:right-2 md:top-2 md:bottom-2 w-full md:w-auto px-6 bg-primary text-black font-bold font-mono rounded hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 md:py-0"
            >
              {status === 'scanning' ? 'SCANNING...' : 'INITIATE'}
              {!status.includes('scan') && <Search size={16} />}
            </button>
          </div>

          {/* Results Display */}
          {(resultMessage || aiInsight) && (
            <div className={`p-4 rounded border font-mono text-sm mb-6 animate-fade-in space-y-3 ${
              status === 'prime' ? 'bg-primary/10 border-primary/30 text-primary' : 
              status === 'composite' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-gray-800 border-gray-700'
            }`}>
              {resultMessage && (
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                   <span className="font-bold">{resultMessage}</span>
                   {executionTime > 0 && <span className="text-xs opacity-70">T: {executionTime.toFixed(2)}ms</span>}
                </div>
              )}
              
              {aiInsight && (
                <div className="flex items-start gap-2 text-xs md:text-sm opacity-90">
                   <Cpu size={14} className="mt-0.5 shrink-0" />
                   <span>{aiInsight}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Bar (Export & Academic) */}
          {resultData && status !== 'scanning' && (
             <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
                
                {/* Export Tools */}
                <div className="flex items-center gap-2">
                   <span className="text-xs text-muted font-mono uppercase tracking-wider mr-2">Export Data:</span>
                   <button onClick={() => handleExport('json')} className="p-2 rounded bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-muted" title="Download JSON">
                      <span className="text-xs font-bold">JSON</span>
                   </button>
                   <button onClick={() => handleExport('csv')} className="p-2 rounded bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-muted" title="Download CSV">
                      <span className="text-xs font-bold">CSV</span>
                   </button>
                   <button onClick={() => handleExport('txt')} className="p-2 rounded bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors text-muted" title="Download Report">
                      <Download size={14} />
                   </button>
                </div>

                {/* Academic Links */}
                <div className="flex items-center gap-3">
                   <a 
                     href={`https://oeis.org/search?q=${resultData.number}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs text-muted hover:text-white flex items-center gap-1 transition-colors"
                   >
                     OEIS.org <ExternalLink size={10} />
                   </a>
                   <div className="h-3 w-px bg-white/10"></div>
                   <a 
                     href={`https://www.wolframalpha.com/input?i=${resultData.number}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs text-muted hover:text-white flex items-center gap-1 transition-colors"
                   >
                     WolframAlpha <ExternalLink size={10} />
                   </a>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Scanner;
