import React, { useState } from 'react';
import { Play, Sparkles, BarChart2, Hash, Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { SimulationResult } from '../../types/quantum';

interface StateVectorVisualizerProps {
  simulation: SimulationResult;
  numQubits: number;
  onResimulateShots?: (shots: number) => void;
  onMeasureSingleShot?: () => void;
}

export const StateVectorVisualizer: React.FC<StateVectorVisualizerProps> = ({
  simulation,
  numQubits,
  onResimulateShots,
}) => {
  const [selectedShots, setSelectedShots] = useState(1024);
  const [collapsedState, setCollapsedState] = useState<string | null>(null);
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Compute Shannon Entropy H = -sum p_i * log2(p_i)
  const entropy = simulation.stateVector.reduce((acc, sv) => {
    if (sv.probability > 0.0001) {
      return acc - sv.probability * Math.log2(sv.probability);
    }
    return acc;
  }, 0);

  const handleCollapseSimulation = () => {
    setIsCollapsing(true);
    // Simulate live collapse according to Born's rule
    setTimeout(() => {
      let rand = Math.random();
      let cum = 0;
      let outcome = simulation.stateVector[0].basis;
      for (const sv of simulation.stateVector) {
        cum += sv.probability;
        if (rand <= cum) {
          outcome = sv.basis;
          break;
        }
      }
      setCollapsedState(outcome);
      setIsCollapsing(false);
    }, 450);
  };

  const handleShotsChange = (shots: number) => {
    setSelectedShots(shots);
    if (onResimulateShots) {
      onResimulateShots(shots);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dirac Statevector Header Banner */}
      <div className="bg-[#0d1117]/60 border border-slate-800 rounded-xl p-4 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.25)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 font-mono">Quantum State Vector |ψ⟩</h4>
              <p className="text-xs text-slate-400">Computational basis expansion in 2^{numQubits} = {1 << numQubits} dimensions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {simulation.isEntangled ? (
              <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-1.5 font-medium shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                Entangled State
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1.5 font-medium shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Separable Pure State
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              Entropy H: {(typeof entropy === 'number' && !isNaN(entropy) ? entropy : 0).toFixed(2)} bits
            </span>
          </div>
        </div>

        {/* Dirac mathematical representation */}
        <div className="mt-3 p-3 rounded-lg bg-[#05070a] border border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="font-mono text-cyan-300 text-sm tracking-wide whitespace-nowrap">
            |ψ⟩ = {simulation.diracNotation}
          </div>
        </div>
      </div>

      {/* Probability Amplitude Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            State Vector Amplitudes & Phase Discs
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Σ|cᵢ|² = {(simulation.stateVector?.reduce((s, v) => s + (v.probability || 0), 0) || 0).toFixed(4)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {simulation.stateVector.map((sv) => {
            const prob = typeof sv.probability === 'number' ? sv.probability : 0;
            const isNonZero = prob > 0.0005;
            const phaseDeg = typeof sv.phaseDegrees === 'number' ? sv.phaseDegrees : 0;
            const mag = typeof sv.magnitude === 'number' ? sv.magnitude : 0;
            const ampR = typeof sv.amplitude?.r === 'number' ? sv.amplitude.r : 0;
            const ampI = typeof sv.amplitude?.i === 'number' ? sv.amplitude.i : 0;

            return (
              <div
                key={sv.basis}
                className={`p-2.5 rounded-xl border transition-all duration-200 backdrop-blur-sm ${
                  isNonZero
                    ? 'bg-[#0d1117]/80 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/20 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-cyan-200">
                    |{sv.basis}⟩
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Probability Bar with Inset Glow */}
                <div className="w-full h-2 bg-slate-900 rounded overflow-hidden mb-2 border border-slate-800">
                  <div
                    className="h-full bg-cyan-500/30 border-r border-cyan-400 rounded transition-all duration-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>

                {/* Phase Dial Mini Graphic */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" fill="none" stroke="#1e293b" strokeWidth="2" />
                      <line
                        x1="10"
                        y1="10"
                        x2={10 + 7 * Math.cos(sv.phase || 0)}
                        y2={10 - 7 * Math.sin(sv.phase || 0)}
                        stroke={isNonZero ? '#22d3ee' : '#475569'}
                        strokeWidth="2"
                      />
                    </svg>
                    <span>{phaseDeg.toFixed(0)}°</span>
                  </div>
                  <span className="truncate max-w-[55px]" title={`${ampR.toFixed(2)} + ${ampI.toFixed(2)}i`}>
                    |c|={mag.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Measurement Sampling Histogram Section */}
      <div className="bg-[#0d1117]/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.25)]">
              <BarChart2 className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 font-mono">Measurement Sampling Histogram</h4>
              <p className="text-xs text-slate-400">Simulated detector counts over N circuit execution shots</p>
            </div>
          </div>

          {/* Shot Count Switcher & Measure Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              {[100, 500, 1024, 4096].map((shots) => (
                <button
                  key={shots}
                  onClick={() => handleShotsChange(shots)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedShots === shots
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {shots}
                </button>
              ))}
            </div>

            <button
              onClick={handleCollapseSimulation}
              disabled={isCollapsing}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.35)] active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isCollapsing ? 'animate-spin' : ''}`} />
              {isCollapsing ? 'Measuring...' : 'Measure 1 Shot'}
            </button>
          </div>
        </div>

        {/* Live Collapse Single-Shot Banner */}
        {collapsedState && (
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200">
                Single measurement collapsed wavefunction into state:
              </span>
              <span className="font-mono font-bold text-cyan-300 text-sm bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/40">
                |{collapsedState}⟩
              </span>
            </div>
            <button
              onClick={() => setCollapsedState(null)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Histogram Bar Chart */}
        <div className="mt-5 space-y-3">
          {simulation.stateVector.map((sv) => {
            const count = simulation.shotsHistogram?.[sv.basis] || 0;
            const percentage = (simulation.totalShots || 0) > 0 ? (count / simulation.totalShots) * 100 : 0;
            const theoreticalPct = (sv.probability || 0) * 100;

            return (
              <div key={sv.basis} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">|{sv.basis}⟩</span>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>Observed: {count} shots ({(percentage || 0).toFixed(1)}%)</span>
                    <span className="text-cyan-400">Theory: {(theoreticalPct || 0).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="w-full h-4 bg-slate-900 rounded overflow-hidden flex relative border border-slate-800">
                  {/* Empirical Shots bar */}
                  <div
                    className="h-full bg-cyan-500/25 border-r border-cyan-400 rounded transition-all duration-300 shadow-[inset_0_0_12px_rgba(6,182,212,0.4)]"
                    style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                  />
                  {/* Theoretical marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                    style={{ left: `${Math.min(99.5, Math.max(0, theoreticalPct))}%` }}
                    title={`Theoretical Born probability: ${(theoreticalPct || 0).toFixed(1)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm bg-gradient-to-r from-cyan-500 to-indigo-600 inline-block" />
              Observed Counts (Sampling)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-0.5 h-3 bg-amber-400 inline-block" />
              Exact Born Rule Probability
            </span>
          </div>
          <span className="font-mono text-slate-500">Total Shots: {simulation.totalShots}</span>
        </div>
      </div>
    </div>
  );
};
