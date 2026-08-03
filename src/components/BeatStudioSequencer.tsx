import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Save,
  Volume2,
  Disc3,
  Sliders,
  Flame
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { Track } from '../types';

interface Props {
  onSaveBeatAsTrack: (track: Track) => void;
}

const TRACK_NAMES = [
  { id: 'kick', label: '🥁 Bumbo (Kick)', color: 'border-rose-500/50 bg-rose-500/10 text-rose-300' },
  { id: 'snare', label: '🥁 Caixa (Snare)', color: 'border-amber-500/50 bg-amber-500/10 text-amber-300' },
  { id: 'hihat', label: '🎶 Chimbal (Hi-Hat)', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
  { id: 'bass', label: '🎹 Baixo Synth', color: 'border-violet-500/50 bg-violet-500/10 text-violet-300' },
  { id: 'lead', label: '⚡ Sintetizador Lead', color: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' },
];

const PRESETS = {
  'Lo-Fi Chill': {
    bpm: 85,
    grid: {
      kick:  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      bass:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      lead:  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    }
  },
  'Synthwave 80s': {
    bpm: 120,
    grid: {
      kick:  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      bass:  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      lead:  [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    }
  },
  'Funk & Pop Br': {
    bpm: 130,
    grid: {
      kick:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
      hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      bass:  [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
      lead:  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    }
  },
  'Sertanejo Beat': {
    bpm: 105,
    grid: {
      kick:  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      snare: [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
      hihat: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      bass:  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      lead:  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    }
  }
};

export const BeatStudioSequencer: React.FC<Props> = ({ onSaveBeatAsTrack }) => {
  const [bpm, setBpm] = useState(110);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [presetName, setPresetName] = useState('Lo-Fi Chill');
  const [grid, setGrid] = useState<{ [key: string]: number[] }>(PRESETS['Lo-Fi Chill'].grid);
  const [beatTitle, setBeatTitle] = useState('Meu Beat Exclusivo');

  const timerRef = useRef<number | null>(null);

  // Step Sequencer Timer Loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = (60 / bpm / 4) * 1000;

    timerRef.current = window.setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = (prev + 1) % 16;

        // Trigger audio synth notes for active steps
        Object.keys(grid).forEach((trackId) => {
          if (grid[trackId][nextStep] === 1) {
            if (trackId === 'kick') audioEngine.playSynthSound('kick');
            if (trackId === 'snare') audioEngine.playSynthSound('snare');
            if (trackId === 'hihat') audioEngine.playSynthSound('hihat');
            if (trackId === 'bass') {
              const notes = [110, 130.81, 146.83, 164.81];
              audioEngine.playSynthSound('bass', notes[nextStep % notes.length]);
            }
            if (trackId === 'lead') {
              const notes = [440, 523.25, 587.33, 659.25];
              audioEngine.playSynthSound('lead', notes[(nextStep * 2) % notes.length]);
            }
          }
        });

        return nextStep;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, grid]);

  const toggleStep = (trackId: string, stepIndex: number) => {
    const newRow = [...grid[trackId]];
    newRow[stepIndex] = newRow[stepIndex] === 1 ? 0 : 1;
    setGrid({ ...grid, [trackId]: newRow });

    // Preview sound on click
    if (newRow[stepIndex] === 1) {
      audioEngine.playSynthSound(trackId as any);
    }
  };

  const handleLoadPreset = (pName: keyof typeof PRESETS) => {
    const preset = PRESETS[pName];
    if (!preset) return;
    setPresetName(pName);
    setBpm(preset.bpm);
    setGrid(preset.grid);
  };

  const handleClear = () => {
    const emptyGrid: { [key: string]: number[] } = {};
    TRACK_NAMES.forEach((t) => {
      emptyGrid[t.id] = Array(16).fill(0);
    });
    setGrid(emptyGrid);
  };

  const handleSaveToLibrary = () => {
    const newTrack: Track = {
      id: `beat-${Date.now()}`,
      title: beatTitle || 'Beat do Estúdio',
      artist: 'Sintetizador Harmonia',
      album: 'Criações no Estúdio',
      duration: 180,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Backing track sample
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      genre: 'Beat Autoral',
      year: 2026,
      bpm: bpm,
      isLiked: true,
      isBeatStudioTrack: true
    };

    onSaveBeatAsTrack(newTrack);
    alert('🎉 Beat salvo com sucesso na sua biblioteca de músicas!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-pink-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-pink-600/30">
            <Disc3 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Beat Maker & Sintetizador 16-Steps</h2>
            <p className="text-xs text-slate-400">Crie ritmos em tempo real com gerador de áudio Web Audio API</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pausar Sequencer' : 'Tocar Sequencer'}</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Limpar Grade"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BPM & Presets Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* BPM Slider */}
        <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Tempo (BPM)</span>
            <span className="text-xl font-mono font-bold text-violet-400">{bpm} BPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-32 accent-violet-500 cursor-pointer"
          />
        </div>

        {/* Presets */}
        <div className="md:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-2">
            Presets:
          </span>
          {Object.keys(PRESETS).map((pName) => (
            <button
              key={pName}
              onClick={() => handleLoadPreset(pName as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                presetName === pName
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                  : 'bg-slate-950/50 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {pName}
            </button>
          ))}
        </div>
      </div>

      {/* 16-Step Sequencer Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-x-auto space-y-4">
        {TRACK_NAMES.map((track) => (
          <div key={track.id} className="flex items-center gap-3 min-w-[720px]">
            {/* Track Name */}
            <div className={`w-44 px-3 py-2.5 rounded-xl border text-xs font-bold ${track.color} shrink-0`}>
              {track.label}
            </div>

            {/* 16 Steps */}
            <div className="grid grid-cols-16 gap-1.5 flex-1">
              {Array.from({ length: 16 }).map((_, stepIdx) => {
                const isActive = grid[track.id]?.[stepIdx] === 1;
                const isCurrent = currentStep === stepIdx && isPlaying;

                return (
                  <button
                    key={stepIdx}
                    onClick={() => toggleStep(track.id, stepIdx)}
                    className={`h-11 rounded-lg border text-[10px] font-mono font-bold transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/30 scale-102'
                        : stepIdx % 4 === 0
                        ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 text-slate-500'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-600'
                    } ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                  >
                    {stepIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Save Beat Section */}
      <div className="bg-gradient-to-r from-violet-950/60 to-slate-900 border border-violet-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Save className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            type="text"
            value={beatTitle}
            onChange={(e) => setBeatTitle(e.target.value)}
            placeholder="Nome da sua faixa autoral..."
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-violet-500 w-full sm:w-64"
          />
        </div>

        <button
          onClick={handleSaveToLibrary}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Salvar Beat na Minha Biblioteca
        </button>
      </div>
    </div>
  );
};
