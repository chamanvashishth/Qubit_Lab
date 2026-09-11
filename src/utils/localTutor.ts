import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type KnowledgeCard = { keywords: string[]; title: string; answer: string };

const KNOWLEDGE: KnowledgeCard[] = [
  { keywords: ['qubit', 'quantum bit'], title: 'Qubit', answer: 'A qubit is the basic unit of quantum information. Unlike a classical bit, it can be in a superposition of |0⟩ and |1⟩: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.' },
  { keywords: ['superposition'], title: 'Superposition', answer: 'Superposition means a quantum state can be a combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. When measured, you get one classical result with probabilities set by the amplitudes.' },
  { keywords: ['hadamard', 'hadamard gate'], title: 'Hadamard gate', answer: 'The Hadamard gate creates an equal superposition from |0⟩: H|0⟩ = (|0⟩ + |1⟩)/√2. It is one of the most common starting points for quantum circuits.' },
  { keywords: ['cnot', 'controlled not', 'cx gate'], title: 'CNOT', answer: 'CNOT flips the target qubit only when the control qubit is |1⟩. A Hadamard followed by CNOT is the standard simple example for creating a Bell state.' },
  { keywords: ['entanglement', 'entangled'], title: 'Entanglement', answer: 'Entanglement means the joint quantum state cannot be separated into independent states for each qubit. Measuring one qubit can therefore reveal strong correlations with another.' },
  { keywords: ['measurement', 'measure', 'born rule'], title: 'Measurement', answer: 'For a state |ψ⟩ = Σᵢ αᵢ|i⟩, the probability of measuring |i⟩ is |αᵢ|². Measurement turns the quantum state into a classical outcome.' },
  { keywords: ['normalization', 'normalized'], title: 'Normalization', answer: 'A valid quantum state has total probability 1. For n qubits, the probabilities of all 2ⁿ basis states must add up to 1.' },
  { keywords: ['bloch sphere', 'bloch'], title: 'Bloch sphere', answer: 'The Bloch sphere is a geometric way to represent a single-qubit state. Its position captures the qubit’s population balance and relative phase.' },
  { keywords: ['phase', 'relative phase', 'global phase'], title: 'Quantum phase', answer: 'Global phase does not change measurement probabilities. Relative phase does matter because it changes how amplitudes interfere.' },
  { keywords: ['interference'], title: 'Interference', answer: 'Quantum amplitudes can add or cancel because they are complex numbers. Quantum algorithms use this interference to amplify useful outcomes and suppress others.' },
  { keywords: ['no cloning', 'no-cloning'], title: 'No-Cloning Theorem', answer: 'An unknown arbitrary quantum state cannot be copied perfectly. This follows from the linearity of quantum mechanics.' },
  { keywords: ['grover', 'grover algorithm'], title: 'Grover search', answer: 'Grover’s algorithm uses an oracle and amplitude amplification to search an unstructured space in about O(√N) queries.' },
  { keywords: ['shor', 'shor algorithm'], title: 'Shor algorithm', answer: 'Shor’s algorithm uses quantum period finding and the quantum Fourier transform. Its major result is an efficient theoretical approach to integer factoring.' },
  { keywords: ['quantum teleportation', 'teleportation'], title: 'Quantum teleportation', answer: 'Quantum teleportation transfers an unknown quantum state using shared entanglement and two classical bits. It does not copy the original state.' },
  { keywords: ['machine learning', 'ml'], title: 'Machine learning', answer: 'Machine learning finds patterns in data by learning model parameters from examples. A common workflow is prepare data → train → validate → evaluate.' },
  { keywords: ['artificial intelligence', ' ai '], title: 'Artificial intelligence', answer: 'AI is the broader field of building systems that perform tasks such as reasoning, perception, learning or language. Machine learning is one approach within AI.' },
  { keywords: ['neural network', 'neural networks', 'deep learning'], title: 'Neural networks', answer: 'A neural network learns parameters for a sequence of transformations. Training usually adjusts those parameters to reduce a loss using backpropagation and optimization.' },
  { keywords: ['python'], title: 'Python', answer: 'Python is a general-purpose programming language commonly used for automation, data science, machine learning and scientific computing.' },
  { keywords: ['recursion'], title: 'Recursion', answer: 'Recursion solves a problem by solving smaller versions of the same problem. A recursive solution needs a base case and a step that moves toward it.' },
  { keywords: ['big o', 'time complexity', 'space complexity'], title: 'Complexity', answer: 'Big-O describes how resource usage grows with input size. Common examples are O(1), O(log n), O(n), O(n log n) and O(n²).' },
];

const STOP_WORDS = new Set(['what','why','how','does','do','is','are','the','a','an','of','to','for','in','on','and','or','can','i','you','me','explain','tell','about','please','could','would','give','show']);
const tokenize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+\-*/^|⟩⟨]/g, ' ').split(/\s+/).filter((token) => token.length > 1 && !STOP_WORDS.has(token));
const scoreText = (query: string, text: string) => tokenize(query).reduce((score, token) => score + (text.toLowerCase().includes(token) ? (token.length > 5 ? 2 : 1) : 0), 0);
const searchSyllabus = (query: string) => CURRICULUM_TOPICS.map((topic) => ({ topic, score: scoreText(query, `${topic.title} ${topic.tagline} ${topic.description} ${topic.learningObjectives.join(' ')} ${topic.prerequisites.join(' ')}`) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 1);
const searchQuizKnowledge = (query: string) => QUIZ_MOCKS.flatMap((quiz) => quiz.questions.map((question) => ({ quiz, question }))).map((item) => ({ ...item, score: scoreText(query, `${item.question.question} ${item.question.options.join(' ')} ${item.question.explanation}`) })).filter((item) => item.score > 1).sort((a, b) => b.score - a.score).slice(0, 1);

const tryMath = (query: string): string | null => {
  const expression = query.toLowerCase().replace(/what is|calculate|solve|evaluate|equals|=/g, ' ').replace(/times/g, '*').replace(/divided by/g, '/').replace(/plus/g, '+').replace(/minus/g, '-').replace(/to the power of/g, '^').replace(/[^0-9+\-*/().^%\s]/g, '').trim();
  if (!expression || !/[+\-*/^%]/.test(expression) || !/^[-+*/%0-9().\s^]+$/.test(expression)) return null;
  try {
    const safeExpression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)');
    const value = Function(`"use strict"; return (${safeExpression})`)();
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return `The answer is **${Number.isInteger(value) ? value : Number(value.toFixed(8))}**.`;
  } catch { return null; }
};

const circuitExplanation = (circuit?: CircuitState, diracNotation?: string) => {
  if (!circuit) return null;
  const gates = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!gates.length) return `You have ${circuit.numQubits} qubits and no gates yet. Start from |${'0'.repeat(circuit.numQubits)}⟩ and add a gate to see how the state changes.`;
  const gateText = gates.map((gate) => {
    const controls = [gate.controlQubit, gate.controlQubit2].filter((v): v is number => v !== undefined).map((v) => `q[${v}]`).join(', ');
    return `${gate.gate} at step ${gate.step} on q[${gate.targetQubit}]${controls ? ` with control ${controls}` : ''}`;
  }).join('; ');
  return `You’re using ${circuit.numQubits} qubits with ${gates.length} gate operation${gates.length === 1 ? '' : 's'}: ${gateText}.${diracNotation ? ` The current state is |ψ⟩ = ${diracNotation}.` : ''}`;
};

export function answerLocally(query: string): string {
  const clean = query.trim();
  if (!clean) return 'Ask me about a quantum concept, a QubitLab topic, or a simple calculation.';
  const lower = clean.toLowerCase();

  if (/^(hi|hello|hey|yo|good morning|good evening)\b/.test(lower)) return 'Hey! What would you like to learn?';
  if (/^(thanks|thank you|thx)\b/.test(lower)) return 'Anytime. Keep experimenting.';
  if (/^(bye|goodbye|see you)\b/.test(lower)) return 'See you. Keep experimenting with the circuits.';
  if (/(who are you|what are you|your name)/.test(lower)) return 'I’m the QubitLab Guide. Ask me about the concepts and topics covered in the app.';

  const math = tryMath(clean);
  if (math) return math;

  const knowledgeHits = KNOWLEDGE.map((card) => ({ card, score: scoreText(clean, `${card.title} ${card.keywords.join(' ')}`) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  // Prefer a direct concept answer. Do not append unrelated syllabus or related-topic blocks.
  if (knowledgeHits.length) {
    const primary = knowledgeHits[0].card;
    return `### ${primary.title}\n${primary.answer}`;
  }

  const syllabusHits = searchSyllabus(clean);
  if (syllabusHits.length) {
    const top = syllabusHits[0].topic;
    const objectives = top.learningObjectives.slice(0, 3).map((item) => `- ${item}`).join('\n');
    return `### ${top.title}\n${top.description}\n\n**Key points**\n${objectives}`;
  }

  const quizHits = searchQuizKnowledge(clean);
  if (quizHits.length) {
    return `### Quick check\n${quizHits[0].question.question}\n\n${quizHits[0].question.explanation}`;
  }

  if (/(circuit|statevector|gate|bloch|qubit|quantum)/.test(lower)) {
    return 'I don’t have a direct answer for that one yet. Try asking about Hadamard, CNOT, superposition, phase, interference, measurement, entanglement, the Bloch sphere, Grover or teleportation.';
  }

  return 'I don’t have that in my current knowledge base. Try a quantum-computing concept, a QubitLab topic, or a simple calculation.';
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string): string {
  return circuitExplanation(circuit, diracNotation) || 'No circuit context is available.';
}
