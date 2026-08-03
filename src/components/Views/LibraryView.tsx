import React, { useState } from 'react';
import { Library, Heart, ListMusic, Sparkles, Disc3, Plus, Play, Trash2, Music } from 'lucide-react';
import { Playlist, Track, AiGeneratedSong } from '../../types';

interface Props {
  likedTracks: Track[];
  playlists: Playlist[];
  aiSongs: AiGeneratedSong[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onCreatePlaylist: () => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export const LibraryView: React.FC<Props> = ({
  likedTracks,
  playlists,
  aiSongs,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onToggleLike,
  onCreatePlaylist,
  onDeletePlaylist
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'liked' | 'playlists' | 'ai-songs'>('liked');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-violet-400" />
            Sua Biblioteca
          </h1>
          <p className="text-xs text-slate-400">Suas músicas curtidas, playlists criadas e composições de IA</p>
        </div>

        <button
          onClick={onCreatePlaylist}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Playlist</span>
        </button>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'liked', label: 'Músicas Curtidas', icon: Heart, count: likedTracks.length },
          { id: 'playlists', label: 'Minhas Playlists', icon: ListMusic, count: playlists.length },
          { id: 'ai-songs', label: 'Composições IA', icon: Sparkles, count: aiSongs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Liked Tracks View */}
      {activeSubTab === 'liked' && (
        <div className="space-y-3">
          {likedTracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className="p-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-3xl transition-all cursor-pointer flex items-center gap-4 group"
                >
                  <img src={track.coverUrl} alt={track.title} className="w-14 h-14 object-cover rounded-2xl shadow-md shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-300 truncate">{track.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                    <span className="inline-block mt-1 text-[9px] font-semibold text-violet-400">{track.genre}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(track.id);
                    }}
                    className="text-rose-500 fill-rose-500 p-2 hover:scale-110 transition-transform"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 space-y-2">
              <Heart className="w-10 h-10 mx-auto opacity-30 text-rose-500" />
              <p className="text-xs font-semibold">Você ainda não tem músicas curtidas.</p>
            </div>
          )}
        </div>
      )}

      {/* Playlists View */}
      {activeSubTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-4">
                <img src={pl.coverUrl} alt={pl.name} className="w-16 h-16 object-cover rounded-2xl shadow-md shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{pl.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{pl.description}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {pl.tracks.length} faixa(s)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => pl.tracks[0] && onSelectTrack(pl.tracks[0])}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Tocar Playlist
                </button>

                {pl.isUserCreated && onDeletePlaylist && (
                  <button
                    onClick={() => onDeletePlaylist(pl.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Songs View */}
      {activeSubTab === 'ai-songs' && (
        <div className="space-y-4">
          {aiSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSongs.map((song) => (
                <div key={song.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white">{song.title}</h3>
                      <p className="text-xs text-slate-400">{song.artist} • {song.genre}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-violet-950 text-violet-300 border border-violet-800 text-[10px] font-mono">
                      {song.keySignature} • {song.bpm} BPM
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2 max-h-40 overflow-y-auto">
                    {song.structure?.map((st, i) => (
                      <div key={i}>
                        <span className="text-violet-400 font-bold">[{st.type}]</span>
                        <p className="text-slate-300">{st.lyrics}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 italic">Criado em {song.createdAt}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 space-y-2">
              <Sparkles className="w-10 h-10 mx-auto opacity-30 text-violet-400" />
              <p className="text-xs font-semibold">Nenhuma música gerada com IA salva ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
