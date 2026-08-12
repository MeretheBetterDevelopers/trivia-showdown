import { LeaderboardEntry } from "@/src/lib/storage/leaderboard";

export default function LeaderboardList({
  entries,
  startRank,
}: Readonly<{ entries: LeaderboardEntry[]; startRank: number }>) {
  if (entries.length === 0) return null;

  return (
    <ul className="flex w-full max-w-2xl flex-col gap-2">
      {entries.map((entry, index) => (
        <li
          key={`${entry.name}-${entry.playedAt}`}
          className="flex items-center gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
        >
          <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground">
            {index + startRank}
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-chart-2 text-sm font-bold text-white">
            {entry.name.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 truncate font-medium">{entry.name}</span>
          <span className="text-sm text-muted-foreground">
            {entry.score} / {entry.total}
          </span>
        </li>
      ))}
    </ul>
  );
}
