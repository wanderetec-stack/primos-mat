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

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.original_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-green-700 font-bold text-xl hover:text-green-800 transition-colors flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                O Acervo
            </Link>
            
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Buscar artigos..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-green-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Matemática Recuperada
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
                Um projeto de preservação digital para resgatar o conhecimento matemático perdido do domínio <em>primos.mat.br</em>.
            </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p>Carregando acervo...</p>
           </div>
        ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                    <Link 
                        key={article.id} 
                        // Link to the relative path of the original URL (which our 404 handler intercepts)
                        // OR we can create a dedicated /acervo/read/:id route.
                        // For SEO "recovery", linking to the original path is better IF we intercept it.
                        // But for a stable "Blog", a dedicated route is safer.
                        // Let's use the intercepted path approach for "Real SEO".
                        // Wait, React Router Link to absolute URL? No.
                        // We need to parse the path from original_url.
                        to={new URL(article.original_url).pathname}
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                             {/* Abstract Pattern Generation based on ID */}
                             <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-50"></div>
                             <div className="absolute inset-0 flex items-center justify-center text-green-900/10 transform group-hover:scale-110 transition-transform duration-500">
                                <FileText className="w-24 h-24" />
                             </div>
                        </div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider mb-3">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Recuperado
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                                {article.title}
                            </h2>
                            
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                                {article.content_markdown?.substring(0, 150).replace(/[#*_`]/g, '')}...
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(article.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1 text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                                    Ler Artigo <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Nenhum artigo publicado encontrado.</p>
                <p className="text-gray-400 text-sm mt-2">Os artigos recuperados precisam ser revisados e publicados via Painel de Controle.</p>
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-green-600 font-medium hover:underline"
                    >
                        Limpar busca
                    </button>
                )}
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
