import { ScheduledRoundMode } from "../_actions/get-round";
import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import {
  DAILY_QUESTION_COUNT,
  MONTHLY_QUESTION_COUNT,
  WEEKLY_QUESTION_COUNT,
} from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";

const READY_COPY: Record<
  ScheduledRoundMode,
  { label: string; tagline: string; count: number }
> = {
  DAILY: {
    label: copy.trivia.dailyLabel,
    tagline: copy.trivia.dailyReadyTagline,
    count: DAILY_QUESTION_COUNT,
  },
  WEEKLY: {
    label: copy.trivia.weeklyLabel,
    tagline: copy.trivia.weeklyReadyTagline,
    count: WEEKLY_QUESTION_COUNT,
  },
  MONTHLY: {
    label: copy.trivia.monthlyLabel,
    tagline: copy.trivia.monthlyReadyTagline,
    count: MONTHLY_QUESTION_COUNT,
  },
};

export function RoundReadyScreen({
  mode,
  onBegin,
}: Readonly<{ mode: ScheduledRoundMode; onBegin: () => void }>) {
  const { label, tagline, count } = READY_COPY[mode];

  return (
    <GlassCard className="text-center">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-4xl font-bold">{label}</h2>
        <p className="text-muted-foreground">
          {tagline.replaceAll("{count}", pluralize(count, "question"))}
        </p>
        <Button onClick={onBegin} size="lg" className="px-10 text-base">
          {copy.trivia.beginButton}
        </Button>
      </CardContent>
    </GlassCard>
  );
}
