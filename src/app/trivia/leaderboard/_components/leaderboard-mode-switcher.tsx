import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export type LeaderboardView = "daily" | "all-time";

export default function LeaderboardModeSwitcher({
  view,
  cameFromResults,
}: Readonly<{ view: LeaderboardView; cameFromResults: boolean }>) {
  const fromSuffix = cameFromResults ? "&from=results" : "";

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* transition-none: these buttons persist across the Link
          navigation (React reconciles them in place rather than
          remounting), so the variant swap - which only actually lands
          once the new page's server round-trip resolves - would
          otherwise play Button's ~150ms color transition. That reads
          as a slow, laggy fade for what should be an instant toggle. */}
      <Button
        render={<Link href={`/trivia/leaderboard?view=daily${fromSuffix}`} />}
        nativeButton={false}
        size="sm"
        variant={view === "daily" ? "default" : "outline"}
        className="transition-none"
      >
        {copy.leaderboard.dailyViewLabel}
      </Button>
      <Button
        render={
          <Link href={`/trivia/leaderboard?view=all-time${fromSuffix}`} />
        }
        nativeButton={false}
        size="sm"
        variant={view === "all-time" ? "default" : "outline"}
        className="transition-none"
      >
        {copy.leaderboard.allTimeViewLabel}
      </Button>
    </div>
  );
}
