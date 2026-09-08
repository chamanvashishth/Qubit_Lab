import { BasisStateProb, CircuitState, Complex, GatePlacement, QubitState, SimulationResult } from '../types/quantum';

// Complex number utilities
export const C = {
  create: (r = 0, i = 0): Complex => ({ r, i }),
  add: (a: Complex, b: Complex): Complex => ({ r: a.r + b.r, i: a.i + b.i }),
  sub: (a: Complex, b: Complex): Complex => ({ r: a.r - b.r, i: a.i - b.i }),
  mul: (a: Complex, b: Complex): Complex => ({
    r: a.r * b.r - a.i * b.i,
    i: a.r * b.i + a.i * b.r,
  }),
  scale: (a: Complex, s: number): Complex => ({ r: a.r * s, i: a.i * s }),
  conj: (a: Complex): Complex => ({ r: a.r, i: -a.i }),
  abs: (a: Complex): number => Math.sqrt(a.r * a.r + a.i * a.i),
  abs2: (a: Complex): number => a.r * a.r + a.i * a.i,
  arg: (a: Complex): number => Math.atan2(a.i, a.r),
  expI: (theta: number): Complex => ({ r: Math.cos(theta), i: Math.sin(theta) }),
};

const SQRT2_INV = 1 / Math.SQRT2;

// Standard single-qubit 2x2 unitary matrices
export function getSingleQubitGateMatrix(gate: string, param = 0): Complex[][] {
  switch (gate) {
    case 'H':
      return [
        [C.create(SQRT2_INV, 0), C.create(SQRT2_INV, 0)],
        [C.create(SQRT2_INV, 0), C.create(-SQRT2_INV, 0)],
      ];
    case 'X':
      return [
        [C.create(0, 0), C.create(1, 0)],
        [C.create(1, 0), C.create(0, 0)],
      ];
    case 'Y':
      return [
        [C.create(0, 0), C.create(0, -1)],
        [C.create(0, 1), C.create(0, 0)],
      ];
    case 'Z':
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(-1, 0)],
      ];
    case 'S':
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(0, 1)],
      ];
    case 'SDAG':
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(0, -1)],
      ];
    case 'T':
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(SQRT2_INV, SQRT2_INV)],
      ];
    case 'TDAG':
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(SQRT2_INV, -SQRT2_INV)],
      ];
    case 'RX': {
      const half = param / 2;
      const cos = Math.cos(half);
      const sin = Math.sin(half);
      return [
        [C.create(cos, 0), C.create(0, -sin)],
        [C.create(0, -sin), C.create(cos, 0)],
      ];
    }
    case 'RY': {
      const half = param / 2;
      const cos = Math.cos(half);
      const sin = Math.sin(half);
      return [
        [C.create(cos, 0), C.create(-sin, 0)],
        [C.create(sin, 0), C.create(cos, 0)],
      ];
    }
    case 'RZ': {
      const half = param / 2;
      return [
        [C.expI(-half), C.create(0, 0)],
        [C.create(0, 0), C.expI(half)],
      ];
    }
    default:
      // Identity
      return [
        [C.create(1, 0), C.create(0, 0)],
        [C.create(0, 0), C.create(1, 0)],
      ];
  }
}

// Apply single-qubit gate directly to full statevector of length 2^numQubits
export function applySingleQubitGate(
  state: Complex[],
  numQubits: number,
  targetQubit: number,
  matrix: Complex[][]
): Complex[] {
  const next = new Array<Complex>(state.length);
  const bit = 1 << (numQubits - 1 - targetQubit);

  for (let i = 0; i < state.length; i++) {
    if ((i & bit) === 0) {
      const i0 = i;
      const i1 = i | bit;
      const psi0 = state[i0];
      const psi1 = state[i1];

      // [m00 m01] [psi0]
      // [m10 m11] [psi1]
      const next0 = C.add(C.mul(matrix[0][0], psi0), C.mul(matrix[0][1], psi1));
      const next1 = C.add(C.mul(matrix[1][0], psi0), C.mul(matrix[1][1], psi1));

      next[i0] = next0;
      next[i1] = next1;
    }
  }
  return next;
}

// Apply two-qubit controlled gate (e.g. CNOT, CZ)
export function applyControlledGate(
  state: Complex[],
  numQubits: number,
  controlQubit: number,
  targetQubit: number,
  targetMatrix: Complex[][]
): Complex[] {
  const next = [...state];
  const controlBit = 1 << (numQubits - 1 - controlQubit);
  const targetBit = 1 << (numQubits - 1 - targetQubit);

  for (let i = 0; i < state.length; i++) {
    // Only apply if control bit is 1 and target bit is 0
    if ((i & controlBit) !== 0 && (i & targetBit) === 0) {
      const i0 = i;
      const i1 = i | targetBit;
      const psi0 = state[i0];
      const psi1 = state[i1];

      next[i0] = C.add(C.mul(targetMatrix[0][0], psi0), C.mul(targetMatrix[0][1], psi1));
      next[i1] = C.add(C.mul(targetMatrix[1][0], psi0), C.mul(targetMatrix[1][1], psi1));
    }
  }
  return next;
}

// Apply SWAP gate between qubit A and qubit B
export function applySwapGate(
  state: Complex[],
  numQubits: number,
  qubitA: number,
  qubitB: number
): Complex[] {
  const next = [...state];
  const bitA = 1 << (numQubits - 1 - qubitA);
  const bitB = 1 << (numQubits - 1 - qubitB);

  for (let i = 0; i < state.length; i++) {
    const hasA = (i & bitA) !== 0;
    const hasB = (i & bitB) !== 0;
    // Swap amplitudes if bits differ and we are at the lower index
    if (hasA !== hasB && !hasA && hasB) {
      const j = (i | bitA) & ~bitB;
      const temp = next[i];
      next[i] = next[j];
      next[j] = temp;
    }
  }
  return next;
}

// Apply Toffoli (CCNOT) gate
export function applyToffoliGate(
  state: Complex[],
  numQubits: number,
  c1: number,
  c2: number,
  target: number
): Complex[] {
  const next = [...state];
  const bitC1 = 1 << (numQubits - 1 - c1);
  const bitC2 = 1 << (numQubits - 1 - c2);
  const bitT = 1 << (numQubits - 1 - target);

  for (let i = 0; i < state.length; i++) {
    if ((i & bitC1) !== 0 && (i & bitC2) !== 0 && (i & bitT) === 0) {
      const i0 = i;
      const i1 = i | bitT;
      const temp = next[i0];
      next[i0] = next[i1];
      next[i1] = temp;
    }
  }
  return next;
}

// Calculate reduced density matrix for single qubit k using partial trace
export function getSingleQubitBlochVector(state: Complex[], numQubits: number, qubitIndex: number): QubitState {
  // Density matrix rho_k is 2x2
  // rho_00 = sum_{all basis where bit_k == 0} |psi|^2
  // rho_11 = sum_{all basis where bit_k == 1} |psi|^2
  // rho_01 = sum_{all basis where bit_k == 0} psi_0 * conj(psi_1)
  const bitK = 1 << (numQubits - 1 - qubitIndex);

  let rho00 = 0;
  let rho11 = 0;
  let rho01: Complex = C.create(0, 0);

  for (let i = 0; i < state.length; i++) {
    if ((i & bitK) === 0) {
      const i0 = i;
      const i1 = i | bitK;
      const psi0 = state[i0];
      const psi1 = state[i1];

      rho00 += C.abs2(psi0);
      rho11 += C.abs2(psi1);
      // rho_01 += psi0 * conj(psi1)
      rho01 = C.add(rho01, C.mul(psi0, C.conj(psi1)));
    }
  }

  // Pauli expectation values
  // <X> = 2 * Re(rho_01)
  // <Y> = 2 * Im(rho_10) = -2 * Im(rho_01)
  // <Z> = rho00 - rho11
  const x = 2 * rho01.r;
  const y = -2 * rho01.i;
  const z = rho00 - rho11;

  const purity = Math.sqrt(x * x + y * y + z * z);

  // Compute spherical angles theta, phi
  // Note: for pure states, x = sin(theta)*cos(phi), y = sin(theta)*sin(phi), z = cos(theta)
  // Clamp z into [-1, 1]
  const clampedZ = Math.max(-1, Math.min(1, purity > 0.0001 ? z / purity : 0));
  const theta = Math.acos(clampedZ);
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;

  return {
    theta,
    phi,
    x,
    y,
    z,
    purity,
    p0: Math.max(0, Math.min(1, rho00)),
    p1: Math.max(0, Math.min(1, rho11)),
  };
}

// Convert statevector to Dirac bra-ket notation string
export function formatDiracNotation(state: Complex[], numQubits: number): string {
  const parts: string[] = [];

  for (let i = 0; i < state.length; i++) {
    const amp = state[i];
    const mag = C.abs(amp);
    if (mag < 0.001) continue;

    const basisStr = i.toString(2).padStart(numQubits, '0');
    let coeffStr = '';

    // Check for common neat fractions (like 1/sqrt(2), 1/2, etc.)
    if (Math.abs(mag - SQRT2_INV) < 0.01) {
      if (Math.abs(amp.i) < 0.01) {
        coeffStr = amp.r > 0 ? '1/√2' : '-1/√2';
      } else if (Math.abs(amp.r) < 0.01) {
        coeffStr = amp.i > 0 ? 'i/√2' : '-i/√2';
      } else {
        coeffStr = `${amp.r > 0 ? '' : '-'}(${Math.abs(amp.r).toFixed(2)}${amp.i >= 0 ? '+' : '-'}${Math.abs(amp.i).toFixed(2)}i)`;
      }
    } else if (Math.abs(mag - 1.0) < 0.01) {
      if (Math.abs(amp.i) < 0.01) {
        coeffStr = amp.r > 0 ? '' : '-';
      } else if (Math.abs(amp.r) < 0.01) {
        coeffStr = amp.i > 0 ? 'i' : '-i';
      } else {
        coeffStr = `(${amp.r.toFixed(2)}${amp.i >= 0 ? '+' : ''}${amp.i.toFixed(2)}i)`;
      }
    } else {
      if (Math.abs(amp.i) < 0.01) {
        coeffStr = amp.r.toFixed(3);
      } else {
        coeffStr = `(${amp.r.toFixed(2)}${amp.i >= 0 ? '+' : ''}${amp.i.toFixed(2)}i)`;
      }
    }

    const term = coeffStr === '' ? `|${basisStr}⟩` : (coeffStr === '-' ? `-|${basisStr}⟩` : `${coeffStr}|${basisStr}⟩`);
    parts.push(term);
  }

  if (parts.length === 0) return '|0...0⟩';
  return parts.join(' + ').replace(/\+ -/g, '- ');
}

// Complete Simulation Runner for a Circuit
export function simulateCircuit(circuit: CircuitState, shots = 1024): SimulationResult {
  const numQubits = Math.max(1, Math.min(5, circuit.numQubits));
  const safeShots = Number.isFinite(shots) ? Math.max(0, Math.floor(shots)) : 1024;
  const totalDim = 1 << numQubits;

  // Initial state |0...0> = [1, 0, 0, ...]
  let state = new Array<Complex>(totalDim);
  for (let i = 0; i < totalDim; i++) {
    state[i] = i === 0 ? C.create(1, 0) : C.create(0, 0);
  }

  // Sort gates by step
  const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    if (g.gate === 'MEASURE') continue;

    if (g.gate === 'CNOT' && g.controlQubit !== undefined) {
      const xMat = getSingleQubitGateMatrix('X');
      state = applyControlledGate(state, numQubits, g.controlQubit, g.targetQubit, xMat);
    } else if (g.gate === 'CZ' && g.controlQubit !== undefined) {
      const zMat = getSingleQubitGateMatrix('Z');
      state = applyControlledGate(state, numQubits, g.controlQubit, g.targetQubit, zMat);
    } else if (g.gate === 'SWAP' && g.secondTarget !== undefined) {
      state = applySwapGate(state, numQubits, g.targetQubit, g.secondTarget);
    } else if (g.gate === 'CCNOT' && g.controlQubit !== undefined && g.controlQubit2 !== undefined) {
      state = applyToffoliGate(state, numQubits, g.controlQubit, g.controlQubit2, g.targetQubit);
    } else {
      const mat = getSingleQubitGateMatrix(g.gate, g.param);
      state = applySingleQubitGate(state, numQubits, g.targetQubit, mat);
    }
  }

  // Build state vector probabilities
  const stateVector: BasisStateProb[] = [];
  const probabilities: Record<string, number> = {};

  for (let i = 0; i < totalDim; i++) {
    const basis = i.toString(2).padStart(numQubits, '0');
    const amp = state[i];
    const mag = C.abs(amp);
    const prob = C.abs2(amp);
    const phase = C.arg(amp);
    const phaseDegrees = ((phase * 180) / Math.PI + 360) % 360;

    stateVector.push({
      basis,
      amplitude: amp,
      magnitude: mag,
      probability: prob,
      phase,
      phaseDegrees,
    });
    probabilities[basis] = prob;
  }

  // Calculate Bloch spheres per qubit
  const blochVectors: QubitState[] = [];
  let isEntangled = false;

  for (let q = 0; q < numQubits; q++) {
    const bv = getSingleQubitBlochVector(state, numQubits, q);
    blochVectors.push(bv);
    if (numQubits > 1 && bv.purity < 0.98) {
      isEntangled = true;
    }
  }

  // Measurement shots histogram (Monte Carlo sampling)
  const shotsHistogram: Record<string, number> = {};
  for (let i = 0; i < totalDim; i++) {
    const basis = i.toString(2).padStart(numQubits, '0');
    shotsHistogram[basis] = 0;
  }

  if (safeShots > 0) {
    const cdf: { basis: string; limit: number }[] = [];
    let cum = 0;
    for (const sv of stateVector) {
      cum += sv.probability;
      cdf.push({ basis: sv.basis, limit: cum });
    }

    // Floating-point arithmetic can leave the final cumulative probability
    // microscopically below 1. Force the last bucket to absorb the remainder.
    if (cdf.length > 0) cdf[cdf.length - 1].limit = 1;

    for (let s = 0; s < safeShots; s++) {
      const rand = Math.random();
      for (const item of cdf) {
        if (rand <= item.limit) {
          shotsHistogram[item.basis] = (shotsHistogram[item.basis] || 0) + 1;
          break;
        }
      }
    }
  }

  const diracNotation = formatDiracNotation(state, numQubits);

  return {
    stateVector,
    blochVectors,
    shotsHistogram,
    totalShots: safeShots,
    probabilities,
    diracNotation,
    isEntangled,
  };
}

// Code Exporters for Quantum SDKs
export function exportToQiskit(circuit: CircuitState): string {
  const lines: string[] = [
    '# Generated by QubitLab Quantum Platform',
    'from qiskit import QuantumCircuit, transpile',
    'from qiskit_aer import AerSimulator',
    'import numpy as np',
    'import matplotlib.pyplot as plt',
    '',
    `qc = QuantumCircuit(${circuit.numQubits}, ${circuit.numQubits})`,
  ];

  const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    switch (g.gate) {
      case 'H': lines.push(`qc.h(${g.targetQubit})`); break;
      case 'X': lines.push(`qc.x(${g.targetQubit})`); break;
      case 'Y': lines.push(`qc.y(${g.targetQubit})`); break;
      case 'Z': lines.push(`qc.z(${g.targetQubit})`); break;
      case 'S': lines.push(`qc.s(${g.targetQubit})`); break;
      case 'T': lines.push(`qc.t(${g.targetQubit})`); break;
      case 'SDAG': lines.push(`qc.sdg(${g.targetQubit})`); break;
      case 'TDAG': lines.push(`qc.tdg(${g.targetQubit})`); break;
      case 'RX': lines.push(`qc.rx(${g.param ?? 'np.pi/2'}, ${g.targetQubit})`); break;
      case 'RY': lines.push(`qc.ry(${g.param ?? 'np.pi/2'}, ${g.targetQubit})`); break;
      case 'RZ': lines.push(`qc.rz(${g.param ?? 'np.pi/2'}, ${g.targetQubit})`); break;
      case 'CNOT': lines.push(`qc.cx(${g.controlQubit}, ${g.targetQubit})`); break;
      case 'CZ': lines.push(`qc.cz(${g.controlQubit}, ${g.targetQubit})`); break;
      case 'SWAP': lines.push(`qc.swap(${g.targetQubit}, ${g.secondTarget})`); break;
      case 'CCNOT': lines.push(`qc.ccx(${g.controlQubit}, ${g.controlQubit2}, ${g.targetQubit})`); break;
      case 'MEASURE': lines.push(`qc.measure(${g.targetQubit}, ${g.targetQubit})`); break;
    }
  }

  if (!sortedGates.some((g) => g.gate === 'MEASURE')) {
    lines.push('qc.measure_all()');
  }

  lines.push('');
  lines.push('# Run on Aer Simulator');
  lines.push('simulator = AerSimulator()');
  lines.push('compiled_circuit = transpile(qc, simulator)');
  lines.push('job = simulator.run(compiled_circuit, shots=1024)');
  lines.push('result = job.result()');
  lines.push('counts = result.get_counts()');
  lines.push('print("Measurement counts:", counts)');
  lines.push('print(qc.draw(output="text"))');

  return lines.join('\n');
}

export function exportToPennyLane(circuit: CircuitState): string {
  const lines: string[] = [
    '# Generated by QubitLab Quantum Platform',
    'import pennylane as qml',
    'import numpy as np',
    '',
    `dev = qml.device("default.qubit", wires=${circuit.numQubits}, shots=1024)`,
    '',
    '@qml.qnode(dev)',
    'def circuit():',
  ];

  const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

  if (sortedGates.length === 0) {
    lines.push('    # Identity circuit');
  }

  for (const g of sortedGates) {
    switch (g.gate) {
      case 'H': lines.push(`    qml.Hadamard(wires=${g.targetQubit})`); break;
      case 'X': lines.push(`    qml.PauliX(wires=${g.targetQubit})`); break;
      case 'Y': lines.push(`    qml.PauliY(wires=${g.targetQubit})`); break;
      case 'Z': lines.push(`    qml.PauliZ(wires=${g.targetQubit})`); break;
      case 'S': lines.push(`    qml.S(wires=${g.targetQubit})`); break;
      case 'SDAG': lines.push(`    qml.adjoint(qml.S)(wires=${g.targetQubit})`); break;
      case 'T': lines.push(`    qml.T(wires=${g.targetQubit})`); break;
      case 'TDAG': lines.push(`    qml.adjoint(qml.T)(wires=${g.targetQubit})`); break;
      case 'RX': lines.push(`    qml.RX(${g.param ?? 1.5708}, wires=${g.targetQubit})`); break;
      case 'RY': lines.push(`    qml.RY(${g.param ?? 1.5708}, wires=${g.targetQubit})`); break;
      case 'RZ': lines.push(`    qml.RZ(${g.param ?? 1.5708}, wires=${g.targetQubit})`); break;
      case 'CNOT': lines.push(`    qml.CNOT(wires=[${g.controlQubit}, ${g.targetQubit}])`); break;
      case 'CZ': lines.push(`    qml.CZ(wires=[${g.controlQubit}, ${g.targetQubit}])`); break;
      case 'SWAP': lines.push(`    qml.SWAP(wires=[${g.targetQubit}, ${g.secondTarget}])`); break;
      case 'CCNOT': lines.push(`    qml.Toffoli(wires=[${g.controlQubit}, ${g.controlQubit2}, ${g.targetQubit}])`); break;
    }
  }

  lines.push('    return qml.probs(wires=range(' + circuit.numQubits + '))');
  lines.push('');
  lines.push('print("Output Probabilities:", circuit())');

  return lines.join('\n');
}

export function exportToCirq(circuit: CircuitState): string {
  const lines: string[] = [
    '# Generated by QubitLab Quantum Platform',
    'import cirq',
    '',
    `qubits = cirq.LineQubit.range(${circuit.numQubits})`,
    'circuit = cirq.Circuit()',
  ];

  const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    switch (g.gate) {
      case 'H': lines.push(`circuit.append(cirq.H(qubits[${g.targetQubit}]))`); break;
      case 'X': lines.push(`circuit.append(cirq.X(qubits[${g.targetQubit}]))`); break;
      case 'Y': lines.push(`circuit.append(cirq.Y(qubits[${g.targetQubit}]))`); break;
      case 'Z': lines.push(`circuit.append(cirq.Z(qubits[${g.targetQubit}]))`); break;
      case 'S': lines.push(`circuit.append(cirq.S(qubits[${g.targetQubit}]))`); break;
      case 'SDAG': lines.push(`circuit.append(cirq.inverse(cirq.S)(qubits[${g.targetQubit}]))`); break;
      case 'T': lines.push(`circuit.append(cirq.T(qubits[${g.targetQubit}]))`); break;
      case 'TDAG': lines.push(`circuit.append(cirq.inverse(cirq.T)(qubits[${g.targetQubit}]))`); break;
      case 'RX': lines.push(`circuit.append(cirq.rx(${g.param ?? 1.5708})(qubits[${g.targetQubit}]))`); break;
      case 'RY': lines.push(`circuit.append(cirq.ry(${g.param ?? 1.5708})(qubits[${g.targetQubit}]))`); break;
      case 'RZ': lines.push(`circuit.append(cirq.rz(${g.param ?? 1.5708})(qubits[${g.targetQubit}]))`); break;
      case 'CNOT': lines.push(`circuit.append(cirq.CNOT(qubits[${g.controlQubit}], qubits[${g.targetQubit}]))`); break;
      case 'CZ': lines.push(`circuit.append(cirq.CZ(qubits[${g.controlQubit}], qubits[${g.targetQubit}]))`); break;
      case 'SWAP': lines.push(`circuit.append(cirq.SWAP(qubits[${g.targetQubit}], qubits[${g.secondTarget}]))`); break;
      case 'CCNOT': lines.push(`circuit.append(cirq.TOFFOLI(qubits[${g.controlQubit}], qubits[${g.controlQubit2}], qubits[${g.targetQubit}]))`); break;
    }
  }

  lines.push('circuit.append(cirq.measure(*qubits, key="result"))');
  lines.push('simulator = cirq.Simulator()');
  lines.push('results = simulator.run(circuit, repetitions=1024)');
  lines.push('print(circuit)');
  lines.push('print("Histogram:", results.histogram(key="result"))');

  return lines.join('\n');
}

export function exportToOpenQASM(circuit: CircuitState): string {
  const lines: string[] = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${circuit.numQubits}];`,
    `creg c[${circuit.numQubits}];`,
  ];

  const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    switch (g.gate) {
      case 'H': lines.push(`h q[${g.targetQubit}];`); break;
      case 'X': lines.push(`x q[${g.targetQubit}];`); break;
      case 'Y': lines.push(`y q[${g.targetQubit}];`); break;
      case 'Z': lines.push(`z q[${g.targetQubit}];`); break;
      case 'S': lines.push(`s q[${g.targetQubit}];`); break;
      case 'T': lines.push(`t q[${g.targetQubit}];`); break;
      case 'SDAG': lines.push(`sdg q[${g.targetQubit}];`); break;
      case 'TDAG': lines.push(`tdg q[${g.targetQubit}];`); break;
      case 'RX': lines.push(`rx(${g.param ?? 'pi/2'}) q[${g.targetQubit}];`); break;
      case 'RY': lines.push(`ry(${g.param ?? 'pi/2'}) q[${g.targetQubit}];`); break;
      case 'RZ': lines.push(`rz(${g.param ?? 'pi/2'}) q[${g.targetQubit}];`); break;
      case 'CNOT': lines.push(`cx q[${g.controlQubit}],q[${g.targetQubit}];`); break;
      case 'CZ': lines.push(`cz q[${g.controlQubit}],q[${g.targetQubit}];`); break;
      case 'SWAP': lines.push(`swap q[${g.targetQubit}],q[${g.secondTarget}];`); break;
      case 'CCNOT': lines.push(`ccx q[${g.controlQubit}],q[${g.controlQubit2}],q[${g.targetQubit}];`); break;
      case 'MEASURE': lines.push(`measure q[${g.targetQubit}] -> c[${g.targetQubit}];`); break;
    }
  }

  return lines.join('\n');
}
