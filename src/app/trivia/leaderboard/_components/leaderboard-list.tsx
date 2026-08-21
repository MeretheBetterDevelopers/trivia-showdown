import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { copy } from "@/src/lib/constants/copy";
import { LeaderboardEntryWithUser } from "@/src/types/game/leaderboard-entry";

export default function LeaderboardList({
  entries,
  startRank,
}: Readonly<{ entries: LeaderboardEntryWithUser[]; startRank: number }>) {
  if (entries.length === 0) return null;

  return (
    <ul className="flex w-full max-w-2xl flex-col gap-2">
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className="flex items-center gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
        >
          <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground">
            {index + startRank}
          </span>
          <Avatar className="size-8">
            <AvatarImage
              src={entry.user.imageUrl ?? "/default-avatar.png"}
              alt={entry.user.name}
            />
            <AvatarFallback>
              {entry.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate font-medium">{entry.user.name}</span>
          <span className="text-sm text-muted-foreground">
            {entry.score.toLocaleString()} {copy.results.pointsLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}
