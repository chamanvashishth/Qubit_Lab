import React, { useState } from 'react';
import { 
  Sparkles, Sliders, Cpu, Terminal, BookOpen, ArrowRight, 
  Award, Layers, CheckCircle2, Play, RefreshCw, Zap 
} from 'lucide-react';
import { BlochSphere3D } from '../bloch/BlochSphere3D';
import { QubitState } from '../../types/quantum';

interface LandingHeroProps {
  onNavigate: (tab: 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz') => void;
  onOpenAI: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate, onOpenAI }) => {
  // Mini interactive state for hero preview
  const [heroGate, setHeroGate] = useState<'I' | 'H' | 'X' | 'Z' | 'S'>('H');

  const getHeroBlochState = (): QubitState => {
    switch (heroGate) {
      case 'I':
        return { theta: 0, phi: 0, x: 0, y: 0, z: 1, purity: 1, p0: 1, p1: 0 };
      case 'H':
        return { theta: Math.PI / 2, phi: 0, x: 1, y: 0, z: 0, purity: 1, p0: 0.5, p1: 0.5 };
      case 'X':
        return { theta: Math.PI, phi: 0, x: 0, y: 0, z: -1, purity: 1, p0: 0, p1: 1 };
      case 'Z':
        return { theta: 0, phi: Math.PI, x: 0, y: 0, z: 1, purity: 1, p0: 1, p1: 0 };
      case 'S':
        return { theta: Math.PI / 2, phi: Math.PI / 2, x: 0, y: 1, z: 0, purity: 1, p0: 0.5, p1: 0.5 };
    }
  };

  const getHeroDiracNotation = (): string => {
    switch (heroGate) {
      case 'I':
        return '|0⟩';
      case 'H':
        return '(|0⟩ + |1⟩) / √2  [|+⟩ state]';
      case 'X':
        return '|1⟩  [Bit flipped]';
      case 'Z':
        return '|0⟩  [Phase invariant]';
      case 'S':
        return '(|0⟩ + i|1⟩) / √2  [|i⟩ state]';
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-[#0a1226]/90 via-[#070d1e]/80 to-[#040814]/90 shadow-2xl shadow-black/80 quantum-grid-bg">
        {/* Glow ambient background spot */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Learn quantum computing by building and exploring
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Learn Quantum Computing with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Clear Concepts and Hands-On Practice
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Learn the core ideas behind quantum computing through circuits, visualizations, code examples, and guided practice. Build circuits, explore the Bloch sphere, and understand how quantum operations work.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('composer')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
              >
                <Sliders className="w-4 h-4" />
                Open Circuit Composer
              </button>

              <button
                onClick={() => onNavigate('curriculum')}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Start Learning
              </button>

              <button
                onClick={onOpenAI}
                className="px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Ask AI Tutor
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">2^N Dim</div>
                <div className="text-[11px] text-slate-400 font-mono">Statevector simulation</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">3D View</div>
                <div className="text-[11px] text-slate-400 font-mono">Bloch sphere</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400">Code Examples</div>
                <div className="text-[11px] text-slate-400 font-mono">Qiskit, PennyLane, Cirq</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Hero Qubit Playground */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl shadow-cyan-950/30 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Single-Qubit Explorer
              </span>
              <span className="text-[11px] font-mono text-slate-400">|ψ⟩ = U|0⟩</span>
            </div>

            {/* Interactive 3D Sphere */}
            <BlochSphere3D
              qubitState={getHeroBlochState()}
              qubitIndex={0}
              label="Qubit q[0]"
              size={240}
              interactive={false}
            />

            {/* Dirac Output Banner */}
            <div className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-xs text-cyan-300 my-3">
              |ψ⟩ = {getHeroDiracNotation()}
            </div>

            {/* Gate Buttons to apply */}
            <div className="w-full flex items-center justify-between gap-1.5">
              {(['I', 'H', 'X', 'Z', 'S'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setHeroGate(g)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                    heroGate === g
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {g} Gate
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Modules Showcase Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Learn Quantum Computing Step by Step
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Use simple explanations and interactive tools to connect quantum theory with hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: IBM Quantum Composer */}
          <div
            onClick={() => onNavigate('composer')}
            className="group p-6 rounded-2xl bg-[#091124] border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                Circuit Composer
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Build multi-qubit circuits, add gates, and inspect how the quantum state changes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Open Composer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 3D Bloch Spheres */}
          <div
            onClick={() => onNavigate('bloch')}
            className="group p-6 rounded-2xl bg-[#091124] border border-indigo-500/20 hover:border-indigo-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                3D Bloch Sphere
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore how a single qubit is represented on the Bloch sphere and see how gates change its state.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-indigo-400">
              <span>Explore Bloch Sphere</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Quantum Code Sandbox */}
          <div
            onClick={() => onNavigate('sandbox')}
            className="group p-6 rounded-2xl bg-[#091124] border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                Quantum Code Playground
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore quantum code examples and understand how common frameworks describe circuits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-400">
              <span>Open Playground</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Algorithm Explorer */}
          <div
            onClick={() => onNavigate('curriculum')}
            className="group p-6 rounded-2xl bg-[#091124] border border-emerald-500/20 hover:border-emerald-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Quantum Algorithm Simulators
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore well-known quantum algorithms and understand the ideas behind each step.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Explore Algorithms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: AI Quantum Copilot */}
          <div
            onClick={onOpenAI}
            className="group p-6 rounded-2xl bg-[#091124] border border-sky-500/20 hover:border-sky-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                AI Tutor
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ask questions about quantum concepts, circuits, and code while you learn.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-sky-400">
              <span>Ask the Tutor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Mastery Quiz & SIH Readiness */}
          <div
            onClick={() => onNavigate('quiz')}
            className="group p-6 rounded-2xl bg-[#091124] border border-amber-500/20 hover:border-amber-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-amber-950/40 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                Practice Quizzes
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Test your understanding with short questions on quantum concepts and notation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400">
              <span>Take a Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
