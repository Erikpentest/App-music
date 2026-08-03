import React, { useState, useMemo } from 'react';
import { Search, Compass, Play, Pause, Heart, Music, SlidersHorizontal } from 'lucide-react';
import { Track } from '../../types';
import { GENRE_CATEGORIES } from '../../data/musicCatalog';

interface Props {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
}

export const BrowseView: React.FC<Props> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onToggleLike
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch =
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.genre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre = selectedGenre ? track.genre.toLowerCase().includes(selectedGenre.toLowerCase()) : true;

      return matchesSearch && matchesGenre;
    });
  }, [tracks, searchQuery, selectedGenre]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-violet-400" />
            Navegar & Descobrir
          </h1>
          <p className="text-xs text-slate-400">Explore o catálogo completo de músicas e playlists</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por música, artista, gênero..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 ${
            selectedGenre === null
              ? 'bg-violet-600 text-white border-violet-500 shadow-md'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          Todas as Músicas
        </button>

        {GENRE_CATEGORIES.map((cat) => {
          const isSelected = selectedGenre === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedGenre(isSelected ? null : cat.name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTracks.map((track) => {
          const isSelected = currentTrack?.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`group p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-600/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80'
              }`}
            >
              <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-md">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isSelected && isPlaying ? (
                    <Pause className="w-5 h-5 fill-current text-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-white ml-0.5" />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {track.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {track.genre}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(track.id);
                }}
                className={`p-2 rounded-full transition-colors shrink-0 ${
                  track.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <Music className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-xs font-semibold">Nenhuma música encontrada para sua busca.</p>
        </div>
      )}
    </div>
  );
};
