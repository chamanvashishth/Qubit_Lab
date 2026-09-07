import React, { useState } from 'react';
import { 
  Activity, Search, ShieldAlert, Zap, ArrowRight, Play, 
  RotateCcw, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const AlgorithmsModule: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'deutsch' | 'grover' | 'shor' | 'vqe'>('grover');

  // Deutsch-Jozsa state
  const [oracleType, setOracleType] = useState<'constant' | 'balanced'>('balanced');
  const [djMeasured, setDjMeasured] = useState<string | null>(null);

  // Grover state
  const [markedItem, setMarkedItem] = useState<'00' | '01' | '10' | '11'>('11');
  const [groverStep, setGroverStep] = useState<0 | 1 | 2>(0);

  // Shor state
  const [shorA, setShorA] = useState<number>(7);
  const [shorResult, setShorResult] = useState<{ r: number; p: number; q: number } | null>(null);

  // VQE parameter
  const [vqeTheta, setVqeTheta] = useState(1.85);

  // Run Deutsch-Jozsa simulation
  const runDeutschJozsa = () => {
    // Constant always collapses to |0>, Balanced always collapses to |1>
    setDjMeasured(oracleType === 'constant' ? '|0⟩ (Constant Function Verified)' : '|1⟩ (Balanced Function Verified)');
  };

  // Grover state amplitudes
  // Step 0: [0.5, 0.5, 0.5, 0.5]
  // Step 1: Oracle flips sign of marked item, e.g. if '11': [0.5, 0.5, 0.5, -0.5]
  // Step 2: Inversion about mean: Mean = (0.5+0.5+0.5-0.5)/4 = 0.25. 2*Mean - a_i:
  // For unmarked: 2(0.25) - 0.5 = 0
  // For marked: 2(0.25) - (-0.5) = 1.0!
  const getGroverAmplitudes = () => {
    const items = ['00', '01', '10', '11'] as const;
    if (groverStep === 0) {
      return items.map((it) => ({ item: it, amp: 0.5, prob: 0.25 }));
    }
    if (groverStep === 1) {
      return items.map((it) => ({
        item: it,
        amp: it === markedItem ? -0.5 : 0.5,
        prob: 0.25,
      }));
    }
    // Step 2:
    return items.map((it) => ({
      item: it,
      amp: it === markedItem ? 1.0 : 0.0,
      prob: it === markedItem ? 1.0 : 0.0,
    }));
  };

  // Shor's 15 factoring order finder
  const computeShorFactoring = () => {
    // N = 15
    // a in {2, 7, 8, 11, 13}
    // 7^1 mod 15 = 7, 7^2 = 49 = 4, 7^3 = 28 = 13, 7^4 = 1 -> r = 4
    let r = 1;
    let val = shorA % 15;
    while (val !== 1 && r < 10) {
      val = (val * shorA) % 15;
      r++;
    }

    // Factors: gcd(a^(r/2) - 1, 15), gcd(a^(r/2) + 1, 15)
    const halfPow = Math.pow(shorA, r / 2);
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const p = gcd(Math.abs(halfPow - 1), 15);
    const q = gcd(halfPow + 1, 15);

    setShorResult({ r, p, q });
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'grover', label: "Grover's Search", icon: Search },
          { id: 'deutsch', label: 'Deutsch-Jozsa', icon: Activity },
          { id: 'shor', label: "Shor's Factoring (RSA)", icon: ShieldAlert },
          { id: 'vqe', label: 'Variational VQE', icon: Zap },
        ].map((algo) => {
          const Icon = algo.icon;
          const isActive = activeAlgorithm === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => setActiveAlgorithm(algo.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {algo.label}
            </button>
          );
        })}
      </div>

      {/* 1. Grover's Algorithm View */}
      {activeAlgorithm === 'grover' && (
        <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Grover's Quantum Search Algorithm
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                  O(√N) Speedup
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Amplitude amplification: geometrically rotating the statevector toward the marked item
              </p>
            </div>

            {/* Target marked state selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Marked Item |w⟩:</span>
              {(['00', '01', '10', '11'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setMarkedItem(item);
                    setGroverStep(0);
                  }}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    markedItem === item
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  |{item}⟩
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: 0, title: 'Step 0: Superposition', desc: 'Equal 25% amplitude distribution via Hadamards' },
              { step: 1, title: 'Step 1: Oracle Phase Flip', desc: `Inverts phase of marked state |${markedItem}⟩ to negative` },
              { step: 2, title: 'Step 2: Grover Diffusion', desc: 'Inversion about average amplifies probability to 100%!' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setGroverStep(s.step as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  groverStep === s.step
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-xs mb-1 text-slate-200">{s.title}</div>
                <div className="text-[11px] leading-relaxed text-slate-400">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Probability & Amplitude Amplification Bar Visualizer */}
          <div className="p-5 rounded-2xl bg-[#060c18] border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-semibold text-slate-300 block">
              Live Statevector Amplitudes & Measurement Probabilities
            </span>

            <div className="grid grid-cols-4 gap-4">
              {getGroverAmplitudes().map((sv) => {
                const isTarget = sv.item === markedItem;
                return (
                  <div
                    key={sv.item}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                      isTarget
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/40 border-slate-800/80'
                    }`}
                  >
                    <span className="font-mono font-bold text-sm text-cyan-300">
                      |{sv.item}⟩ {isTarget && '🎯'}
                    </span>

                    {/* Height Amplitude Column Graphic */}
                    <div className="h-32 w-12 flex items-center justify-center relative my-2">
                      <div className="absolute w-full h-[1px] bg-slate-700 top-1/2" />
                      <div
                        className={`w-8 rounded-md transition-all duration-300 ${
                          sv.amp < 0
                            ? 'bg-rose-500 origin-top translate-y-6'
                            : isTarget
                            ? 'bg-gradient-to-t from-cyan-500 to-blue-400'
                            : 'bg-slate-700'
                        }`}
                        style={{ height: `${Math.abs(sv.amp) * 60}px` }}
                      />
                    </div>

                    <div className="font-mono text-xs text-slate-300">
                      <div>amp: {sv.amp.toFixed(2)}</div>
                      <div className="text-cyan-400 font-bold">{(sv.prob * 100).toFixed(0)}% prob</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Deutsch-Jozsa Algorithm View */}
      {activeAlgorithm === 'deutsch' && (
        <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Deutsch-Jozsa Quantum Algorithm
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                  Single Query Determination
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Solves with 1 quantum query what requires 2^(n-1) + 1 classical queries
              </p>
            </div>

            {/* Oracle selection */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Oracle Function f(x):</span>
              <button
                onClick={() => {
                  setOracleType('constant');
                  setDjMeasured(null);
                }}
                className={`px-3 py-1 rounded font-bold transition-colors ${
                  oracleType === 'constant' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Constant (All 0 or All 1)
              </button>
              <button
                onClick={() => {
                  setOracleType('balanced');
                  setDjMeasured(null);
                }}
                className={`px-3 py-1 rounded font-bold transition-colors ${
                  oracleType === 'balanced' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Balanced (50% 0, 50% 1)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3 text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-cyan-400 font-mono block uppercase">
                The Quantum Speedup Mechanism
              </span>
              <p>
                1. <strong>Superposition</strong>: The input qubit is placed into |+⟩ and the ancilla is placed into |-⟩.
              </p>
              <p>
                2. <strong>Phase Kickback</strong>: The oracle evaluates U_f |x⟩|-⟩ = (-1)^(f(x)) |x⟩|-⟩, embedding the function value into the phase!
              </p>
              <p>
                3. <strong>Interference</strong>: The final Hadamard gate creates constructive interference on |0⟩ if f(x) is constant, and destructive cancellation yielding |1⟩ if f(x) is balanced.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-3">Execute Circuit & Measure Query Qubit</span>
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl font-mono font-extrabold text-cyan-300 shadow-inner my-2">
                  {djMeasured || '?'}
                </div>
              </div>

              <button
                onClick={runDeutschJozsa}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Play className="w-4 h-4" />
                Run 1-Query Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Shor's Algorithm Factoring 15 */}
      {activeAlgorithm === 'shor' && (
        <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/15">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Shor's Factoring Algorithm Demo (N = 15)
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">
                  Breaks RSA Encryption
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Quantum Period Finding via QFT to discover prime factors 3 and 5 of N = 15
              </p>
            </div>

            {/* Coprime a selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Choose Coprime a:</span>
              {[2, 7, 8, 11, 13].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setShorA(val);
                    setShorResult(null);
                  }}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    shorA === val ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  a = {val}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase block">
                Modular Exponentiation Sequence: f(x) = {shorA}^x mod 15
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div>x = 1: {shorA}^1 mod 15 = {Math.pow(shorA, 1) % 15}</div>
                <div>x = 2: {shorA}^2 mod 15 = {Math.pow(shorA, 2) % 15}</div>
                <div>x = 3: {shorA}^3 mod 15 = {Math.pow(shorA, 3) % 15}</div>
                <div>x = 4: {shorA}^4 mod 15 = {Math.pow(shorA, 4) % 15} (Repeats!)</div>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                The Quantum Fourier Transform extracts the period r in polynomial time O((log N)³).
              </p>
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Period r and Extracted Factors
                </span>
                {shorResult ? (
                  <div className="space-y-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                    <div>Measured Period r = {shorResult.r}</div>
                    <div className="text-sm font-bold text-slate-100">
                      Discovered Factors: {shorResult.p} × {shorResult.q} = 15!
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-900 text-center text-xs text-slate-400 font-mono">
                    Click below to simulate QFT period discovery
                  </div>
                )}
              </div>

              <button
                onClick={computeShorFactoring}
                className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Execute Quantum Order Finding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VQE Variational Quantum Eigensolver */}
      {activeAlgorithm === 'vqe' && (
        <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Variational Quantum Eigensolver (VQE)
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                NISQ Era Molecular Simulation
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hybrid quantum-classical optimization: parameterizing ansatz state |ψ(θ)⟩ to find ground state energy E₀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold block">
                Ansatz Rotation Parameter θ: {vqeTheta.toFixed(2)} rad
              </span>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.05"
                value={vqeTheta}
                onChange={(e) => setVqeTheta(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Energy expectation value formula: E(theta) = -1.137 + 0.5 * cos(2 * theta - 1.5) */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Expectation ⟨ψ(θ)|H|ψ(θ)⟩:</span>
                <span className="text-cyan-300 font-bold">
                  {(-1.137 + 0.42 * Math.cos(2 * vqeTheta - 1.5)).toFixed(4)} Hartree
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between text-emerald-300 font-bold">
                <span>Theoretical Ground State E₀:</span>
                <span>-1.5570 Hartree</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-slate-100 block font-mono">The Variational Principle:</span>
              <p className="leading-relaxed">
                No trial wavefunction can produce an energy expectation lower than the true ground state eigenvalue: ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀.
              </p>
              <p className="leading-relaxed text-slate-400">
                A quantum processor evaluates the Hamiltonian terms, while a classical optimizer updates θ until convergence.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
