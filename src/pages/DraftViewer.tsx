import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Globe, Calendar, Clock, Edit3, Save } from 'lucide-react';
import { ReconService, DraftArticle } from '../services/reconDb';

const DraftViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DraftArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      ReconService.getDraftById(id).then(data => {
        setDraft(data);
        setEditContent(data?.content_markdown || '');
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const success = await ReconService.saveDraft(draft.id, editContent);
    if (success) {
      setDraft({ ...draft, content_markdown: editContent });
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!draft) return;
    if (confirm('Tem certeza? Isso tornará o artigo público e acessível pela URL original.')) {
      setSaving(true);
      const success = await ReconService.publishDraft(draft.id);
      if (success) {
        setDraft({ ...draft, status: 'published' });
      }
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Decodificando Arquivos...</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-mono">
        <p>ERRO 404: Arquivo Corrompido ou Inexistente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-green-900 selection:text-white">
      {/* Top Bar */}
      <div className="bg-black border-b border-green-900/30 p-4 sticky top-0 z-50 flex justify-between items-center backdrop-blur-md bg-opacity-80">
        <button 
          onClick={() => navigate('/dashboard-recon-2026-x')}
          className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Comando
        </button>

        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 border text-xs rounded uppercase font-bold tracking-wider ${draft.status === 'published' ? 'bg-green-900/30 border-green-700/50 text-green-500' : 'bg-yellow-900/30 border-yellow-700/50 text-yellow-500'}`}>
            {draft.status}
          </span>
          
          {draft.status !== 'published' && (
             <button 
                onClick={handlePublish}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-green-900/20"
             >
                <Globe className="w-4 h-4" />
                {saving ? 'Processando...' : 'Publicar Agora'}
             </button>
          )}

          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
            >
              <Edit3 className="w-4 h-4" />
              Editar Conteúdo
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <header className="mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-2 text-green-500 mb-4 font-mono text-xs uppercase tracking-widest opacity-70">
            <FileText className="w-4 h-4" />
            Protocolo Lázaro
            <span className="mx-2 text-gray-700">|</span>
            ID: {draft.id.split('-')[0]}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {draft.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400 font-mono">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="truncate max-w-xs" title={draft.original_url}>{draft.original_url}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{new Date(draft.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{new Date(draft.created_at).toLocaleTimeString()}</span>
            </div>
          </div>
        </header>

        {/* Content Viewer / Editor */}
        <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
            <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">source.md</span>
                <span className="text-xs text-gray-600 font-mono">{editContent.length} chars</span>
            </div>
            
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-[600px] bg-gray-900 text-gray-300 font-mono text-sm p-8 focus:outline-none resize-none"
                spellCheck={false}
              />
            ) : (
              <div className="p-8 overflow-x-auto">
                  <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {draft.content_markdown}
                  </pre>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DraftViewer;