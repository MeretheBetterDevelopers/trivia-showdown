export const QUESTION_COUNT = 10;
export const DAILY_QUESTION_COUNT = 8;
export const WEEKLY_QUESTION_COUNT = 15;
export const MONTHLY_QUESTION_COUNT = 20;
export const MIN_QUESTION_COUNT = 1;
// OTDB caps a single request at 50 questions.
export const MAX_QUESTION_COUNT = 50;
export const QUESTION_DURATION_SECONDS = 15;
export const LOW_TIME_THRESHOLD_SECONDS = 5;
// Kahoot-style speed scoring: a correct answer is worth MIN_POINTS at the
// last instant before timeout, scaling up to MAX_POINTS for an instant
// answer. Wrong or timed-out answers are always worth 0.
export const MIN_POINTS = 500;
export const MAX_POINTS = 1000;
// OTDB allows roughly one request per 5 seconds per IP.
export const OTDB_RATE_LIMIT_DELAY_MS = 5500;
