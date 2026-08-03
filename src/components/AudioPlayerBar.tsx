import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Sliders,
  Maximize2,
  FileText,
  Activity,
  ListMusic
} from 'lucide-react';
import { Track, VisualizerMode } from '../types';
import { audioEngine } from '../services/audioEngine';

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  onToggleLike: (trackId: string) => void;
  onOpenEqualizer: () => void;
  onOpenNowPlaying: () => void;
  visualizerMode: VisualizerMode;
  onChangeVisualizerMode: (mode: VisualizerMode) => void;
  onToggleQueue?: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const AudioPlayerBar: React.FC<Props> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onToggleLike,
  onOpenEqualizer,
  onOpenNowPlaying,
  visualizerMode,
  onChangeVisualizerMode,
  onToggleQueue,
  audioRef
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVisMenu, setShowVisMenu] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => setDuration(audio.duration || 0);
    const handleEnded = () => onNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, onNext]);

  // Connect audio element to Web Audio Engine on mount
  useEffect(() => {
    if (audioRef.current) {
      audioEngine.attachAudioElement(audioRef.current);
    }
  }, [audioRef, currentTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 border-t border-slate-800 backdrop-blur-lg px-6 py-3 flex items-center justify-between text-slate-400 text-xs">
        <span>Selecione uma faixa para começar a ouvir</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-2xl px-4 py-2.5 sm:px-6 shadow-2xl text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-0">
          <button
            onClick={onOpenNowPlaying}
            className="relative group shrink-0 overflow-hidden rounded-xl border border-slate-800/80 shadow-md"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </button>

          <div className="min-w-0 flex-1">
            <h4
              onClick={onOpenNowPlaying}
              className="text-sm font-bold truncate text-slate-100 hover:text-violet-400 cursor-pointer transition-colors"
            >
              {currentTrack.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
          </div>

          <button
            onClick={() => onToggleLike(currentTrack.id)}
            className={`p-2 rounded-full transition-colors ${
              currentTrack.isLiked
                ? 'text-rose-500 hover:text-rose-400 fill-rose-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Player Controls & Timeline */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 rounded-full transition-colors ${
                isShuffle ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Aleatório"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevious}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
              title="Anterior"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-lg shadow-violet-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
              title="Próxima"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-1.5 rounded-full transition-colors ${
                isRepeat ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Repetir"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time slider */}
          <div className="flex items-center gap-2.5 w-full max-w-md">
            <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400"
            />
            <span className="text-[11px] font-mono text-slate-400 w-9 text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Extra Features (Equalizer, Visualizer, Volume, Queue) */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
          <div className="relative">
            <button
              onClick={() => setShowVisMenu(!showVisMenu)}
              className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              title="Visualizador de Áudio"
            >
              <Activity className="w-4 h-4" />
            </button>

            {showVisMenu && (
              <div className="absolute bottom-10 right-0 w-44 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl z-50 text-xs">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
                  Visualizador
                </p>
                {[
                  { id: 'bars', label: '📊 Frequências' },
                  { id: 'wave', label: '🌊 Forma de Onda' },
                  { id: 'particles', label: '💫 Galáxia' },
                  { id: 'circle', label: '⭕ Círculo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChangeVisualizerMode(item.id as VisualizerMode);
                      setShowVisMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      visualizerMode === item.id ? 'bg-violet-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenEqualizer}
            className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-800/60 rounded-xl transition-colors"
            title="Equalizador 10-Bandas"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNowPlaying}
            className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-800/60 rounded-xl transition-colors"
            title="Letras & Chords"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
