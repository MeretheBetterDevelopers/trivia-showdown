import {
  MAX_POINTS,
  MIN_POINTS,
  QUESTION_DURATION_SECONDS,
} from "@/src/lib/constants/game";

const QUESTION_DURATION_MS = QUESTION_DURATION_SECONDS * 1000;

export function calculatePoints(
  elapsedMs: number,
  isCorrect: boolean,
): number {
  if (!isCorrect) return 0;
  const remainingMs = Math.max(0, QUESTION_DURATION_MS - elapsedMs);
  const ratio = remainingMs / QUESTION_DURATION_MS;
  return Math.round(MIN_POINTS + (MAX_POINTS - MIN_POINTS) * ratio);
}
