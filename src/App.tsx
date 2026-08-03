import React, { useState, useEffect, useRef } from 'react';
import { NavbarSidebar } from './components/NavbarSidebar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { EqualizerModal } from './components/EqualizerModal';
import { NowPlayingFullModal } from './components/NowPlayingFullModal';
import { HomeView } from './components/Views/HomeView';
import { BrowseView } from './components/Views/BrowseView';
import { LibraryView } from './components/Views/LibraryView';
import { RadioView } from './components/Views/RadioView';
import { AiLyricsStudio } from './components/AiLyricsStudio';
import { BeatStudioSequencer } from './components/BeatStudioSequencer';
import { INITIAL_TRACKS, FEATURED_PLAYLISTS } from './data/musicCatalog';
import { Track, Playlist, EqualizerSettings, VisualizerMode, AiGeneratedSong, ActiveTab } from './types';
import { audioEngine } from './services/audioEngine';
import { X, Plus, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Track & Playlist State
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('harmonia_tracks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TRACKS;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('harmonia_playlists');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return FEATURED_PLAYLISTS;
  });

  const [aiSongs, setAiSongs] = useState<AiGeneratedSong[]>(() => {
    const saved = localStorage.getItem('harmonia_ai_songs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Current Player State
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Equalizer & Visualizer State
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);

  // New Playlist Form State
  const [newPlName, setNewPlName] = useState('');
  const [newPlDesc, setNewPlDesc] = useState('');

  const [equalizerSettings, setEqualizerSettings] = useState<EqualizerSettings>({
    enabled: true,
    preGain: 0,
    presetName: 'Flat / Padrão',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || null;
  const likedTracks = tracks.filter((t) => t.isLiked);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('harmonia_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('harmonia_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('harmonia_ai_songs', JSON.stringify(aiSongs));
  }, [aiSongs]);

  // Audio Playback handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Auto-play blocked or error:', err);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  const handlePlayPause = () => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePreviousTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSelectTrack = (track: Track) => {
    const index = tracks.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handleToggleLike = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isLiked: !t.isLiked } : t))
    );
  };

  const handleSaveBeatAsTrack = (newTrack: Track) => {
    setTracks((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  const handleSaveAiSong = (song: AiGeneratedSong) => {
    setAiSongs((prev) => [song, ...prev]);
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;

    const newPl: Playlist = {
      id: `user-pl-${Date.now()}`,
      name: newPlName,
      description: newPlDesc || 'Minha playlist personalizada no Harmonia.',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      tracks: likedTracks.slice(0, 4),
      createdAt: new Date().toISOString().split('T')[0],
      isUserCreated: true
    };

    setPlaylists((prev) => [newPl, ...prev]);
    setNewPlName('');
    setNewPlDesc('');
    setIsCreatePlaylistOpen(false);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* HTML5 Audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="metadata" />

      {/* Main Navigation Sidebar */}
      <NavbarSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        likedCount={likedTracks.length}
        playlistCount={playlists.length}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'home' && (
          <HomeView
            featuredPlaylists={playlists}
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onToggleLike={handleToggleLike}
            onOpenAiStudio={() => setActiveTab('ai-studio')}
            onSelectPlaylist={(pl) => {
              if (pl.tracks.length > 0) handleSelectTrack(pl.tracks[0]);
            }}
          />
        )}

        {activeTab === 'browse' && (
          <BrowseView
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onToggleLike={handleToggleLike}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            likedTracks={likedTracks}
            playlists={playlists}
            aiSongs={aiSongs}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onToggleLike={handleToggleLike}
            onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            onDeletePlaylist={handleDeletePlaylist}
          />
        )}

        {activeTab === 'ai-studio' && (
          <AiLyricsStudio
            onSaveAiSong={handleSaveAiSong}
          />
        )}

        {activeTab === 'beat-maker' && (
          <BeatStudioSequencer
            onSaveBeatAsTrack={handleSaveBeatAsTrack}
          />
        )}

        {activeTab === 'radio' && (
          <RadioView
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
          />
        )}
      </main>

      {/* Bottom Player Control Bar */}
      <AudioPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        isRepeat={isRepeat}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onToggleLike={handleToggleLike}
        onOpenEqualizer={() => setIsEqualizerOpen(true)}
        onOpenNowPlaying={() => setIsNowPlayingOpen(true)}
        visualizerMode={visualizerMode}
        onChangeVisualizerMode={setVisualizerMode}
        audioRef={audioRef}
      />

      {/* Modals & Overlays */}
      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        settings={equalizerSettings}
        onUpdateSettings={setEqualizerSettings}
      />

      <NowPlayingFullModal
        isOpen={isNowPlayingOpen}
        onClose={() => setIsNowPlayingOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onToggleLike={handleToggleLike}
        visualizerMode={visualizerMode}
        onChangeVisualizerMode={setVisualizerMode}
        queue={tracks}
        onSelectFromQueue={handleSelectTrack}
      />

      {/* Create Playlist Modal */}
      {isCreatePlaylistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold">Criar Nova Playlist</h3>
              <button
                onClick={() => setIsCreatePlaylistOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylistSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Nome da Playlist
                </label>
                <input
                  type="text"
                  required
                  value={newPlName}
                  onChange={(e) => setNewPlName(e.target.value)}
                  placeholder="Ex: Vibrações do Fim de Semana"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={newPlDesc}
                  onChange={(e) => setNewPlDesc(e.target.value)}
                  placeholder="Descreva o estilo musical desta seleção..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 h-20 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatePlaylistOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30"
                >
                  Criar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
