import React, { useState } from 'react';
import {
  X,
  Heart,
  FileText,
  Sparkles,
  ListMusic,
  Activity,
  Disc,
  Info,
  ChevronDown
} from 'lucide-react';
import { Track, VisualizerMode, SongInsights } from '../types';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onToggleLike: (trackId: string) => void;
  visualizerMode: VisualizerMode;
  onChangeVisualizerMode: (mode: VisualizerMode) => void;
  queue: Track[];
  onSelectFromQueue: (track: Track) => void;
}

export const NowPlayingFullModal: React.FC<Props> = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  onPlayPause,
  onToggleLike,
  visualizerMode,
  onChangeVisualizerMode,
  queue,
  onSelectFromQueue
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lyrics' | 'insights' | 'queue'>('lyrics');
  const [insights, setInsights] = useState<SongInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  if (!isOpen || !track) return null;

  const handleFetchInsights = async () => {
    if (insights) return;
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/gemini/song-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: track.title, artist: track.artist }),
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl overflow-y-auto flex flex-col text-slate-100 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 max-w-7xl w-full mx-auto">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
          Minimizar Player
        </button>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          {[
            { id: 'lyrics', label: 'Letra & Chords', icon: FileText },
            { id: 'insights', label: 'Análise IA', icon: Sparkles },
            { id: 'queue', label: 'Fila de Reprodução', icon: ListMusic },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubTab(item.id as any);
                  if (item.id === 'insights') handleFetchInsights();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white font-semibold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
        {/* Left Column: Visualizer & Track Art */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl group">
            <AudioVisualizerCanvas
              mode={visualizerMode}
              isPlaying={isPlaying}
              className="absolute inset-0 w-full h-full opacity-80"
              coverUrl={track.coverUrl}
            />

            {/* Central Cover Thumbnail in Circle visualizer mode or standard overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl shadow-2xl border-2 border-white/10 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="text-center w-full max-w-md">
            <h2 className="text-2xl font-black text-white tracking-tight">{track.title}</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">{track.artist} • {track.album}</p>

            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {track.genre}
              </span>
              {track.bpm && (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {track.bpm} BPM
                </span>
              )}
              <button
                onClick={() => onToggleLike(track.id)}
                className={`p-2 rounded-full border transition-all ${
                  track.isLiked
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 fill-rose-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Subtabs */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col h-[520px]">
          {activeSubTab === 'lyrics' && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Letra & Estrutura Musical
                </h3>
                {track.chords && (
                  <div className="flex items-center gap-1.5 text-xs text-violet-300 font-mono">
                    <span>Cifra:</span>
                    {track.chords.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-violet-900/40 rounded border border-violet-500/30">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {track.lyrics ? (
                <div className="space-y-4 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {track.lyrics}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-xs">
                  <Disc className="w-8 h-8 mb-2 animate-spin-slow opacity-40" />
                  <span>Letra não disponível para esta faixa.</span>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'insights' && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Análise Poética & Curiosidades (Gemini IA)
                </h3>
              </div>

              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <Sparkles className="w-8 h-8 text-violet-400 animate-spin" />
                  <p className="text-xs text-slate-400">Analisando harmonia e história da música...</p>
                </div>
              ) : insights ? (
                <div className="space-y-5 text-xs text-slate-300">
                  <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-800/40">
                    <h4 className="font-bold text-violet-300 mb-1">Significado da Música:</h4>
                    <p className="leading-relaxed">{insights.meaning}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-200 mb-2">Curiosidades Musicais:</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                      {insights.musicalCuriosities?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {insights.similarStyleArtists && (
                    <div>
                      <h4 className="font-bold text-slate-200 mb-2">Artistas em Estilo Similar:</h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.similarStyleArtists.map((artist, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-3">
                  <button
                    onClick={handleFetchInsights}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Gerar Análise Musical com IA
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'queue' && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-violet-400" />
                  Próximas Faixas na Fila
                </h3>
                <span className="text-xs text-slate-500">{queue.length} músicas</span>
              </div>

              {queue.map((qTrack, idx) => {
                const isCurrent = qTrack.id === track.id;
                return (
                  <button
                    key={qTrack.id}
                    onClick={() => onSelectFromQueue(qTrack)}
                    className={`w-full p-2.5 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                      isCurrent
                        ? 'bg-violet-600/20 border-violet-500/50 text-white'
                        : 'bg-slate-950/40 hover:bg-slate-800/80 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-500 w-5 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={qTrack.coverUrl}
                      alt={qTrack.title}
                      className="w-10 h-10 object-cover rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold truncate">{qTrack.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{qTrack.artist}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500 text-white">
                        Tocando
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
