import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar, NavTab, Language } from './components/layout/Navbar';
import { LibraryPage } from './components/library/LibraryPage';
import { AdaptiveHome } from './components/adaptive/AdaptiveHome';
import { LandingHero } from './components/landing/LandingHero';
import { CurriculumExplorer } from './components/curriculum/CurriculumExplorer';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { AITutorChat } from './components/chat/AITutorChat';
import { CircuitState, QuizQuestion, UserProgress } from './types/quantum';
import { loadProgress, recordQuizScore, toggleTopic } from './utils/progress';
import { AdaptiveState, getTopicDifficulty, loadAdaptiveState, saveLearnerProfile, recordQuizAnswer, recordQuizResult } from './utils/adaptive';
import { LearnerProfile } from './data/adaptiveLearning';
import { LoadingScreen } from './components/loading/LoadingScreen';

const CircuitComposer = lazy(() => import('./components/circuit/CircuitComposer').then((module) => ({ default: module.CircuitComposer })));
const BlochPlayground = lazy(() => import('./components/bloch/BlochPlayground').then((module) => ({ default: module.BlochPlayground })));
const QuantumCodeSandbox = lazy(() => import('./components/sandbox/QuantumCodeSandbox').then((module) => ({ default: module.QuantumCodeSandbox })));
const QuantumQuiz = lazy(() => import('./components/quiz/QuantumQuiz').then((module) => ({ default: module.QuantumQuiz })));

const NAV_TABS: NavTab[] = ['home', 'progress', 'dashboard', 'library', 'curriculum', 'composer', 'bloch', 'sandbox', 'quiz', 'user'];
const readSession = (key: string) => {
  if (typeof window === 'undefined') return null;
  try { return window.sessionStorage.getItem(key); } catch { return null; }
};
const writeSession = (key: string, value: string | null) => {
  if (typeof window === 'undefined') return;
  try { if (value) window.sessionStorage.setItem(key, value); else window.sessionStorage.removeItem(key); } catch { /* Session storage is optional. */ }
};
const readNavTab = (): NavTab => {
  const value = readSession('qubitlab-active-tab');
  return value && NAV_TABS.includes(value as NavTab) ? value as NavTab : 'home';
};
const pageFallback = <div className="min-h-[320px] flex items-center justify-center text-xs font-mono text-zinc-600">Loading workspace…</div>;

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>(() => readNavTab());
  const [language, setLanguage] = useState<Language>(() => readSession('qubitlab-language') === 'hi' ? 'hi' : 'en');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatContext, setAiChatContext] = useState('');
  const [externalPrompt, setExternalPrompt] = useState('');
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [adaptive, setAdaptive] = useState<AdaptiveState>(() => loadAdaptiveState());
  const [curriculumTopicId, setCurriculumTopicId] = useState<string | undefined>(() => readSession('qubitlab-curriculum-topic') || undefined);
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(() => readSession('qubitlab-selected-quiz') || undefined);

  useEffect(() => { writeSession('qubitlab-active-tab', activeTab); }, [activeTab]);
  useEffect(() => { writeSession('qubitlab-language', language); }, [language]);
  const navigate = (tab: NavTab) => setActiveTab(tab === 'dashboard' ? 'progress' : tab);
  useEffect(() => { writeSession('qubitlab-curriculum-topic', curriculumTopicId ?? null); }, [curriculumTopicId]);
  useEffect(() => { writeSession('qubitlab-selected-quiz', selectedQuizId ?? null); }, [selectedQuizId]);

  const openAIChatWithPrompt = (prompt: string, contextDescription: string) => { setAiChatContext(contextDescription); setExternalPrompt(prompt); setIsAIChatOpen(true); };
  const handleCircuitAIExplain = (circuit: CircuitState, diracNotation: string) => {
    const prompt = `Please explain the physical quantum operations of this circuit:\n- Number of qubits: ${circuit.numQubits}\n- Gates applied: ${circuit.gates.map((g) => `${g.gate} on q[${g.targetQubit}]${g.controlQubit !== undefined ? ` (ctrl q[${g.controlQubit}])` : ''}`).join(', ')}\n- Resulting statevector Dirac notation: |ψ⟩ = ${diracNotation}\n\nBreak down what happens step-by-step and identify if any entanglement or interference is generated.`;
    openAIChatWithPrompt(prompt, 'Circuit Analysis in Composer');
  };
  const handleCodeAIExplain = (code: string, framework: string) => openAIChatWithPrompt(`Please explain the following ${framework} quantum computing script line-by-line, including how the quantum register is initialized, transformed, and measured:\n\n\`\`\`python\n${code}\n\`\`\``, `Code Explanation (${framework})`);
  const handleCodeAIDebug = (code: string, framework: string) => openAIChatWithPrompt(`Please inspect the following ${framework} quantum code for logical bugs, gate ordering errors, unmeasured wires, or non-unitary operations:\n\n\`\`\`python\n${code}\n\`\`\``, `Code Debugging (${framework})`);
  const handleQuizAIHelp = (question: QuizQuestion) => { const idx = question.correctAnswer ?? question.correctIndex ?? 0; openAIChatWithPrompt(`I am reviewing this quantum quiz question: "${question.question}". Could you provide a physical intuition and mathematical derivation for why the answer is "${question.options[idx]}"?`, 'Quiz Knowledge Check'); };

  return <>{showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}<div className="min-h-screen bg-[#050505] text-zinc-200 flex flex-col font-sans relative overflow-x-hidden template-grid">
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"><div className="orb orb-blue w-[34rem] h-[34rem] -top-56 left-[12%] opacity-45" /><div className="orb orb-orange w-[40rem] h-[40rem] -bottom-72 -right-32 opacity-40" /><div className="orb orb-pink w-20 h-20 top-[42%] right-[9%] opacity-70" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.16)_52%,rgba(0,0,0,.72)_100%)]" /></div>
    <Navbar activeTab={activeTab} onSelectTab={navigate} user={null} language={language} onLanguageChange={setLanguage} onOpenAI={() => { setExternalPrompt(''); setAiChatContext('General Quantum Concepts'); setIsAIChatOpen(true); }} />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      <Suspense fallback={pageFallback}>
        {activeTab === 'home' && <LandingHero onNavigate={(tab) => navigate(tab)} onOpenAI={() => { setExternalPrompt(''); setAiChatContext('General Quantum Concepts'); setIsAIChatOpen(true); }} />}
        {activeTab === 'curriculum' && <CurriculumExplorer progress={progress} selectedTopicId={curriculumTopicId} onToggleCompleted={(topicId) => setProgress((current) => toggleTopic(current, topicId))} onAskAIExplain={(topic) => openAIChatWithPrompt(`Can you explain the key physics, mathematical formulation, and experimental realization of "${topic}"?`, `Curriculum Topic: ${topic}`)} onOpenQuiz={(quizId) => { setSelectedQuizId(quizId); setActiveTab('quiz'); }} />}
        {activeTab === 'composer' && <CircuitComposer onAskAIExplain={handleCircuitAIExplain} />}
        {activeTab === 'bloch' && <BlochPlayground onAskAI={(prompt) => openAIChatWithPrompt(prompt, '3D Bloch Sphere Geometry')} />}
        {activeTab === 'sandbox' && <QuantumCodeSandbox onAskAIExplain={handleCodeAIExplain} onAskAIDebug={handleCodeAIDebug} />}
        {activeTab === 'quiz' && <QuantumQuiz quizId={selectedQuizId} onSelectQuiz={setSelectedQuizId} onBackToMocks={() => setSelectedQuizId(undefined)} onAskAIForHelp={handleQuizAIHelp} onCompleteQuiz={(score, total, quizId) => { const percentage = total > 0 ? (score / total) * 100 : 0; setProgress((current) => recordQuizScore(current, quizId, percentage)); setAdaptive((current) => recordQuizResult(current, quizId, percentage)); }} onAnswer={(quizId, questionId, correct) => setAdaptive((current) => recordQuizAnswer(current, quizId, questionId, correct))} difficultyLevel={getTopicDifficulty(adaptive, selectedQuizId ?? 'foundations')} />}
        {(activeTab === 'progress' || activeTab === 'dashboard') && <LearnerDashboard progress={progress} adaptive={adaptive} onNavigate={(tab) => navigate(tab)} onOpenTopic={(topicId) => { setCurriculumTopicId(topicId); setActiveTab('curriculum'); }} />}
        {activeTab === 'library' && <LibraryPage onNavigate={(tab) => navigate(tab)} />}
              </Suspense>
    </main>
    <AITutorChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} currentContext={aiChatContext} externalPrompt={externalPrompt} />
    <footer className="w-full mt-16 py-8 relative z-10 border-t border-white/10 bg-black/45 backdrop-blur-xl"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#dfff3f] shadow-[0_0_12px_rgba(223,255,63,.75)]" /><span className="text-zinc-200 font-bold">QUBITLAB</span></div><div className="flex items-center gap-6"><button onClick={() => setActiveTab('composer')} className="hover:text-[#dfff3f] transition-colors">Composer</button><button onClick={() => setActiveTab('bloch')} className="hover:text-[#dfff3f] transition-colors">3D Bloch</button><button onClick={() => setActiveTab('sandbox')} className="hover:text-[#dfff3f] transition-colors">Sandbox</button><button onClick={() => setActiveTab('curriculum')} className="hover:text-[#dfff3f] transition-colors">Curriculum</button></div></div></footer>
  </div></>;
}
