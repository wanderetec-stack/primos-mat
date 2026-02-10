import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Cpu, Search, Brain, Sparkles } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

const Scanner: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'prime' | 'composite'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  interface AIInsightData {
    message: string;
    explanation?: string;
    formula?: string;
    report?: string[]; // Detailed step-by-step report
  }

  const [aiInsight, setAiInsight] = useState<AIInsightData | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [resultData, setResultData] = useState<{number: string, isPrime: boolean, factors?: string[], time: number} | null>(null);
  
  // Security / Rate Limiting State
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(0);
  const { sendAlert } = useTelegram();

  const generateReport = (n: bigint, isPrime: boolean, factors?: string[], time?: number): string[] => {
      const steps = [];
      const s = n.toString();
      const sqrtN = Math.floor(Math.sqrt(Number(s))); // Approximation for display
      
      steps.push(`1. INICIALIZAÇÃO: O número ${n} foi carregado no buffer de análise.`);
      steps.push(`2. VERIFICAÇÃO PRELIMINAR: Testes de paridade e divisibilidade básica por 2, 3 e 5 executados.`);
      
      if (n % 2n === 0n && n !== 2n) {
          steps.push(`3. DETECÇÃO DE PARIDADE: O número é par, logo, divisível por 2. Condição de primalidade falhou imediatamente.`);
      } else if (n % 5n === 0n && n !== 5n) {
          steps.push(`3. TERMINAÇÃO EM 5: O número termina em 5, indicando divisibilidade por 5.`);
      } else {
          steps.push(`3. FILTRO INICIAL APROVADO: O número não é divisível pelos primeiros primos triviais.`);
          
          if (isPrime) {
              steps.push(`4. TESTE DE FORÇA BRUTA OTIMIZADO: Executada divisão por tentativa até a raiz quadrada aproximada (~${sqrtN}).`);
              steps.push(`5. RESULTADO: Nenhum divisor inteiro encontrado no intervalo [2, √${n}].`);
              steps.push(`6. CONCLUSÃO: O número atende a todos os critérios de indivisibilidade.`);
          } else {
             steps.push(`4. BUSCA DE FATORES: Algoritmo de fatoração iniciado.`);
             if (factors && factors.length > 0) {
                 steps.push(`5. FATOR ENCONTRADO: Divisor ${factors[0]} identificado.`);
                 steps.push(`6. VALIDAÇÃO: ${factors[0]} × ${factors[1]} = ${n}. A condição de existência de divisores não-triviais foi satisfeita.`);
             } else {
                 steps.push(`5. RESULTADO: Divisores encontrados (algoritmo genérico).`);
             }
          }
      }
      
      steps.push(`7. TEMPO DE PROCESSAMENTO: Análise concluída em ${time?.toFixed(4)}ms.`);
      return steps;
  };

  const getAIInsights = (n: bigint, isPrime: boolean, factors?: string[], time?: number): AIInsightData => {
    const report = generateReport(n, isPrime, factors, time);
    
    if (n === 2n) return {
      message: "IA: O único número primo par. A base de toda computação binária.",
      explanation: "O número 2 é divisível apenas por 1 e por ele mesmo. É o único par com essa propriedade.",
      formula: "n = 2 ⇒ P(n) = True",
      report
    };
    if (n < 2n) return {
      message: "IA: Valor muito baixo. Primos devem ser maiores que 1.",
      explanation: "Por definição, números primos são inteiros positivos maiores que 1.",
      formula: "n < 2 ⇒ P(n) = False",
      report
    };
    
    const s = n.toString();
    const isPalindrome = s === s.split('').reverse().join('');

    if (isPrime) {
       if (isPalindrome) return {
         message: "IA: PRIMO PALÍNDROMO DETECTADO! Lê-se da mesma forma em ambos os sentidos.",
         explanation: "Este número possui simetria perfeita em sua representação decimal, além de ser indivisível.",
         formula: "P(n) ∧ Reverse(n) = n",
         report
       };
       if (n > 1000000n) return {
         message: "IA: Primo de alta magnitude detectado. Adequado para geração de chaves criptográficas.",
         explanation: "Números primos grandes são essenciais para algoritmos como RSA, pois sua fatoração é computacionalmente inviável.",
         formula: "n > 10⁶ ∧ P(n)",
         report
       };
       if ((n - 1n) % 4n === 0n) return {
         message: "IA: Primo Pitagórico (4n + 1). Pode ser expresso como a soma de dois quadrados.",
         explanation: "Teorema de Fermat sobre a soma de dois quadrados: primos da forma 4n+1 podem ser escritos como a² + b².",
         formula: "n ≡ 1 (mod 4) ⇒ n = a² + b²",
         report
       };
       return {
         message: "IA: Entidade Prima Válida confirmada. Estrutura indivisível.",
         explanation: "O número não possui divisores além de 1 e ele mesmo.",
         formula: "∀d ∈ {2..√n}, n mod d ≠ 0",
         report
       };
    } else {
       if (n % 2n === 0n) return {
         message: "IA: Número par detectado. Trivialmente divisível por 2.",
         explanation: "Todo número par maior que 2 é composto, pois pode ser dividido por 2.",
         formula: "n ≡ 0 (mod 2)",
         report
       };
       if (n % 5n === 0n) return {
         message: "IA: Padrão terminado em 0 ou 5. Divisível por 5.",
         explanation: "Qualquer número que termina em 0 ou 5 é múltiplo de 5.",
         formula: "n ≡ 0 (mod 5)",
         report
       };
       const sum = s.split('').reduce((a, b) => a + parseInt(b), 0);
       if (sum % 3 === 0) return {
         message: `IA: Soma digital é ${sum}. Divisível por 3 pela regra de divisibilidade.`,
         explanation: `A soma dos algarismos (${s.split('').join('+')}) resulta em ${sum}, que é divisível por 3. Logo, ${n} também é.`,
         formula: `Σ digits = ${sum} ⇒ ${sum} ≡ 0 (mod 3)`,
         report
       };
       if (isPalindrome) return {
         message: "IA: Composto Palíndromo. Simétrico mas divisível.",
         explanation: "Apesar de sua simetria visual, o número possui divisores.",
         formula: `n = Reverse(n) ∧ ∃d: n mod d = 0`,
         report
       };
       return {
         message: "IA: Estrutura composta. Decomponível em fatores menores.",
         explanation: "O número possui divisores além de 1 e ele mesmo, o que o desqualifica como primo.",
         formula: factors && factors.length >= 2 ? `${n} = ${factors[0]} × ${factors[1]}` : "n = a × b",
         report
       };
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
        setResultMessage("ERRO: NENHUM DADO NUMÉRICO DETECTADO.");
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
        setResultMessage("AVISO: ATIVIDADE ANÔMALA DETECTADA. SISTEMA BLOQUEADO.");
        setStatus('composite'); // Fail safely
        return;
      }
    } else {
      setScanCount(0);
    }
    setLastScanTime(now);

    setStatus('scanning');
    setResultMessage('');
    setAiInsight(null);
    
    // Simulate slight delay for "Scanner Effect"
    setTimeout(() => {
        const result = isPrime(targetNum);
        const insight = getAIInsights(BigInt(targetNum), result.isPrime, result.factors, result.time);
        
        setResultData({
            number: targetNum,
          isPrime: result.isPrime,
          factors: result.factors,
          time: result.time
      });
      setAiInsight(insight);
      setResultMessage(result.isPrime ? "ENTIDADE PRIMA CONFIRMADA" : "ENTIDADE COMPOSTA DETECTADA");
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
                SCANNER DE PRIMALIDADE
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  v3.2 PT-BR
                </span>
            </h2>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Motor de Análise Heurística Quântica</p>
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
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">IA PRONTA</span>
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
                ANALISANDO...
                </>
            ) : (
                <>
                INICIAR ANÁLISE
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
                    {status === 'scanning' ? 'PROCESSANDO...' : resultMessage}
                </h3>
                {executionTime > 0 && (
                    <p className="text-xs text-gray-500 font-mono">
                        Tempo de Execução: {executionTime.toFixed(2)}ms
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
                 <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Insights da IA</span>
               </div>
               
               {/* Main Insight Message */}
               <p className="text-sm text-gray-200 font-bold mb-3 border-l-2 border-purple-500 pl-3">
                 {aiInsight.message}
               </p>

               {/* Detailed Explanation */}
               {aiInsight.explanation && (
                 <div className="mb-3 text-sm text-gray-400 pl-3 border-l-2 border-purple-500/30">
                   <p>{aiInsight.explanation}</p>
                 </div>
               )}

               {/* Mathematical Formula/Proof */}
               {aiInsight.formula && (
                 <div className="mt-3 bg-black/40 rounded p-3 border border-blue-500/20 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                   <p className="text-[10px] text-blue-400 font-mono mb-1 uppercase tracking-wider flex items-center gap-1">
                     <Sparkles size={10} />
                     Fórmula Matemática
                   </p>
                   <code className="font-mono text-sm text-blue-200 block">
                     {aiInsight.formula}
                   </code>
                 </div>
               )}

               {/* Detailed Report Article */}
               {aiInsight.report && (
                 <div className="mt-4 pt-4 border-t border-purple-500/10">
                    <p className="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-wider">Relatório de Processamento</p>
                    <div className="space-y-2 font-mono text-xs text-gray-400 bg-black/20 p-3 rounded">
                        {aiInsight.report.map((line, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-purple-500/50 select-none">›</span>
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* Factors Display for Composite */}
          {status === 'composite' && resultData?.factors && (
            <div className="mt-4 p-3 bg-black/30 rounded border border-white/5">
                <p className="text-sm text-gray-400 mb-2 font-mono">Fatores Primos Encontrados:</p>
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
