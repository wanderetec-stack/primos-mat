import React, { useState, useEffect } from 'react';
import { Calendar, Share2, Brain, ChevronRight, ChevronLeft, BookOpen, X, Check, AlertCircle, Activity, Info, Zap } from 'lucide-react';
import { getDailyPrime, DailyPrimeData } from '../utils/dailyPrime';

const DailyPrime: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<DailyPrimeData | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [articleOpen, setArticleOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setData(getDailyPrime(offset));
    // Reset states when changing days
    setQuizOpen(false);
    setArticleOpen(false);
    setSelectedOption(null);
    setShowResult(false);
  }, [offset]);

  const handleShare = async () => {
    if (!data) return;
    const text = `Hoje no Primos.mat.br: ${data.title} (${data.number})\n${data.desc}\nDescubra mais em: https://primos.mat.br`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Daily Prime: ${data.number}`,
          text: text,
          url: 'https://primos.mat.br'
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleQuizSubmit = () => {
    setShowResult(true);
  };

  if (!data) return null;

  const isToday = offset === 0;

  return (
    <div className="max-w-4xl mx-auto w-full animate-slide-up [animation-delay:500ms] relative z-20">
      <div className="glass-panel p-8 rounded-xl border-l-4 border-l-primary relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,127,0.15)]">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
           <Calendar size={180} />
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

        {/* Header / Navigation */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button 
            onClick={() => setOffset(prev => prev - 1)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono border ${isToday ? 'bg-primary/20 text-primary border-primary/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
              {isToday ? 'HOJE' : new Date(Date.now() + offset * 86400000).toLocaleDateString()}
            </span>
          </div>

          <button 
            onClick={() => setOffset(prev => prev + 1)}
            disabled={isToday}
            className={`p-2 rounded-full flex items-center gap-1 text-sm transition-colors ${isToday ? 'text-gray-700 cursor-not-allowed' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
          >
            Próximo <ChevronRight size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          
          {/* Number Display with Animation */}
          <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl p-8 min-w-[160px] border border-primary/20 shadow-inner group-hover:border-primary/40 transition-colors">
            <span className="text-xs font-mono text-primary mb-2 tracking-widest">PRIME ENTITY</span>
            <span className="text-6xl font-bold text-white font-mono tracking-tighter animate-pulse-slow shadow-primary drop-shadow-[0_0_10px_rgba(0,255,127,0.5)]">
              {data.number}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-3xl font-bold text-white font-mono mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {data.title}
              </h3>
              
              {data.formula && (
                <div className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-primary font-mono text-sm mb-3">
                  {data.formula}
                </div>
              )}
              
              <p className="text-gray-300 text-base leading-relaxed">
                {data.desc}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <button 
                onClick={() => setArticleOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary-dark transition-all shadow hover:shadow-[0_0_15px_rgba(0,255,127,0.4)]"
              >
                <BookOpen size={18} />
                Ler Artigo Completo
              </button>
              
              {data.quiz && (
                <button 
                  onClick={() => setQuizOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                >
                  <Brain size={18} />
                  Quiz Rápido
                </button>
              )}

              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-white/20 text-gray-300 hover:border-primary hover:text-primary transition-all"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {quizOpen && data.quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQuizOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Desafio do Primo</h3>
              <p className="text-gray-400 text-sm mt-1">Teste seu conhecimento sobre o número {data.number}</p>
            </div>

            <div className="mb-6">
              <p className="text-white text-lg font-medium mb-4">{data.quiz.question}</p>
              <div className="space-y-2">
                {data.quiz.options.map((option, idx) => {
                  let buttonClass = "w-full p-3 rounded-lg text-left border transition-all ";
                  
                  if (showResult) {
                    if (idx === data.quiz!.correctIndex) {
                      buttonClass += "bg-green-500/20 border-green-500 text-green-400";
                    } else if (idx === selectedOption) {
                      buttonClass += "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      buttonClass += "bg-white/5 border-white/10 text-gray-500 opacity-50";
                    }
                  } else {
                    buttonClass += selectedOption === idx 
                      ? "bg-primary/20 border-primary text-primary" 
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !showResult && setSelectedOption(idx)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {showResult && idx === data.quiz!.correctIndex && <Check size={18} />}
                        {showResult && idx === selectedOption && idx !== data.quiz!.correctIndex && <AlertCircle size={18} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {!showResult ? (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedOption === null}
                className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Confirmar Resposta
              </button>
            ) : (
              <div className={`p-4 rounded-lg text-center mb-4 ${selectedOption === data.quiz.correctIndex ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {selectedOption === data.quiz.correctIndex ? (
                  <>
                    <p className="font-bold">Correto! 🎉</p>
                    <p className="text-sm mt-1">Você domina os números primos.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">Incorreto 😕</p>
                    <p className="text-sm mt-1">A resposta certa era: {data.quiz.options[data.quiz.correctIndex]}</p>
                  </>
                )}
              </div>
            )}
            
            {showResult && (
              <button
                onClick={() => setQuizOpen(false)}
                className="w-full py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all mt-2"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Article Modal - Updated Content */}
      {articleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setArticleOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Sobre o Card & O Número</h3>
                  <p className="text-gray-400 font-mono text-sm">Explicação Detalhada do Daily Prime</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              
              {/* Seção 1: O Que o Card Faz */}
              <div className="bg-blue-500/5 p-5 rounded-xl border border-blue-500/10">
                <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-lg">
                  <Zap size={18} /> O Que Este Card Faz?
                </h4>
                <p className="mb-2">
                  Este é o <strong>Daily Prime Card</strong> (Card do Primo do Dia). Sua função é apresentar, a cada 24 horas, uma "Entidade Prima" diferente para estudo e apreciação.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                  <li><strong>Curadoria Diária:</strong> Selecionamos números com propriedades matemáticas únicas.</li>
                  <li><strong>Navegação Temporal:</strong> Use as setas (Anterior/Próximo) para viajar no tempo e ver os primos de dias passados.</li>
                  <li><strong>Desafio Interativo:</strong> O botão "Quiz Rápido" testa se você entendeu a propriedade especial do número.</li>
                  <li><strong>Compartilhamento:</strong> O botão de share permite enviar essa descoberta para amigos.</li>
                </ul>
              </div>

              {/* Seção 2: O Conceito do Número Específico */}
              <div>
                <h4 className="text-primary font-bold mb-3 flex items-center gap-2 text-lg">
                  <Activity size={18} /> O Conceito do Número {data.number}
                </h4>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                  <p className="text-white italic mb-2">"{data.desc}"</p>
                  <p className="text-sm text-gray-400">
                    O número <strong>{data.number}</strong> não é apenas um número ímpar (ou par, no caso do 2). Ele é um <strong>{data.title}</strong>.
                  </p>
                </div>
                
                <p>
                  Na matemática, este número é especial porque:
                  {data.number === 2 ? (
                    " Ele quebra o padrão. Todos os outros primos são ímpares. O 2 é o único par, tornando-se a base fundamental da lógica binária dos computadores."
                  ) : (
                    " Ele representa uma classe de primos que possuem propriedades além da simples indivisibilidade, sendo crucial para teorias avançadas e criptografia."
                  )}
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Resumo Técnico</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Entidade:</span> <span className="text-primary font-mono font-bold">{data.number}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Categoria:</span> <span className="text-white">{data.title}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Função:</span> <span className="text-white">Primo Racional</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1">
                    <span>Status:</span> <span className="text-green-400 font-bold">Verificado & Validado</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setArticleOpen(false)}
                className="px-6 py-2 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/5"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyPrime;
