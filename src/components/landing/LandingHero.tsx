import React, { useState } from 'react';
import { Sparkles, Sliders, Terminal, BookOpen, ArrowRight, Award, Layers, Zap, Play } from 'lucide-react';
import { BlochSphere3D } from '../bloch/BlochSphere3D';
import { QubitState } from '../../types/quantum';

interface LandingHeroProps {
  onNavigate: (tab: 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz') => void;
  onOpenAI: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate, onOpenAI }) => {
  const [heroGate, setHeroGate] = useState<'I' | 'H' | 'X' | 'Z' | 'S'>('H');

  const states: Record<typeof heroGate, QubitState> = {
    I: { theta: 0, phi: 0, x: 0, y: 0, z: 1, purity: 1, p0: 1, p1: 0 },
    H: { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0, purity: 1, p0: .5, p1: .5 },
    X: { theta: Math.PI, phi: 0, x: 0, y: 0, z: -1, purity: 1, p0: 0, p1: 1 },
    Z: { theta: 0, phi: Math.PI, x: 0, y: 0, z: 1, purity: 1, p0: 1, p1: 0 },
    S: { theta: Math.PI / 2, phi: Math.PI / 2, x: 0, y: 1, z: 0, purity: 1, p0: .5, p1: .5 },
  };

  const notation: Record<typeof heroGate, string> = {
    I: '|0⟩', H: '(|0⟩ + |1⟩) / √2', X: '|1⟩', Z: '|0⟩', S: '(|0⟩ + i|1⟩) / √2'
  };

  const cards = [
    { title: 'Circuit Composer', text: 'Place gates, build circuits, and inspect state changes.', icon: Sliders, tab: 'composer' as const },
    { title: 'Bloch Space', text: 'See a single qubit as geometry you can reason about.', icon: Layers, tab: 'bloch' as const },
    { title: 'Code Workspace', text: 'Explore quantum code without leaving the learning flow.', icon: Terminal, tab: 'sandbox' as const },
    { title: 'Learning Path', text: 'Move from foundations to algorithms at your own pace.', icon: BookOpen, tab: 'curriculum' as const },
    { title: 'Practice Mocks', text: 'Test understanding with focused 10-question modules.', icon: Award, tab: 'quiz' as const },
    { title: 'Progress', text: 'Track what you completed during the active session.', icon: Zap, tab: 'dashboard' as const },
  ];

  return (
    <div className="space-y-14 py-8">
      <section className="relative min-h-[610px] overflow-hidden rounded-[2rem] glass-panel">
        <div className="orb orb-blue w-72 h-72 -top-20 left-[18%] opacity-75" />
        <div className="orb orb-orange w-[26rem] h-[26rem] -bottom-48 left-[8%] opacity-70" />
        <div className="orb orb-pink w-16 h-16 right-[11%] bottom-[22%]" />
        <div className="gold-ring absolute w-16 h-16 top-[18%] left-[13%]" />
        <div className="gold-ring absolute w-12 h-12 right-[13%] bottom-[29%]" />

        <div className="absolute right-[5%] top-[8%] w-40 h-40 border-t border-white/10 rotate-[28deg] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,.05),rgba(255,255,255,.035),rgba(0,0,0,.18))]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-7 sm:p-12 lg:p-16 items-center min-h-[610px]">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-black/30 text-[10px] tracking-[.16em] uppercase text-zinc-300">
              Interactive quantum computing workspace
            </div>

            <h1 className="max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[.98] text-zinc-100">
              Learn the ideas.<br />
              <span className="template-accent font-bold">Build the circuit.</span><br />
              See what changes.
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-7 text-zinc-400">
              QubitLab turns quantum concepts into things you can manipulate: states, gates, circuits, code, visualizations, and practice questions.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate('composer')} className="template-button px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
                <Sliders className="w-4 h-4" /> Open composer
              </button>
              <button onClick={() => onNavigate('curriculum')} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 text-sm flex items-center gap-2 transition-all">
                <Play className="w-4 h-4" /> Start learning
              </button>
              <button onClick={onOpenAI} className="px-5 py-3 rounded-xl text-zinc-300 hover:text-white text-sm border border-white/10 hover:border-white/25 transition-all">
                Ask a question
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel rounded-[1.7rem] p-5 sm:p-6 max-w-md mx-auto relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Live state preview</div>
                  <div className="text-sm font-medium text-zinc-100 mt-1">Single-qubit laboratory</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#dfff3f] shadow-[0_0_15px_rgba(223,255,63,.7)]" />
              </div>

              <BlochSphere3D qubitState={states[heroGate]} qubitIndex={0} label="q[0]" size={250} interactive={false} />

              <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-center font-mono text-xs text-zinc-300">
                |ψ⟩ = {notation[heroGate]}
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {(['I', 'H', 'X', 'Z', 'S'] as const).map((gate) => (
                  <button key={gate} onClick={() => setHeroGate(gate)} className={`py-2 rounded-lg text-xs font-mono border transition-all ${heroGate === gate ? 'bg-[#dfff3f] text-black border-[#dfff3f]' : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'}`}>
                    {gate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <div className="text-[10px] uppercase tracking-[.22em] text-zinc-500 mb-3">One workspace, multiple ways to learn</div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100">Move between theory and experimentation without changing tools.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button key={card.title} onClick={() => onNavigate(card.tab)} className="glass-card group text-left p-6 rounded-2xl min-h-48 hover:-translate-y-1 hover:border-white/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-[#dfff3f] group-hover:text-black transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-medium text-zinc-100">{card.title}</h3>
                <p className="text-sm leading-6 text-zinc-500 mt-2">{card.text}</p>
                <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400 group-hover:text-[#dfff3f] transition-colors">Open workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
