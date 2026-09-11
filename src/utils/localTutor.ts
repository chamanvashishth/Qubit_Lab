import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type Intent =
  | 'syllabus'
  | 'simulator'
  | 'curriculumTopic'
  | 'quiz'
  | 'circuit'
  | 'code'
  | 'debug'
  | 'greeting'
  | 'thanks'
  | 'unknown';

type KnowledgeCard = {
  id: string;
  title: string;
  aliases: string[];
  answer: string;
  related?: string[];
};

// This tutor is deliberately grounded in the material that actually exists in QubitLab.
// It is not an LLM and should never pretend to know a topic just because a keyword matched.
const KNOWLEDGE: KnowledgeCard[] = [
  { id: 'classical-vs-quantum', title: 'Classical vs Quantum Computing', aliases: ['classical computing', 'classical computer', 'classical vs quantum', 'quantum computing'], answer: 'A classical computer stores information as bits that are read as 0 or 1. QubitLab introduces quantum computing as a different computational model based on qubits, amplitudes, interference, entanglement, and measurement. Quantum computing is not simply a faster version of classical computing for every problem.', related: ['bits vs qubits', 'superposition'] },
  { id: 'bits-vs-qubits', title: 'Bits vs Qubits', aliases: ['bits vs qubits', 'bit vs qubit', 'qubit vs bit'], answer: 'A bit is either 0 or 1. A qubit can be written as |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1. The amplitudes can be complex, and relative phase matters for interference.', related: ['bra-ket notation', 'complex numbers'] },
  { id: 'bra-ket-notation', title: 'Bra-Ket (Dirac) Notation', aliases: ['bra ket', 'bra-ket', 'dirac notation', 'ket notation', 'bra notation'], answer: 'A ket |ψ⟩ represents a quantum state as a column vector. A bra ⟨ψ| is its conjugate-transpose row vector. The inner product ⟨φ|ψ⟩ gives an amplitude, while an outer product |ψ⟩⟨φ| forms an operator.', related: ['bits vs qubits', 'linear algebra'] },
  { id: 'superposition', title: 'Quantum Superposition', aliases: ['superposition', 'quantum superposition'], answer: 'Superposition means a quantum state can be a linear combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. Measurement then gives a classical outcome according to the squared magnitudes of the amplitudes.', related: ['measurement', 'hadamard'] },
  { id: 'measurement', title: 'Quantum Measurement & the Born Rule', aliases: ['measurement', 'quantum measurement', 'wavefunction collapse', 'born rule', 'measure'], answer: 'For |ψ⟩ = Σ αᵢ|i⟩, the Born rule gives P(i) = |αᵢ|². A projective measurement produces a classical basis outcome and, in the usual model, projects the quantum state onto the observed outcome.', related: ['superposition', 'probability amplitudes'] },
  { id: 'entanglement', title: 'Quantum Entanglement & Bell States', aliases: ['entanglement', 'entangled', 'bell state', 'bell states'], answer: 'Entanglement means the joint quantum state cannot be written as a product of independent states for the individual qubits. QubitLab uses Bell and GHZ presets to make this idea visible in the simulator.', related: ['cnot', 'bloch sphere'] },
  { id: 'probability-amplitudes', title: 'Probability Amplitudes', aliases: ['probability amplitude', 'probability amplitudes', 'amplitudes'], answer: 'Quantum amplitudes are generally complex. Their squared magnitudes give measurement probabilities, while their relative phases can change later interference.', related: ['complex numbers', 'measurement'] },
  { id: 'x', title: 'Pauli-X Gate', aliases: ['x gate', 'pauli x', 'pauli-x'], answer: 'X is the quantum bit-flip gate. X|0⟩ = |1⟩ and X|1⟩ = |0⟩. Its matrix is [[0,1],[1,0]]. QubitLab applies X directly to the simulated statevector.', related: ['single-qubit gates'] },
  { id: 'y', title: 'Pauli-Y Gate', aliases: ['y gate', 'pauli y', 'pauli-y'], answer: 'Y is a single-qubit Pauli gate with matrix [[0,-i],[i,0]]. It combines a bit flip with phase factors and corresponds to a π rotation about the Bloch-sphere Y axis.', related: ['single-qubit gates'] },
  { id: 'z', title: 'Pauli-Z Gate', aliases: ['z gate', 'pauli z', 'pauli-z', 'phase flip'], answer: 'Z is the phase-flip gate. It leaves |0⟩ unchanged and maps |1⟩ to -|1⟩. Its matrix is [[1,0],[0,-1]].', related: ['phase', 'single-qubit gates'] },
  { id: 'h', title: 'Hadamard Gate', aliases: ['hadamard', 'hadamard gate', 'h gate'], answer: 'The Hadamard gate creates and recombines superpositions. Starting from |0⟩, H produces (|0⟩ + |1⟩)/√2. Applying H twice returns the original basis state.', related: ['superposition', 'interference'] },
  { id: 's', title: 'S Gate', aliases: ['s gate', 'phase s'], answer: 'S applies a π/2 phase to the |1⟩ component: |1⟩ → i|1⟩. QubitLab includes S as a simulator gate.', related: ['phase', 'single-qubit gates'] },
  { id: 't', title: 'T Gate', aliases: ['t gate', 'phase t'], answer: 'T applies a π/4 phase to |1⟩: |1⟩ → e^(iπ/4)|1⟩. QubitLab includes T as a simulator gate.', related: ['phase', 'single-qubit gates'] },
  { id: 'rx', title: 'RX Rotation', aliases: ['rx', 'rx gate', 'rotation x'], answer: 'RX(θ) rotates a qubit about the X axis. QubitLab uses the standard unitary Rx(θ) = cos(θ/2)I − i sin(θ/2)X, and the circuit angle is interpreted in radians.', related: ['bloch sphere', 'single-qubit gates'] },
  { id: 'ry', title: 'RY Rotation', aliases: ['ry', 'ry gate', 'rotation y'], answer: 'RY(θ) rotates a qubit about the Y axis. It changes the amplitudes and therefore can change computational-basis probabilities.', related: ['bloch sphere', 'single-qubit gates'] },
  { id: 'rz', title: 'RZ Rotation', aliases: ['rz', 'rz gate', 'rotation z'], answer: 'RZ(θ) rotates around the Z axis and changes relative phase. Its effect can become visible in later interference even when immediate computational-basis probabilities are unchanged.', related: ['phase', 'bloch sphere'] },
  { id: 'cnot', title: 'CNOT Gate', aliases: ['cnot', 'controlled not', 'cx', 'cx gate', 'controlled-x'], answer: 'CNOT has a control and a target. If the control is 1, X is applied to the target; if the control is 0, the target is unchanged. H followed by CNOT is the standard Bell-state construction used in QubitLab.', related: ['entanglement', 'multi-qubit gates'] },
  { id: 'cz', title: 'CZ Gate', aliases: ['cz', 'controlled z', 'controlled-z'], answer: 'CZ applies a Z operation conditionally. In the computational basis it changes the sign of |11⟩ while leaving |00⟩, |01⟩ and |10⟩ unchanged.', related: ['phase', 'multi-qubit gates'] },
  { id: 'swap', title: 'SWAP Gate', aliases: ['swap', 'swap gate'], answer: 'SWAP exchanges the states of two qubits. QubitLab implements SWAP directly in the statevector engine and exports it to supported code formats.', related: ['multi-qubit gates'] },
  { id: 'ccnot', title: 'CCNOT / Toffoli Gate', aliases: ['ccnot', 'ccx', 'toffoli', 'toffoli gate'], answer: 'CCNOT has two control qubits and one target. The target flips only when both controls are 1. QubitLab supports CCNOT in the circuit simulator.', related: ['multi-qubit gates'] },
  { id: 'complex', title: 'Complex Numbers & Argand Plane', aliases: ['complex numbers', 'complex number', 'argand', 'argand plane', 'euler formula'], answer: 'A complex number has the form a + bi. QubitLab uses complex numbers for quantum amplitudes. The curriculum covers magnitude, phase, conjugation, Euler’s formula, and the difference between global and relative phase.', related: ['probability amplitudes', 'linear algebra'] },
  { id: 'linear-algebra', title: 'Linear Algebra & Unitary Matrices', aliases: ['linear algebra', 'matrices', 'matrix', 'unitary', 'unitary matrix', 'tensor product', 'kronecker'], answer: 'Quantum gates are linear transformations represented by matrices. The curriculum covers matrix multiplication, conjugate transpose, the unitary condition U†U = I, tensor products, eigenvalues, and eigenvectors. QubitLab applies these transformations directly to its statevector simulator.', related: ['complex numbers', 'statevector'] },
  { id: 'bloch', title: 'Bloch Sphere', aliases: ['bloch sphere', 'bloch', 'bloch vector'], answer: 'The Bloch sphere is a geometric representation of a single-qubit state. QubitLab computes a Bloch vector for each qubit from the simulated state and displays p0, p1, x, y, z, theta, phi, and a purity value.', related: ['single-qubit gates', 'entanglement'] },
  { id: 'statevector', title: 'Statevector Simulation', aliases: ['state vector', 'statevector', 'state vector simulation', 'simulation'], answer: 'QubitLab starts the circuit in |0...0⟩, applies the placed gates in step order, normalizes the resulting complex statevector to remove small floating-point drift, then derives probabilities, a Dirac-notation string, Bloch vectors, density matrices, an entanglement indicator, and sampled measurement counts.', related: ['circuit simulation', 'measurement'] },
  { id: 'histogram', title: 'Measurement Histogram', aliases: ['histogram', 'measurement histogram', 'shots', 'shot'], answer: 'The simulator converts statevector probabilities into repeated sampled outcomes. The number of shots is configurable; more shots generally makes the histogram closer to the underlying probability distribution.', related: ['measurement', 'probability amplitudes'] },
  { id: 'phase', title: 'Quantum Phase', aliases: ['phase', 'relative phase', 'global phase'], answer: 'Global phase does not change measurement probabilities. Relative phase can change interference and therefore can affect later measurement results. This distinction is part of QubitLab’s quantum foundations and complex-number material.', related: ['interference', 'rz'] },
  { id: 'interference', title: 'Quantum Interference', aliases: ['interference', 'constructive interference', 'destructive interference'], answer: 'Quantum amplitudes can add constructively or destructively. QubitLab’s algorithm lessons use interference to explain why algorithms such as Deutsch-Jozsa and Grover can amplify useful outcomes.', related: ['superposition', 'grover'] },
  { id: 'deutsch-jozsa', title: 'Deutsch-Jozsa Algorithm', aliases: ['deutsch-jozsa', 'deutsch jozsa', 'deutsch jozsa algorithm'], answer: 'Deutsch-Jozsa solves a promised problem: determine whether an oracle is constant or balanced. The curriculum focuses on phase kickback, constructive/destructive interference, and the complete Hadamard-oracle circuit. The Circuit Composer has a Deutsch preset, but it is an educational circuit preset rather than a general oracle implementation.', related: ['interference', 'cnot'] },
  { id: 'grover', title: "Grover's Search Algorithm", aliases: ['grover', 'grover search', 'grover algorithm'], answer: 'Grover search uses an oracle and amplitude amplification to find a marked item in an unstructured search space in roughly O(√N) oracle queries. The curriculum covers the geometric 2D picture, diffusion operator, optimal iterations, and overcooking. QubitLab provides a small educational Grover preset; it is not a general arbitrary-size Grover compiler.', related: ['interference', 'statevector'] },
  { id: 'qft', title: 'Quantum Fourier Transform', aliases: ['qft', 'quantum fourier transform'], answer: 'The curriculum teaches QFT as the quantum analogue of the discrete Fourier transform, including phase encoding and controlled-phase circuit structure. QubitLab does not have a dedicated QFT gate or a full general QFT builder in the Circuit Composer; QFT is currently a curriculum topic, not a complete simulator feature.', related: ['shor', 'linear algebra'] },
  { id: 'shor', title: "Shor's Factoring Algorithm", aliases: ['shor', 'shor algorithm', 'factoring algorithm'], answer: 'The curriculum explains Shor’s reduction of factoring to order finding and the role of QFT. It also describes a small N=15 learning example. QubitLab does not implement a general Shor factoring engine in the Circuit Composer.', related: ['qft', 'deutsch-jozsa'] },
  { id: 'vqe-qaoa', title: 'VQE & QAOA', aliases: ['vqe', 'qaoa', 'variational quantum algorithms', 'variational quantum algorithm'], answer: 'The curriculum introduces VQE and QAOA as hybrid quantum-classical algorithms. VQE uses a parameterized ansatz and an objective such as energy; QAOA alternates problem and mixing operations. The current Circuit Composer does not provide a full optimizer, Hamiltonian evaluator, or VQE/QAOA training loop.', related: ['rx', 'ry'] },
  { id: 'qiskit', title: 'Qiskit', aliases: ['qiskit', 'qiskit aer', 'aer'], answer: 'Qiskit is included in the sandbox material and in the circuit export path. QubitLab can generate Qiskit code from the circuit. The browser simulator itself is QubitLab’s TypeScript statevector engine; it is not running Qiskit in the browser.', related: ['quantum sandbox'] },
  { id: 'pennylane', title: 'PennyLane', aliases: ['pennylane', 'pennylane code'], answer: 'PennyLane is included in the sandbox and export path. QubitLab generates representative PennyLane code, while the browser simulation is performed by the local TypeScript quantum engine rather than the PennyLane SDK.', related: ['quantum sandbox'] },
  { id: 'cirq', title: 'Cirq', aliases: ['cirq', 'cirq code'], answer: 'Cirq is included in the sandbox and export path. QubitLab generates representative Cirq code; it does not execute the Cirq SDK inside the browser simulator.', related: ['quantum sandbox'] },
  { id: 'quantum-sandbox', title: 'Quantum Code Examples', aliases: ['quantum sandbox', 'sandbox', 'code examples', 'quantum code'], answer: 'The Quantum Code Examples topic compares Qiskit, PennyLane, and Cirq. The curriculum explicitly describes these as browser-based examples with representative outputs; the SDKs are not executed directly in the browser.', related: ['qiskit', 'pennylane', 'cirq'] },
  { id: 'ai-tutor', title: 'QubitLab Tutor', aliases: ['ai tutor', 'tutor', 'bot', 'chatbot', 'guide'], answer: 'The current QubitLab tutor is a local deterministic learning guide. It uses the project curriculum, quiz data, explicit concept mappings, circuit context, and code/debug heuristics. It does not claim unlimited LLM knowledge. The repository also contains an optional model-backed API path, but the main tutor does not depend on it.', related: ['personalized learning', 'assessment'] },
  { id: 'personalized-learning', title: 'Personalized Learning', aliases: ['personalized learning', 'personalised learning'], answer: 'The project describes personalized learning as adapting explanations and practice to the learner’s level. In the current implementation, the strongest concrete support is session progress, curriculum/quiz context, and the local tutor’s grounded explanations; it is not a full adaptive ML recommendation engine.', related: ['progress tracking', 'adaptive difficulty'] },
  { id: 'progress', title: 'Progress Tracking', aliases: ['progress tracking', 'learning progress', 'progress'], answer: 'QubitLab tracks completed topics and quiz-related progress for the active browser session. The current implementation uses session-scoped storage, so it is intentionally not a permanent account database.', related: ['assessment'] },
  { id: 'normalization', title: 'Normalization', aliases: ['normalization', 'normalize', 'normalized'], answer: 'A valid quantum state has total probability 1. QubitLab checks the state norm after applying the circuit and renormalizes the vector to reduce small floating-point drift without changing the physical probability ratios.', related: ['statevector', 'linear algebra'] },
  { id: 'no-cloning', title: 'No-Cloning Theorem', aliases: ['no cloning', 'no-cloning'], answer: 'The no-cloning theorem says an arbitrary unknown quantum state cannot be copied perfectly. It follows from the linearity of quantum mechanics.', related: ['entanglement'] },
  { id: 'teleportation', title: 'Quantum Teleportation', aliases: ['teleportation', 'quantum teleportation'], answer: 'Quantum teleportation transfers an unknown quantum state using shared entanglement plus classical communication. It does not copy the state; the original state is consumed by the protocol. QubitLab includes a small educational teleportation preset.', related: ['entanglement', 'cnot'] },
];

const normalize = (text: string) => text
  .toLowerCase()
  .replace(/[’']/g, "'")
  .replace(/[^a-z0-9+.#|⟩⟨_\-\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenSet = (text: string) => new Set(normalize(text).split(' ').filter((token) => token.length > 1));

const hasPhrase = (text: string, phrase: string) => normalize(text).includes(normalize(phrase));

const topicById = new Map(CURRICULUM_TOPICS.map((topic) => [topic.id, topic]));

function findCurriculumTopic(query: string) {
  const normalized = normalize(query);
  let best = { topic: null as (typeof CURRICULUM_TOPICS)[number] | null, score: 0 };
  for (const topic of CURRICULUM_TOPICS) {
    const candidates = [topic.title, topic.id, topic.tagline, ...topic.prerequisites];
    let score = 0;
    for (const candidate of candidates) {
      const c = normalize(candidate);
      if (normalized.includes(c)) score += c.length > 8 ? 8 : 4;
      const overlap = [...tokenSet(candidate)].filter((token) => tokenSet(query).has(token)).length;
      score += overlap * 1.5;
    }
    if (score > best.score) best = { topic, score };
  }
  return best.score >= 4 ? best.topic : null;
}

function findKnowledge(query: string) {
  const normalized = normalize(query);
  const queryTokens = tokenSet(query);
  let best: { card: KnowledgeCard | null; score: number } = { card: null, score: 0 };

  for (const card of KNOWLEDGE) {
    let score = 0;
    for (const alias of card.aliases) {
      const a = normalize(alias);
      if (normalized === a) score += 30;
      else if (normalized.includes(a)) score += a.length >= 6 ? 16 : 8;
      else {
        const overlap = [...tokenSet(alias)].filter((token) => queryTokens.has(token)).length;
        score += overlap * 3;
      }
    }
    // Penalize broad one-word matches so "what is phase?" does not accidentally beat a more exact topic.
    if (card.aliases.some((alias) => normalize(alias).split(' ').length === 1)) score -= 1;
    if (score > best.score) best = { card, score };
  }
  return best.score >= 7 ? best.card : null;
}

function detectIntent(query: string): Intent {
  const q = normalize(query);
  if (/^(hi|hello|hey|hey there|good morning|good afternoon|good evening)$/.test(q)) return 'greeting';
  if (/^(thanks|thank you|thx|ty|thankyou)$/.test(q)) return 'thanks';
  if (/(what is|what's|what are|which|list|show|tell me).*(syllabus|curriculum|topics|modules|chapters)/.test(q) || hasPhrase(q, 'what does this project teach')) return 'syllabus';
  if (/(what.*(gate|gates)|which.*(gate|gates)|supported.*gate|gate.*supported|used.*circuit|circuit.*use|simulator.*support|simulation.*support)/.test(q)) return 'simulator';
  if (/(debug|bug|error|exception|not working|fix|wrong output|issue|problem)/.test(q) && looksLikeCode(q)) return 'debug';
  if (/(explain|walk through|what does|what is wrong with|why.*code|code.*mean|understand.*code)/.test(q) && looksLikeCode(q)) return 'code';
  if (/(circuit|gate sequence|statevector|dirac|bloch|histogram)/.test(q) && /(explain|what|why|how|current|this)/.test(q)) return 'circuit';
  if (/(quiz|question|test me|practice)/.test(q)) return 'quiz';
  if (findCurriculumTopic(q)) return 'curriculumTopic';
  return 'unknown';
}

function looksLikeCode(text: string) {
  return /```|(^|\n)\s*(import|from|def|class|const|let|var|function)\b|QuantumCircuit|qiskit|pennylane|qml\.|cirq|\.h\(|\.cx\(|\.measure\(|\.rx\(|\.ry\(|\.rz\(/i.test(text);
}

function extractCode(text: string) {
  const fenced = text.match(/```(?:[a-zA-Z0-9_+-]+)?\s*([\s\S]*?)```/);
  if (fenced?.[1]?.trim()) return fenced[1].trim();
  const inline = text.match(/`([^`]+)`/);
  if (inline?.[1]?.trim()) return inline[1].trim();
  return text;
}

function syllabusAnswer() {
  const groups = new Map<string, typeof CURRICULUM_TOPICS>();
  for (const topic of CURRICULUM_TOPICS) {
    const list = groups.get(topic.category) ?? [];
    list.push(topic);
    groups.set(topic.category, list);
  }
  const labels: Record<string, string> = {
    foundations: 'Foundations', concepts: 'Core Concepts', gates: 'Gates & Circuits', math: 'Mathematics', visuals: 'Visuals & Bloch Sphere', algorithms: 'Quantum Algorithms', sandbox: 'Programming Sandbox',
  };
  const sections = [...groups.entries()].map(([category, topics]) => `${labels[category]}\n${topics.map((topic) => `• ${topic.title} — ${topic.difficulty}, ${topic.durationMin} min`).join('\n')}`).join('\n\n');
  return `Here is the syllabus currently defined in QubitLab:\n\n${sections}\n\nThe important distinction is that this is the learning syllabus, not a list of features that are all fully implemented in the simulator. Some algorithm topics are taught conceptually while the Circuit Composer currently focuses on small statevector circuits.`;
}

function simulatorAnswer() {
  return `The current Circuit Composer supports these gates:\n\n• H — Hadamard\n• X, Y, Z — Pauli gates\n• S, T — phase gates\n• RX, RY, RZ — parameterized rotations (radians)\n• CNOT / CX — controlled-X\n• CZ — controlled-Z\n• SWAP\n• CCNOT / Toffoli\n• MEASURE — a measurement marker in the circuit UI\n\nSimulation details:\n• 1–5 qubits\n• 4–12 circuit steps\n• starts from |0...0⟩\n• applies gates in step order using the local TypeScript statevector engine\n• computes amplitudes, probabilities, Dirac notation, Bloch vectors, single-qubit density matrices, an entanglement indicator, and sampled shot histograms\n• exports Qiskit, PennyLane, Cirq, and OpenQASM code\n\nImportant limitation: the MEASURE marker does not currently collapse the simulated state during gate evolution; the final histogram is sampled from the final pre-measurement statevector. Also, QFT, Shor, VQE, and QAOA are syllabus topics, not full dedicated simulator implementations.`;
}

function topicAnswer(topic: (typeof CURRICULUM_TOPICS)[number]) {
  return `${topic.title}\n\n${topic.description}\n\nWhat you should learn:\n${topic.learningObjectives.map((item) => `• ${item}`).join('\n')}\n\nLevel: ${topic.difficulty} · ${topic.durationMin} min\nPrerequisites: ${topic.prerequisites.length ? topic.prerequisites.join(', ') : 'None listed'}`;
}

function quizAnswer(query: string) {
  const topic = findCurriculumTopic(query);
  const pool = topic ? QUIZ_MOCKS[topic.id] : Object.values(QUIZ_MOCKS).flat();
  if (!pool?.length) return 'I could not find quiz data for that topic in the current project data.';
  const question = pool[0];
  const answerIndex = question.correctIndex ?? question.correctAnswer;
  const correct = answerIndex !== undefined ? question.options[answerIndex] : 'the marked correct option';
  return `Practice question${topic ? ` from ${topic.title}` : ''}:\n\n${question.question}\n\n${question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n')}\n\nAnswer: ${correct}\nWhy: ${question.explanation}`;
}

function explainCode(text: string) {
  const code = extractCode(text);
  const notes: string[] = [];
  if (/from\s+.*\s+import|^\s*import\s+/m.test(code)) notes.push('The import lines load the libraries used by the program.');
  if (/QuantumCircuit/i.test(code)) notes.push('QuantumCircuit creates the circuit/register structure in Qiskit.');
  if (/qml\./i.test(code)) notes.push('The qml calls are PennyLane operations or circuit constructs.');
  if (/cirq/i.test(code)) notes.push('The Cirq calls construct or simulate a quantum circuit using Cirq objects.');
  if (/\.h\(|hadamard/i.test(code)) notes.push('Hadamard creates or recombines superposition.');
  if (/\.x\(/i.test(code)) notes.push('X flips the computational-basis state of its target qubit.');
  if (/\.y\(/i.test(code)) notes.push('Y applies the Pauli-Y transformation.');
  if (/\.z\(/i.test(code)) notes.push('Z changes the phase of the |1⟩ component.');
  if (/\.cx\(|\.cnot\(/i.test(code)) notes.push('CNOT conditionally flips a target according to a control qubit.');
  if (/\.cz\(/i.test(code)) notes.push('CZ conditionally applies a Z phase.');
  if (/\.swap\(/i.test(code)) notes.push('SWAP exchanges two qubit states.');
  if (/\.rx\(|\.ry\(|\.rz\(/i.test(code)) notes.push('A rotation gate changes the qubit state by the supplied angle; these APIs normally use radians.');
  if (/measure/i.test(code)) notes.push('Measurement converts the quantum result into classical information.');
  if (/statevector|aer|simulate|backend|sampler/i.test(code)) notes.push('This section is concerned with simulation or execution and retrieving results.');
  if (/def\s+\w+\s*\(/.test(code)) notes.push('The def statement creates a reusable Python function.');
  if (/for\s+|while\s*\(/.test(code)) notes.push('The loop repeats a block of instructions.');
  if (!notes.length) notes.push('I can see code, but I do not recognize enough of its structure to explain it reliably from the local guide.');
  return `Let’s read it in execution order:\n\n${notes.map((note, i) => `${i + 1}. ${note}`).join('\n')}\n\nIf you want a line-by-line explanation, send the complete snippet and I’ll keep the explanation tied to the actual lines rather than guessing.`;
}

function debugCode(text: string) {
  const code = extractCode(text);
  const findings: string[] = [];
  if (/QuantumCircuit\(\s*0\s*\)/i.test(code)) findings.push('The circuit is created with 0 qubits. Use a positive number of qubits.');
  const circuitMatch = code.match(/QuantumCircuit\(\s*(\d+)/i);
  if (circuitMatch) {
    const count = Number(circuitMatch[1]);
    const indices = [...code.matchAll(/\.(?:h|x|y|z|s|t|rx|ry|rz|measure)\(\s*(\d+)/gi)].map((m) => Number(m[1]));
    const pairs = [...code.matchAll(/\.(?:cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)/gi)].flatMap((m) => [Number(m[1]), Number(m[2])]);
    const maxIndex = Math.max(-1, ...indices, ...pairs);
    if (maxIndex >= count) findings.push(`The circuit declares ${count} qubits, but q[${maxIndex}] is referenced. Valid indices are 0 through ${count - 1}.`);
  }
  const pairs = [...code.matchAll(/\.(?:cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)/gi)];
  if (pairs.some((m) => m[1] === m[2])) findings.push('A two-qubit operation uses the same qubit twice. Control/source and target must be different.');
  if (/qml\.|pennylane/i.test(code) && /QuantumCircuit|from qiskit/i.test(code)) findings.push('The snippet mixes PennyLane and Qiskit APIs. That is possible in an integration, but objects cannot usually be passed between the frameworks without an explicit conversion.');
  if (/cirq/i.test(code) && /QuantumCircuit|qiskit/i.test(code)) findings.push('The snippet mixes Cirq and Qiskit APIs. Check that each gate is being applied to the correct framework object.');
  if (/rx\(|ry\(|rz\(/i.test(code) && /(degrees|degree|°)/i.test(text)) findings.push('The code appears to use degree values with a rotation API. Most quantum SDK rotation APIs expect radians, so convert degrees when required.');
  const parens = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
  if (parens !== 0) findings.push('Parentheses are unbalanced in the supplied snippet.');
  if (!findings.length) findings.push('No obvious structural problem was detected by the local checks. That is not proof that the program is correct; the exact runtime error and expected output are still needed for a reliable diagnosis.');
  return `Debug check:\n\n${findings.map((finding) => `• ${finding}`).join('\n')}\n\nNext checks:\n1. Read the exact error message.\n2. Check the line number it reports.\n3. Compare expected and actual state/probabilities.\n4. Reduce the circuit to the smallest failing example.\n5. Run again after changing one thing at a time.`;
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string) {
  const ordered = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!ordered.length) return 'The circuit is empty. Add a gate and I can explain the resulting state and operation sequence.';
  const steps = ordered.map((gate) => {
    const target = `q${gate.targetQubit}`;
    if (gate.gate === 'CNOT' || gate.gate === 'CZ') return `${gate.gate} control q${gate.controlQubit} → target ${target}`;
    if (gate.gate === 'SWAP') return `SWAP ${target} ↔ q${gate.secondTarget}`;
    if (gate.gate === 'CCNOT') return `CCNOT controls q${gate.controlQubit}, q${gate.controlQubit2} → target ${target}`;
    if (gate.gate === 'RX' || gate.gate === 'RY' || gate.gate === 'RZ') return `${gate.gate}(${(gate.param ?? 0).toFixed(3)} rad) on ${target}`;
    return `${gate.gate} on ${target}`;
  });
  return `Circuit explanation\n\nQubits: ${circuit.numQubits} · Steps: ${circuit.numSteps}\n\nGate sequence:\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nCurrent state:\n${diracNotation}\n\nThe simulator applies these gates to the initial |${'0'.repeat(circuit.numQubits)}⟩ state, then derives probabilities and visualization data from the resulting statevector.`;
}

export function answerLocally(query: string): string {
  const q = query.trim();
  if (!q) return 'Ask me a quantum question, ask about the QubitLab syllabus, or paste code/error text.';

  const intent = detectIntent(q);
  if (intent === 'greeting') return 'Hey! Ask me about the QubitLab syllabus, a quantum concept, a gate, an algorithm, the simulator, or some quantum code.';
  if (intent === 'thanks') return 'You’re welcome. Send the next question when you’re ready.';
  if (intent === 'syllabus') return syllabusAnswer();
  if (intent === 'simulator') return simulatorAnswer();
  if (intent === 'quiz') return quizAnswer(q);
  if (intent === 'debug') return debugCode(q);
  if (intent === 'code') return explainCode(q);

  const curriculumTopic = findCurriculumTopic(q);
  if (intent === 'curriculumTopic' && curriculumTopic) return topicAnswer(curriculumTopic);

  const card = findKnowledge(q);
  if (card) {
    const deeper = card.related?.length ? `\n\nRelated in QubitLab: ${card.related.join(', ')}.` : '';
    return `${card.title}\n\n${card.answer}${deeper}`;
  }

  if (/(what can you do|help|commands|ask you)/i.test(q)) {
    return 'I can help with four things: (1) explain the QubitLab syllabus and individual topics, (2) explain gates and simulator behavior, (3) explain or debug quantum code, and (4) explain the current circuit when circuit context is provided. I will say when something is only a curriculum topic and not a fully implemented simulator feature.';
  }

  return `I don’t have a reliable grounded answer for that question in the current QubitLab learning data. I don’t want to invent an answer.\n\nTry asking about a specific syllabus topic, gate, algorithm, simulator feature, Qiskit/PennyLane/Cirq example, or paste the code/error you want checked.`;
}

export function getTutorContext() {
  return {
    curriculumTopicCount: CURRICULUM_TOPICS.length,
    curriculumTopics: CURRICULUM_TOPICS.map((topic) => ({ id: topic.id, title: topic.title, category: topic.category })),
    quizTopicCount: Object.keys(QUIZ_MOCKS).length,
    supportedSimulatorGates: ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ', 'CNOT', 'CZ', 'SWAP', 'CCNOT', 'MEASURE'],
  };
}
