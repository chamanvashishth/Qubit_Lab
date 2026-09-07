export interface Complex {
  r: number; // Real part
  i: number; // Imaginary part
}

export interface QubitState {
  theta: number; // Polar angle [0, PI]
  phi: number;   // Azimuth angle [0, 2*PI]
  x: number;     // Bloch vector X
  y: number;     // Bloch vector Y
  z: number;     // Bloch vector Z
  purity: number; // 1 for pure, <1 for mixed/entangled
  p0: number;    // Probability of |0>
  p1: number;    // Probability of |1>
}

export interface BlochState {
  theta: number;
  phi: number;
  purity: number;
  prob0: number;
  prob1: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Submodule {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  content: string;
  completed?: boolean;
  quiz?: QuizQuestion[];
}

export interface CurriculumModule {
  id: string;
  title: string;
  submodules: Submodule[];
}

export type GateType = 
  | 'H' | 'X' | 'Y' | 'Z' 
  | 'S' | 'T' | 'SDAG' | 'TDAG'
  | 'RX' | 'RY' | 'RZ'
  | 'CNOT' | 'CZ' | 'SWAP'
  | 'CCNOT' | 'MEASURE';

export interface GatePlacement {
  id: string;
  gate: GateType;
  targetQubit: number;
  controlQubit?: number; // For CNOT, CZ
  controlQubit2?: number; // For CCNOT (Toffoli)
  secondTarget?: number; // For SWAP
  step: number;
  param?: number; // Angle parameter for RX, RY, RZ
}

export interface CircuitState {
  numQubits: number;
  numSteps: number;
  gates: GatePlacement[];
}

export interface BasisStateProb {
  basis: string;      // e.g. "01", "101"
  amplitude: Complex; // e.g. 0.707 + 0i
  magnitude: number;  // |c|
  probability: number; // |c|^2
  phase: number;      // in radians [-PI, PI]
  phaseDegrees: number;
}

export interface SimulationResult {
  stateVector: BasisStateProb[];
  blochVectors: QubitState[];
  shotsHistogram: Record<string, number>;
  totalShots: number;
  probabilities: Record<string, number>;
  diracNotation: string;
  isEntangled: boolean;
  densityMatrices?: Complex[][][];
}

export interface CurriculumTopic {
  id: string;
  category: 'foundations' | 'concepts' | 'gates' | 'math' | 'visuals' | 'algorithms' | 'sandbox';
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  iconName: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number;
  correctAnswer?: number;
  explanation: string;
  mathNotation?: string;
}

export interface UserProgress {
  completedTopics: string[];
  quizScores: Record<string, number>;
  savedCircuitsCount: number;
  streakDays: number;
  xp: number;
  currentLevel: string;
}
