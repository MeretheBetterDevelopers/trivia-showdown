import { clsx } from "clsx";
import { LeaderboardEntry } from "@/src/lib/storage/leaderboard";

// Display order left-to-right: silver, gold, bronze — indexes into `entries`.
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_HEIGHTS = ["h-24", "h-32", "h-20"];
const PODIUM_COLORS = ["bg-chart-4", "bg-primary", "bg-chart-3"];

export default function Podium({
  entries,
}: Readonly<{ entries: LeaderboardEntry[] }>) {
  if (entries.length === 0) return null;

  return (
    <div className="flex w-full max-w-2xl items-end justify-center gap-3">
      {PODIUM_ORDER.map((rankIndex, slot) => {
        const entry = entries[rankIndex];
        if (!entry) return <div key={rankIndex} className="flex-1" />;

        return (
          <div
            key={rankIndex}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className={clsx(
                "flex size-14 items-center justify-center rounded-full text-lg font-bold text-white",
                PODIUM_COLORS[slot],
              )}
            >
              {entry.name.charAt(0).toUpperCase()}
            </div>
            <p className="w-full truncate text-center text-sm font-semibold">
              {entry.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.score} / {entry.total}
            </p>
            <div
              className={clsx(
                "flex w-full items-center justify-center rounded-t-2xl border border-white/30 bg-card/70 font-heading text-2xl font-bold backdrop-blur-xl backdrop-saturate-150 dark:border-white/10",
                PODIUM_HEIGHTS[slot],
              )}
            >
              {rankIndex + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
