import React, { useMemo } from 'react';
import {
  Award, CheckCircle2, Circle, TrendingUp, Sliders,
  Terminal, BookOpen, Zap, ArrowRight, Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { INITIAL_CURRICULUM } from '../../data/curriculum';
import { UserProgress } from '../../types/quantum';

type AppTab = 'dashboard' | 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz';

interface LearnerDashboardProps {
  progress: UserProgress;
  onNavigate: (tab: AppTab) => void;
  onOpenTopic: (topicId: string) => void;
}

const QUICK_ACTIONS: { tab: Exclude<AppTab, 'dashboard' | 'curriculum'>; icon: LucideIcon; title: string; description: string; color: string }[] = [
  { tab: 'composer', icon: Sliders, title: 'Circuit Composer', description: 'Build and simulate circuits', color: 'text-cyan-400' },
  { tab: 'bloch', icon: Award, title: 'Bloch Sphere', description: 'Explore single-qubit states', color: 'text-indigo-400' },
  { tab: 'sandbox', icon: Terminal, title: 'Code Examples', description: 'Compare quantum SDK syntax', color: 'text-purple-400' },
  { tab: 'quiz', icon: BookOpen, title: 'Quiz', description: 'Check your understanding', color: 'text-amber-400' },
];

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ progress, onNavigate, onOpenTopic }) => {
  const nodes = useMemo(
    () => INITIAL_CURRICULUM.flatMap((module) =>
      module.submodules.map((topic) => ({
        id: topic.id,
        title: topic.title,
        category: module.title,
        completed: progress.completedTopics.includes(topic.id),
      }))
    ),
    [progress.completedTopics]
  );

  const completedCount = nodes.filter((node) => node.completed).length;
  const totalCount = nodes.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextId = nodes.find((node) => !node.completed)?.id;
  const quizScores = Object.values(progress.quizScores);
  const bestQuiz = quizScores.length ? Math.max(...quizScores) : 0;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#09132c] via-[#0d1c44] to-[#121638] border border-cyan-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Your Progress
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Place to Learn</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your progress is saved in this browser. Complete topics, take quizzes, and the dashboard updates automatically.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-cyan-500/30 p-4 rounded-2xl">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-label={`${progressPercent}% curriculum complete`}>
                <path className="text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyan-400" strokeDasharray={`${progressPercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-sm font-bold font-mono text-cyan-300">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">Curriculum</div>
              <div className="text-sm font-bold text-slate-100">{completedCount} of {totalCount} complete</div>
              <div className="text-[10px] text-emerald-400 font-mono">{nextId ? 'Next topic is ready' : 'Learning path complete'}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-cyan-500/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Topics completed</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{completedCount}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Quiz best</span>
            <span className="text-xl font-bold font-mono text-indigo-400">{bestQuiz}%</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">XP</span>
            <span className="text-xl font-bold font-mono text-purple-400">{progress.xp}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block">Current level</span>
            <span className="text-sm font-bold text-amber-400">{progress.currentLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Quantum Learning Path</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{completedCount}/{totalCount}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {nodes.map((node) => {
              const isNext = node.id === nextId;
              return (
                <button
                  key={node.id}
                  onClick={() => onOpenTopic(node.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    node.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : isNext
                      ? 'bg-cyan-950/30 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {node.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className={`w-4 h-4 shrink-0 ${isNext ? 'text-cyan-400' : 'text-slate-600'}`} />}
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{node.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{node.category}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    node.completed ? 'bg-emerald-500/15 text-emerald-400' : isNext ? 'bg-cyan-500/15 text-cyan-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {node.completed ? 'done' : isNext ? 'next' : 'available'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-black/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> Start exploring</h3>
            <div className="space-y-2.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.tab} onClick={() => onNavigate(action.tab)} className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${action.color}`} />
                      <div><div className="text-xs font-bold text-slate-200">{action.title}</div><div className="text-[10px] text-slate-400">{action.description}</div></div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
