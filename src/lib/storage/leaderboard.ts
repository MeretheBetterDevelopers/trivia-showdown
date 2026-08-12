import { z } from "zod";

const ENTRIES_KEY = "trivia-leaderboard-entries";
const NAME_KEY = "trivia-leaderboard-player-name";

const leaderboardEntrySchema = z.object({
  name: z.string(),
  score: z.number(),
  total: z.number(),
  playedAt: z.number(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export function getLeaderboardEntries(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];

  let raw: string | null;
  try {
    raw = localStorage.getItem(ENTRIES_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => leaderboardEntrySchema.safeParse(entry))
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((a, b) => b.score / b.total - a.score / a.total);
}

export function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, "playedAt">,
): void {
  if (typeof window === "undefined") return;

  const entries = getLeaderboardEntries();
  entries.push({ ...entry, playedAt: Date.now() });
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function getSavedPlayerName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePlayerName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_KEY, name);
}
