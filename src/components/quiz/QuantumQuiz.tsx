import React, { useState } from 'react';
import { 
  HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  Award, Sparkles, BookOpen, ChevronRight 
} from 'lucide-react';
import { QuizQuestion } from '../../types/quantum';
import { INITIAL_CURRICULUM } from '../../data/curriculum';

interface QuantumQuizProps {
  onCompleteQuiz?: (score: number, total: number) => void;
  onAskAIForHelp?: (question: QuizQuestion) => void;
}

export const QuantumQuiz: React.FC<QuantumQuizProps> = ({
  onCompleteQuiz,
  onAskAIForHelp,
}) => {
  // Collect all questions across curriculum
  const allQuestions: QuizQuestion[] = INITIAL_CURRICULUM.flatMap((m) =>
    m.submodules.flatMap((s) => s.quiz || [])
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = allQuestions[currentIndex] || allQuestions[0];

  const correctIndex = currentQ.correctAnswer ?? currentQ.correctIndex ?? 0;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    if (selectedOption === correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < allQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (onCompleteQuiz) {
        onCompleteQuiz(score + (selectedOption === correctIndex ? 1 : 0), allQuestions.length);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / allQuestions.length) * 100);
    return (
      <div className="bg-[#0d1117]/80 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-sm space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.25)]">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-100 font-mono">QUANTUM MASTERY REPORT</h3>
          <p className="text-xs text-slate-400 mt-1">Smart India Hackathon (SIH) Quantum Readiness Assessment</p>
        </div>

        <div className="p-6 rounded-xl bg-[#05070a] border border-slate-800 flex items-center justify-around">
          <div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">{score} / {allQuestions.length}</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Correct Answers</div>
          </div>
          <div className="w-[1px] h-12 bg-slate-800" />
          <div>
            <div className="text-3xl font-extrabold text-purple-400 font-mono">{percentage}%</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Proficiency Grade</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {percentage >= 80
            ? "Outstanding work! You have demonstrated advanced intuition in Hilbert spaces, quantum algorithms, and gate unitaries."
            : "Good effort! Review the interactive Bloch spheres and algorithm simulations to solidify your quantum foundation."}
        </p>

        <button
          onClick={handleRestart}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#0d1117]/60 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm space-y-6">
      {/* Progress & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 font-mono">
            QUESTION {currentIndex + 1} OF {allQuestions.length}
          </span>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded border border-cyan-500/30">
          Score: {score}
        </span>
      </div>

      {/* Question text */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-100 leading-snug font-mono">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === correctIndex;

            let borderStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
            if (isAnswered) {
              if (isCorrect) {
                borderStyle = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.25)]';
              } else if (isSelected) {
                borderStyle = 'border-rose-500/80 bg-rose-500/15 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.25)]';
              }
            } else if (isSelected) {
              borderStyle = 'border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]';
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${borderStyle}`}
              >
                <div className="flex items-center gap-3 text-xs leading-relaxed">
                  <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 font-mono text-xs flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation banner on submit */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-[#05070a] border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Physical & Mathematical Explanation
            </span>
            {onAskAIForHelp && (
              <button
                onClick={() => onAskAIForHelp(currentQ)}
                className="text-[11px] text-purple-300 hover:underline flex items-center gap-1 font-mono"
              >
                Ask AI Tutor to elaborate
              </button>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Action footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400 font-mono">
          Select an option and verify with unitary principles
        </span>

        {!isAnswered ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOption === null}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] active:scale-95 font-mono"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] active:scale-95 font-mono"
          >
            <span>{currentIndex + 1 < allQuestions.length ? 'Next Question' : 'View Final Results'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
