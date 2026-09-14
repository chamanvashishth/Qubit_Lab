import { CONCEPT_NODES, DEFAULT_MASTERY, LearnerProfile } from '../data/adaptiveLearning';

export interface AdaptiveState {
  profile: LearnerProfile | null;
  mastery: Record<string, number>;
  misconceptions: string[];
  predictionAccuracy: number;
  predictionCount: number;
  lastConceptId: string | null;
  journalCount: number;
}

const PROFILE_KEY = 'qubitlab-learner-profile';
const ADAPTIVE_KEY = 'qubitlab-adaptive-state';
const storage = () => typeof window === 'undefined' ? null : window.sessionStorage;

const defaultState = (): AdaptiveState => ({ profile: null, mastery: { ...DEFAULT_MASTERY }, misconceptions: [], predictionAccuracy: 0, predictionCount: 0, lastConceptId: null, journalCount: 0 });

export function loadAdaptiveState(): AdaptiveState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = storage()?.getItem(ADAPTIVE_KEY);
    const profileRaw = storage()?.getItem(PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...defaultState(), ...parsed, profile: profileRaw ? JSON.parse(profileRaw) : parsed.profile ?? null, mastery: { ...DEFAULT_MASTERY, ...(parsed.mastery ?? {}) }, predictionCount: Number.isFinite(parsed.predictionCount) ? Math.max(0, Math.round(parsed.predictionCount)) : 0 };
  } catch { return defaultState(); }
}

export function saveAdaptiveState(state: AdaptiveState): AdaptiveState {
  storage()?.setItem(ADAPTIVE_KEY, JSON.stringify(state));
  if (state.profile) storage()?.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  return state;
}

export function saveLearnerProfile(profile: LearnerProfile): AdaptiveState {
  const state = loadAdaptiveState();
  const seededMastery = { ...state.mastery, qubit: profile.math === 'advanced' ? 50 : profile.math === 'comfortable' ? 34 : 18 };
  return saveAdaptiveState({ ...state, profile, mastery: seededMastery });
}

export function updateConceptMastery(state: AdaptiveState, conceptId: string, delta: number): AdaptiveState {
  const current = state.mastery[conceptId] ?? 0;
  const next = Math.max(0, Math.min(100, Math.round(current + delta)));
  return saveAdaptiveState({ ...state, mastery: { ...state.mastery, [conceptId]: next }, lastConceptId: conceptId });
}

export function recordPrediction(state: AdaptiveState, conceptId: string, correct: boolean): AdaptiveState {
  const count = state.predictionCount + 1;
  const accuracy = Math.round(((state.predictionAccuracy * state.predictionCount) + (correct ? 100 : 0)) / count);
  return updateConceptMastery({ ...state, predictionAccuracy: accuracy, predictionCount: count, journalCount: state.journalCount + 1 }, conceptId, correct ? 10 : 4);
}

export function recordResourceCheck(state: AdaptiveState, conceptId: string, understood: boolean): AdaptiveState {
  return updateConceptMastery({ ...state, journalCount: state.journalCount + 1 }, conceptId, understood ? 6 : 2);
}

const GOAL_PRIORITY: Record<LearnerProfile['goal'], string[]> = {
  curiosity: ['qubit', 'superposition', 'measurement'], academics: ['measurement', 'linear-algebra', 'phase'], programming: ['linear-algebra', 'phase', 'grover'], research: ['linear-algebra', 'phase', 'entanglement', 'grover'], career: ['linear-algebra', 'phase', 'grover'], teaching: ['qubit', 'superposition', 'measurement', 'entanglement'],
};

export function getNextConcept(state: AdaptiveState) {
  const available = CONCEPT_NODES.filter((node) => node.prerequisites.every((id) => (state.mastery[id] ?? 0) >= 55));
  const pool = available.length ? available : CONCEPT_NODES.filter((node) => node.prerequisites.length === 0);
  const priority = state.profile ? GOAL_PRIORITY[state.profile.goal] : [];
  return [...pool].sort((a, b) => {
    const gapA = 100 - (state.mastery[a.id] ?? 0), gapB = 100 - (state.mastery[b.id] ?? 0);
    const pA = priority.indexOf(a.id), pB = priority.indexOf(b.id);
    const gA = pA < 0 ? 0 : Math.max(0, 12 - pA * 3), gB = pB < 0 ? 0 : Math.max(0, 12 - pB * 3);
    return (gapB + gB) - (gapA + gA);
  })[0] ?? CONCEPT_NODES[0];
}

const QUIZ_CONCEPTS: Record<string, string[]> = { foundations: ['qubit'], concepts: ['superposition', 'measurement', 'phase', 'entanglement'], gates: ['qubit', 'phase'], math: ['linear-algebra'], algorithms: ['grover', 'phase'] };

export function recordQuizResult(state: AdaptiveState, quizId: string, percentage: number): AdaptiveState {
  const concepts = QUIZ_CONCEPTS[quizId] ?? [];
  if (!concepts.length) return saveAdaptiveState(state);
  const delta = percentage >= 80 ? 14 : percentage >= 60 ? 7 : -4;
  const mastery = { ...state.mastery };
  for (const conceptId of concepts) mastery[conceptId] = Math.max(0, Math.min(100, Math.round((mastery[conceptId] ?? 0) + delta)));
  const misconceptions = percentage < 60 ? Array.from(new Set([...state.misconceptions, ...concepts])) : state.misconceptions.filter((id) => !concepts.includes(id));
  return saveAdaptiveState({ ...state, mastery, misconceptions, lastConceptId: concepts[0] ?? state.lastConceptId });
}

export function getMasteryAverage(state: AdaptiveState) {
  const values = CONCEPT_NODES.map((node) => state.mastery[node.id] ?? 0);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
