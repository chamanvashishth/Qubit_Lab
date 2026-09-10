import { BasisStateProb, CircuitState, Complex, GatePlacement, QubitState, SimulationResult } from '../types/quantum';

export const C = {
  create: (r = 0, i = 0): Complex => ({ r, i }),
  add: (a: Complex, b: Complex): Complex => ({ r: a.r + b.r, i: a.i + b.i }),
  sub: (a: Complex, b: Complex): Complex => ({ r: a.r - b.r, i: a.i - b.i }),
  mul: (a: Complex, b: Complex): Complex => ({ r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r }),
  scale: (a: Complex, s: number): Complex => ({ r: a.r * s, i: a.i * s }),
  conj: (a: Complex): Complex => ({ r: a.r, i: -a.i }),
  abs: (a: Complex): number => Math.hypot(a.r, a.i),
  abs2: (a: Complex): number => a.r * a.r + a.i * a.i,
  arg: (a: Complex): number => Math.atan2(a.i, a.r),
  expI: (theta: number): Complex => ({ r: Math.cos(theta), i: Math.sin(theta) }),
};

const SQRT2_INV = 1 / Math.SQRT2;
const IDENTITY: Complex[][] = [[C.create(1), C.create()], [C.create(), C.create(1)]];

export function getSingleQubitGateMatrix(gate: string, param = 0): Complex[][] {
  switch (gate) {
    case 'H': return [[C.create(SQRT2_INV), C.create(SQRT2_INV)], [C.create(SQRT2_INV), C.create(-SQRT2_INV)]];
    case 'X': return [[C.create(), C.create(1)], [C.create(1), C.create()]];
    case 'Y': return [[C.create(), C.create(0, -1)], [C.create(0, 1), C.create()]];
    case 'Z': return [[C.create(1), C.create()], [C.create(), C.create(-1)]];
    case 'S': return [[C.create(1), C.create()], [C.create(), C.create(0, 1)]];
    case 'SDAG': return [[C.create(1), C.create()], [C.create(), C.create(0, -1)]];
    case 'T': return [[C.create(1), C.create()], [C.create(), C.expI(Math.PI / 4)]];
    case 'TDAG': return [[C.create(1), C.create()], [C.create(), C.expI(-Math.PI / 4)]];
    case 'RX': {
      const half = param / 2;
      const c = Math.cos(half); const s = Math.sin(half);
      // Correct unitary: Rx(theta) = cos(theta/2)I - i sin(theta/2)X.
      return [[C.create(c), C.create(0, -s)], [C.create(0, -s), C.create(c)]];
    }
    case 'RY': {
      const half = param / 2;
      const c = Math.cos(half); const s = Math.sin(half);
      return [[C.create(c), C.create(-s)], [C.create(s), C.create(c)]];
    }
    case 'RZ': {
      const half = param / 2;
      return [[C.expI(-half), C.create()], [C.create(), C.expI(half)]];
    }
    default: return IDENTITY;
  }
}

export function applySingleQubitGate(state: Complex[], numQubits: number, targetQubit: number, matrix: Complex[][]): Complex[] {
  const next = new Array<Complex>(state.length);
  const bit = 1 << (numQubits - 1 - targetQubit);
  for (let i = 0; i < state.length; i++) {
    if ((i & bit) !== 0) continue;
    const i0 = i;
    const i1 = i | bit;
    const a = state[i0]; const b = state[i1];
    next[i0] = C.add(C.mul(matrix[0][0], a), C.mul(matrix[0][1], b));
    next[i1] = C.add(C.mul(matrix[1][0], a), C.mul(matrix[1][1], b));
  }
  return next;
}

export function applyControlledGate(state: Complex[], numQubits: number, controlQubit: number, targetQubit: number, targetMatrix: Complex[][]): Complex[] {
  const next = [...state];
  const controlBit = 1 << (numQubits - 1 - controlQubit);
  const targetBit = 1 << (numQubits - 1 - targetQubit);
  if (controlQubit === targetQubit) return next;
  for (let i = 0; i < state.length; i++) {
    if ((i & controlBit) === 0 || (i & targetBit) !== 0) continue;
    const i0 = i; const i1 = i | targetBit;
    const a = state[i0]; const b = state[i1];
    next[i0] = C.add(C.mul(targetMatrix[0][0], a), C.mul(targetMatrix[0][1], b));
    next[i1] = C.add(C.mul(targetMatrix[1][0], a), C.mul(targetMatrix[1][1], b));
  }
  return next;
}

export function applySwapGate(state: Complex[], numQubits: number, qubitA: number, qubitB: number): Complex[] {
  if (qubitA === qubitB) return [...state];
  const next = [...state];
  const bitA = 1 << (numQubits - 1 - qubitA);
  const bitB = 1 << (numQubits - 1 - qubitB);
  for (let i = 0; i < state.length; i++) {
    const a = (i & bitA) !== 0; const b = (i & bitB) !== 0;
    if (!a && b) {
      const j = (i | bitA) & ~bitB;
      next[i] = state[j]; next[j] = state[i];
    }
  }
  return next;
}

export function applyToffoliGate(state: Complex[], numQubits: number, c1: number, c2: number, target: number): Complex[] {
  const next = [...state];
  const b1 = 1 << (numQubits - 1 - c1); const b2 = 1 << (numQubits - 1 - c2); const bt = 1 << (numQubits - 1 - target);
  if (new Set([c1, c2, target]).size !== 3) return next;
  for (let i = 0; i < state.length; i++) {
    if ((i & b1) !== 0 && (i & b2) !== 0 && (i & bt) === 0) {
      const j = i | bt; next[i] = state[j]; next[j] = state[i];
    }
  }
  return next;
}

export function getSingleQubitBlochVector(state: Complex[], numQubits: number, qubitIndex: number): QubitState {
  const bit = 1 << (numQubits - 1 - qubitIndex);
  let rho00 = 0; let rho11 = 0; let rho01 = C.create();
  for (let i = 0; i < state.length; i++) {
    if ((i & bit) !== 0) continue;
    const a = state[i]; const b = state[i | bit];
    rho00 += C.abs2(a); rho11 += C.abs2(b);
    rho01 = C.add(rho01, C.mul(a, C.conj(b)));
  }
  const x = 2 * rho01.r;
  const y = -2 * rho01.i;
  const z = rho00 - rho11;
  const purityVector = Math.hypot(x, y, z);
  const clampedZ = Math.max(-1, Math.min(1, z));
  const theta = Math.acos(clampedZ);
  let phi = Math.atan2(y, x); if (phi < 0) phi += 2 * Math.PI;
  return { theta, phi, x, y, z, purity: purityVector, p0: Math.max(0, Math.min(1, rho00)), p1: Math.max(0, Math.min(1, rho11)) };
}

export function formatDiracNotation(state: Complex[], numQubits: number): string {
  const parts: string[] = [];
  for (let i = 0; i < state.length; i++) {
    const amp = state[i]; const mag = C.abs(amp); if (mag < 0.001) continue;
    const basis = i.toString(2).padStart(numQubits, '0');
    let coeff: string;
    if (Math.abs(mag - 1) < 0.01) coeff = Math.abs(amp.i) < 0.01 ? (amp.r > 0 ? '' : '-') : (Math.abs(amp.r) < 0.01 ? (amp.i > 0 ? 'i' : '-i') : `(${amp.r.toFixed(2)}${amp.i >= 0 ? '+' : ''}${amp.i.toFixed(2)}i)`);
    else if (Math.abs(mag - SQRT2_INV) < 0.01 && Math.abs(amp.i) < 0.01) coeff = amp.r > 0 ? '1/√2' : '-1/√2';
    else if (Math.abs(mag - 0.5) < 0.01 && Math.abs(amp.i) < 0.01) coeff = amp.r > 0 ? '1/2' : '-1/2';
    else coeff = Math.abs(amp.i) < 0.01 ? amp.r.toFixed(3) : `(${amp.r.toFixed(2)}${amp.i >= 0 ? '+' : ''}${amp.i.toFixed(2)}i)`;
    parts.push(coeff ? `${coeff}|${basis}⟩` : `|${basis}⟩`);
  }
  return parts.length ? parts.join(' + ').replace(/\+ -/g, '- ') : `|${'0'.repeat(numQubits)}⟩`;
}

function sampleShots(probabilities: Record<string, number>, shots: number): Record<string, number> {
  const entries = Object.entries(probabilities);
  const cumulative: Array<[string, number]> = [];
  let total = 0;
  for (const [basis, probability] of entries) { total += probability; cumulative.push([basis, total]); }
  const histogram: Record<string, number> = {};
  for (let shot = 0; shot < shots; shot++) {
    const r = Math.random() * total;
    const chosen = cumulative.find(([, threshold]) => r <= threshold)?.[0] || entries[entries.length - 1]?.[0];
    if (chosen) histogram[chosen] = (histogram[chosen] || 0) + 1;
  }
  return histogram;
}

function densityMatrixForQubit(state: Complex[], numQubits: number, qubit: number): Complex[][] {
  const bit = 1 << (numQubits - 1 - qubit);
  let rho00 = C.create(); let rho01 = C.create(); let rho10 = C.create(); let rho11 = C.create();
  for (let i = 0; i < state.length; i++) {
    if ((i & bit) !== 0) continue;
    const a = state[i]; const b = state[i | bit];
    rho00 = C.add(rho00, C.create(C.abs2(a)));
    rho01 = C.add(rho01, C.mul(a, C.conj(b)));
    rho10 = C.add(rho10, C.mul(b, C.conj(a)));
    rho11 = C.add(rho11, C.create(C.abs2(b)));
  }
  return [[rho00, rho01], [rho10, rho11]];
}

export function simulateCircuit(circuit: CircuitState, shots = 1024): SimulationResult {
  const numQubits = Math.max(1, Math.min(5, Math.floor(circuit.numQubits)));
  const totalDim = 1 << numQubits;
  const safeShots = Math.max(0, Math.floor(Number.isFinite(shots) ? shots : 1024));
  let state = Array.from({ length: totalDim }, (_, i) => C.create(i === 0 ? 1 : 0));
  const gates = [...circuit.gates].filter((g) => g.step >= 0 && g.step < Math.max(1, circuit.numSteps)).sort((a, b) => a.step - b.step);

  for (const gate of gates) {
    switch (gate.gate) {
      case 'CNOT': if (gate.controlQubit !== undefined) state = applyControlledGate(state, numQubits, gate.controlQubit, gate.targetQubit, getSingleQubitGateMatrix('X')); break;
      case 'CZ': if (gate.controlQubit !== undefined) state = applyControlledGate(state, numQubits, gate.controlQubit, gate.targetQubit, getSingleQubitGateMatrix('Z')); break;
      case 'SWAP': if (gate.secondTarget !== undefined) state = applySwapGate(state, numQubits, gate.targetQubit, gate.secondTarget); break;
      case 'CCNOT': if (gate.controlQubit !== undefined && gate.controlQubit2 !== undefined) state = applyToffoliGate(state, numQubits, gate.controlQubit, gate.controlQubit2, gate.targetQubit); break;
      case 'MEASURE': break;
      default: state = applySingleQubitGate(state, numQubits, gate.targetQubit, getSingleQubitGateMatrix(gate.gate, gate.param ?? 0)); break;
    }
  }

  // Numerical noise can accumulate after many operations; renormalize without changing physical ratios.
  const norm = Math.sqrt(state.reduce((sum, amp) => sum + C.abs2(amp), 0));
  if (norm > 0) state = state.map((amp) => C.scale(amp, 1 / norm));

  const probabilities: Record<string, number> = {};
  const stateVector: BasisStateProb[] = [];
  for (let i = 0; i < state.length; i++) {
    const basis = i.toString(2).padStart(numQubits, '0');
    const amplitude = state[i]; const probability = C.abs2(amplitude);
    probabilities[basis] = probability;
    stateVector.push({ basis, amplitude, magnitude: C.abs(amplitude), probability, phase: C.arg(amplitude), phaseDegrees: C.arg(amplitude) * 180 / Math.PI });
  }

  const blochVectors = Array.from({ length: numQubits }, (_, q) => getSingleQubitBlochVector(state, numQubits, q));
  const densityMatrices = Array.from({ length: numQubits }, (_, q) => densityMatrixForQubit(state, numQubits, q));
  const isEntangled = blochVectors.some((v) => v.purity < 0.999);
  return { stateVector, blochVectors, shotsHistogram: sampleShots(probabilities, safeShots), totalShots: safeShots, probabilities, diracNotation: formatDiracNotation(state, numQubits), isEntangled, densityMatrices };
}

const gateCode = (gate: GatePlacement, framework: 'qiskit' | 'pennylane' | 'cirq' | 'qasm') => {
  const q = gate.targetQubit; const c = gate.controlQubit; const c2 = gate.controlQubit2; const s = gate.secondTarget; const p = gate.param ?? 0;
  if (framework === 'qiskit') {
    switch (gate.gate) {
      case 'CNOT': return `qc.cx(${c}, ${q})`;
      case 'CZ': return `qc.cz(${c}, ${q})`;
      case 'SWAP': return `qc.swap(${q}, ${s})`;
      case 'CCNOT': return `qc.ccx(${c}, ${c2}, ${q})`;
      case 'MEASURE': return 'qc.measure_all()';
      case 'RX': return `qc.rx(${p}, ${q})`;
      case 'RY': return `qc.ry(${p}, ${q})`;
      case 'RZ': return `qc.rz(${p}, ${q})`;
      default: return `qc.${gate.gate.toLowerCase()}(${q})`;
    }
  }
  if (framework === 'pennylane') {
    switch (gate.gate) {
      case 'CNOT': return `qml.CNOT(wires=[${c}, ${q}])`;
      case 'CZ': return `qml.CZ(wires=[${c}, ${q}])`;
      case 'SWAP': return `qml.SWAP(wires=[${q}, ${s}])`;
      case 'CCNOT': return `qml.Toffoli(wires=[${c}, ${c2}, ${q}])`;
      case 'RX': return `qml.RX(${p}, wires=${q})`;
      case 'RY': return `qml.RY(${p}, wires=${q})`;
      case 'RZ': return `qml.RZ(${p}, wires=${q})`;
      default: return `qml.${gate.gate}(wires=${q})`;
    }
  }
  if (framework === 'cirq') {
    switch (gate.gate) {
      case 'CNOT': return `cirq.CNOT(q[${c}], q[${q}])`;
      case 'CZ': return `cirq.CZ(q[${c}], q[${q}])`;
      case 'SWAP': return `cirq.SWAP(q[${q}], q[${s}])`;
      case 'CCNOT': return `cirq.TOFFOLI(q[${c}], q[${c2}], q[${q}])`;
      case 'RX': return `cirq.rx(${p})(q[${q}])`;
      case 'RY': return `cirq.ry(${p})(q[${q}])`;
      case 'RZ': return `cirq.rz(${p})(q[${q}])`;
      default: return `cirq.${gate.gate}(q[${q}])`;
    }
  }
  switch (gate.gate) {
    case 'CNOT': return `cx q[${c}],q[${q}];`;
    case 'CZ': return `cz q[${c}],q[${q}];`;
    case 'SWAP': return `swap q[${q}],q[${s}];`;
    case 'CCNOT': return `ccx q[${c}],q[${c2}],q[${q}];`;
    case 'MEASURE': return 'measure q -> c;';
    case 'RX': return `rx(${p}) q[${q}];`;
    case 'RY': return `ry(${p}) q[${q}];`;
    case 'RZ': return `rz(${p}) q[${q}];`;
    default: return `${gate.gate.toLowerCase()} q[${q}];`;
  }
};

export function exportToQiskit(circuit: CircuitState): string {
  return `from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(${circuit.numQubits}, ${circuit.numQubits})\n${[...circuit.gates].sort((a,b)=>a.step-b.step).map(g=>gateCode(g,'qiskit')).join('\n')}\n\nprint(qc)`;
}
export function exportToPennyLane(circuit: CircuitState): string {
  return `import pennylane as qml\n\ndev = qml.device("default.qubit", wires=${circuit.numQubits})\n\n@qml.qnode(dev)\ndef circuit():\n${[...circuit.gates].sort((a,b)=>a.step-b.step).map(g=>`    ${gateCode(g,'pennylane')}`).join('\n')}\n    return qml.state()`;
}
export function exportToCirq(circuit: CircuitState): string {
  return `import cirq\n\nq = cirq.LineQubit.range(${circuit.numQubits})\ncircuit = cirq.Circuit(\n${[...circuit.gates].sort((a,b)=>a.step-b.step).map(g=>`    ${gateCode(g,'cirq')}`).join(',\n')}\n)\nprint(circuit)`;
}
export function exportToOpenQASM(circuit: CircuitState): string {
  return `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${circuit.numQubits}];\ncreg c[${circuit.numQubits}];\n${[...circuit.gates].sort((a,b)=>a.step-b.step).map(g=>gateCode(g,'qasm')).join('\n')}`;
}
