import React, { useState } from 'react';
import { 
  Compass, RotateCcw, Play, Sparkles, Layers, Sliders, 
  HelpCircle, ChevronRight 
} from 'lucide-react';
import { BlochSphere3D } from './BlochSphere3D';
import { BlochState } from '../../types/quantum';

interface BlochPlaygroundProps {
  onAskAI?: (prompt: string) => void;
}

export const BlochPlayground: React.FC<BlochPlaygroundProps> = ({ onAskAI }) => {
  const [theta, setTheta] = useState(1.5708); // pi / 2 (|+> state)
  const [phi, setPhi] = useState(0);

  // Derive Cartesian coordinates
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  const prob0 = Math.pow(Math.cos(theta / 2), 2);
  const prob1 = Math.pow(Math.sin(theta / 2), 2);

  const blochState: BlochState & { x: number; y: number; z: number; p0: number; p1: number } = {
    theta,
    phi,
    x,
    y,
    z,
    purity: 1.0,
    prob0,
    prob1,
    p0: prob0,
    p1: prob1,
  };

  // Preset states
  const setPreset = (presetKey: string) => {
    switch (presetKey) {
      case '0':
        setTheta(0);
        setPhi(0);
        break;
      case '1':
        setTheta(Math.PI);
        setPhi(0);
        break;
      case '+x': // |+>
        setTheta(Math.PI / 2);
        setPhi(0);
        break;
      case '-x': // |->
        setTheta(Math.PI / 2);
        setPhi(Math.PI);
        break;
      case '+y': // |+i>
        setTheta(Math.PI / 2);
        setPhi(Math.PI / 2);
        break;
      case '-y': // |-i>
        setTheta(Math.PI / 2);
        setPhi((3 * Math.PI) / 2);
        break;
    }
  };

  // Apply Gate rotations
  const applyGate = (gate: string) => {
    if (gate === 'X') {
      // Rotation of pi about X-axis: theta -> pi - theta, phi -> -phi
      setTheta((t) => Math.PI - t);
      setPhi((p) => (2 * Math.PI - p) % (2 * Math.PI));
    } else if (gate === 'Z') {
      // Rotation of pi about Z-axis: phi -> phi + pi
      setPhi((p) => (p + Math.PI) % (2 * Math.PI));
    } else if (gate === 'H') {
      // Hadamard flips between Z and X axes
      if (Math.abs(theta) < 0.1) {
        setTheta(Math.PI / 2);
        setPhi(0);
      } else if (Math.abs(theta - Math.PI) < 0.1) {
        setTheta(Math.PI / 2);
        setPhi(Math.PI);
      } else if (Math.abs(theta - Math.PI / 2) < 0.1 && Math.abs(phi) < 0.1) {
        setTheta(0);
        setPhi(0);
      } else {
        setTheta(Math.PI / 2);
        setPhi(0);
      }
    } else if (gate === 'S') {
      // pi/2 rotation around Z-axis
      setPhi((p) => (p + Math.PI / 2) % (2 * Math.PI));
    } else if (gate === 'T') {
      // pi/4 rotation around Z-axis
      setPhi((p) => (p + Math.PI / 4) % (2 * Math.PI));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#091124] border border-cyan-500/25 rounded-2xl p-5 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Interactive 3D Bloch Sphere Laboratory
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                SU(2) Qubit Geometry
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag mouse to orbit sphere in 3D • Adjust polar angle θ and azimuth φ • Apply unitary gate rotations
            </p>
          </div>
        </div>

        {onAskAI && (
          <button
            onClick={() => onAskAI("Explain the geometric meaning of the Bloch Sphere and how single-qubit gates act as 3D rotations.")}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Explain Geometry
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D WebGL Canvas */}
        <div className="lg:col-span-7 bg-[#050914] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-black/60 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              WebGL 3D Render Engine
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Left Click + Drag to Orbit • Scroll to Zoom
            </span>
          </div>

          <BlochSphere3D
            qubitState={blochState}
            qubitIndex={0}
            label="Interactive Single Qubit State |ψ⟩"
            size={360}
            interactive={true}
          />

          {/* Quick Presets */}
          <div className="w-full mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">
              Canonical Basis State Presets:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { key: '0', label: '|0⟩ (North)' },
                { key: '1', label: '|1⟩ (South)' },
                { key: '+x', label: '|+⟩ (+X)' },
                { key: '-x', label: '|–⟩ (–X)' },
                { key: '+y', label: '|+i⟩ (+Y)' },
                { key: '-y', label: '|–i⟩ (–Y)' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-colors text-center"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Readout & Gate Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coordinate Sliders */}
          <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-black/40 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Spherical Polar Angle Coordinates
            </h4>

            {/* Theta slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Polar Angle θ (0 to π):</span>
                <span className="text-cyan-400 font-bold">
                  {((theta * 180) / Math.PI).toFixed(1)}° ({(theta / Math.PI).toFixed(2)}π)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.02"
                value={theta}
                onChange={(e) => setTheta(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Phi slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Azimuthal Phase φ (0 to 2π):</span>
                <span className="text-purple-400 font-bold">
                  {((phi * 180) / Math.PI).toFixed(1)}° ({(phi / Math.PI).toFixed(2)}π)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.02"
                value={phi}
                onChange={(e) => setPhi(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          {/* Unitary Gate Rotation Triggers */}
          <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-black/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Apply Unitary Rotation Gates
            </h4>
            <p className="text-[11px] text-slate-400">
              Click a gate to perform an instantaneous physical rotation on the Bloch vector:
            </p>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                { gate: 'H', label: 'H' },
                { gate: 'X', label: 'X (π_x)' },
                { gate: 'Z', label: 'Z (π_z)' },
                { gate: 'S', label: 'S (π/2_z)' },
                { gate: 'T', label: 'T (π/4_z)' },
              ].map((g) => (
                <button
                  key={g.gate}
                  onClick={() => applyGate(g.gate)}
                  className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-xs font-mono font-bold text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vector & Density Matrix Details */}
          <div className="bg-[#080d1e] border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-black/40 font-mono text-xs space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
              Cartesian Vector Coordinates (x, y, z)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">x = sinθ cosφ</span>
                <span className="text-cyan-300 font-bold">{x.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">y = sinθ sinφ</span>
                <span className="text-purple-300 font-bold">{y.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">z = cosθ</span>
                <span className="text-indigo-300 font-bold">{z.toFixed(3)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Measurement Probabilities:</span>
              <span className="text-slate-200">
                P(0)={(prob0 * 100).toFixed(1)}% | P(1)={(prob1 * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
