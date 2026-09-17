import React from 'react';
import { BookOpen, Sliders, Layers, Terminal, Award, Library, Home, Sparkles, UserRound, Languages } from 'lucide-react';
import { AuthUser } from '../../utils/auth';

export type NavTab = 'home' | 'progress' | 'dashboard' | 'library' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz' | 'user';
export type Language = 'en' | 'hi';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAI: () => void;
  user?: AuthUser | null;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const labels = {
  en: { home: 'Home', learn: 'Learn', composer: 'Composer', bloch: 'Bloch', code: 'Code', practice: 'Practice', library: 'Library', tutor: 'Ask tutor', account: 'Account' },
  hi: { home: 'होम', learn: 'सीखें', composer: 'सर्किट', bloch: 'ब्लॉक', code: 'कोड', practice: 'अभ्यास', library: 'लाइब्रेरी', tutor: 'ट्यूटर से पूछें', account: 'खाता' },
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenAI, user, language, onLanguageChange }) => {
  const copy = labels[language];
  const navItems = [
    { id: 'home', label: copy.home, icon: Home }, { id: 'curriculum', label: copy.learn, icon: BookOpen },
    { id: 'composer', label: copy.composer, icon: Sliders }, { id: 'bloch', label: copy.bloch, icon: Layers },
    { id: 'sandbox', label: copy.code, icon: Terminal }, { id: 'quiz', label: copy.practice, icon: Award },
    { id: 'library', label: copy.library, icon: Library },
  ] as const;

  const navigation = <nav className="flex min-w-max items-center gap-1 rounded-xl bg-black/30 border border-white/5 p-1">{navItems.map((item) => {
    const Icon = item.icon; const active = activeTab === item.id;
    return <button key={item.id} onClick={() => onSelectTab(item.id)} className={`px-3 py-2 rounded-lg text-[11px] flex items-center gap-1.5 transition-all ${active ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-zinc-200'}`}><Icon className="w-3.5 h-3.5" />{item.label}</button>;
  })}</nav>;

  return <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3">
    <div className="glass-panel max-w-7xl mx-auto min-h-16 rounded-2xl px-3 sm:px-5 flex items-center justify-between gap-4">
      <button onClick={() => onSelectTab('home')} className="flex items-center gap-3 shrink-0 text-left">
        <div className="w-9 h-9 rounded-xl border border-white/20 bg-black/40 flex items-center justify-center"><div className="w-4 h-4 rounded-full border-2 border-[#dfff3f] shadow-[0_0_18px_rgba(223,255,63,.55)]" /></div>
        <div><div className="text-sm sm:text-base font-semibold tracking-[.18em] text-zinc-100">QUBIT<span className="template-accent">LAB</span></div><div className="hidden sm:block text-[9px] tracking-[.28em] text-zinc-500 uppercase">Interactive quantum workspace</div></div>
      </button>
      <div className="hidden xl:block">{navigation}</div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-black/30 p-1" aria-label="Language selector"><Languages className="w-3.5 h-3.5 ml-2 mr-1 text-zinc-500" /><button onClick={() => onLanguageChange('en')} className={`px-2 py-1 rounded-lg text-[10px] ${language === 'en' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>EN</button><button onClick={() => onLanguageChange('hi')} className={`px-2 py-1 rounded-lg text-[10px] ${language === 'hi' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>हि</button></div>
        <button onClick={onOpenAI} className="flex items-center gap-2 rounded-xl border border-[#dfff3f]/20 bg-black/30 px-3 py-2 hover:border-[#dfff3f]/50 hover:bg-[#dfff3f]/5 transition-all" aria-label="Open QubitLab tutor"><Sparkles className="w-4 h-4 text-[#dfff3f]" /><span className="hidden sm:block text-[10px] font-semibold text-zinc-100">{copy.tutor}</span></button>
        <button onClick={() => onSelectTab('user')} aria-label={user ? `Open account for ${user.name}` : 'Log in or sign up'} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all ${activeTab === 'user' ? 'border-[#dfff3f]/40 bg-[#dfff3f]/10 text-[#dfff3f]' : 'border-white/10 bg-black/30 text-zinc-300 hover:text-white hover:border-white/20'}`}><UserRound className="w-4 h-4" /><span className="hidden md:block max-w-24 truncate text-[10px] font-semibold">{user ? user.name : copy.account}</span></button>
      </div>
    </div>
    <div className="xl:hidden max-w-7xl mx-auto mt-2 overflow-x-auto responsive-scroll-x" aria-label="Primary navigation">{navigation}</div>
  </header>;
};
