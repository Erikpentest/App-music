import React, { useState } from 'react';
import {
  Sparkles,
  Music,
  FileText,
  BookmarkPlus,
  Compass,
  Zap,
  Check,
  Disc,
  Copy
} from 'lucide-react';
import { AiGeneratedSong, AiRecommendation, Track } from '../types';

interface Props {
  onSaveAiSong: (song: AiGeneratedSong) => void;
  onPlayRecommendationTrack?: (trackTitle: string) => void;
}

export const AiLyricsStudio: React.FC<Props> = ({
  onSaveAiSong,
  onPlayRecommendationTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'lyricist' | 'recommender'>('lyricist');

  // Lyricist State
  const [theme, setTheme] = useState('Viagens inesquecíveis e recomeços');
  const [genre, setGenre] = useState('MPB / Bossa Nova');
  const [mood, setMood] = useState('Esperançoso e Poético');
  const [language, setLanguage] = useState('Português');
  const [isGeneratingLyric, setIsGeneratingLyric] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<AiGeneratedSong | null>(null);
  const [copied, setCopied] = useState(false);

  // Recommender State
  const [userPrompt, setUserPrompt] = useState('Quero músicas para focar na programação de madrugada');
  const [isGeneratingRec, setIsGeneratingRec] = useState(false);
  const [recommendation, setRecommendation] = useState<AiRecommendation | null>(null);

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyric(true);
    try {
      const res = await fetch('/api/gemini/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, genre, mood, language }),
      });
      const data = await res.json();
      if (data.success && data.song) {
        const songData: AiGeneratedSong = {
          ...data.song,
          id: `ai-song-${Date.now()}`,
          createdAt: new Date().toLocaleDateString('pt-BR'),
        };
        setGeneratedSong(songData);
      }
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao gerar a composição com IA.');
    } finally {
      setIsGeneratingLyric(false);
    }
  };

  const handleGenerateRecommendation = async () => {
    setIsGeneratingRec(true);
    try {
      const res = await fetch('/api/gemini/recommend-songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, currentMood: mood }),
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao gerar recomendações.');
    } finally {
      setIsGeneratingRec(false);
    }
  };

  const handleCopyLyrics = () => {
    if (!generatedSong) return;
    const text = `${generatedSong.title} - ${generatedSong.artist}\nGênero: ${generatedSong.genre} | BPM: ${generatedSong.bpm}\n\n` +
      generatedSong.structure.map((s) => `[${s.type}]\nCifra: ${s.chords || 'N/A'}\n${s.lyrics}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 border border-violet-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            Powered by Gemini AI Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Estúdio Criativo de Composição
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Componha letras originais com acordes estruturados ou descubra recomendações de músicas baseadas no seu momento e sentimento.
          </p>
        </div>
      </div>

      {/* Subtab Toggle */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('lyricist')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'lyricist'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Compositor de Letras & Cifras
        </button>

        <button
          onClick={() => setActiveTab('recommender')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'recommender'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Recomendador por Vibe
        </button>
      </div>

      {/* Lyricist View */}
      {activeTab === 'lyricist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Parâmetros da Música
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Tema / Inspiração</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Saudade das noites de verão na praia..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Gênero Musical</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="MPB / Bossa Nova">MPB / Bossa Nova</option>
                <option value="Sertanejo Acústico">Sertanejo Acústico</option>
                <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                <option value="Synthwave / Retro">Synthwave / Retro</option>
                <option value="Rock Nacional">Rock Nacional</option>
                <option value="Pop Leve">Pop Leve</option>
                <option value="Eletrônica House">Eletrônica House</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Sentimento / Mood</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Ex: Melancólico, Festivo, Reflexivo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={handleGenerateLyrics}
              disabled={isGeneratingLyric}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingLyric ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Componendo Música com Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Composição Completa</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Display */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 min-h-[460px] flex flex-col justify-between">
            {generatedSong ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-black text-white">{generatedSong.title}</h2>
                    <p className="text-xs text-slate-400">{generatedSong.artist} • {generatedSong.genre}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-violet-950 text-violet-300 border border-violet-800 text-[11px] font-mono">
                      Tom: {generatedSong.keySignature}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                      {generatedSong.bpm} BPM
                    </span>
                    <button
                      onClick={handleCopyLyrics}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copiar Letra"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Stanzas */}
                <div className="space-y-4 overflow-y-auto max-h-[320px] pr-2">
                  {generatedSong.structure?.map((part, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                          [{part.type}]
                        </span>
                        {part.chords && (
                          <span className="text-[11px] font-mono text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            Acordes: {part.chords}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {part.lyrics}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Save */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <p className="text-[11px] text-slate-500 italic truncate max-w-sm">
                    {generatedSong.compositionNotes}
                  </p>
                  <button
                    onClick={() => {
                      onSaveAiSong(generatedSong);
                      alert('Composição salva na sua coleção!');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Salvar na Biblioteca
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center space-y-3">
                <div className="p-4 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/20">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-300">Nenhuma música gerada ainda</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Preencha o tema e gênero ao lado para criar uma composição original com IA em instantes!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommender View */}
      {activeTab === 'recommender' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Descreva sua Vibe ou Atividade
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ex: Treino de alta intensidade, viagem noturna, café em dia chuvoso..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleGenerateRecommendation}
                disabled={isGeneratingRec}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isGeneratingRec ? <Sparkles className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                <span>Gerar Playlist Ideal</span>
              </button>
            </div>
          </div>

          {recommendation && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
                  {recommendation.vibeTag}
                </span>
                <h2 className="text-xl font-black text-white mt-2">{recommendation.playlistName}</h2>
                <p className="text-xs text-slate-400 mt-1">{recommendation.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendation.tracks?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{item.artist} • {item.genre}</p>
                      <p className="text-[11px] text-violet-300/80 mt-1 italic leading-relaxed">
                        "{item.reason}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
