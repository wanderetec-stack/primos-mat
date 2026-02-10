import React, { useEffect, useState } from 'react';
import { FileText, Clock, Hash, X, ChevronRight, Share2, Sparkles, Brain, BookOpen, Layers } from 'lucide-react';
import { DossierEntry, fetchDossiers } from '../utils/dossierStore';

const DossierGrid: React.FC = () => {
  const [dossiers, setDossiers] = useState<DossierEntry[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<DossierEntry | null>(null);

  const loadDossiers = async () => {
    const data = await fetchDossiers();
    setDossiers(data);
  };

  useEffect(() => {
    loadDossiers();
    window.addEventListener('dossier-updated', loadDossiers);
    return () => window.removeEventListener('dossier-updated', loadDossiers);
  }, []);

  if (dossiers.length === 0) return null;

  return (
    <section className="py-12 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold font-mono text-white mb-2 flex items-center gap-2">
            <BookOpen className="text-purple-400" />
            Biblioteca de Dossiês
            </h2>
            <p className="text-gray-400 text-sm font-mono">
            Acervo de artigos matemáticos gerados ({dossiers.length} volumes)
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dossiers.map((entry) => (
          <article 
            key={entry.id}
            onClick={() => setSelectedDossier(entry)}
            className="group cursor-pointer bg-[#0a0a0a] border border-white/10 hover:border-purple-500/50 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)] flex flex-col h-full"
          >
            {/* Book Cover Style Visual */}
            <div className={`h-48 w-full relative overflow-hidden ${
                entry.isPrime 
                ? 'bg-gradient-to-br from-blue-600 via-indigo-800 to-slate-900' 
                : 'bg-gradient-to-br from-red-600 via-orange-800 to-slate-900'
            }`}>
                {/* Abstract Geometric Pattern */}
                <div className="absolute inset-0 opacity-40" style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                    backgroundSize: '20px 20px' 
                }}></div>
                
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>

                {/* Center Badge/Symbol */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2 ${
                        entry.isPrime 
                        ? 'border-white/30 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                        : 'border-white/30 bg-red-500/20 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    } backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}>
                        <Hash size={28} />
                    </div>
                    <span className="text-3xl font-bold font-mono text-white tracking-tighter drop-shadow-md">
                        {entry.number}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                    {entry.isPrime ? (
                        <span className="bg-blue-500/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-blue-400/30 flex items-center gap-1 shadow-lg">
                            <Sparkles size={10} className="text-blue-300" /> PRIMO
                        </span>
                    ) : (
                        <span className="bg-red-500/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-red-400/30 flex items-center gap-1 shadow-lg">
                            <Layers size={10} className="text-red-300" /> COMPOSTO
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-white/5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono leading-tight group-hover:text-purple-400 transition-colors">
                        Dossiê Matemático do Número {entry.number}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 font-mono flex items-center gap-2">
                        <Clock size={12} />
                        Gerado em {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-600 font-mono bg-white/5 px-2 py-1 rounded">
                        VOLUME #{entry.id.slice(0,4)}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                        LER ARTIGO <ChevronRight size={16} className="text-purple-500" />
                    </span>
                </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 custom-scrollbar">
                
                <button 
                    onClick={() => setSelectedDossier(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* Modal Header */}
                <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 ${selectedDossier.isPrime ? 'bg-gradient-to-r from-primary/10 via-blue-900/20 to-black' : 'bg-gradient-to-r from-red-900/20 via-orange-900/10 to-black'}`}></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent">
                        <div className="flex items-center gap-3 mb-2">
                             {selectedDossier.isPrime ? (
                                <span className="bg-primary text-black font-bold px-3 py-1 rounded text-sm shadow-[0_0_15px_rgba(0,255,127,0.4)]">
                                    PRIMO CONFIRMADO
                                </span>
                             ) : (
                                <span className="bg-red-500 text-white font-bold px-3 py-1 rounded text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                    NÚMERO COMPOSTO
                                </span>
                             )}
                             <span className="text-gray-400 font-mono text-sm flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(selectedDossier.timestamp).toLocaleString()}
                             </span>
                        </div>
                        <h2 className="text-5xl font-bold text-white font-mono tracking-tighter">
                            {selectedDossier.number}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    
                    {/* Intro */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                        <div className="flex items-start gap-4">
                            <Brain className="text-purple-400 shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="text-lg font-bold text-purple-400 mb-2 font-mono">Análise da Inteligência Artificial</h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {selectedDossier.aiInsight.message}
                                </p>
                                {selectedDossier.aiInsight.explanation && (
                                    <p className="text-gray-400 mt-2 text-sm border-l-2 border-purple-500/30 pl-3">
                                        {selectedDossier.aiInsight.explanation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Formula */}
                    {selectedDossier.aiInsight.formula && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> Prova Matemática
                            </h4>
                            <div className="bg-black rounded-lg p-6 border border-blue-500/20 font-mono text-blue-300 text-center text-xl overflow-x-auto">
                                {selectedDossier.aiInsight.formula}
                            </div>
                        </div>
                    )}

                    {/* Full Report */}
                    {selectedDossier.aiInsight.fullArticle ? (
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             {/* Article Header */}
                             <div className="border-b border-white/10 pb-6">
                                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono leading-tight">
                                     {selectedDossier.aiInsight.fullArticle.title}
                                 </h1>
                                 <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                                     <span>{selectedDossier.aiInsight.fullArticle.wordCount} palavras</span>
                                     <span>•</span>
                                     <span>Leitura: ~{Math.ceil(selectedDossier.aiInsight.fullArticle.wordCount / 200)} min</span>
                                 </div>
                             </div>

                             {/* Dynamic Sections */}
                             {selectedDossier.aiInsight.fullArticle.sections.map((section, idx) => (
                                 <div key={idx} className="prose prose-invert max-w-none">
                                     <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                                         <span className="text-white/20">0{idx + 1}.</span> {section.title}
                                     </h3>
                                     <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-white/5 p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                         {section.content}
                                     </div>
                                 </div>
                             ))}

                             {/* FAQ Section (SEO Schema) */}
                             <div className="bg-black/40 rounded-xl p-8 border border-white/10">
                                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                     <Brain className="text-primary" /> Perguntas Frequentes
                                 </h3>
                                 <div className="space-y-4">
                                     {selectedDossier.aiInsight.fullArticle.faq.map((item, idx) => (
                                         <details key={idx} className="group bg-white/5 rounded-lg open:bg-white/10 transition-all">
                                             <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-200 hover:text-white list-none">
                                                 {item.question}
                                                 <ChevronRight className="transform group-open:rotate-90 transition-transform text-gray-500" />
                                             </summary>
                                             <div className="px-4 pb-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                                 {item.answer}
                                             </div>
                                         </details>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    ) : (
                        // Fallback for old dossiers without full article
                        selectedDossier.aiInsight.report && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Relatório de Processamento (Legacy)
                                </h4>
                                <div className="bg-black/30 rounded-xl p-6 border border-white/5 space-y-4 font-mono text-sm">
                                    {selectedDossier.aiInsight.report.map((line, i) => (
                                        <div key={i} className="flex gap-3 text-gray-400">
                                            <span className="text-purple-500/50 select-none">{(i+1).toString().padStart(2, '0')}</span>
                                            <span className={line.includes('CONCLUSÃO') || line.includes('RESULTADO') ? 'text-white font-bold' : ''}>
                                                {line.replace(/^\d+\.\s/, '')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* Technical Stats */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                        <div className="p-4 bg-white/5 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase">Tempo de Execução</p>
                            <p className="text-xl font-mono text-white">{selectedDossier.executionTime.toFixed(4)}ms</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase">Complexidade</p>
                            <p className="text-xl font-mono text-white">O(√n)</p>
                        </div>
                    </div>

                    <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-4 rounded-xl border border-primary/20 transition-all flex items-center justify-center gap-2 group">
                        <Share2 size={20} />
                        COMPARTILHAR DOSSIÊ
                    </button>

                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default DossierGrid;
