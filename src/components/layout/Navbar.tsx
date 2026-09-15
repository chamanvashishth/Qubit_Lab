import React from 'react';
import { BookOpen, Sliders, Layers, Terminal, Award, TrendingUp, Home, Sparkles, UserRound } from 'lucide-react';
import { GuideAvatar } from '../chat/GuideAvatar';
import { AuthUser } from '../../utils/auth';

export type NavTab = 'home' | 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz' | 'user';
interface NavbarProps { activeTab: NavTab; onSelectTab: (tab: NavTab) => void; onOpenAI: () => void; user?: AuthUser | null; }

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenAI, user }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home }, { id: 'curriculum', label: 'Learn', icon: BookOpen },
    { id: 'composer', label: 'Composer', icon: Sliders }, { id: 'bloch', label: 'Bloch', icon: Layers },
    { id: 'sandbox', label: 'Code', icon: Terminal }, { id: 'quiz', label: 'Practice', icon: Award },
    { id: 'dashboard', label: 'Progress', icon: TrendingUp },
  ] as const;

  return <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3">
    <div className="glass-panel max-w-7xl mx-auto min-h-16 rounded-2xl px-3 sm:px-5 flex items-center justify-between gap-4">
      <button onClick={() => onSelectTab('home')} className="flex items-center gap-3 shrink-0 text-left">
        <div className="w-9 h-9 rounded-xl border border-white/20 bg-black/40 flex items-center justify-center relative overflow-hidden"><div className="w-4 h-4 rounded-full border-2 border-[#dfff3f] shadow-[0_0_18px_rgba(223,255,63,.55)]" /></div>
        <div><div className="text-sm sm:text-base font-semibold tracking-[.18em] text-zinc-100">QUBIT<span className="template-accent">LAB</span></div><div className="hidden sm:block text-[9px] tracking-[.28em] text-zinc-500 uppercase">Interactive quantum workspace</div></div>
      </button>
      <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-black/30 border border-white/5 p-1">{navItems.map((item) => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => onSelectTab(item.id)} className={`px-3 py-2 rounded-lg text-[11px] flex items-center gap-1.5 transition-all ${active ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-zinc-200'}`}><Icon className="w-3.5 h-3.5" />{item.label}</button>; })}</nav>
      <div className="flex items-center gap-2">
        <button onClick={onOpenAI} className="group relative flex items-center gap-2.5 rounded-xl border border-[#dfff3f]/20 bg-black/30 pl-1.5 pr-3 py-1.5 hover:border-[#dfff3f]/50 hover:bg-[#dfff3f]/5 transition-all" aria-label="Open QubitLab virtual guide">
          <span className="relative flex items-end justify-center w-9 h-9 overflow-hidden rounded-lg"><GuideAvatar mood="idle" size="sm" /></span>
          <span className="hidden sm:block text-left"><span className="block text-[10px] font-semibold text-zinc-100">Ask the guide</span><span className="block text-[9px] text-zinc-600 group-hover:text-zinc-400">Quantum tutor</span></span>
          <Sparkles className="w-3.5 h-3.5 text-[#dfff3f] hidden sm:block" />
        </button>
        <button onClick={() => onSelectTab('user')} aria-label={user ? `Open account for ${user.name}` : 'Log in or sign up'} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all ${activeTab === 'user' ? 'border-[#dfff3f]/40 bg-[#dfff3f]/10 text-[#dfff3f]' : 'border-white/10 bg-black/30 text-zinc-300 hover:text-white hover:border-white/20'}`}>
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"><UserRound className="w-4 h-4" /></div>
          <span className="hidden md:block max-w-24 truncate text-[10px] font-semibold">{user ? user.name : 'Account'}</span>
        </button>
      </div>
    </div>
    <div className="lg:hidden max-w-7xl mx-auto mt-2 glass-panel rounded-xl px-2 py-1.5 overflow-x-auto responsive-scroll-x" aria-label="Primary navigation"><nav className="flex min-w-max gap-1 pr-2">{navItems.map((item) => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => onSelectTab(item.id)} className={`shrink-0 min-h-9 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 ${active ? 'bg-white/10 text-white' : 'text-zinc-500'}`}><Icon className="w-3.5 h-3.5" />{item.label}</button>; })}<button onClick={() => onSelectTab('user')} className={`shrink-0 min-h-9 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 ${activeTab === 'user' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}><UserRound className="w-3.5 h-3.5" />Account</button></nav></div>
  </header>;
};
