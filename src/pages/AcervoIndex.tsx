import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReconService, DraftArticle } from '../services/reconDb';
import { BookOpen, Calendar, ArrowRight, Search, FileText } from 'lucide-react';

const AcervoIndex: React.FC = () => {
  const [articles, setArticles] = useState<DraftArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await ReconService.getPublishedArticles();
      setArticles(data);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Generate a deterministic color gradient based on the article ID
  const getGradient = (id: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="text-green-700 font-bold text-xl hover:text-green-800 transition-colors flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                O Acervo
            </Link>
            
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full md:w-96 border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all shadow-inner">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                    type="text" 
                    placeholder="Pesquisar no acervo..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
                Matemática Recuperada
            </h1>
            <p className="text-green-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                Um projeto de preservação digital dedicado a resgatar o conhecimento matemático perdido do domínio <em>primos.mat.br</em>.
            </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 text-gray-400">
               <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-lg font-medium text-gray-500">Carregando o acervo...</p>
           </div>
        ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredArticles.map((article) => (
                    <Link 
                        key={article.id} 
                        to={new URL(article.original_url).pathname}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                        {/* Generated Image/Pattern Area */}
                        <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${getGradient(article.id)}`}>
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                             {/* Mathematical Decoration */}
                             <div className="absolute -bottom-6 -right-6 text-white/20 transform rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-500">
                                <FileText className="w-32 h-32" />
                             </div>
                             
                             <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                   Recuperado
                                </span>
                             </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                                    {article.title}
                                </h2>
                                <p className="text-xs text-gray-500 mb-4 font-mono truncate">
                                    {new URL(article.original_url).pathname}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(article.created_at).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="text-green-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Ler Artigo <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Não encontramos nenhum artigo correspondente à sua busca. Tente outros termos ou limpe o filtro.
                </p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                >
                    Limpar Busca
                </button>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Primos.mat.br. Todos os direitos reservados.</p>
            <p className="mt-2">Preservando a história da matemática na web.</p>
        </div>
      </footer>
    </div>
  );
};

export default AcervoIndex;
