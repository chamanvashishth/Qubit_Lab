import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, AlertTriangle, Eye, Compass } from 'lucide-react';
import { QubitState, BlochState } from '../../types/quantum';

interface BlochSphereProps {
  qubitState: QubitState | BlochState;
  qubitIndex?: number;
  label?: string;
  size?: number;
  interactive?: boolean;
  onStateChange?: (theta: number, phi: number) => void;
}

export const BlochSphere3D: React.FC<BlochSphereProps> = ({
  qubitState,
  qubitIndex = 0,
  label = 'Qubit 0',
  size = 320,
  interactive = true,
  onStateChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const arrowRef = useRef<THREE.Group | null>(null);
  const projLineRef = useRef<THREE.Line | null>(null);
  const xyProjLineRef = useRef<THREE.Line | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.35, y: -0.65 });

  const rawTheta = qubitState?.theta ?? 0;
  const rawPhi = qubitState?.phi ?? 0;

  const [thetaDeg, setThetaDeg] = useState(Math.round((rawTheta * 180) / Math.PI));
  const [phiDeg, setPhiDeg] = useState(Math.round((rawPhi * 180) / Math.PI));

  useEffect(() => {
    setThetaDeg(Math.round(((qubitState?.theta ?? 0) * 180) / Math.PI));
    setPhiDeg(Math.round(((qubitState?.phi ?? 0) * 180) / Math.PI));
  }, [qubitState?.theta, qubitState?.phi]);

  // Safely normalize coordinates & probabilities even if partial state passed
  const theta = qubitState?.theta ?? 0;
  const phi = qubitState?.phi ?? 0;
  const purity = typeof qubitState?.purity === 'number' ? qubitState.purity : 1.0;
  const x = typeof qubitState?.x === 'number' ? qubitState.x : Math.sin(theta) * Math.cos(phi);
  const y = typeof qubitState?.y === 'number' ? qubitState.y : Math.sin(theta) * Math.sin(phi);
  const z = typeof qubitState?.z === 'number' ? qubitState.z : Math.cos(theta);

  const rawState = qubitState as Record<string, any> | undefined;
  const p0 = typeof rawState?.p0 === 'number'
    ? rawState.p0
    : typeof rawState?.prob0 === 'number'
    ? rawState.prob0
    : Math.pow(Math.cos(theta / 2), 2);
  const p1 = typeof rawState?.p1 === 'number'
    ? rawState.p1
    : typeof rawState?.prob1 === 'number'
    ? rawState.prob1
    : Math.pow(Math.sin(theta / 2), 2);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // Group for whole sphere to enable orbital rotation
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Wireframe Sphere (Bloch Sphere surface)
    const sphereRadius = 1.35;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 24, 18);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(sphereMesh);

    // Translucent core sphere
    const innerGeo = new THREE.SphereGeometry(sphereRadius * 0.99, 32, 24);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x082f49,
      transparent: true,
      opacity: 0.25,
      shininess: 60,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    sphereGroup.add(innerMesh);

    // Equator Ring (XY plane)
    const equatorGeo = new THREE.RingGeometry(sphereRadius * 0.99, sphereRadius * 1.01, 64);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const equatorMesh = new THREE.Mesh(equatorGeo, equatorMat);
    equatorMesh.rotation.x = Math.PI / 2;
    sphereGroup.add(equatorMesh);

    // Coordinate Axes (X: right/cyan, Y: depth/purple, Z: vertical/blue)
    const axisLen = sphereRadius * 1.35;
    const createAxisLine = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 });
      return new THREE.Line(geo, mat);
    };

    // Z axis (vertical in standard Three.js) - corresponds to |0> (up) and |1> (down)
    sphereGroup.add(createAxisLine(new THREE.Vector3(0, -axisLen, 0), new THREE.Vector3(0, axisLen, 0), 0x38bdf8));
    // X axis (horizontal) - corresponds to |+> and |->
    sphereGroup.add(createAxisLine(new THREE.Vector3(-axisLen, 0, 0), new THREE.Vector3(axisLen, 0, 0), 0x818cf8));
    // Y axis (depth) - corresponds to |i> and |-i>
    sphereGroup.add(createAxisLine(new THREE.Vector3(0, 0, -axisLen), new THREE.Vector3(0, 0, axisLen), 0xc084fc));

    // Helper Sprite Label function
    const makeTextSprite = (text: string, color = '#38bdf8') => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.font = 'bold 28px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.65, 0.325, 1);
      return sprite;
    };

    // Add labels for poles and basis states
    const label0 = makeTextSprite('|0⟩', '#38bdf8');
    label0.position.set(0, axisLen + 0.2, 0);
    sphereGroup.add(label0);

    const label1 = makeTextSprite('|1⟩', '#38bdf8');
    label1.position.set(0, -axisLen - 0.2, 0);
    sphereGroup.add(label1);

    const labelPlus = makeTextSprite('|+⟩', '#818cf8');
    labelPlus.position.set(axisLen + 0.25, 0, 0);
    sphereGroup.add(labelPlus);

    const labelMinus = makeTextSprite('|-⟩', '#818cf8');
    labelMinus.position.set(-axisLen - 0.25, 0, 0);
    sphereGroup.add(labelMinus);

    const labelI = makeTextSprite('|i⟩', '#c084fc');
    labelI.position.set(0, 0, axisLen + 0.25);
    sphereGroup.add(labelI);

    const labelMinusI = makeTextSprite('|-i⟩', '#c084fc');
    labelMinusI.position.set(0, 0, -axisLen - 0.25);
    sphereGroup.add(labelMinusI);

    // State Vector Group (Arrow + Pointer + Glow)
    const arrowGroup = new THREE.Group();
    sphereGroup.add(arrowGroup);
    arrowRef.current = arrowGroup;

    // Vector line
    const vecGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, sphereRadius, 0),
    ]);
    const vecMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 3 });
    const vecLine = new THREE.Line(vecGeo, vecMat);
    arrowGroup.add(vecLine);

    // Vector Tip Sphere (glowing pointer)
    const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.set(0, sphereRadius, 0);
    arrowGroup.add(tipMesh);

    // Dashed Projection lines to XY plane
    const projGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const projMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 0.06,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const projLine = new THREE.Line(projGeo, projMat);
    sphereGroup.add(projLine);
    projLineRef.current = projLine;

    // XY projection line from origin to (x, z_proj)
    const xyProjGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const xyProjLine = new THREE.Line(xyProjGeo, projMat);
    sphereGroup.add(xyProjLine);
    xyProjLineRef.current = xyProjLine;

    // Mouse Drag Rotation logic
    const domElem = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;
      // Clamp vertical rotation to avoid flipping
      rotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth auto-rotation if not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.002;
      }

      sphereGroup.rotation.x = rotationRef.current.x;
      sphereGroup.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [size]);

  // Update Vector Arrow when state changes
  useEffect(() => {
    if (!arrowRef.current || !projLineRef.current || !xyProjLineRef.current) return;

    const sphereRadius = 1.35;
    const clampedPurity = Math.max(0.01, Math.min(1.0, purity));
    const effectiveRadius = sphereRadius * clampedPurity;

    // Physics Bloch sphere conversion:
    // Z is vertical (|0> is +Z, |1> is -Z)
    // In Three.js standard coordinates:
    // Y is vertical, X is horizontal, Z is depth
    // So: Three_Y = qubit_Z
    //     Three_X = qubit_X
    //     Three_Z = qubit_Y
    const px = effectiveRadius * x;
    const py = effectiveRadius * z; // vertical
    const pz = effectiveRadius * y; // depth

    // Point arrow towards (px, py, pz)
    arrowRef.current.clear();

    // Line from origin
    const vecGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(px, py, pz),
    ]);
    const arrowColor = clampedPurity < 0.95 ? 0xf59e0b : 0x06b6d4;
    const vecMat = new THREE.LineBasicMaterial({ color: arrowColor, linewidth: 3 });
    const vecLine = new THREE.Line(vecGeo, vecMat);
    arrowRef.current.add(vecLine);

    // Tip sphere
    const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({ color: arrowColor });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.set(px, py, pz);
    arrowRef.current.add(tipMesh);

    // Projection down to equator plane (Y = 0 in Three.js)
    const projGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(px, py, pz),
      new THREE.Vector3(px, 0, pz),
    ]);
    projLineRef.current.geometry.dispose();
    projLineRef.current.geometry = projGeo;
    projLineRef.current.computeLineDistances();

    // XY ray from origin to (px, 0, pz)
    const xyGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(px, 0, pz),
    ]);
    xyProjLineRef.current.geometry.dispose();
    xyProjLineRef.current.geometry = xyGeo;
    xyProjLineRef.current.computeLineDistances();
  }, [x, y, z, purity]);

  const handleSliderChange = (newTheta: number, newPhi: number) => {
    setThetaDeg(newTheta);
    setPhiDeg(newPhi);
    if (onStateChange) {
      onStateChange((newTheta * Math.PI) / 180, (newPhi * Math.PI) / 180);
    }
  };

  const applyPreset = (presetName: string) => {
    let t = 0;
    let p = 0;
    switch (presetName) {
      case '|0⟩': t = 0; p = 0; break;
      case '|1⟩': t = 180; p = 0; break;
      case '|+⟩': t = 90; p = 0; break;
      case '|-⟩': t = 90; p = 180; break;
      case '|i⟩': t = 90; p = 90; break;
      case '|-i⟩': t = 90; p = 270; break;
    }
    handleSliderChange(t, p);
  };

  return (
    <div className="bg-[#080d1d] border border-cyan-500/20 rounded-xl p-4 flex flex-col items-center relative shadow-lg shadow-black/40">
      <div className="w-full flex items-center justify-between mb-1 pb-2 border-b border-cyan-500/15">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400"></span>
          <span className="font-semibold text-slate-100 text-sm tracking-wide">{label}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
            q[{qubitIndex}]
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{ width: size, height: size }}
      />

      {/* Purity / Mixed State warning for entangled qubits */}
      {purity < 0.95 && (
        <div className="w-full mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Mixed state (entangled): purity r = {purity.toFixed(2)} &lt; 1</span>
        </div>
      )}

      {/* Coordinates & Probabilities Grid */}
      <div className="w-full grid grid-cols-4 gap-2 mt-3 text-center text-xs font-mono">
        <div className="bg-slate-900/70 border border-slate-800 rounded p-1.5">
          <span className="text-slate-400 block text-[10px]">X</span>
          <span className="text-indigo-400 font-semibold">{x.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded p-1.5">
          <span className="text-slate-400 block text-[10px]">Y</span>
          <span className="text-purple-400 font-semibold">{y.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded p-1.5">
          <span className="text-slate-400 block text-[10px]">Z</span>
          <span className="text-cyan-400 font-semibold">{z.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded p-1.5">
          <span className="text-slate-400 block text-[10px]">Purity</span>
          <span className={purity > 0.95 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {purity.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Probabilities P(|0>) and P(|1>) */}
      <div className="w-full mt-3 bg-slate-900/50 border border-slate-800/80 rounded-lg p-2.5 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-cyan-300 font-mono">P(|0⟩): {(p0 * 100).toFixed(1)}%</span>
          <span className="text-indigo-300 font-mono">P(|1⟩): {(p1 * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, p0 * 100))}%` }}
          />
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, p1 * 100))}%` }}
          />
        </div>
      </div>

      {/* Interactive Angle Sliders & Quick Presets */}
      {interactive && (
        <div className="w-full mt-3 pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1 font-mono">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              θ (polar): {thetaDeg}° ({( (thetaDeg * Math.PI) / 180 ).toFixed(2)} rad)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={thetaDeg}
            onChange={(e) => handleSliderChange(Number(e.target.value), phiDeg)}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1 font-mono">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              φ (azimuth): {phiDeg}° ({( (phiDeg * Math.PI) / 180 ).toFixed(2)} rad)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={phiDeg}
            onChange={(e) => handleSliderChange(thetaDeg, Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />

          {/* Quick Basis Presets */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'].map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/60 text-slate-300 text-xs font-mono transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
