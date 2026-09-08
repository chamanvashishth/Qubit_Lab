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

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedTopics: Array.isArray(parsed.completedTopics) ? parsed.completedTopics : [],
      quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): UserProgress {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  return progress;
}

export function toggleTopic(progress: UserProgress, topicId: string): UserProgress {
  const completedTopics = progress.completedTopics.includes(topicId)
    ? progress.completedTopics.filter((id) => id !== topicId)
    : [...progress.completedTopics, topicId];

  return saveProgress({
    ...progress,
    completedTopics,
    xp: completedTopics.length * 10 + Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0),
  });
}

export function recordQuizScore(progress: UserProgress, quizId: string, percentage: number): UserProgress {
  const previous = progress.quizScores[quizId] ?? 0;
  const bestScore = Math.max(previous, Math.max(0, Math.min(100, Math.round(percentage))));
  const quizScores = { ...progress.quizScores, [quizId]: bestScore };
  const xp = progress.completedTopics.length * 10 + Object.values(quizScores).reduce((sum, score) => sum + score, 0);

  return saveProgress({
    ...progress,
    quizScores,
    xp,
    currentLevel: bestScore >= 80 ? 'Core Concepts' : progress.currentLevel,
  });
}
