import React, { useState } from 'react';
import { ArrowRight, Brain, Calculator, Code2, FlaskConical, Sparkles } from 'lucide-react';
import { GOAL_LABELS, LearnerGoal, SkillLevel, LearnerProfile } from '../../data/adaptiveLearning';

interface Props { onComplete: (profile: LearnerProfile) => void; }

const choices = [
  { id: 'curiosity', label: GOAL_LABELS.curiosity }, { id: 'academics', label: GOAL_LABELS.academics }, { id: 'programming', label: GOAL_LABELS.programming }, { id: 'research', label: GOAL_LABELS.research }, { id: 'career', label: GOAL_LABELS.career }, { id: 'teaching', label: GOAL_LABELS.teaching },
] as const;
const levels: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'New to it' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'advanced', label: 'Advanced' },
];

export const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<LearnerGoal>('curiosity');
  const [math, setMath] = useState<SkillLevel>('beginner');
  const [programming, setProgramming] = useState<SkillLevel>('beginner');
  const [physics, setPhysics] = useState<SkillLevel>('beginner');
  const finish = () => onComplete({ goal, math, programming, physics, createdAt: Date.now() });
  const next = () => step === 3 ? finish() : setStep((value) => value + 1);
  const headings = ['What brings you to quantum?', 'How comfortable are you with math?', 'How much programming do you know?', 'How much physics do you know?'];
  const subtitles = ['We will use this to shape your first learning mission.', 'No advanced math is required to start.', 'This changes how much code we introduce.', 'You can learn the physics as you go.'];
  return <section className="glass-panel rounded-[2rem] p-7 sm:p-10 max-w-4xl mx-auto">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-zinc-500 mb-6"><Sparkles className="w-3.5 h-3.5 text-[#dfff3f]" /> Personalize your path · {step + 1}/4</div>
    <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start"><div>
      <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-100">{headings[step]}</h1>
      <p className="text-sm leading-6 text-zinc-400 mt-3 max-w-xl">{subtitles[step]}</p>
      <div className="mt-7 grid gap-3">
        {step === 0 && choices.map((choice) => <button key={choice.id} onClick={() => setGoal(choice.id)} className={`text-left p-4 rounded-xl border transition-all ${goal === choice.id ? 'border-[#dfff3f]/70 bg-[#dfff3f]/10 text-white' : 'border-white/10 bg-black/25 text-zinc-400 hover:border-white/25'}`}>{choice.label}</button>)}
        {step === 1 && levels.map((item) => <Option key={item.value} active={math === item.value} label={item.label} icon={Calculator} onClick={() => setMath(item.value)} />)}
        {step === 2 && levels.map((item) => <Option key={item.value} active={programming === item.value} label={item.label} icon={Code2} onClick={() => setProgramming(item.value)} />)}
        {step === 3 && levels.map((item) => <Option key={item.value} active={physics === item.value} label={item.label} icon={FlaskConical} onClick={() => setPhysics(item.value)} />)}
      </div>
      <button onClick={next} className="template-button mt-7 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">{step === 3 ? 'Build my path' : 'Continue'} <ArrowRight className="w-4 h-4" /></button>
    </div>
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5"><Brain className="w-7 h-7 text-[#dfff3f]" /><h3 className="font-semibold text-zinc-100 mt-5">Why we ask</h3><p className="text-xs leading-6 text-zinc-500 mt-2">QubitLab uses your goal and background to shape the starting point and recommendation logic. Performance later comes from quizzes and guided experiments.</p><div className="mt-5 text-[10px] font-mono text-zinc-600">PROFILE STAYS IN THIS BROWSER SESSION IN THIS MVP</div></div>
    </div>
  </section>;
};
function Option({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: React.ElementType; onClick: () => void }) { return <button onClick={onClick} className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all ${active ? 'border-[#dfff3f]/70 bg-[#dfff3f]/10 text-white' : 'border-white/10 bg-black/25 text-zinc-400 hover:border-white/25'}`}><Icon className="w-4 h-4" />{label}</button>; }
