import { CONCEPT_NODES, DEFAULT_MASTERY, LearnerProfile } from '../data/adaptiveLearning';

export interface AdaptiveState {
  profile: LearnerProfile | null;
  mastery: Record<string, number>;
  misconceptions: string[];
  predictionAccuracy: number;
  predictionCount: number;
  lastConceptId: string | null;
  journalCount: number;
  difficultyByTopic: Record<string, number>;
  streakByTopic: Record<string, number>;
  questionOutcomes: Record<string, boolean>;
}

const PROFILE_KEY = 'qubitlab-learner-profile';
const ADAPTIVE_KEY = 'qubitlab-adaptive-state';
const storage = () => typeof window === 'undefined' ? null : window.sessionStorage;

const defaultState = (): AdaptiveState => ({
  profile: null,
  mastery: { ...DEFAULT_MASTERY },
  misconceptions: [],
  predictionAccuracy: 0,
  predictionCount: 0,
  lastConceptId: null,
  journalCount: 0,
  difficultyByTopic: {},
  streakByTopic: {},
  questionOutcomes: {},
});

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function loadAdaptiveState(): AdaptiveState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = storage()?.getItem(ADAPTIVE_KEY);
    const profileRaw = storage()?.getItem(PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const mastery = Object.fromEntries(
      Object.entries({ ...DEFAULT_MASTERY, ...(parsed.mastery ?? {}) }).map(([id, value]) => [
        id,
        typeof value === 'number' && Number.isFinite(value) ? clamp(Math.round(value)) : 0,
      ])
    );
    return {
      ...defaultState(),
      ...parsed,
      profile: profileRaw ? JSON.parse(profileRaw) : parsed.profile ?? null,
      mastery,
      misconceptions: Array.isArray(parsed.misconceptions) ? parsed.misconceptions.filter((id: unknown): id is string => typeof id === 'string') : [],
      predictionAccuracy: typeof parsed.predictionAccuracy === 'number' && Number.isFinite(parsed.predictionAccuracy) ? clamp(Math.round(parsed.predictionAccuracy)) : 0,
      predictionCount: typeof parsed.predictionCount === 'number' && Number.isFinite(parsed.predictionCount) ? Math.max(0, Math.round(parsed.predictionCount)) : 0,
      journalCount: typeof parsed.journalCount === 'number' && Number.isFinite(parsed.journalCount) ? Math.max(0, Math.round(parsed.journalCount)) : 0,
      difficultyByTopic: typeof parsed.difficultyByTopic === 'object' && parsed.difficultyByTopic ? parsed.difficultyByTopic : {},
      streakByTopic: typeof parsed.streakByTopic === 'object' && parsed.streakByTopic ? parsed.streakByTopic : {},
      questionOutcomes: typeof parsed.questionOutcomes === 'object' && parsed.questionOutcomes ? parsed.questionOutcomes : {},
    };
  } catch {
    return defaultState();
  }
}

export function saveAdaptiveState(state: AdaptiveState): AdaptiveState {
  try {
    storage()?.setItem(ADAPTIVE_KEY, JSON.stringify(state));
    if (state.profile) storage()?.setItem(PROFILE_KEY, JSON.stringify(state.profile));
  } catch {
    // Session storage can be unavailable in privacy-restricted browsers.
  }
  return state;
}

const SKILL_SEED: Record<LearnerProfile['math'], number> = { beginner: 12, comfortable: 30, advanced: 48 };

export function saveLearnerProfile(profile: LearnerProfile): AdaptiveState {
  const state = loadAdaptiveState();
  const mastery = { ...state.mastery };
  mastery.qubit = Math.max(mastery.qubit, profile.math === 'advanced' ? 50 : profile.math === 'comfortable' ? 34 : 18);
  mastery['linear-algebra'] = Math.max(mastery['linear-algebra'] ?? 0, SKILL_SEED[profile.math]);
  if (profile.physics === 'advanced') mastery.superposition = Math.max(mastery.superposition, 30);
  else if (profile.physics === 'comfortable') mastery.superposition = Math.max(mastery.superposition, 14);
  if (profile.programming === 'advanced') mastery['linear-algebra'] = Math.max(mastery['linear-algebra'], 40);
  else if (profile.programming === 'comfortable') mastery['linear-algebra'] = Math.max(mastery['linear-algebra'], 24);
  return saveAdaptiveState({ ...state, profile, mastery });
}

export function updateConceptMastery(state: AdaptiveState, conceptId: string, delta: number): AdaptiveState {
  const current = state.mastery[conceptId] ?? 0;
  const next = clamp(Math.round(current + delta));
  return saveAdaptiveState({ ...state, mastery: { ...state.mastery, [conceptId]: next }, lastConceptId: conceptId });
}

export function recordPrediction(state: AdaptiveState, conceptId: string, correct: boolean): AdaptiveState {
  const count = state.predictionCount + 1;
  const accuracy = Math.round(((state.predictionAccuracy * state.predictionCount) + (correct ? 100 : 0)) / count);
  return updateConceptMastery(
    { ...state, predictionAccuracy: accuracy, predictionCount: count, journalCount: state.journalCount + 1 },
    conceptId,
    correct ? 10 : 4
  );
}

export function recordResourceCheck(state: AdaptiveState, conceptId: string, understood: boolean): AdaptiveState {
  return updateConceptMastery(state, conceptId, understood ? 6 : 2);
}

const GOAL_PRIORITY: Record<LearnerProfile['goal'], string[]> = {
  curiosity: ['qubit', 'superposition', 'measurement'],
  academics: ['measurement', 'linear-algebra', 'phase'],
  programming: ['linear-algebra', 'phase', 'grover'],
  research: ['linear-algebra', 'phase', 'entanglement', 'grover'],
  career: ['linear-algebra', 'phase', 'grover'],
  teaching: ['qubit', 'superposition', 'measurement', 'entanglement'],
};

const skillAlignment = (profile: LearnerProfile | null, conceptId: string) => {
  if (!profile) return 0;
  let score = 0;
  if (profile.math !== 'beginner' && conceptId === 'linear-algebra') score += 7;
  if (profile.physics !== 'beginner' && ['superposition', 'measurement', 'phase', 'entanglement'].includes(conceptId)) score += 4;
  if (profile.programming !== 'beginner' && ['linear-algebra', 'phase', 'grover'].includes(conceptId)) score += 4;
  return score;
};

export function getNextConcept(state: AdaptiveState) {
  const available = CONCEPT_NODES.filter((node) => node.prerequisites.every((id) => (state.mastery[id] ?? 0) >= 55));
  const pool = available.length ? available : CONCEPT_NODES.filter((node) => node.prerequisites.length === 0);
  const priority = state.profile ? GOAL_PRIORITY[state.profile.goal] : [];

  return [...pool].sort((a, b) => {
    const score = (node: typeof a) => {
      const mastery = state.mastery[node.id] ?? 0;
      const gap = 100 - mastery;
      const priorityIndex = priority.indexOf(node.id);
      const goalScore = priorityIndex < 0 ? 0 : Math.max(0, 14 - priorityIndex * 3);
      const misconceptionScore = state.misconceptions.includes(node.id) ? 12 : 0;
      const recentPenalty = state.lastConceptId === node.id && pool.length > 1 ? 10 : 0;
      return gap + goalScore + misconceptionScore + skillAlignment(state.profile, node.id) - recentPenalty;
    };
    return score(b) - score(a);
  })[0] ?? CONCEPT_NODES[0];
}

const QUIZ_CONCEPTS: Record<string, string[]> = {
  foundations: ['qubit'],
  concepts: ['superposition', 'measurement', 'phase', 'entanglement'],
  gates: ['qubit', 'phase'],
  math: ['linear-algebra'],
  algorithms: ['grover', 'phase'],
};

export function recordQuizResult(state: AdaptiveState, quizId: string, percentage: number): AdaptiveState {
  const concepts = QUIZ_CONCEPTS[quizId] ?? [];
  if (!concepts.length) return saveAdaptiveState(state);
  const score = clamp(percentage);
  const delta = score >= 80 ? 14 : score >= 60 ? 7 : -4;
  const mastery = { ...state.mastery };
  for (const conceptId of concepts) mastery[conceptId] = clamp(Math.round((mastery[conceptId] ?? 0) + delta));
  const misconceptions = score < 60
    ? Array.from(new Set([...state.misconceptions, ...concepts]))
    : state.misconceptions.filter((id) => !concepts.includes(id));
  return saveAdaptiveState({ ...state, mastery, misconceptions, lastConceptId: concepts[0] ?? state.lastConceptId });
}

export function getMasteryAverage(state: AdaptiveState) {
  const values = CONCEPT_NODES.map((node) => state.mastery[node.id] ?? 0);
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}


export function getTopicDifficulty(state: AdaptiveState, topic: string) {
  const level = state.difficultyByTopic[topic] ?? 1;
  return Math.max(1, Math.min(3, Math.round(level)));
}

export function recordQuizAnswer(state: AdaptiveState, topic: string, questionId: string, correct: boolean): AdaptiveState {
  const currentLevel = getTopicDifficulty(state, topic);
  const previousStreak = state.streakByTopic[topic] ?? 0;
  const nextStreak = correct ? previousStreak + 1 : 0;
  // A miss immediately makes the next question more accessible; two successive correct answers unlock a harder level.
  const nextLevel = correct ? (nextStreak >= 2 ? Math.min(3, currentLevel + 1) : currentLevel) : Math.max(1, currentLevel - 1);
  const difficultyByTopic = { ...state.difficultyByTopic, [topic]: nextLevel };
  const streakByTopic = { ...state.streakByTopic, [topic]: nextStreak };
  const questionOutcomes = { ...state.questionOutcomes, [questionId]: correct };
  return saveAdaptiveState({ ...state, difficultyByTopic, streakByTopic, questionOutcomes });
}
