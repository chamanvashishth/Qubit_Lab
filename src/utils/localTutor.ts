import { CURRICULUM_TOPICS } from '../data/curriculum';
import { QUIZ_MOCKS } from '../data/mockQuizzes';
import { CircuitState } from '../types/quantum';

type KnowledgeCard = { keywords: string[]; title: string; answer: string };

// Offline learning knowledge for the QubitLab syllabus.
const KNOWLEDGE: KnowledgeCard[] = [
  { keywords: ['classical computing', 'classical computer'], title: 'Classical Computing', answer: 'Think of a normal computer as a system built around definite 0s and 1s. Bits are processed with logic gates, stored in memory, and combined to run programs.' },
  { keywords: ['quantum computing', 'quantum computer'], title: 'Quantum Computing', answer: 'Quantum computers work with qubits. A qubit can use superposition, entanglement, and interference, which gives quantum algorithms a different way to process information. The advantage is problem-dependent, not “faster for everything.”' },
  { keywords: ['bits vs qubits', 'bit vs qubit'], title: 'Bits vs Qubits', answer: 'A bit is either 0 or 1. A qubit can be in a state α|0⟩ + β|1⟩ before measurement. The important extra information is in the amplitudes and their relative phase, not simply “0 and 1 at the same time.”' },
  { keywords: ['quantum information'], title: 'Quantum Information', answer: 'Quantum information is information encoded in quantum states. Qubits, gates, measurement, entanglement, and quantum channels are the main building blocks.' },
  { keywords: ['bra ket', 'bra-ket', 'dirac notation', 'ket notation'], title: 'Bra-Ket Notation', answer: 'Bra-ket notation is a compact language for quantum states. A ket such as |ψ⟩ represents a state vector, while ⟨ψ| is its conjugate transpose. For example, |ψ⟩ = α|0⟩ + β|1⟩.' },
  { keywords: ['qubit', 'quantum bit'], title: 'Qubit', answer: 'A qubit is the basic unit of quantum information. Its general single-qubit state is |ψ⟩ = α|0⟩ + β|1⟩, with |α|² + |β|² = 1.' },
  { keywords: ['quantum state', 'quantum states'], title: 'Quantum States', answer: 'A quantum state describes everything needed to predict the outcomes of measurements on a quantum system. For n qubits, the statevector has 2ⁿ complex amplitudes.' },
  { keywords: ['superposition'], title: 'Superposition', answer: 'Superposition means a quantum state can be a combination of basis states. For example, H|0⟩ = (|0⟩ + |1⟩)/√2. Measuring it gives 0 or 1 according to the corresponding probabilities.' },
  { keywords: ['measurement', 'measure', 'born rule'], title: 'Measurement', answer: 'Measurement turns quantum information into a classical result. If |ψ⟩ = Σ αᵢ|i⟩, the probability of observing |i⟩ is |αᵢ|². After a projective measurement, the state is projected according to the observed outcome.' },
  { keywords: ['probability amplitude', 'probability amplitudes'], title: 'Probability Amplitudes', answer: 'Amplitudes are usually complex numbers. Their squared magnitudes give measurement probabilities, while their phases affect interference.' },
  { keywords: ['entanglement', 'entangled'], title: 'Entanglement', answer: 'Entanglement means the joint state of two or more systems cannot be separated into independent states for each part. This creates quantum correlations that are stronger than ordinary independent-state descriptions.' },
  { keywords: ['x gate', 'pauli x'], title: 'X Gate', answer: 'X is the bit-flip gate: |0⟩ becomes |1⟩ and |1⟩ becomes |0⟩. Matrix: [[0,1],[1,0]].' },
  { keywords: ['y gate', 'pauli y'], title: 'Y Gate', answer: 'Y rotates a qubit around the Bloch-sphere Y axis by π and adds phase factors. Matrix: [[0,-i],[i,0]].' },
  { keywords: ['z gate', 'pauli z'], title: 'Z Gate', answer: 'Z is a phase-flip gate. It leaves |0⟩ unchanged and maps |1⟩ to -|1⟩. Matrix: [[1,0],[0,-1]].' },
  { keywords: ['hadamard', 'hadamard gate', 'h gate'], title: 'Hadamard Gate', answer: 'H is a great “starter” gate because it creates equal superposition from |0⟩: H|0⟩ = (|0⟩ + |1⟩)/√2. Applying H again returns the original basis state.' },
  { keywords: ['s gate'], title: 'S Gate', answer: 'S adds a π/2 phase to the |1⟩ component: |1⟩ → i|1⟩. It is a phase gate and is related to an RZ(π/2) rotation up to global phase convention.' },
  { keywords: ['t gate'], title: 'T Gate', answer: 'T adds a π/4 phase to the |1⟩ component: |1⟩ → e^{iπ/4}|1⟩. It is a non-Clifford gate used in universal quantum computation.' },
  { keywords: ['rx', 'rx gate', 'rotation x'], title: 'RX Gate', answer: 'RX(θ) rotates a qubit around the X axis by θ. In QubitLab, θ is represented in radians.' },
  { keywords: ['ry', 'ry gate', 'rotation y'], title: 'RY Gate', answer: 'RY(θ) rotates a qubit around the Y axis by θ. It changes the amplitudes of |0⟩ and |1⟩ and is useful for preparing different probabilities.' },
  { keywords: ['rz', 'rz gate', 'rotation z'], title: 'RZ Gate', answer: 'RZ(θ) rotates around the Z axis. It changes relative phase, so its effect may become visible in later interference even when immediate computational-basis probabilities do not change.' },
  { keywords: ['cnot', 'controlled not', 'cx gate'], title: 'CNOT', answer: 'CNOT has a control and a target. If the control is |1⟩, the target is flipped; if the control is |0⟩, the target is left alone. H on one qubit followed by CNOT is the classic Bell-state example.' },
  { keywords: ['cz', 'controlled z'], title: 'CZ', answer: 'CZ applies a Z phase conditionally. In the computational basis, |11⟩ gets a minus sign while the other basis states are unchanged.' },
  { keywords: ['swap gate', 'swap'], title: 'SWAP', answer: 'SWAP exchanges two qubit states: |a⟩|b⟩ becomes |b⟩|a⟩. A SWAP can also be decomposed into three CNOT gates.' },
  { keywords: ['controlled gate', 'controlled gates'], title: 'Controlled Gates', answer: 'A controlled gate applies an operation to a target only when its control condition is satisfied. CNOT and CZ are common examples; QubitLab also supports CCNOT.' },
  { keywords: ['circuit design', 'quantum circuit'], title: 'Circuit Design', answer: 'Build a circuit by choosing qubits, applying gates in time order, checking the simulated state, and measuring when you want classical outcomes. For debugging, inspect one operation at a time instead of changing everything at once.' },
  { keywords: ['vectors', 'vector'], title: 'Vectors', answer: 'A vector is an ordered list of values. In quantum computing, a statevector stores the amplitudes of the computational-basis states. One qubit has 2 amplitudes; n qubits have 2ⁿ.' },
  { keywords: ['matrices', 'matrix'], title: 'Matrices', answer: 'Matrices represent linear transformations. Quantum gates are represented by matrices, and applying a gate means multiplying that matrix by the current statevector.' },
  { keywords: ['complex numbers', 'complex number'], title: 'Complex Numbers', answer: 'A complex number has a real and imaginary part, a + bi. Quantum amplitudes use complex numbers because phase and interference matter.' },
  { keywords: ['matrix multiplication'], title: 'Matrix Multiplication', answer: 'Matrix multiplication composes transformations. If A happens first and B happens second, the resulting state is B A |ψ⟩.' },
  { keywords: ['unitary matrix', 'unitary matrices', 'unitary'], title: 'Unitary Matrices', answer: 'A unitary matrix satisfies U†U = I. Quantum gates use unitary transformations before measurement, which preserve the state norm.' },
  { keywords: ['tensor product', 'tensor products'], title: 'Tensor Products', answer: 'Tensor products combine the state spaces of separate systems. Two qubits need 4 basis amplitudes: |00⟩, |01⟩, |10⟩, |11⟩.' },
  { keywords: ['state vector', 'statevector'], title: 'State Vectors', answer: 'A statevector contains one complex amplitude for each computational-basis state. QubitLab uses the simulated statevector to calculate probabilities and display the current quantum state.' },
  { keywords: ['probability distribution', 'probability distributions'], title: 'Probability Distributions', answer: 'A probability distribution tells you how likely each measurement outcome is. For a statevector, probability is the squared magnitude of each amplitude.' },
  { keywords: ['histogram', 'histograms'], title: 'Measurement Histograms', answer: 'A histogram shows the outcomes of repeated simulated measurements. More shots usually make the observed frequencies look closer to the underlying probabilities.' },
  { keywords: ['bloch sphere', 'bloch'], title: 'Bloch Sphere', answer: 'The Bloch sphere gives a geometric picture of a single-qubit pure state. |0⟩ and |1⟩ sit at opposite poles, while other points represent superpositions and relative phase.' },
  { keywords: ['state evolution'], title: 'State Evolution', answer: 'State evolution is simply the state changing as gates are applied. QubitLab recomputes the state after circuit edits so you can see what each operation does.' },
  { keywords: ['deutsch', 'deutsch algorithm'], title: 'Deutsch Algorithm', answer: 'Deutsch’s algorithm decides whether a promised one-bit Boolean function is constant or balanced with one oracle query. It is a compact example of superposition, phase kickback, interference, and measurement.' },
  { keywords: ['deutsch jozsa', 'deutsch-jozsa'], title: 'Deutsch-Jozsa Algorithm', answer: 'Deutsch-Jozsa distinguishes a promised constant function from a balanced one using a single oracle query in the ideal quantum model. It demonstrates how interference can reveal a global property.' },
  { keywords: ['bernstein vazirani', 'bernstein-vazirani'], title: 'Bernstein-Vazirani Algorithm', answer: 'Bernstein-Vazirani finds a hidden bit string encoded in a linear Boolean function using one oracle query in the ideal model.' },
  { keywords: ['grover', 'grover algorithm'], title: 'Grover Algorithm', answer: 'Grover search uses an oracle and amplitude amplification to find a marked item in an unstructured space in about O(√N) queries, versus O(N) for straightforward exhaustive search.' },
  { keywords: ['qft', 'quantum fourier transform'], title: 'Quantum Fourier Transform', answer: 'QFT is the quantum analogue of the discrete Fourier transform. It is a key subroutine in several quantum algorithms, including Shor’s algorithm.' },
  { keywords: ['shor', 'shor algorithm'], title: 'Shor Algorithm', answer: 'Shor’s algorithm uses quantum period finding and the QFT to factor integers efficiently in the ideal fault-tolerant model. That is why it matters in cryptography discussions.' },
  { keywords: ['vqe', 'variational quantum eigensolver'], title: 'VQE', answer: 'VQE is a hybrid quantum-classical method. A parameterized circuit prepares a trial state, the quantum side estimates an objective such as energy, and a classical optimizer updates the parameters.' },
  { keywords: ['qaoa', 'quantum approximate optimization algorithm'], title: 'QAOA', answer: 'QAOA is a hybrid variational algorithm for combinatorial optimization. It alternates problem and mixing operations while a classical optimizer tunes the circuit parameters.' },
  { keywords: ['qiskit'], title: 'Qiskit', answer: 'Qiskit is an open-source quantum software framework associated with IBM’s quantum platform. It supports circuit construction, transpilation, simulation, and execution workflows.' },
  { keywords: ['qiskit aer', 'aer'], title: 'Qiskit Aer', answer: 'Qiskit Aer provides simulators for quantum circuits. It is useful for testing circuits and studying results before using quantum hardware.' },
  { keywords: ['pennylane'], title: 'PennyLane', answer: 'PennyLane is a quantum-machine-learning and differentiable programming framework. It is especially useful for parameterized circuits and hybrid quantum-classical models.' },
  { keywords: ['cirq'], title: 'Cirq', answer: 'Cirq is a Python framework for building, simulating, and experimenting with quantum circuits.' },
  { keywords: ['qbraid', 'q-braid'], title: 'qBraid', answer: 'qBraid provides a quantum development environment and tooling that can connect workflows across different quantum software and execution backends.' },
  { keywords: ['ai tutor'], title: 'AI Tutor', answer: 'An AI tutor adds a conversational layer to learning: it can explain ideas, answer questions, give hints, and guide practice. QubitLab keeps its core guide local and deterministic.' },
  { keywords: ['ai code generation', 'code generation'], title: 'AI Code Generation', answer: 'AI code generation turns a natural-language request into starter code or translates a circuit into an SDK such as Qiskit, PennyLane, or Cirq. Generated code should always be reviewed and tested.' },
  { keywords: ['ai debugging', 'debugging', 'debug quantum code'], title: 'AI Debugging', answer: 'AI-assisted debugging can inspect an error and code together, explain the likely cause, suggest a fix, and guide the learner through verification. It should be treated as a debugging assistant, not as a replacement for actually running tests.' },
  { keywords: ['circuit explanation', 'explain circuit'], title: 'Circuit Explanation', answer: 'Circuit explanation translates a gate sequence into plain language: what each gate touches, what it changes, and how the final state or measurement should be interpreted.' },
  { keywords: ['personalized learning', 'personalised learning'], title: 'Personalized Learning', answer: 'Personalized learning adapts explanations and practice to what the learner already understands. A beginner can get intuition first, while a stronger learner can move to matrices and derivations.' },
  { keywords: ['adaptive difficulty', 'adaptive learning'], title: 'Adaptive Difficulty', answer: 'Adaptive difficulty changes the level of practice according to recent performance. Repeated mistakes can trigger easier explanations or prerequisites; consistent success can unlock harder problems.' },
  { keywords: ['assessment', 'assessments'], title: 'Assessments', answer: 'Good assessments check understanding, not just memorization. Quantum practice can combine definitions, state reasoning, gate questions, and small circuit-building tasks.' },
  { keywords: ['progress tracking', 'learning progress'], title: 'Progress Tracking', answer: 'Progress tracking records learning signals such as completed topics and quiz performance. QubitLab keeps this progress for the active browser session.' },
  { keywords: ['normalization'], title: 'Normalization', answer: 'A valid quantum state has total probability 1. For n qubits, the probabilities of all 2ⁿ basis states must add to 1. Numerical simulation may renormalize tiny floating-point errors.' },
  { keywords: ['phase', 'relative phase', 'global phase'], title: 'Quantum Phase', answer: 'Global phase does not change measurement probabilities. Relative phase can change interference, so it can affect later measurement outcomes.' },
  { keywords: ['interference'], title: 'Interference', answer: 'Quantum amplitudes can reinforce or cancel. Quantum algorithms use this to increase useful outcomes and suppress unwanted ones.' },
  { keywords: ['no cloning', 'no-cloning'], title: 'No-Cloning Theorem', answer: 'An arbitrary unknown quantum state cannot be copied perfectly. This is a basic consequence of the linearity of quantum mechanics.' },
  { keywords: ['quantum teleportation', 'teleportation'], title: 'Quantum Teleportation', answer: 'Quantum teleportation transfers an unknown state using shared entanglement and two classical bits. It does not copy the state; the original quantum state is consumed by the protocol.' },
  { keywords: ['python'], title: 'Python', answer: 'Python is widely used in scientific computing and quantum software. Qiskit, PennyLane, and Cirq all expose Python APIs.' },
  { keywords: ['machine learning', 'ml'], title: 'Machine Learning', answer: 'Machine learning learns patterns from examples by adjusting model parameters. A simple workflow is prepare data → train → validate → evaluate.' },
  { keywords: ['neural network', 'neural networks', 'deep learning'], title: 'Neural Networks', answer: 'A neural network learns parameters for a sequence of transformations. Training usually adjusts those parameters to reduce a loss using optimization and backpropagation.' },
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
    return `Here’s the result: ${Number.isInteger(value) ? value : Number(value.toFixed(8))}.`;
  } catch { return null; }
};

const extractCode = (query: string): string | null => {
  const fenced = query.match(/```(?:[a-zA-Z0-9_+-]+)?\s*([\s\S]*?)```/);
  if (fenced?.[1]?.trim()) return fenced[1].trim();
  const inline = query.match(/`([^`]+)`/);
  if (inline?.[1]?.trim()) return inline[1].trim();
  const lines = query.split('\n').map((line) => line.trim()).filter(Boolean);
  const codeLike = lines.filter((line) => /[{};]|=>|def |import |from |const |let |function |return |print\(|console\.|qiskit|pennylane|cirq|numpy|QuantumCircuit|qml\./i.test(line));
  return codeLike.length >= 2 ? codeLike.join('\n') : null;
};

const detectQuantumCodeIssues = (code: string): string[] => {
  const issues: string[] = [];
  const lower = code.toLowerCase();
  const quantum = /qiskit|quantumcircuit|pennylane|qml\.|cirq/i.test(code);
  if (!quantum) return issues;

  if (/QuantumCircuit\(\s*0\s*\)/i.test(code)) issues.push('The circuit is created with 0 qubits, so a gate cannot be applied to a qubit index.');
  if (/QuantumCircuit\(\s*1\s*\)/i.test(code) && /\.(?:cx|cnot|cz|swap)\s*\(\s*0\s*,\s*1\s*\)/i.test(code)) issues.push('The circuit appears to have only 1 qubit but a two-qubit operation uses qubit 1.');
  if (/\.cx\s*\(\s*(\d+)\s*,\s*\1\s*\)/i.test(code)) issues.push('CNOT uses the same qubit as control and target. A qubit cannot fill both roles in one CNOT.');
  if (/\.cz\s*\(\s*(\d+)\s*,\s*\1\s*\)/i.test(code)) issues.push('CZ uses the same qubit as both control and target. Use two different qubits.');
  if (/\.swap\s*\(\s*(\d+)\s*,\s*\1\s*\)/i.test(code)) issues.push('SWAP is being asked to swap a qubit with itself. Use two different qubit indices.');
  if (/\.(?:rx|ry|rz)\s*\(\s*([0-9.]+)\s*\)/i.test(code) && /degree|degrees/i.test(code)) issues.push('The rotation gate API expects radians in the usual quantum SDK convention. Convert degrees to radians when needed.');
  if (/measure_all\s*\(\s*\)/i.test(code) && /Statevector|statevector/i.test(code)) issues.push('Be careful when interpreting a statevector after measurement: measurement changes the quantum state, while a pre-measurement statevector describes the state before collapse.');
  if (/\b(qc|circuit)\.measure\s*\(\s*([^,]+)\s*,\s*\2\s*\)/i.test(code)) issues.push('The same index is used for a qubit and classical bit in this measurement call. That is legal in some APIs, but verify that this is intentional.');
  if (/\b(qc|circuit)\.h\s*\(\s*(\d+)\s*\)/i.test(code) && /QuantumCircuit\(\s*(\d+)\s*\)/i.test(code)) {
    const q = Number(code.match(/\.h\s*\(\s*(\d+)\s*\)/i)?.[1]);
    const n = Number(code.match(/QuantumCircuit\(\s*(\d+)\s*\)/i)?.[1]);
    if (Number.isFinite(q) && Number.isFinite(n) && q >= n) issues.push(`The H gate targets q[${q}], but the circuit appears to contain only ${n} qubit${n === 1 ? '' : 's'}.`);
  }
  if (/QuantumCircuit\(\s*(\d+)\s*\)/i.test(code)) {
    const n = Number(code.match(/QuantumCircuit\(\s*(\d+)\s*\)/i)?.[1]);
    const indices = [...code.matchAll(/\.(?:h|x|y|z|s|t|rx|ry|rz|measure|cx|cnot|cz|swap)\s*\(([^)]*)\)/gi)].flatMap((m) => [...m[1].matchAll(/\b\d+\b/g)].map((x) => Number(x[0])));
    if (Number.isFinite(n) && indices.some((index) => index >= n)) issues.push(`At least one operation uses a qubit index outside 0–${n - 1}.`);
  }
  if (/import\s+qiskit/i.test(code) && /QuantumCircuit/i.test(code) && !/from\s+qiskit\s+import\s+QuantumCircuit/i.test(code) && !/qiskit\.QuantumCircuit/i.test(code)) issues.push('Check the Qiskit import. If you use QuantumCircuit directly, the common form is `from qiskit import QuantumCircuit`.');
  if (/qml\.qnode/i.test(code) && /qml\.device/i.test(code) && !/return\s+/i.test(code)) issues.push('A PennyLane QNode normally returns a measurement or expectation value. Check that the quantum function has a return statement.');
  if (/cirq\.Circuit/i.test(code) && /measure/i.test(lower) && !/cirq\.measure/i.test(code)) issues.push('For Cirq, verify that measurement is added as a Cirq operation such as `cirq.measure(...)`, rather than using a Qiskit-style measurement API.');
  return issues;
};

const explainCode = (query: string): string | null => {
  const code = extractCode(query);
  if (!code) return null;
  const issues = detectQuantumCodeIssues(code);
  const lines = code.split('\n').filter((line) => line.trim());
  const notes: string[] = [];
  if (/^\s*import\s+|^\s*from\s+.*\s+import\s+/m.test(code)) notes.push('Imports load the libraries or functions the program needs.');
  if (/QuantumCircuit\s*\(/i.test(code)) notes.push('`QuantumCircuit(...)` creates the circuit and defines how many qubits and, when specified, classical bits it contains.');
  if (/def\s+\w+\s*\(/.test(code)) notes.push('`def` creates a Python function; the indented block runs when that function is called.');
  if (/function\s+\w+\s*\(|=>/.test(code)) notes.push('This defines a JavaScript/TypeScript function for reusable logic.');
  if (/\.h\(|\.x\(|\.y\(|\.z\(|\.s\(|\.t\(|\.rx\(|\.ry\(|\.rz\(/i.test(code)) notes.push('These calls apply single-qubit gates. The argument identifies the target qubit, and rotation gates also take an angle.');
  if (/\.cx\(|\.cnot\(|\.cz\(|\.swap\(/i.test(code)) notes.push('These are multi-qubit operations. Pay attention to which qubit is the control and which is the target.');
  if (/measure|measurement/i.test(code)) notes.push('Measurement converts the quantum state into classical data. Repeated shots can then show a distribution of bitstrings.');
  if (/statevector|aer|backend|sampler|simulate/i.test(code)) notes.push('This part is concerned with simulation or execution and collecting the circuit result.');
  if (/for\s+|while\s*\(/.test(code)) notes.push('The loop repeats a block of classical code.');
  if (/if\s*\(|if\s+/.test(code)) notes.push('The conditional chooses a path based on a condition.');
  if (/return\b/.test(code)) notes.push('`return` sends a value back to the caller.');
  if (/print\(|console\.log/.test(code)) notes.push('The output statement lets you inspect a result while the program runs.');

  const issueBlock = issues.length
    ? `Potential issues I noticed\n${issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}\n\nThese are pattern-based checks, so run the code and confirm the exact error message.`
    : 'I do not see an obvious issue from the patterns I can check locally. That does not prove the program is correct; the safest next step is to run it and inspect the exact error/output.';
  const explanation = notes.length ? notes.map((note) => `• ${note}`).join('\n') : '• I can read the snippet, but I do not recognize enough structure to explain it reliably.';
  return `Let’s go through it step by step.\n\nWhat the code is doing\n${explanation}\n\n${issueBlock}\n\nHow I would debug it\n1. Run the smallest version of the circuit.\n2. Check the qubit count and every qubit index.\n3. Verify control/target ordering for multi-qubit gates.\n4. Check the SDK API and parameter units.\n5. Compare the actual error with the circuit state and measurement result.\n\nCode preview\n${lines.slice(0, 6).join('\n')}${lines.length > 6 ? '\n…' : ''}`;
};

const circuitExplanation = (circuit?: CircuitState, diracNotation?: string) => {
  if (!circuit) return null;
  const gates = [...circuit.gates].sort((a, b) => a.step - b.step);
  if (!gates.length) return `You have ${circuit.numQubits} qubits, but no gates yet. Start from |${'0'.repeat(circuit.numQubits)}⟩ and add a gate to see how the state changes.`;
  const gateText = gates.map((gate) => {
    const controls = [gate.controlQubit, gate.controlQubit2].filter((v): v is number => v !== undefined).map((v) => `q[${v}]`).join(', ');
    return `${gate.gate} on q[${gate.targetQubit}]${controls ? ` with control ${controls}` : ''}`;
  }).join(' → ');
  return `Here’s what your circuit is doing: ${gateText}. ${diracNotation ? `The current simulated state is |ψ⟩ = ${diracNotation}.` : ''}`;
};

export function answerLocally(query: string): string {
  const clean = query.trim();
  if (!clean) return 'Ask me about a quantum concept, a QubitLab topic, or paste some code you want to understand or debug.';
  const lower = clean.toLowerCase();
  if (/^(hi|hello|hey|yo|good morning|good evening)\b/.test(lower)) return 'Hey! What are you working on? Ask me a quantum question, or paste your code and I’ll help you understand or debug it.';
  if (/^(thanks|thank you|thx)\b/.test(lower)) return 'You’re welcome. Keep experimenting — quantum circuits make much more sense once you can see the state change.';
  if (/^(bye|goodbye|see you)\b/.test(lower)) return 'See you. Keep building and testing those circuits.';
  if (/(who are you|what are you|your name)/.test(lower)) return 'I’m the QubitLab Guide. I help with the quantum-computing syllabus, circuit reasoning, code explanations, and common debugging checks.';

  const codeAnswer = explainCode(clean);
  if (codeAnswer) return codeAnswer;
  const math = tryMath(clean);
  if (math) return math;

  const knowledgeHits = KNOWLEDGE.map((card) => ({ card, score: scoreText(clean, `${card.title} ${card.keywords.join(' ')}`) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
  if (knowledgeHits.length) {
    const best = knowledgeHits[0].card;
    return `${best.title}\n\n${best.answer}\n\nWant to go one step deeper? I can show a simple example, the maths behind it, or how it looks in Qiskit/PennyLane/Cirq.`;
  }

  const syllabusHits = searchSyllabus(clean);
  if (syllabusHits.length) {
    const top = syllabusHits[0].topic;
    const objectives = top.learningObjectives.slice(0, 3).map((item) => `• ${item}`).join('\n');
    return `${top.title}\n\n${top.description}\n\nWhat to focus on\n${objectives}\n\nIf you’re new to this, ask me to explain it with a simple example first.`;
  }

  const quizHits = searchQuizKnowledge(clean);
  if (quizHits.length) return `Quick check\n\n${quizHits[0].question.question}\n\n${quizHits[0].question.explanation}`;
  if (/(circuit|statevector|gate|bloch|qubit|quantum|qiskit|pennylane|cirq|qbraid|qft|vqe|qaoa|deutsch|shor)/.test(lower)) return 'I’m not sure which part you mean yet. Try something specific like “Explain CNOT”, “Debug this Qiskit code”, “Why is my statevector wrong?”, or “Explain Grover step by step.”';
  return 'I don’t have that in my current local knowledge base. Try a QubitLab syllabus topic, a quantum circuit question, or paste code and I’ll check the parts I recognize.';
}

export function explainCircuitLocally(circuit: CircuitState, diracNotation: string): string {
  return circuitExplanation(circuit, diracNotation) || 'No circuit context is available.';
}
