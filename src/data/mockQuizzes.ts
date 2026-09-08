import { QuizQuestion } from '../types/quantum';

export interface QuizMock { id:string; title:string; description:string; questions:QuizQuestion[]; }
const q=(id:string,question:string,options:string[],correctIndex:number,explanation:string):QuizQuestion=>({id,question,options,correctIndex,correctAnswer:correctIndex,explanation});

export const QUIZ_MOCKS:QuizMock[]=[
{id:'foundations',title:'Foundations Mock',description:'Bits, qubits, normalization, and Dirac notation.',questions:[
q('f1','How many basis states exist for 3 qubits?',['3','6','8','9'],2,'Three qubits span 2³ = 8 basis states.'),
q('f2','A normalized qubit must satisfy:',['α+β=1','|α|²+|β|²=1','αβ=1','α=β'],1,'Squared amplitude magnitudes sum to one.'),
q('f3','What does |ψ⟩ represent?',['A state vector','A gate','A temperature','A classical bit only'],0,'A ket denotes a quantum state vector.'),
q('f4','What is ⟨0|1⟩?',['1','0','1/2','i'],1,'Orthogonal basis states have inner product zero.'),
q('f5','A bra is the:',['Conjugate transpose of a ket','Inverse of a ket','Measurement result','Gate matrix'],0,'A bra is the dual conjugate-transpose form.'),
q('f6','A classical bit has:',['One logical value 0 or 1','Complex amplitudes','Entanglement','Continuous phase'],0,'A standard classical bit is 0 or 1.'),
q('f7','|0⟩⟨0| is a:',['Projector','Scalar','CNOT','Histogram'],0,'It projects onto |0⟩.'),
q('f8','Which can implement a qubit?',['Superconducting circuit','Spreadsheet cell','TCP packet','Hard disk sector'],0,'Superconducting circuits are common qubit hardware.'),
q('f9','What scales as 2ⁿ for n qubits?',['State-space dimension','Wire temperature','Clock speed','Gate voltage'],0,'The ideal state space has 2ⁿ basis states.'),
q('f10','Probability from amplitude is found using:',['Squared magnitude','Sign only','Gate count','Phase alone'],0,'Born’s rule uses squared magnitude.')
]},
{id:'concepts',title:'Core Concepts Mock',description:'Superposition, interference, measurement, and entanglement.',questions:[
q('c1','Which gate maps |0⟩ to |+⟩?',['X','Z','H','S'],2,'Hadamard creates the equal superposition.'),
q('c2','Probability of |1⟩ from |+⟩?',['0%','25%','50%','100%'],2,'The squared magnitude is 1/2.'),
q('c3','Destructive interference can:',['Cancel amplitudes','Increase every probability','Remove normalization','Measure automatically'],0,'Opposite phases can cancel amplitudes.'),
q('c4','A coherent superposition differs from a mixture because:',['Relative phase matters','It has no probabilities','It is classical','It needs no amplitudes'],0,'Relative phase enables interference.'),
q('c5','The Born rule gives:',['Measurement probabilities','Gate depth','Temperature','Qubit lifetime'],0,'It maps amplitudes to probabilities.'),
q('c6','|Φ⁺⟩ equals:',['(|00⟩+|11⟩)/√2','|00⟩','(|01⟩+|10⟩)/2','|0⟩+|1⟩'],0,'That is the canonical Bell state |Φ⁺⟩.'),
q('c7','Prepare |Φ⁺⟩ from |00⟩ using:',['H then CNOT','X then Z','Measure then H','SWAP then S'],0,'H creates superposition and CNOT creates entanglement.'),
q('c8','Entanglement enables faster-than-light messaging:',['Yes','No'],1,'It does not provide a controllable FTL communication channel.'),
q('c9','How many Bell states are standard?',['2','4','6','8'],1,'There are four Bell states.'),
q('c10','Projective measurement generally:',['Produces an outcome eigenstate','Copies amplitudes','Creates qubits','Equalizes all outcomes'],0,'Measurement generally changes the state to the observed eigenstate.')
]},
{id:'gates',title:'Gates & Circuits Mock',description:'Single-qubit gates, controlled gates, and circuits.',questions:[
q('g1','Which gate flips |0⟩ to |1⟩?',['X','Z','H','S'],0,'Pauli-X is the quantum NOT gate.'),
q('g2','Z applied to |1⟩ gives:',['|0⟩','−|1⟩','Measurement','SWAP'],1,'Pauli-Z adds a minus phase to |1⟩.'),
q('g3','A unitary U satisfies:',['U†U=I','U²=0','U=0','det(U)=0'],0,'Unitarity preserves normalization.'),
q('g4','H² equals:',['I','X','Z','0'],0,'Hadamard is self-inverse.'),
q('g5','Which gate adds phase i to |1⟩?',['S','X','H','CNOT'],0,'S = diag(1,i).'),
q('g6','CNOT with control |1⟩:',['Flips target','Flips control','Measures both','Swaps wires'],0,'The target receives X conditionally.'),
q('g7','CNOT with control |0⟩:',['Leaves target unchanged','Always flips target','Measures','Swaps'],0,'No conditional X is applied.'),
q('g8','Toffoli has how many controls?',['0','1','2','3'],2,'Toffoli has two controls and one target.'),
q('g9','Which gate exchanges two qubit states?',['SWAP','CZ','S','H'],0,'SWAP exchanges states between two wires.'),
q('g10','A valid CNOT requires:',['Different control and target qubits','A measurement first','Only one qubit','A classical bit'],0,'Control and target are distinct wires.')
]},
{id:'math',title:'Quantum Mathematics Mock',description:'Complex numbers, matrices, and tensor products.',questions:[
q('m1','i² equals:',['−1','0','1','i'],0,'By definition i² = −1.'),
q('m2','|a+bi|² equals:',['a²+b²','a+b','a−b','ab'],0,'The squared modulus is a²+b².'),
q('m3','Conjugate of a+bi:',['a−bi','−a+bi','a+bi','−a−bi'],0,'Complex conjugation reverses the imaginary sign.'),
q('m4','Argand horizontal axis:',['Real part','Imaginary part','Probability','Qubit count'],0,'The real component is horizontal.'),
q('m5','e^(iθ) equals:',['cosθ+i sinθ','cosθ−i sinθ','θ+i','1+iθ exactly'],0,'Euler’s formula relates complex exponentials to trig functions.'),
q('m6','Two-qubit statevector dimension:',['2','4','8','16'],1,'2² = 4 basis states.'),
q('m7','Tensor product symbol:',['⊗','†','∑','≈'],0,'Tensor products are written with ⊗.'),
q('m8','† denotes:',['Conjugate transpose','Derivative','Determinant','Measurement'],0,'The dagger is the Hermitian adjoint.'),
q('m9','Unitarity matters because it:',['Preserves normalization','Deletes amplitudes','Measures qubits','Creates noise'],0,'Unitary evolution preserves total probability.'),
q('m10','A⊗B represents:',['Combined subsystem operation','Scalar sum','Measurement result','Classical loop'],0,'Tensor products combine subsystem spaces or operations.')
]},
{id:'algorithms',title:'Quantum Algorithms Mock',description:'Deutsch-Jozsa, Grover, Shor, and the QFT.',questions:[
q('a1','Deutsch-Jozsa promise:',['Constant or balanced function','Always random','Always 1','Classical oracle'],0,'The problem promises one of two global function classes.'),
q('a2','Ideal Deutsch-Jozsa oracle queries:',['1','2','O(N)','2ⁿ'],0,'The ideal algorithm uses one query.'),
q('a3','Constant oracle indication:',['All-zero query register','Any nonzero string','Random result','No measurement'],0,'All-zero corresponds to constant under the promise.'),
q('a4','Grover query complexity:',['O(√N)','O(N)','O(log N)','O(1)'],0,'Grover gives a quadratic query improvement.'),
q('a5','Grover oracle conceptually:',['Marks targets by phase','Deletes all states','Measures every state','Copies answer'],0,'Marked states receive a phase change.'),
q('a6','Grover diffusion:',['Inversion about average amplitude','Direct measurement','Classical sorting','Tensor factorization'],0,'The diffuser amplifies marked amplitudes.'),
q('a7','Too many Grover iterations can:',['Overshoot and reduce success','Break unitarity','Delete database','Create classical bits'],0,'Amplitude amplification is a rotation that can overshoot.'),
q('a8','Shor is centered on:',['Factoring through order finding','Sorting','Unstructured search','Compression'],0,'Shor reduces factoring to order finding.'),
q('a9','Transform used for periodic information:',['Quantum Fourier Transform','SWAP','Measurement only','Pauli-X'],0,'QFT exposes phase and periodic structure.'),
q('a10','Small noisy devices currently imply cryptographic RSA factoring:',['No','Yes'],0,'Relevant attacks require much larger fault-tolerant resources.')
]},
];

export const getQuizMock=(id?:string)=>QUIZ_MOCKS.find(mock=>mock.id===id);