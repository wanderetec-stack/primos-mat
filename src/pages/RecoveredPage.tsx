import React from 'react';
import { DraftArticle } from '../services/reconDb';
import { Calendar, Globe, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecoveredPageProps {
  article: DraftArticle;
}

const RecoveredPage: React.FC<RecoveredPageProps> = ({ article }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header / Nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-green-700 font-bold text-lg hover:text-green-800 transition-colors">
                Primos.mat.br
            </Link>
            <div className="text-xs text-gray-500 font-mono flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <Globe className="w-3 h-3" />
                Arquivo Restaurado
            </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Article Header */}
        <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {article.title}
            </h1>
            
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500 font-mono">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Restaurado em: {new Date(article.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-10 rounded-r text-sm text-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
                <strong>Nota do Arquivo:</strong> Esta página foi reconstruída automaticamente a partir de registros históricos. 
                O conteúdo original pode ter sido preservado do antigo <em>primos.mat.br</em>.
            </p>
        </div>

        {/* Markdown Content */}
        <article className="prose prose-lg prose-green mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {article.content_markdown}
            </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Primos.mat.br - Preservando a Matemática.</p>
        </footer>
      </main>
    </div>
  );
};

export default RecoveredPage;
