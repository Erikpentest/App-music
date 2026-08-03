import React from 'react';
import {
  Home,
  Compass,
  Library,
  Sparkles,
  Sliders,
  Radio,
  Disc3,
  Heart,
  PlusCircle,
  Music2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onCreatePlaylist: () => void;
  likedCount: number;
  playlistCount: number;
}

export const NavbarSidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onCreatePlaylist,
  likedCount,
  playlistCount
}) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'browse', label: 'Navegar', icon: Compass },
    { id: 'library', label: 'Sua Biblioteca', icon: Library, badge: playlistCount > 0 ? playlistCount : null },
    { id: 'ai-studio', label: 'Estúdio IA (Compositor)', icon: Sparkles, highlight: true },
    { id: 'beat-maker', label: 'Beat Maker (Sequencer)', icon: Disc3 },
    { id: 'radio', label: 'Rádios Lo-Fi', icon: Radio },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-5 shrink-0 select-none">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              HARMONIA
            </h1>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-violet-400">
              Music & AI Studio
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1 mb-8">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Menu Principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25 font-semibold'
                    : item.highlight
                    ? 'bg-slate-900/80 hover:bg-slate-800 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Collections */}
        <div className="space-y-1 mb-auto">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Sua Coleção
          </p>
          <button
            onClick={() => onTabChange('library')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>Músicas Curtidas</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{likedCount}</span>
          </button>

          <button
            onClick={onCreatePlaylist}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-violet-400 hover:bg-slate-900 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            <span>Criar Playlist</span>
          </button>
        </div>

        {/* AI Studio Banner in Sidebar */}
        <div className="mt-6 p-4 rounded-3xl bg-gradient-to-b from-violet-900/40 to-slate-900 border border-violet-500/20 text-slate-200">
          <div className="flex items-center gap-2 text-violet-300 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            Compositor Inteligente
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Crie letras originais com acordes e sugestões de estilo usando IA.
          </p>
          <button
            onClick={() => onTabChange('ai-studio')}
            className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-violet-600/30 transition-all"
          >
            Experimentar Estúdio
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-slate-950/90 border-t border-slate-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around text-slate-400">
        {[
          { id: 'home', label: 'Início', icon: Home },
          { id: 'browse', label: 'Navegar', icon: Compass },
          { id: 'ai-studio', label: 'Estúdio IA', icon: Sparkles },
          { id: 'beat-maker', label: 'Beat Studio', icon: Disc3 },
          { id: 'library', label: 'Biblioteca', icon: Library },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ActiveTab)}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
