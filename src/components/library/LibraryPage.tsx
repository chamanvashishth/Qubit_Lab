import React from 'react';
import { BookOpen, ChevronRight, Code2, Layers3, FlaskConical, GraduationCap, ExternalLink, UserRound, FileText, Newspaper } from 'lucide-react';

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

const ebooks = [
  ['Quantum Computing for the Quantum Curious', 'Beginner', 'Conceptual foundations: qubits, superposition, measurement, entanglement, gates and algorithms.', 'https://link.springer.com/book/10.1007/978-3-030-61601-4'],
  ['Introduction to Classical and Quantum Computing — Thomas Wong', 'Beginner → Intermediate', 'Theory, computation, programming and exercises.', 'https://www.thomaswong.net/introduction-to-classical-and-quantum-computing-0e.pdf'],
  ['Quantum Computing from Hopfield Nets', 'Intermediate', 'AI/ML + quantum computing + Python.', 'https://link.springer.com/book/10.1007/978-3-031-99402-9'],
  ['Quantum Country', 'Beginner → Intermediate', 'Interactive explanations, memory techniques, Grover and teleportation.', 'https://quantum.country/'],
  ['Introduction to Quantum Computing — OpenLearn', 'Beginner', 'Qubits, gates, CNOT and quantum circuits.', 'https://www.open.edu/openlearn/science-maths-technology/introduction-quantum-computing'],
  ['Introduction to Quantum Computation and Information', 'Intermediate → Advanced', 'Quantum information, cryptography, error correction, fault tolerance and experimental aspects.', 'https://openlibrary.org/books/OL25553883M/Introduction_to_quantum_computation_and_information'],
  ['MIT OpenCourseWare — Quantum Information Science', 'Intermediate → Advanced', 'University-level theory and algorithms including Deutsch-Jozsa, Simon, Grover and Shor.', 'https://ocw.mit.edu/courses/8-370x-quantum-information-science-i-spring-2018/'],
  ['IBM Quantum Learning — Basics of Quantum Information', 'Beginner → Intermediate', 'Practical circuits, multiple quantum systems, teleportation, superdense coding and CHSH.', 'https://learning.quantum.ibm.com/course/basics-of-quantum-information'],
  ['IBM Quantum Learning — Fundamentals of Quantum Algorithms', 'Intermediate', 'Quantum query algorithms, factoring and unstructured search.', 'https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms'],
];

const researchers = [
  ['John Preskill', 'Caltech', 'Quantum information, quantum computing, error correction and fault tolerance.', 'https://preskill.caltech.edu/', 'Quantum Computation course', 'https://preskill.caltech.edu/ph219/ph219_2026.html'],
  ['Peter W. Shor', 'MIT', 'Quantum algorithms, complexity and error correction.', 'https://math.mit.edu/~shor/', 'Publications', 'https://math.mit.edu/~shor/pubs.html'],
  ['Isaac L. Chuang', 'MIT', 'Quantum computation, information, hardware and experimental implementation.', 'https://ocw.mit.edu/courses/8-370x-quantum-information-science-i-spring-2018/', 'MIT QIS 2006', 'https://ocw.mit.edu/courses/mas-865j-quantum-information-science-spring-2006/'],
  ['John Watrous', 'University of Waterloo', 'Quantum information theory, complexity and mathematical foundations.', 'https://cs.uwaterloo.ca/~watrous/QC-notes/QC-notes.pdf', 'Books & courses', 'https://jhwatrous.github.io/books-and-courses.html'],
  ['Umesh Vazirani', 'UC Berkeley', 'Quantum algorithms, complexity and theoretical computer science.', 'https://people.eecs.berkeley.edu/~vazirani/quantum.html', '', ''],
  ['Scott Aaronson', 'UT Austin', 'Quantum complexity, algorithms, computational theory and quantum advantage.', 'https://mail.scottaaronson.com/talks/', 'Research / blog', 'https://scottaaronson.com/'],
  ['Daniel Gottesman', 'University of Maryland', 'Quantum error correction, stabilizer codes and fault tolerance.', 'https://quics.umd.edu/education/courses/advanced-topics-theory-computing-quantum-error-correction-and-fault-tolerance-cmsc858g-0', '', ''],
  ['Andrew Childs', 'University of Maryland', 'Quantum algorithms, quantum walks and quantum simulation.', 'https://www.cs.umd.edu/~amchilds/', '', ''],
  ['Artur Ekert', 'University of Oxford', 'Quantum information, entanglement and quantum cryptography.', 'https://www.physics.ox.ac.uk/our-people/ekert', '', ''],
  ['Barbara M. Terhal', 'TU Delft', 'Quantum information, error correction and quantum hardware theory.', 'https://www.tudelft.nl/en/tnw/about-the-faculty/departments/quantum-nanoscience/people/terhal', '', ''],
];

const lectureSeries = [
  ['MIT — Quantum Information Science I', 'Foundations, measurement, teleportation, Deutsch-Jozsa, Simon, Grover, Shor and quantum communication.', 'https://ocw.mit.edu/courses/8-370x-quantum-information-science-i-spring-2018/'],
  ['MIT — Quantum Computation', 'Quantum mechanics, gates, circuits, Simon, factoring, Grover, teleportation, error correction, cryptography and fault tolerance.', 'https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/pages/lecture-notes/'],
  ['MIT — Quantum Information Science II', 'Advanced quantum information, complexity theory and information theory.', 'https://ocw.mit.edu/courses/8-371x-quantum-information-science-ii-spring-2018/'],
  ['UC Berkeley — Quantum Computation', 'Axioms, Hilbert space, tensor products, gates, Bell states, teleportation and quantum algorithms.', 'https://people.eecs.berkeley.edu/~vazirani/quantum.html'],
  ['John Watrous — Quantum Computation Notes', 'Rigorous mathematical introduction to quantum information and computation.', 'https://cs.uwaterloo.ca/~watrous/QC-notes/QC-notes.pdf'],
  ['Daniel Gottesman — Quantum Error Correction & Fault Tolerance', 'Stabilizer codes, error-correction conditions, thresholds, surface codes and fault-tolerant protocols.', 'https://quics.umd.edu/education/courses/advanced-topics-theory-computing-quantum-error-correction-and-fault-tolerance-cmsc858g-0'],
];

const researchAndMedia = [
  ['Quantum Computation and Quantum Information — Nielsen & Chuang', 'Standard reference for quantum computation and quantum information.', 'https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/'],
  ['Quantum Frontiers — Caltech IQIM', 'Accessible articles, research news and explanations from the Caltech quantum-information community.', 'https://quantumfrontiers.com/'],
  ['Scott Aaronson — Talks', 'Slides and talks on quantum computing, complexity, quantum advantage and current research.', 'https://mail.scottaaronson.com/talks/'],
  ['Scott Aaronson — Blog', 'Long-form explanations and commentary on quantum computing and theoretical computer science.', 'https://scottaaronson.com/blog/'],
  ['MIT OpenCourseWare — Quantum Computing', 'Searchable collection of MIT quantum-computing courses and lecture materials.', 'https://ocw.mit.edu/search/?q=quantum+computing'],
];

const ResourceLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1.5 text-sm text-[#e9ff8a] hover:text-white transition-colors">
    {children}<ExternalLink className="w-3.5 h-3.5" />
  </a>
);

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => (
  <div className="space-y-10 py-7 text-zinc-200">
    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-amber-300" /><div><h2 className="text-xl font-semibold text-white">Free eBooks & Learning Resources</h2><p className="mt-1 text-sm text-zinc-200">Beginner to advanced resources from the supplied QubitLab resource guide.</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {ebooks.map(([title, level, description, href]) => <article key={title} className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-[#dfff3f]/30 transition-colors"><div className="text-sm uppercase tracking-[.12em] text-zinc-200 font-medium">{level}</div><h3 className="mt-2 text-base font-semibold text-white">{title}</h3><p className="mt-2 text-[15px] leading-7 text-zinc-200">{description}</p><div className="mt-4"><ResourceLink href={href}>Open official resource</ResourceLink></div></article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><UserRound className="w-5 h-5 text-sky-300" /><div><h2 className="text-xl font-semibold text-white">Researchers & Direct Resources</h2><p className="mt-1 text-sm text-zinc-200">Professor pages, courses, notes and research hubs from the supplied guide.</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {researchers.map(([name, institution, specialty, href, secondaryLabel, secondaryHref]) => <article key={name} className="rounded-xl border border-white/10 bg-black/20 p-5"><h3 className="text-base font-semibold text-white">{name}</h3><div className="mt-1 text-sm uppercase tracking-[.12em] text-zinc-200 font-medium">{institution}</div><p className="mt-3 text-[15px] leading-7 text-zinc-200">{specialty}</p><div className="mt-4 flex flex-wrap gap-4"><ResourceLink href={href}>Open resource</ResourceLink>{secondaryHref && <ResourceLink href={secondaryHref}>{secondaryLabel}</ResourceLink>}</div></article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-violet-300" /><div><h2 className="text-xl font-semibold text-white">University Lecture Series</h2><p className="mt-1 text-sm text-zinc-200">Use these alongside the QubitLab curriculum for deeper study.</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lectureSeries.map(([title, description, href]) => <article key={title} className="rounded-xl border border-white/10 bg-black/20 p-5"><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-2 text-[15px] leading-7 text-zinc-200">{description}</p><div className="mt-4"><ResourceLink href={href}>Open lectures</ResourceLink></div></article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-emerald-300" /><div><h2 className="text-xl font-semibold text-white">Research & Reference</h2><p className="mt-1 text-sm text-zinc-200">Research and reference material explicitly linked in the supplied guide.</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {researchAndMedia.filter(([title]) => !title.includes('Quantum Frontiers') && !title.includes('Aaronson')).map(([title, description, href]) => <article key={title} className="rounded-xl border border-white/10 bg-black/20 p-5"><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-2 text-[15px] leading-7 text-zinc-200">{description}</p><div className="mt-4"><ResourceLink href={href}>Open reference</ResourceLink></div></article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
      <div className="flex items-center gap-3"><Newspaper className="w-5 h-5 text-orange-300" /><div><h2 className="text-xl font-semibold text-white">Articles, Blogs & Talks</h2><p className="mt-1 text-sm text-zinc-200">Accessible material for staying connected with the quantum-computing community.</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {researchAndMedia.filter(([title]) => title.includes('Quantum Frontiers') || title.includes('Aaronson') || title.includes('MIT OpenCourseWare')).map(([title, description, href]) => <article key={title} className="rounded-xl border border-white/10 bg-black/20 p-5"><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-2 text-[15px] leading-7 text-zinc-200">{description}</p><div className="mt-4"><ResourceLink href={href}>Open resource</ResourceLink></div></article>)}
      </div>
    </section>

    <section className="rounded-2xl border border-[#dfff3f]/15 bg-[#dfff3f]/[.03] p-6 sm:p-8">
      <div className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-[#e9ff8a]" /><div><h2 className="text-xl font-semibold text-white">Recommended QubitLab Learning Path</h2><p className="mt-1 text-sm text-zinc-200">Follow the order in the supplied resource guide.</p></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Phase 1', 'Foundation', 'Quantum Computing for the Quantum Curious'],
          ['Phase 2', 'Programming & computation', 'Introduction to Classical and Quantum Computing'],
          ['Phase 3', 'Quantum circuits', 'IBM Quantum Learning — Basics of Quantum Information'],
          ['Phase 4', 'Algorithms', 'IBM Quantum Learning — Fundamentals of Quantum Algorithms'],
          ['Phase 5', 'AI + Quantum', 'Quantum Computing from Hopfield Nets'],
          ['Phase 6', 'Advanced theory', 'MIT OpenCourseWare + Introduction to Quantum Computation and Information'],
        ].map(([phase, title, resource]) => <div key={phase} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="text-sm uppercase tracking-[.12em] text-zinc-200 font-medium">{phase}</div><div className="mt-2 text-base font-semibold text-white">{title}</div><div className="mt-2 text-[15px] leading-7 text-zinc-200">{resource}</div></div>)}
      </div>
    </section>
  </div>
);
