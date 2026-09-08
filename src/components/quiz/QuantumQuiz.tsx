import React, { useEffect, useMemo, useState } from 'react';
import {
  HelpCircle, CheckCircle2, XCircle, RotateCcw,
  Award, Sparkles, BookOpen, ChevronRight, ArrowLeft
} from 'lucide-react';
import { QuizQuestion } from '../../types/quantum';
import { QUIZ_MOCKS, getQuizMock } from '../../data/mockQuizzes';

interface QuizAttempt {
  currentIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  score: number;
  isFinished: boolean;
}

interface QuantumQuizProps {
  quizId?: string;
  onSelectQuiz?: (quizId: string) => void;
  onBackToMocks?: () => void;
  onCompleteQuiz?: (score: number, total: number, quizId: string) => void;
  onAskAIForHelp?: (question: QuizQuestion) => void;
}

const emptyAttempt: QuizAttempt = {
  currentIndex: 0,
  selectedOption: null,
  isAnswered: false,
  score: 0,
  isFinished: false,
};

const storageKey = (id: string) => `qubitlab-quiz-attempt:${id}`;

const loadAttempt = (id: string): QuizAttempt => {
  try {
    const raw = window.sessionStorage.getItem(storageKey(id));
    if (!raw) return { ...emptyAttempt };
    return { ...emptyAttempt, ...JSON.parse(raw) };
  } catch {
    return { ...emptyAttempt };
  }
};

export const QuantumQuiz: React.FC<QuantumQuizProps> = ({
  quizId,
  onSelectQuiz,
  onBackToMocks,
  onCompleteQuiz,
  onAskAIForHelp,
}) => {
  const mock = useMemo(() => getQuizMock(quizId), [quizId]);

  const [attempt, setAttempt] = useState<QuizAttempt>(() =>
    quizId ? loadAttempt(quizId) : { ...emptyAttempt }
  );

  useEffect(() => {
    setAttempt(quizId ? loadAttempt(quizId) : { ...emptyAttempt });
  }, [quizId]);

  useEffect(() => {
    if (!quizId || typeof window === 'undefined') return;
    window.sessionStorage.setItem(storageKey(quizId), JSON.stringify(attempt));
  }, [quizId, attempt]);

  if (!mock) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-[#dfff3f]/10 border border-[#dfff3f]/30 text-[#e9ff8a]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">Choose a Practice Mock</h2>
          <p className="text-sm text-zinc-400">Each mock contains exactly 10 multiple-choice questions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_MOCKS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectQuiz?.(item.id)}
              className="text-left p-5 rounded-2xl bg-white/[.06] border border-white/10 hover:border-[#dfff3f]/50 hover:bg-white/[.05] transition-all group"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-[#e9ff8a] bg-[#dfff3f]/10 border border-[#dfff3f]/20 px-2 py-1 rounded">10 MCQs</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">{item.title}</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.description}</p>
              <div className="mt-4 text-xs text-[#dfff3f] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Start mock <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const questions = mock.questions;
  const currentQ = questions[attempt.currentIndex];
  const correctIndex = currentQ.correctAnswer ?? currentQ.correctIndex ?? 0;

  const updateAttempt = (patch: Partial<QuizAttempt>) =>
    setAttempt((current) => ({ ...current, ...patch }));

  const handleConfirmAnswer = () => {
    if (attempt.selectedOption === null || attempt.isAnswered) return;
    updateAttempt({
      isAnswered: true,
      score: attempt.score + (attempt.selectedOption === correctIndex ? 1 : 0),
    });
  };

  const handleNext = () => {
    if (attempt.currentIndex + 1 < questions.length) {
      updateAttempt({
        currentIndex: attempt.currentIndex + 1,
        selectedOption: null,
        isAnswered: false,
      });
      return;
    }

    updateAttempt({ isFinished: true });
    onCompleteQuiz?.(attempt.score, questions.length, mock.id);
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(storageKey(mock.id));
    setAttempt({ ...emptyAttempt });
  };

  if (attempt.isFinished) {
    const percentage = Math.round((attempt.score / questions.length) * 100);
    return (
      <div className="bg-white/[.06] border border-white/10 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-2xl space-y-5">
        <Award className="w-10 h-10 text-amber-400 mx-auto" />
        <div>
          <h3 className="text-xl font-bold text-zinc-100">{mock.title} Results</h3>
          <p className="text-xs text-zinc-400 mt-1">Your result is available for this browser session.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-black/55 border border-white/10">
            <div className="text-2xl font-bold text-[#dfff3f]">{attempt.score}/{questions.length}</div>
            <div className="text-[11px] text-zinc-400">Correct</div>
          </div>
          <div className="p-4 rounded-xl bg-black/55 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{percentage}%</div>
            <div className="text-[11px] text-zinc-400">Score</div>
          </div>
        </div>
        <p className="text-xs text-zinc-300">
          {percentage >= 80 ? 'Strong result. Continue to the next mock or revisit concepts you want to strengthen.' : 'Review the explanations, then retry when you are ready.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={handleRestart} className="px-5 py-2.5 rounded-lg bg-[#dfff3f] hover:bg-[#efff96] text-slate-950 font-bold text-xs flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={onBackToMocks} className="px-5 py-2.5 rounded-lg bg-white/[.05] border border-white/15 hover:border-slate-500 text-zinc-200 font-bold text-xs">
            All Mocks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/[.045] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <button onClick={onBackToMocks} className="text-[11px] text-zinc-400 hover:text-[#e9ff8a] flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> All mocks
          </button>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#dfff3f]" />
            <span className="text-xs font-bold text-zinc-200">{mock.title}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-[#e9ff8a]">Question {attempt.currentIndex + 1}/{questions.length}</div>
          <div className="text-[11px] text-zinc-400">Score: {attempt.score}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-zinc-100 leading-snug">{currentQ.question}</h3>
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const selected = attempt.selectedOption === idx;
            const correct = idx === correctIndex;
            const style = attempt.isAnswered
              ? correct
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                : selected
                ? 'border-rose-500 bg-rose-500/10 text-rose-200'
                : 'border-white/10 bg-white/[.05] text-zinc-400'
              : selected
              ? 'border-[#e9ff8a] bg-[#dfff3f]/10 text-cyan-100'
              : 'border-white/10 bg-white/[.05] text-zinc-300 hover:border-white/15';

            return (
              <button
                key={idx}
                disabled={attempt.isAnswered}
                onClick={() => !attempt.isAnswered && updateAttempt({ selectedOption: idx })}
                className={`w-full p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${style}`}
              >
                <span className="w-6 h-6 rounded border border-white/15 flex items-center justify-center text-[11px] shrink-0">{String.fromCharCode(65 + idx)}</span>
                <span className="text-xs leading-relaxed">{opt}</span>
                {attempt.isAnswered && correct && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-400" />}
                {attempt.isAnswered && selected && !correct && <XCircle className="w-4 h-4 ml-auto text-rose-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {attempt.isAnswered && (
        <div className="p-4 rounded-xl bg-black/55 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[#e9ff8a] flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Explanation</span>
            <button onClick={() => onAskAIForHelp?.(currentQ)} className="text-[11px] text-purple-300 hover:underline">Explain further</button>
          </div>
          <p className="text-zinc-300 leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-zinc-500">Your current attempt survives reloads in this browser session.</span>
        {!attempt.isAnswered ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={attempt.selectedOption === null}
            className="px-5 py-2 rounded-lg bg-[#dfff3f] hover:bg-[#efff96] text-slate-950 font-bold text-xs disabled:opacity-40"
          >Check Answer</button>
        ) : (
          <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#dfff3f] to-[#f4a81d] text-slate-950 font-bold text-xs flex items-center gap-1.5">
            {attempt.currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};