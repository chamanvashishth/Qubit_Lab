import { CURRICULUM_TOPICS } from '../data/curriculum';
import { getQuizMock, QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type Card = { title: string; aliases: string[]; answer: string; related?: string[] };

// Grounded offline tutor: answers are deliberately limited to project curriculum/features.
const CARDS: Card[] = [
  { title: 'Classical vs Quantum Computing', aliases: ['classical vs quantum', 'classical computing', 'quantum computing'], answer: 'Classical computers use bits with definite 0/1 values. QubitLab introduces quantum computing through qubits, amplitudes, superposition, interference, entanglement and measurement. Quantum computing is a different computational model, not simply a faster classical computer.', related: ['Bits vs Qubits', 'Superposition'] },
  { title: 'Bits vs Qubits', aliases: ['bits vs qubits', 'bit vs qubit', 'qubit vs bit'], answer: 'A bit is 0 or 1. A qubit can be |ψ⟩ = α|0⟩ + β|1⟩ with |α|² + |β|² = 1. Complex amplitudes and relative phase are important because they control interference.', related: ['Bra-Ket Notation', 'Complex Numbers'] },
  { title: 'Bra-Ket Notation', aliases: ['bra ket', 'bra-ket', 'dirac notation', 'ket notation'], answer: 'A ket |ψ⟩ represents a state vector. A bra ⟨ψ| is its conjugate transpose. Inner products describe amplitudes/overlaps, while outer products form operators.', related: ['Bits vs Qubits', 'Linear Algebra'] },
  { title: 'Superposition', aliases: ['superposition', 'quantum superposition'], answer: 'Superposition means a state can be a linear combination of basis states. H|0⟩ = (|0⟩ + |1⟩)/√2 is the standard example. Measurement then samples an outcome according to amplitude squared.', related: ['Measurement', 'Hadamard'] },
  { title: 'Measurement & Born Rule', aliases: ['measurement', 'quantum measurement', 'wavefunction collapse', 'born rule'], answer: 'For |ψ⟩ = Σαᵢ|i⟩, the probability of outcome i is |αᵢ|². A projective measurement produces a classical result and normally projects the state onto the observed outcome.', related: ['Superposition', 'Probability Amplitudes'] },
  { title: 'Entanglement & Bell States', aliases: ['entanglement', 'entangled', 'bell state', 'bell states'], answer: 'Entanglement means the joint state cannot be written as independent states for the individual qubits. QubitLab demonstrates this with Bell and GHZ presets.', related: ['CNOT', 'Bloch Sphere'] },
  { title: 'Probability Amplitudes', aliases: ['probability amplitude', 'probability amplitudes', 'amplitudes'], answer: 'Amplitudes are generally complex. Squared magnitude gives measurement probability; relative phase can change later interference.', related: ['Complex Numbers', 'Measurement'] },
  { title: 'Pauli-X Gate', aliases: ['x gate', 'pauli x', 'pauli-x'], answer: 'X flips the computational basis: X|0⟩ = |1⟩ and X|1⟩ = |0⟩. Matrix [[0,1],[1,0]].', related: ['Single-Qubit Quantum Gates'] },
  { title: 'Pauli-Y Gate', aliases: ['y gate', 'pauli y', 'pauli-y'], answer: 'Y has matrix [[0,-i],[i,0]] and performs a π rotation around the Bloch Y axis with phase factors.', related: ['Single-Qubit Quantum Gates'] },
  { title: 'Pauli-Z Gate', aliases: ['z gate', 'pauli z', 'pauli-z', 'phase flip'], answer: 'Z leaves |0⟩ unchanged and maps |1⟩ to −|1⟩. Matrix [[1,0],[0,-1]].', related: ['Phase'] },
  { title: 'Hadamard Gate', aliases: ['hadamard', 'hadamard gate', 'h gate'], answer: 'H creates and recombines superposition. H|0⟩ = (|0⟩ + |1⟩)/√2 and H² = I.', related: ['Superposition', 'Interference'] },
  { title: 'S Gate', aliases: ['s gate'], answer: 'S applies a π/2 phase to |1⟩: |1⟩ → i|1⟩. It is supported by the QubitLab simulator.', related: ['Phase'] },
  { title: 'T Gate', aliases: ['t gate'], answer: 'T applies a π/4 phase to |1⟩: |1⟩ → e^(iπ/4)|1⟩. It is supported by the QubitLab simulator.', related: ['Phase'] },
  { title: 'RX Rotation', aliases: ['rx', 'rx gate', 'rotation x'], answer: 'RX(θ) rotates about X using the standard unitary cos(θ/2)I − i sin(θ/2)X. QubitLab interprets the parameter in radians.', related: ['Bloch Sphere'] },
  { title: 'RY Rotation', aliases: ['ry', 'ry gate', 'rotation y'], answer: 'RY(θ) rotates about Y and changes the amplitudes of |0⟩ and |1⟩.', related: ['Bloch Sphere'] },
  { title: 'RZ Rotation', aliases: ['rz', 'rz gate', 'rotation z'], answer: 'RZ(θ) rotates about Z and changes relative phase. Its effect can appear later through interference.', related: ['Phase', 'Bloch Sphere'] },
  { title: 'CNOT Gate', aliases: ['cnot', 'controlled not', 'cx', 'cx gate', 'controlled-x'], answer: 'CNOT has a control and target. When control = 1, X is applied to the target. H followed by CNOT is the standard Bell-state construction.', related: ['Entanglement', 'Multi-Qubit Gates'] },
  { title: 'CZ Gate', aliases: ['cz', 'controlled z', 'controlled-z'], answer: 'CZ applies Z conditionally. In the computational basis it changes the sign of |11⟩ and leaves the other basis states unchanged.', related: ['Phase'] },
  { title: 'SWAP Gate', aliases: ['swap', 'swap gate'], answer: 'SWAP exchanges the states of two qubits. QubitLab implements it directly in the statevector engine.', related: ['Multi-Qubit Gates'] },
  { title: 'CCNOT / Toffoli', aliases: ['ccnot', 'ccx', 'toffoli', 'toffoli gate'], answer: 'CCNOT has two controls and one target. The target flips only when both controls are 1. QubitLab supports it.', related: ['Multi-Qubit Gates'] },
  { title: 'Complex Numbers & Argand Plane', aliases: ['complex numbers', 'complex number', 'argand', 'argand plane', 'euler formula'], answer: 'Complex numbers a + bi provide the arithmetic for quantum amplitudes. The syllabus covers magnitude, phase, conjugation, Euler’s formula, and global versus relative phase.', related: ['Probability Amplitudes', 'Linear Algebra'] },
  { title: 'Linear Algebra & Unitary Matrices', aliases: ['linear algebra', 'matrices', 'matrix', 'unitary', 'unitary matrix', 'tensor product'], answer: 'The syllabus covers matrix multiplication, conjugate transpose, U†U = I, tensor products, eigenvalues and eigenvectors. Quantum gates are unitary transformations.', related: ['Complex Numbers', 'Statevector'] },
  { title: 'Bloch Sphere', aliases: ['bloch sphere', 'bloch', 'bloch vector'], answer: 'The Bloch sphere represents a single-qubit state geometrically. QubitLab calculates x, y, z, theta, phi, p0, p1 and purity for each simulated qubit.', related: ['Single-Qubit Quantum Gates', 'Entanglement'] },
  { title: 'Statevector Simulation', aliases: ['statevector', 'state vector', 'state vector simulation'], answer: 'QubitLab starts from |0...0⟩, applies gates in step order, renormalizes small floating-point drift, then derives amplitudes, probabilities, Dirac notation, Bloch vectors, density matrices, an entanglement indicator and sampled counts.', related: ['Measurement Histogram', 'Normalization'] },
  { title: 'Measurement Histogram', aliases: ['histogram', 'measurement histogram', 'shots'], answer: 'The simulator samples bitstrings from the final statevector probabilities. Increasing shots generally makes the observed frequencies closer to the underlying probabilities.', related: ['Measurement', 'Statevector Simulation'] },
  { title: 'Quantum Phase', aliases: ['phase', 'relative phase', 'global phase'], answer: 'Global phase does not change measurement probabilities. Relative phase can change interference and therefore later measurement outcomes.', related: ['Interference', 'RZ'] },
  { title: 'Quantum Interference', aliases: ['interference', 'constructive interference', 'destructive interference'], answer: 'Quantum amplitudes can reinforce or cancel. The algorithm lessons use this to explain amplitude amplification and Deutsch-Jozsa behavior.', related: ['Superposition', 'Grover'] },
  { title: 'Deutsch-Jozsa', aliases: ['deutsch-jozsa', 'deutsch jozsa', 'deutsch jozsa algorithm'], answer: 'Deutsch-Jozsa distinguishes a promised constant oracle from a balanced oracle using one ideal quantum query. The syllabus emphasizes phase kickback and interference. QubitLab has an educational Deutsch preset, not a general oracle compiler.', related: ['Interference', 'CNOT'] },
  { title: "Grover's Search", aliases: ['grover', 'grover search', 'grover algorithm'], answer: 'Grover uses an oracle plus amplitude amplification for roughly O(√N) queries. The syllabus covers the geometric rotation picture, diffuser, iteration count and overcooking. QubitLab has a small educational Grover preset, not a general arbitrary-size compiler.', related: ['Interference', 'Statevector Simulation'] },
  { title: 'Quantum Fourier Transform', aliases: ['qft', 'quantum fourier transform'], answer: 'QFT is taught as the quantum analogue of the discrete Fourier transform, including phase encoding and controlled-phase structure. It is a curriculum topic, not a dedicated QFT implementation in the current Circuit Composer.', related: ['Shor', 'Linear Algebra'] },
  { title: "Shor's Factoring Algorithm", aliases: ['shor', 'shor algorithm', 'factoring algorithm'], answer: 'The syllabus explains factoring through order finding and QFT, including an N=15 learning example. The current Circuit Composer does not implement a general Shor factoring engine.', related: ['QFT'] },
  { title: 'VQE & QAOA', aliases: ['vqe', 'qaoa', 'variational quantum algorithms'], answer: 'The syllabus introduces VQE and QAOA as hybrid quantum-classical methods. The current Composer has rotation gates but does not include a full optimizer, Hamiltonian evaluator or VQE/QAOA training loop.', related: ['RX', 'RY'] },
  { title: 'Qiskit', aliases: ['qiskit', 'qiskit aer', 'aer'], answer: 'Qiskit appears in the sandbox and export path. QubitLab generates Qiskit code, but the browser simulator itself uses QubitLab’s TypeScript statevector engine rather than executing Qiskit in the browser.', related: ['Quantum Code Examples'] },
  { title: 'PennyLane', aliases: ['pennylane'], answer: 'PennyLane appears in the sandbox and export path. QubitLab generates representative PennyLane code; the browser simulation is performed by the local TypeScript engine.', related: ['Quantum Code Examples'] },
  { title: 'Cirq', aliases: ['cirq'], answer: 'Cirq appears in the sandbox and export path. QubitLab generates representative Cirq code; it does not execute the Cirq SDK inside the browser simulator.', related: ['Quantum Code Examples'] },
  { title: 'Quantum Code Examples', aliases: ['quantum sandbox', 'sandbox', 'code examples'], answer: 'The sandbox compares Qiskit, PennyLane and Cirq. The curriculum explicitly describes these as browser-based examples with representative outputs, not SDK execution in the browser.', related: ['Qiskit', 'PennyLane', 'Cirq'] },
  { title: 'QubitLab Tutor', aliases: ['ai tutor', 'tutor', 'bot', 'chatbot', 'guide'], answer: 'The main tutor is a local deterministic guide grounded in the project curriculum, quiz data, circuit context and code/debug rules. It is not an unlimited LLM. An optional model-backed API exists separately in the repository.', related: ['Personalized Learning', 'Progress Tracking'] },
  { title: 'Personalized Learning', aliases: ['personalized learning', 'personalised learning'], answer: 'The project uses curriculum context, quiz performance and session progress to support a more guided learning experience. It is not a full ML recommendation engine.', related: ['Progress Tracking'] },
  { title: 'Progress Tracking', aliases: ['progress tracking', 'learning progress', 'progress'], answer: 'Completed topics and quiz progress are kept for the active browser session. The current implementation intentionally uses session-scoped storage rather than a permanent account database.', related: ['Assessment'] },
  { title: 'Normalization', aliases: ['normalization', 'normalize', 'normalized'], answer: 'A valid quantum state has total probability 1. The simulator renormalizes the statevector after operations to reduce tiny floating-point drift without changing physical probability ratios.', related: ['Statevector Simulation'] },
  { title: 'No-Cloning Theorem', aliases: ['no cloning', 'no-cloning'], answer: 'An arbitrary unknown quantum state cannot be copied perfectly. This follows from the linearity of quantum mechanics.', related: ['Entanglement'] },
  { title: 'Quantum Teleportation', aliases: ['teleportation', 'quantum teleportation'], answer: 'Teleportation transfers an unknown quantum state using shared entanglement and classical communication. It does not copy the state. QubitLab includes a small educational teleportation preset.', related: ['Entanglement', 'CNOT'] },
];

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9+.#|⟩⟨_\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (s: string) => new Set(norm(s).split(' ').filter((x) => x.length > 1));

function findCard(q: string) {
  const text = norm(q); const qt = tokens(q); let best: { card: Card | null; score: number } = { card: null, score: 0 };
  for (const card of CARDS) {
    let score = 0;
    for (const alias of card.aliases) {
      const a = norm(alias);
      if (text === a) score += 40;
      else if (text.includes(a)) score += a.length > 5 ? 18 : 8;
      else score += [...tokens(alias)].filter((t) => qt.has(t)).length * 3;
    }
    if (score > best.score) best = { card, score };
  }
  return best.score >= 7 ? best.card : null;
}

function findTopic(q: string) {
  const text = norm(q); const qt = tokens(q); let best: { topic: typeof CURRICULUM_TOPICS[number] | null; score: number } = { topic: null, score: 0 };
  for (const topic of CURRICULUM_TOPICS) {
    let score = 0;
    for (const value of [topic.title, topic.id, topic.tagline]) {
      const v = norm(value);
      if (text.includes(v)) score += v.length > 8 ? 12 : 6;
      score += [...tokens(value)].filter((t) => qt.has(t)).length * 1.5;
    }
    if (score > best.score) best = { topic, score };
  }
  return best.score >= 5 ? best.topic : null;
}

function syllabusAnswer() {
  const labels: Record<string, string> = { foundations: 'Foundations', concepts: 'Core Concepts', gates: 'Gates & Circuits', math: 'Mathematics', visuals: 'Visuals & Bloch Sphere', algorithms: 'Quantum Algorithms', sandbox: 'Programming Sandbox' };
  const groups = new Map<string, typeof CURRICULUM_TOPICS>();
  CURRICULUM_TOPICS.forEach((topic) => groups.set(topic.category, [...(groups.get(topic.category) ?? []), topic]));
  return `Current QubitLab syllabus:\n\n${[...groups.entries()].map(([key, topics]) => `${labels[key]}\n${topics.map((t) => `• ${t.title} — ${t.difficulty}, ${t.durationMin} min`).join('\n')}`).join('\n\n')}\n\nThe syllabus and the simulator feature set are intentionally different: some algorithms are taught conceptually rather than implemented as full general-purpose simulators.`;
}

function simulatorAnswer() {
  return `Current Circuit Composer gates:\n• H, X, Y, Z\n• S, T\n• RX, RY, RZ (radians)\n• CNOT / CX\n• CZ\n• SWAP\n• CCNOT / Toffoli\n• MEASURE marker\n\nEngine behavior: 1–5 qubits, 4–12 steps, initial |0...0⟩, step-ordered statevector evolution, normalization, probabilities, Dirac notation, Bloch vectors, single-qubit density matrices, entanglement indicator and sampled shot histogram. Exports: Qiskit, PennyLane, Cirq and OpenQASM.\n\nImportant: MEASURE is currently a circuit marker and does not collapse the evolving statevector. QFT, Shor, VQE and QAOA are syllabus topics, not full dedicated Circuit Composer implementations.`;
}

function quizForTopic(topicId?: string) {
  if (topicId) return getQuizMock(topicId);
  return QUIZ_MOCKS[0];
}

function quizAnswer(q: string) {
  const mock = quizForTopic(findTopic(q)?.id); if (!mock?.questions.length) return 'No quiz data was found for that topic.';
  const item = mock.questions[0]; const index = item.correctIndex ?? item.correctAnswer ?? 0;
  return `Practice question${mock.title ? ` — ${mock.title}` : ''}:\n\n${item.question}\n\n${item.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}\n\nAnswer: ${item.options[index]}\nWhy: ${item.explanation}`;
}

function quizHelp(q: string) {
  const all = QUIZ_MOCKS.flatMap((mock) => mock.questions); const text = norm(q); let best: { item: typeof all[number] | null; score: number } = { item: null, score: 0 };
  for (const item of all) {
    const score = text.includes(norm(item.question)) ? 100 : [...tokens(item.question)].filter((t) => text.includes(t)).length;
    if (score > best.score) best = { item, score };
  }
  if (!best.item || best.score < 5) return 'I could not match that quiz question to the current project data. Send the exact question text and I will explain it rather than guessing.';
  const index = best.item.correctIndex ?? best.item.correctAnswer ?? 0;
  return `For the exact quiz question:\n\n${best.item.question}\n\nCorrect answer: ${best.item.options[index]}\n\nWhy: ${best.item.explanation}`;
}

function extractCode(text: string) { const fenced = text.match(/```(?:\w+)?\s*([\s\S]*?)```/); if (fenced?.[1]) return fenced[1].trim(); const inline = text.match(/`([^`]+)`/); return inline?.[1]?.trim() ?? text; }
function looksCode(text: string) { return /```|QuantumCircuit|qiskit|pennylane|qml\.|cirq|(^|\n)\s*(import|from|def|class|const|let|var|function)\b|\.h\(|\.cx\(|\.measure\(|\.rx\(|\.ry\(|\.rz\(/i.test(text); }

function explainCode(text: string) {
  const code = extractCode(text); const notes: string[] = [];
  if (/QuantumCircuit/i.test(code)) notes.push('QuantumCircuit creates the Qiskit circuit/register structure.');
  if (/qml\./i.test(code)) notes.push('qml operations are PennyLane circuit operations.');
  if (/cirq/i.test(code)) notes.push('Cirq objects construct or simulate the circuit.');
  if (/\.h\(/i.test(code)) notes.push('H creates/recombines superposition.');
  if (/\.x\(/i.test(code)) notes.push('X flips the target qubit.');
  if (/\.y\(/i.test(code)) notes.push('Y applies the Pauli-Y transformation.');
  if (/\.z\(/i.test(code)) notes.push('Z changes the phase of |1⟩.');
  if (/\.cx\(|\.cnot\(/i.test(code)) notes.push('CNOT conditionally flips its target.');
  if (/\.cz\(/i.test(code)) notes.push('CZ conditionally applies a Z phase.');
  if (/\.swap\(/i.test(code)) notes.push('SWAP exchanges two qubit states.');
  if (/\.rx\(|\.ry\(|\.rz\(/i.test(code)) notes.push('A rotation changes the state by the supplied angle; these APIs normally use radians.');
  if (/measure/i.test(code)) notes.push('Measurement converts quantum information into classical results.');
  if (/statevector|aer|backend|simulate/i.test(code)) notes.push('This part is concerned with simulation/execution and retrieving results.');
  return `Code walkthrough:\n\n${(notes.length ? notes : ['I can see code, but the local guide does not recognize enough structure to explain it reliably.']).map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\nFor a line-by-line explanation, provide the complete snippet.`;
}

function debugCode(text: string) {
  const code = extractCode(text); const findings: string[] = [];
  const match = code.match(/QuantumCircuit\(\s*(\d+)/i);
  if (/QuantumCircuit\(\s*0\s*\)/i.test(code)) findings.push('QuantumCircuit has 0 qubits.');
  if (match) {
    const count = Number(match[1]); const indices = [...code.matchAll(/\.(?:h|x|y|z|s|t|rx|ry|rz|measure)\(\s*(\d+)/gi)].map((m) => Number(m[1]));
    const pairs = [...code.matchAll(/\.(?:cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)/gi)].flatMap((m) => [Number(m[1]), Number(m[2])]);
    const maxIndex = Math.max(-1, ...indices, ...pairs); if (maxIndex >= count) findings.push(`The circuit declares ${count} qubits but references q[${maxIndex}].`);
  }
  const pairs = [...code.matchAll(/\.(?:cx|cnot|cz|swap)\(\s*(\d+)\s*,\s*(\d+)/gi)]; if (pairs.some((m) => m[1] === m[2])) findings.push('A two-qubit gate uses the same qubit twice.');
  if (/qml\.|pennylane/i.test(code) && /QuantumCircuit|qiskit/i.test(code)) findings.push('Qiskit and PennyLane APIs are mixed; explicit conversion may be required.');
  if (/cirq/i.test(code) && /QuantumCircuit|qiskit/i.test(code)) findings.push('Cirq and Qiskit APIs are mixed; verify object types.');
  if (/rx\(|ry\(|rz\(/i.test(code) && /(degrees|degree|°)/i.test(text)) findings.push('Rotation angles appear to be in degrees; most SDK APIs expect radians.');
  return `Debug check:\n\n${(findings.length ? findings : ['No obvious structural bug was found by the local checks.']).map((f) => `• ${f}`).join('\n')}\n\nNext: inspect the exact runtime error, line number, expected result and actual result, then reduce the circuit to the smallest failing example.`;
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string) {
  const gates = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!gates.length) return 'The circuit is empty. Add a gate first.';
  const lines = gates.map((g, i) => {
    if (g.gate === 'CNOT' || g.gate === 'CZ') return `${i + 1}. ${g.gate}: control q${g.controlQubit} → target q${g.targetQubit}`;
    if (g.gate === 'SWAP') return `${i + 1}. SWAP: q${g.targetQubit} ↔ q${g.secondTarget}`;
    if (g.gate === 'CCNOT') return `${i + 1}. CCNOT: controls q${g.controlQubit}, q${g.controlQubit2} → q${g.targetQubit}`;
    if (/^R[XYZ]$/.test(g.gate)) return `${i + 1}. ${g.gate}(${(g.param ?? 0).toFixed(3)} rad) on q${g.targetQubit}`;
    return `${i + 1}. ${g.gate} on q${g.targetQubit}`;
  });
  return `Circuit explanation\n\n${circuit.numQubits} qubits · ${circuit.numSteps} steps\n\n${lines.join('\n')}\n\nCurrent state: ${diracNotation}\n\nThe engine starts at |${'0'.repeat(circuit.numQubits)}⟩ and derives probabilities/visualization data from the resulting statevector.`;
}

function circuitPrompt(text: string) {
  const qubits = Number(text.match(/Number of qubits:\s*(\d+)/i)?.[1] ?? 0); const gatesText = text.match(/Gates applied:\s*([^\n]+)/i)?.[1]?.trim() ?? ''; const state = text.match(/Dirac notation:\s*\|?ψ⟩?\s*=\s*([^\n]+)/i)?.[1]?.trim();
  if (!qubits || !gatesText) return null;
  const gates = gatesText.split(',').map((x) => x.trim()).filter(Boolean); const multi = gates.some((x) => /CNOT|CZ|SWAP|CCNOT/i.test(x));
  return `Circuit analysis\n\n${qubits} qubits · ${gates.length} listed operations\n\n${gates.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\n${multi ? 'A multi-qubit operation is present, so correlations/entanglement may be generated depending on the state.' : 'Only single-qubit operations are listed, so an initially separable |0...0⟩ state remains separable.'}\n\nResulting statevector: ${state ?? 'not supplied'}\n\nThis answer is based on the actual circuit data sent by the Composer.`;
}

export function answerLocally(query: string): string {
  const q = query.trim(); if (!q) return 'Ask me about the QubitLab syllabus, a quantum concept, a gate, the simulator, a quiz question, or quantum code.';
  const n = norm(q);
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(n)) return 'Hey! Ask me about the QubitLab syllabus, a quantum concept, a gate, an algorithm, the simulator, or some quantum code.';
  if (/^(thanks|thank you|thx|ty)$/.test(n)) return 'You’re welcome. Send the next question when you’re ready.';
  if (/(what is|what are|which|list|show|tell me).*(syllabus|curriculum|topics|modules|chapters)/.test(n)) return syllabusAnswer();
  if (/(supported|support|used).*(gate|gates|circuit|simulation)|what.*gate.*(simulator|circuit)|what.*used.*in.*circuit/.test(n)) return simulatorAnswer();
  if (/i am reviewing this quantum quiz question|quiz question:/.test(n)) return quizHelp(q);
  if (/(debug|bug|error|exception|not working|fix|wrong output|issue|problem)/.test(n) && looksCode(q)) return debugCode(q);
  if (/(explain|walk through|what does|understand).*code/.test(n) && looksCode(q)) return explainCode(q);
  if (/(circuit|gate sequence|statevector|dirac|bloch|histogram)/.test(n) && /(explain|what|why|how|current|this)/.test(n)) return circuitPrompt(q) ?? 'Use the Composer’s circuit explanation action so I can use the exact circuit data.';
  if (/(quiz|test me|practice)/.test(n)) return quizAnswer(q);
  const topic = findTopic(q); if (topic && (n.includes(norm(topic.title)) || n.includes(norm(topic.id)))) return `${topic.title}\n\n${topic.description}\n\nWhat you should learn:\n${topic.learningObjectives.map((x) => `• ${x}`).join('\n')}\n\nLevel: ${topic.difficulty} · ${topic.durationMin} min\nPrerequisites: ${topic.prerequisites.length ? topic.prerequisites.join(', ') : 'None listed'}`;
  const card = findCard(q); if (card) return `${card.title}\n\n${card.answer}${card.related?.length ? `\n\nRelated in QubitLab: ${card.related.join(', ')}.` : ''}`;
  if (/(what can you do|help|commands|ask you)/.test(n)) return 'I can explain the project syllabus, teach its concepts and gates, describe the exact simulator feature set, explain/debug quantum code, answer quiz questions from project data, and analyze the current circuit when circuit context is supplied. I will not pretend that a curriculum topic is a fully implemented simulator feature.';
  return 'I do not have a reliable grounded answer for that in the current QubitLab data, so I will not invent one. Ask about a syllabus topic, gate, algorithm, simulator feature, Qiskit/PennyLane/Cirq example, or paste the code/error.';
}

export function getTutorContext() {
  return { curriculumTopicCount: CURRICULUM_TOPICS.length, curriculumTopics: CURRICULUM_TOPICS.map((t) => ({ id: t.id, title: t.title, category: t.category })), quizMockCount: QUIZ_MOCKS.length, supportedSimulatorGates: ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ', 'CNOT', 'CZ', 'SWAP', 'CCNOT', 'MEASURE'] };
}
