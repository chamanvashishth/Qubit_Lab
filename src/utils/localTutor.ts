import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type KnowledgeCard = {
  keywords: string[];
  title: string;
  answer: string;
};

const KNOWLEDGE: KnowledgeCard[] = [
  {
    keywords: ['qubit', 'quantum bit'],
    title: 'Qubit',
    answer: 'A qubit is a two-level quantum system. Its pure state can be written |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1. Measurement produces a classical result, while the amplitudes determine the probabilities.',
  },
  {
    keywords: ['superposition', 'superposition state'],
    title: 'Superposition',
    answer: 'Superposition means a quantum state is a linear combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. It does not mean that a measurement literally returns both values at once.',
  },
  {
    keywords: ['hadamard', 'hadamard gate', ' h gate'],
    title: 'Hadamard gate',
    answer: 'The Hadamard gate maps |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ − |1⟩)/√2. It is commonly used to create superposition and to convert between computational and interference-friendly bases.',
  },
  {
    keywords: ['cnot', 'controlled not', 'cx gate'],
    title: 'CNOT',
    answer: 'CNOT flips the target qubit only when the control qubit is |1⟩. Starting from |00⟩, H on the control followed by CNOT produces the Bell state (|00⟩ + |11⟩)/√2.',
  },
  {
    keywords: ['entanglement', 'entangled'],
    title: 'Entanglement',
    answer: 'Entanglement is a property of a joint quantum state that cannot be represented as a product of independent single-qubit states. Local measurement correlations can be stronger than classical shared randomness, but entanglement does not permit faster-than-light signalling.',
  },
  {
    keywords: ['measurement', 'measure a qubit', 'born rule'],
    title: 'Measurement',
    answer: 'For |ψ⟩ = Σᵢ αᵢ|i⟩, the Born rule assigns probability |αᵢ|² to outcome |i⟩. An ideal projective measurement updates the state to the outcome subspace associated with the observed result.',
  },
  {
    keywords: ['normalization', 'normalized qubit'],
    title: 'Normalization',
    answer: 'A valid pure quantum state must have total probability one. For one qubit, |α|² + |β|² = 1. For an n-qubit statevector, the sum of |αᵢ|² over all 2ⁿ basis states must equal one.',
  },
  {
    keywords: ['bloch sphere', 'bloch'],
    title: 'Bloch sphere',
    answer: 'A single-qubit pure state can be represented by a point on the Bloch sphere. The polar angle controls the balance between |0⟩ and |1⟩, while the azimuthal angle captures relative phase. Mixed states lie inside the sphere.',
  },
  {
    keywords: ['phase', 'relative phase', 'global phase'],
    title: 'Quantum phase',
    answer: 'A global phase does not affect measurement probabilities, but relative phase does affect interference. Z, S, T and rotation gates are useful for controlling phase relationships between amplitudes.',
  },
  {
    keywords: ['interference', 'quantum interference'],
    title: 'Interference',
    answer: 'Quantum amplitudes are complex numbers, so paths can add constructively or destructively. Algorithms such as Grover search exploit controlled interference to increase amplitude on useful outcomes.',
  },
  {
    keywords: ['no cloning', 'no-cloning'],
    title: 'No-Cloning Theorem',
    answer: 'An unknown arbitrary quantum state cannot be copied perfectly by a physical quantum operation. If a universal cloner existed, linearity and preservation of inner products would be violated.',
  },
  {
    keywords: ['grover', 'grover algorithm'],
    title: 'Grover search',
    answer: 'Grover search repeatedly applies an oracle and amplitude amplification. For an unstructured search space of N items, the ideal query complexity is O(√N), compared with O(N) classical search in the black-box setting.',
  },
  {
    keywords: ['shor', 'shor algorithm'],
    title: 'Shor algorithm',
    answer: 'Shor’s algorithm reduces integer factoring to period finding and uses the quantum Fourier transform as a key subroutine. Its significance comes from polynomial-time quantum complexity for factoring, assuming a sufficiently large fault-tolerant quantum computer.',
  },
  {
    keywords: ['quantum teleportation', 'teleportation'],
    title: 'Quantum teleportation',
    answer: 'Quantum teleportation transfers an unknown quantum state using a shared entangled pair plus two classical bits of communication. The original state is not copied; the sender’s state is consumed by the measurement.',
  },
  {
    keywords: ['machine learning', 'ml', 'machine-learning'],
    title: 'Machine learning',
    answer: 'Machine learning learns patterns from data rather than relying entirely on hand-written rules. A typical pipeline is data preparation → model selection → training → validation/testing → evaluation and deployment.',
  },
  {
    keywords: ['artificial intelligence', ' ai ', 'artificial-intelligence'],
    title: 'Artificial intelligence',
    answer: 'Artificial intelligence is the broader field of building systems that perform tasks associated with reasoning, perception, learning, planning or language. Machine learning is one major approach within AI.',
  },
  {
    keywords: ['neural network', 'neural networks', 'deep learning'],
    title: 'Neural networks',
    answer: 'A neural network composes parameterized transformations, usually with nonlinear activation functions. Training adjusts parameters to reduce a loss function, commonly using gradient-based optimization and backpropagation.',
  },
  {
    keywords: ['python'],
    title: 'Python',
    answer: 'Python is a high-level general-purpose programming language widely used for automation, data science, machine learning and scientific computing. Its ecosystem includes NumPy, pandas, PyTorch, TensorFlow and many domain-specific libraries.',
  },
  {
    keywords: ['recursion'],
    title: 'Recursion',
    answer: 'Recursion solves a problem by reducing it to smaller instances of the same problem. A correct recursive solution needs a base case and a recursive step that makes progress toward that base case.',
  },
  {
    keywords: ['big o', 'time complexity', 'space complexity'],
    title: 'Complexity',
    answer: 'Big-O notation describes asymptotic resource growth. O(1) is constant, O(log n) grows slowly, O(n) is linear, O(n log n) is common for efficient sorting, and O(n²) is quadratic.',
  },
];

const STOP_WORDS = new Set(['what', 'why', 'how', 'does', 'do', 'is', 'are', 'the', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'and', 'or', 'can', 'i', 'you', 'me', 'explain', 'tell', 'about', 'please']);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+\-*/^|⟩⟨]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const scoreText = (query: string, text: string) => {
  const q = tokenize(query);
  const haystack = text.toLowerCase();
  return q.reduce((score, token) => score + (haystack.includes(token) ? (token.length > 5 ? 2 : 1) : 0), 0);
};

const searchSyllabus = (query: string) => {
  return CURRICULUM_TOPICS
    .map((topic) => ({
      topic,
      score: scoreText(query, `${topic.title} ${topic.tagline} ${topic.description} ${topic.learningObjectives.join(' ')} ${topic.prerequisites.join(' ')}`),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const searchQuizKnowledge = (query: string) => {
  return QUIZ_MOCKS
    .flatMap((quiz) => quiz.questions.map((question) => ({ quiz, question })))
    .map((item) => ({ ...item, score: scoreText(query, `${item.question.question} ${item.question.options.join(' ')} ${item.question.explanation}`) }))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
};

const tryMath = (query: string): string | null => {
  const expression = query
    .toLowerCase()
    .replace(/what is|calculate|solve|evaluate|equals|=/g, ' ')
    .replace(/times/g, '*')
    .replace(/divided by/g, '/')
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/to the power of/g, '^')
    .replace(/[^0-9+\-*/().^%\s]/g, '')
    .trim();

  if (!expression || !/[+\-*/^%]/.test(expression) || !/^[-+*/%0-9().\s^]+$/.test(expression)) return null;
  try {
    const safeExpression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)');
    // The expression has already been restricted to numeric operators only.
    const value = Function(`"use strict"; return (${safeExpression})`)();
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return `The result is **${Number.isInteger(value) ? value : Number(value.toFixed(8))}**.`;
  } catch {
    return null;
  }
};

const circuitExplanation = (circuit?: CircuitState, diracNotation?: string) => {
  if (!circuit) return null;
  const gates = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!gates.length) return `The current circuit has ${circuit.numQubits} qubit${circuit.numQubits === 1 ? '' : 's'} and no gates. Start from |${'0'.repeat(circuit.numQubits)}⟩ and place a gate to see the state change.`;
  const gateText = gates.map((gate) => {
    const controls = [gate.controlQubit, gate.controlQubit2].filter((v): v is number => v !== undefined).map((v) => `q[${v}]`).join(', ');
    const target = `q[${gate.targetQubit}]`;
    return `${gate.gate} at step ${gate.step} on ${target}${controls ? ` with control ${controls}` : ''}`;
  }).join('; ');
  return `Circuit analysis: ${circuit.numQubits} qubits, ${gates.length} gate operation${gates.length === 1 ? '' : 's'}. ${gateText}. ${diracNotation ? `The current simulated state is |ψ⟩ = ${diracNotation}.` : ''} Multi-qubit controlled operations can create entanglement when their input state has the required superposition. Measurement markers are not simulated as unitary evolution.`;
};

export function answerLocally(query: string, context = ''): string {
  const clean = query.trim();
  if (!clean) return 'Ask me a question about quantum computing, the QubitLab syllabus, programming, mathematics, AI/ML, or the current circuit.';

  const lower = clean.toLowerCase();
  if (/^(hi|hello|hey|yo|good morning|good evening)\b/.test(lower)) return 'Hi. I’m the local QubitLab Guide. I can answer from the built-in syllabus and local knowledge base without an API call. Ask me something.';
  if (/^(thanks|thank you|thx)\b/.test(lower)) return 'You’re welcome. Keep going — the circuit, Bloch sphere, and quiz tools are all local too.';
  if (/(who are you|what are you|your name)/.test(lower)) return 'I’m the QubitLab Guide: a deterministic, offline tutor built from the QubitLab curriculum, quiz knowledge, and a compact general knowledge base. I do not call a remote AI API.';

  const circuitMatch = circuitExplanation(context ? (context as unknown as CircuitState) : undefined);
  void circuitMatch;

  const math = tryMath(clean);
  if (math) return math;

  const knowledgeHits = KNOWLEDGE
    .map((card) => ({ card, score: scoreText(clean, `${card.title} ${card.keywords.join(' ')} ${card.answer}`) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const syllabusHits = searchSyllabus(clean);
  const quizHits = searchQuizKnowledge(clean);

  if (knowledgeHits.length) {
    const primary = knowledgeHits[0].card;
    let response = `### ${primary.title}\n${primary.answer}`;
    if (syllabusHits.length) {
      response += `\n\n**In the QubitLab syllabus:** ${syllabusHits[0].topic.title} — ${syllabusHits[0].topic.description}`;
    }
    if (knowledgeHits[1]) response += `\n\n**Related:** ${knowledgeHits[1].card.title} — ${knowledgeHits[1].card.answer}`;
    return response;
  }

  if (syllabusHits.length) {
    const top = syllabusHits[0].topic;
    const objectives = top.learningObjectives.slice(0, 3).map((item) => `- ${item}`).join('\n');
    return `### ${top.title}\n${top.description}\n\n**Learning objectives**\n${objectives}\n\n**Level:** ${top.difficulty} · **Estimated time:** ${top.durationMin} min\n\nThis answer is grounded in the local QubitLab syllabus; no external API is being used.`;
  }

  if (quizHits.length) {
    const hit = quizHits[0];
    return `### Related syllabus check\n${hit.question.question}\n\n${hit.question.explanation}`;
  }

  if (/(circuit|statevector|gate|bloch|qubit|quantum)/.test(lower)) {
    return 'I can answer this locally, but I do not have a matching syllabus entry yet. Try naming the specific concept (for example: Hadamard, CNOT, phase, interference, measurement, Bloch sphere, Grover, teleportation, or normalization).';
  }

  return 'I’m running fully offline, so I cannot truthfully claim unlimited world knowledge. I can answer the built-in QubitLab syllabus, common quantum-computing concepts, basic mathematics, programming/AI/ML topics, and simple calculations. For an unsupported topic, ask a more specific question and I’ll use the closest local knowledge I have.';
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string): string {
  return circuitExplanation(circuit, diracNotation) || 'No circuit context is available.';
}
