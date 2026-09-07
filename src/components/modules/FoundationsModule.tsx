import React, { useState } from 'react';
import { 
  Binary, Cpu, Sparkles, ArrowRight, RefreshCw, CheckCircle2, 
  HelpCircle, Zap, Shield, BookOpen 
} from 'lucide-react';

export const FoundationsModule: React.FC = () => {
  // Classical vs Quantum state
  const [classicalBit, setClassicalBit] = useState<0 | 1>(0);
  const [qubitAlpha, setQubitAlpha] = useState(0.7071); // cos(pi/4)
  const [measurementHistory, setMeasurementHistory] = useState<number[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Dirac Trainer state
  const [diracBra, setDiracBra] = useState<'0' | '1' | '+'>('0');
  const [diracKet, setDiracKet] = useState<'0' | '1' | '+'>('+');

  const qubitBeta = Math.sqrt(Math.max(0, 1 - qubitAlpha * qubitAlpha));
  const prob0 = qubitAlpha * qubitAlpha;
  const prob1 = qubitBeta * qubitBeta;

  const measureQubit = () => {
    setIsMeasuring(true);
    setTimeout(() => {
      const outcome = Math.random() < prob0 ? 0 : 1;
      setMeasurementHistory((prev) => [outcome, ...prev.slice(0, 9)]);
      setIsMeasuring(false);
    }, 250);
  };

  // Compute inner product <bra|ket>
  const computeInnerProduct = (bra: string, ket: string): string => {
    if (bra === '0' && ket === '0') return '1 (orthogonal with |1⟩)';
    if (bra === '0' && ket === '1') return '0 (orthogonal)';
    if (bra === '0' && ket === '+') return '1/√2 ≈ 0.707 (amplitude)';
    if (bra === '1' && ket === '0') return '0 (orthogonal)';
    if (bra === '1' && ket === '1') return '1';
    if (bra === '1' && ket === '+') return '1/√2 ≈ 0.707';
    if (bra === '+' && ket === '+') return '1';
    return '0.707';
  };

  return (
    <div className="space-y-8">
      {/* Interactive Side-by-Side: Classical Bit vs Quantum Qubit */}
      <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/15">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Interactive Comparison: Classical Bit vs Quantum Qubit
            </h3>
            <p className="text-xs text-slate-400">
              Toggle classical binary states versus continuous quantum superposition amplitudes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classical Bit Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Classical Bit (Von Neumann)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                  Deterministic
                </span>
              </div>

              <div className="my-6 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-4xl font-mono font-extrabold text-slate-100 shadow-inner">
                  {classicalBit}
                </div>
                <p className="text-xs text-slate-400 mt-3 font-mono">
                  State: S ∈ &#123; 0, 1 &#125; (Exclusive OR)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setClassicalBit(classicalBit === 0 ? 1 : 0)}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Flip Classical Bit (Current: {classicalBit})
              </button>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Silicon transistors exist solely in high or low voltage cutoff regions. No superposition is physically possible.
              </p>
            </div>
          </div>

          {/* Quantum Qubit Card */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-cyan-950/20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Quantum Qubit (Hilbert Space)
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono">
                  Probabilistic
                </span>
              </div>

              {/* State vector equation */}
              <div className="p-2.5 rounded-lg bg-[#060c1c] border border-cyan-500/20 text-center font-mono text-cyan-300 text-xs mb-4">
                |ψ⟩ = {qubitAlpha.toFixed(3)}|0⟩ + {qubitBeta.toFixed(3)}|1⟩
              </div>

              {/* Probability bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-300">P(|0⟩) = |α|² = {(prob0 * 100).toFixed(1)}%</span>
                  <span className="text-indigo-300">P(|1⟩) = |β|² = {(prob1 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${prob0 * 100}%` }}
                  />
                  <div
                    className="h-full bg-indigo-500 transition-all duration-200"
                    style={{ width: `${prob1 * 100}%` }}
                  />
                </div>
              </div>

              {/* Amplitude Slider */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Adjust Superposition Amplitude α:</span>
                  <span className="text-cyan-400">{qubitAlpha.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={qubitAlpha}
                  onChange={(e) => setQubitAlpha(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Live Measurement Trigger & Collapse History */}
            <div className="mt-5 pt-3 border-t border-slate-800 space-y-2.5">
              <button
                onClick={measureQubit}
                disabled={isMeasuring}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {isMeasuring ? 'Collapsing Wavefunction...' : 'Measure Qubit (Trigger Collapse)'}
              </button>

              {/* Recent measurement history chips */}
              {measurementHistory.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                  <span className="text-slate-400">History:</span>
                  {measurementHistory.map((val, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded font-bold ${
                        val === 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      |{val}⟩
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bra-Ket (Dirac Notation) Trainer */}
      <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/15">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Interactive Bra-Ket (Dirac Notation) Trainer
            </h3>
            <p className="text-xs text-slate-400">
              Calculate inner products ⟨bra|ket⟩, outer products |ket⟩⟨bra|, and projection operators
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Bra selector */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono text-purple-400 block mb-2 font-semibold">
              Select Dual Bra Vector ⟨φ|:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['0', '1', '+'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setDiracBra(b)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    diracBra === b
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ⟨{b}|
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Bra is the conjugate transpose row vector [α*, β*]
            </p>
          </div>

          {/* Ket selector */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono text-cyan-400 block mb-2 font-semibold">
              Select State Ket Vector |ψ⟩:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['0', '1', '+'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setDiracKet(k)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    diracKet === k
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  |{k}⟩
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Ket is the column vector [α, β]ᵀ
            </p>
          </div>

          {/* Evaluated Inner Product Bracket */}
          <div className="bg-gradient-to-br from-[#0e1838] to-[#12224d] border border-cyan-500/30 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-xs text-slate-400 font-mono mb-1">Inner Product (Bracket)</span>
            <div className="text-2xl font-mono font-extrabold text-cyan-300 my-1">
              ⟨{diracBra}|{diracKet}⟩
            </div>
            <div className="mt-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              = {computeInnerProduct(diracBra, diracKet)}
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              Probability: |⟨{diracBra}|{diracKet}⟩|²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
