import React from 'react';
import { 
  Award, CheckCircle2, Circle, TrendingUp, Sliders, 
  Terminal, BookOpen, Clock, Zap, Shield, ArrowRight, Sparkles 
} from 'lucide-react';

interface LearnerDashboardProps {
  onNavigate: (tab: 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz') => void;
}

const SKILL_NODES = [
  { id: '1', title: 'Qubit Basics', status: 'mastered', category: 'Foundations' },
  { id: '2', title: 'Bra-Ket Dirac Math', status: 'mastered', category: 'Math' },
  { id: '3', title: 'Bloch Sphere 3D', status: 'mastered', category: 'Visualization' },
  { id: '4', title: 'Single Qubit Gates', status: 'mastered', category: 'Gates' },
  { id: '5', title: 'Bell State Entanglement', status: 'in-progress', category: 'Entanglement' },
  { id: '6', title: 'Quantum Teleportation', status: 'in-progress', category: 'Protocols' },
  { id: '7', title: 'Deutsch-Jozsa Algorithm', status: 'in-progress', category: 'Algorithms' },
  { id: '8', title: 'Grover Search', status: 'locked', category: 'Algorithms' },
  { id: '9', title: 'Shor Factoring', status: 'locked', category: 'Algorithms' },
  { id: '10', title: 'Surface Codes & QEC', status: 'locked', category: 'Fault Tolerance' },
];

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Top Banner: SIH Competitor Status */}
      <div className="bg-gradient-to-r from-[#09132c] via-[#0d1c44] to-[#121638] border border-cyan-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Smart India Hackathon (SIH) Competitor Track
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Quantum Intelligence Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your conceptual mastery, circuit composition experiments, and quantum algorithmic proficiency.
            </p>
          </div>

          {/* Overall Readiness Score Ring */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-cyan-500/30 p-4 rounded-2xl">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400"
                  strokeDasharray="86, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-bold font-mono text-cyan-300">86%</span>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">SIH Benchmark</div>
              <div className="text-sm font-bold text-slate-100">Senior Physicist</div>
              <div className="text-[10px] text-emerald-400 font-mono">+12% this week</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 pt-6 border-t border-cyan-500/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Circuits Executed</span>
            <span className="text-xl font-bold font-mono text-cyan-400">48 Circuits</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Detector Shots</span>
            <span className="text-xl font-bold font-mono text-indigo-400">128,400</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Quizzes Passed</span>
            <span className="text-xl font-bold font-mono text-purple-400">8 / 10</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Active Study Streak</span>
            <span className="text-xl font-bold font-mono text-amber-400">7 Days 🔥</span>
          </div>
        </div>
      </div>

      {/* Skill Mastery Matrix & Interactive Skill Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Tree Graph */}
        <div className="lg:col-span-8 bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Quantum Skill Tree Progression</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Prerequisite Graph</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Follow the pedagogical path from fundamental linear algebra to fault-tolerant quantum algorithms.
          </p>

          {/* Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {SKILL_NODES.map((node) => {
              const isMastered = node.status === 'mastered';
              const isInProgress = node.status === 'in-progress';

              return (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isMastered
                      ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200 shadow-sm'
                      : isInProgress
                      ? 'bg-cyan-950/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isMastered ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isInProgress ? (
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{node.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {node.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                      isMastered
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : isInProgress
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {node.status.replace('-', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Recent Circuits */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-black/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Quick Action Workbenches
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('composer')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      Circuit Composer
                    </div>
                    <div className="text-[10px] text-slate-400">Design gate circuits</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('bloch')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                      3D Bloch Spheres
                    </div>
                    <div className="text-[10px] text-slate-400">Single qubit trajectories</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('sandbox')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                      Python Sandbox
                    </div>
                    <div className="text-[10px] text-slate-400">Qiskit & Cirq IDE</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('quiz')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      Knowledge Quiz
                    </div>
                    <div className="text-[10px] text-slate-400">Test quantum concepts</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
