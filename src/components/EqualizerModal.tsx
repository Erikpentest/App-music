import React from 'react';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';
import { EqualizerSettings } from '../types';
import { EQUALIZER_FREQUENCIES, audioEngine } from '../services/audioEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: EqualizerSettings;
  onUpdateSettings: (newSettings: EqualizerSettings) => void;
}

const PRESETS: { [key: string]: number[] } = {
  'Flat / Padrão': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Impulso de Graves': [7, 6, 5, 2, 0, -1, -2, -2, -2, -2],
  'Sertanejo & Vocal': [-2, 0, 2, 4, 5, 4, 2, 0, 1, 2],
  'Acústico & MPB': [4, 3, 2, 1, 2, 3, 4, 3, 2, 1],
  'Lo-Fi Chill': [5, 4, 2, 0, -1, -1, 0, 1, -2, -4],
  'Rock Enérgico': [6, 4, 2, -1, -2, 2, 4, 5, 6, 6],
  'Eletrônica & EDM': [7, 6, 2, 0, -2, 2, 4, 6, 7, 7],
  'Pop Vibrant': [3, 2, 0, -1, 1, 3, 4, 4, 3, 2],
};

export const EqualizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleBandChange = (index: number, val: number) => {
    const newBands = [...settings.bands];
    newBands[index] = val;
    const updated = { ...settings, bands: newBands, presetName: 'Personalizado' };
    onUpdateSettings(updated);
    audioEngine.applyEqualizerSettings(updated);
  };

  const handlePreGainChange = (val: number) => {
    const updated = { ...settings, preGain: val };
    onUpdateSettings(updated);
    audioEngine.applyEqualizerSettings(updated);
  };

  const handleToggleEnable = () => {
    const updated = { ...settings, enabled: !settings.enabled };
    onUpdateSettings(updated);
    audioEngine.applyEqualizerSettings(updated);
  };

  const handleApplyPreset = (presetName: string) => {
    const bands = PRESETS[presetName];
    if (!bands) return;
    const updated = { ...settings, bands: [...bands], presetName };
    onUpdateSettings(updated);
    audioEngine.applyEqualizerSettings(updated);
  };

  const handleReset = () => {
    handleApplyPreset('Flat / Padrão');
  };

  const formatFreq = (freq: number) => {
    if (freq >= 1000) return `${freq / 1000}k`;
    return `${freq}Hz`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Equalizador Profissional</h2>
              <p className="text-xs text-slate-400">10 Bandas de Frequência & Presets Sonoros</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleEnable}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                settings.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {settings.enabled ? '● Ativo' : '○ Desativado'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="my-5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Presets Recomendados
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(PRESETS).map((pName) => {
              const isSelected = settings.presetName === pName;
              return (
                <button
                  key={pName}
                  onClick={() => handleApplyPreset(pName)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/20'
                      : 'bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className="truncate">{pName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Area */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 my-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              {settings.presetName}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar
            </button>
          </div>

          <div className="grid grid-cols-10 gap-2 sm:gap-3 items-end h-48 py-2">
            {EQUALIZER_FREQUENCIES.map((freq, idx) => {
              const gainVal = settings.bands[idx] || 0;
              return (
                <div key={freq} className="flex flex-col items-center h-full justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {gainVal > 0 ? `+${gainVal}` : gainVal}dB
                  </span>

                  <div className="relative flex-1 flex items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      value={gainVal}
                      disabled={!settings.enabled}
                      onChange={(e) => handleBandChange(idx, parseFloat(e.target.value))}
                      className="h-36 -rotate-90 origin-center accent-violet-500 cursor-pointer disabled:opacity-40"
                      style={{ width: '130px' }}
                    />
                  </div>

                  <span className="text-[10px] font-semibold text-slate-300">
                    {formatFreq(freq)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre-Gain & Footnotes */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Ganho Geral (Pre-Gain):</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={settings.preGain}
              onChange={(e) => handlePreGainChange(parseFloat(e.target.value))}
              className="w-28 accent-violet-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-violet-300">
              {settings.preGain > 0 ? `+${settings.preGain}` : settings.preGain} dB
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
