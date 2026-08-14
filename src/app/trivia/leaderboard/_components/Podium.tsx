import { Crown } from "lucide-react";
import { clsx } from "clsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { LeaderboardEntryWithUser } from "@/src/types/game/LeaderboardEntry";

const PODIUM_ORDER = [1, 0, 2];
const PODIUM_COLORS = ["bg-chart-4", "bg-primary", "bg-chart-3"];
const PODIUM_RINGS = ["ring-chart-4", "ring-primary", "ring-chart-3"];
const PODIUM_AVATAR_SIZES = ["size-20", "size-28", "size-20"];
const PODIUM_DELAYS = ["delay-150", "", "delay-300"];

export default function Podium({
  entries,
}: Readonly<{ entries: LeaderboardEntryWithUser[] }>) {
  if (entries.length === 0) return null;

  return (
    <div className="flex w-full max-w-2xl items-end justify-center gap-8">
      {PODIUM_ORDER.map((rankIndex, slot) => {
        const entry = entries[rankIndex];
        if (!entry) return <div key={rankIndex} className="flex-1" />;

        const isGold = rankIndex === 0;

        return (
          <div
            key={entry.id}
            className={clsx(
              "flex flex-1 animate-in fade-in zoom-in-95 flex-col items-center gap-1 duration-500 fill-mode-backwards",
              PODIUM_DELAYS[slot],
            )}
          >
            {isGold && (
              <Crown className="size-6 fill-primary text-primary" aria-hidden />
            )}
            <span className="text-sm font-bold text-muted-foreground">
              {rankIndex + 1}
            </span>
            <Avatar
              className={clsx(
                "shadow-lg ring-4 ring-offset-2 ring-offset-background",
                PODIUM_RINGS[slot],
                PODIUM_AVATAR_SIZES[slot],
              )}
            >
              <AvatarImage
                src={entry.user.imageUrl ?? "/default-avatar.png"}
                alt={entry.user.name}
              />
              <AvatarFallback
                className={clsx(
                  "font-bold text-white",
                  PODIUM_COLORS[slot],
                  isGold ? "text-3xl" : "text-xl",
                )}
              >
                {entry.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="w-full truncate text-center text-sm font-semibold">
              {entry.user.name}
            </p>
            <p className="text-xs font-medium text-primary">
              {entry.score} / {entry.total}
            </p>
          </div>
        );
      })}
    </div>
  );
}
