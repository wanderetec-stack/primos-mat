import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReconService, DraftArticle } from '../services/reconDb';
import { BookOpen, Calendar, ArrowRight, FileText } from 'lucide-react';
import { safeGetPathname } from '../utils/urlUtils';

const AcervoPreview: React.FC = () => {
  const [articles, setArticles] = useState<DraftArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Get all published articles
        const data = await ReconService.getPublishedArticles();
        // Take the top 6 for the preview
        if (data && data.length > 0) {
            setArticles(data.slice(0, 6));
        }
      } catch (err) {
        console.error("AcervoPreview error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Generate a deterministic color gradient based on the article ID
  const getGradient = (id: string) => {
    if (!id) return 'from-gray-700 to-gray-900';
    const colors = [
      'from-green-400 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-blue-400 to-teal-500',
      'from-green-500 to-emerald-700',
      'from-gray-700 to-gray-900',
    ];
    // Simple hash
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading || articles.length === 0) {
    return (
      <section className="py-12 relative z-10 border-t border-white/5 min-h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-400 animate-pulse">
          <p className="font-mono text-sm">
            {loading ? "Carregando acervo recuperado..." : "Nenhum artigo disponível no momento."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 relative z-10 border-t border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold font-mono text-white mb-2 flex items-center gap-2">
            <BookOpen className="text-green-400" />
            Acervos Digital
            </h2>
            <p className="text-gray-400 text-sm font-mono">
            Últimos artigos recuperados e restaurados do domínio original
            </p>
        </div>
        <Link to="/acervo" className="hidden md:flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
            VER TODOS <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link 
            key={article.id || Math.random().toString()} 
            to={safeGetPathname(article.original_url)}
            className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.2)] flex flex-col h-full"
          >
             {/* Generated Image Area - Same style as AcervoIndex but adapted for Dark Mode Home */}
             <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${getGradient(article.id)}`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-30" style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                        backgroundSize: '16px 16px' 
                  }}></div>

                  {/* Icon */}
                  <div className="absolute -bottom-6 -right-6 text-white/20 transform rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-500">
                    <FileText className="w-32 h-32" />
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm border border-white/10 uppercase tracking-wider">
                       Recuperado
                    </span>
                  </div>
             </div>
             
             <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2 leading-tight">
                        {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 font-mono truncate">
                        {safeGetPathname(article.original_url)}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase">
                        LER ARTIGO <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
             </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
         <Link to="/acervo" className="inline-flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors border border-green-500/30 px-6 py-3 rounded-full bg-green-500/10">
            VER TODO O ACERVO <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default AcervoPreview;
