import React, { useEffect, useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { AdaptiveHome } from './components/adaptive/AdaptiveHome';
import { CurriculumExplorer } from './components/curriculum/CurriculumExplorer';
import { CircuitComposer } from './components/circuit/CircuitComposer';
import { BlochPlayground } from './components/bloch/BlochPlayground';
import { QuantumCodeSandbox } from './components/sandbox/QuantumCodeSandbox';
import { QuantumQuiz } from './components/quiz/QuantumQuiz';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { AITutorChat } from './components/chat/AITutorChat';
import { CircuitState, QuizQuestion, UserProgress } from './types/quantum';
import { loadProgress, recordQuizScore, toggleTopic } from './utils/progress';
import { AdaptiveState, loadAdaptiveState, saveLearnerProfile, recordQuizResult } from './utils/adaptive';
import { LearnerProfile } from './data/adaptiveLearning';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => typeof window === 'undefined' ? 'home' : (window.sessionStorage.getItem('qubitlab-active-tab') as NavTab | null) || 'home');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatContext, setAiChatContext] = useState('');
  const [externalPrompt, setExternalPrompt] = useState('');
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [adaptive, setAdaptive] = useState<AdaptiveState>(() => loadAdaptiveState());
  const [curriculumTopicId, setCurriculumTopicId] = useState<string | undefined>(() => typeof window === 'undefined' ? undefined : window.sessionStorage.getItem('qubitlab-curriculum-topic') || undefined);
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(() => typeof window === 'undefined' ? undefined : window.sessionStorage.getItem('qubitlab-selected-quiz') || undefined);

  useEffect(() => { window.sessionStorage.setItem('qubitlab-active-tab', activeTab); }, [activeTab]);
  useEffect(() => { if (curriculumTopicId) window.sessionStorage.setItem('qubitlab-curriculum-topic', curriculumTopicId); else window.sessionStorage.removeItem('qubitlab-curriculum-topic'); }, [curriculumTopicId]);
  useEffect(() => { if (selectedQuizId) window.sessionStorage.setItem('qubitlab-selected-quiz', selectedQuizId); else window.sessionStorage.removeItem('qubitlab-selected-quiz'); }, [selectedQuizId]);

  const openAIChatWithPrompt = (prompt: string, contextDescription: string) => { setAiChatContext(contextDescription); setExternalPrompt(prompt); setIsAIChatOpen(true); };
  const handleCircuitAIExplain = (circuit: CircuitState, diracNotation: string) => {
    const prompt = `Please explain the physical quantum operations of this circuit:\n- Number of qubits: ${circuit.numQubits}\n- Gates applied: ${circuit.gates.map((g) => `${g.gate} on q[${g.targetQubit}]${g.controlQubit !== undefined ? ` (ctrl q[${g.controlQubit}])` : ''}`).join(', ')}\n- Resulting statevector Dirac notation: |ψ⟩ = ${diracNotation}\n\nBreak down what happens step-by-step and identify if any entanglement or interference is generated.`;
    openAIChatWithPrompt(prompt, 'Circuit Analysis in Composer');
  };
  const handleCodeAIExplain = (code: string, framework: string) => openAIChatWithPrompt(`Please explain the following ${framework} quantum computing script line-by-line, including how the quantum register is initialized, transformed, and measured:\n\n\`\`\`python\n${code}\n\`\`\``, `Code Explanation (${framework})`);
  const handleCodeAIDebug = (code: string, framework: string) => openAIChatWithPrompt(`Please inspect the following ${framework} quantum code for logical bugs, gate ordering errors, unmeasured wires, or non-unitary operations:\n\n\`\`\`python\n${code}\n\`\`\``, `Code Debugging (${framework})`);
  const handleQuizAIHelp = (question: QuizQuestion) => { const idx = question.correctAnswer ?? question.correctIndex ?? 0; openAIChatWithPrompt(`I am reviewing this quantum quiz question: "${question.question}". Could you provide a physical intuition and mathematical derivation for why the answer is "${question.options[idx]}"?`, 'Quiz Knowledge Check'); };

  return <div className="min-h-screen bg-[#050505] text-zinc-200 flex flex-col font-sans relative overflow-x-hidden template-grid">
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"><div className="orb orb-blue w-[34rem] h-[34rem] -top-56 left-[12%] opacity-45" /><div className="orb orb-orange w-[40rem] h-[40rem] -bottom-72 -right-32 opacity-40" /><div className="orb orb-pink w-20 h-20 top-[42%] right-[9%] opacity-70" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.16)_52%,rgba(0,0,0,.72)_100%)]" /></div>
    <Navbar activeTab={activeTab} onSelectTab={setActiveTab} onOpenAI={() => { setExternalPrompt(''); setAiChatContext('General Quantum Concepts'); setIsAIChatOpen(true); }} />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      {activeTab === 'home' && <AdaptiveHome state={adaptive} onProfile={(profile: LearnerProfile) => setAdaptive(saveLearnerProfile(profile))} onState={setAdaptive} onNavigate={(tab) => setActiveTab(tab)} onOpenAI={() => { setExternalPrompt(''); setAiChatContext('Adaptive Quantum Learning Guide'); setIsAIChatOpen(true); }} />}
      {activeTab === 'curriculum' && <CurriculumExplorer progress={progress} selectedTopicId={curriculumTopicId} onToggleCompleted={(topicId) => setProgress((current) => toggleTopic(current, topicId))} onAskAIExplain={(topic) => openAIChatWithPrompt(`Can you explain the key physics, mathematical formulation, and experimental realization of "${topic}"?`, `Curriculum Topic: ${topic}`)} onOpenQuiz={(quizId) => { setSelectedQuizId(quizId); setActiveTab('quiz'); }} />}
      {activeTab === 'composer' && <CircuitComposer onAskAIExplain={handleCircuitAIExplain} />}
      {activeTab === 'bloch' && <BlochPlayground onAskAI={(prompt) => openAIChatWithPrompt(prompt, '3D Bloch Sphere Geometry')} />}
      {activeTab === 'sandbox' && <QuantumCodeSandbox onAskAIExplain={handleCodeAIExplain} onAskAIDebug={handleCodeAIDebug} />}
      {activeTab === 'quiz' && <QuantumQuiz quizId={selectedQuizId} onSelectQuiz={setSelectedQuizId} onBackToMocks={() => setSelectedQuizId(undefined)} onAskAIForHelp={handleQuizAIHelp} onCompleteQuiz={(score, total, quizId) => { const percentage = total > 0 ? (score / total) * 100 : 0; setProgress((current) => recordQuizScore(current, quizId, percentage)); setAdaptive((current) => recordQuizResult(current, quizId, percentage)); }} />}
      {activeTab === 'dashboard' && <LearnerDashboard progress={progress} adaptive={adaptive} onNavigate={(tab) => setActiveTab(tab)} onOpenTopic={(topicId) => { setCurriculumTopicId(topicId); setActiveTab('curriculum'); }} />}
    </main>
    <AITutorChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} currentContext={aiChatContext} externalPrompt={externalPrompt} />
    <footer className="w-full mt-16 py-8 relative z-10 border-t border-white/10 bg-black/45 backdrop-blur-xl"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#dfff3f] shadow-[0_0_12px_rgba(223,255,63,.75)]" /><span className="text-zinc-200 font-bold">QUBITLAB</span></div><div className="flex items-center gap-6"><button onClick={() => setActiveTab('composer')} className="hover:text-[#dfff3f] transition-colors">Composer</button><button onClick={() => setActiveTab('bloch')} className="hover:text-[#dfff3f] transition-colors">3D Bloch</button><button onClick={() => setActiveTab('sandbox')} className="hover:text-[#dfff3f] transition-colors">Sandbox</button><button onClick={() => setActiveTab('curriculum')} className="hover:text-[#dfff3f] transition-colors">Curriculum</button></div></div></footer>
  </div>;
}
