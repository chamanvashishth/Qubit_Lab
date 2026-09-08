import React from 'react';
import {
  BookOpen, Sliders, Layers, Terminal, 
  Award, TrendingUp, Sparkles, Home 
} from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAI,
}) => {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'composer', label: 'Composer', icon: Sliders },
    { id: 'bloch', label: '3D Bloch', icon: Layers },
    { id: 'sandbox', label: 'Sandbox', icon: Terminal },
    { id: 'quiz', label: 'Quizzes', icon: Award },
    { id: 'dashboard', label: 'Skill Tree', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-800 bg-[#05070a]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity with Immersive UI Gradient & Pulse */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <div className="w-4 h-4 border-2 border-white rounded-full animate-pulse flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono">
                QUANTUM<span className="text-cyan-400">.LAB</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.25)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {

          <button
            onClick={onOpenAI}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.35)] border border-purple-400/30 transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Tutor</span>
            <span className="sm:hidden">AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 px-2 py-2 border-t border-slate-800 bg-[#05070a]/95 backdrop-blur-md overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium flex flex-col items-center gap-0.5 shrink-0 ${
                isActive
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
