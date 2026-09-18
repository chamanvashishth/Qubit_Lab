import React, { useEffect, useState } from 'react';

const WORDS = ['LEARN', 'SIMULATE', 'QUANTUM', 'LEAP'];

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const step = window.setInterval(() => setVisible((n) => Math.min(n + 1, WORDS.length)), 360);
    const transition = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onComplete, 750);
    }, 1850);
    return () => { window.clearInterval(step); window.clearTimeout(transition); };
  }, []);


  return (
    <div className={`fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center overflow-hidden transition-all duration-700 ${leaving ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="absolute w-[min(78vw,520px)] aspect-square rounded-full border border-white/10 animate-[spin_12s_linear_infinite]" />
      <div className="absolute w-[min(54vw,340px)] aspect-square rounded-full border border-white/10 animate-[spin_8s_linear_infinite_reverse]" />
      <div className="relative flex flex-col items-center justify-center gap-0.5 text-center">
        {WORDS.map((word, index) => (
          <div key={word} className={`text-[55px] leading-[1.02] tracking-[-0.05em] font-black transition-all duration-500 ease-out ${index < visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'}`}>{word}</div>
        ))}
      </div>
      <div className="absolute bottom-10 text-[9px] tracking-[0.45em] text-white/35 uppercase">QubitLab · Quantum Learning</div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
