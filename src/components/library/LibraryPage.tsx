import React from 'react';
import { BookOpen, ChevronRight, Code2, Layers3, FlaskConical, GraduationCap } from 'lucide-react';
import { CONCEPT_NODES } from '../../data/adaptiveLearning';

type LibraryDestination = 'curriculum' | 'composer' | 'bloch' | 'sandbox' | 'quiz';

interface LibraryPageProps {
  onNavigate: (tab: LibraryDestination) => void;
}

const tools: Array<{ title: string; description: string; tab: LibraryDestination; icon: React.ElementType }> = [
  { title: 'Structured lessons', description: 'Read the core concepts in a clear sequence, from qubits to algorithms.', tab: 'curriculum', icon: BookOpen },
  { title: 'Circuit composer', description: 'Build and inspect quantum circuits gate by gate.', tab: 'composer', icon: FlaskConical },
  { title: 'Bloch sphere', description: 'Use geometry to understand a one-qubit state.', tab: 'bloch', icon: Layers3 },
  { title: 'Code workspace', description: 'Explore quantum code and see how it maps to operations.', tab: 'sandbox', icon: Code2 },
];

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => (
  <div className="space-y-10 py-7">
    <section className="library-hero rounded-[2rem] p-7 sm:p-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-950">A library for learning by understanding.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">Browse explanations, visual tools, and practice that connect the mathematics to the intuition behind it.</p>
      </div>
    </section>
    <section>
      <div className="flex items-end justify-between gap-5">
        <div><h2 className="text-2xl font-semibold text-zinc-100">Study spaces</h2><p className="mt-2 text-sm text-zinc-400">Choose the way you want to explore today.</p></div>
        <button onClick={() => onNavigate('quiz')} className="hidden sm:inline-flex items-center gap-2 text-sm text-[#e9ff8a] hover:text-white">Practice a mock <ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {tools.map(({ title, description, tab, icon: Icon }) => <button key={title} onClick={() => onNavigate(tab)} className="library-card group text-left p-6 rounded-2xl">
          <Icon className="w-5 h-5 text-[#e9ff8a]" /><h3 className="mt-8 text-lg font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-xs text-zinc-300 group-hover:text-[#e9ff8a]">Open <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
        </button>)}
      </div>
    </section>
    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-amber-300" /><div><h2 className="text-xl font-semibold text-zinc-100">Concept index</h2><p className="mt-1 text-sm text-zinc-500">A map of the ideas covered in QubitLab.</p></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CONCEPT_NODES.map((node) => <button key={node.id} onClick={() => onNavigate('curriculum')} className="rounded-xl border border-white/10 bg-black/20 p-4 text-left hover:border-[#dfff3f]/40 transition-colors"><div className="text-[10px] uppercase tracking-[.16em] text-zinc-500">{node.category}</div><div className="mt-2 text-sm font-medium text-zinc-100">{node.title}</div><div className="mt-2 text-xs text-zinc-500">{node.difficulty} · {node.duration} min</div></button>)}</div>
    </section>
  </div>
);
