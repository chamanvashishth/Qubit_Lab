import React, { useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { LandingHero } from './components/landing/LandingHero';
import { CurriculumExplorer } from './components/curriculum/CurriculumExplorer';
import { CircuitComposer } from './components/circuit/CircuitComposer';
import { BlochPlayground } from './components/bloch/BlochPlayground';
import { QuantumCodeSandbox } from './components/sandbox/QuantumCodeSandbox';
import { QuantumQuiz } from './components/quiz/QuantumQuiz';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { AITutorChat } from './components/chat/AITutorChat';
import { Atom, Sparkles, Terminal, BookOpen, Sliders, Layers } from 'lucide-react';
import { CircuitState, QuizQuestion, UserProgress } from './types/quantum';
import { loadProgress, recordQuizScore, toggleTopic } from './utils/progress';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [aiChatContext, setAiChatContext] = useState<string>('');
  const [externalPrompt, setExternalPrompt] = useState<string>('');
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [curriculumTopicId, setCurriculumTopicId] = useState<string | undefined>();

  const openAIChatWithPrompt = (prompt: string, contextDescription: string) => {
    setAiChatContext(contextDescription);
    setExternalPrompt(prompt);
    setIsAIChatOpen(true);
  };

  const handleCircuitAIExplain = (circuit: CircuitState, diracNotation: string) => {
    const prompt = `Please explain the physical quantum operations of this circuit:\n` +
      `- Number of qubits: ${circuit.numQubits}\n` +
      `- Gates applied: ${circuit.gates.map((g) => `${g.gate} on q[${g.targetQubit}]${g.controlQubit !== undefined ? ` (ctrl q[${g.controlQubit}])` : ''}`).join(', ')}\n` +
      `- Resulting statevector Dirac notation: |ψ⟩ = ${diracNotation}\n\n` +
      `Break down what happens step-by-step and identify if any entanglement or interference is generated.`;
    openAIChatWithPrompt(prompt, 'Circuit Analysis in Composer');
  };

  const handleCodeAIExplain = (code: string, framework: string) => {
    const prompt = `Please explain the following ${framework} quantum computing script line-by-line, including how the quantum register is initialized, transformed, and measured:\n\n\`\`\`python\n${code}\n\`\`\``;
    openAIChatWithPrompt(prompt, `Code Explanation (${framework})`);
  };

  const handleCodeAIDebug = (code: string, framework: string) => {
    const prompt = `Please inspect the following ${framework} quantum code for logical bugs, gate ordering errors, unmeasured wires, or non-unitary operations:\n\n\`\`\`python\n${code}\n\`\`\``;
    openAIChatWithPrompt(prompt, `Code Debugging (${framework})`);
  };

  const handleQuizAIHelp = (question: QuizQuestion) => {
    const idx = question.correctAnswer ?? question.correctIndex ?? 0;
    const prompt = `I am reviewing this quantum quiz question: "${question.question}". Could you provide a physical intuition and mathematical derivation for why the answer is "${question.options[idx]}"?`;
    openAIChatWithPrompt(prompt, 'Quiz Knowledge Check');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative">
      {/* Background radial dot grid overlay for Immersive UI */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAI={() => {
          setExternalPrompt('');
          setAiChatContext('General Quantum Concepts');
          setIsAIChatOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'home' && (
          <LandingHero
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAI={() => {
              setExternalPrompt('');
              setAiChatContext('General Quantum Inquiry');
              setIsAIChatOpen(true);
            }}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumExplorer
            progress={progress}
            selectedTopicId={curriculumTopicId}
            onToggleCompleted={(topicId) => setProgress((current) => toggleTopic(current, topicId))}
            onAskAIExplain={(topic) => {
              openAIChatWithPrompt(
                `Can you explain the key physics, mathematical formulation, and experimental realization of "${topic}"?`,
                `Curriculum Topic: ${topic}`
              );
            }}
            onOpenQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'composer' && (
          <CircuitComposer onAskAIExplain={handleCircuitAIExplain} />
        )}

        {activeTab === 'bloch' && (
          <BlochPlayground
            onAskAI={(prompt) => openAIChatWithPrompt(prompt, '3D Bloch Sphere Geometry')}
          />
        )}

        {activeTab === 'sandbox' && (
          <QuantumCodeSandbox
            onAskAIExplain={handleCodeAIExplain}
            onAskAIDebug={handleCodeAIDebug}
          />
        )}

        {activeTab === 'quiz' && (
          <QuantumQuiz
            onAskAIForHelp={handleQuizAIHelp}
            onCompleteQuiz={(score, total) => {
              const percentage = total > 0 ? (score / total) * 100 : 0;
              setProgress((current) => recordQuizScore(current, 'overall', percentage));
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <LearnerDashboard
            progress={progress}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenTopic={(topicId) => {
              setCurriculumTopicId(topicId);
              setActiveTab('curriculum');
            }}
          />
        )}
      </main>

      {/* AI Tutor Chat Drawer */}
      <AITutorChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentContext={aiChatContext}
        externalPrompt={externalPrompt}
      />

      {/* Footer */}
      <footer className="w-full bg-[#05070a] border-t border-slate-800 mt-16 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <span className="text-slate-200 font-bold">QUANTUM.LAB</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('composer')}
              className="hover:text-cyan-300 transition-colors"
            >
              Composer
            </button>
            <button
              onClick={() => setActiveTab('bloch')}
              className="hover:text-cyan-300 transition-colors"
            >
              3D Bloch
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className="hover:text-cyan-300 transition-colors"
            >
              Sandbox
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className="hover:text-cyan-300 transition-colors"
            >
              Curriculum
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
