import React, { useMemo, useState } from 'react';
import { 
  BookOpen, CheckCircle2, Circle, ChevronRight, Sparkles, 
  Clock, Award, Play, Sliders, Layers, Compass, Zap, Shield 
} from 'lucide-react';
import { INITIAL_CURRICULUM } from '../../data/curriculum';
import { CurriculumModule, UserProgress } from '../../types/quantum';
import { FoundationsModule } from './modules/FoundationsModule';
import { ConceptsModule } from './modules/ConceptsModule';
import { MathModule } from './modules/MathModule';
import { AlgorithmsModule } from './modules/AlgorithmsModule';
import { CircuitComposer } from '../circuit/CircuitComposer';

interface CurriculumExplorerProps {
  progress: UserProgress;
  onToggleCompleted: (topicId: string) => void;
  onAskAIExplain?: (topic: string) => void;
  onOpenQuiz?: () => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  progress,
  onToggleCompleted,
  onAskAIExplain,
  onOpenQuiz,
}) => {
  const modules = useMemo<CurriculumModule[]>(() =>
    INITIAL_CURRICULUM.map((module) => ({
      ...module,
      submodules: module.submodules.map((submodule) => ({
        ...submodule,
        completed: progress.completedTopics.includes(submodule.id),
      })),
    })),
    [progress.completedTopics]
  );

  const [selectedModuleId, setSelectedModuleId] = useState<string>(INITIAL_CURRICULUM[0]?.id ?? '');
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState<string>(INITIAL_CURRICULUM[0]?.submodules[0]?.id ?? '');

  const currentModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const currentSubmodule = currentModule.submodules.find((s) => s.id === selectedSubmoduleId) || currentModule.submodules[0];

  const toggleSubmoduleCompleted = (subId: string) => onToggleCompleted(subId);

  const topicFormula = (() => {
    switch (selectedModuleId) {
      case 'mod-foundations':
      case 'mod-concepts':
        return '|ψ⟩ = α|0⟩ + β|1⟩, with |α|² + |β|² = 1';
      case 'mod-gates':
        return 'U†U = I for a unitary quantum gate U';
      case 'mod-math':
        return '⟨ψ|ψ⟩ = 1 for a normalized quantum state';
      case 'mod-algorithms':
        return 'Algorithmic speedups depend on the problem structure and measurement outcome';
      default:
        return null;
    }
  })();

  // Render the interactive laboratory corresponding to the selected topic
  const renderInteractiveLaboratory = () => {
    if (selectedModuleId === 'mod-foundations') {
      return <FoundationsModule />;
    }
    if (selectedModuleId === 'mod-concepts') {
      return <ConceptsModule />;
    }
    if (selectedModuleId === 'mod-gates') {
      return <CircuitComposer />;
    }
    if (selectedModuleId === 'mod-math') {
      return <MathModule />;
    }
    if (selectedModuleId === 'mod-algorithms') {
      return <AlgorithmsModule />;
    }
    // Default fallback to concepts or foundations
    return <FoundationsModule />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Syllabus & Module Tree */}
      <div className="lg:col-span-4 bg-[#0d1117]/60 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm space-y-4 h-fit max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">QUANTUM CURRICULUM</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
            Learning Path
          </span>
        </div>

        {/* Module List */}
        <div className="space-y-3">
          {modules.map((mod, idx) => {
            const isSelected = mod.id === selectedModuleId;
            const completedCount = mod.submodules.filter((s) => s.completed).length;
            const totalCount = mod.submodules.length;

            return (
              <div
                key={mod.id}
                className={`rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#0d1117]/90 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Module Header */}
                <div
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setSelectedSubmoduleId(mod.submodules[0].id);
                  }}
                  className="p-3 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-400 flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono">{mod.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {completedCount}/{totalCount} Completed
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'rotate-90 text-cyan-400' : ''
                    }`}
                  />
                </div>

                {/* Submodule list if module is selected */}
                {isSelected && (
                  <div className="px-3 pb-3 pt-1 space-y-1 border-t border-slate-900">
                    {mod.submodules.map((sub) => {
                      const isSubSelected = sub.id === selectedSubmoduleId;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSubmoduleId(sub.id)}
                          className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSubSelected
                              ? 'bg-cyan-500/15 text-cyan-300 font-medium border border-cyan-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubmoduleCompleted(sub.id);
                              }}
                              className="text-slate-500 hover:text-cyan-400"
                            >
                              {sub.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="truncate">{sub.title}</span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                            {sub.durationMinutes}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning content and practice */}
      <div className="lg:col-span-8 space-y-6">
        {/* Submodule Header Banner */}
        <div className="bg-[#0d1117]/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>{currentModule.title}</span>
                <span>•</span>
                <span className="capitalize">{currentSubmodule.difficulty}</span>
              </div>
              <h2 className="text-xl font-bold text-white font-mono">{currentSubmodule.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSubmoduleCompleted(currentSubmodule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  currentSubmodule.completed
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.25)]'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentSubmodule.completed ? 'Completed' : 'Mark as Done'}
              </button>

              {onAskAIExplain && (
                <button
                  onClick={() => onAskAIExplain(currentSubmodule.title)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.35)] border border-purple-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Tutor
                </button>
              )}
            </div>
          </div>

          {/* Lesson content */}
          <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
            <p>{currentSubmodule.content}</p>

{topicFormula && (
              <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/25 font-mono text-xs text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
                Key idea: {topicFormula}
              </div>
            )}
          </div>

          {/* Practice Quiz Link if available */}
          {currentSubmodule.quiz && currentSubmodule.quiz.length > 0 && onOpenQuiz && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Practice quiz available for this topic ({currentSubmodule.quiz.length} Questions)</span>
              </div>
              <button
                onClick={onOpenQuiz}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>

        {/* Interactive practice */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
              Interactive Practice
            </h3>
            <span className="text-xs text-slate-400 font-mono">Interactive</span>
          </div>

          {renderInteractiveLaboratory()}
        </div>
      </div>
    </div>
  );
};
