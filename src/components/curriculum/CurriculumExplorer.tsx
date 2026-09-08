import React, { useEffect, useMemo, useState } from 'react';
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
  selectedTopicId?: string;
  onToggleCompleted: (topicId: string) => void;
  onAskAIExplain?: (topic: string) => void;
  onOpenQuiz?: (quizId: string) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  progress,
  selectedTopicId,
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

  useEffect(() => {
    if (!selectedTopicId) return;
    const module = INITIAL_CURRICULUM.find((item) => item.submodules.some((topic) => topic.id === selectedTopicId));
    if (!module) return;
    setSelectedModuleId(module.id);
    setSelectedSubmoduleId(selectedTopicId);
  }, [selectedTopicId]);

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

  const quizIdByModule: Record<string, string> = {
    'mod-foundations': 'foundations',
    'mod-concepts': 'concepts',
    'mod-gates': 'gates',
    'mod-math': 'math',
    'mod-algorithms': 'algorithms',
  };

  const currentQuizId = quizIdByModule[selectedModuleId];

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
      <div className="lg:col-span-4 bg-white/[.05] border border-white/10 rounded-xl p-4 shadow-xl backdrop-blur-sm space-y-4 h-fit max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#dfff3f]" />
            <h3 className="text-sm font-bold text-zinc-100 font-mono">QUANTUM CURRICULUM</h3>
          </div>
          <span className="text-[10px] font-mono text-[#e9ff8a] bg-[#dfff3f]/15 px-2 py-0.5 rounded border border-[#dfff3f]/30">
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
                    ? 'bg-white/[.06] border-[#dfff3f]/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-white/[.05]/40 border-white/10 hover:border-white/15'
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
                    <span className="w-5 h-5 rounded bg-white/[.05] border border-white/10 font-mono text-[11px] text-[#dfff3f] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 font-mono">{mod.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {completedCount}/{totalCount} Completed
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      isSelected ? 'rotate-90 text-[#dfff3f]' : ''
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
                              ? 'bg-[#dfff3f]/15 text-[#e9ff8a] font-medium border border-[#dfff3f]/30'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[.05]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubmoduleCompleted(sub.id);
                              }}
                              className="text-zinc-500 hover:text-[#dfff3f]"
                            >
                              {sub.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Circle className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="truncate">{sub.title}</span>
                          </div>

                          <span className="text-[10px] font-mono text-zinc-500 shrink-0 ml-2">
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
        <div className="bg-white/[.05] border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#dfff3f] mb-1">
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
                    : 'bg-white/[.05] text-zinc-300 border-white/15 hover:border-slate-600'
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
          <div className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 font-sans">
            <p>{currentSubmodule.content}</p>

{topicFormula && (
              <div className="p-3 rounded-lg bg-black/45 border border-[#dfff3f]/25 font-mono text-xs text-[#e9ff8a] shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
                Key idea: {topicFormula}
              </div>
            )}
          </div>

          {/* Module practice mock */}
          {currentQuizId && onOpenQuiz && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Practice mock available for this module (10 MCQs)</span>
              </div>
              <button
                onClick={() => onOpenQuiz(currentQuizId)}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
              >
                Start Mock
              </button>
            </div>
          )}
        </div>

        {/* Interactive practice */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
              Interactive Practice
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Interactive</span>
          </div>

          {renderInteractiveLaboratory()}
        </div>
      </div>
    </div>
  );
};
