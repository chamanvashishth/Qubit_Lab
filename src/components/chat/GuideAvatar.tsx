import React from 'react';

type Mood = 'idle' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'concerned' | 'explain';

interface GuideAvatarProps {
  mood?: Mood;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const moodLabel: Record<Mood, string> = {
  idle: 'Ready', listening: 'Listening', thinking: 'Thinking', speaking: 'Explaining', happy: 'Got it', concerned: 'Let’s fix it', explain: 'Explaining',
};

export const GuideAvatar: React.FC<GuideAvatarProps> = ({ mood = 'idle', size = 'md', showStatus = false, className = '' }) => {
  const sizes = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-28 h-28' };
  return (
    <div className={`guide-avatar-wrap guide-mood-${mood} ${sizes[size]} ${className}`} aria-label={`QubitLab guide: ${moodLabel[mood]}`}>
      <div className="guide-aura" />
      <div className="guide-float">
        <img src="/assets/qubitlab-guide.webp" alt="QubitLab virtual guide" className="guide-avatar-image" draggable={false} />
        <span className="guide-eye-glint guide-eye-glint-left" /><span className="guide-eye-glint guide-eye-glint-right" />
      </div>
      {showStatus && <span className="guide-status">{moodLabel[mood]}</span>}
      <style>{`
        .guide-avatar-wrap{position:relative;display:inline-flex;align-items:flex-end;justify-content:center;isolation:isolate;overflow:visible;flex:none}
        .guide-aura{position:absolute;inset:10%;border-radius:999px;background:radial-gradient(circle,rgba(223,255,63,.16),transparent 68%);filter:blur(8px);opacity:.65;transform:scale(.9);transition:opacity .3s ease}
        .guide-float{position:relative;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;transform-origin:50% 92%;animation:guideBreath 4.8s ease-in-out infinite;filter:drop-shadow(0 10px 24px rgba(0,0,0,.4))}
        .guide-avatar-image{width:100%;height:100%;object-fit:contain;object-position:center bottom;user-select:none;pointer-events:none;position:relative;z-index:2}
        .guide-eye-glint{position:absolute;width:3px;height:3px;border-radius:999px;background:rgba(255,255,255,.8);box-shadow:0 0 7px rgba(255,255,255,.7);z-index:3;opacity:.45;animation:guideBlink 5.5s ease-in-out infinite}
        .guide-eye-glint-left{left:42%;top:31%}.guide-eye-glint-right{left:58%;top:31%;animation-delay:.08s}
        .guide-status{position:absolute;bottom:-5px;right:-9px;z-index:5;padding:3px 7px;border:1px solid rgba(223,255,63,.22);border-radius:999px;background:rgba(8,8,10,.88);color:#dfff3f;font:600 8px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;backdrop-filter:blur(10px)}
        .guide-mood-listening .guide-float{animation:guideListen 1.9s ease-in-out infinite}
        .guide-mood-thinking .guide-float{animation:guideThink 2.8s ease-in-out infinite}
        .guide-mood-speaking .guide-float,.guide-mood-explain .guide-float{animation:guideExplain .9s ease-in-out infinite}
        .guide-mood-happy .guide-float{animation:guideHappy 1.25s ease-out 1}
        .guide-mood-concerned .guide-float{animation:guideConcerned 1.6s ease-in-out infinite}
        .guide-mood-thinking .guide-aura{opacity:1;animation:guidePulse 1.8s ease-in-out infinite}
        .guide-mood-speaking .guide-aura,.guide-mood-explain .guide-aura{opacity:1;animation:guidePulse .9s ease-in-out infinite}
        @keyframes guideBreath{0%,100%{transform:translateY(0) rotate(0deg) scale(1)}50%{transform:translateY(-2px) rotate(-.5deg) scale(1.008)}}
        @keyframes guideListen{0%,100%{transform:translateY(0) rotate(0)}45%{transform:translateY(-2px) rotate(-2deg)}70%{transform:translateY(0) rotate(1deg)}}
        @keyframes guideThink{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-2px) rotate(2deg)}65%{transform:translateY(-1px) rotate(-1deg)}}
        @keyframes guideExplain{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-3px) rotate(-1deg)}60%{transform:translateY(0) rotate(1deg)}}
        @keyframes guideHappy{0%{transform:scale(1) translateY(0)}35%{transform:scale(1.04) translateY(-5px) rotate(-2deg)}70%{transform:scale(1.01) translateY(-1px) rotate(1deg)}100%{transform:scale(1) translateY(0)}}
        @keyframes guideConcerned{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(1px) rotate(-1deg)}}
        @keyframes guidePulse{0%,100%{transform:scale(.92);opacity:.55}50%{transform:scale(1.08);opacity:1}}
        @keyframes guideBlink{0%,44%,48%,100%{opacity:.45;transform:scaleY(1)}46%{opacity:0;transform:scaleY(.2)}}
        @media (prefers-reduced-motion:reduce){.guide-float,.guide-aura,.guide-eye-glint{animation:none!important}}
      `}</style>
    </div>
  );
};
