export interface SkillProgress {
  skillId: string;
  totalSolved: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  mastered: boolean;
  bestTimeSeconds?: number;
  lastPracticedAt?: string;
}

export type ProgressMap = Record<string, SkillProgress>;

const STORAGE_KEY = "kumon_math_progress_v1";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function recordAttempt(
  map: ProgressMap,
  skillId: string,
  isCorrect: boolean,
  masteryStreakTarget: number = 10
): ProgressMap {
  const existing: SkillProgress = map[skillId] || {
    skillId,
    totalSolved: 0,
    totalAttempted: 0,
    currentStreak: 0,
    bestStreak: 0,
    mastered: false,
  };

  const nextSolved = existing.totalSolved + (isCorrect ? 1 : 0);
  const nextAttempted = existing.totalAttempted + 1;
  const nextStreak = isCorrect ? existing.currentStreak + 1 : 0;
  const nextBestStreak = Math.max(existing.bestStreak, nextStreak);
  const isNowMastered =
    existing.mastered ||
    nextBestStreak >= masteryStreakTarget ||
    (nextSolved >= 15 && nextSolved / nextAttempted >= 0.85);

  const updated: ProgressMap = {
    ...map,
    [skillId]: {
      ...existing,
      totalSolved: nextSolved,
      totalAttempted: nextAttempted,
      currentStreak: nextStreak,
      bestStreak: nextBestStreak,
      mastered: isNowMastered,
      lastPracticedAt: new Date().toISOString(),
    },
  };

  saveProgress(updated);
  return updated;
}

