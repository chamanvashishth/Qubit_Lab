import React, { useState } from 'react';
import { Compass, Binary, Layers, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { C } from '../../utils/quantumEngine';
import { Complex } from '../../types/quantum';

export const MathModule: React.FC = () => {
  // Complex Argand plane state
  const [realPart, setRealPart] = useState(0.707);
  const [imagPart, setImagPart] = useState(0.707);

  // Unitary check matrix presets
  const [selectedMatrixName, setSelectedMatrixName] = useState<'H' | 'X' | 'Z' | 'NonUnitary'>('H');

  // Tensor product vector inputs
  const [q0Alpha, setQ0Alpha] = useState(1); // |0>
  const [q1Alpha, setQ1Alpha] = useState(0); // |1>

  const mag = Math.sqrt(realPart * realPart + imagPart * imagPart);
  const phase = Math.atan2(imagPart, realPart);
  const phaseDeg = ((phase * 180) / Math.PI + 360) % 360;

  // Matrices
  const SQRT2_INV = 1 / Math.SQRT2;
  const matrices = {
    H: [
      [C.create(SQRT2_INV, 0), C.create(SQRT2_INV, 0)],
      [C.create(SQRT2_INV, 0), C.create(-SQRT2_INV, 0)],
    ],
    X: [
      [C.create(0, 0), C.create(1, 0)],
      [C.create(1, 0), C.create(0, 0)],
    ],
    Z: [
      [C.create(1, 0), C.create(0, 0)],
      [C.create(0, 0), C.create(-1, 0)],
    ],
    NonUnitary: [
      [C.create(1.5, 0), C.create(0, 0)],
      [C.create(0, 0), C.create(0.8, 0)],
    ],
  };

  const currentMat = matrices[selectedMatrixName];
  // Check unitarity: U^dagger * U = I
  // For 2x2:
  // [u00* u10*] [u00 u01] = [|u00|^2 + |u10|^2,  u00*u01 + u10*u11]
  // [u01* u11*] [u10 u11]   [u01*u00 + u11*u10,  |u01|^2 + |u11|^2]
  const d00 = C.add(C.mul(C.conj(currentMat[0][0]), currentMat[0][0]), C.mul(C.conj(currentMat[1][0]), currentMat[1][0]));
  const d11 = C.add(C.mul(C.conj(currentMat[0][1]), currentMat[0][1]), C.mul(C.conj(currentMat[1][1]), currentMat[1][1]));
  const d01 = C.add(C.mul(C.conj(currentMat[0][0]), currentMat[0][1]), C.mul(C.conj(currentMat[1][0]), currentMat[1][1]));

  const isUnitary = Math.abs(d00.r - 1) < 0.01 && Math.abs(d11.r - 1) < 0.01 && C.abs(d01) < 0.01;

  // Tensor product computation:
  // q0 = [a0, b0]^T, q1 = [a1, b1]^T
  // q0 (x) q1 = [a0*a1, a0*b1, b0*a1, b0*b1]^T
  const q0Beta = Math.sqrt(Math.max(0, 1 - q0Alpha * q0Alpha));
  const q1Beta = Math.sqrt(Math.max(0, 1 - q1Alpha * q1Alpha));

  const tensor00 = q0Alpha * q1Alpha;
  const tensor01 = q0Alpha * q1Beta;
  const tensor10 = q0Beta * q1Alpha;
  const tensor11 = q0Beta * q1Beta;

  return (
    <div className="space-y-8">
      {/* 1. Argand Plane Complex Number Visualizer */}
      <div className="bg-[#091124] border border-cyan-500/25 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/15">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Complex Numbers on the 2D Argand Plane
            </h3>
            <p className="text-xs text-slate-400">
              Quantum probability amplitudes are complex numbers z = a + bi = r e^(iθ)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* 2D Argand Plane SVG Canvas */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400 mb-2">
              Argand Diagram (Re vs Im Axes)
            </span>
            <div className="relative w-64 h-64 border border-slate-800 rounded-lg bg-[#050914] overflow-hidden">
              <svg className="w-full h-full" viewBox="-1.5 -1.5 3 3">
                {/* Axes */}
                <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#334155" strokeWidth="0.02" />
                <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#334155" strokeWidth="0.02" />

                {/* Unit Circle (r = 1) */}
                <circle cx="0" cy="0" r="1" fill="none" stroke="#0284c7" strokeWidth="0.02" strokeDasharray="0.05,0.05" opacity="0.6" />

                {/* Vector arrow */}
                {/* Note: In SVG, y is downward, so imaginary part is negated for standard math display */}
                <line
                  x1="0"
                  y1="0"
                  x2={realPart}
                  y2={-imagPart}
                  stroke="#22d3ee"
                  strokeWidth="0.04"
                />
                <circle cx={realPart} cy={-imagPart} r="0.06" fill="#38bdf8" />

                {/* Projection dashed lines */}
                <line x1={realPart} y1="0" x2={realPart} y2={-imagPart} stroke="#94a3b8" strokeWidth="0.015" strokeDasharray="0.04,0.04" />
                <line x1="0" y1={-imagPart} x2={realPart} y2={-imagPart} stroke="#94a3b8" strokeWidth="0.015" strokeDasharray="0.04,0.04" />

                {/* Axis Labels */}
                <text x="1.2" y="-0.08" fill="#64748b" fontSize="0.16" fontFamily="monospace">Re</text>
                <text x="0.08" y="-1.25" fill="#64748b" fontSize="0.16" fontFamily="monospace">Im</text>
              </svg>
            </div>

            {/* Quick Sliders */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-300">Real Part a: {realPart.toFixed(2)}</span>
                <span className="text-purple-300">Imag Part b: {imagPart.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={realPart}
                onChange={(e) => setRealPart(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={imagPart}
                onChange={(e) => setImagPart(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          {/* Formats & Mathematical Properties */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 space-y-3 font-mono text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Calculated Mathematical Properties
            </span>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Cartesian Form:</span>
              <span className="text-cyan-300 font-bold">
                z = {realPart.toFixed(2)} {imagPart >= 0 ? '+' : '-'} {Math.abs(imagPart).toFixed(2)}i
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Polar Exponential:</span>
              <span className="text-purple-300 font-bold">
                z = {mag.toFixed(2)} · e^(i · {phase.toFixed(2)})
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Magnitude |z|:</span>
              <span className="text-slate-200">{mag.toFixed(3)}</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Phase Angle θ:</span>
              <span className="text-slate-200">{phaseDeg.toFixed(1)}° ({phase.toFixed(2)} rad)</span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Complex Conjugate z*:</span>
              <span className="text-indigo-300">
                {realPart.toFixed(2)} {imagPart >= 0 ? '-' : '+'} {Math.abs(imagPart).toFixed(2)}i
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Probability |z|² = z · z*:</span>
              <span className="text-emerald-400 font-bold">{(mag * mag).toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unitary Matrix Checker & Tensor Product Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unitary Checker */}
        <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/15">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Binary className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Unitary Matrix Checker</h3>
                <p className="text-xs text-slate-400">Tests U†U = I (probability preservation)</p>
              </div>
            </div>

            {/* Matrix selector */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'H', label: 'Hadamard (H)' },
                { key: 'X', label: 'Pauli-X' },
                { key: 'Z', label: 'Pauli-Z' },
                { key: 'NonUnitary', label: 'Non-Unitary Test' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMatrixName(m.key as any)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono border transition-colors ${
                    selectedMatrixName === m.key
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Matrix Grid */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-center gap-3">
              <span className="text-slate-400">U =</span>
              <div className="border-l-2 border-r-2 border-cyan-400 px-3 py-1 grid grid-cols-2 gap-4 text-center">
                <span>{currentMat[0][0].r.toFixed(2)}</span>
                <span>{currentMat[0][1].r.toFixed(2)}</span>
                <span>{currentMat[1][0].r.toFixed(2)}</span>
                <span>{currentMat[1][1].r.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">U†U = I Test:</span>
            {isUnitary ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Valid Unitary Transformation
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                Non-Unitary (Violates Normalization)
              </span>
            )}
          </div>
        </div>

        {/* Tensor Products (Kronecker product) */}
        <div className="bg-[#080d1e] border border-indigo-500/20 rounded-2xl p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-500/15">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Tensor Products (A ⊗ B)</h3>
                <p className="text-xs text-slate-400">Combine multiple single-qubit states into 4D space</p>
              </div>
            </div>

            {/* Slider inputs for q0 and q1 */}
            <div className="space-y-3 font-mono text-xs mb-4">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>|q0⟩ = {q0Alpha.toFixed(2)}|0⟩ + {q0Beta.toFixed(2)}|1⟩</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={q0Alpha}
                  onChange={(e) => setQ0Alpha(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>|q1⟩ = {q1Alpha.toFixed(2)}|0⟩ + {q1Beta.toFixed(2)}|1⟩</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={q1Alpha}
                  onChange={(e) => setQ1Alpha(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>
            </div>

            {/* Evaluated 4-element Tensor vector */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-indigo-300 font-bold block mb-1">|q0⟩ ⊗ |q1⟩ Result:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <span>|00⟩: {tensor00.toFixed(3)}</span>
                <span>|01⟩: {tensor01.toFixed(3)}</span>
                <span>|10⟩: {tensor10.toFixed(3)}</span>
                <span>|11⟩: {tensor11.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            Notice how tensor product states are always separable. When entanglement occurs, the composite state cannot be written as |q0⟩ ⊗ |q1⟩!
          </p>
        </div>
      </div>
    </div>
  );
};
