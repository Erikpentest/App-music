import React from 'react';
import { Play, Pause, Heart, Sparkles, Flame, Clock, Radio, Music } from 'lucide-react';
import { Playlist, Track } from '../../types';
import { GENRE_CATEGORIES } from '../../data/musicCatalog';

interface Props {
  featuredPlaylists: Playlist[];
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onOpenAiStudio: () => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const HomeView: React.FC<Props> = ({
  featuredPlaylists,
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onToggleLike,
  onOpenAiStudio,
  onSelectPlaylist
}) => {
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-950 border border-violet-500/20 p-8 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none overflow-hidden hidden md:block">
          <div className="w-96 h-96 bg-violet-600 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            Experiência Sonora de Alta Fidelidade
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Ouça Suas Músicas Favoritas & Componha com IA
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Áudio cristalino, equalizador de 10 bandas, sintetizador de beats e inteligência artificial para criação de letras e acordes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => tracks[0] && onSelectTrack(tracks[0])}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              Tocar Destaques
            </button>

            <button
              onClick={onOpenAiStudio}
              className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-violet-300 border border-violet-500/30 font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Compor no Estúdio IA
            </button>
          </div>
        </div>
      </div>

      {/* Featured Playlists Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Playlists em Destaque
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-violet-500/40 rounded-3xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 bg-violet-600 text-white rounded-full shadow-lg shadow-violet-600/40 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {pl.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Pills */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white mb-4">Gêneros & Vibres</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {GENRE_CATEGORIES.map((genre) => (
            <div
              key={genre.name}
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${genre.color} text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="text-lg">{genre.icon}</span>
              <span className="truncate text-center">{genre.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tracks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-violet-400" />
            Músicas Populares
          </h2>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-3 space-y-1">
          {tracks.map((track, idx) => {
            const isSelected = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-slate-950/30 hover:bg-slate-800/80 border-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1" onClick={() => onSelectTrack(track)}>
                  <span className="text-xs font-mono text-slate-500 w-5 text-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSelected && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current text-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold truncate group-hover:text-violet-300 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden sm:inline px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    {track.genre}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    {formatDuration(track.duration)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(track.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      track.isLiked
                        ? 'text-rose-500 fill-rose-500'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
