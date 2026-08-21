import {
  CalendarDays,
  CalendarRange,
  PartyPopper,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import { copy } from "@/src/lib/constants/copy";

export type GameMode =
  | "quick"
  | "daily"
  | "weekly"
  | "monthly"
  | "event"
  | "room";

const MODES: {
  mode: GameMode;
  icon: typeof Zap;
  label: string;
  description: string;
  available: boolean;
}[] = [
  {
    mode: "quick",
    icon: Zap,
    label: copy.trivia.quickPlayLabel,
    description: copy.trivia.quickPlayDescription,
    available: true,
  },
  {
    mode: "daily",
    icon: CalendarDays,
    label: copy.trivia.dailyLabel,
    description: copy.trivia.dailyDescription,
    available: true,
  },
  {
    mode: "weekly",
    icon: CalendarRange,
    label: copy.trivia.weeklyLabel,
    description: copy.trivia.weeklyDescription,
    available: false,
  },
  {
    mode: "monthly",
    icon: Trophy,
    label: copy.trivia.monthlyLabel,
    description: copy.trivia.monthlyDescription,
    available: false,
  },
  {
    mode: "event",
    icon: PartyPopper,
    label: copy.trivia.eventLabel,
    description: copy.trivia.eventDescription,
    available: false,
  },
  {
    mode: "room",
    icon: Users,
    label: copy.trivia.gameRoomLabel,
    description: copy.trivia.gameRoomDescription,
    available: false,
  },
];

export function ModeSelectScreen({
  onSelectMode,
}: Readonly<{ onSelectMode: (mode: GameMode) => void }>) {
  return (
    <GlassCard className="text-center">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-4xl font-bold">
            {copy.trivia.modeSelectHeading}
          </h2>
          <p className="text-muted-foreground">
            {copy.trivia.modeSelectTagline}
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {MODES.map(({ mode, icon: Icon, label, description, available }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSelectMode(mode)}
              className="relative flex flex-col items-center gap-2 rounded-2xl border-2 border-white/30 bg-card/75 px-4 py-5 text-center transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] dark:border-white/10"
            >
              {!available && (
                <span className="absolute top-3 right-3 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground uppercase">
                  {copy.trivia.comingSoonBadge}
                </span>
              )}
              <Icon className="size-6 text-primary" />
              <span className="font-heading text-lg font-bold">{label}</span>
              <p className="text-xs text-muted-foreground">{description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </GlassCard>
  );
}
