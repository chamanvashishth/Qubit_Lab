import React, { useEffect, useState } from 'react';

const WORDS = ['LEARN', 'SIMULATE', 'QUANTUM', 'LEAP'];

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const step = window.setInterval(() => setVisible((n) => Math.min(n + 1, WORDS.length)), 360);
    const button = window.setTimeout(() => setReady(true), 1550);
    return () => { window.clearInterval(step); window.clearTimeout(button); };
  }, []);

  const start = () => {
    setLeaving(true);
    window.setTimeout(onComplete, 850);
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center overflow-hidden transition-all duration-700 ${leaving ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="absolute w-[min(78vw,520px)] aspect-square rounded-full border border-white/10 animate-[spin_12s_linear_infinite]" />
      <div className="absolute w-[min(54vw,340px)] aspect-square rounded-full border border-white/10 animate-[spin_8s_linear_infinite_reverse]" />
      <div className="relative flex flex-col items-center justify-center gap-0.5 text-center">
        {WORDS.map((word, index) => (
          <div key={word} className={`text-[55px] leading-[1.02] tracking-[-0.05em] font-black transition-all duration-500 ease-out ${index < visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'}`}>{word}</div>
        ))}
        <button
          onClick={start}
          disabled={!ready}
          className={`mt-10 px-9 py-3 rounded-full border text-sm font-semibold tracking-[0.22em] transition-all duration-500 ${ready ? 'opacity-100 translate-y-0 border-white/70 bg-white text-black hover:bg-transparent hover:text-white hover:scale-105 animate-[pulse_2s_ease-in-out_infinite]' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        >
          START
        </button>
      </div>
      <div className="absolute bottom-10 text-[9px] tracking-[0.45em] text-white/35 uppercase">QubitLab · Quantum Learning</div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,.08); } 50% { box-shadow: 0 0 0 16px rgba(255,255,255,0); } }
      `}</style>
    </div>
  );
};
