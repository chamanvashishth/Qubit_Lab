import React, { useEffect, useState } from 'react';

const WORDS = ['LEARN', 'SIMULATE', 'QUANTUM', 'LEAP'];

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const step = window.setInterval(() => {
      setVisible((current) => Math.min(current + 1, WORDS.length));
    }, 420);

    const exit = window.setTimeout(() => setLeaving(true), 1900);
    const done = window.setTimeout(onComplete, 2350);

    return () => {
      window.clearInterval(step);
      window.clearTimeout(exit);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center overflow-hidden transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="absolute w-[420px] h-[420px] rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
      <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10 animate-[spin_7s_linear_infinite_reverse]" />
      <div className="relative flex flex-col items-center justify-center gap-1">
        {WORDS.map((word, index) => (
          <div
            key={word}
            className={`text-[55px] leading-[1.02] tracking-[-0.045em] font-black transition-all duration-500 ease-out ${index < visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-sm'}`}
          >
            {word}
          </div>
        ))}
      </div>
      <div className="absolute bottom-10 text-[9px] tracking-[0.45em] text-white/35 uppercase">QubitLab · Quantum Learning</div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
