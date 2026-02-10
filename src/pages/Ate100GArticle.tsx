import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Database, AlertTriangle } from 'lucide-react';

const Ate100GArticle: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Helmet>
        <title>The First 100 Billion Primes (Até 100 Bilhões de Primos) | Primos.mat.br</title>
        <meta name="description" content="Access the historical dataset of the first 100 billion prime numbers. Acesso ao banco de dados histórico dos primeiros 100 bilhões de números primos." />
        <link rel="canonical" href="https://primos.mat.br/Ate100G_en.html" />
      </Helmet>

      {/* Hero Section (Hybrid) */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/20 to-slate-900" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          
          {/* Badge de Restauração */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-700/50 text-yellow-500 text-sm mb-6">
            <AlertTriangle size={14} />
            <span>Legacy Page Restored / Página Histórica Restaurada</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The First 100 Billion Primes
            <span className="block text-2xl md:text-3xl text-blue-400 mt-2 font-light">
              (Os Primeiros 100 Bilhões de Primos)
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            You have reached the official restoration page of the <b>Primos.mat.br</b> project. 
            The original datasets used by researchers worldwide are being brought back online.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* English Action */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group text-left">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <Database size={18} className="text-blue-400" />
                For Researchers
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Access the raw data files (txt/7z) for machine learning and cryptography research.
              </p>
              <a href="/public/primeiros_10000_primos.txt" download className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm">
                <Download size={14} /> Download Sample (10k)
              </a>
            </div>

            {/* Portuguese Action */}
            <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-800/50 hover:border-green-500/50 transition-all group text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ArrowRight size={100} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">PT-BR</span>
                Para Brasileiros
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Leia o artigo completo sobre a história deste projeto e como calculamos esses números.
              </p>
              <Link to="/acervo" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-sm">
                Ler Artigo Completo <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
            Technical Note: The 100 Billion Project
          </h2>
          <div className="prose prose-invert prose-slate max-w-none">
            <p>
              The "Up to 100 Billion" project was a distributed computing effort to verify and catalogue prime numbers distribution. 
              The original servers were decommissioned, but the core data was preserved.
            </p>
            <p>
              We are currently re-indexing the massive 2TB dataset. If your research script is failing, please point it to the 
              new static endpoints listed in our <Link to="/acervo" className="text-blue-400 hover:underline">Archive Index</Link>.
            </p>
            
            <div className="bg-slate-800 p-4 rounded-lg mt-8 font-mono text-xs text-slate-400">
              <p className="mb-2 text-slate-500 uppercase tracking-widest font-bold">Citation Format</p>
              Primos.mat.br (2025). <i>The First 100 Billion Primes Dataset</i>. Retrieved from https://primos.mat.br/Ate100G_en.html
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Ate100GArticle;
