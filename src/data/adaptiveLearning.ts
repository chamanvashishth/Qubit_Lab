export type LearnerGoal = 'curiosity' | 'academics' | 'programming' | 'research' | 'career' | 'teaching';
export type SkillLevel = 'beginner' | 'comfortable' | 'advanced';

export interface LearnerProfile {
  goal: LearnerGoal;
  math: SkillLevel;
  programming: SkillLevel;
  physics: SkillLevel;
  createdAt: number;
}

export interface ConceptNode {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  prerequisites: string[];
  objective: string;
  experiment: string;
  resource?: { title: string; type: 'lecture' | 'docs' | 'paper'; duration: string; url?: string };
}

export const CONCEPT_NODES: ConceptNode[] = [
  { id: 'qubit', title: 'Qubit', category: 'Quantum foundations', difficulty: 'Beginner', duration: 8, prerequisites: [], objective: 'Explain what a qubit state represents and distinguish it from a classical bit.', experiment: 'Prepare |0⟩ and |1⟩, then inspect their Bloch-sphere positions.' },
  { id: 'superposition', title: 'Superposition', category: 'Quantum foundations', difficulty: 'Beginner', duration: 10, prerequisites: ['qubit'], objective: 'Relate amplitudes to measurement probabilities without treating superposition as classical uncertainty.', experiment: 'Apply H to |0⟩ and predict the measurement distribution before running it.', resource: { title: 'Visual introduction to superposition', type: 'lecture', duration: '8 min', url: 'https://quantum.cloud.ibm.com/learning/en/courses/use-a-qc-today' } },
  { id: 'measurement', title: 'Measurement', category: 'Quantum foundations', difficulty: 'Beginner', duration: 9, prerequisites: ['qubit', 'superposition'], objective: 'Predict measurement probabilities and describe state collapse at a basic level.', experiment: 'Run repeated shots from a Hadamard state and compare prediction with evidence.' },
  { id: 'phase', title: 'Phase & interference', category: 'Quantum phenomena', difficulty: 'Intermediate', duration: 12, prerequisites: ['superposition', 'measurement'], objective: 'Explain how relative phase changes interference outcomes.', experiment: 'Compare H-H with H-Z-H and predict which amplitudes cancel.', resource: { title: 'Phase and interference walkthrough', type: 'lecture', duration: '12 min', url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information' } },
  { id: 'entanglement', title: 'Entanglement', category: 'Quantum phenomena', difficulty: 'Intermediate', duration: 14, prerequisites: ['superposition', 'measurement'], objective: 'Recognize correlations that cannot be described as independent single-qubit states.', experiment: 'Build a Bell state and inspect its joint measurement distribution.' },
  { id: 'linear-algebra', title: 'Linear algebra for quantum states', category: 'Mathematics', difficulty: 'Intermediate', duration: 18, prerequisites: ['qubit'], objective: 'Use vectors, inner products, and matrices to describe simple quantum operations.', experiment: 'Apply gate matrices to a state vector and compare the result with the visualizer.', resource: { title: 'Linear algebra essentials for quantum computing', type: 'docs', duration: '18 min', url: 'https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information' } },
  { id: 'grover', title: 'Grover search', category: 'Algorithms', difficulty: 'Advanced', duration: 20, prerequisites: ['phase', 'entanglement'], objective: 'Describe amplitude amplification and why interference is central to Grover search.', experiment: 'Build a small search circuit and observe marked-state amplification.' },
];

export const DEFAULT_MASTERY: Record<string, number> = { qubit: 18, superposition: 0, measurement: 0, phase: 0, entanglement: 0, 'linear-algebra': 0, grover: 0 };

export const GOAL_LABELS: Record<LearnerGoal, string> = {
  curiosity: 'Explore out of curiosity', academics: 'Support my academics', programming: 'Learn quantum programming', research: 'Prepare for research', career: 'Build career skills', teaching: 'Teach quantum computing',
};
