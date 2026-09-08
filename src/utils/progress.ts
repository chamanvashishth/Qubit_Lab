import { UserProgress } from '../types/quantum';

export const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: [],
  quizScores: {},
  savedCircuitsCount: 0,
  streakDays: 0,
  xp: 0,
  currentLevel: 'Getting Started',
};

const STORAGE_KEY = 'qubitlab-progress';

const storage = () => typeof window === 'undefined' ? null : window.sessionStorage;

export function loadProgress(): UserProgress {
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    const finiteNumber = (value: unknown, fallback: number) =>
      typeof value === 'number' && Number.isFinite(value) ? value : fallback;

    const quizScores = parsed.quizScores && typeof parsed.quizScores === 'object'
      ? Object.fromEntries(
          Object.entries(parsed.quizScores)
            .filter(([, score]) => typeof score === 'number' && Number.isFinite(score))
            .map(([id, score]) => [id, Math.max(0, Math.min(100, Math.round(score as number)))])
        )
      : {};

    return {
      ...DEFAULT_PROGRESS,
      completedTopics: Array.isArray(parsed.completedTopics)
        ? parsed.completedTopics.filter((id: unknown): id is string => typeof id === 'string')
        : [],
      quizScores,
      savedCircuitsCount: Math.max(0, finiteNumber(parsed.savedCircuitsCount, DEFAULT_PROGRESS.savedCircuitsCount)),
      streakDays: Math.max(0, finiteNumber(parsed.streakDays, DEFAULT_PROGRESS.streakDays)),
      xp: Math.max(0, finiteNumber(parsed.xp, DEFAULT_PROGRESS.xp)),
      currentLevel: typeof parsed.currentLevel === 'string' ? parsed.currentLevel : DEFAULT_PROGRESS.currentLevel,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): UserProgress {
  storage()?.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

const calculateXp = (completedTopics: string[], quizScores: Record<string, number>) =>
  completedTopics.length * 10 +
  Object.values(quizScores).reduce(
    (sum, score) => sum + (Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0),
    0
  );

export function toggleTopic(progress: UserProgress, topicId: string): UserProgress {
  const completedTopics = progress.completedTopics.includes(topicId)
    ? progress.completedTopics.filter((id) => id !== topicId)
    : [...progress.completedTopics, topicId];

  return saveProgress({
    ...progress,
    completedTopics,
    xp: calculateXp(completedTopics, progress.quizScores),
  });
}

export function recordQuizScore(progress: UserProgress, quizId: string, percentage: number): UserProgress {
  const previous = progress.quizScores[quizId] ?? 0;
  const bestScore = Math.max(previous, Math.max(0, Math.min(100, Math.round(percentage))));
  const quizScores = { ...progress.quizScores, [quizId]: bestScore };

  return saveProgress({
    ...progress,
    quizScores,
    xp: calculateXp(progress.completedTopics, quizScores),
    currentLevel: bestScore >= 80 ? 'Core Concepts' : progress.currentLevel,
  });
}