import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";

export function DailyReadyScreen({
  onBegin,
}: Readonly<{ onBegin: () => void }>) {
  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 text-center shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-4xl font-bold">
          {copy.trivia.dailyLabel}
        </h2>
        <p className="text-muted-foreground">
          {copy.trivia.dailyReadyTagline.replaceAll(
            "{count}",
            pluralize(DAILY_QUESTION_COUNT, "question"),
          )}
        </p>
        <Button onClick={onBegin} size="lg" className="px-10 text-base">
          {copy.trivia.beginButton}
        </Button>
      </CardContent>
    </Card>
  );
}
