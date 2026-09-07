import React, { useState } from 'react';
import { 
  Sparkles, Network, RefreshCw, Play, ShieldAlert, ArrowRight, Zap, Eye
} from 'lucide-react';

export const ConceptsModule: React.FC = () => {
  // Superposition wave interference state
  const [phaseAngle, setPhaseAngle] = useState(0); // in radians
  const [coinSpeed, setCoinSpeed] = useState(1);

  // Bell State Entanglement demo
  const [bellState, setBellState] = useState<'PhiPlus' | 'PhiMinus' | 'PsiPlus' | 'PsiMinus'>('PhiPlus');
  const [aliceMeasurement, setAliceMeasurement] = useState<0 | 1 | null>(null);
  const [bobMeasurement, setBobMeasurement] = useState<0 | 1 | null>(null);
  const [entanglementHistory, setEntanglementHistory] = useState<{ a: number; b: number }[]>([]);

  // Wave interference amplitudes for Mach-Zehnder:
  // Port 0 amplitude ~ cos(phase / 2), Port 1 amplitude ~ sin(phase / 2)
  const pPort0 = Math.pow(Math.cos(phaseAngle / 2), 2);
  const pPort1 = Math.pow(Math.sin(phaseAngle / 2), 2);

  const triggerEntangledMeasurement = () => {
    // Generate correlation according to selected Bell state:
    // |Phi+> = (|00> + |11>)/sqrt(2) => Bob is same as Alice
    // |Phi-> = (|00> - |11>)/sqrt(2) => Bob is same as Alice
    // |Psi+> = (|01> + |10>)/sqrt(2) => Bob is opposite Alice
    // |Psi-> = (|01> - |10>)/sqrt(2) => Bob is opposite Alice
    const a = Math.random() < 0.5 ? 0 : 1;
    let b: 0 | 1 = 0;

    if (bellState === 'PhiPlus' || bellState === 'PhiMinus') {
      b = a as 0 | 1; // correlated
    } else {
      b = (a === 0 ? 1 : 0) as 0 | 1; // anti-correlated
    }

    setAliceMeasurement(a);
    setBobMeasurement(b);
    setEntanglementHistory((prev) => [{ a, b }, ...prev.slice(0, 7)]);
  };

  const resetBellMeasurement = () => {
    setAliceMeasurement(null);
    setBobMeasurement(null);
  };

  return (
    <div className="space-y-8">
      {/* 1. Superposition & Quantum Wave Interference */}
      <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/15">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Quantum Superposition & Wave Interference Demo
            </h3>
            <p className="text-xs text-slate-400">
              Manipulate relative quantum phase to observe constructive vs destructive wave interference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phase Control & Live Interference Pattern */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Phase Shifter φ:</span>
              <span className="text-cyan-400 font-bold">
                {((phaseAngle * 180) / Math.PI).toFixed(0)}° ({(phaseAngle / Math.PI).toFixed(2)}π rad)
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step="0.05"
              value={phaseAngle}
              onChange={(e) => setPhaseAngle(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            {/* Interference Canvas Graph */}
            <div className="p-4 rounded-xl bg-[#060c1a] border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-mono text-slate-400 mb-2">Interferometer Output Ports</span>

              <div className="w-full space-y-3">
                {/* Detector 0 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-300">Detector 0 (Constructive):</span>
                    <span className="text-cyan-400 font-bold">{(pPort0 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-150"
                      style={{ width: `${pPort0 * 100}%` }}
                    />
                  </div>
                </div>

                {/* Detector 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-purple-300">Detector 1 (Destructive):</span>
                    <span className="text-purple-400 font-bold">{(pPort1 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-purple-500 transition-all duration-150"
                      style={{ width: `${pPort1 * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { label: '0° (100% Port 0)', val: 0 },
                { label: '90° (50/50 Split)', val: Math.PI / 2 },
                { label: '180° (100% Port 1)', val: Math.PI },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPhaseAngle(p.val)}
                  className="flex-1 py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theoretical Breakdown */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                The Mach-Zehnder Interferometer Analogy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a single photon enters a 50:50 beam splitter (Hadamard gate), it travels through both paths simultaneously as a quantum probability wave:
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 text-center">
                |ψ⟩ = cos(φ/2)|0⟩ + i sin(φ/2)|1⟩
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                By tuning the phase shifter φ, the probability wave constructively reinforces at one detector and cancels at the other. This is the cornerstone of quantum computation!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quantum Entanglement & Bell States Visualizer */}
      <div className="bg-[#080d1e] border border-purple-500/25 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Quantum Entanglement & Bell States Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Test Einstein-Podolsky-Rosen (EPR) non-local correlations across two entangled qubits
              </p>
            </div>
          </div>

          {/* Bell State Selector */}
          <div className="flex gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {[
              { id: 'PhiPlus', label: '|Φ⁺⟩' },
              { id: 'PhiMinus', label: '|Φ⁻⟩' },
              { id: 'PsiPlus', label: '|Ψ⁺⟩' },
              { id: 'PsiMinus', label: '|Ψ⁻⟩' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBellState(b.id as any);
                  resetBellMeasurement();
                }}
                className={`px-3 py-1 rounded transition-colors ${
                  bellState === b.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bell State Equation display */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-center font-mono text-purple-300 text-sm mb-6">
          {bellState === 'PhiPlus' && '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2  → Perfectly Correlated (Same outcomes)'}
          {bellState === 'PhiMinus' && '|Φ⁻⟩ = (|00⟩ - |11⟩) / √2  → Perfectly Correlated with π Phase Shift'}
          {bellState === 'PsiPlus' && '|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2  → Anti-Correlated (Opposite outcomes)'}
          {bellState === 'PsiMinus' && '|Ψ⁻⟩ = (|01⟩ - |10⟩) / √2  → Singlet State (Anti-Correlated)'}
        </div>

        {/* Alice and Bob Interactive Measurement Chamber */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Entanglement Bridge Connector Graphic */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400 text-purple-200 text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-purple-950">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              Non-Local EPR Channel
            </div>
          </div>

          {/* Alice's Laboratory */}
          <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                  Alice\'s Qubit (Station A)
                </span>
                <span className="text-xs text-slate-400 font-mono">q[0]</span>
              </div>

              <div className="my-6 flex flex-col items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-mono font-extrabold transition-all duration-300 ${
                  aliceMeasurement !== null
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-600 animate-pulse'
                }`}>
                  {aliceMeasurement !== null ? `|${aliceMeasurement}⟩` : '?'}
                </div>
                <span className="text-xs text-slate-400 mt-2 font-mono">
                  {aliceMeasurement !== null ? 'Collapsed' : 'Coherent Superposition'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Alice measures first in the Z-basis with 50% random chance of |0⟩ or |1⟩.
            </p>
          </div>

          {/* Bob's Laboratory */}
          <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wide">
                  Bob\'s Qubit (Station B)
                </span>
                <span className="text-xs text-slate-400 font-mono">q[1]</span>
              </div>

              <div className="my-6 flex flex-col items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-mono font-extrabold transition-all duration-300 ${
                  bobMeasurement !== null
                    ? 'bg-purple-500/20 border-2 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-600 animate-pulse'
                }`}>
                  {bobMeasurement !== null ? `|${bobMeasurement}⟩` : '?'}
                </div>
                <span className="text-xs text-slate-400 mt-2 font-mono">
                  {bobMeasurement !== null ? 'Instantaneous Collapse' : 'Coherent Superposition'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Bob\'s qubit collapses immediately with deterministic correlation, regardless of distance!
            </p>
          </div>
        </div>

        {/* Trigger Button & Correlation Log */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={triggerEntangledMeasurement}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-95"
            >
              <Eye className="w-4 h-4" />
              Perform Bell Measurement
            </button>

            {aliceMeasurement !== null && (
              <button
                onClick={resetBellMeasurement}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-mono"
              >
                Reset States
              </button>
            )}
          </div>

          {/* History log */}
          {entanglementHistory.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto">
              <span className="text-slate-400">Outcomes:</span>
              {entanglementHistory.map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-purple-500/30 text-purple-300"
                >
                  |{h.a}{h.b}⟩
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
