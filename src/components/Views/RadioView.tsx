import React from 'react';
import { Radio, Signal, Play, Pause, Disc } from 'lucide-react';
import { Track } from '../../types';

interface Props {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
}

const STATIONS = [
  {
    id: 'st-1',
    name: 'Estação Lo-Fi Estudo & Código 24/7',
    description: 'Batidas relaxantes e suaves para máxima produtividade e concentração.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    trackIndex: 1, // Cafe na Chuva
    listeners: '1.4k ouvintes ao vivo'
  },
  {
    id: 'st-2',
    name: 'Rádio Synthwave & Cyber Neon',
    description: 'Sintetizadores retrô dos anos 80 para dirigir na noite digital.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    trackIndex: 0, // Horizonte Neon
    listeners: '980 ouvintes ao vivo'
  },
  {
    id: 'st-3',
    name: 'Frequência Bossa Nova & Mar',
    description: 'Suaves acordes de violão e brisa praiana de Ipanema.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    trackIndex: 3, // Caminho do Sol
    listeners: '2.1k ouvintes ao vivo'
  },
  {
    id: 'st-4',
    name: 'Rádio Sertanejo Acústico',
    description: 'Modões de violão para momentos em família e amigos.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    trackIndex: 2, // Noite de Verão
    listeners: '3.5k ouvintes ao vivo'
  }
];

export const RadioView: React.FC<Props> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-violet-400" />
            Estações de Rádio Ao Vivo
          </h1>
          <p className="text-xs text-slate-400">Transmissão contínua de música por ambientação e estado de espírito</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
          Transmitindo Ao Vivo
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STATIONS.map((st) => {
          const track = tracks[st.trackIndex] || tracks[0];
          const isSelected = currentTrack?.id === track?.id;

          return (
            <div
              key={st.id}
              onClick={() => track && onSelectTrack(track)}
              className={`group p-6 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5 ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-900/60 to-slate-900 border-violet-500 shadow-xl shadow-violet-600/20'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
              }`}
            >
              <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                <img src={st.coverUrl} alt={st.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="p-3 bg-violet-600 text-white rounded-full shadow-lg">
                    {isSelected && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-violet-300">
                  {st.listeners}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  {st.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {st.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
