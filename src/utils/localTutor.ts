import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type KnowledgeCard = { keywords: string[]; title: string; answer: string };

const KNOWLEDGE: KnowledgeCard[] = [
  { keywords: ['qubit', 'quantum bit'], title: 'Qubit', answer: 'A qubit is a two-level quantum system. Its pure state can be written |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1. Measurement produces a classical result, while the amplitudes determine the probabilities.' },
  { keywords: ['superposition'], title: 'Superposition', answer: 'Superposition means a quantum state is a linear combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. It does not mean that a measurement literally returns both values at once.' },
  { keywords: ['hadamard', 'hadamard gate'], title: 'Hadamard gate', answer: 'The Hadamard gate maps |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ − |1⟩)/√2. It is commonly used to create superposition and enable interference.' },
  { keywords: ['cnot', 'controlled not', 'cx gate'], title: 'CNOT', answer: 'CNOT flips the target qubit only when the control qubit is |1⟩. Starting from |00⟩, H on the control followed by CNOT produces (|00⟩ + |11⟩)/√2.' },
  { keywords: ['entanglement', 'entangled'], title: 'Entanglement', answer: 'Entanglement is a property of a joint quantum state that cannot be represented as a product of independent single-qubit states. It produces strong correlations, but does not permit faster-than-light signalling.' },
  { keywords: ['measurement', 'measure', 'born rule'], title: 'Measurement', answer: 'For |ψ⟩ = Σᵢ αᵢ|i⟩, the Born rule assigns probability |αᵢ|² to outcome |i⟩. An ideal measurement updates the state according to the observed outcome.' },
  { keywords: ['normalization', 'normalized'], title: 'Normalization', answer: 'A valid pure quantum state has total probability one. For one qubit, |α|² + |β|² = 1. For n qubits, the probabilities of all 2ⁿ basis states sum to one.' },
  { keywords: ['bloch sphere', 'bloch'], title: 'Bloch sphere', answer: 'A single-qubit pure state can be represented by a point on the Bloch sphere. Polar angle controls the population balance and azimuthal angle represents relative phase. Mixed states lie inside the sphere.' },
  { keywords: ['phase', 'relative phase', 'global phase'], title: 'Quantum phase', answer: 'Global phase does not affect measurement probabilities, while relative phase affects interference. Z, S, T and rotation gates are commonly used to control phase relationships.' },
  { keywords: ['interference'], title: 'Interference', answer: 'Quantum amplitudes are complex numbers, so computational paths can add constructively or destructively. Quantum algorithms use this to increase useful amplitudes and suppress others.' },
  { keywords: ['no cloning', 'no-cloning'], title: 'No-Cloning Theorem', answer: 'An unknown arbitrary quantum state cannot be copied perfectly by a physical quantum operation. The result follows from linearity and preservation of inner products.' },
  { keywords: ['grover', 'grover algorithm'], title: 'Grover search', answer: 'Grover search combines an oracle with amplitude amplification. For an unstructured search space of N items, the ideal black-box query complexity is O(√N).' },
  { keywords: ['shor', 'shor algorithm'], title: 'Shor algorithm', answer: 'Shor’s algorithm reduces factoring to period finding and uses the quantum Fourier transform. Its theoretical importance is polynomial-time quantum factoring in the appropriate computational model.' },
  { keywords: ['quantum teleportation', 'teleportation'], title: 'Quantum teleportation', answer: 'Quantum teleportation transfers an unknown quantum state using shared entanglement and two classical bits. The original state is consumed by measurement; it is not copied.' },
  { keywords: ['machine learning', 'ml'], title: 'Machine learning', answer: 'Machine learning learns patterns from data. A typical pipeline is data preparation → model selection → training → validation/testing → evaluation and deployment.' },
  { keywords: ['artificial intelligence', ' ai '], title: 'Artificial intelligence', answer: 'Artificial intelligence is the broader field of building systems for tasks involving reasoning, perception, learning, planning or language. Machine learning is one major approach within AI.' },
  { keywords: ['neural network', 'neural networks', 'deep learning'], title: 'Neural networks', answer: 'A neural network composes parameterized transformations with nonlinearities. Training adjusts parameters to reduce a loss function, commonly with backpropagation and gradient-based optimization.' },
  { keywords: ['python'], title: 'Python', answer: 'Python is a high-level general-purpose language widely used for automation, data science, machine learning and scientific computing.' },
  { keywords: ['recursion'], title: 'Recursion', answer: 'Recursion solves a problem through smaller instances of the same problem. A correct recursive solution needs a base case and a step that progresses toward it.' },
  { keywords: ['big o', 'time complexity', 'space complexity'], title: 'Complexity', answer: 'Big-O describes asymptotic resource growth. O(1) is constant, O(log n) logarithmic, O(n) linear, O(n log n) common for efficient sorting, and O(n²) quadratic.' },
];

const STOP_WORDS = new Set(['what','why','how','does','do','is','are','the','a','an','of','to','for','in','on','and','or','can','i','you','me','explain','tell','about','please']);
const tokenize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+\-*/^|⟩⟨]/g, ' ').split(/\s+/).filter((token) => token.length > 1 && !STOP_WORDS.has(token));
const scoreText = (query: string, text: string) => tokenize(query).reduce((score, token) => score + (text.toLowerCase().includes(token) ? (token.length > 5 ? 2 : 1) : 0), 0);
const searchSyllabus = (query: string) => CURRICULUM_TOPICS.map((topic) => ({ topic, score: scoreText(query, `${topic.title} ${topic.tagline} ${topic.description} ${topic.learningObjectives.join(' ')} ${topic.prerequisites.join(' ')}`) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
const searchQuizKnowledge = (query: string) => QUIZ_MOCKS.flatMap((quiz) => quiz.questions.map((question) => ({ quiz, question }))).map((item) => ({ ...item, score: scoreText(query, `${item.question.question} ${item.question.options.join(' ')} ${item.question.explanation}`) })).filter((item) => item.score > 1).sort((a, b) => b.score - a.score).slice(0, 2);

const tryMath = (query: string): string | null => {
  const expression = query.toLowerCase().replace(/what is|calculate|solve|evaluate|equals|=/g, ' ').replace(/times/g, '*').replace(/divided by/g, '/').replace(/plus/g, '+').replace(/minus/g, '-').replace(/to the power of/g, '^').replace(/[^0-9+\-*/().^%\s]/g, '').trim();
  if (!expression || !/[+\-*/^%]/.test(expression) || !/^[-+*/%0-9().\s^]+$/.test(expression)) return null;
  try {
    const safeExpression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)');
    const value = Function(`"use strict"; return (${safeExpression})`)();
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return `The result is **${Number.isInteger(value) ? value : Number(value.toFixed(8))}**.`;
  } catch { return null; }
};

const circuitExplanation = (circuit?: CircuitState, diracNotation?: string) => {
  if (!circuit) return null;
  const gates = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!gates.length) return `The current circuit has ${circuit.numQubits} qubits and no gates. Start from |${'0'.repeat(circuit.numQubits)}⟩ and place a gate to see the state change.`;
  const gateText = gates.map((gate) => {
    const controls = [gate.controlQubit, gate.controlQubit2].filter((v): v is number => v !== undefined).map((v) => `q[${v}]`).join(', ');
    return `${gate.gate} at step ${gate.step} on q[${gate.targetQubit}]${controls ? ` with control ${controls}` : ''}`;
  }).join('; ');
  return `Circuit analysis: ${circuit.numQubits} qubits, ${gates.length} gate operation${gates.length === 1 ? '' : 's'}. ${gateText}. ${diracNotation ? `The current simulated state is |ψ⟩ = ${diracNotation}.` : ''} Controlled multi-qubit operations can create entanglement when their input state supports it.`;
};

export function answerLocally(query: string): string {
  const clean = query.trim();
  if (!clean) return 'Ask me about quantum computing, the QubitLab syllabus, programming, mathematics, AI/ML, or the current circuit.';
  const lower = clean.toLowerCase();
  if (/^(hi|hello|hey|yo|good morning|good evening)\b/.test(lower)) return 'Hi. I’m the local QubitLab Guide. I answer from the built-in syllabus and local knowledge base without an API call.';
  if (/^(thanks|thank you|thx)\b/.test(lower)) return 'You’re welcome. Keep exploring the circuit, Bloch sphere and quizzes.';
  if (/(who are you|what are you|your name)/.test(lower)) return 'I’m the QubitLab Guide: a deterministic offline tutor built from the QubitLab curriculum, quiz knowledge and a compact general knowledge base. I do not call a remote AI API.';
  const math = tryMath(clean);
  if (math) return math;
  const knowledgeHits = KNOWLEDGE.map((card) => ({ card, score: scoreText(clean, `${card.title} ${card.keywords.join(' ')} ${card.answer}`) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
  const syllabusHits = searchSyllabus(clean);
  const quizHits = searchQuizKnowledge(clean);
  if (knowledgeHits.length) {
    const primary = knowledgeHits[0].card;
    let response = `### ${primary.title}\n${primary.answer}`;
    if (syllabusHits.length) response += `\n\n**In the QubitLab syllabus:** ${syllabusHits[0].topic.title} — ${syllabusHits[0].topic.description}`;
    if (knowledgeHits[1]) response += `\n\n**Related:** ${knowledgeHits[1].card.title} — ${knowledgeHits[1].card.answer}`;
    return response;
  }
  if (syllabusHits.length) {
    const top = syllabusHits[0].topic;
    const objectives = top.learningObjectives.slice(0, 3).map((item) => `- ${item}`).join('\n');
    return `### ${top.title}\n${top.description}\n\n**Learning objectives**\n${objectives}\n\n**Level:** ${top.difficulty} · **Estimated time:** ${top.durationMin} min`;
  }
  if (quizHits.length) return `### Related syllabus check\n${quizHits[0].question.question}\n\n${quizHits[0].question.explanation}`;
  if (/(circuit|statevector|gate|bloch|qubit|quantum)/.test(lower)) return 'I can answer this locally, but I do not have a matching entry. Try a specific concept such as Hadamard, CNOT, phase, interference, measurement, Bloch sphere, Grover, teleportation or normalization.';
  return 'I’m running fully offline, so I cannot truthfully claim unlimited world knowledge. I can answer the built-in QubitLab syllabus, common quantum-computing concepts, basic mathematics, programming/AI/ML topics and simple calculations. For unsupported topics, ask a more specific question.';
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string): string {
  return circuitExplanation(circuit, diracNotation) || 'No circuit context is available.';
}
