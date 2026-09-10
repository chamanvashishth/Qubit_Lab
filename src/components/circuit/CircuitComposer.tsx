import React, { useMemo, useState } from 'react';
import { Copy, Check, RefreshCw, Trash2, Sparkles, Sliders, Layers, Code2 } from 'lucide-react';
import { CircuitState, GatePlacement, GateType, SimulationResult } from '../../types/quantum';
import { simulateCircuit, exportToQiskit, exportToPennyLane, exportToCirq, exportToOpenQASM } from '../../utils/quantumEngine';
import { BlochSphere3D } from '../bloch/BlochSphere3D';
import { StateVectorVisualizer } from '../visualization/StateVectorVisualizer';

interface CircuitComposerProps { onAskAIExplain?: (circuit: CircuitState, diracNotation: string) => void; }

type PresetKey = 'bell' | 'ghz' | 'superposition' | 'grover' | 'deutsch' | 'teleportation';

const PALETTE: Array<{ type: GateType; label: string; desc: string }> = [
  { type: 'H', label: 'H', desc: 'Hadamard' }, { type: 'X', label: 'X', desc: 'Pauli-X' }, { type: 'Y', label: 'Y', desc: 'Pauli-Y' },
  { type: 'Z', label: 'Z', desc: 'Pauli-Z' }, { type: 'S', label: 'S', desc: 'Phase π/2' }, { type: 'T', label: 'T', desc: 'Phase π/4' },
  { type: 'RX', label: 'Rx', desc: 'X rotation' }, { type: 'RY', label: 'Ry', desc: 'Y rotation' }, { type: 'RZ', label: 'Rz', desc: 'Z rotation' },
  { type: 'CNOT', label: 'CX', desc: 'Controlled-X' }, { type: 'CZ', label: 'CZ', desc: 'Controlled-Z' }, { type: 'SWAP', label: 'SWAP', desc: 'Swap two qubits' },
  { type: 'CCNOT', label: 'CCX', desc: 'Toffoli' }, { type: 'MEASURE', label: 'M', desc: 'Measurement marker' },
];

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const PRESETS: Record<PresetKey, { qubits: number; gates: GatePlacement[] }> = {
  bell: { qubits: 2, gates: [{ id: 'bell-h', gate: 'H', targetQubit: 0, step: 0 }, { id: 'bell-cx', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 }] },
  ghz: { qubits: 3, gates: [{ id: 'ghz-h', gate: 'H', targetQubit: 0, step: 0 }, { id: 'ghz-cx1', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 }, { id: 'ghz-cx2', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 2 }] },
  superposition: { qubits: 3, gates: [{ id: 'sup0', gate: 'H', targetQubit: 0, step: 0 }, { id: 'sup1', gate: 'H', targetQubit: 1, step: 0 }, { id: 'sup2', gate: 'H', targetQubit: 2, step: 0 }] },
  grover: { qubits: 2, gates: [
    { id: 'gr0', gate: 'H', targetQubit: 0, step: 0 }, { id: 'gr1', gate: 'H', targetQubit: 1, step: 0 },
    { id: 'gr2', gate: 'CZ', targetQubit: 1, controlQubit: 0, step: 1 },
    { id: 'gr3', gate: 'H', targetQubit: 0, step: 2 }, { id: 'gr4', gate: 'H', targetQubit: 1, step: 2 },
    { id: 'gr5', gate: 'X', targetQubit: 0, step: 3 }, { id: 'gr6', gate: 'X', targetQubit: 1, step: 3 },
    { id: 'gr7', gate: 'CZ', targetQubit: 1, controlQubit: 0, step: 4 },
    { id: 'gr8', gate: 'X', targetQubit: 0, step: 5 }, { id: 'gr9', gate: 'X', targetQubit: 1, step: 5 },
    { id: 'gr10', gate: 'H', targetQubit: 0, step: 6 }, { id: 'gr11', gate: 'H', targetQubit: 1, step: 6 },
  ] },
  deutsch: { qubits: 2, gates: [{ id: 'de-x', gate: 'X', targetQubit: 1, step: 0 }, { id: 'de-h0', gate: 'H', targetQubit: 0, step: 1 }, { id: 'de-h1', gate: 'H', targetQubit: 1, step: 1 }, { id: 'de-cx', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 2 }, { id: 'de-h2', gate: 'H', targetQubit: 0, step: 3 }] },
  teleportation: { qubits: 3, gates: [{ id: 'tp-rx', gate: 'RY', targetQubit: 0, step: 0, param: 1.05 }, { id: 'tp-h', gate: 'H', targetQubit: 1, step: 0 }, { id: 'tp-cx', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 1 }, { id: 'tp-cx2', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 2 }, { id: 'tp-h2', gate: 'H', targetQubit: 0, step: 3 }, { id: 'tp-cx3', gate: 'CNOT', targetQubit: 2, controlQubit: 1, step: 4 }, { id: 'tp-cz', gate: 'CZ', targetQubit: 2, controlQubit: 0, step: 5 }] },
};

export const CircuitComposer: React.FC<CircuitComposerProps> = ({ onAskAIExplain }) => {
  const [numQubits, setNumQubits] = useState(2);
  const [numSteps, setNumSteps] = useState(8);
  const [gates, setGates] = useState<GatePlacement[]>(PRESETS.bell.gates);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('bell');
  const [selectedGate, setSelectedGate] = useState<GateType>('H');
  const [controlQubit, setControlQubit] = useState(0);
  const [angle, setAngle] = useState(Math.PI / 2);
  const [scrubStep, setScrubStep] = useState<number | null>(null);
  const [shots, setShots] = useState(1024);
  const [tab, setTab] = useState<'state' | 'bloch' | 'code'>('state');
  const [copied, setCopied] = useState<string | null>(null);

  const circuit: CircuitState = useMemo(() => ({ numQubits, numSteps, gates }), [numQubits, numSteps, gates]);
  const simulation: SimulationResult = useMemo(() => {
    const visibleGates = scrubStep === null ? gates : gates.filter((gate) => gate.step <= scrubStep);
    return simulateCircuit({ numQubits, numSteps, gates: visibleGates }, shots);
  }, [gates, numQubits, numSteps, scrubStep, shots]);

  const resetToPreset = (key: PresetKey = selectedPreset) => {
    const preset = PRESETS[key];
    setSelectedPreset(key); setNumQubits(preset.qubits); setGates(preset.gates.map((gate) => ({ ...gate })));
    setControlQubit(0); setScrubStep(null);
  };

  const changeQubits = (delta: number) => {
    const next = Math.max(1, Math.min(5, numQubits + delta));
    setNumQubits(next);
    setControlQubit((current) => Math.min(current, next - 1));
    setGates((current) => current.filter((gate) => gate.targetQubit < next && (gate.controlQubit === undefined || gate.controlQubit < next) && (gate.controlQubit2 === undefined || gate.controlQubit2 < next) && (gate.secondTarget === undefined || gate.secondTarget < next)));
  };

  const changeSteps = (delta: number) => {
    const next = Math.max(4, Math.min(12, numSteps + delta));
    setNumSteps(next); setScrubStep(null); setGates((current) => current.filter((gate) => gate.step < next));
  };

  const placeGate = (target: number, step: number) => {
    const existing = gates.find((gate) => gate.step === step && [gate.targetQubit, gate.controlQubit, gate.controlQubit2, gate.secondTarget].includes(target));
    if (existing) { setGates((current) => current.filter((gate) => gate.id !== existing.id)); return; }

    if (selectedGate === 'CCNOT' && numQubits < 3) return;
    if (['CNOT', 'CZ', 'SWAP'].includes(selectedGate) && numQubits < 2) return;

    const newGate: GatePlacement = { id: makeId('gate'), gate: selectedGate, targetQubit: target, step };
    if (selectedGate === 'CNOT' || selectedGate === 'CZ') {
      const fallback = target === 0 ? 1 : 0;
      newGate.controlQubit = controlQubit === target ? fallback : controlQubit;
    } else if (selectedGate === 'SWAP') {
      newGate.secondTarget = target === numQubits - 1 ? target - 1 : target + 1;
    } else if (selectedGate === 'CCNOT') {
      const controls = Array.from({ length: numQubits }, (_, i) => i).filter((i) => i !== target).slice(0, 2);
      newGate.controlQubit = controls[0]; newGate.controlQubit2 = controls[1];
    } else if (['RX', 'RY', 'RZ'].includes(selectedGate)) newGate.param = angle;

    const occupied = gates.filter((gate) => gate.step === step).flatMap((gate) => [gate.targetQubit, gate.controlQubit, gate.controlQubit2, gate.secondTarget].filter((value): value is number => value !== undefined));
    const touched = [newGate.targetQubit, newGate.controlQubit, newGate.controlQubit2, newGate.secondTarget].filter((value): value is number => value !== undefined);
    if (touched.some((wire) => occupied.includes(wire))) return;
    setGates((current) => [...current, newGate].sort((a, b) => a.step - b.step));
    setScrubStep(null);
  };

  const copy = async (key: string, code: string) => { try { await navigator.clipboard.writeText(code); setCopied(key); window.setTimeout(() => setCopied(null), 1500); } catch { /* no-op */ } };
  const codes = useMemo(() => ({ qiskit: exportToQiskit(circuit), pennylane: exportToPennyLane(circuit), cirq: exportToCirq(circuit), qasm: exportToOpenQASM(circuit) }), [circuit]);

  return (
    <div className="space-y-6">
      <section className="bg-white/[.05] border border-white/10 rounded-xl p-4 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-[#dfff3f]/10 text-[#dfff3f] border border-[#dfff3f]/20"><Sliders className="w-5 h-5" /></div><div><h3 className="text-base font-bold text-zinc-100 font-mono">CIRCUIT COMPOSER <span className="ml-2 text-[10px] px-2 py-0.5 rounded border border-[#dfff3f]/30 text-[#e9ff8a]">LIVE SIMULATION</span></h3><p className="text-xs text-zinc-400">Every edit immediately recomputes the statevector, probabilities and Bloch vectors locally.</p></div></div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={selectedPreset} onChange={(event) => resetToPreset(event.target.value as PresetKey)} className="px-3 py-1.5 rounded-lg bg-white/[.05] border border-white/15 text-xs text-zinc-200 font-mono"><option value="bell">Bell State</option><option value="ghz">GHZ</option><option value="superposition">Superposition</option><option value="grover">Grover</option><option value="deutsch">Deutsch</option><option value="teleportation">Teleportation</option></select>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/[.04] text-xs font-mono"><span className="text-zinc-400">Qubits</span><button onClick={() => changeQubits(-1)} disabled={numQubits === 1} className="w-5 h-5 rounded bg-white/[.08] disabled:opacity-30">−</button><b className="text-[#e9ff8a] w-4 text-center">{numQubits}</b><button onClick={() => changeQubits(1)} disabled={numQubits === 5} className="w-5 h-5 rounded bg-white/[.08] disabled:opacity-30">+</button></div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/[.04] text-xs font-mono"><span className="text-zinc-400">Steps</span><button onClick={() => changeSteps(-1)} disabled={numSteps === 4} className="w-5 h-5 rounded bg-white/[.08] disabled:opacity-30">−</button><b className="text-[#e9ff8a] w-5 text-center">{numSteps}</b><button onClick={() => changeSteps(1)} disabled={numSteps === 12} className="w-5 h-5 rounded bg-white/[.08] disabled:opacity-30">+</button></div>
            <button onClick={() => resetToPreset()} className="px-3 py-1.5 rounded-lg bg-white/[.08] border border-white/10 text-xs flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
            <button onClick={() => { setGates([]); setScrubStep(null); }} className="px-3 py-1.5 rounded-lg bg-white/[.08] border border-white/10 text-xs flex items-center gap-1.5 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" />Clear</button>
            {onAskAIExplain && <button onClick={() => onAskAIExplain(circuit, simulation.diracNotation)} className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Explain locally</button>}
          </div>
        </div>
      </section>

      <section className="bg-white/[.05] border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Active Quantum Gates</span><span className="text-[11px] text-zinc-500 font-mono">Select a gate, then click a cell. Click a placed gate to remove it.</span></div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">{PALETTE.map((item) => <button key={item.type} title={item.desc} onClick={() => setSelectedGate(item.type)} className={`min-w-12 h-9 px-2 rounded border text-xs font-mono font-bold ${selectedGate === item.type ? 'bg-[#dfff3f]/20 border-[#dfff3f] text-[#e9ff8a] shadow-[0_0_10px_rgba(223,255,63,.25)]' : 'bg-white/[.04] border-white/10 text-zinc-300 hover:bg-white/[.08]'}`}>{item.label}</button>)}</div>
        {(selectedGate === 'CNOT' || selectedGate === 'CZ') && <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-zinc-400">Control: {Array.from({ length: numQubits }, (_, i) => <button key={i} onClick={() => setControlQubit(i)} className={`px-2 py-1 rounded ${controlQubit === i ? 'bg-pink-500 text-white' : 'bg-white/[.08] text-zinc-300'}`}>q[{i}]</button>)}</div>}
        {['RX', 'RY', 'RZ'].includes(selectedGate) && <label className="mt-3 flex items-center gap-3 text-[11px] font-mono text-zinc-400">θ = {angle.toFixed(2)} rad<input type="range" min={-Math.PI} max={Math.PI} step={0.01} value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="w-56" /></label>}
      </section>

      <section className="bg-white/[.05] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-sm overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `80px repeat(${numSteps}, minmax(72px, 1fr))` }}><div className="text-xs font-mono text-zinc-500">Qubit</div>{Array.from({ length: numSteps }, (_, step) => <button key={step} onClick={() => setScrubStep(scrubStep === step ? null : step)} className={`text-xs font-mono py-1 rounded ${scrubStep === step ? 'bg-[#dfff3f]/20 text-[#e9ff8a] border border-[#dfff3f]/40' : 'text-zinc-500 hover:text-zinc-200'}`}>Step {step}</button>)}</div>
          <div className="space-y-3">{Array.from({ length: numQubits }, (_, q) => <div key={q} className="grid gap-2 items-center" style={{ gridTemplateColumns: `80px repeat(${numSteps}, minmax(72px, 1fr))` }}>
            <div className="flex items-center gap-2"><span className="px-2 py-1 rounded border border-white/10 bg-black/40 text-[#e9ff8a] text-xs font-mono">q[{q}]</span><span className="text-[11px] text-zinc-500">|0⟩</span></div>
            {Array.from({ length: numSteps }, (_, step) => {
              const gate = gates.find((item) => item.step === step && item.targetQubit === q);
              const control = gates.find((item) => item.step === step && (item.controlQubit === q || item.controlQubit2 === q));
              const swapTarget = gates.find((item) => item.step === step && item.secondTarget === q);
              const active = gate || control || swapTarget;
              return <button key={step} onClick={() => placeGate(q, step)} className={`h-12 rounded-lg border relative flex items-center justify-center text-xs font-mono transition-all ${gate ? 'bg-[#dfff3f]/80 border-[#e9ff8a] text-slate-950 font-bold shadow-[0_0_12px_rgba(223,255,63,.25)]' : control ? 'bg-cyan-400/10 border-cyan-400/50' : swapTarget ? 'bg-pink-500/10 border-pink-400/50' : 'border-dashed border-white/10 hover:border-[#dfff3f]/40 hover:bg-[#dfff3f]/5'}`}>
                {gate ? <span>{gate.gate}{gate.param !== undefined && <small className="block opacity-70">{gate.param.toFixed(2)}</small>}</span> : control ? <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.8)]" /> : swapTarget ? <span className="text-pink-300 text-lg">⊕</span> : <span className="text-transparent">·</span>}
                {active && (active.controlQubit !== undefined || active.secondTarget !== undefined) && <span className="absolute inset-x-1/2 top-0 bottom-0 w-px bg-white/20 -z-0" />}
              </button>;
            })}
          </div>)}</div>
          {scrubStep !== null && <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg border border-[#dfff3f]/30 bg-[#dfff3f]/10 text-xs"><span className="font-mono text-[#e9ff8a]">Live state is simulated through Step {scrubStep}.</span><button onClick={() => setScrubStep(null)} className="underline text-zinc-300">Show final state</button></div>}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3"><button onClick={() => setTab('state')} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tab === 'state' ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40' : 'text-zinc-400'}`}><Layers className="w-3.5 h-3.5" />State + Histogram</button><button onClick={() => setTab('bloch')} className={`px-3 py-1.5 rounded-lg text-xs ${tab === 'bloch' ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40' : 'text-zinc-400'}`}>Bloch Spheres</button><button onClick={() => setTab('code')} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${tab === 'code' ? 'bg-[#dfff3f]/15 text-[#e9ff8a] border border-[#dfff3f]/40' : 'text-zinc-400'}`}><Code2 className="w-3.5 h-3.5" />Code Export</button></div>

      {tab === 'state' && <StateVectorVisualizer simulation={simulation} numQubits={numQubits} onResimulateShots={setShots} />}
      {tab === 'bloch' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{simulation.blochVectors.map((state, index) => <BlochSphere3D key={index} qubitState={state} qubitIndex={index} label={`Qubit q[${index}]`} size={270} interactive={false} />)}</div>}
      {tab === 'code' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Object.entries(codes).map(([key, code]) => <div key={key} className="bg-white/[.04] border border-white/10 rounded-xl p-3"><div className="flex justify-between items-center mb-2"><span className="text-xs font-mono text-[#e9ff8a] uppercase">{key}</span><button onClick={() => void copy(key, code)} className="text-xs text-zinc-400 flex items-center gap-1">{copied === key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied === key ? 'Copied' : 'Copy'}</button></div><pre className="text-[11px] text-zinc-300 bg-black/50 rounded-lg p-3 overflow-auto max-h-64"><code>{code}</code></pre></div>)}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono"><div className="p-3 rounded-xl bg-white/[.04] border border-white/10"><span className="text-zinc-500">State</span><div className="mt-1 text-zinc-200 break-words">{simulation.diracNotation}</div></div><div className="p-3 rounded-xl bg-white/[.04] border border-white/10"><span className="text-zinc-500">Entanglement</span><div className={`mt-1 font-bold ${simulation.isEntangled ? 'text-pink-300' : 'text-emerald-300'}`}>{simulation.isEntangled ? 'Detected' : 'Not detected'}</div></div><div className="p-3 rounded-xl bg-white/[.04] border border-white/10"><span className="text-zinc-500">Measurement shots</span><div className="mt-1 text-[#e9ff8a]">{simulation.totalShots}</div></div></div>
    </div>
  );
};
