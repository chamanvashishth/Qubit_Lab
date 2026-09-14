import React, { useMemo, useState } from 'react';
import { Beaker, CheckCircle2, FlaskConical, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { ConceptNode } from '../../data/adaptiveLearning';
import { simulateCircuit } from '../../utils/quantumEngine';
import { GatePlacement } from '../../types/quantum';

interface Props { concept: ConceptNode; onComplete: (correct: boolean) => void; onAskAI?: () => void; }

const missions: Record<string, { qubits: number; gates: GatePlacement[]; choices: string[]; correct: number; explanation: string }> = {
  qubit: { qubits: 1, gates: [], choices: ['The state is |0⟩', 'The state is |1⟩', 'It is always 50/50'], correct: 0, explanation: 'The default computational-basis state is |0⟩. A qubit is not automatically in superposition.' },
  superposition: { qubits: 1, gates: [{ id: 'h', gate: 'H', targetQubit: 0, step: 0 }], choices: ['100% |0⟩', '50% |0⟩ and 50% |1⟩', '100% |1⟩'], correct: 1, explanation: 'H|0⟩ creates equal-magnitude amplitudes, so computational-basis measurement gives 50% |0⟩ and 50% |1⟩.' },
  measurement: { qubits: 1, gates: [{ id: 'h', gate: 'H', targetQubit: 0, step: 0 }], choices: ['Every shot must be different', 'The state is guaranteed to be |0⟩', 'Repeated shots approach a 50/50 distribution'], correct: 2, explanation: 'A single measurement is probabilistic. Across many shots, frequencies converge toward the Born-rule probabilities.' },
  phase: { qubits: 1, gates: [{ id: 'h1', gate: 'H', targetQubit: 0, step: 0 }, { id: 'z', gate: 'Z', targetQubit: 0, step: 1 }, { id: 'h2', gate: 'H', targetQubit: 0, step: 2 }], choices: ['100% |0⟩', '50/50', '100% |1⟩'], correct: 2, explanation: 'H-Z-H equals X on |0⟩. Z changes the relative phase, and the second H converts that phase difference into amplitude.' },
  entanglement: { qubits: 2, gates: [{ id: 'h', gate: 'H', targetQubit: 0, step: 0 }, { id: 'cx', gate: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 }], choices: ['Only 00 and 11 appear', 'All four outcomes equally often', 'Only 01 and 10 appear'], correct: 0, explanation: 'The Bell circuit prepares (|00⟩ + |11⟩)/√2, so computational-basis measurements are perfectly correlated.' },
  'linear-algebra': { qubits: 1, gates: [{ id: 'x', gate: 'X', targetQubit: 0, step: 0 }], choices: ['X maps |0⟩ to |1⟩', 'X changes the number of qubits', 'X is a measurement'], correct: 0, explanation: 'The Pauli-X gate swaps the computational basis states: X|0⟩ = |1⟩ and X|1⟩ = |0⟩.' },
  grover: { qubits: 2, gates: [{ id: 'h0', gate: 'H', targetQubit: 0, step: 0 }, { id: 'h1', gate: 'H', targetQubit: 1, step: 0 }, { id: 'cz', gate: 'CZ', targetQubit: 1, controlQubit: 0, step: 1 }, { id: 'h2', gate: 'H', targetQubit: 0, step: 2 }, { id: 'h3', gate: 'H', targetQubit: 1, step: 2 }], choices: ['Interference can reshape amplitudes', 'Grover ignores amplitudes', 'Grover measures before creating a state'], correct: 0, explanation: 'Grover-style amplification relies on controlled phase changes and interference to increase the amplitude of marked states.' },
};

export const AdaptiveExperiment: React.FC<Props> = ({ concept, onComplete, onAskAI }) => {
  const mission = missions[concept.id] ?? missions.qubit;
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hasScored, setHasScored] = useState(false);
  const simulation = useMemo(() => simulateCircuit({ numQubits: mission.qubits, numSteps: 4, gates: mission.gates }, 1024), [mission]);
  const probabilities = simulation.probabilities ?? {};
  const correct = submitted && selected === mission.correct;
  const reset = () => { setSelected(null); setSubmitted(false); };
  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (!hasScored) { setHasScored(true); onComplete(selected === mission.correct); }
  };
  const evidence = Object.entries(probabilities).slice(0, Math.min(Object.keys(probabilities).length, 8));

  return <section className="glass-section rounded-2xl p-6 space-y-5">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4"><div><div className="text-[10px] uppercase tracking-[.2em] text-zinc-500 flex items-center gap-2"><FlaskConical className="w-3.5 h-3.5 text-[#dfff3f]" /> Guided quantum lab</div><h2 className="text-xl font-semibold text-zinc-100 mt-2">Predict before you run</h2><p className="text-sm text-zinc-400 mt-1">{concept.experiment}</p></div>{onAskAI && <button onClick={onAskAI} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Ask the guide</button>}</div>
    <div className="grid lg:grid-cols-[1fr_280px] gap-5"><div><div className="rounded-xl border border-white/10 bg-black/25 p-4"><div className="text-[10px] uppercase tracking-[.16em] text-zinc-600">Circuit</div><div className="font-mono text-sm text-zinc-200 mt-2">|0{mission.qubits > 1 ? '0'.repeat(mission.qubits - 1) : ''}⟩ {mission.gates.length ? '→ ' + mission.gates.map(g => g.gate).join(' → ') : '→ inspect'}</div><div className="text-xs text-zinc-500 mt-2">Prediction first. The evidence is revealed after you submit.</div></div>
    <div className="mt-4 space-y-2"><div className="text-[10px] uppercase tracking-[.16em] text-zinc-600">What do you predict?</div>{mission.choices.map((choice, index) => { const active = selected === index; const state = submitted ? index === mission.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : active ? 'border-rose-500/40 bg-rose-500/10 text-rose-200' : 'border-white/10 bg-white/5 text-zinc-500' : active ? 'border-[#dfff3f]/50 bg-[#dfff3f]/10 text-zinc-100' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20'; return <button key={choice} disabled={submitted} onClick={() => setSelected(index)} className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${state}`}>{choice}{submitted && index === mission.correct && <CheckCircle2 className="inline ml-2 w-4 h-4 text-emerald-400" />}{submitted && active && index !== mission.correct && <XCircle className="inline ml-2 w-4 h-4 text-rose-400" />}</button>; })}</div>
    {submitted && <div className={`mt-4 rounded-xl border p-4 text-xs leading-6 ${correct ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100' : 'border-amber-500/20 bg-amber-500/5 text-zinc-300'}`}><b>{correct ? 'Good prediction.' : 'Useful surprise.'}</b> {mission.explanation}</div>}
    <div className="flex gap-2 mt-4">{!submitted ? <button onClick={submit} disabled={selected === null} className="template-button px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-40"><Beaker className="inline w-3.5 h-3.5 mr-1" /> Run & verify</button> : <button onClick={reset} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300"><RotateCcw className="inline w-3.5 h-3.5 mr-1" /> Try again</button>}</div></div>
    <div className="rounded-xl border border-white/10 bg-black/25 p-4"><div className="text-[10px] uppercase tracking-[.16em] text-zinc-600">Evidence</div>{submitted ? <div className="space-y-3 mt-4">{evidence.map(([basis, value]) => <div key={basis}><div className="flex justify-between text-[10px] font-mono text-zinc-500"><span>|{basis}⟩</span><span>{Math.round(value * 100)}%</span></div><div className="h-2 bg-white/5 rounded-full mt-1 overflow-hidden"><div className="h-full bg-[#dfff3f]" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} /></div></div>)}</div> : <div className="mt-4 text-xs leading-6 text-zinc-500">Choose an answer first. Once you run the mission, the simulator evidence will appear here.</div>}</div>
    </div>
  </section>;
};
