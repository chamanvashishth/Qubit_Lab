import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, RotateCcw, Play, Copy, Check, Download, 
  Sparkles, Code, Sliders, Layers, ChevronRight, HelpCircle, ArrowRight
} from 'lucide-react';
import { CircuitState, GatePlacement, GateType, SimulationResult } from '../../types/quantum';
import { 
  simulateCircuit, exportToQiskit, exportToPennyLane, exportToCirq, exportToOpenQASM 
} from '../../utils/quantumEngine';
import { BlochSphere3D } from '../bloch/BlochSphere3D';
import { StateVectorVisualizer } from '../visualization/StateVectorVisualizer';

interface CircuitComposerProps {
  onAskAIExplain?: (circuit: CircuitState, diracNotation: string) => void;
}

const GATE_PALETTE: { type: GateType; label: string; desc: string; color: string; isMulti?: boolean }[] = [
  { type: 'H', label: 'H', desc: 'Hadamard: Creates equal superposition', color: 'bg-[#dfff3f]/20 text-[#dfff3f] border-[#dfff3f] hover:bg-[#dfff3f]/30' },
  { type: 'X', label: 'X', desc: 'Pauli-X: Bit flip (NOT gate)', color: 'bg-purple-500/20 text-purple-400 border-purple-500 hover:bg-purple-500/30' },
  { type: 'Y', label: 'Y', desc: 'Pauli-Y: Bit + Phase flip', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500 hover:bg-emerald-500/30' },
  { type: 'Z', label: 'Z', desc: 'Pauli-Z: Phase flip (|1⟩ -> -|1⟩)', color: 'bg-purple-500/20 text-purple-400 border-purple-500 hover:bg-purple-500/30' },
  { type: 'S', label: 'S', desc: 'Phase gate: π/2 phase rotation', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500 hover:bg-indigo-500/30' },
  { type: 'T', label: 'T', desc: 'π/8 gate: π/4 phase rotation', color: 'bg-pink-500/20 text-pink-400 border-pink-500 hover:bg-pink-500/30' },
  { type: 'RX', label: 'Rx(θ)', desc: 'Rotation around X-axis', color: 'bg-teal-500/20 text-teal-300 border-teal-500 hover:bg-teal-500/30' },
  { type: 'RY', label: 'Ry(θ)', desc: 'Rotation around Y-axis', color: 'bg-sky-500/20 text-sky-300 border-sky-500 hover:bg-sky-500/30' },
  { type: 'RZ', label: 'Rz(θ)', desc: 'Rotation around Z-axis', color: 'bg-violet-500/20 text-violet-300 border-violet-500 hover:bg-violet-500/30' },
  { type: 'CNOT', label: 'CX', desc: 'Controlled-NOT: Entangles 2 qubits', color: 'bg-pink-500/20 text-pink-400 border-pink-500 hover:bg-pink-500/30', isMulti: true },
  { type: 'CZ', label: 'CZ', desc: 'Controlled-Z: Entangled phase flip', color: 'bg-orange-500/20 text-orange-400 border-orange-500 hover:bg-orange-500/30', isMulti: true },
  { type: 'SWAP', label: 'SWAP', desc: 'Swaps state between two qubits', color: 'bg-rose-500/20 text-rose-400 border-rose-500 hover:bg-rose-500/30', isMulti: true },
  { type: 'CCNOT', label: 'CCX', desc: 'Toffoli: 3-qubit controlled-NOT', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500 hover:bg-yellow-500/30', isMulti: true },
  { type: 'MEASURE', label: 'M', desc: 'Measurement marker for exported circuits', color: 'bg-white/[.08] border-white/15 text-zinc-300 hover:bg-white/[.12]' },
];

export const CircuitComposer: React.FC<CircuitComposerProps> = ({ onAskAIExplain }) => {
  const [numQubits, setNumQubits] = useState(2);
  const [numSteps, setNumSteps] = useState(8);
  const [gates, setGates] = useState<GatePlacement[]>([
    { id: 'g1', gate: 'H', targetQubit: 0, step: 0 },
    { id: 'g2', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
  ]);

  const [selectedGateType, setSelectedGateType] = useState<GateType>('H');
  const [selectedControlQubit, setSelectedControlQubit] = useState(0);
  const [paramAngle, setParamAngle] = useState(1.57); // pi/2
  const [activeTab, setActiveTab] = useState<'visuals' | 'bloch' | 'export'>('visuals');
  const [copiedFramework, setCopiedFramework] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('bell');
  const [currentScrubStep, setCurrentScrubStep] = useState<number | null>(null);
  const [shots, setShots] = useState(1024);

  // Derive circuit state
  const circuitState: CircuitState = useMemo(() => ({
    numQubits,
    numSteps,
    gates,
  }), [numQubits, numSteps, gates]);

  // Compute live simulation (if scrubbing, only evaluate up to currentScrubStep)
  const simulation: SimulationResult = useMemo(() => {
    if (currentScrubStep !== null) {
      const filtered = gates.filter((g) => g.step <= currentScrubStep);
      return simulateCircuit({ numQubits, numSteps, gates: filtered }, shots);
    }
    return simulateCircuit(circuitState, shots);
  }, [circuitState, currentScrubStep, shots]);

  const changeQubitCount = (nextCount: number) => {
    const safeCount = Math.max(1, Math.min(5, nextCount));
    setNumQubits(safeCount);
    setSelectedControlQubit((current) => Math.min(current, safeCount - 1));
    setGates((current) =>
      current.filter((gate) =>
        gate.targetQubit < safeCount &&
        (gate.controlQubit === undefined || gate.controlQubit < safeCount) &&
        (gate.controlQubit2 === undefined || gate.controlQubit2 < safeCount) &&
        (gate.secondTarget === undefined || gate.secondTarget < safeCount)
      )
    );
  };

  // Handle cell click in composer wire grid
  const handleSlotClick = (qubit: number, step: number) => {
    // Check if gate already exists at this slot
    const existing = gates.find((g) => g.step === step && (g.targetQubit === qubit || g.controlQubit === qubit || g.secondTarget === qubit));
    if (existing) {
      // Remove it
      setGates((prev) => prev.filter((g) => g.id !== existing.id));
      return;
    }

    if ((selectedGateType === 'CNOT' || selectedGateType === 'CZ' || selectedGateType === 'SWAP') && numQubits < 2) return;
    if (selectedGateType === 'CCNOT' && numQubits < 3) return;

    // Otherwise place selected gate
    const newGate: GatePlacement = {
      id: `gate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      gate: selectedGateType,
      targetQubit: qubit,
      step,
    };

    if (selectedGateType === 'CNOT' || selectedGateType === 'CZ') {
      const ctrl = selectedControlQubit === qubit ? (qubit === 0 ? 1 : 0) : selectedControlQubit;
      newGate.controlQubit = Math.min(ctrl, numQubits - 1);
    } else if (selectedGateType === 'SWAP') {
      const other = qubit === 0 ? 1 : 0;
      newGate.secondTarget = Math.min(other, numQubits - 1);
    } else if (selectedGateType === 'CCNOT') {
      const controls = Array.from({ length: numQubits }, (_, index) => index)
        .filter((index) => index !== qubit)
        .slice(0, 2);
      newGate.controlQubit = controls[0];
      newGate.controlQubit2 = controls[1];
    } else if (selectedGateType === 'RX' || selectedGateType === 'RY' || selectedGateType === 'RZ') {
      newGate.param = paramAngle;
    }

    setGates((prev) => [...prev, newGate]);
  };

  // Load Preset Circuit
  const loadPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setCurrentScrubStep(null);

    switch (presetKey) {
      case 'bell':
        setNumQubits(2);
        setGates([
          { id: 'b1', gate: 'H', targetQubit: 0, step: 0 },
          { id: 'b2', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
        ]);
        break;
      case 'ghz':
        setNumQubits(3);
        setGates([
          { id: 'ghz1', gate: 'H', targetQubit: 0, step: 0 },
          { id: 'ghz2', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
          { id: 'ghz3', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 2 },
        ]);
        break;
      case 'superposition':
        setNumQubits(3);
        setGates([
          { id: 's0', gate: 'H', targetQubit: 0, step: 0 },
          { id: 's1', gate: 'H', targetQubit: 1, step: 0 },
          { id: 's2', gate: 'H', targetQubit: 2, step: 0 },
        ]);
        break;
      case 'grover':
        setNumQubits(2);
        setGates([
          // Initialize equal superposition
          { id: 'g0', gate: 'H', targetQubit: 0, step: 0 },
          { id: 'g1', gate: 'H', targetQubit: 1, step: 0 },
          // Oracle marking |11> (CZ gate)
          { id: 'g2', gate: 'CZ', targetQubit: 1, controlQubit: 0, step: 1 },
          // Diffusion: H -> X -> CZ -> X -> H
          { id: 'g3', gate: 'H', targetQubit: 0, step: 2 },
          { id: 'g4', gate: 'H', targetQubit: 1, step: 2 },
          { id: 'g5', gate: 'X', targetQubit: 0, step: 3 },
          { id: 'g6', gate: 'X', targetQubit: 1, step: 3 },
          { id: 'g7', gate: 'CZ', targetQubit: 1, controlQubit: 0, step: 4 },
          { id: 'g8', gate: 'X', targetQubit: 0, step: 5 },
          { id: 'g9', gate: 'X', targetQubit: 1, step: 5 },
          { id: 'g10', gate: 'H', targetQubit: 0, step: 6 },
          { id: 'g11', gate: 'H', targetQubit: 1, step: 6 },
        ]);
        break;
      case 'teleportation':
        setNumQubits(3);
        setGates([
          // Prepare message qubit q0 in arbitrary state (e.g. Rx)
          { id: 't0', gate: 'RX', targetQubit: 0, step: 0, param: 1.05 },
          // Create EPR pair between q1 and q2
          { id: 't1', gate: 'H', targetQubit: 1, step: 0 },
          { id: 't2', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 1 },
          // Bell basis measurement on q0 and q1
          { id: 't3', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 2 },
          { id: 't4', gate: 'H', targetQubit: 0, step: 3 },
          // Corrections
          { id: 't5', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 4 },
          { id: 't6', gate: 'CZ', targetQubit: 2, controlQubit: 0, step: 5 },
        ]);
        break;
      case 'deutsch':
        setNumQubits(2);
        setGates([
          // Ancilla q1 to |1> then H
          { id: 'd0', gate: 'X', targetQubit: 1, step: 0 },
          { id: 'd1', gate: 'H', targetQubit: 0, step: 1 },
          { id: 'd2', gate: 'H', targetQubit: 1, step: 1 },
          // Balanced oracle: CNOT
          { id: 'd3', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 2 },
          // Final Hadamard
          { id: 'd4', gate: 'H', targetQubit: 0, step: 3 },
        ]);
        break;
    }
  };

  const copyCode = (code: string, framework: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFramework(framework);
    setTimeout(() => setCopiedFramework(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/[.05] border border-white/10 rounded-xl p-4 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#dfff3f]/10 text-[#dfff3f] border border-[#dfff3f]/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              CIRCUIT COMPOSER
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#dfff3f]/15 border border-[#dfff3f]/30 text-[#e9ff8a]">
                Live Statevector
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Place gates, inspect the live pre-measurement statevector, and compare Bloch-sphere evolution
            </p>
          </div>
        </div>

        {/* Preset Selector & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedPreset}
            onChange={(e) => loadPreset(e.target.value)}
            aria-label="Select quantum circuit preset"
            className="px-3 py-1.5 rounded-lg bg-white/[.05] border border-white/15 text-xs text-zinc-200 focus:outline-none focus:border-[#dfff3f] font-mono"
          >
            <option value="bell">Preset: Bell State (|Φ⁺⟩)</option>
            <option value="ghz">Preset: GHZ 3-Qubit Entanglement</option>
            <option value="superposition">Preset: 3-Qubit Superposition</option>
            <option value="grover">Preset: Grover Search (2-Qubit)</option>
            <option value="deutsch">Preset: Deutsch Algorithm</option>
            <option value="teleportation">Preset: Quantum Teleportation</option>
          </select>

          {/* Qubit Count adjustment */}
          <div className="flex items-center bg-white/[.05] border border-white/10 rounded-lg px-2 py-1 gap-2 text-xs">
            <span className="text-zinc-400 font-mono">Qubits:</span>
            <button
              onClick={() => changeQubitCount(numQubits - 1)}
              disabled={numQubits <= 1}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/[.08] hover:bg-white/[.12] disabled:opacity-30 text-zinc-300 font-bold"
            >
              -
            </button>
            <span className="font-mono text-[#e9ff8a] font-bold">{numQubits}</span>
            <button
              onClick={() => changeQubitCount(numQubits + 1)}
              disabled={numQubits >= 5}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/[.08] hover:bg-white/[.12] disabled:opacity-30 text-zinc-300 font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => { setGates([]); setCurrentScrubStep(null); }}
            className="px-3 py-1.5 rounded-lg bg-white/[.08]/80 hover:bg-rose-500/20 hover:text-rose-300 text-zinc-300 text-xs font-medium border border-white/15 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>

          {onAskAIExplain && (
            <button
              onClick={() => onAskAIExplain(circuitState, simulation.diracNotation)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.35)] border border-purple-400/30 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explain with AI
            </button>
          )}
        </div>
      </div>

      {/* Gate Palette Toolbar */}
      <div className="bg-white/[.05] border border-white/10 rounded-xl p-3.5 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
            Active Quantum Gates
          </span>
          <span className="text-xs text-zinc-400 italic font-mono">
            Select a gate, then place on any circuit wire
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {GATE_PALETTE.map((item) => {
            const isSelected = selectedGateType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setSelectedGateType(item.type)}
                title={item.desc}
                className={`min-w-[46px] h-10 px-2.5 rounded font-mono font-bold text-xs flex items-center justify-center transition-all border shrink-0 ${
                  isSelected
                    ? `${item.color} ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105`
                    : 'bg-white/[.05] text-zinc-300 border-white/10 hover:border-white/15 hover:bg-white/[.08]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Conditional Control Qubit for 2-qubit gates */}
        {(selectedGateType === 'CNOT' || selectedGateType === 'CZ') && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-3 text-xs text-zinc-300">
            <span className="text-zinc-400 font-mono text-[11px]">Control Qubit for {selectedGateType}:</span>
            <div className="flex gap-1.5">
              {Array.from({ length: numQubits }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedControlQubit(i)}
                  className={`px-2 py-0.5 rounded font-mono text-xs ${
                    selectedControlQubit === i
                      ? 'bg-pink-500 text-white font-bold shadow-[0_0_8px_rgba(236,72,153,0.5)]'
                      : 'bg-white/[.08] text-zinc-300 hover:bg-white/[.12]'
                  }`}
                >
                  q[{i}]
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive circuit grid */}
      <div className="bg-white/[.05] border border-white/10 rounded-xl p-5 shadow-2xl backdrop-blur-sm overflow-x-auto relative">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none rounded-xl"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="min-w-[650px] relative z-10">
          {/* Step Timeline Header */}
          <div className="flex items-center mb-3">
            <div className="w-20 shrink-0 text-xs font-mono font-bold text-zinc-400">
              Qubit
            </div>
            <div className="flex-1 grid grid-cols-8 gap-2">
              {Array.from({ length: numSteps }).map((_, stepIdx) => (
                <div
                  key={stepIdx}
                  onClick={() => setCurrentScrubStep(currentScrubStep === stepIdx ? null : stepIdx)}
                  className={`text-center py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                    currentScrubStep === stepIdx
                      ? 'bg-[#dfff3f]/20 text-[#e9ff8a] border border-[#dfff3f]/40 font-bold shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Step {stepIdx}
                </div>
              ))}
            </div>
          </div>

          {/* Qubit Wires */}
          <div className="space-y-4">
            {Array.from({ length: numQubits }).map((_, qIdx) => (
              <div key={qIdx} className="flex items-center relative group">
                {/* Wire Label & Reset state indicator */}
                <div className="w-20 shrink-0 flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#e9ff8a] bg-black/45 px-2 py-1 rounded border border-white/10">
                    q[{qIdx}]
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">|0⟩</span>
                </div>

                {/* Wire Slot Columns */}
                <div className="flex-1 grid grid-cols-8 gap-2 relative">
                  {/* Background horizontal wire line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/[.08] group-hover:bg-white/[.12] transition-colors z-0" />

                  {Array.from({ length: numSteps }).map((_, sIdx) => {
                    // Find gate positioned here
                    const gate = gates.find((g) => g.step === sIdx && g.targetQubit === qIdx);
                    const isControl = gates.find((g) => g.step === sIdx && (g.controlQubit === qIdx || g.controlQubit2 === qIdx));
                    const isSecondTarget = gates.find((g) => g.step === sIdx && g.secondTarget === qIdx);

                    // Style placed gate according to Immersive UI
                    const getPlacedGateStyle = (gType: GateType) => {
                      if (gType === 'H') return 'bg-[#dfff3f] border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)] text-white';
                      if (gType === 'X' || gType === 'Y' || gType === 'Z') return 'bg-purple-500 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)] text-white';
                      if (gType === 'CNOT' || gType === 'CZ') return 'bg-pink-500 border-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.5)] text-white';
                      if (gType === 'MEASURE') return 'bg-white/[.08] border-slate-600 text-zinc-200';
                      return 'bg-indigo-600 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)] text-white';
                    };

                    return (
                      <div
                        key={sIdx}
                        onClick={() => handleSlotClick(qIdx, sIdx)}
                        className={`h-12 rounded relative z-10 flex items-center justify-center cursor-pointer transition-all border ${
                          gate
                            ? `${getPlacedGateStyle(gate.gate)} border hover:scale-105`
                            : isControl
                            ? 'bg-white/[.05] border-[#dfff3f]/40'
                            : isSecondTarget
                            ? 'bg-pink-500/20 border-pink-400/80'
                            : 'border-dashed border-white/10 hover:border-[#dfff3f]/40 hover:bg-[#dfff3f]/5'
                        }`}
                      >
                        {gate && (
                          <span className="font-mono font-bold text-xs">
                            {gate.gate}
                            {typeof gate.param === 'number' && !isNaN(gate.param) && (
                              <span className="text-[9px] block opacity-80">
                                {gate.param.toFixed(1)}
                              </span>
                            )}
                          </span>
                        )}

                        {isControl && !gate && (
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] border border-slate-950" />
                        )}

                        {isSecondTarget && !gate && (
                          <span className="font-mono font-bold text-xs text-pink-400">⊕</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Time scrubber reset info */}
          {currentScrubStep !== null && (
            <div className="mt-4 px-3 py-1.5 rounded-lg bg-[#dfff3f]/10 border border-[#dfff3f]/30 flex items-center justify-between text-xs">
              <span className="text-[#e9ff8a] font-mono">
                Showing simulated state vector after Step {currentScrubStep}
              </span>
              <button
                onClick={() => setCurrentScrubStep(null)}
                className="text-zinc-400 hover:text-zinc-200 underline text-xs"
              >
                Reset to final circuit state
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Switcher: Quantum State Visuals vs 3D Bloch Spheres vs Code Export */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('visuals')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'visuals'
              ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[.08]/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          State Vector & Histogram
        </button>

        <button
          onClick={() => setActiveTab('bloch')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'bloch'
              ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[.08]/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          3D Bloch Spheres ({numQubits} Qubits)
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'export'
              ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[.08]/40'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Multi-Framework Code Export
        </button>
      </div>

      {/* Tab 1: Statevector & Measurement Histogram */}
      {activeTab === 'visuals' && (
        <StateVectorVisualizer
          simulation={simulation}
          numQubits={numQubits}
          onResimulateShots={setShots}
        />
      )}

      {/* Tab 2: 3D Bloch Spheres Grid */}
      {activeTab === 'bloch' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-200">
              Single-Qubit Bloch Spheres (Reduced Density Matrix Traces)
            </h4>
            <span className="text-xs text-zinc-400">
              Interactive 3D view • Drag to rotate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {simulation.blochVectors.map((bv, idx) => (
              <BlochSphere3D
                key={idx}
                qubitState={bv}
                qubitIndex={idx}
                label={`Qubit q[${idx}]`}
                size={270}
                interactive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Framework Code Export (Qiskit, PennyLane, Cirq, OpenQASM) */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Qiskit */}
          <div className="bg-white/[.05] border border-white/10 rounded-xl p-4 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="text-xs font-bold font-mono text-[#e9ff8a]">Qiskit (Python)</span>
              </div>
              <button
                onClick={() => copyCode(exportToQiskit(circuitState), 'qiskit')}
                className="text-xs text-zinc-400 hover:text-[#e9ff8a] flex items-center gap-1 font-mono"
              >
                {copiedFramework === 'qiskit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFramework === 'qiskit' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="flex-1 p-3 rounded-lg bg-black/70 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72">
              <code>{exportToQiskit(circuitState)}</code>
            </pre>
          </div>

          {/* PennyLane */}
          <div className="bg-white/[.05] border border-white/10 rounded-xl p-4 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                <span className="text-xs font-bold font-mono text-indigo-300">PennyLane (Python)</span>
              </div>
              <button
                onClick={() => copyCode(exportToPennyLane(circuitState), 'pennylane')}
                className="text-xs text-zinc-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
              >
                {copiedFramework === 'pennylane' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFramework === 'pennylane' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="flex-1 p-3 rounded-lg bg-black/70 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72">
              <code>{exportToPennyLane(circuitState)}</code>
            </pre>
          </div>

          {/* Cirq */}
          <div className="bg-white/[.05] border border-white/10 rounded-xl p-4 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                <span className="text-xs font-bold font-mono text-purple-300">Cirq</span>
              </div>
              <button
                onClick={() => copyCode(exportToCirq(circuitState), 'cirq')}
                className="text-xs text-zinc-400 hover:text-purple-300 flex items-center gap-1 font-mono"
              >
                {copiedFramework === 'cirq' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFramework === 'cirq' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="flex-1 p-3 rounded-lg bg-black/70 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72">
              <code>{exportToCirq(circuitState)}</code>
            </pre>
          </div>

          {/* OpenQASM 2.0 */}
          <div className="bg-white/[.05] border border-white/10 rounded-xl p-4 flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-xs font-bold font-mono text-emerald-300">OpenQASM 2.0</span>
              </div>
              <button
                onClick={() => copyCode(exportToOpenQASM(circuitState), 'qasm')}
                className="text-xs text-zinc-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
              >
                {copiedFramework === 'qasm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFramework === 'qasm' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="flex-1 p-3 rounded-lg bg-black/70 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72">
              <code>{exportToOpenQASM(circuitState)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
