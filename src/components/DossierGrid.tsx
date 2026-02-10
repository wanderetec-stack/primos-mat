import React, { useEffect, useState } from 'react';
import { FileText, Clock, Hash, X, ChevronRight, Share2, Sparkles, Brain } from 'lucide-react';
import { DossierEntry, getDossiers, clearDossiers } from '../utils/dossierStore';

const DossierGrid: React.FC = () => {
  const [dossiers, setDossiers] = useState<DossierEntry[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<DossierEntry | null>(null);

  const loadDossiers = () => {
    setDossiers(getDossiers());
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
            <FileText className="text-purple-400" />
            Dossiê Matemático
            </h2>
            <p className="text-gray-400 text-sm font-mono">
            Arquivo de análises geradas em tempo real ({dossiers.length} registros)
            </p>
        </div>
        <button 
            onClick={clearDossiers}
            className="text-xs text-red-400 hover:text-red-300 font-mono border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition-colors"
        >
            LIMPAR HISTÓRICO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dossiers.map((entry) => (
          <div 
            key={entry.id}
            onClick={() => setSelectedDossier(entry)}
            className="group cursor-pointer glass-panel p-0 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            {/* "Image" Placeholder - Generated Art */}
            <div className={`h-32 w-full relative overflow-hidden ${entry.isPrime ? 'bg-gradient-to-br from-primary/20 to-blue-600/20' : 'bg-gradient-to-br from-red-500/20 to-orange-600/20'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold font-mono text-white/10 group-hover:text-white/20 transition-colors tracking-tighter">
                        {entry.number}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3">
                    {entry.isPrime ? (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/30 shadow-[0_0_10px_rgba(0,255,127,0.2)]">PRIMO</span>
                    ) : (
                        <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/30">COMPOSTO</span>
                    )}
                </div>
                <div className="absolute top-3 left-3 text-white/50 text-xs font-mono flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 font-mono flex items-center gap-2">
                    <Hash size={18} className="text-purple-400" />
                    Entidade #{entry.number}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 font-mono h-10">
                    {entry.aiInsight.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                    <span>Processado em {entry.executionTime.toFixed(2)}ms</span>
                    <span className="flex items-center gap-1 text-purple-400 group-hover:translate-x-1 transition-transform">
                        LER DOSSIÊ <ChevronRight size={14} />
                    </span>
                </div>
            </div>
          </div>
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
