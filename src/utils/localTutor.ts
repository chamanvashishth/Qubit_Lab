import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type KnowledgeCard = { keywords: string[]; title: string; answer: string };

// Core offline knowledge for the QubitLab learning syllabus.
// Keep answers concise enough for chat, but useful enough for a beginner to continue learning.
const KNOWLEDGE: KnowledgeCard[] = [
  // 1. Foundations
  { keywords: ['classical computing', 'classical computer', 'classical computing'], title: 'Classical Computing', answer: 'Classical computers represent information with bits, usually written as 0 or 1. Logic gates manipulate those bits, and programs are executed using classical memory and processors.' },
  { keywords: ['quantum computing', 'quantum computer'], title: 'Quantum Computing', answer: 'Quantum computing uses quantum states to process information. Qubits can be in superposition, can become entangled, and are manipulated with quantum gates before measurement.' },
  { keywords: ['bits vs qubits', 'bit vs qubit', 'bits qubits'], title: 'Bits vs Qubits', answer: 'A classical bit is either 0 or 1. A qubit can be in a state α|0⟩ + β|1⟩, with probabilities determined by |α|² and |β|². Qubits also support phase and entanglement, which have no direct classical-bit equivalent.' },
  { keywords: ['quantum information', 'quantum information theory'], title: 'Quantum Information', answer: 'Quantum information is information encoded in quantum states. Its basic unit is the qubit, and its behavior is governed by superposition, unitary evolution, measurement, and entanglement.' },
  { keywords: ['bra ket', 'bra-ket', 'dirac notation', 'ket notation', 'bra notation'], title: 'Bra-Ket Notation', answer: 'Bra-ket notation represents quantum states compactly. A ket |ψ⟩ represents a state vector, while a bra ⟨ψ| is its conjugate transpose. Inner products such as ⟨φ|ψ⟩ describe overlaps between states.' },

  // 2. Core Quantum Concepts
  { keywords: ['qubit', 'quantum bit'], title: 'Qubit', answer: 'A qubit is the basic unit of quantum information. Unlike a classical bit, it can be in a superposition of |0⟩ and |1⟩: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.' },
  { keywords: ['quantum state', 'quantum states', 'state vector'], title: 'Quantum States', answer: 'A quantum state contains the information needed to describe a quantum system. For a single qubit it can be written as |ψ⟩ = α|0⟩ + β|1⟩; for n qubits the state vector has 2ⁿ amplitudes.' },
  { keywords: ['superposition'], title: 'Superposition', answer: 'Superposition means a quantum state can be a combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. When measured, you get one classical result with probabilities set by the amplitudes.' },
  { keywords: ['measurement', 'measure', 'born rule'], title: 'Measurement', answer: 'For a state |ψ⟩ = Σᵢ αᵢ|i⟩, the probability of measuring |i⟩ is |αᵢ|². Measurement produces a classical outcome and, in the usual projective measurement model, projects the state onto the observed basis state.' },
  { keywords: ['probability amplitudes', 'probability amplitude', 'amplitude'], title: 'Probability Amplitudes', answer: 'Quantum amplitudes are generally complex numbers. Their squared magnitudes give measurement probabilities: P(i) = |αᵢ|². Amplitudes themselves can interfere, so their phase matters even though probabilities are real.' },
  { keywords: ['entanglement', 'entangled'], title: 'Entanglement', answer: 'Entanglement means the joint quantum state cannot be written as independent states for each qubit. Entangled qubits can show correlations that cannot be explained by assigning each qubit an independent classical state.' },

  // 3. Quantum Gates & Circuits
  { keywords: ['x gate', 'pauli x', 'x'], title: 'X Gate', answer: 'The Pauli-X gate is the quantum analogue of a bit flip. It maps |0⟩ → |1⟩ and |1⟩ → |0⟩. Its matrix is [[0,1],[1,0]].' },
  { keywords: ['y gate', 'pauli y', 'y'], title: 'Y Gate', answer: 'The Pauli-Y gate rotates a qubit around the Y axis of the Bloch sphere by π. Its matrix is [[0,-i],[i,0]]. It also changes phase while swapping the computational-basis components.' },
  { keywords: ['z gate', 'pauli z', 'z'], title: 'Z Gate', answer: 'The Pauli-Z gate is a phase-flip gate: |0⟩ stays |0⟩ while |1⟩ becomes -|1⟩. Its matrix is [[1,0],[0,-1]].' },
  { keywords: ['hadamard', 'hadamard gate', 'h gate'], title: 'Hadamard Gate', answer: 'The Hadamard gate creates or removes equal superposition. H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2. It is one of the most common starting gates in quantum circuits.' },
  { keywords: ['s gate', 'phase s', 's gate phase'], title: 'S Gate', answer: 'The S gate is a quarter-turn phase gate. It leaves |0⟩ unchanged and maps |1⟩ to i|1⟩. It is equivalent to an RZ(π/2) operation up to the standard phase convention.' },
  { keywords: ['t gate', 't phase', 't gate phase'], title: 'T Gate', answer: 'The T gate applies a π/4 phase to the |1⟩ component: |1⟩ → e^{iπ/4}|1⟩. It is an important non-Clifford gate used in universal quantum computation.' },
  { keywords: ['rx', 'rx gate', 'rotation x'], title: 'RX / X Rotation', answer: 'RX(θ) rotates a qubit around the X axis by angle θ. Its matrix is [[cos(θ/2), -i sin(θ/2)],[-i sin(θ/2), cos(θ/2)]].' },
  { keywords: ['ry', 'ry gate', 'rotation y'], title: 'RY / Y Rotation', answer: 'RY(θ) rotates a qubit around the Y axis by angle θ. Its matrix is [[cos(θ/2), -sin(θ/2)],[sin(θ/2), cos(θ/2)]].' },
  { keywords: ['rz', 'rz gate', 'rotation z'], title: 'RZ / Z Rotation', answer: 'RZ(θ) rotates a qubit around the Z axis. A common matrix form is diag(e^{-iθ/2}, e^{iθ/2}). It changes relative phase without changing computational-basis probabilities immediately.' },
  { keywords: ['cnot', 'controlled not', 'cx gate'], title: 'CNOT', answer: 'CNOT flips the target qubit only when the control qubit is |1⟩. Applying H to one qubit and then CNOT between the pair is the standard simple circuit for creating a Bell state.' },
  { keywords: ['cz', 'controlled z', 'cz gate'], title: 'CZ', answer: 'The controlled-Z gate applies a Z phase to the target when the control is |1⟩. In the computational basis, only |11⟩ receives a minus sign.' },
  { keywords: ['swap', 'swap gate'], title: 'SWAP', answer: 'SWAP exchanges the states of two qubits: |a⟩|b⟩ → |b⟩|a⟩. It can be decomposed into three CNOT gates.' },
  { keywords: ['controlled gates', 'controlled gate', 'multi qubit gate'], title: 'Controlled Gates', answer: 'A controlled gate applies an operation to a target only when one or more control qubits satisfy a condition, usually being |1⟩. CNOT and CZ are common examples; QubitLab also supports SWAP and CCNOT in the simulator.' },
  { keywords: ['circuit design', 'design circuit', 'quantum circuit'], title: 'Circuit Design', answer: 'A quantum circuit is a sequence of gates applied to qubits over time. A good beginner workflow is: initialize → apply single-qubit gates → add controlled gates → inspect the state/probabilities → measure and interpret the result.' },

  // 4. Mathematics
  { keywords: ['vectors', 'vector', 'quantum vectors'], title: 'Vectors', answer: 'A vector is an ordered list of numbers. Quantum states are represented by state vectors; for one qubit, |0⟩ = [1,0]ᵀ and |1⟩ = [0,1]ᵀ.' },
  { keywords: ['matrices', 'matrix', 'quantum matrices'], title: 'Matrices', answer: 'Matrices represent linear transformations. Quantum gates are represented by unitary matrices that transform state vectors while preserving total probability.' },
  { keywords: ['complex numbers', 'complex number', 'imaginary numbers'], title: 'Complex Numbers', answer: 'Complex numbers have a real and imaginary part, z = a + bi. Quantum amplitudes use complex numbers because both magnitude and phase are needed to describe interference and state evolution.' },
  { keywords: ['matrix multiplication', 'multiply matrices', 'matrix multiply'], title: 'Matrix Multiplication', answer: 'Matrix multiplication composes linear transformations. In a circuit, applying gate B after gate A corresponds to multiplying the state by B A |ψ⟩, with the rightmost operation acting first.' },
  { keywords: ['unitary matrices', 'unitary matrix', 'unitary'], title: 'Unitary Matrices', answer: 'A matrix U is unitary when U†U = I. Quantum gates use unitary transformations so the norm of a valid quantum state remains 1 before measurement.' },
  { keywords: ['tensor products', 'tensor product', 'kronecker product'], title: 'Tensor Products', answer: 'Tensor products combine subsystem states into a joint state. If |a⟩ and |b⟩ describe two qubits, their combined state is |a⟩ ⊗ |b⟩. Two qubits therefore require 2² = 4 basis amplitudes.' },

  // 5. Visualization
  { keywords: ['state vector', 'state vectors', 'statevector visualization'], title: 'State Vectors', answer: 'A state vector lists the complex amplitudes of computational-basis states. For n qubits there are 2ⁿ amplitudes. QubitLab uses the simulated state vector to drive its probability and Dirac-style views.' },
  { keywords: ['probability distributions', 'probability distribution', 'probabilities'], title: 'Probability Distributions', answer: 'A probability distribution shows the chance of each measurement outcome. For a state vector, each outcome probability is the squared magnitude of its amplitude, and all probabilities sum to 1.' },
  { keywords: ['histogram', 'histograms', 'measurement histogram'], title: 'Measurement Histograms', answer: 'A measurement histogram approximates experimental outcomes by sampling the simulated probability distribution many times. More shots generally make the observed frequencies closer to the underlying probabilities.' },
  { keywords: ['bloch sphere', 'bloch'], title: 'Bloch Sphere', answer: 'The Bloch sphere is a geometric representation of a single-qubit pure state. The north and south poles correspond to |0⟩ and |1⟩, while other points encode superposition and relative phase.' },
  { keywords: ['state evolution', 'evolution of state', 'state changes'], title: 'State Evolution', answer: 'State evolution is the change of a quantum state as gates are applied. QubitLab recomputes the state after circuit edits so learners can inspect how each operation changes amplitudes and probabilities.' },

  // 6. Algorithms
  { keywords: ['deutsch', 'deutsch algorithm'], title: 'Deutsch Algorithm', answer: 'Deutsch’s algorithm determines whether a one-bit Boolean function is constant or balanced using one quantum query. It demonstrates superposition, phase kickback, interference, and measurement.' },
  { keywords: ['deutsch jozsa', 'deutsch-jozsa', 'deutsch joza'], title: 'Deutsch-Jozsa Algorithm', answer: 'The Deutsch-Jozsa algorithm distinguishes a promised constant function from a balanced function with a single oracle query in the ideal quantum model, while a deterministic classical strategy can require more queries.' },
  { keywords: ['bernstein vazirani', 'bernstein-vazirani', 'bv algorithm'], title: 'Bernstein-Vazirani Algorithm', answer: 'Bernstein-Vazirani finds a hidden bit string encoded by a linear Boolean function using one oracle query in the ideal quantum setting. It demonstrates phase kickback and interference.' },
  { keywords: ['grover', 'grover algorithm', 'amplitude amplification'], title: 'Grover Search', answer: 'Grover’s algorithm searches an unstructured space using an oracle and amplitude amplification. Its query complexity is about O(√N), giving a quadratic improvement over classical exhaustive search in the oracle model.' },
  { keywords: ['qft', 'quantum fourier transform', 'quantum fourier'], title: 'Quantum Fourier Transform', answer: 'The QFT is the quantum analogue of the discrete Fourier transform. It changes amplitudes between computational and phase/frequency-like representations and is a key subroutine in algorithms such as Shor’s.' },
  { keywords: ['shor', 'shor algorithm', 'integer factoring'], title: 'Shor Algorithm', answer: 'Shor’s algorithm uses quantum period finding, with the QFT as a major component, to factor integers efficiently in the ideal fault-tolerant quantum model. This is why it is important in discussions of public-key cryptography.' },
  { keywords: ['vqe', 'variational quantum eigensolver'], title: 'VQE', answer: 'The Variational Quantum Eigensolver is a hybrid quantum-classical algorithm. A parameterized circuit prepares a trial state, a quantum device estimates an objective such as energy, and a classical optimizer updates the parameters.' },
  { keywords: ['qaoa', 'quantum approximate optimization algorithm'], title: 'QAOA', answer: 'QAOA is a hybrid variational algorithm designed for combinatorial optimization. It alternates problem-dependent and mixing operations, then uses a classical optimizer to tune circuit parameters.' },

  // 7. Quantum Programming
  { keywords: ['qiskit', 'ibm qiskit'], title: 'Qiskit', answer: 'Qiskit is an open-source quantum software framework associated with IBM’s quantum platform. It lets developers construct circuits, transpile them for supported backends, simulate circuits, and work with quantum hardware through the platform.' },
  { keywords: ['qiskit aer', 'aer simulator', 'qiskit simulator'], title: 'Qiskit Aer', answer: 'Qiskit Aer provides high-performance simulators for quantum circuits. It is useful for testing circuits locally and studying ideal or noise-aware behavior before using hardware.' },
  { keywords: ['pennylane', 'pennylane framework'], title: 'PennyLane', answer: 'PennyLane is a quantum machine-learning and differentiable programming framework. It connects parameterized quantum circuits with classical machine-learning workflows and supports multiple quantum devices/backends.' },
  { keywords: ['cirq', 'google cirq'], title: 'Cirq', answer: 'Cirq is an open-source Python framework for designing, simulating, and running quantum circuits. It is especially useful for circuit-level experimentation and integration with Google’s quantum-computing ecosystem.' },
  { keywords: ['qbraid', 'q-braid'], title: 'qBraid', answer: 'qBraid is a quantum software platform and development environment that brings together tools and access to multiple quantum backends. It can help learners and developers move between quantum SDKs and execution environments.' },

  // 8. AI + Education
  { keywords: ['ai tutor', 'ai tutor bot', 'tutor bot'], title: 'AI Tutor', answer: 'An AI tutor can act as a conversational learning layer: explain concepts, answer questions, give hints, and guide learners through exercises. In QubitLab, the core guide is local and deterministic, so the learning experience does not depend on an external model service.' },
  { keywords: ['ai code generation', 'code generation', 'generate code'], title: 'AI Code Generation', answer: 'AI code generation can turn a natural-language request into starter code, explain generated code, or help translate a circuit into a quantum SDK. Generated code should still be reviewed and tested before use.' },
  { keywords: ['ai debugging', 'debugging with ai', 'debug quantum code'], title: 'AI Debugging', answer: 'AI-assisted debugging can help identify likely syntax, API, circuit-logic, or conceptual mistakes. A reliable workflow is: reproduce the issue → inspect the circuit/state → propose a fix → run tests or simulation → verify the result.' },
  { keywords: ['circuit explanation', 'explain circuit', 'circuit explain'], title: 'Circuit Explanation', answer: 'Circuit explanation means translating a gate sequence into an understandable description of what each operation does and how the state changes. QubitLab can provide a local circuit summary from the current circuit and simulated Dirac state.' },
  { keywords: ['personalized learning', 'personalised learning', 'personalized education'], title: 'Personalized Learning', answer: 'Personalized learning adapts explanations and practice to a learner’s current topic, mistakes, pace, and progress. The goal is to give the learner the next useful concept instead of the same fixed lesson to everyone.' },
  { keywords: ['adaptive difficulty', 'adaptive learning', 'difficulty'], title: 'Adaptive Difficulty', answer: 'Adaptive difficulty changes question or exercise complexity based on learner performance. A practical approach is to use accuracy and recent attempts to move between easier, standard, and harder practice.' },
  { keywords: ['assessments', 'assessment', 'quiz', 'quizzes'], title: 'Assessments', answer: 'Assessments check whether a learner can recall concepts, reason about circuits, and apply ideas. Good quantum assessments mix conceptual questions, gate/state reasoning, and small circuit problems rather than relying only on definitions.' },
  { keywords: ['progress tracking', 'track progress', 'learning progress'], title: 'Progress Tracking', answer: 'Progress tracking records useful learning signals such as completed topics, quiz attempts, or current learning position. QubitLab keeps learner progress in session storage so it can survive reloads during the active browser session without requiring a server-side account.' },

  // Supporting concepts used across the syllabus
  { keywords: ['normalization', 'normalized'], title: 'Normalization', answer: 'A valid quantum state has total probability 1. For n qubits, the probabilities of all 2ⁿ computational-basis states must add up to 1. QubitLab normalizes numerical simulation results to reduce floating-point drift.' },
  { keywords: ['phase', 'relative phase', 'global phase'], title: 'Quantum Phase', answer: 'Global phase does not change measurement probabilities. Relative phase does matter because it changes interference between amplitudes and therefore can change later measurement outcomes.' },
  { keywords: ['interference'], title: 'Interference', answer: 'Quantum amplitudes can add or cancel because they are complex numbers. Quantum algorithms use this interference to amplify useful outcomes and suppress others.' },
  { keywords: ['no cloning', 'no-cloning'], title: 'No-Cloning Theorem', answer: 'An unknown arbitrary quantum state cannot be copied perfectly. This is a fundamental consequence of the linear structure of quantum mechanics.' },
  { keywords: ['quantum teleportation', 'teleportation'], title: 'Quantum Teleportation', answer: 'Quantum teleportation transfers an unknown quantum state using shared entanglement and two classical bits. It does not copy the original state; the sender’s state is consumed by the protocol.' },
  { keywords: ['machine learning', 'ml'], title: 'Machine Learning', answer: 'Machine learning finds patterns in data by learning model parameters from examples. A common workflow is prepare data → train → validate → evaluate.' },
  { keywords: ['artificial intelligence', ' ai '], title: 'Artificial Intelligence', answer: 'AI is the broader field of building systems that perform tasks such as reasoning, perception, learning, or language processing. Machine learning is one approach within AI.' },
  { keywords: ['neural network', 'neural networks', 'deep learning'], title: 'Neural Networks', answer: 'A neural network learns parameters for a sequence of transformations. Training usually adjusts those parameters to reduce a loss using backpropagation and an optimization method.' },
  { keywords: ['python'], title: 'Python', answer: 'Python is a general-purpose programming language commonly used for automation, data science, machine learning, and scientific computing. Many quantum SDKs expose Python APIs.' },
  { keywords: ['recursion'], title: 'Recursion', answer: 'Recursion solves a problem by solving smaller versions of the same problem. A recursive solution needs a base case and a step that moves toward it.' },
  { keywords: ['big o', 'time complexity', 'space complexity'], title: 'Complexity', answer: 'Big-O describes how resource usage grows with input size. Common examples are O(1), O(log n), O(n), O(n log n), and O(n²).' },
];

const STOP_WORDS = new Set(['what','why','how','does','do','is','are','the','a','an','of','to','for','in','on','and','or','can','i','you','me','explain','tell','about','please','could','would','give','show','please']);
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
    return `The answer is ${Number.isInteger(value) ? value : Number(value.toFixed(8))}.`;
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

  if (knowledgeHits.length) return `${knowledgeHits[0].card.title}\n\n${knowledgeHits[0].card.answer}`;

  const syllabusHits = searchSyllabus(clean);
  if (syllabusHits.length) {
    const top = syllabusHits[0].topic;
    const objectives = top.learningObjectives.slice(0, 3).map((item) => `• ${item}`).join('\n');
    return `${top.title}\n\n${top.description}\n\nKey points\n${objectives}`;
  }

  const quizHits = searchQuizKnowledge(clean);
  if (quizHits.length) {
    return `Quick check\n\n${quizHits[0].question.question}\n\n${quizHits[0].question.explanation}`;
  }

  if (/(circuit|statevector|gate|bloch|qubit|quantum|qiskit|pennylane|cirq|qbraid|qft|vqe|qaoa|deutsch|shor)/.test(lower)) {
    return 'I don’t have a direct answer for that one yet. Try asking about one of the QubitLab syllabus topics: foundations, qubits, gates, mathematics, visualization, algorithms, quantum programming, or AI + education.';
  }

  return 'I don’t have that in my current knowledge base. Try a quantum-computing syllabus topic, a QubitLab concept, or a simple calculation.';
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string): string {
  return circuitExplanation(circuit, diracNotation) || 'No circuit context is available.';
}
